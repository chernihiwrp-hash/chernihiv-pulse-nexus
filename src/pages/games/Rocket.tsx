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

  const startGame = () => {
    // Random crash between 1.1 and 10.0 with house edge
    crashPoint.current = parseFloat((1 + Math.random() * 9 * 0.92).toFixed(2));
    if (crashPoint.current < 1.1) crashPoint.current = 1.1;
    setMultiplier(1.0);
    setFlying(true);
    setCrashed(false);
    setCashedOut(false);

    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = parseFloat((prev + 0.02).toFixed(2));
        if (next >= crashPoint.current) {
          clearInterval(intervalRef.current);
          setFlying(false);
          setCrashed(true);
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
    toast.success(`Забрали на x${multiplier.toFixed(2)}! +${win} CR`);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const getMultiplierColor = () => {
    if (crashed) return "text-destructive";
    if (cashedOut) return "text-primary";
    if (multiplier >= 3) return "text-neon-yellow";
    if (multiplier >= 2) return "text-neon-pink";
    return "text-secondary";
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="РАКЕТА" subtitle="Crash гра" backTo="/casino" glowColor="purple" />

      <div className="animate-fade-in">
        <div className="glass rounded-2xl p-6 mb-4 text-center relative overflow-hidden">
          <div className={`transition-all duration-300 ${flying ? "animate-bounce" : ""}`}>
            <RocketIcon className={`w-16 h-16 mx-auto mb-4 ${crashed ? "text-destructive rotate-180" : "text-secondary"} transition-all`} />
          </div>

          <div className={`text-5xl font-bold font-display mb-2 ${getMultiplierColor()} transition-colors`}>
            x{multiplier.toFixed(2)}
          </div>

          {crashed && <p className="text-sm text-destructive">💥 CRASHED</p>}
          {cashedOut && <p className="text-sm text-primary">✅ ЗАБРАНО</p>}

          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="text-xs text-muted-foreground">Ставка:</span>
            {[50, 100, 500, 1000].map(b => (
              <button
                key={b}
                onClick={() => !flying && setBet(b)}
                className={`text-[11px] px-3 py-1 rounded-lg border transition-all active:scale-95 ${
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
          <GradientButton variant="purple" className="w-full" onClick={startGame}>
            🚀 Запустити — {bet} CR
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default Rocket;
