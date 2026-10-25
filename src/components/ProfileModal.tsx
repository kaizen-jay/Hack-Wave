import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { User, X, Check, Plus, Trash2 } from 'lucide-react';

interface ProfileModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(student.name);
  const [careerGoal, setCareerGoal] = useState(student.careerGoal);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(student.weeklyTargetHours);
  const [dailyAvailableHours, setDailyAvailableHours] = useState(student.dailyAvailableHours);
  const [targetGraduation, setTargetGraduation] = useState(student.targetGraduationOrInternship);
  const [skills, setSkills] = useState<string[]>(student.currentSkills);
  const [newSkill, setNewSkill] = useState('');
  const [subjects, setSubjects] = useState<string[]>(student.subjects);
  const [newSubject, setNewSubject] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || subjects.includes(newSubject.trim())) return;
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject('');
  };

  const handleRemoveSubject = (subToRemove: string) => {
    setSubjects(subjects.filter((s) => s !== subToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...student,
      name,
      careerGoal,
      weeklyTargetHours,
      dailyAvailableHours,
      targetGraduationOrInternship: targetGraduation,
      currentSkills: skills,
      subjects
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131722] border border-[#2b3144] rounded-3xl max-w-xl w-full p-7 space-y-6 my-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#232838] pb-3">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#f6c492]" />
            <h2 className="text-2xl font-serif text-[#fdf8f5]">
              Student Profile & Focus Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c94a4] hover:text-white text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#c7cbd4] mb-1.5 font-medium">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                required
              />
            </div>

            <div>
              <label className="block text-[#c7cbd4] mb-1.5 font-medium">Target Specialization</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
                required
              />
            </div>

            <div>
              <label className="block text-[#c7cbd4] mb-1.5 font-medium">Weekly Target Hours</label>
              <input
                type="number"
                min="5"
                max="40"
                step="1"
                value={weeklyTargetHours}
                onChange={(e) => setWeeklyTargetHours(parseFloat(e.target.value) || 14)}
                className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1] font-mono"
              />
            </div>

            <div>
              <label className="block text-[#c7cbd4] mb-1.5 font-medium">Daily Available Hours</label>
              <input
                type="number"
                min="1"
                max="8"
                step="0.5"
                value={dailyAvailableHours}
                onChange={(e) => setDailyAvailableHours(parseFloat(e.target.value) || 3)}
                className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#c7cbd4] mb-1.5 font-medium">Target Internship / Timeline</label>
            <input
              type="text"
              value={targetGraduation}
              onChange={(e) => setTargetGraduation(e.target.value)}
              placeholder="e.g. Summer 2027 Tech Internship"
              className="w-full bg-[#0b0e14] border border-[#2b3144] rounded-xl px-3.5 py-2.5 text-[#ede7e1]"
            />
          </div>

          {/* Subjects */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-medium">Current Enrolled Subjects</label>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map((sub, i) => (
                <span
                  key={i}
                  className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300 flex items-center gap-1.5"
                >
                  <span>{sub}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(sub)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add new subject"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Verified Skills */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-medium">Current Skills & Knowledge</label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {skills.map((sk, i) => (
                <span
                  key={i}
                  className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300 flex items-center gap-1.5"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add verified skill (e.g. Pandas, Docker)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232838]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#181d2a] text-[#8c94a4] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#e28766] text-[#0b0e14] font-semibold hover:bg-[#d67655] shadow-md shadow-[#e28766]/20"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
