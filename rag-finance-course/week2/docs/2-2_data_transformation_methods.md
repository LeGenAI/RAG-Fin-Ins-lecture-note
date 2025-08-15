# 2-2. 개인 거래내역 및 보험자료 텍스트를 .md, .json 형식으로 변환하기

## 학습 목표
- 금융 거래내역 데이터의 구조화 방법 이해
- CSV/Excel 데이터를 JSON/Markdown으로 변환하는 실무 기법 습득
- 보험 데이터 변환 및 Python 라이브러리 활용법 마스터

---

## 1. 금융 거래내역 데이터 구조화

### 1.1 왜 CSV/Excel에서 JSON/Markdown으로 변환하는가?

#### AI 모델 호환성 향상

**전통적 형식의 한계**
```csv
2024-01-15,14:30:25,1001,4500,,2450000,01
```
- AI가 이해하기 어려운 코드값
- 맥락 정보 부재
- 관계성 표현 불가

**AI-Ready 형식의 장점**
```json
{
  "transaction": {
    "narrative": "2024년 1월 15일 오후 2시 30분, 스타벅스에서 커피를 구매했습니다.",
    "context": "평일 점심시간 이후 일상적인 카페 방문",
    "amount": 4500,
    "category": "식음료",
    "frequency": "매일"
  }
}
```

#### 변환의 핵심 이점

| 측면 | CSV/Excel | JSON/Markdown |
|------|-----------|---------------|
| **가독성** | 숫자와 코드 중심 | 자연어 설명 포함 |
| **확장성** | 고정된 컬럼 구조 | 유연한 중첩 구조 |
| **메타데이터** | 제한적 | 풍부한 부가정보 |
| **AI 학습** | 전처리 필요 | 즉시 활용 가능 |

### 1.2 실제 은행 거래내역 포맷 분석

#### KB국민은행 거래내역 구조

**원본 CSV 형식**
```csv
거래일자,거래시간,적요,출금액,입금액,잔액,거래점
2024-01-15,14:30:25,스타벅스 강남점,4500,,2450000,인터넷뱅킹
2024-01-15,09:15:10,급여,,2800000,2454500,자동이체
2024-01-14,19:22:15,이마트 월드컵점,127500,,2327000,체크카드
```

**변환된 JSON 구조**
```json
{
  "account": {
    "bank": "KB국민은행",
    "account_number": "***-****-****-***",
    "currency": "KRW"
  },
  "transactions": [
    {
      "id": "KB2024011514302501",
      "datetime": "2024-01-15T14:30:25+09:00",
      "type": "withdrawal",
      "amount": 4500,
      "balance_after": 2450000,
      "merchant": {
        "name": "스타벅스 강남점",
        "category": "카페",
        "mcc": "5814"
      },
      "channel": "인터넷뱅킹",
      "tags": ["일상소비", "식음료", "정기지출"],
      "ai_insights": {
        "spending_pattern": "regular_daily",
        "budget_impact": "within_limit",
        "category_rank": 3
      }
    }
  ]
}
```

#### 신한은행 SOL 거래내역

**Excel 다운로드 형식**
```
거래일|거래구분|거래점명|적요|출금액|입금액|거래후잔액|거래시간
2024-01-15|이체|온라인|카카오페이|15000||3450000|15:45:22
```

**Markdown 변환 예시**
```markdown
## 거래 내역 요약

### 2024년 1월 15일
**오후 3:45** | 카카오페이 송금
- 금액: 15,000원 (출금)
- 잔액: 3,450,000원
- 채널: 온라인 이체
- 분류: P2P 송금 / 일상 거래
```

#### 우리은행 WON뱅킹 데이터

**구조화된 JSON-LD 형식**
```json
{
  "@context": "https://schema.org",
  "@type": "FinancialTransaction",
  "identifier": "WR20240115123456",
  "transactionDate": "2024-01-15",
  "amount": {
    "@type": "MonetaryAmount",
    "value": 50000,
    "currency": "KRW"
  },
  "description": "교통비 정산",
  "category": "Transportation",
  "paymentMethod": {
    "@type": "PaymentCard",
    "name": "우리카드"
  }
}
```

---

## 2. 보험 데이터 변환 사례

### 2.1 보험 약관 텍스트 구조화

