import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { ScrollText, FileCheck, Shield } from "lucide-react";

const docs = [
  { title: "Конституція міста", icon: ScrollText, desc: "Основний закон Чернігів RP" },
  { title: "Правила сервера", icon: FileCheck, desc: "Загальні правила гри" },
  { title: "Правила фракцій", icon: Shield, desc: "Регламент фракцій та званнь" },
  { title: "Кримінальний кодекс", icon: ScrollText, desc: "Штрафи та покарання" },
];

const Documents = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ДОКУМЕНТИ" subtitle="Офіційні папери" backTo="/" />
      <div className="space-y-3">
        {docs.map((d, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="lime">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                  <d.icon className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{d.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                </div>
                <span className="text-xs text-secondary">Читати →</span>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
