import { Home, Shield, ShoppingCart, Gift, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/",        icon: Home,         label: "Головна" },
  { path: "/factions",icon: Shield,       label: "Фракції" },
  { path: "/casino",  icon: ShoppingCart, label: "Магазин" },
  { path: "/shop",    icon: Gift,         label: "Нагороди" },
  { path: "/profile", icon: User,         label: "Профіль" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "hsl(0 0% 0% / 0.8)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid hsl(0 0% 100% / 0.06)"
      }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-all ${isActive ? "drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" : ""}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>{tab.label}</span>
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 6px hsl(var(--primary))" }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
