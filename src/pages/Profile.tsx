import { useState, useEffect } from "react";
import {
  User, Briefcase, Home, Car, FileCheck, Wallet, Lock, Bell,
  ChevronDown, ChevronRight, Settings, HelpCircle, Shield,
  CheckCircle, Clock, MapPin, Hash, Star, LogIn
} from "lucide-react";
import GradientButton from "../components/GradientButton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { store } from "../lib/store";
import type { Notification } from "../lib/store";

// Підхоплення даних Telegram WebApp
const getTelegramUser = () => {
  try {
    const tg = (window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } } } } }).Telegram;
    if (tg?.WebApp?.initDataUnsafe?.user) {
      return tg.WebApp.initDataUnsafe.user;
    }
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
  const [tgUser, setTgUser] = useState<{
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  } | null>(null);

  useEffect(() => {
    setNotifications(store.getNotifications());
    const user = getTelegramUser();
    if (user) {
      setTgUser(user);
      setIsTelegramWeb(true);
    } else {
      // Перевіряємо чи взагалі є Telegram WebApp
      const tg = (window as Window & { Telegram?: { WebApp?: unknown } }).Telegram;
      if (tg?.WebApp) {
        setIsTelegramWeb(true);
      }
    }
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markRead = () => {
    const all = notifications.map(n => ({ ...n, read: true }));
    store.setNotifications(all);
    setNotifications(all);
  };

  const handleAdminAccess = () => {
    if (adminCode === "5319son") {
      navigate("/admin-panel");
      toast.success("Доступ відкрито");
    } else {
      toast.error("Невірний код");
    }
    setAdminCode("");
    setShowAdminInput(false);
  };

  const displayName = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? " " + tgUser.last_name : ""}`
    : "Гравець";

  const displayId = tgUser ? `#${tgUser.id}` : "#0001";
  const username = tgUser?.username ? `@${tgUser.username}` : null;

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">ПРОФІЛЬ</h1>
        {unread > 0 && (
          <button onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 liquid-glass rounded-xl flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[8px] flex items-center justify-center text-white font-bold">{unread}</span>
          </button>
        )}
      </div>

      {/* Notifications dropdown */}
      {showNotifications && notifications.length > 0 && (
        <div className="mb-4 liquid-glass-card rounded-2xl p-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Сповіщення</span>
            <button onClick={markRead} className="text-[9px] text-primary">Прочитати всі</button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {notifications.slice(0, 8).map(n => (
              <div key={n.id} className={`text-[10px] p-2 rounded-xl ${n.read ? "text-muted-foreground" : "text-foreground bg-primary/8 border border-primary/15"}`}>
                <p>{n.text}</p>
                <span className="text-[8px] text-muted-foreground">{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Якщо не через Telegram — показуємо повідомлення */}
      {!isTelegramWeb && (
        <div className="mb-4 liquid-glass-card rounded-2xl p-4 border border-primary/20 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Увійдіть через бота</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Для повного доступу відкрийте через{" "}
                <a href="https://t.me/CHERNIHIVSITE_BOT" target="_blank" rel="noopener noreferrer"
                  className="text-primary font-medium">@CHERNIHIVSITE_BOT</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Passport / ID Card */}
      <div className="mb-4 animate-fade-in">
        <div className="rounded-2xl overflow-hidden border border-primary/20 relative"
          style={{ background: "linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 5%))", boxShadow: "0 0 30px hsl(84 81% 44% / 0.12)" }}>

          {/* Фонові glow частинки всередині паспорта */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-2 right-8 w-16 h-16 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(84 81% 44%), transparent)" }} />
            <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full opacity-8" style={{ background: "radial-gradient(circle, hsl(142 71% 45%), transparent)" }} />
            <div className="absolute top-1/2 right-4 w-8 h-8 rounded-full opacity-6" style={{ background: "radial-gradient(circle, hsl(84 81% 44%), transparent)" }} />
          </div>

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/5">
            <div>
              <p className="text-[8px] text-muted-foreground tracking-[0.3em] uppercase">Посвідчення</p>
              <p className="text-[9px] text-primary/70 tracking-[0.15em] font-semibold">CHERNIHIV RP</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-muted-foreground">ID</p>
              <p className="text-[10px] text-primary font-mono font-bold">{displayId}</p>
            </div>
          </div>

          {/* Main content */}
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div className="relative">
                {tgUser?.photo_url ? (
                  <img src={tgUser.photo_url} alt="Avatar"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30"
                    style={{ boxShadow: "0 0 16px hsl(84 81% 44% / 0.3)" }} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-2 border-primary/30 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.15), hsl(142 71% 45% / 0.08))", boxShadow: "0 0 16px hsl(84 81% 44% / 0.2)" }}>
                    <User className="w-10 h-10 text-primary/60" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  style={{ boxShadow: "0 0 8px hsl(84 81% 44%)" }}>
                  <CheckCircle className="w-3 h-3 text-black" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground leading-tight">{displayName}</h2>
                {username && <p className="text-[10px] text-primary/70 mt-0.5">{username}</p>}
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ background: "hsl(84 81% 44% / 0.12)", border: "1px solid hsl(84 81% 44% / 0.2)" }}>
                    <CheckCircle className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[9px] text-primary font-medium">Верифіковано</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Wallet className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-bold">0 CR</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: MapPin, label: "Локація", value: "Чернігів" },
                { icon: Star, label: "Рейтинг", value: "0" },
                { icon: Clock, label: "Онлайн", value: "Новий" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.07)" }}>
                  <s.icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                  <p className="text-[10px] font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Briefcase, label: "Фракція", value: "Немає" },
                { icon: Car, label: "Авто", value: "Немає" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.07)" }}>
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground">{item.label}</p>
                    <p className="text-[10px] font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Моя діяльність */}
      <div className="mb-3">
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
            <p className="text-xs text-muted-foreground text-center py-4">Немає активної діяльності. Подайте заявку у фракцію!</p>
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={() => navigate("/factions")}>
              Переглянути фракції
            </GradientButton>
          </div>
        )}
      </div>

      {/* Мої дома */}
      <div className="mb-3">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Мої дома</p>
          </div>
          <div className="p-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center mb-3">
              <Home className="w-7 h-7 text-muted-foreground opacity-40" />
            </div>
            <p className="text-xs font-medium text-foreground mb-1">У вас поки немає домів</p>
            <p className="text-[10px] text-muted-foreground text-center mb-4">Перейдіть у розділ "Будинки" щоб вибрати дім</p>
            <GradientButton variant="green" className="text-xs py-2 px-5" onClick={() => navigate("/houses")}>
              Переглянути будинки
            </GradientButton>
          </div>
        </div>
      </div>

      {/* Ліцензії */}
      <div className="mb-3">
        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Мої ліцензії</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-3">Немає активних ліцензій</p>
            <GradientButton variant="green" className="text-xs py-2 px-5" onClick={() => navigate("/licenses")}>
              Отримати ліцензію
            </GradientButton>
          </div>
        </div>
      </div>

      {/* Меню дій */}
      <div className="space-y-2 mb-4">
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

        <button onClick={() => toast.info("Налаштування в розробці")}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98] hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted/30 border border-white/8 flex items-center justify-center">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Налаштування</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button onClick={() => toast.info("Підтримка: @CHERNIHIVSITE_BOT")}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98] hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted/30 border border-white/8 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Допомога</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Прихований вхід в адмін */}
      <div className="mt-4">
        <div className="rounded-2xl p-4 border transition-all"
          style={{
            background: "linear-gradient(135deg, hsl(84 81% 44% / 0.04), hsl(0 0% 100% / 0.02))",
            borderColor: showAdminInput ? "hsl(84 81% 44% / 0.3)" : "hsl(0 0% 100% / 0.05)",
          }}>
          {showAdminInput ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Адмін доступ</span>
              </div>
              <input
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
                placeholder="Код доступу"
                type="password"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
                onKeyDown={e => e.key === "Enter" && handleAdminAccess()}
                autoFocus
              />
              <div className="flex gap-2">
                <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={handleAdminAccess}>Увійти</GradientButton>
                <button onClick={() => { setShowAdminInput(false); setAdminCode(""); }}
                  className="liquid-glass rounded-xl px-4 py-2 text-xs text-muted-foreground">Скасувати</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdminInput(true)}
              className="w-full flex items-center justify-center gap-2 text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors py-1">
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
