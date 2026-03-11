import NeonCard from "../components/NeonCard";

const houses = [
  { name: "Квартира на Миру", price: 150000, desc: "Центр міста, 2 кімнати" },
  { name: "Будинок на Шевченка", price: 250000, desc: "Приватний будинок з гаражем" },
  { name: "Пентхаус", price: 500000, desc: "Розкішний вид на місто" },
  { name: "Дача за містом", price: 100000, desc: "Тихе місце, сад" },
];

const Shop = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-green mb-2">
        МАГАЗИН
      </h1>
      <p className="text-xs text-muted-foreground mb-6">Нерухомість та послуги</p>

      <div className="space-y-3">
        {houses.map((h, i) => (
          <div
            key={h.name}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <NeonCard glowColor="yellow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{h.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-neon-yellow font-bold text-sm">{h.price.toLocaleString()}$</span>
                <button className="text-[10px] bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20 px-3 py-1.5 rounded-lg font-medium card-press hover:bg-neon-yellow/20 transition-colors">
                  Купити
                </button>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
