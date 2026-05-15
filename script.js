/* =========================
   Custom Cursor
========================= */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, .box, .indicator, .music-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

/* =========================
   Parallax
========================= */
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    document.body.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
});

/* =========================
   Carousel
========================= */
const boxes = document.querySelectorAll('.carousel .box');
const indicators = document.querySelectorAll('.indicator');
const counter = document.getElementById('counter');
const counterNumber = document.getElementById('counter-number');
let current = 0;
let isAnimating = false;
const projectCount = 1;

function countUp(target) {
    let count = 0;
    const step = Math.ceil(target / 20);
    const interval = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(interval); }
        counterNumber.textContent = count;
    }, 50);
}

function updateCarousel() {
    boxes.forEach((box, i) => {
        box.className = 'box ' + (
            i === current ? 'active' :
            i === (current + 1) % boxes.length ? 'behind' : 'slide-out'
        );
    });
    indicators.forEach((dot, i) => dot.classList.toggle('active', i === current));
    if (current === 2) {
        counter.classList.add('visible');
        countUp(projectCount);
    } else {
        counter.classList.remove('visible');
        counterNumber.textContent = 0;
    }
}

function nextBox() {
    if (isAnimating) return;
    isAnimating = true;
    current = (current + 1) % boxes.length;
    updateCarousel();
    setTimeout(() => isAnimating = false, 600);
}

function handleAdvance(e) {
    e.stopPropagation();
    nextBox();
    startMusic();
}

boxes.forEach(box => box.addEventListener('click', handleAdvance));

indicators.forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(dot.dataset.index);
        if (index === current || isAnimating) return;
        isAnimating = true;
        current = index;
        updateCarousel();
        setTimeout(() => isAnimating = false, 600);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextBox();
        startMusic();
    }
});

updateCarousel();

/* =========================
   Music Toggle
========================= */
const musicToggle = document.getElementById('music-toggle');
const iconMute = document.getElementById('icon-mute');
const iconUnmute = document.getElementById('icon-unmute');
let isMuted = false;

musicToggle.addEventListener('click', () => {
    if (!player) return;
    isMuted = !isMuted;
    if (isMuted) {
        player.mute();
        iconMute.style.display = 'none';
        iconUnmute.style.display = 'block';
    } else {
        player.unMute();
        iconMute.style.display = 'block';
        iconUnmute.style.display = 'none';
    }
});

/* =========================
   YouTube Music
========================= */
const youtubeId = '5WW3rOS0e-c';
let player, started = false, pendingStart = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '0', width: '0',
        videoId: youtubeId,
        playerVars: { autoplay: 1, loop: 1, playlist: youtubeId },
        events: {
            onReady: (e) => {
                e.target.mute();
                e.target.setVolume(0);
                if (pendingStart) playAndFade();
            }
        }
    });
}

function startMusic() {
    if (started) return;
    started = true;
    if (!player) { pendingStart = true; return; }
    playAndFade();
}

function playAndFade() {
    player.playVideo();
    player.unMute();
    let vol = 0;
    const fade = setInterval(() => {
        if (vol >= 25) { clearInterval(fade); return; }
        player.setVolume(vol += 5);
    }, 120);
}
