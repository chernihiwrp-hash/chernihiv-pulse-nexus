import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AlertTriangle, Shield, Swords, Scale, Gavel, Flame, Crosshair,
  Skull, Target, Eye, BookOpen, ShieldCheck, ChevronRight, Users, Plus
} from "lucide-react";
import { supabase } from "../lib/store";
import type { FactionDB } from "../lib/store";

// Захардкоджені фракції (fallback якщо Supabase порожній)
const STATIC_FACTIONS = [
  { id: "sbu", name: "СБУ", desc: "Служба безпеки", icon: Eye, color: "hsl(220, 60%, 55%)", gradient: "linear-gradient(135deg, hsl(220,60%,30%,0.25), hsl(220,60%,15%,0.08))", dangerous: false },
  { id: "dbr", name: "ДБР", desc: "Держ. бюро розслідувань", icon: Target, color: "hsl(160, 50%, 45%)", gradient: "linear-gradient(135deg, hsl(160,50%,30%,0.25), hsl(160,50%,15%,0.08))", dangerous: false },
  { id: "npu", name: "НПУ", desc: "Національна поліція", icon: Shield, color: "hsl(210, 70%, 55%)", gradient: "linear-gradient(135deg, hsl(210,70%,40%,0.25), hsl(210,70%,20%,0.08))", dangerous: false },
  { id: "vsu", name: "ВСУ", desc: "Збройні сили", icon: Swords, color: "hsl(140, 45%, 45%)", gradient: "linear-gradient(135deg, hsl(140,45%,30%,0.25), hsl(100,40%,18%,0.08))", dangerous: false },
  { id: "prosecutor", name: "Прокуратура", desc: "Нагляд за законністю", icon: Scale, color: "hsl(35, 45%, 50%)", gradient: "linear-gradient(135deg, hsl(35,45%,35%,0.25), hsl(30,30%,20%,0.08))", dangerous: false },
  { id: "dsns", name: "ДСНС", desc: "Надзвичайні ситуації", icon: Flame, color: "hsl(15, 80%, 55%)", gradient: "linear-gradient(135deg, hsl(15,80%,40%,0.25), hsl(15,70%,20%,0.08))", dangerous: false },
  { id: "judge", name: "Суддя", desc: "Судова система", icon: Gavel, color: "hsl(45, 70%, 55%)", gradient: "linear-gradient(135deg, hsl(45,70%,45%,0.25), hsl(40,60%,22%,0.08))", dangerous: false },
  { id: "lawyers", name: "Адвокати", desc: "Захист прав", icon: BookOpen, color: "hsl(25, 70%, 55%)", gradient: "linear-gradient(135deg, hsl(25,70%,45%,0.25), hsl(20,60%,22%,0.08))", dangerous: false },
  { id: "mafia", name: "МАФІЯ", desc: "Організована злочинність", icon: Skull, color: "hsl(0, 55%, 45%)", gradient: "linear-gradient(135deg, hsl(0,55%,22%,0.4), hsl(0,0%,4%,0.5))", dangerous: true },
  { id: "ghetto", name: "ГЕТТО", desc: "Вуличне угруповання", icon: Crosshair, color: "hsl(0, 50%, 42%)", gradient: "linear-gradient(135deg, hsl(0,50%,20%,0.45), hsl(0,0%,3%,0.5))", dangerous: true },
  { id: "orion", name: "ОРІОН", desc: "Приватна військова компанія", icon: ShieldCheck, color: "hsl(0, 45%, 40%)", gradient: "linear-gradient(135deg, hsl(0,45%,22%,0.4), hsl(0,0%,4%,0.45))", dangerous: true },
];

// Іконки для фракцій з бази
const ICON_MAP: Record<string, typeof Shield> = {
  Shield, Swords, Scale, Gavel, Flame, Crosshair, Skull, Target, Eye, BookOpen, ShieldCheck, Users, Plus, AlertTriangle,
};

type FactionItem = {
  id: string;
  name: string;
  desc: string;
  icon: typeof Shield;
  color: string;
  gradient: string;
  dangerous: boolean;
  memberCount: number;
  fromDB?: boolean;
};

