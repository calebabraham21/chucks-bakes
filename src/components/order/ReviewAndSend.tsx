import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toast } from '../ui/Toast';
import type { OrderDraft, RequestItem } from '../../lib/validation';
import { makePlainTextSummary } from '../../lib/summary';
import { useOrderStore } from '../../lib/state';

interface ReviewAndSendProps {
  draft: OrderDraft;
}

export function ReviewAndSend({ draft }: ReviewAndSendProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const addRequestItem = useOrderStore((state: any) => state.addRequestItem);
  const clearDraft = useOrderStore((state: any) => state.clearDraft);
  
  // Check if contact info is complete
  const hasContact = 'contact' in draft && draft.contact;
  const canAddToRequest = hasContact;
  
  const summary = makePlainTextSummary(draft);
  
  const handleAddToRequest = () => {
    if (!canAddToRequest) return;
    
    // Add to request list
    addRequestItem(draft as RequestItem);
    
    // Show success toast
    setToastMessage('Item added to request! You can add another item or view your full request.');
    setShowToast(true);
    
    // Clear current draft
    clearDraft();
  };
  
  
  return (
    <div>
      <div>
        <h2 id="step-heading" className="text-2xl font-semibold text-black mb-2" tabIndex={-1}>
          Review & Send
        </h2>
        <p className="text-gray-600 mb-6">
          Check your order details and send your request
        </p>
      </div>
      
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Order Summary</h3>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-bakery-cream p-4 rounded-lg">
          {summary}
        </pre>
      </Card>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToRequest}
            disabled={!canAddToRequest}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Add to Request
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          Add this item to your request list. You can add multiple items before sending.
        </p>
        
        {!canAddToRequest && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Please complete the contact information in Step 3 before adding to request.
            </p>
          </div>
        )}
      </div>
      
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

