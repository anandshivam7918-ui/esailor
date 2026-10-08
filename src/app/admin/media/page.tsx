'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Image as ImageIcon, Search, FolderPlus, Upload, Folder, Eye } from 'lucide-react';

interface MediaAsset {
  id: string;
  title: string;
  category: string;
  size: string;
  url: string;
}

const initialAssets: MediaAsset[] = [
  {
    id: '1',
    title: 'Jute Shopping Bag Pack',
    category: 'Product Photos',
    size: '1.2 MB',
    url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Eco Tote Bag Lineup',
    category: 'Product Photos',
    size: '2.4 MB',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Factory Weaving Floor',
    category: 'Factory Scenes',
    size: '3.1 MB',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Raw Jute Fibres Bale',
    category: 'Raw Material',
    size: '1.8 MB',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Burlap Sack Stacks',
    category: 'Warehouse',
    size: '2.0 MB',
    url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Custom Wine Bottle Bag',
    category: 'Product Photos',
    size: '1.5 MB',
    url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=400&auto=format&fit=crop',
  },
];

export default function MediaLibraryPage() {
  const [assets] = useState<MediaAsset[]>(initialAssets);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = assets.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Media Library"
        subtitle="Manage product images, factory photos and videos."
        badge="Asset Storage"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all">
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('images')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'images'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'videos'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none">
            <option value="all">All Folders</option>
            <option value="product">Product Photos</option>
            <option value="factory">Factory Scenes</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{item.category}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
