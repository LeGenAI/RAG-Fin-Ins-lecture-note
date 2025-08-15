# 2-3. .md, .json 형태 변환 실습 (RAG 시스템 연계)

## 학습 목표
- 변환된 데이터를 벡터 DB에 저장하는 방법 학습
- ChromaDB와 Pinecone을 활용한 실습
- LangChain을 통한 RAG 시스템 구축
- 실제 금융 챗봇 구현 사례 분석

---

## 1. RAG 시스템 개요

### 1.1 RAG(Retrieval-Augmented Generation)란?

**정의**
- 검색(Retrieval)과 생성(Generation)을 결합한 AI 시스템
- 외부 지식 베이스를 활용하여 더 정확하고 최신의 답변 생성
- 금융 데이터의 실시간성과 정확성 요구사항 충족

**RAG 시스템의 구성 요소**
```
[사용자 질문] → [임베딩 변환] → [벡터 DB 검색] → [관련 문서 추출]
                                                          ↓
[사용자 답변] ← [LLM 답변 생성] ← [프롬프트 + 검색 결과 결합]
```

### 1.2 금융 분야 RAG 활용 사례

#### 국내 사례

**KB국민은행 KB-STA**
- 자체 개발 AI 모델
- 마이데이터 + RAG 기반 맞춤형 자산관리
- 실시간 시장 데이터 반영

**신한은행 AI 뱅커**
- 150여 대 디지털 데스크 배치
- 고객 거래 이력 기반 상품 추천
- RAG를 통한 상품 설명서 실시간 검색

#### 해외 사례

**Morgan Stanley AI @ Morgan Stanley Assistant**
- 98% 재무 상담사 활용
- 100,000개 이상 연구 보고서 DB
- GPT-4 기반 RAG 시스템

**JP Morgan LLM Suite**
- 60,000명 이상 직원 사용
- 400개 이상 활용 사례
- 내부 문서 + 외부 데이터 통합 RAG

---

## 2. 벡터 데이터베이스 구축

### 2.1 ChromaDB 실습

#### 설치 및 초기 설정

```bash
# ChromaDB 설치
pip install chromadb
pip install sentence-transformers
pip install openai
```

#### 금융 데이터 벡터화 및 저장

