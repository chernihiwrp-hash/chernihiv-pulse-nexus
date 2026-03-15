import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import { ScrollText } from "lucide-react";
import { store } from "../lib/store";

const Documents = () => {
  const docs = store.getDocs();
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ДОКУМЕНТИ" subtitle="Офіційні папери" backTo="/" />
      <div className="space-y-3">
        {docs.map((d, i) => (
          <div key={d.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="lime" onClick={() => setOpenId(openId === d.id ? null : d.id)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{d.title}</h3>
                  {openId !== d.id && <p className="text-[10px] text-muted-foreground line-clamp-1">{d.content}</p>}
                </div>
                <span className="text-xs text-primary">{openId === d.id ? "Сховати" : "Читати →"}</span>
              </div>
              {openId === d.id && (
                <div className="mt-3 liquid-glass rounded-xl p-3 animate-fade-in">
                  <p className="text-[11px] text-foreground whitespace-pre-wrap">{d.content}</p>
                </div>
              )}
            </NeonCard>
          </div>
        ))}
        {docs.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">Немає документів</p>}
      </div>
    </div>
  );
};

export default Documents;
