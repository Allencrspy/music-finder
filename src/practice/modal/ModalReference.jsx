/**
 * 
 * Build:

A Modal component

⸻

Requirements (interview level)

1. Basic
	•	Open / close modal
	•	Overlay background

⸻

2. Close actions
	•	Click outside → close
	•	ESC key → close

⸻

3. Focus management (this is where you stand out)
	•	Focus should move into modal when opened
	•	Tab should stay inside modal

⸻

4. Scroll lock
	•	Background should not scroll when modal is open
 */

import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    previousFocusRef.current = document.activeElement;

    const modal = modalRef.current;
    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusableElements = modal.querySelectorAll(focusableSelectors);
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (firstEl) {
      firstEl.focus();
    } else {
      modal.focus();
    }

    const handleTab = (e) => {
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

    modal.addEventListener("keydown", handleTab);

    return () => {
      modal.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  const handleModalClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div onClick={handleModalClick} style={overlayStyle}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={modalStyle}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  zIndex: 1000,
  background: "rgba(0, 0, 0, 0.5)",
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
};

export default Modal;
