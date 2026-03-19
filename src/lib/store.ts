// Supabase-based state management (замінює localStorage)
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qwpzmioxhbkmxrwwevsv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cHptaW94aGJrbXhyd3dldnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTM3NTksImV4cCI6MjA4OTUyOTc1OX0.CrPDm1vWaEruGVQpfBYKYwYO4DG9WlibhVzLHaBMGh8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// TYPES (без змін — сумісність зі старим кодом)
// ============================================

export type NewsItem = {
  id: number;
  title: string;
  text: string;
  date: string;
  image?: string;
};

export type HouseItem = {
  id: number;
  name: string;
  price: number;
  desc: string;
  category: string;
  owner: string | null;
  photos: string[];
};

export type WantedPerson = {
  id: number;
  name: string;
  reason: string;
  stars: number;
};

export type FactionApplication = {
  id: number;
  factionId: string;
  factionName: string;
  nick: string;
  roblox: string;
  age: string;
  telegram: string;
  experience: string;
  message: string;
  status: "review" | "approved" | "rejected";
  date: string;
};

export type AdminApplication = {
  id: number;
  nick: string;
  roblox: string;
  age: string;
  country: string;
  telegram: string;
  timePerDay: string;
  playTime: string;
  hasMic: boolean;
  adminExp: string;
  rpTime: string;
  rpKnowledge: number;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  rulesRead: boolean;
  daysOff: string;
  status: "review" | "approved" | "rejected";
  date: string;
};

export type CityVoiceItem = {
  id: number;
  author: string;
  text: string;
  type: "idea" | "petition";
  likes: number;
  dislikes: number;
  status: "active" | "approved" | "rejected";
};

export type MayorCandidate = {
  id: number;
  name: string;
  program: string;
  bio: string;
  votes: number;
};

export type DocumentItem = {
  id: number;
  title: string;
  content: string;
};

export type CarRecord = {
  plate: string;
  model: string;
  owner: string;
};

export type SosMessage = {
  id: number;
  reason: string;
  description: string;
  date: string;
};

export type Notification = {
  id: number;
  text: string;
  date: string;
  read: boolean;
};

// ============================================
// HELPERS — конвертація з Supabase формату
// ============================================

function toNewsItem(row: Record<string, unknown>): NewsItem {
  return {
    id: row.id as number,
    title: row.title as string,
    text: row.content as string,
    date: new Date(row.created_at as string).toLocaleDateString("uk-UA"),
    image: row.image_url as string | undefined,
  };
}

function toHouseItem(row: Record<string, unknown>): HouseItem {
  const photos = row.image_url ? [row.image_url as string] : ["🏠"];
  return {
    id: row.id as number,
    name: row.name as string,
    price: row.price as number,
    desc: row.description as string,
    category: (row.category as string) || "Люкс",
    owner: row.owner_username as string | null,
    photos,
  };
}

function toWanted(row: Record<string, unknown>): WantedPerson {
  return {
    id: row.id as number,
    name: row.target_username as string,
    reason: row.reason as string,
    stars: row.stars as number,
  };
}

function toFactionApp(row: Record<string, unknown>): FactionApplication {
  const fd = (row.form_data as Record<string, unknown>) || {};
  return {
    id: row.id as number,
    factionId: row.faction_id as string,
    factionName: (row.faction_name as string) || "",
    nick: fd.nick as string || row.username as string,
    roblox: fd.roblox as string || "",
    age: fd.age as string || "",
    telegram: fd.telegram as string || "",
    experience: fd.experience as string || "",
    message: fd.message as string || "",
    status: (row.status === "pending" ? "review" : row.status) as FactionApplication["status"],
    date: new Date(row.created_at as string).toLocaleDateString("uk-UA"),
  };
}

