"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Box, FileText, Code, User, ArrowRight } from "lucide-react";
import { experiences, projects, skills } from "@/data/resume";
import { generateBlockHash, generateTxHash, shortenHash } from "@/lib/utils";

interface SearchResult {
  type: "block" | "tx" | "skill" | "address";
  id: string;
  title: string;
  subtitle: string;
  hash?: string;
  link: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const locale = useLocale() as "ko" | "en";
  const router = useRouter();

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = q.toLowerCase();

    // Search experiences (blocks)
    experiences.forEach((exp) => {
      const matchCompany = exp.company[locale].toLowerCase().includes(lowerQuery);
      const matchRole = exp.role[locale].toLowerCase().includes(lowerQuery);
      const matchTech = exp.tech.some((t) => t.toLowerCase().includes(lowerQuery));
      const matchAchievements = exp.achievements[locale].some((a) =>
        a.toLowerCase().includes(lowerQuery)
      );
      const hash = generateBlockHash(exp.id);
      const matchHash = hash.toLowerCase().includes(lowerQuery);

      if (matchCompany || matchRole || matchTech || matchAchievements || matchHash) {
        searchResults.push({
          type: "block",
          id: exp.id,
          title: exp.company[locale],
          subtitle: exp.role[locale],
          hash: hash,
          link: `/${locale}/blocks/${exp.id}`,
        });
      }
    });

    // Search projects (transactions)
    projects.forEach((proj) => {
      const matchName = proj.name[locale].toLowerCase().includes(lowerQuery);
      const matchDesc = proj.description[locale].toLowerCase().includes(lowerQuery);
      const matchTech = proj.tech.some((t) => t.toLowerCase().includes(lowerQuery));
      const matchHighlights = proj.highlights[locale].some((h) =>
        h.toLowerCase().includes(lowerQuery)
      );
      const hash = generateTxHash(proj.id);
      const matchHash = hash.toLowerCase().includes(lowerQuery);

      if (matchName || matchDesc || matchTech || matchHighlights || matchHash) {
        searchResults.push({
          type: "tx",
          id: proj.id,
          title: proj.name[locale],
          subtitle: proj.period,
          hash: hash,
          link: `/${locale}/txs/${proj.id}`,
        });
      }
    });

    // Search skills
    skills.forEach((category) => {
      category.items.forEach((skill) => {
        if (skill.name.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: "skill",
            id: skill.name,
            title: skill.name,
            subtitle: `${category.category} • ${skill.level}%`,
            link: `/${locale}/simple`,
          });
        }
      });
    });

    // If searching for address-like pattern
    if (lowerQuery.startsWith("0x") || lowerQuery === "address" || lowerQuery === "profile") {
      searchResults.push({
        type: "address",
        id: "profile",
        title: locale === "ko" ? "김진혁" : "Jinhyeok Kim",
        subtitle: locale === "ko" ? "개발자 프로필" : "Developer Profile",
        link: `/${locale}/simple`,
      });
    }

    setResults(searchResults.slice(0, 8));
  }, [locale]);

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.link);
    onClose();
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "block":
        return <Box className="w-5 h-5 text-primary-400" />;
      case "tx":
        return <FileText className="w-5 h-5 text-blue-400" />;
      case "skill":
        return <Code className="w-5 h-5 text-green-400" />;
      case "address":
        return <User className="w-5 h-5 text-purple-400" />;
      default:
        return <Search className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "block":
        return locale === "ko" ? "경력" : "Experience";
      case "tx":
        return locale === "ko" ? "프로젝트" : "Project";
      case "skill":
        return locale === "ko" ? "스킬" : "Skill";
      case "address":
        return locale === "ko" ? "프로필" : "Profile";
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-800">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    locale === "ko"
                      ? "경력, 프로젝트, 스킬, 해시로 검색..."
                      : "Search by experience, project, skill, or hash..."
                  }
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(result)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium truncate">
                              {result.title}
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {result.subtitle}
                          </div>
                          {result.hash && (
                            <code className="text-xs text-gray-600 font-mono">
                              {shortenHash(result.hash, 10)}
                            </code>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                ) : query ? (
                  <div className="p-8 text-center text-gray-500">
                    {locale === "ko"
                      ? "검색 결과가 없습니다"
                      : "No results found"}
                  </div>
                ) : (
                  <div className="p-4">
                    {/* Recent Experiences */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase mb-3 px-2 flex items-center gap-2">
                        <Box className="w-3 h-3" />
                        {locale === "ko" ? "최근 경력" : "Recent Experience"}
                      </div>
                      <div className="space-y-1">
                        {experiences.slice(0, 3).map((exp) => (
                          <button
                            key={exp.id}
                            onClick={() => handleSelect({
                              type: "block",
                              id: exp.id,
                              title: exp.company[locale],
                              subtitle: exp.role[locale],
                              hash: generateBlockHash(exp.id),
                              link: `/${locale}/blocks/${exp.id}`,
                            })}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
                              <Box className="w-4 h-4 text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm truncate">{exp.company[locale]}</div>
                              <div className="text-xs text-gray-500 truncate">{exp.period}</div>
                            </div>
                            {exp.current && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-green-900/50 text-green-400 rounded">
                                Active
                              </span>
                            )}
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase mb-3 px-2 flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {locale === "ko" ? "최근 프로젝트" : "Recent Projects"}
                      </div>
                      <div className="space-y-1">
                        {projects.slice(0, 3).map((proj) => (
                          <button
                            key={proj.id}
                            onClick={() => handleSelect({
                              type: "tx",
                              id: proj.id,
                              title: proj.name[locale],
                              subtitle: proj.period,
                              hash: generateTxHash(proj.id),
                              link: `/${locale}/txs/${proj.id}`,
                            })}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm truncate">{proj.name[locale]}</div>
                              <div className="text-xs text-gray-500 truncate">{proj.tech.slice(0, 3).join(", ")}</div>
                            </div>
                            {proj.period.includes("Present") && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-yellow-900/50 text-yellow-400 rounded animate-pulse">
                                Pending
                              </span>
                            )}
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Skills */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-3 px-2 flex items-center gap-2">
                        <Code className="w-3 h-3" />
                        {locale === "ko" ? "핵심 기술" : "Key Skills"}
                      </div>
                      <div className="flex flex-wrap gap-2 px-2">
                        {["Hyperledger", "Solidity", "ZKP", "Go", "TypeScript", "Docker"].map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 hover:bg-primary-600 hover:text-white rounded-lg transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">↑↓</kbd>
                    {locale === "ko" ? "탐색" : "Navigate"}
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">↵</kbd>
                    {locale === "ko" ? "선택" : "Select"}
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">esc</kbd>
                    {locale === "ko" ? "닫기" : "Close"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
