import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import NeonCard from "../components/NeonCard";
import GradientButton from "../components/GradientButton";
import { Users, User } from "lucide-react";
import { toast } from "sonner";

const factionsData: Record<string, { name: string; color: string; desc: string; members: { name: string; rank: string }[] }> = {
  sbu: { name: "СБУ", color: "hsl(220, 70%, 35%)", desc: "Служба безпеки України", members: [{ name: "Agent_01", rank: "Капітан" }, { name: "Agent_02", rank: "Лейтенант" }] },
  dbr: { name: "ДБР", color: "hsl(140, 60%, 35%)", desc: "Державне бюро розслідувань", members: [{ name: "Inspector_01", rank: "Слідчий" }] },
  npu: { name: "НПУ", color: "hsl(210, 80%, 45%)", desc: "Національна поліція України", members: [{ name: "Officer_01", rank: "Сержант" }, { name: "Officer_02", rank: "Патрульний" }, { name: "Officer_03", rank: "Капітан" }] },
  vsu: { name: "ВСУ", color: "hsl(140, 50%, 30%)", desc: "Збройні Сили України", members: [{ name: "Soldier_01", rank: "Рядовий" }, { name: "Soldier_02", rank: "Сержант" }] },
  prosecutor: { name: "Прокуратура", color: "hsl(30, 50%, 35%)", desc: "Прокуратура міста", members: [{ name: "Prosecutor_01", rank: "Прокурор" }] },
  dsns: { name: "ДСНС", color: "hsl(0, 70%, 45%)", desc: "Служба з надзвичайних ситуацій", members: [{ name: "Rescue_01", rank: "Рятувальник" }] },
  orion: { name: "ОРІОН", color: "hsl(263, 60%, 50%)", desc: "Приватна військова компанія", members: [{ name: "Merc_01", rank: "Бойовик" }, { name: "Merc_02", rank: "Командир" }] },
  ghetto: { name: "ГЕТТО", color: "hsl(0, 60%, 25%)", desc: "Вуличне угруповання", members: [{ name: "Gangster_01", rank: "Член банди" }] },
  mafia: { name: "МАФІЯ", color: "hsl(270, 50%, 40%)", desc: "Організована злочинність", members: [{ name: "Don_01", rank: "Капо" }] },
  judge: { name: "Суддя", color: "hsl(45, 80%, 50%)", desc: "Судова система", members: [{ name: "Judge_01", rank: "Суддя" }] },
  lawyers: { name: "Адвокати", color: "hsl(25, 80%, 50%)", desc: "Адвокатська палата", members: [{ name: "Lawyer_01", rank: "Адвокат" }] },
};

const FactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const faction = factionsData[id || ""];
  const [showForm, setShowForm] = useState(false);
  const [nick, setNick] = useState("");
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState("");

  if (!faction) {
    return (
      <div className="min-h-screen bg-background pb-20 px-4 pt-4">
        <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/factions" />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!nick || !message) return toast.error("Заповніть усі поля");
    toast.success(`Анкету у ${faction.name} відправлено!`);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title={faction.name} subtitle={faction.desc} backTo="/factions" />

      <div className="animate-fade-in">
        {/* Faction info */}
        <div className="glass rounded-2xl p-4 mb-4" style={{ borderColor: faction.color + "44" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: faction.color + "33", border: `1px solid ${faction.color}66`, color: faction.color }}
            >
              {faction.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{faction.name}</h2>
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
              <div key={i} className="glass rounded-xl p-3 flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
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
          <div className="glass rounded-2xl p-4 space-y-3 animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground">Анкета у {faction.name}</h3>
            {[
              { label: "Нік", value: nick, set: setNick, placeholder: "Ваш нік" },
              { label: "Гаманець", value: wallet, set: setWallet, placeholder: "Номер гаманця" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Повідомлення</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Чому хочете вступити?"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-24 bg-transparent"
              />
            </div>
            <div className="flex gap-2">
              <GradientButton variant="green" className="flex-1" onClick={handleSubmit}>
                Відправити
              </GradientButton>
              <button onClick={() => setShowForm(false)} className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground active:scale-95 transition-all">
                Скасувати
              </button>
            </div>
          </div>
        ) : (
          <GradientButton variant="purple" className="w-full" onClick={() => setShowForm(true)}>
            Подати анкету
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default FactionDetail;