function toAdminApp(row: Record<string, unknown>): AdminApplication {
  const fd = (row.form_data as Record<string, unknown>) || {};
  return {
    id: row.id as number,
    nick: fd.nick as string || row.username as string,
    roblox: fd.roblox as string || "",
    age: fd.age as string || "",
    country: fd.country as string || "",
    telegram: fd.telegram as string || "",
    timePerDay: fd.timePerDay as string || "",
    playTime: fd.playTime as string || "",
    hasMic: fd.hasMic as boolean || false,
    adminExp: fd.adminExp as string || "",
    rpTime: fd.rpTime as string || "",
    rpKnowledge: fd.rpKnowledge as number || 0,
    q1: fd.q1 as string || "",
    q2: fd.q2 as string || "",
    q3: fd.q3 as string || "",
    q4: fd.q4 as string || "",
    rulesRead: fd.rulesRead as boolean || false,
    daysOff: fd.daysOff as string || "",
    status: (row.status === "pending" ? "review" : row.status) as AdminApplication["status"],
    date: new Date(row.created_at as string).toLocaleDateString("uk-UA"),
  };
}

function toCityVoice(row: Record<string, unknown>): CityVoiceItem {
  return {
    id: row.id as number,
    author: row.username as string,
    text: row.message as string,
    type: (row.type as CityVoiceItem["type"]) || "idea",
    likes: (row.likes as number) || 0,
    dislikes: (row.dislikes as number) || 0,
    status: (row.status === "pending" ? "active" : row.status) as CityVoiceItem["status"],
  };
}

function toCandidate(row: Record<string, unknown>): MayorCandidate {
  return {
    id: row.id as number,
    name: row.candidate_username as string,
    program: row.description as string,
    bio: (row.bio as string) || "",
    votes: (row.votes as number) || 0,
  };
}

function toSos(row: Record<string, unknown>): SosMessage {
  return {
    id: row.id as number,
    reason: row.type as string,
    description: row.message as string,
    date: new Date(row.created_at as string).toLocaleDateString("uk-UA"),
  };
}

// ============================================
// STORE — всі методи тепер через Supabase
// ============================================

