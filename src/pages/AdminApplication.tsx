import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";

const AdminApplication = () => {
  const [nick, setNick] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!nick || !age || !experience || !reason) {
      return toast.error("Заповніть усі поля");
    }
    toast.success("Заявку відправлено на розгляд!");
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ЗАЯВКА В АДМІН" subtitle="Стань адміністратором" backTo="/" />

      <div className="animate-fade-in space-y-3">
        {[
          { label: "Нік", value: nick, set: setNick, placeholder: "Ваш нік" },
          { label: "Вік", value: age, set: setAge, placeholder: "Ваш вік" },
          { label: "Досвід адміністрування", value: experience, set: setExperience, placeholder: "Де були адміном" },
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
          <label className="text-xs text-muted-foreground mb-1 block">Чому хочете стати адміном?</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Розкажіть про себе..."
            className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-28 bg-transparent"
          />
        </div>

        <GradientButton variant="green" className="w-full" onClick={handleSubmit}>
          Відправити заявку
        </GradientButton>
      </div>
    </div>
  );
};

export default AdminApplication;
