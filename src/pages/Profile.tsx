import { useState, useEffect } from "react";
import {
  User, Briefcase, Home, Car, FileCheck, Wallet, Lock,
  Bell, ChevronDown, ChevronRight, Shield, CheckCircle,
  Clock, MapPin, Star, LogIn, ChevronLeft
} from "lucide-react";
import GradientButton from "../components/GradientButton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { store } from "../lib/store";
import type { Notification } from "../lib/store";

const getTelegramUser = () => {
  try {
    const tg = (window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } } } } }).Telegram;
    if (tg?.WebApp?.initDataUnsafe?.user) return tg.WebApp.initDataUnsafe.user;
  } catch {}
  return null;
};

const Profile = () => {
  const navigate = useNavigate();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [isTelegramWeb, setIsTelegramWeb] = useState(false);
  const [tgUser, setTgUser] = useState<{ id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null>(null);

  useEffect(() => {
    setNotifications(store.getNotifications());
    const user = getTelegramUser();
    if (user) { setTgUser(user); setIsTelegramWeb(true); }
    else {
      const tg = (window as Window & { Telegram?: { WebApp?: unknown } }).Telegram;
      if (tg?.WebApp) setIsTelegramWeb(true);
    }
  }, []);

  const unread = notifications.filter(n => !n.read).length;
  const markRead = () => {
    const all = notifications.map(n => ({ ...n, read: true }));
    store.setNotifications(all);
    setNotifications(all);
  };
  const handleAdminAccess = () => {
    if (adminCode === "5319son") { navigate("/admin-panel"); toast.success("Доступ відкрито"); }
    else toast.error("Невірний код");
    setAdminCode(""); setShowAdminInput(false);
  };

  const displayName = tgUser ? `${tgUser.first_name}${tgUser.last_name ? " " + tgUser.last_name : ""}` : "Гравець";
  const displayId = tgUser ? `#${tgUser.id}` : "#0001";
  const username = tgUser?.username ? `@${tgUser.username}` : null;

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">ПРОФІЛЬ</h1>
        <button onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-9 h-9 liquid-glass rounded-xl flex items-center justify-center active:scale-95 transition-all">
          <Bell className="w-4 h-4 text-primary" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[8px] flex items-center justify-center text-white font-bold">{unread}</span>
          )}
        </button>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <div className="mb-4 liquid-glass-card rounded-2xl p-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Сповіщення</span>
            {unread > 0 && <button onClick={markRead} className="text-[9px] text-primary">Прочитати всі</button>}
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">Немає сповіщень</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {notifications.slice(0, 8).map(n => (
                <div key={n.id} className={`text-[10px] p-2 rounded-xl ${n.read ? "text-muted-foreground" : "text-foreground bg-primary/8 border border-primary/15"}`}>
                  <p>{n.text}</p>
                  <span className="text-[8px] text-muted-foreground">{n.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Not Telegram warning */}
      {!isTelegramWeb && (
        <div className="mb-4 rounded-2xl p-4 border border-primary/20 animate-fade-in"
          style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.06), hsl(0 0% 100% / 0.02))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <LogIn className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Увійдіть через бота</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Відкрийте через{" "}
                <a href="https://t.me/CHERNIHIVSITE_BOT" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">@CHERNIHIVSITE_BOT</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ID CARD */}
      <div className="mb-4 animate-fade-in">
        <div className="rounded-2xl border border-primary/15 overflow-hidden relative"
          style={{ background: "linear-gradient(160deg, hsl(0 0% 9%) 0%, hsl(0 0% 5%) 100%)", boxShadow: "0 0 30px hsl(84 81% 44% / 0.1)" }}>

          {/* BG glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(84 81% 44%), transparent 70%)" }} />
            <div className="absolute bottom-0 -left-4 w-20 h-20 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsl(142 71% 45%), transparent 70%)" }} />
          </div>

          {/* Header strip */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-white/[0.05]">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 6px hsl(84 81% 44%)" }} />
              <span className="text-[9px] text-primary/70 font-semibold tracking-[0.2em] uppercase">Посвідчення · Chernihiv RP</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">{displayId}</span>
          </div>

          {/* Main block */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-3 mb-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                {tgUser?.photo_url ? (
                  <img src={tgUser.photo_url} alt="Avatar"
                    className="w-[72px] h-[72px] rounded-2xl object-cover border-2 border-primary/25"
                    style={{ boxShadow: "0 0 14px hsl(84 81% 44% / 0.25)" }} />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-2xl border-2 border-primary/25 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.12), hsl(142 71% 45% / 0.06))" }}>
                    <User className="w-9 h-9 text-primary/50" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  style={{ boxShadow: "0 0 8px hsl(84 81% 44%)" }}>
                  <CheckCircle className="w-3 h-3 text-black" />
                </div>
              </div>

              {/* Name + info */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h2 className="text-base font-bold text-foreground leading-tight truncate">{displayName}</h2>
                {username && <p className="text-[10px] text-primary/60 mt-0.5">{username}</p>}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                    style={{ background: "hsl(84 81% 44% / 0.1)", border: "1px solid hsl(84 81% 44% / 0.18)" }}>
                    <CheckCircle className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[9px] text-primary font-medium">Верифіковано</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                    style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.08)" }}>
                    <Wallet className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[9px] text-primary font-semibold">0 CR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { icon: MapPin, label: "Локація", value: "Чернігів" },
                { icon: Star, label: "Рейтинг", value: "0" },
                { icon: Clock, label: "Статус", value: "Новий" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-2 text-center"
                  style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                  <s.icon className="w-3 h-3 text-muted-foreground mx-auto mb-1" />
                  <p className="text-[8px] text-muted-foreground">{s.label}</p>
                  <p className="text-[10px] font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Faction + car */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Briefcase, label: "Фракція", value: "Немає" },
                { icon: Car, label: "Авто", value: "Немає" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[8px] text-muted-foreground">{item.label}</p>
                    <p className="text-[10px] font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Моя діяльність */}
      <div className="mb-2">
        <button onClick={() => setShowActivity(!showActivity)}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Моя діяльність</p>
              <p className="text-[10px] text-muted-foreground">Немає активної діяльності</p>
            </div>
          </div>
          {showActivity ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showActivity && (
          <div className="mt-1 liquid-glass rounded-2xl p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground text-center py-3">Немає активної діяльності</p>
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={() => navigate("/factions")}>
              Переглянути фракції
            </GradientButton>
          </div>
        )}
      </div>

      {/* Мої дома */}
      <div className="mb-2">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Мої дома</p>
            </div>
            <button onClick={() => navigate("/houses")} className="text-[10px] text-primary flex items-center gap-0.5">
              Переглянути <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-5 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center mb-2">
              <Home className="w-6 h-6 text-muted-foreground opacity-30" />
            </div>
            <p className="text-xs text-muted-foreground">У вас поки немає домів</p>
            <p className="text-[10px] text-muted-foreground/60 text-center mt-0.5">Перейдіть у розділ "Будинки"</p>
          </div>
        </div>
      </div>

      {/* Ліцензії */}
      <div className="mb-2">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Мої ліцензії</p>
            </div>
            <button onClick={() => navigate("/licenses")} className="text-[10px] text-primary flex items-center gap-0.5">
              Отримати <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground text-center">Немає активних ліцензій</p>
          </div>
        </div>
      </div>

      {/* Реєстрація */}
      <div className="mb-2">
        <button onClick={() => navigate("/admin-application")}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98] hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Реєстрація</p>
              <p className="text-[10px] text-muted-foreground">Створити профіль гравця</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Прихований адмін */}
      <div className="mt-6">
        <div className="rounded-2xl p-4 border transition-all"
          style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.03), transparent)", borderColor: showAdminInput ? "hsl(84 81% 44% / 0.3)" : "hsl(0 0% 100% / 0.04)" }}>
          {showAdminInput ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Адмін доступ</span>
              </div>
              <input value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Код доступу" type="password"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
                onKeyDown={e => e.key === "Enter" && handleAdminAccess()} autoFocus />
              <div className="flex gap-2">
                <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={handleAdminAccess}>Увійти</GradientButton>
                <button onClick={() => { setShowAdminInput(false); setAdminCode(""); }}
                  className="liquid-glass rounded-xl px-4 py-2 text-xs text-muted-foreground">Скасувати</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdminInput(true)}
              className="w-full flex items-center justify-center gap-2 text-muted-foreground/25 hover:text-muted-foreground/45 transition-colors py-0.5">
              <Lock className="w-3 h-3" />
              <span className="text-[9px]">Адміністрація</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
