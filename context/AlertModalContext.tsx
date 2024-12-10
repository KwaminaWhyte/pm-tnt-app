import React, { createContext, useContext, ReactNode, useState } from 'react';
import { CustomAlertModal } from '../components/ui/modal';

type AlertModalContextType = {
  showAlert: (content: ReactNode, onOk?: () => void) => void;
  hideAlert: () => void;
};

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

export const AlertModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [onOk, setOnOk] = useState<(() => void) | undefined>(undefined);

  const showAlert = (content: ReactNode, onOk?: () => void) => {
    setContent(content);
    setOnOk(() => onOk);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
  };

  const handleOk = () => {
    if (onOk) onOk();
    hideAlert();
  };

  return (
    <AlertModalContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlertModal
        open={isOpen}
        setOpen={setIsOpen}
        handleOk={handleOk}
      >
        {content}
      </CustomAlertModal>
    </AlertModalContext.Provider>
  );
};

export const useAlertModal = () => {
  const context = useContext(AlertModalContext);
  if (!context) {
    throw new Error('useAlertModal must be used within an AlertModalProvider');
  }
  return context;
};
