// ── Constantes ──────────────────────────────────────────────
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MORSE = {
  'A':'🟣➖','B':'➖🟣🟣🟣','C':'➖🟣➖🟣','D':'➖🟣🟣','E':'🟣',
  'F':'🟣🟣➖🟣','G':'➖➖🟣','H':'🟣🟣🟣🟣','I':'🟣🟣','J':'🟣➖➖➖',
  'K':'➖🟣➖','L':'🟣➖🟣🟣','M':'➖➖','N':'➖🟣','O':'➖➖➖',
  'P':'🟣➖➖🟣','Q':'➖➖🟣➖','R':'🟣➖🟣','S':'🟣🟣🟣','T':'➖',
  'U':'🟣🟣➖','V':'🟣🟣🟣➖','W':'🟣➖➖','X':'➖🟣🟣➖','Y':'➖🟣➖➖',
  'Z':'➖➖🟣🟣',
  '0':'➖➖➖➖➖','1':'🟣➖➖➖➖','2':'🟣🟣➖➖➖','3':'🟣🟣🟣➖➖',
  '4':'🟣🟣🟣🟣➖','5':'🟣🟣🟣🟣🟣','6':'➖🟣🟣🟣🟣','7':'➖➖🟣🟣🟣',
  '8':'➖➖➖🟣🟣','9':'➖➖➖➖🟣',
  '.':'🟣➖🟣➖🟣➖',',':'➖➖🟣🟣➖➖','?':'🟣🟣➖➖🟣🟣','!':'➖🟣➖🟣➖➖',
  '/':'➖🟣🟣➖🟣','@':'🟣➖➖🟣➖🟣',
  'É':'🟣🟣➖🟣🟣','È':'🟣➖🟣🟣➖','À':'🟣➖➖🟣',
  'Ä':'🟣➖🟣➖','Ü':'🟣🟣➖➖','Ö':'➖➖➖🟣','Ç':'➖🟣🟣🟣🟣',
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v])=>[v,k]));
const { ipcRenderer } = require('electron');

ipcRenderer.on('open-settings', () => {
  openSettings();
});
const iframe=document.querySelector("iframe");
document.AddEventListener("DOMContentLoaded",() => {
  iframe.hidden=true;
});
function openSettings() {
  iframe.hidden=false;
  document.querySelector("main").hidden=true;
  document.querySelector("nav").hidden=true
};
document.getElementById("close").addEventListener("click",closeSettings);
function closeSettings() {
  document.querySelector("main").hidden=false;
  document.querySelector("nav").hidden=false;
  iframe.hidden=true;
};
// ── Onglets ──────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ── Copier ───────────────────────────────────────────────────
function copyOutput(id) {
  const el = document.getElementById(id);
  const text = el.value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = el.closest('.io-col').querySelector('.copy-btn');
    const orig = btn.textContent;
    btn.textContent = '✓ Copié !';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
  });
}

// ── MORSE ────────────────────────────────────────────────────
let morseMode = 'encode';

function setMorseMode(mode) {
  morseMode = mode;
  document.getElementById('morse-encode-btn').classList.toggle('active', mode === 'encode');
  document.getElementById('morse-decode-btn').classList.toggle('active', mode === 'decode');
  document.getElementById('morse-input').value = '';
  document.getElementById('morse-output').value = '';
}

function runMorse() {
  const input = document.getElementById('morse-input').value;
  document.getElementById('morse-output').value =
    morseMode === 'encode' ? textToMorse(input) : morseToText(input);
}

function textToMorse(text) {
  return text.toUpperCase().split(' ').map(word => {
    return [...word].filter(c => MORSE[c]).map(c => MORSE[c]).join('/');
  }).join('//');
}

function morseToText(code) {
  return code.split('//').map(word => {
    return word.split('/').filter(Boolean).map(s => REVERSE_MORSE[s] || '?').join('');
  }).join(' ');
}

function insertMorse(char) {
  const el = document.getElementById('morse-input');
  const pos = el.selectionStart;
  el.value = el.value.slice(0, pos) + char + el.value.slice(pos);
  el.selectionStart = el.selectionEnd = pos + char.length;
  el.focus();
  runMorse();
}

