// Transition Manager - 處理頁面間的平滑轉場
console.log("Transition Manager loaded");

class TransitionManager {
    constructor() {
        this.isFromHomepage = false;
        this.isTransitioning = false;
        this.fadeOutDuration = 800;
        this.fadeInDuration = 600;

        this.init();
    }

    init() {
        this.checkNavigationSource();
        this.setupPageTransitions();
        this.setupLoadingBehavior();

        // 設置頁面可見性變化監聽
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 頁面隱藏時清除來源標記
                this.clearNavigationSource();
            }
        });
    }

    // 檢查導航來源
    checkNavigationSource() {
        // 檢查 sessionStorage 中是否有內部導航標記
        this.isFromHomepage = sessionStorage.getItem('fromHomepage') === 'true' ||
                             sessionStorage.getItem('internalNavigation') === 'true';

        // 檢查 referrer 是否為內部頁面
        const referrer = document.referrer;
        const currentOrigin = window.location.origin;

        // 如果來自同一個網站的任何頁面，都視為內部導航
        if (referrer && referrer.startsWith(currentOrigin)) {
            this.isFromHomepage = true;
            sessionStorage.setItem('internalNavigation', 'true');
        }

        // 特別檢查是否當前頁面是首頁且來自內部導航
        if (this.isHomepage() && sessionStorage.getItem('internalNavigation') === 'true') {
            this.isFromHomepage = true;
        }

        console.log('Navigation source - Internal Navigation:', this.isFromHomepage);
        console.log('Current page is homepage:', this.isHomepage());
        console.log('Referrer:', referrer);
    }

    // 設置載入行為
    setupLoadingBehavior() {
        const loadingScreen = document.getElementById('loading-screen');

        if (!loadingScreen) return;

        if (this.isFromHomepage) {
            // 如果來自首頁，跳過載入動畫
            console.log('Skipping loading animation - from homepage');
            this.skipLoadingAnimation();
        } else {
            // 如果直接進入頁面，顯示完整載入動畫
            console.log('Showing full loading animation - direct access');
            this.showFullLoadingAnimation();
        }
    }

    // 跳過載入動畫
    skipLoadingAnimation() {
        const loadingScreen = document.getElementById('loading-screen');

        if (loadingScreen) {
            // 立即隱藏載入畫面
            loadingScreen.style.display = 'none';

            // 直接開始進場動畫
            this.startQuickEntranceAnimation();
        }
    }

    // 顯示完整載入動畫
    showFullLoadingAnimation() {
        // 讓原有的載入動畫正常執行
        // animations.js 會處理完整的載入序列
    }

    // 快速進場動畫（來自首頁時使用）
    startQuickEntranceAnimation() {
        // 設置初始狀態 - 頁面從透明開始
        gsap.set('body', { opacity: 0 });

        // 創建快速進場時間軸
        const quickTl = gsap.timeline({
            onComplete: () => {
                // 啟動正常的滾動動畫
                this.setupScrollAnimations();
            }
        });

        // 頁面淡入
        quickTl.to('body', {
            opacity: 1,
            duration: this.fadeInDuration / 1000,
            ease: "power2.out"
        });

        // 導航欄動畫
        quickTl.to('.nav', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 0.2);

        // 檢查是否為作品頁面
        const isWorkPage = document.querySelector('.work-detail-page');

        if (isWorkPage) {
            this.animateWorkPageElements(quickTl);
        } else {
            this.animateRegularPageElements(quickTl);
        }
    }

    // 動畫作品頁面元素
    animateWorkPageElements(timeline) {
        const heroCover = document.querySelector('.work-hero-cover');
        const heroOverlay = document.querySelector('.work-hero-overlay');

        // 作品頁面的色彩遮罩動畫
        if (heroCover) {
            timeline.to(heroCover, {
                y: "-100%",
                duration: 1.0,
                ease: "power2.inOut"
            }, 0.3);
        }

        // 英雄區覆層動畫
        if (heroOverlay) {
            timeline.to(heroOverlay, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, 0.8);
        }

        // 其他內容區域
        timeline.to('.work-info-section', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 1.0);

        timeline.to('.work-content-section', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 1.2);
    }

    // 動畫一般頁面元素
    animateRegularPageElements(timeline) {
        // 基本頁面元素動畫
        timeline.to('.animate-element', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1
        }, 0.4);
    }

    // 設置頁面轉場
    setupPageTransitions() {
        // 為所有內部連結添加轉場效果
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');

            if (!link) return;

            const href = link.getAttribute('href');

            // 檢查是否為內部連結
            if (this.isInternalLink(href)) {
                e.preventDefault();
                this.performTransition(href, link);
            }
        });

        // 設置 popstate 事件處理（瀏覽器前進/後退）
        window.addEventListener('popstate', (e) => {
            if (!this.isTransitioning) {
                this.performInstantTransition(window.location.href);
            }
        });
    }

    // 檢查是否為內部連結
    isInternalLink(href) {
        if (!href) return false;

        // 排除外部連結、錨點、特殊協議
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) {
            return false;
        }
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }
        if (href.startsWith('#')) {
            return false;
        }

        return true;
    }

    // 執行轉場
    async performTransition(url, linkElement) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        try {
            // 添加轉場樣式
            document.body.classList.add('page-transitioning');

            // 設置內部導航標記（從任何頁面導航都算內部導航）
            sessionStorage.setItem('internalNavigation', 'true');

            // 如果從首頁導航，也保持首頁標記
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                sessionStorage.setItem('fromHomepage', 'true');
            }

            // 為點擊的連結添加視覺回饋
            if (linkElement) {
                linkElement.style.transform = 'scale(0.95)';
                linkElement.style.opacity = '0.7';
            }

            // 頁面淡出動畫
            await this.fadeOutPage();

            // 導航到新頁面
            window.location.href = url;

        } catch (error) {
            console.error('Transition error:', error);
            this.isTransitioning = false;
            document.body.classList.remove('page-transitioning');

            // 恢復連結狀態
            if (linkElement) {
                linkElement.style.transform = '';
                linkElement.style.opacity = '';
            }

            // 如果轉場失敗，直接導航
            window.location.href = url;
        }
    }

    // 頁面淡出動畫
    fadeOutPage() {
        return new Promise((resolve) => {
            const tl = gsap.timeline({
                onComplete: resolve
            });

            // 添加轉場樣式類
            document.body.classList.add('transitioning-out');

            // 淡出主要內容
            tl.to('main, .hero, .portfolio-section, .work-detail-page', {
                opacity: 0,
                y: -30,
                duration: this.fadeOutDuration / 1000,
                ease: "power2.inOut",
                stagger: 0.1
            });

            // 導航欄稍後淡出
            tl.to('.nav', {
                opacity: 0.3,
                duration: this.fadeOutDuration / 1000 * 0.5,
                ease: "power2.inOut"
            }, `-=${this.fadeOutDuration / 1000 * 0.3}`);

            // 背景粒子效果淡出
            tl.to('#canvas-container', {
                opacity: 0.3,
                duration: this.fadeOutDuration / 1000,
                ease: "power2.inOut"
            }, 0);
        });
    }

    // 立即轉場（用於瀏覽器導航）
    performInstantTransition(url) {
        // 對於瀏覽器前進/後退，我們不執行淡出動畫
        // 但仍設置適當的內部導航標記
        if (document.referrer && document.referrer.includes(window.location.origin)) {
            sessionStorage.setItem('internalNavigation', 'true');
        }
    }

    // 設置滾動動畫
    setupScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // 為新載入的元素設置滾動觸發動畫
        gsap.utils.toArray('.animate-element').forEach((element) => {
            if (!element.hasAttribute('data-scroll-animated')) {
                gsap.fromTo(element, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    }
                });

                element.setAttribute('data-scroll-animated', 'true');
            }
        });
    }

    // 清除導航來源標記
    clearNavigationSource() {
        sessionStorage.removeItem('fromHomepage');
        sessionStorage.removeItem('internalNavigation');
    }

    // 重置轉場狀態
    resetTransitionState() {
        this.isTransitioning = false;
    }

    // 設置首頁標記（在首頁調用）
    markAsHomepage() {
        sessionStorage.setItem('isHomepage', 'true');

        // 為首頁的所有內部連結添加特殊處理
        document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], .portfolio-item').forEach(link => {
            link.addEventListener('click', (e) => {
                // 檢查是否為作品項目的點擊
                const portfolioItem = e.target.closest('.portfolio-item');
                if (portfolioItem) {
                    const workLink = portfolioItem.querySelector('a');
                    if (workLink && this.isInternalLink(workLink.href)) {
                        sessionStorage.setItem('fromHomepage', 'true');
                        sessionStorage.setItem('internalNavigation', 'true');
                    }
                } else {
                    sessionStorage.setItem('fromHomepage', 'true');
                    sessionStorage.setItem('internalNavigation', 'true');
                }
            });
        });
    }

    // 檢查是否在首頁
    isHomepage() {
        const path = window.location.pathname;
        return path === '/' || path === '/index.html' || path.endsWith('index.html');
    }
}

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    window.transitionManager = new TransitionManager();

    // 如果在首頁，設置首頁標記
    if (window.transitionManager.isHomepage()) {
        window.transitionManager.markAsHomepage();
    }

    // 添加頁面卸載前的清理
    window.addEventListener('beforeunload', () => {
        if (window.transitionManager) {
            window.transitionManager.resetTransitionState();
        }
    });

    // 添加頁面顯示事件處理（用於瀏覽器前進/後退）
    window.addEventListener('pageshow', (e) => {
        if (e.persisted && window.transitionManager) {
            // 頁面從快取中恢復，重置狀態
            document.body.classList.remove('page-transitioning', 'transitioning-out');
            window.transitionManager.resetTransitionState();
        }
    });
});

// 導出給其他腳本使用
window.TransitionManager = TransitionManager;

console.log("Transition Manager setup complete");
