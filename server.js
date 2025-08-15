const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙 설정 - rag-finance-course 디렉토리를 루트로 설정
app.use(express.static(path.join(__dirname, 'rag-finance-course')));

// 기본 라우트 - index.html로 리다이렉트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'rag-finance-course', 'index.html'));
});

// 모든 HTML 파일에 대한 라우팅
app.get('*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'rag-finance-course', req.path));
});

// 404 에러 처리
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'rag-finance-course', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 RAG Finance Course server is running on port ${PORT}`);
    console.log(`📚 Access the course at: http://localhost:${PORT}`);
});