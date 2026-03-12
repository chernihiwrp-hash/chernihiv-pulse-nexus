import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";

const factions = [
  { id: "sbu", name: "СБУ", color: "hsl(220, 70%, 35%)", members: 3 },
  { id: "dbr", name: "ДБР", color: "hsl(140, 60%, 35%)", members: 2 },
  { id: "npu", name: "НПУ", color: "hsl(210, 80%, 45%)", members: 4 },
  { id: "vsu", name: "ВСУ", color: "hsl(140, 50%, 30%)", members: 5 },
  { id: "prosecutor", name: "Прокуратура", color: "hsl(30, 50%, 35%)", members: 1 },
  { id: "dsns", name: "ДСНС", color: "hsl(0, 70%, 45%)", members: 2 },
  { id: "orion", name: "ОРІОН", color: "hsl(263, 60%, 50%)", members: 3 },
  { id: "ghetto", name: "ГЕТТО", color: "hsl(0, 60%, 25%)", members: 4 },
  { id: "mafia", name: "МАФІЯ", color: "hsl(270, 50%, 40%)", members: 2 },
  { id: "judge", name: "Суддя", color: "hsl(45, 80%, 50%)", members: 1 },
  { id: "lawyers", name: "Адвокати", color: "hsl(25, 80%, 50%)", members: 1 },
];

const Factions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-green mb-6">
        ФРАКЦІЇ
      </h1>
      <div className="space-y-3">
        {factions.map((f, i) => (
          <div
            key={f.name}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <NeonCard className="flex items-center gap-4" onClick={() => navigate(`/factions/${f.id}`)}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: f.color + "33", border: `1px solid ${f.color}66` }}
              >
                <span style={{ color: f.color }}>{f.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{f.name}</h3>
                <p className="text-[10px] text-muted-foreground">
                  Учасників: {f.members}
                </p>
              </div>
              <span className="text-[10px] text-primary font-medium">Детальніше →</span>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factions;
