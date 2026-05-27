// pubpodaudiocontrol.js

document.addEventListener("DOMContentLoaded", () => {
  const formatTime = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  function initPlayer(card) {
    const audio = card.querySelector(".custom-audio");
    const playBtn = card.querySelector(".play-btn");
    const speedBtn = card.querySelector(".speed-btn");
    const track = card.querySelector(".progress-track");
    const fill = card.querySelector(".progress-fill");
    const marker = card.querySelector(".hover-marker");
    const curEl = card.querySelector(".current-time");
    const totalEl = card.querySelector(".total-time");

    // Show total duration once metadata is loaded
    const setTotal = () => {
      if (isFinite(audio.duration)) {
        totalEl.textContent = formatTime(audio.duration);
      }
    };
    audio.readyState >= 1 ? setTotal() : audio.addEventListener("loadedmetadata", setTotal);

    // Smooth progress update
    function update() {
      if (isFinite(audio.duration) && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + "%";
        curEl.textContent = formatTime(audio.currentTime);
      }
      if (!audio.paused && !audio.ended) requestAnimationFrame(update);
    }

    // Play/Pause button
    playBtn.addEventListener("click", () => {
      // Pause all other audios
      document.querySelectorAll(".custom-audio").forEach((a) => {
        if (a !== audio) {
          a.pause();
          const b = a.closest(".publication-card")?.querySelector(".play-btn");
          if (b) b.textContent = "▶︎";
        }
      });

      if (audio.paused) {
        audio.play();
        playBtn.textContent = "❚❚";
        requestAnimationFrame(update);
      } else {
        audio.pause();
        playBtn.textContent = "▶︎";
      }
    });

    // Keep progress synced
    audio.addEventListener("timeupdate", update);

    // Reset when audio ends
    audio.addEventListener("ended", () => {
      playBtn.textContent = "▶︎";
      fill.style.width = "0%";
      curEl.textContent = "0:00";
    });

    // Click-to-seek
    track.addEventListener("click", (e) => {
      if (!isFinite(audio.duration) || audio.duration === 0) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      audio.currentTime = pct * audio.duration;
      fill.style.width = pct * 100 + "%";
      curEl.textContent = formatTime(audio.currentTime);
    });

    // Hover marker
    track.addEventListener("mousemove", (e) => {
      const rect = track.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      marker.style.left = (x - 4) + "px"; // center the 8px line
      marker.style.opacity = "1";
    });
    track.addEventListener("mouseleave", () => {
      marker.style.opacity = "0";
    });

    // Speed toggle
    speedBtn.addEventListener("click", () => {
      if (audio.playbackRate === 1) {
        audio.playbackRate = 2;
        speedBtn.textContent = "1x";
      } else {
        audio.playbackRate = 1;
        speedBtn.textContent = "2x";
      }
    });
  }

  // Initialize all players
  document.querySelectorAll(".publication-card").forEach(initPlayer);
});
