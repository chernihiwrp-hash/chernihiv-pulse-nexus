import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { Newspaper, Clock } from "lucide-react";
import { store } from "../lib/store";

const News = () => {
  const [news] = useState(store.getNews());

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="НОВИНИ" subtitle="Останні події міста" backTo="/" />
      <div className="space-y-3">
        {news.map((item, i) => (
          <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="green">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.text}</p>
                  {item.image && <img src={item.image} alt="" className="w-full h-32 object-cover rounded-lg mt-2" />}
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">{item.date}</span>
                  </div>
                </div>
              </div>
            </NeonCard>
          </div>
        ))}
        {news.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає новин</p>}
      </div>
    </div>
  );
};

export default News;
