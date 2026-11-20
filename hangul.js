// File: hangul.js
// ハングル学習モジュール（index.html の kana() / WORDS / go() を利用）
(function(){
/* ===== データ ===== */
const VB=[["ㅏ","ア","口を大きく開いて「ア」"],["ㅑ","ヤ","ㅏに短い線を足すとy音"],["ㅓ","オ","口を縦に開かない「オ」"],["ㅕ","ヨ","ㅓのy音"],["ㅗ","オ","唇を丸めて前に出す「オ」"],["ㅛ","ヨ","ㅗのy音"],["ㅜ","ウ","唇を丸める「ウ」"],["ㅠ","ユ","ㅜのy音"],["ㅡ","ウ","唇を横に引く「ウ」"],["ㅣ","イ","「イ」"]];
const VC=[["ㅐ","エ","ㅏ+ㅣ。ㅔより口が広い"],["ㅒ","イェ","ㅐのy音"],["ㅔ","エ","ㅓ+ㅣ。現代語ではㅐとほぼ同音"],["ㅖ","イェ","ㅔのy音。子音が付くと「エ」(계→ケ)"],["ㅘ","ワ","ㅗ+ㅏ"],["ㅙ","ウェ","ㅗ+ㅐ"],["ㅚ","ウェ","ㅗ+ㅣ。実際は[ウェ]"],["ㅝ","ウォ","ㅜ+ㅓ"],["ㅞ","ウェ","ㅜ+ㅔ"],["ㅟ","ウィ","ㅜ+ㅣ"],["ㅢ","ウィ／イ／エ","語頭[ウィ]／子音付き[イ]／助詞の「の」は[エ]"]];
const CB=[["ㄱ","k／g","語頭はカ行、語中はガ行(가구→カグ)"],["ㄴ","n","ナ行"],["ㄷ","t／d","語頭タ行、語中ダ行"],["ㄹ","r／l","語中はラ行、パッチムはル"],["ㅁ","m","マ行"],["ㅂ","p／b","語頭パ行、語中バ行"],["ㅅ","s","サ行。ㅣ系の前はシャ行"],["ㅇ","無音／ng","初声は無音、パッチムは[ン]"],["ㅈ","ch／j","語頭チャ行、語中ジャ行"],["ㅊ","ch","ㅈの激音。息を強く"],["ㅋ","k","ㄱの激音"],["ㅌ","t","ㄷの激音"],["ㅍ","p","ㅂの激音"],["ㅎ","h","ハ行。パッチムでは脱落・激音化"]];
const CT=[["ㄲ","ッカ","のどを詰めて出す濃音"],["ㄸ","ッタ","濃音"],["ㅃ","ッパ","濃音"],["ㅆ","ッサ","濃音"],["ㅉ","ッチャ","濃音"]];
const BAT=[["ㄱ ㄲ ㅋ ㄳ ㄺ","[ㄱ]","ク","학(ハク)・닭(タク)"],["ㄴ ㄵ ㄶ","[ㄴ]","ン","산(サン)・앉다(アンタ)"],["ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ","[ㄷ]","ッ","옷(オッ)・꽃(ッコッ)"],["ㄹ ㄼ ㄽ ㄾ ㅀ","[ㄹ]","ル","말(マル)・여덟(ヨドル)"],["ㅁ ㄻ","[ㅁ]","ム","밤(パム)"],["ㅂ ㅍ ㅄ ㄿ","[ㅂ]","プ","밥(パプ)・값(カプ)"],["ㅇ","[ㅇ]","ン","강(カン)"]];
const RULES=[["連音化","받침の次が母音(ㅇ)なら、받침が次の音節に移る","한국어"],["ㅎ脱落","받침ㅎ+母音でㅎが消える","좋아요"],["激音化","받침ㅎ/ㄱㄷㅂ+ㅎ → ㅋㅌㅍㅊ","입학"],["濃音化","받침[ㄱㄷㅂ]+ㄱㄷㅂㅅㅈ → 濃音に","식당"],["鼻音化","받침[ㄱㄷㅂ]+ㄴㅁ → ㅇㄴㅁ に変化","입니다"],["ㄹ同化","ㄴ+ㄹ / ㄹ+ㄴ → ㄹㄹ","신라면"],["口蓋音化","받침ㄷㅌ+이 → 지치","같이"]];
const CHO14="ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ".split("");
const JUNG10="ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ".split("");
const syl=(c,v)=>String.fromCharCode(0xAC00+(CHO.indexOf(c)*21+JUNG.indexOf(v))*28);
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ===== スタイル ===== */
const st=document.createElement("style");
st.textContent=`#v-hangul .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:6px}
#v-hangul .cell{background:var(--card2);border:1px solid var(--line);border-radius:10px;padding:8px 2px;text-align:center;cursor:pointer}
#v-hangul .cell .j{font-size:20px;font-weight:700}
#v-hangul .cell .r{font-size:11px;color:var(--warn);min-height:15px}
#v-hangul .ban{width:100%;border-collapse:collapse;font-size:13px;text-align:center}
#v-hangul .ban td,#v-hangul .ban th{border:1px solid var(--line);padding:4px 2px}
#v-hangul .ban td{cursor:pointer}
#v-hangul .ban td b{display:block;font-size:17px}
#v-hangul .ban td span{font-size:10px;color:var(--warn)}`;
document.head.appendChild(st);

/* ===== 画面生成 ===== */
const jamoCell=(a)=>`<div class="cell" data-r="${a[1]}"><div class="j">${a[0]}</div><div class="r"></div><div class="muted" style="font-size:10px">tap</div></div>`;
let ban='<table class="ban"><tr><th></th>'+JUNG10.map(v=>`<th>${v}</th>`).join("")+"</tr>";
CHO14.forEach(c=>{ban+=`<tr><th>${c}</th>`+JUNG10.map(v=>{const s=syl(c,v);return `<td data-k="${kana(s)}"><b>${s}</b><span></span></td>`;}).join("")+"</tr>";});
ban+="</table>";

const sec=document.createElement("section");
sec.id="v-hangul";sec.className="view";
sec.innerHTML=`
<div class="card"><h2>ハングルの仕組み</h2>
 <p class="muted">ハングルは「子音＋母音（＋パッチム）」を四角に組み合わせた音素文字です。組み方は4型だけです。</p>
 <table><tr><th>型</th><th>構成</th><th>例</th></tr>
 <tr><td>左右型</td><td>子音＋縦長母音(ㅏㅓㅣ等)</td><td>가 (ㄱ+ㅏ)</td></tr>
 <tr><td>上下型</td><td>子音＋横長母音(ㅗㅜㅡ等)</td><td>고 (ㄱ+ㅗ)</td></tr>
 <tr><td>左右＋下</td><td>＋パッチム</td><td>간 (ㄱ+ㅏ+ㄴ)</td></tr>
 <tr><td>上下＋下</td><td>＋パッチム</td><td>곤 (ㄱ+ㅗ+ㄴ)</td></tr></table>
 <p class="muted">母音だけの音は、子音の位置に無音の「ㅇ」を置きます（아＝ア、오＝オ）。</p></div>

<div class="card"><h2>基本母音 10（タップで読み表示）</h2><div class="grid">${VB.map(jamoCell).join("")}</div>
 <p class="muted" style="margin-top:8px">${VB.map(v=>v[0]+"…"+v[2]).join("／")}</p></div>

<div class="card"><h2>複合母音 11</h2><div class="grid">${VC.map(jamoCell).join("")}</div>
 <p class="muted" style="margin-top:8px">${VC.map(v=>v[0]+"…"+v[2]).join("／")}</p></div>

<div class="card"><h2>基本子音 14</h2><div class="grid">${CB.map(jamoCell).join("")}</div>
 <p class="muted" style="margin-top:8px">${CB.map(v=>v[0]+"…"+v[2]).join("／")}</p></div>

<div class="card"><h2>濃音 5（平音・激音との三系列）</h2><div class="grid">${CT.map(jamoCell).join("")}</div>
 <table style="margin-top:8px"><tr><th>平音</th><th>激音</th><th>濃音</th></tr>
 <tr><td>ㄱ 가</td><td>ㅋ 카</td><td>ㄲ 까</td></tr><tr><td>ㄷ 다</td><td>ㅌ 타</td><td>ㄸ 따</td></tr>
 <tr><td>ㅂ 바</td><td>ㅍ 파</td><td>ㅃ 빠</td></tr><tr><td>ㅈ 자</td><td>ㅊ 차</td><td>ㅉ 짜</td></tr>
 <tr><td>ㅅ 사</td><td>―</td><td>ㅆ 싸</td></tr></table>
 <p class="muted">平音＝軽く息を出す／激音＝強く息を出す／濃音＝息を止めて詰める。意味が変わるため聞き分けが必須です。</p></div>

<div class="card"><h2>반절표（가나다表・タップで読み）</h2><div style="overflow:auto">${ban}</div>
 <div class="row" style="margin-top:8px"><button id="h-allon">すべて表示</button><button id="h-alloff">すべて隠す</button></div></div>

<div class="card"><h2>パッチム（받침）7代表音</h2>
 <table><tr><th>綴り</th><th>代表音</th><th>カナ</th><th>例</th></tr>
 ${BAT.map(b=>`<tr><td>${b[0]}</td><td>${b[1]}</td><td>${b[2]}</td><td>${b[3]}</td></tr>`).join("")}</table>
 <p class="muted">27種のパッチムはすべてこの7音のどれかで発音されます。二重パッチムは片方だけが読まれます。</p></div>

<div class="card"><h2>発音変化の7規則</h2>
 <table><tr><th>規則</th><th>内容</th><th>例（実際の読み）</th></tr>
 ${RULES.map(r=>`<tr><td>${r[0]}</td><td class="muted">${r[1]}</td><td>${r[2]} → <span class="kana">${kana(r[2])}</span></td></tr>`).join("")}</table></div>

<div class="card"><h2>ハングル練習</h2>
 <div class="row"><button data-q="jamo">字母→読み</button><button data-q="syll">文字→カナ</button>
 <button data-q="rev">カナ→文字</button><button data-q="bat">パッチム発音</button></div>
 <p class="muted">10問ずつ出題。解答すると正解と読みを表示します。</p></div>
<div id="hBox"></div>`;
document.querySelector("main").appendChild(sec);

const nav=document.querySelector("nav");
const nb=document.createElement("button");
nb.dataset.v="hangul";nb.innerHTML='<i class="ic">🔤</i>ハングル';
nb.onclick=()=>go("hangul");
nav.insertBefore(nb,nav.children[1]);

/* ===== 字母カード・반절표の開閉 ===== */
sec.addEventListener("click",e=>{
  const c=e.target.closest("#v-hangul .cell");
  if(c){const r=c.querySelector(".r");r.textContent=r.textContent?"":c.dataset.r;return;}
  const td=e.target.closest("#v-hangul .ban td");
  if(td){const s=td.querySelector("span");s.textContent=s.textContent?"":td.dataset.k;}
});
sec.querySelector("#h-allon").onclick=()=>sec.querySelectorAll(".ban td").forEach(t=>t.querySelector("span").textContent=t.dataset.k);
sec.querySelector("#h-alloff").onclick=()=>sec.querySelectorAll(".ban td").forEach(t=>t.querySelector("span").textContent="");

/* ===== 練習問題 ===== */
const ALLJ=[...VB,...VC,...CB,...CT];
function make(type){
  const qs=[];
  if(type==="jamo"){
    sh(ALLJ).slice(0,10).forEach(x=>{
      const o=sh([x[1],...sh(ALLJ.filter(y=>y[1]!==x[1])).slice(0,3).map(y=>y[1])]);
      qs.push({q:"この字母の読みを選びなさい。",s:x[0],o,a:o.indexOf(x[1]),k:x[1],j:x[2]});});
  }else if(type==="syll"||type==="rev"){
    const pool=[];CHO14.forEach(c=>JUNG10.forEach(v=>pool.push(syl(c,v))));
    sh(pool).slice(0,10).forEach(s=>{
      const k=kana(s),w=sh(pool.filter(p=>kana(p)!==k)).slice(0,3);
      if(type==="syll"){const o=sh([k,...w.map(kana)]);
        qs.push({q:"この文字の読みを選びなさい。",s,o,a:o.indexOf(k),k,j:"子音＋母音の組み合わせ"});}
      else{const o=sh([s,...w]);
        qs.push({q:"この読みにあたる文字を選びなさい。",s:k,o,a:o.indexOf(s),k,j:"正答："+s});}});
  }else{
    const cand=WORDS.filter(w=>w.ko.length>=2&&w.ko.length<=4&&!/[ ]/.test(w.ko));
    sh(cand).slice(0,10).forEach(w=>{
      const o=sh([w.kana,...sh(cand.filter(x=>x.kana!==w.kana)).slice(0,3).map(x=>x.kana)]);
      qs.push({q:"発音変化に注意して正しい読みを選びなさい。",s:w.ko,o,a:o.indexOf(w.kana),k:w.kana,j:w.ja});});
  }
  return qs;
}
let done,cor,cur;
function render(qs){
  cur=qs;done=new Set();cor=0;
  document.getElementById("hBox").innerHTML=qs.map((x,i)=>
    `<div class="card" id="hq${i}"><div class="muted">第${i+1}問</div><div>${x.q}</div>
     <div class="passage" style="font-size:30px;text-align:center">${x.s}</div>
     ${x.o.map((o,j)=>`<button class="opt" data-i="${i}" data-j="${j}">${j+1}. ${o}</button>`).join("")}
     <div class="exp hide" id="he${i}"></div></div>`).join("")
    +`<div class="card"><b id="hscore">0 / ${qs.length} 正解</b></div>`;
  scrollTo(0,document.getElementById("hBox").offsetTop-60);
}
document.getElementById("hBox").addEventListener("click",e=>{
  const b=e.target.closest(".opt");if(!b)return;
  const i=+b.dataset.i,j=+b.dataset.j,x=cur[i];
  if(done.has(i))return;done.add(i);
  document.querySelectorAll(`#hq${i} .opt`).forEach((t,n)=>t.classList.add(n===x.a?"correct":(n===j?"wrong":"")));
  const ex=document.getElementById("he"+i);ex.classList.remove("hide");
  ex.innerHTML=`<b>${j===x.a?"○ 正解":"× 不正解"}</b>　正答：${x.a+1}<div class="kana">【読み】${x.k}</div><div class="ja">【補足】${x.j}</div>`;
  const s=LS.st;s.t++;if(j===x.a){s.c++;cor++;}LS.st=s;
  document.getElementById("hscore").textContent=`${cor} / ${cur.length} 正解`;
});
sec.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>render(make(b.dataset.q)));
})();