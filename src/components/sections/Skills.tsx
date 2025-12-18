"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { skills } from "@/data/resume";

export default function Skills() {
  const t = useTranslations("sections.skills");

  return (
    <section className="py-16 px-4" id="skills">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
          <span className="text-sm text-gray-500">{t("subtitle")}</span>
        </div>

        {/* 스마트 컨트랙트 코드 스타일 */}
        <Card className="border border-gray-800 overflow-hidden">
          {/* 코드 에디터 헤더 */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-gray-500 font-mono ml-2">
              Skills.sol
            </span>
          </div>

          {/* 코드 내용 */}
          <div className="p-4 font-mono text-sm overflow-x-auto">
            <div className="text-gray-500">{"// SPDX-License-Identifier: MIT"}</div>
            <div className="text-purple-400">
              pragma <span className="text-white">solidity</span> ^0.8.19;
            </div>
            <br />
            <div>
              <span className="text-purple-400">contract</span>{" "}
              <span className="text-yellow-400">JinhyeokSkills</span> {"{"}
            </div>

            {skills.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: catIndex * 0.2 }}
                className="ml-4 mt-4"
              >
                <div className="text-gray-500">
                  {"// "}{category.category}
                </div>
                {category.items.map((skill, skillIndex) => (
                  <div key={skill.name} className="flex items-center gap-2 mt-1">
                    <span className="text-blue-400">uint8</span>
                    <span className="text-white">{skill.name.replace(/[^a-zA-Z]/g, "")}</span>
                    <span className="text-gray-500">=</span>
                    <span className="text-green-400">{skill.level}</span>
                    <span className="text-gray-500">;</span>
                    {/* 프로그레스 바 */}
                    <div className="flex-1 max-w-[100px] h-1 bg-gray-800 rounded-full overflow-hidden ml-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: catIndex * 0.2 + skillIndex * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}

            <div className="mt-4">{"}"}</div>
          </div>
        </Card>
      </div>
    </section>
  );
}
