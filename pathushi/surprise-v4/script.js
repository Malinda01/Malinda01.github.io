/* ==========================================================================
   Karaoke Date Invitation - Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    initCountdownTimer();
    initPlaylistAndSynth();
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
   2. Countdown Timer Logic (Tomorrow @ 1:30 PM)
   ========================================================================== */
function initCountdownTimer() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const ticketDateEl = document.getElementById('ticket-date-text');

    // Calculate tomorrow's date at 13:30 (1:30 PM)
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + 1);
    targetDate.setHours(13, 30, 0, 0);

    // Format date string for ticket display
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    if (ticketDateEl) {
        ticketDateEl.textContent = targetDate.toLocaleDateString('en-US', options) + ' (Tomorrow)';
    }

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
   3. Song Database & Interactive Web Audio Synthesizer Player
   ========================================================================== */

const songData = {
    sobana: {
        title: 'Sobana (සොබනා)',
        artist: 'Sinhala Classic Duet',
        frequencies: [261.63, 329.63, 392.00, 523.25, 440.00, 349.23], // C, E, G, C5, A, F
        lyrics: `
            <p class="duet-line">🎤 [Duet Intro] Sobana kalhabasa ma hada dilena...</p>
            <p class="girl-line">💕 [Her Turn] රන්වන් රන් මලක් වගේ ඔබ මා ළඟ ඉන්නවා නම්...</p>
            <p class="boy-line">💙 [His Turn] මගේ පණ වාගේ ආදරෙන් මං ඔබව රැකබලා ගන්නම්!</p>
            <p class="duet-line">✨ [Together] සොබනා සිනහවෙන් ලොවම එළිය වෙනවා!</p>
        `
    },
    perfect: {
        title: 'Perfect',
        artist: 'Ed Sheeran',
        frequencies: [329.63, 392.00, 440.00, 493.88, 523.25, 659.25], // E, G, A, B, C5, E5
        lyrics: `
            <p class="boy-line">💙 I found a love for me... Darling, just dive right in and follow my lead</p>
            <p class="girl-line">💕 Well, I found a girl, beautiful and sweet...</p>
            <p class="duet-line">✨ Baby, I'm dancing in the dark with you between my arms</p>
            <p class="duet-line">💖 Barefoot on the grass, listening to our favourite song...</p>
        `
    },
    lovestory: {
        title: 'Love Story',
        artist: 'Taylor Swift',
        frequencies: [293.66, 369.99, 440.00, 554.37, 659.25], // D, F#, A, C#5, E5
        lyrics: `
            <p class="girl-line">💕 We were both young when I first saw you...</p>
            <p class="boy-line">💙 See the lights, see the party, the ball gowns</p>
            <p class="duet-line">✨ Romeo, take me somewhere we can be alone!</p>
            <p class="duet-line">💖 I'll be waiting; all there's left to do is run!</p>
        `
    },
    heenayaki: {
        title: 'Heenayaki Mata Adare (හීනයකි මට ආදරේ)',
        artist: 'Sinhala Romantic Hit',
        frequencies: [220.00, 261.63, 329.63, 392.00, 440.00], // A, C, E, G, A4
        lyrics: `
            <p class="duet-line">🎤 හීනයකි මට ආදරේ... ඔබ ලඟ නැති හැම මොහොතේම...</p>
            <p class="girl-line">💕 ඔබේ සුවඳ මා හදවත රැඳුණා...</p>
            <p class="boy-line">💙 හැමදාම මගේ ළඟින් ඉන්න සුදූ!</p>
            <p class="duet-line">✨ [Duet Highlight] Cove Kafe එකේදී එකටම කියමු!</p>
        `
    },
    wmyb: {
        title: 'What Makes You Beautiful',
        artist: 'One Direction',
        frequencies: [349.23, 440.00, 523.25, 698.46, 523.25, 440.00], // F, A, C5, F5
        lyrics: `
            <p class="boy-line">💙 You're insecure, don't know what for... You're turning heads when you walk through the door!</p>
            <p class="girl-line">💕 Don't need make-up to cover up... Being the way that you are is enough!</p>
            <p class="duet-line">✨ Baby you light up my world like nobody else!</p>
            <p class="duet-line">💖 That's what makes you beautiful!</p>
        `
    },
    unmadini: {
        title: 'Unmadini (උන්මාදිනී)',
        artist: 'Classic Soul',
        frequencies: [261.63, 293.66, 329.63, 349.23, 392.00], // C, D, E, F, G
        lyrics: `
            <p class="boy-line">💙 උන්මාදිනී මාගේ... පෙම් මාවතේ...</p>
            <p class="girl-line">💕 මා හද නවාතැනේ ඔබමයි හිඳින්නේ...</p>
            <p class="duet-line">✨ නිහඬව තබන්න බැරි සෙනෙහසේ ගීතය සින්දු කියමු හෙට!</p>
        `
    },
    more: {
        title: 'And Lot Moreeeeee! 🎶✨',
        artist: 'Unlimited Playlist Queue',
        frequencies: [261.63, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99],
        lyrics: `
            <p class="duet-line">🎉 Any song you request tomorrow, we will sing!</p>
            <p class="girl-line">💕 Your favorites, my favorites & secret duets!</p>
            <p class="boy-line">💙 Non-stop music from 1.30 PM to 3.30 PM!</p>
        `
    }
};

