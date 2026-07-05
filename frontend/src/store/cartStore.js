import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      pharmacy: null,

      setPharmacy: (pharmacy) => {
        const currentPharmacy = get().pharmacy;
        if (currentPharmacy && currentPharmacy.id !== pharmacy.id) {
          if (window.confirm('Adding items from a different pharmacy will clear your current cart. Continue?')) {
            set({ items: [], pharmacy });
          }
        } else {
          set({ pharmacy });
        }
      },

      addItem: (medicine, price = null) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === medicine.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === medicine.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, {
              id: medicine.id,
              name: medicine.name,
              brand: medicine.brand,
              image: medicine.image,
              price: price || medicine.pivot?.selling_price || medicine.unit_price,
              quantity: 1,
            }],
          });
        }
      },

      removeItem: (medicineId) => {
        set({
          items: get().items.filter(item => item.id !== medicineId),
        });
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(medicineId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === medicineId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], pharmacy: null });
      },

      get total() {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
