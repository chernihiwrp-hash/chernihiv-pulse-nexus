import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import { Megaphone, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

const ideas = [
  { author: "Player_01", text: "Додати систему таксі в місті", likes: 15 },
  { author: "Player_02", text: "Побудувати нову лікарню", likes: 8 },
  { author: "Player_03", text: "Організувати щотижневі RP івенти", likes: 22 },
];

const CityVoice = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ГОЛОС МІСТА" subtitle="Скарги та ідеї" backTo="/" />

      <div className="glass rounded-2xl p-4 mb-4 animate-fade-in">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Ваша ідея або скарга..."
          className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-24 bg-transparent"
        />
        <GradientButton
          variant="green"
          className="w-full mt-3 py-2 text-xs"
          onClick={() => {
            if (!message.trim()) return toast.error("Напишіть повідомлення");
            toast.success("Ідею відправлено!");
            setMessage("");
          }}
        >
          <Megaphone className="w-4 h-4 inline mr-1" /> Відправити
        </GradientButton>
      </div>

      <div className="space-y-3">
        {ideas.map((idea, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <NeonCard glowColor="green">
              <p className="text-[11px] text-foreground mb-2">{idea.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">— {idea.author}</span>
                <button className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors active:scale-95">
                  <ThumbsUp className="w-3 h-3" /> {idea.likes}
                </button>
              </div>
            </NeonCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityVoice;
