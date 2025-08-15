# RAG 금융 과정 1주차 추가 이미지 생성 프롬프트

김종락 교수님의 서강대학교 수학과 RAG 기반 AI 금융 어시스턴트 강의를 위한 고품질 교육용 이미지 생성 프롬프트입니다.

## 1. AI 환각(Hallucination) 개념 설명 이미지
**파일명**: ai_hallucination_concept.png
**사용 위치**: 슬라이드 2 - "AI의 첫 번째 한계 - 환각"

**ChatGPT 프롬프트:**
```
Create a professional educational illustration explaining AI Hallucination concept for university-level finance course.

Visual concept: Split design showing the difference between factual and hallucinated AI responses.

LEFT SIDE: "사실 기반 답변 (Fact-based Response)"
- Clean, organized database/documents with checkmarks
- Reliable information flow with solid arrows  
- Professional business person receiving accurate data
- Green color scheme indicating correctness

RIGHT SIDE: "AI 환각 현상 (AI Hallucination)"
- Confused AI brain with question marks and swirling thoughts
- Fabricated information represented by cloudy, uncertain elements
- Warning symbols and red indicators
- Fictional data floating around without sources

CENTER: Large warning icon with "Hallucination Risk" in both Korean and English

BOTTOM: Text overlay "RAG 시스템으로 해결 (Solved by RAG System)" with arrow pointing to solution

Style: Professional academic illustration, clean design, university textbook quality, blue and red color scheme for contrast, white background, modern sans-serif typography, educational infographic aesthetic, 1920x1080 resolution, suitable for academic presentation.
```

---

## 2. Knowledge Cutoff 개념 시각화
**파일명**: knowledge_cutoff_timeline.png  
**사용 위치**: 강의 전반 - LLM 한계 설명

**ChatGPT 프롬프트:**
```
Create an educational diagram showing the Knowledge Cutoff concept for AI systems.

Design specifications:
- Timeline visualization showing AI training data cutoff point
- LEFT: Historical data (books, documents, databases) with dates up to training cutoff
- CENTER: Clear vertical line marking "Knowledge Cutoff Date (2023년 4월)"
- RIGHT: Recent information (news, updates, current events) marked as "Unknown to AI"
- TOP: Traditional LLM with limited knowledge scope showing "학습된 지식 (Learned Knowledge)"
- BOTTOM: RAG system connecting to real-time databases showing "실시간 검색 (Real-time Search)"

Korean labels:
- "지식 마감일 (Knowledge Cutoff)"
- "학습 데이터 (Training Data)"  
- "최신 정보 접근 불가 (No Access to Recent Info)"
- "RAG로 해결 (Solved by RAG)"

Style: Clean academic timeline diagram, professional color scheme (blue #2563eb, gray #6b7280, white), clear chronological format, educational quality suitable for university mathematics course, modern design, 16:9 aspect ratio, Sogang University academic standard.
```

---

## 3. RAG 시스템 아키텍처 상세 다이어그램  
**파일명**: rag_detailed_architecture.png
**사용 위치**: 슬라이드 4 - "RAG 시스템 아키텍처 및 핵심 구성 요소"

**ChatGPT 프롬프트:**
```
Create a comprehensive RAG system architecture flowchart for financial AI education at Sogang University.

Main Architecture Flow (horizontal, left to right):
1. "사용자 질의 (User Query)" - speech bubble with financial question
2. "쿼리 분석 (Query Analysis)" - processing gears with NLP icon
3. "벡터 검색 (Vector Search)" - magnifying glass over vector space visualization  
4. "관련 문서 추출 (Document Retrieval)" - database with highlighted documents
5. "LLM 답변 생성 (LLM Generation)" - AI brain processing context
6. "출처 표시 (Source Citation)" - final answer with reference links

Supporting Infrastructure (below main flow):
- "금융 데이터베이스 (Financial Database)" - bank/market data
- "벡터 저장소 (Vector Store)" - Chroma, Pinecone, FAISS logos
- "외부 API (External APIs)" - real-time data feeds
- "지식 그래프 (Knowledge Graph)" - interconnected financial concepts

Design Requirements:
- Professional business diagram style with clean arrows
- Blue (#2563eb) and gray (#6b7280) corporate color scheme
- White background with subtle drop shadows
- Modern minimal icons for each component
- Korean and English dual labeling
- Academic presentation quality for mathematics course
- Clear information hierarchy
- 16:9 format optimized for lecture projection
```

