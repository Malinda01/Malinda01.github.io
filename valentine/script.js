const card = document.getElementById("card");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const actions = document.getElementById("actions");

// Sleek dodge: keep "No" inside the card area, small moves, smooth transitions.
function dodgeNo() {
  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const pad = 18;
  const maxX = cardRect.width - btnRect.width - pad * 2;
  const maxY = cardRect.height - btnRect.height - pad * 2;

  const x = Math.random() * maxX + pad;
  const y = Math.random() * maxY + pad;

  actions.style.position = "relative";
  noBtn.style.position = "absolute";

  noBtn.style.left = `${Math.min(Math.max(x, pad), cardRect.width - btnRect.width - pad)}px`;
  noBtn.style.top = `${Math.min(Math.max(y, pad), cardRect.height - btnRect.height - pad)}px`;

  noBtn.style.transition = "left .22s ease, top .22s ease, transform .18s ease";
  noBtn.style.transform = "scale(0.98)";
  setTimeout(() => (noBtn.style.transform = "scale(1)"), 160);
}

function showYes() {
  card.innerHTML = `
    <div class="success">
      <div class="bigHeart">💖</div>
      <h1 style="margin:0 0 10px;">Yay. It’s a date.</h1>
      <p style="margin:0; color: rgba(255,255,255,0.72); font-size:16px; line-height:1.6;">
        I’m smiling like a loading screen that finally hit 100%.
      </p>
      <div class="pill">🥰 <span>Happy Valentine’s</span> 🌹</div>
    </div>
  `;
}

yesBtn.addEventListener("click", showYes);
noBtn.addEventListener("mouseenter", dodgeNo);
noBtn.addEventListener("click", dodgeNo);

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "y") showYes();
  if (e.key.toLowerCase() === "n") dodgeNo();
});
