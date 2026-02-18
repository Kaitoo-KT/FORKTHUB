/* =========================
   STATE CONTROL
========================= */
let mode = "intro";           // intro → love → text
let textToHeart = false;      // mode teks berubah jadi hati

/* =========================
   SETUP CANVAS
========================= */
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

const heartCanvas = document.getElementById("heartCanvas");
const heartCtx = heartCanvas.getContext("2d");

const gombalEl = document.getElementById("gombal");
const textBox = document.querySelector(".text-box");

/* =========================
   CANVAS RESIZE (DPR SAFE)
========================= */
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    [bgCanvas, heartCanvas].forEach(c => {
        c.width = w * dpr;
        c.height = h * dpr;
        c.style.width = w + "px";
        c.style.height = h + "px";
    });

    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    heartCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =========================
   BACKGROUND FLOATING HEARTS
========================= */
const bgHearts = Array.from({ length: 30 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 8 + 4,
    speed: Math.random() * 0.4 + 0.2,
    alpha: Math.random() * 0.4 + 0.2
}));

function drawBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgHearts.forEach(h => {
        bgCtx.globalAlpha = h.alpha;
        bgCtx.beginPath();
        bgCtx.arc(h.x, h.y, h.size, 0, Math.PI * 2);
        bgCtx.fillStyle = "#fff";
        bgCtx.fill();

        h.y -= h.speed;
        if (h.y < -10) {
            h.y = window.innerHeight + 10;
            h.x = Math.random() * window.innerWidth;
        }
    });

    bgCtx.globalAlpha = 1;
    requestAnimationFrame(drawBackground);
}
drawBackground();

/* =========================
   TYPING GOMBAL
========================= */
const gombalan = [
    "Hidup Pirtual",
    "Baper ko sama ketikan",
    "Punya Cowo ko dibagi dua",
    "Mwhehehehe",
    "Lihat ni"
];

let gIndex = 0;

function typeText(text, el, speed = 35, done) {
    el.innerHTML = "";
    let i = 0;

    function type() {
        if (i < text.length) {
            el.innerHTML += text[i++];
            setTimeout(type, speed);
        } else done && done();
    }
    type();
}

function showGombal() {
    if (gIndex < gombalan.length) {
        typeText(gombalan[gIndex], gombalEl, 35, () => {
            setTimeout(() => {
                gIndex++;
                showGombal();
            }, 1100);
        });
    } else {
        startLoveAnimation();
    }
}
showGombal();

/* =========================
   DRAW HEART
========================= */
let loveProgress = 0;

function startLoveAnimation() {
    mode = "love";
    loveProgress = 0;
    textBox.style.opacity = 0;
    requestAnimationFrame(drawLove);
}

function drawLove() {
    if (mode !== "love") return;

    heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    heartCtx.strokeStyle = "#fff";
    heartCtx.lineWidth = 4;
    heartCtx.beginPath();

    let started = false;
    for (let t = 0; t < loveProgress; t += 0.03) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        const px = cx + x * 12;
        const py = cy - y * 12;

        if (!started) {
            heartCtx.moveTo(px, py);
            started = true;
        } else {
            heartCtx.lineTo(px, py);
        }
    }

    heartCtx.stroke();

    if (loveProgress < Math.PI * 2) {
        loveProgress += 0.06;
        requestAnimationFrame(drawLove);
    } else {
        explodeHeartParticles();
        setTimeout(() => {
            mode = "text";
            buildTextParticles("CESY\nBAUK KETEK");
        }, 600);
    }
}

/* =========================
   TEXT & HEART PARTICLES
========================= */
const particles = [];
let touch = { x: 0, y: 0, active: false };

