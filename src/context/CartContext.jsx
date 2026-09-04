import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "slc_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item) {
    setItems((prev) => {
      const key = `${item.id}-${item.variantId || "default"}`;
      const existing = prev.find(
        (i) => `${i.id}-${i.variantId || "default"}` === key
      );
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.variantId || "default"}` === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }

  function updateQuantity(id, variantId, quantity) {
    if (quantity <= 0) {
      removeItem(id, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.variantId === variantId ? { ...i, quantity } : i
      )
    );
  }

  function removeItem(id, variantId) {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.variantId === variantId))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
