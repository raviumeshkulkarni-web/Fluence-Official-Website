// Fluence - Landing Page Interactions

document.addEventListener('DOMContentLoaded', () => {
    initScrollWaveform();
    initHeroProductMotion();
    initDemoWaveform();
    initAndroidDemoWaveform();
    initScrollReveal();
    initFeatureCardGlow();
    initComparisonBars();
    initMarqueeInteraction();
    initNavbarScroll();
    initPlatformSwitcher();
    initSimulator();
    initSetupWizard();
    initWindowsWizard();
    initDocsScrollSpy();
    initMobileMenu();
    initScrollProgress();
    initMagneticEffect();
    initActiveNavHighlight();
    initBackToTop();
    initSaveStatusReveal();
});

/* =========================================================
   1. Subtle Full-Page Background Waveform
   Scroll-driven, gentle always-on canvas in the background.
   Scroll velocity raises amplitude like voice audio in app.
   ========================================================= */
function initScrollWaveform() {
    var canvas = document.getElementById('scroll-waveform-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.style.display='none'; return; }

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0;
    var lastTime = null;
    var phase = 0;
    var scrollY = window.scrollY, lastScrollY = scrollY;
    var smoothedAmplitude = 0;

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();
    window.addEventListener('scroll', function() { scrollY = window.scrollY; }, { passive: true });

    function hexAlpha(hex, alpha) {
        var r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
        return 'rgba('+r+','+g+','+b+','+alpha+')';
    }
    var env = function(x) { return Math.sin((x / W) * Math.PI); };

    function loop(ts) {
        requestAnimationFrame(loop);
        if (lastTime === null) lastTime = ts;
        var dt = Math.min((ts - lastTime) / 1000, 0.1);
        lastTime = ts;

        var rawV = Math.abs(scrollY - lastScrollY);
        lastScrollY = scrollY;
        smoothedAmplitude = smoothedAmplitude * 0.6 + Math.min(rawV / 30, 1.0) * 0.4;

        var speed = 1.0 + smoothedAmplitude * 4.0;
        phase = (phase + speed * dt * 2 * Math.PI) % (1000 * Math.PI);
        var p1 = phase, p2 = -phase * 0.7;
        var activeAmp = (smoothedAmplitude * 0.9 + 0.08) * H * 0.18;
        ctx.clearRect(0, 0, W, H);

        var x, e, a, v, g;
        // Wave 1: violet bg, freq 1.5, amp 0.5
        ctx.beginPath(); ctx.moveTo(0, H*0.5);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.5+p1; v=Math.sin(x*0.1+p1*3)*smoothedAmplitude*4; ctx.lineTo(x, H*0.5+(Math.sin(a)*activeAmp*0.5+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.38)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();

        // Wave 2: violet mid, freq 2.5, amp 0.7
        ctx.beginPath(); ctx.moveTo(0, H*0.5);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*2.5+p2; v=Math.sin(x*0.15-p2*4)*smoothedAmplitude*3; ctx.lineTo(x, H*0.5+(Math.sin(a)*activeAmp*0.7+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.38)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.8; ctx.stroke();

        // Wave 3: forefront F3E8FF, freq 1.2, amp 0.9
        ctx.beginPath(); ctx.moveTo(0, H*0.5);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.2+(p1-p2)*0.5; v=Math.sin(x*0.08+p1*5)*smoothedAmplitude*5; ctx.lineTo(x, H*0.5+(Math.sin(a)*activeAmp*0.9+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#C4B5FD',0.55)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=2.0; ctx.stroke();

        // Ghost echo upper
        ctx.beginPath(); ctx.moveTo(0, H*0.25);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*2.0+p2*0.8; v=Math.sin(x*0.1+p2*2)*smoothedAmplitude*2; ctx.lineTo(x, H*0.25+(Math.sin(a)*activeAmp*0.4+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.18)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.0; ctx.stroke();

        // Ghost echo lower
        ctx.beginPath(); ctx.moveTo(0, H*0.75);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.6+p1*0.9; v=Math.sin(x*0.1+p1*2)*smoothedAmplitude*2; ctx.lineTo(x, H*0.75+(Math.sin(a)*activeAmp*0.4+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.18)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.0; ctx.stroke();
    }
    requestAnimationFrame(loop);
}

/* =========================================================
   1a. Product hero motion
   Pointer movement adds a small amount of depth to the
   screenshot collage without taking over the page.
   ========================================================= */
function initHeroProductMotion() {
    const stage = document.querySelector('.hero-product-stage');
    if (!stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const desktop = stage.querySelector('.hero-desktop-shot');
    const phone = stage.querySelector('.hero-phone-shot');
    const cursor = stage.querySelector('.hero-cursor-card');
    if (!desktop || !phone || !cursor) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isVisible = true;
    let rafId = null;

    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !rafId) {
                rafId = requestAnimationFrame(loop);
            }
        });
    }, { rootMargin: '100px' });
    visibilityObserver.observe(stage);

    stage.addEventListener('mousemove', e => {
        const rect = stage.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    stage.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    function loop() {
        rafId = null;
        if (!isVisible) return;
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        desktop.style.setProperty('--hero-x', `${currentX * 10}px`);
        desktop.style.setProperty('--hero-y', `${currentY * 8}px`);
        phone.style.setProperty('--hero-x', `${currentX * -12}px`);
        phone.style.setProperty('--hero-y', `${currentY * -10}px`);
        cursor.style.setProperty('--hero-x', `${currentX * 7}px`);
        cursor.style.setProperty('--hero-y', `${currentY * 5}px`);
        rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
}

/* =========================================================
   1b. Desktop Demo Pill: exact 1:1 AuraVisualizer inside
   the Windows Settings demo mockup on windows.html.
   Always animated at idle; demo trigger boosts amplitude.
   ========================================================= */
function initDemoWaveform() {
    var canvas = document.getElementById('desktop-waveform-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var smoothedAmplitude = 0;
    var phase = 0;
    var lastTime = null;
    var demoActive = false;  // boosted when demo is running

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        if (w === 0 || h === 0) return;
        canvas.width  = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize, { passive: true });
    setTimeout(resize, 100);

    // Expose a method so the Windows demo JS can boost amplitude during dictation
    window._demoWaveformActivate = function() { demoActive = true; };
    window._demoWaveformDeactivate = function() { demoActive = false; };

    function hexAlpha(hex, alpha) {
        var r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
        return 'rgba('+r+','+g+','+b+','+alpha+')';
    }

    function loop(ts) {
        requestAnimationFrame(loop);
        if (lastTime === null) lastTime = ts;
        var dt = Math.min((ts - lastTime) / 1000, 0.1);
        lastTime = ts;

        // Amplitude: idle = gentle 0.08 floor, demo active = fluctuates 0.3-0.9
        var target = demoActive ? (0.4 + Math.sin(ts * 0.003) * 0.4) : 0;
        smoothedAmplitude = smoothedAmplitude * 0.85 + target * 0.15;

        // Phase integration: exact AuraVisualizer._loop
        var speed = 1.0 + smoothedAmplitude * 4.0;
        phase = (phase + speed * dt * 2 * Math.PI) % (1000 * Math.PI);

        // Dynamic Backing Store check (using scale-invariant clientWidth/clientHeight)
        var w = canvas.clientWidth  || 160;
        var h = canvas.clientHeight || 32;
        var dpr = window.devicePixelRatio || 1;
        var expectedW = Math.round(w * dpr);
        var expectedH = Math.round(h * dpr);
        
        if (canvas.width !== expectedW || canvas.height !== expectedH) {
            canvas.width  = expectedW;
            canvas.height = expectedH;
            ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
        }
        
        var W = w;
        var H = h;
        ctx.clearRect(0, 0, W, H);

        var env = function(x) { return Math.sin((x / W) * Math.PI); };
        var p1 = phase, p2 = -phase * 0.7;
        // activeAmplitude formula: exact from AuraVisualizer._draw()
        var activeAmplitude = (smoothedAmplitude * 0.9 + 0.08) * (H * 0.48);
        var x, e, a, v, g;

        // Wave 1: violet #A855F7, alpha 0.4, freq 1.5, amp 0.5
        ctx.beginPath(); ctx.moveTo(0, H/2);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.5+p1; v=Math.sin(x*0.1+p1*3)*smoothedAmplitude*4; ctx.lineTo(x, H/2+(Math.sin(a)*activeAmplitude*0.5+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.4)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();

        // Wave 2: violet #A855F7, alpha 0.4, freq 2.5, amp 0.7
        ctx.beginPath(); ctx.moveTo(0, H/2);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*2.5+p2; v=Math.sin(x*0.15-p2*4)*smoothedAmplitude*3; ctx.lineTo(x, H/2+(Math.sin(a)*activeAmplitude*0.7+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.4)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.8; ctx.stroke();

        // Wave 3: #F3E8FF forefront, alpha 0.9, freq 1.2, amp 0.9
        ctx.beginPath(); ctx.moveTo(0, H/2);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.2+(p1-p2)*0.5; v=Math.sin(x*0.08+p1*5)*smoothedAmplitude*5; ctx.lineTo(x, H/2+(Math.sin(a)*activeAmplitude*0.9+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#F3E8FF',0.9)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=2.0; ctx.stroke();
    }
    requestAnimationFrame(loop);
}



/* =========================================================
   1c. Android Demo Pill: exact 1:1 AuraVisualizer inside
   the Android simulator overlay pill on android.html.
   Always animated at idle; demo trigger boosts amplitude.
   ========================================================= */
function initAndroidDemoWaveform() {
    var canvas = document.getElementById('android-waveform-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var smoothedAmplitude = 0;
    var phase = 0;
    var lastTime = null;
    var demoActive = false;

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        if (w === 0 || h === 0) return;
        canvas.width  = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize, { passive: true });
    setTimeout(resize, 100);

    window._androidWaveformActivate   = function() { demoActive = true; };
    window._androidWaveformDeactivate = function() { demoActive = false; };

    function hexAlpha(hex, alpha) {
        var r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
        return 'rgba('+r+','+g+','+b+','+alpha+')';
    }

    function loop(ts) {
        requestAnimationFrame(loop);
        if (lastTime === null) lastTime = ts;
        var dt = Math.min((ts - lastTime) / 1000, 0.1);
        lastTime = ts;

        // Amplitude: idle gentle floor; demo active = voice-like fluctuation
        var target = demoActive ? (0.4 + Math.sin(ts * 0.003) * 0.4) : 0;
        smoothedAmplitude = smoothedAmplitude * 0.85 + target * 0.15;

        // Phase integration: exact AuraVisualizer._loop
        var speed = 1.0 + smoothedAmplitude * 4.0;
        phase = (phase + speed * dt * 2 * Math.PI) % (1000 * Math.PI);

        // Dynamic Backing Store check (using scale-invariant clientWidth/clientHeight)
        var w = canvas.clientWidth  || 160;
        var h = canvas.clientHeight || 32;
        var dpr = window.devicePixelRatio || 1;
        var expectedW = Math.round(w * dpr);
        var expectedH = Math.round(h * dpr);
        
        if (canvas.width !== expectedW || canvas.height !== expectedH) {
            canvas.width  = expectedW;
            canvas.height = expectedH;
            ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
        }
        
        var W = w;
        var H = h;
        ctx.clearRect(0, 0, W, H);

        var env = function(x) { return Math.sin((x / W) * Math.PI); };
        var p1 = phase, p2 = -phase * 0.7;
        // activeAmplitude: exact AuraVisualizer formula
        var activeAmplitude = (smoothedAmplitude * 0.9 + 0.08) * (H * 0.48);
        var x, e, a, v, g;

        // Wave 1: violet #A855F7, alpha 0.4, freq 1.5x, amp 0.5
        ctx.beginPath(); ctx.moveTo(0, H/2);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.5+p1; v=Math.sin(x*0.1+p1*3)*smoothedAmplitude*4; ctx.lineTo(x, H/2+(Math.sin(a)*activeAmplitude*0.5+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.4)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();

        // Wave 2: violet #A855F7, alpha 0.4, freq 2.5x, amp 0.7
        ctx.beginPath(); ctx.moveTo(0, H/2);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*2.5+p2; v=Math.sin(x*0.15-p2*4)*smoothedAmplitude*3; ctx.lineTo(x, H/2+(Math.sin(a)*activeAmplitude*0.7+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#A855F7',0.4)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=1.8; ctx.stroke();

        // Wave 3: #F3E8FF forefront, alpha 0.9, freq 1.2x, amp 0.9
        ctx.beginPath(); ctx.moveTo(0, H/2);
        for (x=0; x<=W; x+=3) { e=env(x); a=(x/W)*2*Math.PI*1.2+(p1-p2)*0.5; v=Math.sin(x*0.08+p1*5)*smoothedAmplitude*5; ctx.lineTo(x, H/2+(Math.sin(a)*activeAmplitude*0.9+v)*e); }
        g=ctx.createLinearGradient(0,0,W,0); g.addColorStop(0,'transparent'); g.addColorStop(0.5,hexAlpha('#F3E8FF',0.9)); g.addColorStop(1,'transparent');
        ctx.strokeStyle=g; ctx.lineWidth=2.0; ctx.stroke();
    }
    requestAnimationFrame(loop);
}/* =========================================================
   NEW 2. Scroll-Reveal IntersectionObserver
   ========================================================= */
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || '0', 10);
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
}

/* =========================================================
   3. Interactive mouse spotlight glows on feature & download cards
   ========================================================= */
function initFeatureCardGlow() {
    const cards = document.querySelectorAll('.feature-card-vertical, .download-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* =========================================================
   3b. Features Marquee — pause CSS animation when off-screen
   ========================================================= */function initMarqueeInteraction() {
    const wrapper = document.getElementById('features-marquee-wrapper');
    const marquee = document.getElementById('features-marquee');
    if (!wrapper || !marquee) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    // Override the CSS animation
    marquee.style.animation = 'none';

    let x = 0;
    let isDragging = false;
    let startX = 0;
    let startScrollX = 0;
    const speed = 0.5; // scrolling speed in pixels per frame
    let isIntersecting = true;

    // IntersectionObserver to pause requestAnimationFrame when off-screen for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isIntersecting = entry.isIntersecting;
        });
    }, { rootMargin: '50px' });
    observer.observe(wrapper);

    // Helper to extract clientX from mouse or touch event
    function getClientX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }

    function startDrag(e) {
        // Only allow primary mouse button drag
        if (e.type === 'mousedown' && e.button !== 0) return;
        isDragging = true;
        startX = getClientX(e);
        startScrollX = x;
        marquee.classList.add('grabbing');
    }

    function drag(e) {
        if (!isDragging) return;
        const currentX = getClientX(e);
        const dx = currentX - startX;
        x = startScrollX + dx;
        
        // Wrap x immediately during dragging so wrapping is seamless
        const halfWidth = marquee.scrollWidth / 2;
        if (halfWidth > 0) {
            while (x > 0) x -= halfWidth;
            while (x < -halfWidth) x += halfWidth;
        }
        marquee.style.transform = `translate3d(${x}px, 0, 0)`;
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        marquee.classList.remove('grabbing');
    }

    // Drag start event listeners on the marquee element itself
    marquee.addEventListener('mousedown', startDrag);
    marquee.addEventListener('touchstart', startDrag, { passive: true });

    // Drag move and end listeners on window to ensure robustness when cursor leaves marquee bounds
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: true });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);
    window.addEventListener('mouseleave', endDrag);

    // Continuous Animation loop
    function loop() {
        if (isIntersecting && !isDragging) {
            x -= speed;
            const halfWidth = marquee.scrollWidth / 2;
            if (halfWidth > 0 && x < -halfWidth) {
                x += halfWidth;
            }
            marquee.style.transform = `translate3d(${x}px, 0, 0)`;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

/* =========================================================
   NEW 4. Animated Bar Graph Comparison
   ========================================================= */
function initComparisonBars() {
    const metricGroups = document.querySelectorAll('.bar-metric-group');
    if (!metricGroups.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const group = entry.target;
                const bars = group.querySelectorAll('.bar-fill');
                bars.forEach((bar, i) => {
                    const targetWidth = parseFloat(bar.dataset.width) || 80;
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                        bar.classList.add('bar-animated');
                        const value = bar.querySelector('.bar-value');
                        if (value) value.classList.add('bar-value-visible');
                    }, i * 160);
                });
                observer.unobserve(group);
            }
        });
    }, { threshold: 0.25, rootMargin: '0px 0px -30px 0px' });

    metricGroups.forEach(group => observer.observe(group));
}



/* 1. Navbar Scroll Effect */
function initNavbarScroll() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;
    window.addEventListener('scroll', () => {
        navContainer.classList.toggle('is-scrolled', window.scrollY > 50);
    }, { passive: true });
}

/* 2. Platform Switcher (Android | Windows) */
function initPlatformSwitcher() {
    const tabAndroidBtn = document.getElementById('tab-btn-android');
    const tabWindowsBtn = document.getElementById('tab-btn-windows');
    const showcaseAndroid = document.getElementById('showcase-android');
    const showcaseWindows = document.getElementById('showcase-windows');

    if (!tabAndroidBtn || !tabWindowsBtn || !showcaseAndroid || !showcaseWindows) return;

    function switchPlatform(platform) {
        if (platform === 'android') {
            tabAndroidBtn.classList.add('active');
            tabWindowsBtn.classList.remove('active');
            
            // Cross-fade transitions
            showcaseWindows.classList.remove('active');
            setTimeout(() => {
                showcaseWindows.style.display = 'none';
                showcaseAndroid.style.display = 'flex';
                setTimeout(() => {
                    showcaseAndroid.classList.add('active');
                }, 20);
            }, 300);
            
            // Global state tracking for waveform animation
            window.activePlatform = 'android';
        } else {
            tabWindowsBtn.classList.add('active');
            tabAndroidBtn.classList.remove('active');
            
            // Cross-fade transitions
            showcaseAndroid.classList.remove('active');
            setTimeout(() => {
                showcaseAndroid.style.display = 'none';
                showcaseWindows.style.display = 'flex';
                setTimeout(() => {
                    showcaseWindows.classList.add('active');
                }, 20);
            }, 300);
            
            // Global state tracking for waveform animation
            window.activePlatform = 'windows';
        }
    }

    tabAndroidBtn.addEventListener('click', () => switchPlatform('android'));
    tabWindowsBtn.addEventListener('click', () => switchPlatform('windows'));
    
    // Set initial active state
    window.activePlatform = 'android';
}

/* 3. Interactive Simulator State Machine (Handles both Android and Windows) */
function initSimulator() {
    // --- Android Elements ---
    const floatingBubble = document.getElementById('sim-bubble');
    const overlayPill = document.getElementById('sim-overlay-pill');
    const bottomVoiceBar = document.getElementById('sim-voice-bar');
    const voiceStatusText = document.getElementById('sim-voice-status');
    const notepadBody = document.getElementById('sim-notepad-body');

    // --- Windows Elements ---
    const sidebarTabs = document.querySelectorAll('.desktop-sidebar .sidebar-tab');
    const slideshowSlides = document.querySelectorAll('.desktop-slideshow .slideshow-slide');
    const tryHotkeyBtn = document.getElementById('btn-desktop-demo');
    const desktopEditor = document.getElementById('desktop-editor');
    const desktopEditorBody = document.getElementById('desktop-editor-body');
    const desktopOverlayPill = document.getElementById('desktop-overlay-pill');
    const shortcutToast = document.getElementById('shortcut-toast');

    // Safety Check
    if (!floatingBubble && !tryHotkeyBtn) return;

    let isSimulating = false;
    
    // Initial and Demo text configs
    const originalAndroidText = 'Hello World!<br>';
    const transcriptionAndroidText = 'Fluence transcribes sentences in under a second with human-level accuracy.';
    
    const originalWindowsText = 'Click "Try Hotkey Dictation" in the sidebar to simulate typing in any Windows app...';
    const transcriptionWindowsText = 'Fluence for Windows runs quietly in your system tray. Pressing the global shortcut inserts your words directly into the cursor position instantly.';

    // Setup initial text
    if (notepadBody) {
        notepadBody.innerHTML = originalAndroidText + '<span class="typing-cursor"></span>';
    }


    // --- Android Simulation Sequence ---
    function startAndroidSimulation() {
        if (isSimulating) return;
        isSimulating = true;
        
        // Clear text immediately, show cursor
        if (notepadBody) notepadBody.innerHTML = '<span class="typing-cursor"></span>';
        
        // Active bubble styling
        if (floatingBubble) floatingBubble.classList.add('active');
        if (overlayPill) overlayPill.classList.add('active');
        if (bottomVoiceBar) bottomVoiceBar.classList.add('active');
        
        // Activate Android AuraVisualizer canvas: boosts amplitude like voice audio
        if (window._androidWaveformActivate) window._androidWaveformActivate();
        
        // 1. Listening State (3 seconds)
        let timerCount = 0;
        if (voiceStatusText) voiceStatusText.textContent = `Listening... (00:00)`;
        
        const timerInterval = setInterval(() => {
            timerCount++;
            if (voiceStatusText) voiceStatusText.textContent = `Listening... (00:0${timerCount})`;
            if (timerCount >= 3) {
                clearInterval(timerInterval);
                transitionToAndroidTranscribing();
            }
        }, 1000);
    }
    
    function transitionToAndroidTranscribing() {
        if (voiceStatusText) voiceStatusText.textContent = 'Transcribing...';
        
        if (overlayPill) overlayPill.classList.add('success');
        
        setTimeout(() => {
            // Hide bar and overlay
            if (overlayPill) {
                overlayPill.classList.remove('active');
                overlayPill.classList.remove('success');
            }
            if (bottomVoiceBar) bottomVoiceBar.classList.remove('active');
            if (floatingBubble) floatingBubble.classList.remove('active');
            
            // Deactivate Android AuraVisualizer canvas (returns to idle gentle wave)
            if (window._androidWaveformDeactivate) window._androidWaveformDeactivate();
            
            isSimulating = false;
            
            // Start typing
            startAndroidTyping();
        }, 1500);
    }
    
    function startAndroidTyping() {
        let charIndex = 0;
        if (notepadBody) notepadBody.innerHTML = '<span class="typing-cursor"></span>';
        
        function typeNextChar() {
            if (charIndex < transcriptionAndroidText.length) {
                const currentText = transcriptionAndroidText.substring(0, charIndex + 1);
                if (notepadBody) notepadBody.innerHTML = currentText + '<span class="typing-cursor"></span>';
                charIndex++;
                setTimeout(typeNextChar, 30); // 30ms per character typing speed
            } else {
                setTimeout(resetAndroidNotepad, 4000);
            }
        }
        setTimeout(typeNextChar, 300);
    }
    
    function resetAndroidNotepad() {
        if (isSimulating) return;
        if (notepadBody) notepadBody.innerHTML = originalAndroidText + '<span class="typing-cursor"></span>';
    }

    // --- Windows Slideshow Selector Navigation ---
    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            sidebarTabs.forEach(t => t.classList.remove('active'));
            slideshowSlides.forEach(s => s.classList.remove('active'));
            
            // Close Notepad mockup if open
            if (desktopEditor) desktopEditor.classList.remove('active');
            
            // Add active classes to current tab and slide
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            const targetSlide = document.querySelector(`.desktop-slideshow [data-slide="${targetTab}"]`);
            if (targetSlide) {
                targetSlide.classList.add('active');
            }
        });
    });

    // --- Windows Dictation Simulation Sequence ---
    function startWindowsSimulation() {
        if (isSimulating) return;
        isSimulating = true;

        // Show global hotkey indicator overlay first
        if (shortcutToast) shortcutToast.classList.add('active');

        setTimeout(() => {
            // Fade out hotkey notification, slide editor mock panel into view
            if (shortcutToast) shortcutToast.classList.remove('active');
            if (desktopEditor) desktopEditor.classList.add('active');
            if (desktopEditorBody) desktopEditorBody.innerHTML = '<span class="typing-cursor"></span>';

            // Show floating recording overlay pill
            if (desktopOverlayPill) desktopOverlayPill.classList.add('active');

            // Activate AuraVisualizer canvas: boosts amplitude like voice audio
            if (window._demoWaveformActivate) window._demoWaveformActivate();

            // Simulate listening (2.5 seconds)
            setTimeout(() => {
                if (desktopOverlayPill) desktopOverlayPill.classList.add('success');

                // Hide overlay pill
                setTimeout(() => {
                    if (desktopOverlayPill) {
                        desktopOverlayPill.classList.remove('active');
                        desktopOverlayPill.classList.remove('success');
                    }
                    
                    // Deactivate AuraVisualizer canvas (returns to idle gentle wave)
                    if (window._demoWaveformDeactivate) window._demoWaveformDeactivate();

                    isSimulating = false;

                    // Start typewriter text injection
                    startWindowsTyping();
                }, 1500);
            }, 2500);

        }, 1200); // Display shortcut keys overlay for 1.2 seconds
    }

    function startWindowsTyping() {
        let charIndex = 0;
        if (desktopEditorBody) desktopEditorBody.innerHTML = '<span class="typing-cursor"></span>';

        function typeNextChar() {
            if (charIndex < transcriptionWindowsText.length) {
                const currentText = transcriptionWindowsText.substring(0, charIndex + 1);
                if (desktopEditorBody) desktopEditorBody.innerHTML = currentText + '<span class="typing-cursor"></span>';
                charIndex++;
                setTimeout(typeNextChar, 25); // Faster typing speed on desktop (25ms)
            } else {
                // Done. Pause for 5 seconds and reset panel view back to slideshow slide
                setTimeout(resetWindowsShowcase, 5000);
            }
        }
        setTimeout(typeNextChar, 400);
    }

    function resetWindowsShowcase() {
        if (isSimulating) return;
        if (desktopEditor) desktopEditor.classList.remove('active');
        if (desktopEditorBody) desktopEditorBody.innerHTML = originalWindowsText;
    }

    // Attach click events
    if (floatingBubble) floatingBubble.addEventListener('click', startAndroidSimulation);
    if (tryHotkeyBtn) tryHotkeyBtn.addEventListener('click', startWindowsSimulation);
}

