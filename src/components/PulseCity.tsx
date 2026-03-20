import { Users, Home, Shield, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { store } from "../lib/store";

const PulseCity = () => {
  const [pulse, setPulse] = useState({ citizens: 0, houses: 0, factions: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    store.getPulse().then(data => { setPulse(data); setLoaded(true); });
  }, []);

  const stats = [
    { icon: Users, label: "Гравців", value: pulse.citizens, color: "hsl(84, 81%, 44%)", glow: "0 0 12px hsl(84 81% 44% / 0.4)" },
    { icon: Home, label: "Куплено", value: pulse.houses, color: "hsl(45, 100%, 55%)", glow: "0 0 12px hsl(45 100% 55% / 0.4)" },
    { icon: Shield, label: "Фракцій", value: pulse.factions, color: "hsl(142, 71%, 45%)", glow: "0 0 12px hsl(142 71% 45% / 0.4)" },
  ];

  return (
    <div className="rounded-2xl p-[1px] overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.4), hsl(142 71% 45% / 0.2), hsl(45 100% 55% / 0.2), hsl(84 81% 44% / 0.4))" }}>
      <div className="rounded-2xl p-4 backdrop-blur-xl" style={{ background: "hsl(0 0% 0% / 0.7)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: "0 0 6px hsl(84 81% 44%)" }} />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-60" />
          </div>
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-display text-xs tracking-wider text-primary font-semibold">ПУЛЬС МІСТА</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 liquid-glass rounded-xl py-3 px-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: s.color.replace(")", " / 0.12)").replace("hsl(", "hsl("), boxShadow: s.glow }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span className="text-2xl font-black font-display"
                style={{ color: s.color, textShadow: `0 0 15px ${s.color.replace(")", " / 0.5)").replace("hsl(", "hsl(")}` }}>
                {loaded ? s.value : "—"}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PulseCity;
