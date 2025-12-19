"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, Globe, Fuel, TrendingUp, Search, Box, FileText, User, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui";
import SearchModal from "@/components/SearchModal";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [blockchainOpen, setBlockchainOpen] = useState(false);
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
              <span>EXP Price:</span>
              <span className="text-white font-medium">3+ yrs</span>
              <span className="text-green-400">(+40x TPS)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-yellow-400" />
              <span>Gas:</span>
              <span className="text-white font-medium">High Efficiency</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1">
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

            {/* 데스크톱 네비게이션 - 이더스캔 스타일 */}
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

              {/* Blockchain Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setBlockchainOpen(!blockchainOpen)}
                  onBlur={() => setTimeout(() => setBlockchainOpen(false), 200)}
                  className={`px-3 py-2 text-sm rounded transition-colors flex items-center gap-1 ${
                    isActive("/blocks") || isActive("/txs")
                      ? "text-white bg-gray-800/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  Blockchain
                  <ChevronDown className="w-3 h-3" />
                </button>

                {blockchainOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2 min-w-[200px]">
                    <Link
                      href={`/${locale}/blocks`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <Box className="w-4 h-4" />
                      View Blocks
                      <span className="ml-auto text-xs text-gray-600">Experience</span>
                    </Link>
                    <Link
                      href={`/${locale}/txs`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <FileText className="w-4 h-4" />
                      Transactions
                      <span className="ml-auto text-xs text-gray-600">Projects</span>
                    </Link>
                    <hr className="border-gray-800 my-2" />
                    <Link
                      href={`/${locale}/address`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <User className="w-4 h-4" />
                      Address
                      <span className="ml-auto text-xs text-gray-600">Profile</span>
                    </Link>
                  </div>
                )}
              </div>

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
                Transactions
              </Link>
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

            {/* 액션 */}
            <div className="flex items-center gap-2">
              {/* Simple Version Link */}
              <Link
                href={`/${locale}/simple`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                {locale === "ko" ? "심플 보기" : "Simple View"}
              </Link>

              {/* Resume Download Button */}
              <a
                href={`/resume/resume-${locale}.pdf`}
                download={`Jinhyeok_Kim_Resume_${locale.toUpperCase()}.pdf`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {locale === "ko" ? "이력서" : "Resume"}
              </a>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLocale}
                className="font-mono text-xs"
              >
                <Globe className="w-4 h-4 mr-1" />
                {locale.toUpperCase()}
              </Button>

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
                  <span>EXP: 3+ yrs</span>
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
                Blocks (Experience)
              </Link>
              <Link
                href={`/${locale}/txs`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                Transactions (Projects)
              </Link>
              <Link
                href={`/${locale}/address`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                Address (Profile)
              </Link>

              {/* Mobile Simple View & Resume Download */}
              <hr className="border-gray-800 my-2" />
              <Link
                href={`/${locale}/simple`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                {locale === "ko" ? "심플 버전 보기" : "View Simple Version"}
              </Link>
              <a
                href={`/resume/resume-${locale}.pdf`}
                download={`Jinhyeok_Kim_Resume_${locale.toUpperCase()}.pdf`}
                className="flex items-center gap-2 px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                {locale === "ko" ? "이력서 다운로드" : "Download Resume"}
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
