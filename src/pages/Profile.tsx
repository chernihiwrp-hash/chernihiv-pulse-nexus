import { useState, useEffect, useCallback } from "react";
import {
  User, Briefcase, Home, Car, FileCheck, Wallet, Lock,
  Bell, ChevronDown, ChevronRight, Shield, CheckCircle,
  LogIn, RefreshCw, Coins, Clock
} from "lucide-react";
import GradientButton from "../components/GradientButton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { store, supabase, getBalance } from "../lib/store";
import type { Notification } from "../lib/store";

const getTelegramUser = () => {
  try {
    const tg = (window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } } } } }).Telegram;
    return tg?.WebApp?.initDataUnsafe?.user || null;
  } catch { return null; }
};

const Trident = () => (
  <svg viewBox="0 0 100 120" fill="currentColor" className="text-white w-full h-full opacity-[0.07]">
    <path d="M50 5 C50 5 42 15 42 28 C42 35 45 40 45 40 L35 40 C35 40 28 35 28 22 C28 10 35 5 35 5 L28 5 C28 5 18 12 18 28 C18 44 28 52 38 54 L38 100 L44 100 L44 60 L56 60 L56 100 L62 100 L62 54 C72 52 82 44 82 28 C82 12 72 5 72 5 L65 5 C65 5 72 10 72 22 C72 35 65 40 65 40 L55 40 C55 40 58 35 58 28 C58 15 50 5 50 5Z"/>
  </svg>
);

type ProfileData = {
  houses: { id: number; name: string; price: number }[];
  factionApps: { faction_name: string; status: string }[];
  licenses: { id: number; license_type: string; plate_number: string | null; status: string }[];
};

const statusColors: Record<string, string> = {
  approved: "text-primary", pending: "text-yellow-400", rejected: "text-destructive", review: "text-yellow-400",
};
const statusLabels: Record<string, string> = {
  approved: "Прийнято", pending: "На розгляді", rejected: "Відхилено", review: "На розгляді",
};

