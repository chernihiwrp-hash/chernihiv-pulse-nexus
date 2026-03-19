import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { MapPin, Ruler, ChevronLeft, ChevronRight, X } from "lucide-react";
import { store } from "../lib/store";
import type { HouseItem } from "../lib/store";
import { toast } from "sonner";

const HouseDetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState<HouseItem | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    store.getHouses().then(houses => {
      const found = houses.find(h => h.id === Number(id));
      if (found) setHouse(found);
    });
  }, [id]);

  if (!house) return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/houses" />
      <p className="text-muted-foreground text-sm">Будинок не знайдено</p>
    </div>
  );

  const photos = house.photos || [];

  const handleBuy = async () => {
    if (!nick.trim()) return toast.error("Вкажіть ваш нікнейм");
    setLoading(true);
    const ok = await store.submitHousePurchase(house.id, nick);
    if (ok) {
      toast.success("Заявку на купівлю відправлено адміністрації!");
      setShowForm(false);
      setNick("");
    } else {
      toast.error("Помилка відправки. Спробуйте ще раз.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title={house.name} backTo="/houses" />
      <div className="animate-fade-in">
        <div className="relative w-full h-52 rounded-2xl liquid-glass-card border-neon-yellow/15 flex items-center justify-center mb-2 overflow-hidden">
          {photos[photoIdx]?.startsWith("http") || photos[photoIdx]?.startsWith("data:") ? (
            <img src={photos[photoIdx]} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">{photos[photoIdx] || "🏠"}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
          {photos.length > 1 && (
            <>
              <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full liquid-glass flex items-center justify-center active:scale-90">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full liquid-glass flex items-center justify-center active:scale-90">
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </>
          )}
          <span className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-lg font-medium ${
            house.category === "Люкс" ? "bg-neon-yellow/15 text-neon-yellow border border-neon-yellow/20" : "bg-primary/15 text-primary border border-primary/20"
          }`}>{house.category}</span>
        </div>

        <div className="flex justify-center gap-1.5 mb-4">
          {photos.map((_, i) => (
            <button key={i} onClick={() => setPhotoIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === photoIdx ? "bg-neon-yellow w-4" : "bg-muted-foreground/30"}`} />
          ))}
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 mb-4">
          <h2 className="text-lg font-bold text-foreground mb-1">{house.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{house.desc}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="liquid-glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">Локація</span></div>
              <span className="text-xs font-medium text-foreground">📍 Чернігів</span>
            </div>
            <div className="liquid-glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1"><Ruler className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">Статус</span></div>
              <span className={`text-xs font-medium ${house.owner ? "text-destructive" : "text-primary"}`}>{house.owner ? "Зайнято" : "Вільно"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">Ціна:</span>
            <span className="text-neon-yellow font-bold text-xl">{house.price.toLocaleString()} CR</span>
          </div>
        </div>

        {!house.owner && !showForm && (
          <GradientButton variant="yellow" className="w-full" onClick={() => setShowForm(true)}>
            Купити будинок
          </GradientButton>
        )}

        {house.owner && (
          <div className="liquid-glass rounded-2xl p-4 text-center">
            <p className="text-sm text-destructive font-semibold">Будинок вже куплено</p>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowForm(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm rounded-2xl p-5 animate-fade-in" onClick={e => e.stopPropagation()}
              style={{ background: "linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 5%))", border: "1px solid hsl(45 100% 55% / 0.3)", boxShadow: "0 0 40px hsl(45 100% 55% / 0.15)" }}>
              <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-muted-foreground"><X className="w-5 h-5" /></button>
              <h3 className="font-display text-sm font-bold text-neon-yellow mb-1">Заявка на купівлю</h3>
              <p className="text-xs text-muted-foreground mb-4">{house.name} — {house.price.toLocaleString()} CR</p>
              <label className="text-xs text-muted-foreground mb-1 block">Ваш нікнейм</label>
              <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Ваш нік в грі"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/30 bg-transparent mb-4" />
              <GradientButton variant="yellow" className="w-full" onClick={handleBuy} disabled={loading}>
                {loading ? "Відправляю..." : "Відправити заявку"}
              </GradientButton>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Адміністрація розгляне вашу заявку</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseDetail;
