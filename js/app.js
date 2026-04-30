// ══════════════════════════════════════
// Falling Petals
// ══════════════════════════════════════
const PETAL_COLORS = ['#ffb6c1','#ffd6e0','#99f6e4','#ccfbf1','#c4b5fd','#fde68a'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.left = Math.random() * 100 + '%';
  petal.style.width = (Math.random() * 8 + 8) + 'px';
  petal.style.height = petal.style.width;
  petal.style.background = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 10000);
}

setInterval(createPetal, 800);

// ══════════════════════════════════════
// Navigation
// ══════════════════════════════════════
const tabs = document.querySelectorAll('.nav-tab');
const pages = document.querySelectorAll('.page');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.page;
    tabs.forEach(t => t.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`page-${target}`).classList.add('active');

    if (target === 'photo') initCamera();
    if (target === 'video') loadVideo();
  });
});

// ══════════════════════════════════════
// Countdown
// ══════════════════════════════════════
const BIRTHDAY = new Date('2026-05-03T00:00:00');
let isBirthday = false;

function updateCountdown() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const bday = new Date(BIRTHDAY);

  if (now.getFullYear() === 2026 && now.getMonth() === 4 && now.getDate() === 3) {
    if (!isBirthday) {
      isBirthday = true;
      showBirthdayMode();
    }
    return;
  }

  const diff = bday - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent = '0';
    document.getElementById('cd-secs').textContent = '0';
    document.getElementById('cd-dday').textContent = '생일이 지났어요!';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');

  const dday = Math.ceil((bday - today) / (1000 * 60 * 60 * 24));
  document.getElementById('cd-dday').textContent = `D-${dday}`;
}

function showBirthdayMode() {
  const area = document.getElementById('countdown-area');
  area.classList.add('birthday-mode');
  area.innerHTML = `
    <div class="countdown-emoji" style="font-size:88px">🎉</div>
    <h1 class="countdown-title">상민님 생일 축하해요!</h1>
    <p class="birthday-msg">
      오늘은 상민님의 특별한 날!<br>
      행복한 하루 보내세요 🎂🎈
    </p>
    <div style="margin-top:36px">
      <div class="countdown-dday" style="font-size:22px;">
        🎊 D-DAY 🎊
      </div>
    </div>
  `;
  startConfetti();
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ══════════════════════════════════════
// Confetti
// ══════════════════════════════════════
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

const CONFETTI_COLORS = [
  '#14b8a6', '#5eead4', '#f472b6', '#fb923c',
  '#a78bfa', '#60a5fa', '#facc15', '#34d399',
  '#f87171', '#c084fc'
];

function createConfettiPiece() {
  return {
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * -confettiCanvas.height,
    w: Math.random() * 10 + 6,
    h: Math.random() * 6 + 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 8,
    speedY: Math.random() * 2 + 1.5,
    speedX: (Math.random() - 0.5) * 2,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.05 + 0.02,
  };
}

function animateConfetti() {
  if (!confettiRunning) return;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  if (confettiPieces.length < 150) {
    for (let i = 0; i < 3; i++) confettiPieces.push(createConfettiPiece());
  }

  confettiPieces.forEach((p, i) => {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.wobble) * 0.5;
    p.wobble += p.wobbleSpeed;
    p.rotation += p.rotSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    if (p.y > confettiCanvas.height + 20) {
      confettiPieces[i] = createConfettiPiece();
    }
  });

  requestAnimationFrame(animateConfetti);
}

function startConfetti() {
  confettiRunning = true;
  confettiPieces = [];
  animateConfetti();
}

// ══════════════════════════════════════
// Firebase Setup
// ══════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyCUJlpEcG7Eo8V4ONJvOG2FwVlwoahnxcg",
  authDomain: "hbd-sangmin.firebaseapp.com",
  projectId: "hbd-sangmin",
  storageBucket: "hbd-sangmin.firebasestorage.app",
  messagingSenderId: "991634938597",
  appId: "1:991634938597:web:1249191a134625d788520c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const photosCollection = db.collection('photos');

async function savePhotoFirebase(dataUrl, stamp) {
  const id = Date.now().toString();
  let finalUrl = dataUrl;
  if (dataUrl.length > 800000) {
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = dataUrl; });
    const scale = 0.5;
    tmpCanvas.width = img.width * scale;
    tmpCanvas.height = img.height * scale;
    tmpCtx.drawImage(img, 0, 0, tmpCanvas.width, tmpCanvas.height);
    finalUrl = tmpCanvas.toDataURL('image/jpeg', 0.5);
  }
  await photosCollection.doc(id).set({
    src: finalUrl,
    date: stamp,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return { id, src: finalUrl, date: stamp };
}

async function loadAllPhotos() {
  const snapshot = await photosCollection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, src: doc.data().src, date: doc.data().date }));
}

async function deletePhotoFirebase(id) {
  await photosCollection.doc(id).delete();
}