```python
import chromadb
from chromadb.config import Settings
import json
from sentence_transformers import SentenceTransformer
from datetime import datetime
import hashlib

class FinancialVectorDB:
    def __init__(self, db_path="./financial_vector_db"):
        """금융 데이터 전용 벡터 DB 초기화"""
        
        # ChromaDB 클라이언트 생성
        self.client = chromadb.PersistentClient(
            path=db_path,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # 임베딩 모델 로드 (한국어 지원)
        self.embedding_model = SentenceTransformer('jhgan/ko-sroberta-multitask')
        
        # 컬렉션 생성
        self.collections = {
            'transactions': self._create_or_get_collection('transactions'),
            'products': self._create_or_get_collection('products'),
            'policies': self._create_or_get_collection('policies'),
            'customer_profiles': self._create_or_get_collection('customer_profiles')
        }
    
    def _create_or_get_collection(self, name):
        """컬렉션 생성 또는 가져오기"""
        try:
            return self.client.get_collection(name)
        except:
            return self.client.create_collection(
                name=name,
                metadata={"description": f"Collection for {name}"}
            )
    
    def add_transactions(self, transactions_json, user_id):
        """거래 데이터 벡터화 및 저장"""
        transactions = json.loads(transactions_json)
        
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        
        for i, trans in enumerate(transactions):
            # 자연어 문서 생성
            doc = self._create_transaction_document(trans)
            documents.append(doc)
            
            # 메타데이터 생성
            metadata = {
                'user_id': user_id,
                'date': trans['date'],
                'amount': float(trans['amount']),
                'type': trans['type'],
                'category': trans.get('category', 'unknown'),
                'merchant': trans.get('merchant', 'unknown')
            }
            metadatas.append(metadata)
            
            # 고유 ID 생성
            unique_string = f"{user_id}_{trans['date']}_{trans['amount']}_{i}"
            doc_id = hashlib.md5(unique_string.encode()).hexdigest()
            ids.append(doc_id)
            
            # 임베딩 생성
            embedding = self.embedding_model.encode(doc).tolist()
            embeddings.append(embedding)
        
        # 벡터 DB에 저장
        self.collections['transactions'].add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        return f"✅ {len(documents)}건의 거래 데이터가 벡터 DB에 저장되었습니다."
    
    def _create_transaction_document(self, transaction):
        """거래 데이터를 자연어 문서로 변환"""
        doc = f"""
        거래일시: {transaction['date']} {transaction.get('time', '')}
        거래유형: {transaction['type']}
        거래금액: {transaction['amount']:,}원
        거래처: {transaction.get('merchant', transaction.get('description', ''))}
        카테고리: {transaction.get('category', '미분류')}
        거래후잔액: {transaction.get('balance', 0):,}원
        """
        
        # AI 인사이트 추가
        if transaction.get('ai_insights'):
            insights = transaction['ai_insights']
            doc += f"""
        소비패턴: {insights.get('spending_pattern', '')}
        예산영향: {insights.get('budget_impact', '')}
        """
        
        return doc.strip()
    
    def search_transactions(self, query, user_id=None, n_results=5):
        """거래 데이터 검색"""
        # 쿼리 임베딩 생성
        query_embedding = self.embedding_model.encode(query).tolist()
        
        # 검색 조건 설정
        where_clause = {"user_id": user_id} if user_id else None
        
        # 검색 실행
        results = self.collections['transactions'].query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_clause
        )
        
        return self._format_search_results(results)
    
    def _format_search_results(self, results):
        """검색 결과 포맷팅"""
        formatted_results = []
        
        if results['documents'] and results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                result = {
                    'document': doc,
                    'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                    'distance': results['distances'][0][i] if results['distances'] else 0
                }
                formatted_results.append(result)
        
        return formatted_results
    
    def add_insurance_policies(self, policies_data, user_id):
        """보험 약관 데이터 저장"""
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        
        for policy_id, policy in policies_data.items():
            # 약관을 자연어로 변환
            doc = f"""
            보험상품명: {policy['name']}
            보험사: {policy['company']}
            보장내용: {policy['coverage']}
            월보험료: {policy['premium']:,}원
            보장기간: {policy['term']}
            가입일자: {policy['start_date']}
            특약사항: {', '.join(policy.get('special_terms', []))}
            """
            
            documents.append(doc.strip())
            
            metadata = {
                'user_id': user_id,
                'policy_id': policy_id,
                'company': policy['company'],
                'product_type': policy.get('type', 'unknown'),
                'premium': policy['premium'],
                'start_date': policy['start_date']
            }
            metadatas.append(metadata)
            
            ids.append(f"{user_id}_{policy_id}")
            
            # 임베딩 생성
            embedding = self.embedding_model.encode(doc).tolist()
            embeddings.append(embedding)
        
        # 저장
        self.collections['policies'].add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        return f"✅ {len(documents)}개의 보험 상품이 저장되었습니다."

# 사용 예시
vector_db = FinancialVectorDB()

# 거래 데이터 저장
sample_transactions = json.dumps([
    {
        "date": "2024-01-15",
        "time": "14:30:25",
        "type": "withdrawal",
        "amount": 4500,
        "merchant": "스타벅스 강남점",
        "category": "카페",
        "balance": 2450000
    },
    {
        "date": "2024-01-15",
        "time": "09:15:10",
        "type": "deposit",
        "amount": 2800000,
        "description": "급여",
        "category": "수입",
        "balance": 5250000
    }
])

result = vector_db.add_transactions(sample_transactions, "user123")
print(result)

# 검색 테스트
search_results = vector_db.search_transactions("스타벅스에서 쓴 돈", "user123")
for result in search_results:
    print(f"문서: {result['document'][:100]}...")
    print(f"유사도: {1 - result['distance']:.2f}\n")
```

