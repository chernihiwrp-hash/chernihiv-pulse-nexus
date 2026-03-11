import { Newspaper, FileText, Home, Vote, ScrollText, Megaphone, Search, Car, UserPlus } from "lucide-react";
import NeonCard from "../components/NeonCard";
import PulseCity from "../components/PulseCity";

const menuItems = [
  { icon: Newspaper, label: "Новини", desc: "Останні події", glow: "green" as const },
  { icon: FileText, label: "Ліцензії", desc: "Зброя та дозволи", glow: "purple" as const },
  { icon: Home, label: "Будинки", desc: "Нерухомість", glow: "yellow" as const },
  { icon: Vote, label: "Вибори мера", desc: "Голосування", glow: "green" as const },
  { icon: ScrollText, label: "Документи", desc: "Офіційні папери", glow: "purple" as const },
  { icon: Megaphone, label: "Голос міста", desc: "Скарги та ідеї", glow: "green" as const },
  { icon: Search, label: "Розшук", desc: "Список розшуку", glow: "purple" as const },
  { icon: Car, label: "Номери авто", desc: "Реєстрація", glow: "yellow" as const },
  { icon: UserPlus, label: "Заявка в адмін", desc: "Стань адміном", glow: "green" as const },
];

const Index = () => {
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
        <button className="w-10 h-10 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center text-destructive text-xs font-bold card-press hover:bg-destructive/30 transition-colors">
          SOS
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
            <NeonCard glowColor={item.glow}>
              <item.icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
