import type { Experience, Project, Skill, Contact, Award, Education, Paper } from "./types";

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
    role: { ko: "블록체인 개발팀 / 대리", en: "Blockchain Developer (Assistant Manager)" },
    period: "2025.06 ~ Present",
    duration: { ko: "재직중", en: "Current" },
    current: true,
    description: {
      ko: "B2B 마켓 플레이스 및 공급망 관리 플랫폼 개발",
      en: "Building B2B Marketplace & Supply Chain Management Platform",
    },
    achievements: {
      ko: [
        "Hyperledger Besu 성능 최적화 (25TPS → 678TPS, 27배 향상)",
        "Groth16 기반 영지식증명(ZKP) 아키텍처 설계 및 구현",
        "한국정보처리학회 추계학술대회 논문 발표 (DPP 규제 대응 ZKP 시스템)",
        "TTA 클라우드 적격성 평가 진행 담당",
        "Solidity 스마트컨트랙트 개발 (Proxy 패턴, ZK 검증, IPFS CID 연동)",
        "Python 기반 Hyperledger Besu 구축 자동화 툴 개발",
        "정부 데이터 API(틸코블렛) 연동 프로젝트 진행",
      ],
      en: [
        "Achieved 27x TPS improvement on Hyperledger Besu (25 → 678 TPS)",
        "Designed and implemented Groth16-based Zero-Knowledge Proof architecture",
        "Published paper at KIPS Fall Conference (ZKP system for EU DPP compliance)",
        "Led TTA cloud qualification assessment process",
        "Developed Solidity smart contracts with Proxy pattern and ZK verification",
        "Built Python automation tool for Hyperledger Besu network deployment",
        "Integrated government data APIs for regulatory compliance",
      ],
    },
    tech: ["Hyperledger Besu", "Solidity", "ZKP/Groth16", "Node.js", "TypeScript", "IPFS", "SpringBoot", "Python", "Docker", "Jenkins"],
    type: "work",
  },
  {
    id: "global-experience",
    company: { ko: "글로벌 역량 강화", en: "Global Competency Development" },
    role: { ko: "어학연수 & 워킹홀리데이", en: "Language Study & Working Holiday" },
    period: "2023.07 ~ 2025.05",
    duration: { ko: "1년 11개월", en: "1 yr 11 mo" },
    description: {
      ko: "ChatGPT 시대, 영어 정보 접근성의 중요성을 체감하고 글로벌 역량 강화를 위해 해외 체류",
      en: "Pursued global competency development recognizing the importance of English information access in the ChatGPT era",
    },
    achievements: {
      ko: [
        "필리핀 어학연수 → 호주 워킹홀리데이 → 동남아 6개국+ 체류",
        "OPIC IH (Intermediate High) 취득 - 영어 커뮤니케이션 역량 입증",
        "해외 인바운드 여행 사업 기획 및 운영 보조 (프리랜서)",
        "블록체인 R&D 중 영어 논문/문서 독해 필요성 체감 → 환경 변화 결심",
        "다양한 문화권 경험을 통한 글로벌 마인드셋 확립",
      ],
      en: [
        "Philippines language study → Australia Working Holiday → 6+ Southeast Asian countries",
        "Achieved OPIC IH (Intermediate High) - Proven English communication skills",
        "Assisted inbound travel business planning and operations (Freelance)",
        "Recognized need for English proficiency in blockchain R&D → Decided to change environment",
        "Established global mindset through diverse cultural experiences",
      ],
    },
    tech: ["English", "Global Networking", "Cross-cultural Communication"],
    type: "other",
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
    type: "work",
  },
  {
    id: "suwon-university",
    company: { ko: "수원대학교 산학협력단", en: "Suwon University Industry-Academia Cooperation" },
    role: { ko: "TLO 부서 / 연구원 (계약직)", en: "Technology Licensing Researcher (Contract)" },
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
    type: "work",
  },
  {
    id: "university",
    company: { ko: "수원대학교 네트워크 연구실", en: "Suwon University Network Lab" },
    role: { ko: "정보통신공학과 / 학부 연구생", en: "Undergraduate Researcher" },
    period: "2018.03 ~ 2021.08",
    duration: { ko: "3년 6개월", en: "3 yrs 6 mo" },
    description: {
      ko: "네트워크/IoT 연구 참여, 캡스톤 프로젝트, 공모전, 학술논문 발표",
      en: "Network/IoT research, capstone projects, competitions, academic publications",
    },
    achievements: {
      ko: [
        "IEEE IAEAC 2019 국제학술대회 논문 공저자",
        "KCI 등재 저널 논문 게재 (KTCCS) - 졸업논문",
        "정보처리학회 학부생 논문경진대회 대상",
        "한이음 ICT 공모전 장려상/입선 2회 수상",
        "한이음 학술대회 최우수상",
        "교육부 학생 창업유망팀 300 선정",
        "교내 창업경진대회 금상",
      ],
      en: [
        "Co-author at IEEE IAEAC 2019 International Conference",
        "Published in KCI-indexed journal KTCCS - graduation thesis",
        "Grand Prize at KIPS Undergraduate Paper Competition",
        "Hanium ICT Competition - 2 awards (Encouragement, Selection)",
        "Grand Prize at Hanium Academic Conference",
        "Selected for MOE Top 300 Student Startup Team",
        "Gold Award at University Startup Competition",
      ],
    },
    tech: ["Python", "YOLO", "ROS", "Android", "Java", "PHP", "AWS", "Sensor Networks"],
    type: "research",
  },
  {
    id: "military",
    company: { ko: "대한민국 해병대", en: "Republic of Korea Marine Corps" },
    role: { ko: "유/무선 통신운용병", en: "Signal Communications Operator" },
    period: "2016.03 ~ 2017.12",
    duration: { ko: "1년 10개월", en: "1 yr 10 mo" },
    description: {
      ko: "전방 부대 유무선 통신망 구축 및 운용, 지휘통제 통신 지원",
      en: "Wired/Wireless communication network operation and command control support at forward bases",
    },
    achievements: {
      ko: [
        "DDU/RLI 등 통신장비 활용 유무선 통신망 구축 및 운용",
        "전방 초소 전화선/인터넷 망 가설 및 수리",
        "CCTV 감시 시스템 설치 및 유지보수",
        "지휘통제실 무전/교환 근무 수행",
      ],
      en: [
        "Built and operated wired/wireless communication networks using DDU/RLI equipment",
        "Installed and repaired phone/internet lines at forward outposts",
        "Installed and maintained CCTV surveillance systems",
        "Performed radio/switchboard operations in command control center",
      ],
    },
    tech: ["Military Communications", "DDU/RLI", "Network Infrastructure", "CCTV"],
    type: "military",
  },
  {
    id: "bns-soft",
    company: { ko: "㈜비에네스소프트", en: "BNS Soft Inc." },
    role: { ko: "SSD 사업부 / 팀원 (계약직)", en: "Mobile Developer (Contract)" },
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
    type: "work",
  },
];