// ══════════════════════════════════════
// Rolling Paper
// ══════════════════════════════════════
const colorClasses = ['color-1','color-2','color-3','color-4','color-5','color-6'];
const fontClasses = ['font-1', 'font-2', 'font-3'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const messagesCollection = db.collection('messages');
let firestoreMessages = [];

async function loadFirestoreMessages() {
  try {
    const snapshot = await messagesCollection.orderBy('createdAt', 'desc').get();
    firestoreMessages = snapshot.docs.map(doc => ({
      id: doc.id,
      emoji: doc.data().emoji || '💌',
      msg: doc.data().msg || '',
      from: doc.data().from || '',
      drawingUrl: doc.data().drawingUrl || '',
      isFirestore: true
    }));
  } catch (e) { console.error('Messages load error:', e); }
}

let currentCards = [];

function renderRollingPaper() {
  const grid = document.getElementById('rolling-grid');
  currentCards = shuffle([...firestoreMessages]);
  grid.innerHTML = currentCards.map((m, i) => {
    const color = colorClasses[i % colorClasses.length];
    const font = fontClasses[Math.floor(Math.random() * fontClasses.length)];
    const content = m.drawingUrl
      ? `<img class="card-drawing" src="${m.drawingUrl}" alt="drawing">`
      : `<div class="card-emoji">${m.emoji}</div><div class="card-msg">${m.msg}</div>`;
    return `
    <div class="rolling-card ${color} ${font}" data-idx="${i}">
      ${content}
      ${m.from ? `<div class="card-from">- ${m.from}</div>` : ''}
    </div>`;
  }).join('');

  grid.querySelectorAll('.rolling-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx);
      openRollingPopup(currentCards[idx], card);
    });
  });
}

let currentPopupMsg = null;

function openRollingPopup(m, cardEl) {
  currentPopupMsg = m;
  const overlay = document.getElementById('rolling-popup');
  const popupCard = document.getElementById('rolling-popup-card');
  var emojiEl = document.getElementById('rolling-popup-emoji');
  var msgEl = document.getElementById('rolling-popup-msg');
  if (m.drawingUrl) {
    emojiEl.innerHTML = '';
    msgEl.innerHTML = '<img class="card-drawing" src="' + m.drawingUrl + '" alt="drawing">';
  } else {
    emojiEl.textContent = m.emoji;
    msgEl.textContent = m.msg;
  }
  const fromEl = document.getElementById('rolling-popup-from');
  fromEl.textContent = m.from ? `- ${m.from}` : '';
  fromEl.style.display = m.from ? 'block' : 'none';
  const colorMatch = cardEl.className.match(/color-\d/);
  const fontMatch = cardEl.className.match(/font-\d/);
  popupCard.className = 'rolling-popup-card';
  if (colorMatch) popupCard.classList.add(colorMatch[0]);
  if (fontMatch) popupCard.classList.add(fontMatch[0]);
  const editActions = document.getElementById('popup-edit-actions');
  editActions.style.display = m.isFirestore ? 'flex' : 'none';
  overlay.classList.add('show');
}

function closeRollingPopup() {
  document.getElementById('rolling-popup').classList.remove('show');
  currentPopupMsg = null;
}

document.getElementById('rolling-popup-close').addEventListener('click', closeRollingPopup);
document.getElementById('rolling-popup').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeRollingPopup();
});

// Edit message
document.getElementById('btn-popup-edit').addEventListener('click', () => {
  if (!currentPopupMsg || !currentPopupMsg.isFirestore) return;
  const pw = prompt('비밀번호를 입력하세요:');
  if (pw !== '0503') { alert('비밀번호가 틀렸습니다.'); return; }
  closeRollingPopup();
  document.getElementById('write-name').value = currentPopupMsg.from || '';
  document.getElementById('write-msg').value = currentPopupMsg.msg || '';
  const row = document.getElementById('write-emoji-row');
  row.querySelectorAll('.write-emoji-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.emoji === currentPopupMsg.emoji);
  });
  selectedEmoji = currentPopupMsg.emoji;
  editingMessageId = currentPopupMsg.id;
  document.getElementById('write-overlay').classList.add('show');
});

// Delete message
document.getElementById('btn-popup-delete').addEventListener('click', async () => {
  if (!currentPopupMsg || !currentPopupMsg.isFirestore) return;
  const pw = prompt('비밀번호를 입력하세요:');
  if (pw !== '0503') { alert('비밀번호가 틀렸습니다.'); return; }
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    await messagesCollection.doc(currentPopupMsg.id).delete();
    firestoreMessages = firestoreMessages.filter(m => m.id !== currentPopupMsg.id);
    renderRollingPaper();
    closeRollingPopup();
    alert('삭제되었습니다.');
  } catch (e) {
    console.error('Delete error:', e);
    alert('삭제에 실패했어요: ' + e.message);
  }
});

// Write Message
const writeEmojis = ['🎉','🎂','🎈','💐','🥳','✨','💌','☀️','🌟','🎁','🍰','❤️','🫶','🧁'];
let selectedEmoji = writeEmojis[0];
let editingMessageId = null;

(function initEmojiRow() {
  const row = document.getElementById('write-emoji-row');
  row.innerHTML = writeEmojis.map((e, i) =>
    `<button class="write-emoji-btn${i === 0 ? ' selected' : ''}" data-emoji="${e}">${e}</button>`
  ).join('');
  row.querySelectorAll('.write-emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('.write-emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEmoji = btn.dataset.emoji;
    });
  });
})();

function openWriteModal() {
  editingMessageId = null;
  document.getElementById('write-name').value = '';
  document.getElementById('write-msg').value = '';
  const row = document.getElementById('write-emoji-row');
  row.querySelectorAll('.write-emoji-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === 0);
  });
  selectedEmoji = writeEmojis[0];
  document.getElementById('write-overlay').classList.add('show');
}

function closeWriteModal() {
  document.getElementById('write-overlay').classList.remove('show');
}

document.getElementById('write-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeWriteModal();
});

