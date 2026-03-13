import { Newspaper, FileText, Home, Vote, ScrollText, Megaphone, Search, Car, UserPlus, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
import PulseCity from "../components/PulseCity";

const menuItems = [
  { icon: Newspaper, label: "Новини", desc: "Останні події", path: "/news" },
  { icon: FileText, label: "Ліцензії", desc: "Зброя та дозволи", path: "/licenses" },
  { icon: Home, label: "Будинки", desc: "Нерухомість", path: "/houses" },
  { icon: Vote, label: "Вибори мера", desc: "Голосування", path: "/mayor-election" },
  { icon: ScrollText, label: "Документи", desc: "Офіційні папери", path: "/documents" },
  { icon: Megaphone, label: "Голос міста", desc: "Скарги та ідеї", path: "/city-voice" },
  { icon: Search, label: "Розшук", desc: "Список розшуку", path: "/wanted" },
  { icon: Car, label: "Номери авто", desc: "Реєстрація", path: "/car-registration" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">
            CHERNIHIV RP
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">ПОРТАЛ</p>
        </div>

        {/* SOS — Liquid Glass Emergency */}
        <button
          onClick={() => window.open("https://t.me/c/3287952590/26385", "_blank")}
          className="relative w-12 h-12 rounded-full liquid-glass-card flex items-center justify-center active:scale-90 transition-all group"
          style={{
            boxShadow: '0 0 16px hsl(0 70% 50% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.1)',
            borderColor: 'hsl(0 70% 50% / 0.3)',
          }}
        >
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse-glow" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive" />
        </button>
      </div>

      {/* Pulse City */}
      <div className="mb-6 animate-fade-in">
        <PulseCity />
      </div>

      {/* Menu Grid — Large Liquid Glass Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <NeonCard glowColor="lime" onClick={() => navigate(item.path)}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </NeonCard>
          </div>
        ))}
      </div>

      {/* Admin Application */}
      <div className="mt-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <NeonCard glowColor="lime" onClick={() => navigate("/admin-application")}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 border border-primary/15 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Заявка на адміністрацію</h3>
              <p className="text-[10px] text-muted-foreground">Стань адміністратором сервера</p>
            </div>
            <span className="text-[10px] text-primary font-medium">→</span>
          </div>
        </NeonCard>
      </div>
    </div>
  );
};

export default Index;
