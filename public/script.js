const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
const audio = document.querySelector("#audio");
const playButton = document.querySelector("#play-button");
const repeatButton = document.querySelector("#repeat-button");
const playbackStatus = document.querySelector("#playback-status");
const volume = document.querySelector("#volume");

function activateTab(selectedTab, moveFocus = false) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== selectedTab.getAttribute("aria-controls");
  });

  if (moveFocus) selectedTab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    activateTab(tabs[nextIndex], true);
  });
});

audio.loop = true;
audio.volume = Number(volume.value);
repeatButton.setAttribute("aria-pressed", String(audio.loop));

function updatePlaybackState() {
  const isPlaying = !audio.paused;
  playButton.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-pressed", String(isPlaying));
  playButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproduzir música");
}

function showPlaybackError(message, error) {
  playbackStatus.textContent = message;
  playbackStatus.hidden = false;

  if (error) console.error("Erro no player de música.", error);
}

function clearPlaybackError() {
  playbackStatus.textContent = "";
  playbackStatus.hidden = true;
}

playButton.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }

  clearPlaybackError();

  try {
    await audio.play();
  } catch (error) {
    const errorName = error && typeof error === "object" && "name" in error
      ? error.name
      : "";
    const message = errorName === "NotAllowedError"
      ? "O navegador bloqueou a reprodução. Verifique as permissões e tente novamente."
      : "Não foi possível reproduzir music.mp3. Verifique o arquivo em public/music.mp3 e seu formato.";
    showPlaybackError(message, error);
  }
});

repeatButton.addEventListener("click", () => {
  audio.loop = !audio.loop;
  repeatButton.classList.toggle("is-active", audio.loop);
  repeatButton.setAttribute("aria-pressed", String(audio.loop));
  repeatButton.setAttribute("aria-label", audio.loop ? "Repetição ativada" : "Repetição desativada");
});

audio.addEventListener("play", updatePlaybackState);
audio.addEventListener("pause", updatePlaybackState);
audio.addEventListener("ended", updatePlaybackState);
audio.addEventListener("error", () => {
  showPlaybackError(
    "Não foi possível carregar music.mp3. Verifique se existe em public/music.mp3 e se o formato é válido.",
    audio.error,
  );
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});
