import { useState, useEffect } from "react";
import { Gift, Clock, Zap, Trophy, Star, Flame } from "lucide-react";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";
import { getBalance, addBalance } from "../lib/store";

// ─── THEME SYSTEM (exported for Casino.tsx) ───────────────────────────────────
export type ThemeId = "lime" | "neon_blue" | "cyber_red" | "gold_vip" | "purple_haze" | "arctic";

export interface Theme {
  id: ThemeId;
  name: string;
  price: number;
  preview: string;
  vars: Record<string, string>;
  bgGradient: string;
  description: string;
}

export const THEMES: Theme[] = [
  {
    id: "lime",
    name: "Lime (default)",
    price: 0,
    preview: "linear-gradient(135deg, hsl(84,81%,44%), hsl(142,71%,45%))",
    vars: { "--primary": "84 81% 44%", "--secondary": "142 71% 45%", "--accent": "84 81% 44%", "--ring": "84 81% 44%", "--neon-lime": "84 81% 44%" },
    bgGradient: "radial-gradient(ellipse 100% 50% at 50% 100%, hsl(142 71% 45% / 0.15) 0%, transparent 65%), radial-gradient(ellipse 70% 35% at 50% 100%, hsl(84 81% 44% / 0.1) 0%, transparent 55%)",
    description: "Класичний неоновий лайм",
  },
  {
    id: "neon_blue",
    name: "Neon Blue",
    price: 300,
    preview: "linear-gradient(135deg, hsl(210,100%,55%), hsl(200,90%,45%))",
    vars: { "--primary": "210 100% 55%", "--secondary": "200 90% 45%", "--accent": "210 100% 55%", "--ring": "210 100% 55%", "--neon-lime": "210 100% 55%" },
    bgGradient: "radial-gradient(ellipse 100% 50% at 50% 100%, hsl(210 100% 55% / 0.15) 0%, transparent 65%), radial-gradient(ellipse 70% 35% at 50% 100%, hsl(200 90% 45% / 0.1) 0%, transparent 55%)",
    description: "Електричний синій неон",
  },
  {
    id: "cyber_red",
    name: "Cyber Red",
    price: 300,
    preview: "linear-gradient(135deg, hsl(0,85%,55%), hsl(15,80%,45%))",
    vars: { "--primary": "0 85% 55%", "--secondary": "15 80% 45%", "--accent": "0 85% 55%", "--ring": "0 85% 55%", "--neon-lime": "0 85% 55%" },
    bgGradient: "radial-gradient(ellipse 100% 50% at 50% 100%, hsl(0 85% 55% / 0.15) 0%, transparent 65%), radial-gradient(ellipse 70% 35% at 50% 100%, hsl(15 80% 45% / 0.1) 0%, transparent 55%)",
    description: "Кіберпанк у червоному",
  },
  {
    id: "gold_vip",
    name: "Gold VIP",
    price: 750,
    preview: "linear-gradient(135deg, hsl(45,100%,55%), hsl(38,90%,45%))",
    vars: { "--primary": "45 100% 55%", "--secondary": "38 90% 45%", "--accent": "45 100% 55%", "--ring": "45 100% 55%", "--neon-lime": "45 100% 55%" },
    bgGradient: "radial-gradient(ellipse 100% 50% at 50% 100%, hsl(45 100% 55% / 0.15) 0%, transparent 65%), radial-gradient(ellipse 70% 35% at 50% 100%, hsl(38 90% 45% / 0.1) 0%, transparent 55%)",
    description: "VIP золото для обраних",
  },
  {
    id: "purple_haze",
    name: "Purple Haze",
    price: 500,
    preview: "linear-gradient(135deg, hsl(275,80%,60%), hsl(290,70%,50%))",
    vars: { "--primary": "275 80% 60%", "--secondary": "290 70% 50%", "--accent": "275 80% 60%", "--ring": "275 80% 60%", "--neon-lime": "275 80% 60%" },
    bgGradient: "radial-gradient(ellipse 100% 50% at 50% 100%, hsl(275 80% 60% / 0.15) 0%, transparent 65%), radial-gradient(ellipse 70% 35% at 50% 100%, hsl(290 70% 50% / 0.1) 0%, transparent 55%)",
    description: "Містичний фіолетовий",
  },
  {
    id: "arctic",
    name: "Arctic White",
    price: 400,
    preview: "linear-gradient(135deg, hsl(195,80%,70%), hsl(185,60%,55%))",
    vars: { "--primary": "195 80% 70%", "--secondary": "185 60% 55%", "--accent": "195 80% 70%", "--ring": "195 80% 70%", "--neon-lime": "195 80% 70%" },
    bgGradient: "radial-gradient(ellipse 100% 50% at 50% 100%, hsl(195 80% 70% / 0.15) 0%, transparent 65%), radial-gradient(ellipse 70% 35% at 50% 100%, hsl(185 60% 55% / 0.1) 0%, transparent 55%)",
    description: "Холодний арктичний лід",
  },
];

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  document.body.style.backgroundImage = theme.bgGradient;
  localStorage.setItem("crp_theme", theme.id);
};

export const loadSavedTheme = () => {
  const saved = localStorage.getItem("crp_theme") as ThemeId | null;
  if (saved) {
    const theme = THEMES.find(t => t.id === saved);
    if (theme) applyTheme(theme);
  }
};

