'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, selectedVariant = null) => {
    setCartItems((prevItems) => {
      // Determine the variant to add
      let variantToAdd = selectedVariant;
      if (!variantToAdd && product.variants && product.variants.length > 0) {
        variantToAdd = product.variants[0];
      }
      
      const priceToUse = variantToAdd ? variantToAdd.price : (product.pricePerKg || product.price_per_kg || product.basePrice);

      // GTM add_to_cart event
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: {
            value: priceToUse,
            currency: 'BDT',
            items: [{
              item_id: product._id?._id || product._id,
              item_name: product.title,
              category: product.category,
              price: priceToUse,
              quantity: 1
            }]
          }
        });
      }

      // We consider an item "same" if both product ID and variant label match
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item._id === product._id && 
          (variantToAdd ? item.selectedVariant?.label === variantToAdd.label : true)
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }
      
      return [...prevItems, { 
        ...product, 
        quantity: 1, 
        selectedVariant: variantToAdd,
        cartItemId: `${product._id}_${variantToAdd ? variantToAdd.label : 'default'}` // Unique ID for cart row
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateVariant = (cartItemId, newVariant) => {
    setCartItems((prevItems) => {
      // Find the item being changed
      const itemToChange = prevItems.find(i => i.cartItemId === cartItemId);
      if (!itemToChange) return prevItems;

      // Construct what the NEW cartItemId will be
      const newCartItemId = `${itemToChange._id}_${newVariant.label}`;

      // Check if this new variant already exists as a separate row in the cart
      const existingRowIndex = prevItems.findIndex(i => i.cartItemId === newCartItemId && i.cartItemId !== cartItemId);
      
      if (existingRowIndex > -1) {
        // Merge them: add the quantity to the existing row and remove the old row
        const updatedItems = [...prevItems];
        updatedItems[existingRowIndex].quantity += itemToChange.quantity;
        return updatedItems.filter(i => i.cartItemId !== cartItemId);
      } else {
        // Just update the variant and the cartItemId in place
        return prevItems.map((item) =>
          item.cartItemId === cartItemId 
            ? { ...item, selectedVariant: newVariant, cartItemId: newCartItemId } 
            : item
        );
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : (item.pricePerKg || item.price_per_kg || item.basePrice);
    return total + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateVariant,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
