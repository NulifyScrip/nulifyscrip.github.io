const boxes = document.querySelectorAll('.carousel .box');

let current = 0;
let isAnimating = false;

/* =========================
   Carousel
========================= */

function updateCarousel() {

    boxes.forEach((box, index) => {

        box.classList.remove('active', 'behind', 'slide-out');

        if (index === current) {
            box.classList.add('active');
        } 
        else if (index === (current + 1) % boxes.length) {
            box.classList.add('behind');
        } 
        else {
            box.classList.add('slide-out');
        }
    });
}

function nextBox() {

    if (isAnimating) return;

    isAnimating = true;

    current = (current + 1) % boxes.length;

    updateCarousel();

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

function handleAdvance() {
    nextBox();
    startMusic();
}

/* click */
boxes.forEach(box => {
    box.addEventListener('click', handleAdvance);
});

/* keyboard */
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

const youtubeId = "5WW3rOS0e-c";

let player;
let started = false;
let pendingStart = false;

function onYouTubeIframeAPIReady() {

    player = new YT.Player('yt-player', {

        height: '0',
        width: '0',
        videoId: youtubeId,

        playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: youtubeId
        },

        events: {
            onReady: (e) => {
                e.target.mute();
                e.target.setVolume(0);

                if (pendingStart) {
                    playAndFade();
                }
            }
        }
    });
}

function startMusic() {

    if (started) return;
    started = true;

    if (!player) {
        pendingStart = true;
        return;
    }

    playAndFade();
}

function playAndFade() {

    player.playVideo();
    player.unMute();

    let vol = 0;

    const fade = setInterval(() => {

        if (vol >= 25) {
            clearInterval(fade);
            return;
        }

        vol += 5;
        player.setVolume(vol);

    }, 120);
}
