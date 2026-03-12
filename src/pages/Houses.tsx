import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { Home } from "lucide-react";

export const housesData = [
  { id: 1, name: "Квартира на Миру", price: 150000, desc: "Центр міста, 2 кімнати", owner: null },
  { id: 2, name: "Будинок на Шевченка", price: 250000, desc: "Приватний будинок з гаражем", owner: null },
  { id: 3, name: "Пентхаус", price: 500000, desc: "Розкішний вид на місто", owner: null },
  { id: 4, name: "Дача за містом", price: 100000, desc: "Тихе місце, сад", owner: null },
  { id: 5, name: "Студія на П'ятницькій", price: 80000, desc: "Компактна студія", owner: null },
  { id: 6, name: "Котедж біля річки", price: 350000, desc: "Просторний двір", owner: null },
];

const Houses = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="БУДИНКИ" subtitle="Нерухомість міста" backTo="/" />
      <div className="space-y-3">
        {housesData.map((h, i) => (
          <div key={h.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="yellow" onClick={() => navigate(`/houses/${h.id}`)}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-neon-yellow" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{h.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{h.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-neon-yellow font-bold text-sm">{h.price.toLocaleString()}$</span>
                  <p className="text-[9px] text-muted-foreground">{h.owner ? "Зайнято" : "Вільно"}</p>
                </div>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Houses;
