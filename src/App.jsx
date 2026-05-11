import { HashRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';

import HomePage from './pages/home-page/home-page';
import AgendaPage from './pages/agenda-page/agenda-page';
import EdicoesPage from './pages/edicoes-page/edicoes-page';
import SobreNosPage from './pages/sobre-nos-page/sobre-nos-page';
import ContactosPage from './pages/contactos-page/contactos-page';

function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/edicoes" element={<EdicoesPage />} />
        <Route path="/sobre-nos" element={<SobreNosPage />} />
        <Route path="/contactos" element={<ContactosPage />} />
      </Routes>

      <Footer />
    </HashRouter>
  );
}

export default App;