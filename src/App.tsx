import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Order } from './pages/Order';
import { Recipes } from './pages/Recipes';
import { RecipePost } from './pages/RecipePost';
import { Merch } from './pages/Merch';
import { Success } from './pages/Success';
import { ComingSoon } from './pages/ComingSoon';

// 🚧 Toggle this to show/hide the coming soon page
// Set to false when you're ready to launch the full site!
const COMING_SOON_MODE = true;

function AppContent() {
  const location = useLocation();

  // If in coming soon mode, show only that page
  if (COMING_SOON_MODE) {
    return <ComingSoon />;
  }

  // Normal site
  return (
    <div className="min-h-screen bg-[#fde7ee]">
      <Header />
      <main key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:slug" element={<RecipePost />} />
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
