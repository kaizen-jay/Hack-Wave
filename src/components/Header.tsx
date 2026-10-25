import React from 'react';
import { StudentProfile } from '../types';
import { Sparkles, User, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  student: StudentProfile;
  students: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onOpenProfile: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  student,
  students,
  onSelectStudent,
  onOpenProfile,
  onResetData
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'planner', label: 'Study Planner' },
    { id: 'revision', label: 'Spaced Repetition' },
    { id: 'diagnostics', label: 'Diagnostics & Quiz' },
    { id: 'roadmaps', label: 'Skill Roadmaps' },
    { id: 'python-code', label: 'Python Engine' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e14]/90 backdrop-blur-md border-b border-[#232838]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Wordmark with Instrument Serif */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('dashboard')}
            className="text-left group cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#c86d51] to-[#f4a261] flex items-center justify-center text-white shadow-sm shadow-[#e28766]/20">
              <span className="font-serif text-xl italic font-normal leading-none">C</span>
            </div>
            <div>
              <span className="text-2xl font-serif tracking-wide text-[#fdf8f5] group-hover:text-[#f4a261] transition-colors whitespace-nowrap shrink-0">
                CognitivePath
              </span>
              <span className="hidden sm:inline-block ml-3 text-[11px] font-sans tracking-widest text-[#a89f91] uppercase">
                Alpine Study System
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Windows */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-[#f4a261] font-semibold border-b-2 border-[#e28766]'
                    : 'text-[#9fa6b2] hover:text-[#fdf8f5]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Profile Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b2030] border border-[#232838] text-xs text-[#ede7e1] transition-colors whitespace-nowrap shrink-0"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-[#e28766]/40">
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-xs text-[#ede7e1] max-w-[110px] truncate">{student.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#131722] border border-[#2b3144] rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3.5 py-1.5 text-[#8c94a4] uppercase tracking-wider font-semibold text-[10px] border-b border-[#232838]">
                  Student Profile Switcher
                </div>
                {students.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectStudent(s);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-[#1a1f2e] transition-colors ${
                      s.id === student.id ? 'text-[#f4a261] bg-[#1a1f2e]/60 font-medium' : 'text-[#c7cbd4]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-[10px] text-[#8c94a4] truncate max-w-[170px]">{s.careerGoal}</div>
                    </div>
                    {s.id === student.id && <span className="text-[10px] text-[#e28766] font-bold">Active</span>}
                  </button>
                ))}
                <div className="border-t border-[#232838] mt-1 pt-1">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-[#c7cbd4] hover:bg-[#1a1f2e] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#8c94a4]" />
                    <span>Edit Profile & Study Hours</span>
                  </button>
                  <button
                    onClick={() => {
                      onResetData();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-[#e28766] hover:bg-[#1a1f2e] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset to Baseline Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center gap-5 px-6 py-2 overflow-x-auto border-t border-[#1a1f2e] text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              currentTab === item.id ? 'text-[#f4a261] font-semibold' : 'text-[#8c94a4]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
