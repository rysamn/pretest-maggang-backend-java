import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (produk) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.produk.id === produk.id);
      if (existing) {
        return prev.map(i =>
          i.produk.id === produk.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prev, { produk, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (produkId) => {
    setCartItems(prev => prev.filter(i => i.produk.id !== produkId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (produkId, qty) => {
    if (qty <= 0) return removeFromCart(produkId);
    setCartItems(prev =>
      prev.map(i =>
        i.produk.id === produkId ? { ...i, quantity: qty } : i
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.produk.harga * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
