/* K-MOOC 강의 슬라이드 네비게이션 JavaScript */
/* 작성자: 김종락 교수 (서강대학교 수학과) */
/* 프로젝트: RAG를 이용한 나만의 AI 금융 비서, 보험 설계사 만들기 */

// 전역 변수
let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let scrollTimeout;
let touchStartX = 0;
let touchEndX = 0;

// 상단 진행바 너비 설정
function updateTopProgress() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    const progressBar = document.getElementById('topProgress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// 페이지 번호 업데이트
function updatePageNumbers() {
    document.querySelectorAll('.page-number').forEach((pageNum, idx) => {
        pageNum.textContent = `${idx + 1} / ${totalSlides}`;
    });
}

// 현재 슬라이드 감지 (스크롤 기반)
function updateCurrentSlide() {
    const slideHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const newSlide = Math.round(scrollTop / slideHeight);
    
    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < totalSlides) {
        currentSlide = newSlide;
        highlightCurrentSlide();
        manageFocus();
        updateTopProgress();
        
        // 현재 슬라이드 정보 업데이트 (접근성)
        document.title = `RAG 강의 (${currentSlide + 1}/${totalSlides}) - 서강대학교 K-MOOC`;
    }
}

// 현재 슬라이드 하이라이트 효과
function highlightCurrentSlide() {
    slides.forEach((slide, idx) => {
        const pageNum = slide.querySelector('.page-number');
        if (pageNum) {
            if (idx === currentSlide) {
                pageNum.style.background = 'rgba(217, 4, 41, 0.1)';
                pageNum.style.borderColor = '#d90429';
                pageNum.style.color = '#d90429';
                pageNum.style.fontWeight = '600';
            } else {
                pageNum.style.background = 'rgba(255, 255, 255, 0.8)';
                pageNum.style.borderColor = '#e5e7eb';
                pageNum.style.color = '#6b7280';
                pageNum.style.fontWeight = '500';
            }
        }
    });
}

// 부드러운 슬라이드 전환
function scrollToSlide(index) {
    if (slides[index]) {
        slides[index].scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // 애니메이션 효과
        slides[index].style.transform = 'scale(1.01)';
        setTimeout(() => {
            slides[index].style.transform = 'scale(1)';
        }, 300);
    }
}

// 키보드 네비게이션 설정
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // 입력 필드에서는 키보드 네비게이션 비활성화
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
            e.preventDefault();
            currentSlide++;
            scrollToSlide(currentSlide);
            manageFocus();
            updateTopProgress();
        } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
            e.preventDefault();
            currentSlide--;
            scrollToSlide(currentSlide);
            manageFocus();
            updateTopProgress();
        } else if (e.key === 'Home') {
            e.preventDefault();
            currentSlide = 0;
            scrollToSlide(currentSlide);
            manageFocus();
            updateTopProgress();
        } else if (e.key === 'End') {
            e.preventDefault();
            currentSlide = totalSlides - 1;
            scrollToSlide(currentSlide);
            manageFocus();
            updateTopProgress();
        } else if (e.key === ' ') {
            // 스페이스바로 다음 슬라이드
            e.preventDefault();
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                scrollToSlide(currentSlide);
                manageFocus();
                updateTopProgress();
            }
        }
    });
}

// 스크롤 이벤트 설정 (디바운싱 적용)
function setupScrollEvents() {
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateCurrentSlide, 100);
    });
}

// 페이지 번호 클릭 네비게이션 설정
function addPageNumberClickEvents() {
    document.querySelectorAll('.page-number').forEach((pageNum, idx) => {
        pageNum.style.cursor = 'pointer';
        pageNum.title = `슬라이드 ${idx + 1}로 이동`;
        
        pageNum.addEventListener('click', function() {
            currentSlide = idx;
            scrollToSlide(currentSlide);
            updateTopProgress();
        });
        
        // 호버 효과
        pageNum.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(217, 4, 41, 0.05)';
            this.style.borderColor = '#d90429';
        });
        
        pageNum.addEventListener('mouseleave', function() {
            if (idx !== currentSlide) {
                this.style.background = 'rgba(255, 255, 255, 0.8)';
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
}

// 터치 스와이프 지원 (모바일) 설정
function setupTouchEvents() {
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

// 스와이프 처리
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSlide < totalSlides - 1) {
            // 왼쪽으로 스와이프 (다음 슬라이드)
            currentSlide++;
            scrollToSlide(currentSlide);
            updateTopProgress();
        } else if (diff < 0 && currentSlide > 0) {
            // 오른쪽으로 스와이프 (이전 슬라이드)
            currentSlide--;
            scrollToSlide(currentSlide);
            updateTopProgress();
        }
    }
}

// 접근성 개선: 포커스 관리
function manageFocus() {
    slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
            slide.setAttribute('tabindex', '0');
            slide.setAttribute('aria-current', 'page');
        } else {
            slide.setAttribute('tabindex', '-1');
            slide.removeAttribute('aria-current');
        }
    });
}

