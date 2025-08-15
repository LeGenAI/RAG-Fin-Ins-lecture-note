# 1주차 2차시: RAG의 프레임워크 학습

## 🎯 학습 목표
- RAG 아키텍처의 전체 파이프라인 구조 이해
- 주요 RAG 프레임워크(LangChain, LlamaIndex, Haystack) 비교 분석
- 벡터 데이터베이스 선택 가이드 습득
- 임베딩 모델 비교 및 최적 선택 방법 학습
- 기본 RAG 시스템 구현을 위한 실습 가이드

---

## 📚 강의 내용

### 1. RAG 아키텍처 파이프라인 (4분)

#### 1.1 전체 파이프라인 구조
RAG 시스템은 **4단계 핵심 프로세스**로 구성됩니다:

```
데이터 전처리 → 임베딩 → 검색 → 생성
```

#### 1.2 단계별 상세 분석

**1단계: 데이터 전처리 (Data Preprocessing)**
- **문서 정제**: 특수 문자, 이미지, 표 형식 처리
- **메타데이터 추출**: 문서 제목, 날짜, 저자 정보 구조화
- **청킹(Chunking)**: 의미적 단위로 문서 분할
  - 권장 설정: chunk_size=1000, overlap=200
  - 금융 문서: 섹션 기반 분할 (리스크, 수익률, 조건 등)

**2단계: 임베딩 (Embedding)**
- **벡터 변환**: 각 청크와 쿼리를 고차원 벡터로 변환
- **모델 선택**: OpenAI Ada-002 (1536차원) 또는 오픈소스 대안
- **한국어 최적화**: KoBERT, Korean SBERT 활용

**3단계: 검색 (Retrieval)**
- **유사도 계산**: 코사인 유사도 기반 검색
- **Top-k 추출**: 관련도 높은 3-5개 청크 선택
- **성능 최적화**: 계층적, 하이브리드 인덱스 활용

**4단계: 생성 (Generation)**
- **컨텍스트 구성**: 검색된 청크 + 사용자 쿼리
- **LLM 활용**: GPT-4o-mini, Claude 3.5 Sonnet 등
- **답변 생성**: 검색 결과 기반 정확한 응답 생성

#### 1.3 고급 최적화 기법
- **쿼리 재작성**: Step-back prompting, HyDE 기법
- **하이브리드 검색**: Dense + Sparse 검색 결합
- **후처리**: 답변 검증 및 정책 준수 확인

---

### 2. 주요 RAG 프레임워크 비교 (5분)

#### 2.1 LangChain
**최신 버전**: 0.4.0.dev0 (Core 0.3.74)

**특징:**
- 모듈식 LLM 애플리케이션 구성
- LCEL (LangChain Expression Language) 지원
- 확장된 도구 지원 및 통합

**장점:**
✅ 풍부한 생태계와 활발한 커뮤니티  
✅ 다양한 LLM 및 벡터 DB 통합  
✅ 복잡한 워크플로우 구현 가능  
✅ 문서화가 잘 되어 있음  

**단점:**
❌ 복잡한 설정과 의존성  
❌ 학습 곡선이 높음  
❌ 일부 신기능 문서화 부족  

**금융 적용 사례:**
- JP Morgan의 CodeGPT: 개발자 검색 시간 30% 단축
- 규제 문서 분석 및 컴플라이언스 체크

#### 2.2 LlamaIndex
**최신 버전**: Core 0.13.1 (2025년 8월 8일 릴리스)

**특징:**
- RAG 및 문서 검색에 특화
- 간단한 설정과 빠른 프로토타이핑
- 모델별 패키지 통합

**장점:**
✅ 문서 검색 최적화  
✅ 초보자 친화적 인터페이스  
✅ 빠른 프로토타이핑 가능  
✅ 다양한 데이터 소스 지원  

**단점:**
❌ LangChain 대비 제한된 생태계  
❌ 복잡한 워크플로우 구현 한계  
❌ 기업급 기능 부족  

