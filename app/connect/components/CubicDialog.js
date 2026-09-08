'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reusable Base Cubic Dialog / Modal Component
 * Adheres to the Cubic Design Language:
 * - Strict border-radius: 0px (rounded-none)
 * - High-contrast borders: border-2 border-slate-900
 * - Hard cubic drop shadow: box-shadow: 4px 4px 0px 0px #0f172a (or 6px 6px 0px 0px rgba(0,0,0,0.9))
 * - Square title banner with horizontal border-b-2
 * - Sharp rectangular buttons and square w-8 h-8 close icon button
 */
export default function CubicDialog({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
  className = '' 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          {/* Backdrop with solid tint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Cubic Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] rounded-none z-10 flex flex-col max-h-[90vh] overflow-hidden text-left ${className}`}
          >
            {/* Cubic Header Banner */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-900 bg-slate-50 shrink-0">
              <div className="flex flex-col min-w-0 pr-2">
                <h3 className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-slate-900 truncate">
                  {title}
                </h3>
                {subtitle && (
                  <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-tight truncate mt-0.5">
                    {subtitle}
                  </span>
                )}
              </div>

              {/* Square Close Button */}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-none border-2 border-slate-900 bg-white hover:bg-slate-900 hover:text-white text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                title="Close dialog"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Dialog Body Content - Snug fit according to text */}
            <div className="p-4 sm:p-4.5 overflow-y-auto flex-1 story-tray-scrollbar">
              {children}
            </div>

            {/* Cubic Footer Actions if provided */}
            {footer && (
              <div className="px-4 py-2.5 border-t-2 border-slate-900 bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
