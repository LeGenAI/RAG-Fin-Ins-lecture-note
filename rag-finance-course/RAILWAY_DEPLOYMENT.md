# Railway 배포 가이드

## 📚 RAG를 이용한 나만의 AI 금융 비서 만들기 - Railway 배포

이 가이드는 K-MOOC 강좌 웹사이트를 Railway 플랫폼에 배포하는 방법을 설명합니다.

## 🚀 배포 단계

### 1. Railway 계정 준비
1. [Railway.app](https://railway.app) 접속
2. GitHub 계정으로 로그인
3. 새 프로젝트 생성

### 2. 프로젝트 설정 확인
다음 파일들이 준비되어 있는지 확인하세요:
- ✅ `package.json` - Node.js 프로젝트 설정
- ✅ `server.js` - Express.js 서버
- ✅ `railway.toml` - Railway 배포 설정
- ✅ `.gitignore` - Git 무시 파일

### 3. GitHub 저장소 생성 및 연결
```bash
# Git 초기화
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit for Railway deployment"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/yourusername/rag-finance-course.git
git push -u origin main
```

### 4. Railway에서 배포
1. Railway 대시보드에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 해당 저장소 선택
4. 자동 배포 시작

### 5. 환경 변수 설정 (선택사항)
Railway 대시보드에서 다음 환경 변수를 설정할 수 있습니다:
- `NODE_ENV`: `production`
- `PORT`: Railway가 자동으로 설정

## 🔧 로컬 테스트

배포하기 전에 로컬에서 테스트하세요:

```bash
# 의존성 설치
npm install

# 서버 시작
npm start

# 브라우저에서 확인
# http://localhost:3000
```

## 📁 프로젝트 구조

```
rag-finance-course/
├── package.json          # Node.js 프로젝트 설정
├── server.js             # Express.js 서버
├── railway.toml          # Railway 배포 설정
├── .gitignore           # Git 무시 파일
├── index.html           # 메인 페이지 (로그인)
├── dashboard.html       # 강의 대시보드
├── common/              # 공통 리소스
│   ├── css/
│   ├── js/
│   └── images/
├── week1/               # 1주차 강의
├── week2/               # 2주차 강의
├── week3/               # 3주차 강의
├── week4/               # 4주차 강의
├── week5/               # 5주차 강의
└── week6/               # 6주차 강의
```

## 🎯 접속 방법

배포 완료 후:
1. Railway에서 제공하는 URL 확인
2. 브라우저에서 해당 URL 접속
3. 데모 계정으로 로그인:
   - 학번: `demo`
   - 코드: `kmooc2025`

## 🔍 문제 해결

### 일반적인 문제
1. **배포 실패**: package.json의 scripts 확인
2. **404 에러**: server.js의 라우팅 설정 확인
3. **정적 파일 로드 실패**: Express static 미들웨어 확인

### 로그 확인
Railway 대시보드에서 배포 로그와 실행 로그를 확인할 수 있습니다.

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- Railway 공식 문서: https://docs.railway.app
- 프로젝트 GitHub 이슈: 해당 저장소의 Issues 탭

---

**© 2025 서강대학교 | 김종락 교수**

*본 배포 가이드는 교육 목적으로만 사용 가능합니다.*
