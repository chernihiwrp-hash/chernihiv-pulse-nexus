import {
  Newspaper, FileText, Home, Vote, ScrollText, Megaphone,
  Search, Car, UserPlus, AlertTriangle, X, Gamepad2, Copy,
  Check, Swords, Bug, UserX, HelpCircle, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseCity from "../components/PulseCity";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";
import { store } from "../lib/store";

const menuItems = [
  { icon: Newspaper, label: "Новини", desc: "Останні події", path: "/news" },
  { icon: FileText, label: "Ліцензії", desc: "Зброя та дозволи", path: "/licenses" },
  { icon: Home, label: "Будинки", desc: "Нерухомість", path: "/houses" },
  { icon: Vote, label: "Вибори мера", desc: "Голосування", path: "/mayor-election" },
  { icon: ScrollText, label: "Документи", desc: "Офіційні папери", path: "/documents" },
  { icon: Megaphone, label: "Голос міста", desc: "Скарги та ідеї", path: "/city-voice" },
  { icon: Search, label: "Розшук", desc: "Список розшуку", path: "/wanted", red: true },
  { icon: Car, label: "Номери авто", desc: "Реєстрація", path: "/car-registration" },
];

const sosTypes = [
  { id: "raid", label: "РЕЙД", icon: Swords, activeBg: "bg-orange-400/15 border-orange-400/40 text-orange-400" },
  { id: "cheater", label: "ЧИТЕР", icon: Bug, activeBg: "bg-red-400/15 border-red-400/40 text-red-400" },
  { id: "nrp", label: "НРП", icon: UserX, activeBg: "bg-yellow-400/15 border-yellow-400/40 text-yellow-400" },
  { id: "other", label: "ІНШЕ", icon: HelpCircle, activeBg: "bg-muted/20 border-muted/40 text-foreground" },
];

const ROBLOX_URL = "https://www.roblox.com/games/start?placeId=7711635737&launchData=joinCode%3D5319vick";
const SERVER_CODE = "5319vick";

const Index = () => {
  const navigate = useNavigate();
  const [showSos, setShowSos] = useState(false);
  const [sosType, setSosType] = useState("raid");
  const [sosDesc, setSosDesc] = useState("");
  const [sosNick, setSosNick] = useState("");
  const [copied, setCopied] = useState(false);
  const [sosSending, setSosSending] = useState(false);

  const handleSos = async () => {
    if (!sosDesc.trim()) return toast.error("Опишіть ситуацію");
    setSosSending(true);
    await store.addSos(sosNick || localStorage.getItem("crp_nick") || "Гравець", sosType, sosDesc, sosType as "raid" | "cheater" | "nrp" | "other");
    setSosSending(false);
    setShowSos(false);
    setSosDesc(""); setSosNick("");
    toast.success("SOS сигнал відправлено адміністрації!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(SERVER_CODE);
    setCopied(true);
    toast.success("Код скопійовано!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">CHERNIHIV RP</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ПОРТАЛ</p>
        </div>
        <button onClick={() => setShowSos(true)}
          className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all"
          style={{ background: "hsl(0 70% 50% / 0.12)", boxShadow: "0 0 16px hsl(0 70% 50% / 0.25)", border: "1px solid hsl(0 70% 50% / 0.25)" }}>
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive" />
        </button>
      </div>

      {/* Play + server code */}
      <div className="flex items-center gap-3 mb-5">
        {/* ГРАТИ — реальне посилання на Roblox */}
        <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, hsl(142, 71%, 42%), hsl(142, 71%, 22%))", boxShadow: "0 0 20px hsl(142 71% 45% / 0.35)" }}>
          <Gamepad2 className="w-5 h-5" />
          ГРАТИ
        </a>
        <div className="flex-1 liquid-glass rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-muted-foreground">КОД СЕРВЕРУ</p>
            <p className="text-sm font-mono font-bold text-primary">{SERVER_CODE}</p>
          </div>
          <button onClick={copyCode} className="p-1.5 rounded-lg liquid-glass active:scale-95 transition-all">
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* SOS Modal */}
      {showSos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowSos(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div className="relative w-full max-w-sm rounded-2xl p-5 animate-fade-in liquid-glass-strong" onClick={e => e.stopPropagation()}
            style={{ border: "1px solid hsl(0 70% 50% / 0.25)", boxShadow: "0 0 40px hsl(0 70% 50% / 0.15)" }}>
            <button onClick={() => setShowSos(false)} className="absolute top-3 right-3 text-muted-foreground"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-destructive/15 border border-destructive/25 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="font-display text-sm font-bold text-destructive">SOS СИГНАЛ</h3>
            </div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Ваш нік</label>
            <input value={sosNick || localStorage.getItem("crp_nick") || ""} onChange={e => setSosNick(e.target.value)} placeholder="Нік в грі"
              className="w-full liquid-glass rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/30 bg-transparent mb-3" />
            <label className="text-xs text-muted-foreground mb-1.5 block">Тип порушення</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {sosTypes.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setSosType(t.id)}
                    className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border transition-all active:scale-95 ${sosType === t.id ? t.activeBg : "liquid-glass text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" /> {t.label}
                  </button>
                );
              })}
            </div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Опис ситуації</label>
            <textarea value={sosDesc} onChange={e => setSosDesc(e.target.value)} placeholder="Детально опишіть що сталося..."
              className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none h-20 bg-transparent mb-4" />
            <GradientButton variant="danger" className="w-full" onClick={handleSos} disabled={sosSending}>
              <AlertTriangle className="w-4 h-4 inline mr-1.5" />
              {sosSending ? "Відправляю..." : "Відправити SOS"}
            </GradientButton>
          </div>
        </div>
      )}

      <div className="mb-5 animate-fade-in"><PulseCity /></div>

      <div className="space-y-2 mb-4">
        {menuItems.map((item, i) => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className="w-full animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] ${item.red ? "hover:border-destructive/20" : "hover:border-primary/20"}`}
              onMouseEnter={e => { const color = item.red ? "hsl(0 70% 50% / 0.12)" : "hsl(84 81% 44% / 0.12)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${color}`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.red ? "bg-destructive/10 border border-destructive/15" : "bg-primary/10 border border-primary/12"}`}>
                <item.icon className={`w-5 h-5 ${item.red ? "text-destructive" : "text-primary"}`} />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${item.red ? "text-destructive" : "text-foreground"}`}>{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => navigate("/admin-application")} className="w-full animate-slide-up" style={{ animationDelay: "420ms" }}>
        <div className="liquid-glass-card rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all hover:border-primary/20 hover:scale-[1.01] active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 border border-primary/15 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Заявка на адміністрацію</p>
            <p className="text-[10px] text-muted-foreground">Стань адміністратором сервера</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </button>
    </div>
  );
};

export default Index;
