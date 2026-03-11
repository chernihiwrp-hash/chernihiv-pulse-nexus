import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: "green" | "purple" | "yellow";
}

const glowClasses = {
  green: "hover:glow-green",
  purple: "hover:glow-purple",
  yellow: "hover:glow-yellow",
};

const NeonCard = ({ children, className = "", onClick, glowColor = "green" }: NeonCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`gradient-card rounded-2xl p-4 card-press cursor-pointer transition-all duration-300 ${glowClasses[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
};

export default NeonCard;