export const projects: Project[] = [
  {
    id: "consensus-lab",
    experienceId: "personal",
    name: {
      ko: "Consensus Lab",
      en: "Consensus Lab",
    },
    description: {
      ko: "블록체인 합의 알고리즘 3D 인터랙티브 시각화. PoW, PoS, RAFT, IBFT 2.0 4가지 합의 메커니즘을 Three.js로 시각화한 교육용 오픈소스 프로젝트.",
      en: "Interactive 3D visualization of blockchain consensus mechanisms. Educational open-source project visualizing PoW, PoS, RAFT, IBFT 2.0 using Three.js.",
    },
    period: "2024.12 ~ Present",
    team: { ko: "1인 (개인 프로젝트)", en: "Solo Project" },
    role: { ko: "풀스택 개발 & 3D 시각화", en: "Full-Stack Development & 3D Visualization" },
    highlights: {
      ko: [
        "4가지 합의 알고리즘 실시간 3D 시각화 (PoW, PoS, RAFT, IBFT)",
        "Bitcoin SHA-256 마이닝, Ethereum Casper FFG 시뮬레이션",
        "Hyperledger Fabric RAFT, Besu IBFT 2.0 BFT 합의 시각화",
        "Three.js + React Three Fiber 기반 인터랙티브 3D 그래픽",
        "오디오 피드백 (채굴, 투표, 확정 사운드 이펙트)",
        "오픈소스 교육용 프로젝트로 공개",
      ],
      en: [
        "Real-time 3D visualization of 4 consensus algorithms (PoW, PoS, RAFT, IBFT)",
        "Bitcoin SHA-256 mining, Ethereum Casper FFG simulation",
        "Hyperledger Fabric RAFT, Besu IBFT 2.0 BFT consensus visualization",
        "Interactive 3D graphics with Three.js + React Three Fiber",
        "Audio feedback (mining, voting, finalization sound effects)",
        "Open-source educational project",
      ],
    },
    tech: ["Next.js", "Three.js", "React Three Fiber", "TypeScript", "Framer Motion", "Tailwind CSS"],
    status: "in_progress",
    featured: true,
    links: {
      demo: "https://consensus-lab.vercel.app",
      github: "https://github.com/nara020/consensus-lab",
    },
  },
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
    featured: true,
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
        "Hyperledger Besu 27배 성능 최적화 (25TPS → 678TPS) - Java 21 Virtual Threads, Transaction Isolation Pattern, PM2 Cluster Mode 적용",
        "Groth16 영지식증명 아키텍처 설계 - snarkjs, circom 기반 ZK 회로 구현",
        "한국정보처리학회 추계학술대회 논문 발표 (DPP 규제 대응 ZKP 시스템)",
        "IEEE ICBTA 2025 논문 발표 완료 (12월)",
        "Solidity 스마트컨트랙트 (UUPS Proxy 패턴, ZK 검증, IPFS CID 연동)",
        "Python 기반 Besu 네트워크 자동화 배포 도구 개발",
        "TTA 클라우드 적격성 평가 담당",
      ],
      en: [
        "27x TPS optimization on Hyperledger Besu (25→678 TPS) - Java 21 Virtual Threads, Transaction Isolation Pattern, PM2 Cluster Mode",
        "Designed Groth16 ZKP architecture - implemented ZK circuits using snarkjs and circom",
        "Published paper at KIPS Fall Conference (ZKP system for EU DPP compliance)",
        "IEEE ICBTA 2025 paper presented (December)",
        "Solidity smart contracts with UUPS Proxy pattern, ZK verification, IPFS CID integration",
        "Built Python automation tool for Besu network deployment",
        "Led TTA cloud qualification assessment",
      ],
    },
    tech: ["Hyperledger Besu", "Solidity", "ZKP/Groth16", "snarkjs", "circom", "IPFS", "Node.js", "TypeScript", "Python", "Docker", "Jenkins"],
    status: "in_progress",
    featured: true,
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
    status: "completed",
    featured: true,
    links: { demo: "https://www.b-space.kr/" },
  },
  {
    id: "disaster-drone",
    experienceId: "university",
    name: { ko: "AI 재난 군집드론", en: "AI-Powered Disaster Response Swarm Drone" },
    description: {
      ko: "딥러닝 기반 산불 감지 및 군집 드론 시스템. 졸업작품으로 KCI 등재 저널 게재 및 다수 수상.",
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
        "KCI 등재 저널(KTCCS) 논문 게재 - 졸업논문",
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
    status: "completed",
    featured: true,
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
  {
    id: "iot-blockchain-mainnet",
    experienceId: "smartm2m",
    name: { ko: "IoT 블록체인 메인넷 R&D", en: "IoT Blockchain Mainnet R&D" },
    description: {
      ko: "IoT 데이터 추적/검증을 위한 자체 메인넷 연구개발. ZK Rollup, 합의 알고리즘, 네트워크 최적화 연구.",
      en: "R&D for proprietary mainnet for IoT data tracking/verification. Research on ZK Rollup, consensus algorithms, and network optimization.",
    },
    period: "2022.04 ~ 2023.06",
    team: { ko: "연구원 10인", en: "Team of 10 Researchers" },
    role: { ko: "연구원 (3개년 국가 R&D 과제 중 1,2년차 참여)", en: "Researcher (Participated in Year 1-2 of 3-year National R&D Project)" },
    highlights: {
      ko: [
        "이더리움 EVM 분석 및 세미나",
        "Layer2 기술 조사/분석 및 세미나",
        "Rollup(Optimistic Rollup, ZK Rollup) 기술 분석 및 세미나",
        "영지식증명 메인넷 Mina Protocol 분석 및 세미나",
        "정보처리학회 우수논문상 수상 (블록체인 기반 조작불가능한 확률제어 시스템)",
      ],
      en: [
        "Ethereum EVM analysis and seminar",
        "Layer2 technology research/analysis and seminar",
        "Rollup (Optimistic Rollup, ZK Rollup) technology analysis and seminar",
        "ZKP mainnet Mina Protocol analysis and seminar",
        "Won Best Paper Award at KIPS (Blockchain-based tamper-proof probability control system)",
      ],
    },
    tech: ["Ethereum", "Layer2", "ZK Rollup", "Optimistic Rollup", "Mina Protocol", "Research"],
  },
  {
    id: "daegu-mainnet-isp",
    experienceId: "smartm2m",
    name: { ko: "대구 메인넷 ISP 프로젝트", en: "Daegu Mainnet ISP Project" },
    description: {
      ko: "대구광역시 NFT 메인넷 ISP 프로젝트. NFT 발행/전송 모듈 설계 및 스마트컨트랙트 개발.",
      en: "NFT Mainnet ISP project for Daegu Metropolitan City. Designed NFT minting/transfer modules and smart contract development.",
    },
    period: "2022.11 ~ 2023.06",
    team: { ko: "연구개발자 8인", en: "Team of 8 R&D Engineers" },
    role: { ko: "연구 개발", en: "Research & Development" },
    highlights: {
      ko: [
        "메인넷 미들웨어 중 NFT 모듈 설계",
        "TTA 시험검증 방안 설계",
        "헬스케어 분야 메인넷 활용 서비스 설계",
      ],
      en: [
        "Designed NFT module for mainnet middleware",
        "Designed TTA test verification methodology",
        "Designed healthcare service utilizing mainnet",
      ],
    },
    tech: ["Research", "NFT", "TTA", "Healthcare", "ISP"],
  },
  {
    id: "amazon-crawling-shopify",
    experienceId: "creativecode",
    name: { ko: "대규모 아마존 쇼핑몰 크롤링 및 쇼피파이 업로드 플랫폼", en: "Large-scale Amazon Crawling & Shopify Upload Platform" },
    description: {
      ko: "Electron 기반 아마존 상품 크롤링 및 Shopify 대량 업로드 플랫폼. 최초 계약 대비 40배 규모 추가 개발 수주.",
      en: "Electron-based Amazon product crawling and Shopify bulk upload platform. Secured 40x additional development contracts.",
    },
    period: "2025.11 ~ Present",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "풀스택 개발 & 고객 커뮤니케이션", en: "Full-Stack Development & Client Communication" },
    highlights: {
      ko: [
        "3번째 담당 개발사로서 기존 프로젝트 분석 및 환경설정",
        "2번의 개발사에서 해결되지 않은 '크롤링' 고도화 및 '대량 업로드' 기능 에러 해결",
        "분산된 인프라(AWS + Cafe24) 분석 및 분리 성공",
        "빠른 디버깅과 고객사 소통으로 서비스 핵심 에러 일주일 내 해결",
        "최초 계약 대비 약 40배 규모의 추가 개발 계약 수주 성공",
      ],
      en: [
        "Took over as 3rd development company, analyzed existing project",
        "Resolved crawling and bulk upload errors unresolved by 2 previous vendors",
        "Successfully separated distributed infrastructure (AWS + Cafe24)",
        "Resolved critical service errors within one week through quick debugging",
        "Secured 40x additional development contracts compared to initial contract",
      ],
    },
    tech: ["Electron", "TypeScript", "CloudFlare", "PostgreSQL", "AWS"],
    status: "in_progress",
    featured: true,
  },
  {
    id: "gov-data-api",
    experienceId: "creativecode",
    name: { ko: "정부 데이터 API 연동", en: "Government Data API Integration" },
    description: {
      ko: "틸코블렛 기반 정부 데이터 API 연동 프로젝트. 재활용 원료 공급망 검증을 위한 공공 데이터 연동.",
      en: "Government data API integration using Tilco Blet. Public data integration for recycled material supply chain verification.",
    },
    period: "2025.08 ~ Present",
    team: { ko: "2인", en: "Team of 2" },
    role: { ko: "API 연동 개발", en: "API Integration Development" },
    highlights: {
      ko: [
        "틸코블렛 정부 데이터 API 연동 (사업자 정보, 인증서 검증)",
        "공급망 참여자 신원 검증 시스템 구축",
        "API 응답 데이터 파싱 및 블록체인 연동 로직 개발",
        "데이터 정합성 검증 및 에러 핸들링 구현",
      ],
      en: [
        "Integrated Tilco Blet government data APIs (business info, certificate verification)",
        "Built supply chain participant identity verification system",
        "Developed API response parsing and blockchain integration logic",
        "Implemented data integrity validation and error handling",
      ],
    },
    tech: ["Node.js", "TypeScript", "REST API", "Hyperledger Besu", "Data Integration"],
    status: "in_progress",
  },
  {
    id: "elderly-care-app",
    experienceId: "bns-soft",
    name: { ko: "노인돌봄 서비스 앱", en: "Elderly Care Service App" },
    description: {
      ko: "노인 돌봄 서비스를 위한 안드로이드 앱. 음성 대화, TTS, 미디어 플레이어 기능 구현.",
      en: "Android app for elderly care services. Implemented voice conversation, TTS, and media player features.",
    },
    period: "2020.02 ~ 2020.06",
    team: { ko: "5인", en: "Team of 5" },
    role: { ko: "안드로이드 개발", en: "Android Development" },
    highlights: {
      ko: [
        "EXO PLAYER 라이브러리를 이용한 음악/동영상 플레이어 UI 및 기능 개발",
        "기억력 테스트 게임 APP 전면 수정 (레거시 코드 기반 UI, 게임동작, 기능 수정)",
        "음성인식 기능 구현",
        "TTS(Text to Speak) 기능 구현",
        "Google DialogFlow를 App과 접목한 대화 기능 구현",
        "Broadcast를 이용한 APP 간 통신 구현",
      ],
      en: [
        "Developed music/video player UI using EXO PLAYER library",
        "Complete redesign of memory test game APP (legacy code-based UI, game logic, features)",
        "Implemented voice recognition functionality",
        "Implemented TTS (Text to Speech) functionality",
        "Integrated Google DialogFlow for conversational AI in app",
        "Implemented inter-app communication using Broadcast",
      ],
    },
    tech: ["Android", "Java", "ExoPlayer", "Google TTS", "Dialogflow", "Spring"],
  },
  {
    id: "shared-diary-app",
    experienceId: "bns-soft",
    name: { ko: "공유 다이어리 앱", en: "Shared Diary App" },
    description: {
      ko: "친구/가족과 일기를 공유하는 안드로이드 앱. 사진 첨부, 댓글, 푸시 알림 기능 구현.",
      en: "Android app for sharing diaries with friends/family. Implemented photo attachments, comments, and push notifications.",
    },
    period: "2020.01 ~ 2020.01",
    team: { ko: "2인", en: "Team of 2" },
    role: { ko: "백엔드 개발", en: "Backend Development" },
    highlights: {
      ko: [
        "Spring Framework 기반 RESTful API 설계 및 제작",
        "DB 설계 및 구현 (MySQL)",
        "회원가입, 로그인, 글쓰기/수정/삭제, 좋아요/싫어요, 신고하기, 댓글작성, 소셜 SNS 기능 개발",
      ],
      en: [
        "Designed and built RESTful API based on Spring Framework",
        "Designed and implemented MySQL database",
        "Developed signup, login, CRUD posts, likes/dislikes, report, comments, social SNS features",
      ],
    },
    tech: ["Spring Framework", "Java", "JavaScript", "MySQL"],
  },
  {
    id: "blockchain-maintenance",
    experienceId: "creativecode",
    name: { ko: "블록체인 서비스 유지보수", en: "Blockchain Service Maintenance" },
    description: {
      ko: "C# 기반 블록체인 시스템(Polygon, BSC) 유지보수. 레거시 코드 분석 및 에러 해결.",
      en: "Maintenance of C#-based blockchain system (Polygon, BSC). Legacy code analysis and error resolution.",
    },
    period: "2025.06 ~ Present",
    role: { ko: "유지보수 담당", en: "Maintenance Lead" },
    highlights: {
      ko: [
        "기존 개발자 퇴사로 인한 C# 기반 블록체인 시스템 인수",
        "백엔드 로그 분석 및 RPC 노드 문제 특정",
        "DB 저장 시 트랜잭션 보장 누락 문제 발견 및 해결",
        "데이터 정합성 수정 및 트랜잭션 보호 로직 추가",
      ],
      en: [
        "Took over C# blockchain system after developer departure",
        "Analyzed backend logs and identified RPC node issues",
        "Discovered and resolved missing transaction guarantee in DB saves",
        "Fixed data integrity and added transaction protection logic",
      ],
    },
    tech: ["C#", "Web3.js", "Solidity", "Polygon", "BSC", "MS SQL"],
    status: "in_progress",
  },
  {
    id: "telemedicine",
    experienceId: "smartm2m",
    name: { ko: "비대면 진료 프로젝트", en: "Telemedicine Project" },
    description: {
      ko: "비대면 진료 서비스를 위한 미디어 서버 및 인증 시스템 구축.",
      en: "Built media server and authentication system for telemedicine service.",
    },
    period: "2022.07 ~ 2022.09",
    team: { ko: "2인", en: "Team of 2" },
    role: { ko: "백엔드 개발", en: "Backend Development" },
    highlights: {
      ko: [
        "TypeScript 기반 Multer를 활용한 미디어 서버 구축",
        "JWT를 활용한 Access Token 및 Refresh Token 관리",
        "사용자 인증 서버 구축",
      ],
      en: [
        "Built media server using TypeScript and Multer",
        "Implemented JWT-based Access Token and Refresh Token management",
        "Developed user authentication server",
      ],
    },
    tech: ["Node.js", "TypeScript", "Docker", "MariaDB", "JWT"],
  },
  {
    id: "mqtt-blockchain-monitoring",
    experienceId: "smartm2m",
    name: { ko: "MQTT 블록체인 이벤트 모니터링", en: "MQTT Blockchain Event Monitoring" },
    description: {
      ko: "Hyperledger Fabric 블록 이벤트를 MQTT로 실시간 모니터링하는 시스템.",
      en: "Real-time monitoring system for Hyperledger Fabric block events via MQTT.",
    },
    period: "2022.09 ~ 2022.09",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "풀스택 개발", en: "Full-Stack Development" },
    highlights: {
      ko: [
        "Hyperledger Fabric 네트워크 구축",
        "Go 기반 CRUD 체인코드 개발 및 배포",
        "BlockListener로 블록정보를 받아 MQTT Publishing하는 Client 개발",
        "MQTT Subscriber 개발",
      ],
      en: [
        "Deployed Hyperledger Fabric network",
        "Developed and deployed Go-based CRUD chaincode",
        "Built MQTT publishing client using BlockListener",
        "Developed MQTT Subscriber",
      ],
    },
    tech: ["Hyperledger Fabric", "Go", "Node.js", "MQTT", "Docker"],
  },
  {
    id: "patient-jwt-server",
    experienceId: "smartm2m",
    name: { ko: "환자 신체신호 정보 처리 시스템 JWT 인증 서버", en: "Patient Vital Signs JWT Auth Server" },
    description: {
      ko: "환자 신체신호 정보 처리를 위한 JWT 기반 인증 서버 개발.",
      en: "JWT-based authentication server for patient vital signs processing system.",
    },
    period: "2022.10 ~ 2023.06",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "백엔드 개발", en: "Backend Development" },
    highlights: {
      ko: [
        "JWT 기반 AccessToken 및 RefreshToken 관리",
        "권한(Role)에 따른 요구사항 로직 구현",
        "Jest 기반 테스트 코드 작성",
        "서비스 유지보수",
      ],
      en: [
        "Implemented JWT-based AccessToken and RefreshToken management",
        "Developed role-based requirement logic",
        "Wrote Jest-based test code",
        "Service maintenance",
      ],
    },
    tech: ["Node.js", "TypeScript", "Jest", "MariaDB", "Docker"],
  },
  {
    id: "ai-iot-security",
    experienceId: "university",
    name: { ko: "AI IoT SW 개발 및 보안관제 인력양성 과정 프로젝트", en: "AI IoT SW Security Training Project" },
    description: {
      ko: "라즈베리파이 기반 IoT 신호등 시스템 및 CCTV 연동 개발.",
      en: "Raspberry Pi based IoT traffic light system and CCTV integration development.",
    },
    period: "2019.07 ~ 2019.07",
    team: { ko: "2인", en: "Team of 2" },
    role: { ko: "개발", en: "Development" },
    highlights: {
      ko: [
        "JavaScript - 신호등 자동 점등, Express 웹서버와 CCTV 조작 모터 연동",
        "C 언어 - Serial 통신으로 모터 제어, 조도/온습도 센서 기반 우산 제어",
        "Python - CCTV 스냅샷 프로그램, 적색 신호등 및 초음파 센서 연동",
        "취업브리지 수기 공모전 최우수상",
      ],
      en: [
        "JavaScript - Traffic light auto-control, Express server with CCTV motor integration",
        "C - Motor control via Serial communication, umbrella control with sensors",
        "Python - CCTV snapshot program with traffic light and ultrasonic sensor integration",
        "Grand Prize at Employment Bridge Essay Competition",
      ],
    },
    tech: ["Raspberry Pi", "Node.js", "Python", "C", "Serial Communication"],
  },
  {
    id: "inbound-travel-booking",
    experienceId: "personal",
    name: { ko: "인바운드 여행사 예약 웹페이지", en: "Inbound Travel Agency Booking Website" },
    description: {
      ko: "WhatsApp 연동 인바운드 여행사 예약 및 관리자 시스템.",
      en: "WhatsApp integrated inbound travel agency booking and admin system.",
    },
    period: "2025.05 ~ 2025.05",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "풀스택 개발", en: "Full-Stack Development" },
    highlights: {
      ko: [
        "웹 페이지 설계 및 구현",
        "WhatsApp 연동",
        "예약 서비스 및 관리자 페이지 개발",
        "DB 설계 및 구현",
        "SEO 최적화 연구 및 적용",
      ],
      en: [
        "Web page design and implementation",
        "WhatsApp integration",
        "Booking service and admin page development",
        "DB design and implementation",
        "SEO optimization research and application",
      ],
    },
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Nginx", "Docker", "Claude Code"],
  },
  {
    id: "audio-to-text",
    experienceId: "personal",
    name: { ko: "Audio To Text 프로그램", en: "Audio To Text Program" },
    description: {
      ko: "오디오 파일을 텍스트로 변환하는 STT 프로그램.",
      en: "STT program that converts audio files to text.",
    },
    period: "2025.02 ~ 2025.02",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "개발", en: "Development" },
    highlights: {
      ko: [
        "오디오 파일 전처리 기능 구현",
        "STT 모델 기반 텍스트 변환 기능 구현",
      ],
      en: [
        "Implemented audio file preprocessing",
        "Implemented STT model-based text conversion",
      ],
    },
    tech: ["Python", "GPT", "STT"],
  },
  {
    id: "crypto-analysis-web",
    experienceId: "personal",
    name: { ko: "암호화폐 시세 및 데이터 분석 웹", en: "Cryptocurrency Price & Data Analysis Web" },
    description: {
      ko: "바이낸스 API 연동 암호화폐 시세 및 데이터 분석 웹 서비스.",
      en: "Cryptocurrency price and data analysis web service with Binance API integration.",
    },
    period: "2024.12 ~ 2024.12",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "풀스택 개발", en: "Full-Stack Development" },
    highlights: {
      ko: [
        "Flask 기반 웹 설계",
        "바이낸스 API 연동",
        "프론트엔드 및 백엔드 구현",
      ],
      en: [
        "Flask-based web design",
        "Binance API integration",
        "Frontend and backend implementation",
      ],
    },
    tech: ["Python", "Flask", "Binance API", "HTML"],
  },
  {
    id: "pdf-image-to-text",
    experienceId: "personal",
    name: { ko: "PDF/Image to Text 추출 프로그램", en: "PDF/Image to Text Extraction Program" },
    description: {
      ko: "OpenCV와 Tesseract OCR을 활용한 이미지/PDF 텍스트 추출 프로그램.",
      en: "Image/PDF text extraction program using OpenCV and Tesseract OCR.",
    },
    period: "2024.08 ~ 2024.08",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "개발", en: "Development" },
    highlights: {
      ko: [
        "이미지 전처리 (OpenCV)",
        "특정 영역 감지",
        "Tesseract OCR 연동",
        "Flask 기반 웹 구현",
      ],
      en: [
        "Image preprocessing with OpenCV",
        "Specific region detection",
        "Tesseract OCR integration",
        "Flask-based web implementation",
      ],
    },
    tech: ["Python", "OpenCV", "Tesseract OCR", "Flask"],
  },
  {
    id: "teachable-machine-web",
    experienceId: "personal",
    name: { ko: "Teachable Machine 활용 웹 서비스", en: "Teachable Machine Web Services" },
    description: {
      ko: "Teachable Machine으로 학습한 AI 모델 기반 다양한 웹 서비스 개발.",
      en: "Various web services using AI models trained with Teachable Machine.",
    },
    period: "2024.03 ~ 2024.05",
    team: { ko: "1인", en: "Solo" },
    role: { ko: "풀스택 개발", en: "Full-Stack Development" },
    highlights: {
      ko: [
        "데이터 수집을 위한 웹 크롤링",
        "수집 데이터 기반 AI 모델 학습",
        "다양한 웹 서비스 개발 (닮은꼴 찾기, 심리 테스트 등)",
        "Netlify 배포",
      ],
      en: [
        "Web crawling for data collection",
        "AI model training with collected data",
        "Various web services (look-alike finder, psychology tests, etc.)",
        "Netlify deployment",
      ],
    },
    tech: ["Node.js", "TypeScript", "Python", "Selenium", "Teachable Machine", "Netlify"],
  },
];

