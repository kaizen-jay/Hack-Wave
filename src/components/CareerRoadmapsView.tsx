import React, { useState } from 'react';
import { CareerRoadmap, StudentProfile, SkillStatus } from '../types';
import { CAREER_ROADMAPS } from '../data/mockData';
import {
  Compass,
  CheckCircle2,
  Circle,
  FolderGit2,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface CareerRoadmapsViewProps {
  student: StudentProfile;
  onUpdateSkillStatus?: (skillId: string, status: SkillStatus) => void;
}

export const CareerRoadmapsView: React.FC<CareerRoadmapsViewProps> = ({
  student,
  onUpdateSkillStatus
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-ml-engineer');
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>(CAREER_ROADMAPS);
  const [expandedStageId, setExpandedStageId] = useState<string>('stg-1');

  const activeRoadmap = roadmaps.find((r) => r.careerId === selectedCareerId) || roadmaps[0];

  let totalSkills = 0;
  let completedSkills = 0;

  activeRoadmap.stages.forEach((stage) => {
    stage.skills.forEach((skill) => {
      totalSkills++;
      if (skill.status === 'completed' || student.currentSkills.includes(skill.name)) {
        completedSkills++;
      }
    });
  });

  const completionPercentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  const handleToggleSkill = (stageId: string, skillId: string) => {
    setRoadmaps((prev) =>
      prev.map((rm) => {
        if (rm.careerId !== selectedCareerId) return rm;
        return {
          ...rm,
          stages: rm.stages.map((stg) => {
            if (stg.id !== stageId) return stg;
            return {
              ...stg,
              skills: stg.skills.map((sk) => {
                if (sk.id !== skillId) return sk;
                const nextStatus: SkillStatus =
                  sk.status === 'completed'
                    ? 'not_started'
                    : sk.status === 'in_progress'
                    ? 'completed'
                    : 'in_progress';
                if (onUpdateSkillStatus) onUpdateSkillStatus(skillId, nextStatus);
                return { ...sk, status: nextStatus };
              })
            };
          })
        };
      })
    );
  };

  let nextRecommendedSkill: any = null;
  for (const stg of activeRoadmap.stages) {
    const uncompleted = stg.skills.find(
      (s) => s.status !== 'completed' && !student.currentSkills.includes(s.name)
    );
    if (uncompleted) {
      nextRecommendedSkill = { ...uncompleted, stageName: stg.stageName };
      break;
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Window Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232838] pb-6">
        <div>
          <div className="text-xs font-sans tracking-widest text-[#f6c492] uppercase mb-1">
            Career Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#fdf8f5]">
            Technical Skill Roadmaps
          </h1>
          <p className="text-xs text-[#8c94a4] font-light max-w-xl mt-1 leading-relaxed">
            Connect academic coursework directly to industry competency milestones. Follow a structured progression with verified portfolio capstones.
          </p>
        </div>

        {/* Specialization Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131722] border border-[#232838] rounded-xl text-xs overflow-x-auto">
          {roadmaps.map((rm) => (
            <button
              key={rm.careerId}
              onClick={() => setSelectedCareerId(rm.careerId)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCareerId === rm.careerId
                  ? 'bg-[#e28766] text-[#0b0e14] font-semibold'
                  : 'text-[#8c94a4] hover:text-[#ede7e1]'
              }`}
            >
              {rm.title.split(' ')[0]} {rm.title.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Window with Reference Mountain Graphic */}
      <div className="relative rounded-3xl overflow-hidden border border-[#2b3144] bg-[#0b0e14] shadow-2xl">
        <div className="h-48 sm:h-56 w-full overflow-hidden relative">
          <img
            src="/public/assets/aistudio/image_beca4a12.png"
            alt="Alpine Road"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-mono text-[#f6c492] uppercase tracking-wider">
              Curriculum Path
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#fdf8f5]">
              {activeRoadmap.title}
            </h2>
            <p className="text-xs text-[#c7cbd4] font-light leading-relaxed">
              {activeRoadmap.description}
            </p>
          </div>

          <div className="bg-[#131722]/90 backdrop-blur-md border border-[#2b3144] rounded-2xl p-4 shrink-0 min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-[#8c94a4] mb-1.5">
              <span>Path Progress</span>
              <span className="font-mono text-[#fdf8f5] tabular-nums">
                {completedSkills}/{totalSkills} skills
              </span>
            </div>
            <div className="w-full bg-[#1b2030] h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className="bg-[#e28766] h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-[#f6c492] font-mono tabular-nums text-right font-medium">
              {completionPercentage}% complete
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Callout */}
      {nextRecommendedSkill && (
        <div className="bg-[#131722]/90 border border-[#2b3144] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#c86d51]/15 text-[#e28766] flex items-center justify-center shrink-0 border border-[#c86d51]/25">
              <Award className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#f6c492]">
                Next Technical Step
              </span>
              <h3 className="text-base font-serif text-[#fdf8f5]">
                {nextRecommendedSkill.name}
              </h3>
              <p className="text-xs text-[#8c94a4] font-light">
                {nextRecommendedSkill.description} · Estimated: <span className="font-mono text-[#ede7e1]">{nextRecommendedSkill.estimatedHours} hrs</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggleSkill(activeRoadmap.stages[0].id, nextRecommendedSkill.id)}
            className="px-4 py-2 rounded-xl bg-[#181d2a] hover:bg-[#e28766] hover:text-[#0b0e14] text-[#ede7e1] text-xs font-medium border border-[#2b3144] hover:border-[#e28766] transition-all whitespace-nowrap shrink-0"
          >
            Mark in Progress
          </button>
        </div>
      )}

      {/* Stages Accordion */}
      <div className="space-y-4">
        {activeRoadmap.stages.map((stage) => {
          const isExpanded = expandedStageId === stage.id;
          const stageTotal = stage.skills.length;
          const stageCompleted = stage.skills.filter(
            (s) => s.status === 'completed' || student.currentSkills.includes(s.name)
          ).length;

          return (
            <div
              key={stage.id}
              className="bg-[#131722]/90 border border-[#232838] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedStageId(isExpanded ? '' : stage.id)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-[#181d2a]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#0b0e14] border border-[#2b3144] flex items-center justify-center font-mono text-xs font-semibold text-[#f6c492] shrink-0">
                    0{stage.stageNumber}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#fdf8f5]">
                      {stage.stageName}
                    </h3>
                    <p className="text-xs text-[#8c94a4] font-light mt-0.5">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono text-[#8c94a4] tabular-nums">
                    {stageCompleted} / {stageTotal}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#8c94a4]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8c94a4]" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-6 pt-0 border-t border-[#1e2333] space-y-6">
                  {/* Skills Grid */}
                  <div className="space-y-3 pt-5">
                    <span className="text-xs font-sans tracking-widest text-[#8c94a4] uppercase text-[10px]">
                      Required Competencies
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {stage.skills.map((skill) => {
                        const isDone = skill.status === 'completed' || student.currentSkills.includes(skill.name);
                        const isInProg = skill.status === 'in_progress';

                        return (
                          <div
                            key={skill.id}
                            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                              isDone
                                ? 'bg-[#121c17] border-[#294e3e] text-[#a7f3d0]'
                                : isInProg
                                ? 'bg-[#1b1e2e] border-[#384157] text-[#fdf8f5]'
                                : 'bg-[#0b0e14]/60 border-[#232838] text-[#8c94a4]'
                            }`}
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <h4 className={`text-base font-serif ${isDone ? 'text-white' : 'text-[#ede7e1]'}`}>
                                {skill.name}
                              </h4>
                              <p className="text-xs text-[#8c94a4] font-light leading-relaxed">
                                {skill.description}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-[#697285] font-mono pt-1">
                                <span>{skill.category}</span>
                                <span>·</span>
                                <span>~{skill.estimatedHours} hrs</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleSkill(stage.id, skill.id)}
                              className={`p-1.5 rounded-lg border text-xs shrink-0 transition-colors ${
                                isDone
                                  ? 'bg-[#388e6a] text-white border-[#388e6a]'
                                  : isInProg
                                  ? 'bg-[#e28766]/20 text-[#f6c492] border-[#e28766]/40'
                                  : 'bg-[#181d2a] text-[#8c94a4] border-[#2b3144] hover:text-white'
                              }`}
                              title="Click to cycle status"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Portfolio Projects */}
                  {stage.projects && stage.projects.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-[#1e2333]">
                      <span className="text-[10px] font-sans tracking-widest text-[#8c94a4] uppercase flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#f6c492]" />
                        <span>Recommended Portfolio Capstone</span>
                      </span>

                      {stage.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl bg-[#0b0e14] border border-[#232838] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-serif text-[#fdf8f5]">
                              {proj.title}
                            </h4>
                            <span className="text-[10px] font-mono text-[#f6c492] px-2 py-0.5 rounded bg-[#181d2a] border border-[#2b3144]">
                              {proj.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-[#8c94a4] font-light leading-relaxed">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-[#8c94a4] font-mono">
                            <span className="text-[#697285]">Demonstrates:</span>
                            {proj.skillsDemonstrated.map((s, i) => (
                              <span key={i} className="bg-[#181d2a] px-2 py-0.5 rounded border border-[#232838] text-[#c7cbd4]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
