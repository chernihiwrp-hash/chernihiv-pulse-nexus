import {
  Newspaper, FileText, Home, Vote, ScrollText, Megaphone,
  Search, Car, UserPlus, AlertTriangle, X, Gamepad2, Copy,
  Check, Swords, Bug, UserX, HelpCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
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
    await store.addSos(sosNick || "Гравець", sosType, sosDesc, sosType as "raid" | "cheater" | "nrp" | "other");
    setSosSending(false);
    setShowSos(false);
    setSosDesc("");
    setSosNick("");
    toast.success("SOS сигнал відправлено адміністрації!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(SERVER_CODE);
    setCopied(true);
    toast.success("Код скопійовано!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">CHERNIHIV RP</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ПОРТАЛ</p>
        </div>
        <button onClick={() => setShowSos(true)}
          className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all"
          style={{ background: "linear-gradient(135deg, hsl(0 70% 50% / 0.15), hsl(0 70% 30% / 0.1))", boxShadow: "0 0 20px hsl(0 70% 50% / 0.3)", border: "1px solid hsl(0 70% 50% / 0.3)" }}>
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => toast.info("Запускай Roblox і вводь код сервера!")}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, hsl(142, 71%, 45%), hsl(142, 71%, 25%))", boxShadow: "0 0 20px hsl(142 71% 45% / 0.4)" }}>
          <Gamepad2 className="w-5 h-5 text-white" />
          ГРАТИ
        </button>
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

      {showSos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowSos(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-2xl p-5 animate-fade-in" onClick={e => e.stopPropagation()}
            style={{ background: "linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 5%))", border: "1px solid hsl(0 70% 50% / 0.3)", boxShadow: "0 0 40px hsl(0 70% 50% / 0.2)" }}>
            <button onClick={() => setShowSos(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="font-display text-sm font-bold text-destructive">SOS СИГНАЛ</h3>
            </div>

            <label className="text-xs text-muted-foreground mb-2 block">Ваш нік</label>
            <input value={sosNick} onChange={e => setSosNick(e.target.value)} placeholder="Нік в грі"
              className="w-full liquid-glass rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/30 bg-transparent mb-3" />

            <label className="text-xs text-muted-foreground mb-2 block">Тип порушення</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sosTypes.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setSosType(t.id)}
                    className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border transition-all active:scale-95 ${sosType === t.id ? t.activeBg : "liquid-glass text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <label className="text-xs text-muted-foreground mb-2 block">Опис ситуації</label>
            <textarea value={sosDesc} onChange={e => setSosDesc(e.target.value)} placeholder="Детально опишіть що сталося..."
              className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/30 resize-none h-20 bg-transparent mb-4" />

            <GradientButton variant="danger" className="w-full" onClick={handleSos} disabled={sosSending}>
              <AlertTriangle className="w-4 h-4 inline mr-1.5" />
              {sosSending ? "Відправляю..." : "Відправити SOS"}
            </GradientButton>
          </div>
        </div>
      )}

      <div className="mb-6 animate-fade-in"><PulseCity /></div>

      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item, i) => (
          <div key={item.label} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <NeonCard glowColor={item.red ? "red" : "lime"} onClick={() => navigate(item.path)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.red ? "bg-destructive/10 border border-destructive/15" : "bg-primary/10 border border-primary/15"}`}>
                <item.icon className={`w-5 h-5 ${item.red ? "text-destructive" : "text-primary"}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </NeonCard>
          </div>
        ))}
      </div>

      <div className="mt-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
        <NeonCard glowColor="lime" onClick={() => navigate("/admin-application")}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 border border-primary/15 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Заявка на адміністрацію</h3>
              <p className="text-[10px] text-muted-foreground">Стань адміністратором сервера</p>
            </div>
            <span className="text-[10px] text-primary font-medium">→</span>
          </div>
        </NeonCard>
      </div>
    </div>
  );
};

export default Index;
