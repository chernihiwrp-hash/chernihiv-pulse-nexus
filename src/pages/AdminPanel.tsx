import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import { Newspaper, Home, FileCheck, Users, Coins, Megaphone, Shield, Plus, Trash2, Check, X, Edit } from "lucide-react";
import { toast } from "sonner";

type Tab = "news" | "houses" | "licenses" | "applications" | "tokens" | "voice" | "factions";

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>("news");

  const tabs: { id: Tab; label: string; icon: typeof Newspaper }[] = [
    { id: "news", label: "Новини", icon: Newspaper },
    { id: "houses", label: "Будинки", icon: Home },
    { id: "licenses", label: "Ліцензії", icon: FileCheck },
    { id: "factions", label: "Фракції", icon: Shield },
    { id: "applications", label: "Заявки", icon: Users },
    { id: "tokens", label: "Токени", icon: Coins },
    { id: "voice", label: "Голос міста", icon: Megaphone },
  ];

  // Mock data
  const [newsItems, setNewsItems] = useState([
    { id: 1, title: "Відкриття казино", text: "Нове казино в місті!" },
    { id: 2, title: "Набір у НПУ", text: "Подавайте анкети" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const [applications] = useState([
    { id: 1, name: "Player_05", type: "Адмін", status: "review" },
    { id: 2, name: "Player_06", type: "СБУ", status: "review" },
    { id: 3, name: "Player_07", type: "НПУ", status: "approved" },
  ]);

  const [tokenNick, setTokenNick] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent";

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="АДМІН ПАНЕЛЬ" subtitle="Управління сервером" backTo="/profile" />

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 text-[10px] px-3 py-2 rounded-xl border whitespace-nowrap transition-all active:scale-95 ${
              tab === t.id ? "bg-primary/20 border-primary/30 text-primary" : "liquid-glass text-muted-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* News Tab */}
      {tab === "news" && (
        <div className="space-y-4 animate-fade-in">
          <NeonCard glowColor="lime">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Додати новину
            </h3>
            <div className="space-y-2">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Заголовок" className={inputClass} />
              <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Текст новини..." className={`${inputClass} resize-none h-20`} />
              <GradientButton variant="green" className="w-full text-xs py-2" onClick={() => {
                if (!newTitle || !newText) return toast.error("Заповніть поля");
                setNewsItems(prev => [{ id: Date.now(), title: newTitle, text: newText }, ...prev]);
                setNewTitle(""); setNewText("");
                toast.success("Новину додано!");
              }}>Опублікувати</GradientButton>
            </div>
          </NeonCard>

          {newsItems.map(n => (
            <NeonCard key={n.id} glowColor="green">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{n.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.text}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg liquid-glass text-muted-foreground hover:text-foreground active:scale-95"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { setNewsItems(prev => prev.filter(x => x.id !== n.id)); toast.success("Видалено"); }}
                    className="p-1.5 rounded-lg liquid-glass text-destructive hover:text-destructive/80 active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* Houses Tab */}
      {tab === "houses" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">Управління будинками — редагування цін, описів та фото.</p>
          {["Concrete Space", "Green Villa", "Sky Penthouse"].map((h, i) => (
            <NeonCard key={i} glowColor="yellow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{h}</h4>
                  <p className="text-[10px] text-muted-foreground">Ціна: 150,000 CR</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg liquid-glass text-primary active:scale-95"><Edit className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* Licenses Tab */}
      {tab === "licenses" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">Заявки на ліцензії</p>
          {["Player_10 — Пістолет", "Player_11 — Дробовик"].map((l, i) => (
            <NeonCard key={i} glowColor="green">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">{l}</span>
                <div className="flex gap-1">
                  <button onClick={() => toast.success("Схвалено")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toast.success("Відхилено")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* Faction Applications */}
      {tab === "factions" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">Заявки у фракції</p>
          {applications.filter(a => a.type !== "Адмін").map(a => (
            <NeonCard key={a.id} glowColor="green">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{a.name}</h4>
                  <p className="text-[10px] text-muted-foreground">Фракція: {a.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md ${
                    a.status === "review" ? "bg-neon-yellow/15 text-neon-yellow" : a.status === "approved" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                  }`}>
                    {a.status === "review" ? "На розгляді" : a.status === "approved" ? "Прийнято" : "Відхилено"}
                  </span>
                  {a.status === "review" && (
                    <div className="flex gap-1">
                      <button onClick={() => toast.success("Схвалено")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toast.success("Відхилено")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* Admin Applications */}
      {tab === "applications" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">Заявки на адміністратора</p>
          {applications.filter(a => a.type === "Адмін").map(a => (
            <NeonCard key={a.id} glowColor="lime">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{a.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{a.type}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toast.success("Схвалено")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toast.success("Відхилено")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}

      {/* Tokens Tab */}
      {tab === "tokens" && (
        <div className="space-y-4 animate-fade-in">
          <NeonCard glowColor="lime">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-neon-yellow" /> Управління токенами
            </h3>
            <div className="space-y-2">
              <input value={tokenNick} onChange={e => setTokenNick(e.target.value)} placeholder="Нік гравця" className={inputClass} />
              <input value={tokenAmount} onChange={e => setTokenAmount(e.target.value)} placeholder="Кількість CR" type="number" className={inputClass} />
              <div className="flex gap-2">
                <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={() => {
                  if (!tokenNick || !tokenAmount) return toast.error("Заповніть поля");
                  toast.success(`+${tokenAmount} CR виданo ${tokenNick}`);
                  setTokenNick(""); setTokenAmount("");
                }}>Видати</GradientButton>
                <GradientButton variant="danger" className="flex-1 text-xs py-2" onClick={() => {
                  if (!tokenNick || !tokenAmount) return toast.error("Заповніть поля");
                  toast.success(`-${tokenAmount} CR забрано у ${tokenNick}`);
                  setTokenNick(""); setTokenAmount("");
                }}>Забрати</GradientButton>
              </div>
            </div>
          </NeonCard>
        </div>
      )}

      {/* Voice Tab */}
      {tab === "voice" && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground">Модерація ідей та петицій</p>
          {["Додати систему таксі", "Побудувати лікарню"].map((v, i) => (
            <NeonCard key={i} glowColor="green">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">{v}</span>
                <div className="flex gap-1">
                  <button onClick={() => toast.success("Схвалено")} className="p-1.5 rounded-lg bg-primary/15 text-primary active:scale-95"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toast.success("Видалено")} className="p-1.5 rounded-lg bg-destructive/15 text-destructive active:scale-95"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