// 네비게이션 힌트 표시/숨김
function showNavHint() {
    const hint = document.getElementById('navHint');
    if (hint) {
        hint.classList.add('show');
        setTimeout(() => {
            hint.classList.remove('show');
        }, 3000);
    }
}

// 슬라이드 전환 애니메이션 CSS 추가
function addSlideAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .slide {
            transition: transform 0.3s ease;
        }
        .page-number {
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
}

// 이미지 지연 로딩 최적화
function optimizeImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // 이미지 로딩 시작 시 표시
    images.forEach(img => {
        img.addEventListener('loadstart', function() {
            this.style.opacity = '0.5';
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.3';
            this.alt = this.alt + ' (로딩 실패)';
        });
    });
}

// 접근성 개선
function enhanceAccessibility() {
    // 키보드 포커스 표시 개선
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // 스크린 리더 지원
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `슬라이드 ${index + 1} / ${totalSlides}`);
    });
}

// 성능 모니터링
function monitorPerformance() {
    // 페이지 로딩 시간 측정
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log(`⚡ 페이지 로딩 시간: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
    
    // 이미지 로딩 시간 측정
    const imageEntries = performance.getEntriesByType('resource').filter(entry => 
        entry.initiatorType === 'img'
    );
    console.log(`🖼️ 이미지 ${imageEntries.length}개 로딩 완료`);
}

// 퀴즈 채점 함수 (선택사항 - 퀴즈가 있는 슬라이드에서 사용)
function gradeQuiz() {
    const answers = { q1: 'b', q2: 'b', q3: 'a' };
    let score = 0, total = Object.keys(answers).length;
    for (const k in answers) {
        const picked = document.querySelector(`input[name="${k}"]:checked`);
        if (picked && picked.value === answers[k]) score++;
    }
    const result = document.getElementById('quizResult');
    if (result) {
        const ratio = Math.round((score/total)*100);
        result.textContent = `점수: ${score}/${total} (${ratio}%)`;
        if (ratio === 100) {
            result.innerHTML += ' · 배지 획득 ✅';
        }
    }
}

// 메인 초기화 함수
function initializeSlidePresentation() {
    // DOM 요소 선택
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    if (totalSlides === 0) {
        console.warn('슬라이드를 찾을 수 없습니다. .slide 클래스를 확인해주세요.');
        return;
    }
    
    // 로딩 인디케이터 표시
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.classList.add('show');
    }
    
    // 기본 초기화
    updateTopProgress();
    updatePageNumbers();
    addPageNumberClickEvents();
    addSlideAnimations();
    updateCurrentSlide();
    highlightCurrentSlide();
    manageFocus();
    
    // 이벤트 리스너 설정
    setupKeyboardNavigation();
    setupScrollEvents();
    setupTouchEvents();
    
    // 향상된 기능들
    optimizeImageLoading();
    enhanceAccessibility();
    
    // 로딩 완료 후 인디케이터 숨김
    setTimeout(() => {
        if (loading) {
            loading.classList.remove('show');
        }
        // 네비게이션 힌트 표시
        setTimeout(showNavHint, 500);
    }, 800);
    
    // 성능 모니터링
    setTimeout(monitorPerformance, 1000);
    
    // 환영 메시지 (콘솔)
    console.log(`🎓 서강대학교 K-MOOC RAG 강의자료 로드 완료! (총 ${totalSlides}개 슬라이드)`);
    console.log('📚 강의: 김종락 교수 | 서강대학교 수학과');
    console.log('⌨️ 키보드 조작: ← → 방향키, Home, End, 스페이스바');
    console.log('🖱️ 페이지 번호 클릭으로도 이동 가능합니다.');
    console.log('📱 모바일: 좌우 스와이프로 이동 가능합니다.');
    console.log('⚡ 15분 마이크로러닝으로 RAG 기술 마스터하기!');
    console.log('🔥 고급 디자인 v2.0 - 더욱 세련된 강의 경험!');
}

// DOM이 로드되면 초기화 실행
window.addEventListener('load', initializeSlidePresentation);