import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import { Vote, User, Crown, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const initialCandidates = [
  { id: 1, name: "Кандидат 1", program: "Розвиток інфраструктури та дорожньої мережі", votes: 12, bio: "Досвід управління 3 роки. Колишній глава поліції." },
  { id: 2, name: "Кандидат 2", program: "Безпека та порядок. Боротьба зі злочинністю", votes: 8, bio: "Лідер громадської організації. Ініціатор реформ." },
  { id: 3, name: "Кандидат 3", program: "Соціальні програми та підтримка громадян", votes: 5, bio: "Волонтер, активіст. За справедливість і рівність." },
];

const MayorElection = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [voted, setVoted] = useState<number | null>(null);
  const [showBio, setShowBio] = useState<number | null>(null);
  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0);

  const handleVote = (id: number) => {
    if (voted !== null) return toast.error("Ви вже проголосували!");
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c));
    setVoted(id);
    toast.success("Ваш голос враховано!");
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ВИБОРИ МЕРА" subtitle="Голосування" backTo="/" />

      <div className="liquid-glass-card rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-neon-yellow" />
          <span className="text-sm font-semibold text-foreground">Статус: Активне</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Проголосуйте за кандидата. Всього голосів: {totalVotes}</p>
      </div>

      <div className="space-y-3">
        {candidates.map((c, i) => {
          const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
          return (
            <div key={c.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <NeonCard glowColor="green">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{c.program}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-bold text-sm">{c.votes}</span>
                    <p className="text-[9px] text-muted-foreground">{pct}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-muted mb-3 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setShowBio(showBio === c.id ? null : c.id)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    {showBio === c.id ? "Сховати" : "Анкета →"}
                  </button>
                  <div className="flex-1" />
                  <GradientButton
                    variant="green"
                    className="py-1.5 px-4 text-[11px]"
                    onClick={() => handleVote(c.id)}
                  >
                    {voted === c.id ? "✓ Проголосовано" : "Голосувати"}
                  </GradientButton>
                </div>

                {showBio === c.id && (
                  <div className="mt-3 liquid-glass rounded-xl p-3 animate-fade-in">
                    <p className="text-[11px] text-muted-foreground">{c.bio}</p>
                  </div>
                )}
              </NeonCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MayorElection;
