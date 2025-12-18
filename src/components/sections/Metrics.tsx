"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TrendingUp, FileText, Award, Clock } from "lucide-react";
import { Card } from "@/components/ui";

const metrics = [
  { key: "tps", icon: TrendingUp, color: "text-green-400" },
  { key: "patents", icon: FileText, color: "text-blue-400" },
  { key: "papers", icon: Award, color: "text-purple-400" },
  { key: "exp", icon: Clock, color: "text-yellow-400" },
];

export default function Metrics() {
  const t = useTranslations("metrics");

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 이더스캔 스타일 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(({ key, icon: Icon, color }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-gray-900/80 border border-gray-800 hover:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {t(`${key}.label`)}
                    </p>
                    <p className={`text-2xl font-bold ${color}`}>
                      {t(`${key}.value`)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t(`${key}.desc`)}
                    </p>
                  </div>
                  <Icon className={`w-5 h-5 ${color} opacity-50`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
