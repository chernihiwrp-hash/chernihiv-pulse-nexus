import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { Home, Building } from "lucide-react";

export const housesData = [
  { id: 1, name: "Concrete Space", price: 150000, desc: "Мінімалістична квартира в центрі", category: "Люкс", owner: null, photos: ["🏢", "🛋️", "🪟", "🚿", "🅿️"] },
  { id: 2, name: "Green Villa", price: 250000, desc: "Приватний будинок з гаражем та садом", category: "Люкс", owner: null, photos: ["🏡", "🌳", "🚗", "🏊", "🌅"] },
  { id: 3, name: "Sky Penthouse", price: 500000, desc: "Розкішний вид на місто з тераси", category: "Люкс", owner: null, photos: ["🏙️", "🌃", "🛁", "🍷", "🌆"] },
  { id: 4, name: "Country House", price: 100000, desc: "Тихе місце за містом, великий сад", category: "Економ", owner: null, photos: ["🏕️", "🌾", "🐕", "🌻", "🏠"] },
  { id: 5, name: "Studio Flat", price: 80000, desc: "Компактна студія на П'ятницькій", category: "Економ", owner: null, photos: ["🏠", "📺", "🛏️", "🍳", "🪴"] },
  { id: 6, name: "River Cottage", price: 350000, desc: "Просторний котедж біля річки", category: "Люкс", owner: null, photos: ["🏘️", "🌊", "🎣", "🌲", "🔥"] },
];

const Houses = () => {
  const navigate = useNavigate();
  const total = housesData.length;
  const free = housesData.filter(h => !h.owner).length;
  const sold = total - free;

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="БУДИНКИ" subtitle="Нерухомість міста" backTo="/" />

      {/* Counter */}
      <div className="liquid-glass-card rounded-2xl p-3 mb-4 flex items-center justify-around animate-fade-in">
        <div className="text-center">
          <span className="text-lg font-bold text-foreground">{total}</span>
          <p className="text-[9px] text-muted-foreground">Всього</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <span className="text-lg font-bold text-primary">{free}</span>
          <p className="text-[9px] text-muted-foreground">Вільно</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <span className="text-lg font-bold text-neon-yellow">{sold}</span>
          <p className="text-[9px] text-muted-foreground">Продано</p>
        </div>
      </div>

      <div className="space-y-3">
        {housesData.map((h, i) => (
          <div key={h.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="yellow" onClick={() => navigate(`/houses/${h.id}`)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-neon-yellow/10 border border-neon-yellow/15 flex items-center justify-center">
                  {h.category === "Люкс" ? <Building className="w-6 h-6 text-neon-yellow" /> : <Home className="w-6 h-6 text-neon-yellow" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{h.name}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-medium ${
                      h.category === "Люкс"
                        ? "bg-neon-yellow/12 text-neon-yellow border border-neon-yellow/15"
                        : "bg-primary/12 text-primary border border-primary/15"
                    }`}>
                      {h.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{h.desc}</p>
                </div>
              </div>

              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {h.photos.map((p, j) => (
                  <div key={j} className="w-12 h-12 rounded-lg liquid-glass flex items-center justify-center text-lg shrink-0">
                    {p}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neon-yellow font-bold text-sm">{h.price.toLocaleString()}$</span>
                <span className="text-[9px] text-muted-foreground">{h.owner ? "Зайнято" : "Вільно"}</span>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Houses;