#### 삼성생명 보험 약관 변환

**원본 약관 텍스트**
```text
제10조(보험금의 지급)
① 회사는 피보험자가 이 약관에서 정한 보험금 지급사유가 발생한 때에는 
   수익자에게 약정한 보험금을 지급합니다.
② 제1항의 보험금 지급사유의 발생시기는 다음과 같습니다.
   1. 사망보험금: 피보험자가 사망한 때
   2. 만기보험금: 보험기간이 끝나는 때
```

**구조화된 JSON 변환**
```json
{
  "policy": {
    "company": "삼성생명",
    "product": "종신보험",
    "version": "2024.01"
  },
  "clauses": [
    {
      "article_number": 10,
      "title": "보험금의 지급",
      "sections": [
        {
          "id": "10-1",
          "content": "회사는 피보험자가 이 약관에서 정한 보험금 지급사유가 발생한 때에는 수익자에게 약정한 보험금을 지급합니다.",
          "keywords": ["보험금", "지급", "피보험자", "수익자"],
          "conditions": {
            "trigger": "지급사유 발생",
            "beneficiary": "수익자",
            "obligation": "mandatory"
          }
        }
      ],
      "payment_events": [
        {
          "type": "death_benefit",
          "condition": "피보험자 사망",
          "payment_to": "수익자",
          "verification_required": ["사망진단서", "기본증명서"]
        },
        {
          "type": "maturity_benefit",
          "condition": "보험기간 만료",
          "payment_to": "계약자",
          "verification_required": ["신분증", "통장사본"]
        }
      ]
    }
  ]
}
```

### 2.2 보험금 청구 데이터 변환

#### KB손해보험 청구 데이터

**원본 청구서 데이터**
```
청구번호: KB2024-CLM-00123
청구일자: 2024-01-15
청구유형: 실손의료비
진료기관: 서울대학교병원
진료기간: 2024-01-10 ~ 2024-01-12
청구금액: 850,000원
```

**AI 처리용 JSON 변환**
```json
{
  "claim": {
    "id": "KB2024-CLM-00123",
    "submitted_date": "2024-01-15",
    "type": "medical_expense",
    "status": "under_review",
    "medical_info": {
      "hospital": "서울대학교병원",
      "treatment_period": {
        "start": "2024-01-10",
        "end": "2024-01-12"
      },
      "diagnosis": {
        "code": "K35.8",
        "description": "급성충수염"
      }
    },
    "financial_info": {
      "total_expense": 850000,
      "claimed_amount": 680000,
      "deductible": 170000,
      "expected_reimbursement": 544000
    },
    "documents": [
      {
        "type": "receipt",
        "status": "verified",
        "ocr_extracted": true
      },
      {
        "type": "diagnosis",
        "status": "verified",
        "ai_validated": true
      }
    ],
    "ai_assessment": {
      "fraud_score": 0.02,
      "auto_approval": true,
      "processing_time": "instant"
    }
  }
}
```

### 2.3 한화생명 보험 상품 데이터

**Markdown 형식 상품 설명서**
```markdown
# 한화생명 e든든한 종신보험

## 상품 개요
- **상품유형**: 종신보험
- **보험기간**: 종신
- **납입기간**: 10년/15년/20년/30년 선택
- **가입연령**: 15세 ~ 70세

## 주요 보장내용

### 사망보험금
피보험자가 보험기간 중 사망시 **1억원** 지급

### 특약 선택사항
1. **암진단특약**: 암 진단시 3천만원
2. **뇌출혈진단특약**: 뇌출혈 진단시 2천만원
3. **급성심근경색진단특약**: 급성심근경색 진단시 2천만원

## 보험료 예시
| 나이 | 성별 | 월보험료 |
|------|------|----------|
| 30세 | 남자 | 125,000원 |
| 30세 | 여자 | 108,000원 |
| 40세 | 남자 | 168,000원 |
| 40세 | 여자 | 145,000원 |

## AI 추천 포인트
- 30대 가장에게 적합한 기본 보장
- 특약 조합으로 맞춤형 설계 가능
- 업계 평균 대비 경쟁력 있는 보험료
```

---

## 3. Python 라이브러리와 도구

### 3.1 기본 데이터 변환 라이브러리

