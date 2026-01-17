import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, Send, Menu, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { ContactForm } from './order/ContactForm';
import { useOrderStore } from '../lib/state';
import { makeItemSummary } from '../lib/summary';
import { ITEM_LABELS, ITEMS } from '../lib/constants';
import { classNames } from '../lib/utils';
import { submitOrderBatch, sendConfirmationEmail, prepareOrdersForSubmission } from '../lib/api';
import type { CartItem, ContactInfo } from '../lib/validation';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState('');
  const [localToastType, setLocalToastType] = useState<'success' | 'error'>('success');
  const [localShowToast, setLocalShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Checkout flow: 1 = cart, 2 = contact form, 3 = review
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutContact, setCheckoutContact] = useState<ContactInfo | null>(null);
  
  const cart = useOrderStore((state: any) => state.cart);
  const removeFromCart = useOrderStore((state: any) => state.removeFromCart);
  const clearCart = useOrderStore((state: any) => state.clearCart);
  const setLastOrderId = useOrderStore((state: any) => state.setLastOrderId);
  
  // Global cart modal state
  const isCartOpen = useOrderStore((state: any) => state.isCartOpen);
  const openCart = useOrderStore((state: any) => state.openCart);
  const closeCart = useOrderStore((state: any) => state.closeCart);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/order', label: 'Order' },
    { path: '/recipes', label: 'Recipes' },
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
  
  // Reset checkout when modal closes
  const handleCloseModal = () => {
    closeCart();
    // Reset checkout state after modal animation
    setTimeout(() => {
      setCheckoutStep(1);
      setCheckoutContact(null);
    }, 300);
  };
  
  const handleProceedToContact = () => {
    setCheckoutStep(2);
  };
  
  const handleContactSubmit = (contact: ContactInfo) => {
    setCheckoutContact(contact);
    setCheckoutStep(3);
  };
  
  const handleBackToCart = () => {
    setCheckoutStep(1);
  };
  
  const handleBackToContact = () => {
    setCheckoutStep(2);
  };
  
  const handleSubmitOrder = async () => {
    if (cart.length === 0 || !checkoutContact) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine cart items with contact info
      const orders = prepareOrdersForSubmission(cart, checkoutContact);
      
      // Add empty honeypot field to each order (for API spam protection)
      const ordersWithHoneypot = orders.map((order) => ({
        ...order,
        website: '' // Honeypot field - should always be empty for legitimate users
      }));
      
      const result = await submitOrderBatch(ordersWithHoneypot);
      
      if (result.success) {
        // Save the order ID for the success page
        if (result.orderId) {
          setLastOrderId(result.orderId);
        }
        
        // Send confirmation email (don't block success flow if this fails)
        if (result.orderIds && result.orderIds.length > 0) {
          sendConfirmationEmail(orders, result.orderIds)
            .then((emailResult) => {
              if (!emailResult.success) {
                console.warn('Confirmation email failed to send:', emailResult.message);
              }
            })
            .catch((emailError) => {
              console.error('Error in confirmation email:', emailError);
            });
        }
        
        // Clear cart and reset checkout
        clearCart();
        setCheckoutStep(1);
        setCheckoutContact(null);
        closeCart();
        
        // Navigate to success page
        navigate('/success');
      } else {
        // Handle specific error cases
        if (result.errorCode === 'ORDER_LIMIT_REACHED') {
          setLocalToastMessage(`You already have an order pending! Please wait for it to be completed before placing a new one.`);
        } else {
          setLocalToastMessage(result.message || 'Failed to submit order. Please try again.');
        }
        setLocalToastType('error');
        setLocalShowToast(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setLocalToastMessage('An error occurred. Please try again or contact us directly.');
      setLocalToastType('error');
      setLocalShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClearAll = () => {
    setShowClearConfirm(true);
  };
  
  const confirmClearCart = () => {
    clearCart();
    setCheckoutStep(1);
    setCheckoutContact(null);
    closeCart();
    setShowClearConfirm(false);
    setLocalToastMessage('Cart cleared');
    setLocalToastType('success');
    setLocalShowToast(true);
  };
  
  // Get modal title based on checkout step
  const getModalTitle = () => {
    switch (checkoutStep) {
      case 1: return 'Your Cart';
      case 2: return 'Contact Information';
      case 3: return 'Review Order';
      default: return 'Your Cart';
    }
  };
  
  return (
    <>
      {/* Spacer to prevent content from going under the navbar */}
      <div className="h-20 md:h-20" aria-hidden="true"></div>
      
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-gradient-to-b from-[#fde7ee]/95 via-[#fde7ee]/80 to-transparent pb-6 pt-4 px-4">
        <div className="flex items-center justify-between md:justify-center gap-3 md:gap-4">
            
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
                onClick={openCart}
                className="relative p-2 hover:bg-[#ffd1dc] rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-[#ff8ba7] active:scale-95"
                aria-label={`View cart (${cart.length} items)`}
              >
                <ShoppingBag className="w-5 h-5 text-[#000000]" strokeWidth={2.5} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ff6b9d] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white/70">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: Cart (Right) */}
            <div className="flex md:hidden">
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-[#ffd1dc] rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-[#ff8ba7] active:scale-95"
                aria-label={`View cart (${cart.length} items)`}
              >
                <ShoppingBag className="w-6 h-6 text-[#000000]" strokeWidth={2.5} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#ff6b9d] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white/70">
                    {cart.length}
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
            'fixed top-0 left-0 h-full w-64 bg-[#fff5f7] border-r border-[#ffc1d4] z-50 transform transition-transform duration-150',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
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
      
      {/* Cart/Checkout Modal */}
      <Modal
        isOpen={isCartOpen}
        onClose={handleCloseModal}
        title={getModalTitle()}
        size="lg"
      >
        {/* Step 1: Cart View */}
        {checkoutStep === 1 && (
          <>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-black mb-3">
                  Your cart is empty
                </h3>
                <p className="text-base text-black mb-8 max-w-md text-center leading-relaxed">
                  Add items using the Order page to build your order.
                </p>
                <Link 
                  to="/order" 
                  onClick={handleCloseModal}
                  className="inline-block"
                >
                  <Button variant="primary" size="lg" className="active:scale-100 hover:scale-105 transition-transform">
                    Start an Order
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item: CartItem, index: number) => (
                  <div
                    key={index}
                    className="p-5 bg-bakery-cream rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-base text-black">
                        Item {index + 1}
                      </h4>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-smooth focus:outline-none focus:ring-2 focus:ring-bakery-pink-400 active:scale-95"
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-black font-sans leading-relaxed">
                      {makeItemSummary(item)}
                    </pre>
                  </div>
                ))}
                
                <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 mt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleProceedToContact}
                    className="w-full flex items-center justify-center gap-2 font-semibold"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Link to="/order" onClick={handleCloseModal} className="flex-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        className="justify-center gap-2 font-medium"
                      >
                        Add More Items
                      </Button>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="flex-1 justify-center gap-2 text-red-600 hover:bg-red-50 font-medium"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Step 2: Contact Form */}
        {checkoutStep === 2 && (
          <div className="space-y-4">
            <ContactForm
              defaultValues={checkoutContact || undefined}
              onSubmit={handleContactSubmit}
            />
            
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleBackToCart}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                Back
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  // Trigger form submission
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="flex items-center justify-center gap-2"
              >
                Continue to Review
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Review & Submit */}
        {checkoutStep === 3 && checkoutContact && (
          <div className="space-y-4">
            {/* Order Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Order Items ({cart.length})
              </h3>
              <div className="space-y-2">
                {cart.map((item: CartItem, index: number) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black">
                        {ITEM_LABELS[item.itemType as keyof typeof ITEM_LABELS]}
                      </span>
                      <span className="text-xs bg-[#ffd1dc] text-[#333] px-2 py-0.5 rounded-full font-medium">
                        Item {index + 1}
                      </span>
                    </div>
                    {'order' in item && (
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.order.quantity}</p>
                    )}
                    {item.itemType === ITEMS.CAKE && 'config' in item && (
                      <p className="text-sm text-gray-600 mt-1">{item.config.size} • {item.config.flavor}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Delivery Details
              </h3>
              <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-1.5">
                <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="text-black font-medium">{checkoutContact.name}</span></p>
                <p className="text-sm"><span className="text-gray-500">Email:</span> <span className="text-black font-medium">{checkoutContact.email}</span></p>
                {checkoutContact.phone && (
                  <p className="text-sm"><span className="text-gray-500">Phone:</span> <span className="text-black font-medium">{checkoutContact.phone}</span></p>
                )}
                <p className="text-sm"><span className="text-gray-500">Pickup:</span> <span className="text-black font-medium">{checkoutContact.deliveryMethod === 'pickup' ? 'Arlington, VA' : 'Delivery'}</span></p>
                <p className="text-sm"><span className="text-gray-500">Date:</span> <span className="text-black font-medium">{checkoutContact.targetDate}</span></p>
                {checkoutContact.notes && (
                  <p className="text-sm"><span className="text-gray-500">Notes:</span> <span className="text-black font-medium">{checkoutContact.notes}</span></p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 font-semibold"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleBackToContact}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                Edit Contact Info
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      <Toast
        message={localToastMessage}
        type={localToastType}
        isVisible={localShowToast}
        onClose={() => setLocalShowToast(false)}
      />
      
      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm modal-backdrop"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-soft-lg modal-content p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-black text-center mb-2">
              Clear Cart?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              This will remove all items from your cart. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={confirmClearCart}
                className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

