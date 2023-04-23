let isBlindMode =
  localStorage.getItem("blindMode") !== null &&
  localStorage.getItem("blindMode") !== ""
    ? localStorage.getItem("blindMode")
    : false;

const modeBtn = document.getElementById("mode-btn");

function toggleBlindMode() {
  if (localStorage.getItem("blindMode") === "false") {
    BlindModeEnable();
  } else if (localStorage.getItem("blindMode") === "true") {
    BlindModeDisable();
  }
}

window.addEventListener("load", function () {
  if (isBlindMode == "true") {
    BlindModeEnable();
  } else {
    BlindModeDisable();
  }
});

function BlindModeEnable() {
  isBlindMode = true;
  localStorage.setItem("blindMode", isBlindMode);
  modeBtn.classList.remove("enabled");
  modeBtn.innerHTML = "Выключить"
  document.body.classList = "blind-mode";
}

function BlindModeDisable() {
  isBlindMode = false;
  localStorage.setItem("blindMode", isBlindMode);
  modeBtn.classList.add("enabled");
  modeBtn.innerHTML = "Включить"
  document.body.classList = "";
}

document.onmouseup =
  document.onkeyup =
  document.onselectionchange =
    function () {
      if (isBlindMode) speakText(window.getSelection().toString());
    };

function speakText(textS) {
  window.speechSynthesis.cancel();

  const text = textS;
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
