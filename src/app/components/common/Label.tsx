interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  variant?: "default" | "sub";
  className?: string;
}

export default function Label({
  children,
  htmlFor,
  variant = "default",
  className = "",
}: LabelProps) {
  const baseClasses = "block text-black font-bold mb-2 text-lg md:text-xl";
  const subClasses = "block text-gray-700 text-sm mb-2";
  
  const variantClasses = variant === "sub" ? subClasses : baseClasses;
  
  return (
    <label
      htmlFor={htmlFor}
      className={`${variantClasses} ${className}`}
    >
      {children}
    </label>
  );
}

