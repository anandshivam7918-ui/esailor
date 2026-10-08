'use client';

import React, { useState } from 'react';
import { Search, Bell, Calendar, ChevronDown, LogOut, User, ShieldCheck } from 'lucide-react';

interface AdminTopHeaderProps {
  user?: { username: string; role: string } | null;
  onLogout?: () => void;
}

export function AdminTopHeader({ user, onLogout }: AdminTopHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New enquiry from GreenMart Ltd.', time: '2 hours ago', unread: true },
    { id: 2, title: 'Order #ORD-1042 moved to Production', time: '4 hours ago', unread: true },
    { id: 3, title: 'Quote #Q-2087 was approved', time: '5 hours ago', unread: false },
    { id: 4, title: 'Stock alert: Raw Jute Fibre (Low stock)', time: '8 hours ago', unread: true },
  ];

  return (
    <header className="h-16 bg-[#F6F3EC] border-b border-[#E6E0D3] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar matching screenshot */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything... (e.g. order #, customer, product)"
            className="w-full bg-[#EFECE4] text-[#0D281E] placeholder-[#8C8275] text-xs rounded-xl pl-10 pr-4 py-2 border border-[#E0DACF] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Date Filter Quick Button */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E0DACF] bg-[#EFECE4] text-[#0D281E] text-xs font-semibold hover:bg-[#E8E4D8] transition-colors cursor-pointer">
          <Calendar className="w-3.5 h-3.5 text-[#1B4D3E]" />
          <span>Apr 28, 2026 – May 4, 2026</span>
          <ChevronDown className="w-3 h-3 text-[#8C8275]" />
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl border border-[#E0DACF] bg-[#EFECE4] hover:bg-[#E8E4D8] flex items-center justify-center text-[#0D281E] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#0D281E]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-[#F6F3EC] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FAF8F3] rounded-2xl shadow-xl border border-[#E6E0D3] py-2 z-50 text-xs animate-in fade-in duration-150">
              <div className="px-4 py-2 border-b border-[#E6E0D3] flex items-center justify-between">
                <span className="font-bold text-[#0D281E]">Notifications</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  3 unread
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#E6E0D3]">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 hover:bg-[#F2EEE4] transition-colors ${n.unread ? 'bg-emerald-50/50' : ''}`}>
                    <p className="font-semibold text-[#0D281E] text-[11px]">{n.title}</p>
                    <p className="text-[10px] text-[#8C8275] mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-[#E0DACF] bg-[#EFECE4] hover:bg-[#E8E4D8] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#0D281E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              RK
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#0D281E] leading-tight">
                {user?.username || 'Ram Kumar'}
              </p>
              <p className="text-[10px] text-[#6E8875] leading-tight capitalize">
                {user?.role || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C8275]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FAF8F3] rounded-2xl shadow-xl border border-[#E6E0D3] py-1.5 z-50 text-xs animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-[#E6E0D3]">
                <p className="font-bold text-[#0D281E]">{user?.username || 'Ram Kumar'}</p>
                <p className="text-[10px] text-[#8C8275]">ramkumar@esailor.com</p>
              </div>
              <a href="/admin/settings" className="flex items-center gap-2 px-3 py-2 text-[#0D281E] hover:bg-[#F2EEE4] transition-colors font-medium">
                <User className="w-3.5 h-3.5 text-[#6E8875]" />
                Profile Settings
              </a>
              <a href="/admin/certifications" className="flex items-center gap-2 px-3 py-2 text-[#0D281E] hover:bg-[#F2EEE4] transition-colors font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6E8875]" />
                Certifications
              </a>
              <div className="border-t border-[#E6E0D3] my-1"></div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left font-bold"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
