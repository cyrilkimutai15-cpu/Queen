(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const screens = $$(".screen");
  const navLinks = $$(".nav-link");

  function showScreen(id) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("screen")) return;
    screens.forEach(screen => {
      const active = screen === target;
      screen.classList.toggle("active", active);
      screen.setAttribute("aria-hidden", String(!active));
    });
    navLinks.forEach(link => {
      const active = link.dataset.go === id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  }
  $$("[data-go]").forEach(button => button.addEventListener("click", () => showScreen(button.dataset.go)));
  const initial = location.hash.slice(1);
  showScreen(document.getElementById(initial)?.classList.contains("screen") ? initial : "home");

  const letterPopup = $("#letterPopup");
  const letterMessage = $("#letterMessage");
  const closeLetter = () => { letterPopup.hidden = true; };
  $$(".envelope").forEach(envelope => envelope.addEventListener("click", () => {
    letterMessage.textContent = envelope.dataset.note || "A little note, just for you. 💜";
    letterPopup.hidden = false;
    $("#closeLetter").focus();
    burstHearts(7);
  }));
  $("#closeLetter").addEventListener("click", closeLetter);
  letterPopup.addEventListener("click", event => { if (event.target === letterPopup) closeLetter(); });

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  $$(".photo-card").forEach(card => card.addEventListener("click", () => {
    const path = card.dataset.photo;
    lightboxCaption.textContent = card.dataset.caption || "A lovely memory";
    lightboxImage.onerror = () => {
      closeLightbox();
      alert("This picture could not be found. Check that " + path + " is uploaded in the assets folder with the exact same filename.");
    };
    lightboxImage.src = path;
    lightbox.hidden = false;
    $("#closeLightbox").focus();
  }));
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  }
  $("#closeLightbox").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

  function burstHearts(amount = 5) {
    const layer = $("#heartsLayer");
    const symbols = ["♡", "♥", "✦", "✧"];
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${8 + Math.random() * 84}%`;
      heart.style.animationDelay = `${Math.random() * .7}s`;
      heart.style.fontSize = `${14 + Math.random() * 18}px`;
      layer.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
  }
  $("#heartButton").addEventListener("click", () => burstHearts(22));

  // Music begins only after the visitor taps Play, because mobile browsers block autoplay.
  const music = $("#backgroundMusic");
  const musicToggle = $("#musicToggle");
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.textContent = "Pause";
        musicToggle.setAttribute("aria-label", "Pause background music");
      } catch {
        alert("Please check that assets/music.mp3 is uploaded and try again.");
      }
    } else {
      music.pause();
      musicToggle.textContent = "Play music";
      musicToggle.setAttribute("aria-label", "Play background music");
    }
  });
  music.addEventListener("ended", () => {
    musicToggle.textContent = "Play music";
    musicToggle.setAttribute("aria-label", "Play background music");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!letterPopup.hidden) closeLetter();
      if (!lightbox.hidden) closeLightbox();
    }
  });
})();
