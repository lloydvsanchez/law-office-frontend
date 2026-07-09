// src/hooks/useTemplateSearch.ts
// Encapsulates all API calls and polling logic for the template search feature.
// The page component stays declarative — it only reads state and calls search().
//
// API base URL: update BASE_URL for production.
// Polling: uses poll_interval_seconds from the generation status response.
//          Falls back to POLL_INTERVAL_FALLBACK_MS if not provided.

import { useState, useRef, useCallback } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
const POLL_INTERVAL_FALLBACK_MS = 5000;
const MAX_POLL_ATTEMPTS = 60; // safety ceiling: 60 × 5s = 5 minutes max

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SearchResult {
  template_id: string;
  title: string;
  description: string;
  practice_area: string | null;
  similarity: number;
  match_type: string;
}

export interface GeneratedTemplate {
  [key: string]: unknown;
}

// Shape returned by GET /api/v1/templates/:id
export interface TemplateDetail {
  id: number;
  title: string;
  description: string;
  practice_area: string | null;
  content_raw: string;
  metadata: Record<string, unknown>;
}

export type PageState =
  | { stage: "idle" }
  | { stage: "searching" }
  | { stage: "polling"; generationId: string; attempt: number }
  | { stage: "results"; results: SearchResult[]; query: string }
  | { stage: "loading_template"; results: SearchResult[]; query: string }
  | { stage: "viewing_template"; template: TemplateDetail; results: SearchResult[]; query: string }
  | { stage: "generated"; template: GeneratedTemplate; query: string }
  | { stage: "error"; message: string; retriable: boolean };

// ── API response shapes ───────────────────────────────────────────────────────
interface SearchResponseData {
  results: SearchResult[];
  generated: boolean;
  generation_id: string | null;
  service_unavailable: boolean;
}

interface SearchResponse {
  data: SearchResponseData;
  meta: { count: number; limit: number };
  errors: string[];
}

interface GenerationStatusData {
  generation_id: string;
  status: "pending" | "success" | "completed" | "failed";
  trigger_type: string;
  poll_interval_seconds: number;
  template: GeneratedTemplate | null;
}

interface GenerationStatusResponse {
  data: GenerationStatusData;
  meta: { created_at: string; completed_at: string | null };
  errors: string[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTemplateSearch() {
  const [state, setState] = useState<PageState>({ stage: "idle" });
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollAttemptsRef = useRef(0);

  // Cache: template_id → TemplateDetail
  // Persists for the lifetime of the hook instance (i.e. while on the page).
  // Avoids repeat fetches when user navigates back to results and re-opens same card.
  const templateCacheRef = useRef<Map<string, TemplateDetail>>(new Map());

  // Stop any in-flight polling
  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    pollAttemptsRef.current = 0;
  }, []);

  // Poll generation status recursively
  const pollGenerationStatus = useCallback(
    async (generationId: string, intervalMs: number) => {
      pollAttemptsRef.current += 1;

      if (pollAttemptsRef.current > MAX_POLL_ATTEMPTS) {
        stopPolling();
        setState({
          stage: "error",
          message: "Generation is taking too long. Please try again.",
          retriable: true,
        });
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/generations/${generationId}/status`);

        if (!res.ok) throw new Error(`Status check failed (${res.status})`);

        const json: GenerationStatusResponse = await res.json();
        const { status, template, poll_interval_seconds } = json.data;

        const nextInterval =
          poll_interval_seconds > 0 ? poll_interval_seconds * 1000 : intervalMs;

        setState((prev) =>
          prev.stage === "polling" ? { ...prev, attempt: pollAttemptsRef.current } : prev
        );

        if (status === "success" || status === "completed") {
          stopPolling();
          setState((prev) => ({
            stage: "generated",
            template: template ?? {},
            query: prev.stage === "polling" ? "" : "",
          }));
          return;
        }

        if (status === "failed") {
          stopPolling();
          setState({
            stage: "error",
            message: "Template generation failed. Please try a different query.",
            retriable: true,
          });
          return;
        }

        pollTimerRef.current = setTimeout(
          () => pollGenerationStatus(generationId, nextInterval),
          nextInterval
        );
      } catch (err) {
        stopPolling();
        setState({
          stage: "error",
          message:
            err instanceof Error ? err.message : "Failed to check generation status.",
          retriable: true,
        });
      }
    },
    [stopPolling]
  );

  // Main search
  const search = useCallback(
    async (query: string) => {
      stopPolling();
      setState({ stage: "searching" });

      try {
        const res = await fetch(`${BASE_URL}/templates/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: { query } }),
        });

        if (!res.ok) throw new Error(`Search request failed (${res.status})`);

        const json: SearchResponse = await res.json();
        const { generated, generation_id, results, service_unavailable } = json.data;

        if (service_unavailable) {
          setState({
            stage: "error",
            message: "The template service is temporarily unavailable. Please try again later.",
            retriable: false,
          });
          return;
        }

        if (generated && generation_id) {
          pollAttemptsRef.current = 0;
          setState({ stage: "polling", generationId: generation_id, attempt: 0 });
          await pollGenerationStatus(generation_id, POLL_INTERVAL_FALLBACK_MS);
          return;
        }

        setState({ stage: "results", results, query });
      } catch (err) {
        setState({
          stage: "error",
          message:
            err instanceof Error ? err.message : "Something went wrong. Please try again.",
          retriable: true,
        });
      }
    },
    [stopPolling, pollGenerationStatus]
  );

  // Fetch a single template by ID — uses cache to avoid repeat calls
  const selectTemplate = useCallback(async (templateId: string) => {
    // Must be called from results or loading_template stage
    setState((prev) => {
      if (prev.stage !== "results" && prev.stage !== "loading_template") return prev;
      return {
        stage: "loading_template",
        results: prev.results,
        query: prev.query,
      };
    });

    // Check cache first
    const cached = templateCacheRef.current.get(templateId);
    if (cached) {
      setState((prev) => {
        if (prev.stage !== "loading_template") return prev;
        return {
          stage: "viewing_template",
          template: cached,
          results: prev.results,
          query: prev.query,
        };
      });
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/templates/${templateId}`);

      if (!res.ok) throw new Error(`Failed to load template (${res.status})`);

      const template: TemplateDetail = await res.json();

      // Store in cache
      templateCacheRef.current.set(templateId, template);

      setState((prev) => {
        if (prev.stage !== "loading_template") return prev;
        return {
          stage: "viewing_template",
          template,
          results: prev.results,
          query: prev.query,
        };
      });
    } catch (err) {
      setState((prev) => {
        if (prev.stage !== "loading_template") return prev;
        // On error, return to results — don't lose the list
        return {
          stage: "results",
          results: prev.results,
          query: prev.query,
        };
      });
      // Surface error without replacing the results list
      console.error("Template fetch error:", err);
    }
  }, []);

  // Back from viewing_template → restore results from state (no API call)
  const backToResults = useCallback(() => {
    setState((prev) => {
      if (prev.stage !== "viewing_template") return prev;
      return {
        stage: "results",
        results: prev.results,
        query: prev.query,
      };
    });
  }, []);

  const reset = useCallback(() => {
    stopPolling();
    setState({ stage: "idle" });
  }, [stopPolling]);

  return { state, search, selectTemplate, backToResults, reset };
}