### 2.2 Pinecone 실습

#### 설치 및 초기 설정

```bash
# Pinecone 설치
pip install pinecone-client
pip install sentence-transformers
```

#### Pinecone을 활용한 대규모 금융 데이터 관리

```python
import pinecone
from sentence_transformers import SentenceTransformer
import json
import os
from typing import List, Dict
import numpy as np

class PineconeFinancialDB:
    def __init__(self, api_key, environment="us-west1-gcp"):
        """Pinecone 기반 금융 벡터 DB 초기화"""
        
        # Pinecone 초기화
        pinecone.init(api_key=api_key, environment=environment)
        
        # 임베딩 모델 (384차원)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 인덱스 설정
        self.index_name = "financial-data-rag"
        self.dimension = 384
        
        # 인덱스 생성 또는 연결
        self._setup_index()
    
    def _setup_index(self):
        """인덱스 생성 또는 연결"""
        if self.index_name not in pinecone.list_indexes():
            pinecone.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric="cosine",
                metadata_config={
                    "indexed": ["user_id", "category", "date"]
                }
            )
            print(f"✅ 인덱스 '{self.index_name}' 생성 완료")
        
        self.index = pinecone.Index(self.index_name)
        
        # 인덱스 통계 확인
        stats = self.index.describe_index_stats()
        print(f"📊 인덱스 통계: {stats}")
    
    def upsert_financial_documents(self, documents: List[Dict], batch_size=100):
        """대량의 금융 문서 업서트"""
        vectors = []
        
        for doc in documents:
            # 텍스트 생성
            text = self._create_document_text(doc)
            
            # 임베딩 생성
            embedding = self.model.encode(text).tolist()
            
            # 벡터 데이터 구성
            vector = {
                'id': doc['id'],
                'values': embedding,
                'metadata': {
                    'user_id': doc.get('user_id'),
                    'type': doc.get('type'),
                    'category': doc.get('category'),
                    'amount': float(doc.get('amount', 0)),
                    'date': doc.get('date'),
                    'text': text[:1000]  # 메타데이터 크기 제한
                }
            }
            vectors.append(vector)
            
            # 배치 처리
            if len(vectors) >= batch_size:
                self.index.upsert(vectors=vectors)
                print(f"📤 {len(vectors)}개 벡터 업서트 완료")
                vectors = []
        
        # 남은 벡터 처리
        if vectors:
            self.index.upsert(vectors=vectors)
            print(f"📤 {len(vectors)}개 벡터 업서트 완료")
        
        return f"✅ 총 {len(documents)}개 문서 처리 완료"
    
    def _create_document_text(self, doc):
        """문서를 텍스트로 변환"""
        if doc.get('type') == 'transaction':
            return f"""
            거래일: {doc.get('date')}
            거래유형: {doc.get('transaction_type')}
            금액: {doc.get('amount'):,}원
            상호명: {doc.get('merchant', '')}
            카테고리: {doc.get('category', '')}
            설명: {doc.get('description', '')}
            """
        elif doc.get('type') == 'insurance':
            return f"""
            보험상품: {doc.get('product_name')}
            보험사: {doc.get('company')}
            월보험료: {doc.get('premium'):,}원
            보장내용: {doc.get('coverage')}
            """
        else:
            return doc.get('text', '')
    
    def hybrid_search(self, query: str, user_id: str = None, 
                      filters: Dict = None, top_k: int = 10):
        """하이브리드 검색 (의미 + 메타데이터)"""
        
        # 쿼리 임베딩
        query_embedding = self.model.encode(query).tolist()
        
        # 필터 구성
        filter_dict = {}
        if user_id:
            filter_dict['user_id'] = user_id
        if filters:
            filter_dict.update(filters)
        
        # 검색 실행
        results = self.index.query(
            vector=query_embedding,
            filter=filter_dict if filter_dict else None,
            top_k=top_k,
            include_metadata=True
        )
        
        return self._format_results(results)
    
    def _format_results(self, results):
        """검색 결과 포맷팅"""
        formatted = []
        
        for match in results['matches']:
            formatted.append({
                'id': match['id'],
                'score': match['score'],
                'metadata': match.get('metadata', {}),
                'text': match.get('metadata', {}).get('text', '')
            })
        
        return formatted
    
    def delete_user_data(self, user_id: str):
        """특정 사용자 데이터 삭제 (GDPR 준수)"""
        # 사용자 데이터 조회
        results = self.index.query(
            vector=[0] * self.dimension,  # 더미 벡터
            filter={'user_id': user_id},
            top_k=10000
        )
        
        # ID 추출
        ids_to_delete = [match['id'] for match in results['matches']]
        
        # 삭제 실행
        if ids_to_delete:
            self.index.delete(ids=ids_to_delete)
            return f"✅ {len(ids_to_delete)}개 문서 삭제 완료"
        else:
            return "⚠️ 삭제할 문서가 없습니다"

# 사용 예시
pinecone_db = PineconeFinancialDB(
    api_key="your-pinecone-api-key",
    environment="us-west1-gcp"
)

# 대량 데이터 준비
documents = [
    {
        'id': 'trans_001',
        'user_id': 'user123',
        'type': 'transaction',
        'date': '2024-01-15',
        'amount': 50000,
        'merchant': '이마트',
        'category': '쇼핑'
    },
    {
        'id': 'ins_001',
        'user_id': 'user123',
        'type': 'insurance',
        'product_name': '실손의료보험',
        'company': 'KB손해보험',
        'premium': 35000,
        'coverage': '입원/통원 의료비'
    }
]

# 데이터 업서트
result = pinecone_db.upsert_financial_documents(documents)
print(result)

# 하이브리드 검색
search_results = pinecone_db.hybrid_search(
    query="이마트 쇼핑 내역",
    user_id="user123",
    filters={'category': '쇼핑'}
)

for result in search_results:
    print(f"ID: {result['id']}")
    print(f"점수: {result['score']:.3f}")
    print(f"메타데이터: {result['metadata']}\n")
```

