# 2주차 코드 예제 모음

## 목차
1. [데이터 변환 예제](#1-데이터-변환-예제)
2. [벡터 DB 구축 예제](#2-벡터-db-구축-예제)
3. [RAG 시스템 구현 예제](#3-rag-시스템-구현-예제)
4. [통합 파이프라인 예제](#4-통합-파이프라인-예제)

---

## 1. 데이터 변환 예제

### 1.1 CSV to JSON 변환기

```python
import pandas as pd
import json
from datetime import datetime
import re

class BankStatementConverter:
    """은행 거래내역 변환기"""
    
    def __init__(self, bank_name='KB국민은행'):
        self.bank_name = bank_name
        self.encoding_map = {
            'KB국민은행': 'cp949',
            '신한은행': 'utf-8',
            '우리은행': 'euc-kr',
            '하나은행': 'cp949',
            '카카오뱅크': 'utf-8'
        }
        
    def csv_to_json(self, csv_file_path, output_path=None):
        """CSV를 JSON으로 변환"""
        
        # 1. CSV 파일 로드
        encoding = self.encoding_map.get(self.bank_name, 'utf-8')
        df = pd.read_csv(csv_file_path, encoding=encoding)
        
        # 2. 컬럼명 표준화
        df = self._standardize_columns(df)
        
        # 3. 데이터 정제
        df = self._clean_data(df)
        
        # 4. AI용 메타데이터 추가
        df = self._enrich_with_ai_metadata(df)
        
        # 5. JSON 형식으로 변환
        result = self._create_json_structure(df)
        
        # 6. 파일 저장
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2, default=str)
        
        return result
    
    def _standardize_columns(self, df):
        """컬럼명 표준화"""
        column_mapping = {
            '거래일자': 'date',
            '거래일': 'date',
            '거래시간': 'time',
            '적요': 'description',
            '거래내용': 'description',
            '출금액': 'withdrawal',
            '입금액': 'deposit',
            '잔액': 'balance',
            '거래점': 'channel'
        }
        return df.rename(columns=column_mapping)
    
    def _clean_data(self, df):
        """데이터 정제"""
        # 금액 필드 숫자로 변환
        for col in ['withdrawal', 'deposit', 'balance']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
        # 날짜 형식 통일
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        
        return df
    
    def _enrich_with_ai_metadata(self, df):
        """AI 분석용 메타데이터 추가"""
        
        # 거래 유형 분류
        df['transaction_type'] = df.apply(
            lambda x: 'withdrawal' if x.get('withdrawal', 0) > 0 else 'deposit',
            axis=1
        )
        
        # 카테고리 자동 분류
        df['category'] = df['description'].apply(self._categorize_transaction)
        
        # 시간대 분석
        if 'time' in df.columns:
            df['time_period'] = df['time'].apply(self._get_time_period)
        
        # 요일 정보
        if 'date' in df.columns:
            df['weekday'] = df['date'].dt.day_name()
            df['is_weekend'] = df['date'].dt.weekday >= 5
        
        return df
    
    def _categorize_transaction(self, description):
        """거래 카테고리 분류"""
        categories = {
            '식음료': ['카페', '커피', '스타벅스', '식당', '맥도날드', '배달'],
            '교통': ['지하철', '버스', '택시', '주유', '톨게이트'],
            '쇼핑': ['마트', '이마트', '백화점', '온라인', '쿠팡'],
            '의료': ['병원', '약국', '의원'],
            '금융': ['이체', '대출', '이자', 'ATM'],
            '통신': ['KT', 'SKT', 'LG', '통신'],
            '급여': ['급여', '월급', '상여'],
            '공과금': ['전기', '가스', '수도', '관리비']
        }
        
        description_lower = description.lower() if description else ''
        
        for category, keywords in categories.items():
            if any(keyword.lower() in description_lower for keyword in keywords):
                return category
        
        return '기타'
    
    def _get_time_period(self, time_str):
        """시간대 분류"""
        try:
            hour = int(time_str.split(':')[0])
            if 6 <= hour < 9:
                return '아침'
            elif 9 <= hour < 12:
                return '오전'
            elif 12 <= hour < 14:
                return '점심'
            elif 14 <= hour < 18:
                return '오후'
            elif 18 <= hour < 21:
                return '저녁'
            else:
                return '밤'
        except:
            return '기타'
    
    def _create_json_structure(self, df):
        """최종 JSON 구조 생성"""
        
        transactions = []
        for _, row in df.iterrows():
            transaction = {
                'id': f"{self.bank_name}_{row.name}_{datetime.now().timestamp()}",
                'date': row['date'].isoformat() if pd.notna(row['date']) else None,
                'time': row.get('time', '00:00:00'),
                'description': row['description'],
                'amount': float(row['withdrawal']) if row['transaction_type'] == 'withdrawal' else float(row['deposit']),
                'type': row['transaction_type'],
                'balance': float(row['balance']),
                'category': row['category'],
                'channel': row.get('channel', 'unknown'),
                'metadata': {
                    'weekday': row.get('weekday'),
                    'is_weekend': row.get('is_weekend'),
                    'time_period': row.get('time_period'),
                    'bank': self.bank_name
                }
            }
            transactions.append(transaction)
        
        return {
            'version': '1.0',
            'generated_at': datetime.now().isoformat(),
            'bank': self.bank_name,
            'summary': {
                'total_transactions': len(transactions),
                'date_range': {
                    'start': df['date'].min().isoformat() if not df.empty else None,
                    'end': df['date'].max().isoformat() if not df.empty else None
                },
                'total_deposits': float(df[df['transaction_type'] == 'deposit']['deposit'].sum()),
                'total_withdrawals': float(df[df['transaction_type'] == 'withdrawal']['withdrawal'].sum()),
                'category_breakdown': df.groupby('category')['withdrawal'].sum().to_dict()
            },
            'transactions': transactions
        }

# 사용 예시
converter = BankStatementConverter('KB국민은행')
json_data = converter.csv_to_json('kb_statement.csv', 'kb_statement.json')
print(f"✅ 변환 완료: {len(json_data['transactions'])}건의 거래")
```

### 1.2 보험 약관 구조화 변환기

```python
import re
from typing import Dict, List
import json

class InsurancePolicyParser:
    """보험 약관 파서"""
    
    def __init__(self):
        self.parsed_clauses = []
        
    def parse_policy_text(self, policy_text: str) -> Dict:
        """보험 약관 텍스트를 구조화된 데이터로 변환"""
        
        # 조항 추출
        clauses = self._extract_clauses(policy_text)
        
        # 각 조항 파싱
        parsed_clauses = []
        for clause in clauses:
            parsed = self._parse_clause(clause)
            if parsed:
                parsed_clauses.append(parsed)
        
        # 보장 내용 추출
        coverages = self._extract_coverages(policy_text)
        
        # 면책 사항 추출
        exclusions = self._extract_exclusions(policy_text)
        
        return {
            'type': 'insurance_policy',
            'clauses': parsed_clauses,
            'coverages': coverages,
            'exclusions': exclusions,
            'metadata': {
                'total_clauses': len(parsed_clauses),
                'total_coverages': len(coverages),
                'total_exclusions': len(exclusions)
            }
        }
    
    def _extract_clauses(self, text: str) -> List[str]:
        """조항 추출"""
        # 정규식으로 '제X조' 패턴 찾기
        pattern = r'제\d+조[^제]*'
        clauses = re.findall(pattern, text)
        return clauses
    
    def _parse_clause(self, clause_text: str) -> Dict:
        """개별 조항 파싱"""
        # 조항 번호 추출
        article_match = re.match(r'제(\d+)조', clause_text)
        if not article_match:
            return None
        
        article_number = int(article_match.group(1))
        
        # 조항 제목 추출
        title_match = re.search(r'제\d+조\s*\(([^)]+)\)', clause_text)
        title = title_match.group(1) if title_match else ''
        
        # 본문 추출
        content = re.sub(r'제\d+조\s*\([^)]*\)', '', clause_text).strip()
        
        # 하위 항목 추출
        subitems = re.findall(r'[①②③④⑤⑥⑦⑧⑨⑩]\s*([^①②③④⑤⑥⑦⑧⑨⑩]*)', content)
        
        return {
            'article_number': article_number,
            'title': title,
            'content': content,
            'subitems': subitems,
            'keywords': self._extract_keywords(content)
        }
    
    def _extract_coverages(self, text: str) -> List[Dict]:
        """보장 내용 추출"""
        coverages = []
        
        # 보장 관련 키워드
        coverage_keywords = ['보장', '지급', '보상', '급여', '혜택']
        
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line for keyword in coverage_keywords):
                # 금액 추출
                amount_match = re.search(r'(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*원', line)
                amount = amount_match.group(1) if amount_match else None
                
                if amount:
                    coverages.append({
                        'description': line.strip(),
                        'amount': amount,
                        'type': self._classify_coverage_type(line)
                    })
        
        return coverages
    
    def _extract_exclusions(self, text: str) -> List[str]:
        """면책 사항 추출"""
        exclusions = []
        
        # 면책 관련 키워드
        exclusion_keywords = ['면책', '제외', '보상하지 않', '지급하지 않']
        
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line for keyword in exclusion_keywords):
                exclusions.append(line.strip())
        
        return exclusions
    
    def _extract_keywords(self, text: str) -> List[str]:
        """키워드 추출"""
        # 중요 금융/보험 용어
        important_terms = [
            '보험금', '보험료', '피보험자', '수익자', '계약자',
            '보장', '면책', '해지', '만기', '갱신',
            '진단', '입원', '수술', '통원', '사망'
        ]
        
        found_keywords = []
        for term in important_terms:
            if term in text:
                found_keywords.append(term)
        
        return found_keywords
    
    def _classify_coverage_type(self, text: str) -> str:
        """보장 유형 분류"""
        if '사망' in text:
            return '사망보장'
        elif '입원' in text:
            return '입원보장'
        elif '수술' in text:
            return '수술보장'
        elif '진단' in text:
            return '진단보장'
        elif '만기' in text:
            return '만기보장'
        else:
            return '기타보장'
    
    def save_as_json(self, parsed_data: Dict, output_path: str):
        """JSON 파일로 저장"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(parsed_data, f, ensure_ascii=False, indent=2)

# 사용 예시
parser = InsurancePolicyParser()

sample_policy = """
제1조(목적) 이 보험계약은 보험계약자가 납입한 보험료를 바탕으로 피보험자가 보험기간 중 
보험금 지급사유가 발생할 경우 보험수익자에게 약정한 보험금을 지급함을 목적으로 합니다.

제2조(보험금의 지급)
① 회사는 피보험자가 사망한 경우 1억원을 지급합니다.
② 회사는 피보험자가 암으로 진단받은 경우 3천만원을 지급합니다.

제3조(보험금을 지급하지 않는 사유)
회사는 다음의 경우 보험금을 지급하지 않습니다.
1. 고의적 사고
2. 전쟁, 혁명
"""

parsed = parser.parse_policy_text(sample_policy)
parser.save_as_json(parsed, 'parsed_policy.json')
print("✅ 보험 약관 파싱 완료")
```

### 1.3 Markdown 보고서 생성기

```python
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO

class FinancialReportGenerator:
    """금융 거래 Markdown 보고서 생성기"""
    
    def __init__(self, transaction_df: pd.DataFrame):
        self.df = transaction_df
        self.report_sections = []
        
    def generate_full_report(self) -> str:
        """전체 보고서 생성"""
        
        # 헤더
        self._add_header()
        
        # 요약 통계
        self._add_summary_statistics()
        
        # 카테고리별 분석
        self._add_category_analysis()
        
        # 시간대별 분석
        self._add_temporal_analysis()
        
        # AI 인사이트
        self._add_ai_insights()
        
        # 추천사항
        self._add_recommendations()
        
        return '\n\n'.join(self.report_sections)
    
    def _add_header(self):
        """보고서 헤더 추가"""
        header = f"""# 📊 금융 거래 분석 보고서

**생성일시**: {datetime.now().strftime('%Y년 %m월 %d일 %H:%M')}  
**분석기간**: {self.df['date'].min()} ~ {self.df['date'].max()}  
**총 거래건수**: {len(self.df):,}건"""
        
        self.report_sections.append(header)
    
    def _add_summary_statistics(self):
        """요약 통계 추가"""
        total_income = self.df[self.df['type'] == 'deposit']['amount'].sum()
        total_expense = self.df[self.df['type'] == 'withdrawal']['amount'].sum()
        net_flow = total_income - total_expense
        
        summary = f"""## 💰 재무 요약

| 항목 | 금액 |
|------|------|
| **총 수입** | {total_income:,.0f}원 |
| **총 지출** | {total_expense:,.0f}원 |
| **순 현금흐름** | {net_flow:+,.0f}원 |
| **평균 일일 지출** | {total_expense / 30:,.0f}원 |
| **최대 단일 지출** | {self.df[self.df['type'] == 'withdrawal']['amount'].max():,.0f}원 |"""
        
        self.report_sections.append(summary)
    
    def _add_category_analysis(self):
        """카테고리별 분석 추가"""
        category_spending = self.df[self.df['type'] == 'withdrawal'].groupby('category')['amount'].agg(['sum', 'count', 'mean'])
        category_spending = category_spending.sort_values('sum', ascending=False)
        
        category_section = "## 📂 카테고리별 지출 분석\n\n"
        
        # 차트 생성
        chart = self._create_pie_chart(category_spending['sum'])
        category_section += f"![카테고리별 지출]({chart})\n\n"
        
        # 테이블
        category_section += "### 상세 내역\n\n"
        category_section += "| 카테고리 | 총액 | 건수 | 평균 | 비중 |\n"
        category_section += "|---------|------|------|------|------|\n"
        
        total_spending = category_spending['sum'].sum()
        for category, row in category_spending.iterrows():
            percentage = (row['sum'] / total_spending) * 100
            category_section += f"| {category} | {row['sum']:,.0f}원 | {row['count']:.0f}건 | {row['mean']:,.0f}원 | {percentage:.1f}% |\n"
        
        self.report_sections.append(category_section)
    
    def _add_temporal_analysis(self):
        """시간대별 분석 추가"""
        # 요일별 분석
        weekday_spending = self.df[self.df['type'] == 'withdrawal'].groupby('weekday')['amount'].sum()
        
        temporal = "## 📅 시간대별 분석\n\n"
        temporal += "### 요일별 지출 패턴\n\n"
        
        weekday_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        temporal += "```\n"
        for day in weekday_order:
            if day in weekday_spending:
                amount = weekday_spending[day]
                bar_length = int(amount / weekday_spending.max() * 30)
                temporal += f"{day[:3]:>3} | {'█' * bar_length} {amount:,.0f}원\n"
        temporal += "```"
        
        self.report_sections.append(temporal)
    
    def _add_ai_insights(self):
        """AI 인사이트 추가"""
        insights = "## 🤖 AI 분석 인사이트\n\n"
        
        # 지출 패턴 분석
        avg_daily_spending = self.df[self.df['type'] == 'withdrawal']['amount'].sum() / 30
        high_spending_days = self.df[self.df['type'] == 'withdrawal'].groupby('date')['amount'].sum()
        high_spending_days = high_spending_days[high_spending_days > avg_daily_spending * 2]
        
        insights += "### 주요 발견사항\n\n"
        insights += f"1. **지출 패턴**: 일평균 {avg_daily_spending:,.0f}원 지출\n"
        insights += f"2. **고액 지출일**: {len(high_spending_days)}일 (평균의 2배 초과)\n"
        
        # 절약 가능 항목
        top_category = self.df[self.df['type'] == 'withdrawal'].groupby('category')['amount'].sum().idxmax()
        top_amount = self.df[self.df['type'] == 'withdrawal'].groupby('category')['amount'].sum().max()
        
        insights += f"3. **최대 지출 카테고리**: {top_category} ({top_amount:,.0f}원)\n"
        insights += f"4. **절약 잠재력**: {top_category}에서 20% 절감 시 월 {top_amount * 0.2:,.0f}원 절약 가능\n"
        
        self.report_sections.append(insights)
    
    def _add_recommendations(self):
        """추천사항 추가"""
        recommendations = "## 💡 맞춤형 추천사항\n\n"
        
        recommendations += """### 지출 관리
- [ ] 고정 지출 검토 및 최적화
- [ ] 충동구매 방지를 위한 24시간 규칙 적용
- [ ] 카테고리별 예산 설정

### 저축 및 투자
- [ ] 월 수입의 20% 이상 저축 목표 설정
- [ ] 비상금 3-6개월치 생활비 확보
- [ ] 장기 투자 포트폴리오 구성 검토

### 금융 상품 활용
- [ ] 고금리 적금 상품 가입 검토
- [ ] 신용카드 혜택 최적화
- [ ] 세금 절감 상품 활용"""
        
        self.report_sections.append(recommendations)
    
    def _create_pie_chart(self, data):
        """파이 차트 생성 (Base64 인코딩)"""
        plt.figure(figsize=(8, 6))
        plt.pie(data.values, labels=data.index, autopct='%1.1f%%')
        plt.title('카테고리별 지출 비중')
        
        # Base64로 인코딩
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    
    def save_report(self, output_path: str):
        """보고서 파일로 저장"""
        report = self.generate_full_report()
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)

# 사용 예시
# DataFrame 준비 (실제 데이터 필요)
df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100),
    'amount': np.random.randint(1000, 100000, 100),
    'type': np.random.choice(['deposit', 'withdrawal'], 100, p=[0.2, 0.8]),
    'category': np.random.choice(['식음료', '쇼핑', '교통', '의료'], 100),
    'weekday': pd.date_range('2024-01-01', periods=100).day_name()
})

