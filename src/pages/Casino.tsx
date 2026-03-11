import { Dices, Target, Hash, Spade, Rocket } from "lucide-react";
import NeonCard from "../components/NeonCard";

const games = [
  { icon: Dices, name: "Слоти", desc: "Крути барабан", color: "purple" as const },
  { icon: Target, name: "Кості", desc: "Кинь кубики", color: "green" as const },
  { icon: Hash, name: "Вгадай число", desc: "1–100", color: "purple" as const },
  { icon: Spade, name: "Блекджек", desc: "Класика", color: "green" as const },
  { icon: Rocket, name: "Ракета", desc: "Crash гра", color: "purple" as const },
];

const Casino = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-purple mb-2">
        КАЗИНО
      </h1>
      <p className="text-xs text-muted-foreground mb-6">Макс. виграш: 5000 CR / день</p>

      <div className="space-y-3">
        {games.map((g, i) => (
          <div
            key={g.name}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <NeonCard glowColor={g.color} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                g.color === "purple" ? "bg-secondary/20 border border-secondary/30" : "bg-primary/10 border border-primary/20"
              }`}>
                <g.icon className={`w-6 h-6 ${g.color === "purple" ? "text-secondary" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{g.name}</h3>
                <p className="text-[10px] text-muted-foreground">{g.desc}</p>
              </div>
              <span className="text-xs text-primary font-medium">Грати →</span>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Casino;
