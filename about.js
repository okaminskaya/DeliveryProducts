let isBlindMode =
  localStorage.getItem("blindMode") !== null &&
  localStorage.getItem("blindMode") !== ""
    ? localStorage.getItem("blindMode")
    : false;

const logo = document.getElementById("logo");

function BlindModeEnable() {
  isBlindMode = true;
  localStorage.setItem("blindMode", isBlindMode);
  document.body.classList = "blind-mode";
  logo.style.display = "none";
  logo.style.width = "0";
  logo.style.height = "0";
  logo.style.margin = "0";
}

function BlindModeDisable() {
  isBlindMode = false;
  localStorage.setItem("blindMode", isBlindMode);
  document.body.classList = "";
  logo.style.display = "block";
  logo.style.width = "300px";
  logo.style.height = "350px";
  logo.style.margin = "20px";
}

window.addEventListener("load", function () {
  if (isBlindMode == "true") {
    BlindModeEnable();
  } else {
    BlindModeDisable();
  }
});

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
