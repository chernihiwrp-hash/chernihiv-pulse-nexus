import { useState } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Send } from "lucide-react";

const ages = ["10", "11", "12", "13", "14", "15", "16", "17", "18"];
const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця", "Субота", "Неділя"];

const AdminApplication = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    realName: "", roblox: "", age: "", country: "", telegram: "",
    timePerDay: "", playTime: "", hasMic: "",
    adminExp: "", rpTime: "", rpKnowledge: "5",
    q1: "", q2: "", q3: "", q4: "",
    rulesRead: "", offlineDays: [] as string[],
  });

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleDay = (d: string) => setForm(prev => ({
    ...prev,
    offlineDays: prev.offlineDays.includes(d) ? prev.offlineDays.filter(x => x !== d) : [...prev.offlineDays, d],
  }));

  const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 bg-transparent";

  const steps = [
    {
      title: "Особисті дані",
      content: (
        <div className="space-y-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Ім'я (реальне)</label>
            <input value={form.realName} onChange={e => set("realName", e.target.value)} placeholder="Ваше ім'я" className={inputClass} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Roblox Username</label>
            <input value={form.roblox} onChange={e => set("roblox", e.target.value)} placeholder="Username" className={inputClass} /></div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Вік</label>
            <div className="grid grid-cols-5 gap-1.5">
              {ages.map(a => (
                <button key={a} onClick={() => set("age", a)}
                  className={`text-xs py-2 rounded-xl border transition-all active:scale-95 ${form.age === a ? "bg-primary/20 border-primary/40 text-primary" : "liquid-glass text-muted-foreground"}`}
                >{a}</button>
              ))}
            </div>
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Країна / часовий пояс</label>
            <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="Україна, UTC+2" className={inputClass} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Telegram (нік + тег)</label>
            <input value={form.telegram} onChange={e => set("telegram", e.target.value)} placeholder="@username" className={inputClass} /></div>
        </div>
      ),
      validate: () => form.realName && form.roblox && form.age && form.country && form.telegram,
    },
    {
      title: "Активність",
      content: (
        <div className="space-y-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Скільки часу на день готові приділяти серверу?</label>
            <input value={form.timePerDay} onChange={e => set("timePerDay", e.target.value)} placeholder="Наприклад: 3-4 години" className={inputClass} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">У який час зазвичай граєте?</label>
            <input value={form.playTime} onChange={e => set("playTime", e.target.value)} placeholder="Наприклад: 16:00-22:00" className={inputClass} /></div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Чи є у вас мікрофон?</label>
            <div className="flex gap-2">
              {["Так", "Ні"].map(v => (
                <button key={v} onClick={() => set("hasMic", v)}
                  className={`flex-1 text-xs py-2.5 rounded-xl border transition-all active:scale-95 ${form.hasMic === v ? "bg-primary/20 border-primary/40 text-primary" : "liquid-glass text-muted-foreground"}`}
                >{v}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">В які дні не зможете бути онлайн?</label>
            <div className="grid grid-cols-4 gap-1.5">
              {days.map(d => (
                <button key={d} onClick={() => toggleDay(d)}
                  className={`text-[10px] py-2 rounded-xl border transition-all active:scale-95 ${form.offlineDays.includes(d) ? "bg-destructive/20 border-destructive/30 text-destructive" : "liquid-glass text-muted-foreground"}`}
                >{d}</button>
              ))}
            </div>
          </div>
        </div>
      ),
      validate: () => form.timePerDay && form.playTime && form.hasMic,
    },
    {
      title: "Досвід",
      content: (
        <div className="space-y-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Чи маєте досвід адміністрування?</label>
            <textarea value={form.adminExp} onChange={e => set("adminExp", e.target.value)} placeholder="На яких серверах/проєктах?" className={`${inputClass} resize-none h-20`} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Скільки часу граєте на RP-проєктах?</label>
            <input value={form.rpTime} onChange={e => set("rpTime", e.target.value)} placeholder="Наприклад: 2 роки" className={inputClass} /></div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Оцініть знання RP правил (1–10): {form.rpKnowledge}</label>
            <input type="range" min="1" max="10" value={form.rpKnowledge} onChange={e => set("rpKnowledge", e.target.value)}
              className="w-full accent-primary h-2" />
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
              <span>1</span><span>5</span><span>10</span>
            </div>
          </div>
        </div>
      ),
      validate: () => form.adminExp && form.rpTime,
    },
    {
      title: "Ситуаційні питання",
      content: (
        <div className="space-y-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Що робити якщо адміністратор вищого рангу порушує правила?</label>
            <textarea value={form.q1} onChange={e => set("q1", e.target.value)} placeholder="Ваша відповідь..." className={`${inputClass} resize-none h-20`} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Гравець ображає інших в OOC чаті. Ваші дії?</label>
            <textarea value={form.q2} onChange={e => set("q2", e.target.value)} placeholder="Ваша відповідь..." className={`${inputClass} resize-none h-20`} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Ваш знайомий порушив правила. Що зробите?</label>
            <textarea value={form.q3} onChange={e => set("q3", e.target.value)} placeholder="Ваша відповідь..." className={`${inputClass} resize-none h-20`} /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Чому хочете стати адміністратором нашого сервера?</label>
            <textarea value={form.q4} onChange={e => set("q4", e.target.value)} placeholder="Ваша відповідь..." className={`${inputClass} resize-none h-20`} /></div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">З правилами ознайомлений?</label>
            <div className="flex gap-2">
              {["Так", "Ні"].map(v => (
                <button key={v} onClick={() => set("rulesRead", v)}
                  className={`flex-1 text-xs py-2.5 rounded-xl border transition-all active:scale-95 ${form.rulesRead === v ? "bg-primary/20 border-primary/40 text-primary" : "liquid-glass text-muted-foreground"}`}
                >{v}</button>
              ))}
            </div>
          </div>
        </div>
      ),
      validate: () => form.q1 && form.q2 && form.q3 && form.q4 && form.rulesRead,
    },
  ];

  const handleSubmit = () => {
    if (!steps[step].validate()) return toast.error("Заповніть усі поля");
    toast.success("Заявку на адміністратора відправлено на розгляд!");
    setStep(0);
    setForm({ realName: "", roblox: "", age: "", country: "", telegram: "", timePerDay: "", playTime: "", hasMic: "", adminExp: "", rpTime: "", rpKnowledge: "5", q1: "", q2: "", q3: "", q4: "", rulesRead: "", offlineDays: [] });
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
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"}`} />
          ))}
        </div>

        <div className="liquid-glass-strong rounded-2xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{step + 1}</span>
            {steps[step].title}
          </h3>
          {steps[step].content}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="liquid-glass rounded-2xl px-4 py-3 text-sm text-muted-foreground active:scale-95 transition-all flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
          )}
          {step < steps.length - 1 ? (
            <GradientButton variant="green" className="flex-1" onClick={nextStep}>
              Далі <ChevronRight className="w-4 h-4 inline ml-1" />
            </GradientButton>
          ) : (
            <GradientButton variant="green" className="flex-1" onClick={handleSubmit}>
              <Send className="w-4 h-4 inline mr-1" /> Відправити
            </GradientButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplication;
