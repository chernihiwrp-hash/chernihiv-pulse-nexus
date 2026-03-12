import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import NeonCard from "../components/NeonCard";
import { Car } from "lucide-react";
import { toast } from "sonner";

const CarRegistration = () => {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");

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
              <input
                value={plate}
                onChange={e => setPlate(e.target.value)}
                placeholder="AA 0000 AA"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Модель авто</label>
              <input
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="BMW M5"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-neon-yellow/50"
              />
            </div>
          </div>
        </NeonCard>

        <GradientButton
          variant="yellow"
          className="w-full"
          onClick={() => {
            if (!plate || !model) return toast.error("Заповніть усі поля");
            toast.success("Номер зареєстровано!");
          }}
        >
          Зареєструвати
        </GradientButton>
      </div>
    </div>
  );
};

export default CarRegistration;
