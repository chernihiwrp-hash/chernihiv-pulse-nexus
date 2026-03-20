import { useState, useEffect } from "react";
import { Palette, Gift, Clock, Check, Zap, Home, Star, Crown, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";

type Theme = {
  id: string;
  name: string;
  price: number;
  color: string;
  gradient: string;
  icon: typeof Zap;
  desc: string;
};

const themes: Theme[] = [
  { id: "green", name: "Стандартна", price: 0, color: "hsl(84 81% 44%)", gradient: "linear-gradient(135deg, #4ade80, #22c55e)", icon: Zap, desc: "Базова зелена тема" },
  { id: "gold", name: "Золота", price: 500, color: "hsl(45 100% 55%)", gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)", icon: Crown, desc: "Преміум золота тема" },
  { id: "blue", name: "Синя", price: 300, color: "hsl(210 100% 60%)", gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)", icon: Droplets, desc: "Холодна синя тема" },
  { id: "red", name: "Червона", price: 400, color: "hsl(0 80% 55%)", gradient: "linear-gradient(135deg, #f87171, #ef4444)", icon: Zap, desc: "Агресивна червона тема" },
  { id: "white", name: "Біла", price: 600, color: "hsl(0 0% 90%)", gradient: "linear-gradient(135deg, #f1f5f9, #e2e8f0)", icon: Star, desc: "Чиста біла тема" },
];

const Casino = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"themes" | "houses" | "rewards">("themes");
  const [owned, setOwned] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("crp_owned_themes") || '["green"]'); } catch { return ["green"]; }
  });
  const [current, setCurrent] = useState<string>(() => localStorage.getItem("crp_theme") || "green");
  const [balance] = useState<number>(() => parseInt(localStorage.getItem("crp_balance") || "0"));
  const [lastReward, setLastReward] = useState<number>(() => parseInt(localStorage.getItem("crp_last_reward") || "0"));
  const [rewardLoading, setRewardLoading] = useState(false);

  const canClaimReward = Date.now() - lastReward > 24 * 60 * 60 * 1000;
  const timeLeft = () => {
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - lastReward);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}г ${m}хв`;
  };

  const buyTheme = (theme: Theme) => {
    if (owned.includes(theme.id)) {
      setCurrent(theme.id);
      localStorage.setItem("crp_theme", theme.id);
      toast.success(`Тему "${theme.name}" активовано!`);
      return;
    }
    if (balance < theme.price) {
      toast.error(`Недостатньо CR! Потрібно ${theme.price} CR`);
      return;
    }
    const newOwned = [...owned, theme.id];
    setOwned(newOwned);
    localStorage.setItem("crp_owned_themes", JSON.stringify(newOwned));
    setCurrent(theme.id);
    localStorage.setItem("crp_theme", theme.id);
    toast.success(`Тему "${theme.name}" куплено та активовано!`);
  };

  const claimReward = () => {
    if (!canClaimReward) return;
    setRewardLoading(true);
    setTimeout(() => {
      const newBalance = balance + 100;
      localStorage.setItem("crp_balance", String(newBalance));
      const now = Date.now();
      setLastReward(now);
      localStorage.setItem("crp_last_reward", String(now));
      setRewardLoading(false);
      toast.success("+100 CR нараховано!");
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">МАГАЗИН</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Теми та нагороди</p>
        </div>
        <div className="flex items-center gap-1.5 liquid-glass px-3 py-2 rounded-xl">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-bold text-primary">{balance} CR</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          { id: "themes", label: "Теми", icon: Palette },
          { id: "houses", label: "Будинки", icon: Home },
          { id: "rewards", label: "Нагороди", icon: Gift },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              activeTab === t.id ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* THEMES */}
      {activeTab === "themes" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">Оберіть тему інтерфейсу</p>
          {themes.map((theme, i) => {
            const isOwned = owned.includes(theme.id);
            const isActive = current === theme.id;
            const Icon = theme.icon;
            return (
              <div key={theme.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="rounded-2xl overflow-hidden"
                  style={{
                    background: isActive ? `${theme.color.replace("hsl(", "hsl(").replace(")", " / 0.08)")}` : "hsl(0 0% 0% / 0.4)",
                    border: `1px solid ${isActive ? theme.color.replace(")", " / 0.3)") : "hsl(0 0% 100% / 0.07)"}`,
                    backdropFilter: "blur(20px)"
                  }}>
                  <div className="flex items-center gap-3 p-4">
                    {/* Color preview */}
                    <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: theme.gradient, boxShadow: `0 0 16px ${theme.color.replace(")", " / 0.3)")}` }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{theme.name}</p>
                        {isActive && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium"
                            style={{ background: `${theme.color.replace(")", " / 0.15)")}`, color: theme.color, border: `1px solid ${theme.color.replace(")", " / 0.25)")}` }}>
                            Активна
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{theme.desc}</p>
                    </div>
                    {/* Button */}
                    <div className="shrink-0">
                      {theme.price === 0 || isOwned ? (
                        <button onClick={() => buyTheme(theme)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive ? "opacity-50 cursor-default" : "active:scale-95"
                          }`}
                          style={{
                            background: isActive ? "hsl(0 0% 100% / 0.05)" : `${theme.color.replace(")", " / 0.15)")}`,
                            border: `1px solid ${theme.color.replace(")", " / 0.25)")}`,
                            color: isActive ? "hsl(0 0% 50%)" : theme.color
                          }}
                          disabled={isActive}>
                          {isActive ? <><Check className="w-3 h-3" /> Активна</> : "Обрати"}
                        </button>
                      ) : (
                        <button onClick={() => buyTheme(theme)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all text-white"
                          style={{ background: theme.gradient, boxShadow: `0 0 12px ${theme.color.replace(")", " / 0.3)")}` }}>
                          <Zap className="w-3 h-3" /> {theme.price} CR
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HOUSES */}
      {activeTab === "houses" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(0 0% 100% / 0.07)", backdropFilter: "blur(20px)" }}>
            <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "hsl(0 0% 100% / 0.06)" }}>
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Нерухомість</p>
                <p className="text-[10px] text-muted-foreground">Будинки на продаж</p>
              </div>
            </div>
            <div className="p-4 text-center py-8">
              <Home className="w-10 h-10 text-muted-foreground opacity-20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">Переглядайте доступні будинки</p>
              <GradientButton variant="green" className="text-xs py-2 px-6" onClick={() => navigate("/houses")}>
                Переглянути будинки
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {/* REWARDS */}
      {activeTab === "rewards" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(84 81% 44% / 0.15)", backdropFilter: "blur(20px)" }}>
            <div className="p-5 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.2), hsl(142 71% 45% / 0.1))", border: "1px solid hsl(84 81% 44% / 0.25)", boxShadow: "0 0 20px hsl(84 81% 44% / 0.15)" }}>
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Щоденна нагорода</h3>
              <p className="text-xs text-muted-foreground mb-2">Заходь кожного дня і отримуй CR</p>
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-2xl font-black text-primary" style={{ textShadow: "0 0 15px hsl(84 81% 44% / 0.5)" }}>+100 CR</span>
              </div>

              {canClaimReward ? (
                <GradientButton variant="green" className="w-full" onClick={claimReward} disabled={rewardLoading}>
                  {rewardLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Clock className="w-4 h-4 animate-spin" /> Нараховую...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Gift className="w-4 h-4" /> Забрати нагороду
                    </span>
                  )}
                </GradientButton>
              ) : (
                <div className="liquid-glass rounded-2xl p-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Наступна нагорода через {timeLeft()}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, ((Date.now() - lastReward) / (24 * 60 * 60 * 1000)) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Casino;