#### pandas를 활용한 CSV 처리

```python
import pandas as pd
import json
from datetime import datetime

class BankDataProcessor:
    def __init__(self, bank_name):
        self.bank_name = bank_name
        self.encoding_map = {
            'KB국민은행': 'cp949',
            '신한은행': 'utf-8',
            '우리은행': 'euc-kr',
            '하나은행': 'cp949'
        }
    
    def load_csv(self, file_path):
        """은행별 인코딩을 고려한 CSV 로드"""
        encoding = self.encoding_map.get(self.bank_name, 'utf-8')
        try:
            df = pd.read_csv(file_path, encoding=encoding)
            return df
        except UnicodeDecodeError:
            # 인코딩 자동 감지
            import chardet
            with open(file_path, 'rb') as f:
                result = chardet.detect(f.read())
            df = pd.read_csv(file_path, encoding=result['encoding'])
            return df
    
    def standardize_columns(self, df):
        """은행별 컬럼명 표준화"""
        column_mapping = {
            '거래일자': 'date',
            '거래일': 'date',
            '일자': 'date',
            '거래시간': 'time',
            '시간': 'time',
            '적요': 'description',
            '거래내용': 'description',
            '출금액': 'withdrawal',
            '출금': 'withdrawal',
            '입금액': 'deposit',
            '입금': 'deposit',
            '잔액': 'balance',
            '거래후잔액': 'balance'
        }
        
        df_renamed = df.rename(columns=column_mapping)
        return df_renamed
    
    def enrich_transaction_data(self, df):
        """거래 데이터 enrichment"""
        # 거래 유형 추가
        df['transaction_type'] = df.apply(
            lambda x: 'withdrawal' if pd.notna(x.get('withdrawal', 0)) and x.get('withdrawal', 0) > 0 
            else 'deposit', axis=1
        )
        
        # 거래 금액 통합
        df['amount'] = df.apply(
            lambda x: x.get('withdrawal', 0) if pd.notna(x.get('withdrawal', 0)) 
            else x.get('deposit', 0), axis=1
        )
        
        # 날짜/시간 파싱
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['weekday'] = df['date'].dt.day_name()
            df['month'] = df['date'].dt.month
            df['year'] = df['date'].dt.year
        
        return df

# 사용 예시
processor = BankDataProcessor('KB국민은행')
df = processor.load_csv('kb_transactions.csv')
df = processor.standardize_columns(df)
df = processor.enrich_transaction_data(df)
```

#### JSON 변환 고급 기법

```python
import json
from decimal import Decimal
from datetime import datetime, date

class FinancialJSONEncoder(json.JSONEncoder):
    """금융 데이터용 커스텀 JSON 인코더"""
    
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()
        elif isinstance(obj, pd.Timestamp):
            return obj.isoformat()
        elif pd.isna(obj):
            return None
        return super().default(obj)

def create_transaction_json(df, user_id, account_number):
    """DataFrame을 구조화된 JSON으로 변환"""
    
    transactions = []
    for _, row in df.iterrows():
        transaction = {
            'id': f"{user_id}_{row.name}",
            'date': row['date'],
            'time': row.get('time', '00:00:00'),
            'description': row['description'],
            'amount': abs(row['amount']),
            'type': row['transaction_type'],
            'balance_after': row['balance'],
            'metadata': {
                'weekday': row.get('weekday'),
                'month': row.get('month'),
                'year': row.get('year'),
                'channel': row.get('channel', 'unknown')
            },
            'ai_classification': classify_transaction(row['description'])
        }
        transactions.append(transaction)
    
    result = {
        'account': {
            'user_id': user_id,
            'account_number': account_number,
            'bank': 'KB국민은행',
            'currency': 'KRW'
        },
        'summary': {
            'total_transactions': len(transactions),
            'total_deposits': df[df['transaction_type'] == 'deposit']['amount'].sum(),
            'total_withdrawals': df[df['transaction_type'] == 'withdrawal']['amount'].sum(),
            'period': {
                'start': df['date'].min(),
                'end': df['date'].max()
            }
        },
        'transactions': transactions
    }
    
    return json.dumps(result, cls=FinancialJSONEncoder, ensure_ascii=False, indent=2)

def classify_transaction(description):
    """AI를 위한 거래 자동 분류"""
    categories = {
        '식음료': ['카페', '커피', '스타벅스', '식당', '배달'],
        '교통': ['지하철', '버스', '택시', '주유', '주차'],
        '쇼핑': ['마트', '백화점', '온라인', '쿠팡', '네이버'],
        '의료': ['병원', '약국', '의원', '한의원'],
        '통신': ['KT', 'SKT', 'LG', '통신'],
        '금융': ['이체', '대출', '이자', '수수료'],
        '급여': ['급여', '월급', '상여', '보너스']
    }
    
    description_lower = description.lower()
    for category, keywords in categories.items():
        if any(keyword in description_lower for keyword in keywords):
            return {
                'category': category,
                'confidence': 0.95,
                'keywords_matched': [k for k in keywords if k in description_lower]
            }
    
    return {
        'category': '기타',
        'confidence': 0.5,
        'keywords_matched': []
    }
```

