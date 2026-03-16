import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, CreditCard, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Stepper } from '../components/ui/Stepper';
import { ChooseItem } from '../components/order/ChooseItem';
import { ConfigureCake } from '../components/order/ConfigureCake';
import { ReviewAndAdd } from '../components/order/ReviewAndAdd';
import { useOrderStore } from '../lib/state';
import { ITEMS, POLICIES } from '../lib/constants';
import type { ItemType } from '../lib/constants';
import type { CakeConfig } from '../lib/validation';

const STEPS = [
  { id: 1, label: 'Choose' },
  { id: 2, label: 'Configure' },
  { id: 3, label: 'Add to Cart' },
];

export function Order() {
  const orderDraft = useOrderStore((state: any) => state.orderDraft);
  const currentStep = useOrderStore((state: any) => state.currentStep);
  const setOrderDraft = useOrderStore((state: any) => state.setOrderDraft);
  const setCurrentStep = useOrderStore((state: any) => state.setCurrentStep);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const chooseItemTitle = 'Choose Your Item';

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 50);

    const heading = document.getElementById('step-heading');
    if (heading) {
      heading.focus();
    }

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleItemSelect = (_itemType: ItemType) => {
    setOrderDraft({
      itemType: ITEMS.CAKE,
      config: {
        size: '',
        flavor: '',
        filling: '',
        frostingFlavor: '',
        toppings: [],
        writingStyle: '',
        writingText: '',
        theme: '',
        colors: '',
        specialRequests: '',
      },
    });
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const canGoBack = currentStep > 1;
  const showNextButton = currentStep === 2;

  return (
    <div className="bg-[#fde7ee] pb-24 sm:pb-8">
      <div className="container mx-auto py-3 sm:py-5">
        <h1 className="font-bold text-[#000000] mb-3 sm:mb-5 text-center">
          Order Process
        </h1>

        {/* Policies Banner - only show on step 1 */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-[#ffc1d4]/50 shadow-sm">
              <h3 className="font-bold text-[#000] mb-4 text-lg">📋 Before you order:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-base">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-[#ff6b9d] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{POLICIES.advanceNotice}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-6 h-6 text-[#ff6b9d] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{POLICIES.payment}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-[#ff6b9d] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{POLICIES.pickup}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 pt-3 border-t border-[#ffc1d4]/50">
                ⚠️ {POLICIES.orderDenied}
              </p>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="mt-4 max-w-2xl mx-auto">
          <div>
            {currentStep === 1 && (
              <h2 id="step-heading" className="text-2xl font-bold text-black mb-3" tabIndex={-1}>
                {chooseItemTitle}
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
                  <ConfigureCake
                    defaultValues={'config' in orderDraft ? orderDraft.config : undefined}
                    onSubmit={handleCakeConfig}
                  />
                )}

                {currentStep === 3 && orderDraft && (
                  <ReviewAndAdd draft={orderDraft} />
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
