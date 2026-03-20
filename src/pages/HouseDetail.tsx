import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import {
  MapPin, ChevronLeft, ChevronRight, Home, Coins,
  CheckCircle, XCircle, Send, User, Sparkles, Tag
} from "lucide-react";
import { store } from "../lib/store";
import type { HouseItem } from "../lib/store";
import { toast } from "sonner";

const HouseDetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState<HouseItem | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [nick, setNick] = useState(() => localStorage.getItem("crp_nick") || "");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    store.getHouses().then(houses => {
      const found = houses.find(h => h.id === Number(id));
      if (found) setHouse(found);
    });
  }, [id]);

  if (!house) return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/houses" />
      <div className="text-center py-12">
        <Home className="w-10 h-10 text-muted-foreground opacity-20 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Будинок не знайдено</p>
      </div>
    </div>
  );

  const photos = house.photos || (house.image ? [house.image] : []);
  const isAvailable = !house.owner;

  const handleBuy = async () => {
    if (!nick.trim()) return toast.error("Вкажіть ваш нікнейм");
    setLoading(true);
    const ok = await store.submitHousePurchase(house.id, nick);
    setLoading(false);
    if (ok) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      toast.error("Помилка. Спробуйте ще раз.");
    }
  };

  return (
    <div className="min-h-screen pb-28 px-4 pt-4">
      <PageHeader title={house.name} backTo="/houses" />

      <div className="animate-fade-in space-y-4">

        {/* === ФОТО === */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden"
          style={{ border: "1px solid hsl(0 0% 100% / 0.08)" }}>
          {photos.length > 0 && (photos[photoIdx]?.startsWith("http") || photos[photoIdx]?.startsWith("data:")) ? (
            <img src={photos[photoIdx]} alt={house.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(84 81% 44% / 0.08), hsl(142 71% 45% / 0.04))" }}>
              <Home className="w-16 h-16 text-primary/20" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold backdrop-blur-sm ${
              house.category === "Люкс"
                ? "text-yellow-300"
                : "text-primary"
            }`}
              style={{
                background: house.category === "Люкс" ? "hsl(45 100% 55% / 0.15)" : "hsl(84 81% 44% / 0.15)",
                border: house.category === "Люкс" ? "1px solid hsl(45 100% 55% / 0.3)" : "1px solid hsl(84 81% 44% / 0.3)"
              }}>
              <Sparkles className="w-3 h-3" />
              {house.category}
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold backdrop-blur-sm ${
              isAvailable ? "text-primary" : "text-destructive"
            }`}
              style={{
                background: isAvailable ? "hsl(84 81% 44% / 0.15)" : "hsl(0 70% 50% / 0.15)",
                border: isAvailable ? "1px solid hsl(84 81% 44% / 0.3)" : "1px solid hsl(0 70% 50% / 0.3)"
              }}>
              {isAvailable
                ? <><CheckCircle className="w-3 h-3" /> Вільно</>
                : <><XCircle className="w-3 h-3" /> Зайнято</>
              }
            </div>
          </div>

          {/* Price bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p className="text-white font-bold text-lg leading-tight">{house.name}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-sm"
              style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(45 100% 55% / 0.25)" }}>
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">{house.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Photo nav */}
          {photos.length > 1 && (
            <>
              <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90"
                style={{ background: "hsl(0 0% 0% / 0.5)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90"
                style={{ background: "hsl(0 0% 0% / 0.5)", border: "1px solid hsl(0 0% 100% / 0.15)" }}>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {photos.length > 1 && (
          <div className="flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setPhotoIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === photoIdx ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"}`} />
            ))}
          </div>
        )}

        {/* === INFO CARD === */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(0 0% 100% / 0.07)", backdropFilter: "blur(20px)" }}>

          {/* Desc */}
          {house.desc && (
            <div className="px-4 py-3 border-b" style={{ borderColor: "hsl(0 0% 100% / 0.05)" }}>
              <p className="text-sm text-muted-foreground leading-relaxed">{house.desc}</p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: "hsl(0 0% 100% / 0.05)" }}>
            <div className="px-3 py-3 text-center">
              <MapPin className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground mb-0.5">Локація</p>
              <p className="text-[10px] font-semibold text-foreground">Чернігів</p>
            </div>
            <div className="px-3 py-3 text-center" style={{ borderLeft: "1px solid hsl(0 0% 100% / 0.05)" }}>
              <Tag className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground mb-0.5">Категорія</p>
              <p className="text-[10px] font-semibold text-foreground">{house.category}</p>
            </div>
            <div className="px-3 py-3 text-center" style={{ borderLeft: "1px solid hsl(0 0% 100% / 0.05)" }}>
              <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-[9px] text-muted-foreground mb-0.5">Ціна</p>
              <p className="text-[10px] font-bold text-yellow-400">{house.price.toLocaleString()} CR</p>
            </div>
          </div>
        </div>

        {/* === КУПІВЛЯ === */}
        {isAvailable ? (
          submitted ? (
            /* Успіх */
            <div className="rounded-2xl p-5 text-center animate-fade-in"
              style={{ background: "hsl(84 81% 44% / 0.06)", border: "1px solid hsl(84 81% 44% / 0.2)" }}>
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" style={{ filter: "drop-shadow(0 0 8px hsl(84 81% 44%))" }} />
              <p className="text-sm font-bold text-foreground mb-1">Заявку відправлено!</p>
              <p className="text-[11px] text-muted-foreground">Адміністрація розгляне запит на будинок</p>
              <div className="flex items-center justify-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl mx-auto w-fit"
                style={{ background: "hsl(84 81% 44% / 0.1)", border: "1px solid hsl(84 81% 44% / 0.2)" }}>
                <CheckCircle className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-primary">Сповіщення прийде в профіль</span>
              </div>
            </div>
          ) : (
            /* Форма купівлі */
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(84 81% 44% / 0.15)", backdropFilter: "blur(20px)" }}>

              {/* Header */}
              <div className="px-4 py-3 border-b flex items-center gap-3"
                style={{ borderColor: "hsl(0 0% 100% / 0.05)", background: "hsl(84 81% 44% / 0.04)" }}>
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Подати заявку</p>
                  <p className="text-[10px] text-muted-foreground">{house.name} · {house.price.toLocaleString()} CR</p>
                </div>
              </div>

              {/* Form */}
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Ваш нікнейм
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={nick}
                      onChange={e => setNick(e.target.value)}
                      placeholder="Нік в грі"
                      className="w-full liquid-glass rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
                    />
                  </div>
                </div>

                {/* Price summary */}
                <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: "hsl(45 100% 55% / 0.05)", border: "1px solid hsl(45 100% 55% / 0.12)" }}>
                  <span className="text-xs text-muted-foreground">Сума до сплати</span>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-400">{house.price.toLocaleString()} CR</span>
                  </div>
                </div>

                <GradientButton
                  variant="green"
                  className="w-full"
                  onClick={handleBuy}
                  disabled={loading || !nick.trim()}>
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Відправляю...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Send className="w-4 h-4" />
                      Подати заявку на купівлю
                    </span>
                  )}
                </GradientButton>

                <p className="text-[10px] text-muted-foreground/60 text-center">
                  Адміністрація розгляне заявку та зв'яжеться з вами
                </p>
              </div>
            </div>
          )
        ) : (
          /* Зайнято */
          <div className="rounded-2xl p-5 text-center"
            style={{ background: "hsl(0 70% 50% / 0.05)", border: "1px solid hsl(0 70% 50% / 0.2)" }}>
            <XCircle className="w-9 h-9 text-destructive mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-destructive">Будинок вже куплено</p>
            <p className="text-[10px] text-muted-foreground mt-1">Цей будинок вже має власника</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseDetail;
