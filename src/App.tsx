import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "./components/BottomNav";
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
import Slots from "./pages/games/Slots";
import Dice from "./pages/games/Dice";
import GuessNumber from "./pages/games/GuessNumber";
import Blackjack from "./pages/games/Blackjack";
import Rocket from "./pages/games/Rocket";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="max-w-lg mx-auto relative">
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
            <Route path="/casino/slots" element={<Slots />} />
            <Route path="/casino/dice" element={<Dice />} />
            <Route path="/casino/guess" element={<GuessNumber />} />
            <Route path="/casino/blackjack" element={<Blackjack />} />
            <Route path="/casino/rocket" element={<Rocket />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
