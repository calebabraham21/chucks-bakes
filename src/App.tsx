import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/ui/Toast';
import { Home } from './pages/Home';
import { Order } from './pages/Order';
import { Gallery } from './pages/Gallery';
import { Recipes } from './pages/Recipes';
import { RecipePost } from './pages/RecipePost';
import { Success } from './pages/Success';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { OrderPolicies } from './pages/OrderPolicies';
import { ComingSoon } from './pages/ComingSoon';
import { useOrderStore } from './lib/state';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Toggle this to show/hide the coming soon page
// Set to false when you're ready to launch the full site!
const COMING_SOON_MODE = false;

function AppContent() {
  const location = useLocation();
  
  // Global toast state
  const toast = useOrderStore((state: any) => state.toast);
  const hideToast = useOrderStore((state: any) => state.hideToast);

  // If in coming soon mode, show only that page
  if (COMING_SOON_MODE) {
    return <ComingSoon />;
  }

  // Normal site
  return (
    <div className="min-h-screen bg-[#fde7ee] flex flex-col">
      <ScrollToTop />
      <Header />
      <main key={location.pathname} className="page-transition flex-1">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/policies" element={<OrderPolicies />} />
          <Route path="/recipes/:slug" element={<RecipePost />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Global Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
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
