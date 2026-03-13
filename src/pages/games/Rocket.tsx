import { useState, useEffect, useRef } from "react";
import PageHeader from "../../components/PageHeader";
import GradientButton from "../../components/GradientButton";
import { Rocket as RocketIcon } from "lucide-react";
import { toast } from "sonner";

const Rocket = () => {
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [flying, setFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const crashPoint = useRef(1.0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const [history, setHistory] = useState<{ mult: number; won: boolean }[]>([]);

  const startGame = () => {
    // Higher crash points for better odds
    crashPoint.current = parseFloat((1 + Math.random() * 12 * 0.95).toFixed(2));
    if (crashPoint.current < 1.2) crashPoint.current = 1.2;
    setMultiplier(1.0);
    setFlying(true);
    setCrashed(false);
    setCashedOut(false);

    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = parseFloat((prev + 0.03).toFixed(2));
        if (next >= crashPoint.current) {
          clearInterval(intervalRef.current);
          setFlying(false);
          setCrashed(true);
          setHistory(h => [{ mult: crashPoint.current, won: false }, ...h].slice(0, 8));
          toast.error(`💥 Ракета впала на x${crashPoint.current}! -${bet} CR`);
          return crashPoint.current;
        }
        return next;
      });
    }, 50);
  };

  const cashOut = () => {
    if (!flying) return;
    clearInterval(intervalRef.current);
    setFlying(false);
    setCashedOut(true);
    const win = Math.floor(bet * multiplier);
    setHistory(h => [{ mult: multiplier, won: true }, ...h].slice(0, 8));
    toast.success(`Забрали на x${multiplier.toFixed(2)}! +${win} CR`);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const getMultiplierColor = () => {
    if (crashed) return "text-destructive";
    if (cashedOut) return "text-primary";
    if (multiplier >= 5) return "text-neon-yellow";
    if (multiplier >= 3) return "text-neon-pink";
    if (multiplier >= 2) return "text-neon-cyan";
    return "text-primary";
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="РАКЕТА" subtitle="Crash гра" backTo="/casino" />

      <div className="animate-fade-in">
        <div className="glass rounded-2xl p-6 mb-4 text-center relative overflow-hidden">
          {/* Neon background effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-neon-cyan/5 pointer-events-none" />
          
          {/* Rocket */}
          <div className={`relative transition-all duration-300 ${flying ? "animate-bounce" : ""}`}>
            <RocketIcon
              className={`w-20 h-20 mx-auto mb-4 transition-all duration-300 ${
                crashed ? "text-destructive rotate-180 opacity-60" : cashedOut ? "text-primary" : "text-secondary"
              }`}
              style={flying ? { filter: `drop-shadow(0 0 12px hsl(263, 86%, 65%, 0.6))` } : undefined}
            />
          </div>

          <div className={`text-6xl font-bold font-display mb-2 ${getMultiplierColor()} transition-colors`}>
            x{multiplier.toFixed(2)}
          </div>

          {crashed && <p className="text-sm text-destructive font-medium">💥 CRASHED</p>}
          {cashedOut && <p className="text-sm text-primary font-medium">✅ ЗАБРАНО</p>}

          {/* History */}
          {history.length > 0 && (
            <div className="flex gap-1.5 justify-center mt-4 flex-wrap">
              {history.map((h, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-2 py-0.5 rounded-md ${
                    h.won ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  x{h.mult.toFixed(2)}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Ставка:</span>
            {[50, 100, 500, 1000].map(b => (
              <button
                key={b}
                onClick={() => !flying && setBet(b)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                  bet === b ? "bg-secondary/20 border-secondary/40 text-secondary" : "glass text-muted-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {flying ? (
          <GradientButton variant="yellow" className="w-full text-lg" onClick={cashOut}>
            💰 Забрати x{multiplier.toFixed(2)} ({Math.floor(bet * multiplier)} CR)
          </GradientButton>
        ) : (
          <GradientButton variant="cyan" className="w-full" onClick={startGame}>
            🚀 Запустити — {bet} CR
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default Rocket;
