import React, { useState, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, 
  isSameDay, isWithinInterval, parseISO 
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Moon, Sun, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { eventsData, SchedulerEvent } from './data/events'; // 先ほど作成したデータ

// 曜日ヘッダー
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<SchedulerEvent | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // カレンダーの日付生成ロジック
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // 今月のピックアップイベント抽出
  const pickupEvents = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eventsData.filter(event => 
      event.isPickup && 
      (isWithinInterval(parseISO(event.start), { start, end }) || 
       isWithinInterval(parseISO(event.end), { start, end }))
    ).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [currentDate]);

  // ダークモード切り替え
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // イベント選択ハンドラ
  const handleEventClick = (e: React.MouseEvent, event: SchedulerEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-500 text-white p-1 rounded font-bold text-xl w-8 h-8 flex items-center justify-center">S</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Schale</h1>
              <p className="text-xs text-cyan-500 font-semibold tracking-widest">SCHEDULE MANAGER</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-md transition"><ChevronLeft size={18} /></button>
              <span className="px-4 font-bold text-lg min-w-[140px] text-center">
                {format(currentDate, 'yyyy.MM', { locale: ja })}
              </span>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-md transition"><ChevronRight size={18} /></button>
            </div>
            
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 border-2 border-cyan-500 text-cyan-500 font-bold rounded-lg hover:bg-cyan-50 dark:hover:bg-slate-800 transition">
              TODAY
            </button>

            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Calendar */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Filters (Mock) */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex gap-2 overflow-x-auto">
            <button className="px-3 py-1 bg-slate-800 text-white text-sm rounded hover:opacity-80">ALL</button>
            <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-sm rounded hover:bg-slate-50 dark:hover:bg-slate-700">ゲーム内イベント</button>
            <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 text-sm rounded hover:bg-slate-50 dark:hover:bg-slate-700">リアルイベント</button>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {WEEKDAYS.map((day, i) => (
              <div key={day} className={`py-2 text-center text-xs font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 dark:bg-slate-700 gap-[1px]">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              
              // この日に表示すべきイベントをフィルタリング
              const daysEvents = eventsData.filter(event => {
                const start = parseISO(event.start);
                const end = parseISO(event.end);
                
                // displayModeによって表示判定を変える (簡易実装)
                if (event.displayMode === 'start_only') {
                  return isSameDay(day, start);
                }
                return isWithinInterval(day, { start, end });
              });

              return (
                <div 
                  key={idx} 
                  className={`min-h-[120px] bg-white dark:bg-slate-800 p-1 flex flex-col gap-1 transition-colors
                    ${!isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-800/50 text-slate-400' : ''}
                  `}
                  onClick={() => setSelectedEvent(null)}
                >
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-cyan-500 text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>

                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] no-scrollbar">
                    {daysEvents.map(event => (
                      <button
                        key={`${event.id}-${idx}`}
                        onClick={(e) => handleEventClick(e, event)}
                        className={`text-xs text-left px-2 py-1 rounded truncate text-white shadow-sm hover:opacity-80 transition-opacity ${event.color} ${selectedEvent?.id === event.id ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                      >
                        {event.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* Selected Event Details */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-700 min-h-[300px] flex flex-col">
            {selectedEvent ? (
              <div className="flex flex-col h-full animate-fadeIn">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                  <div className={`inline-block px-2 py-0.5 rounded text-[10px] text-white font-bold mb-2 ${selectedEvent.color}`}>
                    {selectedEvent.category.toUpperCase()}
                  </div>
                  <h2 className="font-bold text-lg leading-snug mb-1">{selectedEvent.title}</h2>
                  <p className="text-xs text-slate-500 font-mono">
                    {format(parseISO(selectedEvent.start), 'yyyy/MM/dd HH:mm')} - {format(parseISO(selectedEvent.end), 'MM/dd HH:mm')}
                  </p>
                </div>
                
                <div className="p-4 flex-1 flex flex-col gap-4">
                   {/* 画像がある場合は表示 */}
                   {selectedEvent.imageUrl ? (
                     <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                       <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-auto object-cover" />
                     </div>
                   ) : (
                     <div className="h-32 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                       <CalendarIcon size={32} />
                     </div>
                   )}
                   
                   <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                     {selectedEvent.description}
                   </p>

                   {selectedEvent.url && (
                     <a 
                       href={selectedEvent.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:opacity-90 transition"
                     >
                       {selectedEvent.urlText || "詳細を見る"} <ExternalLink size={14} />
                     </a>
                   )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
                  <CalendarIcon size={32} />
                </div>
                <p className="font-bold">イベントを選択してください</p>
                <p className="text-sm mt-2">カレンダーの日付をクリックすると詳細が表示されます</p>
              </div>
            )}
          </div>

          {/* Pickup List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex-1">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-yellow-500">★</span>
              <h3 className="font-bold text-sm">今月のピックアップ</h3>
            </div>

            <div className="flex flex-col gap-3">
              {pickupEvents.length > 0 ? pickupEvents.map(event => (
                <div 
                  key={event.id} 
                  onClick={() => setSelectedEvent(event)}
                  className="group cursor-pointer border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:shadow-md hover:border-cyan-300 transition bg-slate-50 dark:bg-slate-700/30"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded text-white font-bold ${event.color}`}>
                      {event.category === 'game_event' ? 'ゲーム内' : 'イベント'}
                    </span>
                    <span className="text-[10px] border border-yellow-500 text-yellow-600 dark:text-yellow-400 px-1 rounded font-bold bg-yellow-50 dark:bg-transparent">
                      PICK UP
                    </span>
                  </div>
                  <h4 className="font-bold text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono text-right">
                    {format(parseISO(event.start), 'MM/dd')} - {format(parseISO(event.end), 'MM/dd')}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-4">今月のピックアップはありません</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;