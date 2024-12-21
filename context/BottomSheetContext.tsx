import React, { createContext, useContext, ReactNode, useState, useRef } from 'react';
import { CustomBottomSheet } from '../components/ui/bottom-sheet';

type BottomSheetContextType = {
  showBottomSheet: (
    content: ReactNode,
    options?: {
      snapPoints?: number[];
      initialSnap?: number;
    }
  ) => void;
  hideBottomSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [snapPoints, setSnapPoints] = useState<number[]>([0.25, 0.5, 0.9]);
  const [initialSnap, setInitialSnap] = useState(0);

  const showBottomSheet = (
    sheetContent: ReactNode,
    options?: {
      snapPoints?: number[];
      initialSnap?: number;
    }
  ) => {
    try {
      setContent(sheetContent);
      if (options?.snapPoints) setSnapPoints(options.snapPoints);
      if (options?.initialSnap !== undefined) setInitialSnap(options.initialSnap);
      setIsOpen(true);
    } catch (error) {
      console.error("Error showing bottom sheet:", error);
    }
  };

  const hideBottomSheet = () => {
    try {
      setIsOpen(false);
      // Clear content after animation completes
      setTimeout(() => {
        setContent(null);
      }, 300);
    } catch (error) {
      console.error("Error hiding bottom sheet:", error);
    }
  };

  return (
    <BottomSheetContext.Provider value={{ showBottomSheet, hideBottomSheet }}>
      {children}
      {content !== null && (
        <CustomBottomSheet
          isOpen={isOpen}
          onClose={hideBottomSheet}
          snapPoints={snapPoints}
          initialSnap={initialSnap}
        >
          {content}
        </CustomBottomSheet>
      )}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