document.getElementById('btn-write-submit').addEventListener('click', async () => {
  const name = document.getElementById('write-name').value.trim();
  const msg = document.getElementById('write-msg').value.trim();
  if (!msg) { alert('메시지를 입력해주세요!'); return; }
  if (!name) { alert('이름을 입력해주세요!'); return; }

  const btn = document.getElementById('btn-write-submit');
  btn.textContent = '저장 중...';
  btn.disabled = true;

  try {
    if (editingMessageId) {
      await messagesCollection.doc(editingMessageId).update({ emoji: selectedEmoji, msg: msg, from: name });
      const idx = firestoreMessages.findIndex(m => m.id === editingMessageId);
      if (idx !== -1) {
        firestoreMessages[idx] = { ...firestoreMessages[idx], emoji: selectedEmoji, msg: msg, from: name };
      }
      editingMessageId = null;
      renderRollingPaper();
      closeWriteModal();
      alert('메시지가 수정되었어요! ✏️');
    } else {
      const docRef = await messagesCollection.add({
        emoji: selectedEmoji, msg: msg, from: name,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      firestoreMessages.unshift({ id: docRef.id, emoji: selectedEmoji, msg: msg, from: name, isFirestore: true });
      renderRollingPaper();
      closeWriteModal();
      alert('메시지가 등록되었어요! 🎉');
    }
  } catch (e) {
    console.error('Save error:', e);
    alert('저장에 실패했어요: ' + e.message);
  } finally {
    btn.textContent = '남기기';
    btn.disabled = false;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('rolling-popup').classList.remove('show');
    closeWriteModal();
  }
});

// Load messages
document.getElementById('rolling-grid').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-500);">메시지를 불러오는 중...</div>';
loadFirestoreMessages().then(() => { renderRollingPaper(); });

// ══════════════════════════════════════
// Photo Booth
// ══════════════════════════════════════
const video = document.getElementById('camera-video');
const photoCanvas = document.getElementById('photo-canvas');
const btnCapture = document.getElementById('btn-capture');
const btnToggle = document.getElementById('btn-camera-toggle');
const galleryGrid = document.getElementById('gallery-grid');
const previewPopup = document.getElementById('photo-preview');
const previewImg = document.getElementById('preview-img');
const btnDownload = document.getElementById('btn-download');
const btnClosePreview = document.getElementById('btn-close-preview');

let cameraStream = null;
let photos = [];

(async function() {
  try { photos = await loadAllPhotos(); renderGallery(); }
  catch (e) { console.error('DB load error:', e); }
})();

async function initCamera() {
  if (cameraStream) return;
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = cameraStream;
    btnToggle.textContent = '카메라 끄기';
  } catch (err) {
    console.error('Camera error:', err);
    btnToggle.textContent = '카메라 켜기';
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    video.srcObject = null;
    btnToggle.textContent = '카메라 켜기';
  }
}

btnToggle.addEventListener('click', () => {
  if (cameraStream) stopCamera();
  else initCamera();
});

btnCapture.addEventListener('click', async () => {
  if (!cameraStream) { initCamera(); return; }

  const flash = document.createElement('div');
  flash.className = 'flash-effect';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 400);

  const pCtx = photoCanvas.getContext('2d');
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;
  pCtx.translate(photoCanvas.width, 0);
  pCtx.scale(-1, 1);
  pCtx.drawImage(video, 0, 0);

  const now = new Date();
  const stamp = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  pCtx.setTransform(1, 0, 0, 1, 0, 0);
  pCtx.fillStyle = 'rgba(255,255,255,0.7)';
  pCtx.font = `${Math.round(photoCanvas.width * 0.03)}px 'Noto Sans KR', sans-serif`;
  pCtx.textAlign = 'right';
  pCtx.fillText(stamp, photoCanvas.width - 20, photoCanvas.height - 20);

  pCtx.fillStyle = 'rgba(20, 184, 166, 0.3)';
  pCtx.font = `bold ${Math.round(photoCanvas.width * 0.025)}px 'Noto Sans KR', sans-serif`;
  pCtx.fillText('HBD 상민 🎂', photoCanvas.width - 20, photoCanvas.height - 50);

  const dataUrl = photoCanvas.toDataURL('image/jpeg', 0.7);
  openPhotoEditor(dataUrl, stamp);
});

// ══════════════════════════════════════
// Photo Editor (Sticker Decoration)
// ══════════════════════════════════════
const PHOTO_STICKERS = [
  'balloon1.png','balloon3.png','party_balloon.png','gift.png','confetti.png',
  'ribbon.png','ribbon2.png','medal.png','trophy.png','sparkle2.png',
  'sparkle3.png','pencil.png','megaphone.png','megaphone2.png'
];

const whiteStickerCache = {};

function loadWhiteSticker(name) {
  return new Promise((resolve, reject) => {
    if (whiteStickerCache[name]) { resolve(whiteStickerCache[name]); return; }
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth > 0 ? img.naturalWidth : 200;
        const h = img.naturalHeight > 0 ? img.naturalHeight : 200;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        const whiteImg = new Image();
        whiteImg.onload = () => { whiteStickerCache[name] = whiteImg; resolve(whiteImg); };
        whiteImg.onerror = reject;
        whiteImg.src = c.toDataURL('image/png');
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = 'img/stickers/' + name;
  });
}

// Preload white versions
PHOTO_STICKERS.forEach(name => { loadWhiteSticker(name).catch(() => {}); });

