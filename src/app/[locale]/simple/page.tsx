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
                  href="/resume/jinhyeok_resume_2025_KR.pdf"
                  download="김진혁_이력서.pdf"
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
                  href="/resume/jinhyeok_resume_2025_EN.pdf"
                  download="Jinhyeok_Kim_Resume.pdf"
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
                Blockchain Backend Engineer
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
                ? "27배 성능 최적화(25→678 TPS), 1주일 만에 계약 35배 확대를 이끈 블록체인 백엔드 엔지니어입니다."
                : "Backend Engineer who achieved 27x performance optimization (25→678 TPS) and expanded contracts 35x by resolving legacy issues within 1 week."}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {locale === "ko"
                ? "Hyperledger Besu/Fabric 네트워크 구축부터 스마트컨트랙트, 백엔드 API까지 End-to-End 개발. Groth16 기반 ZKP 복호화 65배 개선(35초→0.54초). Springer ICBTA 2025 1저자, 논문 7편(1저자 5편)."
                : "End-to-End blockchain development: Hyperledger Besu/Fabric network, smart contracts, backend APIs. Improved ZKP decryption 65x (35s→0.54s) with Groth16 architecture. Springer ICBTA 2025 1st author, 7 papers (5 as 1st author)."}
            </p>
            {/* 핵심 성과 하이라이트 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg">
              <h3 className="font-bold text-primary-700 mb-3">
                {locale === "ko" ? "📊 핵심 성과" : "📊 Key Achievements"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">27x</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "성능 최적화" : "Performance"}</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "25→678 TPS (13억 규모)" : "25→678 TPS ($1M)"}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">35x</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "계약 확대" : "Contract Expansion"}</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "200만→7천만 (1주일)" : "$2K→$70K (1 week)"}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">65x</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "ZKP 개선" : "ZKP Improvement"}</div>
                  <div className="text-[10px] text-gray-500">35s→0.54s (Groth16)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">Springer</div>
                  <div className="text-xs text-gray-600">{locale === "ko" ? "1저자" : "1st Author"}</div>
                  <div className="text-[10px] text-gray-500">{locale === "ko" ? "ICBTA 2025 (7편, 1저자 5편)" : "ICBTA 2025 (7 papers, 5 1st)"}</div>
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
                <ul className="text-sm text-gray-700 space-y-1">
                  {exp.achievements[locale].map((achievement, i) => (
                    achievement.startsWith("──") ? (
                      <li key={i} className="list-none font-semibold text-primary-700 mt-4 first:mt-0 text-xs uppercase tracking-wide">
                        {achievement.replace(/──/g, "").trim()}
                      </li>
                    ) : (
                      <li key={i} className="list-disc list-inside">{achievement}</li>
                    )
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
                  <ul className="text-sm text-gray-600 space-y-1">
                    {exp.achievements[locale].map((achievement, i) => (
                      achievement.startsWith("──") ? (
                        <li key={i} className="list-none font-semibold text-gray-700 mt-3 first:mt-0 text-xs uppercase tracking-wide">
                          {achievement.replace(/──/g, "").trim()}
                        </li>
                      ) : (
                        <li key={i} className="list-disc list-inside">{achievement}</li>
                      )
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

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "기술 스택" : "Skills"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((category) => (
              <div key={category.category}>
                <h3 className="font-bold text-sm text-gray-700 mb-3 pb-1 border-b border-gray-200">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <span
                      key={skill.name}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {skill.name}
                    </span>
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
                  ? "PoW, PoS, RAFT, IBFT 2.0 합의 알고리즘을 상태 기계로 모델링하고 3D로 시각화. 실제 프로토콜 동작을 시뮬레이션합니다."
                  : "State machine modeling of PoW, PoS, RAFT, IBFT 2.0 consensus with 3D visualization. Simulates actual protocol behavior."}
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
