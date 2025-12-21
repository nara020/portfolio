"use client";

import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";

interface EmailCopyProps {
  email: string;
  className?: string;
}

export default function EmailCopy({ email, className = "" }: EmailCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
      >
        <Mail className="w-4 h-4" />
        <span className="font-mono text-sm">{email}</span>
      </a>
      <button
        onClick={handleCopy}
        className={`p-1.5 rounded-md transition-all ${
          copied
            ? "bg-green-900/50 text-green-400"
            : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
        title={copied ? "Copied!" : "Copy email"}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
