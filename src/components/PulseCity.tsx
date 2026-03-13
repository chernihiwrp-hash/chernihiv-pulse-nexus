import { Users, Home, Shield } from "lucide-react";

const stats = [
  { icon: Users, label: "Громадян", value: 20, color: "text-primary" },
  { icon: Home, label: "Домів", value: "0/22", color: "text-neon-yellow" },
  { icon: Shield, label: "У фракціях", value: 7, color: "text-secondary" },
];

const PulseCity = () => {
  return (
    <div className="liquid-glass-card rounded-2xl p-4">
      <h3 className="font-display text-sm neon-text-lime mb-3 tracking-wider">ПУЛЬС МІСТА</h3>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PulseCity;
