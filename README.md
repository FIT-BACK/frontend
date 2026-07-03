# FIT-BACK Frontend Repository

### 프로젝트 소개
* 목표: AI 기반의 가상 피팅 및 패션 분석 서비스 제공
  
### 팀원 및 역할 분담
* 이주은: 로그인 및 회원가입 페이지 구현, 검색바 및 카드 UI 컴포넌트 관리
* 김명주: 홈 화면 및 업로드 선택 시트, 이미지 업로드 페이지, 하단 탭바 및 플로팅 버튼 등 주요 기능 관리
* 인지환: AI 분석 대기/결과 페이지 및 태그 편집 기능, 프로그래스바 및 태그칩 컴포넌트 관리
* 성시훈: 룩북 업로드 및 마이 클로젯/마이페이지 구현, 공통 버튼 및 입력창 컴포넌트 관리
  
### 기술 스택
| 구분 | 기술 |
| :--- | :--- |
| **Language** | TypeScript |
| **Framework** | React |
| **Build Tool** | Vite |
| **Styling** | CSS, Tailwind CSS |
| **Version Control** | Git, GitHub |
| **Collaboration** | Notion, GitHub Issue, Pull Request |
### 브랜치 및 커밋 컨벤션
* 브랜치 전략:
    * main: 최종 제출 및 배포용 브랜치
    * dev: 개발 통합 브랜치
    * feature/기능명: 개인 기능 개발 브랜치
      
### 공용 컴포넌트 관리
* Button/IconButton/TextInput: 성시훈 담당
* ProgressBar/TagChip/ImagePicker: 인지환 담당
* SearchBar/Card: 이주은 담당
* BottomSheet/FAB/TabBar/ListItem: 김명주 담당
* Layout: 전체 공통
  
### 화면 목록 및 플로우
* 로그인/회원가입: 앱 최초 진입 후 순차적 진행 (담당: 이주은)
* 홈/업로드/이미지 분석: 하단 FAB를 통해 진입 (담당: 김명주)
* AI 분석/태그/결과: 분석 완료에 따른 페이지 전환 (담당: 인지환)
* 룩북/마이페이지: 하단 탭바를 통해 이동 (담당: 성시훈)
