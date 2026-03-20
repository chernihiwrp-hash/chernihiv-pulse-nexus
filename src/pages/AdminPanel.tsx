import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import {
  Newspaper, Home, FileCheck, Users, Coins, Megaphone, Shield, Plus, Trash2,
  Check, X, Crosshair, ScrollText, Vote, AlertTriangle, ExternalLink,
  ShieldAlert, ChevronLeft, ChevronRight, Bug, Swords, UserX, HelpCircle,
  Link, Image, Type, Radio, UserCheck, Building2, Car, FileText, Gavel,
  MessageSquare, Wallet, ShieldCheck, Zap, RefreshCw, Crown, Lock, Eye,
  EyeOff, Settings, UserCog, Search, Star, Palette
} from "lucide-react";
import { toast } from "sonner";
import { store, supabase, getBalance, addBalance, subtractBalance } from "../lib/store";
import type {
  NewsItem, HouseItem, WantedPerson, FactionApplication, AdminApplication,
  CityVoiceItem, MayorCandidate, DocumentItem, SosMessage, LicenseApplication,
  HousePurchaseRequest
} from "../lib/store";

// ─── SUPER ADMIN ─────────────────────────────────────────────────────────────
const SUPER_ADMIN_NICK = "t1kron1x";

const normalizeNick = (nick: string) =>
  nick.toLowerCase()
    .replace(/[𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡]/g, c => {
      const map: Record<string, string> = {
        '𝘢':'a','𝘣':'b','𝘤':'c','𝘥':'d','𝘦':'e','𝘧':'f','𝘨':'g','𝘩':'h',
        '𝘪':'i','𝘫':'j','𝘬':'k','𝘭':'l','𝘮':'m','𝘯':'n','𝘰':'o','𝘱':'p',
        '𝘲':'q','𝘳':'r','𝘴':'s','𝘵':'t','𝘶':'u','𝘷':'v','𝘸':'w','𝘹':'x',
        '𝘺':'y','𝘻':'z','𝘈':'a','𝘉':'b','𝘊':'c','𝘋':'d','𝘌':'e','𝘍':'f',
        '𝘎':'g','𝘏':'h','𝘐':'i','𝘑':'j','𝘒':'k','𝘓':'l','𝘔':'m','𝘕':'n',
        '𝘖':'o','𝘗':'p','𝘘':'q','𝘙':'r','𝘚':'s','𝘛':'t','𝘜':'u','𝘝':'v',
        '𝘞':'w','𝘟':'x','𝘠':'y','𝘡':'z',
      };
      return map[c] || c;
    });

const isSuperAdmin = () =>
  normalizeNick(localStorage.getItem("crp_nick") || "") === SUPER_ADMIN_NICK;

// ─── PERMISSIONS ─────────────────────────────────────────────────────────────
type TabId =
  "sos" | "applications" | "factions" | "licenses" | "house_requests" |
  "news" | "houses" | "wanted" | "election" | "documents" |
  "add_faction" | "voice" | "tokens" | "manage_factions" | "debug";

const DEFAULT_PERMS: Record<TabId, boolean> = {
  sos: true, applications: true, factions: true, licenses: true,
  house_requests: true, news: true, houses: true, wanted: true,
  election: true, documents: true, add_faction: true, voice: true, tokens: true,
  manage_factions: true,
  debug: true,
};

const getAdminPerms = (nick: string): Record<TabId, boolean> => {
  try {
    const s = localStorage.getItem(`crp_perms_${normalizeNick(nick)}`);
    return s ? { ...DEFAULT_PERMS, ...JSON.parse(s) } : { ...DEFAULT_PERMS };
  } catch { return { ...DEFAULT_PERMS }; }
};
const saveAdminPerms = (nick: string, perms: Record<TabId, boolean>) =>
  localStorage.setItem(`crp_perms_${normalizeNick(nick)}`, JSON.stringify(perms));

// ─── TAB LIST ─────────────────────────────────────────────────────────────────
type Tab = TabId | "superadmin" | "restrictions";

const TAB_LIST: { id: TabId; label: string; icon: typeof Newspaper; sub: string; danger?: boolean }[] = [
  { id: "sos",           label: "SOS Сигнали",          icon: AlertTriangle, sub: "Realtime",    danger: true },
  { id: "applications",  label: "Заявки адміністратора", icon: Users,         sub: "Заявки" },
  { id: "factions",      label: "Заявки у фракції",      icon: Shield,        sub: "Заявки" },
  { id: "licenses",      label: "Ліцензії та номери",    icon: FileCheck,     sub: "Управління" },
  { id: "house_requests",label: "Купівля будинків",       icon: Home,          sub: "Управління" },
  { id: "news",          label: "Новини та оновлення",   icon: Newspaper,     sub: "Управління" },
  { id: "houses",        label: "Управління будинками",  icon: Building2,     sub: "Управління" },
  { id: "wanted",        label: "Розшук",                icon: Crosshair,     sub: "Управління", danger: true },
  { id: "election",      label: "Вибори мера",           icon: Vote,          sub: "Управління" },
  { id: "documents",     label: "Документи",             icon: ScrollText,    sub: "Управління" },
  { id: "add_faction",   label: "Додати фракцію",        icon: ShieldAlert,   sub: "Управління" },
  { id: "voice",         label: "Голос міста",           icon: Megaphone,     sub: "Управління" },
  { id: "tokens",        label: "Токени CR",             icon: Coins,         sub: "Фінанси" },
  { id: "manage_factions",label: "Управління фракціями",   icon: ShieldAlert,   sub: "Фракції" },
  { id: "debug",           label: "Діагностика",            icon: Settings,      sub: "Debug" },
];

