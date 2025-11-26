import { useOrderPage } from '../../lib/useOrderPage';
import { urlFor } from '../../lib/sanity';
import type { ItemType } from '../../lib/constants';

interface ChooseItemProps {
  onSelect: (itemType: ItemType) => void;
}

export function ChooseItem({ onSelect }: ChooseItemProps) {
  const { orderPage, loading } = useOrderPage();

  // Get items from Sanity (enabled items only)
  const items = orderPage?.items?.filter(item => item.enabled !== false) || [];
  
  return (
    <div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl shadow-soft overflow-hidden h-32 bg-gray-300 animate-pulse">
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-lg text-black mb-2">No items are currently available for order.</p>
          <p className="text-sm text-black">Please check back later or contact us directly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const imageUrl = item.image ? urlFor(item.image.asset).width(800).height(400).url() : null;
            
            return (
              <div
                key={item.itemType}
                onClick={() => onSelect(item.itemType as ItemType)}
                className="cursor-pointer group rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-32 relative"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(item.itemType as ItemType);
                  }
                }}
                aria-label={`Select ${item.label}`}
              >
                {/* Background Image */}
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffd1dc] to-[#ffc1d4]"></div>
                )}
                
                {/* Gradient overlay - fades to dark at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70 group-hover:from-black/30 group-hover:via-black/40 group-hover:to-black/80 transition-all"></div>
                
                {/* Text content */}
                <div className="relative h-full flex items-end justify-start p-4">
                  <h3 className="relative text-2xl md:text-3xl font-bold text-white drop-shadow-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:transition-transform after:duration-300 after:ease-out after:scale-x-0 group-hover:after:scale-x-100">
                    {item.label}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

