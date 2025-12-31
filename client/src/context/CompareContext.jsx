import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

const MAX_COMPARE_ITEMS = 4;

export const CompareProvider = ({ children }) => {
  // Load from localStorage on init
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const stored = localStorage.getItem('compareItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  // Add product to compare
  const addToCompare = (product) => {
    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      return { success: false, message: `Tối đa ${MAX_COMPARE_ITEMS} sản phẩm để so sánh` };
    }

    if (compareItems.find(item => item._id === product._id)) {
      return { success: false, message: 'Sản phẩm đã có trong danh sách so sánh' };
    }

    setCompareItems(prev => [...prev, product]);
    return { success: true, message: 'Đã thêm vào so sánh' };
  };

  // Remove product from compare
  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => item._id !== productId));
  };

  // Check if product is in compare
  const isInCompare = (productId) => {
    return compareItems.some(item => item._id === productId);
  };

  // Clear all
  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      compareCount: compareItems.length,
      maxItems: MAX_COMPARE_ITEMS
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareContext;
