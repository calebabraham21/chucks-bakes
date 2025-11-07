import { create } from 'zustand';
import type { OrderDraft, RequestItem } from './validation';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from './utils';

const ORDER_DRAFT_KEY = 'chucks-bakes-order-draft';
const REQUEST_LIST_KEY = 'chucks-bakes-request-list';
const CURRENT_STEP_KEY = 'chucks-bakes-current-step';

interface OrderState {
  // Current order being built
  orderDraft: OrderDraft | null;
  currentStep: number;
  
  // List of finalized items ready to send
  requestList: RequestItem[];
  
  // Actions
  setOrderDraft: (draft: OrderDraft | null) => void;
  setCurrentStep: (step: number) => void;
  addRequestItem: (item: RequestItem) => void;
  removeRequestItem: (index: number) => void;
  clearRequestList: () => void;
  clearDraft: () => void;
  
  // Persistence
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orderDraft: null,
  currentStep: 1,
  requestList: [],
  
  setOrderDraft: (draft: OrderDraft | null) => {
    set({ orderDraft: draft });
    const state = get();
    safeLocalStorageSet(ORDER_DRAFT_KEY, draft);
    safeLocalStorageSet(CURRENT_STEP_KEY, state.currentStep);
  },
  
  setCurrentStep: (step: number) => {
    set({ currentStep: step });
    safeLocalStorageSet(CURRENT_STEP_KEY, step);
  },
  
  addRequestItem: (item: RequestItem) => {
    set((state: OrderState) => {
      const newList = [...state.requestList, item];
      safeLocalStorageSet(REQUEST_LIST_KEY, newList);
      return { requestList: newList };
    });
  },
  
  removeRequestItem: (index: number) => {
    set((state: OrderState) => {
      const newList = state.requestList.filter((_: RequestItem, i: number) => i !== index);
      safeLocalStorageSet(REQUEST_LIST_KEY, newList);
      return { requestList: newList };
    });
  },
  
  clearRequestList: () => {
    set({ requestList: [] });
    safeLocalStorageRemove(REQUEST_LIST_KEY);
  },
  
  clearDraft: () => {
    set({ orderDraft: null, currentStep: 1 });
    safeLocalStorageRemove(ORDER_DRAFT_KEY);
    safeLocalStorageRemove(CURRENT_STEP_KEY);
  },
  
  loadFromLocalStorage: () => {
    const draft = safeLocalStorageGet<OrderDraft | null>(ORDER_DRAFT_KEY, null);
    const step = safeLocalStorageGet<number>(CURRENT_STEP_KEY, 1);
    const requestList = safeLocalStorageGet<RequestItem[]>(REQUEST_LIST_KEY, []);
    
    set({
      orderDraft: draft,
      currentStep: step,
      requestList,
    });
  },
  
  saveToLocalStorage: () => {
    const state = get();
    safeLocalStorageSet(ORDER_DRAFT_KEY, state.orderDraft);
    safeLocalStorageSet(CURRENT_STEP_KEY, state.currentStep);
    safeLocalStorageSet(REQUEST_LIST_KEY, state.requestList);
  },
}));

// Initialize store from localStorage on module load
if (typeof window !== 'undefined') {
  useOrderStore.getState().loadFromLocalStorage();
}

