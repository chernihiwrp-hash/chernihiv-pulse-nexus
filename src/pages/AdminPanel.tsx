import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import {
  Newspaper, Home, FileCheck, Users, Coins, Megaphone, Shield, Plus, Trash2,
  Check, X, Crosshair, ScrollText, Vote, AlertTriangle, ExternalLink,
  ShieldAlert, ChevronLeft, ChevronRight, Bug, Swords, UserX, HelpCircle,
  Link, Image, Type, Radio, UserCheck, Building2, Car, FileText, Gavel,
  MessageSquare, Wallet, ShieldCheck, Zap, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { store } from "../lib/store";
import type {
  NewsItem, HouseItem, WantedPerson, FactionApplication, AdminApplication,
  CityVoiceItem, MayorCandidate, DocumentItem, SosMessage, LicenseApplication, HousePurchaseRequest
} from "../lib/store";

type Tab = "news" | "houses" | "wanted" | "factions" | "applications" | "tokens" | "voice" | "election" | "documents" | "sos" | "licenses" | "house_requests" | "add_faction";

const TAB_LIST: { id: Tab; label: string; icon: typeof Newspaper; subIcon: typeof Newspaper; danger?: boolean }[] = [
  { id: "sos", label: "SOS Сигнали", icon: AlertTriangle, subIcon: Radio, danger: true },
  { id: "applications", label: "Заявки адміністратора", icon: Users, subIcon: UserCheck },
  { id: "factions", label: "Заявки у фракції", icon: Shield, subIcon: ShieldCheck },
  { id: "licenses", label: "Ліцензії та номери", icon: FileCheck, subIcon: Car },
  { id: "house_requests", label: "Купівля будинків", icon: Home, subIcon: Building2 },
  { id: "news", label: "Новини та оновлення", icon: Newspaper, subIcon: FileText },
  { id: "houses", label: "Управління будинками", icon: Home, subIcon: Building2 },
  { id: "wanted", label: "Розшук", icon: Crosshair, subIcon: Crosshair, danger: true },
  { id: "election", label: "Вибори мера", icon: Vote, subIcon: Gavel },
  { id: "documents", label: "Документи", icon: ScrollText, subIcon: FileText },
  { id: "add_faction", label: "Додати фракцію", icon: ShieldAlert, subIcon: Plus },
  { id: "voice", label: "Голос міста", icon: Megaphone, subIcon: MessageSquare },
  { id: "tokens", label: "Токени", icon: Coins, subIcon: Wallet },
];

const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent";

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab | null>(null);

  if (tab) {
    const current = TAB_LIST.find(t => t.id === tab)!;
    return (
      <div className="min-h-screen bg-background pb-20 px-4 pt-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setTab(null)}
            className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center active:scale-95 transition-all">
            <ChevronLeft className="w-4 h-4 text-foreground" />
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

        {tab === "sos" && <SosTab />}
        {tab === "news" && <NewsTab />}
        {tab === "houses" && <HousesTab />}
        {tab === "wanted" && <WantedTab />}
        {tab === "election" && <ElectionTab />}
        {tab === "documents" && <DocumentsTab />}
        {tab === "factions" && <FactionAppsTab />}
        {tab === "applications" && <AdminAppsTab />}
        {tab === "tokens" && <TokensTab />}
        {tab === "voice" && <VoiceTab />}
        {tab === "licenses" && <LicensesTab />}
        {tab === "house_requests" && <HouseRequestsTab />}
        {tab === "add_faction" && <AddFactionTab />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="АДМІН ПАНЕЛЬ" subtitle="Управління сервером" backTo="/profile" />
      <div className="space-y-2 animate-fade-in">
        {TAB_LIST.map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="w-full animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
            <div className={`liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] ${t.danger ? "border-destructive/20 hover:border-destructive/30" : "hover:border-primary/20"}`}
              style={t.danger ? { boxShadow: "0 0 12px hsl(0 70% 50% / 0.08)" } : {}}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.danger ? "bg-destructive/10 border border-destructive/20" : "bg-primary/10 border border-primary/15"}`}>
                  <t.icon className={`w-5 h-5 ${t.danger ? "text-destructive" : "text-primary"}`} />
                </div>
                <div className="text-left">
                  <span className={`text-sm font-medium block ${t.danger ? "text-destructive" : "text-foreground"}`}>{t.label}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <t.subIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{t.id === "sos" ? "Realtime" : t.id === "factions" || t.id === "applications" ? "Заявки" : "Управління"}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- SOS TAB ---
const sosTypes = [
  { id: "raid", label: "РЕЙД", icon: Swords, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { id: "cheater", label: "ЧИТЕР", icon: Bug, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  { id: "nrp", label: "НРП", icon: UserX, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { id: "other", label: "ІНШЕ", icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted/20 border-muted/30" },
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
        <div className="flex items-center gap-1.5 text-[10px] text-primary">
          <Radio className="w-3 h-3 animate-pulse" /> Realtime
        </div>
      </div>
      {messages.length === 0 && (
        <div className="text-center py-12 liquid-glass-card rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
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
                className="ml-3 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-[10px] font-medium active:scale-95 transition-all flex items-center gap-1">
                <Check className="w-3 h-3" /> Вирішено
              </button>
            </div>
          </NeonCard>
        );
      })}
    </div>
  );
};

type NewsButton = { text: string; url: string; variant: "green" | "yellow" | "danger" | "cyan" };

// --- NEWS TAB ---
const NewsTab = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState<"news" | "update">("news");
  const [showBtn, setShowBtn] = useState(false);
  const [btnText, setBtnText] = useState("");
  const [btnUrl, setBtnUrl] = useState("");
  const [btnVariant, setBtnVariant] = useState<NewsButton["variant"]>("green");

  useEffect(() => { store.getNews().then(setNews); }, []);

  const add = async () => {
    if (!title || !text) return toast.error("Заповніть поля");
    const btnData = showBtn && btnText ? JSON.stringify({ text: btnText, url: btnUrl, variant: btnVariant }) : undefined;
    await store.addNews(title, text, imageUrl || undefined, type, btnData);
    setTitle(""); setText(""); setImageUrl(""); setBtnText(""); setBtnUrl(""); setShowBtn(false);
    setNews(await store.getNews());
    toast.success("Новину додано!");
  };

  const typeIcons = { news: Newspaper, update: RefreshCw };

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Нова публікація</h3>
        <div className="space-y-2.5">
          <div className="flex gap-2">
            {(["news", "update"] as const).map(t => {
              const Icon = typeIcons[t];
              return (
                <button key={t} onClick={() => setType(t)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${type === t ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t === "news" ? "Новина" : "Оновлення"}
                </button>
              );
            })}
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок" className={inputClass} />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Текст публікації..." className={`${inputClass} resize-none h-24`} />

          <div className="liquid-glass rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Фото по посиланню</span>
            </div>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://i.imgur.com/..." className={inputClass} />
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-28 object-cover rounded-xl mt-2" onError={e => (e.currentTarget.style.display = "none")} />}
          </div>

          <div className="liquid-glass rounded-xl px-3 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Кнопка в пості</span>
              </div>
              <button onClick={() => setShowBtn(!showBtn)}
                className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${showBtn ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>
                {showBtn ? "Прибрати" : "Додати"}
              </button>
            </div>
            {showBtn && (
              <div className="space-y-2 mt-2">
                <input value={btnText} onChange={e => setBtnText(e.target.value)} placeholder="Текст кнопки" className={inputClass} />
                <input value={btnUrl} onChange={e => setBtnUrl(e.target.value)} placeholder="Посилання (https://...)" className={inputClass} />
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5">Колір кнопки:</p>
                  <div className="flex gap-2">
                    {([
                      { v: "green", icon: Zap, label: "Зелений" },
                      { v: "yellow", icon: Coins, label: "Жовтий" },
                      { v: "danger", icon: AlertTriangle, label: "Червоний" },
                      { v: "cyan", icon: Shield, label: "Синій" },
                    ] as const).map(({ v, icon: Icon, label }) => (
                      <button key={v} onClick={() => setBtnVariant(v as NewsButton["variant"])}
                        className={`flex flex-col items-center gap-1 text-[9px] px-2 py-1.5 rounded-xl border transition-all ${btnVariant === v ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                  {btnText && (
                    <div className="mt-2">
                      <p className="text-[10px] text-muted-foreground mb-1">Попередній перегляд:</p>
                      <GradientButton variant={btnVariant as NewsButton["variant"]} className="text-xs py-1.5 px-4">{btnText}</GradientButton>
                    </div>
                  )}
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
                    <TypeIcon className="w-2.5 h-2.5" />
                    {n.type === "update" ? "Оновлення" : "Новина"}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">{n.text}</p>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">{n.date}</p>
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

// --- HOUSES TAB ---
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
        <button onClick={() => setAddMode(!addMode)} className="flex items-center gap-1.5 text-xs text-primary liquid-glass px-3 py-1.5 rounded-xl border border-primary/20 active:scale-95 transition-all">
          <Plus className="w-3.5 h-3.5" /> Додати будинок
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
              {["Люкс", "Економ"].map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${category === c ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{c}</button>
              ))}
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
              <button onClick={async () => { await store.deleteHouse(h.id); setHouses(prev => prev.filter(x => x.id !== h.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- HOUSE REQUESTS ---
const HouseRequestsTab = () => {
  const [requests, setRequests] = useState<HousePurchaseRequest[]>([]);
  useEffect(() => { store.getHousePurchaseRequests().then(setRequests); }, []);
  const decide = async (r: HousePurchaseRequest, status: "approved" | "rejected") => {
    await store.updateHousePurchaseStatus(r.id, status, r.house_id, r.username);
    setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status } : x));
    store.addNotification(`Заявка на будинок "${r.house_name}" ${status === "approved" ? "схвалена" : "відхилена"}`);
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };
  const sc = { pending: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { pending: "На розгляді", approved: "Схвалено", rejected: "Відхилено" };
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявок: {requests.length}</p>
      {requests.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><Building2 className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-40" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
      {requests.map(r => (
        <NeonCard key={r.id} glowColor="yellow">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1"><Users className="w-3 h-3 text-muted-foreground" /><h4 className="text-xs font-semibold">{r.username}</h4></div>
              <div className="flex items-center gap-1.5"><Home className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{r.house_name}</p></div>
              <div className="flex items-center gap-1.5 mt-0.5"><Coins className="w-3 h-3" style={{ color: "hsl(45,100%,55%)" }} /><p className="text-[10px]" style={{ color: "hsl(45,100%,55%)" }}>{r.house_price?.toLocaleString()} CR</p></div>
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

// --- LICENSES ---
const LicensesTab = () => {
  const [apps, setApps] = useState<LicenseApplication[]>([]);
  useEffect(() => { store.getLicenseApplications().then(setApps); }, []);
  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateLicenseStatus(id, status);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };
  const sc = { pending: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { pending: "На розгляді", approved: "Схвалено", rejected: "Відхилено" };
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявок: {apps.length}</p>
      {apps.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><Car className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-40" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1"><Users className="w-3 h-3 text-muted-foreground" /><h4 className="text-xs font-semibold">{a.username}</h4></div>
              <div className="flex items-center gap-1.5"><FileCheck className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{a.license_type}</p></div>
              {a.plate_number && <div className="flex items-center gap-1.5 mt-0.5"><Car className="w-3 h-3" style={{ color: "hsl(45,100%,55%)" }} /><p className="text-[10px] font-mono" style={{ color: "hsl(45,100%,55%)" }}>{a.plate_number}</p></div>}
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

// --- WANTED ---
const WantedTab = () => {
  const [wanted, setWanted] = useState<WantedPerson[]>([]);
  const [name, setName] = useState(""); const [reason, setReason] = useState(""); const [stars, setStars] = useState(1);
  useEffect(() => { store.getWanted().then(setWanted); }, []);
  const add = async () => {
    if (!name || !reason) return toast.error("Заповніть поля");
    await store.addWanted(name, reason, stars);
    setWanted(await store.getWanted());
    setName(""); setReason(""); setStars(1);
    toast.success("Додано до розшуку!");
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
            <div className="flex gap-1">{[1,2,3,4,5].map(s => (<button key={s} onClick={() => setStars(s)} className={`text-lg transition-transform ${s <= stars ? "scale-110" : "opacity-30"}`}>⭐</button>))}</div>
          </div>
          <GradientButton variant="danger" className="w-full text-xs py-2" onClick={add}>Додати до розшуку</GradientButton>
        </div>
      </NeonCard>
      {wanted.map(w => (
        <NeonCard key={w.id} glowColor="red">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5"><UserX className="w-3 h-3 text-destructive" /><h4 className="text-xs font-semibold">{w.name}</h4></div>
              <div className="flex items-center gap-1.5"><Crosshair className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{w.reason}</p></div>
              <div className="flex gap-0.5 mt-1">{Array.from({ length: w.stars }).map((_, j) => <span key={j} className="text-xs">⭐</span>)}</div>
            </div>
            <button onClick={async () => { await store.removeWanted(w.id); setWanted(prev => prev.filter(x => x.id !== w.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- ELECTION ---
const ElectionTab = () => {
  const [candidates, setCandidates] = useState<MayorCandidate[]>([]);
  const [name, setName] = useState(""); const [program, setProgram] = useState(""); const [bio, setBio] = useState("");
  useEffect(() => { store.getCandidates().then(setCandidates); }, []);
  const add = async () => {
    if (!name || !program) return toast.error("Заповніть поля");
    await store.addCandidate(name, program, bio);
    setCandidates(await store.getCandidates());
    setName(""); setProgram(""); setBio("");
    toast.success("Кандидата додано!");
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
            <button onClick={async () => { await store.deleteCandidate(c.id); setCandidates(prev => prev.filter(x => x.id !== c.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- DOCUMENTS ---
const DocumentsTab = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [editId, setEditId] = useState<number | null>(null);
  useEffect(() => { store.getDocs().then(setDocs); }, []);
  const save = async () => {
    if (!title || !content) return toast.error("Заповніть поля");
    if (editId) { await store.updateDoc(editId, title, content); toast.success("Збережено!"); }
    else { await store.addDoc(title, content); toast.success("Додано!"); }
    setDocs(await store.getDocs()); setTitle(""); setContent(""); setEditId(null);
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
      <a href="https://sleepmancybr.github.io/chernihiv" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 liquid-glass-card rounded-2xl px-4 py-3 text-xs text-primary transition-all hover:border-primary/30">
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

// --- FACTION APPS ---
const FactionAppsTab = () => {
  const [apps, setApps] = useState<FactionApplication[]>([]);
  useEffect(() => { store.getFactionApps().then(setApps); }, []);
  useEffect(() => {
    const ch = store.onNewFactionApp(app => { setApps(prev => [app, ...prev]); toast.info(`Нова заявка від ${app.nick}`); });
    return () => { ch.unsubscribe(); };
  }, []);
  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateFactionAppStatus(id, status);
    const app = apps.find(a => a.id === id);
    store.addNotification(`Заявка у ${app?.factionName} ${status === "approved" ? "схвалена" : "відхилена"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };
  const sc = { review: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Заявок: {apps.length}</p>
        <div className="flex items-center gap-1.5 text-[10px] text-primary"><Radio className="w-3 h-3 animate-pulse" /> Realtime</div>
      </div>
      {apps.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><Shield className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-40" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1"><Users className="w-3 h-3 text-primary" /><h4 className="text-xs font-semibold">{a.nick}</h4></div>
              <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-muted-foreground" /><p className="text-[10px] text-muted-foreground">{a.factionName}</p></div>
              <p className="text-[10px] text-muted-foreground">Roblox: {a.roblox} | Вік: {a.age} | TG: {a.telegram}</p>
              <p className="text-[10px] text-muted-foreground mt-1 italic">"{a.message}"</p>
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
  );
};

// --- ADMIN APPS ---
const AdminAppsTab = () => {
  const [apps, setApps] = useState<AdminApplication[]>([]);
  useEffect(() => { store.getAdminApps().then(setApps); }, []);
  useEffect(() => {
    const ch = store.onNewAdminApp(app => { setApps(prev => [app, ...prev]); toast.info(`Нова заявка від ${app.nick}`); });
    return () => { ch.unsubscribe(); };
  }, []);
  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateAdminAppStatus(id, status);
    store.addNotification(`Заявка на адміна ${status === "approved" ? "схвалена" : "відхилена"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };
  const sc = { review: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const sl = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Заявок: {apps.length}</p>
        <div className="flex items-center gap-1.5 text-[10px] text-primary"><Radio className="w-3 h-3 animate-pulse" /> Realtime</div>
      </div>
      {apps.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><UserCheck className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-40" /><p className="text-xs text-muted-foreground">Немає заявок</p></div>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="lime">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1"><UserCheck className="w-3 h-3 text-primary" /><h4 className="text-xs font-semibold">{a.nick}</h4></div>
              <p className="text-[10px] text-muted-foreground">Roblox: {a.roblox} | Вік: {a.age} | {a.country}</p>
              <p className="text-[10px] text-muted-foreground">TG: {a.telegram} | Мік: {a.hasMic ? "Так" : "Ні"} | RP: {a.rpKnowledge}/10</p>
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
  );
};

// --- ADD FACTION ---
const AddFactionTab = () => {
  const [name, setName] = useState(""); const [color, setColor] = useState("#22c55e");
  const [logoUrl, setLogoUrl] = useState(""); const [gradient, setGradient] = useState("");
  const [section, setSection] = useState<"main" | "separate">("main");
  const add = async () => {
    if (!name) return toast.error("Вкажіть назву");
    await store.addFaction(name, color, logoUrl || undefined, gradient || undefined, section);
    setName(""); setColor("#22c55e"); setLogoUrl(""); setGradient("");
    toast.success(`Фракцію "${name}" додано!`);
  };
  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Розділ</label>
            <div className="flex gap-2">
              {([["main", "Серед усіх"], ["separate", "Окремо"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setSection(v)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${section === v ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва фракції" className={inputClass} />
          <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="Логотип (https://...)" className={inputClass} />
          {logoUrl && <img src={logoUrl} alt="" className="w-12 h-12 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = "none")} />}
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
            <input value={color} onChange={e => setColor(e.target.value)} placeholder="#22c55e" className={`${inputClass} flex-1`} />
          </div>
          <input value={gradient} onChange={e => setGradient(e.target.value)} placeholder="Градієнт: linear-gradient(...)" className={inputClass} />
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Додати фракцію</GradientButton>
        </div>
      </NeonCard>
    </div>
  );
};

// --- TOKENS ---
const TokensTab = () => {
  const [nick, setNick] = useState(""); const [amount, setAmount] = useState("");
  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" /> Управління токенами</h3>
        <div className="space-y-2">
          <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Нік гравця" className={inputClass} />
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Кількість CR" type="number" className={inputClass} />
          <div className="flex gap-2">
            <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={() => { if (!nick || !amount) return toast.error("Заповніть поля"); toast.success(`+${amount} CR → ${nick}`); setNick(""); setAmount(""); }}>Видати</GradientButton>
            <GradientButton variant="danger" className="flex-1 text-xs py-2" onClick={() => { if (!nick || !amount) return toast.error("Заповніть поля"); toast.success(`-${amount} CR у ${nick}`); setNick(""); setAmount(""); }}>Забрати</GradientButton>
          </div>
        </div>
      </NeonCard>
    </div>
  );
};

// --- VOICE ---
const VoiceTab = () => {
  const [items, setItems] = useState<CityVoiceItem[]>([]);
  useEffect(() => { store.getCityVoice().then(setItems); }, []);
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Записів: {items.length}</p>
      {items.length === 0 && <div className="text-center py-10 liquid-glass-card rounded-2xl"><MessageSquare className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-40" /><p className="text-xs text-muted-foreground">Немає записів</p></div>}
      {items.map(v => (
        <NeonCard key={v.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground uppercase">{v.type === "idea" ? "Ідея" : "Петиція"}</span>
              </div>
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

export default AdminPanel;
