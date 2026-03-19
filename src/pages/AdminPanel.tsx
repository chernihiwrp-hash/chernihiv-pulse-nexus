import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import {
  Newspaper, Home, FileCheck, Users, Coins, Megaphone, Shield, Plus, Trash2,
  Check, X, Edit, Crosshair, ScrollText, Vote, AlertTriangle, Save, Star,
  ShieldAlert, Car, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { store } from "../lib/store";
import type {
  NewsItem, HouseItem, WantedPerson, FactionApplication, AdminApplication,
  CityVoiceItem, MayorCandidate, DocumentItem, SosMessage, LicenseApplication, HousePurchaseRequest
} from "../lib/store";

type Tab = "news" | "houses" | "wanted" | "factions" | "applications" | "tokens" | "voice" | "election" | "documents" | "sos" | "licenses" | "house_requests" | "add_faction";

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>("sos");

  const tabs: { id: Tab; label: string; icon: typeof Newspaper; color?: string }[] = [
    { id: "sos", label: "SOS", icon: AlertTriangle },
    { id: "applications", label: "Заявки адмін", icon: Users },
    { id: "factions", label: "Заявки фракції", icon: Shield },
    { id: "licenses", label: "Ліцензії", icon: FileCheck },
    { id: "house_requests", label: "Купівля домів", icon: Home },
    { id: "news", label: "Новини", icon: Newspaper },
    { id: "houses", label: "Будинки", icon: Home },
    { id: "wanted", label: "Розшук", icon: Crosshair, color: "text-destructive" },
    { id: "election", label: "Вибори", icon: Vote },
    { id: "documents", label: "Документи", icon: ScrollText },
    { id: "add_faction", label: "Додати фракцію", icon: ShieldAlert },
    { id: "voice", label: "Голос міста", icon: Megaphone },
    { id: "tokens", label: "Токени", icon: Coins },
  ];

  const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent";

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="АДМІН ПАНЕЛЬ" subtitle="Управління сервером" backTo="/profile" />
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 text-[10px] px-3 py-2 rounded-xl border whitespace-nowrap transition-all active:scale-95 ${
              tab === t.id ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"
            } ${t.id === "wanted" && tab !== t.id ? "border-destructive/20 text-destructive/70" : ""}`}>
            <t.icon className={`w-3.5 h-3.5 ${t.id === "wanted" ? "text-destructive" : ""}`} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "sos" && <SosTab />}
      {tab === "news" && <NewsTab inputClass={inputClass} />}
      {tab === "houses" && <HousesTab inputClass={inputClass} />}
      {tab === "wanted" && <WantedTab inputClass={inputClass} />}
      {tab === "election" && <ElectionTab inputClass={inputClass} />}
      {tab === "documents" && <DocumentsTab inputClass={inputClass} />}
      {tab === "factions" && <FactionAppsTab />}
      {tab === "applications" && <AdminAppsTab />}
      {tab === "tokens" && <TokensTab inputClass={inputClass} />}
      {tab === "voice" && <VoiceTab />}
      {tab === "licenses" && <LicensesTab />}
      {tab === "house_requests" && <HouseRequestsTab />}
      {tab === "add_faction" && <AddFactionTab inputClass={inputClass} />}
    </div>
  );
};

// --- SOS TAB ---
const SosTab = () => {
  const [messages, setMessages] = useState<SosMessage[]>([]);
  useEffect(() => { store.getSos().then(setMessages); }, []);

  useEffect(() => {
    const ch = store.onNewSos(msg => {
      setMessages(prev => [msg, ...prev]);
      toast.error(`🚨 Новий SOS: ${msg.reason}`);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const typeIcon: Record<string, string> = { police: "🚔", medic: "🚑", fire: "🚒", general: "🆘" };
  const typeLabel: Record<string, string> = { police: "Поліція", medic: "Медики", fire: "Пожежні", general: "Загальний" };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">SOS сигнали ({messages.length})</p>
      {messages.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає активних сигналів</p>}
      {messages.map(m => (
        <NeonCard key={m.id} glowColor="red">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{typeIcon[m.type || "general"] || "🆘"}</span>
                <span className="text-[10px] text-destructive font-bold">{typeLabel[m.type || "general"] || m.reason}</span>
              </div>
              <p className="text-xs text-foreground">{m.description}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{m.date}</p>
            </div>
            <button onClick={async () => { await store.resolveSos(m.id); setMessages(prev => prev.filter(x => x.id !== m.id)); toast.success("Вирішено"); }}
              className="p-1.5 rounded-lg liquid-glass text-primary active:scale-95 ml-2">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- NEWS TAB ---
const NewsTab = ({ inputClass }: { inputClass: string }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState<"news" | "update">("news");

  useEffect(() => { store.getNews().then(setNews); }, []);

  const add = async () => {
    if (!title || !text) return toast.error("Заповніть поля");
    await store.addNews(title, text, imageUrl || undefined, type);
    setTitle(""); setText(""); setImageUrl("");
    const updated = await store.getNews();
    setNews(updated);
    toast.success("Новину додано!");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Додати новину</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            {(["news", "update"] as const).map(t => (
              <button key={t} onClick={() => setType(t)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${type === t ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>
                {t === "news" ? "Новина" : "Оновлення"}
              </button>
            ))}
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок" className={inputClass} />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Текст новини..." className={`${inputClass} resize-none h-20`} />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Посилання на фото (https://...)" className={inputClass} />
          {imageUrl && <img src={imageUrl} alt="" className="w-full h-24 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = "none")} />}
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Опублікувати</GradientButton>
        </div>
      </NeonCard>
      {news.map(n => (
        <NeonCard key={n.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-foreground">{n.title}</h4>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${n.type === "update" ? "bg-blue-500/15 text-blue-400" : "bg-primary/15 text-primary"}`}>{n.type === "update" ? "Оновлення" : "Новина"}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{n.text}</p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">{n.date}</p>
              {n.image && <img src={n.image} alt="" className="w-full h-20 object-cover rounded-lg mt-2" />}
            </div>
            <button onClick={async () => { await store.deleteNews(n.id); setNews(prev => prev.filter(x => x.id !== n.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95 ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- HOUSES TAB ---
const HousesTab = ({ inputClass }: { inputClass: string }) => {
  const [houses, setHouses] = useState<HouseItem[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Люкс");

  useEffect(() => { store.getHouses().then(setHouses); }, []);

  const add = async () => {
    if (!name || !price) return toast.error("Заповніть назву і ціну");
    await store.addHouse(name, desc, Number(price), imageUrl || undefined, category);
    const updated = await store.getHouses();
    setHouses(updated);
    setName(""); setPrice(""); setDesc(""); setImageUrl(""); setAddMode(false);
    toast.success("Будинок додано!");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground">Будинки на продаж</p>
        <button onClick={() => setAddMode(!addMode)} className="text-xs text-primary flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Додати</button>
      </div>
      {addMode && (
        <NeonCard glowColor="lime">
          <div className="space-y-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва будинку" className={inputClass} />
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Ціна (CR)" type="number" className={inputClass} />
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Опис" className={inputClass} />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Посилання на фото (https://...)" className={inputClass} />
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-20 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = "none")} />}
            <div className="flex gap-2">
              {["Люкс", "Економ"].map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${category === c ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{c}</button>
              ))}
            </div>
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Додати будинок</GradientButton>
          </div>
        </NeonCard>
      )}
      {houses.map(h => (
        <NeonCard key={h.id} glowColor="yellow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">{h.name}</h4>
              <p className="text-[10px] text-muted-foreground">{h.desc}</p>
              <span className="text-xs font-bold" style={{ color: "hsl(45, 100%, 55%)" }}>{h.price.toLocaleString()} CR</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${h.owner ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
                {h.owner ? "ПРОДАНО" : "ВІЛЬНО"}
              </span>
              <button onClick={async () => { await store.deleteHouse(h.id); setHouses(prev => prev.filter(x => x.id !== h.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- HOUSE PURCHASE REQUESTS ---
const HouseRequestsTab = () => {
  const [requests, setRequests] = useState<HousePurchaseRequest[]>([]);
  useEffect(() => { store.getHousePurchaseRequests().then(setRequests); }, []);

  const decide = async (r: HousePurchaseRequest, status: "approved" | "rejected") => {
    await store.updateHousePurchaseStatus(r.id, status, r.house_id, r.username);
    setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status } : x));
    store.addNotification(`Ваша заявка на будинок "${r.house_name}" ${status === "approved" ? "схвалена ✅" : "відхилена ❌"}`);
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const statusColor = { pending: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const statusLabel = { pending: "На розгляді", approved: "Схвалено", rejected: "Відхилено" };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявки на купівлю будинків ({requests.length})</p>
      {requests.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає заявок</p>}
      {requests.map(r => (
        <NeonCard key={r.id} glowColor="yellow">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">{r.username}</h4>
              <p className="text-[10px] text-muted-foreground">Будинок: {r.house_name}</p>
              <p className="text-[10px] text-neon-yellow">{r.house_price?.toLocaleString()} CR</p>
              <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${statusColor[r.status]}`}>{statusLabel[r.status]}</span>
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

// --- LICENSES TAB ---
const LicensesTab = () => {
  const [apps, setApps] = useState<LicenseApplication[]>([]);
  useEffect(() => { store.getLicenseApplications().then(setApps); }, []);

  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateLicenseStatus(id, status);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const statusColor = { pending: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const statusLabel = { pending: "На розгляді", approved: "Схвалено", rejected: "Відхилено" };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявки на ліцензії/номери ({apps.length})</p>
      {apps.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає заявок</p>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">{a.username}</h4>
              <p className="text-[10px] text-muted-foreground">Тип: {a.license_type}</p>
              {a.plate_number && <p className="text-[10px] text-neon-yellow font-mono">Номер: {a.plate_number}</p>}
              <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${statusColor[a.status]}`}>{statusLabel[a.status]}</span>
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

// --- WANTED TAB ---
const WantedTab = ({ inputClass }: { inputClass: string }) => {
  const [wanted, setWanted] = useState<WantedPerson[]>([]);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [stars, setStars] = useState(1);
  useEffect(() => { store.getWanted().then(setWanted); }, []);

  const add = async () => {
    if (!name || !reason) return toast.error("Заповніть поля");
    await store.addWanted(name, reason, stars);
    const updated = await store.getWanted();
    setWanted(updated);
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
            <label className="text-xs text-muted-foreground mb-1 block">Рівень розшуку (зірки)</label>
            <div className="flex gap-1">{[1,2,3,4,5].map(s => (<button key={s} onClick={() => setStars(s)} className={`text-lg transition-transform ${s <= stars ? "scale-110" : "opacity-30"}`}>⭐</button>))}</div>
          </div>
          <GradientButton variant="danger" className="w-full text-xs py-2" onClick={add}>Додати до розшуку</GradientButton>
        </div>
      </NeonCard>
      {wanted.map(w => (
        <NeonCard key={w.id} glowColor="red">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">{w.name}</h4>
              <p className="text-[10px] text-muted-foreground">{w.reason}</p>
              <div className="flex gap-0.5 mt-1">{Array.from({ length: w.stars }).map((_, j) => <span key={j}>⭐</span>)}</div>
            </div>
            <button onClick={async () => { await store.removeWanted(w.id); setWanted(prev => prev.filter(x => x.id !== w.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- ELECTION TAB ---
const ElectionTab = ({ inputClass }: { inputClass: string }) => {
  const [candidates, setCandidates] = useState<MayorCandidate[]>([]);
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => { store.getCandidates().then(setCandidates); }, []);

  const add = async () => {
    if (!name || !program) return toast.error("Заповніть поля");
    await store.addCandidate(name, program, bio);
    const updated = await store.getCandidates();
    setCandidates(updated);
    setName(""); setProgram(""); setBio("");
    toast.success("Кандидата додано!");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Vote className="w-4 h-4 text-primary" /> Додати кандидата на мера</h3>
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
              <h4 className="text-xs font-semibold text-foreground">{c.name}</h4>
              <p className="text-[10px] text-muted-foreground">{c.program}</p>
              <p className="text-[9px] text-primary mt-1">Голосів: {c.votes}</p>
            </div>
            <button onClick={async () => { await store.deleteCandidate(c.id); setCandidates(prev => prev.filter(x => x.id !== c.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- DOCUMENTS TAB ---
const DocumentsTab = ({ inputClass }: { inputClass: string }) => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  useEffect(() => { store.getDocs().then(setDocs); }, []);

  const save = async () => {
    if (!title || !content) return toast.error("Заповніть поля");
    if (editId) {
      await store.updateDoc(editId, title, content);
      toast.success("Збережено!");
    } else {
      await store.addDoc(title, content);
      toast.success("Документ додано!");
    }
    const updated = await store.getDocs();
    setDocs(updated);
    setTitle(""); setContent(""); setEditId(null);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><ScrollText className="w-4 h-4 text-primary" /> {editId ? "Редагувати" : "Додати"} документ</h3>
        <div className="space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Назва" className={inputClass} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Зміст..." className={`${inputClass} resize-none h-24`} />
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={save}>{editId ? "Зберегти" : "Додати"}</GradientButton>
        </div>
      </NeonCard>
      <NeonCard glowColor="green">
        <a href="https://sleepmancybr.github.io/chernihiv" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-primary">
          <ExternalLink className="w-4 h-4" />
          Всі правила знаходяться на сайті: sleepmancybr.github.io/chernihiv
        </a>
      </NeonCard>
      {docs.map(d => (
        <NeonCard key={d.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-foreground">{d.title}</h4>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{d.content}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={() => { setEditId(d.id); setTitle(d.title); setContent(d.content); }}
                className="p-1.5 rounded-lg liquid-glass text-primary active:scale-95"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={async () => { await store.deleteDoc(d.id); setDocs(prev => prev.filter(x => x.id !== d.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- FACTION APPS TAB ---
const FactionAppsTab = () => {
  const [apps, setApps] = useState<FactionApplication[]>([]);
  useEffect(() => { store.getFactionApps().then(setApps); }, []);

  useEffect(() => {
    const ch = store.onNewFactionApp(app => {
      setApps(prev => [app, ...prev]);
      toast.info(`📋 Нова заявка у фракцію від ${app.nick}`);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateFactionAppStatus(id, status);
    const app = apps.find(a => a.id === id);
    store.addNotification(`Вашу заявку у ${app?.factionName} ${status === "approved" ? "схвалено ✅" : "відхилено ❌"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const statusColor = { review: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const statusLabel = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявки у фракції ({apps.length})</p>
      {apps.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає заявок</p>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">{a.nick}</h4>
              <p className="text-[10px] text-muted-foreground">Фракція: {a.factionName}</p>
              <p className="text-[10px] text-muted-foreground">Roblox: {a.roblox} | Вік: {a.age}</p>
              <p className="text-[10px] text-muted-foreground">TG: {a.telegram}</p>
              <p className="text-[10px] text-muted-foreground mt-1 italic">"{a.message}"</p>
              <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${statusColor[a.status]}`}>{statusLabel[a.status]}</span>
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

// --- ADMIN APPS TAB ---
const AdminAppsTab = () => {
  const [apps, setApps] = useState<AdminApplication[]>([]);
  useEffect(() => { store.getAdminApps().then(setApps); }, []);

  useEffect(() => {
    const ch = store.onNewAdminApp(app => {
      setApps(prev => [app, ...prev]);
      toast.info(`👤 Нова заявка на адміна від ${app.nick}`);
    });
    return () => { ch.unsubscribe(); };
  }, []);

  const decide = async (id: number, status: "approved" | "rejected") => {
    await store.updateAdminAppStatus(id, status);
    store.addNotification(`Вашу заявку на адміністратора ${status === "approved" ? "схвалено ✅" : "відхилено ❌"}`);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const statusColor = { review: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };
  const statusLabel = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Заявки на адміністратора ({apps.length})</p>
      {apps.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає заявок</p>}
      {apps.map(a => (
        <NeonCard key={a.id} glowColor="lime">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-foreground">{a.nick}</h4>
              <p className="text-[10px] text-muted-foreground">Roblox: {a.roblox} | Вік: {a.age} | {a.country}</p>
              <p className="text-[10px] text-muted-foreground">TG: {a.telegram} | Мік: {a.hasMic ? "Так" : "Ні"}</p>
              <p className="text-[10px] text-muted-foreground">Час/день: {a.timePerDay} | RP знання: {a.rpKnowledge}/10</p>
              <span className={`text-[9px] px-2 py-0.5 rounded-md mt-1 inline-block ${statusColor[a.status]}`}>{statusLabel[a.status]}</span>
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

// --- ADD FACTION TAB ---
const AddFactionTab = ({ inputClass }: { inputClass: string }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [logoUrl, setLogoUrl] = useState("");
  const [gradient, setGradient] = useState("");
  const [section, setSection] = useState<"main" | "separate">("main");

  const add = async () => {
    if (!name) return toast.error("Вкажіть назву фракції");
    await store.addFaction(name, color, logoUrl || undefined, gradient || undefined, section);
    setName(""); setColor("#22c55e"); setLogoUrl(""); setGradient("");
    toast.success(`Фракцію "${name}" додано!`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Додати фракцію</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">1. Розділ</label>
            <div className="flex gap-2">
              {([["main", "Серед усіх"], ["separate", "Окремо"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setSection(v)} className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${section === v ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">2. Назва фракції</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">3. Логотип (посилання на картинку)</label>
            <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." className={inputClass} />
            {logoUrl && <img src={logoUrl} alt="" className="w-12 h-12 object-cover rounded-xl mt-2" onError={e => (e.currentTarget.style.display = "none")} />}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">4. Колір</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border-0" />
              <input value={color} onChange={e => setColor(e.target.value)} placeholder="#22c55e" className={`${inputClass} flex-1`} />
            </div>
            <input value={gradient} onChange={e => setGradient(e.target.value)} placeholder="Або градієнт: linear-gradient(135deg, #22c55e, #166534)" className={`${inputClass} mt-2`} />
          </div>
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Додати фракцію</GradientButton>
        </div>
      </NeonCard>
    </div>
  );
};

// --- TOKENS TAB ---
const TokensTab = ({ inputClass }: { inputClass: string }) => {
  const [nick, setNick] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Coins className="w-4 h-4 text-neon-yellow" /> Управління токенами</h3>
        <div className="space-y-2">
          <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Нік гравця" className={inputClass} />
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Кількість CR" type="number" className={inputClass} />
          <div className="flex gap-2">
            <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={() => { if (!nick || !amount) return toast.error("Заповніть поля"); toast.success(`+${amount} CR видано ${nick}`); setNick(""); setAmount(""); }}>Видати</GradientButton>
            <GradientButton variant="danger" className="flex-1 text-xs py-2" onClick={() => { if (!nick || !amount) return toast.error("Заповніть поля"); toast.success(`-${amount} CR забрано у ${nick}`); setNick(""); setAmount(""); }}>Забрати</GradientButton>
          </div>
        </div>
      </NeonCard>
    </div>
  );
};

// --- VOICE TAB ---
const VoiceTab = () => {
  const [items, setItems] = useState<CityVoiceItem[]>([]);
  useEffect(() => { store.getCityVoice().then(setItems); }, []);

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Голос міста ({items.length})</p>
      {items.map(v => (
        <NeonCard key={v.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase">{v.type === "idea" ? "Ідея" : "Петиція"}</span>
              <p className="text-xs text-foreground">{v.text}</p>
              <p className="text-[10px] text-muted-foreground">— {v.author} | 👍 {v.likes} 👎 {v.dislikes}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={async () => { await store.updateCityVoiceStatus(v.id, "approved"); setItems(prev => prev.map(x => x.id === v.id ? { ...x, status: "approved" } : x)); toast.success("Схвалено"); }}
                className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={async () => { await store.deleteCityVoice(v.id); setItems(prev => prev.filter(x => x.id !== v.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// Stub for Edit icon
const Edit = ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

export default AdminPanel;
