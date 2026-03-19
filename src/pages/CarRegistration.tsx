import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import NeonCard from "../components/NeonCard";
import { Car, Search } from "lucide-react";
import { toast } from "sonner";
import { store } from "../lib/store";
import type { CarRecord } from "../lib/store";

const PLATE_REGEX = /^[A-ZА-ЯІЇЄ]{2} [A-ZА-ЯІЇЄ]{2} \d{2}$/;

const CarRegistration = () => {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [nick, setNick] = useState("");
  const [cars, setCars] = useState<CarRecord[]>([]); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const plateValid = PLATE_REGEX.test(plate);
  const plateInvalid = plate.length > 0 && !plateValid;

  useEffect(() => {
    store.getCars().then(setCars);
  }, []);

  const filtered = cars.filter(c =>
    c.plate.toLowerCase().includes(search.toLowerCase()) ||
    c.model.toLowerCase().includes(search.toLowerCase())
  );

  const register = async () => {
    if (!nick) return toast.error("Вкажіть нікнейм");
    if (!plate || !model) return toast.error("Заповніть усі поля");
    if (!plateValid) return toast.error("Невірний формат номера! Шаблон: АА БВ 12");
    setLoading(true);
    await store.submitLicense(nick, model, plate);
    toast.success("Заявку на номер відправлено! Очікуйте підтвердження адміністрації.");
    setPlate(""); setModel(""); setNick("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="НОМЕРИ АВТО" subtitle="Реєстрація транспорту" backTo="/" />
      <div className="animate-fade-in space-y-4">
        <NeonCard glowColor="yellow">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-6 h-6 text-neon-yellow" />
            <span className="text-sm font-semibold text-foreground">Заявка на номерний знак</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ваш нікнейм</label>
              <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Ваш нік"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/30 bg-transparent" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Номерний знак <span className="text-muted-foreground/60">(шаблон: АА БВ 12)</span>
              </label>
              <input
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                placeholder="АА БВ 12"
                className={`w-full liquid-glass rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 bg-transparent font-mono transition-colors ${
                  plateInvalid
                    ? "text-red-500 focus:ring-red-500/30 border-red-500/30"
                    : plateValid
                    ? "text-green-400 focus:ring-neon-yellow/30"
                    : "text-foreground focus:ring-neon-yellow/30"
                }`}
              />
              {plateInvalid && (
                <p className="text-red-500 text-[10px] mt-1">❌ Невірний формат. Потрібно: 2 букви пробіл 2 букви пробіл 2 цифри</p>
              )}
              {plateValid && (
                <p className="text-green-400 text-[10px] mt-1">✅ Формат вірний</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Модель авто</label>
              <input value={model} onChange={e => setModel(e.target.value)} placeholder="BMW M5"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/30 bg-transparent" />
            </div>
          </div>
        </NeonCard>

        <GradientButton variant="yellow" className="w-full" onClick={register} disabled={loading}>
          {loading ? "Відправляю..." : "Подати заявку"}
        </GradientButton>

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
