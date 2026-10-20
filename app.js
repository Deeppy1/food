(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const today = new Date();
  const localDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const database = [
    {name:"Banana",portion:"1 medium",kcal:105,protein:1.3,carbs:27,fat:.4},
    {name:"Apple",portion:"1 medium",kcal:95,protein:.5,carbs:25,fat:.3},
    {name:"Porridge oats",portion:"40 g dry",kcal:150,protein:5,carbs:24,fat:3},
    {name:"Semi-skimmed milk",portion:"200 ml",kcal:100,protein:7,carbs:10,fat:4},
    {name:"Egg",portion:"1 large",kcal:78,protein:6.3,carbs:.6,fat:5.3},
    {name:"Toast",portion:"1 slice",kcal:90,protein:3.5,carbs:17,fat:1.2},
    {name:"Chicken breast",portion:"100 g cooked",kcal:165,protein:31,carbs:0,fat:3.6},
    {name:"White rice",portion:"150 g cooked",kcal:195,protein:4,carbs:42,fat:.4},
    {name:"Pasta",portion:"150 g cooked",kcal:235,protein:8,carbs:46,fat:1.5},
    {name:"Baked potato",portion:"1 medium",kcal:160,protein:4,carbs:37,fat:.2},
    {name:"Broccoli",portion:"100 g",kcal:34,protein:2.8,carbs:7,fat:.4},
    {name:"Greek yoghurt",portion:"150 g plain",kcal:120,protein:15,carbs:6,fat:4},
    {name:"Peanut butter",portion:"15 g",kcal:90,protein:3.8,carbs:3,fat:7.5},
    {name:"Cheddar cheese",portion:"30 g",kcal:120,protein:7.5,carbs:.4,fat:10},
    {name:"Salmon",portion:"100 g cooked",kcal:206,protein:22,carbs:0,fat:12},
    {name:"Baked beans",portion:"150 g",kcal:120,protein:6,carbs:18,fat:.5},
    {name:"Orange juice",portion:"200 ml",kcal:90,protein:1.4,carbs:20,fat:.4},
    {name:"Almonds",portion:"20 g",kcal:116,protein:4.2,carbs:4.3,fat:10},
    {name:"Cheese sandwich",portion:"1 sandwich",kcal:350,protein:15,carbs:38,fat:15},
    {name:"Porridge with milk",portion:"1 bowl",kcal:250,protein:11,carbs:38,fat:6}
  ];
  let entries = loadEntries();
  function loadEntries() {
    try { const value = JSON.parse(localStorage.getItem("fuelDiaryV1") || "[]"); return Array.isArray(value) ? value : []; }
    catch { return []; }
  }
  function save() {
    try { localStorage.setItem("fuelDiaryV1", JSON.stringify(entries)); }
    catch { $("formMessage").textContent = "Couldn't save on this device. Try freeing browser storage."; }
  }
  function fmt(n) { return Number(n.toFixed(1)).toString(); }
  function forDay() { return entries.filter(e => e.date === $("dayPicker").value); }
  function totals(items, key) { return items.reduce((sum, item) => sum + item[key], 0); }
  function render() {
    const items = forDay();
    $("totalKcal").textContent = Math.round(totals(items,"kcal")).toLocaleString("en-GB");
    $("foodCount").textContent = items.length;
    const p = totals(items,"protein"), c = totals(items,"carbs"), f = totals(items,"fat");
    $("proteinValue").textContent = fmt(p)+" g";
    $("carbsValue").textContent = fmt(c)+" g";
    $("fatValue").textContent = fmt(f)+" g";
    const totalMacro = p+c+f;
    $("proteinBar").style.width = (totalMacro ? p/totalMacro*100 : 0)+"%";
    $("carbsBar").style.width = (totalMacro ? c/totalMacro*100 : 0)+"%";
    $("fatBar").style.width = (totalMacro ? f/totalMacro*100 : 0)+"%";
    $("diarySummary").textContent = items.length ? `${items.length} food ${items.length===1?"entry":"entries"} · ${Math.round(totals(items,"kcal"))} kcal logged` : "Nothing logged yet";
    const diary = $("diary"); diary.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div"); empty.className="empty";
      const emoji = document.createElement("span"); emoji.textContent="🥣";
      const title = document.createElement("h3"); title.textContent="Your diary starts here";
      const desc = document.createElement("p"); desc.textContent="Search for a food above to add your first entry.";
      empty.append(emoji,title,desc); diary.append(empty); return;
    }
    for (const meal of ["Breakfast","Lunch","Dinner","Snacks"]) {
      const group = items.filter(e => e.meal === meal); if (!group.length) continue;
      const heading = document.createElement("h3"); heading.className="meal-title"; heading.textContent=meal; diary.append(heading);
      for (const item of group) {
        const row=document.createElement("div"); row.className="food-row";
        const left=document.createElement("div");
        const name=document.createElement("div"); name.className="food-name"; name.textContent=item.name;
        const detail=document.createElement("div"); detail.className="food-detail"; detail.textContent=`${item.portion} · P ${fmt(item.protein)}g · C ${fmt(item.carbs)}g · F ${fmt(item.fat)}g`;
        left.append(name,detail);
        const right=document.createElement("div"); right.className="food-right";
        const kcal=document.createElement("div"); kcal.className="food-kcal"; kcal.textContent=`${Math.round(item.kcal)} kcal`;
        const remove=document.createElement("button"); remove.type="button"; remove.className="remove"; remove.textContent="Remove"; remove.setAttribute("aria-label",`Remove ${item.name}`);
        remove.addEventListener("click",()=>{entries=entries.filter(e=>e.id!==item.id);save();render();});
        right.append(kcal,remove); row.append(left,right); diary.append(row);
      }
    }
  }
  function showSuggestions() {
    const query=$("searchFood").value.trim().toLowerCase(), box=$("suggestions"); box.replaceChildren();
    if (!query) { const hint=document.createElement("span"); hint.className="food-detail"; hint.textContent="Popular: banana, oats, eggs, chicken"; box.append(hint); return; }
    const matches=database.filter(item=>item.name.toLowerCase().includes(query)).slice(0,8);
    if (!matches.length) { const hint=document.createElement("span"); hint.className="food-detail"; hint.textContent="No exact match — enter your own details below."; box.append(hint); return; }
    matches.forEach(item=>{
      const button=document.createElement("button"); button.type="button"; button.className="suggestion"; button.textContent=`${item.name} · ${item.kcal} kcal`;
      button.addEventListener("click",()=>{
        $("foodName").value=item.name; $("portion").value=item.portion; $("kcal").value=item.kcal;
        $("protein").value=item.protein; $("carbs").value=item.carbs; $("fat").value=item.fat;
        $("formMessage").textContent=`Selected ${item.name}. Check the portion and values before adding.`; $("foodName").focus();
      }); box.append(button);
    });
  }
  $("dayPicker").value=localDate(today);
  $("dayPicker").addEventListener("change",render);
  $("searchFood").addEventListener("input",showSuggestions);
  $("foodForm").addEventListener("submit",event=>{
    event.preventDefault();
    const name=$("foodName").value.trim();
    const fields=["kcal","protein","carbs","fat"];
    const values=fields.map(id=>Number($(id).value));
    if (!name || fields.some((id,i)=>$(id).value.trim()==="" || !Number.isFinite(values[i]) || values[i]<0) || values[0]>10000 || values.slice(1).some(v=>v>1000)) {
      $("formMessage").textContent="Enter a food name and valid non-negative nutrition values."; return;
    }
    entries.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),date:$("dayPicker").value,name,portion:$("portion").value.trim()||"1 serving",meal:$("meal").value,kcal:values[0],protein:values[1],carbs:values[2],fat:values[3]});
    save(); render(); $("foodForm").reset(); $("searchFood").value=""; $("formMessage").textContent="Added to your diary."; showSuggestions();
  });
  $("clearDay").addEventListener("click",()=>{
    const date=$("dayPicker").value, count=entries.filter(e=>e.date===date).length;
    if (!count) return;
    if (confirm(`Clear all ${count} entries for ${date}? This cannot be undone.`)) {entries=entries.filter(e=>e.date!==date);save();render();}
  });
  $("exportCsv").addEventListener("click",()=>{
    const headers=["Date","Meal","Food","Portion","Energy kcal","Protein g","Carbs g","Fat g"];
    const rows=entries.map(e=>[e.date,e.meal,e.name,e.portion,e.kcal,e.protein,e.carbs,e.fat]);
    const quote=value=>`"${String(value??"").replaceAll('"','""')}"`;
    const csv=[headers,...rows].map(row=>row.map(quote).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download="fuel-food-diary.csv";a.click();URL.revokeObjectURL(url);
  });
  showSuggestions(); render();
})();
