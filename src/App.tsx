import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Order } from './pages/Order';
import { Recipes } from './pages/Recipes';
import { Merch } from './pages/Merch';
import { Success } from './pages/Success';

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <Header />
      <main key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
