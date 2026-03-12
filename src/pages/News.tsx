import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { Newspaper, Clock } from "lucide-react";

const newsItems = [
  { title: "Відкриття нового казино", date: "12.03.2026", text: "У місті відкрилось нове казино з ексклюзивними іграми." },
  { title: "Набір у фракцію НПУ", date: "11.03.2026", text: "НПУ оголошує набір нових співробітників. Подавайте анкети!" },
  { title: "Оновлення правил сервера", date: "10.03.2026", text: "Переглянуто правила RP та додано нові обмеження." },
  { title: "Вибори мера розпочались", date: "09.03.2026", text: "Голосування за мера міста вже відкрите для всіх громадян." },
];

const News = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="НОВИНИ" subtitle="Останні події міста" backTo="/" />
      <div className="space-y-3">
        {newsItems.map((item, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="green">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.text}</p>
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">{item.date}</span>
                  </div>
                </div>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
