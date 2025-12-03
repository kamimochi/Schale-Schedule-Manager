export type EventCategory = 'game_event' | 'real_event' | 'goods' | 'maintenance' | 'other';
export type DisplayMode = 'range' | 'start_only' | 'end_only' | 'dot';

export interface SchedulerEvent {
  id: number;
  title: string;
  start: string; // ISO 8601 format
  end: string;
  category: EventCategory;
  description: string;
  url?: string;
  urlText?: string;
  imageUrl?: string; // GitHub上のパス (/images/banner.png 等)
  isPickup: boolean;
  color: string; // Tailwind color class (e.g., 'bg-blue-500')
  displayMode?: DisplayMode; // 表示オプション
}

export const eventsData: SchedulerEvent[] = [
  {
    id: 1,
    title: "総力戦：クロカゲ（市街地戦）",
    start: "2025-11-26T11:00:00",
    end: "2025-12-03T03:59:59",
    category: "game_event",
    description: "総力戦「クロカゲ」開催！\n地形は市街地、防御タイプ弾力装甲・攻撃タイプ神秘です。",
    url: "#",
    isPickup: true,
    color: "bg-cyan-500",
    displayMode: "range"
  },
  {
    id: 2,
    title: "ブルアカふぇす！～ごー!ごー!!先生♪～",
    start: "2025-01-17T09:00:00",
    end: "2025-01-18T18:00:00",
    category: "real_event",
    description: "ブルーアーカイブの5周年を記念したリアルイベントです！\n詳しくは公式サイトをチェック！",
    url: "https://5th-anniversary.bluearchive.jp",
    urlText: "公式サイト",
    imageUrl: "/images/live_banner.jpg", // publicフォルダに画像を置く想定
    isPickup: true,
    color: "bg-pink-500",
    displayMode: "start_only" // カレンダー上では開始日のみ表示する等の制御用
  },
  // 以下メンテナンス(番号大きめ)
  {
    id: 1000,
    title: "メンテナンス",
    start: "2025-12-03T11:00:00",
    end: "2025-12-03T17:00:00",
    category: "maintenance",
    description: "定期メンテナンス\n前後する可能性があります",
    isPickup: false,
    color: "bg-gray-500",
    displayMode: "range"
  }
];
