import { Dices, Target, Hash, Spade, Rocket, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";

const games = [
  { icon: Dices, name: "Слоти", desc: "Крути барабан", gradient: "linear-gradient(135deg, hsl(263,86%,65%,0.2), hsl(330,100%,60%,0.1))", color: "hsl(263,86%,65%)", path: "/casino/slots" },
  { icon: Target, name: "Кості", desc: "Кинь кубики", gradient: "linear-gradient(135deg, hsl(142,71%,45%,0.2), hsl(180,100%,50%,0.1))", color: "hsl(142,71%,45%)", path: "/casino/dice" },
  { icon: Hash, name: "Вгадай число", desc: "1–100", gradient: "linear-gradient(135deg, hsl(330,100%,60%,0.2), hsl(263,86%,65%,0.1))", color: "hsl(330,100%,60%)", path: "/casino/guess" },
  { icon: Spade, name: "Блекджек", desc: "Класика", gradient: "linear-gradient(135deg, hsl(45,100%,55%,0.2), hsl(30,100%,55%,0.1))", color: "hsl(45,100%,55%)", path: "/casino/blackjack" },
  { icon: Rocket, name: "Ракета", desc: "Crash гра", gradient: "linear-gradient(135deg, hsl(0,70%,50%,0.2), hsl(330,100%,60%,0.1))", color: "hsl(0,70%,50%)", path: "/casino/rocket" },
];

const Casino = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-secondary" />
        <h1 className="font-display text-xl font-bold tracking-wider neon-text-purple">
          КАЗИНО
        </h1>
      </div>
      <p className="text-xs text-muted-foreground mb-1">Макс. виграш: 5000 CR / день</p>
      <p className="text-[10px] text-muted-foreground/60 mb-6">Ліміт: 30 спінів / день</p>

      <div className="space-y-3">
        {games.map((g, i) => (
          <div
            key={g.name}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <NeonCard
              className="flex items-center gap-4"
              onClick={() => navigate(g.path)}
              style={{ background: g.gradient, borderColor: g.color + "22" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: g.color + "22", border: `1px solid ${g.color}44` }}
              >
                <g.icon className="w-7 h-7" style={{ color: g.color }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{g.name}</h3>
                <p className="text-[10px] text-muted-foreground">{g.desc}</p>
              </div>
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: g.color + "15", color: g.color, border: `1px solid ${g.color}22` }}
              >
                Грати →
              </span>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Casino;
