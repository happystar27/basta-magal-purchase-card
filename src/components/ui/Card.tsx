import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlighted" | "error";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const baseClasses =
    "backdrop-blur-lg rounded-md p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg";

  const variantClasses = {
    default: "",
    highlighted: "bg-amber-500/10 border-amber-500/30",
    error: "bg-red-500/10 border-red-500/30",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        boxShadow: "8px 10px 0px rgba(107, 114, 128, 0.5)",
        borderRadius: "10px",
        border: "2px solid black",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
