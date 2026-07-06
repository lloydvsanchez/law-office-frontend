import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Contact } from './pages/Contact'
import { ForLawyers } from './pages/ForLawyers'
import { LegalGuides } from './pages/LegalGuides'
import { TemplateSearch } from './pages/TemplateSearch'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/for-lawyers" element={<ForLawyers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal-guides" element={<LegalGuides />} />
          <Route path="/template-search" element={<TemplateSearch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