const photoEditor = {
  baseDataUrl: '',
  stamp: '',
  stickers: [],
  drag: null
};

function openPhotoEditor(dataUrl, stamp) {
  photoEditor.baseDataUrl = dataUrl;
  photoEditor.stamp = stamp;
  photoEditor.stickers = [];
  document.getElementById('photo-editor-img').src = dataUrl;
  document.getElementById('photo-editor-stickers').innerHTML = '';
  document.getElementById('photo-editor').classList.add('show');
}

function closePhotoEditor() {
  document.getElementById('photo-editor').classList.remove('show');
  photoEditor.stickers = [];
  photoEditor.baseDataUrl = '';
}

function renderPlacedStickers() {
  const container = document.getElementById('photo-editor-stickers');
  container.innerHTML = photoEditor.stickers.map(s => `
    <div class="placed-sticker" data-id="${s.id}" style="left:${s.x}px;top:${s.y}px;width:${s.size}px;height:${s.size}px;">
      <img src="img/stickers/${s.name}" alt="sticker">
      <button class="sticker-delete" type="button">×</button>
      <div class="sticker-resize"></div>
    </div>
  `).join('');
  container.querySelectorAll('.placed-sticker').forEach(attachStickerHandlers);
}

function attachStickerHandlers(el) {
  const id = el.dataset.id;

  el.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('sticker-delete')) {
      e.stopPropagation();
      photoEditor.stickers = photoEditor.stickers.filter(s => s.id !== id);
      renderPlacedStickers();
      return;
    }
    const sticker = photoEditor.stickers.find(s => s.id === id);
    if (!sticker) return;
    const isResize = e.target.classList.contains('sticker-resize');

    // Bring to top
    el.parentElement.appendChild(el);
    photoEditor.stickers = photoEditor.stickers.filter(s => s.id !== id);
    photoEditor.stickers.push(sticker);

    photoEditor.drag = {
      id, mode: isResize ? 'resize' : 'move',
      startX: e.clientX, startY: e.clientY,
      origX: sticker.x, origY: sticker.y, origSize: sticker.size
    };
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  el.addEventListener('pointermove', (e) => {
    if (!photoEditor.drag || photoEditor.drag.id !== id) return;
    const sticker = photoEditor.stickers.find(s => s.id === id);
    if (!sticker) return;
    const dx = e.clientX - photoEditor.drag.startX;
    const dy = e.clientY - photoEditor.drag.startY;
    if (photoEditor.drag.mode === 'move') {
      sticker.x = photoEditor.drag.origX + dx;
      sticker.y = photoEditor.drag.origY + dy;
      el.style.left = sticker.x + 'px';
      el.style.top = sticker.y + 'px';
    } else {
      const newSize = Math.max(30, photoEditor.drag.origSize + (dx + dy) / 2);
      sticker.size = newSize;
      el.style.width = newSize + 'px';
      el.style.height = newSize + 'px';
    }
  });

  const endDrag = () => {
    if (photoEditor.drag && photoEditor.drag.id === id) {
      photoEditor.drag = null;
    }
  };
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);
}

function addStickerToPhoto(name) {
  const stage = document.getElementById('photo-editor-stage');
  const rect = stage.getBoundingClientRect();
  const size = Math.min(80, rect.width * 0.2);
  photoEditor.stickers.push({
    id: 'st-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    name: name,
    x: rect.width / 2 - size / 2,
    y: rect.height / 2 - size / 2,
    size: size
  });
  renderPlacedStickers();
}

(function initPhotoStickerPalette() {
  const palette = document.getElementById('photo-sticker-palette');
  palette.innerHTML = PHOTO_STICKERS.map(name =>
    `<button class="photo-sticker-btn" type="button" data-sticker="${name}"><img src="img/stickers/${name}" alt="sticker"></button>`
  ).join('');
  palette.querySelectorAll('.photo-sticker-btn').forEach(btn => {
    btn.addEventListener('click', () => addStickerToPhoto(btn.dataset.sticker));
  });
})();

async function composePhotoWithStickers() {
  const baseImg = new Image();
  await new Promise((resolve, reject) => {
    baseImg.onload = resolve;
    baseImg.onerror = reject;
    baseImg.src = photoEditor.baseDataUrl;
  });
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = baseImg.naturalWidth;
  finalCanvas.height = baseImg.naturalHeight;
  const fctx = finalCanvas.getContext('2d');
  fctx.drawImage(baseImg, 0, 0);

  if (photoEditor.stickers.length > 0) {
    const stage = document.getElementById('photo-editor-stage');
    const rect = stage.getBoundingClientRect();
    const ratioX = baseImg.naturalWidth / rect.width;
    const ratioY = baseImg.naturalHeight / rect.height;

    for (const s of photoEditor.stickers) {
      const whiteImg = await loadWhiteSticker(s.name);
      const dx = s.x * ratioX;
      const dy = s.y * ratioY;
      const dw = s.size * ratioX;
      const dh = s.size * ratioY;
      fctx.drawImage(whiteImg, dx, dy, dw, dh);
    }
  }

  let dataUrl = finalCanvas.toDataURL('image/jpeg', 0.7);
  if (dataUrl.length > 800000) {
    const tmpCanvas = document.createElement('canvas');
    const scale = 0.7;
    tmpCanvas.width = finalCanvas.width * scale;
    tmpCanvas.height = finalCanvas.height * scale;
    tmpCanvas.getContext('2d').drawImage(finalCanvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
    dataUrl = tmpCanvas.toDataURL('image/jpeg', 0.6);
  }
  return dataUrl;
}

document.getElementById('btn-photo-save').addEventListener('click', async () => {
  const btn = document.getElementById('btn-photo-save');
  btn.textContent = '저장 중...';
  btn.disabled = true;
  try {
    const finalUrl = await composePhotoWithStickers();
    const stamp = photoEditor.stamp;
    closePhotoEditor();
    showPreview(finalUrl);
    try {
      const photo = await savePhotoFirebase(finalUrl, stamp);
      photos.unshift(photo);
      renderGallery();
    } catch (e) {
      console.error('Firebase save error:', e);
      alert('사진 저장 실패: ' + e.message);
      photos.unshift({ id: Date.now().toString(), src: finalUrl, date: stamp });
      renderGallery();
    }
  } catch (e) {
    console.error('Compose error:', e);
    alert('저장에 실패했어요: ' + e.message);
  } finally {
    btn.textContent = '저장';
    btn.disabled = false;
  }
});

document.getElementById('btn-photo-cancel').addEventListener('click', closePhotoEditor);
document.getElementById('photo-editor').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closePhotoEditor();
});

