/* =========================
   Carousel
========================= */
const boxes = document.querySelectorAll('.carousel .box');
const preview = document.getElementById('project-preview');
let current = 0;
let isAnimating = false;

function updateCarousel() {
    boxes.forEach((box, i) => {
        box.className = 'box ' + (
            i === current ? 'active' :
            i === (current + 1) % boxes.length ? 'behind' : 'slide-out'
        );
    });
    current === 2 ? preview.classList.add('visible') : preview.classList.remove('visible');
}

function nextBox() {
    if (isAnimating) return;
    isAnimating = true;
    current = (current + 1) % boxes.length;
    updateCarousel();
    setTimeout(() => isAnimating = false, 600);
}

function handleAdvance() {
    nextBox();
    startMusic();
}

boxes.forEach(box => box.addEventListener('click', handleAdvance));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleAdvance();
    }
});

updateCarousel();

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
