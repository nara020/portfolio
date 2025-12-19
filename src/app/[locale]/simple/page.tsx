"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  ExternalLink,
  ArrowLeft,
  FileText,
} from "lucide-react";
import {
  experiences,
  projects,
  skills,
  contact,
  awards,
  personalInfo,
  education,
} from "@/data/resume";

export default function SimplePage() {
  const locale = useLocale() as "ko" | "en";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{personalInfo.name[locale]}</h1>
            <p className="text-gray-400 text-sm">
              {locale === "ko" ? "블록체인 개발자" : "Blockchain Developer"}
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "ko" ? "Etherscan 스타일 보기" : "View Etherscan Style"}
          </Link>
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

        {/* About */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "소개" : "About"}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {locale === "ko"
              ? `${personalInfo.university[locale]} ${personalInfo.major[locale]} 졸업 (GPA ${personalInfo.gpa}). ${personalInfo.totalExperience[locale]} 경력의 블록체인 개발자로, Hyperledger Fabric/Besu 기반 엔터프라이즈 블록체인과 영지식증명(ZKP) 아키텍처 설계 전문. 12살 때 처음 프로그래밍을 시작해 게임을 만들고 싶었던 호기심이 여기까지 이끌었습니다.`
              : `Graduated from ${personalInfo.university[locale]} with ${personalInfo.major[locale]} (GPA ${personalInfo.gpa}). Blockchain Developer with ${personalInfo.totalExperience[locale]} experience, specializing in enterprise blockchain (Hyperledger Fabric/Besu) and Zero-Knowledge Proof architecture. Started programming at age 12 with a curiosity to make games, which led me here.`}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "경력" : "Experience"}
          </h2>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200">
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
                  {exp.achievements[locale].slice(0, 4).map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.tech.slice(0, 6).map((tech) => (
                    <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "주요 프로젝트" : "Key Projects"}
          </h2>
          <div className="space-y-6">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{project.name[locale]}</h3>
                    <p className="text-sm text-gray-500">{project.period}</p>
                  </div>
                  {project.links && (
                    <div className="flex gap-2">
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
                      {project.links.paper && (
                        <a href={project.links.paper} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description[locale]}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                  {project.highlights[locale].slice(0, 3).map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 5).map((tech) => (
                    <span key={tech} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
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

        {/* Awards & Certifications */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            {locale === "ko" ? "수상 & 자격증" : "Awards & Certifications"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {awards.slice(0, 8).map((award) => (
              <div key={award.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  award.type === "certification" ? "bg-green-500" :
                  award.type === "paper" ? "bg-blue-500" : "bg-yellow-500"
                }`} />
                <div>
                  <p className="font-medium text-sm">{award.name[locale]}</p>
                  <p className="text-xs text-gray-500">{award.issuer[locale]} | {award.date}</p>
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-500">
        <p>
          {locale === "ko"
            ? `${personalInfo.name[locale]} | 블록체인 개발자`
            : `${personalInfo.name[locale]} | Blockchain Developer`}
        </p>
        <p className="mt-1">{contact.email}</p>
      </footer>
    </div>
  );
}
