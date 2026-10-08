'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  ShoppingBag,
  Tag,
  Users,
  Factory,
  Boxes,
  Award,
  Globe,
  Image as ImageIcon,
  BarChart3,
  History,
  Settings,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Enquiries / Leads', href: '/admin/enquiries', icon: Inbox },
  { label: 'Quotes', href: '/admin/quotes', icon: FileText },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Tag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Production', href: '/admin/production', icon: Factory },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Website Content', href: '/admin/website-content', icon: Globe },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Audit Log', href: '/admin/audit-log', icon: History },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0D281E] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-[#1B3B2F] shrink-0 select-none font-sans overflow-hidden">
      {/* Brand Header */}
      <div className="p-4 flex items-center gap-3 border-b border-[#1B3B2F]/60 mb-2">
        <div className="w-11 h-11 bg-white/95 p-1.5 rounded-xl shadow-sm border border-white/20 flex items-center justify-center shrink-0">
          <img
            src="/images/esailor-logo.png"
            alt="eSailor Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="font-serif text-lg font-bold text-white leading-tight tracking-tight">
            eSailor
          </h1>
          <p className="text-[10px] text-[#A2BBA8] font-medium tracking-wide">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#254234] text-white font-semibold shadow-xs border border-white/10'
                  : 'text-[#B0C4B5] hover:text-white hover:bg-[#153428]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8EA895]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer with Jute Illustration & Live Website Link */}
      <div className="p-5 pt-3 border-t border-[#1B3B2F] bg-[#0A2118]/60 relative overflow-hidden">
        {/* Subtle Watermark Leaf / Jute Graphic Overlay */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-32 h-32">
          <svg className="w-full h-full fill-emerald-300" viewBox="0 0 100 100">
            <path d="M50 0 C70 30 90 50 100 100 C50 90 30 70 0 50 C30 30 40 10 50 0 Z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-3">
          <div>
            <p className="text-xs font-bold text-white leading-tight">
              Sustainable Packaging.
            </p>
            <p className="text-xs font-bold text-white leading-tight">
              Global Impact.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-[#A2BBA8] hover:text-white font-medium transition-colors"
          >
            <span className="w-4 h-4 rounded-full border border-[#A2BBA8]/40 flex items-center justify-center text-[10px]">
              🌐
            </span>
            <span>Live Website</span>
            <ExternalLink className="w-3 h-3 text-[#A2BBA8]" />
          </Link>

          <p className="text-[10px] text-[#6E8875] pt-1">
            © 2026 eSailor. All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );
}