export const factions = STATIC_FACTIONS;

const Factions = () => {
  const navigate = useNavigate();
  const [factionList, setFactionList] = useState<FactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // 1. Отримуємо фракції з Supabase
      const { data: dbFactions } = await supabase
        .from("factions")
        .select("*")
        .order("created_at", { ascending: true });

      // 2. Рахуємо учасників
      const { data: appData } = await supabase
        .from("faction_applications")
        .select("faction_id, faction_name")
        .eq("status", "approved");

      const countById: Record<string, number> = {};
      const countByName: Record<string, number> = {};
      (appData || []).forEach((a: Record<string, unknown>) => {
        const fid = a.faction_id as string;
        const fname = (a.faction_name as string || "").toLowerCase();
        if (fid) countById[fid] = (countById[fid] || 0) + 1;
        if (fname) countByName[fname] = (countByName[fname] || 0) + 1;
      });

      let result: FactionItem[] = [];

      // 3. Якщо є фракції з БД — показуємо їх
      if (dbFactions && dbFactions.length > 0) {
        const dbItems: FactionItem[] = (dbFactions as FactionDB[]).map(f => ({
          id: String(f.id),
          name: f.name,
          desc: f.gradient ? "Фракція сервера" : "Фракція сервера",
          icon: ICON_MAP["Shield"],
          color: f.color || "hsl(84, 81%, 44%)",
          gradient: f.gradient || `linear-gradient(135deg, ${f.color}22, ${f.color}08)`,
          dangerous: false,
          memberCount: countById[String(f.id)] || countByName[f.name.toLowerCase()] || 0,
          fromDB: true,
        }));
        result = dbItems;
      }

      // 4. Завжди додаємо статичні фракції (якщо їх немає в БД за іменем)
      const dbNames = new Set(result.map(f => f.name.toLowerCase()));
      const staticItems: FactionItem[] = STATIC_FACTIONS
        .filter(sf => !dbNames.has(sf.name.toLowerCase()))
        .map(sf => ({
          ...sf,
          memberCount: countByName[sf.name.toLowerCase()] || countById[sf.id] || 0,
        }));

      result = [...result, ...staticItems];
      setFactionList(result);
      setLoading(false);
    };
    load();
  }, []);

  const govFactions = factionList.filter(f => !f.dangerous);
  const crimFactions = factionList.filter(f => f.dangerous);

  const renderFaction = (f: FactionItem, i: number) => (
    <button key={f.id} onClick={() => navigate(`/factions/${f.id}`)}
      className="w-full animate-slide-up text-left"
      style={{ animationDelay: `${i * 50}ms` }}>
      <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
        style={{ background: f.gradient, borderColor: f.color + "30" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px ${f.color}28`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: f.color + "18", border: `1px solid ${f.color}35`, boxShadow: `0 0 10px ${f.color}18` }}>
          <f.icon className="w-5 h-5" style={{ color: f.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{f.name}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: f.color + "15", border: `1px solid ${f.color}25` }}>
            <Users className="w-3 h-3" style={{ color: f.color }} />
            <span className="text-[10px] font-semibold" style={{ color: f.color }}>{f.memberCount}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </button>
  );

  if (loading) return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime mb-5">ФРАКЦІЇ</h1>
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Завантаження...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <h1 className="font-display text-xl font-bold tracking-wider neon-text-lime mb-1">ФРАКЦІЇ</h1>
      <p className="text-xs text-muted-foreground mb-5">Оберіть фракцію для вступу</p>

      <div className="mb-1">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Державні структури</span>
        </div>
        <div className="space-y-2">{govFactions.map((f, i) => renderFaction(f, i))}</div>
      </div>

      {crimFactions.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">Небезпечні фракції</span>
          </div>
          <div className="space-y-2">{crimFactions.map((f, i) => renderFaction(f, govFactions.length + i))}</div>
        </div>
      )}
    </div>
  );
};

export default Factions;
