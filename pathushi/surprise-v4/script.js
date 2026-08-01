/* ==========================================================================
   Karaoke Date Invitation - Interactive Script (TODAY 1.30-3.30 PM)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    initCountdownTimer();
    initEnvelopeSecret();
    initRSVPLogic();
});

/* ==========================================================================
   1. Interactive Background Canvas (Floating Hearts & Notes)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 35;
    const icons = ['❤️', '💖', '🎶', '🎵', '✨', '☕', '🎤'];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 18 + 10;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.symbol = icons[Math.floor(Math.random() * icons.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. Countdown Timer Logic (TODAY @ 1:30 PM)
   ========================================================================== */
function initCountdownTimer() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Calculate Today's date at 13:30 (1:30 PM)
    const targetDate = new Date();
    targetDate.setHours(13, 30, 0, 0);

    function updateTimer() {
        const currentTime = new Date();
        const diff = targetDate - currentTime;

        if (diff <= 0) {
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ==========================================================================
   3. Secret Note Envelope Logic
   ========================================================================== */
function initEnvelopeSecret() {
    const openBtn = document.getElementById('open-envelope-btn');
    const msg = document.getElementById('envelope-message');

    if (openBtn && msg) {
        openBtn.addEventListener('click', () => {
            msg.classList.toggle('hidden');
            openBtn.textContent = msg.classList.contains('hidden') ? 'Read Note' : 'Close Note';
        });
    }
}

/* ==========================================================================
   4. Interactive RSVP & Celebration Logic
   ========================================================================== */
function initRSVPLogic() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const modal = document.getElementById('rsvp-modal');
    const modalClose = document.getElementById('modal-close');
    const playfulMsg = document.getElementById('no-playful-msg');
    const calendarBtn = document.getElementById('add-calendar-btn');

    const playfulPhrases = [
        "Are you sure? Unlimited coffee & tea included! ☕",
        "Nice try! The 'No' button is camera shy 🙈",
        "Your duet partner will be sad! 🥺",
        "Click YES instead! You're going to love today! 💕",
        "Warning: Saying no voids your karaoke privileges! 😂"
    ];

    let noClickCount = 0;

    // Dodge / Playful behavior for NO button
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', () => {
        noClickCount++;
        moveNoButton();
        playfulMsg.textContent = playfulPhrases[noClickCount % playfulPhrases.length];
    });

    function moveNoButton() {
        const parentRect = noBtn.parentElement.getBoundingClientRect();
        const maxX = 120;
        const maxY = 50;

        const randomX = (Math.random() - 0.5) * maxX * 2;
        const randomY = (Math.random() - 0.5) * maxY * 2;

        noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    // YES Button Click
    yesBtn.addEventListener('click', () => {
        modal.classList.add('active');
        triggerConfetti();
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            alert("✨ Reminder set for TODAY at 1:30 PM @ Cove Kafe Kirulapana! See you there! 🎤❤️");
            modal.classList.remove('active');
        });
    }
}

/* Confetti Burst Animation */
function triggerConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        createConfettiPiece();
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = Math.random() * 8 + 6 + 'px';
    confetti.style.height = Math.random() * 8 + 6 + 'px';
    confetti.style.backgroundColor = ['#ff2a75', '#ffb703', '#00f5d4', '#8a2be2', '#ffffff'][Math.floor(Math.random() * 5)];
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '999';
    confetti.style.pointerEvents = 'none';
    confetti.style.opacity = Math.random();

    document.body.appendChild(confetti);

    const fallSpeed = Math.random() * 3 + 2;
    let top = -10;

    const interval = setInterval(() => {
        top += fallSpeed;
        confetti.style.top = top + 'px';
        if (top > window.innerHeight) {
            clearInterval(interval);
            confetti.remove();
        }
    }, 16);
}
