import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { Home, Building } from "lucide-react";
import { store } from "../lib/store";

const Houses = () => {
  const navigate = useNavigate();
  const [houses] = useState(store.getHouses());
  const total = houses.length;
  const free = houses.filter(h => !h.owner).length;
  const sold = total - free;

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="БУДИНКИ" subtitle="Нерухомість міста" backTo="/" />

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
        {houses.map((h, i) => {
          const isSold = !!h.owner;
          const realPhotos = h.photos.filter(p => p.startsWith("data:"));
          return (
            <div key={h.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <NeonCard glowColor="yellow" onClick={() => navigate(`/houses/${h.id}`)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neon-yellow/10 border border-neon-yellow/15 flex items-center justify-center">
                    {h.category === "Люкс" ? <Building className="w-6 h-6 text-neon-yellow" /> : <Home className="w-6 h-6 text-neon-yellow" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{h.name}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                        isSold ? "bg-destructive/15 text-destructive border border-destructive/20" : "bg-primary/15 text-primary border border-primary/20"
                      }`}>
                        {isSold ? "ПРОДАНО" : "ВІЛЬНО"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{h.desc}</p>
                  </div>
                </div>

                {realPhotos.length > 0 && (
                  <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                    {realPhotos.map((p, j) => (
                      <img key={j} src={p} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                    ))}
                  </div>
                )}
                {realPhotos.length === 0 && (
                  <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                    {h.photos.map((p, j) => (
                      <div key={j} className="w-12 h-12 rounded-lg liquid-glass flex items-center justify-center text-lg shrink-0">{p}</div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-sm px-3 py-1 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, hsl(45 100% 55% / 0.15), hsl(30 100% 55% / 0.08))",
                      color: "hsl(45, 100%, 55%)",
                      border: "1px solid hsl(45 100% 55% / 0.2)",
                    }}
                  >
                    {h.price.toLocaleString()} CR
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${h.category === "Люкс" ? "bg-neon-yellow/10 text-neon-yellow" : "bg-primary/10 text-primary"}`}>
                    {h.category}
                  </span>
                </div>
              </NeonCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Houses;
