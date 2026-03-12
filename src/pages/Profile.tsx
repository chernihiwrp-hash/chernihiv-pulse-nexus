import { User, Briefcase, Home, Car, FileCheck, Wallet, Shield } from "lucide-react";
import GradientButton from "../components/GradientButton";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-green mb-6">
        ПРОФІЛЬ
      </h1>

      {/* Passport Card */}
      <div className="relative rounded-2xl overflow-hidden mb-6 animate-fade-in">
        {/* Ukraine flag gradient background */}
        <div className="absolute inset-0">
          <div className="h-1/2 bg-[hsl(210,80%,35%)]" />
          <div className="h-1/2 bg-[hsl(50,90%,50%)]" />
          <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
        </div>

        <div className="relative p-5 border border-primary/30 rounded-2xl glow-green">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-[9px] text-muted-foreground tracking-[0.3em] uppercase mb-2">Паспорт громадянина</p>
            <p className="text-[8px] text-primary/60 tracking-[0.2em]">CHERNIHIV RP</p>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-18 h-18 rounded-2xl bg-muted border-2 border-primary/30 flex items-center justify-center overflow-hidden"
              style={{ width: 72, height: 72 }}>
              <User className="w-9 h-9 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">Гравець</h2>
              <p className="text-[10px] text-muted-foreground">ID: #0001</p>
              <div className="flex items-center gap-1 mt-1">
                <Wallet className="w-3 h-3 text-primary" />
                <p className="text-xs text-primary font-bold">0 CR</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Briefcase, label: "Робота", value: "Немає" },
              { icon: Home, label: "Дім", value: "Немає" },
              { icon: Car, label: "Авто", value: "Немає" },
              { icon: FileCheck, label: "Ліцензії", value: "0" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-xs font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Property Section */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" /> Моя нерухомість
        </h3>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">У вас поки немає нерухомості</p>
          <GradientButton variant="green" className="mt-3 text-xs py-2 px-4" onClick={() => navigate("/houses")}>
            Переглянути будинки
          </GradientButton>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full glass rounded-2xl p-4 text-left card-press hover:border-primary/20 transition-colors active:scale-[0.98]">
          <span className="text-sm font-medium text-foreground">Реєстрація</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">Створити профіль гравця</p>
        </button>
        <button className="w-full glass rounded-2xl p-4 text-left card-press hover:border-primary/20 transition-colors active:scale-[0.98]">
          <span className="text-sm font-medium text-foreground">Налаштування</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">Редагувати дані</p>
        </button>
      </div>
    </div>
  );
};

export default Profile;
