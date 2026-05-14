let current = 0;
const boxes = document.querySelectorAll('.box');
let isAnimating = false;

boxes.forEach((box) => {
    box.addEventListener('click', (e) => {
        if (isAnimating) return;
        nextBox();
    });
});

function nextBox() {
    const next = (current + 1) % boxes.length;
    isAnimating = true;
    boxes[current].className = 'box slide-out';
    boxes[next].className = 'box active';
    setTimeout(() => {
        boxes.forEach((box, i) => {
            if (i !== next) box.className = 'box behind';
        });
        isAnimating = false;
    }, 600);
    current = next;
}