---

## 3. LangChain을 활용한 RAG 시스템 구축

### 3.1 LangChain 기본 설정

```bash
# LangChain 및 관련 패키지 설치
pip install langchain
pip install langchain-openai
pip install langchain-community
pip install chromadb
pip install tiktoken
```

### 3.2 금융 RAG 챗봇 구현

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import JSONLoader
import os
from typing import List, Dict

class FinancialRAGChatbot:
    def __init__(self, openai_api_key: str, db_path: str = "./financial_rag_db"):
        """금융 RAG 챗봇 초기화"""
        
        # OpenAI API 설정
        os.environ["OPENAI_API_KEY"] = openai_api_key
        
        # 임베딩 모델
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002"
        )
        
        # LLM 설정 (GPT-4 사용)
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.1,
            max_tokens=1000
        )
        
        # 벡터 스토어
        self.vectorstore = Chroma(
            persist_directory=db_path,
            embedding_function=self.embeddings
        )
        
        # 대화 메모리
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        # 프롬프트 템플릿
        self.qa_prompt = self._create_qa_prompt()
        
        # RAG 체인 생성
        self.qa_chain = self._create_qa_chain()
    
    def _create_qa_prompt(self):
        """질의응답 프롬프트 생성"""
        template = """당신은 전문적인 AI 금융 비서입니다. 
        사용자의 금융 데이터를 분석하고 맞춤형 조언을 제공합니다.
        
        다음 정보를 참고하여 사용자의 질문에 답변해주세요:
        
        참고 정보:
        {context}
        
        대화 기록:
        {chat_history}
        
        사용자 질문: {question}
        
        답변 시 지침:
        1. 정확한 수치와 날짜를 제시하세요
        2. 불확실한 정보는 추가 확인이 필요하다고 안내하세요
        3. 금융 전문 용어는 쉽게 설명하세요
        4. 개인화된 조언을 제공하세요
        5. 필요시 추가 행동 방안을 제시하세요
        
        답변:"""
        
        return PromptTemplate(
            template=template,
            input_variables=["context", "chat_history", "question"]
        )
    
    def _create_qa_chain(self):
        """QA 체인 생성"""
        return ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 5}
            ),
            memory=self.memory,
            combine_docs_chain_kwargs={"prompt": self.qa_prompt},
            return_source_documents=True,
            verbose=True
        )
    
    def load_financial_data(self, data_path: str):
        """금융 데이터 로드 및 벡터화"""
        
        # JSON 데이터 로드
        loader = JSONLoader(
            file_path=data_path,
            jq_schema=".transactions[]",
            text_content=False
        )
        documents = loader.load()
        
        # 텍스트 분할
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", " ", ""]
        )
        
        split_docs = text_splitter.split_documents(documents)
        
        # 벡터 스토어에 추가
        self.vectorstore.add_documents(split_docs)
        
        return f"✅ {len(split_docs)}개 문서 청크가 로드되었습니다"
    
    def chat(self, question: str, user_id: str = None):
        """사용자 질문에 답변"""
        
        # 사용자별 필터링 (옵션)
        if user_id:
            self.qa_chain.retriever.search_kwargs["filter"] = {"user_id": user_id}
        
        try:
            # 답변 생성
            result = self.qa_chain({"question": question})
            
            # 소스 문서 정보 추출
            sources = []
            if result.get("source_documents"):
                for doc in result["source_documents"]:
                    sources.append({
                        "content": doc.page_content[:200],
                        "metadata": doc.metadata
                    })
            
            return {
                "answer": result["answer"],
                "sources": sources,
                "conversation_id": self.memory.chat_memory.messages[-1].id if self.memory.chat_memory.messages else None
            }
            
        except Exception as e:
            return {
                "answer": f"죄송합니다. 답변 생성 중 오류가 발생했습니다: {str(e)}",
                "sources": [],
                "error": True
            }
    
    def get_spending_analysis(self, user_id: str, period: str = "1개월"):
        """지출 분석 리포트 생성"""
        question = f"""
        최근 {period} 동안의 지출 패턴을 분석해주세요.
        다음 항목을 포함해주세요:
        1. 카테고리별 지출 비중
        2. 전월 대비 증감
        3. 이상 지출 패턴
        4. 절약 가능 항목
        5. 맞춤형 절약 팁
        """
        return self.chat(question, user_id)
    
    def get_investment_recommendation(self, user_id: str):
        """투자 추천 생성"""
        question = """
        내 현재 재무 상황과 거래 패턴을 고려하여:
        1. 적합한 투자 상품을 추천해주세요
        2. 투자 가능 금액을 제안해주세요
        3. 리스크 수준을 평가해주세요
        4. 포트폴리오 구성을 제안해주세요
        """
        return self.chat(question, user_id)
    
    def get_insurance_review(self, user_id: str):
        """보험 리뷰 생성"""
        question = """
        내 현재 보험 가입 현황을 검토하고:
        1. 보장 공백이 있는지 확인해주세요
        2. 중복 보장이 있는지 분석해주세요
        3. 보험료 적정성을 평가해주세요
        4. 추가로 필요한 보장을 제안해주세요
        """
        return self.chat(question, user_id)
    
    def clear_memory(self):
        """대화 기록 초기화"""
        self.memory.clear()
        return "✅ 대화 기록이 초기화되었습니다"

