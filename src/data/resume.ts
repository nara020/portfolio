import type { Experience, Project, Skill, Contact, Award, Education } from "./types";

export const personalInfo = {
  name: { ko: "김진혁", en: "Jinhyeok Kim" },
  birthYear: 1996,
  location: { ko: "서울 서초구", en: "Seocho, Seoul" },
  totalExperience: { ko: "3년+", en: "3+ years" },
  university: { ko: "수원대학교", en: "Suwon University" },
  major: { ko: "정보통신공학과", en: "Information & Telecommunication Engineering" },
  gpa: "3.73/4.5",
};

export const experiences: Experience[] = [
  {
    id: "creativecode",
    company: { ko: "㈜크리에이티브코드", en: "CreativeCode Inc." },
    role: { ko: "블록체인 개발팀 / 연구원", en: "Blockchain Developer & Researcher" },
    period: "2025.06 ~ Present",
    duration: { ko: "재직중", en: "Current" },
    current: true,
    description: {
      ko: "B2B 마켓 플레이스 및 공급망 관리 플랫폼 개발",
      en: "Building B2B Marketplace & Supply Chain Management Platform",
    },
    achievements: {
      ko: [
        "Hyperledger Besu 성능 최적화 (25TPS → 650TPS, 26배 향상)",
        "Groth16 기반 영지식증명(ZKP) 아키텍처 설계 및 구현",
        "한국정보처리학회 추계학술대회 논문 발표 (DPP 규제 대응 ZKP 시스템)",
        "TTA 클라우드 적격성 평가 진행 담당",
        "Solidity 스마트컨트랙트 개발 (Proxy 패턴, ZK 검증, IPFS CID 연동)",
        "Python 기반 Hyperledger Besu 구축 자동화 툴 개발",
        "정부 데이터 API(틸코블렛) 연동 프로젝트 진행",
      ],
      en: [
        "Achieved 26x TPS improvement on Hyperledger Besu (25 → 650 TPS)",
        "Designed and implemented Groth16-based Zero-Knowledge Proof architecture",
        "Published paper at KIPS Fall Conference (ZKP system for EU DPP compliance)",
        "Led TTA cloud qualification assessment process",
        "Developed Solidity smart contracts with Proxy pattern and ZK verification",
        "Built Python automation tool for Hyperledger Besu network deployment",
        "Integrated government data APIs for regulatory compliance",
      ],
    },
    tech: ["Hyperledger Besu", "Solidity", "ZKP/Groth16", "Node.js", "TypeScript", "IPFS", "SpringBoot", "Python", "Docker", "Jenkins"],
  },
  {
    id: "smartm2m",
    company: { ko: "㈜스마트엠투엠", en: "SmartM2M Inc." },
    role: { ko: "블록체인팀 / 사원", en: "Blockchain Developer" },
    period: "2022.02 ~ 2023.06",
    duration: { ko: "1년 5개월", en: "1 yr 5 mo" },
    description: {
      ko: "부산 블록체인 특화 벤처컨벤션 B-SPACE 개발",
      en: "Built Busan Blockchain Venture Convention Platform (B-SPACE)",
    },
    achievements: {
      ko: [
        "Hyperledger Fabric 블록체인 네트워크 3개 독립 구축 (개발용, 테스트용, 교육용)",
        "TTA 성능 테스트 통과 (쓰기 400, 읽기 1000 TPS 달성)",
        "Go lang 기반 Fabric ChainCode 개발 (회의실/장치 예약 서비스)",
        "TypeScript 기반 백엔드 API 개발 (JWT 토큰 관리, 권한 시스템)",
        "한국컴퓨터정보학회 우수논문상 수상",
        "Swagger API-docs 제작 및 문서화",
        "서비스 상용화 진행 및 유지보수 담당",
      ],
      en: [
        "Architected and deployed 3 independent Hyperledger Fabric networks (dev, test, education)",
        "Achieved TTA performance certification (400 TPS write, 1000 TPS read)",
        "Developed Fabric ChainCode in Go for room and device reservation system",
        "Built TypeScript backend APIs with JWT authentication and RBAC",
        "Won Best Paper Award at Korean Computer Information Society (KCIS)",
        "Created comprehensive Swagger API documentation",
        "Led service commercialization and ongoing maintenance",
      ],
    },
    tech: ["Hyperledger Fabric", "Go", "TypeScript", "Docker", "React", "Grafana", "MariaDB", "Nginx", "JMeter"],
  },
  {
    id: "global-experience",
    company: { ko: "Career Break", en: "Career Break" },
    role: { ko: "글로벌 경험 & 자기계발", en: "Global Experience & Self-Development" },
    period: "2023.12 ~ 2025.02",
    duration: { ko: "1년 3개월", en: "1 yr 3 mo" },
    description: {
      ko: "호주 워킹홀리데이, 필리핀 어학연수 + 필요한 툴은 직접 개발",
      en: "Australia Working Holiday, Philippines Language School + Built personal tools",
    },
    achievements: {
      ko: [
        "OPIC IH 취득 - 영어 커뮤니케이션 역량 강화",
        "호주/필리핀/인도네시아 - 글로벌 문화 경험 및 금융 시장 분석",
        "필요에 따라 개인 툴 개발 (쉬면서도 개발 감각 유지)",
        "여행사 예약 웹 (Next.js), 암호화폐 분석 대시보드 (Flask)",
        "AI 웹서비스 (Teachable Machine), OCR 프로그램 (OpenCV) 등",
      ],
      en: [
        "Achieved OPIc IH - Enhanced English communication skills",
        "Australia/Philippines/Indonesia - Global culture & fintech market exposure",
        "Built personal tools as needed (maintained dev skills during break)",
        "Travel booking web (Next.js), Crypto dashboard (Flask/Binance API)",
        "AI web services (Teachable Machine), OCR program (OpenCV), etc.",
      ],
    },
    tech: ["Next.js", "TypeScript", "Python", "Flask", "PostgreSQL", "Docker", "OpenCV"],
  },
  {
    id: "suwon-university",
    company: { ko: "수원대학교 산학협력단", en: "Suwon University Industry-Academia Cooperation" },
    role: { ko: "TLO 부서 / 연구원", en: "Technology Licensing Researcher" },
    period: "2021.08 ~ 2022.02",
    duration: { ko: "7개월", en: "7 mo" },
    description: {
      ko: "기술사업화 연구 및 ICT 프로젝트 컨설팅",
      en: "Technology Commercialization Research & ICT Consulting",
    },
    achievements: {
      ko: [
        "기술사업화 전문코디네이터(TCC) 연구 보조",
        "ICT 프로젝트 컨설팅 (안드로이드 앱, PHP 홈페이지, 라즈베리파이 연동)",
        "열화상 카메라 기반 실신 상황 감지 특허 분석",
        "산업 기술동향 분석 (7건 이상 기술박람회 참석 보고서 작성)",
      ],
      en: [
        "Assisted Technology Commercialization Coordinator (TCC) research initiatives",
        "Provided ICT consulting for startups (Android apps, PHP websites, Raspberry Pi IoT)",
        "Conducted IP landscape analysis for thermal camera fainting detection systems",
        "Published 7+ industry technology trend reports from tech exhibitions",
      ],
    },
    tech: ["Android", "PHP", "Raspberry Pi", "Python", "Research"],
  },
  {
    id: "university",
    company: { ko: "수원대학교 (학부 활동)", en: "Suwon University (Undergraduate)" },
    role: { ko: "정보통신공학과 / 학부생", en: "ICT Engineering Student" },
    period: "2015.03 ~ 2021.08",
    duration: { ko: "6년", en: "6 yrs" },
    description: {
      ko: "캡스톤 프로젝트, 공모전, 학술논문 발표 등 적극적인 학부 활동",
      en: "Active undergraduate activities: capstone projects, competitions, academic papers",
    },
    achievements: {
      ko: [
        "KCI 급 저널 논문 등재 (KTCCS) - 졸업논문",
        "정보처리학회 학부생 논문경진대회 대상",
        "한이음 ICT 공모전 장려상/입선 2회 수상",
        "한이음 학술대회 최우수상",
        "교육부 학생 창업유망팀 300 선정",
        "교내 창업경진대회 금상",
      ],
      en: [
        "Published in KCI-indexed journal KTCCS - graduation thesis",
        "Grand Prize at KIPS Undergraduate Paper Competition",
        "Hanium ICT Competition - 2 awards (Encouragement, Selection)",
        "Grand Prize at Hanium Academic Conference",
        "Selected for MOE Top 300 Student Startup Team",
        "Gold Award at University Startup Competition",
      ],
    },
    tech: ["Python", "YOLO", "ROS", "Android", "Java", "PHP", "AWS"],
  },
  {
    id: "bns-soft",
    company: { ko: "㈜비에네스소프트", en: "BNS Soft Inc." },
    role: { ko: "SSD 사업부 / 인턴", en: "Mobile Developer Intern" },
    period: "2020.01 ~ 2020.06",
    duration: { ko: "6개월", en: "6 mo" },
    description: {
      ko: "노인돌봄 서비스 앱 및 공유 다이어리 앱 개발",
      en: "Developed Elderly Care Service & Shared Diary Mobile Apps",
    },
    achievements: {
      ko: [
        "노인돌봄 서비스 앱 개발 (Android, Java)",
        "EXO PLAYER 라이브러리 기반 음악/동영상 플레이어 UI 개발",
        "TTS(Text to Speak) 기능 구현",
        "Google Dialogflow 기반 음성 대화 기능 구현",
        "Spring Framework 기반 RestFul API 설계 및 제작",
      ],
      en: [
        "Built Android elderly care app with accessible UI/UX design",
        "Implemented media player with ExoPlayer for music/video streaming",
        "Integrated Text-to-Speech (TTS) for voice assistance features",
        "Developed voice-based conversational AI using Google Dialogflow",
        "Designed and built RESTful APIs with Spring Framework",
      ],
    },
    tech: ["Android", "Java", "Spring", "MySQL", "DialogFlow", "Git"],
  },
];