generator = FinancialReportGenerator(df)
generator.save_report('financial_report.md')
print("✅ Markdown 보고서 생성 완료")
```

---

## 2. 벡터 DB 구축 예제

### 2.1 ChromaDB 금융 데이터 관리

```python
import chromadb
from chromadb.utils import embedding_functions
import json
from typing import List, Dict, Optional
import hashlib
from datetime import datetime

class FinancialChromaDB:
    """금융 데이터 전용 ChromaDB 관리 클래스"""
    
    def __init__(self, persist_directory: str = "./chroma_financial_db"):
        # ChromaDB 클라이언트 초기화
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # 임베딩 함수 설정 (OpenAI 사용)
        self.embedding_function = embedding_functions.OpenAIEmbeddingFunction(
            api_key="your-openai-api-key",
            model_name="text-embedding-ada-002"
        )
        
        # 컬렉션 초기화
        self._init_collections()
    
    def _init_collections(self):
        """컬렉션 초기화"""
        self.collections = {}
        
        # 거래 데이터 컬렉션
        self.collections['transactions'] = self.client.get_or_create_collection(
            name="transactions",
            embedding_function=self.embedding_function,
            metadata={"description": "Financial transactions"}
        )
        
        # 고객 프로파일 컬렉션
        self.collections['profiles'] = self.client.get_or_create_collection(
            name="customer_profiles",
            embedding_function=self.embedding_function,
            metadata={"description": "Customer profiles"}
        )
        
        # 금융 상품 컬렉션
        self.collections['products'] = self.client.get_or_create_collection(
            name="financial_products",
            embedding_function=self.embedding_function,
            metadata={"description": "Financial products"}
        )
    
    def add_transactions_batch(self, transactions: List[Dict], user_id: str):
        """거래 데이터 일괄 추가"""
        documents = []
        metadatas = []
        ids = []
        
        for trans in transactions:
            # 문서 생성 (자연어 형태)
            doc = self._create_transaction_document(trans)
            documents.append(doc)
            
            # 메타데이터
            metadata = {
                'user_id': user_id,
                'date': trans['date'],
                'amount': float(trans['amount']),
                'category': trans.get('category', 'unknown'),
                'type': trans['type'],
                'timestamp': datetime.now().isoformat()
            }
            metadatas.append(metadata)
            
            # 고유 ID 생성
            id_string = f"{user_id}_{trans['date']}_{trans['amount']}_{len(ids)}"
            unique_id = hashlib.sha256(id_string.encode()).hexdigest()[:16]
            ids.append(unique_id)
        
        # ChromaDB에 추가
        self.collections['transactions'].add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        return len(documents)
    
    def _create_transaction_document(self, transaction: Dict) -> str:
        """거래를 자연어 문서로 변환"""
        template = """
        거래 정보:
        날짜: {date}
        시간: {time}
        거래유형: {type}
        금액: {amount:,}원
        상호/설명: {description}
        카테고리: {category}
        잔액: {balance:,}원
        
        거래 맥락:
        이 거래는 {category} 카테고리의 {type} 거래입니다.
        {amount:,}원이 {action}되었으며, 거래 후 잔액은 {balance:,}원입니다.
        """
        
        action = "출금" if transaction['type'] == 'withdrawal' else "입금"
        
        return template.format(
            date=transaction.get('date', ''),
            time=transaction.get('time', ''),
            type=transaction.get('type', ''),
            amount=transaction.get('amount', 0),
            description=transaction.get('description', ''),
            category=transaction.get('category', '기타'),
            balance=transaction.get('balance', 0),
            action=action
        )
    
    def semantic_search(self, 
                       query: str, 
                       collection_name: str = 'transactions',
                       filter_dict: Optional[Dict] = None,
                       n_results: int = 10) -> List[Dict]:
        """의미 기반 검색"""
        
        collection = self.collections.get(collection_name)
        if not collection:
            raise ValueError(f"Collection {collection_name} not found")
        
        # 검색 실행
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter_dict if filter_dict else None
        )
        
        # 결과 포맷팅
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                result = {
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                    'distance': results['distances'][0][i] if results['distances'] else 0,
                    'id': results['ids'][0][i] if results['ids'] else None
                }
                formatted_results.append(result)
        
        return formatted_results
    
    def add_customer_profile(self, user_id: str, profile_data: Dict):
        """고객 프로파일 추가"""
        
        # 프로파일 문서 생성
        profile_doc = f"""
        고객 프로파일:
        고객 ID: {user_id}
        연령대: {profile_data.get('age_group', '')}
        직업: {profile_data.get('occupation', '')}
        월 평균 수입: {profile_data.get('monthly_income', 0):,}원
        투자 성향: {profile_data.get('risk_profile', '')}
        금융 목표: {', '.join(profile_data.get('financial_goals', []))}
        
        선호 금융 상품:
        {', '.join(profile_data.get('preferred_products', []))}
        
        거래 패턴:
        주요 지출 카테고리: {profile_data.get('main_spending_category', '')}
        평균 월 지출: {profile_data.get('avg_monthly_spending', 0):,}원
        저축률: {profile_data.get('savings_rate', 0)}%
        """
        
        # 메타데이터
        metadata = {
            'user_id': user_id,
            'age_group': profile_data.get('age_group', ''),
            'risk_profile': profile_data.get('risk_profile', ''),
            'monthly_income': profile_data.get('monthly_income', 0),
            'created_at': datetime.now().isoformat()
        }
        
        # 프로파일 추가
        self.collections['profiles'].add(
            documents=[profile_doc],
            metadatas=[metadata],
            ids=[user_id]
        )
    
    def get_similar_customers(self, user_id: str, n_results: int = 5) -> List[str]:
        """유사한 고객 찾기"""
        
        # 현재 고객 프로파일 가져오기
        current_profile = self.collections['profiles'].get(ids=[user_id])
        
        if not current_profile['documents']:
            return []
        
        # 유사 고객 검색
        similar = self.collections['profiles'].query(
            query_texts=current_profile['documents'],
            n_results=n_results + 1,  # 자기 자신 포함
            where={"user_id": {"$ne": user_id}}  # 자기 자신 제외
        )
        
        similar_user_ids = []
        if similar['ids'] and similar['ids'][0]:
            similar_user_ids = [id for id in similar['ids'][0] if id != user_id]
        
        return similar_user_ids[:n_results]
    
    def delete_user_data(self, user_id: str):
        """사용자 데이터 삭제 (GDPR 준수)"""
        
        # 거래 데이터 삭제
        trans_results = self.collections['transactions'].get(
            where={"user_id": user_id}
        )
        if trans_results['ids']:
            self.collections['transactions'].delete(ids=trans_results['ids'])
        
        # 프로파일 삭제
        self.collections['profiles'].delete(ids=[user_id])
        
        return f"User {user_id} data deleted"

