import { useState } from "react";

function usePopupState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return {
    isOpen,
    openPopup,
    closePopup,
  };
}

export default usePopupState;