#### 2.3 Haystack
**최신 버전**: 2.16.1 (2025년 7월 29일)

**특징:**
- 엔터프라이즈급 RAG 구현
- 멀티모달 파이프라인 (텍스트, 이미지)
- 강력한 디버깅 도구

**장점:**
✅ 프로덕션 환경 최적화  
✅ 멀티모달 지원  
✅ 뛰어난 성능과 확장성  
✅ 기업급 보안 기능  

**단점:**
❌ 높은 학습 곡선  
❌ 상대적으로 제한된 커뮤니티  
❌ 복잡한 초기 설정  

#### 2.4 프레임워크 선택 가이드

| 용도 | 추천 프레임워크 | 이유 |
|------|-----------------|------|
| **학습/프로토타입** | LlamaIndex | 간단한 설정, 빠른 구현 |
| **중급 프로젝트** | LangChain | 풍부한 기능, 커뮤니티 지원 |
| **엔터프라이즈** | Haystack | 확장성, 보안, 멀티모달 |
| **교육 목적** | LangChain | 문서화, 학습 자료 풍부 |

---

### 3. 벡터 데이터베이스 선택 가이드 (3분)

#### 3.1 주요 옵션별 특성 비교

| 벡터 DB | 장점 | 단점 | 비용 | 적합 용도 |
|---------|------|------|------|----------|
| **ChromaDB** | ✅ 개발자 친화적<br>✅ Python 최적화<br>✅ 무료 오픈소스 | ❌ 제한적 기업 기능<br>❌ 상대적 신규 도구 | 무료 | 교육, 중소 프로젝트 |
| **Pinecone** | ✅ 완전 관리형<br>✅ 자동 확장<br>✅ 다중 지역 복제 | ❌ 높은 비용<br>❌ 벤더 종속성 | $0.10/1M 연산<br>$0.15/GB-월 | 프로덕션, 확장성 중요 |
| **FAISS** | ✅ 최고 ANN 성능<br>✅ 무료 오픈소스<br>✅ 낮은 지연시간 | ❌ 인프라 관리 필요<br>❌ 확장성 제한 | 무료 | 로컬 개발, 프로토타입 |
| **Qdrant** | ✅ Rust 기반 성능<br>✅ 페이로드 필터링<br>✅ 실시간 스트리밍 | ❌ 상대적 높은 비용<br>❌ 제한적 생태계 | $0.20/GB-월 | 고성능 필터링 요구 |

#### 3.2 교육용 권장 조합
- **초급**: ChromaDB + OpenAI Embeddings
- **중급**: FAISS + SentenceTransformers  
- **고급**: Qdrant + 커스텀 임베딩 모델

---

### 4. 임베딩 모델 비교 분석 (3분)

#### 4.1 주요 옵션별 특성

**OpenAI Ada-002**
- **차원**: 1536
- **비용**: $0.0001/1K 토큰
- **장점**: 높은 품질, 다국어 지원
- **단점**: 비용 부담, API 의존성

**SentenceTransformers (all-MiniLM-L6-v2)**
- **차원**: 384
- **비용**: 무료
- **장점**: 효율적, 커스터마이징 가능
- **단점**: 품질 트레이드오프

**한국어 최적화 모델**
- **KoBERT, Korean SBERT**
- **성능**: 한국어 QA Recall@10 > 0.85
- **개선도**: 일반 모델 대비 약 7% 향상

**금융 도메인 특화**
- **FinBERT**: SEC 문서 학습
- **성능**: 수익률 QA 정확도 12% 향상

#### 4.2 성능 vs 비용 매트릭스

| 모델 | 품질 | 비용 | 지연시간 | 한국어 지원 | 권장 용도 |
|------|------|------|---------|------------|----------|
| OpenAI Ada-002 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 프로덕션 |
| SentenceTransformers | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 교육, 프로토타입 |
| KoBERT | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 한국어 특화 |
| FinBERT | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | 금융 도메인 |

