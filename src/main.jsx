import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/sora/wght.css';
import '@fontsource-variable/lora/wght-italic.css';
import { Header, Footer, RouteChange } from './components.jsx';
import { About, FaqPage, Home, NotFound, ServiceDetail, ServicesPage } from './pages.jsx';
import { Contact } from './Contact.jsx';
import './styles.css';

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <RouteChange />
      <Header key={pathname} />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter><App /></BrowserRouter>
  </StrictMode>,
);
