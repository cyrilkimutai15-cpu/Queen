(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const screens = $$(".screen");
  const navButtons = $$(".nav");

  function showScreen(id) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("screen")) return;
    screens.forEach(screen => {
      const active = screen === target;
      screen.classList.toggle("active", active);
      screen.setAttribute("aria-hidden", String(!active));
    });
    navButtons.forEach(button => {
      const active = button.dataset.screen === id;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $$("[data-screen]").forEach(button =>
    button.addEventListener("click", () => showScreen(button.dataset.screen))
  );
  const requestedScreen = location.hash.slice(1);
  showScreen(document.getElementById(requestedScreen)?.classList.contains("screen") ? requestedScreen : "home");

  const photoModal = $("#photoModal");
  const largePhoto = $("#largePhoto");
  const photoCaption = $("#photoCaption");

  function closePhoto() {
    photoModal.hidden = true;
    largePhoto.removeAttribute("src");
  }

  $$(".photo").forEach(card => {
    const image = $("img", card);
    image.addEventListener("error", () => {
      image.alt = "Photo could not load — check the file in assets";
      image.style.objectFit = "contain";
      image.style.padding = "12px";
    });
    card.addEventListener("click", () => {
      largePhoto.onerror = () => {
        closePhoto();
        alert("This photo could not load. Check that its exact filename is inside the assets folder.");
      };
      largePhoto.src = card.dataset.photo;
      photoCaption.textContent = card.dataset.caption || "";
      photoModal.hidden = false;
      $("#closePhoto").focus();
    });
  });
  $("#closePhoto").addEventListener("click", closePhoto);
  photoModal.addEventListener("click", event => {
    if (event.target === photoModal) closePhoto();
  });

  const noteModal = $("#noteModal");
  $$(".envelope").forEach(envelope => envelope.addEventListener("click", () => {
    $("#noteText").textContent = envelope.dataset.note || "A little note, just for you. 💜";
    noteModal.hidden = false;
    $("#closeNote").focus();
    makeHearts(7);
  }));
  function closeNote() { noteModal.hidden = true; }
  $("#closeNote").addEventListener("click", closeNote);
  noteModal.addEventListener("click", event => {
    if (event.target === noteModal) closeNote();
  });

  function makeHearts(count) {
    const layer = $("#hearts");
    const symbols = ["♡", "♥", "✦", "✧"];
    for (let i = 0; i < count; i++) {
      const item = document.createElement("span");
      item.className = "heart";
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = `${8 + Math.random() * 84}%`;
      item.style.fontSize = `${14 + Math.random() * 18}px`;
      item.style.animationDelay = `${Math.random() * .5}s`;
      layer.appendChild(item);
      item.addEventListener("animationend", () => item.remove(), { once: true });
    }
  }
  $("#sparkle").addEventListener("click", () => makeHearts(22));

  const music = $("#music");
  const musicButton = $("#musicButton");
  music.addEventListener("error", () => {
    musicButton.textContent = "Music unavailable";
    musicButton.title = "Check that assets/music.mp3 exists and is a playable MP3 file.";
  });
  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicButton.textContent = "Pause music";
      } catch (error) {
        alert("Music could not play. Check that assets/music.mp3 is a valid audio file, then try again.");
      }
    } else {
      music.pause();
      musicButton.textContent = "Play music";
    }
  });
  music.addEventListener("ended", () => { musicButton.textContent = "Play music"; });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!noteModal.hidden) closeNote();
      if (!photoModal.hidden) closePhoto();
    }
  });
})();