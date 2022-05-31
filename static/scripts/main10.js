const keys = document.querySelectorAll(".key"),
  note = document.querySelector(".nowplaying"),
  hints = document.querySelectorAll(".hints");

function playNote(e) {
  if(e.keyCode!= 83 && e.keyCode!= 72 && e.keyCode!= 85 && e.keyCode!= 71 && e.keyCode!= 87){
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
    audio.currentTime = 0;
    audio.play();
  }
  
    var key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    var inputTextVar = document.querySelector("#submit-input");

  if (!key) return;

  const keyNote = key.getAttribute("data-note");

  key.classList.add("playing");
  inputTextVar.value+=keyNote
  
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

function hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}

hints.forEach(hintsOn);

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

window.addEventListener("keydown", playNote);