# 사용 예시
db = FinancialChromaDB()

# 거래 데이터 추가
sample_transactions = [
    {
        'date': '2024-01-15',
        'time': '14:30',
        'type': 'withdrawal',
        'amount': 45000,
        'description': '이마트 장보기',
        'category': '쇼핑',
        'balance': 2500000
    }
]

db.add_transactions_batch(sample_transactions, 'user123')

# 검색
results = db.semantic_search(
    "이마트에서 쇼핑한 내역",
    filter_dict={'user_id': 'user123'}
)

for result in results:
    print(f"Score: {1 - result['distance']:.2f}")
    print(f"Document: {result['document'][:200]}...")
```

### 2.2 Pinecone 대규모 데이터 처리

```python
import pinecone
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Tuple
import json
from tqdm import tqdm

class PineconeFinancialIndex:
    """Pinecone 기반 대규모 금융 데이터 인덱스"""
    
    def __init__(self, 
                 api_key: str,
                 environment: str = "us-west1-gcp",
                 index_name: str = "financial-rag"):
        
        # Pinecone 초기화
        pinecone.init(api_key=api_key, environment=environment)
        
        # 임베딩 모델 (multilingual 지원)
        self.encoder = SentenceTransformer('distiluse-base-multilingual-cased-v1')
        self.dimension = 512  # 모델 차원
        
        # 인덱스 설정
        self.index_name = index_name
        self._setup_index()
    
    def _setup_index(self):
        """인덱스 생성 또는 연결"""
        
        # 인덱스 존재 확인
        if self.index_name not in pinecone.list_indexes():
            # 새 인덱스 생성
            pinecone.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric='cosine',
                pods=1,  # 무료 티어
                replicas=1,
                pod_type='p1.x1'
            )
            print(f"Created new index: {self.index_name}")
        
        # 인덱스 연결
        self.index = pinecone.Index(self.index_name)
        
        # 통계 출력
        stats = self.index.describe_index_stats()
        print(f"Index stats: {stats}")
    
    def bulk_upsert(self, 
                   documents: List[Dict],
                   batch_size: int = 100,
                   namespace: str = None):
        """대량 데이터 업서트"""
        
        total_vectors = []
        
        for doc in tqdm(documents, desc="Processing documents"):
            # 텍스트 생성
            text = self._document_to_text(doc)
            
            # 임베딩 생성
            embedding = self.encoder.encode(text).tolist()
            
            # 벡터 구성
            vector = {
                'id': doc['id'],
                'values': embedding,
                'metadata': self._prepare_metadata(doc)
            }
            
            total_vectors.append(vector)
            
            # 배치 처리
            if len(total_vectors) >= batch_size:
                self.index.upsert(
                    vectors=total_vectors,
                    namespace=namespace
                )
                total_vectors = []
        
        # 남은 벡터 처리
        if total_vectors:
            self.index.upsert(
                vectors=total_vectors,
                namespace=namespace
            )
        
        print(f"Upserted {len(documents)} documents")
    
    def _document_to_text(self, doc: Dict) -> str:
        """문서를 텍스트로 변환"""
        
        doc_type = doc.get('type', 'general')
        
        if doc_type == 'transaction':
            return f"""
            Transaction on {doc['date']}:
            Amount: {doc['amount']} KRW
            Category: {doc['category']}
            Description: {doc['description']}
            """
        
        elif doc_type == 'product':
            return f"""
            Financial Product: {doc['name']}
            Provider: {doc['provider']}
            Type: {doc['product_type']}
            Interest Rate: {doc.get('interest_rate', 'N/A')}
            Features: {', '.join(doc.get('features', []))}
            """
        
        elif doc_type == 'news':
            return f"""
            {doc['title']}
            {doc['content']}
            Source: {doc['source']}
            Date: {doc['date']}
            """
        
        else:
            return doc.get('text', str(doc))
    
    def _prepare_metadata(self, doc: Dict) -> Dict:
        """메타데이터 준비 (40KB 제한)"""
        
        metadata = {}
        
        # 필수 필드
        for key in ['type', 'date', 'user_id', 'category']:
            if key in doc:
                metadata[key] = doc[key]
        
        # 숫자 필드
        for key in ['amount', 'score', 'priority']:
            if key in doc:
                metadata[key] = float(doc[key])
        
        # 텍스트 필드 (길이 제한)
        for key in ['description', 'title']:
            if key in doc:
                metadata[key] = doc[key][:500]  # 500자 제한
        
        return metadata
    
    def hybrid_search(self,
                     query: str,
                     filter_conditions: Dict = None,
                     namespace: str = None,
                     top_k: int = 10,
                     include_metadata: bool = True) -> List[Dict]:
        """하이브리드 검색 (시맨틱 + 메타데이터)"""
        
        # 쿼리 임베딩
        query_embedding = self.encoder.encode(query).tolist()
        
        # Pinecone 검색
        results = self.index.query(
            vector=query_embedding,
            filter=filter_conditions,
            namespace=namespace,
            top_k=top_k,
            include_metadata=include_metadata
        )
        
        # 결과 포맷팅
        formatted_results = []
        for match in results['matches']:
            result = {
                'id': match['id'],
                'score': match['score'],
                'metadata': match.get('metadata', {})
            }
            formatted_results.append(result)
        
        return formatted_results
    
    def update_metadata(self, 
                       id: str,
                       metadata: Dict,
                       namespace: str = None):
        """메타데이터 업데이트"""
        
        # 기존 벡터 가져오기
        fetch_result = self.index.fetch(ids=[id], namespace=namespace)
        
        if id in fetch_result['vectors']:
            vector = fetch_result['vectors'][id]
            
            # 메타데이터 업데이트
            vector['metadata'].update(metadata)
            
            # 다시 업서트
            self.index.upsert(
                vectors=[{
                    'id': id,
                    'values': vector['values'],
                    'metadata': vector['metadata']
                }],
                namespace=namespace
            )
    
    def delete_by_filter(self, filter_conditions: Dict, namespace: str = None):
        """필터 조건으로 삭제"""
        
        # 더미 쿼리로 필터 매칭 ID 찾기
        dummy_vector = [0.0] * self.dimension
        
        results = self.index.query(
            vector=dummy_vector,
            filter=filter_conditions,
            namespace=namespace,
            top_k=10000  # 최대한 많이
        )
        
        # ID 추출
        ids_to_delete = [match['id'] for match in results['matches']]
        
        # 삭제
        if ids_to_delete:
            self.index.delete(ids=ids_to_delete, namespace=namespace)
            print(f"Deleted {len(ids_to_delete)} vectors")
        
        return len(ids_to_delete)

