import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  // escape

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // scroll lock

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // accessibility

  useEffect(() => {
    if (!modalRef.current || !isOpen) return;

    const modal = modalRef.current;
    const selecterNames = "a[href], button, textarea, input, select";
    const selectorElements = modal.querySelectorAll(selecterNames);
    const firstEl = selectorElements?.[0];
    const lastEl = selectorElements?.[selectorElements.length - 1];

    if (firstEl) {
      firstEl.focus();
    } else {
      modal.focus();
    }

    const handleAccessibility = (e) => {
      if (e.key !== "Tab") return;

      if (!firstEl || !lastEl) {
        e.preventDefault();
        modal.focus();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleAccessibility);

    return () => {
      modal.removeEventListener("keydown", handleAccessibility);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "black",
    width: "100vw",
    height: "100vh",
  };

  const modalStyle = { background: "white" };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div onClick={handleOverlayClick} style={overlayStyle}>
      <div
        ref={modalRef}
        style={modalStyle}
        role="dialog"
        aria-modal
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
