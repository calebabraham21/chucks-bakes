import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/ui/Toast';
import { Home } from './pages/Home';
import { useOrderStore } from './lib/state';

const pageLoaders = {
  order: () => import('./pages/Order'),
  gallery: () => import('./pages/Gallery'),
  recipes: () => import('./pages/Recipes'),
  recipePost: () => import('./pages/RecipePost'),
  success: () => import('./pages/Success'),
  privacy: () => import('./pages/PrivacyPolicy'),
  policies: () => import('./pages/OrderPolicies'),
};

const Order = lazy(pageLoaders.order);
const Gallery = lazy(pageLoaders.gallery);
const Recipes = lazy(pageLoaders.recipes);
const RecipePost = lazy(pageLoaders.recipePost);
const Success = lazy(pageLoaders.success);
const PrivacyPolicy = lazy(pageLoaders.privacy);
const OrderPolicies = lazy(pageLoaders.policies);
const ComingSoon = lazy(() => import('./pages/ComingSoon').then((m) => ({ default: m.ComingSoon })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Route chunks are split out of the initial bundle, then fetched once the browser is idle so navigation stays instant
function usePrefetchPages() {
  useEffect(() => {
    const prefetch = () => Object.values(pageLoaders).forEach((load) => load());
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(prefetch, 2000);
    return () => clearTimeout(timer);
  }, []);
}

// Toggle this to show/hide the coming soon page
// Set to false when you're ready to launch the full site!
const COMING_SOON_MODE = false;

function AppContent() {
  const location = useLocation();
  usePrefetchPages();

  // Global toast state
  const toast = useOrderStore((state) => state.toast);
  const hideToast = useOrderStore((state) => state.hideToast);

  // If in coming soon mode, show only that page
  if (COMING_SOON_MODE) {
    return (
      <Suspense fallback={null}>
        <ComingSoon />
      </Suspense>
    );
  }

  // Normal site
  return (
    <div className="min-h-screen bg-[#fde7ee] flex flex-col">
      <ScrollToTop />
      <Header />
      <main key={location.pathname} className="page-transition flex-1">
        <Suspense fallback={null}>
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
        </Suspense>
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
