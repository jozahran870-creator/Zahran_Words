/* === Helpers === */
function $q(sel, root=document){ return root.querySelector(sel); }
function $qa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
/* === Inject minimal CSS so buttons look & react === */
(function injectCSS(){
  if ($q('#auto-style-game')) return;
  const css = `
    #grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(60px, 1fr)); /* ٥ أعمدة */
      grid-template-rows: repeat(5, minmax(60px, 1fr));   /* ٥ صفوف */
      gap: 8px;
      margin-top: 8px;
    }
    .cell {
      user-select: none;
      pointer-events: auto;
      outline: none;
      border: 0;
      padding: 12px;
      border-radius: 14px;
      font-size: 26px;
      font-weight: 800;
      background: #f3f3f3;
      box-shadow: 0 2px 0 rgba(0,0,0,.25);
      transition: .15s;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .cell:hover { transform: translateY(-1px); }
    .cell.selected { outline: 3px solid #111; transform: scale(.97); }
    .cell.locked {
      background: #cfd8dc;
      color: #455a64;
      opacity: .85;
      box-shadow: none;
    }
    .cell:disabled { cursor: default; }
    .pick-1{background:#fffbe6}
    .pick-2{background:#fff3cd}
    .pick-3{background:#ffe8a1}
    .pick-4{background:#ffd180}
    .pick-5{background:#ffab91}
    .pick-6{background:#ff8a80}
    .pick-7{background:#ff5252}
    .pick-8{background:#ff1744}
    .pick-9{background:#ff5252}
    .pick-10{background:#ffe57f}
    #controls {
      display:flex;
      gap:10px;
      align-items:center;
      margin-top:12px;
      flex-wrap:wrap;
    }
    #checkBtn {
      padding:14px 28px;
      font-size:22px;
      font-weight:800;
      background:linear-gradient(90deg,#ffeb3b,#e53935);
      color:#111;
      border:2px solid #111;
      border-radius:12px;
      cursor:pointer;
    }
    #cancelBtn {
      padding:14px 28px;
      font-size:22px;
      font-weight:800;
      background:#fff;
      color:#111;
      border:2px solid #111;
      border-radius:12px;
      cursor:pointer;
    }
  `;
  const style = document.createElement('style');
  style.id = 'auto-style-game';
  style.textContent = css;
  document.head.appendChild(style);
})();
// بدل advanceColor
function toggleCell(btn){
  btn.classList.toggle('selected');
}
function advanceColor(btn){
  let step = parseInt(btn.dataset.step||'0',10);
  COLOR_CLASSES.forEach(c=>btn.classList.remove(c));
  btn.classList.add(COLOR_CLASSES[step % COLOR_CLASSES.length]);
  btn.dataset.step = (step+1).toString();
}
const LEVELS = [
  { 
    words:["محمدصلاح","أهداف","مهاجم","ليفربول"], 
    letters:[
      'م','ح','م','د','أ',
      'ل','ي','ف','ص','ه',
      'م','ه','ر','ل','د',
      'ج','ا','ب','ا','ا',
      'م','ل','و','ح','ف'
    ] 
  },
  { 
    words:["","","","","","","",""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:["","","","","",""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:["","","","",""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },

  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
    },
{ 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
  },
  { 
    words:[""], 
    letters:[
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','','',
      '','','','',''
    ] 
   }

];
function getLevel(idx){
  if (LEVELS[idx]) return LEVELS[idx];
  return { words:[`كلمة${idx+1}`], letters: demoLetters() };
}
/* === State === */
let selCounter = 0;
let levelState = { found:new Set() };
/* === Pages init === */
function initHome(){
  const play = $q('#playBtn');
  if (!play) return;
  play.addEventListener('click', ()=>{
    play.style.transform='translateY(6px) scale(.98)';
    play.style.filter='saturate(1.05)';
    setTimeout(()=>{ play.style.transform=''; play.style.filter=''; },220);
  });
}
function initLevels(){
  const container = $q('#levelsContainer');
  if(!container) return;
  container.innerHTML = '';
  for(let i=1;i<=100;i++){
    const a = document.createElement('a');
    a.className='level-circle';
    a.href = `./level${i}.html`;
    a.textContent = i;
    a.setAttribute('aria-label',`المستوى ${i}`);
    container.appendChild(a);
  }
}

/* === Selection helpers === */
function toggleSelect(btn){
  if (btn.disabled) return;

  const nowSelected = btn.classList.toggle('selected');

  if (nowSelected) {
    btn.dataset.sel = (++selCounter).toString();
  } else {
    btn.dataset.sel = '';
  }
}

/* === التحقق من الكلمة === */
function checkWord(selectedButtons, correctWord) {
  let word = selectedButtons.map(b => b.textContent).join("");

  if (word === correctWord) {
    // الكلمة صح → خلي كل الأزرار تتحول للون الممزوج
    selectedButtons.forEach(btn => {
      btn.style.background = "linear-gradient(135deg, #8B0000, #4682B4)";
      btn.style.color = "#fff";
   
btn.disabled = true;   // يقفل الزرار
btn.classList.remove("selected"); // يشيل التحديد

   btn.style.opacity = "1";
    });
  }
}

function getSelectedInOrder(grid){
  return $qa('.cell.selected',grid).sort((a,b)=>(+a.dataset.sel||0)-(+b.dataset.sel||0));
}


function clearSelection(grid){
  getSelectedInOrder(grid).forEach(c=>{
    c.classList.remove('selected');
    c.dataset.sel = '';
    c.dataset.step = 0;
    COLOR_CLASSES.forEach(cl=>c.classList.remove(cl));

    // دي اللي هتشيل اللون الأحمر وكل الـ inline styles
    c.style.background = "";
    c.style.color = "";
    c.style.opacity = "";
  });
}



function lockSelected(grid){
  getSelectedInOrder(grid).forEach(c=>{
    c.classList.remove('selected');
    c.classList.add('locked');
    c.disabled = true;
    c.setAttribute('aria-pressed','false');
  });
}

/* === Build a level page === */
function initLevelPage(){
  const grid = $q('#grid');
  if(!grid) return;

  // reset state
  selCounter = 0;
  levelState = { found:new Set() };

  // استخرج رقم المستوى من اسم الصفحة
  const m = location.pathname.match(/level(\d+)\.html/i);
  const levelIndex = m ? (parseInt(m[1],10)-1) : 0;
  const { words, letters } = getLevel(levelIndex);

  // بنبني الشبكة
  grid.innerHTML='';
  const L = letters.length>=25 ? letters : demoLetters();
  for(let i=0;i<25;i++){
    const b = document.createElement('button');
    b.type='button';
    b.className='cell';
    b.textContent = L[i];
    b.addEventListener('click', ()=> toggleSelect(b));
    grid.appendChild(b);
  }
  // شريط الأزرار تحت الشبكة
  let controls = $q('#controls');
  if(!controls){
    controls = document.createElement('div');
    controls.id = 'controls';
    grid.parentNode.insertBefore(controls, grid.nextSibling);
  } else {
    controls.innerHTML='';
  }
  // زر حسنا
  const checkBtn = document.createElement('button');
  checkBtn.id='checkBtn';
  checkBtn.textContent='حسنا';
  controls.appendChild(checkBtn);
  // زر إلغاء
  const cancelBtn = document.createElement('button');
  cancelBtn.id='cancelBtn';
  cancelBtn.textContent='إلغاء';
  controls.appendChild(cancelBtn);
// زر تم الجديد (مش ظاهر إلا لما المستوى يخلص)
const doneBtn = document.createElement('button');
doneBtn.id = 'doneBtn';
doneBtn.textContent = 'تم';
doneBtn.style.display = 'none'; 
// ننسخ كل ستايلات زر حسنا حرف حرف
doneBtn.style.padding = '14px 28px';
doneBtn.style.fontSize = '22px';
doneBtn.style.fontWeight = '800';
doneBtn.style.background = 'green';
doneBtn.style.color = '#fff';
doneBtn.style.border = '2px solid #111';
doneBtn.style.borderRadius = '12px';
doneBtn.style.cursor = 'pointer';
// حط الزر جنب controls
controls.appendChild(doneBtn);
// Event للزر تم
doneBtn.addEventListener('click', ()=>{
    const m = location.pathname.match(/level(\d+)\.html/i);
    const levelIndex = m ? (parseInt(m[1],10)-1) : 0;
    localStorage.setItem('level-' + (levelIndex+1), 'done');
    window.location.href = 'levels .html';
});
// تعديل checkBtn لما المستوى يخلص
checkBtn.addEventListener('click', ()=>{
   const selected = getSelectedInOrder(grid);
    if (!selected.length){
        alert('عالمي يا برنس هش على اللي بعده');
        return;
    }
    const done = checkWord(grid, words);
  
  if (done){
        doneBtn.style.display = 'inline-block'; // نعرض الزر تم
        checkBtn.disabled = true;                // حسنا مش شغال
    }
});

  cancelBtn.addEventListener('click', ()=> clearSelection(grid));
}
/* === Check logic: يراجع الحروف اللي انت حددتها بالترتيب === */
function checkWord(grid, words){
  const selected = getSelectedInOrder(grid);
  const picked = selected.map(c=>c.textContent).join('');
  if (!picked){ alert('اختار الحروف الأول يا نجم 😂'); return false; }

  // ماتحسبش نفس الكلمة مرتين
  const target = words.find(w => w === picked && !levelState.found.has(w));

  if (target){
    lockSelected(grid);              // قفل الحروف اللي اخترتها
    levelState.found.add(target);
    alert(`الله عليك! "${target}" صح 🎉`);
  } else {
    alert('لأ، مش هي دي.. جرّب تاني 😅');
    return false;
  }

  // خلّصنا كل كلمات المستوى؟
  const allDone = levelState.found.size === words.length;
  return allDone;
}
/* === Boot === */
document.addEventListener('DOMContentLoaded', ()=>{
  // مهم: اتأكد إن الـ<body> فيه class مناسب
  if (document.body.classList.contains('home-page'))   initHome();
  if (document.body.classList.contains('levels-page')) initLevels();
  if (document.body.classList.contains('level-page'))  initLevelPage();
});

function finishLevel(levelNum){
  // نخزن إن المستوى اتحل
  localStorage.setItem('level-' + levelNum, 'done');

  // نروح على صفحة المستويات
  window.location.href = 'levels .html';
}
// جلب التقدم (أو يبدأ فاضي)
let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];

// تحديث التقدم
function markLevelAsCompleted(levelIndex){
  if(!completedLevels.includes(levelIndex)){
    completedLevels.push(levelIndex);
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  }
}


LEVELS.forEach((lvl, i)=>{
  const btn = document.createElement('a');
  btn.className = 'level-btn';
  btn.innerText = i+1;

  // لو المستوى خلصان
  if(completedLevels.includes(i)){
    btn.style.background = 'green';
    btn.innerText = '✔️ ' + (i+1);
  }

  btn.href = 'level.html?i='+i;
  document.querySelector('.levels-container').appendChild(btn);
});


function initLevels() {
  const container = $q('#levelsContainer');
  if(!container) return;
  container.innerHTML='';

  for(let i=1;i<=100;i++){
    const a = document.createElement('a');
    a.className='level-circle';
    a.href=`level${i}.html`;
    a.textContent=i;

    // لو المستوى اتحل قبل كده
    if(localStorage.getItem('level-'+i) === 'done'){
      a.textContent='✔';
      a.style.background='green';
    }

    container.appendChild(a);
  }
}





