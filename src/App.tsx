import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "./components/BottomNav";
import Particles from "./components/Particles";
import Index from "./pages/Index";
import Factions from "./pages/Factions";
import FactionDetail from "./pages/FactionDetail";
import Casino from "./pages/Casino";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import News from "./pages/News";
import Licenses from "./pages/Licenses";
import Houses from "./pages/Houses";
import HouseDetail from "./pages/HouseDetail";
import MayorElection from "./pages/MayorElection";
import Documents from "./pages/Documents";
import CityVoice from "./pages/CityVoice";
import Wanted from "./pages/Wanted";
import CarRegistration from "./pages/CarRegistration";
import AdminApplication from "./pages/AdminApplication";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import { supabase } from "./lib/store";
import { User, CheckCircle, X } from "lucide-react";
import GradientButton from "./components/GradientButton";

const queryClient = new QueryClient();

// Telegram user type
type TgUser = { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string };

const getTelegramUser = (): TgUser | null => {
  try {
    const tg = (window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: TgUser } } } }).Telegram;
    return tg?.WebApp?.initDataUnsafe?.user || null;
  } catch { return null; }
};

// Registration modal
const RegisterModal = ({ onDone }: { onDone: (nick: string) => void }) => {
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const tgUser = getTelegramUser();

  const handleRegister = async () => {
    if (!nick.trim() || nick.trim().length < 2) return;
    setLoading(true);

    // Перевірка зарезервованого нікнейму T1kron1x
    const reserved = "t1kron1x";
    if (nick.trim().toLowerCase() === reserved) {
      const { data: existing } = await supabase
        .from("users")
        .select("id, telegram_id")
        .ilike("username", "T1kron1x")
        .maybeSingle();
      if (existing && tgUser && String(tgUser.id) !== existing.telegram_id) {
        alert("Цей нікнейм зарезервований!");
        setLoading(false);
        return;
      }
    }

    // Зберігаємо в Supabase
    const { error } = await supabase.from("users").upsert({
      username: nick.trim(),
      telegram_id: tgUser ? String(tgUser.id) : null,
      avatar_url: tgUser?.photo_url || null,
      role: "player",
      balance: 0,
    }, { onConflict: "username" });

    if (!error) {
      localStorage.setItem("crp_registered", "1");
      localStorage.setItem("crp_nick", nick.trim());
      onDone(nick.trim());
    } else {
      alert("Помилка реєстрації: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black">
      <Particles />
      <div className="relative w-full max-w-sm animate-fade-in" style={{ zIndex: 1 }}>
        <div className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(145deg, hsl(0 0% 8%), hsl(0 0% 5%))",
            border: "1px solid hsl(84 81% 44% / 0.2)",
            boxShadow: "0 0 40px hsl(84 81% 44% / 0.1)"
          }}>

          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-bold tracking-wider neon-text-lime mb-1">CHERNIHIV RP</h1>
            <p className="text-xs text-muted-foreground">Портал гравця</p>
          </div>

          {/* Avatar preview */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {tgUser?.photo_url ? (
                <img src={tgUser.photo_url} alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30"
                  style={{ boxShadow: "0 0 20px hsl(84 81% 44% / 0.3)" }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "hsl(84 81% 44% / 0.1)", border: "2px solid hsl(84 81% 44% / 0.3)" }}>
                  <User className="w-10 h-10 text-primary/50" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                style={{ boxShadow: "0 0 10px hsl(84 81% 44%)" }}>
                <CheckCircle className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>

          {tgUser && (
            <p className="text-center text-sm text-foreground font-semibold mb-1">
              {tgUser.first_name}{tgUser.last_name ? " " + tgUser.last_name : ""}
            </p>
          )}
          {tgUser?.username && (
            <p className="text-center text-xs text-primary/60 mb-5">@{tgUser.username}</p>
          )}

          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Ваш ігровий нікнейм</label>
            <input
              value={nick}
              onChange={e => setNick(e.target.value)}
              placeholder="Введіть нік..."
              maxLength={24}
              className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent text-center font-semibold"
              onKeyDown={e => e.key === "Enter" && nick.trim().length >= 2 && handleRegister()}
              autoFocus
            />
            <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">Мінімум 2 символи</p>
          </div>

          <GradientButton
            variant="green"
            className="w-full"
            onClick={handleRegister}
            disabled={loading || nick.trim().length < 2}>
            {loading ? "Реєструю..." : "Розпочати гру"}
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [registered, setRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    const restore = async () => {
      // Спочатку перевіряємо localStorage
      const localReg = localStorage.getItem("crp_registered") === "1";
      const localNick = localStorage.getItem("crp_nick");
      if (localReg && localNick) { setRegistered(true); return; }

      // Якщо localStorage очистився — відновлюємо по Telegram ID
      const tg = (window as Window & { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number; first_name: string; username?: string; photo_url?: string } } } } }).Telegram;
      const tgUser = tg?.WebApp?.initDataUnsafe?.user;
      if (tgUser?.id) {
        const { data } = await supabase
          .from("users")
          .select("username")
          .eq("telegram_id", String(tgUser.id))
          .maybeSingle();
        if (data?.username) {
          localStorage.setItem("crp_registered", "1");
          localStorage.setItem("crp_nick", data.username);
          setRegistered(true);
          return;
        }
      }
      setRegistered(false);
    };
    restore();
  }, []);

  if (registered === null) return null; // loading

  if (!registered) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <RegisterModal onDone={() => setRegistered(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Particles />
          <div className="max-w-lg mx-auto relative" style={{ zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/houses" element={<Houses />} />
              <Route path="/houses/:id" element={<HouseDetail />} />
              <Route path="/mayor-election" element={<MayorElection />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/city-voice" element={<CityVoice />} />
              <Route path="/wanted" element={<Wanted />} />
              <Route path="/car-registration" element={<CarRegistration />} />
              <Route path="/admin-application" element={<AdminApplication />} />
              <Route path="/factions" element={<Factions />} />
              <Route path="/factions/:id" element={<FactionDetail />} />
              <Route path="/casino" element={<Casino />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
