import NeonCard from "../components/NeonCard";

const factions = [
  { name: "СБУ", color: "hsl(220, 70%, 35%)", members: 3 },
  { name: "ДБР", color: "hsl(140, 60%, 35%)", members: 2 },
  { name: "НПУ", color: "hsl(210, 80%, 45%)", members: 4 },
  { name: "ВСУ", color: "hsl(140, 50%, 30%)", members: 5 },
  { name: "Прокуратура", color: "hsl(30, 50%, 35%)", members: 1 },
  { name: "ДСНС", color: "hsl(0, 70%, 45%)", members: 2 },
  { name: "ОРІОН", color: "hsl(263, 60%, 50%)", members: 3 },
  { name: "ГЕТТО", color: "hsl(0, 60%, 25%)", members: 4 },
  { name: "МАФІЯ", color: "hsl(270, 50%, 40%)", members: 2 },
  { name: "Суддя", color: "hsl(45, 80%, 50%)", members: 1 },
  { name: "Адвокати", color: "hsl(25, 80%, 50%)", members: 1 },
];

const Factions = () => {
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
            <NeonCard className="flex items-center gap-4">
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
              <button className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg font-medium card-press hover:bg-primary/20 transition-colors">
                Анкета
              </button>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factions;