### 3.2 Markdown 변환 도구

```python
import pandas as pd
from datetime import datetime
from typing import List, Dict

class MarkdownReportGenerator:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.report = []
    
    def add_header(self, text: str, level: int = 1):
        """헤더 추가"""
        self.report.append(f"{'#' * level} {text}\n")
    
    def add_paragraph(self, text: str):
        """단락 추가"""
        self.report.append(f"{text}\n")
    
    def add_table(self, data: pd.DataFrame, columns: List[str] = None):
        """테이블 추가"""
        if columns:
            data = data[columns]
        
        # 헤더
        headers = '| ' + ' | '.join(data.columns) + ' |'
        separator = '|' + '|'.join(['---' for _ in data.columns]) + '|'
        
        self.report.append(headers)
        self.report.append(separator)
        
        # 데이터 행
        for _, row in data.iterrows():
            row_str = '| ' + ' | '.join([str(v) for v in row.values]) + ' |'
            self.report.append(row_str)
        
        self.report.append('')
    
    def add_list(self, items: List[str], ordered: bool = False):
        """리스트 추가"""
        for i, item in enumerate(items):
            prefix = f"{i+1}." if ordered else "-"
            self.report.append(f"{prefix} {item}")
        self.report.append('')
    
    def generate_financial_report(self):
        """금융 거래 보고서 생성"""
        self.add_header("금융 거래 분석 보고서")
        
        # 기간 정보
        start_date = self.df['date'].min()
        end_date = self.df['date'].max()
        self.add_paragraph(f"**분석 기간**: {start_date} ~ {end_date}")
        
        # 요약 통계
        self.add_header("거래 요약", 2)
        
        summary_items = [
            f"총 거래 건수: **{len(self.df)}건**",
            f"총 입금액: **{self.df[self.df['transaction_type']=='deposit']['amount'].sum():,.0f}원**",
            f"총 출금액: **{self.df[self.df['transaction_type']=='withdrawal']['amount'].sum():,.0f}원**",
            f"평균 거래액: **{self.df['amount'].mean():,.0f}원**"
        ]
        self.add_list(summary_items)
        
        # 카테고리별 분석
        self.add_header("카테고리별 지출 분석", 2)
        
        if 'category' in self.df.columns:
            category_summary = self.df[self.df['transaction_type']=='withdrawal'].groupby('category')['amount'].agg(['sum', 'count', 'mean'])
            category_summary.columns = ['총액', '건수', '평균']
            category_summary['총액'] = category_summary['총액'].apply(lambda x: f"{x:,.0f}원")
            category_summary['평균'] = category_summary['평균'].apply(lambda x: f"{x:,.0f}원")
            
            self.add_table(category_summary.reset_index())
        
        # 주요 거래 내역
        self.add_header("최근 주요 거래", 2)
        
        recent_transactions = self.df.nlargest(5, 'amount')[['date', 'description', 'amount', 'transaction_type']]
        recent_transactions['amount'] = recent_transactions['amount'].apply(lambda x: f"{x:,.0f}원")
        
        self.add_table(recent_transactions)
        
        # AI 인사이트
        self.add_header("AI 분석 인사이트", 2)
        
        insights = self.generate_ai_insights()
        self.add_list(insights)
        
        return '\n'.join(self.report)
    
    def generate_ai_insights(self):
        """AI 인사이트 생성"""
        insights = []
        
        # 지출 패턴 분석
        if 'weekday' in self.df.columns:
            top_spending_day = self.df[self.df['transaction_type']=='withdrawal'].groupby('weekday')['amount'].sum().idxmax()
            insights.append(f"📊 **{top_spending_day}**에 가장 많은 지출이 발생합니다")
        
        # 월별 트렌드
        if 'month' in self.df.columns:
            monthly_spending = self.df[self.df['transaction_type']=='withdrawal'].groupby('month')['amount'].sum()
            if len(monthly_spending) > 1:
                trend = "증가" if monthly_spending.iloc[-1] > monthly_spending.iloc[0] else "감소"
                insights.append(f"📈 월별 지출이 **{trend}** 추세를 보입니다")
        
        # 고액 거래 알림
        high_value_threshold = self.df['amount'].quantile(0.9)
        high_value_count = len(self.df[self.df['amount'] > high_value_threshold])
        insights.append(f"⚠️ {high_value_count}건의 고액 거래가 감지되었습니다 (기준: {high_value_threshold:,.0f}원 이상)")
        
        return insights

# 사용 예시
generator = MarkdownReportGenerator(df)
markdown_report = generator.generate_financial_report()
print(markdown_report)

# 파일로 저장
with open('financial_report.md', 'w', encoding='utf-8') as f:
    f.write(markdown_report)
```

