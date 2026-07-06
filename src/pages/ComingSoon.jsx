import React from "react";
import { motion } from "framer-motion";
import { Hammer, Calendar, Cpu, ShieldAlert, Sparkles } from "lucide-react";

export const ComingSoon = ({ moduleName, milestone, description, details }) => {
  const icons = {
    "Milestone 2": Calendar,
    "Milestone 3": Cpu,
    "Milestone 4": ShieldAlert
  };

  const Icon = icons[milestone] || Hammer;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full border border-border/80 bg-card p-8 rounded-2xl relative overflow-hidden shadow-2xl"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Milestone badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border/80 text-[10px] font-extrabold text-primary uppercase tracking-widest mb-6 select-none mx-auto">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          {milestone} Planned
        </div>

        {/* Icon container */}
        <div className="h-16 w-16 bg-secondary border border-border/80 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Icon className="h-8 w-8 text-primary" />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          {moduleName}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          {description}
        </p>

        {/* Details card (Real figures from PDF) */}
        {details && (
          <div className="mt-6 p-4 bg-secondary/40 border border-border/60 rounded-xl text-left">
            <h4 className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">Planned Specifications</h4>
            <ul className="space-y-2">
              {details.map((detail, idx) => (
                <li key={idx} className="text-xs text-foreground font-semibold flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 text-muted-foreground/60 text-[11px] font-bold select-none">
          NeuroForge Nexus Cloud-Native Suite
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