const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdminPanel = () => {
  const [tab, setTab] = useState<Tab | null>(null);
  const superAdmin = isSuperAdmin();
  const nick = localStorage.getItem("crp_nick") || "";
  const perms = superAdmin ? DEFAULT_PERMS : getAdminPerms(nick);
  const allowedTabs = TAB_LIST.filter(t => superAdmin || perms[t.id]);

  // ── TAB CONTENT ──
  if (tab) {
    if (tab === "restrictions") {
      return (
        <div className="min-h-screen pb-20 px-4 pt-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setTab(null)} className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center active:scale-95">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(0 70% 50% / 0.15)", border: "1px solid hsl(0 70% 50% / 0.3)" }}>
              <Lock className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-wider text-destructive">ОБМЕЖЕННЯ АДМІНІВ</h1>
              <p className="text-[10px] text-muted-foreground">Управління доступом</p>
            </div>
          </div>
          <RestrictionsTab />
        </div>
      );
    }

    if (tab === "superadmin" && superAdmin) {
      return (
        <div className="min-h-screen pb-20 px-4 pt-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setTab(null)} className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center active:scale-95">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(45 100% 55% / 0.15)", border: "1px solid hsl(45 100% 55% / 0.3)" }}>
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-wider text-yellow-400">СУПЕР-АДМІН</h1>
              <p className="text-[10px] text-muted-foreground">Управління правами адмінів</p>
            </div>
          </div>
          <SuperAdminTab />
        </div>
      );
    }

    const current = TAB_LIST.find(t => t.id === tab);
    if (!current) return null;

    return (
      <div className="min-h-screen pb-20 px-4 pt-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setTab(null)} className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center active:scale-95">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${current.danger ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/15"}`}>
            <current.icon className={`w-4 h-4 ${current.danger ? "text-destructive" : "text-primary"}`} />
          </div>
          <div>
            <h1 className={`font-display text-sm font-bold tracking-wider ${current.danger ? "text-destructive" : "text-primary"}`}>
              {current.label.toUpperCase()}
            </h1>
            <p className="text-[10px] text-muted-foreground">Адмін панель</p>
          </div>
        </div>
        {tab === "sos"           && <SosTab />}
        {tab === "news"          && <NewsTab />}
        {tab === "houses"        && <HousesTab />}
        {tab === "wanted"        && <WantedTab />}
        {tab === "election"      && <ElectionTab />}
        {tab === "documents"     && <DocumentsTab />}
        {tab === "factions"      && <FactionAppsTab />}
        {tab === "applications"  && <AdminAppsTab />}
        {tab === "tokens"        && <TokensTab />}
        {tab === "voice"         && <VoiceTab />}
        {tab === "licenses"      && <LicensesTab />}
        {tab === "house_requests"&& <HouseRequestsTab />}
        {tab === "add_faction"   && <AddFactionTab />}
        {tab === "manage_factions" && <ManageFactionsTab />}
        {tab === "debug"           && <DebugTab />}
      </div>
    );
  }

  // ── MENU ──
  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <PageHeader title="АДМІН ПАНЕЛЬ" subtitle="Управління сервером" backTo="/profile" />

      {superAdmin && (
        <div className="mb-4 animate-fade-in">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, hsl(45 100% 55% / 0.1), hsl(45 100% 55% / 0.04))", border: "1px solid hsl(45 100% 55% / 0.25)", boxShadow: "0 0 20px hsl(45 100% 55% / 0.08)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(45 100% 55% / 0.15)", border: "1px solid hsl(45 100% 55% / 0.3)" }}>
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-400">Супер-адміністратор</p>
              <p className="text-[10px] text-muted-foreground">Повний доступ · Управління правами</p>
            </div>
            <button onClick={() => setTab("superadmin")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium active:scale-95 transition-all"
              style={{ background: "hsl(45 100% 55% / 0.15)", border: "1px solid hsl(45 100% 55% / 0.3)", color: "hsl(45 100% 55%)" }}>
              <UserCog className="w-3.5 h-3.5" /> Права
            </button>
          </div>
        </div>
      )}

      {/* Restrictions panel button */}
      <RestrictionsButton onOpen={() => setTab("restrictions")} />

      <div className="space-y-2 animate-fade-in">
        {allowedTabs.map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="w-full animate-slide-up" style={{ animationDelay: `${i * 35}ms` }}>
            <div className={`liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] ${t.danger ? "border-destructive/20 hover:border-destructive/30" : "hover:border-primary/20"}`}
              style={t.danger ? { boxShadow: "0 0 10px hsl(0 70% 50% / 0.07)" } : {}}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.danger ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/15"}`}>
                  <t.icon className={`w-5 h-5 ${t.danger ? "text-destructive" : "text-primary"}`} />
                </div>
                <div className="text-left">
                  <span className={`text-sm font-medium block ${t.danger ? "text-destructive" : "text-foreground"}`}>{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{t.sub}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}

        {allowedTabs.length === 0 && (
          <div className="text-center py-12 liquid-glass-card rounded-2xl">
            <Lock className="w-8 h-8 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Немає доступних розділів</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Зверніться до супер-адміна</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SUPER ADMIN TAB ──────────────────────────────────────────────────────────
const SuperAdminTab = () => {
  const [admins, setAdmins] = useState<{ nick: string; perms: Record<TabId, boolean> }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedNick, setSelectedNick] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<Record<TabId, boolean>>({ ...DEFAULT_PERMS });

  useEffect(() => {
    supabase.from("admin_applications").select("*").eq("status", "approved").then(({ data }) => {
      if (!data) return;
      const list = data.map((r: Record<string, unknown>) => {
        const fd = (r.form_data as Record<string, unknown>) || {};
        const n = (fd.nick as string) || (r.username as string) || "";
        return { nick: n, perms: getAdminPerms(n) };
      });
      setAdmins(list);
    });
  }, []);

  const filtered = admins.filter(a => a.nick.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (nick: string) => { setSelectedNick(nick); setEditPerms(getAdminPerms(nick)); };
  const savePerms = () => {
    if (!selectedNick) return;
    saveAdminPerms(selectedNick, editPerms);
    setAdmins(prev => prev.map(a => a.nick === selectedNick ? { ...a, perms: editPerms } : a));
    setSelectedNick(null);
    toast.success(`Права для ${selectedNick} збережено!`);
  };
  const toggleAll = (on: boolean) => {
    const p = {} as Record<TabId, boolean>;
    TAB_LIST.forEach(t => { p[t.id] = on; });
    setEditPerms(p);
  };

  if (selectedNick) return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4" style={{ background: "hsl(45 100% 55% / 0.06)", border: "1px solid hsl(45 100% 55% / 0.2)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold">{selectedNick}</span>
          </div>
          <button onClick={() => setSelectedNick(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Налаштуйте доступ до розділів</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => toggleAll(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-primary/25 bg-primary/10 text-primary active:scale-95">
          <Eye className="w-3.5 h-3.5" /> Всі ввімкнути
        </button>
        <button onClick={() => toggleAll(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-destructive/25 bg-destructive/10 text-destructive active:scale-95">
          <EyeOff className="w-3.5 h-3.5" /> Всі вимкнути
        </button>
      </div>
      <div className="space-y-2">
        {TAB_LIST.map(t => (
          <div key={t.id} className="liquid-glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.danger ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/15"}`}>
                <t.icon className={`w-4 h-4 ${t.danger ? "text-destructive" : "text-primary"}`} />
              </div>
              <span className="text-sm font-medium">{t.label}</span>
            </div>
            <button onClick={() => setEditPerms(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
              className={`relative w-12 h-6 rounded-full transition-all duration-200 ${editPerms[t.id] ? "bg-primary" : "bg-muted/40"}`}
              style={{ boxShadow: editPerms[t.id] ? "0 0 10px hsl(84 81% 44% / 0.4)" : "none" }}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${editPerms[t.id] ? "left-7" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>
      <GradientButton variant="green" className="w-full" onClick={savePerms}>
        <Check className="w-4 h-4 inline mr-2" /> Зберегти права
      </GradientButton>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-xs text-muted-foreground">Керуй доступом кожного адміністратора до розділів панелі.</p>
      <div className="liquid-glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук адміна..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-10 liquid-glass-card rounded-2xl">
          <Users className="w-7 h-7 text-muted-foreground opacity-20 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Схвалених адмінів немає</p>
        </div>
      )}
      {filtered.map((a, i) => {
        const cnt = Object.values(a.perms).filter(Boolean).length;
        return (
          <div key={a.nick} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <NeonCard glowColor="lime">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{a.nick}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(cnt / TAB_LIST.length * 100)}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{cnt}/{TAB_LIST.length}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => openEdit(a.nick)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium active:scale-95 bg-primary/15 border border-primary/25 text-primary">
                  <Settings className="w-3.5 h-3.5" /> Права
                </button>
              </div>
            </NeonCard>
          </div>
        );
      })}
    </div>
  );
};

// ─── SOS TAB ──────────────────────────────────────────────────────────────────
const sosTypes = [
  { id: "raid",    label: "РЕЙД",   icon: Swords,      color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { id: "cheater", label: "ЧИТЕР",  icon: Bug,          color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20" },
  { id: "nrp",     label: "НРП",    icon: UserX,        color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { id: "other",   label: "ІНШЕ",   icon: HelpCircle,   color: "text-muted-foreground", bg: "bg-muted/20 border-muted/30" },
];

const SosTab = () => {
  const [messages, setMessages] = useState<SosMessage[]>([]);
  useEffect(() => { store.getSos().then(setMessages); }, []);
  useEffect(() => {
    const ch = store.onNewSos(msg => { setMessages(prev => [msg, ...prev]); toast.error(`Новий SOS: ${msg.reason}`); });
    return () => { ch.unsubscribe(); };
  }, []);
  const getSosType = (type?: string) => sosTypes.find(t => t.id === type) || sosTypes[3];
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Активних: {messages.length}</p>
        <div className="flex items-center gap-1.5 text-[10px] text-primary"><Radio className="w-3 h-3 animate-pulse" /> Realtime</div>
      </div>
      {messages.length === 0 && (
        <div className="text-center py-12 liquid-glass-card rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-muted-foreground opacity-30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Немає активних сигналів</p>
        </div>
      )}
      {messages.map(m => {
        const st = getSosType(m.type);
        return (
          <NeonCard key={m.id} glowColor="red">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border mb-2 ${st.bg}`}>
                  <st.icon className={`w-3.5 h-3.5 ${st.color}`} />
                  <span className={`text-[10px] font-bold ${st.color}`}>{st.label}</span>
                </div>
                <p className="text-xs text-foreground">{m.description}</p>
                <p className="text-[9px] text-muted-foreground mt-1">{m.date}</p>
              </div>
              <button onClick={async () => { await store.resolveSos(m.id); setMessages(prev => prev.filter(x => x.id !== m.id)); toast.success("Вирішено"); }}
                className="ml-3 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-[10px] font-medium active:scale-95 flex items-center gap-1">
                <Check className="w-3 h-3" /> Вирішено
              </button>
            </div>
          </NeonCard>
        );
      })}
    </div>
  );
};

// ─── NEWS TAB ─────────────────────────────────────────────────────────────────
type NewsButton = { text: string; url: string; variant: "green" | "yellow" | "danger" | "cyan" };

const NewsTab = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState(""); const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState(""); const [type, setType] = useState<"news" | "update">("news");
  const [showBtn, setShowBtn] = useState(false); const [btnText, setBtnText] = useState("");
  const [btnUrl, setBtnUrl] = useState(""); const [btnVariant, setBtnVariant] = useState<NewsButton["variant"]>("green");
  useEffect(() => { store.getNews().then(setNews); }, []);
  const add = async () => {
    if (!title || !text) return toast.error("Заповніть поля");
    const btnData = showBtn && btnText ? JSON.stringify({ text: btnText, url: btnUrl, variant: btnVariant }) : undefined;
    await store.addNews(title, text, imageUrl || undefined, type, btnData);
    setTitle(""); setText(""); setImageUrl(""); setBtnText(""); setBtnUrl(""); setShowBtn(false);
    setNews(await store.getNews()); toast.success("Новину додано!");
  };
  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Нова публікація</h3>
        <div className="space-y-2.5">
          <div className="flex gap-2">
            {(["news", "update"] as const).map(t => {
              const Icon = t === "news" ? Newspaper : RefreshCw;
              return (<button key={t} onClick={() => setType(t)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${type === t ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}><Icon className="w-3.5 h-3.5" />{t === "news" ? "Новина" : "Оновлення"}</button>);
            })}
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок" className={inputClass} />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Текст публікації..." className={`${inputClass} resize-none h-24`} />
          <div className="liquid-glass rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2 mb-2"><Image className="w-3.5 h-3.5 text-primary" /><span className="text-xs text-muted-foreground">Фото по посиланню</span></div>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://i.imgur.com/..." className={inputClass} />
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-28 object-cover rounded-xl mt-2" onError={e => (e.currentTarget.style.display = "none")} />}
          </div>
          <div className="liquid-glass rounded-xl px-3 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><Link className="w-3.5 h-3.5 text-primary" /><span className="text-xs text-muted-foreground">Кнопка в пості</span></div>
              <button onClick={() => setShowBtn(!showBtn)} className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${showBtn ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{showBtn ? "Прибрати" : "Додати"}</button>
            </div>
            {showBtn && (
              <div className="space-y-2 mt-2">
                <input value={btnText} onChange={e => setBtnText(e.target.value)} placeholder="Текст кнопки" className={inputClass} />
                <input value={btnUrl} onChange={e => setBtnUrl(e.target.value)} placeholder="Посилання (https://...)" className={inputClass} />
                <div className="flex gap-2">
                  {([{v:"green",icon:Zap},{v:"yellow",icon:Coins},{v:"danger",icon:AlertTriangle},{v:"cyan",icon:Shield}] as const).map(({v,icon:Icon}) => (
                    <button key={v} onClick={() => setBtnVariant(v as NewsButton["variant"])}
                      className={`flex flex-col items-center gap-1 text-[9px] px-2 py-1.5 rounded-xl border transition-all ${btnVariant === v ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <GradientButton variant="green" className="w-full text-xs py-2.5" onClick={add}>Опублікувати</GradientButton>
        </div>
      </NeonCard>
      {news.map(n => {
        let btn: NewsButton | null = null;
        try { if ((n as NewsItem & { button_data?: string }).button_data) btn = JSON.parse((n as NewsItem & { button_data?: string }).button_data!); } catch {}
        const TypeIcon = n.type === "update" ? RefreshCw : Newspaper;
        return (
          <NeonCard key={n.id} glowColor="green">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-semibold">{n.title}</h4>
                  <div className={`flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded ${n.type === "update" ? "bg-blue-500/15 text-blue-400" : "bg-primary/15 text-primary"}`}>
                    <TypeIcon className="w-2.5 h-2.5" />{n.type === "update" ? "Оновлення" : "Новина"}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">{n.text}</p>
                {n.image && <img src={n.image} alt="" className="w-full h-20 object-cover rounded-lg mt-2" />}
                {btn && <div className="mt-2"><GradientButton variant={btn.variant} className="text-[10px] py-1.5 px-3">{btn.text}</GradientButton></div>}
              </div>
              <button onClick={async () => { await store.deleteNews(n.id); setNews(prev => prev.filter(x => x.id !== n.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95 ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </NeonCard>
        );
      })}
    </div>
  );
};

// ─── HOUSES TAB ───────────────────────────────────────────────────────────────
const HousesTab = () => {
  const [houses, setHouses] = useState<HouseItem[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [name, setName] = useState(""); const [price, setPrice] = useState("");
  const [desc, setDesc] = useState(""); const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Люкс");
  useEffect(() => { store.getHouses().then(setHouses); }, []);
  const add = async () => {
    if (!name || !price) return toast.error("Заповніть назву і ціну");
    await store.addHouse(name, desc, Number(price), imageUrl || undefined, category);
    setHouses(await store.getHouses());
    setName(""); setPrice(""); setDesc(""); setImageUrl(""); setAddMode(false);
    toast.success("Будинок додано!");
  };
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Будинків: {houses.length}</p>
        <button onClick={() => setAddMode(!addMode)} className="flex items-center gap-1.5 text-xs text-primary liquid-glass px-3 py-1.5 rounded-xl border border-primary/20 active:scale-95">
          <Plus className="w-3.5 h-3.5" /> Додати
        </button>
      </div>
      {addMode && (
        <NeonCard glowColor="lime">
          <div className="space-y-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва" className={inputClass} />
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Ціна (CR)" type="number" className={inputClass} />
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Опис" className={inputClass} />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Фото (https://...)" className={inputClass} />
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-20 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = "none")} />}
            <div className="flex gap-2">
              {["Люкс","Економ"].map(c => (<button key={c} onClick={() => setCategory(c)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${category === c ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{c}</button>))}
            </div>
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Додати</GradientButton>
          </div>
        </NeonCard>
      )}
      {houses.map(h => (
        <NeonCard key={h.id} glowColor="yellow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold">{h.name}</h4>
              <p className="text-[10px] text-muted-foreground">{h.desc}</p>
              <span className="text-xs font-bold" style={{ color: "hsl(45,100%,55%)" }}>{h.price.toLocaleString()} CR</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${h.owner ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>{h.owner ? "ПРОДАНО" : "ВІЛЬНО"}</span>
              <button onClick={async () => { await store.deleteHouse(h.id); setHouses(prev => prev.filter(x => x.id !== h.id)); toast.success("Видалено"); }} className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── HOUSE REQUESTS ───────────────────────────────────────────────────────────
const HouseRequestsTab = () => {
  const [requests, setRequests] = useState<HousePurchaseRequest[]>([]);
  useEffect(() => { store.getHousePurchaseRequests().then(setRequests); }, []);
  const decide = async (r: HousePurchaseRequest, status: "approved" | "rejected") => {
    await store.updateHousePurchaseStatus(r.id, status, r.house_id, r.username);
    setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status } : x));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };
  const sc = { pending: "bg-yellow-400/15 text-yellow-400", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { pending: "На розгляді", approved: "Схвалено", rejected: "Відхилено" };
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявок: {requests.length}</p>
      {requests.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><Building2 className="w-6 h-6 text-muted-foreground opacity-30 mx-auto mb-2" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
      {requests.map(r => (
        <NeonCard key={r.id} glowColor="yellow">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1"><Users className="w-3 h-3 text-muted-foreground" /><h4 className="text-xs font-semibold">{r.username}</h4></div>
              <div className="flex items-center gap-1.5"><Home className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{r.house_name}</p></div>
              <div className="flex items-center gap-1.5 mt-0.5"><Coins className="w-3 h-3 text-yellow-400" /><p className="text-[10px] text-yellow-400">{r.house_price?.toLocaleString()} CR</p></div>
              <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${sc[r.status]}`}>{sl[r.status]}</span>
            </div>
            {r.status === "pending" && (
              <div className="flex gap-1 ml-2">
                <button onClick={() => decide(r, "approved")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => decide(r, "rejected")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── LICENSES ────────────────────────────────────────────────────────────────
const LicensesTab = () => {
  const [apps, setApps] = useState<LicenseApplication[]>([]);
  useEffect(() => { store.getLicenseApplications().then(setApps); }, []);
  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateLicenseStatus(id, status);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };
  const sc = { pending: "bg-yellow-400/15 text-yellow-400", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { pending: "На розгляді", approved: "Схвалено", rejected: "Відхилено" };
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявок: {apps.length}</p>
      {apps.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><Car className="w-6 h-6 text-muted-foreground opacity-30 mx-auto mb-2" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1"><Users className="w-3 h-3 text-muted-foreground" /><h4 className="text-xs font-semibold">{a.username}</h4></div>
              <div className="flex items-center gap-1.5"><FileCheck className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{a.license_type}</p></div>
              {a.plate_number && <div className="flex items-center gap-1.5 mt-0.5"><Car className="w-3 h-3 text-yellow-400" /><p className="text-[10px] font-mono text-yellow-400">{a.plate_number}</p></div>}
              <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${sc[a.status]}`}>{sl[a.status]}</span>
            </div>
            {a.status === "pending" && (
              <div className="flex gap-1 ml-2">
                <button onClick={() => decide(a.id, "approved")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => decide(a.id, "rejected")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── WANTED ───────────────────────────────────────────────────────────────────
const WantedTab = () => {
  const [wanted, setWanted] = useState<WantedPerson[]>([]);
  const [name, setName] = useState(""); const [reason, setReason] = useState(""); const [stars, setStars] = useState(1);
  useEffect(() => { store.getWanted().then(setWanted); }, []);
  const add = async () => {
    if (!name || !reason) return toast.error("Заповніть поля");
    await store.addWanted(name, reason, stars);
    setWanted(await store.getWanted()); setName(""); setReason(""); setStars(1); toast.success("Додано!");
  };
  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="red">
        <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2"><Crosshair className="w-4 h-4" /> Додати до розшуку</h3>
        <div className="space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Нік гравця" className={inputClass} />
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Причина" className={inputClass} />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Рівень розшуку</label>
            <div className="flex gap-1">{[1,2,3,4,5].map(s => (<button key={s} onClick={() => setStars(s)} className={`transition-transform active:scale-90 ${s <= stars ? "scale-110" : "opacity-30"}`}><Star className={`w-5 h-5 ${s <= stars ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} /></button>))}</div>
          </div>
          <GradientButton variant="danger" className="w-full text-xs py-2" onClick={add}>Додати до розшуку</GradientButton>
        </div>
      </NeonCard>
      {wanted.map(w => (
        <NeonCard key={w.id} glowColor="red">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><UserX className="w-3 h-3 text-destructive" /><h4 className="text-xs font-semibold">{w.name}</h4></div>
              <p className="text-[10px] text-muted-foreground">{w.reason}</p>
              <div className="flex gap-0.5 mt-1">{Array.from({ length: w.stars }).map((_, j) => <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}</div>
            </div>
            <button onClick={async () => { await store.removeWanted(w.id); setWanted(prev => prev.filter(x => x.id !== w.id)); toast.success("Видалено"); }} className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── ELECTION ─────────────────────────────────────────────────────────────────
const ElectionTab = () => {
  const [candidates, setCandidates] = useState<MayorCandidate[]>([]);
  const [name, setName] = useState(""); const [program, setProgram] = useState(""); const [bio, setBio] = useState("");
  useEffect(() => { store.getCandidates().then(setCandidates); }, []);
  const add = async () => {
    if (!name || !program) return toast.error("Заповніть поля");
    await store.addCandidate(name, program, bio); setCandidates(await store.getCandidates());
    setName(""); setProgram(""); setBio(""); toast.success("Кандидата додано!");
  };
  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Vote className="w-4 h-4 text-primary" /> Додати кандидата</h3>
        <div className="space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Нік кандидата" className={inputClass} />
          <input value={program} onChange={e => setProgram(e.target.value)} placeholder="Програма" className={inputClass} />
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Біографія..." className={`${inputClass} resize-none h-16`} />
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Додати</GradientButton>
        </div>
      </NeonCard>
      {candidates.map(c => (
        <NeonCard key={c.id} glowColor="green">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><Gavel className="w-3 h-3 text-primary" /><h4 className="text-xs font-semibold">{c.name}</h4></div>
              <p className="text-[10px] text-muted-foreground">{c.program}</p>
              <div className="flex items-center gap-1 mt-1"><Vote className="w-3 h-3 text-primary" /><p className="text-[9px] text-primary">Голосів: {c.votes}</p></div>
            </div>
            <button onClick={async () => { await store.deleteCandidate(c.id); setCandidates(prev => prev.filter(x => x.id !== c.id)); toast.success("Видалено"); }} className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
const DocumentsTab = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [editId, setEditId] = useState<number | null>(null);
  useEffect(() => { store.getDocs().then(setDocs); }, []);
  const save = async () => {
    if (!title || !content) return toast.error("Заповніть поля");
    if (editId) { await store.updateDoc(editId, title, content); } else { await store.addDoc(title, content); }
    setDocs(await store.getDocs()); setTitle(""); setContent(""); setEditId(null); toast.success("Збережено!");
  };
  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <div className="space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Назва документу" className={inputClass} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Зміст..." className={`${inputClass} resize-none h-24`} />
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={save}>{editId ? "Зберегти" : "Додати документ"}</GradientButton>
        </div>
      </NeonCard>
      <a href="https://sleepmancybr.github.io/chernihiv" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 liquid-glass-card rounded-2xl px-4 py-3 text-xs text-primary">
        <ExternalLink className="w-4 h-4" /> Всі правила: sleepmancybr.github.io/chernihiv
      </a>
      {docs.map(d => (
        <NeonCard key={d.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1"><FileText className="w-3 h-3 text-primary" /><h4 className="text-xs font-semibold">{d.title}</h4></div>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{d.content}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={() => { setEditId(d.id); setTitle(d.title); setContent(d.content); }} className="p-1.5 rounded-lg liquid-glass text-primary active:scale-95"><Type className="w-3.5 h-3.5" /></button>
              <button onClick={async () => { await store.deleteDoc(d.id); setDocs(prev => prev.filter(x => x.id !== d.id)); toast.success("Видалено"); }} className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── FACTION APPS ─────────────────────────────────────────────────────────────
// ─── DEBUG TAB ────────────────────────────────────────────────────────────────
const DebugTab = () => {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 20));

  const testInsertFaction = async () => {
    addLog("⏳ Тестую faction_applications INSERT...");
    const { data, error } = await supabase.from("faction_applications").insert({
      faction_id: "test",
      faction_name: "Тест",
      username: "debug_user",
      status: "pending",
      form_data: { nick: "debug_user", roblox: "test", age: "18", telegram: "@test", experience: "", message: "test" },
    }).select();
    if (error) {
      addLog("❌ ПОМИЛКА: " + error.message);
      addLog("   Code: " + error.code);
      addLog("   Details: " + (error.details || "none"));
      addLog("   Hint: " + (error.hint || "none"));
    } else {
      addLog("✅ faction_applications — OK! id=" + (data?.[0]?.id || "?"));
      // Clean up test record
      if (data?.[0]?.id) {
        await supabase.from("faction_applications").delete().eq("id", data[0].id);
        addLog("🧹 Тестовий запис видалено");
      }
    }
  };

  const testInsertAdmin = async () => {
    addLog("⏳ Тестую admin_applications INSERT...");
    const { data, error } = await supabase.from("admin_applications").insert({
      username: "debug_user",
      status: "pending",
      form_data: { nick: "debug_user", roblox: "test", age: "18" },
    }).select();
    if (error) {
      addLog("❌ ПОМИЛКА: " + error.message);
      addLog("   Code: " + error.code);
      addLog("   Details: " + (error.details || "none"));
      addLog("   Hint: " + (error.hint || "none"));
    } else {
      addLog("✅ admin_applications — OK! id=" + (data?.[0]?.id || "?"));
      if (data?.[0]?.id) {
        await supabase.from("admin_applications").delete().eq("id", data[0].id);
        addLog("🧹 Тестовий запис видалено");
      }
    }
  };

  const testSelect = async () => {
    addLog("⏳ Тестую SELECT з обох таблиць...");
    const { data: fa, error: fe } = await supabase.from("faction_applications").select("id").limit(1);
    const { data: aa, error: ae } = await supabase.from("admin_applications").select("id").limit(1);
    if (fe) addLog("❌ faction_applications SELECT: " + fe.message);
    else addLog("✅ faction_applications SELECT OK, рядків: " + (fa?.length ?? 0));
    if (ae) addLog("❌ admin_applications SELECT: " + ae.message);
    else addLog("✅ admin_applications SELECT OK, рядків: " + (aa?.length ?? 0));
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-xs font-bold text-primary mb-3">Діагностика Supabase</h3>
        <div className="space-y-2 mb-4">
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={testSelect}>
            Перевірити SELECT (читання)
          </GradientButton>
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={testInsertFaction}>
            Тест INSERT faction_applications
          </GradientButton>
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={testInsertAdmin}>
            Тест INSERT admin_applications
          </GradientButton>
        </div>
        {log.length > 0 && (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {log.map((l, i) => (
              <div key={i} className="liquid-glass rounded-lg px-3 py-1.5">
                <p className="text-[10px] font-mono text-foreground">{l}</p>
              </div>
            ))}
          </div>
        )}
        {log.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center">Натисни кнопку — побачиш результат</p>
        )}
      </NeonCard>
    </div>
  );
};

const FactionAppsTab = () => {
  const [apps, setApps] = useState<FactionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await store.getFactionApps();
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const ch = store.onNewFactionApp(app => {
      setApps(prev => [app, ...prev]);
      toast.info(`Нова заявка від ${app.nick} у ${app.factionName}`);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateFactionAppStatus(id, status);
    const app = apps.find(a => a.id === id);
    store.addNotification(`Заявка у ${app?.factionName} ${status === "approved" ? "схвалена" : "відхилена"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const sc = { review: "bg-yellow-400/15 text-yellow-400", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Заявок: {apps.length}</p>
        <div className="flex items-center gap-2">
          <button onClick={load} className="liquid-glass px-2 py-1 rounded-lg active:scale-95">
            <RefreshCw className={`w-3 h-3 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] text-primary">
            <Radio className="w-3 h-3 animate-pulse" /> Realtime
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}
      {!loading && apps.length === 0 && (
        <div className="text-center py-10 liquid-glass-card rounded-2xl">
          <Shield className="w-6 h-6 text-muted-foreground opacity-30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Немає заявок</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">Перевір що таблиця faction_applications існує в Supabase</p>
        </div>
      )}

      {apps.map(a => (
        <NeonCard key={a.id} glowColor="green">
          <div className="space-y-2">
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className="w-3 h-3 text-primary" />
                  <h4 className="text-xs font-bold">{a.nick}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${sc[a.status]}`}>{sl[a.status]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <p className="text-[10px] text-primary font-medium">{a.factionName}</p>
                  <span className="text-[9px] text-muted-foreground">• {a.date}</span>
                </div>
              </div>
              {a.status === "review" && (
                <div className="flex gap-1 ml-2 shrink-0">
                  <button onClick={() => decide(a.id, "approved")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => decide(a.id, "rejected")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: "Roblox", value: a.roblox },
                { label: "Вік", value: a.age },
                { label: "Telegram", value: a.telegram },
              ].map(f => f.value ? (
                <div key={f.label} className="liquid-glass rounded-lg px-2 py-1">
                  <p className="text-[9px] text-muted-foreground">{f.label}</p>
                  <p className="text-[10px] font-medium text-foreground truncate">{f.value}</p>
                </div>
              ) : null)}
            </div>

            {/* Expand/collapse message */}
            {a.message && (
              <div>
                <button onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="text-[10px] text-primary flex items-center gap-1">
                  <ChevronRight className={`w-3 h-3 transition-transform ${expanded === a.id ? "rotate-90" : ""}`} />
                  {expanded === a.id ? "Згорнути" : "Показати відповіді"}
                </button>
                {expanded === a.id && (
                  <div className="mt-2 liquid-glass rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground whitespace-pre-wrap">{a.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// ─── ADMIN APPS ───────────────────────────────────────────────────────────────
const AdminAppsTab = () => {
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await store.getAdminApps();
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const ch = store.onNewAdminApp(app => {
      setApps(prev => [app, ...prev]);
      toast.info(`Нова заявка на адміна від ${app.nick}`);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateAdminAppStatus(id, status);
    store.addNotification(`Заявка на адміна ${status === "approved" ? "схвалена" : "відхилена"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const sc = { review: "bg-yellow-400/15 text-yellow-400", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Заявок: {apps.length}</p>
        <div className="flex items-center gap-2">
          <button onClick={load} className="liquid-glass px-2 py-1 rounded-lg active:scale-95">
            <RefreshCw className={`w-3 h-3 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] text-primary">
            <Radio className="w-3 h-3 animate-pulse" /> Realtime
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}
      {!loading && apps.length === 0 && (
        <div className="text-center py-10 liquid-glass-card rounded-2xl">
          <UserCheck className="w-6 h-6 text-muted-foreground opacity-30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Немає заявок</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">Перевір що таблиця admin_applications існує в Supabase</p>
        </div>
      )}

      {apps.map(a => (
        <NeonCard key={a.id} glowColor="lime">
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <UserCheck className="w-3 h-3 text-primary" />
                  <h4 className="text-xs font-bold">{a.nick}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${sc[a.status]}`}>{sl[a.status]}</span>
                </div>
                <p className="text-[9px] text-muted-foreground">{a.date}</p>
              </div>
              {a.status === "review" && (
                <div className="flex gap-1 ml-2 shrink-0">
                  <button onClick={() => decide(a.id, "approved")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => decide(a.id, "rejected")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: "Roblox", value: a.roblox },
                { label: "Вік", value: a.age },
                { label: "Країна", value: a.country },
                { label: "Telegram", value: a.telegram },
                { label: "Час/день", value: a.timePerDay },
                { label: "Мікрофон", value: a.hasMic ? "Так" : "Ні" },
                { label: "RP стаж", value: a.rpTime },
                { label: "RP знання", value: a.rpKnowledge ? `${a.rpKnowledge}/10` : "" },
              ].filter(f => f.value).map(f => (
                <div key={f.label} className="liquid-glass rounded-lg px-2 py-1">
                  <p className="text-[9px] text-muted-foreground">{f.label}</p>
                  <p className="text-[10px] font-medium text-foreground truncate">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Expand answers */}
            {(a.q1 || a.adminExp) && (
              <div>
                <button onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="text-[10px] text-primary flex items-center gap-1">
                  <ChevronRight className={`w-3 h-3 transition-transform ${expanded === a.id ? "rotate-90" : ""}`} />
                  {expanded === a.id ? "Згорнути відповіді" : "Показати відповіді на питання"}
                </button>
                {expanded === a.id && (
                  <div className="mt-2 space-y-2">
                    {[
                      { q: "Досвід адміністрування", a: a.adminExp },
                      { q: "Адмін порушує правила — дії?", a: a.q1 },
                      { q: "Гравець ображає в OOC — дії?", a: a.q2 },
                      { q: "Знайомий порушив правила?", a: a.q3 },
                      { q: "Чому хочеш бути адміном?", a: a.q4 },
                    ].filter(item => item.a).map(item => (
                      <div key={item.q} className="liquid-glass rounded-xl p-2.5">
                        <p className="text-[9px] text-primary mb-1">{item.q}</p>
                        <p className="text-[10px] text-foreground">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </NeonCard>
      ))}
    </div>
  );
};


// ─── GRADIENT BUILDER ──────────────────────────────────────────────────────────
const PRESET_COLORS = [
  { label: "Лайм", value: "#84cc16" },
  { label: "Зелений", value: "#22c55e" },
  { label: "Синій", value: "#3b82f6" },
  { label: "Блакитний", value: "#06b6d4" },
  { label: "Фіолетовий", value: "#a855f7" },
  { label: "Рожевий", value: "#ec4899" },
  { label: "Жовтий", value: "#eab308" },
  { label: "Помаранчевий", value: "#f97316" },
  { label: "Червоний", value: "#ef4444" },
  { label: "Сірий", value: "#6b7280" },
  { label: "Темний", value: "#1e293b" },
  { label: "Білий", value: "#e2e8f0" },
];

const FACTION_QUESTIONS_PRESETS = [
  "Чому хочеш вступити у фракцію?",
  "Який у тебе досвід в RP?",
  "Як ти поводитимешся з порушниками правил?",
  "Скільки часу на день граєш?",
  "Що знаєш про нашу фракцію?",
  "Опиши свій RP стиль",
];

type GradientStop = { color: string };

const GradientBuilder = ({ onChange }: { onChange: (gradient: string, color: string) => void }) => {
  const [stops, setStops] = useState<GradientStop[]>([{ color: "#22c55e" }, { color: "#0f172a" }]);
  const [angle, setAngle] = useState(135);

  const buildGradient = (s: GradientStop[], a: number) => {
    const stops2 = s.map((st, i) => {
      const pct = Math.round((i / Math.max(s.length - 1, 1)) * 100);
      // Convert to semi-transparent for neon look
      const hex = st.color;
      return `${hex}33 ${pct}%`;
    });
    return `linear-gradient(${a}deg, ${stops2.join(", ")})`;
  };

  useEffect(() => {
    const g = buildGradient(stops, angle);
    onChange(g, stops[0].color);
  }, [stops, angle]);

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="h-16 rounded-xl w-full transition-all"
        style={{ background: buildGradient(stops, angle), border: "1px solid hsl(0 0% 100% / 0.12)" }} />

      {/* Angle */}
      <div>
        <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider">Кут: {angle}°</label>
        <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))}
          className="w-full accent-primary h-2" />
        <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
          <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
        </div>
      </div>

      {/* Color stops */}
      <div>
        <label className="text-[10px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Кольори ({stops.length})</label>
        <div className="space-y-2">
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="color" value={stop.color}
                onChange={e => { const ns = [...stops]; ns[i] = { color: e.target.value }; setStops(ns); }}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent shrink-0" />
              <div className="flex flex-wrap gap-1 flex-1">
                {PRESET_COLORS.map(pc => (
                  <button key={pc.value} title={pc.label}
                    onClick={() => { const ns = [...stops]; ns[i] = { color: pc.value }; setStops(ns); }}
                    className={`w-5 h-5 rounded-md transition-all active:scale-90 ${stop.color === pc.value ? "ring-2 ring-white ring-offset-1 ring-offset-black" : ""}`}
                    style={{ background: pc.value }} />
                ))}
              </div>
              {stops.length > 2 && (
                <button onClick={() => setStops(stops.filter((_, j) => j !== i))}
                  className="text-muted-foreground text-xs liquid-glass px-2 py-1 rounded-lg shrink-0">✕</button>
              )}
            </div>
          ))}
        </div>
        {stops.length < 4 && (
          <button onClick={() => setStops([...stops, { color: "#0f172a" }])}
            className="mt-2 text-[10px] text-primary liquid-glass px-3 py-1.5 rounded-xl">
            + Додати колір
          </button>
        )}
      </div>
    </div>
  );
};

// ─── ADD FACTION ──────────────────────────────────────────────────────────────
const AddFactionTab = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [logoUrl, setLogoUrl] = useState("");
  const [gradient, setGradient] = useState("");
  const [section, setSection] = useState<"main" | "separate">("main");
  const [saving, setSaving] = useState(false);
  // Questionnaire
  const [questions, setQuestions] = useState<string[]>(["Чому хочеш вступити у фракцію?", "Який у тебе досвід в RP?"]);
  const [newQuestion, setNewQuestion] = useState("");

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([...questions, newQuestion.trim()]);
    setNewQuestion("");
  };
  const removeQuestion = (i: number) => setQuestions(questions.filter((_, j) => j !== i));

  const add = async () => {
    if (!name) return toast.error("Вкажіть назву");
    setSaving(true);
    // Save questionnaire as JSON in gradient field (extended)
    const meta = JSON.stringify({ questions });
    const ok = await store.addFaction(name, color, logoUrl || undefined, gradient || undefined, section);
    if (ok) {
      // Also save questions to localStorage for FactionDetail to read
      localStorage.setItem(`crp_faction_questions_${name.toLowerCase()}`, meta);
      setName(""); setColor("#22c55e"); setLogoUrl(""); setGradient("");
      setQuestions(["Чому хочеш вступити у фракцію?", "Який у тебе досвід в RP?"]);
      toast.success(`Фракцію "${name}" додано з анкетою!`);
    } else toast.error("Помилка збереження");
    setSaving(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <div className="space-y-4">
          {/* Section */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Розділ</label>
            <div className="flex gap-2">
              {([["main","Державна"],["separate","Кримінальна"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setSection(v)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${section === v ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>

          {/* Name + logo */}
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва фракції" className={inputClass} />
          <div className="flex gap-2">
            <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="Логотип (https://...)" className={`${inputClass} flex-1`} />
            {logoUrl && <img src={logoUrl} alt="" className="w-10 h-10 object-cover rounded-xl shrink-0" onError={e => (e.currentTarget.style.display = "none")} />}
          </div>

          {/* Gradient builder */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-semibold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Градієнт банера
            </label>
            <GradientBuilder onChange={(g, c) => { setGradient(g); setColor(c); }} />
          </div>

          {/* Questionnaire */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Анкета вступу
            </label>
            <div className="space-y-2 mb-2">
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 liquid-glass rounded-xl px-3 py-2">
                  <span className="text-[10px] text-primary font-bold w-4 shrink-0">{i + 1}.</span>
                  <span className="text-xs text-foreground flex-1">{q}</span>
                  <button onClick={() => removeQuestion(i)} className="text-muted-foreground hover:text-destructive transition-colors text-xs">✕</button>
                </div>
              ))}
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {FACTION_QUESTIONS_PRESETS.filter(p => !questions.includes(p)).slice(0, 4).map(p => (
                <button key={p} onClick={() => setQuestions([...questions, p])}
                  className="text-[9px] px-2 py-1 rounded-lg liquid-glass text-muted-foreground hover:text-primary transition-colors">
                  + {p.slice(0, 24)}...
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newQuestion} onChange={e => setNewQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addQuestion()}
                placeholder="Своє питання..." className={`${inputClass} flex-1 text-xs py-2`} />
              <button onClick={addQuestion} className="liquid-glass px-3 py-2 rounded-xl text-xs text-primary active:scale-95">+</button>
            </div>
          </div>

          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add} disabled={saving}>
            {saving ? "Зберігаю..." : "Додати фракцію"}
          </GradientButton>
        </div>
      </NeonCard>
    </div>
  );
};

// ─── TOKENS TAB ── ВИПРАВЛЕНО: реальна видача CR ──────────────────────────────
const TokensTab = () => {
  const [nick, setNick] = useState("");
  const [amount, setAmount] = useState("");
  const [currentBal, setCurrentBal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkBalance = () => {
    if (!nick.trim()) return;
    setCurrentBal(getBalance(nick.trim()));
  };

  const give = async () => {
    const n = nick.trim(); const a = parseInt(amount);
    if (!n || !a || a <= 0) return toast.error("Заповніть поля правильно");
    setLoading(true);
    await store.giveTokens(n, a);
    setCurrentBal(getBalance(n));
    toast.success(`+${a} CR видано гравцю ${n}! Баланс: ${getBalance(n)} CR`);
    setAmount("");
    setLoading(false);
  };

  const take = async () => {
    const n = nick.trim(); const a = parseInt(amount);
    if (!n || !a || a <= 0) return toast.error("Заповніть поля правильно");
    setLoading(true);
    const ok = await store.takeTokens(n, a);
    if (ok) {
      setCurrentBal(getBalance(n));
      toast.success(`-${a} CR знято у ${n}. Баланс: ${getBalance(n)} CR`);
    } else {
      toast.error(`Недостатньо CR у ${n}. Поточний баланс: ${getBalance(n)} CR`);
    }
    setAmount("");
    setLoading(false);
  };

  const reset = async () => {
    const n = nick.trim();
    if (!n) return;
    addBalance(n, -getBalance(n)); // reset to 0
    setCurrentBal(0);
    toast.success(`Баланс ${n} скинуто до 0`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" /> Управління токенами CR
        </h3>
        <div className="space-y-3">
          {/* Нік */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Нік гравця</label>
            <div className="flex gap-2">
              <input value={nick} onChange={e => { setNick(e.target.value); setCurrentBal(null); }}
                placeholder="Введіть нік" className={`${inputClass} flex-1`} />
              <button onClick={checkBalance} className="px-3 py-2 liquid-glass rounded-xl text-xs text-primary border border-primary/20 active:scale-95 whitespace-nowrap">
                Перевірити
              </button>
            </div>
          </div>

          {/* Поточний баланс */}
          {currentBal !== null && (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
              style={{ background: "hsl(84 81% 44% / 0.06)", border: "1px solid hsl(84 81% 44% / 0.15)" }}>
              <span className="text-xs text-muted-foreground">Поточний баланс</span>
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">{currentBal} CR</span>
              </div>
            </div>
          )}

          {/* Сума */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Кількість CR</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Наприклад: 500"
              type="number" min="1" className={inputClass} />
          </div>

          {/* Кнопки */}
          <div className="flex gap-2">
            <GradientButton variant="green" className="flex-1 text-xs py-2.5" onClick={give} disabled={loading}>
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Видати CR
            </GradientButton>
            <GradientButton variant="danger" className="flex-1 text-xs py-2.5" onClick={take} disabled={loading}>
              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Забрати CR
            </GradientButton>
          </div>

          {/* Скинути */}
          {currentBal !== null && currentBal > 0 && (
            <button onClick={reset} className="w-full text-xs text-muted-foreground liquid-glass rounded-xl py-2 border border-muted/20 active:scale-95">
              Скинути баланс до 0
            </button>
          )}
        </div>
      </NeonCard>

      {/* Підказка */}
      <div className="liquid-glass-card rounded-2xl p-4">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Баланс зберігається локально і синхронізується з профілем гравця. Гравець отримає сповіщення про нарахування/списання.
        </p>
      </div>
    </div>
  );
};

// ─── VOICE ────────────────────────────────────────────────────────────────────
const VoiceTab = () => {
  const [items, setItems] = useState<CityVoiceItem[]>([]);
  useEffect(() => { store.getCityVoice().then(setItems); }, []);
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Записів: {items.length}</p>
      {items.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><MessageSquare className="w-6 h-6 text-muted-foreground opacity-30 mx-auto mb-2" /><p className="text-xs text-muted-foreground">Немає записів</p></div>}
      {items.map(v => (
        <NeonCard key={v.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1"><MessageSquare className="w-3 h-3 text-muted-foreground" /><span className="text-[9px] text-muted-foreground uppercase">{v.type === "idea" ? "Ідея" : "Петиція"}</span></div>
              <p className="text-xs text-foreground">{v.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground">{v.author}</span>
                <div className="flex items-center gap-1"><Check className="w-3 h-3 text-primary" /><span className="text-[10px] text-primary">{v.likes}</span></div>
                <div className="flex items-center gap-1"><X className="w-3 h-3 text-destructive" /><span className="text-[10px] text-destructive">{v.dislikes}</span></div>
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={async () => { await store.updateCityVoiceStatus(v.id, "approved"); setItems(prev => prev.map(x => x.id === v.id ? { ...x, status: "approved" as const } : x)); toast.success("Схвалено"); }} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={async () => { await store.deleteCityVoice(v.id); setItems(prev => prev.filter(x => x.id !== v.id)); toast.success("Видалено"); }} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};


// ─── RESTRICTIONS BUTTON ─────────────────────────────────────────────────────
const RESTRICT_CODE = "son5319";

const RestrictionsButton = ({ onOpen }: { onOpen: () => void }) => {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");
  if (show) return (
    <div className="mb-4 animate-fade-in">
      <div className="rounded-2xl p-4 border border-destructive/20" style={{ background: "hsl(0 70% 50% / 0.05)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-destructive" />
          <span className="text-sm font-semibold text-foreground">Панель обмежень</span>
          <button onClick={() => { setShow(false); setCode(""); }} className="ml-auto text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Код доступу"
          type="password" className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-destructive/30 bg-transparent mb-3"
          onKeyDown={e => { if (e.key === "Enter" && code === RESTRICT_CODE) { setShow(false); setCode(""); onOpen(); } }} />
        <GradientButton variant="danger" className="w-full text-xs py-2" onClick={() => {
          if (code === RESTRICT_CODE) { setShow(false); setCode(""); onOpen(); }
          else { toast.error("Невірний код"); setCode(""); }
        }}>Увійти</GradientButton>
      </div>
    </div>
  );
  return (
    <div className="mb-4">
      <button onClick={() => setShow(true)}
        className="w-full flex items-center justify-center gap-2 text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors py-1.5">
        <Lock className="w-3 h-3" />
        <span className="text-[9px]">Панель обмежень</span>
      </button>
    </div>
  );
};

// ─── RESTRICTIONS TAB ─────────────────────────────────────────────────────────
const RestrictionsTab = () => {
  const [adminNick, setAdminNick] = useState("");
  const [found, setFound] = useState<{ nick: string; perms: Record<TabId, boolean> } | null>(null);
  const [editPerms, setEditPerms] = useState<Record<TabId, boolean>>({ ...DEFAULT_PERMS });
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!adminNick.trim()) return toast.error("Введіть нік адміна");
    setLoading(true);
    const { data } = await supabase
      .from("admin_applications")
      .select("*")
      .eq("status", "approved")
      .ilike("username", adminNick.trim());
    setLoading(false);
    if (!data || data.length === 0) return toast.error("Адміна не знайдено");
    const n = (data[0] as Record<string, unknown>).username as string || adminNick.trim();
    const perms = getAdminPerms(n);
    setFound({ nick: n, perms });
    setEditPerms(perms);
    toast.success(`Знайдено: ${n}`);
  };

  const save = () => {
    if (!found) return;
    saveAdminPerms(found.nick, editPerms);
    setFound({ ...found, perms: editPerms });
    toast.success(`Обмеження для ${found.nick} збережено!`);
  };

  const toggleAll = (on: boolean) => {
    const p = {} as Record<TabId, boolean>;
    TAB_LIST.forEach(t => { p[t.id] = on; });
    setEditPerms(p);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-xs text-muted-foreground">Введіть нік адміна щоб керувати його доступом до розділів панелі.</p>

      {/* Search */}
      <div className="flex gap-2">
        <input value={adminNick} onChange={e => setAdminNick(e.target.value)}
          placeholder="Нік адміна (точний)"
          className="flex-1 liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
          onKeyDown={e => e.key === "Enter" && search()} />
        <button onClick={search} disabled={loading}
          className="px-4 py-3 liquid-glass rounded-xl text-xs text-primary border border-primary/20 active:scale-95 whitespace-nowrap">
          {loading ? "..." : "Знайти"}
        </button>
      </div>

      {found && (
        <>
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: "hsl(0 70% 50% / 0.06)", border: "1px solid hsl(0 70% 50% / 0.2)" }}>
            <div className="w-9 h-9 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{found.nick}</p>
              <p className="text-[10px] text-muted-foreground">
                Активних розділів: {Object.values(editPerms).filter(Boolean).length}/{TAB_LIST.length}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => toggleAll(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs border border-primary/25 bg-primary/10 text-primary active:scale-95">
              <Eye className="w-3.5 h-3.5" /> Всі ввімкнути
            </button>
            <button onClick={() => toggleAll(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs border border-destructive/25 bg-destructive/10 text-destructive active:scale-95">
              <EyeOff className="w-3.5 h-3.5" /> Всі вимкнути
            </button>
          </div>

          <div className="space-y-2">
            {TAB_LIST.map(t => (
              <div key={t.id} className="liquid-glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.danger ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/15"}`}>
                    <t.icon className={`w-4 h-4 ${t.danger ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
                <button onClick={() => setEditPerms(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                  className={`relative w-12 h-6 rounded-full transition-all ${editPerms[t.id] ? "bg-primary" : "bg-muted/40"}`}
                  style={{ boxShadow: editPerms[t.id] ? "0 0 10px hsl(84 81% 44% / 0.4)" : "none" }}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editPerms[t.id] ? "left-7" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>

          <GradientButton variant="danger" className="w-full" onClick={save}>
            <Check className="w-4 h-4 inline mr-2" /> Зберегти обмеження
          </GradientButton>
        </>
      )}
    </div>
  );
};

// ─── MANAGE FACTIONS TAB ─────────────────────────────────────────────────────
const ManageFactionsTab = () => {
  const [factions, setFactions] = useState<{ id: number; name: string; color: string; section: string }[]>([]);
  const [apps, setApps] = useState<FactionApplication[]>([]);
  const [activeSection, setActiveSection] = useState<"factions" | "apps">("factions");
  const [loading, setLoading] = useState(true);

  // Форма анкети
  const [formFactionId, setFormFactionId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formFields, setFormFields] = useState<string[]>(["Нік", "Roblox", "Вік", "Telegram", "Досвід", "Чому хочу вступити"]);
  const [newField, setNewField] = useState("");
  const [showFormEditor, setShowFormEditor] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: f } = await supabase.from("factions").select("*").order("created_at", { ascending: true });
      setFactions((f || []) as { id: number; name: string; color: string; section: string }[]);
      setLoading(false);
    };
    load();
    store.getFactionApps().then(setApps);
  }, []);

  const deleteFaction = async (id: number, name: string) => {
    await store.deleteFaction(id);
    setFactions(prev => prev.filter(f => f.id !== id));
    toast.success(`Фракцію "${name}" видалено`);
  };

  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateFactionAppStatus(id, status);
    store.addNotification(`Заявка у фракцію ${status === "approved" ? "схвалена" : "відхилена"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const saveForm = () => {
    if (!formFactionId || !formTitle) return toast.error("Заповніть поля");
    const formConfig = { title: formTitle, fields: formFields };
    localStorage.setItem(`crp_form_${formFactionId}`, JSON.stringify(formConfig));
    toast.success("Анкету збережено!");
    setShowFormEditor(false);
  };

  const sc = { review: "bg-yellow-400/15 text-yellow-400", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };

  const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent";

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "factions", label: "Фракції" },
          { id: "apps", label: `Заявки (${apps.filter(a => a.status === "review").length})` },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${activeSection === t.id ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* FACTIONS LIST */}
      {activeSection === "factions" && (
        <div className="space-y-3">
          {loading && <div className="text-center py-8"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}
          {!loading && factions.length === 0 && (
            <div className="text-center py-10 liquid-glass-card rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-muted-foreground opacity-20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Немає фракцій в базі</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Додайте через "Додати фракцію"</p>
            </div>
          )}
          {factions.map(f => (
            <NeonCard key={f.id} glowColor="lime">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: f.color + "20", border: `1px solid ${f.color}40` }}>
                    <Shield className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground">{f.section === "main" ? "Державна" : "Кримінальна"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Редагувати анкету */}
                  <button onClick={() => {
                    setFormFactionId(String(f.id));
                    const saved = localStorage.getItem(`crp_form_${f.id}`);
                    if (saved) {
                      const cfg = JSON.parse(saved);
                      setFormTitle(cfg.title || f.name);
                      setFormFields(cfg.fields || []);
                    } else {
                      setFormTitle(`Анкета в ${f.name}`);
                      setFormFields(["Нік", "Roblox", "Вік", "Telegram", "Досвід", "Чому хочу вступити"]);
                    }
                    setShowFormEditor(true);
                  }} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95">
                    <Type className="w-3.5 h-3.5" />
                  </button>
                  {/* Видалити */}
                  <button onClick={() => deleteFaction(f.id, f.name)}
                    className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* APPS */}
      {activeSection === "apps" && (
        <div className="space-y-3">
          {apps.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><Shield className="w-6 h-6 text-muted-foreground opacity-30 mx-auto mb-2" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
          {apps.map(a => (
            <NeonCard key={a.id} glowColor="green">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1"><Users className="w-3 h-3 text-primary" /><h4 className="text-xs font-semibold">{a.nick}</h4></div>
                  <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{a.factionName}</p></div>
                  <p className="text-[10px] text-muted-foreground">Roblox: {a.roblox} | Вік: {a.age} | TG: {a.telegram}</p>
                  {a.message && <p className="text-[10px] text-muted-foreground mt-1 italic">"{a.message}"</p>}
                  <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${sc[a.status]}`}>{sl[a.status]}</span>
                </div>
                {a.status === "review" && (
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => decide(a.id, "approved")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => decide(a.id, "rejected")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* FORM EDITOR MODAL */}
      {showFormEditor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4" onClick={() => setShowFormEditor(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-2xl p-5 animate-fade-in liquid-glass-strong" onClick={e => e.stopPropagation()}
            style={{ border: "1px solid hsl(84 81% 44% / 0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-primary">Редактор анкети</h3>
              <button onClick={() => setShowFormEditor(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Назва анкети" className={inputClass} />
              <p className="text-[10px] text-muted-foreground">Поля анкети:</p>
              {formFields.map((field, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={field} onChange={e => {
                    const copy = [...formFields]; copy[i] = e.target.value; setFormFields(copy);
                  }} className={`${inputClass} flex-1`} />
                  <button onClick={() => setFormFields(prev => prev.filter((_, fi) => fi !== i))}
                    className="p-2 rounded-lg bg-destructive/15 text-destructive active:scale-95 shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={newField} onChange={e => setNewField(e.target.value)} placeholder="Нове поле..."
                  className={`${inputClass} flex-1`} onKeyDown={e => { if (e.key === "Enter" && newField) { setFormFields(p => [...p, newField]); setNewField(""); }}} />
                <button onClick={() => { if (newField) { setFormFields(p => [...p, newField]); setNewField(""); }}}
                  className="p-2 rounded-lg bg-primary/15 text-primary active:scale-95 shrink-0"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <GradientButton variant="green" className="w-full mt-4 text-xs py-2.5" onClick={saveForm}>
              <Check className="w-3.5 h-3.5 inline mr-1.5" /> Зберегти анкету
            </GradientButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