function buildTextParticles(text) {
    particles.length = 0;
    const temp = document.createElement("canvas");
    const ctx = temp.getContext("2d");

    temp.width = window.innerWidth;
    temp.height = window.innerHeight;

    const lines = text.split("\n");
    const fontSize = Math.min(window.innerWidth / 7, 110);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontSize}px sans-serif`;

    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    let startY = temp.height / 2 - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, i) => ctx.fillText(line, temp.width / 2, startY + i * lineHeight));

    const data = ctx.getImageData(0, 0, temp.width, temp.height).data;

    for (let y = 0; y < temp.height; y += 6) {
        for (let x = 0; x < temp.width; x += 6) {
            if (data[(y * temp.width + x) * 4 + 3] > 128) {
                particles.push({
                    baseX: x,
                    baseY: y,
                    x: Math.random() * temp.width,
                    y: Math.random() * temp.height,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    requestAnimationFrame(drawTextParticles);
}

function buildHeartParticles() {
    particles.length = 0;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        particles.push({
            baseX: cx + x * 10,
            baseY: cy - y * 10,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: 0,
            vy: 0
        });
    }

    requestAnimationFrame(drawTextParticles);
}

function drawTextParticles() {
    if (mode !== "text" && !textToHeart) return;

    heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

    particles.forEach(p => {
        const beat = Math.sin(Date.now() * 0.004) * 1.5;

        if (touch.active && !textToHeart) {
            const dx = touch.x - p.x;
            const dy = touch.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                p.vx += dx * force * 0.02;
                p.vy += dy * force * 0.02;
            }
        }

        p.vx += (p.baseX - p.x) * 0.02;
        p.vy += (p.baseY - p.y) * 0.02;
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        heartCtx.fillStyle = textToHeart ? "#ff4d6d" : "rgba(255,255,255,0.15)";
        heartCtx.beginPath();
        heartCtx.arc(p.x, p.y, 6 + beat, 0, Math.PI * 2);
        heartCtx.fill();

        heartCtx.fillStyle = textToHeart ? "#ff0000" : "#fff";
        heartCtx.beginPath();
        heartCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        heartCtx.fill();
    });

    requestAnimationFrame(drawTextParticles);
}

/* =========================
   CLICK → LEDAK → BALIK KE LOVE
========================= */
let clickCooldown = false;

document.addEventListener("click", e => {
    if (mode !== "text" || clickCooldown) return;
    clickCooldown = true;

    if (!textToHeart) explodeLetters(e.clientX, e.clientY, "CESY");

    setTimeout(() => {
        startLoveAnimation();
        clickCooldown = false;
        textToHeart = false;
    }, 900);
});

function explodeLetters(x, y, text) {
    text.split("").forEach((letter, i) => {
        const span = document.createElement("div");
        span.textContent = letter;
        span.style.position = "fixed";
        span.style.left = x + "px";
        span.style.top = y + "px";
        span.style.color = "#fff";
        span.style.fontWeight = "bold";
        span.style.fontSize = "22px";
        span.style.pointerEvents = "none";
        span.style.transition = "transform 0.8s ease-out, opacity 0.8s";
        document.body.appendChild(span);

        const angle = (Math.PI * 2 / text.length) * i;
        const dx = Math.cos(angle) * 120;
        const dy = Math.sin(angle) * 120;

        requestAnimationFrame(() => {
            span.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
            span.style.opacity = 0;
        });

        setTimeout(() => span.remove(), 800);
    });
}

function explodeHeartParticles() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < 40; i++) {
        const p = document.createElement("div");
        p.textContent = "❤️";
        p.style.position = "fixed";
        p.style.left = cx + "px";
        p.style.top = cy + "px";
        p.style.fontSize = Math.random() * 16 + 16 + "px";
        p.style.pointerEvents = "none";
        p.style.transition = "transform 0.8s ease-out, opacity 0.8s";
        document.body.appendChild(p);

        const dx = Math.random() * 300 - 150;
        const dy = Math.random() * -250;

        requestAnimationFrame(() => {
            p.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
            p.style.opacity = 0;
        });

        setTimeout(() => p.remove(), 800);
    }
}

/* =========================
   POINTER INTERACTION
========================= */
window.addEventListener("pointerdown", e => {
    touch.active = true;
    touch.x = e.clientX;
    touch.y = e.clientY;

    // Jika sedang di mode text dan belum berubah jadi heart particles
    if (mode === "text" && !textToHeart) {
        textToHeart = true;
        buildHeartParticles(); // ubah text menjadi hati
    }
});
    
window.addEventListener("pointermove", e => {
    touch.x = e.clientX;
    touch.y = e.clientY;
});

window.addEventListener("pointerup", () => {
    touch.active = false;
});