---

## 🛠️ 실습 구현 가이드

### 1. 환경 설정 (Python)

```bash
# 1. 파이썬 가상환경 설정
python3 -m venv rag-env
source rag-env/bin/activate  # Windows: rag-env\Scripts\activate

# 2. 필수 라이브러리 설치
pip install -U langchain langchain-community langchain-openai
pip install chromadb sentence-transformers
pip install faiss-cpu  # GPU 버전: faiss-gpu
pip install streamlit gradio  # UI 프레임워크

# 3. 환경 변수 설정
export OPENAI_API_KEY="your-api-key-here"
```

### 2. 기본 RAG 파이프라인 구현

```python
# basic_rag.py
import os
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA

# 1. 문서 로딩 및 분할
def setup_documents():
    # 금융 문서 샘플 (교육용)
    documents = [
        "주식 투자의 기본 원칙은 분산 투자입니다. 여러 종목에 투자하여 리스크를 줄일 수 있습니다.",
        "채권은 안정적인 수익을 제공하는 투자 상품입니다. 국채, 회사채 등이 있으며 만기가 정해져 있습니다.",
        "부동산 투자는 장기적 관점에서 접근해야 합니다. 입지, 수익성, 유동성을 종합적으로 고려해야 합니다."
    ]
    
    # 텍스트 분할
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\\n\\n", "\\n", ".", " "]
    )
    
    splits = text_splitter.create_documents(documents)
    return splits

# 2. 벡터 저장소 구성
def create_vectorstore(documents):
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        collection_name="financial_docs",
        persist_directory="./chroma_db"
    )
    return vectorstore

# 3. RAG 체인 구성
def create_rag_chain(vectorstore):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    return qa_chain

# 4. 실행 함수
def main():
    # 문서 준비
    docs = setup_documents()
    
    # 벡터 저장소 생성
    vectorstore = create_vectorstore(docs)
    
    # RAG 체인 생성
    qa_chain = create_rag_chain(vectorstore)
    
    # 테스트 쿼리
    query = "주식 투자 시 주의사항은 무엇인가요?"
    result = qa_chain({"query": query})
    
    print("답변:", result["result"])
    print("참조 문서 수:", len(result["source_documents"]))

if __name__ == "__main__":
    main()
```

### 3. 비용 효율적 구현 (오픈소스)

```python
# cost_efficient_rag.py
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class CostEfficientRAG:
    def __init__(self):
        # 무료 임베딩 모델
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.documents = []
    
    def add_documents(self, docs):
        """문서 추가 및 인덱싱"""
        self.documents.extend(docs)
        embeddings = self.embedder.encode(docs)
        
        if self.index is None:
            # FAISS 인덱스 초기화
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dimension)
        
        # 정규화 후 추가
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings.astype('float32'))
    
    def retrieve(self, query, k=3):
        """문서 검색"""
        query_embedding = self.embedder.encode([query])
        faiss.normalize_L2(query_embedding)
        
        scores, indices = self.index.search(
            query_embedding.astype('float32'), k
        )
        
        return [self.documents[i] for i in indices[0]]

# 사용 예제
rag_system = CostEfficientRAG()

# 금융 문서 추가
financial_docs = [
    "ETF는 Exchange Traded Fund의 약자로 여러 주식을 하나로 묶어 거래소에서 거래하는 상품입니다.",
    "리츠(REITs)는 부동산 투자 신탁으로 부동산에 간접 투자할 수 있는 방법입니다.",
    "채권의 듀레이션은 금리 민감도를 나타내며, 듀레이션이 클수록 금리 변동에 민감합니다."
]

rag_system.add_documents(financial_docs)

# 질의응답
query = "ETF 투자의 특징은?"
relevant_docs = rag_system.retrieve(query)
print("관련 문서:", relevant_docs)
```

---

