# Mission Driven Assignment

Next.js 기반의 웹 애플리케이션 프로젝트입니다.

## 기술 스택

- **Next.js**: 16.0.1
- **React**: 19.2.0
- **TypeScript**: ^5
- **Tailwind CSS**: ^4
- **ESLint**: ^9

## 사전 요구사항

프로젝트를 실행하기 전에 다음이 설치되어 있어야 합니다.

- Node.js (18.0.0 이상 권장)
- npm, yarn, pnpm 또는 bun

## 프로젝트 설정 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/eungbin/mission-driven-assignment
cd mission-driven-assignment
```

### 2. 의존성 설치

npm을 사용하는 경우:

```bash
npm install
```

다른 패키지 매니저를 사용하는 경우:

```bash
# yarn
yarn install

# pnpm
pnpm install

# bun
bun install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

다른 패키지 매니저를 사용하는 경우:

```bash
# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun dev
```

개발 서버가 실행되면 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인할 수 있습니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드 생성
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint를 사용한 코드 검사

## 프로젝트 구조

```
mission-driven-assignment/
├── src/
│   └── app/                    # Next.js App Router
│       ├── page.tsx            # 메인 페이지
│       ├── layout.tsx          # 루트 레이아웃
│       ├── globals.css         # 전역 스타일
│       ├── favicon.ico         # 파비콘
│       ├── category/           # 카테고리 선택 페이지
│       │   └── page.tsx
│       ├── components/         # 컴포넌트
│       │   ├── common/         # 공통 컴포넌트
│       │   │   ├── Button.tsx
│       │   │   ├── ConfirmModal.tsx
│       │   │   ├── DatePicker.tsx
│       │   │   ├── ImageUploadIcon.tsx
│       │   │   ├── Label.tsx
│       │   │   ├── MobileBottomButton.tsx
│       │   │   ├── TextArea.tsx
│       │   │   ├── TimeInput.tsx
│       │   │   └── Toast.tsx
│       │   ├── header/         # 헤더 컴포넌트
│       │   │   └── Header.tsx
│       │   └── image/          # 이미지 업로드 컴포넌트
│       │       ├── AdditionalImageUpload.tsx
│       │       └── RepresentativeImageUpload.tsx
│       ├── store/              # 상태 관리 (Zustand)
│       │   ├── categoryStore.ts
│       │   ├── datePickerStore.ts
│       │   ├── formStore.ts
│       │   ├── modalStore.ts
│       │   └── toastStore.ts
│       └── utils/              # 유틸리티 함수
│           ├── dateUtils.ts
│           ├── imageUtils.ts
│           └── timeUtils.ts
├── public/                     # 정적 파일
│   └── icons/                  # 아이콘 파일
│       ├── chevron-left.svg
│       ├── chevron-right.svg
│       └── x.svg
├── package.json                # 프로젝트 의존성
├── tsconfig.json               # TypeScript 설정
├── next.config.ts              # Next.js 설정
├── eslint.config.mjs           # ESLint 설정
└── postcss.config.mjs          # PostCSS 설정
```

## 추가 정보

이 프로젝트는 Next.js의 App Router를 사용하며, TypeScript와 Tailwind CSS로 구성되어 있습니다.  
https://mission-driven-assignment.vercel.app/

