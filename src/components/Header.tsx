import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Copy, Trash2, Send, Menu } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { useOrderStore } from '../lib/state';
import { makeCombinedPlainTextSummary, makeMailtoLink } from '../lib/summary';
import { classNames } from '../lib/utils';
import { submitOrderBatch } from '../lib/api';
import type { RequestItem } from '../lib/validation';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const requestList = useOrderStore((state: any) => state.requestList);
  const removeRequestItem = useOrderStore((state: any) => state.removeRequestItem);
  const clearRequestList = useOrderStore((state: any) => state.clearRequestList);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/order', label: 'Order' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/merch', label: 'Merch' },
  ];
  
  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);
  
  const handleCopySummary = () => {
    const summary = makeCombinedPlainTextSummary(requestList);
    navigator.clipboard.writeText(summary);
    setToastMessage('Summary copied to clipboard!');
    setShowToast(true);
  };
  
  const handleSendEmail = () => {
    if (requestList.length === 0) return;
    
    const mailtoLink = makeMailtoLink(requestList);
    window.location.href = mailtoLink;
  };
  
  const handleSubmitOrder = async () => {
    if (requestList.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Add empty honeypot field to each order (for API spam protection)
      const ordersWithHoneypot = requestList.map((order: RequestItem) => ({
        ...order,
        website: '' // Honeypot field - should always be empty for legitimate users
      }));
      
      const result = await submitOrderBatch(ordersWithHoneypot);
      
      if (result.success) {
        // Clear the request list
        clearRequestList();
        // Close the modal
        setIsModalOpen(false);
        // Navigate to success page
        navigate('/success');
      } else {
        // Show error message
        setToastMessage(result.message || 'Failed to submit order. Please try again.');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setToastMessage('An error occurred. Please try again or contact us directly.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from your request?')) {
      clearRequestList();
      setIsModalOpen(false);
      setToastMessage('Request cleared');
      setShowToast(true);
    }
  };
  
  return (
    <>
      {/* Spacer to prevent content from going under the navbar */}
      <div className="h-20 md:h-20" aria-hidden="true"></div>
      
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-gradient-to-b from-[#fde7ee]/95 via-[#fde7ee]/80 to-transparent pb-6 pt-4">
        <div className="flex items-center justify-center gap-3 md:gap-4">
            
            {/* Mobile: Hamburger (Left) */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-[#ffd1dc] rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-[#ff8ba7] focus:ring-offset-2 touch-target active:scale-95"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 text-[#000000]" strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Desktop: All Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={classNames(
                      'relative text-sm lg:text-base font-bold uppercase tracking-wide transition-smooth hover:text-[#000000] py-1 px-4 lg:px-6',
                      'after:content-[""] after:absolute after:bottom-0 after:left-4 lg:after:left-6 after:right-4 lg:after:right-6 after:h-0.5 after:bg-[#ff6b9d] after:transition-transform after:duration-300 after:ease-out',
                      isActive 
                        ? 'text-[#000000] after:scale-x-100' 
                        : 'text-[#525252] after:scale-x-0 hover:after:scale-x-100'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Cart Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative p-2 hover:bg-[#ffd1dc] rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-[#ff8ba7] active:scale-95"
                aria-label={`View request (${requestList.length} items)`}
              >
                <ShoppingBag className="w-5 h-5 text-[#000000]" strokeWidth={2.5} />
                {requestList.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ff6b9d] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white/70">
                    {requestList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: Cart (Right) */}
            <div className="flex md:hidden ml-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative p-2 hover:bg-[#ffd1dc] rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-[#ff8ba7] active:scale-95"
                aria-label={`View request (${requestList.length} items)`}
              >
                <ShoppingBag className="w-6 h-6 text-[#000000]" strokeWidth={2.5} />
                {requestList.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#ff6b9d] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white/70">
                    {requestList.length}
                  </span>
                )}
              </button>
            </div>

        </div>
      </header>
      
      {/* Mobile Sidebar Navigation */}
      <div className="md:hidden">
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Sidebar */}
        <aside
          className={classNames(
            'fixed top-0 left-0 h-full w-64 bg-[#fff5f7] border-r border-[#ffc1d4] z-50 transform transition-transform duration-300 ease-in-out',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          aria-label="Mobile navigation"
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#ffc1d4]">
            <h2 className="text-lg font-bold text-[#000000] uppercase tracking-wide">
              Menu
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-[#ffd1dc] rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-[#ff8ba7] touch-target"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 text-[#000000]" strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Sidebar Navigation Links */}
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={classNames(
                    'block text-base font-bold uppercase tracking-wide transition-smooth px-4 py-3 rounded-lg touch-target',
                    isActive 
                      ? 'text-[#000000] bg-[#ffd1dc]' 
                      : 'text-[#525252] hover:bg-[#ffd1dc]/50 hover:text-[#000000]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
      
      {/* Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Your Request"
        size="lg"
      >
        {requestList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-black mb-3">
              Your request is empty
            </h3>
            <p className="text-base text-black mb-8 max-w-md text-center leading-relaxed">
              Add items using the Order Wizard to build your request.
            </p>
            <Link 
              to="/order" 
              onClick={() => setIsModalOpen(false)}
              className="inline-block"
            >
              <Button variant="primary" size="lg" className="active:scale-100 hover:scale-105 transition-transform">
                Start an Order
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requestList.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-bakery-cream rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-base text-black">
                    Item {index + 1}
                  </h4>
                  <button
                    onClick={() => removeRequestItem(index)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-smooth focus:outline-none focus:ring-2 focus:ring-bakery-pink-400 active:scale-95"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-black font-sans leading-relaxed">
                  {makeCombinedPlainTextSummary([item])}
                </pre>
              </div>
            ))}
            
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 mt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 font-semibold"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
                {isSubmitting ? 'Submitting...' : 'Submit Order Request'}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopySummary}
                  className="flex-1 justify-center gap-2 font-medium"
                  disabled={isSubmitting}
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSendEmail}
                  className="flex-1 justify-center gap-2 font-medium"
                  disabled={isSubmitting}
                >
                  Email
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex-1 justify-center gap-2 text-red-600 hover:bg-red-50 font-medium"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