# 사용 예시
pinecone_index = PineconeFinancialIndex(
    api_key="your-api-key",
    environment="us-west1-gcp"
)

# 대량 데이터 준비
documents = [
    {
        'id': f'doc_{i}',
        'type': 'transaction',
        'date': '2024-01-15',
        'amount': 50000 * i,
        'category': '쇼핑',
        'description': f'거래 {i}',
        'user_id': 'user123'
    }
    for i in range(1000)
]

# 업서트
pinecone_index.bulk_upsert(documents, batch_size=100)

# 검색
results = pinecone_index.hybrid_search(
    query="대량 쇼핑 거래",
    filter_conditions={'user_id': 'user123', 'category': '쇼핑'},
    top_k=5
)

for result in results:
    print(f"ID: {result['id']}, Score: {result['score']:.3f}")
```

---

## 3. RAG 시스템 구현 예제

### 3.1 LangChain RAG 챗봇

```python
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.callbacks import StreamingStdOutCallbackHandler
import os

class FinancialAdvisorRAG:
    """금융 상담 RAG 챗봇"""
    
    def __init__(self, openai_api_key: str):
        os.environ["OPENAI_API_KEY"] = openai_api_key
        
        # 컴포넌트 초기화
        self._init_embeddings()
        self._init_llm()
        self._init_vectorstore()
        self._init_memory()
        self._init_chain()
    
    def _init_embeddings(self):
        """임베딩 모델 초기화"""
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002"
        )
    
    def _init_llm(self):
        """LLM 초기화"""
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.2,
            max_tokens=1500,
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()]
        )
    
    def _init_vectorstore(self):
        """벡터 스토어 초기화"""
        self.vectorstore = Chroma(
            persist_directory="./financial_vectorstore",
            embedding_function=self.embeddings,
            collection_name="financial_data"
        )
    
    def _init_memory(self):
        """대화 메모리 초기화"""
        self.memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            k=5,  # 최근 5개 대화만 기억
            return_messages=True,
            output_key="answer"
        )
    
    def _init_chain(self):
        """RAG 체인 초기화"""
        
        # 프롬프트 템플릿
        template = """당신은 전문적인 AI 금융 상담사입니다.
        고객의 금융 데이터와 거래 내역을 분석하여 개인화된 조언을 제공합니다.
        
        참고 정보:
        {context}
        
        대화 기록:
        {chat_history}
        
        고객 질문: {question}
        
        답변 지침:
        1. 정확한 데이터와 수치를 기반으로 답변
        2. 복잡한 금융 용어는 쉽게 설명
        3. 실행 가능한 구체적 조언 제공
        4. 리스크가 있는 조언은 주의사항 명시
        5. 불확실한 경우 전문가 상담 권유
        
        답변:"""
        
        qa_prompt = PromptTemplate(
            template=template,
            input_variables=["context", "chat_history", "question"]
        )
        
        # 체인 생성
        self.qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(
                search_type="mmr",  # Maximum Marginal Relevance
                search_kwargs={"k": 5, "fetch_k": 10}
            ),
            memory=self.memory,
            combine_docs_chain_kwargs={"prompt": qa_prompt},
            return_source_documents=True,
            verbose=False
        )
    
    def chat(self, question: str) -> Dict:
        """사용자 질문 처리"""
        
        try:
            # RAG 체인 실행
            result = self.qa_chain({"question": question})
            
            # 소스 문서 정리
            sources = []
            if result.get("source_documents"):
                for doc in result["source_documents"]:
                    sources.append({
                        "content": doc.page_content[:200],
                        "metadata": doc.metadata
                    })
            
            return {
                "success": True,
                "answer": result["answer"],
                "sources": sources
            }
            
        except Exception as e:
            return {
                "success": False,
                "answer": f"죄송합니다. 오류가 발생했습니다: {str(e)}",
                "sources": []
            }
    
    def analyze_spending(self, period: str = "1개월") -> str:
        """지출 분석"""
        question = f"""
        최근 {period}간의 지출을 분석해주세요.
        1. 카테고리별 지출 비중
        2. 전월 대비 변화
        3. 비정상적인 지출 패턴
        4. 절약 가능 항목
        5. 구체적인 절약 방법
        """
        return self.chat(question)["answer"]
    
    def recommend_products(self) -> str:
        """금융 상품 추천"""
        question = """
        내 현재 재무 상황에 맞는 금융 상품을 추천해주세요.
        1. 적금/예금 상품
        2. 투자 상품
        3. 보험 상품
        4. 각 상품의 장단점
        5. 예상 수익률
        """
        return self.chat(question)["answer"]
    
    def clear_memory(self):
        """대화 기록 초기화"""
        self.memory.clear()
        return "대화 기록이 초기화되었습니다."

