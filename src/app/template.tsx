"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/motion/reveal";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