export const store = {
  // ---- NEWS ----
  getNews: async (): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toNewsItem);
  },

  setNews: async (items: NewsItem[]) => {
    // Використовується тільки адміном для додавання
    console.warn("setNews: використовуй addNews для додавання");
  },

  addNews: async (title: string, text: string, image?: string, type: "news" | "update" = "news") => {
    const { error } = await supabase.from("news").insert({
      title,
      content: text,
      image_url: image || null,
      type,
      author_id: "00000000-0000-0000-0000-000000000001", // системний адмін
    });
    if (error) console.error("addNews error:", error);
  },

  // ---- HOUSES ----
  getHouses: async (): Promise<HouseItem[]> => {
    const { data, error } = await supabase
      .from("houses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toHouseItem);
  },

  setHouses: async (items: HouseItem[]) => {
    console.warn("setHouses: використовуй addHouse/updateHouse");
  },

  addHouse: async (name: string, desc: string, price: number, imageUrl?: string, category = "Люкс") => {
    const { error } = await supabase.from("houses").insert({
      name,
      description: desc,
      price,
      image_url: imageUrl || null,
      category,
      is_for_sale: true,
    });
    if (error) console.error("addHouse error:", error);
  },

  buyHouse: async (houseId: number, owner: string) => {
    const { error } = await supabase
      .from("houses")
      .update({ is_for_sale: false, owner_username: owner })
      .eq("id", houseId);
    if (error) console.error("buyHouse error:", error);
  },

  // ---- WANTED ----
  getWanted: async (): Promise<WantedPerson[]> => {
    const { data, error } = await supabase
      .from("wanted")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toWanted);
  },

  setWanted: async (items: WantedPerson[]) => {
    console.warn("setWanted: використовуй addWanted/resolveWanted");
  },

  addWanted: async (name: string, reason: string, stars: number, issuedBy = "admin") => {
    const { error } = await supabase.from("wanted").insert({
      target_username: name,
      reason,
      stars,
      issued_by: issuedBy,
    });
    if (error) console.error("addWanted error:", error);
  },

  resolveWanted: async (id: number) => {
    const { error } = await supabase.from("wanted").update({ status: "resolved" }).eq("id", id);
    if (error) console.error("resolveWanted error:", error);
  },

  // ---- FACTION APPS ----
  getFactionApps: async (): Promise<FactionApplication[]> => {
    const { data, error } = await supabase
      .from("faction_applications")
      .select("*, factions(name)")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((row) => toFactionApp({ ...row, faction_name: (row.factions as Record<string, unknown>)?.name }));
  },

  setFactionApps: async (items: FactionApplication[]) => {
    console.warn("setFactionApps: використовуй submitFactionApp/updateFactionAppStatus");
  },

  submitFactionApp: async (app: Omit<FactionApplication, "id" | "status" | "date">) => {
    const { error } = await supabase.from("faction_applications").insert({
      faction_id: app.factionId,
      username: app.nick,
      form_data: {
        nick: app.nick,
        roblox: app.roblox,
        age: app.age,
        telegram: app.telegram,
        experience: app.experience,
        message: app.message,
      },
    });
    if (error) console.error("submitFactionApp error:", error);
  },

  updateFactionAppStatus: async (id: number, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("faction_applications")
      .update({ status })
      .eq("id", id);
    if (error) console.error("updateFactionAppStatus error:", error);
  },

  // ---- ADMIN APPS ----
  getAdminApps: async (): Promise<AdminApplication[]> => {
    const { data, error } = await supabase
      .from("admin_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toAdminApp);
  },

  setAdminApps: async (items: AdminApplication[]) => {
    console.warn("setAdminApps: використовуй submitAdminApp");
  },

  submitAdminApp: async (app: Omit<AdminApplication, "id" | "status" | "date">) => {
    const { error } = await supabase.from("admin_applications").insert({
      username: app.nick,
      form_data: app,
    });
    if (error) console.error("submitAdminApp error:", error);
  },

  updateAdminAppStatus: async (id: number, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("admin_applications")
      .update({ status })
      .eq("id", id);
    if (error) console.error("updateAdminAppStatus error:", error);
  },

  // ---- CITY VOICE ----
  getCityVoice: async (): Promise<CityVoiceItem[]> => {
    const { data, error } = await supabase
      .from("city_voice")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toCityVoice);
  },

  setCityVoice: async (items: CityVoiceItem[]) => {
    console.warn("setCityVoice: використовуй submitCityVoice");
  },

  submitCityVoice: async (author: string, text: string, type: "idea" | "petition") => {
    const { error } = await supabase.from("city_voice").insert({
      username: author,
      message: text,
      type,
    });
    if (error) console.error("submitCityVoice error:", error);
  },

  updateCityVoiceStatus: async (id: number, status: "approved" | "rejected") => {
    const { error } = await supabase.from("city_voice").update({ status }).eq("id", id);
    if (error) console.error("updateCityVoiceStatus error:", error);
  },

  // ---- MAYOR CANDIDATES ----
  getCandidates: async (): Promise<MayorCandidate[]> => {
    const { data, error } = await supabase
      .from("mayor_election")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toCandidate);
  },

  setCandidates: async (items: MayorCandidate[]) => {
    console.warn("setCandidates: використовуй addCandidate");
  },

  addCandidate: async (name: string, program: string, bio: string, createdBy = "admin") => {
    const { error } = await supabase.from("mayor_election").insert({
      candidate_username: name,
      description: program,
      bio,
      created_by: createdBy,
    });
    if (error) console.error("addCandidate error:", error);
  },

  voteCandidate: async (id: number) => {
    const { data } = await supabase.from("mayor_election").select("votes").eq("id", id).single();
    const votes = ((data?.votes as number) || 0) + 1;
    const { error } = await supabase.from("mayor_election").update({ votes }).eq("id", id);
    if (error) console.error("voteCandidate error:", error);
  },

  // ---- DOCUMENTS ----
  getDocs: async (): Promise<DocumentItem[]> => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("id", { ascending: true });
    if (error || !data) {
      // Fallback до дефолтних якщо таблиця порожня
      return [
        { id: 1, title: "Конституція міста", content: "Основний закон Чернігів RP." },
        { id: 2, title: "Правила сервера", content: "Загальні правила гри." },
        { id: 3, title: "Кримінальний кодекс", content: "Штрафи та покарання." },
      ];
    }
    return data as DocumentItem[];
  },

  setDocs: async (items: DocumentItem[]) => {
    console.warn("setDocs: використовуй addDoc");
  },

  // ---- CARS ----
  getCars: async (): Promise<CarRecord[]> => {
    const { data, error } = await supabase
      .from("license_applications")
      .select("*")
      .eq("status", "approved")
      .not("plate_number", "is", null);
    if (error || !data) return [];
    return data.map((row) => ({
      plate: row.plate_number as string,
      model: (row.license_type as string) || "Авто",
      owner: row.username as string,
    }));
  },

  setCars: async (items: CarRecord[]) => {
    console.warn("setCars: використовуй submitLicense");
  },

  submitLicense: async (username: string, licenseType: string, plateNumber?: string) => {
    const { error } = await supabase.from("license_applications").insert({
      username,
      license_type: licenseType,
      plate_number: plateNumber || null,
    });
    if (error) console.error("submitLicense error:", error);
  },

  updateLicenseStatus: async (id: number, status: "approved" | "rejected") => {
    const { error } = await supabase.from("license_applications").update({ status }).eq("id", id);
    if (error) console.error("updateLicenseStatus error:", error);
  },

  // ---- SOS ----
  getSos: async (): Promise<SosMessage[]> => {
    const { data, error } = await supabase
      .from("sos_signals")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(toSos);
  },

  setSos: async (items: SosMessage[]) => {
    console.warn("setSos: використовуй addSos");
  },

  addSos: async (username: string, reason: string, description: string, type: "police" | "medic" | "fire" | "general" = "general") => {
    const { error } = await supabase.from("sos_signals").insert({
      username,
      message: description,
      type,
    });
    if (error) console.error("addSos error:", error);
  },

  resolveSos: async (id: number) => {
    const { error } = await supabase.from("sos_signals").update({ status: "resolved" }).eq("id", id);
    if (error) console.error("resolveSos error:", error);
  },

  // ---- NOTIFICATIONS (залишаємо в localStorage — це персональні дані) ----
  getNotifications: (): Notification[] => {
    try {
      const raw = localStorage.getItem("crp_notifications");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  setNotifications: (items: Notification[]) => {
    localStorage.setItem("crp_notifications", JSON.stringify(items));
  },

  addNotification: (text: string) => {
    const items: Notification[] = (() => {
      try { return JSON.parse(localStorage.getItem("crp_notifications") || "[]"); }
      catch { return []; }
    })();
    items.unshift({ id: Date.now(), text, date: new Date().toLocaleDateString("uk-UA"), read: false });
    localStorage.setItem("crp_notifications", JSON.stringify(items));
  },

  // ---- PULSE STATS (реальні дані з Supabase) ----
  getPulse: async (): Promise<{ citizens: number; houses: number; factions: number }> => {
    const [usersRes, housesRes, factionsRes] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("houses").select("id", { count: "exact", head: true }).eq("is_for_sale", false),
      supabase.from("factions").select("id", { count: "exact", head: true }),
    ]);
    return {
      citizens: usersRes.count || 0,
      houses: housesRes.count || 0,
      factions: factionsRes.count || 0,
    };
  },

  setPulse: async (p: { citizens: number; houses: number; factions: number }) => {
    console.warn("setPulse: дані тепер реальні з Supabase");
  },

  // ---- REALTIME SUBSCRIPTIONS ----
  onNewSos: (callback: (msg: SosMessage) => void) => {
    return supabase
      .channel("sos_signals_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "sos_signals" }, (payload) => {
        callback(toSos(payload.new as Record<string, unknown>));
      })
      .subscribe();
  },

  onNewFactionApp: (callback: (app: FactionApplication) => void) => {
    return supabase
      .channel("faction_apps_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "faction_applications" }, (payload) => {
        callback(toFactionApp(payload.new as Record<string, unknown>));
      })
      .subscribe();
  },

  onNewAdminApp: (callback: (app: AdminApplication) => void) => {
    return supabase
      .channel("admin_apps_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_applications" }, (payload) => {
        callback(toAdminApp(payload.new as Record<string, unknown>));
      })
      .subscribe();
  },
};
