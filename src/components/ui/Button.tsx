import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  active?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = ({
  variant = "primary",
  active = false,
  fullWidth = false,
  loading = false,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseClass = "ui-button";
  const variantClass = `ui-button-${variant}`;
  const activeClass = active ? "active" : "";
  const fullWidthClass = fullWidth ? "full-width" : "";
  const loadingClass = loading ? "loading" : "";

  return (
    <button
      className={`${baseClass} ${variantClass} ${activeClass} ${fullWidthClass} ${loadingClass} ${className}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="button-loader-container">
          <span className="button-spinner" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
