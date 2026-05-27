function togglePlaybackRate(btn) {
  const audio = btn.previousElementSibling; // the <audio> tag
  if (audio.playbackRate === 1) {
    audio.playbackRate = 2;
    btn.textContent = "Play at 1x";
  } else {
    audio.playbackRate = 1;
    btn.textContent = "Play at 2x";
  }
}