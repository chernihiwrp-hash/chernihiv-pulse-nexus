import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { Search, AlertTriangle } from "lucide-react";

const wantedList = [
  { name: "Shadow_X", reason: "Пограбування банку", stars: 5 },
  { name: "Dark_Knight", reason: "Викрадення транспорту", stars: 3 },
  { name: "Ghost_99", reason: "Напад на поліцію", stars: 4 },
];

const Wanted = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="РОЗШУК" subtitle="Список розшуку" backTo="/" glowColor="purple" />

      <div className="space-y-3">
        {wantedList.map((w, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="purple">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{w.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{w.reason}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5">
                    {Array.from({ length: w.stars }).map((_, j) => (
                      <span key={j} className="text-[10px] text-destructive">⭐</span>
                    ))}
                  </div>
                  <span className="text-[9px] text-muted-foreground">Рівень загрози</span>
                </div>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wanted;
