// Shared localStorage-based state management for the app

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
  photos: string[]; // base64 or emoji
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

// Default data
const defaultNews: NewsItem[] = [
  { id: 1, title: "Відкриття нового казино", text: "У місті відкрилось нове казино з ексклюзивними іграми.", date: "12.03.2026" },
  { id: 2, title: "Набір у фракцію НПУ", text: "НПУ оголошує набір нових співробітників. Подавайте анкети!", date: "11.03.2026" },
  { id: 3, title: "Оновлення правил сервера", text: "Переглянуто правила RP та додано нові обмеження.", date: "10.03.2026" },
];

const defaultHouses: HouseItem[] = [
  { id: 1, name: "Concrete Space", price: 150000, desc: "Мінімалістична квартира в центрі", category: "Люкс", owner: null, photos: ["🏢", "🛋️", "🪟"] },
  { id: 2, name: "Green Villa", price: 250000, desc: "Приватний будинок з гаражем та садом", category: "Люкс", owner: null, photos: ["🏡", "🌳", "🚗"] },
  { id: 3, name: "Sky Penthouse", price: 500000, desc: "Розкішний вид на місто з тераси", category: "Люкс", owner: "Player_01", photos: ["🏙️", "🌃", "🛁"] },
  { id: 4, name: "Country House", price: 100000, desc: "Тихе місце за містом", category: "Економ", owner: null, photos: ["🏕️", "🌾", "🐕"] },
  { id: 5, name: "Studio Flat", price: 80000, desc: "Компактна студія на П'ятницькій", category: "Економ", owner: null, photos: ["🏠", "📺", "🛏️"] },
];

const defaultWanted: WantedPerson[] = [
  { id: 1, name: "Shadow_X", reason: "Пограбування банку", stars: 5 },
  { id: 2, name: "Dark_Knight", reason: "Викрадення транспорту", stars: 3 },
  { id: 3, name: "Ghost_99", reason: "Напад на поліцію", stars: 4 },
];

const defaultCityVoice: CityVoiceItem[] = [
  { id: 1, author: "Player_01", text: "Додати систему таксі в місті", type: "idea", likes: 15, dislikes: 2, status: "active" },
  { id: 2, author: "Player_02", text: "Побудувати нову лікарню", type: "petition", likes: 8, dislikes: 1, status: "approved" },
];

const defaultCandidates: MayorCandidate[] = [
  { id: 1, name: "Кандидат 1", program: "Розвиток інфраструктури та дорожньої мережі", votes: 12, bio: "Досвід управління 3 роки." },
  { id: 2, name: "Кандидат 2", program: "Безпека та порядок", votes: 8, bio: "Лідер громадської організації." },
];

const defaultDocs: DocumentItem[] = [
  { id: 1, title: "Конституція міста", content: "Основний закон Чернігів RP — правила та норми поведінки на сервері." },
  { id: 2, title: "Правила сервера", content: "Загальні правила гри та взаємодії між гравцями." },
  { id: 3, title: "Кримінальний кодекс", content: "Штрафи та покарання за порушення правил." },
];

const defaultCars: CarRecord[] = [
  { plate: "AA 1234 BB", model: "BMW M5", owner: "Player_01" },
  { plate: "CC 5678 DD", model: "Audi RS6", owner: "Player_02" },
];

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// CRUD helpers
export const store = {
  // News
  getNews: (): NewsItem[] => getStorage("crp_news", defaultNews),
  setNews: (items: NewsItem[]) => setStorage("crp_news", items),

  // Houses
  getHouses: (): HouseItem[] => getStorage("crp_houses", defaultHouses),
  setHouses: (items: HouseItem[]) => setStorage("crp_houses", items),

  // Wanted
  getWanted: (): WantedPerson[] => getStorage("crp_wanted", defaultWanted),
  setWanted: (items: WantedPerson[]) => setStorage("crp_wanted", items),

  // Faction applications
  getFactionApps: (): FactionApplication[] => getStorage("crp_faction_apps", []),
  setFactionApps: (items: FactionApplication[]) => setStorage("crp_faction_apps", items),

  // Admin applications
  getAdminApps: (): AdminApplication[] => getStorage("crp_admin_apps", []),
  setAdminApps: (items: AdminApplication[]) => setStorage("crp_admin_apps", items),

  // City voice
  getCityVoice: (): CityVoiceItem[] => getStorage("crp_city_voice", defaultCityVoice),
  setCityVoice: (items: CityVoiceItem[]) => setStorage("crp_city_voice", items),

  // Mayor candidates
  getCandidates: (): MayorCandidate[] => getStorage("crp_candidates", defaultCandidates),
  setCandidates: (items: MayorCandidate[]) => setStorage("crp_candidates", items),

  // Documents
  getDocs: (): DocumentItem[] => getStorage("crp_docs", defaultDocs),
  setDocs: (items: DocumentItem[]) => setStorage("crp_docs", items),

  // Cars
  getCars: (): CarRecord[] => getStorage("crp_cars", defaultCars),
  setCars: (items: CarRecord[]) => setStorage("crp_cars", items),

  // SOS messages
  getSos: (): SosMessage[] => getStorage("crp_sos", []),
  setSos: (items: SosMessage[]) => setStorage("crp_sos", items),

  // Notifications (passport)
  getNotifications: (): Notification[] => getStorage("crp_notifications", []),
  setNotifications: (items: Notification[]) => setStorage("crp_notifications", items),
  addNotification: (text: string) => {
    const items = getStorage<Notification[]>("crp_notifications", []);
    items.unshift({ id: Date.now(), text, date: new Date().toLocaleDateString("uk-UA"), read: false });
    setStorage("crp_notifications", items);
  },

  // Pulse counters
  getPulse: () => getStorage("crp_pulse", { citizens: 20, houses: 0, factions: 7 }),
  setPulse: (p: { citizens: number; houses: number; factions: number }) => setStorage("crp_pulse", p),
};
