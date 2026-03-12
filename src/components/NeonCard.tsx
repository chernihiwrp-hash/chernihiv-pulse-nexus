import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: "green" | "purple" | "yellow" | "lime";
  style?: React.CSSProperties;
}

const borderClasses = {
  green: "hover:border-primary/30",
  lime: "hover:border-[hsl(84,81%,44%,0.3)]",
  purple: "hover:border-secondary/30",
  yellow: "hover:border-neon-yellow/30",
};

const glowClasses = {
  green: "hover:glow-green",
  lime: "hover:glow-lime",
  purple: "hover:glow-purple",
  yellow: "hover:glow-yellow",
};

const NeonCard = ({ children, className = "", onClick, glowColor = "green", style }: NeonCardProps) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`gradient-card rounded-2xl p-4 card-press ripple-effect cursor-pointer transition-all duration-300 ${glowClasses[glowColor]} ${borderClasses[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
};

export default NeonCard;
