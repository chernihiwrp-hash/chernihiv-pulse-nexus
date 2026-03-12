import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Send } from "lucide-react";

const AdminApplication = () => {
  const [step, setStep] = useState(0);
  const [nick, setNick] = useState("");
  const [roblox, setRoblox] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [telegram, setTelegram] = useState("");
  const [experience, setExperience] = useState("");
  const [rpKnowledge, setRpKnowledge] = useState("");
  const [reason, setReason] = useState("");

  const inputClass = "w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50";

  const steps = [
    {
      title: "Особисті дані",
      content: (
        <div className="space-y-3">
          {[
            { label: "Ваш нік (RP ім'я)", value: nick, set: setNick, placeholder: "Введіть нік" },
            { label: "Roblox Username", value: roblox, set: setRoblox, placeholder: "Roblox username" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className={inputClass} />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Вік</label>
            <div className="flex gap-2">
              {["10-13", "14-16", "17-18", "18+"].map(a => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`flex-1 text-xs px-3 py-2.5 rounded-xl border transition-all active:scale-95 ${
                    age === a ? "bg-primary/20 border-primary/40 text-primary" : "glass text-muted-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      validate: () => nick && roblox && age,
    },
    {
      title: "Контакти",
      content: (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Країна / Таймзона</label>
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Україна, UTC+2" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Telegram</label>
            <input value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="@username" className={inputClass} />
          </div>
        </div>
      ),
      validate: () => country && telegram,
    },
    {
      title: "Досвід та мотивація",
      content: (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Досвід адміністрування</label>
            <textarea
              value={experience}
              onChange={e => setExperience(e.target.value)}
              placeholder="На яких серверах/проєктах ви були адміном?"
              className={`${inputClass} resize-none h-24 bg-transparent`}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Знання RP правил</label>
            <textarea
              value={rpKnowledge}
              onChange={e => setRpKnowledge(e.target.value)}
              placeholder="Що таке RDM, VDM, NLR, Metagaming?"
              className={`${inputClass} resize-none h-24 bg-transparent`}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Чому хочете стати адміном?</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Розкажіть про свою мотивацію..."
              className={`${inputClass} resize-none h-24 bg-transparent`}
            />
          </div>
        </div>
      ),
      validate: () => experience && rpKnowledge && reason,
    },
  ];

  const handleSubmit = () => {
    if (!steps[step].validate()) return toast.error("Заповніть усі поля");
    toast.success("Заявку на адміністратора відправлено на розгляд!");
    setStep(0);
    setNick(""); setRoblox(""); setAge(""); setCountry(""); setTelegram(""); setExperience(""); setRpKnowledge(""); setReason("");
  };

  const nextStep = () => {
    if (!steps[step].validate()) return toast.error("Заповніть усі поля");
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-4">
      <PageHeader title="ЗАЯВКА В АДМІН" subtitle="Стань адміністратором" backTo="/" />

      <div className="animate-fade-in">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${
                i <= step ? "bg-gradient-to-r from-[hsl(84,81%,44%)] to-primary" : "bg-muted"
              }`} />
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{step + 1}</span>
            {steps[step].title}
          </h3>
          {steps[step].content}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="glass rounded-2xl px-4 py-3 text-sm text-muted-foreground active:scale-95 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
          )}
          {step < steps.length - 1 ? (
            <GradientButton variant="green" className="flex-1" onClick={nextStep}>
              Далі <ChevronRight className="w-4 h-4 inline ml-1" />
            </GradientButton>
          ) : (
            <GradientButton variant="green" className="flex-1" onClick={handleSubmit}>
              <Send className="w-4 h-4 inline mr-1" /> Відправити заявку
            </GradientButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplication;
