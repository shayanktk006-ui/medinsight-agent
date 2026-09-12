let selectedFile = null;
const drop = document.getElementById('drop');
const fileInput = document.getElementById('fileInput');
const askBtn = document.getElementById('askBtn');
const micBtn = document.getElementById('micBtn');
const questionInput = document.getElementById('question');
const answerBox = document.getElementById('answerBox');
const answerText = document.getElementById('answerText');
const speakBtn = document.getElementById('speakBtn');

drop.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if(fileInput.files[0]){
    selectedFile = fileInput.files[0];
    drop.textContent = "✅ " + selectedFile.name;
    drop.classList.add('active');
  }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener('click', () => {
    if (isListening) return; // prevent double-start
    try {
      recognition.start();
    } catch (err) {
      console.error('Mic start failed:', err);
    }
  });

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
  };

  recognition.onresult = (e) => {
    questionInput.value = e.results[0][0].transcript;
  };

  recognition.onerror = (e) => {
    console.error('Speech recognition error:', e.error);
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      alert('Please allow microphone permission in your browser settings.');
    } else if (e.error === 'no-speech') {
      alert('No speech detected. Please try again.');
    } else if (e.error === 'network') {
      alert('Check your internet connection — voice recognition needs network access.');
    }
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
  };
} else {
  micBtn.disabled = true;
}

speakBtn.addEventListener('click', () => {
  // Clear any pending/ongoing speech before starting a new one
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }

  const utter = new SpeechSynthesisUtterance(answerText.textContent);

  utter.onstart = () => {
    speakBtn.disabled = true;
    speakBtn.textContent = '⏸ Speaking...';
  };

  utter.onend = () => {
    speakBtn.disabled = false;
    speakBtn.textContent = '🔊 Listen';
  };

  utter.onerror = () => {
    speakBtn.disabled = false;
    speakBtn.textContent = '🔊 Listen';
  };

  speechSynthesis.speak(utter);
});

askBtn.addEventListener('click', async () => {
  if(!selectedFile || !questionInput.value.trim()) return;
  askBtn.disabled = true;
  askBtn.textContent = "Thinking...";
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('question', questionInput.value);
  try{
    const res = await fetch('/explain', { method: 'POST', body: formData });
    const data = await res.json();
    answerText.textContent = data.answer;
    answerBox.style.display = 'block';
  } catch(err){
    answerText.textContent = "Something went wrong. Please try again.";
    answerBox.style.display = 'block';
  } finally {
    askBtn.disabled = false;
    askBtn.textContent = "Explain it";
  }
});
