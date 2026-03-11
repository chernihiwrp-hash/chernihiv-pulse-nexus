import { User, Briefcase, Home, Car, FileCheck } from "lucide-react";

const Profile = () => {
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>

        <div className="relative p-5 border border-primary/30 rounded-2xl glow-green">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Гравець</h2>
              <p className="text-xs text-muted-foreground">ID: #0001</p>
              <p className="text-xs text-primary font-medium mt-0.5">0 CR</p>
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

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full glass rounded-2xl p-4 text-left card-press hover:border-primary/20 transition-colors">
          <span className="text-sm font-medium text-foreground">Реєстрація</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">Створити профіль гравця</p>
        </button>
        <button className="w-full glass rounded-2xl p-4 text-left card-press hover:border-primary/20 transition-colors">
          <span className="text-sm font-medium text-foreground">Налаштування</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">Редагувати дані</p>
        </button>
      </div>
    </div>
  );
};

export default Profile;
