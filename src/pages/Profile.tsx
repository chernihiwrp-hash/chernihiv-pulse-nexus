import { useState, useEffect } from "react";
import {
  User, Briefcase, Home, Car, FileCheck, Wallet, Lock,
  Bell, ChevronDown, ChevronRight, Shield, CheckCircle, LogIn
} from "lucide-react";
import GradientButton from "../components/GradientButton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { store } from "../lib/store";
import type { Notification } from "../lib/store";

// Підхоплення аватарки і даних з Telegram WebApp
const getTelegramUser = () => {
  try {
    const tg = (window as Window & {
      Telegram?: {
        WebApp?: {
          initDataUnsafe?: {
            user?: {
              id: number;
              first_name: string;
              last_name?: string;
              username?: string;
              photo_url?: string;
            }
          }
        }
      }
    }).Telegram;
    if (tg?.WebApp?.initDataUnsafe?.user) return tg.WebApp.initDataUnsafe.user;
  } catch {}
  return null;
};

const Profile = () => {
  const navigate = useNavigate();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [isTg, setIsTg] = useState(false);
  const [tgUser, setTgUser] = useState<{
    id: number; first_name: string; last_name?: string;
    username?: string; photo_url?: string;
  } | null>(null);

  useEffect(() => {
    setNotifications(store.getNotifications());
    const user = getTelegramUser();
    if (user) { setTgUser(user); setIsTg(true); }
    else {
      const tg = (window as Window & { Telegram?: { WebApp?: unknown } }).Telegram;
      if (tg?.WebApp) setIsTg(true);
    }
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markRead = () => {
    const all = notifications.map(n => ({ ...n, read: true }));
    store.setNotifications(all);
    setNotifications(all);
  };

  const handleAdmin = () => {
    if (adminCode === "5319son") { navigate("/admin-panel"); toast.success("Доступ відкрито"); }
    else toast.error("Невірний код");
    setAdminCode(""); setShowAdminInput(false);
  };

  const name = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? " " + tgUser.last_name : ""}`
    : "Гравець";
  const uid = tgUser ? String(tgUser.id) : "0001";
  const uname = tgUser?.username ? `@${tgUser.username}` : null;

  return (
    <div className="min-h-screen pb-24 px-4 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">ПРОФІЛЬ</h1>
        <button onClick={() => setShowNotifs(!showNotifs)}
          className="relative w-9 h-9 liquid-glass rounded-xl flex items-center justify-center active:scale-95 transition-all">
          <Bell className="w-4 h-4 text-primary" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[8px] flex items-center justify-center text-white font-bold">{unread}</span>
          )}
        </button>
      </div>

      {/* Notifications */}
      {showNotifs && (
        <div className="mb-4 liquid-glass-card rounded-2xl p-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Сповіщення</span>
            {unread > 0 && <button onClick={markRead} className="text-[9px] text-primary">Прочитати всі</button>}
          </div>
          {notifications.length === 0
            ? <p className="text-xs text-muted-foreground text-center py-2">Немає сповіщень</p>
            : <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {notifications.slice(0, 6).map(n => (
                  <div key={n.id} className={`text-[10px] p-2 rounded-xl ${n.read ? "text-muted-foreground" : "text-foreground bg-primary/8 border border-primary/12"}`}>
                    <p>{n.text}</p>
                    <span className="text-[8px] text-muted-foreground">{n.date}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* Not Telegram */}
      {!isTg && (
        <div className="mb-4 rounded-2xl p-4 border border-primary/15 animate-fade-in liquid-glass">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Увійдіть через бота</p>
              <a href="https://t.me/CHERNIHIVSITE_BOT" target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-primary font-medium">@CHERNIHIVSITE_BOT</a>
            </div>
          </div>
        </div>
      )}

      {/* ===== PASSPORT CARD ===== */}
      <div className="mb-4 animate-fade-in">
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, hsl(0 0% 7%) 0%, hsl(0 0% 4%) 100%)",
            border: "1px solid hsl(84 81% 44% / 0.18)",
            boxShadow: "0 0 40px hsl(84 81% 44% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.06)"
          }}>

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.06] rounded-full -translate-y-1/2 translate-x-1/2"
              style={{ background: "radial-gradient(circle, hsl(84 81% 44%), transparent)" }} />
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-[0.04] rounded-full translate-y-1/2 -translate-x-1/2"
              style={{ background: "radial-gradient(circle, hsl(142 71% 45%), transparent)" }} />
          </div>

          {/* Top label */}
          <div className="flex items-center justify-between px-5 pt-3.5 pb-2 border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                style={{ boxShadow: "0 0 5px hsl(84 81% 44%)" }} />
              <span className="text-[8px] text-primary/60 font-semibold tracking-[0.25em] uppercase">Chernihiv RP · Посвідчення</span>
            </div>
            <span className="text-[8px] text-muted-foreground/60 font-mono">#{uid}</span>
          </div>

          {/* Content */}
          <div className="px-5 py-4 flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {tgUser?.photo_url ? (
                <img
                  src={tgUser.photo_url}
                  alt={name}
                  className="w-[68px] h-[68px] rounded-2xl object-cover"
                  style={{ border: "1.5px solid hsl(84 81% 44% / 0.3)", boxShadow: "0 0 16px hsl(84 81% 44% / 0.2)" }}
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, hsl(84 81% 44% / 0.1), hsl(142 71% 45% / 0.05))",
                    border: "1.5px solid hsl(84 81% 44% / 0.2)"
                  }}>
                  <User className="w-8 h-8 text-primary/40" />
                </div>
              )}
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "hsl(84 81% 44%)", boxShadow: "0 0 8px hsl(84 81% 44%)" }}>
                <CheckCircle className="w-2.5 h-2.5 text-black" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground truncate leading-snug">{name}</h2>
              {uname && <p className="text-[10px] text-primary/50 mt-0.5">{uname}</p>}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: "hsl(84 81% 44% / 0.1)", border: "1px solid hsl(84 81% 44% / 0.15)" }}>
                  <CheckCircle className="w-2.5 h-2.5 text-primary" />
                  <span className="text-[9px] text-primary font-medium">Верифіковано</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.07)" }}>
                  <Wallet className="w-2.5 h-2.5 text-primary" />
                  <span className="text-[9px] text-primary font-semibold">0 CR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="px-5 pb-4 grid grid-cols-2 gap-2">
            {[
              { icon: Briefcase, label: "Фракція", value: "Немає" },
              { icon: Car, label: "Авто", value: "Немає" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.05)" }}>
                <item.icon className="w-3 h-3 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[8px] text-muted-foreground">{item.label}</p>
                  <p className="text-[10px] font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Діяльність */}
      <div className="mb-2">
        <button onClick={() => setShowActivity(!showActivity)}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
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
            <p className="text-xs text-muted-foreground text-center py-2 mb-3">Немає активної діяльності</p>
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={() => navigate("/factions")}>
              Переглянути фракції
            </GradientButton>
          </div>
        )}
      </div>

      {/* Дома */}
      <div className="mb-2">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Мої дома</p>
            </div>
            <button onClick={() => navigate("/houses")} className="text-[10px] text-primary flex items-center gap-0.5">
              Переглянути <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 py-4 text-center">
            <Home className="w-7 h-7 text-muted-foreground opacity-20 mx-auto mb-1.5" />
            <p className="text-xs text-muted-foreground">У вас поки немає домів</p>
          </div>
        </div>
      </div>

      {/* Ліцензії */}
      <div className="mb-2">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Мої ліцензії</p>
            </div>
            <button onClick={() => navigate("/licenses")} className="text-[10px] text-primary flex items-center gap-0.5">
              Отримати <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">Немає активних ліцензій</p>
          </div>
        </div>
      </div>

      {/* Реєстрація */}
      <div className="mb-2">
        <button onClick={() => navigate("/admin-application")}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98] hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
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
        <div className="rounded-2xl p-3 border transition-all"
          style={{ borderColor: showAdminInput ? "hsl(84 81% 44% / 0.25)" : "hsl(0 0% 100% / 0.04)" }}>
          {showAdminInput ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold">Адмін доступ</span>
              </div>
              <input value={adminCode} onChange={e => setAdminCode(e.target.value)}
                placeholder="Код доступу" type="password"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
                onKeyDown={e => e.key === "Enter" && handleAdmin()} autoFocus />
              <div className="flex gap-2">
                <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={handleAdmin}>Увійти</GradientButton>
                <button onClick={() => { setShowAdminInput(false); setAdminCode(""); }}
                  className="liquid-glass rounded-xl px-4 py-2 text-xs text-muted-foreground">Скасувати</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdminInput(true)}
              className="w-full flex items-center justify-center gap-2 text-muted-foreground/20 hover:text-muted-foreground/40 transition-colors py-0.5">
              <Lock className="w-3 h-3" />
              <span className="text-[8px]">Адміністрація</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
