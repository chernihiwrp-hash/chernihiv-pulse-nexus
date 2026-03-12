import { Newspaper, FileText, Home, Vote, ScrollText, Megaphone, Search, Car, UserPlus, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
import PulseCity from "../components/PulseCity";

const menuItems = [
  { icon: Newspaper, label: "Новини", desc: "Останні події", glow: "lime" as const, path: "/news" },
  { icon: FileText, label: "Ліцензії", desc: "Зброя та дозволи", glow: "purple" as const, path: "/licenses" },
  { icon: Home, label: "Будинки", desc: "Нерухомість", glow: "yellow" as const, path: "/houses" },
  { icon: Vote, label: "Вибори мера", desc: "Голосування", glow: "lime" as const, path: "/mayor-election" },
  { icon: ScrollText, label: "Документи", desc: "Офіційні папери", glow: "purple" as const, path: "/documents" },
  { icon: Megaphone, label: "Голос міста", desc: "Скарги та ідеї", glow: "lime" as const, path: "/city-voice" },
  { icon: Search, label: "Розшук", desc: "Список розшуку", glow: "purple" as const, path: "/wanted" },
  { icon: Car, label: "Номери авто", desc: "Реєстрація", glow: "yellow" as const, path: "/car-registration" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-green">
            CHERNIHIV RP
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">ПОРТАЛ</p>
        </div>
        <button
          onClick={() => window.open("https://t.me/c/3287952590/26385", "_blank")}
          className="w-11 h-11 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center card-press hover:bg-destructive/30 hover:glow-green transition-all active:scale-90 animate-pulse-glow"
        >
          <AlertCircle className="w-5 h-5 text-destructive" />
        </button>
      </div>

      {/* Pulse City */}
      <div className="mb-6 animate-fade-in">
        <PulseCity />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <NeonCard glowColor={item.glow} onClick={() => navigate(item.path)}>
              <item.icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </NeonCard>
          </div>
        ))}
      </div>

      {/* Admin Application - Special Card */}
      <div className="mt-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <NeonCard glowColor="lime" onClick={() => navigate("/admin-application")}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(84,81%,44%,0.2)] to-[hsl(142,71%,45%,0.1)] border border-primary/20 flex items-center justify-center">
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
