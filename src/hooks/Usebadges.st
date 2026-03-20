import { useEffect, useState } from "react";
import { supabase } from "../lib/store";

export interface Badges {
  notifications: number;  // непрочитані нотифікації
  news: boolean;          // є нові новини з моменту останнього перегляду
  reward: boolean;        // можна забрати щоденну нагороду
}

const EMPTY: Badges = { notifications: 0, news: false, reward: false };

export const useBadges = () => {
  const [badges, setBadges] = useState<Badges>(EMPTY);
  const nick = localStorage.getItem("crp_nick") || "";

  useEffect(() => {
    if (!nick) return;

    const load = async () => {
      const next: Badges = { notifications: 0, news: false, reward: false };

      // 1. Непрочитані нотифікації
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .ilike("username", nick)
        .eq("read", false);
      next.notifications = count || 0;

      // 2. Нові новини — порівнюємо created_at останньої новини з моментом останнього перегляду
      const lastSeen = parseInt(localStorage.getItem("crp_news_seen") || "0");
      const { data: latestNews } = await supabase
        .from("news")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (latestNews?.created_at) {
        const newsTime = new Date(latestNews.created_at).getTime();
        next.news = newsTime > lastSeen;
      }

      // 3. Щоденна нагорода
      const lastReward = parseInt(localStorage.getItem("crp_last_reward") || "0");
      next.reward = Date.now() - lastReward > 24 * 60 * 60 * 1000;

      setBadges(next);
    };

    load();
    // Оновлюємо кожні 30 секунд
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [nick]);

  // Позначити новини як переглянуті
  const markNewsRead = () => {
    localStorage.setItem("crp_news_seen", String(Date.now()));
    setBadges(prev => ({ ...prev, news: false }));
  };

  return { badges, markNewsRead };
};