# 사용 예시
chatbot = FinancialRAGChatbot(
    openai_api_key="your-openai-api-key"
)

# 데이터 로드
chatbot.load_financial_data("financial_data.json")

# 대화 시작
questions = [
    "이번 달 카페에서 얼마나 썼나요?",
    "지난 3개월 평균 지출액은 얼마인가요?",
    "내 소비 패턴에서 절약할 수 있는 부분이 있나요?",
    "현재 내 상황에 맞는 적금 상품을 추천해주세요"
]

for question in questions:
    print(f"\n👤 질문: {question}")
    response = chatbot.chat(question, user_id="user123")
    print(f"🤖 답변: {response['answer']}")
    
    if response['sources']:
        print("\n📚 참고 자료:")
        for source in response['sources']:
            print(f"  - {source['content'][:100]}...")
```

---

## 4. 실제 금융기관 구현 사례

### 4.1 Morgan Stanley의 AI @ Morgan Stanley Assistant

```python
# Morgan Stanley 스타일 RAG 구현 예시
class MorganStanleyStyleRAG:
    """Morgan Stanley의 RAG 시스템을 모방한 구현"""
    
    def __init__(self):
        self.research_db = self._init_research_db()
        self.client_db = self._init_client_db()
        self.market_db = self._init_market_db()
    
    def _init_research_db(self):
        """100,000개 이상의 연구 보고서 DB"""
        return {
            "total_documents": 100000,
            "categories": [
                "Equity Research",
                "Fixed Income",
                "Commodities",
                "FX Research",
                "Economic Analysis"
            ],
            "update_frequency": "real-time"
        }
    
    def advisor_assistant(self, query, client_profile):
        """재무 상담사용 어시스턴트"""
        # 1. 클라이언트 컨텍스트 로드
        client_context = self._get_client_context(client_profile)
        
        # 2. 관련 연구 자료 검색
        research_docs = self._search_research(query)
        
        # 3. 시장 데이터 통합
        market_data = self._get_market_data()
        
        # 4. GPT-4 기반 답변 생성
        response = self._generate_response(
            query, client_context, research_docs, market_data
        )
        
        return response
    
    def _get_client_context(self, client_profile):
        """클라이언트 맞춤 컨텍스트"""
        return {
            "risk_profile": client_profile.get("risk_tolerance"),
            "investment_goals": client_profile.get("goals"),
            "portfolio": client_profile.get("current_holdings"),
            "restrictions": client_profile.get("restrictions", [])
        }
    
    def _search_research(self, query):
        """연구 자료 시맨틱 검색"""
        # 실제로는 벡터 DB 검색
        return [
            "2024 Equity Outlook Report",
            "Tech Sector Analysis Q1 2024",
            "Fed Policy Impact Study"
        ]
    
    def _get_market_data(self):
        """실시간 시장 데이터"""
        return {
            "sp500": 4750.23,
            "nasdaq": 14563.89,
            "vix": 13.45,
            "10y_yield": 4.25
        }
    
    def _generate_response(self, query, client_context, research_docs, market_data):
        """통합 응답 생성"""
        prompt = f"""
        As a Morgan Stanley Financial Advisor Assistant:
        
        Client Query: {query}
        Client Risk Profile: {client_context['risk_profile']}
        Investment Goals: {client_context['investment_goals']}
        
        Relevant Research:
        {', '.join(research_docs)}
        
        Current Market:
        S&P 500: {market_data['sp500']}
        VIX: {market_data['vix']}
        
        Provide personalized investment advice considering all factors.
        """
        
        # GPT-4 호출 (실제 구현 시)
        return "Based on our research and your moderate risk profile..."
