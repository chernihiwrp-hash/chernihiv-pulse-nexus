import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
import { AlertTriangle, Shield, Swords, Scale, Gavel, Flame, Crosshair, Skull, Target, Eye, BookOpen, ShieldCheck } from "lucide-react";

export const factions = [
  { id: "sbu", name: "СБУ", icon: Eye, color: "hsl(220, 60%, 45%)", gradient: "linear-gradient(135deg, hsl(220,60%,30%,0.25), hsl(220,60%,15%,0.08))", members: 3, dangerous: false },
  { id: "dbr", name: "ДБР", icon: Target, color: "hsl(160, 50%, 35%)", gradient: "linear-gradient(135deg, hsl(160,50%,30%,0.25), hsl(160,50%,15%,0.08))", members: 2, dangerous: false },
  { id: "npu", name: "НПУ", icon: Shield, color: "hsl(210, 70%, 50%)", gradient: "linear-gradient(135deg, hsl(210,70%,40%,0.25), hsl(210,70%,20%,0.08))", members: 4, dangerous: false },
  { id: "vsu", name: "ВСУ", icon: Swords, color: "hsl(140, 45%, 35%)", gradient: "linear-gradient(135deg, hsl(140,45%,30%,0.25), hsl(100,40%,18%,0.08))", members: 5, dangerous: false },
  { id: "prosecutor", name: "Прокуратура", icon: Scale, color: "hsl(35, 45%, 40%)", gradient: "linear-gradient(135deg, hsl(35,45%,35%,0.25), hsl(30,30%,20%,0.08))", members: 1, dangerous: false },
  { id: "dsns", name: "ДСНС", icon: Flame, color: "hsl(15, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(15,80%,40%,0.25), hsl(15,70%,20%,0.08))", members: 2, dangerous: false },
  { id: "judge", name: "Суддя", icon: Gavel, color: "hsl(45, 70%, 50%)", gradient: "linear-gradient(135deg, hsl(45,70%,45%,0.25), hsl(40,60%,22%,0.08))", members: 1, dangerous: false },
  { id: "lawyers", name: "Адвокати", icon: BookOpen, color: "hsl(25, 70%, 50%)", gradient: "linear-gradient(135deg, hsl(25,70%,45%,0.25), hsl(20,60%,22%,0.08))", members: 1, dangerous: false },
  // Criminal
  { id: "mafia", name: "МАФІЯ", icon: Skull, color: "hsl(0, 55%, 40%)", gradient: "linear-gradient(135deg, hsl(0,55%,22%,0.4), hsl(0,0%,4%,0.5))", members: 2, dangerous: true },
  { id: "ghetto", name: "ГЕТТО", icon: Crosshair, color: "hsl(0, 50%, 38%)", gradient: "linear-gradient(135deg, hsl(0,50%,20%,0.45), hsl(0,0%,3%,0.5))", members: 4, dangerous: true },
  { id: "orion", name: "ОРІОН", icon: ShieldCheck, color: "hsl(0, 45%, 35%)", gradient: "linear-gradient(135deg, hsl(0,45%,22%,0.4), hsl(0,0%,4%,0.45))", members: 3, dangerous: true },
];

const Factions = () => {
  const navigate = useNavigate();
  const govFactions = factions.filter(f => !f.dangerous);
  const crimFactions = factions.filter(f => f.dangerous);

  const renderFaction = (f: typeof factions[0], i: number) => (
    <div key={f.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
      <NeonCard
        className="flex items-center gap-4"
        glowColor={f.dangerous ? "red" : "lime"}
        onClick={() => navigate(`/factions/${f.id}`)}
        style={{ background: f.gradient, borderColor: f.color + "22" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: f.color + "18", border: `1px solid ${f.color}33`, boxShadow: `0 0 12px ${f.color}22` }}
        >
          <f.icon className="w-6 h-6" style={{ color: f.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{f.name}</h3>
          <p className="text-[10px] text-muted-foreground">Учасників: {f.members}</p>
        </div>
        <span
          className="text-[10px] font-medium px-3 py-1 rounded-lg"
          style={{ backgroundColor: f.color + "15", color: f.color, border: `1px solid ${f.color}22` }}
        >
          →
        </span>
      </NeonCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime mb-6">ФРАКЦІЇ</h1>

      <div className="space-y-3 mb-6">
        {govFactions.map((f, i) => renderFaction(f, i))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <h2 className="font-display text-xs font-bold tracking-wider text-destructive uppercase">Небезпечні фракції</h2>
      </div>
      <div className="space-y-3">
        {crimFactions.map((f, i) => renderFaction(f, govFactions.length + i))}
      </div>
    </div>
  );
};

export default Factions;
