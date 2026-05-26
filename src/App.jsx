import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import About from './pages/About';
import Privacy from './pages/Privacy';
import { AppProvider } from './context/AppContext';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Background Particles layer */}
        <div className="particles-bg"></div>
        
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navigation />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
