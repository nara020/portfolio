"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { AlertTriangle, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Error Code - Blockchain Style */}
        <div className="mb-4">
          <code className="text-6xl font-bold text-white">404</code>
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">
          {locale === "ko" ? "블록을 찾을 수 없습니다" : "Block Not Found"}
        </h1>

        <p className="text-gray-400 mb-2">
          {locale === "ko"
            ? "요청하신 블록이 체인에 존재하지 않습니다."
            : "The requested block does not exist on the chain."}
        </p>

        {/* Fake Transaction Hash */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 mb-6">
          <div className="text-xs text-gray-500 mb-1">
            {locale === "ko" ? "요청된 해시" : "Requested Hash"}
          </div>
          <code className="text-sm text-red-400 font-mono break-all">
            0x404...NOT_FOUND
          </code>
        </div>

        {/* Error Details - Blockchain Style */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Status:</span>
            <span className="text-red-400">Failed</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Error:</span>
            <span className="text-white">BLOCK_NOT_FOUND</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gas Used:</span>
            <span className="text-white">0 (Reverted)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            {locale === "ko" ? "홈으로" : "Go Home"}
          </Link>
          <Link
            href={`/${locale}/blocks`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            {locale === "ko" ? "블록 탐색" : "Browse Blocks"}
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === "ko" ? "이전 페이지로" : "Go Back"}
        </button>
      </motion.div>
    </div>
  );
}
