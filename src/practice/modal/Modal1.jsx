import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  // escape handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
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
  }, [isOpen, onClose]);

  // accessibility
  useEffect(() => {
    const modal = modalRef.current;

    if (!isOpen || !modal) return;

    const focusableSelectors = "a[href], button, textarea, input, select";

    const selectorElements = modal.querySelectorAll(focusableSelectors);
    const firstEl = selectorElements[0];
    const lastEl = selectorElements[selectorElements.length - 1];

    firstEl?.focus();

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

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

    modal.addEventListener("keydown", handleTab);

    return () => {
      modal.removeEventListener("keydown", handleTab);
    };
  }, [isOpen, onClose]);

  const handleModalClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      onClick={handleModalClick}
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        zIndex: "1000",
        background: "black",
      }}
    >
      <div ref={modalRef} style={{ background: "white" }}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