function renderGallery() {
  if (photos.length === 0) {
    galleryGrid.innerHTML = '<div class="gallery-empty"><span>📷</span>아직 찍은 사진이 없어요</div>';
    return;
  }
  galleryGrid.innerHTML = photos.map((p, i) => `
    <div class="gallery-item">
      <img src="${p.src}" alt="photo ${i+1}">
      <button class="delete-btn">×</button>
    </div>
  `).join('');

  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.querySelector('img').addEventListener('click', () => showPreview(photos[i].src));
    el.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deletePhoto(i); });
  });
}

async function deletePhoto(index) {
  const photo = photos[index];
  if (photo.id) {
    try { await deletePhotoFirebase(photo.id); } catch (e) { console.error('Firebase delete error:', e); }
  }
  photos.splice(index, 1);
  renderGallery();
}

function showPreview(src) {
  previewImg.src = src;
  previewPopup.classList.add('show');
}

btnClosePreview.addEventListener('click', () => { previewPopup.classList.remove('show'); });
previewPopup.addEventListener('click', (e) => { if (e.target === previewPopup) previewPopup.classList.remove('show'); });
btnDownload.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `HBD_상민_${Date.now()}.png`;
  link.href = previewImg.src;
  link.click();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') previewPopup.classList.remove('show'); });

// ══════════════════════════════════════
// HBD Video (local file)
// ══════════════════════════════════════
function loadVideo() {
  const v = document.getElementById('hbd-video');
  if (!v) return;
  v.currentTime = 0;
  v.play().catch(() => {});
}

// ══════════════════════════════════════
// Lucky Roulette (Mission) + Slot Machine (Person)
// ══════════════════════════════════════
const ROULETTE_PEOPLE = [
  '권혁민', '김보라', '김종섭', '맹승우', '문승희',
  '박정현', '서영미', '우미라', '김지연'
];

const ROULETTE_MISSIONS = [
  { emoji: '☕', label: '커피', text: '상민님에게 커피 쏘기' },
  { emoji: '🍽️', label: '점심', text: '상민님 점심 사주기' },
  { emoji: '🍰', label: '디저트', text: '상민님에게 케이크 or 디저트 선물하기' },
  { emoji: '🫶', label: '칭찬', text: '상민님에게 칭찬 5번 해주기' },
  { emoji: '🏃', label: '심부름', text: '상민님이 시키는 심부름 1회 무조건 수행' },
  { emoji: '🥤', label: '음료', text: '상민님에게 오늘 음료 배달하기' },
  { emoji: '🍜', label: '배달', text: '상민님이 먹고 싶은 거 배달 시켜주기' },
  { emoji: '🍫', label: '간식', text: '상민님 간식 바구니 채워주기' },
  { emoji: '🎂', label: '케이크', text: '상민님에게 생일 편의점 케이크 사주기' },
];

const ROULETTE_COLORS = [
  '#99f6e4', '#fde68a', '#f9a8d4', '#c4b5fd', '#93c5fd',
  '#86efac', '#fdba74', '#fca5a5', '#a5b4fc', '#fde68a',
  '#f9a8d4', '#c4b5fd', '#99f6e4', '#86efac'
];

const rouletteCanvas = document.getElementById('roulette-canvas');
const rCtx = rouletteCanvas.getContext('2d');
let rouletteAngle = 0;
let isAnimating = false;

