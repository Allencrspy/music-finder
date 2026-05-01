import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="ui-modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
