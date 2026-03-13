import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "green" | "lime" | "yellow" | "cyan" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

const gradients = {
  green: "bg-gradient-to-r from-[hsl(84,81%,44%)] via-[hsl(142,71%,45%)] to-[hsl(152,76%,30%)]",
  lime: "bg-gradient-to-r from-[hsl(84,81%,44%)] via-[hsl(142,71%,45%)] to-[hsl(152,76%,30%)]",
  yellow: "bg-gradient-to-r from-neon-yellow to-[hsl(30,100%,55%)]",
  cyan: "bg-gradient-to-r from-[hsl(180,100%,50%)] to-primary",
  danger: "bg-gradient-to-r from-[hsl(0,70%,50%)] to-[hsl(0,60%,35%)]",
};

const glowStyles = {
  green: "shadow-[0_0_20px_hsl(142,71%,45%,0.4),0_0_40px_hsl(84,81%,44%,0.15)]",
  lime: "shadow-[0_0_20px_hsl(84,81%,44%,0.4),0_0_40px_hsl(142,71%,45%,0.15)]",
  yellow: "shadow-[0_0_20px_hsl(45,100%,55%,0.4)]",
  cyan: "shadow-[0_0_20px_hsl(180,100%,50%,0.3)]",
  danger: "shadow-[0_0_20px_hsl(0,70%,50%,0.4)]",
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