const Profile = () => {
  const navigate = useNavigate();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [isTg, setIsTg] = useState(false);
  const [tgUser, setTgUser] = useState<{ id: number; first_name: string; last_name?: string; username?: string; photo_url?: string } | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({ houses: [], factionApps: [], licenses: [] });
  const [balance, setBalanceState] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const nick = localStorage.getItem("crp_nick") || "Гравець";

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await store.getPlayerProfile(nick);
      setProfileData(data);
      setBalanceState(getBalance(nick));
      setNotifications(store.getNotifications());
    } catch (e) { console.error(e); }
    setRefreshing(false);
  }, [nick]);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) { setTgUser(user); setIsTg(true); }
    else {
      const tg = (window as Window & { Telegram?: { WebApp?: unknown } }).Telegram;
      if (tg?.WebApp) setIsTg(true);
    }
    loadData();
  }, [loadData]);

  const unread = notifications.filter(n => !n.read).length;
  const markRead = () => { const all = notifications.map(n => ({ ...n, read: true })); store.setNotifications(all); setNotifications(all); };
  const handleAdmin = () => {
    if (adminCode === "5319son") { navigate("/admin-panel"); toast.success("Доступ відкрито"); }
    else toast.error("Невірний код");
    setAdminCode(""); setShowAdminInput(false);
  };

  const name = tgUser ? `${tgUser.first_name}${tgUser.last_name ? " " + tgUser.last_name : ""}` : nick;
  const uid = tgUser ? String(tgUser.id) : "000001";
  const uname = tgUser?.username ? `@${tgUser.username}` : null;
  const regDate = new Date().toLocaleDateString("uk-UA");

  const activeFaction = profileData.factionApps.find(a => a.status === "approved")?.faction_name || null;
  const pendingFaction = profileData.factionApps.find(a => a.status === "pending")?.faction_name || null;
  const firstHouse = profileData.houses[0] || null;

  return (
    <div className="min-h-screen pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">ПРОФІЛЬ</h1>
        <div className="flex items-center gap-2">
          <button onClick={loadData} disabled={refreshing} className="w-9 h-9 liquid-glass rounded-xl flex items-center justify-center active:scale-95 transition-all">
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative w-9 h-9 liquid-glass rounded-xl flex items-center justify-center active:scale-95 transition-all">
            <Bell className="w-4 h-4 text-primary" />
            {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[8px] flex items-center justify-center text-white font-bold">{unread}</span>}
          </button>
        </div>
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
            : <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {notifications.slice(0, 8).map(n => (
                  <div key={n.id} className={`text-[10px] p-2 rounded-xl ${n.read ? "text-muted-foreground" : "text-foreground bg-primary/8 border border-primary/12"}`}>
                    <p>{n.text}</p><span className="text-[8px] text-muted-foreground">{n.date}</span>
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
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0"><LogIn className="w-4 h-4 text-primary" /></div>
            <div>
              <p className="text-sm font-semibold">Увійдіть через бота</p>
              <a href="https://t.me/CHERNIHIVSITE_BOT" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary font-medium">@CHERNIHIVSITE_BOT</a>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PASSPORT CARD ═══ */}
      <div className="mb-4 animate-fade-in">
        <div className="rounded-2xl overflow-hidden relative select-none"
          style={{
            border: "1px solid hsl(0 0% 100% / 0.12)",
            boxShadow: "0 8px 32px hsl(0 0% 0% / 0.5)",
          }}>

          {/* BG image */}
          <div className="absolute inset-0">
            <img
              src="https://i.ibb.co/NbX6ZNs/images-2.jpg"
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: 0.18 }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, hsl(240 15% 8% / 0.95) 0%, hsl(240 10% 5% / 0.92) 100%)" }} />
          </div>

          {/* Trident watermark */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-24 h-28 pointer-events-none">
            <Trident />
          </div>

          {/* Header strip */}
          <div className="relative flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.07)" }}>
            <div>
              <p className="text-[7px] text-muted-foreground/50 tracking-[0.3em] uppercase">Удостоверение</p>
              <p className="text-[8px] text-muted-foreground/70 tracking-[0.15em] font-semibold uppercase">Chernihiv RP</p>
            </div>
            <p className="text-[8px] text-muted-foreground/50 font-mono">#{uid.slice(-6)}</p>
          </div>

          {/* Main row */}
          <div className="relative px-4 py-3 flex items-start gap-3">
            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0" style={{ border: "1.5px solid hsl(0 0% 100% / 0.15)" }}>
              {tgUser?.photo_url ? (
                <img src={tgUser.photo_url} alt={name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "hsl(84 81% 44% / 0.08)" }}>
                  <User className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[7px] text-muted-foreground/40 tracking-[0.2em] uppercase mb-0.5">Ім'я</p>
              <p className="text-base font-bold text-foreground truncate mb-1.5">{name}</p>
              {uname && <p className="text-[9px] text-primary/50 mb-1.5">{uname}</p>}
              <p className="text-[7px] text-muted-foreground/40 tracking-[0.2em] uppercase mb-0.5">Статус</p>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3 h-3 text-primary shrink-0" />
                <span className="text-xs text-primary font-semibold">Верифіковано</span>
                <span className="text-[8px] text-muted-foreground/40">{regDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400/70" />
                <span className="text-[10px] font-semibold text-yellow-400/80">{balance} CR</span>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative px-4 pb-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.07)" }}>
              <Briefcase className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              <div>
                <p className="text-[7px] text-muted-foreground/40 uppercase tracking-wider">Фракція</p>
                <p className="text-[10px] font-medium text-foreground/80 truncate">
                  {activeFaction || (pendingFaction ? `${pendingFaction}...` : "Немає")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "hsl(0 0% 100% / 0.05)", border: "1px solid hsl(0 0% 100% / 0.07)" }}>
              <Home className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              <div>
                <p className="text-[7px] text-muted-foreground/40 uppercase tracking-wider">Дім</p>
                <p className="text-[10px] font-medium text-foreground/80 truncate">{firstHouse?.name || "Немає"}</p>
              </div>
            </div>
          </div>

          {/* Machine line */}
          <div className="relative px-4 py-1.5" style={{ borderTop: "1px solid hsl(0 0% 100% / 0.05)", background: "hsl(0 0% 100% / 0.02)" }}>
            <p className="text-[6px] text-muted-foreground/20 font-mono tracking-widest text-center truncate">
              CHERNIHIV RP &lt;&lt; {nick.toUpperCase()} &lt;&lt; {uid.slice(-8)}
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
              <p className="text-sm font-medium">Моя діяльність</p>
              <p className="text-[10px] text-muted-foreground">
                {activeFaction ? `Фракція: ${activeFaction}` : pendingFaction ? `Очікує: ${pendingFaction}` : "Немає активної діяльності"}
              </p>
            </div>
          </div>
          {showActivity ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showActivity && (
          <div className="mt-1 liquid-glass rounded-2xl p-4 animate-fade-in">
            {profileData.factionApps.length > 0 ? (
              <div className="space-y-2">
                {profileData.factionApps.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-foreground">{a.faction_name}</span>
                    </div>
                    <span className={`text-[10px] font-semibold ${statusColors[a.status] || "text-muted-foreground"}`}>
                      {statusLabels[a.status] || a.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground text-center py-2 mb-3">Немає активної діяльності</p>
                <GradientButton variant="green" className="w-full text-xs py-2" onClick={() => navigate("/factions")}>
                  Переглянути фракції
                </GradientButton>
              </div>
            )}
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
          <div className="px-4 py-3">
            {profileData.houses.length > 0 ? (
              <div className="space-y-2">
                {profileData.houses.map(h => (
                  <div key={h.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-foreground">{h.name}</span>
                    </div>
                    <span className="text-[10px] text-yellow-400 font-semibold">{h.price.toLocaleString()} CR</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">У вас поки немає домів</p>
            )}
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
          <div className="px-4 py-3">
            {profileData.licenses.length > 0 ? (
              <div className="space-y-1.5">
                {profileData.licenses.map(l => (
                  <div key={l.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-foreground">{l.license_type}</span>
                    </div>
                    {l.plate_number && <span className="text-[10px] font-mono text-yellow-400">{l.plate_number}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">Немає активних ліцензій</p>
            )}
          </div>
        </div>
      </div>

      {/* Адмін заявка */}
      <div className="mb-2">
        <button onClick={() => navigate("/admin-application")}
          className="w-full liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98] hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Заявка на адміністрацію</p>
              <p className="text-[10px] text-muted-foreground">Стань адміністратором</p>
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
