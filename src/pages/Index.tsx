import { Newspaper, FileText, Home, Vote, ScrollText, Megaphone, Search, Car, UserPlus, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
import PulseCity from "../components/PulseCity";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";

const menuItems = [
  { icon: Newspaper, label: "Новини", desc: "Останні події", path: "/news" },
  { icon: FileText, label: "Ліцензії", desc: "Зброя та дозволи", path: "/licenses" },
  { icon: Home, label: "Будинки", desc: "Нерухомість", path: "/houses" },
  { icon: Vote, label: "Вибори мера", desc: "Голосування", path: "/mayor-election" },
  { icon: ScrollText, label: "Документи", desc: "Офіційні папери", path: "/documents" },
  { icon: Megaphone, label: "Голос міста", desc: "Скарги та ідеї", path: "/city-voice" },
  { icon: Search, label: "Розшук", desc: "Список розшуку", path: "/wanted" },
  { icon: Car, label: "Номери авто", desc: "Реєстрація", path: "/car-registration" },
];

const sosReasons = ["Читер", "Рейд", "Масове порушення", "Інше"];

const Index = () => {
  const navigate = useNavigate();
  const [showSos, setShowSos] = useState(false);
  const [sosReason, setSosReason] = useState("");
  const [sosDesc, setSosDesc] = useState("");

  const handleSos = () => {
    if (!sosReason) return toast.error("Оберіть причину");
    if (!sosDesc.trim()) return toast.error("Опишіть ситуацію");
    toast.success("🚨 SOS сигнал відправлено!");
    window.open("https://t.me/c/3287952590/26385", "_blank");
    setShowSos(false);
    setSosReason("");
    setSosDesc("");
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime">
            CHERNIHIV RP
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">ПОРТАЛ</p>
        </div>

        {/* SOS Button */}
        <button
          onClick={() => setShowSos(true)}
          className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-all group"
          style={{
            background: "linear-gradient(135deg, hsl(0 70% 50% / 0.15), hsl(0 70% 30% / 0.1))",
            boxShadow: "0 0 20px hsl(0 70% 50% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
            border: "1px solid hsl(0 70% 50% / 0.3)",
          }}
        >
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive" />
        </button>
      </div>

      {/* SOS Modal */}
      {showSos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowSos(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-2xl p-5 animate-fade-in"
            onClick={e => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 5%))",
              border: "1px solid hsl(0 70% 50% / 0.3)",
              boxShadow: "0 0 40px hsl(0 70% 50% / 0.2)",
            }}
          >
            <button onClick={() => setShowSos(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-display text-sm font-bold text-destructive">SOS СИГНАЛ</h3>
            </div>

            <label className="text-xs text-muted-foreground mb-2 block">Причина:</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sosReasons.map(r => (
                <button
                  key={r}
                  onClick={() => setSosReason(r)}
                  className={`text-xs px-3 py-2.5 rounded-xl border transition-all active:scale-95 ${
                    sosReason === r
                      ? "bg-destructive/20 border-destructive/40 text-destructive"
                      : "liquid-glass text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <label className="text-xs text-muted-foreground mb-2 block">Опис ситуації:</label>
            <textarea
              value={sosDesc}
              onChange={e => setSosDesc(e.target.value)}
              placeholder="Опишіть що сталося..."
              className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive/40 resize-none h-24 bg-transparent mb-4"
            />

            <GradientButton variant="danger" className="w-full" onClick={handleSos}>
              🚨 Відправити SOS
            </GradientButton>
          </div>
        </div>
      )}

      {/* Pulse City */}
      <div className="mb-6 animate-fade-in">
        <PulseCity />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item, i) => (
          <div key={item.label} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <NeonCard glowColor="lime" onClick={() => navigate(item.path)}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </NeonCard>
          </div>
        ))}
      </div>

      {/* Admin Application */}
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
