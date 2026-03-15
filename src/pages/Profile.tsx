import { useState } from "react";
import { User, Briefcase, Home, Car, FileCheck, Wallet, Shield, Lock, Bell } from "lucide-react";
import GradientButton from "../components/GradientButton";
import { useNavigate } from "react-router-dom";
import passportBg from "../assets/passport-bg.jpg";
import { toast } from "sonner";
import { store } from "../lib/store";

const Profile = () => {
  const navigate = useNavigate();
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const notifications = store.getNotifications();
  const unread = notifications.filter(n => !n.read).length;

  const handleAdminAccess = () => {
    if (adminCode === "5319son") {
      navigate("/admin-panel");
      toast.success("Доступ до адмін-панелі відкрито");
    } else {
      toast.error("Невірний код");
    }
    setAdminCode("");
    setShowAdminInput(false);
  };

  const markRead = () => {
    const all = store.getNotifications().map(n => ({ ...n, read: true }));
    store.setNotifications(all);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime mb-6">ПРОФІЛЬ</h1>

      {/* Passport Card */}
      <div className="relative rounded-2xl overflow-hidden mb-6 animate-fade-in">
        <img src={passportBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/88 backdrop-blur-sm" />
        <div className="relative p-5 border border-primary/25 rounded-2xl" style={{ boxShadow: "0 0 30px hsl(84 81% 44% / 0.15)" }}>
          <div className="text-center mb-4">
            <p className="text-[9px] text-muted-foreground tracking-[0.3em] uppercase mb-2">Паспорт громадянина</p>
            <p className="text-[8px] text-primary/60 tracking-[0.2em]">CHERNIHIV RP</p>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-[72px] h-[72px] rounded-2xl bg-muted border-2 border-primary/25 flex items-center justify-center">
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
            ].map(item => (
              <div key={item.label} className="liquid-glass rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-xs font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="mt-4 liquid-glass rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-muted-foreground">Сповіщення</span>
                {unread > 0 && <span className="text-[8px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">{unread}</span>}
              </div>
              {unread > 0 && <button onClick={markRead} className="text-[9px] text-primary">Прочитати</button>}
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-foreground mt-1">Немає нових сповіщень</p>
            ) : (
              <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto">
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} className={`text-[10px] p-2 rounded-lg ${n.read ? "text-muted-foreground" : "text-foreground bg-primary/5 border border-primary/10"}`}>
                    <p>{n.text}</p>
                    <span className="text-[8px] text-muted-foreground">{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* My Property */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" /> Моя нерухомість
        </h3>
        <div className="liquid-glass-card rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">У вас поки немає нерухомості</p>
          <GradientButton variant="green" className="mt-3 text-xs py-2 px-4" onClick={() => navigate("/houses")}>Переглянути будинки</GradientButton>
        </div>
      </div>

      {/* My Licenses */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <FileCheck className="w-3.5 h-3.5" /> Мої ліцензії
        </h3>
        <div className="liquid-glass-card rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">У вас поки немає ліцензій</p>
          <GradientButton variant="green" className="mt-3 text-xs py-2 px-4" onClick={() => navigate("/licenses")}>Отримати ліцензію</GradientButton>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={() => navigate("/admin-application")} className="w-full liquid-glass-card rounded-2xl p-4 text-left card-press hover:border-primary/20 transition-colors active:scale-[0.98]">
          <span className="text-sm font-medium text-foreground">Реєстрація</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">Створити профіль гравця</p>
        </button>
      </div>

      {/* Hidden admin access */}
      <div className="mt-8">
        <div
          className="rounded-2xl p-4 border transition-all"
          style={{
            background: "linear-gradient(135deg, hsl(84 81% 44% / 0.05), hsl(0 0% 100% / 0.02))",
            borderColor: showAdminInput ? "hsl(84 81% 44% / 0.3)" : "hsl(0 0% 100% / 0.06)",
          }}
        >
          {showAdminInput ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Вхід в адмін панель</span>
              </div>
              <input
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
                placeholder="Код доступу"
                type="password"
                className="w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
                onKeyDown={e => e.key === "Enter" && handleAdminAccess()}
                autoFocus
              />
              <div className="flex gap-2">
                <GradientButton variant="green" className="flex-1 text-xs py-2" onClick={handleAdminAccess}>Увійти</GradientButton>
                <button onClick={() => { setShowAdminInput(false); setAdminCode(""); }} className="liquid-glass rounded-xl px-4 py-2 text-xs text-muted-foreground">Скасувати</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdminInput(true)} className="w-full flex items-center justify-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors py-1">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px]">Адміністрація</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
