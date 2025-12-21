"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Box } from "lucide-react";

interface BlockToastProps {
  show: boolean;
  blockHash: string;
  onClose: () => void;
}

export default function BlockToast({ show, blockHash, onClose }: BlockToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Slight delay for dramatic effect
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-24 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="bg-gray-900/95 backdrop-blur-md border border-green-500/30 rounded-xl shadow-2xl shadow-green-500/10 overflow-hidden">
            {/* Success bar */}
            <motion.div
              className="h-1 bg-gradient-to-r from-green-400 to-cyan-400"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center"
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 font-semibold text-sm">
                      System Initialized
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-green-900/50 text-green-400 rounded border border-green-700">
                      Success
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mb-2">
                    Block #1 verified via Proof-of-Work
                  </p>

                  {/* Block hash */}
                  <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                    <Box className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    <code className="text-xs text-gray-300 font-mono truncate">
                      {blockHash}
                    </code>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
