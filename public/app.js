const message = document.getElementById('message');
const counter = document.getElementById('counter');
const analyze = document.getElementById('analyze');
const clear = document.getElementById('clear');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');
const result = document.getElementById('result');

const intent = document.getElementById('intent');
const tone = document.getElementById('tone');
const context = document.getElementById('context');
const replies = {
  friendly: document.getElementById('friendly'),
  direct: document.getElementById('direct'),
  professional: document.getElementById('professional')
};

message.addEventListener('input', () => {
  counter.textContent = `${message.value.length} / 5000`;
});

function showError(text) {
  errorBox.textContent = text;
  errorBox.classList.remove('hidden');
}

function setBusy(busy) {
  analyze.disabled = busy;
  clear.disabled = busy;
  analyze.textContent = busy ? 'Analyzing…' : 'Analyze message';
  loading.classList.toggle('hidden', !busy);
}

clear.addEventListener('click', () => {
  message.value = '';
  counter.textContent = '0 / 5000';
  errorBox.classList.add('hidden');
  result.classList.add('hidden');
  message.focus();
});

analyze.addEventListener('click', async () => {
  const value = message.value.trim();
  errorBox.classList.add('hidden');
  result.classList.add('hidden');
  if (!value) return showError('Paste a message first.');

  setBusy(true);
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong.');

    intent.textContent = data.intent;
    tone.textContent = data.tone;
    context.textContent = data.context;
    replies.friendly.textContent = data.friendly;
    replies.direct.textContent = data.direct;
    replies.professional.textContent = data.professional;
    result.classList.remove('hidden');
  } catch (error) {
    showError(error.message || 'Could not analyze the message.');
  } finally {
    setBusy(false);
  }
});

document.querySelectorAll('.copy').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = replies[button.dataset.key].textContent;
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = original; }, 1000);
    } catch {
      showError('Copy failed. You can select the reply manually.');
    }
  });
});
