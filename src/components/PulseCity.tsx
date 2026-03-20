import { Users, Home, Shield, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/store";

const PulseCity = () => {
  const [data, setData] = useState({ citizens: 0, houses: 0, factions: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, housesRes, factionsRes] = await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("houses").select("id", { count: "exact", head: true }).eq("is_for_sale", false),
          supabase.from("faction_applications").select("id", { count: "exact", head: true }).eq("status", "approved"),
        ]);
        setData({
          citizens: usersRes.count || 0,
          houses: housesRes.count || 0,
          factions: factionsRes.count || 0,
        });
      } catch (e) {
        console.error("PulseCity error:", e);
      }
      setLoaded(true);
    };
    load();
  }, []);

  const stats = [
    { icon: Users, label: "Гравців", value: data.citizens, color: "hsl(84, 81%, 44%)", glow: "0 0 12px hsl(84 81% 44% / 0.4)" },
    { icon: Home, label: "Куплено", value: data.houses, color: "hsl(45, 100%, 55%)", glow: "0 0 12px hsl(45 100% 55% / 0.4)" },
    { icon: Shield, label: "У фракціях", value: data.factions, color: "hsl(142, 71%, 45%)", glow: "0 0 12px hsl(142 71% 45% / 0.4)" },
  ];

  return (
    <div className="rounded-2xl p-[1px] overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.4), hsl(142 71% 45% / 0.15), hsl(45 100% 55% / 0.15), hsl(84 81% 44% / 0.4))" }}>
      <div className="rounded-2xl p-4 backdrop-blur-xl" style={{ background: "hsl(0 0% 0% / 0.75)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" style={{ boxShadow: "0 0 6px hsl(84 81% 44%)" }} />
            <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping opacity-50" />
          </div>
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-display text-xs tracking-wider text-primary font-semibold">ПУЛЬС МІСТА</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center gap-2 liquid-glass rounded-xl py-3 px-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: s.color.replace("hsl(", "hsl(").replace(")", " / 0.12)"), boxShadow: s.glow }}>
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
