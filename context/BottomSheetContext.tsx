import React, { createContext, useContext, ReactNode, useState } from 'react';
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
  const [content, setContent] = useState<ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState<number[]>([0.25, 0.5, 0.9]);
  const [initialSnap, setInitialSnap] = useState(0);

  const showBottomSheet = (
    content: ReactNode,
    options?: {
      snapPoints?: number[];
      initialSnap?: number;
    }
  ) => {
    setContent(content);
    if (options?.snapPoints) setSnapPoints(options.snapPoints);
    if (options?.initialSnap !== undefined) setInitialSnap(options.initialSnap);
    setIsOpen(true);
  };

  const hideBottomSheet = () => {
    setIsOpen(false);
  };

  return (
    <BottomSheetContext.Provider value={{ showBottomSheet, hideBottomSheet }}>
      {children}
      <CustomBottomSheet
        isOpen={isOpen}
        onClose={hideBottomSheet}
        snapPoints={snapPoints}
        initialSnap={initialSnap}
      >
        {content}
      </CustomBottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
