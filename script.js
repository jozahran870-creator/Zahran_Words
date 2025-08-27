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
    words:["مقابر","فراعنة","جيزة","هرم","خوفو","غُرف"], 
    letters:[
      'م','ج','ي','ز','ة',
      'ق','ه','ر','م','خ',
      'ا','غُ','و','ف','و',
      'ب','ر','ف','ة','ن',
      'ر','ف','ر','ا','ع'
    ] 
  },
  { 
    words:["الأقصى","زيتون","غزة","شهداء","مقاومة"], 
    letters:[
      'ز','غ','ز','ة','ش',
      'ي','أ','ق','ص','ه',
      'ت','ل','ا','ى','د',
      'و','م','ق','ا','ا',
      'ن','ة','م','و','ء'
    ] 
  },
  { 
    words:["رونالدو","سبعة","نجم","مدريد","برتغال"], 
    letters:[
      'ل','ا','ر','و','ن',
      'م','غ','ت','ر','ا',
      'د','ر','ي','ب','ل',
      'ج','ن','د','و','د',
      'م','س','ب','ع','ة'
    ] 
  },
  { 
    words:["برج","إيفل","فرنسا","باريس","رمز","سياحة"], 
    letters:[
      'ا','ح','ة','ف','ر',
      'ي','ب','ا','س','ن',
      'س','ر','ر','ا','ب',
      'ز','م','ي','س','ر',
      'إ','ي','ف','ل','ج'
    ] 
    },

  { 
    words:["تفاحة","أخضر","صحي","نيوتن","أدم","فاكهة"], 
    letters:[
      'ف','ا','ن','ي','و',
      'أ','ك','ه','ة','ت',
      'د','ص','ت','ف','ن',
      'م','ح','ي','ا','ح',
      'أ','خ','ض','ر','ة'
    ] 
  },
  { 
    words:["ببجي","لعبة","فريق","صينية","تعاون","حرب"], 
    letters:[
      'ت','ق','ي','ر','ف',
      'ع','ل','ع','ب','ة',
      'ا','و','ن','ب','ب',
      'ح','ة','ي','ن','ج',
      'ر','ب','ص','ي','ي'
    ] 
  },
  { 
    words:["فضيحة","برشلونة","بايرن","دوريأبطال"], 
    letters:[
      'ف','ض','ي','ح','ة',
      'د','و','ر','ب','ر',
      'ال','ط','ي','ل','ش',
      'ب','ب','أ','و','ن',
      'ا','ي','ر','ن','ة'
    ] 
  },
  { 
    words:["طابعة","ورق","حبر","ليزر","نسخ","مستندات"], 
    letters:[
      'ط','ا','ب','ع','ح',
      'و','ر','ق','ة','ب',
      'ل','م','س','ت','ر',
      'ي','ز','ر','ن','ت',
      'ن','س','خ','د','ا'
    ] 
    },
{ 
    words:["قمر","ليل","ضوء","هلال","بدر","خسوف","أبولو"], 
    letters:[
      'خ','ض','و','ه','ق',
      'س','و','ء','ل','م',
      'و','ل','و','ا','ر',
      'ف','أ','ب','ل','ل',
      'ب','د','ر','ل','ي'
    ] 
  },
  { 
    words:["محمد","رسول","نبي","وحي","قرآن","سُنة","صادق"], 
    letters:[
      'ة','ص','ا','د','ق',
      'ن','م','ح','م','د',
      'سُ','و','س','ر','و',
      'ن','ل','ي','ب','ح',
      'آ','ر','ق','ن','ي'
    ] 
  },
  { 
    words:["ثقافة","تاريخ","وطنعربي","حضارة","نفط"], 
    letters:[
      'ف','ط','ض','ح','ث',
      'ن','ي','ا','ر','ق',
      'و','ب','ت','ة','ا',
      'ط','ر','ا','ة','ف',
      'ن','ع','ر','ي','خ'
    ] 
  },
  { 
    words:["هاتف","شاشة","بطارية","شحن","لمس","أيفون"], 
    letters:[
      'و','ن','ل','م','س',
      'ف','ه','ا','ت','ف',
      'ي','أ','ش','ش','ة',
      'ب','ن','ح','ا','ش',
      'ط','ا','ر','ي','ة'
    ] 
    },
{ 
    words:["الكعبة","قبلة","مكة","صلاة","طواف","مقام"], 
    letters:[
      'ك','ل','ص','ل','ا',
      'ع','ا','ق','ا','ة',
      'ب','ط','م','م','م',
      'ة','و','ا','ف','ك',
      'ق','ب','ل','ة','ة'
    ] 
  },
  { 
    words:["أندرويد","هاتف","نظام","تطبيقات","روبوت"], 
    letters:[
      'ن','ظ','ا','ه','ت',
      'ر','أ','م','ا','ط',
      'و','ن','د','ت','ب',
      'ب','د','ي','ف','ي',
      'وت','ر','و','ات','ق'
    ] 
  },
  { 
    words:["واتساب","تطبيق","دردشة","ميتا","تواصل"], 
    letters:[
      'و','م','ي','ت','ط',
      'ا','ل','ت','ا','ب',
      'ت','ص','ا','و','ي',
      'س','ا','ب','ت','ق',
      'د','ر','د','ش','ة'
    ] 
  },
  { 
    words:["طبيب","ممرض","جراحة","طوارئ","طاقمطبي"], 
    letters:[
      'ي','ة','ح','ا','ر',
      'ب','ط','م','م','ج',
      'ط','ا','ق','م','ر',
      'ب','ي','ب','ط','ض',
      'ط','و','ا','ر','ئ'
    ] 
    },
{ 
    words:["صقر","شاهين","سرعة","طيور","ينقض","فريسة"], 
    letters:[
      'ر','و','ي','ط','ش',
      'ي','ي','ر','ف','ا',
      'ن','س','ن','ي','ه',
      'ق','ة','س','ر','ع',
      'ض','ص','ق','ر','ة'
    ] 
  },
  { 
    words:["أينشتاين","فيزياء","عالم","ذرة","نوبل"], 
    letters:[
      'ع','ف','ي','ز','ي',
      'ا','أ','ي','ن','ا',
      'ل','م','ل','ش','ء',
      'ن','و','ب','ت','ن',
      'ذ','ر','ة','ا','ي'
    ] 
  },
  { 
    words:["فرنسا","مدريد","مدرب","زيدان","نطحة","ريال"], 
    letters:[
      'ف','ر','ن','ط','م',
      'س','ن','ة','ح','د',
      'ا','ال','ز','ي','ر',
      'ر','ي','ان','د','ب',
      'م','د','ر','ي','د'
    ] 
  },
  { 
    words:["عادلإمام","ضحك","ممثل","زعيم","كوميدي"], 
    letters:[
      'ز','م','م','ث','ل',
      'ع','ك','ي','د','ي',
      'ي','و','م','م','ا',
      'م','ض','ح','ك','م',
      'ع','ا','د','ل','إ'
    ] 
    },
  {
    letters: [
      'ف','ن','ز','ي','ا',
      'د','ا','ا','ل','ل',
      'ن','ف','ل','ا','م',
      'ش','ح','و','ن','و',
      'ي','ة','ر','س','م'
    ],
    words: ['دافنشي','لوحة','الموناليزا','فن','رسم']
  },
  {
    letters: [
      'ش','د','ا','ن','ي',
      'ب','ت','م','ض','ا',
      'ك','ن','ب','ر','ل',
      'ة','س','ك','ر','ة',
      'ة','ض','ا','ي','ر'
    ],
    words: ['تنس','شبكة','رياضة','دانيال','مضرب','كرة']
  },
  {
    letters: [
      'م','ي','ك','ل','ب',
      'ي','ا','ع','م','و',
      'ق','ء','ا','ل','ن',
      'د','ز','و','ي','ل',
      'و','ة','ذ','ر','ة'
    ],
    words: ['زويل','ذرة','قدوة','نوبل','عالم','كيمياء']
  },
  {
    letters: [
      'ر','ح','ل','ة','ب',
      'ط','ر','ك','ا','م',
      'ا','ف','ر','ا','ط',
      'ئ','س','ت','ر','ة',
      'ر','ة','ذ','ك','ر'
    ],
    words: ['طائرة','تذكرة','مطار','سفر','رحلة','ركاب']
  },
  {
    letters: [
      'ب','ع','ظ','م','ى',
      'ر','ل','ي','ن','ر',
      'أ','ل','م','ا','ل',
      'ة','ا','ن','ن','ت',
      'ي','ز','ا','ي','ه'
    ],
    words: ['ألمانيا','هتلر','نازية','برلين','عظمى']
  },
  {
    letters: [
      'ف','ض','ا','ء','م',
      'ك','و','ا','ر','ج',
      'س','ب','ك','ا','ت',
      'م','م','و','ج','ن',
      'ا','ء','ش','م','س'
    ],
    words: ['فضاء','شمس','مجرات','نجوم','كواكب','سماء']
  },
  {
    letters: [
      'ن','ر','ق','ل','ا',
      'م','ح','ت','ا','ل',
      'ر','أ','ا','ل','و',
      'ا','ن','ي','أ','ط',
      'د','ي','ل','ه','ب'
    ],
    words: ['الأهلي','نادي','القرن','بطولات','أحمر']
  },
  {
    letters: [
      'ص','غ','ي','ر','ع',
      'ن','ع','ت','ق','ا',
      'خ','ت','و','ي','ن',
      'آ','ن','م','ب','ه',
      'م','و','ل','ك','ذ'
    ],
    words: ['توتعنخآمون','ملك','قناع','ذهبي','صغير']
  },
  {
    letters: [
      'م','ه','م','ا','غ',
      'و','ج','ر','ة','م',
      'ر','ص','ر','ل','ح',
      'ب','ق','ل','ي','ا',
      'ع','ر','أ','ش','ب'
    ],
    words: ['مهجور','رعب','مغامرة','قصر','أشباح','ليل']
  },
  {
    letters: [
      'ا','ن','ن','و','م',
      'ن','م','ع','ج','غ',
      'س','ة','ف','ا','س',
      'أ','ة','ا','ظ','ل',
      'ف','ر','ش','ن','ة'
    ],
    words: ['فرشاة','أسنان','نظافة','مغسلة','معجون']
  },
  {
    letters: [
      'أ','ذ','ي','ن','ض',
      'ض','ع','ق','ن','ب',
      'و','م','ل','ب','ة',
      'خ','د','ع','ض','ل',
      'ض','ب','ط','ي','ن'
    ],
    words: ['قلب','نبض','عضو','أذين','بطين','دم','ضخ','عضلة']
  },
  {
    letters: [
      'ق','ن','و','و','ي',
      'ن','ب','ل','ة','ر',
      'ل','ن','ف','ج','ا',
      'ت','ا','ا','ر','ب',
      'ق','د','م','ح','ر'
    ],
    words: ['قنبلة','نووي','انفجار','دمار','قتل','حرب']
  },
  {
    letters: [
      'ة','ح','ص','ب','ا',
      'س','ف','ة','م','ل',
      'ر','ص','ع','ل','ط',
      'د','ل','م','ت','ا',
      'م','و','ا','ج','ب'
    ],
    words: ['فصل','مدرسة','طلاب','حصة','معلم','واجبات']
  },
  {
    letters: [
      'ة','ي','ا','م','ح',
      'م','ا','ن','ل','ق',
      'أ','ة','م','غ','ب',
      'ر','ق','ة','م','ص',
      'س','ف','ت','ا','ه'
    ],
    words: ['بصمة','هاتف','سرقة','حماية','أمان','مغلق']
  },
  {
    letters: [
      'ح','س','ا','ب','ي',
      'ر','ي','ا','ض','ا',
      'ذ','ر','ا','د','ت',
      'ج','م','ع','ل','ة',
      'م','ا','ق','ر','أ'
    ],
    words: ['معادلة','رياضيات','أرقام','حساب','جذر']
  },
  {
    letters: [
      'م','د','ا','ل','أ',
      'س','ج','ر','ه','ز',
      'ت','ج','إ','س','ل',
      'ا','ا','م','ع','ا',
      'ر','ي','خ','ة','م'
    ],
    words: ['الأزهر','جامعة','مسجد','تاريخ','إسلام']
  },
  {
    letters: [
      'و','ظ','ي','ف','ة',
      'ب','م','ل','ة','ي',
      'ت','ع','ت','ر','ق',
      'ك','م','ر','ا','ت',
      'م','و','ظ','ف','ب'
    ],
    words: ['موظف','عمل','مكتب','وظيفة','ترقية','راتب']
  },
  {
    letters: [
      'ا','م','ت','س','ا',
      'ع','ا','ا','م','س',
      'ر','ي','ع','ا','ت',
      'ب','و','د','ز','ى',
      'م','و','س','ي','ق'
    ],
    words: ['سماعات','ايربودز','موسيقى','استماع']
  },
  {
    letters: [
      'س','و','ب','ض','ا',
      'ت','ب','ر','ع','ئ',
      'س','ش','م','س','ل',
      'و','ر','ا','ر','ع',
      'ق','ا','ء','ك','ت'
    ],
    words: ['سوبرماركت','تسوق','شراء','سلع','بضائع']
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







