import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { Car, Search, CheckCircle, XCircle, Clock, Users } from "lucide-react";
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
  const [fetching, setFetching] = useState(true);

  const plateValid = PLATE_REGEX.test(plate);
  const plateInvalid = plate.length > 0 && !plateValid;

  useEffect(() => {
    store.getCars().then(data => { setCars(data); setFetching(false); });
  }, []);

  const filtered = cars.filter(c =>
    c.plate.toLowerCase().includes(search.toLowerCase()) ||
    c.model.toLowerCase().includes(search.toLowerCase()) ||
    c.owner.toLowerCase().includes(search.toLowerCase())
  );

  const register = async () => {
    if (!nick) return toast.error("Вкажіть нікнейм");
    if (!plate || !model) return toast.error("Заповніть усі поля");
    if (!plateValid) return toast.error("Невірний формат! Шаблон: АА БВ 12");
    setLoading(true);
    await store.submitLicense(nick, model, plate);
    toast.success("Заявку відправлено! Адміністрація розгляне її.");
    setPlate(""); setModel(""); setNick("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <PageHeader title="РЕЄСТР НОМЕРІВ" subtitle="Транспортні засоби" backTo="/" />

      {/* Form card */}
      <div className="rounded-2xl overflow-hidden mb-4 animate-fade-in"
        style={{ background: "hsl(0 0% 0% / 0.5)", border: "1px solid hsl(84 81% 44% / 0.15)", backdropFilter: "blur(20px)" }}>
        
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "hsl(0 0% 100% / 0.06)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(84 81% 44% / 0.1)", border: "1px solid hsl(84 81% 44% / 0.2)" }}>
            <Car className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Нова заявка</p>
            <p className="text-[10px] text-muted-foreground">Формат: АА БВ 12</p>
          </div>
        </div>

        {/* Fields */}
        <div className="p-4 space-y-3">
          {/* Nick */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Нікнейм</label>
            <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Ваш нік в грі"
              className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent" />
          </div>

          {/* Plate */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Номерний знак</label>
            <div className="relative">
              <input
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                placeholder="АА БВ 12"
                maxLength={8}
                className={`w-full rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none bg-transparent font-mono font-bold text-lg tracking-widest transition-all ${
                  plateInvalid
                    ? "text-red-400 ring-1 ring-red-500/40"
                    : plateValid
                    ? "text-primary ring-1 ring-primary/40"
                    : "text-foreground"
                } liquid-glass`}
              />
              {plate.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {plateValid
                    ? <CheckCircle className="w-4 h-4 text-primary" />
                    : <XCircle className="w-4 h-4 text-red-400" />}
                </div>
              )}
            </div>
            {plateInvalid && (
              <p className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Невірний формат. Приклад: АА БВ 12
              </p>
            )}
            {plateValid && (
              <p className="text-primary text-[10px] mt-1.5 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Формат вірний
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Модель авто</label>
            <input value={model} onChange={e => setModel(e.target.value)} placeholder="Напр: BMW M5"
              className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent" />
          </div>

          <GradientButton variant="green" className="w-full mt-1" onClick={register} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <Clock className="w-4 h-4 animate-spin" /> Відправляю...
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Car className="w-4 h-4" /> Подати заявку
              </span>
            )}
          </GradientButton>
        </div>
      </div>

      {/* Registry */}
      <div className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: "hsl(0 0% 0% / 0.4)", border: "1px solid hsl(0 0% 100% / 0.07)", backdropFilter: "blur(20px)" }}>

        {/* Search */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "hsl(0 0% 100% / 0.06)" }}>
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Пошук за номером, моделлю або ніком..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          <div className="flex items-center gap-1.5 shrink-0">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{cars.length}</span>
          </div>
        </div>

        {/* List */}
        {fetching ? (
          <div className="py-8 text-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Завантаження...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center">
            <Car className="w-7 h-7 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Нічого не знайдено</p>
          </div>
        ) : (
          <div>
            {filtered.map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 transition-colors"
                style={{ borderColor: "hsl(0 0% 100% / 0.05)" }}>
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "hsl(84 81% 44% / 0.08)", border: "1px solid hsl(84 81% 44% / 0.12)" }}>
                  <Car className="w-4 h-4 text-primary/50" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{c.owner}</p>
                  <p className="text-[10px] text-muted-foreground">{c.model}</p>
                </div>
                {/* Plate badge */}
                <div className="shrink-0 px-3 py-1.5 rounded-xl font-mono font-bold text-xs tracking-widest"
                  style={{
                    background: "hsl(0 0% 100% / 0.06)",
                    border: "1.5px solid hsl(0 0% 100% / 0.15)",
                    color: "hsl(0 0% 90%)",
                    letterSpacing: "0.15em"
                  }}>
                  {c.plate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRegistration;