# 사용 예시
advisor = FinancialAdvisorRAG(openai_api_key="your-key")

# 대화
response = advisor.chat("이번 달 카페에서 얼마나 썼나요?")
print(f"답변: {response['answer']}")

# 지출 분석
analysis = advisor.analyze_spending("3개월")
print(f"분석: {analysis}")
```

---

## 4. 통합 파이프라인 예제

### 4.1 End-to-End RAG 파이프라인

```python
import pandas as pd
import json
from pathlib import Path
from typing import List, Dict, Optional
import logging
from datetime import datetime

class FinancialRAGPipeline:
    """금융 데이터 End-to-End RAG 파이프라인"""
    
    def __init__(self, config_path: str = "config.json"):
        # 설정 로드
        self.config = self._load_config(config_path)
        
        # 로깅 설정
        self._setup_logging()
        
        # 컴포넌트 초기화
        self.data_converter = None
        self.vector_db = None
        self.rag_chatbot = None
        
        self._init_components()
    
    def _load_config(self, config_path: str) -> Dict:
        """설정 파일 로드"""
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def _setup_logging(self):
        """로깅 설정"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('rag_pipeline.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def _init_components(self):
        """파이프라인 컴포넌트 초기화"""
        
        # 데이터 변환기
        from data_converter import BankStatementConverter
        self.data_converter = BankStatementConverter(
            bank_name=self.config.get('bank_name', 'KB국민은행')
        )
        
        # 벡터 DB
        from vector_db import FinancialChromaDB
        self.vector_db = FinancialChromaDB(
            persist_directory=self.config.get('vector_db_path', './chroma_db')
        )
        
        # RAG 챗봇
        from rag_chatbot import FinancialAdvisorRAG
        self.rag_chatbot = FinancialAdvisorRAG(
            openai_api_key=self.config.get('openai_api_key')
        )
        
        self.logger.info("All components initialized")
    
    def process_csv_files(self, csv_folder: str, user_id: str) -> int:
        """CSV 파일 일괄 처리"""
        
        csv_files = list(Path(csv_folder).glob("*.csv"))
        self.logger.info(f"Found {len(csv_files)} CSV files")
        
        total_transactions = 0
        
        for csv_file in csv_files:
            try:
                # CSV → JSON 변환
                json_data = self.data_converter.csv_to_json(str(csv_file))
                
                # 벡터 DB에 저장
                count = self.vector_db.add_transactions_batch(
                    json_data['transactions'],
                    user_id
                )
                
                total_transactions += count
                self.logger.info(f"Processed {csv_file.name}: {count} transactions")
                
            except Exception as e:
                self.logger.error(f"Error processing {csv_file.name}: {str(e)}")
        
        return total_transactions
    
    def create_user_profile(self, user_id: str, profile_data: Dict):
        """사용자 프로파일 생성"""
        
        try:
            # 프로파일 검증
            required_fields = ['age_group', 'occupation', 'monthly_income']
            for field in required_fields:
                if field not in profile_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # 프로파일 저장
            self.vector_db.add_customer_profile(user_id, profile_data)
            
            self.logger.info(f"Created profile for user {user_id}")
            
        except Exception as e:
            self.logger.error(f"Error creating profile: {str(e)}")
            raise
    
    def generate_financial_report(self, user_id: str) -> Dict:
        """종합 금융 보고서 생성"""
        
        report = {
            'user_id': user_id,
            'generated_at': datetime.now().isoformat(),
            'sections': {}
        }
        
        try:
            # 지출 분석
            report['sections']['spending_analysis'] = self.rag_chatbot.analyze_spending("3개월")
            
            # 투자 추천
            report['sections']['investment_recommendations'] = self.rag_chatbot.recommend_products()
            
            # 절약 방안
            savings_question = "구체적인 절약 방안을 제시해주세요."
            report['sections']['savings_tips'] = self.rag_chatbot.chat(savings_question)['answer']
            
            # 재무 건강도
            health_question = "내 재무 건강도를 평가해주세요."
            report['sections']['financial_health'] = self.rag_chatbot.chat(health_question)['answer']
            
            self.logger.info(f"Generated report for user {user_id}")
            
        except Exception as e:
            self.logger.error(f"Error generating report: {str(e)}")
            report['error'] = str(e)
        
        return report
    
    def interactive_session(self, user_id: str):
        """대화형 세션 시작"""
        
        print("\n" + "="*50)
        print("AI 금융 상담사와의 대화를 시작합니다.")
        print("종료하려면 'quit'를 입력하세요.")
        print("="*50 + "\n")
        
        while True:
            try:
                # 사용자 입력
                question = input("\n질문: ").strip()
                
                if question.lower() in ['quit', 'exit', '종료']:
                    print("\n대화를 종료합니다.")
                    break
                
                if not question:
                    continue
                
                # RAG 응답
                response = self.rag_chatbot.chat(question)
                
                print(f"\n답변: {response['answer']}")
                
                # 소스 표시
                if response.get('sources'):
                    print("\n참고 자료:")
                    for i, source in enumerate(response['sources'], 1):
                        print(f"  {i}. {source['content'][:100]}...")
                
            except KeyboardInterrupt:
                print("\n\n대화가 중단되었습니다.")
                break
            
            except Exception as e:
                print(f"\n오류 발생: {str(e)}")
    
    def run_full_pipeline(self, user_id: str, csv_folder: str, profile_data: Dict):
        """전체 파이프라인 실행"""
        
        self.logger.info(f"Starting full pipeline for user {user_id}")
        
        # 1. CSV 파일 처리
        print("1. CSV 파일 처리 중...")
        transaction_count = self.process_csv_files(csv_folder, user_id)
        print(f"   ✅ {transaction_count}개 거래 처리 완료")
        
        # 2. 사용자 프로파일 생성
        print("2. 사용자 프로파일 생성 중...")
        self.create_user_profile(user_id, profile_data)
        print("   ✅ 프로파일 생성 완료")
        
        # 3. 금융 보고서 생성
        print("3. 금융 보고서 생성 중...")
        report = self.generate_financial_report(user_id)
        
        # 보고서 저장
        report_path = f"reports/{user_id}_report_{datetime.now().strftime('%Y%m%d')}.json"
        Path("reports").mkdir(exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"   ✅ 보고서 저장: {report_path}")
        
        # 4. 대화형 세션
        print("\n4. AI 상담 시작")
        self.interactive_session(user_id)
        
        self.logger.info(f"Pipeline completed for user {user_id}")

# 사용 예시
if __name__ == "__main__":
    # 설정 파일 생성
    config = {
        "bank_name": "KB국민은행",
        "vector_db_path": "./financial_chroma_db",
        "openai_api_key": "your-openai-api-key"
    }
    
    with open("config.json", "w") as f:
        json.dump(config, f)
    
    # 파이프라인 실행
    pipeline = FinancialRAGPipeline("config.json")
    
    # 사용자 프로파일
    profile = {
        "age_group": "30대",
        "occupation": "회사원",
        "monthly_income": 4000000,
        "risk_profile": "중립형",
        "financial_goals": ["주택 구매", "노후 준비"],
        "preferred_products": ["적금", "펀드"]
    }
    
    # 전체 파이프라인 실행
    pipeline.run_full_pipeline(
        user_id="user123",
        csv_folder="./data/csv_files",
        profile_data=profile
    )
```

---

## 코드 실행 가이드

### 환경 설정

```bash
# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt
```

### requirements.txt

```
pandas==2.0.3
numpy==1.24.3
chromadb==0.4.22
pinecone-client==2.2.4
langchain==0.1.0
langchain-openai==0.0.5
sentence-transformers==2.2.2
openai==1.6.1
matplotlib==3.7.1
seaborn==0.12.2
tqdm==4.66.1
python-dotenv==1.0.0
```

### 실행 스크립트

```python
# run_pipeline.py

from dotenv import load_dotenv
import os

# 환경변수 로드
load_dotenv()

# 파이프라인 실행
from financial_rag_pipeline import FinancialRAGPipeline

pipeline = FinancialRAGPipeline()
pipeline.run_full_pipeline(
    user_id="test_user",
    csv_folder="./sample_data",
    profile_data={
        "age_group": "30대",
        "occupation": "개발자",
        "monthly_income": 5000000
    }
)
```

---

## 주의사항

1. **API 키 관리**: 절대 코드에 직접 API 키를 넣지 마세요
2. **데이터 보안**: 금융 데이터는 암호화하여 저장하세요
3. **규제 준수**: GDPR, 개인정보보호법을 준수하세요
4. **비용 관리**: OpenAI API 사용량을 모니터링하세요
5. **에러 처리**: 모든 예외 상황에 대한 처리를 구현하세요