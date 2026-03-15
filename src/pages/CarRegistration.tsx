import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import NeonCard from "../components/NeonCard";
import { Car, Search } from "lucide-react";
import { toast } from "sonner";
import { store } from "../lib/store";

const CarRegistration = () => {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [cars, setCars] = useState(store.getCars());
  const [search, setSearch] = useState("");

  const filtered = cars.filter(c => c.plate.toLowerCase().includes(search.toLowerCase()) || c.model.toLowerCase().includes(search.toLowerCase()));

  const register = () => {
    if (!plate || !model) return toast.error("Заповніть усі поля");
    const updated = [{ plate, model, owner: "Ви" }, ...cars];
    setCars(updated);
    store.setCars(updated);
    toast.success("Номер зареєстровано!");
    setPlate(""); setModel("");
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="НОМЕРИ АВТО" subtitle="Реєстрація транспорту" backTo="/" />

      <div className="animate-fade-in space-y-4">
        <NeonCard glowColor="yellow">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-6 h-6 text-neon-yellow" />
            <span className="text-sm font-semibold text-foreground">Реєстрація номера</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Номерний знак</label>
              <input value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} placeholder="AA 0000 AA"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/30 bg-transparent font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Модель авто</label>
              <input value={model} onChange={e => setModel(e.target.value)} placeholder="BMW M5"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/30 bg-transparent" />
            </div>
          </div>
        </NeonCard>

        <GradientButton variant="yellow" className="w-full" onClick={register}>Зареєструвати</GradientButton>

        <div className="liquid-glass-card rounded-2xl p-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук за номером або моделлю..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </div>

        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 gap-2 px-4 py-2 border-b border-border">
            <span className="text-[10px] text-muted-foreground font-semibold">НОМЕР</span>
            <span className="text-[10px] text-muted-foreground font-semibold">МОДЕЛЬ</span>
            <span className="text-[10px] text-muted-foreground font-semibold">ВЛАСНИК</span>
          </div>
          {filtered.map((c, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-border/50 last:border-0">
              <span className="text-xs text-neon-yellow font-mono font-bold">{c.plate}</span>
              <span className="text-xs text-foreground">{c.model}</span>
              <span className="text-xs text-muted-foreground">{c.owner}</span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">Нічого не знайдено</p>}
        </div>
      </div>
    </div>
  );
};

export default CarRegistration;
