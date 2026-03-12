import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { Home, MapPin, Ruler } from "lucide-react";
import { housesData } from "./Houses";
import { toast } from "sonner";

const HouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const house = housesData.find(h => h.id === Number(id));

  if (!house) {
    return (
      <div className="min-h-screen bg-background pb-20 px-4 pt-4">
        <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/houses" />
        <p className="text-muted-foreground text-sm">Будинок не знайдено</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title={house.name} backTo="/houses" />

      <div className="animate-fade-in">
        {/* House image placeholder */}
        <div className="w-full h-48 rounded-2xl glass border border-neon-yellow/20 flex items-center justify-center mb-4">
          <Home className="w-16 h-16 text-neon-yellow/30" />
        </div>

        <div className="glass rounded-2xl p-4 mb-4">
          <h2 className="text-lg font-bold text-foreground mb-1">{house.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{house.desc}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Локація</span>
              </div>
              <span className="text-xs font-medium text-foreground">Чернігів</span>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Статус</span>
              </div>
              <span className="text-xs font-medium text-primary">{house.owner ? "Зайнято" : "Вільно"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">Ціна:</span>
            <span className="text-neon-yellow font-bold text-xl">{house.price.toLocaleString()}$</span>
          </div>
        </div>

        <GradientButton
          variant="yellow"
          className="w-full"
          onClick={() => toast.info("Для покупки потрібна реєстрація та достатній баланс CR")}
        >
          Купити будинок
        </GradientButton>
      </div>
    </div>
  );
};

export default HouseDetail;