export const awards: Award[] = [
  {
    id: "icbta-2025",
    name: { ko: "ICBTA 2025 1저자 논문 게재", en: "ICBTA 2025 First Author Paper" },
    issuer: { ko: "Springer LNNS (국제학술대회)", en: "Springer LNNS (International Conference)" },
    date: "2025.12",
    type: "paper",
    description: {
      ko: "27-Fold Performance Improvement for Hyperledger Besu",
      en: "27-Fold Performance Improvement for Hyperledger Besu",
    },
  },
  {
    id: "kips-2025",
    name: { ko: "KIPS 2025 추계학술대회 1저자 논문 게재", en: "KIPS 2025 Fall Conference First Author Paper" },
    issuer: { ko: "한국정보처리학회", en: "Korea Information Processing Society" },
    date: "2025.11",
    type: "paper",
  },
  {
    id: "opic",
    name: { ko: "OPIC IH (Intermediate High)", en: "OPIc IH (Intermediate High)" },
    issuer: { ko: "ACTFL", en: "ACTFL" },
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
    id: "ieee-iaeac-2019",
    name: {
      ko: "IEEE IAEAC 2019 논문 게재",
      en: "IEEE IAEAC 2019 Paper Published"
    },
    issuer: {
      ko: "IEEE",
      en: "IEEE"
    },
    date: "2019.12",
    type: "paper",
    description: {
      ko: "차분 진화 알고리즘 기반 센서 노드 배치 최적화를 통한 커버리지 최대화 연구",
      en: "Optimization of Sensor Nodes Deployment Based on An Improved Differential Evolution Algorithm for Coverage Area Maximization"
    }
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
  {
    id: "ict-mentoring",
    name: { ko: "ICT 멘토링 최우수상", en: "Grand Prize" },
    issuer: { ko: "정보통신산업진흥원 (NIPA)", en: "ICT Mentoring Program (NIPA)" },
    date: "2020.12",
    type: "award",
  },
  {
    id: "g-hop",
    name: { ko: "G-HOP 최우수상", en: "Grand Prize" },
    issuer: { ko: "수원시", en: "G-HOP Startup Program (Suwon City)" },
    date: "2020.08",
    type: "award",
  },
  {
    id: "university-startup",
    name: { ko: "대학 창업경진대회 금상", en: "Gold Award" },
    issuer: { ko: "수원대학교", en: "University Startup Competition (Suwon Univ.)" },
    date: "2020.06",
    type: "award",
  },
  {
    id: "employment-bridge",
    name: { ko: "취업브리지 수기 공모전 최우수상", en: "Grand Prize" },
    issuer: { ko: "수원대학교 취업센터", en: "Employment Bridge Essay Competition" },
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
      ko: "딥러닝 기반 객체 인식과 최적 경로 탐색을 통한 멀티 재난 드론 시스템 설계 및 구현 (KCI 등재 저널 게재)",
      en: "Multi-Disaster Drone System with Deep Learning Object Detection and Optimal Path Planning (Published in KCI Journal)",
    },
  },
];

