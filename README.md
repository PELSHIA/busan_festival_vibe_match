# Busan Festival Vibe Match

부산의 다양한 축제 중에서 당신의 **현재 감정(Vibe)**에 맞는 축제를 추천받고, 생생한 후기를 나누는 플랫폼입니다.

## 🎭 주요 기능

### 1. **Vibe 테스트**
- 간단한 퀴즈를 통해 현재 감정 상태 파악
- 7가지 감정(PASSION, HEALING, ADVENTURE 등)으로 분류
- 선택한 감정에 맞는 축제 자동 추천

### 2. **축제 상세 정보**
- **결과 헤더**: 추천된 축제의 이미지 및 기본 정보
- **지도 표시**: Kakao Map API를 통한 축제 위치 확인
- **일정 캘린더**: 축제 개최 기간 시각화
- **커뮤니티 리뷰**: 사용자들의 생생한 후기

### 3. **AI 챗봇**
- OpenAI GPT를 활용한 실시간 상담
- 부산 사투리로 친근한 상호작용
- 축제별 맞춤형 정보 제공

### 4. **로컬 커뮤니티 게시판**
- 축제 방문 후기 작성
- 리뷰 수정/삭제 (4자리 비밀번호 보호)
- 각 축제별 독립적인 리뷰 관리
- localStorage를 활용한 로컬 저장

## 🛠️ 기술 스택

- **Frontend**: Vue 3, Vite
- **Styling**: Tailwind CSS, PostCSS
- **라우팅**: Vue Router
- **API 통합**:
  - OpenAI GPT (챗봇)
  - Kakao Maps (지도 표시)
- **저장소**: LocalStorage (리뷰, 사용자 선택 데이터)
- **배포**: Netlify

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ChatWidget.vue          # AI 챗봇 위젯
│   ├── Layout.vue               # 레이아웃 및 네비게이션
│   ├── QuizStep.vue             # 퀴즈 단계별 질문
│   ├── ResultCalendar.vue       # 축제 일정 캘린더
│   ├── ResultHeader.vue         # 축제 상세 헤더
│   ├── ResultMap.vue            # 카카오맵 표시
│   └── ResultReviews.vue        # 커뮤니티 게시판
├── views/
│   ├── QuizView.vue             # 퀴즈 페이지
│   └── ResultView.vue           # 결과 페이지
├── router/
│   └── index.js                 # 라우트 설정
├── utils/
│   ├── festivalRecommender.mjs  # 축제 추천 알고리즘
│   └── festivalRecommender.test.mjs  # 테스트
└── assets/
    └── tailwind.css             # Tailwind 설정

public/
└── data/
    └── 부산_축제공연행사.json   # 축제 데이터
```

## 🚀 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드
npm run build

# 4. 프로덕션 빌드 미리보기
npm run preview
```

## 🔑 환경 변수 설정

`.env.local` 파일에 다음을 추가하세요:

```
VITE_OPENAI_KEY=your-openai-api-key
VITE_KAKAO_MAP_API_KEY=your-kakao-map-api-key
```

## 💾 데이터 관리

### LocalStorage 구조
- **festival-reviews**: 각 축제별 사용자 리뷰
  ```json
  [
    {
      "id": 1234567890,
      "festivalId": "123",
      "title": "리뷰 제목",
      "author": "닉네임",
      "content": "리뷰 내용",
      "password": "1234",
      "date": "2026.7.16",
      "views": 5
    }
  ]
  ```

- **selectedFestivalContentId**: 현재 선택된 축제 ID (세션 유지용)

## 🎯 핵심 기능 설명

### Vibe 추천 시스템
각 질문에 답하면서 점수를 누적하고, 가장 높은 점수의 감정에 맞는 축제를 추천합니다.

### 리뷰 시스템
- 각 축제에 독립적으로 리뷰 저장
- 다른 축제로 이동해도 기존 리뷰 유지
- 4자리 숫자 비밀번호로 수정/삭제 보호

### 챗봇 기능
축제 정보를 시스템 프롬프트에 포함시켜, 해당 축제에 대한 맞춤형 상담 제공

## 🌐 배포

Netlify에 배포되어 있습니다.

**배포 설정 (`_redirects` 파일):**
```
/* /index.html 200
```
이 설정으로 SPA의 라우팅이 모든 경로에서 정상 작동합니다.

## 📝 주요 개선 사항

- ✅ Props null 체크 및 옵셔널 체이닝 적용
- ✅ 리뷰 데이터 축제별 독립 관리
- ✅ ChatWidget 초기화 시 festival 데이터 watch
- ✅ SessionStorage → LocalStorage 전환
- ✅ SPA 배포 redirect 설정 완료

## 👥 사용자 흐름

1. **홈페이지** → 퀴즈 시작
2. **퀴즈 진행** → 감정 선택 및 점수 누적
3. **결과 페이지** → 추천 축제 정보 확인
4. **챗봇 상담** → AI에게 축제 정보 문의
5. **리뷰 작성** → 커뮤니티에 후기 등록
6. **다시 테스트** → 다른 축제 발견

## 🔄 향후 개선 계획

- [ ] 백엔드 서버 연동 (실제 데이터베이스)
- [ ] 사용자 계정 시스템
- [ ] 리뷰 좋아요/싫어요 기능
- [ ] 축제 필터링 및 검색
- [ ] 모바일 앱 개발

## 💡 IDE 설정 (선택사항)

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) 권장