// ── Draw mission roulette ──
function drawRoulette(angle) {
  const size = rouletteCanvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const count = ROULETTE_MISSIONS.length;
  const arc = (Math.PI * 2) / count;

  rCtx.clearRect(0, 0, size, size);

  ROULETTE_MISSIONS.forEach((m, i) => {
    const startAngle = angle + arc * i;
    const endAngle = startAngle + arc;

    rCtx.beginPath();
    rCtx.moveTo(cx, cy);
    rCtx.arc(cx, cy, r, startAngle, endAngle);
    rCtx.closePath();
    rCtx.fillStyle = ROULETTE_COLORS[i % ROULETTE_COLORS.length];
    rCtx.fill();
    rCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    rCtx.lineWidth = 2;
    rCtx.stroke();

    rCtx.save();
    rCtx.translate(cx, cy);
    rCtx.rotate(startAngle + arc / 2);
    rCtx.font = '18px sans-serif';
    rCtx.textAlign = 'center';
    rCtx.textBaseline = 'middle';
    rCtx.fillText(m.emoji, r * 0.55, -7);
    rCtx.font = 'bold 11px "Noto Sans KR", sans-serif';
    rCtx.fillStyle = '#374151';
    rCtx.fillText(m.label, r * 0.55, 9);
    rCtx.restore();
  });

  // center
  rCtx.beginPath();
  rCtx.arc(cx, cy, 26, 0, Math.PI * 2);
  rCtx.fillStyle = '#ffffff';
  rCtx.fill();
  rCtx.strokeStyle = '#2dd4bf';
  rCtx.lineWidth = 3;
  rCtx.stroke();

  rCtx.fillStyle = '#0d9488';
  rCtx.font = 'bold 10px "Noto Sans KR", sans-serif';
  rCtx.textAlign = 'center';
  rCtx.textBaseline = 'middle';
  rCtx.fillText('MISSION', cx, cy);
}

// ── Slot machine (per-character reels) ──
const slotReelsContainer = document.getElementById('slot-reels');
const CHAR_HEIGHT = 76;
const HANGUL_CHARS = '가나다라마바사아자차카타파하거너더러머버서어저커터퍼허고노도로모보소오조코토포호구누두루무부수우주쿠투푸후';

function initSlotDisplay(charCount) {
  let html = '';
  for (let i = 0; i < charCount; i++) {
    html += `<div class="slot-col" id="slot-col-${i}">
      <div class="slot-col-reel" id="slot-reel-${i}">
        <div class="slot-char">?</div>
      </div>
    </div>`;
  }
  slotReelsContainer.innerHTML = html;
}