### 3.3 데이터 검증 및 품질 관리

```python
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import logging

class DataQualityValidator:
    def __init__(self):
        self.validation_results = {}
        self.logger = logging.getLogger(__name__)
    
    def validate_completeness(self, df: pd.DataFrame, required_columns: List[str]) -> Dict:
        """데이터 완전성 검증"""
        results = {}
        
        for col in required_columns:
            if col not in df.columns:
                results[col] = {
                    'exists': False,
                    'completeness': 0.0,
                    'message': f"Required column '{col}' is missing"
                }
            else:
                missing_count = df[col].isna().sum()
                total_count = len(df)
                completeness = 1 - (missing_count / total_count)
                
                results[col] = {
                    'exists': True,
                    'completeness': completeness,
                    'missing_count': missing_count,
                    'total_count': total_count,
                    'status': 'OK' if completeness > 0.95 else 'WARNING' if completeness > 0.8 else 'ERROR'
                }
        
        return results
    
    def validate_consistency(self, df: pd.DataFrame) -> Dict:
        """데이터 일관성 검증"""
        results = {}
        
        # 잔액 일관성 검사
        if all(col in df.columns for col in ['balance', 'amount', 'transaction_type']):
            balance_errors = []
            
            for i in range(1, len(df)):
                prev_balance = df.iloc[i-1]['balance']
                curr_balance = df.iloc[i]['balance']
                transaction_amount = df.iloc[i]['amount']
                transaction_type = df.iloc[i]['transaction_type']
                
                if transaction_type == 'withdrawal':
                    expected_balance = prev_balance - transaction_amount
                else:
                    expected_balance = prev_balance + transaction_amount
                
                if abs(expected_balance - curr_balance) > 1:  # 1원 오차 허용
                    balance_errors.append({
                        'index': i,
                        'expected': expected_balance,
                        'actual': curr_balance,
                        'difference': expected_balance - curr_balance
                    })
            
            results['balance_consistency'] = {
                'errors': balance_errors,
                'error_count': len(balance_errors),
                'error_rate': len(balance_errors) / len(df),
                'status': 'OK' if len(balance_errors) == 0 else 'ERROR'
            }
        
        # 날짜 순서 검사
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            is_sorted = df['date'].is_monotonic_increasing
            
            results['date_order'] = {
                'is_sorted': is_sorted,
                'status': 'OK' if is_sorted else 'WARNING',
                'message': 'Dates are in chronological order' if is_sorted else 'Dates are not in chronological order'
            }
        
        return results
    
    def validate_format(self, df: pd.DataFrame) -> Dict:
        """데이터 형식 검증"""
        results = {}
        
        # 금액 형식 검사
        amount_columns = ['amount', 'withdrawal', 'deposit', 'balance']
        for col in amount_columns:
            if col in df.columns:
                non_numeric = df[~df[col].apply(lambda x: pd.isna(x) or isinstance(x, (int, float)))]
                
                results[f'{col}_format'] = {
                    'valid_count': len(df) - len(non_numeric),
                    'invalid_count': len(non_numeric),
                    'invalid_indices': non_numeric.index.tolist(),
                    'status': 'OK' if len(non_numeric) == 0 else 'ERROR'
                }
        
        # 날짜 형식 검사
        if 'date' in df.columns:
            date_errors = []
            for idx, date_val in df['date'].items():
                try:
                    pd.to_datetime(date_val)
                except:
                    date_errors.append(idx)
            
            results['date_format'] = {
                'valid_count': len(df) - len(date_errors),
                'invalid_count': len(date_errors),
                'invalid_indices': date_errors,
                'status': 'OK' if len(date_errors) == 0 else 'ERROR'
            }
        
        return results
    
    def validate_business_rules(self, df: pd.DataFrame) -> Dict:
        """비즈니스 규칙 검증"""
        results = {}
        
        # 음수 잔액 검사
        if 'balance' in df.columns:
            negative_balance = df[df['balance'] < 0]
            results['negative_balance'] = {
                'count': len(negative_balance),
                'indices': negative_balance.index.tolist(),
                'status': 'WARNING' if len(negative_balance) > 0 else 'OK'
            }
        
        # 비정상적인 거래 금액 검사
        if 'amount' in df.columns:
            q99 = df['amount'].quantile(0.99)
            q01 = df['amount'].quantile(0.01)
            outliers = df[(df['amount'] > q99 * 10) | (df['amount'] < q01 / 10)]
            
            results['amount_outliers'] = {
                'count': len(outliers),
                'indices': outliers.index.tolist(),
                'threshold_upper': q99 * 10,
                'threshold_lower': q01 / 10,
                'status': 'WARNING' if len(outliers) > 0 else 'OK'
            }
        
        # 중복 거래 검사
        duplicate_columns = ['date', 'time', 'amount', 'description']
        available_columns = [col for col in duplicate_columns if col in df.columns]
        
        if available_columns:
            duplicates = df[df.duplicated(subset=available_columns, keep=False)]
            results['duplicate_transactions'] = {
                'count': len(duplicates),
                'indices': duplicates.index.tolist(),
                'status': 'WARNING' if len(duplicates) > 0 else 'OK'
            }
        
        return results
    
    def generate_quality_report(self, df: pd.DataFrame) -> str:
        """종합 품질 보고서 생성"""
        report = []
        report.append("# 데이터 품질 검증 보고서\n")
        report.append(f"**검증 일시**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        report.append(f"**총 레코드 수**: {len(df)}\n")
        
        # 필수 컬럼 검증
        required_columns = ['date', 'description', 'amount', 'balance']
        completeness = self.validate_completeness(df, required_columns)
        
        report.append("## 1. 데이터 완전성\n")
        for col, result in completeness.items():
            status_emoji = "✅" if result.get('status') == 'OK' else "⚠️" if result.get('status') == 'WARNING' else "❌"
            report.append(f"- {col}: {status_emoji} {result.get('completeness', 0):.1%} 완성도")
        
        # 일관성 검증
        consistency = self.validate_consistency(df)
        
        report.append("\n## 2. 데이터 일관성\n")
        for check, result in consistency.items():
            status_emoji = "✅" if result['status'] == 'OK' else "⚠️" if result['status'] == 'WARNING' else "❌"
            report.append(f"- {check}: {status_emoji} {result.get('message', '')}")
        
        # 형식 검증
        format_check = self.validate_format(df)
        
        report.append("\n## 3. 데이터 형식\n")
        for check, result in format_check.items():
            status_emoji = "✅" if result['status'] == 'OK' else "❌"
            report.append(f"- {check}: {status_emoji} {result['valid_count']}/{result['valid_count'] + result['invalid_count']} 유효")
        
        # 비즈니스 규칙
        business_rules = self.validate_business_rules(df)
        
        report.append("\n## 4. 비즈니스 규칙\n")
        for rule, result in business_rules.items():
            status_emoji = "✅" if result['status'] == 'OK' else "⚠️"
            report.append(f"- {rule}: {status_emoji} {result['count']}건 감지")
        
        return '\n'.join(report)

# 사용 예시
validator = DataQualityValidator()
quality_report = validator.generate_quality_report(df)
print(quality_report)

# 검증 결과를 JSON으로 저장
validation_results = {
    'completeness': validator.validate_completeness(df, ['date', 'amount', 'balance']),
    'consistency': validator.validate_consistency(df),
    'format': validator.validate_format(df),
    'business_rules': validator.validate_business_rules(df)
}

with open('validation_results.json', 'w', encoding='utf-8') as f:
    json.dump(validation_results, f, ensure_ascii=False, indent=2, default=str)
```

