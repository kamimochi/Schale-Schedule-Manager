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
    title: "総力戦：ビナー（屋外戦）",
    start: "2025-05-01T11:00:00",
    end: "2025-05-07T03:59:59",
    category: "game_event",
    description: "総力戦「ビナー」開催！地形は屋外戦です。",
    url: "#",
    isPickup: true,
    color: "bg-cyan-500",
    displayMode: "range"
  },
  {
    id: 2,
    title: "大決戦：カイテンジャー",
    start: "2025-05-15T11:00:00",
    end: "2025-05-21T03:59:59",
    category: "game_event",
    description: "大決戦開催。防御タイプに注意して編成を組みましょう。",
    isPickup: true,
    color: "bg-blue-600"
  },
  {
    id: 3,
    title: "夏のブルアカらいぶ！SP",
    start: "2025-07-19T18:00:00",
    end: "2025-07-19T22:00:00",
    category: "real_event",
    description: "ブルーアーカイブ4.5周年を記念し、同時に公開生放送も行われます！\n詳しくは公式サイトをチェック！",
    url: "https://example.com",
    urlText: "公式サイト",
    imageUrl: "/images/live_banner.jpg", // publicフォルダに画像を置く想定
    isPickup: true,
    color: "bg-pink-500",
    displayMode: "start_only" // カレンダー上では開始日のみ表示する等の制御用
  },
  // 長期メンテナンスの例
  {
    id: 4,
    title: "メンテナンス",
    start: "2025-05-28T11:00:00",
    end: "2025-05-28T19:00:00",
    category: "maintenance",
    description: "定期メンテナンス",
    isPickup: false,
    color: "bg-gray-500",
    displayMode: "range"
  }
];