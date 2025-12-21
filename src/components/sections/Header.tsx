"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, Globe, TrendingUp, Search, Box, FileText, Download, Blocks } from "lucide-react";
import { Button } from "@/components/ui";
import SearchModal from "@/components/SearchModal";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K / Ctrl+K 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "ko" ? "en" : "ko";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  const isActive = (path: string) => pathname.includes(path);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* 이더스캔 스타일 상단 바 */}
      <div className="hidden lg:block bg-gray-900 border-b border-gray-800 py-1.5">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 text-gray-400">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
              <span>Performance:</span>
              <span className="text-white font-medium">27x TPS</span>
              <span className="text-green-400">(25→678)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Papers:</span>
              <span className="text-white font-medium">6</span>
              <span className="text-gray-500">(5 First Author)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Available for Hire
            </span>
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* 로고 */}
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">JK</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-semibold text-white text-sm leading-none">
                  JinhyeokScan
                </span>
                <span className="text-[10px] text-gray-500">
                  Blockchain Developer Explorer
                </span>
              </div>
            </Link>

            {/* 데스크톱 네비게이션 - 심플하게 */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href={`/${locale}`}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  pathname === `/${locale}` || pathname === `/${locale}/`
                    ? "text-white bg-gray-800/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Home
              </Link>

              <Link
                href={`/${locale}/blocks`}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  isActive("/blocks")
                    ? "text-white bg-gray-800/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Blocks
              </Link>

              <Link
                href={`/${locale}/txs`}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  isActive("/txs")
                    ? "text-white bg-gray-800/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Txs
              </Link>

              {/* Consensus Lab - Featured Project */}
              <a
                href="https://consensus-lab.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm rounded-lg transition-all text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 flex items-center gap-1.5"
                title={locale === "ko" ? "합의 알고리즘 3D 시각화" : "Interactive Consensus Visualization"}
              >
                <Blocks className="w-4 h-4" />
                <span>Lab</span>
              </a>
            </nav>

            {/* 검색창 */}
            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search (Cmd+K)"
                className="relative w-full flex items-center"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
                <div className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-500 text-left hover:border-gray-600 transition-colors">
                  Search... <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-gray-800 rounded">⌘K</kbd>
                </div>
              </button>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-2">
              {/* Back to Resume */}
              <Link
                href={`/${locale}/simple`}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                {locale === "ko" ? "이력서" : "Resume"}
              </Link>

              {/* Resume Download */}
              <a
                href={locale === "ko" ? "/resume/JinhyeokKim_Resume_KR.pdf" : "/resume/JinhyeokKim_Resume_EN.pdf"}
                download
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                PDF
              </a>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLocale}
                className="font-mono text-xs"
              >
                <Globe className="w-4 h-4 mr-1" />
                {locale.toUpperCase()}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden py-4 border-t border-gray-800"
            >
              <div className="flex items-center gap-4 px-4 pb-4 mb-4 border-b border-gray-800 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
                  <span>27x TPS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span>Available</span>
                </div>
              </div>

              <Link
                href={`/${locale}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href={`/${locale}/blocks`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <Box className="w-4 h-4" />
                Blocks
              </Link>
              <Link
                href={`/${locale}/txs`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                Transactions
              </Link>
              <a
                href="https://consensus-lab.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Blocks className="w-4 h-4" />
                Consensus Lab
              </a>

              <hr className="border-gray-800 my-2" />

              <Link
                href={`/${locale}/simple`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                {locale === "ko" ? "이력서 보기" : "View Resume"}
              </Link>
              <a
                href={locale === "ko" ? "/resume/JinhyeokKim_Resume_KR.pdf" : "/resume/JinhyeokKim_Resume_EN.pdf"}
                download
                className="flex items-center gap-2 px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                {locale === "ko" ? "PDF 다운로드" : "Download PDF"}
              </a>
            </motion.nav>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
