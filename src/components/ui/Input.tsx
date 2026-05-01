import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = ({ icon, className = "", wrapperClassName = "", ...props }: InputProps) => {
  return (
    <div className={`ui-input-wrapper ${wrapperClassName}`.trim()}>
      {icon && <span className="ui-input-icon">{icon}</span>}
      <input className={`ui-input-field ${className}`.trim()} {...props} />
    </div>
  );
};

export default Input;
