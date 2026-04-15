"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4"
        >
          <div className="glass-card p-4 text-center shadow-2xl border-accent-primary/30 bg-background/80">
            <p className="text-sm font-medium text-gray-200">{message}</p>
            <button 
              onClick={onClose}
              className="mt-2 text-xs text-accent-primary hover:underline"
            >
              Schließen
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