## 📊 성능 비교 및 평가

### 1. 프레임워크 성능 비교

| 프레임워크 | 구현 속도 | 성능 | 확장성 | 학습 용이성 | 종합 점수 |
|------------|----------|------|--------|-------------|-----------|
| **LangChain** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | **⭐⭐⭐⭐** |
| **LlamaIndex** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **⭐⭐⭐⭐** |
| **Haystack** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | **⭐⭐⭐** |

### 2. 벡터 DB 성능 벤치마크

| 데이터베이스 | 검색 속도 | 정확도 | 메모리 사용량 | 설치 용이성 | 교육 적합성 |
|-------------|----------|--------|---------------|-------------|-------------|
| **ChromaDB** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **⭐⭐⭐⭐⭐** |
| **FAISS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **⭐⭐⭐⭐** |
| **Pinecone** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **⭐⭐⭐** |

---

## 🎯 실습 프로젝트 제안

### 초급 프로젝트: "나의 첫 번째 금융 RAG 봇"
**목표**: ChromaDB + LangChain으로 기본 금융 QA 시스템 구축  
**소요 시간**: 30분  
**핵심 학습**: 파이프라인 이해, 기본 구현  

### 중급 프로젝트: "하이브리드 검색 금융 어드바이저"
**목표**: Dense + Sparse 검색 결합, 성능 비교  
**소요 시간**: 45분  
**핵심 학습**: 검색 방법론, 성능 최적화  

---

## 🎬 시연 시나리오

### "금융 상품 비교 AI 구축"

**1단계: 데이터 준비**
```python
# 금융 상품 데이터
products = [
    "적금: 연 4.2% 금리, 1년 만기, 월 10만원부터",
    "예금: 연 3.8% 금리, 자유 입출금, 최소 100만원",
    "CMA: 연 3.5% 금리, 실시간 입출금, 수수료 없음"
]
```

**2단계: RAG 시스템 구축**
```python
# 벡터 저장소 생성
vectorstore = Chroma.from_documents(documents, embeddings)

# 검색 체인 구성
qa_chain = RetrievalQA.from_chain_type(llm, retriever=vectorstore.as_retriever())
```

**3단계: 질의응답 테스트**
```python
# 질문: "단기 저축에 적합한 상품은?"
# 답변: "단기 저축에는 CMA가 적합합니다. 실시간 입출금이 가능하고..."
```

---

## 🎯 학습 정리

### 핵심 개념 체크리스트
- [ ] RAG 파이프라인 4단계 (전처리→임베딩→검색→생성) 이해
- [ ] 주요 프레임워크 3가지 (LangChain, LlamaIndex, Haystack) 특징 파악
- [ ] 벡터 데이터베이스 선택 기준 학습
- [ ] 임베딩 모델 성능 vs 비용 트레이드오프 이해
- [ ] 기본 RAG 구현 코드 작성 능력 습득

### 다음 차시 예고
**1주차 3차시: "실습 및 토론"**
- 실제 금융 문서로 RAG 시스템 구축 실습
- 성능 평가 및 개선 방법 토론
- 프로젝트 기반 학습 진행

---

## 📚 참고 자료

### 기술 문서
- **LangChain 공식 문서**: https://python.langchain.com/docs/
- **LlamaIndex 가이드**: https://docs.llamaindex.ai/
- **Haystack 튜토리얼**: https://docs.haystack.deepset.ai/

### 성능 벤치마크
- **벡터 DB 성능 비교**: "Vector Database Benchmark Report 2025"
- **임베딩 모델 평가**: "Embedding Models for Financial Domain" (arXiv:2024)

### 실습 리소스
- **샘플 코드**: GitHub RAG Examples Repository
- **금융 데이터셋**: 한국거래소 공개 데이터, 금융감독원 자료

---

*© 2025 서강대학교 K-MOOC | 김종락 교수*  
*본 강의자료는 교육 목적으로만 사용 가능합니다.*