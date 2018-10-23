var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var tipPara = document.querySelector('.tip');
var resultPara = document.querySelector('.result');
var phrase = 'que ce malin pouvoir, s\'en retourne à sa source noire';
var audio = new Audio('sound.ogg');
var restartTimeout;

function audioLoaded() {
  tipPara.textContent = "Lancez l'audio !";
}

function audioPlaying() {
  resultPara.textContent = "Le fantôme est derrière vous.";
  tipPara.textContent = "Arrêtez l'audio et tentez de chasser le fantôme !";
}

function startRecognition() {
  tipPara.textContent = "Tentez de chasser le fantôme en répétant le fomule de sortilège : '" + phrase + "'";
  
  var grammar = '#JSGF V1.0; grammar formulas; public <formula> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var startReg = function() { recognition.start(); };

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript;
    console.log('Speech received: ' + speechResult + '.');
    console.log(event.results);
    if(event.results[0][0].confidence > 0.7) {
      resultPara.textContent = 'Bravo ! Le fantôme est parti! Cliquez dans la page afin de relancer un test';
      resultPara.style.background = 'lime';
      window.addEventListener('click', startReg);
    } else {
      resultPara.textContent = 'Pas de formule reconnu, tentez de recommencer dans quelques instants...';
      resultPara.style.background = 'red';
      restartTimeout = window.setTimeout(startReg, 6000);
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
  }

  recognition.onerror = function(event) {
      resultPara.textContent = "Une erreur '" + event.error + "' est survenue. Cliquez dans la page afin de retenter";
      resultPara.style.background = 'red';
      window.addEventListener('click', startReg);
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
    console.log(event)
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
    console.log(event);
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      restartTimeout = undefined;
      resultPara.textContent = 'Ecoute en cours ...';
      window.removeEventListener('click', startReg);
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}