function spinSlotReels(targetName) {
  return new Promise(resolve => {
    const chars = targetName.split('');
    const charCount = chars.length;
    initSlotDisplay(charCount);

    let stoppedCount = 0;

    chars.forEach((targetChar, colIdx) => {
      const reel = document.getElementById(`slot-reel-${colIdx}`);
      const col = document.getElementById(`slot-col-${colIdx}`);

      // Build reel: random chars then target char at end
      const randomCount = 20 + colIdx * 8;
      let html = '';
      for (let j = 0; j < randomCount; j++) {
        const rc = HANGUL_CHARS[Math.floor(Math.random() * HANGUL_CHARS.length)];
        html += `<div class="slot-char">${rc}</div>`;
      }
      html += `<div class="slot-char">${targetChar}</div>`;
      reel.innerHTML = html;

      reel.style.transition = 'none';
      reel.style.transform = 'translateY(0px)';
      reel.offsetHeight;

      const targetY = -randomCount * CHAR_HEIGHT;
      const duration = 1.2 + colIdx * 0.6;
      reel.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.8, 0.3, 1)`;
      reel.style.transform = `translateY(${targetY}px)`;

      setTimeout(() => {
        col.classList.add('stopped');
        stoppedCount++;
        if (stoppedCount === charCount) {
          setTimeout(resolve, 300);
        }
      }, duration * 1000);
    });
  });
}

// ── Main spin flow: roulette first, then slot ──
function startSpin() {
  if (isAnimating) return;
  isAnimating = true;
  var spinBtn = document.getElementById('btn-spin');
  spinBtn.disabled = true;
  spinBtn.textContent = '미션 추첨 중...';
  initSlotDisplay(3);

  var count = ROULETTE_MISSIONS.length;
  var arc = (Math.PI * 2) / count;
  var personIndex = Math.floor(Math.random() * ROULETTE_PEOPLE.length);

  // Spin to a random angle (don't pre-pick mission, detect it from final angle)
  var extraSpins = Math.PI * 2 * (5 + Math.random() * 3);
  var randomOffset = Math.random() * Math.PI * 2;
  var targetAngle = rouletteAngle + extraSpins + randomOffset;

  var startAngle = rouletteAngle;
  var totalRotation = targetAngle - startAngle;
  var duration = 3500;
  var startTime = performance.now();

  function animateRoulette(now) {
    try {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var currentAngle = startAngle + totalRotation * eased;
      drawRoulette(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateRoulette);
      } else {
        rouletteAngle = currentAngle;
        // Detect which mission the pointer landed on
        var pointerAngle = -Math.PI / 2;
        var normalizedAngle = (pointerAngle - rouletteAngle) % (Math.PI * 2);
        if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
        var missionIndex = Math.floor(normalizedAngle / arc) % count;

        // Roulette done → start slot machine
        spinBtn.textContent = '당첨자 추첨 중...';
        var targetName = ROULETTE_PEOPLE[personIndex];
        spinSlotReels(targetName).then(function() {
          isAnimating = false;
          spinBtn.disabled = false;
          spinBtn.textContent = '다시 돌리기!';
          showResult(missionIndex, personIndex);
        });
      }
    } catch (e) {
      console.error('Roulette error:', e);
      isAnimating = false;
      spinBtn.disabled = false;
      spinBtn.textContent = '돌려돌려!';
    }
  }

  requestAnimationFrame(animateRoulette);
}

function showResult(missionIndex, personIndex) {
  const mission = ROULETTE_MISSIONS[missionIndex];
  const person = ROULETTE_PEOPLE[personIndex];
  const popup = document.getElementById('roulette-popup');
  const content = document.getElementById('roulette-popup-content');

  content.innerHTML = `
    <div class="result-popup-card">
      <div class="result-title">당첨</div>
      <div class="result-emoji">${mission.emoji}</div>
      <div class="result-person">${person}</div>
      <div class="result-mission">${mission.text}</div>
      <button class="result-popup-close" id="result-close-btn">확인</button>
    </div>
  `;

  popup.classList.add('show');
  startRouletteConfetti();

  document.getElementById('result-close-btn').addEventListener('click', function() {
    popup.classList.remove('show');
    stopRouletteConfetti();
  });
  popup.addEventListener('click', function handler(e) {
    if (e.target === popup) {
      popup.classList.remove('show');
      stopRouletteConfetti();
      popup.removeEventListener('click', handler);
    }
  });
}

// ── Roulette confetti ──
var rouletteConfettiCanvas = document.getElementById('roulette-confetti');
var rcCtx = rouletteConfettiCanvas.getContext('2d');
var rcPieces = [];
var rcRunning = false;
var RC_COLORS = ['#14b8a6','#5eead4','#f472b6','#fb923c','#a78bfa','#60a5fa','#facc15','#34d399','#f87171','#c084fc','#fbbf24','#f9a8d4'];

function startRouletteConfetti() {
  rouletteConfettiCanvas.width = window.innerWidth;
  rouletteConfettiCanvas.height = window.innerHeight;
  rcPieces = [];
  rcRunning = true;
  for (var i = 0; i < 120; i++) {
    rcPieces.push({
      x: Math.random() * rouletteConfettiCanvas.width,
      y: Math.random() * -rouletteConfettiCanvas.height - 20,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: RC_COLORS[Math.floor(Math.random() * RC_COLORS.length)],
      rot: Math.random() * 360,
      rotS: (Math.random() - 0.5) * 10,
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 3,
      wobble: Math.random() * Math.PI * 2,
      wobbleS: Math.random() * 0.06 + 0.02
    });
  }
  animateRouletteConfetti();
}

function animateRouletteConfetti() {
  if (!rcRunning) return;
  rcCtx.clearRect(0, 0, rouletteConfettiCanvas.width, rouletteConfettiCanvas.height);
  rcPieces.forEach(function(p) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.wobble) * 0.8;
    p.wobble += p.wobbleS;
    p.rot += p.rotS;
    rcCtx.save();
    rcCtx.translate(p.x, p.y);
    rcCtx.rotate(p.rot * Math.PI / 180);
    rcCtx.fillStyle = p.color;
    rcCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    rcCtx.restore();
    if (p.y > rouletteConfettiCanvas.height + 30) {
      p.y = Math.random() * -60;
      p.x = Math.random() * rouletteConfettiCanvas.width;
    }
  });
  requestAnimationFrame(animateRouletteConfetti);
}

function stopRouletteConfetti() {
  rcRunning = false;
  rcCtx.clearRect(0, 0, rouletteConfettiCanvas.width, rouletteConfettiCanvas.height);
}

document.getElementById('btn-spin').addEventListener('click', startSpin);
drawRoulette(0);
initSlotDisplay(3);

// ══════════════════════════════════════
// Drawing Canvas
// ══════════════════════════════════════
var drawCanvas = document.getElementById('draw-canvas');
var dCtx = drawCanvas.getContext('2d');
var isDrawing = false;
var drawColor = '#374151';
var drawSize = 3;
var isEraser = false;

const DRAW_COLORS = ['#374151','#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#ffffff'];

// Init color buttons
(function initDrawColors() {
  var row = document.getElementById('draw-colors');
  row.innerHTML = DRAW_COLORS.map(function(c, i) {
    var border = c === '#ffffff' ? 'border:2px solid #ccc;' : '';
    return '<button class="draw-color-btn' + (i === 0 ? ' active' : '') + '" data-color="' + c + '" style="background:' + c + ';' + border + '"></button>';
  }).join('');
  row.querySelectorAll('.draw-color-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      row.querySelectorAll('.draw-color-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      drawColor = btn.dataset.color;
      isEraser = false;
      stickerMode = false;
      selectedSticker = null;
      document.getElementById('btn-eraser').classList.remove('active');
      document.getElementById('btn-sticker-toggle').classList.remove('active');
      document.querySelectorAll('.sticker-btn').forEach(function(b) { b.classList.remove('active'); });
      drawCanvas.style.cursor = 'crosshair';
    });
  });
})();

// Size buttons
document.querySelectorAll('.draw-size-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.draw-size-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    drawSize = parseInt(btn.dataset.size);
  });
});

// Eraser
document.getElementById('btn-eraser').addEventListener('click', function() {
  isEraser = !isEraser;
  stickerMode = false;
  selectedSticker = null;
  document.getElementById('btn-sticker-toggle').classList.remove('active');
  document.querySelectorAll('.sticker-btn').forEach(function(b) { b.classList.remove('active'); });
  this.classList.toggle('active', isEraser);
  drawCanvas.style.cursor = isEraser ? 'grab' : 'crosshair';
});

// Stickers
var STICKERS = [
  'balloon1.png','balloon3.png','party_balloon.png','gift.png','confetti.png',
  'ribbon.png','ribbon2.png','medal.png','trophy.png','sparkle2.png',
  'sparkle3.png','pencil.png','megaphone.png','megaphone2.png'
];
var stickerMode = false;
var selectedSticker = null;
var stickerImages = {};

// Preload sticker images
STICKERS.forEach(function(name) {
  var img = new Image();
  img.src = 'img/stickers/' + name;
  stickerImages[name] = img;
});

// Init sticker palette
(function initStickerPalette() {
  var palette = document.getElementById('sticker-palette');
  palette.innerHTML = STICKERS.map(function(name) {
    return '<button class="sticker-btn" data-sticker="' + name + '"><img src="img/stickers/' + name + '" alt="sticker"></button>';
  }).join('');
  palette.querySelectorAll('.sticker-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      palette.querySelectorAll('.sticker-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedSticker = btn.dataset.sticker;
      stickerMode = true;
      isEraser = false;
      document.getElementById('btn-eraser').classList.remove('active');
      drawCanvas.style.cursor = 'copy';
    });
  });
})();

document.getElementById('btn-sticker-toggle').addEventListener('click', function() {
  var palette = document.getElementById('sticker-palette');
  var isOpen = palette.style.display !== 'none';
  palette.style.display = isOpen ? 'none' : 'flex';
  this.classList.toggle('active', !isOpen);
  if (isOpen) {
    stickerMode = false;
    selectedSticker = null;
    document.querySelectorAll('.sticker-btn').forEach(function(b) { b.classList.remove('active'); });
    drawCanvas.style.cursor = 'crosshair';
  }
});

// Clear
document.getElementById('btn-clear').addEventListener('click', function() {
  dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
});

// Drawing logic
function getDrawPos(e) {
  var rect = drawCanvas.getBoundingClientRect();
  var scaleX = drawCanvas.width / rect.width;
  var scaleY = drawCanvas.height / rect.height;
  var clientX, clientY;
  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

function startDraw(e) {
  e.preventDefault();
  if (stickerMode && selectedSticker && stickerImages[selectedSticker]) {
    var pos = getDrawPos(e);
    var img = stickerImages[selectedSticker];
    var size = 80;
    dCtx.drawImage(img, pos.x - size / 2, pos.y - size / 2, size, size);
    return;
  }
  isDrawing = true;
  var pos = getDrawPos(e);
  dCtx.beginPath();
  dCtx.moveTo(pos.x, pos.y);
}

function moveDraw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  var pos = getDrawPos(e);
  dCtx.lineTo(pos.x, pos.y);
  dCtx.strokeStyle = isEraser ? '#ffffff' : drawColor;
  dCtx.lineWidth = isEraser ? drawSize * 4 : drawSize;
  dCtx.lineCap = 'round';
  dCtx.lineJoin = 'round';
  dCtx.stroke();
}

function endDraw(e) {
  if (isDrawing) {
    isDrawing = false;
    dCtx.closePath();
  }
}

drawCanvas.addEventListener('mousedown', startDraw);
drawCanvas.addEventListener('mousemove', moveDraw);
drawCanvas.addEventListener('mouseup', endDraw);
drawCanvas.addEventListener('mouseleave', endDraw);
drawCanvas.addEventListener('touchstart', startDraw);
drawCanvas.addEventListener('touchmove', moveDraw);
drawCanvas.addEventListener('touchend', endDraw);

function openDrawModal() {
  dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  document.getElementById('draw-name').value = '';
  isEraser = false;
  stickerMode = false;
  selectedSticker = null;
  document.getElementById('btn-eraser').classList.remove('active');
  document.getElementById('btn-sticker-toggle').classList.remove('active');
  document.getElementById('sticker-palette').style.display = 'none';
  document.querySelectorAll('.sticker-btn').forEach(function(b) { b.classList.remove('active'); });
  drawCanvas.style.cursor = 'crosshair';
  document.getElementById('draw-overlay').classList.add('show');
}

function closeDrawModal() {
  document.getElementById('draw-overlay').classList.remove('show');
}

document.getElementById('draw-overlay').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeDrawModal();
});

document.getElementById('btn-draw-submit').addEventListener('click', async function() {
  var name = document.getElementById('draw-name').value.trim();
  if (!name) { alert('이름을 입력해주세요!'); return; }

  // Check if canvas is blank
  var blank = document.createElement('canvas');
  blank.width = drawCanvas.width;
  blank.height = drawCanvas.height;
  if (drawCanvas.toDataURL() === blank.toDataURL()) {
    alert('그림을 그려주세요!');
    return;
  }

  var btn = this;
  btn.textContent = '저장 중...';
  btn.disabled = true;

  try {
    var dataUrl = drawCanvas.toDataURL('image/png', 0.7);
    // Compress if too large
    if (dataUrl.length > 800000) {
      var tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = 400;
      tmpCanvas.height = Math.round(400 * drawCanvas.height / drawCanvas.width);
      var tmpCtx = tmpCanvas.getContext('2d');
      var img = new Image();
      await new Promise(function(r) { img.onload = r; img.src = dataUrl; });
      tmpCtx.drawImage(img, 0, 0, tmpCanvas.width, tmpCanvas.height);
      dataUrl = tmpCanvas.toDataURL('image/jpeg', 0.6);
    }

    var docRef = await messagesCollection.add({
      drawingUrl: dataUrl,
      from: name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    firestoreMessages.unshift({ id: docRef.id, emoji: '🎨', msg: '', from: name, drawingUrl: dataUrl, isFirestore: true });
    renderRollingPaper();
    closeDrawModal();
    alert('낙서가 등록되었어요! 🎨');
  } catch (e) {
    console.error('Draw save error:', e);
    alert('저장에 실패했어요: ' + e.message);
  } finally {
    btn.textContent = '남기기';
    btn.disabled = false;
  }
});