---

## 4. 실습 예제

### 4.1 단계별 데이터 변환 실습

```python
# Step 1: 샘플 데이터 생성
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_sample_transactions(n_days=30):
    """샘플 거래 데이터 생성"""
    
    merchants = {
        '스타벅스': ('카페', 3000, 8000),
        '이마트': ('마트', 20000, 150000),
        'GS25': ('편의점', 1000, 20000),
        '맥도날드': ('패스트푸드', 5000, 15000),
        '서브웨이': ('패스트푸드', 6000, 12000),
        '올리브영': ('화장품', 10000, 50000),
        '교보문고': ('서점', 10000, 80000),
        'CGV': ('영화관', 10000, 30000),
        '쿠팡': ('온라인쇼핑', 10000, 200000),
        '네이버페이': ('온라인결제', 5000, 100000)
    }
    
    transactions = []
    current_balance = 5000000  # 초기 잔액 500만원
    current_date = datetime.now() - timedelta(days=n_days)
    
    # 월급 추가
    transactions.append({
        '거래일자': current_date.strftime('%Y-%m-%d'),
        '거래시간': '09:00:00',
        '적요': '급여',
        '출금액': '',
        '입금액': 3500000,
        '잔액': current_balance + 3500000,
        '거래점': '자동이체'
    })
    current_balance += 3500000
    
    for day in range(n_days):
        current_date += timedelta(days=1)
        n_transactions = random.randint(0, 5)
        
        for _ in range(n_transactions):
            merchant = random.choice(list(merchants.keys()))
            category, min_amount, max_amount = merchants[merchant]
            amount = random.randint(min_amount, max_amount)
            
            # 출금 거래
            current_balance -= amount
            
            transaction = {
                '거래일자': current_date.strftime('%Y-%m-%d'),
                '거래시간': f"{random.randint(8, 22):02d}:{random.randint(0, 59):02d}:{random.randint(0, 59):02d}",
                '적요': merchant,
                '출금액': amount,
                '입금액': '',
                '잔액': current_balance,
                '거래점': random.choice(['온라인', '체크카드', '신용카드'])
            }
            transactions.append(transaction)
    
    return pd.DataFrame(transactions)

# 샘플 데이터 생성 및 저장
sample_df = generate_sample_transactions(30)
sample_df.to_csv('sample_transactions.csv', index=False, encoding='utf-8-sig')
print(f"샘플 데이터 생성 완료: {len(sample_df)}건의 거래")
```

