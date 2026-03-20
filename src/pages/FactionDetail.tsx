import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/GradientButton";
import { Users, User, Send, CheckCircle, Clock, Shield } from "lucide-react";
import { toast } from "sonner";
import { store, supabase } from "../lib/store";

// Static faction data (fallback)
const factionsData: Record<string, { name: string; color: string; gradient: string; desc: string; dangerous?: boolean }> = {
  sbu: { name: "СБУ", color: "hsl(220, 70%, 55%)", gradient: "linear-gradient(135deg, hsl(220,70%,35%,0.2), hsl(220,70%,15%,0.08))", desc: "Служба безпеки України" },
  dbr: { name: "ДБР", color: "hsl(160, 50%, 45%)", gradient: "linear-gradient(135deg, hsl(160,50%,35%,0.2), hsl(160,50%,15%,0.08))", desc: "Державне бюро розслідувань" },
  npu: { name: "НПУ", color: "hsl(210, 80%, 55%)", gradient: "linear-gradient(135deg, hsl(210,80%,45%,0.2), hsl(210,80%,20%,0.08))", desc: "Національна поліція України" },
  vsu: { name: "ВСУ", color: "hsl(140, 50%, 40%)", gradient: "linear-gradient(135deg, hsl(140,50%,30%,0.2), hsl(100,40%,20%,0.08))", desc: "Збройні Сили України" },
  prosecutor: { name: "Прокуратура", color: "hsl(30, 50%, 50%)", gradient: "linear-gradient(135deg, hsl(30,50%,35%,0.2), hsl(220,10%,30%,0.08))", desc: "Нагляд за дотриманням законів" },
  dsns: { name: "ДСНС", color: "hsl(15, 80%, 55%)", gradient: "linear-gradient(135deg, hsl(15,80%,45%,0.2), hsl(15,60%,20%,0.08))", desc: "Служба з надзвичайних ситуацій" },
  judge: { name: "Суддя", color: "hsl(45, 80%, 55%)", gradient: "linear-gradient(135deg, hsl(45,80%,50%,0.2), hsl(40,70%,25%,0.08))", desc: "Судова система" },
  lawyers: { name: "Адвокати", color: "hsl(25, 80%, 55%)", gradient: "linear-gradient(135deg, hsl(25,80%,50%,0.2), hsl(20,70%,25%,0.08))", desc: "Захист прав та інтересів" },
  orion: { name: "ОРІОН", color: "hsl(0, 55%, 45%)", gradient: "linear-gradient(135deg, hsl(0,55%,25%,0.35), hsl(0,0%,4%,0.45))", desc: "Приватна військова компанія", dangerous: true },
  ghetto: { name: "ГЕТТО", color: "hsl(0, 60%, 42%)", gradient: "linear-gradient(135deg, hsl(0,60%,20%,0.4), hsl(0,0%,3%,0.5))", desc: "Вуличне угруповання", dangerous: true },
  mafia: { name: "МАФІЯ", color: "hsl(0, 65%, 45%)", gradient: "linear-gradient(135deg, hsl(0,65%,25%,0.35), hsl(0,0%,5%,0.4))", desc: "Організована злочинність", dangerous: true },
};

type Member = { name: string; rank: string };
type AppStatus = "idle" | "sending" | "sent";

const DEFAULT_QUESTIONS = [
  "Чому хочеш вступити у фракцію?",
  "Який у тебе досвід в RP?",
  "Скільки часу на день граєш?",
];