```

### 4.2 KB국민은행 AI 포트폴리오 구현

```python
class KBBankAIPortfolio:
    """KB국민은행 AI 포트폴리오 시스템 구현"""
    
    def __init__(self):
        self.mydata_integration = True
        self.kb_sta_model = self._load_kb_sta()
    
    def _load_kb_sta(self):
        """KB-STA (KB Smart Trading Assistant) 모델"""
        return {
            "model_type": "proprietary",
            "training_data": "10년간 금융 데이터",
            "features": [
                "risk_profiling",
                "portfolio_optimization",
                "market_prediction",
                "personalization"
            ]
        }
    
    def generate_portfolio(self, user_id):
        """AI 맞춤형 포트폴리오 생성"""
        
        # 1. 마이데이터 수집
        mydata = self._collect_mydata(user_id)
        
        # 2. 리스크 프로파일링
        risk_profile = self._analyze_risk_profile(mydata)
        
        # 3. 투자 가능 자산 계산
        investable_assets = self._calculate_investable(mydata)
        
        # 4. AI 포트폴리오 생성
        portfolio = self._optimize_portfolio(
            risk_profile, 
            investable_assets,
            mydata['goals']
        )
        
        # 5. 리밸런싱 전략
        rebalancing_strategy = self._create_rebalancing_plan(portfolio)
        
        return {
            "portfolio": portfolio,
            "expected_return": self._calculate_expected_return(portfolio),
            "risk_score": risk_profile['score'],
            "rebalancing": rebalancing_strategy
        }
    
    def _collect_mydata(self, user_id):
        """마이데이터 통합 수집"""
        return {
            "bank_accounts": [],
            "investments": [],
            "loans": [],
            "insurance": [],
            "spending_patterns": {},
            "income": 0,
            "goals": []
        }
    
    def _analyze_risk_profile(self, mydata):
        """AI 기반 리스크 프로파일 분석"""
        # 실제로는 KB-STA 모델 사용
        return {
            "score": 65,  # 0-100
            "category": "중립형",
            "description": "안정과 수익의 균형 추구"
        }
    
    def _calculate_investable(self, mydata):
        """투자 가능 자산 계산"""
        # 수입 - 지출 - 비상금 = 투자 가능액
        monthly_surplus = mydata['income'] - sum(mydata['spending_patterns'].values())
        emergency_fund = mydata['income'] * 3
        
        return max(0, monthly_surplus - emergency_fund / 12)
    
    def _optimize_portfolio(self, risk_profile, assets, goals):
        """포트폴리오 최적화"""
        if risk_profile['score'] < 30:
            # 안정형
            return {
                "채권": 0.6,
                "주식": 0.2,
                "예적금": 0.2
            }
        elif risk_profile['score'] < 70:
            # 중립형
            return {
                "채권": 0.3,
                "주식": 0.5,
                "대안투자": 0.1,
                "예적금": 0.1
            }
        else:
            # 공격형
            return {
                "주식": 0.7,
                "대안투자": 0.2,
                "채권": 0.1
            }
    
    def _create_rebalancing_plan(self, portfolio):
        """리밸런싱 전략 수립"""
        return {
            "frequency": "quarterly",
            "threshold": 0.05,  # 5% 이탈 시 리밸런싱
            "method": "threshold_based",
            "alerts": True
        }
    
    def _calculate_expected_return(self, portfolio):
        """기대 수익률 계산"""
        returns = {
            "채권": 0.04,
            "주식": 0.08,
            "대안투자": 0.10,
            "예적금": 0.03
        }
        
        expected = sum(portfolio.get(asset, 0) * ret 
                      for asset, ret in returns.items())
        
        return f"{expected:.1%}"
```

---

## 5. 실습 과제 및 평가

### 과제 1: ChromaDB 벡터 DB 구축
1. 제공된 샘플 거래 데이터를 ChromaDB에 저장
2. 다양한 쿼리로 검색 테스트
3. 검색 성능 최적화

### 과제 2: RAG 챗봇 구현
1. LangChain을 사용한 금융 챗봇 구축
2. 사용자 맞춤형 금융 조언 생성
3. 대화 컨텍스트 유지 구현

### 과제 3: 실제 서비스 기획
1. 자신만의 금융 RAG 서비스 기획
2. 필요한 데이터 소스 정의
3. 시스템 아키텍처 설계

---

## 핵심 요약

1. **RAG 시스템**은 검색과 생성을 결합한 강력한 AI 기술
2. **벡터 DB**는 의미 기반 검색을 가능하게 하는 핵심 인프라
3. **LangChain**을 통해 복잡한 RAG 시스템을 쉽게 구축 가능
4. **실제 금융기관**들은 이미 RAG를 활용한 혁신적 서비스 제공 중

---

## 참고 자료

- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [LangChain Documentation](https://python.langchain.com/)
- Morgan Stanley AI Assistant Case Study
- KB국민은행 AI 포트폴리오 서비스