### 4.2 통합 변환 파이프라인

```python
class FinancialDataPipeline:
    """금융 데이터 변환 통합 파이프라인"""
    
    def __init__(self, input_file, output_format='json'):
        self.input_file = input_file
        self.output_format = output_format
        self.df = None
        self.processed_data = None
    
    def load_data(self):
        """데이터 로드"""
        self.df = pd.read_csv(self.input_file, encoding='utf-8-sig')
        print(f"✅ 데이터 로드 완료: {len(self.df)}건")
        return self
    
    def clean_data(self):
        """데이터 정제"""
        # 빈 값 처리
        self.df['출금액'] = pd.to_numeric(self.df['출금액'], errors='coerce').fillna(0)
        self.df['입금액'] = pd.to_numeric(self.df['입금액'], errors='coerce').fillna(0)
        
        # 날짜 형식 변환
        self.df['거래일자'] = pd.to_datetime(self.df['거래일자'])
        
        print("✅ 데이터 정제 완료")
        return self
    
    def enrich_data(self):
        """데이터 보강"""
        # 거래 유형 추가
        self.df['거래유형'] = self.df.apply(
            lambda x: '입금' if x['입금액'] > 0 else '출금', axis=1
        )
        
        # 거래 금액 통합
        self.df['금액'] = self.df.apply(
            lambda x: x['입금액'] if x['입금액'] > 0 else x['출금액'], axis=1
        )
        
        # 카테고리 분류
        def categorize(description):
            categories = {
                '카페': ['스타벅스', '커피', '카페'],
                '마트': ['이마트', '홈플러스', '롯데마트'],
                '편의점': ['GS25', 'CU', '세븐일레븐'],
                '식사': ['맥도날드', '서브웨이', '버거킹'],
                '쇼핑': ['쿠팡', '네이버', '올리브영'],
                '급여': ['급여', '월급', '상여'],
                '기타': []
            }
            
            for category, keywords in categories.items():
                if any(keyword in description for keyword in keywords):
                    return category
            return '기타'
        
        self.df['카테고리'] = self.df['적요'].apply(categorize)
        
        print("✅ 데이터 보강 완료")
        return self
    
    def validate_data(self):
        """데이터 검증"""
        validator = DataQualityValidator()
        report = validator.generate_quality_report(self.df)
        
        print("✅ 데이터 검증 완료")
        print(report)
        return self
    
    def convert_to_json(self):
        """JSON 변환"""
        result = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'total_records': len(self.df),
                'period': {
                    'start': self.df['거래일자'].min().isoformat(),
                    'end': self.df['거래일자'].max().isoformat()
                }
            },
            'summary': {
                'total_deposits': float(self.df[self.df['거래유형'] == '입금']['금액'].sum()),
                'total_withdrawals': float(self.df[self.df['거래유형'] == '출금']['금액'].sum()),
                'category_breakdown': self.df[self.df['거래유형'] == '출금'].groupby('카테고리')['금액'].sum().to_dict()
            },
            'transactions': []
        }
        
        for _, row in self.df.iterrows():
            transaction = {
                'date': row['거래일자'].isoformat(),
                'time': row['거래시간'],
                'description': row['적요'],
                'type': row['거래유형'],
                'amount': float(row['금액']),
                'balance': float(row['잔액']),
                'category': row['카테고리'],
                'channel': row['거래점']
            }
            result['transactions'].append(transaction)
        
        self.processed_data = result
        print("✅ JSON 변환 완료")
        return self
    
    def convert_to_markdown(self):
        """Markdown 변환"""
        generator = MarkdownReportGenerator(self.df)
        self.processed_data = generator.generate_financial_report()
        
        print("✅ Markdown 변환 완료")
        return self
    
    def save_output(self, output_file=None):
        """결과 저장"""
        if output_file is None:
            extension = 'json' if self.output_format == 'json' else 'md'
            output_file = f"processed_data.{extension}"
        
        if self.output_format == 'json':
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.processed_data, f, ensure_ascii=False, indent=2, default=str)
        else:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(self.processed_data)
        
        print(f"✅ 결과 저장 완료: {output_file}")
        return self
    
    def run(self):
        """전체 파이프라인 실행"""
        self.load_data()
        self.clean_data()
        self.enrich_data()
        self.validate_data()
        
        if self.output_format == 'json':
            self.convert_to_json()
        else:
            self.convert_to_markdown()
        
        self.save_output()
        
        print("\n🎉 파이프라인 실행 완료!")
        return self

# 파이프라인 실행
pipeline = FinancialDataPipeline('sample_transactions.csv', output_format='json')
pipeline.run()

# Markdown 버전도 생성
pipeline_md = FinancialDataPipeline('sample_transactions.csv', output_format='markdown')
pipeline_md.run()
```

---

## 핵심 요약

1. **데이터 변환의 목적**: AI 학습 효율성 향상 및 맥락 정보 보존
2. **주요 변환 도구**: pandas, json, markdown 라이브러리 활용
3. **품질 관리**: 완전성, 일관성, 형식, 비즈니스 규칙 검증
4. **실무 적용**: 파이프라인 구축을 통한 자동화

---

## 다음 차시 예고

**2-3. .md, .json 형태 변환 실습**
- RAG 시스템과의 연계
- 벡터 DB 저장 및 검색
- 실제 금융 챗봇 구현