export const skills: Skill[] = [
  {
    category: "Blockchain",
    items: [
      { name: "Hyperledger Fabric", level: 85 },
      { name: "Hyperledger Besu", level: 85 },
      { name: "Solidity", level: 80 },
      { name: "Smart Contract", level: 80 },
      { name: "ZKP/Zero-Knowledge Proof", level: 75 },
      { name: "Groth16/snarkjs/circom", level: 75 },
      { name: "Hardhat", level: 80 },
      { name: "ethers.js/Web3.js", level: 80 },
      { name: "IPFS", level: 75 },
      { name: "EVM", level: 75 },
      { name: "Layer2/Rollup", level: 65 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 85 },
      { name: "Express.js", level: 85 },
      { name: "TypeScript", level: 85 },
      { name: "JavaScript", level: 85 },
      { name: "Java", level: 70 },
      { name: "SpringBoot", level: 70 },
      { name: "Go/Golang", level: 70 },
      { name: "Python", level: 75 },
      { name: "REST API", level: 85 },
      { name: "MSA", level: 65 },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "PostgreSQL", level: 70 },
      { name: "MySQL", level: 65 },
      { name: "MariaDB", level: 65 },
      { name: "CouchDB", level: 60 },
      { name: "MS SQL", level: 55 },
    ],
  },
  {
    category: "DevOps & Infra",
    items: [
      { name: "Docker", level: 85 },
      { name: "Linux/Ubuntu/CentOS", level: 80 },
      { name: "Jenkins", level: 75 },
      { name: "CI/CD", level: 75 },
      { name: "Nginx", level: 75 },
      { name: "AWS", level: 70 },
      { name: "NCP (Naver Cloud)", level: 70 },
      { name: "CloudFlare", level: 70 },
      { name: "Git/GitHub", level: 85 },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React", level: 70 },
      { name: "Next.js", level: 70 },
      { name: "HTML/CSS", level: 75 },
      { name: "Tailwind CSS", level: 70 },
    ],
  },
  {
    category: "Testing & Tools",
    items: [
      { name: "Swagger", level: 80 },
      { name: "JMeter", level: 75 },
      { name: "k6", level: 70 },
      { name: "Jest", level: 65 },
      { name: "Grafana", level: 65 },
      { name: "Prometheus", level: 65 },
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

export const papers: Paper[] = [
  {
    id: "icbta-2025",
    title: {
      ko: "Breaking the Throughput Barrier: 27-Fold Performance Improvement for Hyperledger Besu Through Service-Layer Optimization",
      en: "Breaking the Throughput Barrier: 27-Fold Performance Improvement for Hyperledger Besu Through Service-Layer Optimization",
    },
    venue: {
      ko: "ICBTA 2025 (국제 블록체인 기술 및 응용 학술대회)",
      en: "ICBTA 2025 (Int'l Conf. on Blockchain Technology and Applications)",
    },
    publisher: "Springer LNNS",
    date: "2025.12",
    type: "conference",
    isFirstAuthor: true,
    abstract: {
      ko: "Hyperledger Besu와 백엔드 서비스 통합 시 발생하는 I/O 블로킹 문제를 해결하기 위한 3계층 최적화 방법론을 제시합니다. Java 21 Virtual Threads, Transaction Isolation Pattern, PM2 Cluster Mode, Besu JVM 튜닝을 통해 기존 25 TPS에서 678 TPS로 27배 성능 향상을 달성했습니다.",
      en: "We present a holistic three-layer optimization methodology to address I/O blocking challenges when backend services integrate with Hyperledger Besu. Through Java 21 Virtual Threads, Transaction Isolation Pattern, PM2 Cluster Mode, and Besu JVM tuning, we achieved 27-fold improvement from 25 TPS to 678 TPS.",
    },
    links: {
      linkedin: "https://www.linkedin.com/in/jinhyeok1228",
    },
  },
  {
    id: "kips-2025-zkp",
    title: {
      ko: "블록체인 기반 B2B 거래 및 영지식 증명 시스템: DPP규제 대응을 위한 투명성과 기밀성 확보",
      en: "Blockchain-based B2B Trading and Zero-Knowledge Proof System: Ensuring Transparency and Confidentiality for DPP Regulation Compliance",
    },
    venue: {
      ko: "한국정보처리학회 2025년 추계학술대회",
      en: "KIPS 2025 Fall Conference",
    },
    publisher: "KIPS",
    date: "2025.11",
    type: "conference",
    isFirstAuthor: true,
    abstract: {
      ko: "EU DPP 규제(2030년 의무화)에 대응하기 위한 기술적 체계를 제시합니다. Hyperledger Besu 기반 프라이빗 블록체인으로 투명성을, IPFS 클러스터로 영속성을, Groth16 기반 ZKP로 기밀성을 동시에 확보하여 B2B 거래의 투명성과 기밀성 문제를 해결합니다. 단일 스레드 기준 ZK 증명서 생성 평균 0.54초, 하루 최대 16만 건 처리 가능.",
      en: "We present a technical framework for EU DPP regulation compliance (mandatory by 2030). Using Hyperledger Besu for transparency, IPFS clusters for persistence, and Groth16-based ZKP for confidentiality, we solve the dual challenge of transparency and confidentiality in B2B transactions. Single-thread ZK proof generation averages 0.54 seconds, enabling up to 160K daily transactions.",
    },
    links: {
      linkedin: "https://www.linkedin.com/in/jinhyeok1228",
    },
  },
  {
    id: "kcis-2022",
    title: {
      ko: "블록체인 기반 조작불가능한 확률제어 시스템",
      en: "Blockchain-based Non-manipulable Probability Control System",
    },
    venue: {
      ko: "한국컴퓨터정보학회 2022년 하계학술대회",
      en: "KCIS 2022 Summer Conference",
    },
    publisher: "KCIS",
    date: "2022.07",
    type: "conference",
    isFirstAuthor: true,
    award: {
      ko: "우수논문상 수상",
      en: "Best Paper Award",
    },
    abstract: {
      ko: "블록체인 기반의 투명성/신뢰성을 제공하는 조작 불가능한 확률 제어 시스템을 제안합니다. Private/Permissioned 블록체인 네트워크에서 확률값을 산출하고, Public Blockchain의 미래 블록 정보를 Seed로 활용하여 Non-deterministic 환경을 제공합니다.",
      en: "We propose a blockchain-based non-manipulable probability control system providing transparency and reliability. The system generates probability values on a Private/Permissioned blockchain network and uses future block information from Public Blockchain as seeds to provide a non-deterministic environment.",
    },
    links: {
      linkedin: "https://www.linkedin.com/in/jinhyeok1228",
    },
  },
  {
    id: "kips-2021-drone",
    title: {
      ko: "딥러닝 기반 객체 인식과 최적 경로 탐색을 통한 멀티 재난 드론 시스템 설계 및 구현에 대한 연구",
      en: "Design and Implementation of Multi-Disaster Drone System Using Deep Learning Object Detection and Optimal Path Planning",
    },
    venue: {
      ko: "정보처리학회논문지: 컴퓨터 및 통신 시스템",
      en: "KIPS Transactions on Computer and Communication Systems",
    },
    publisher: "KCI",
    date: "2021.04",
    type: "journal",
    isFirstAuthor: true,
    abstract: {
      ko: "재난 상황 감시 및 대처를 위한 인공지능 기반 재난 드론 시스템을 설계 및 개발했습니다. 딥러닝 기반 객체 인식 알고리즘과 ACO(Ant Colony Optimization) 기반 최적 경로 탐색을 적용하여 효율적인 탐색을 실시합니다. 산불 상황에 적용하여 산불지도 생성 및 시각화 기능을 구현했습니다.",
      en: "We designed and developed an AI-based disaster drone system for disaster monitoring and response. Using deep learning object detection and ACO-based optimal path planning, drones efficiently search areas. Applied to wildfire scenarios, the system creates and visualizes fire maps for firefighters.",
    },
    links: {
      linkedin: "https://www.linkedin.com/in/jinhyeok1228",
    },
  },
  {
    id: "ieee-2020",
    title: {
      ko: "Optimization of Sensor Nodes Deployment Based on An Improved Differential Evolution Algorithm for Coverage Area Maximization",
      en: "Optimization of Sensor Nodes Deployment Based on An Improved Differential Evolution Algorithm for Coverage Area Maximization",
    },
    venue: {
      ko: "IEEE IAEAC 2020",
      en: "IEEE IAEAC 2020",
    },
    publisher: "IEEE",
    date: "2020.02",
    type: "conference",
    isFirstAuthor: false,
    abstract: {
      ko: "무선 센서 네트워크(WSN)에서 커버리지 최대화를 위한 센서 노드 배치 최적화 방법을 제안합니다. 개선된 차분 진화 알고리즘을 사용하여 토너먼트 선택 전략으로 선택된 두 개의 우수한 개체가 현재 개체의 진화 방향을 안내합니다.",
      en: "We propose an optimization method for sensor node deployment in WSN to maximize coverage area. The improved differential evolution method uses two better individuals selected through tournament selection strategy to guide the current individual's evolutionary direction.",
    },
    links: {
      linkedin: "https://www.linkedin.com/in/jinhyeok1228",
    },
  },
  {
    id: "kips-2019-qr",
    title: {
      ko: "QR 코드를 이용한 다국어 전자 메뉴판과 맞춤형 현지 식당추천 알고리즘 및 앱개발에 관한 연구",
      en: "Research on Multilingual Electronic Menu Using QR Code and Personalized Local Restaurant Recommendation Algorithm and App Development",
    },
    venue: {
      ko: "한국정보처리학회 2019년 추계학술대회",
      en: "KIPS 2019 Fall Conference",
    },
    publisher: "KIPS",
    date: "2019.10",
    type: "conference",
    isFirstAuthor: true,
    abstract: {
      ko: "외국인 관광객과 유학생이 한국 식당에서 겪는 언어 장벽 문제를 해결하기 위한 시스템을 제안합니다. QR 코드를 통해 다국어 메뉴판에 접근하고, 종교나 식습관에 따른 음식 필터링 기능을 제공합니다.",
      en: "We propose a system to solve language barrier problems for foreign tourists and students at Korean restaurants. Users can access multilingual menus via QR code, with food filtering based on religious or dietary preferences.",
    },
    links: {
      linkedin: "https://www.linkedin.com/in/jinhyeok1228",
    },
  },
];

// 핵심 성과 지표
export const keyMetrics = {
  tpsImprovement: { value: "27x", desc: { ko: "TPS 성능 향상", en: "TPS Performance" } },
  papers: { value: "5+", desc: { ko: "논문 발표 (Springer, IEEE, KCI)", en: "Papers (Springer, IEEE, KCI)" } },
  awards: { value: "10+", desc: { ko: "수상 실적", en: "Awards" } },
  projects: { value: "12+", desc: { ko: "프로젝트", en: "Projects" } },
  experience: {
    value: { ko: "3+", en: "3+" },
    desc: { ko: "년 경력", en: "Years Exp." }
  },
};
