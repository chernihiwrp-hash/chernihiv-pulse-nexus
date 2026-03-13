import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: "green" | "lime" | "yellow" | "red";
  style?: React.CSSProperties;
}

const hoverGlow: Record<string, string> = {
  green: "hover:shadow-[0_0_20px_hsl(142,71%,45%,0.25)]",
  lime: "hover:shadow-[0_0_20px_hsl(84,81%,44%,0.25)]",
  yellow: "hover:shadow-[0_0_20px_hsl(45,100%,55%,0.25)]",
  red: "hover:shadow-[0_0_20px_hsl(0,70%,50%,0.25)]",
};

const hoverBorder: Record<string, string> = {
  green: "hover:border-secondary/25",
  lime: "hover:border-primary/25",
  yellow: "hover:border-neon-yellow/25",
  red: "hover:border-neon-red/25",
};

const NeonCard = ({ children, className = "", onClick, glowColor = "lime", style }: NeonCardProps) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`liquid-glass-card rounded-2xl p-4 card-press ripple-effect cursor-pointer transition-all duration-300 ${hoverGlow[glowColor]} ${hoverBorder[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
};

export default NeonCard;
