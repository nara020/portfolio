"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Copy,
  CheckCircle,
  MapPin,
  Github,
  Trophy,
  GraduationCap,
  Award,
  FileText,
  Zap,
  TrendingUp,
  Star,
  BookOpen,
  Linkedin,
  Shield,
} from "lucide-react";
import {
  contact,
  skills,
  experiences,
  projects,
  awards,
  education,
  keyMetrics,
  personalInfo,
} from "@/data/resume";

export default function AddressPage() {
  const locale = useLocale() as "ko" | "en";

  // 지갑 주소 형식으로 변환
  const address = `0x${contact.email.replace(/[^a-zA-Z0-9]/g, "").padEnd(40, "0").slice(0, 40)}`;

  const totalAchievements = experiences.reduce(
    (sum, exp) => sum + exp.achievements[locale].length,
    0
  );
  const totalProjects = projects.length;
  const totalSkills = skills.reduce((sum, cat) => sum + cat.items.length, 0);

  const certifications = awards.filter((a) => a.type === "certification");
  const awardsList = awards.filter((a) => a.type === "award");

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explorer
          </Link>
        </div>
      </header>

      {/* Address Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              JK
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white">
                  {personalInfo.name[locale]}
                </h1>
                <span className="px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded border border-green-800">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Verified Developer
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <code className="font-mono text-sm">{address}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Hero */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
            <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{keyMetrics.papers.value}</div>
            <div className="text-xs text-blue-400">{keyMetrics.papers.desc[locale]}</div>
          </div>

          <div className="bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-primary-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{keyMetrics.tpsImprovement.value}</div>
            <div className="text-xs text-primary-400">{keyMetrics.tpsImprovement.desc[locale]}</div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{keyMetrics.awards.value}</div>
            <div className="text-xs text-green-400">{keyMetrics.awards.desc[locale]}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{keyMetrics.experience.value[locale]}</div>
            <div className="text-xs text-purple-400">{keyMetrics.experience.desc[locale]}</div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">Balance</div>
            <div className="text-2xl font-bold text-white">3+ Years</div>
            <div className="text-xs text-gray-400">Experience</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">Blocks Mined</div>
            <div className="text-2xl font-bold text-white">{experiences.length}</div>
            <div className="text-xs text-gray-400">Companies</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">Transactions</div>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase mb-1">Token Types</div>
            <div className="text-2xl font-bold text-white">{totalSkills}</div>
            <div className="text-xs text-gray-400">Skills</div>
          </div>
        </motion.div>

        {/* Education & Certifications */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl"
          >
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Education</h2>
            </div>
            <div className="p-6">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{edu.school[locale]}</h3>
                      <p className="text-sm text-gray-400">{edu.major[locale]}</p>
                      <p className="text-xs text-gray-500">{edu.period}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">GPA</div>
                      <div className="text-lg font-bold text-primary-400">{edu.gpa}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div className="text-lg font-bold text-green-400">{edu.status[locale]}</div>
                    </div>
                  </div>

                  {edu.thesis && (
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {locale === "ko" ? "졸업논문" : "Thesis"}
                      </div>
                      <p className="text-sm text-gray-300">{edu.thesis[locale]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-900 border border-gray-800 rounded-xl"
          >
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Certifications</h2>
            </div>
            <div className="p-6 space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{cert.name[locale]}</div>
                    <div className="text-xs text-gray-400">{cert.issuer[locale]}</div>
                  </div>
                  <div className="text-xs text-gray-500">{cert.date}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-xl mb-6"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">
              Awards & Achievements
            </h2>
            <span className="ml-auto text-xs text-gray-500">
              {awardsList.length} {locale === "ko" ? "개 수상" : "awards"}
            </span>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-3">
              {awardsList.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">
                      {award.name[locale]}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {award.issuer[locale]}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">{award.date}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Overview</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <a href={`mailto:${contact.email}`} className="text-primary-400 hover:text-primary-300">
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{contact.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {contact.location[locale]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available for Hire
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">First Block:</span>
                <span className="text-white">2020.01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Latest Block:</span>
                <span className="text-white">Present</span>
              </div>
            </div>
          </motion.div>

          {/* Skills (Token Holdings) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gray-900 border border-gray-800 rounded-xl"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Token Holdings (Skills)</h2>
            </div>
            <div className="p-6 space-y-4">
              {skills.map((category) => (
                <div key={category.category}>
                  <div className="text-xs text-gray-500 uppercase mb-2">
                    {category.category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700 flex items-center gap-2"
                      >
                        <span className="text-sm text-white">{item.name}</span>
                        <span className="text-xs text-primary-400">{item.level}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gray-900 border border-gray-800 rounded-xl"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Career History</h2>
            <div className="flex gap-2">
              <Link
                href={`/${locale}/blocks`}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                View Blocks →
              </Link>
              <Link
                href={`/${locale}/txs`}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                View Txs →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-800">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className="p-6 flex items-center gap-4 hover:bg-gray-800/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{exp.company[locale]}</div>
                  <div className="text-sm text-gray-400">{exp.role[locale]}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{exp.period}</div>
                  {exp.current ? (
                    <span className="text-xs text-green-400 flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {exp.duration?.[locale]}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
