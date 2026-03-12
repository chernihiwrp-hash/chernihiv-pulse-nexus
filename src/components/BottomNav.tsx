import { Home, Shield, Dices, ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "Головна" },
  { path: "/factions", icon: Shield, label: "Фракції" },
  { path: "/casino", icon: Dices, label: "Казино" },
  { path: "/shop", icon: ShoppingBag, label: "Магазин" },
  { path: "/profile", icon: User, label: "Профіль" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_hsl(142,71%,45%,0.7)]" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary animate-pulse-glow" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
