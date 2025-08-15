# 🎓 나만의 AI 금융 비서 만들기: RAG 기반 금융 AI 과정

> K-MOOC 온라인 강좌 - RAG (Retrieval-Augmented Generation) 기술을 활용한 실무형 금융 AI 교육 프로그램

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.1.0-green)](https://langchain.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)

## 📚 과정 소개

본 과정은 RAG 기술을 활용하여 개인 맞춤형 금융 AI 비서를 구축하는 방법을 학습하는 실무 중심 교육 프로그램입니다. 최신 AI 기술과 실제 금융 데이터를 활용하여 즉시 적용 가능한 금융 AI 솔루션을 개발합니다.

### 🎯 학습 목표

- RAG 기술의 핵심 개념과 금융 분야 적용 방법 이해
- 개인 금융 데이터를 AI-ready 형식으로 변환하는 기술 습득
- ChromaDB, Pinecone 등 벡터 DB를 활용한 지식 베이스 구축
- LangChain을 통한 실제 금융 챗봇 개발
- 국내외 금융기관의 AI 활용 사례 분석

## 🗂️ 프로젝트 구조

```
RAG-Fin-Ins-lecture-note/
├── 📁 rag-finance-course/
│   ├── 📁 common/              # 공통 템플릿 및 자료
│   │   └── week0_01_01.html    # 기본 강의 템플릿
│   │
│   ├── 📁 week1/               # 1주차: 서론
│   │   ├── week1_01_01.html    # RAG 이해하기
│   │   ├── week1_01_02.html    # 금융 데이터 시대의 변화
│   │   └── week1_01_03.html    # 금융 AI의 필요성
│   │
│   ├── 📁 week2/               # 2주차: AI 맞춤 데이터
│   │   ├── 📁 docs/            # 강의 문서
│   │   │   ├── 2-1_ai_personalized_data_concepts.md
│   │   │   ├── 2-2_data_transformation_methods.md
│   │   │   ├── 2-3_rag_integration_practice.md
│   │   │   ├── case_studies.md
│   │   │   ├── code_examples.md
│   │   │   └── references.md
│   │   ├── week2_01_01.html    # 생성형 AI 맞춤 데이터의 개념
│   │   ├── week2_01_02.html    # 거래내역 변환하기
│   │   └── week2_01_03.html    # 변환 실습
│   │
│   ├── 📁 week3/               # 3주차: AI 내재화
│   ├── 📁 week4/               # 4주차: 정보 찾기
│   ├── 📁 week5/               # 5주차: 활용 사례
│   └── 📁 week6/               # 6주차: 나만의 AI 비서
│
├── 📁 assets/                  # 정적 리소스
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 images/
│
├── 📄 index.html              # 메인 페이지
├── 📄 login.html              # 로그인 페이지
├── 📄 server.js               # Express 서버
├── 📄 package.json            # Node.js 설정
└── 📄 README.md               # 프로젝트 문서

```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- Python 3.8 이상
- Git

### 설치 방법

1. **저장소 클론**
```bash
git clone https://github.com/LeGenAI/RAG-Fin-Ins-lecture-note.git
cd RAG-Fin-Ins-lecture-note
```

2. **의존성 설치**
```bash
npm install
```

3. **Python 패키지 설치** (실습용)
```bash
pip install -r requirements.txt
```

### 로컬 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000` 접속

- **데모 계정**: `demo` / `kmooc2025`

## 📖 주차별 커리큘럼

### 📅 1주차: 서론 - RAG와 금융 AI의 만남
- RAG 기술의 기본 개념
- 금융 데이터 활용의 현재와 미래
- AI 금융 비서의 필요성과 가능성

### 📅 2주차: AI 맞춤 데이터
- 생성형 AI 맞춤 데이터의 개념
- 개인 거래내역 및 보험자료 변환
- JSON/Markdown 형태 변환 실습

### 📅 3주차: AI 내재화
- 벡터 데이터베이스 구축 (ChromaDB, Pinecone)
- 임베딩과 인덱싱 전략
- 금융 지식 베이스 구축 실습

### 📅 4주차: 정보 찾기
- RAG 검색 메커니즘 이해
- 시맨틱 검색 vs 키워드 검색
- 금융 질의응답 시스템 구현

### 📅 5주차: 활용 사례
- 국내 금융기관 사례 (KB국민은행, 신한은행)
- 해외 사례 (JP Morgan, Morgan Stanley)
- 핀테크 기업 혁신 사례

### 📅 6주차: 나만의 AI 비서
- LangChain을 활용한 챗봇 개발
- 개인화된 금융 조언 시스템
- 최종 프로젝트 발표

## 💻 기술 스택

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Chart.js

### Backend
- Node.js & Express.js
- Python FastAPI (실습 서버)

### AI/ML
- LangChain
- OpenAI GPT-4
- ChromaDB / Pinecone
- Sentence Transformers

### 데이터 처리
- Pandas
- JSON / Markdown
- CSV 파싱

## 🔧 개발 환경 설정

### Python 가상환경 생성
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 환경 변수 설정
`.env` 파일 생성:
```env
OPENAI_API_KEY=your-api-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENV=your-environment
```

## 📚 실습 코드 예제

### CSV to JSON 변환
```python
import pandas as pd
import json

def convert_bank_statement(csv_path):
    df = pd.read_csv(csv_path, encoding='cp949')
    # 데이터 변환 로직
    return json.dumps(transactions, ensure_ascii=False)
```

### ChromaDB 벡터 저장
```python
import chromadb

client = chromadb.PersistentClient(path="./db")
collection = client.create_collection("financial_data")
collection.add(
    documents=documents,
    metadatas=metadatas,
    ids=ids
)
```

## 🌐 배포

### Railway 배포
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

자세한 배포 가이드는 [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) 참조

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

프로젝트 기여를 환영합니다! 다음 단계를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의 및 지원

- **이슈 트래커**: [GitHub Issues](https://github.com/LeGenAI/RAG-Fin-Ins-lecture-note/issues)
- **이메일**: support@legenai.com
- **K-MOOC 포럼**: [과정 토론방](https://www.kmooc.kr/)

## 🙏 감사의 글

- K-MOOC 플랫폼 지원
- 오픈소스 커뮤니티
- 금융 AI 연구자 및 실무자 여러분

## 📅 업데이트 이력

- **2025.01.15**: 초기 버전 릴리즈
- **2025.02.01**: 2주차 콘텐츠 추가
- **2025.02.15**: 실습 코드 및 사례 연구 보완

---

<div align="center">
  <strong>🚀 AI와 함께하는 금융의 미래를 만들어가요! 🚀</strong>
</div>