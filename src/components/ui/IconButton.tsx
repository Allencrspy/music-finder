import "./IconButton.css";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "solid" | "blur" | "outline" | "ghost";
  size?: "sm" | "md";
}

const IconButton = ({
  icon,
  variant = "outline",
  size = "md",
  className = "",
  title,
  ...props
}: IconButtonProps) => {
  const baseClass = "ui-icon-btn";
  const variantClass = `ui-icon-btn-${variant}`;
  const sizeClass = `ui-icon-btn-${size}`;

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
      title={title}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
