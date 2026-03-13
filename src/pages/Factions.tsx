import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
import { AlertTriangle } from "lucide-react";

// Government factions first, criminal at bottom
export const factions = [
  { id: "sbu", name: "СБУ", color: "hsl(220, 70%, 35%)", gradient: "linear-gradient(135deg, hsl(220,70%,35%,0.2), hsl(220,70%,15%,0.08))", members: 3, dangerous: false },
  { id: "dbr", name: "ДБР", color: "hsl(140, 60%, 35%)", gradient: "linear-gradient(135deg, hsl(140,60%,35%,0.2), hsl(140,60%,15%,0.08))", members: 2, dangerous: false },
  { id: "npu", name: "НПУ", color: "hsl(210, 80%, 45%)", gradient: "linear-gradient(135deg, hsl(210,80%,45%,0.2), hsl(210,80%,20%,0.08))", members: 4, dangerous: false },
  { id: "vsu", name: "ВСУ", color: "hsl(140, 50%, 30%)", gradient: "linear-gradient(135deg, hsl(140,50%,30%,0.2), hsl(100,40%,20%,0.08))", members: 5, dangerous: false },
  { id: "prosecutor", name: "Прокуратура", color: "hsl(30, 50%, 35%)", gradient: "linear-gradient(135deg, hsl(30,50%,35%,0.2), hsl(220,10%,30%,0.08))", members: 1, dangerous: false },
  { id: "dsns", name: "ДСНС", color: "hsl(0, 70%, 45%)", gradient: "linear-gradient(135deg, hsl(0,70%,45%,0.2), hsl(0,60%,20%,0.08))", members: 2, dangerous: false },
  { id: "judge", name: "Суддя", color: "hsl(45, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(45,80%,50%,0.2), hsl(40,70%,25%,0.08))", members: 1, dangerous: false },
  { id: "lawyers", name: "Адвокати", color: "hsl(25, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(25,80%,50%,0.2), hsl(20,70%,25%,0.08))", members: 1, dangerous: false },
  // === Criminal Sector ===
  { id: "mafia", name: "МАФІЯ", color: "hsl(0, 65%, 40%)", gradient: "linear-gradient(135deg, hsl(0,65%,25%,0.35), hsl(0,0%,5%,0.4))", members: 2, dangerous: true },
  { id: "ghetto", name: "ГЕТТО", color: "hsl(0, 60%, 35%)", gradient: "linear-gradient(135deg, hsl(0,60%,20%,0.4), hsl(0,0%,3%,0.5))", members: 4, dangerous: true },
  { id: "orion", name: "ОРІОН", color: "hsl(0, 55%, 35%)", gradient: "linear-gradient(135deg, hsl(0,55%,25%,0.35), hsl(0,0%,4%,0.45))", members: 3, dangerous: true },
];

const Factions = () => {
  const navigate = useNavigate();

  const govFactions = factions.filter(f => !f.dangerous);
  const crimFactions = factions.filter(f => f.dangerous);

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime mb-6">
        ФРАКЦІЇ
      </h1>

      {/* Government */}
      <div className="space-y-3 mb-6">
        {govFactions.map((f, i) => (
          <div key={f.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <NeonCard
              className="flex items-center gap-4"
              glowColor="lime"
              onClick={() => navigate(`/factions/${f.id}`)}
              style={{ background: f.gradient, borderColor: f.color + "22" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: f.color + "22", border: `1px solid ${f.color}44`, color: f.color }}
              >
                {f.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{f.name}</h3>
                <p className="text-[10px] text-muted-foreground">Учасників: {f.members}</p>
              </div>
              <span
                className="text-[10px] font-medium px-3 py-1 rounded-lg"
                style={{ backgroundColor: f.color + "15", color: f.color, border: `1px solid ${f.color}22` }}
              >
                Детальніше →
              </span>
            </NeonCard>
          </div>
        ))}
      </div>

      {/* Criminal Sector */}
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-neon-red" />
        <h2 className="font-display text-xs font-bold tracking-wider text-neon-red uppercase">
          Небезпечні фракції
        </h2>
      </div>
      <div className="space-y-3">
        {crimFactions.map((f, i) => (
          <div key={f.id} className="animate-slide-up" style={{ animationDelay: `${(govFactions.length + i) * 50}ms` }}>
            <NeonCard
              className="flex items-center gap-4"
              glowColor="red"
              onClick={() => navigate(`/factions/${f.id}`)}
              style={{ background: f.gradient, borderColor: f.color + "22" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: f.color + "22", border: `1px solid ${f.color}44`, color: f.color }}
              >
                {f.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{f.name}</h3>
                <p className="text-[10px] text-muted-foreground">Учасників: {f.members}</p>
              </div>
              <span
                className="text-[10px] font-medium px-3 py-1 rounded-lg"
                style={{ backgroundColor: f.color + "15", color: f.color, border: `1px solid ${f.color}22` }}
              >
                Детальніше →
              </span>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factions;
