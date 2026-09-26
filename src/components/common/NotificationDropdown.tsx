import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, AlertTriangle, Vote, Receipt, Info, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toBengaliNumber } from '../../utils/bengali';

export const NotificationDropdown: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Filter notifications relevant to current user: targeted to 'all' or specifically to this member's ID
  const userNotifications = notifications.filter(
    (n) => n.target_member_id === 'all' || (currentUser && n.target_member_id === currentUser.id)
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'due_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'proposal_poll':
        return <Vote className="w-4 h-4 text-blue-400" />;
      case 'deposit_status':
        return <Receipt className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (id: string, linkTab?: string) => {
    markNotificationAsRead(id);
    if (linkTab) {
      setCurrentTab(linkTab);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer"
        aria-label="বিজ্ঞপ্তি"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse font-inter">
            {unreadCount > 9 ? '৯+' : toBengaliNumber(unreadCount)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">বিজ্ঞপ্তি ও নোটিশ</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  {toBengaliNumber(unreadCount)}টি নতুন
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>সব পঠিত চিহ্নিত করুন</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {userNotifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                কোনো নতুন বিজ্ঞপ্তি নেই।
              </div>
            ) : (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.link_tab)}
                  className={`p-3.5 hover:bg-slate-800/60 transition cursor-pointer flex items-start gap-3 ${
                    !n.read ? 'bg-slate-800/30' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          !n.read ? 'text-amber-400' : 'text-slate-200'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0 font-inter">
                        {n.created_at}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  {n.link_tab && (
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
