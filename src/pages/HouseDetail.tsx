import { useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { MapPin, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { store } from "../lib/store";
import { toast } from "sonner";

const HouseDetail = () => {
  const { id } = useParams();
  const house = store.getHouses().find(h => h.id === Number(id));
  const [photoIdx, setPhotoIdx] = useState(0);

  if (!house) {
    return (
      <div className="min-h-screen bg-background pb-20 px-4 pt-4">
        <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/houses" />
        <p className="text-muted-foreground text-sm">Будинок не знайдено</p>
      </div>
    );
  }

  const photos = house.photos || [];

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title={house.name} backTo="/houses" />

      <div className="animate-fade-in">
        {/* Photo carousel */}
        <div className="relative w-full h-52 rounded-2xl liquid-glass-card border-neon-yellow/15 flex items-center justify-center mb-2 overflow-hidden">
          {photos[photoIdx]?.startsWith("data:") ? (
            <img src={photos[photoIdx]} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">{photos[photoIdx] || "🏠"}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full liquid-glass flex items-center justify-center active:scale-90 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full liquid-glass flex items-center justify-center active:scale-90 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </>
          )}
          <span className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-lg font-medium ${
            house.category === "Люкс"
              ? "bg-neon-yellow/15 text-neon-yellow border border-neon-yellow/20"
              : "bg-primary/15 text-primary border border-primary/20"
          }`}>
            {house.category}
          </span>
        </div>

        {/* Photo dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === photoIdx ? "bg-neon-yellow w-4" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <div className="liquid-glass-card rounded-2xl p-4 mb-4">
          <h2 className="text-lg font-bold text-foreground mb-1">{house.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{house.desc}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="liquid-glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Локація</span>
              </div>
              <span className="text-xs font-medium text-foreground">📍 Чернігів</span>
            </div>
            <div className="liquid-glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Статус</span>
              </div>
              <span className="text-xs font-medium text-primary">{house.owner ? "Зайнято" : "Вільно"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">Ціна:</span>
            <span className="text-neon-yellow font-bold text-xl">{house.price.toLocaleString()}$</span>
          </div>
        </div>

        <GradientButton
          variant="yellow"
          className="w-full"
          onClick={() => toast.info("Для покупки потрібна реєстрація та достатній баланс CR")}
        >
          Купити будинок
        </GradientButton>
      </div>
    </div>
  );
};

export default HouseDetail;