export const projects: Project[] = [
  {
    id: "zk-private-lending",
    experienceId: "personal",
    name: {
      ko: "ZK-Private DeFi Lending",
      en: "ZK-Private DeFi Lending",
    },
    description: {
      ko: "영지식증명 기반 프라이버시 보호 DeFi 대출 프로토콜. Halo2 + arkworks + Circom 3스택으로 동일 회로 구현하여 각 스택 장단점 비교 분석.",
      en: "Privacy-preserving DeFi lending protocol using Zero-Knowledge Proofs. Implementing identical circuits in Halo2 + arkworks + Circom to compare trade-offs across ZK stacks.",
    },
    period: "2024.12 ~ Present",
    team: { ko: "1인 (개인 프로젝트)", en: "Solo Project" },
    role: { ko: "ZK 회로 설계 & 풀스택 개발", en: "ZK Circuit Design & Full-Stack Development" },
    highlights: {
      ko: [
        "ZK 삼위일체: Halo2 (Primary) + arkworks + Circom 동일 회로 구현",
        "Halo2 PLONKish: Lookup table, Custom gate 활용 효율적 회로 설계",
        "CollateralProof, LTVProof, LiquidationProof 3개 핵심 회로",
        "R1CS vs PLONKish 패러다임 비교 분석 문서화",
        "Solidity Verifier 온체인 검증 (~200K gas, L2 $0.01)",
        "Rust/Axum 백엔드 + Next.js 프론트엔드 풀스택",
      ],
      en: [
        "ZK Trinity: Same circuit in Halo2 (Primary) + arkworks + Circom",
        "Halo2 PLONKish: Efficient circuit design with lookup tables & custom gates",
        "3 core circuits: CollateralProof, LTVProof, LiquidationProof",
        "R1CS vs PLONKish paradigm comparison documentation",
        "Solidity Verifier for on-chain verification (~200K gas, $0.01 on L2)",
        "Full-stack: Rust/Axum backend + Next.js frontend",
      ],
    },
    tech: ["Halo2", "arkworks", "Circom", "Rust", "Solidity", "BN254", "Groth16", "Next.js", "TypeScript"],
    status: "in_progress",
    links: {
      github: "https://github.com/nara020/zk-private-lending",
    },
  },
  {
    id: "b2b-supply-chain",
    experienceId: "creativecode",
    name: {
      ko: "B2B 공급망 관리 플랫폼",
      en: "B2B Supply Chain Management Platform",
    },
    description: {
      ko: "블록체인 기반 공급망 투명성 및 ZKP 프라이버시 보호 플랫폼. EU DPP(디지털 제품 여권) 규제 대응을 위한 영지식증명 시스템 설계 및 구현.",
      en: "Enterprise blockchain platform ensuring supply chain transparency with ZKP privacy. Designed for EU DPP (Digital Product Passport) regulatory compliance.",
    },
    period: "2025.06 ~ Present",
    team: { ko: "4인", en: "Team of 4" },
    role: { ko: "블록체인 아키텍트 & 백엔드 개발", en: "Blockchain Architect & Backend Developer" },
    highlights: {
      ko: [
        "Hyperledger Besu 26배 성능 최적화 (25TPS → 650TPS) - 합의 알고리즘, pm2 클러스터, Virtual Thread 도입",
        "Groth16 영지식증명 아키텍처 설계 - snarkjs, circom 기반 ZK 회로 구현",
        "한국정보처리학회 추계학술대회 논문 발표 (DPP 규제 대응 ZKP 시스템)",
        "IEEE ICBTA 2024 논문 어셉 - 12월 13일 발표 예정",
        "Solidity 스마트컨트랙트 (UUPS Proxy 패턴, ZK 검증, IPFS CID 연동)",
        "Python 기반 Besu 네트워크 자동화 배포 도구 개발",
        "TTA 클라우드 적격성 평가 담당",
      ],
      en: [
        "26x TPS optimization on Hyperledger Besu (25→650 TPS) - consensus tuning, pm2 cluster, Virtual Thread",
        "Designed Groth16 ZKP architecture - implemented ZK circuits using snarkjs and circom",
        "Published paper at KIPS Fall Conference (ZKP system for EU DPP compliance)",
        "IEEE ICBTA 2024 paper accepted - presenting December 13th",
        "Solidity smart contracts with UUPS Proxy pattern, ZK verification, IPFS CID integration",
        "Built Python automation tool for Besu network deployment",
        "Led TTA cloud qualification assessment",
      ],
    },
    tech: ["Hyperledger Besu", "Solidity", "ZKP/Groth16", "snarkjs", "circom", "IPFS", "Node.js", "TypeScript", "Python", "Docker", "Jenkins"],
  },
  {
    id: "b-space",
    experienceId: "smartm2m",
    name: { ko: "B-SPACE 블록체인 컨벤션", en: "B-SPACE Blockchain Convention Platform" },
    description: {
      ko: "부산 블록체인 특화 벤처컨벤션 플랫폼. 회의실 예약, 장치 관리, 사용자 인증을 블록체인으로 처리하는 시스템.",
      en: "Busan's blockchain-powered venture convention platform. Meeting room reservations, device management, and user authentication on blockchain.",
    },
    period: "2022.02 ~ 2023.06",
    team: { ko: "6인", en: "Team of 6" },
    role: { ko: "블록체인 개발 & 백엔드 API 설계", en: "Blockchain Developer & Backend API Design" },
    highlights: {
      ko: [
        "Hyperledger Fabric 네트워크 3개 독립 구축 (개발/테스트/교육용) - Docker Compose 기반",
        "TTA 성능 인증 통과 - 쓰기 400 TPS, 읽기 1000 TPS 달성 (JMeter 부하 테스트)",
        "Go lang 기반 Fabric ChainCode 개발 - 회의실/장치 예약 CRUD, 권한 검증 로직",
        "TypeScript 백엔드 API 개발 - JWT 인증, RBAC 권한 시스템, Fabric SDK 연동",
        "한국컴퓨터정보학회 하계학술대회 우수논문상 수상",
        "Swagger API 문서 제작 및 프론트엔드 팀 연동 지원",
        "서비스 상용화 및 운영 유지보수 담당",
      ],
      en: [
        "Deployed 3 independent Hyperledger Fabric networks (dev/test/education) - Docker Compose based",
        "Achieved TTA performance certification - 400 TPS write, 1000 TPS read (JMeter load testing)",
        "Developed Fabric ChainCode in Go - room/device reservation CRUD, permission validation",
        "Built TypeScript backend APIs - JWT auth, RBAC permissions, Fabric SDK integration",
        "Won Best Paper Award at KCIS Summer Conference",
        "Created Swagger API docs and supported frontend team integration",
        "Led service commercialization and ongoing operations",
      ],
    },
    tech: ["Hyperledger Fabric", "Go", "TypeScript", "Node.js", "Docker", "React", "Grafana", "MariaDB", "Nginx", "JMeter"],
    links: { demo: "https://www.b-space.kr/" },
  },
  {
    id: "disaster-drone",
    experienceId: "university",
    name: { ko: "AI 재난 군집드론", en: "AI-Powered Disaster Response Swarm Drone" },
    description: {
      ko: "딥러닝 기반 산불 감지 및 군집 드론 시스템. 졸업작품으로 KCI 급 논문 등재 및 다수 수상.",
      en: "Deep learning based wildfire detection with swarm drone system. Graduation project with KCI journal publication and multiple awards.",
    },
    period: "2020.04 ~ 2020.11",
    team: { ko: "4인 (팀장)", en: "Team of 4 (Lead)" },
    role: { ko: "팀장 & 드론 통신 시스템 개발", en: "Team Lead & Drone Communication System" },
    highlights: {
      ko: [
        "PIXHAWK 비행 컨트롤러 + JETSON NANO GPU 기반 하드웨어 설계",
        "MAVLINK 프로토콜 기반 드론 군집 통신 시스템 구현",
        "YOLO v3 기반 산불 감지 딥러닝 모델 학습 및 적용 (정확도 92%)",
        "ROS (Robot Operating System) 기반 드론 제어 소프트웨어 개발",
        "한이음 ICT 공모전 장려상 수상 (과학기술정보통신부)",
        "KCI 급 논문 KTCCS 등재 - 졸업논문",
        "정보처리학회 학부생 논문경진대회 대상 수상",
      ],
      en: [
        "Designed hardware with PIXHAWK flight controller + JETSON NANO GPU board",
        "Implemented drone swarm communication using MAVLINK protocol",
        "Trained YOLO v3 model for wildfire detection (92% accuracy)",
        "Developed drone control software based on ROS (Robot Operating System)",
        "Won Hanium ICT Competition Award (Ministry of Science and ICT)",
        "Published in KCI-indexed journal KTCCS - graduation thesis",
        "Grand Prize at KIPS Undergraduate Paper Competition",
      ],
    },
    tech: ["Python", "YOLO v3", "ROS", "Raspberry Pi", "JETSON NANO", "C++", "MAVLINK", "MAVROS", "OpenCV"],
    links: {
      demo: "https://www.youtube.com/watch?v=3CGwitZjkCo",
      paper: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002713076"
    },
  },
  {
    id: "qr-restaurant",
    experienceId: "university",
    name: { ko: "QR 다국어 식당 추천 앱", en: "QR-Based Multilingual Restaurant Finder" },
    description: {
      ko: "외국인 관광객을 위한 QR코드 기반 다국어 전자메뉴판 및 현지 식당 추천 서비스. 학부 캡스톤 프로젝트.",
      en: "QR-based multilingual e-menu and local restaurant recommendation for foreign tourists. Undergraduate capstone project.",
    },
    period: "2019.04 ~ 2019.11",
    team: { ko: "5인 (팀장)", en: "Team of 5 (Lead)" },
    role: { ko: "팀장 & 백엔드/안드로이드 개발", en: "Team Lead & Backend/Android Development" },
    highlights: {
      ko: [
        "AWS EC2 기반 PHP 웹서버 구축 - RESTful API 설계",
        "Google Maps SDK 연동 - 현재 위치 기반 주변 식당 검색",
        "QR코드 스캔 → 다국어 메뉴 표시 (한/영/중/일)",
        "Android 앱 개발 - 메뉴 번역, 식당 검색, 즐겨찾기 기능",
        "2019 한이음 ICT 공모전 입선 (과학기술정보통신부)",
        "정보처리학회 추계 학술대회 논문 게재",
      ],
      en: [
        "Built PHP web server on AWS EC2 with RESTful API design",
        "Integrated Google Maps SDK for location-based restaurant discovery",
        "QR code scan → multilingual menu display (KR/EN/CN/JP)",
        "Developed Android app - menu translation, restaurant search, favorites",
        "Selected for 2019 Hanium ICT Competition (Ministry of Science and ICT)",
        "Published paper at KIPS Fall Conference",
      ],
    },
    tech: ["AWS EC2", "PHP", "MySQL", "Android", "Java", "Google Maps API", "ZXing QR"],
    links: {
      demo: "https://www.youtube.com/watch?v=42x8d3F515U",
      paper: "https://koreascience.kr/article/CFKO201924664107123.page"
    },
  },
];

