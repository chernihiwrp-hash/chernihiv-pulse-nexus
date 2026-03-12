import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "green" | "purple" | "yellow" | "cyan";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

const gradients = {
  green: "bg-gradient-to-r from-primary to-[hsl(180,100%,50%)]",
  purple: "bg-gradient-to-r from-secondary to-neon-pink",
  yellow: "bg-gradient-to-r from-neon-yellow to-[hsl(30,100%,55%)]",
  cyan: "bg-gradient-to-r from-[hsl(180,100%,50%)] to-primary",
};

const glowStyles = {
  green: "shadow-[0_0_20px_hsl(157,100%,50%,0.3)]",
  purple: "shadow-[0_0_20px_hsl(263,86%,65%,0.3)]",
  yellow: "shadow-[0_0_20px_hsl(45,100%,55%,0.3)]",
  cyan: "shadow-[0_0_20px_hsl(180,100%,50%,0.3)]",
};

const GradientButton = ({
  children,
  onClick,
  variant = "green",
  className,
  disabled = false,
  type = "button",
}: GradientButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-6 py-3 rounded-2xl font-semibold text-sm text-primary-foreground",
        "transition-all duration-200 active:scale-95",
        "hover:brightness-110 hover:scale-[1.02]",
        gradients[variant],
        glowStyles[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        className
      )}
    >
      {children}
    </button>
  );
};

export default GradientButton;