---

## 4. 금융 AI 시스템 통합 개념도
**파일명**: financial_ai_system_integration.png
**사용 위치**: 슬라이드 6 - "금융 분야 RAG 적용 영역"

**ChatGPT 프롬프트:**
```
Design a comprehensive financial AI ecosystem diagram showing RAG integration for academic presentation.

Central Architecture:
CENTER: "RAG 기반 금융 AI 플랫폼 (RAG-powered Financial AI Platform)"

Five Main Application Areas (surrounding center):
1. "상품 추천 (Product Recommendation)" 
   - Icons: credit cards, loans, investments
   - Text: "고객 프로필 × 상품 DB 매칭"

2. "보험 설계 (Insurance Planning)"
   - Icons: shield, family protection, health
   - Text: "니즈 분석 및 상품 조합"

3. "투자 조언 (Investment Advice)" 
   - Icons: stock charts, portfolio, market trends
   - Text: "시장 분석 리포트 통합"

4. "리스크 분석 (Risk Analysis)"
   - Icons: warning triangles, assessment scales
   - Text: "신용평가 및 이상거래 탐지"

5. "고객 상담 (Customer Service)"
   - Icons: chatbot, 24/7, personalization
   - Text: "24/7 개인화 맞춤 상담"

Data Sources (connected via arrows):
- "실시간 시장 데이터 (Real-time Market Data)"
- "금융 상품 정보 (Product Information)"  
- "규제 및 법령 (Regulations & Laws)"
- "고객 거래 내역 (Customer Transaction History)"

Design Specifications:
- Professional financial industry aesthetic
- Corporate color scheme: Navy blue (#1e40af), gold accents (#f59e0b)
- Clean circular/hexagonal layout with RAG at center
- Modern business icons throughout
- Clear connecting arrows showing data flow
- Korean primary with English secondary labels
- University mathematics course quality
- Suitable for academic presentation at Sogang University
- 16:9 aspect ratio for optimal projection
- Clean white background with subtle gradients
```

---

## 사용 안내

### 이미지 생성 절차:
1. ChatGPT 데스크톱 앱 또는 웹 버전에서 위 프롬프트들을 개별적으로 입력
2. 생성된 각 이미지를 지정된 파일명으로 다운로드
3. 저장 위치: `/Users/baegjaehyeon/Desktop/AID/rag-finance-course/week1/images/`
4. 강의자료 HTML에서 해당 이미지들을 참조하여 사용

### 품질 기준:
- 해상도: 1920x1080 (16:9) 권장
- 스타일: 대학 수준의 전문적이고 교육적인 디자인
- 색상: 서강대학교 및 금융업계에 적합한 전문적 색상 팔레트
- 텍스트: 한국어 주 언어, 영어 보조 언어로 이중 표기
- 용도: 김종락 교수님의 수학과 강의자료용 고품질 교육 콘텐츠

### 강의 컨텍스트:
- 대상: 대학교 및 고등학교 수준의 수학/AI 교육
- 주제: RAG 기반 금융 AI 시스템의 원리와 적용
- 교육 목표: 이론적 개념의 시각적 이해 및 실무 적용 능력 향상
- 교수 스타일: 체계적이고 학술적이며 실무 중심적 접근

---

*생성일: 2025-08-12*  
*작성자: Claude Code (Educational Content Generator)*  
*과정: RAG 기반 AI 금융 어시스턴트 - 1주차*  
*담당교수: 김종락 교수 (서강대학교 수학과)*