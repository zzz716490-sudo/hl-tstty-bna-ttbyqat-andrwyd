import React from 'react';
import { LayoutDashboard, GitFork, Users, Car, Bell, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMoreMenu,
}) => {
  const { alerts, criticalAlertsCount } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'branches', label: 'الفروع', icon: GitFork },
    { id: 'employees', label: 'الموظفون', icon: Users },
    { id: 'fleet', label: 'الأسطول', icon: Car },
    {
      id: 'alerts',
      label: 'التنبيهات',
      icon: Bell,
      badge: alerts.length > 0 ? alerts.length : null,
      badgeCritical: criticalAlertsCount > 0,
    },
    { id: 'more', label: 'المزيد', icon: MoreHorizontal, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1 md:py-2">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  onOpenMoreMenu();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-brand-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-2 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full min-w-[16px] text-center ${
                      item.badgeCritical ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