/* 4. Setup Wizard Interactions (Android Specific) */
function initSetupWizard() {
    // Password toggle
    const toggleBtn = document.getElementById('btn-toggle-key');
    const inputField = document.getElementById('groq-key-input');
    const saveBtn = document.getElementById('btn-save-key');
    const saveStatus = document.getElementById('save-status');
    
    if (toggleBtn && inputField) {
        toggleBtn.addEventListener('click', () => {
            if (inputField.type === 'password') {
                inputField.type = 'text';
                toggleBtn.textContent = 'Hide';
            } else {
                inputField.type = 'password';
                toggleBtn.textContent = 'Show';
            }
        });
    }
    
    // Save key action
    if (saveBtn && saveStatus) {
        saveBtn.addEventListener('click', () => {
            saveStatus.style.opacity = '1';
            saveBtn.textContent = 'Saved';
            setTimeout(() => {
                saveStatus.style.opacity = '0';
                saveBtn.textContent = 'Save';
            }, 3000);
        });
    }
    
    // Accessibility switch toggle
    const switchEl = document.getElementById('switch-service');
    if (switchEl) {
        switchEl.addEventListener('click', () => {
            switchEl.classList.toggle('active');
            const timelineCircle = document.getElementById('step-3-circle');
            if (timelineCircle) {
                if (switchEl.classList.contains('active')) {
                    timelineCircle.classList.add('active');
                } else {
                    timelineCircle.classList.remove('active');
                }
            }
        });
    }
}