export const awards: Award[] = [
  {
    id: "opic",
    name: { ko: "OPIC IH (Intermediate High)", en: "OPIc IH (Intermediate High)" },
    issuer: { ko: "영어", en: "ACTFL" },
    date: "2025.02",
    type: "certification",
  },
  {
    id: "kcis-paper",
    name: { ko: "한국컴퓨터정보학회 우수논문상", en: "Best Paper Award" },
    issuer: { ko: "한국컴퓨터정보학회", en: "Korean Computer Information Society (KCIS)" },
    date: "2022.07",
    type: "award",
  },
  {
    id: "engineer-info",
    name: { ko: "정보처리기사", en: "Information Processing Engineer" },
    issuer: { ko: "한국산업인력공단", en: "Human Resources Development Service of Korea" },
    date: "2021.11",
    type: "certification",
  },
  {
    id: "hanium-2020",
    name: { ko: "2020 한이음 ICT 공모전 장려상", en: "Encouragement Award" },
    issuer: { ko: "과학기술정보통신부", en: "Hanium ICT Competition (MSIT)" },
    date: "2020.12",
    type: "award",
  },
  {
    id: "hanium-academic",
    name: { ko: "한이음 학술대회 최우수상", en: "Grand Prize" },
    issuer: { ko: "한국정보산업연합회", en: "Hanium Academic Conference (FKII)" },
    date: "2020.12",
    type: "award",
  },
  {
    id: "kips-undergraduate",
    name: { ko: "학부생 논문경진대회 대상", en: "Grand Prize" },
    issuer: { ko: "한국정보처리학회", en: "KIPS Undergraduate Paper Competition" },
    date: "2020.11",
    type: "award",
  },
  {
    id: "startup-300",
    name: { ko: "학생 창업유망팀 300 선정", en: "Top 300 Selection" },
    issuer: { ko: "교육부", en: "Student Startup Program (MOE)" },
    date: "2020.08",
    type: "award",
  },
  {
    id: "hanium-2019",
    name: { ko: "2019 한이음 ICT 공모전 입선", en: "Selection Award" },
    issuer: { ko: "과학기술정보통신부", en: "Hanium ICT Competition (MSIT)" },
    date: "2019.12",
    type: "award",
  },
];

