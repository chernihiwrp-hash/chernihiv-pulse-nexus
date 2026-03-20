import { useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { Users, User, Send, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { store } from "../lib/store";

const factionsData: Record<string, { name: string; color: string; gradient: string; desc: string; dangerous?: boolean; members: { name: string; rank: string }[] }> = {
  sbu: { name: "СБУ", color: "hsl(220, 70%, 35%)", gradient: "linear-gradient(135deg, hsl(220,70%,35%,0.2), hsl(220,70%,15%,0.08))", desc: "Служба безпеки України", members: [{ name: "Agent_01", rank: "Капітан" }] },
  dbr: { name: "ДБР", color: "hsl(160, 50%, 35%)", gradient: "linear-gradient(135deg, hsl(160,50%,35%,0.2), hsl(160,50%,15%,0.08))", desc: "Державне бюро розслідувань", members: [{ name: "Inspector_01", rank: "Слідчий" }] },
  npu: { name: "НПУ", color: "hsl(210, 80%, 45%)", gradient: "linear-gradient(135deg, hsl(210,80%,45%,0.2), hsl(210,80%,20%,0.08))", desc: "Національна поліція України", members: [{ name: "Officer_01", rank: "Сержант" }, { name: "Officer_02", rank: "Патрульний" }] },
  vsu: { name: "ВСУ", color: "hsl(140, 50%, 30%)", gradient: "linear-gradient(135deg, hsl(140,50%,30%,0.2), hsl(100,40%,20%,0.08))", desc: "Збройні Сили України", members: [{ name: "Soldier_01", rank: "Рядовий" }] },
  prosecutor: { name: "Прокуратура", color: "hsl(30, 50%, 35%)", gradient: "linear-gradient(135deg, hsl(30,50%,35%,0.2), hsl(220,10%,30%,0.08))", desc: "Нагляд за дотриманням законів", members: [{ name: "Prosecutor_01", rank: "Прокурор" }] },
  dsns: { name: "ДСНС", color: "hsl(15, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(15,80%,45%,0.2), hsl(15,60%,20%,0.08))", desc: "Служба з надзвичайних ситуацій", members: [{ name: "Rescue_01", rank: "Рятувальник" }] },
  judge: { name: "Суддя", color: "hsl(45, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(45,80%,50%,0.2), hsl(40,70%,25%,0.08))", desc: "Судова система", members: [{ name: "Judge_01", rank: "Суддя" }] },
  lawyers: { name: "Адвокати", color: "hsl(25, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(25,80%,50%,0.2), hsl(20,70%,25%,0.08))", desc: "Захист прав та інтересів", members: [{ name: "Lawyer_01", rank: "Адвокат" }] },
  orion: { name: "ОРІОН", color: "hsl(0, 55%, 35%)", gradient: "linear-gradient(135deg, hsl(0,55%,25%,0.35), hsl(0,0%,4%,0.45))", desc: "Приватна військова компанія", dangerous: true, members: [{ name: "Merc_01", rank: "Бойовик" }] },
  ghetto: { name: "ГЕТТО", color: "hsl(0, 60%, 35%)", gradient: "linear-gradient(135deg, hsl(0,60%,20%,0.4), hsl(0,0%,3%,0.5))", desc: "Вуличне угруповання", dangerous: true, members: [{ name: "Gangster_01", rank: "Член банди" }] },
  mafia: { name: "МАФІЯ", color: "hsl(0, 65%, 40%)", gradient: "linear-gradient(135deg, hsl(0,65%,25%,0.35), hsl(0,0%,5%,0.4))", desc: "Організована злочинність", dangerous: true, members: [{ name: "Don_01", rank: "Капо" }] },
};

type AppStatus = "idle" | "sending" | "sent";

const FactionDetail = () => {
  const { id } = useParams();
  const faction = factionsData[id || ""];
  const [showForm, setShowForm] = useState(false);
  const [nick, setNick] = useState("");
  const [roblox, setRoblox] = useState("");
  const [age, setAge] = useState("");
  const [telegram, setTelegram] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [appStatus, setAppStatus] = useState<AppStatus>("idle");

  if (!faction) return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/factions" />
    </div>
  );

  const handleSubmit = async () => {
    if (!nick || !roblox || !age || !telegram || !message) return toast.error("Заповніть усі поля");
    setAppStatus("sending");
    await store.submitFactionApp({ factionId: id || "", factionName: faction.name, nick, roblox, age, telegram, experience, message });
    setAppStatus("sent");
    // Скидаємо форму через 3 секунди
    setTimeout(() => {
      setShowForm(false);
      setAppStatus("idle");
      setNick(""); setRoblox(""); setAge(""); setTelegram(""); setExperience(""); setMessage("");
    }, 3000);
  };

  const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors bg-transparent";
  const btnVariant = faction.dangerous ? "danger" : "green";

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title={faction.name} subtitle={faction.desc} backTo="/factions" />
      <div className="animate-fade-in">
        {/* Banner */}
        <div className="rounded-2xl p-5 mb-4 border" style={{ background: faction.gradient, borderColor: faction.color + "22" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: faction.color + "22", border: `1px solid ${faction.color}55`, color: faction.color }}>
              {faction.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{faction.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{faction.desc}</p>
              <p className="text-xs text-muted-foreground">Учасників: {faction.members.length}</p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Учасники</span>
          </div>
          <div className="space-y-2">
            {faction.members.map((m, i) => (
              <div key={i} className="liquid-glass rounded-xl p-3 flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: faction.color + "18" }}>
                  <User className="w-4 h-4" style={{ color: faction.color }} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-foreground">{m.name}</span>
                  <p className="text-[10px] text-muted-foreground">{m.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Якщо анкету відправлено — показуємо статус */}
        {appStatus === "sent" && (
          <div className="liquid-glass-card rounded-2xl p-5 mb-4 animate-fade-in border border-primary/20 text-center">
            <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-sm font-bold text-foreground mb-1">Анкету відправлено!</h3>
            <p className="text-[11px] text-muted-foreground mb-2">Ваша заявка у <span style={{ color: faction.color }}>{faction.name}</span> передана адміністрації</p>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl mx-auto w-fit"
              style={{ background: "hsl(84 81% 44% / 0.1)", border: "1px solid hsl(84 81% 44% / 0.2)" }}>
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-primary">Очікуйте повідомлення в профілі</span>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && appStatus !== "sent" ? (
          <div className="liquid-glass-strong rounded-2xl p-4 space-y-3 animate-fade-in" style={{ borderColor: faction.color + "22" }}>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send className="w-4 h-4" style={{ color: faction.color }} /> Анкета у {faction.name}
            </h3>
            {[
              { label: "Нік (RP ім'я)", value: nick, set: setNick, placeholder: "Ваш RP нік" },
              { label: "Roblox Username", value: roblox, set: setRoblox, placeholder: "Roblox username" },
              { label: "Вік", value: age, set: setAge, placeholder: "Ваш вік" },
              { label: "Telegram", value: telegram, set: setTelegram, placeholder: "@username" },
              { label: "Досвід у фракціях", value: experience, set: setExperience, placeholder: "Необов'язково" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className={inputClass} />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Чому хочете вступити?</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Розкажіть про себе..."
                className={`${inputClass} resize-none h-28`} />
            </div>
            <div className="flex gap-2">
              <GradientButton variant={btnVariant} className="flex-1" onClick={handleSubmit} disabled={appStatus === "sending"}>
                <Send className="w-3.5 h-3.5 inline mr-1.5" />
                {appStatus === "sending" ? "Відправляю..." : "Відправити анкету"}
              </GradientButton>
              <button onClick={() => setShowForm(false)}
                className="liquid-glass rounded-2xl px-4 py-3 text-sm text-muted-foreground active:scale-95">
                Скасувати
              </button>
            </div>
          </div>
        ) : appStatus === "idle" && (
          <GradientButton variant={btnVariant} className="w-full" onClick={() => setShowForm(true)}>
            Подати анкету
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default FactionDetail;
