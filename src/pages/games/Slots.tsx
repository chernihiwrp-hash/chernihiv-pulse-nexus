import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import GradientButton from "../../components/GradientButton";
import { toast } from "sonner";

const symbols = ["🍒", "🍋", "💎", "7️⃣", "🔔", "⭐"];

const Slots = () => {
  const [reels, setReels] = useState(["🍒", "💎", "7️⃣"]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(100);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(result);
      setSpinning(false);
      if (result[0] === result[1] && result[1] === result[2]) {
        toast.success(`Джекпот! Виграш: ${bet * 10} CR!`);
      } else if (result[0] === result[1] || result[1] === result[2]) {
        toast.success(`Виграш: ${bet * 2} CR!`);
      } else {
        toast.error(`Програш: -${bet} CR`);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="СЛОТИ" subtitle="Крути барабан" backTo="/casino" glowColor="purple" />

      <div className="animate-fade-in">
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex justify-center gap-4 mb-6">
            {reels.map((s, i) => (
              <div key={i} className={`w-20 h-20 rounded-xl glass border border-secondary/30 flex items-center justify-center text-3xl ${spinning ? "animate-pulse" : ""}`}>
                {s}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xs text-muted-foreground">Ставка:</span>
            {[50, 100, 500].map(b => (
              <button
                key={b}
                onClick={() => setBet(b)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                  bet === b ? "bg-secondary/20 border-secondary/40 text-secondary" : "glass text-muted-foreground"
                }`}
              >
                {b} CR
              </button>
            ))}
          </div>
        </div>

        <GradientButton variant="purple" className="w-full" onClick={spin} disabled={spinning}>
          {spinning ? "Крутиться..." : "Крутити!"}
        </GradientButton>
      </div>
    </div>
  );
};

export default Slots;