// ─── SHOP PAGE — тільки нагороди ──────────────────────────────────────────────
const Shop = () => {
  const nick = localStorage.getItem("crp_nick") || "";
  const [balance, setBalance] = useState(() => getBalance(nick));
  const [lastReward, setLastReward] = useState(() => parseInt(localStorage.getItem("crp_last_reward") || "0"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("crp_streak") || "0"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const update = () => setBalance(getBalance(nick));
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, [nick]);

  const canClaim = Date.now() - lastReward > 24 * 60 * 60 * 1000;
  const timeLeft = () => {
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - lastReward);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}г ${m}хв`;
  };
  const progress = Math.min(100, ((Date.now() - lastReward) / (24 * 60 * 60 * 1000)) * 100);

  const claimReward = () => {
    if (!canClaim || loading) return;
    setLoading(true);
    setTimeout(() => {
      const bonus = streak >= 6 ? 200 : streak >= 3 ? 150 : 100;
      addBalance(nick, bonus);
      setBalance(getBalance(nick));
      const now = Date.now();
      const newStreak = streak + 1;
      setLastReward(now);
      setStreak(newStreak);
      localStorage.setItem("crp_last_reward", String(now));
      localStorage.setItem("crp_streak", String(newStreak));
      setLoading(false);
      toast.success(`+${bonus} CR нараховано! Серія: ${newStreak} днів`);
    }, 800);
  };

  const streakDays = [
    { day: 1, reward: 100, icon: Star },
    { day: 2, reward: 100, icon: Star },
    { day: 3, reward: 150, icon: Flame },
    { day: 4, reward: 150, icon: Flame },
    { day: 5, reward: 150, icon: Flame },
    { day: 6, reward: 200, icon: Trophy },
    { day: 7, reward: 200, icon: Trophy },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">НАГОРОДИ</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Щоденні бонуси</p>
        </div>
        <div className="flex items-center gap-1.5 liquid-glass px-3 py-2 rounded-xl"
          style={{ border: "1px solid hsl(var(--primary) / 0.2)" }}>
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-bold text-primary">{balance} CR</span>
        </div>
      </div>

      {/* Streak calendar */}
      <div className="liquid-glass-card rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-foreground">Серія: {streak} днів</span>
          {streak >= 3 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-orange-400/15 text-orange-400 border border-orange-400/20">
              Бонус активний
            </span>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {streakDays.map((d) => {
            const isDone = streak >= d.day;
            const isCurrent = streak + 1 === d.day;
            const Icon = d.icon;
            return (
              <div key={d.day} className={`flex flex-col items-center gap-1 rounded-xl py-2 transition-all ${
                isDone ? "bg-primary/15 border border-primary/25" :
                isCurrent ? "bg-primary/8 border border-primary/15" :
                "bg-muted/10 border border-white/5"
              }`}>
                <Icon className={`w-3.5 h-3.5 ${isDone ? "text-primary" : isCurrent ? "text-primary/60" : "text-muted-foreground/30"}`} />
                <span className={`text-[8px] font-bold ${isDone ? "text-primary" : isCurrent ? "text-primary/60" : "text-muted-foreground/30"}`}>
                  +{d.reward}
                </span>
                <span className={`text-[7px] ${isDone ? "text-primary/60" : "text-muted-foreground/30"}`}>Д{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main reward card */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(var(--primary) / 0.2)", backdropFilter: "blur(20px)" }}>
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.1))",
              border: "1px solid hsl(var(--primary) / 0.3)",
              boxShadow: "0 0 30px hsl(var(--primary) / 0.2)"
            }}>
            <Gift className="w-10 h-10 text-primary" style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }} />
            {canClaim && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-ping" />}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Щоденна нагорода</h3>
          <p className="text-xs text-muted-foreground mb-3">Заходь кожного дня і отримуй CR</p>
          <div className="flex items-center justify-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-3xl font-black text-primary"
              style={{ textShadow: "0 0 20px hsl(var(--primary) / 0.6)" }}>
              +{streak >= 6 ? 200 : streak >= 3 ? 150 : 100} CR
            </span>
          </div>
          {canClaim ? (
            <GradientButton variant="green" className="w-full text-base py-3" onClick={claimReward} disabled={loading}>
              {loading
                ? <><Clock className="w-5 h-5 inline mr-2 animate-spin" />Нараховую...</>
                : <><Gift className="w-5 h-5 inline mr-2" />Забрати нагороду</>
              }
            </GradientButton>
          ) : (
            <div className="liquid-glass rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2 mb-3 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Наступна через {timeLeft()}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                  style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">{Math.round(progress)}% до нагороди</p>
            </div>
          )}
        </div>
      </div>

      {/* Bonus info */}
      <div className="mt-4 space-y-2 animate-fade-in">
        {[
          { label: "1-2 дні поспіль", bonus: "+100 CR", color: "text-primary", bg: "bg-primary/8 border-primary/15" },
          { label: "3-5 днів поспіль", bonus: "+150 CR", color: "text-orange-400", bg: "bg-orange-400/8 border-orange-400/15" },
          { label: "6-7 днів поспіль", bonus: "+200 CR", color: "text-yellow-400", bg: "bg-yellow-400/8 border-yellow-400/15" },
        ].map(b => (
          <div key={b.label} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${b.bg}`}>
            <span className="text-xs text-muted-foreground">{b.label}</span>
            <span className={`text-xs font-bold ${b.color}`}>{b.bonus}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
