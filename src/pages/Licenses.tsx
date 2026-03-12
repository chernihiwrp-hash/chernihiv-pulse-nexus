import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";

const weapons = [
  { category: "Вогнепальна", items: ["Glock 17", "MP5", "M58B Shotgun", "M4 Carbine", "G36", "Sniper"] },
  { category: "Ближній бій", items: ["Bayonet", "Machete", "Baseball Bat", "Metal Bat", "Knuckledusters"] },
  { category: "Спец засоби", items: ["Taser"] },
];

const Licenses = () => {
  const [nick, setNick] = useState("");
  const [roblox, setRoblox] = useState("");
  const [telegram, setTelegram] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleWeapon = (weapon: string) => {
    if (selected.includes(weapon)) {
      setSelected(selected.filter(w => w !== weapon));
    } else if (selected.length < 5) {
      setSelected([...selected, weapon]);
    } else {
      toast.error("Максимум 5 предметів!");
    }
  };

  const handleSubmit = () => {
    if (!nick || !roblox || !telegram || selected.length === 0) {
      toast.error("Заповніть усі поля та оберіть зброю");
      return;
    }
    toast.success("Заявку на ліцензію відправлено!");
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ЛІЦЕНЗІЇ" subtitle="Вартість: 4000 CR" backTo="/" />

      <div className="space-y-4">
        <div className="space-y-3">
          {[
            { label: "Нік", value: nick, set: setNick, placeholder: "Ваш нік" },
            { label: "Roblox Username", value: roblox, set: setRoblox, placeholder: "Roblox username" },
            { label: "Telegram", value: telegram, set: setTelegram, placeholder: "@username" },
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
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Оберіть зброю ({selected.length}/5)</p>
          {weapons.map(cat => (
            <div key={cat.category} className="mb-3">
              <p className="text-[11px] text-primary font-medium mb-1.5">{cat.category}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(w => (
                  <button
                    key={w}
                    onClick={() => toggleWeapon(w)}
                    className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                      selected.includes(w)
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <GradientButton onClick={handleSubmit} variant="green" className="w-full">
          Подати заявку — 4000 CR
        </GradientButton>
      </div>
    </div>
  );
};

export default Licenses;
