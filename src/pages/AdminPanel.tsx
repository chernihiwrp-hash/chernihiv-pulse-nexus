import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import {
  Newspaper, Home, FileCheck, Users, Coins, Megaphone, Shield, Plus, Trash2,
  Check, X, Edit, Crosshair, ScrollText, Vote, AlertTriangle, Image, Save, Star
} from "lucide-react";
import { toast } from "sonner";
import { store } from "../lib/store";
import type {
  NewsItem, HouseItem, WantedPerson, FactionApplication, AdminApplication,
  CityVoiceItem, MayorCandidate, DocumentItem, SosMessage
} from "../lib/store";

type Tab = "news" | "houses" | "wanted" | "factions" | "applications" | "tokens" | "voice" | "election" | "documents" | "sos";

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>("news");

  const tabs: { id: Tab; label: string; icon: typeof Newspaper }[] = [
    { id: "news", label: "Новини", icon: Newspaper },
    { id: "houses", label: "Будинки", icon: Home },
    { id: "wanted", label: "Розшук", icon: Crosshair },
    { id: "election", label: "Вибори", icon: Vote },
    { id: "documents", label: "Документи", icon: ScrollText },
    { id: "factions", label: "Фракції", icon: Shield },
    { id: "applications", label: "Заявки", icon: Users },
    { id: "tokens", label: "Токени", icon: Coins },
    { id: "voice", label: "Голос міста", icon: Megaphone },
    { id: "sos", label: "SOS", icon: AlertTriangle },
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
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "news" && <NewsTab inputClass={inputClass} />}
      {tab === "houses" && <HousesTab inputClass={inputClass} />}
      {tab === "wanted" && <WantedTab inputClass={inputClass} />}
      {tab === "election" && <ElectionTab inputClass={inputClass} />}
      {tab === "documents" && <DocumentsTab inputClass={inputClass} />}
      {tab === "factions" && <FactionAppsTab />}
      {tab === "applications" && <AdminAppsTab />}
      {tab === "tokens" && <TokensTab inputClass={inputClass} />}
      {tab === "voice" && <VoiceTab />}
      {tab === "sos" && <SosTab />}
    </div>
  );
};