export const education: Education[] = [
  {
    id: "suwon-univ",
    school: { ko: "수원대학교 (4년제)", en: "Suwon University" },
    major: { ko: "정보통신공학과", en: "B.S. in Information & Telecommunication Engineering" },
    period: "2015.03 ~ 2021.08",
    status: { ko: "졸업", en: "Graduated" },
    gpa: "3.73/4.5",
    thesis: {
      ko: "딥러닝 기반 객체 인식과 최적 경로 탐색을 통한 멀티 재난 드론 시스템 설계 및 구현 (KCI 급 저널 등재)",
      en: "Multi-Disaster Drone System with Deep Learning Object Detection and Optimal Path Planning (Published in KCI Journal)",
    },
  },
];

export const skills: Skill[] = [
  {
    category: "Blockchain",
    items: [
      { name: "Hyperledger Fabric", level: 85 },
      { name: "Hyperledger Besu", level: 80 },
      { name: "Solidity", level: 75 },
      { name: "ZKP (Halo2/arkworks/Circom)", level: 70 },
      { name: "IPFS", level: 75 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 80 },
      { name: "TypeScript", level: 80 },
      { name: "Go", level: 70 },
      { name: "Java/Spring", level: 65 },
      { name: "Python", level: 75 },
    ],
  },
  {
    category: "Infra & DevOps",
    items: [
      { name: "Docker", level: 80 },
      { name: "Linux", level: 75 },
      { name: "Jenkins CI/CD", level: 70 },
      { name: "Nginx", level: 70 },
      { name: "AWS/NCP", level: 65 },
    ],
  },
];

export const contact: Contact = {
  email: "jinhyeokcc@gmail.com",
  phone: "", // 포트폴리오에서 숨김
  github: "https://github.com/nara020",
  linkedin: "https://www.linkedin.com/in/jinhyeok1228",
  location: { ko: "서울 서초구", en: "Seocho, Seoul" },
};

// 핵심 성과 지표
export const keyMetrics = {
  tpsImprovement: { value: "26x", desc: { ko: "TPS 성능 향상", en: "TPS Performance" } },
  papers: { value: "5+", desc: { ko: "논문 발표 (IEEE, KCI)", en: "Papers (IEEE, KCI)" } },
  awards: { value: "8+", desc: { ko: "수상 실적", en: "Awards" } },
  projects: { value: "4+", desc: { ko: "상용 프로젝트", en: "Production Projects" } },
  experience: {
    value: { ko: "3+", en: "3+" },
    desc: { ko: "년 경력", en: "Years Exp." }
  },
};
