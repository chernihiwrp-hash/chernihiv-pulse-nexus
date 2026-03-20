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

const getTelegramUser = () => {
  try {
    const tg = (window as Window & {
      Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } } } }
    }).Telegram;
    if (tg?.WebApp?.initDataUnsafe?.user) return tg.WebApp.initDataUnsafe.user;
  } catch {}
  return null;
};

// Ukraine trident SVG
const Trident = ({ opacity = 0.06 }: { opacity?: number }) => (
  <svg viewBox="0 0 100 120" fill="currentColor" style={{ opacity }} className="text-white">
    <path d="M50 5 C50 5 42 15 42 28 C42 35 45 40 45 40 L35 40 C35 40 28 35 28 22 C28 10 35 5 35 5 L28 5 C28 5 18 12 18 28 C18 44 28 52 38 54 L38 100 L44 100 L44 60 L56 60 L56 100 L62 100 L62 54 C72 52 82 44 82 28 C82 12 72 5 72 5 L65 5 C65 5 72 10 72 22 C72 35 65 40 65 40 L55 40 C55 40 58 35 58 28 C58 15 50 5 50 5Z"/>
  </svg>
);

const Profile = () => {
  const navigate = useNavigate();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [isTg, setIsTg] = useState(false);
  const [tgUser, setTgUser] = useState<{ id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null>(null);

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
    store.setNotifications(all); setNotifications(all);
  };
  const handleAdmin = () => {
    if (adminCode === "5319son") { navigate("/admin-panel"); toast.success("Доступ відкрито"); }
    else toast.error("Невірний код");
    setAdminCode(""); setShowAdminInput(false);
  };

  const name = tgUser ? `${tgUser.first_name}${tgUser.last_name ? " " + tgUser.last_name : ""}` : "Гравець";
  const uid = tgUser ? String(tgUser.id) : "000001";
  const uname = tgUser?.username ? `@${tgUser.username}` : null;

  return (
    <div className="min-h-screen pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">ПРОФІЛЬ</h1>
        <button onClick={() => setShowNotifs(!showNotifs)}
          className="relative w-9 h-9 liquid-glass rounded-xl flex items-center justify-center active:scale-95 transition-all">
          <Bell className="w-4 h-4 text-primary" />
          {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[8px] flex items-center justify-center text-white font-bold">{unread}</span>}
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
        <div className="mb-4 rounded-2xl p-4 border border-primary/15 liquid-glass animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Увійдіть через бота</p>
              <a href="https://t.me/CHERNIHIVSITE_BOT" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary font-medium">@CHERNIHIVSITE_BOT</a>
            </div>
          </div>
        </div>
      )}

      {/* ===== PASSPORT CARD ===== */}
      <div className="mb-4 animate-fade-in">
        <div className="rounded-2xl overflow-hidden relative select-none"
          style={{
            background: "linear-gradient(145deg, hsl(240 15% 11%) 0%, hsl(240 10% 7%) 100%)",
            border: "1px solid hsl(0 0% 100% / 0.1)",
            boxShadow: "0 8px 32px hsl(0 0% 0% / 0.4), 0 0 0 1px hsl(0 0% 100% / 0.05) inset"
          }}>

          {/* Watermark trident */}
          <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
            <div className="w-28 h-28"><Trident opacity={0.05} /></div>
          </div>

          {/* TOP LABEL */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2"
            style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.06)" }}>
            <div>
              <p className="text-[7px] text-muted-foreground/60 tracking-[0.3em] uppercase">Удостоверение</p>
              <p className="text-[8px] text-muted-foreground/80 tracking-[0.15em] font-semibold uppercase">Chernihiv RP</p>
            </div>
            <div className="text-right">
              <p className="text-[7px] text-muted-foreground/50">ID:</p>
              <p className="text-[9px] text-muted-foreground/70 font-mono">{uid}</p>
            </div>
          </div>

          {/* MAIN */}
          <div className="px-4 py-3 flex items-start gap-3">
            {/* Photo */}
            <div className="relative shrink-0">
              <div className="w-[76px] h-[76px] rounded-xl overflow-hidden"
                style={{ border: "1.5px solid hsl(0 0% 100% / 0.15)", boxShadow: "0 4px 12px hsl(0 0% 0% / 0.4)" }}>
                {tgUser?.photo_url ? (
                  <img src={tgUser.photo_url} alt={name} className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsl(240 15% 18%), hsl(240 10% 12%))" }}>
                    <User className="w-9 h-9 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              {/* ИМЯ label */}
              <p className="text-[7px] text-muted-foreground/50 tracking-[0.2em] uppercase mb-0.5">Ім'я</p>
              <p className="text-base font-bold text-foreground leading-tight truncate mb-2">{name}</p>

              {/* СТАТУС */}
              <p className="text-[7px] text-muted-foreground/50 tracking-[0.2em] uppercase mb-0.5">Статус</p>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-primary shrink-0" />
                <span className="text-xs text-primary font-semibold">Верифіковано</span>
                <span className="text-[9px] text-muted-foreground/50 ml-1">
                  {new Date().toLocaleDateString("uk-UA")}
                </span>
              </div>

              {/* Balance */}
              <div className="flex items-center gap-1 mt-2">
                <Wallet className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-[10px] text-muted-foreground/70">0 CR</span>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="px-4 pb-3 grid grid-cols-2 gap-2">
            {[
              { icon: Briefcase, label: "Фракція", value: "Немає" },
              { icon: Car, label: "Авто", value: "Немає" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
                <item.icon className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                <div>
                  <p className="text-[7px] text-muted-foreground/40 uppercase tracking-wider">{item.label}</p>
                  <p className="text-[10px] font-medium text-muted-foreground/70">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom strip like real document */}
          <div className="px-4 py-2" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.05)", background: "hsl(0 0% 100% / 0.02)" }}>
            <p className="text-[7px] text-muted-foreground/25 font-mono tracking-widest text-center">
              CHERNIHIV RP &lt;&lt; {name.toUpperCase().replace(/ /g, "<<")} &lt;&lt; {uid}
            </p>
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
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={() => navigate("/factions")}>Переглянути фракції</GradientButton>
          </div>
        )}
      </div>

      {/* Дома */}
      <div className="mb-2">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.04)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Мої дома</p>
            </div>
            <button onClick={() => navigate("/houses")} className="text-[10px] text-primary flex items-center gap-0.5">
              Переглянути <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 py-4 text-center">
            <Home className="w-6 h-6 text-muted-foreground opacity-15 mx-auto mb-1.5" />
            <p className="text-xs text-muted-foreground">У вас поки немає домів</p>
          </div>
        </div>
      </div>

      {/* Ліцензії */}
      <div className="mb-2">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.04)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium">Мої ліцензії</p>
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
              <p className="text-sm font-medium">Реєстрація</p>
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
