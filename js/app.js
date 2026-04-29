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
      msg: doc.data().msg,
      from: doc.data().from || '',
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
    return `
    <div class="rolling-card ${color} ${font}" data-idx="${i}">
      <div class="card-emoji">${m.emoji}</div>
      <div class="card-msg">${m.msg}</div>
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
  document.getElementById('rolling-popup-emoji').textContent = m.emoji;
  document.getElementById('rolling-popup-msg').textContent = m.msg;
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

  const dataUrl = photoCanvas.toDataURL('image/jpeg', 0.5);
  showPreview(dataUrl);

  try {
    btnCapture.style.pointerEvents = 'none';
    const photo = await savePhotoFirebase(dataUrl, stamp);
    photos.unshift(photo);
    renderGallery();
  } catch (e) {
    console.error('Firebase save error:', e);
    alert('사진 저장 실패: ' + e.message);
    photos.unshift({ id: Date.now().toString(), src: dataUrl, date: stamp });
    renderGallery();
  } finally {
    btnCapture.style.pointerEvents = '';
  }
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
// YouTube Video
// ══════════════════════════════════════
let ytPlayer = null;
let ytReady = false;
let videoRequested = false;
let stopTimer = null;

const YT_VIDEO_ID = 'tLNJNDUOq70';
const YT_START = 6682;
const YT_END = 6719;

const ytScript = document.createElement('script');
ytScript.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(ytScript);

window.onYouTubeIframeAPIReady = function() {
  ytReady = true;
  if (videoRequested) createPlayer();
};

function createPlayer() {
  if (ytPlayer) { ytPlayer.seekTo(YT_START); ytPlayer.playVideo(); startStopTimer(); return; }
  ytPlayer = new YT.Player('yt-player', {
    videoId: YT_VIDEO_ID,
    playerVars: { autoplay: 1, start: YT_START, rel: 0, modestbranding: 1 },
    events: {
      onReady: function(e) { e.target.playVideo(); startStopTimer(); },
      onStateChange: function(e) { if (e.data === YT.PlayerState.PLAYING) startStopTimer(); }
    }
  });
}

function startStopTimer() {
  if (stopTimer) clearInterval(stopTimer);
  stopTimer = setInterval(function() {
    if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.getCurrentTime() >= YT_END) {
      ytPlayer.pauseVideo();
      clearInterval(stopTimer);
      stopTimer = null;
    }
  }, 300);
}

function loadVideo() {
  videoRequested = true;
  if (ytReady) createPlayer();
}
