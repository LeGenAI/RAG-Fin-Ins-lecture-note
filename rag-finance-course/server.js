const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname)));

// 기본 라우트 - index.html로 리다이렉트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 모든 HTML 파일에 대한 라우팅
app.get('*.html', (req, res) => {
    const fileName = req.params[0] + '.html';
    res.sendFile(path.join(__dirname, fileName));
});

// 404 에러 처리
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 RAG Finance Course server is running on port ${PORT}`);
    console.log(`📚 Access the course at: http://localhost:${PORT}`);
});
