import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import { Vote, User } from "lucide-react";
import { toast } from "sonner";

const candidates = [
  { name: "Кандидат 1", votes: 12, program: "Розвиток інфраструктури" },
  { name: "Кандидат 2", votes: 8, program: "Безпека та порядок" },
  { name: "Кандидат 3", votes: 5, program: "Соціальні програми" },
];

const MayorElection = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ВИБОРИ МЕРА" subtitle="Голосування відкрите" backTo="/" />

      <div className="glass rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Vote className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Статус: Активне</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Проголосуйте за кандидата на посаду мера міста Чернігів</p>
      </div>

      <div className="space-y-3">
        {candidates.map((c, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="green">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{c.program}</p>
                </div>
                <span className="text-xs text-primary font-bold">{c.votes} голосів</span>
              </div>
              <GradientButton
                variant="green"
                className="w-full py-2 text-xs"
                onClick={() => toast.info("Для голосування потрібна реєстрація")}
              >
                Голосувати
              </GradientButton>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MayorElection;