const FactionDetail = () => {
  const { id } = useParams();
  const [faction, setFaction] = useState<{
    name: string; color: string; gradient: string; desc: string; dangerous?: boolean;
  } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>(DEFAULT_QUESTIONS);
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [nick, setNick] = useState(localStorage.getItem("crp_nick") || "");
  const [roblox, setRoblox] = useState("");
  const [age, setAge] = useState("");
  const [telegram, setTelegram] = useState("");
  const [appStatus, setAppStatus] = useState<AppStatus>("idle");

  useEffect(() => {
    if (!id) return;

    // Load faction info — check DB first, then fallback to static
    const loadFaction = async () => {
      const { data } = await supabase
        .from("factions")
        .select("*")
        .order("created_at", { ascending: true });

      let found = null;

      if (data && data.length > 0) {
        // Try match by numeric id (DB factions) or by name slug
        const dbFaction = data.find(
          (f: Record<string, unknown>) =>
            String(f.id) === id ||
            (f.name as string).toLowerCase().replace(/\s+/g, "_") === id
        );
        if (dbFaction) {
          found = {
            name: dbFaction.name as string,
            color: (dbFaction.color as string) || "hsl(84 81% 44%)",
            gradient: (dbFaction.gradient as string) || `linear-gradient(135deg, ${dbFaction.color}22, ${dbFaction.color}08)`,
            desc: "Фракція сервера",
            dangerous: false,
          };
          // Load custom questions from localStorage
          const savedQ = localStorage.getItem(`crp_faction_questions_${(dbFaction.name as string).toLowerCase()}`);
          if (savedQ) {
            try {
              const parsed = JSON.parse(savedQ);
              if (parsed.questions?.length) setQuestions(parsed.questions);
            } catch { /* ignore */ }
          }
        }
      }

      if (!found && factionsData[id]) {
        found = factionsData[id];
      }

      setFaction(found);
    };

    // Load real members from approved faction applications
    const loadMembers = async () => {
      setMembersLoading(true);
      const { data } = await supabase
        .from("faction_applications")
        .select("username, form_data, faction_id, faction_name")
        .eq("status", "approved");

      if (data) {
        // Match by faction_id or faction_name
        const matched = (data as Record<string, unknown>[]).filter(a => {
          const fid = a.faction_id as string;
          const fname = (a.faction_name as string || "").toLowerCase();
          const staticF = factionsData[id || ""];
          return (
            fid === id ||
            fname === (staticF?.name || "").toLowerCase() ||
            fname === id?.toLowerCase()
          );
        });

        const mems: Member[] = matched.map(a => {
          const fd = (a.form_data as Record<string, unknown>) || {};
          return {
            name: (fd.nick as string) || (a.username as string) || "Гравець",
            rank: "Учасник",
          };
        });
        setMembers(mems);
      }
      setMembersLoading(false);
    };

    loadFaction();
    loadMembers();
  }, [id]);

  if (!faction) return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <PageHeader title="НЕ ЗНАЙДЕНО" backTo="/factions" />
      <div className="flex items-center justify-center py-16">
        <p className="text-xs text-muted-foreground">Фракцію не знайдено</p>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!nick || !roblox || !age || !telegram) return toast.error("Заповніть усі поля");
    const unanswered = questions.findIndex((_, i) => !answers[i]?.trim());
    if (unanswered !== -1) return toast.error(`Дайте відповідь на питання ${unanswered + 1}`);
    setAppStatus("sending");

    const message = questions.map((q, i) => `${i + 1}. ${q}\n→ ${answers[i] || ""}`).join("\n\n");

    await store.submitFactionApp({
      factionId: id || "",
      factionName: faction.name,
      nick,
      roblox,
      age,
      telegram,
      experience: "",
      message,
    });
    setAppStatus("sent");
    setTimeout(() => {
      setShowForm(false);
      setAppStatus("idle");
      setRoblox(""); setAge(""); setTelegram(""); setAnswers({});
    }, 3000);
  };

  const inputClass = "w-full liquid-glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors bg-transparent";
  const btnVariant = faction.dangerous ? "danger" : "green";

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
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
              <p className="text-xs text-muted-foreground">
                Учасників: {membersLoading ? "..." : members.length}
              </p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Учасники</span>
          </div>
          {membersLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="liquid-glass rounded-xl p-4 text-center">
              <Shield className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Немає підтверджених учасників</p>
              <p className="text-[10px] text-muted-foreground/50 mt-1">Учасники з'являться після схвалення заявок</p>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((m, i) => (
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
          )}
        </div>

        {/* Sent confirmation */}
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

        {/* Application form */}
        {showForm && appStatus !== "sent" ? (
          <div className="liquid-glass-strong rounded-2xl p-4 space-y-3 animate-fade-in" style={{ borderColor: faction.color + "22" }}>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send className="w-4 h-4" style={{ color: faction.color }} /> Анкета у {faction.name}
            </h3>

            {/* Base fields */}
            {[
              { label: "Нік (RP ім'я)", value: nick, set: setNick, placeholder: "Ваш RP нік" },
              { label: "Roblox Username", value: roblox, set: setRoblox, placeholder: "Roblox username" },
              { label: "Вік", value: age, set: setAge, placeholder: "Ваш вік" },
              { label: "Telegram", value: telegram, set: setTelegram, placeholder: "@username" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className={inputClass} />
              </div>
            ))}

            {/* Dynamic questions */}
            {questions.map((q, i) => (
              <div key={i}>
                <label className="text-xs text-muted-foreground mb-1 block">
                  <span className="text-primary font-bold">{i + 1}. </span>{q}
                </label>
                <textarea
                  value={answers[i] || ""}
                  onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                  placeholder="Ваша відповідь..."
                  className={`${inputClass} resize-none h-20`}
                />
              </div>
            ))}

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
