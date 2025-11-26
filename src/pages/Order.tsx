import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Stepper } from '../components/ui/Stepper';
import { ChooseItem } from '../components/order/ChooseItem';
import { ConfigureCake } from '../components/order/ConfigureCake';
import { ConfigureCupcakes } from '../components/order/ConfigureCupcakes';
import { ConfigureTreats } from '../components/order/ConfigureTreats';
import { ContactForm } from '../components/order/ContactForm';
import { ReviewAndSend } from '../components/order/ReviewAndSend';
import { useOrderStore } from '../lib/state';
import { useOrderPage } from '../lib/useOrderPage';
import { ITEMS, TREAT_UNITS } from '../lib/constants';
import type { ItemType } from '../lib/constants';
import type { CakeConfig, CupcakeConfig, TreatOrder, ContactInfo } from '../lib/validation';

const STEPS = [
  { id: 1, label: 'Choose Item' },
  { id: 2, label: 'Configure' },
  { id: 3, label: 'Contact' },
  { id: 4, label: 'Review' },
];

export function Order() {
  const orderDraft = useOrderStore((state: any) => state.orderDraft);
  const currentStep = useOrderStore((state: any) => state.currentStep);
  const setOrderDraft = useOrderStore((state: any) => state.setOrderDraft);
  const setCurrentStep = useOrderStore((state: any) => state.setCurrentStep);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { orderPage } = useOrderPage();
  
  // Handle step transitions with animation
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 50);
    
    const heading = document.getElementById('step-heading');
    if (heading) {
      heading.focus();
    }
    
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  const handleItemSelect = (itemType: ItemType) => {
    console.log('Selected item type:', itemType);
    console.log('Expected CAKE:', ITEMS.CAKE);
    console.log('Expected CUPCAKES:', ITEMS.CUPCAKES);
    
    if (itemType === ITEMS.CAKE) {
      setOrderDraft({
        itemType: ITEMS.CAKE,
        config: {
          size: '',
          flavor: '',
          filling: '',
          frostingType: undefined as any,
          smbcFlavor: '',
          theme: '',
          colors: [],
        },
      });
    } else if (itemType === ITEMS.CUPCAKES) {
      const unitInfo = TREAT_UNITS[ITEMS.CUPCAKES];
      setOrderDraft({
        itemType: ITEMS.CUPCAKES,
        config: {
          quantity: unitInfo.perUnit,
          flavors: [],
          fillings: [],
          smbcFlavor: '',
          theme: '',
          colors: [],
        },
      });
    } else {
      setOrderDraft({
        itemType,
        order: {
          type: itemType,
          quantity: 0,
        },
      });
    }
    setCurrentStep(2);
  };
  
  const handleCakeConfig = (config: CakeConfig) => {
    if (orderDraft?.itemType === ITEMS.CAKE) {
      setOrderDraft({
        ...orderDraft,
        config,
      });
      setCurrentStep(3);
    }
  };
  
  const handleCupcakeConfig = (config: CupcakeConfig) => {
    if (orderDraft?.itemType === ITEMS.CUPCAKES) {
      setOrderDraft({
        ...orderDraft,
        config,
      });
      setCurrentStep(3);
    }
  };
  
  const handleTreatConfig = (order: TreatOrder) => {
    if (orderDraft && orderDraft.itemType !== ITEMS.CAKE && orderDraft.itemType !== ITEMS.CUPCAKES) {
      setOrderDraft({
        ...orderDraft,
        order,
      });
      setCurrentStep(3);
    }
  };
  
  const handleContact = (contact: ContactInfo) => {
    if (orderDraft) {
      setOrderDraft({
        ...orderDraft,
        contact,
      });
      setCurrentStep(4);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    // Trigger form submission
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };
  
  const canGoBack = currentStep > 1;
  const showNextButton = currentStep >= 2 && currentStep < 4;
  
  return (
    <div className="min-h-screen bg-[#fde7ee] pb-24">
      <div className="container mx-auto py-3 sm:py-5">
        <h1 className="font-bold text-[#000000] mb-3 sm:mb-5 text-center">
          Order Wizard
        </h1>
        
        <Stepper steps={STEPS} currentStep={currentStep} />
        
        <div className="mt-4 max-w-2xl mx-auto">
          {/* Main content */}
          <div>
            {/* Title for step 1 - outside white box */}
            {currentStep === 1 && (
              <h2 id="step-heading" className="text-2xl font-bold text-black mb-3" tabIndex={-1}>
                {orderPage?.chooseItemTitle || 'Choose Your Item'}
              </h2>
            )}
            
            <div className="bg-white rounded-xl shadow-soft p-4">
              {/* Navigation buttons - desktop only - at TOP */}
              <div className="hidden sm:flex gap-3 mb-5 pb-5 border-b border-[#ffd1dc]">
                {canGoBack && (
                  <Button
                    variant="secondary"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back
                  </Button>
                )}
                
                {showNextButton && (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    className="flex items-center gap-2 ml-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
              
              <div 
                key={currentStep}
                className={`step-content ${isTransitioning ? 'step-entering' : 'step-entered'}`}
              >
                {currentStep === 1 && (
                  <ChooseItem onSelect={handleItemSelect} />
                )}
                
                {currentStep === 2 && orderDraft && (
                  <>
                    {orderDraft.itemType === ITEMS.CAKE ? (
                      <ConfigureCake
                        defaultValues={'config' in orderDraft ? orderDraft.config : undefined}
                        onSubmit={handleCakeConfig}
                      />
                    ) : orderDraft.itemType === ITEMS.CUPCAKES ? (
                      <ConfigureCupcakes
                        defaultValues={'config' in orderDraft ? orderDraft.config : undefined}
                        onSubmit={handleCupcakeConfig}
                      />
                    ) : orderDraft.itemType === ITEMS.BROWNIES || 
                       orderDraft.itemType === ITEMS.COOKIES || 
                       orderDraft.itemType === ITEMS.SEASONAL ? (
                      <ConfigureTreats
                        itemType={orderDraft.itemType}
                        defaultValues={'order' in orderDraft ? orderDraft.order : undefined}
                        onSubmit={handleTreatConfig}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-lg text-red-600 mb-2">Configuration Error</p>
                        <p className="text-sm text-gray-600">Item type "{orderDraft.itemType}" is not recognized.</p>
                        <p className="text-xs text-gray-500 mt-2">Please ensure the item type in CMS is exactly: "cake", "cupcakes", "brownies", "cookies", or "seasonal"</p>
                      </div>
                    )}
                  </>
                )}
                
                {currentStep === 3 && orderDraft && (
                  <ContactForm
                    defaultValues={'contact' in orderDraft ? orderDraft.contact : undefined}
                    onSubmit={handleContact}
                  />
                )}
                
                {currentStep === 4 && orderDraft && (
                  <ReviewAndSend draft={orderDraft} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky bottom navigation - mobile only */}
      <div className="sm:hidden sticky-cta-bar">
        <div className="mobile-container py-3">
          <div className="flex gap-3">
            {canGoBack && (
              <Button
                variant="secondary"
                onClick={handleBack}
                size="lg"
                className="flex-shrink-0 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Back</span>
              </Button>
            )}
            
            {showNextButton && (
              <Button
                variant="primary"
                onClick={handleNext}
                size="lg"
                fullWidth={!canGoBack}
                className="flex items-center justify-center gap-2"
              >
                <span>Continue to {STEPS[currentStep]?.label}</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