// ── VIGENÈRE ─────────────────────────────────────────────────
let vigMode = 'encode';

function setVigMode(mode) {
  vigMode = mode;
  document.getElementById('vig-encode-btn').classList.toggle('active', mode === 'encode');
  document.getElementById('vig-decode-btn').classList.toggle('active', mode === 'decode');
  runVigenere();
}

function runVigenere() {
  const text = document.getElementById('vig-input').value;
  const key  = document.getElementById('vig-key').value;
  if (!key.trim()) { document.getElementById('vig-output').value = ''; return; }
  document.getElementById('vig-output').value =
    vigMode === 'encode' ? vigenereEncode(text, key) : vigenereDecode(text, key);
}

function vigenereEncode(text, key) {
  const t = text.toUpperCase().replace(/[^A-Z]/g, '');
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return '';
  return [...t].map((c, i) => {
    const shift = ALPHABET.indexOf(k[i % k.length]);
    return ALPHABET[(ALPHABET.indexOf(c) + shift) % 26];
  }).join('');
}

function vigenereDecode(code, key) {
  const t = code.toUpperCase().replace(/[^A-Z]/g, '');
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return '';
  return [...t].map((c, i) => {
    const shift = ALPHABET.indexOf(k[i % k.length]);
    return ALPHABET[((ALPHABET.indexOf(c) - shift) + 26) % 26];
  }).join('');
}

// ── AVOCAT ───────────────────────────────────────────────────
let avocatMode = 'encode';

function setAvocatMode(mode) {
  avocatMode = mode;
  document.getElementById('av-encode-btn').classList.toggle('active', mode === 'encode');
  document.getElementById('av-decode-btn').classList.toggle('active', mode === 'decode');
  runAvocat();
}

function runAvocat() {
  const text = document.getElementById('av-input').value;
  document.getElementById('av-output').value = translateAvocat(text, avocatMode);
}

function translateAvocat(text, dir) {
  return text.toUpperCase().split('').map(c => {
    const i = ALPHABET.indexOf(c);
    if (i === -1) return c;
    return dir === 'encode' ? ALPHABET[(i + 10) % 26] : ALPHABET[((i - 10) + 26) % 26];
  }).join('');
}

// ── CÉSAR ────────────────────────────────────────────────────
let caesarMode = 'encode';

function setCaesarMode(mode) {
  caesarMode = mode;
  document.getElementById('cs-encode-btn').classList.toggle('active', mode === 'encode');
  document.getElementById('cs-decode-btn').classList.toggle('active', mode === 'decode');
  runCaesar();
}

function runCaesar() {
  const text  = document.getElementById('cs-input').value;
  const shift = parseInt(document.getElementById('caesar-shift').value);
  document.getElementById('cs-output').value = caesarCipher(text, shift, caesarMode);
}

function caesarCipher(text, shift, dir) {
  return text.toUpperCase().split('').map(c => {
    const i = ALPHABET.indexOf(c);
    if (i === -1) return c;
    const s = dir === 'encode' ? shift : (26 - shift);
    return ALPHABET[(i + s) % 26];
  }).join('');
}

// ── ROT13 ────────────────────────────────────────────────────
function runRot13() {
  const text = document.getElementById('rot-input').value;
  document.getElementById('rot-output').value = text.split('').map(c => {
    const i = ALPHABET.indexOf(c.toUpperCase());
    if (i === -1) return c;
    const r = ALPHABET[(i + 13) % 26];
    return c === c.toUpperCase() ? r : r.toLowerCase();
  }).join('');
}

// ── BINAIRE ──────────────────────────────────────────────────
let binMode = 'encode';

function setBinMode(mode) {
  binMode = mode;
  document.getElementById('bin-encode-btn').classList.toggle('active', mode === 'encode');
  document.getElementById('bin-decode-btn').classList.toggle('active', mode === 'decode');
  runBinary();
}

function runBinary() {
  const input = document.getElementById('bin-input').value;
  try {
    document.getElementById('bin-output').value =
      binMode === 'encode'
        ? [...input].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
        : input.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
  } catch {
    document.getElementById('bin-output').value = '[Entrée invalide]';
  }
}
