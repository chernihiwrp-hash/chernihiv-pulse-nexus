import { useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { Users, User, Send } from "lucide-react";
import { toast } from "sonner";

const factionsData: Record<string, { name: string; color: string; gradient: string; desc: string; members: { name: string; rank: string }[] }> = {
  sbu: { name: "СБУ", color: "hsl(220, 70%, 35%)", gradient: "linear-gradient(135deg, hsl(220,70%,35%,0.25), hsl(220,70%,15%,0.1))", desc: "Служба безпеки України — захист держави від внутрішніх і зовнішніх загроз", members: [{ name: "Agent_01", rank: "Капітан" }, { name: "Agent_02", rank: "Лейтенант" }] },
  dbr: { name: "ДБР", color: "hsl(140, 60%, 35%)", gradient: "linear-gradient(135deg, hsl(140,60%,35%,0.25), hsl(140,60%,15%,0.1))", desc: "Державне бюро розслідувань — розслідування правопорушень", members: [{ name: "Inspector_01", rank: "Слідчий" }] },
  npu: { name: "НПУ", color: "hsl(210, 80%, 45%)", gradient: "linear-gradient(135deg, hsl(210,80%,45%,0.25), hsl(210,80%,20%,0.1))", desc: "Національна поліція України — охорона порядку та безпека громадян", members: [{ name: "Officer_01", rank: "Сержант" }, { name: "Officer_02", rank: "Патрульний" }, { name: "Officer_03", rank: "Капітан" }] },
  vsu: { name: "ВСУ", color: "hsl(140, 50%, 30%)", gradient: "linear-gradient(135deg, hsl(140,50%,30%,0.25), hsl(100,40%,20%,0.1))", desc: "Збройні Сили України — захист територіальної цілісності", members: [{ name: "Soldier_01", rank: "Рядовий" }, { name: "Soldier_02", rank: "Сержант" }] },
  prosecutor: { name: "Прокуратура", color: "hsl(30, 50%, 35%)", gradient: "linear-gradient(135deg, hsl(30,50%,35%,0.25), hsl(220,10%,30%,0.1))", desc: "Прокуратура міста — нагляд за дотриманням законів", members: [{ name: "Prosecutor_01", rank: "Прокурор" }] },
  dsns: { name: "ДСНС", color: "hsl(0, 70%, 45%)", gradient: "linear-gradient(135deg, hsl(0,70%,45%,0.25), hsl(0,60%,20%,0.1))", desc: "Служба з надзвичайних ситуацій — порятунок і ліквідація наслідків", members: [{ name: "Rescue_01", rank: "Рятувальник" }] },
  orion: { name: "ОРІОН", color: "hsl(263, 60%, 50%)", gradient: "linear-gradient(135deg, hsl(0,60%,25%,0.25), hsl(0,0%,8%,0.3))", desc: "Приватна військова компанія — виконання спецзавдань", members: [{ name: "Merc_01", rank: "Бойовик" }, { name: "Merc_02", rank: "Командир" }] },
  ghetto: { name: "ГЕТТО", color: "hsl(0, 60%, 25%)", gradient: "linear-gradient(135deg, hsl(0,60%,25%,0.3), hsl(0,0%,5%,0.3))", desc: "Вуличне угруповання — контроль районів та тіньовий бізнес", members: [{ name: "Gangster_01", rank: "Член банди" }] },
  mafia: { name: "МАФІЯ", color: "hsl(270, 50%, 40%)", gradient: "linear-gradient(135deg, hsl(270,50%,40%,0.25), hsl(280,40%,15%,0.1))", desc: "Організована злочинність — підпільна влада міста", members: [{ name: "Don_01", rank: "Капо" }] },
  judge: { name: "Суддя", color: "hsl(45, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(45,80%,50%,0.25), hsl(40,70%,25%,0.1))", desc: "Судова система — правосуддя та вирішення суперечок", members: [{ name: "Judge_01", rank: "Суддя" }] },
  lawyers: { name: "Адвокати", color: "hsl(25, 80%, 50%)", gradient: "linear-gradient(135deg, hsl(25,80%,50%,0.25), hsl(20,70%,25%,0.1))", desc: "Адвокатська палата — захист прав та інтересів громадян", members: [{ name: "Lawyer_01", rank: "Адвокат" }] },
};

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

  if (!faction) {
    return (
      <div className="min-h-screen bg-background pb-20 px-4 pt-4">
        <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/factions" />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!nick || !roblox || !age || !telegram || !message) return toast.error("Заповніть усі поля");
    toast.success(`Анкету у ${faction.name} відправлено!`);
    setShowForm(false);
    setNick(""); setRoblox(""); setAge(""); setTelegram(""); setExperience(""); setMessage("");
  };

  const inputClass = "w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors";

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title={faction.name} subtitle={faction.desc} backTo="/factions" />

      <div className="animate-fade-in">
        {/* Faction banner */}
        <div
          className="rounded-2xl p-5 mb-4 border"
          style={{ background: faction.gradient, borderColor: faction.color + "33" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: faction.color + "33", border: `2px solid ${faction.color}88`, color: faction.color }}
            >
              {faction.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{faction.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">Учасників: {faction.members.length}</p>
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
              <div
                key={i}
                className="glass rounded-xl p-3 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: faction.color + "22" }}
                >
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

        {/* Application form */}
        {showForm ? (
          <div className="glass-strong rounded-2xl p-4 space-y-3 animate-fade-in" style={{ borderColor: faction.color + "33" }}>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send className="w-4 h-4" style={{ color: faction.color }} />
              Анкета у {faction.name}
            </h3>
            
            {[
              { label: "Нік (RP ім'я)", value: nick, set: setNick, placeholder: "Ваш RP нік" },
              { label: "Roblox Username", value: roblox, set: setRoblox, placeholder: "Ваш Roblox username" },
              { label: "Вік", value: age, set: setAge, placeholder: "Ваш вік" },
              { label: "Telegram", value: telegram, set: setTelegram, placeholder: "@username" },
              { label: "Досвід у фракціях", value: experience, set: setExperience, placeholder: "Де були раніше (необов'язково)" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className={inputClass}
                  style={{ borderColor: faction.color + "22" }}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Чому хочете вступити?</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Розкажіть про себе та мотивацію..."
                className={`${inputClass} resize-none h-28 bg-transparent`}
                style={{ borderColor: faction.color + "22" }}
              />
            </div>
            <div className="flex gap-2">
              <GradientButton variant="green" className="flex-1" onClick={handleSubmit}>
                Відправити анкету
              </GradientButton>
              <button onClick={() => setShowForm(false)} className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground active:scale-95 transition-all">
                Скасувати
              </button>
            </div>
          </div>
        ) : (
          <GradientButton variant="green" className="w-full" onClick={() => setShowForm(true)}>
            Подати анкету
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default FactionDetail;
