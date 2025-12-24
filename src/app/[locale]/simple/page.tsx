"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { getHireStatusConfig } from "@/config/site";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  ExternalLink,
  FileText,
  Trophy,
  Award,
  ChevronDown,
  ChevronUp,
  Star,
  FolderOpen,
  Download,
  Globe,
  Printer,
} from "lucide-react";
import {
  experiences,
  projects,
  skills,
  contact,
  awards,
  personalInfo,
  education,
  papers,
} from "@/data/resume";

export default function SimplePage() {
  const locale = useLocale() as "ko" | "en";
  const [expandedPapers, setExpandedPapers] = useState<string[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const togglePaper = (id: string) => {
    setExpandedPapers(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleProject = (id: string) => {
    setExpandedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // 수상과 자격증 분리
  const awardsOnly = awards.filter(a => a.type === "award");
  const certificationsOnly = awards.filter(a => a.type === "certification");

  // 프로젝트 분리 및 최신순 정렬
  const sortByPeriod = (a: typeof projects[0], b: typeof projects[0]) => {
    const getYear = (period: string) => {
      const match = period.match(/(\d{4})/);
      return match ? parseInt(match[1]) : 0;
    };
    return getYear(b.period) - getYear(a.period);
  };
  const featuredProjects = projects.filter(p => p.featured).sort(sortByPeriod);
  const otherProjects = projects.filter(p => !p.featured).sort(sortByPeriod);

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      {/* Header - Professional & Clean */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 print:bg-white print:text-gray-900 print:py-4">
        <div className="max-w-4xl mx-auto px-6">
          {/* Top bar - Availability & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-700 print:hidden">
            {/* Availability Status */}
            {(() => {
              const hireConfig = getHireStatusConfig();
              return (
                <div className="flex items-center gap-2 text-sm">
                  {hireConfig.show && (
                    <>
                      <span className={`flex items-center gap-1.5 ${hireConfig.color}`}>
                        <span className={`w-2 h-2 ${hireConfig.bgColor} rounded-full animate-pulse`} />
                        {locale === "ko" ? hireConfig.label.ko : hireConfig.label.en}
                      </span>
                      <span className="text-gray-500">|</span>
                    </>
                  )}
                  <span className="text-gray-400">
                    {locale === "ko" ? "서울 (원격 가능)" : "Seoul (Remote OK)"}
                  </span>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* PDF Downloads */}
              <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
                <a
                  href="/resume/JinhyeokKim_Resume_KR.pdf"
                  download
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    locale === "ko"
                      ? "bg-primary-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  title="한국어 이력서 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  🇰🇷 PDF
                </a>
                <a
                  href="/resume/JinhyeokKim_Resume_EN.pdf"
                  download
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    locale === "en"
                      ? "bg-primary-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  title="Download English Resume"
                >
                  <Download className="w-3.5 h-3.5" />
                  🇺🇸 PDF
                </a>
              </div>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title={locale === "ko" ? "인쇄하기" : "Print"}
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              {/* Language Toggle */}
              <Link
                href={`/${locale === "ko" ? "en" : "ko"}/simple`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {locale === "ko" ? "EN" : "KO"}
              </Link>
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{personalInfo.name[locale]}</h1>
              <p className="text-primary-400 font-medium mt-1 print:text-primary-600">
                {locale === "ko" ? "블록체인 & 백엔드 개발자" : "Blockchain & Backend Developer"}
              </p>
            </div>
            {/* Quick Stats - Print visible */}
            <div className="hidden print:flex gap-4 text-sm text-gray-600">
              <span>{contact.email}</span>
              <span>|</span>
              <span>github.com/nara020</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Contact Info */}
        <section className="mb-12 flex flex-wrap gap-6 text-sm text-gray-600">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary-600">
            <Mail className="w-4 h-4" />
            {contact.email}
          </a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-600">
            <Github className="w-4 h-4" />
            GitHub
          </a>
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-600">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          )}
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {contact.location[locale]}
          </span>
        </section>

        {/* About - 핵심 성과 중심 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "프로필 요약" : "Profile Summary"}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-800 leading-relaxed font-medium">
              {locale === "ko"
                ? "블록체인 네트워크 성능을 27배 향상시킨 백엔드/블록체인 개발자입니다."
                : "Backend/Blockchain Developer who achieved 27x performance improvement on blockchain networks."}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {locale === "ko"
                ? "Hyperledger Besu 기반 B2B 플랫폼에서 25TPS→678TPS 최적화를 주도했습니다. Java 21 Virtual Threads, Transaction Isolation Pattern, PM2 Cluster Mode를 적용한 3-Layer 최적화 방법론을 설계하여 서비스 레이어 병목을 해결했으며, 이 연구 결과를 국제학술대회(ICBTA 2025, Springer LNNS)에 1저자로 게재했습니다."
                : "Led optimization of B2B platform from 25TPS to 678TPS on Hyperledger Besu. Designed 3-Layer optimization methodology using Java 21 Virtual Threads, Transaction Isolation Pattern, and PM2 Cluster Mode to resolve service layer bottlenecks. Published as first author at ICBTA 2025 (Springer LNNS)."}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {locale === "ko"
                ? "CES Best Innovation Award 수상 기업(ZKP 전문)과 협업하며 영지식증명 기술을 습득했고, 이를 바탕으로 Groth16/snarkjs/circom 기반 개인 프로젝트를 설계·개발하고 있습니다. SpringBoot/Node.js 백엔드, Solidity 스마트컨트랙트, Private IPFS 클러스터 구축 등 블록체인 서비스 전 영역을 다룹니다."
                : "Acquired ZKP expertise through collaboration with a CES Best Innovation Award-winning company, now designing and developing personal projects using Groth16/snarkjs/circom. Handle all areas of blockchain services including SpringBoot/Node.js backend, Solidity smart contracts, and Private IPFS cluster deployment."}
            </p>
            <p className="text-gray-500 text-sm italic">
              {locale === "ko"
                ? "* 중학생 때 첫 프로그램을 만들며 개발에 입문, 이후 꾸준히 성장해왔습니다."
                : "* Started programming in middle school, continuously growing ever since."}
            </p>
            {/* 핵심 성과 하이라이트 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg">
              <h3 className="font-bold text-primary-700 mb-3">
                {locale === "ko" ? "📊 핵심 성과" : "📊 Key Achievements"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">27x</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "TPS 성능 향상" : "TPS Improvement"}</div>
                  <div className="text-[10px] text-gray-500">25→678 TPS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">35x</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "ZKP 복호화 최적화" : "ZKP Decrypt Speed"}</div>
                  <div className="text-[10px] text-gray-500">35s→1s</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">5</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "1저자 논문" : "First Author Papers"}</div>
                  <div className="text-[10px] text-gray-500">Springer · KCI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">10+</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "수상 실적" : "Awards"}</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "우수논문상 · 대상" : "Best Paper · Grand Prize"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience (IT 경력) */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "경력" : "Work Experience"}
          </h2>
          <div className="space-y-8">
            {experiences.filter(exp => exp.type === "work").map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-primary-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-600 rounded-full" />
                <div className="mb-2">
                  <h3 className="font-bold text-lg">{exp.company[locale]}</h3>
                  <p className="text-primary-600 font-medium">{exp.role[locale]}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.period} ({exp.duration?.[locale]})
                  </p>
                </div>
                <p className="text-gray-600 mb-3">{exp.description[locale]}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {exp.achievements[locale].map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.tech.map((tech) => (
                    <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Break / Other */}
        {experiences.filter(exp => exp.type === "other").length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200 text-gray-600">
              {locale === "ko" ? "Career Break" : "Career Break"}
            </h2>
            <div className="space-y-6">
              {experiences.filter(exp => exp.type === "other").map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-gray-300 border-dashed">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-400 rounded-full" />
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-gray-700">{exp.company[locale]}</h3>
                    <p className="text-gray-500 font-medium">{exp.role[locale]}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period} ({exp.duration?.[locale]})
                    </p>
                  </div>
                  <p className="text-gray-500 mb-3 text-sm">{exp.description[locale]}</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {exp.achievements[locale].slice(0, 3).map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research Experience */}
        {experiences.filter(exp => exp.type === "research").length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
              {locale === "ko" ? "연구 경험" : "Research Experience"}
            </h2>
            <div className="space-y-6">
              {experiences.filter(exp => exp.type === "research").map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-blue-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full" />
                  <div className="mb-2">
                    <h3 className="font-bold text-lg">{exp.company[locale]}</h3>
                    <p className="text-blue-600 font-medium">{exp.role[locale]}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period} ({exp.duration?.[locale]})
                    </p>
                  </div>
                  <p className="text-gray-600 mb-3">{exp.description[locale]}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {exp.achievements[locale].map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.tech.map((tech) => (
                      <span key={tech} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Military Service */}
        {experiences.filter(exp => exp.type === "military").length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
              {locale === "ko" ? "병역" : "Military Service"}
            </h2>
            <div className="space-y-6">
              {experiences.filter(exp => exp.type === "military").map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-green-700">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-green-700 rounded-full" />
                  <div className="mb-2">
                    <h3 className="font-bold text-lg">{exp.company[locale]}</h3>
                    <p className="text-green-700 font-medium">{exp.role[locale]}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period} ({exp.duration?.[locale]})
                    </p>
                  </div>
                  <p className="text-gray-600 mb-3">{exp.description[locale]}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {exp.achievements[locale].map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.tech.map((tech) => (
                      <span key={tech} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {locale === "ko" ? "핵심 프로젝트" : "Featured Projects"}
            <span className="text-sm font-normal text-gray-500 ml-2">({featuredProjects.length})</span>
          </h2>
          <div className="space-y-4">
            {featuredProjects.map((project) => (
              <div key={project.id} className="border border-yellow-200 bg-yellow-50/50 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{project.name[locale]}</h3>
                        {project.links && (
                          <div className="flex gap-1">
                            {project.links.github && (
                              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {project.links.demo && (
                              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{project.period}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description[locale]}</p>
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors mb-3"
                  >
                    {expandedProjects.includes(project.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        {locale === "ko" ? "상세 내용 접기" : "Hide Details"}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        {locale === "ko" ? "상세 내용 보기" : "Show Details"}
                      </>
                    )}
                  </button>
                  {expandedProjects.includes(project.id) && (
                    <div className="mb-3 p-3 bg-white rounded-lg border border-yellow-200">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                        {locale === "ko" ? "주요 성과" : "Key Achievements"}
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {project.highlights[locale].map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Projects */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-gray-500" />
            {locale === "ko" ? "기타 프로젝트" : "Other Projects"}
            <span className="text-sm font-normal text-gray-500 ml-2">({otherProjects.length})</span>
          </h2>
          <div className="space-y-3">
            {otherProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{project.name[locale]}</h3>
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{project.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex gap-1">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{project.tech.length - 3}</span>
                      )}
                    </div>
                    {expandedProjects.includes(project.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
                {expandedProjects.includes(project.id) && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mt-3 mb-3">{project.description[locale]}</p>
                    <div className="p-3 bg-gray-50 rounded-lg mb-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                        {locale === "ko" ? "주요 성과" : "Highlights"}
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {project.highlights[locale].map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "기술 스택" : "Skills"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((category) => (
              <div key={category.category}>
                <h3 className="font-bold text-sm text-gray-500 mb-3">{category.category}</h3>
                <div className="space-y-2">
                  {category.items.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill.name}</span>
                          <span className="text-gray-400">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full">
                          <div
                            className="h-1.5 bg-primary-600 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            {locale === "ko" ? "논문 발표" : "Publications"}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({papers.filter(p => p.isFirstAuthor).length} {locale === "ko" ? "편 1저자" : "First Author"})
            </span>
          </h2>
          <div className="space-y-4">
            {papers.map((paper) => (
              <div key={paper.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {paper.isFirstAuthor && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                            1st Author
                          </span>
                        )}
                        {paper.award && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {paper.award[locale]}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                          {paper.publisher}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                          {paper.type === "journal" ? (locale === "ko" ? "저널" : "Journal") : (locale === "ko" ? "학술대회" : "Conference")}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {paper.title[locale]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {paper.venue[locale]} · {paper.date}
                      </p>
                    </div>
                    {paper.links?.linkedin && (
                      <a
                        href={paper.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="View on LinkedIn"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => togglePaper(paper.id)}
                    className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {expandedPapers.includes(paper.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        {locale === "ko" ? "요약 접기" : "Hide Abstract"}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        {locale === "ko" ? "요약 보기" : "Show Abstract"}
                      </>
                    )}
                  </button>
                </div>
                {expandedPapers.includes(paper.id) && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Abstract</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {paper.abstract[locale]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {locale === "ko" ? "수상 경력" : "Awards"}
            <span className="text-sm font-normal text-gray-500 ml-2">({awardsOnly.length})</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {awardsOnly.map((award) => (
              <div key={award.id} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                <div>
                  <p className="font-medium text-sm text-gray-900">{award.name[locale]}</p>
                  <p className="text-xs text-gray-500">{award.issuer[locale]} · {award.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            {locale === "ko" ? "자격증" : "Certifications"}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {certificationsOnly.map((cert) => (
              <div key={cert.id} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium text-sm text-gray-900">{cert.name[locale]}</p>
                  <p className="text-xs text-gray-500">{cert.issuer[locale]} · {cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "학력" : "Education"}
          </h2>
          {education.map((edu) => (
            <div key={edu.id}>
              <h3 className="font-bold">{edu.school[locale]}</h3>
              <p className="text-primary-600">{edu.major[locale]}</p>
              <p className="text-sm text-gray-500">{edu.period} | GPA: {edu.gpa}</p>
              {edu.thesis && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">{locale === "ko" ? "졸업논문: " : "Thesis: "}</span>
                  {edu.thesis[locale]}
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Explore More - Interactive Portfolios (Hide on print) */}
        <section className="mb-12 print:hidden">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "더 알아보기" : "Explore More"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Etherscan Style Portfolio */}
            <Link
              href={`/${locale}`}
              className="group p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg hover:shadow-primary-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold">JK</span>
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">
                    {locale === "ko" ? "🔍 Etherscan 스타일로 탐험하기" : "🔍 Explore in Etherscan Style"}
                  </h3>
                  <p className="text-xs text-gray-400">JinhyeokScan</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {locale === "ko"
                  ? "블록체인 익스플로러 UI로 제 경력과 프로젝트를 탐색해보세요. 블록 = 경력, 트랜잭션 = 프로젝트로 구성되어 있습니다."
                  : "Explore my career and projects through a blockchain explorer UI. Blocks = Experience, Transactions = Projects."}
              </p>
            </Link>

            {/* Consensus Lab - Pokemon Holographic Card Style */}
            <a
              href="https://consensus-lab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-6 rounded-xl border-2 border-yellow-400/70 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/30"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              }}
            >
              {/* Holographic shimmer overlay */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 20%, rgba(255,215,0,0.3) 30%, rgba(255,255,255,0.4) 35%, rgba(255,215,0,0.3) 40%, transparent 50%, rgba(0,255,255,0.2) 60%, rgba(255,215,0,0.3) 70%, transparent 80%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s ease-in-out infinite",
                }}
              />
              {/* Sparkle particles */}
              <div className="absolute top-2 right-3 text-yellow-300 animate-pulse text-xs">✦</div>
              <div className="absolute top-4 right-8 text-cyan-300 animate-pulse text-[10px]" style={{ animationDelay: "0.5s" }}>✧</div>
              <div className="absolute bottom-3 left-4 text-yellow-200 animate-pulse text-xs" style={{ animationDelay: "1s" }}>✦</div>
              <div className="absolute top-1/2 right-2 text-white/60 animate-pulse text-[8px]" style={{ animationDelay: "1.5s" }}>✧</div>

              {/* Golden border glow */}
              <div className="absolute inset-0 rounded-xl border border-yellow-300/30 pointer-events-none" />

              <div className="relative z-10 flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <span className="text-white text-lg">🧪</span>
                </div>
                <div>
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 group-hover:from-yellow-200 group-hover:to-amber-300 transition-all">
                    {locale === "ko" ? "🧪 합의 알고리즘 시뮬레이터" : "🧪 Consensus Algorithm Simulator"}
                  </h3>
                  <p className="text-xs text-yellow-200/70">✨ Consensus Lab</p>
                </div>
              </div>
              <p className="relative z-10 text-sm text-gray-300">
                {locale === "ko"
                  ? "PoW, PoS, PBFT 등 블록체인 합의 알고리즘을 3D로 시각화하고 직접 비교해볼 수 있는 인터랙티브 시뮬레이터입니다."
                  : "Interactive 3D visualization of blockchain consensus algorithms including PoW, PoS, and PBFT."}
              </p>
              <div className="relative z-10 mt-3 flex items-center gap-1 text-xs text-yellow-400 font-medium">
                <ExternalLink className="w-3 h-3" />
                consensus-lab.vercel.app
              </div>

              {/* CSS for shimmer animation */}
              <style jsx>{`
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 print:py-4 print:bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">{personalInfo.name[locale]}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a href={`mailto:${contact.email}`} className="hover:text-primary-600 transition-colors">
                {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 print:hidden">
              <span>
                {locale === "ko" ? "최종 업데이트: 2025.12" : "Last updated: Dec 2025"}
              </span>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-600 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
