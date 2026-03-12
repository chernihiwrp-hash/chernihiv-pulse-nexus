import { useNavigate } from "react-router-dom";
import NeonCard from "../components/NeonCard";
import { housesData } from "./Houses";

const Shop = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-green mb-2">
        МАГАЗИН
      </h1>
      <p className="text-xs text-muted-foreground mb-6">Нерухомість та послуги</p>

      <div className="space-y-3">
        {housesData.map((h, i) => (
          <div
            key={h.name}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <NeonCard glowColor="yellow" onClick={() => navigate(`/houses/${h.id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{h.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-neon-yellow font-bold text-sm">{h.price.toLocaleString()}$</span>
                <span className="text-[10px] bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20 px-3 py-1.5 rounded-lg font-medium">
                  Детальніше →
                </span>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