/* 5. Simulated Onboarding Wizard for Windows (Tauri replica) */
function initWindowsWizard() {
    const wizardWindow = document.querySelector('.tauri-wizard-window');
    if (!wizardWindow) return;

    const TOTAL_STEPS = 6;
    let currentStep = 1;
    let wizardData = {
        provider: 'groq',
        baseUrl: 'https://api.groq.com/openai',
        apiKey: '',
        model: 'whisper-large-v3',
        llmModel: 'llama-3.3-70b-versatile',
        hotkey: 'Ctrl+Shift+Space',
        recordingMode: 'push_to_toggle',
        overlayPosition: 'bottom_right'
    };

    const PROVIDER_PRESETS = {
        groq:   { url: 'https://api.groq.com/openai', model: 'whisper-large-v3', llmModel: 'llama-3.3-70b-versatile' },
        openai: { url: 'https://api.openai.com',      model: 'whisper-1',        llmModel: 'gpt-4o' },
        custom: { url: '',                             model: '',                 llmModel: '' }
    };

    const prevBtn = wizardWindow.querySelector('#prev-btn');
    const nextBtn = wizardWindow.querySelector('#next-btn');
    const progressFill = wizardWindow.querySelector('#progress-fill');
    const stepDots = wizardWindow.querySelectorAll('.wizard-step-dot');

    // Titlebar Close Button simulation
    const closeTitlebarBtn = wizardWindow.querySelector('#sim-wiz-close');
    if (closeTitlebarBtn) {
        closeTitlebarBtn.addEventListener('click', () => {
            if (confirm('Do you want to exit the setup wizard? Settings will not be saved.')) {
                updateStep(1);
            }
        });
    }

    // Step navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) updateStep(currentStep - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < TOTAL_STEPS) {
                    updateStep(currentStep + 1);
                }
            }
        });
    }

    function updateStep(step) {
        // Animate out current
        const currentEl = wizardWindow.querySelector(`#step-${currentStep}`);
        if (currentEl && step !== currentStep) {
            currentEl.classList.add('exit-left');
            setTimeout(() => {
                currentEl.classList.remove('active', 'exit-left');
            }, 350);
        }

        currentStep = step;

        // Animate in new
        const nextEl = wizardWindow.querySelector(`#step-${step}`);
        if (nextEl) {
            setTimeout(() => {
                nextEl.classList.add('active');
            }, 50);
        }

        // Update progress bar
        const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;

        // Update dots
        stepDots.forEach(dot => {
            const dotStep = parseInt(dot.dataset.dot);
            dot.classList.remove('active', 'done');
            if (dotStep === step) dot.classList.add('active');
            else if (dotStep < step) dot.classList.add('done');
        });

        // Update buttons visibility
        if (prevBtn) {
            prevBtn.style.visibility = (step > 1 && step < TOTAL_STEPS) ? 'visible' : 'hidden';
        }

        if (nextBtn) {
            if (step === TOTAL_STEPS) {
                nextBtn.classList.add('hidden');
            } else {
                nextBtn.classList.remove('hidden');
                nextBtn.textContent = step === 1 ? 'Get Started' : (step === TOTAL_STEPS - 1 ? 'Finish Setup' : 'Continue →');
            }
        }
    }

    function validateStep(step) {
        if (step === 2) {
            const key = wizardWindow.querySelector('#wiz-api-key').value.trim();
            if (!key) {
                alert('Please enter your API Key to proceed.');
                return false;
            }
            wizardData.apiKey = key;
            wizardData.baseUrl = wizardWindow.querySelector('#wiz-base-url').value.trim() || wizardData.baseUrl;
        }
        return true;
    }

    // Step 2: Provider selection
    const providerCards = wizardWindow.querySelectorAll('.wizard-provider-card');
    providerCards.forEach(card => {
        card.addEventListener('click', () => {
            providerCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const preset = card.dataset.provider;
            wizardData.provider = preset;

            const p = PROVIDER_PRESETS[preset];
            if (p) {
                const baseUrlInput = wizardWindow.querySelector('#wiz-base-url');
                if (baseUrlInput) baseUrlInput.value = p.url;
                wizardData.baseUrl = p.url;
            }
        });
    });

    // Step 2: Test connection button
    const testBtnEl = wizardWindow.querySelector('#wiz-test-btn');
    const testDot = wizardWindow.querySelector('#wiz-test-dot');
    const testText = wizardWindow.querySelector('#wiz-test-text');

    if (testBtnEl) {
        testBtnEl.addEventListener('click', () => {
            if (testDot) {
                testDot.style.backgroundColor = '#f59e0b';
                testDot.style.boxShadow = '0 0 8px #f59e0b';
            }
            if (testText) {
                testText.textContent = 'Testing connection...';
                testText.style.color = '#f59e0b';
            }
            testBtnEl.disabled = true;

            setTimeout(() => {
                const key = wizardWindow.querySelector('#wiz-api-key').value.trim();
                if (!key) {
                    if (testDot) {
                        testDot.style.backgroundColor = '#ef4444';
                        testDot.style.boxShadow = '0 0 8px #ef4444';
                    }
                    if (testText) {
                        testText.textContent = 'Connection failed: Missing Key';
                        testText.style.color = '#ef4444';
                    }
                } else {
                    if (testDot) {
                        testDot.style.backgroundColor = '#6fcf97';
                        testDot.style.boxShadow = '0 0 8px #6fcf97';
                    }
                    if (testText) {
                        testText.textContent = 'Groq Whisper API Connected!';
                        testText.style.color = '#6fcf97';
                    }
                }
                testBtnEl.disabled = false;
            }, 1200);
        });
    }

    // Step 3: Hotkey display recording
    const hotkeyDisplay = wizardWindow.querySelector('#wiz-hotkey-display');
    const hotkeyText = wizardWindow.querySelector('#wiz-hotkey-text');
    let isRecordingHotkey = false;

    if (hotkeyDisplay) {
        hotkeyDisplay.addEventListener('click', () => {
            if (isRecordingHotkey) return;
            isRecordingHotkey = true;
            hotkeyDisplay.classList.add('recording');
            if (hotkeyText) hotkeyText.textContent = 'Press your shortcut...';
        });

        // Keydown and keyup simulation for hotkey field
        hotkeyDisplay.addEventListener('keydown', (e) => {
            if (!isRecordingHotkey) return;
            e.preventDefault();

            if (e.key === 'Escape') {
                isRecordingHotkey = false;
                hotkeyDisplay.classList.remove('recording');
                if (hotkeyText) hotkeyText.textContent = wizardData.hotkey;
                return;
            }

            const parts = [];
            if (e.ctrlKey) parts.push('Ctrl');
            if (e.altKey) parts.push('Alt');
            if (e.shiftKey) parts.push('Shift');
            const mods = new Set(['Control','Alt','Shift','Meta']);
            if (!mods.has(e.key)) {
                parts.push(e.key === ' ' ? 'Space' : e.key.length === 1 ? e.key.toUpperCase() : e.key);
            }

            if (parts.length > 0 && hotkeyText) {
                hotkeyText.textContent = parts.join('+');
            }
        });

        hotkeyDisplay.addEventListener('keyup', (e) => {
            if (!isRecordingHotkey) return;
            e.preventDefault();
            const current = hotkeyText ? hotkeyText.textContent : '';
            if (current && current !== 'Press your shortcut...') {
                wizardData.hotkey = current;
                isRecordingHotkey = false;
                hotkeyDisplay.classList.remove('recording');
                const doneHotkey = wizardWindow.querySelector('#done-hotkey');
                if (doneHotkey) doneHotkey.textContent = current;
            }
        });
    }

    // Step 3: Recording Mode Selection
    const modeOptions = wizardWindow.querySelectorAll('.wizard-mode-option');
    modeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            modeOptions.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            wizardData.recordingMode = btn.dataset.mode;
        });
    });

    // Step 4: Position Option Selection
    const positionOptions = wizardWindow.querySelectorAll('.wizard-position-option');
    positionOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            positionOptions.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            wizardData.overlayPosition = btn.dataset.pos;
        });
    });

    // Step 5: Test Setup
    const testRecordBtn = wizardWindow.querySelector('#wiz-test-record-btn');
    const testResult = wizardWindow.querySelector('#wiz-test-result');
    let isTestRecording = false;

    if (testRecordBtn) {
        testRecordBtn.addEventListener('click', () => {
            if (!isTestRecording) {
                isTestRecording = true;
                testRecordBtn.textContent = '⏹ Stop Recording';
                testRecordBtn.classList.add('wizard-test-record-btn--recording');
                if (testResult) {
                    testResult.classList.remove('placeholder');
                    testResult.textContent = 'Recording... speak now';
                }
            } else {
                isTestRecording = false;
                testRecordBtn.textContent = '⏳ Transcribing...';
                testRecordBtn.classList.remove('wizard-test-record-btn--recording');
                testRecordBtn.disabled = true;

                setTimeout(() => {
                    if (testResult) {
                        testResult.textContent = 'Hello! This is a test of Fluence voice typing setup on Windows.';
                    }
                    testRecordBtn.textContent = '🎙 Try Again';
                    testRecordBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // Step 6: Complete Actions
    const openSettingsBtn = wizardWindow.querySelector('#wiz-open-settings-btn');
    const closeBtn = wizardWindow.querySelector('#wiz-close-btn');

    const handleSuccessFinish = () => {
        alert('Setup saved! Fluence configuration successfully complete.');
        updateStep(1);
        // Reset fields
        const keyInput = wizardWindow.querySelector('#wiz-api-key');
        if (keyInput) keyInput.value = '';
        if (testDot) {
            testDot.style.backgroundColor = '#849495';
            testDot.style.boxShadow = 'none';
        }
        if (testText) {
            testText.textContent = 'Not tested';
            testText.style.color = '#b9cacb';
        }
        if (testResult) {
            testResult.classList.add('placeholder');
            testResult.textContent = 'Your transcription will appear here...';
        }
    };

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', handleSuccessFinish);
    if (closeBtn) closeBtn.addEventListener('click', handleSuccessFinish);
}

/* 7. ScrollSpy for Documentation Sidebar */
function initDocsScrollSpy() {
    const docsSections = document.querySelectorAll('.docs-section');
    const docsNavItems = document.querySelectorAll('.docs-nav-item');
    if (docsSections.length === 0 || docsNavItems.length === 0) return;

    function scrollSpy() {
        let currentSectionId = '';
        const scrollThreshold = 140; // Header height + padding

        docsSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= scrollThreshold) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            docsNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // run initially
}


/* =========================================================
   NEW 6. Mobile Responsive Navigation Menu
   ========================================================= */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const header = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!toggleBtn || !header) return;
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = header.classList.contains('mobile-menu-active');
        if (isOpen) {
            header.classList.remove('mobile-menu-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            header.classList.add('mobile-menu-active');
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (header.classList.contains('mobile-menu-active')) {
            const isClickInside = header.contains(e.target);
            if (!isClickInside) {
                header.classList.remove('mobile-menu-active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Close menu when clicking a link (useful for hash links)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('mobile-menu-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/* =========================================================
   ENHANCEMENT 1: Scroll Progress Bar
   Updates a thin bar at the top showing page scroll position
   ========================================================= */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/* =========================================================
   ENHANCEMENT 5: Magnetic Button Effect
   Buttons with data-magnetic attribute follow cursor slightly
   ========================================================= */
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(el => {
        let rect = null;
        let centerX = 0;
        let centerY = 0;
        
        el.addEventListener('mouseenter', () => {
            // Disable transition temporarily to get accurate position
            el.style.transition = 'none';
            rect = el.getBoundingClientRect();
            // Calculate absolute page coordinates (independent of scrolling)
            centerX = rect.left + rect.width / 2 + window.scrollX;
            centerY = rect.top + rect.height / 2 + window.scrollY;
            
            // Apply a responsive follow transition
            el.style.transition = 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        
        el.addEventListener('mousemove', e => {
            if (!rect) return;
            const deltaX = (e.pageX - centerX) * 0.35;
            const deltaY = (e.pageY - centerY) * 0.35;
            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            // Apply a smooth slide-back transition on leave
            el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.transform = 'translate(0, 0)';
            rect = null;
        });
    });
}

/* =========================================================
   ENHANCEMENT 13: 3D Tilt Card Effect
   Cards with tilt-card class respond to mouse position
   ========================================================= */
function init3DTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    tiltCards.forEach(card => {
        const inner = card.querySelector('.tilt-card-inner') || card;
        
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            inner.style.setProperty('--tilt-x', `${rotateX}deg`);
            inner.style.setProperty('--tilt-y', `${rotateY}deg`);
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.setProperty('--tilt-x', '0deg');
            inner.style.setProperty('--tilt-y', '0deg');
        });
    });
}

/* =========================================================
   Phase 3 — Active nav highlight, back-to-top, save-status
   ========================================================= */
function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
    if (!navLinks.length) return;

    const sectionMap = new Map();
    navLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) sectionMap.set(section, link);
    });
    if (!sectionMap.size) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = sectionMap.get(entry.target);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sectionMap.forEach((_, section) => observer.observe(section));
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    let visible = false;
    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > 600;
        if (shouldShow !== visible) {
            visible = shouldShow;
            btn.classList.toggle('is-visible', visible);
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initSaveStatusReveal() {
    const status = document.getElementById('save-status');
    if (!status) return;

    const observer = new MutationObserver(() => {
        const isShown = status.style.opacity !== '0' && status.style.opacity !== '';
        status.classList.toggle('is-visible', isShown);
        if (isShown) {
            setTimeout(() => status.classList.remove('is-visible'), 2500);
        }
    });
    observer.observe(status, { attributes: true, attributeFilter: ['style'] });
}