let audioCtx = null;
let currentSynthInterval = null;
let isPlaying = false;
let activeSongKey = 'sobana';

function initPlaylistAndSynth() {
    const playBtn = document.getElementById('synth-play-btn');
    const playIcon = document.getElementById('play-icon');
    const eqBars = document.getElementById('eq-bars');
    const vinyl = document.querySelector('.spinning-vinyl');
    const lyricsToggle = document.getElementById('lyrics-toggle');
    const lyricsDrawer = document.getElementById('lyrics-drawer');

    // Select initial default song
    selectSong('sobana');

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSynthTune();
        } else {
            startSynthTune(activeSongKey);
        }
    });

    lyricsToggle.addEventListener('click', () => {
        lyricsDrawer.classList.toggle('open');
    });
}

function selectSong(key) {
    const song = songData[key];
    if (!song) return;

    activeSongKey = key;

    document.getElementById('current-song-title').textContent = song.title;
    document.getElementById('current-song-artist').textContent = song.artist;
    document.getElementById('lyrics-content').innerHTML = song.lyrics;

    // Highlight active card
    document.querySelectorAll('.song-card').forEach(card => {
        card.style.borderColor = 'rgba(255, 255, 255, 0.12)';
    });
    const activeCard = document.querySelector(`.song-card[data-song="${key}"]`);
    if (activeCard) {
        activeCard.style.borderColor = '#ff2a75';
    }

    // Auto play synth preview
    startSynthTune(key);
}

function startSynthTune(key) {
    stopSynthTune();

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const song = songData[key];
    const freqs = song.frequencies;
    let noteIdx = 0;

    isPlaying = true;
    document.getElementById('play-icon').className = 'fa-solid fa-pause';
    document.getElementById('eq-bars').classList.add('active');
    document.querySelector('.spinning-vinyl').classList.add('playing');

    currentSynthInterval = setInterval(() => {
        if (!isPlaying) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freqs[noteIdx % freqs.length];

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);

        noteIdx++;
    }, 280);
}

function stopSynthTune() {
    isPlaying = false;
    if (currentSynthInterval) {
        clearInterval(currentSynthInterval);
        currentSynthInterval = null;
    }
    const playIcon = document.getElementById('play-icon');
    const eqBars = document.getElementById('eq-bars');
    const vinyl = document.querySelector('.spinning-vinyl');

    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (eqBars) eqBars.classList.remove('active');
    if (vinyl) vinyl.classList.remove('playing');
}

/* ==========================================================================
   4. Secret Note Envelope Logic
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
   5. Interactive RSVP & Celebration Logic
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
        "Click YES instead! You're going to love it! 💕",
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
        playSuccessTone();
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
            alert("✨ Reminder set for Tomorrow at 1:30 PM @ Cove Kafe Kirulapana! See you there! 🎤❤️");
        });
    }
}

/* Synthesizer Fanfare when RSVP Yes is clicked */
function playSuccessTone() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }, idx * 120);
    });
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