// --- NEWS TAB ---
const NewsTab = ({ inputClass }: { inputClass: string }) => {
  const [news, setNews] = useState<NewsItem[]>(store.getNews());
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const save = (items: NewsItem[]) => { setNews(items); store.setNews(items); };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const add = () => {
    if (!title || !text) return toast.error("Заповніть поля");
    save([{ id: Date.now(), title, text, date: new Date().toLocaleDateString("uk-UA"), image }, ...news]);
    setTitle(""); setText(""); setImage(undefined);
    toast.success("Новину додано!");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" /> Додати новину
        </h3>
        <div className="space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок" className={inputClass} />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Текст новини..." className={`${inputClass} resize-none h-20`} />
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors liquid-glass rounded-xl px-3 py-2">
            <Image className="w-4 h-4" /> {image ? "Фото додано ✓" : "Додати фото"}
          </button>
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>Опублікувати</GradientButton>
        </div>
      </NeonCard>
      {news.map(n => (
        <NeonCard key={n.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-foreground">{n.title}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{n.text}</p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">{n.date}</p>
              {n.image && <img src={n.image} alt="" className="w-full h-24 object-cover rounded-lg mt-2" />}
            </div>
            <button onClick={() => { save(news.filter(x => x.id !== n.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive hover:text-destructive/80 active:scale-95 ml-2">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- HOUSES TAB ---
const HousesTab = ({ inputClass }: { inputClass: string }) => {
  const [houses, setHouses] = useState<HouseItem[]>(store.getHouses());
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [addMode, setAddMode] = useState(false);

  const save = (items: HouseItem[]) => { setHouses(items); store.setHouses(items); };

  const startEdit = (h: HouseItem) => {
    setEditId(h.id); setEditName(h.name); setEditPrice(String(h.price)); setEditDesc(h.desc);
  };

  const saveEdit = () => {
    save(houses.map(h => h.id === editId ? { ...h, name: editName, price: Number(editPrice), desc: editDesc } : h));
    setEditId(null);
    toast.success("Збережено!");
  };

  const toggleOwner = (id: number) => {
    save(houses.map(h => h.id === id ? { ...h, owner: h.owner ? null : "Admin" } : h));
  };

  const addPhoto = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      save(houses.map(h => h.id === id ? { ...h, photos: [...h.photos, reader.result as string] } : h));
      toast.success("Фото додано!");
    };
    reader.readAsDataURL(file);
  };

  const addHouse = () => {
    if (!editName || !editPrice) return toast.error("Заповніть назву і ціну");
    save([...houses, { id: Date.now(), name: editName, price: Number(editPrice), desc: editDesc, category: "Економ", owner: null, photos: [] }]);
    setEditName(""); setEditPrice(""); setEditDesc(""); setAddMode(false);
    toast.success("Будинок додано!");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground">Управління будинками</p>
        <button onClick={() => setAddMode(!addMode)} className="text-xs text-primary flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Додати
        </button>
      </div>

      {addMode && (
        <NeonCard glowColor="lime">
          <div className="space-y-2">
            <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Назва" className={inputClass} />
            <input value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="Ціна" type="number" className={inputClass} />
            <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Опис" className={inputClass} />
            <GradientButton variant="green" className="w-full text-xs py-2" onClick={addHouse}>Додати будинок</GradientButton>
          </div>
        </NeonCard>
      )}

      {houses.map(h => (
        <NeonCard key={h.id} glowColor="yellow">
          {editId === h.id ? (
            <div className="space-y-2">
              <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Назва" className={inputClass} />
              <input value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="Ціна" type="number" className={inputClass} />
              <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Опис" className={inputClass} />
              <div className="flex gap-2">
                <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={saveEdit}><Save className="w-3 h-3 inline mr-1" />Зберегти</GradientButton>
                <button onClick={() => setEditId(null)} className="liquid-glass rounded-xl px-3 py-2 text-xs text-muted-foreground">Скасувати</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{h.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{h.desc}</p>
                  <span className="text-xs font-bold" style={{ color: "hsl(45, 100%, 55%)" }}>{h.price.toLocaleString()} CR</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${h.owner ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
                  {h.owner ? "ПРОДАНО" : "ВІЛЬНО"}
                </span>
              </div>
              {h.photos.filter(p => p.startsWith("data:")).length > 0 && (
                <div className="flex gap-1 overflow-x-auto mb-2">
                  {h.photos.filter(p => p.startsWith("data:")).map((p, j) => (
                    <img key={j} src={p} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  ))}
                </div>
              )}
              <div className="flex gap-1">
                <button onClick={() => startEdit(h)} className="p-1.5 rounded-lg liquid-glass text-primary active:scale-95"><Edit className="w-3.5 h-3.5" /></button>
                <button onClick={() => toggleOwner(h.id)} className="p-1.5 rounded-lg liquid-glass text-neon-yellow active:scale-95 text-[9px]">{h.owner ? "Звільнити" : "Продати"}</button>
                <input type="file" accept="image/*" onChange={(e) => addPhoto(h.id, e)} className="hidden" id={`hphoto-${h.id}`} />
                <label htmlFor={`hphoto-${h.id}`} className="p-1.5 rounded-lg liquid-glass text-muted-foreground active:scale-95 cursor-pointer"><Image className="w-3.5 h-3.5" /></label>
                <button onClick={() => { save(houses.filter(x => x.id !== h.id)); toast.success("Видалено"); }}
                  className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95 ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
        </NeonCard>
      ))}
    </div>
  );
};

// --- WANTED TAB ---
const WantedTab = ({ inputClass }: { inputClass: string }) => {
  const [wanted, setWanted] = useState<WantedPerson[]>(store.getWanted());
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [stars, setStars] = useState(1);

  const save = (items: WantedPerson[]) => { setWanted(items); store.setWanted(items); };

  const add = () => {
    if (!name || !reason) return toast.error("Заповніть поля");
    save([{ id: Date.now(), name, reason, stars }, ...wanted]);
    setName(""); setReason(""); setStars(1);
    toast.success("Додано до розшуку!");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="red">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-destructive" /> Додати до розшуку
        </h3>
        <div className="space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Нік гравця" className={inputClass} />
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Причина" className={inputClass} />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Рівень розшуку</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setStars(s)} className={`text-lg transition-transform ${s <= stars ? "scale-110" : "opacity-30"}`}>⭐</button>
              ))}
            </div>
          </div>
          <GradientButton variant="danger" className="w-full text-xs py-2" onClick={add}>Додати</GradientButton>
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
            <button onClick={() => { save(wanted.filter(x => x.id !== w.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- ELECTION TAB ---
const ElectionTab = ({ inputClass }: { inputClass: string }) => {
  const [candidates, setCandidates] = useState<MayorCandidate[]>(store.getCandidates());
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [bio, setBio] = useState("");

  const save = (items: MayorCandidate[]) => { setCandidates(items); store.setCandidates(items); };

  const add = () => {
    if (!name || !program) return toast.error("Заповніть поля");
    save([...candidates, { id: Date.now(), name, program, bio, votes: 0 }]);
    setName(""); setProgram(""); setBio("");
    toast.success("Кандидата додано!");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Vote className="w-4 h-4 text-primary" /> Додати кандидата
        </h3>
        <div className="space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ім'я кандидата" className={inputClass} />
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
            <button onClick={() => { save(candidates.filter(x => x.id !== c.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- DOCUMENTS TAB ---
const DocumentsTab = ({ inputClass }: { inputClass: string }) => {
  const [docs, setDocs] = useState<DocumentItem[]>(store.getDocs());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const save = (items: DocumentItem[]) => { setDocs(items); store.setDocs(items); };

  const add = () => {
    if (!title || !content) return toast.error("Заповніть поля");
    if (editId) {
      save(docs.map(d => d.id === editId ? { ...d, title, content } : d));
      setEditId(null);
      toast.success("Збережено!");
    } else {
      save([{ id: Date.now(), title, content }, ...docs]);
      toast.success("Документ додано!");
    }
    setTitle(""); setContent("");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-primary" /> {editId ? "Редагувати" : "Додати"} документ
        </h3>
        <div className="space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Назва" className={inputClass} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Зміст..." className={`${inputClass} resize-none h-24`} />
          <GradientButton variant="green" className="w-full text-xs py-2" onClick={add}>{editId ? "Зберегти" : "Додати"}</GradientButton>
        </div>
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
              <button onClick={() => { save(docs.filter(x => x.id !== d.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- FACTION APPLICATIONS TAB ---
const FactionAppsTab = () => {
  const [apps, setApps] = useState<FactionApplication[]>(store.getFactionApps());
  const save = (items: FactionApplication[]) => { setApps(items); store.setFactionApps(items); };

  const decide = (id: number, status: "approved" | "rejected") => {
    save(apps.map(a => a.id === id ? { ...a, status } : a));
    const app = apps.find(a => a.id === id);
    store.addNotification(`Вашу заявку у ${app?.factionName} ${status === "approved" ? "схвалено ✅" : "відхилено ❌"}`);
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const statusLabel = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };
  const statusColor = { review: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };

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

// --- ADMIN APPLICATIONS TAB ---
const AdminAppsTab = () => {
  const [apps, setApps] = useState<AdminApplication[]>(store.getAdminApps());
  const save = (items: AdminApplication[]) => { setApps(items); store.setAdminApps(items); };

  const decide = (id: number, status: "approved" | "rejected") => {
    save(apps.map(a => a.id === id ? { ...a, status } : a));
    store.addNotification(`Вашу заявку на адміністратора ${status === "approved" ? "схвалено ✅" : "відхилено ❌"}`);
    toast.success(status === "approved" ? "Схвалено!" : "Відхилено!");
  };

  const statusLabel = { review: "На розгляді", approved: "Прийнято", rejected: "Відхилено" };
  const statusColor = { review: "bg-neon-yellow/15 text-neon-yellow", approved: "bg-primary/15 text-primary", rejected: "bg-destructive/15 text-destructive" };

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
              <p className="text-[10px] text-muted-foreground">Час/день: {a.timePerDay} | Грає: {a.playTime}</p>
              <p className="text-[10px] text-muted-foreground">RP знання: {a.rpKnowledge}/10 | RP досвід: {a.rpTime}</p>
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

// --- TOKENS TAB ---
const TokensTab = ({ inputClass }: { inputClass: string }) => {
  const [nick, setNick] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-4 animate-fade-in">
      <NeonCard glowColor="lime">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Coins className="w-4 h-4 text-neon-yellow" /> Управління токенами
        </h3>
        <div className="space-y-2">
          <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Нік гравця" className={inputClass} />
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Кількість CR" type="number" className={inputClass} />
          <div className="flex gap-2">
            <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={() => {
              if (!nick || !amount) return toast.error("Заповніть поля");
              toast.success(`+${amount} CR видано ${nick}`);
              setNick(""); setAmount("");
            }}>Видати</GradientButton>
            <GradientButton variant="danger" className="flex-1 text-xs py-2" onClick={() => {
              if (!nick || !amount) return toast.error("Заповніть поля");
              toast.success(`-${amount} CR забрано у ${nick}`);
              setNick(""); setAmount("");
            }}>Забрати</GradientButton>
          </div>
        </div>
      </NeonCard>
    </div>
  );
};

// --- VOICE TAB ---
const VoiceTab = () => {
  const [items, setItems] = useState<CityVoiceItem[]>(store.getCityVoice());
  const save = (list: CityVoiceItem[]) => { setItems(list); store.setCityVoice(list); };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">Модерація ідей та петицій ({items.length})</p>
      {items.map(v => (
        <NeonCard key={v.id} glowColor="green">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase">{v.type === "idea" ? "Ідея" : "Петиція"}</span>
              <p className="text-xs text-foreground">{v.text}</p>
              <p className="text-[10px] text-muted-foreground">— {v.author} | 👍 {v.likes} 👎 {v.dislikes}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button onClick={() => { save(items.map(x => x.id === v.id ? { ...x, status: "approved" } : x)); toast.success("Схвалено"); }}
                className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={() => { save(items.filter(x => x.id !== v.id)); toast.success("Видалено"); }}
                className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

// --- SOS TAB ---
const SosTab = () => {
  const [messages, setMessages] = useState<SosMessage[]>(store.getSos());
  const save = (list: SosMessage[]) => { setMessages(list); store.setSos(list); };

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-xs text-muted-foreground">SOS сигнали ({messages.length})</p>
      {messages.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає сигналів</p>}
      {messages.map(m => (
        <NeonCard key={m.id} glowColor="red">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] text-destructive font-bold">🚨 {m.reason}</span>
              <p className="text-xs text-foreground mt-1">{m.description}</p>
              <p className="text-[9px] text-muted-foreground mt-1">{m.date}</p>
            </div>
            <button onClick={() => { save(messages.filter(x => x.id !== m.id)); toast.success("Видалено"); }}
              className="p-1.5 rounded-lg liquid-glass text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </NeonCard>
      ))}
    </div>
  );
};

export default AdminPanel;
