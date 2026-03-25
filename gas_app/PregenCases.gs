// =============================================
// PRE-GENERATED NAC-OSCE CASES (84 cases)
// Run populatePregenCases_() once from GAS editor to fill the sheet
// =============================================

function getPregenCase_(specialty) {
  var data = getSheetData_('PregenCases');
  if (!data || data.length === 0) return null;
  var matches = data.filter(function(r) { return r.Specialty === specialty; });
  if (matches.length === 0) matches = data; // fallback to any
  return matches[Math.floor(Math.random() * matches.length)];
}

function getPregenExam_(stationCount) {
  var data = getSheetData_('PregenCases');
  if (!data || data.length === 0) return null;
  // NAC blueprint: 3 Med, 2 Surg, 2 OB, 2 Peds, 1 Psych, 1 EM, 1 FM = 12
  var blueprint = [
    {cat:'Medicine',n:3},{cat:'Surgery',n:2},{cat:'OB/GYN',n:2},{cat:'Pediatrics',n:2},
    {cat:'Psychiatry',n:1},{cat:'Emergency',n:1},{cat:'Family Medicine',n:1}
  ];
  var multiplier = Math.max(1, Math.floor(stationCount / 12));
  var pool = {};
  data.forEach(function(r) { var c = r.Category || 'Medicine'; if (!pool[c]) pool[c] = []; pool[c].push(r); });
  // Shuffle each pool
  for (var k in pool) { for (var i = pool[k].length - 1; i > 0; i--) { var j = Math.floor(Math.random()*(i+1)); var t = pool[k][i]; pool[k][i] = pool[k][j]; pool[k][j] = t; } }
  var exam = [];
  for (var b = 0; b < blueprint.length; b++) {
    var cat = blueprint[b].cat;
    var need = blueprint[b].n * multiplier;
    var avail = pool[cat] || [];
    for (var p = 0; p < need && p < avail.length; p++) exam.push(avail[p]);
  }
  // Shuffle final exam order
  for (var i = exam.length - 1; i > 0; i--) { var j = Math.floor(Math.random()*(i+1)); var t = exam[i]; exam[i] = exam[j]; exam[j] = t; }
  return exam.slice(0, stationCount);
}

function populatePregenCases_() {
  var ss = SpreadsheetApp.openById(getConfig_().SHEET_ID);
  var sheet = ss.getSheetByName('PregenCases');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('PregenCases');

  var H = ['ID','Category','Specialty','Presentation','Focus','Setting','Name','Age','Sex','Ethnicity',
    'Appearance','Diagnosis','HR','SBP','DBP','RR','Temp','SpO2','Opening','DontMiss','Results'];
  sheet.appendRow(H);
  sheet.setFrozenRows(1);

  var C = PREGEN_CASES_;
  var rows = [];
  for (var i = 0; i < C.length; i++) {
    var c = C[i];
    rows.push([c.id,c.cat,c.spec,c.pres,c.focus,c.set,c.nm,c.age,c.sx,c.eth,
      c.ap,c.dx,c.hr,c.sbp,c.dbp,c.rr,c.tmp,c.o2,c.op,
      JSON.stringify(c.dm||[]),JSON.stringify(c.rs||{})]);
  }
  sheet.getRange(2,1,rows.length,H.length).setValues(rows);
  sheet.autoResizeColumns(1,H.length);
  return 'Populated ' + rows.length + ' cases';
}

// ---- 84 PRE-GENERATED CASES ----
var PREGEN_CASES_ = [

// ======================== MEDICINE (18) ========================
{id:1,cat:'Medicine',spec:'Cardiology',pres:'Chest Pain',focus:'ACS workup',set:'ED',
 nm:'Marcus Thompson',age:54,sx:'M',eth:'African-Canadian',
 ap:'Diaphoretic middle-aged man clutching his chest, appears anxious',
 dx:'ST-elevation myocardial infarction (STEMI)',
 hr:105,sbp:158,dbp:94,rr:22,tmp:37.1,o2:96,
 op:"Uh... hey doc, I— *grimaces* ...my chest, it's like something's squeezing it real hard. Started maybe an hour ago? I was just watching TV and then— ugh.",
 dm:['ACS: obtain ECG within 10 minutes','STEMI: activate cath lab immediately','Aspirin 160mg chewed STAT for all ACS'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 12.1 ×10⁹/L (4.5-11.0) ↑\nHgb: 148 g/L (130-170)\nPlt: 234 ×10⁹/L (150-400)',a:true},
  troponin:{n:'Troponin I (hs)',r:'hs-TnI: 892 ng/L (<14) ↑↑↑\nDelta at 3h: 2,450 ng/L',a:true},
  bmp:{n:'BMP',r:'Na: 139 mmol/L (136-145)\nK: 4.1 mmol/L (3.5-5.0)\nCr: 88 µmol/L (60-110)\nGlucose: 8.9 mmol/L (3.3-11.0) ↑',a:true},
  ecg:{n:'12-Lead ECG',r:'Rate 105, sinus tachycardia\nST elevation leads II, III, aVF (2-3mm)\nReciprocal ST depression I, aVL\nNo pathological Q waves',a:true},
  cxr:{n:'Chest X-ray',r:'Heart size normal\nNo pulmonary edema\nLungs clear\nNo pneumothorax',a:false},
  pe_cardiac:{n:'Cardiac Exam',r:'Tachycardic, regular rhythm\nS1/S2 normal, no murmurs, no S3/S4\nJVP not elevated\nNo peripheral edema',a:false},
  pe_resp:{n:'Respiratory Exam',r:'Clear to auscultation bilaterally\nNo crackles or wheezes\nEqual air entry',a:false}
}},

{id:2,cat:'Medicine',spec:'Cardiology',pres:'Chest Pain',focus:'ACS workup',set:'ED',
 nm:'Priya Sharma',age:67,sx:'F',eth:'South Asian-Canadian',
 ap:'Elderly woman sitting upright, mildly short of breath, rubbing her jaw',
 dx:'Non-ST elevation myocardial infarction (NSTEMI)',
 hr:92,sbp:144,dbp:88,rr:20,tmp:36.9,o2:95,
 op:"Well, I... it's not really pain, more like— uhm, a pressure? In my jaw and my— *gestures vaguely at chest* ...it's been on and off since this morning. My daughter made me come in.",
 dm:['Atypical ACS presentation in women and elderly','NSTEMI: serial troponins q3h','Anticoagulation + antiplatelet for NSTEMI'],
 rs:{
  troponin:{n:'Troponin I (hs)',r:'hs-TnI: 245 ng/L (<14) ↑↑\nDelta at 3h: 580 ng/L ↑↑',a:true},
  bmp:{n:'BMP',r:'Na: 141 mmol/L (136-145)\nK: 4.4 mmol/L (3.5-5.0)\nCr: 102 µmol/L (50-100) ↑\nGlucose: 7.2 mmol/L (3.3-11.0)',a:true},
  ecg:{n:'12-Lead ECG',r:'Rate 92, normal sinus rhythm\nST depression V4-V6 (1-2mm)\nT-wave inversions in lateral leads\nNo ST elevation',a:true},
  cbc:{n:'CBC',r:'WBC: 8.4 ×10⁹/L (4.5-11.0)\nHgb: 118 g/L (120-160) ↓\nPlt: 198 ×10⁹/L (150-400)',a:true},
  bnp:{n:'BNP',r:'NT-proBNP: 890 pg/mL (<300) ↑',a:true},
  cxr:{n:'Chest X-ray',r:'Mild cardiomegaly\nNo acute pulmonary edema\nSmall bilateral pleural effusions\nNo consolidation',a:true},
  pe_cardiac:{n:'Cardiac Exam',r:'Regular rate and rhythm\nSoft S4 gallop at apex\nGrade II/VI systolic murmur at RUSB\nMild bilateral ankle edema',a:true}
}},

{id:3,cat:'Medicine',spec:'Cardiology',pres:'Chest Pain',focus:'Non-cardiac DDx',set:'ED',
 nm:'Alexandre Tremblay',age:28,sx:'M',eth:'French-Canadian',
 ap:'Young man sitting forward, appears uncomfortable but not distressed',
 dx:'Acute pericarditis',
 hr:88,sbp:122,dbp:74,rr:18,tmp:38.2,o2:98,
 op:"So like, it's— it hurts right here *points to center of chest* but it's weird because it gets way worse when I lay down? And like, better when I lean forward. Started yesterday after I had that flu thing.",
 dm:['Pericarditis: pleuritic chest pain worse supine, better leaning forward','Pericardial friction rub is pathognomonic','ECG: diffuse ST elevation with PR depression'],
 rs:{
  troponin:{n:'Troponin I (hs)',r:'hs-TnI: 42 ng/L (<14) ↑\n(Mild elevation seen in myopericarditis)',a:true},
  ecg:{n:'12-Lead ECG',r:'Rate 88, normal sinus rhythm\nDiffuse ST elevation (concave up) in most leads\nPR depression in II, aVF, V4-V6\nNo reciprocal changes\nSpodick sign (downsloping TP segment)',a:true},
  cbc:{n:'CBC',r:'WBC: 11.8 ×10⁹/L (4.5-11.0) ↑\nHgb: 152 g/L (130-170)\nPlt: 267 ×10⁹/L (150-400)',a:true},
  crp:{n:'CRP / ESR',r:'CRP: 78 mg/L (<10) ↑↑\nESR: 45 mm/hr (0-20) ↑↑',a:true},
  cxr:{n:'Chest X-ray',r:'Heart size normal (no large effusion)\nLungs clear\nNo pneumothorax',a:false},
  pe_cardiac:{n:'Cardiac Exam',r:'Regular rate\nThree-component pericardial friction rub best heard at left sternal border with patient leaning forward\nNo murmurs',a:true}
}},

{id:4,cat:'Medicine',spec:'Respirology',pres:'Dyspnea',focus:'PE vs CHF vs pneumonia',set:'ED',
 nm:'Janet Williams',age:45,sx:'F',eth:'Anglo-Canadian',
 ap:'Anxious woman, tachypneic, clutching her left calf',
 dx:'Pulmonary embolism',
 hr:118,sbp:110,dbp:72,rr:28,tmp:37.3,o2:89,
 op:"I can't— I can't catch my breath. It just— it started like two hours ago out of nowhere and— *breathes rapidly* ...my leg's been hurting too, I dunno if that matters. I just got off a long flight yesterday.",
 dm:['Wells criteria for PE risk stratification','D-dimer to rule out if low probability','CTPA is gold standard for PE diagnosis','Anticoagulate before imaging if high suspicion'],
 rs:{
  ddimer:{n:'D-dimer',r:'D-dimer: 4,250 ng/mL FEU (<500) ↑↑↑',a:true},
  abg:{n:'ABG',r:'pH: 7.48 (7.35-7.45) ↑\npCO2: 28 mmHg (35-45) ↓\npO2: 62 mmHg (80-100) ↓\nHCO3: 22 mmol/L (22-26)\nA-a gradient: 38 (elevated)',a:true},
  troponin:{n:'Troponin I (hs)',r:'hs-TnI: 68 ng/L (<14) ↑\n(Right heart strain)',a:true},
  bnp:{n:'BNP',r:'NT-proBNP: 450 pg/mL (<300) ↑',a:true},
  ct_chest:{n:'CT Pulmonary Angiography',r:'Large saddle embolus at bifurcation of main pulmonary artery\nAdditional thrombus in right lower lobe segmental arteries\nRV/LV ratio 1.3 (>1.0 = RV strain)\nNo pleural effusion',a:true},
  us_leg:{n:'Lower Extremity Doppler US',r:'Non-compressible left popliteal vein\nEchogenic thrombus extending to distal femoral vein\nRight leg: normal, fully compressible veins',a:true},
  pe_resp:{n:'Respiratory Exam',r:'Tachypneic, using accessory muscles\nChest clear to auscultation\nNo wheezes or crackles\nLeft calf swollen, tender, erythematous, positive Homan sign',a:true}
}},

{id:5,cat:'Medicine',spec:'Respirology',pres:'Dyspnea',focus:'COPD exacerbation',set:'ED',
 nm:'Robert MacLeod',age:71,sx:'M',eth:'Scottish-Canadian',
 ap:'Elderly man sitting tripod position, pursed lip breathing, barrel chest',
 dx:'Acute exacerbation of COPD',
 hr:98,sbp:148,dbp:82,rr:26,tmp:37.8,o2:86,
 op:"*coughing* ...can't... breathe, doc. It's been getting worse all week. More gunk than usual— green, thick stuff. *wheeze* I ran out of my puffers three days ago.",
 dm:['COPD exacerbation: increased dyspnea + sputum volume + sputum purulence','ABG to assess for hypercapnic respiratory failure','Non-invasive ventilation (BiPAP) if pH <7.35 with hypercapnia'],
 rs:{
  abg:{n:'ABG',r:'pH: 7.32 (7.35-7.45) ↓\npCO2: 58 mmHg (35-45) ↑↑\npO2: 54 mmHg (80-100) ↓↓\nHCO3: 30 mmol/L (22-26) ↑\n(Acute on chronic respiratory acidosis)',a:true},
  cbc:{n:'CBC',r:'WBC: 14.2 ×10⁹/L (4.5-11.0) ↑\nHgb: 168 g/L (130-170)\nPlt: 312 ×10⁹/L (150-400)',a:true},
  cxr:{n:'Chest X-ray',r:'Hyperinflated lungs, flattened diaphragms\nIncreased AP diameter\nNo focal consolidation\nNo pneumothorax\nSmall bullae in bilateral apices',a:true},
  bmp:{n:'BMP',r:'Na: 138 mmol/L (136-145)\nK: 4.8 mmol/L (3.5-5.0)\nCr: 95 µmol/L (60-110)\nGlucose: 6.1 mmol/L (3.3-11.0)',a:false},
  pe_resp:{n:'Respiratory Exam',r:'Barrel chest, accessory muscle use, pursed lip breathing\nDiffuse expiratory wheezes bilaterally\nProlonged expiratory phase\nDecreased air entry globally\nNo crackles',a:true}
}},

{id:6,cat:'Medicine',spec:'Respirology',pres:'Dyspnea',focus:'Decompensated CHF',set:'ED',
 nm:'Olga Petrenko',age:78,sx:'F',eth:'Ukrainian-Canadian',
 ap:'Elderly woman in obvious respiratory distress, unable to lie flat, frothy sputum',
 dx:'Acute decompensated heart failure with pulmonary edema',
 hr:112,sbp:178,dbp:96,rr:32,tmp:36.8,o2:84,
 op:"I... I can't lay down, doc. Every time I try to sleep I wake up— *gasping* —choking. My legs, they're so swollen... it's been getting worse for a week. I've been sleeping in my chair.",
 dm:['Acute pulmonary edema: sit upright, O2, IV furosemide, nitro if SBP >100','BNP >400 strongly suggests CHF','Urgent echo for new-onset or worsening CHF'],
 rs:{
  bnp:{n:'BNP',r:'NT-proBNP: 8,450 pg/mL (<300 age-adjusted) ↑↑↑',a:true},
  cxr:{n:'Chest X-ray',r:'Cardiomegaly (CTR >0.5)\nBilateral pulmonary edema — cephalization of vessels\nKerley B lines\nBilateral pleural effusions (R>L)\nAlveolar edema in perihilar distribution (butterfly pattern)',a:true},
  bmp:{n:'BMP',r:'Na: 132 mmol/L (136-145) ↓\nK: 5.1 mmol/L (3.5-5.0) ↑\nCr: 145 µmol/L (50-100) ↑↑\nBUN/Urea: 12.4 mmol/L (2.5-8.0) ↑\nGlucose: 6.8 mmol/L',a:true},
  troponin:{n:'Troponin I (hs)',r:'hs-TnI: 35 ng/L (<14) ↑\n(Demand ischemia from volume overload)',a:true},
  ecg:{n:'12-Lead ECG',r:'Rate 112, sinus tachycardia\nLeft ventricular hypertrophy by voltage criteria\nLateral ST-T changes (strain pattern)\nNo acute ST elevation',a:true},
  pe_cardiac:{n:'Cardiac Exam',r:'Tachycardic, irregularly irregular (new AF?)\nS3 gallop present\nLoud P2\nJVP elevated to angle of jaw\n3+ bilateral pitting edema to knees',a:true},
  pe_resp:{n:'Respiratory Exam',r:'Tachypneic, using accessory muscles\nBibasilar crackles extending to mid-lung fields\nDecreased air entry at bases\nDull to percussion at bases bilaterally',a:true}
}},

{id:7,cat:'Medicine',spec:'GI / Hepatology',pres:'Abdominal Pain',focus:'Acute abdomen DDx',set:'ED',
 nm:'Fatima Al-Hassan',age:42,sx:'F',eth:'Iraqi-Canadian',
 ap:'Woman lying still, knees drawn up, grimacing with any movement',
 dx:'Acute cholecystitis',
 hr:96,sbp:134,dbp:78,rr:18,tmp:38.4,o2:98,
 op:"The pain is... *winces* ...right here. *points to right upper abdomen* It started after dinner last night and it just— it won't go away. I feel nauseous too. Uhm... I had something like this before but it went away on its own.",
 dm:['Murphy sign positive = cholecystitis until proven otherwise','RUQ US is first-line imaging for biliary disease','Cholecystitis: NPO + IV fluids + antibiotics + surgical consult'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 15.8 ×10⁹/L (4.5-11.0) ↑↑\nHgb: 132 g/L (120-160)\nPlt: 289 ×10⁹/L (150-400)\nNeutrophils: 84% ↑',a:true},
  lfts:{n:'Liver Function Tests',r:'ALT: 68 U/L (7-56) ↑\nAST: 54 U/L (10-40) ↑\nALP: 165 U/L (44-147) ↑\nGGT: 78 U/L (0-45) ↑\nTotal Bili: 28 µmol/L (3.4-20.5) ↑\nDirect Bili: 12 µmol/L (0-5.1) ↑',a:true},
  lipase:{n:'Lipase',r:'Lipase: 45 U/L (0-160)\n(Normal — rules out pancreatitis)',a:false},
  us_abd:{n:'RUQ Ultrasound',r:'Gallbladder distended, wall thickened (6mm, normal <3mm)\nMultiple gallstones, largest 1.8cm\nPositive sonographic Murphy sign\nPericholecystic fluid present\nCBD: 5mm (normal <6mm)\nNo intrahepatic duct dilation',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Soft but tender RUQ with voluntary guarding\nPositive Murphy sign (inspiratory arrest with RUQ palpation)\nNo rebound tenderness\nNo distension\nBowel sounds present',a:true}
}},

{id:8,cat:'Medicine',spec:'GI / Hepatology',pres:'Abdominal Pain',focus:'Pancreatitis',set:'ED',
 nm:'Derek Okafor',age:48,sx:'M',eth:'Nigerian-Canadian',
 ap:'Man writhing on stretcher, unable to find comfortable position, appears toxic',
 dx:'Acute pancreatitis (gallstone)',
 hr:108,sbp:128,dbp:76,rr:22,tmp:38.1,o2:96,
 op:"Doc, this pain is— it's the worst thing I've ever felt. Right here, goes straight through to my back. *groans* I've been throwing up all morning. I can't— I can't eat, I can't drink, I can't do anything.",
 dm:['Pancreatitis: lipase >3x ULN is diagnostic','Ranson criteria / BISAP for severity','Aggressive IV fluid resuscitation + pain control + NPO'],
 rs:{
  lipase:{n:'Lipase',r:'Lipase: 1,840 U/L (0-160) ↑↑↑\n(>3x upper limit = diagnostic for pancreatitis)',a:true},
  cbc:{n:'CBC',r:'WBC: 16.4 ×10⁹/L (4.5-11.0) ↑↑\nHgb: 156 g/L (130-170)\nPlt: 198 ×10⁹/L (150-400)\nHematocrit: 0.48 (0.40-0.54)',a:true},
  bmp:{n:'BMP',r:'Na: 136 mmol/L (136-145)\nK: 3.8 mmol/L (3.5-5.0)\nCr: 118 µmol/L (60-110) ↑\nCa: 1.95 mmol/L (2.15-2.55) ↓\nGlucose: 12.4 mmol/L (3.3-11.0) ↑',a:true},
  lfts:{n:'LFTs',r:'ALT: 185 U/L (7-56) ↑↑↑\nAST: 142 U/L (10-40) ↑↑↑\nALP: 210 U/L (44-147) ↑\nTotal Bili: 42 µmol/L (3.4-20.5) ↑↑',a:true},
  ct_abd:{n:'CT Abdomen with Contrast',r:'Diffusely edematous pancreas with peripancreatic fat stranding\nSmall peripancreatic fluid collection\nNo pancreatic necrosis\nGallstones in gallbladder\nCBD 8mm (mildly dilated)',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Epigastric tenderness with guarding\nDistended abdomen\nDecreased bowel sounds\nNo peritoneal signs\nNo Grey Turner or Cullen sign',a:true}
}},

{id:9,cat:'Medicine',spec:'Neurology',pres:'Headache',focus:'Red flags, SAH rule-out',set:'ED',
 nm:'Sarah Chen',age:38,sx:'F',eth:'Chinese-Canadian',
 ap:'Woman lying in dark room, eyes closed, holding head, photophobic',
 dx:'Subarachnoid hemorrhage',
 hr:94,sbp:172,dbp:98,rr:16,tmp:37.0,o2:99,
 op:"This is the worst headache of my entire life. It just— it hit me like a thunderclap while I was at work. Like someone hit me with a bat in the back of my head. I've never... *squints* ...can you turn the lights down? Everything is so bright.",
 dm:['Thunderclap headache = SAH until proven otherwise','CT head within 6h has ~98% sensitivity for SAH','LP required if CT negative and SAH suspected','Do NOT give anticoagulants until SAH ruled out'],
 rs:{
  ct_head:{n:'CT Head without Contrast',r:'Hyperdense material in basal cisterns and Sylvian fissures bilaterally\nConsistent with acute subarachnoid hemorrhage\nNo intraparenchymal hemorrhage\nNo hydrocephalus\nNo midline shift',a:true},
  cbc:{n:'CBC',r:'WBC: 9.2 ×10⁹/L (4.5-11.0)\nHgb: 138 g/L (120-160)\nPlt: 245 ×10⁹/L (150-400)',a:false},
  bmp:{n:'BMP',r:'Na: 140 mmol/L (136-145)\nK: 4.0 mmol/L (3.5-5.0)\nCr: 72 µmol/L (50-100)\nGlucose: 7.8 mmol/L (3.3-11.0)',a:false},
  inr:{n:'Coagulation',r:'INR: 1.0 (0.9-1.1)\nPTT: 28 sec (25-35)',a:false},
  pe_neuro:{n:'Neurological Exam',r:'GCS 14 (E3V5M6)\nPhotophobia, neck stiffness\nKernig sign positive\nNo focal neurological deficits\nPupils equal and reactive\nFundoscopy: subhyaloid hemorrhage left eye',a:true}
}},

{id:10,cat:'Medicine',spec:'Neurology',pres:'Headache',focus:'Migraine assessment',set:'Clinic',
 nm:'Emma Blackwood',age:32,sx:'F',eth:'Anglo-Canadian',
 ap:'Young woman with sunglasses on indoors, appears fatigued but not acutely ill',
 dx:'Migraine with aura',
 hr:72,sbp:118,dbp:72,rr:14,tmp:36.8,o2:99,
 op:"I've been getting these headaches for like... years, but they're getting worse. This one— uhm, it started with these weird zigzag lines in my vision? Then the pain hit on the left side, pounding, made me puke twice. Light makes it so much worse.",
 dm:['Migraine with aura: rule out secondary causes if new-onset or change in pattern','Red flags (SNOOP): Systemic, Neurologic, Onset sudden, Older, Progressive','Triptans contraindicated in hemiplegic migraine and vascular disease'],
 rs:{
  ct_head:{n:'CT Head',r:'No acute intracranial abnormality\nNo mass, hemorrhage, or hydrocephalus\nNormal grey-white differentiation',a:false},
  cbc:{n:'CBC',r:'WBC: 6.8 ×10⁹/L (4.5-11.0)\nHgb: 128 g/L (120-160)\nPlt: 220 ×10⁹/L (150-400)',a:false},
  pe_neuro:{n:'Neurological Exam',r:'GCS 15, alert and oriented ×3\nCranial nerves II-XII intact\nVisual fields full\nNo papilledema on fundoscopy\nMotor strength 5/5 throughout\nSensation intact\nCoordination normal',a:false}
}},

{id:11,cat:'Medicine',spec:'Endocrinology',pres:'Polyuria/Polydipsia',focus:'DKA',set:'ED',
 nm:'Jayden Moore',age:19,sx:'M',eth:'Anglo-Canadian',
 ap:'Thin young man, Kussmaul breathing, fruity breath odor, appears dehydrated',
 dx:'Diabetic ketoacidosis (new-onset Type 1 DM)',
 hr:122,sbp:98,dbp:58,rr:32,tmp:37.0,o2:98,
 op:"I've been peeing like crazy for— I dunno, maybe a few weeks? And I'm so thirsty I can't stop drinking. I've lost like 15 pounds without trying. Today I started throwing up and I just feel... really bad. Like, really really bad.",
 dm:['DKA triad: hyperglycemia + ketosis + acidosis','Aggressive fluid resuscitation + insulin drip + K+ monitoring','Monitor potassium before starting insulin — hypokalemia kills','Look for precipitant: infection, non-compliance, new-onset'],
 rs:{
  bmp:{n:'BMP',r:'Na: 131 mmol/L (136-145) ↓ (corrected Na: 139)\nK: 5.4 mmol/L (3.5-5.0) ↑\nCl: 98 mmol/L (98-106)\nCO₂: 10 mmol/L (22-29) ↓↓↓\nBUN/Urea: 10.2 mmol/L (2.5-8.0) ↑\nCr: 132 µmol/L (60-110) ↑\nGlucose: 32.4 mmol/L (3.3-11.0) ↑↑↑\nAnion gap: 23 (8-12) ↑↑',a:true},
  abg:{n:'ABG (Venous)',r:'pH: 7.14 (7.35-7.45) ↓↓↓\npCO₂: 18 mmHg (35-45) ↓↓\nHCO₃: 8 mmol/L (22-26) ↓↓↓\nLactate: 2.8 mmol/L (0.5-2.0) ↑',a:true},
  ua:{n:'Urinalysis',r:'Glucose: 4+ ↑↑↑\nKetones: 3+ ↑↑↑\nSpecific gravity: 1.035 ↑\npH: 5.0\nNo WBC, no nitrites, no bacteria',a:true},
  cbc:{n:'CBC',r:'WBC: 14.8 ×10⁹/L (4.5-11.0) ↑ (stress response)\nHgb: 162 g/L (130-170) (hemoconcentration)\nPlt: 298 ×10⁹/L (150-400)',a:true},
  hba1c:{n:'HbA1c',r:'HbA1c: 12.8% (4.0-6.0) ↑↑↑\n(Indicates prolonged undiagnosed hyperglycemia)',a:true},
  pe_general:{n:'General Exam',r:'Cachectic young man, Kussmaul respirations (deep, rapid)\nFruity/acetone breath odor\nDry mucous membranes, poor skin turgor\nSunken eyes\nCapillary refill 4 seconds',a:true}
}},

{id:12,cat:'Medicine',spec:'Endocrinology',pres:'Polyuria/Polydipsia',focus:'Thyroid storm',set:'ED',
 nm:'Meera Patel',age:34,sx:'F',eth:'South Asian-Canadian',
 ap:'Agitated young woman, diaphoretic, tremulous, exophthalmos noted',
 dx:'Thyrotoxicosis / Graves disease',
 hr:132,sbp:158,dbp:62,rr:22,tmp:38.6,o2:98,
 op:"I can't— I can't sit still, doc. My heart is racing, I'm sweating through everything, I've lost weight even though I'm eating MORE. And my eyes— my husband says they look... bulgy? I feel like I'm going crazy.",
 dm:['Graves: TSH suppressed + elevated free T4 + TSI positive','Thyroid storm: Burch-Wartofsky score for severity','Beta-blocker for rate control, PTU or methimazole, hydrocortisone'],
 rs:{
  tsh:{n:'Thyroid Panel',r:'TSH: <0.01 mIU/L (0.4-4.0) ↓↓↓\nFree T4: 68 pmol/L (12-22) ↑↑↑\nFree T3: 18.2 pmol/L (3.1-6.8) ↑↑↑\nTSI: Positive',a:true},
  cbc:{n:'CBC',r:'WBC: 5.2 ×10⁹/L (4.5-11.0)\nHgb: 124 g/L (120-160)\nPlt: 178 ×10⁹/L (150-400)',a:false},
  bmp:{n:'BMP',r:'Na: 140 mmol/L (136-145)\nK: 3.4 mmol/L (3.5-5.0) ↓\nCa: 2.62 mmol/L (2.15-2.55) ↑\nGlucose: 8.2 mmol/L',a:true},
  ecg:{n:'12-Lead ECG',r:'Rate 132, sinus tachycardia\nNo ST changes\nShort PR interval\nNormal QTc',a:true},
  pe_general:{n:'General/Thyroid Exam',r:'Anxious, diaphoretic, fine tremor of outstretched hands\nExophthalmos with lid lag bilaterally\nDiffuse, non-tender goiter with audible bruit\nWarm, moist skin\nHyperreflexia throughout\nProximal muscle weakness',a:true}
}},

{id:13,cat:'Medicine',spec:'MSK / Rheumatology',pres:'Joint Pain',focus:'Septic vs crystal',set:'ED',
 nm:'William Redbird',age:62,sx:'M',eth:'Indigenous Canadian',
 ap:'Man holding right knee, unable to bear weight, knee visibly swollen and erythematous',
 dx:'Septic arthritis (right knee)',
 hr:102,sbp:138,dbp:82,rr:18,tmp:39.1,o2:97,
 op:"My knee— I can't put any weight on it. It started swelling up yesterday and now I can barely move it. *winces when touched* Don't— don't bend it, please. I had a cut on my leg last week, maybe that's... I dunno.",
 dm:['Hot, swollen joint + fever = septic arthritis until proven otherwise','Arthrocentesis BEFORE antibiotics (but don\'t delay ABx if tap delayed)','WBC >50,000 in aspirate strongly suggests septic joint','Staph aureus is most common organism'],
 rs:{
  joint:{n:'Synovial Fluid Analysis',r:'Appearance: Turbid, yellow-green\nWBC: 78,000/µL (normal <200) ↑↑↑\nNeutrophils: 92%\nGram stain: Gram-positive cocci in clusters\nCrystals: None\nCulture: Pending',a:true},
  cbc:{n:'CBC',r:'WBC: 18.2 ×10⁹/L (4.5-11.0) ↑↑\nHgb: 128 g/L (130-170) ↓\nPlt: 402 ×10⁹/L (150-400) ↑',a:true},
  crp:{n:'CRP / ESR',r:'CRP: 185 mg/L (<10) ↑↑↑\nESR: 72 mm/hr (0-20) ↑↑↑',a:true},
  blood_cx:{n:'Blood Cultures',r:'(Pending — results in 24-48h)\nPreliminary at 12h: Growth in 2/2 bottles — gram-positive cocci in clusters',a:true},
  xray_knee:{n:'X-ray Right Knee',r:'Joint effusion with soft tissue swelling\nNo fracture\nMild degenerative changes\nNo osteomyelitis features',a:true},
  pe_msk:{n:'MSK Exam (Right Knee)',r:'Markedly swollen, warm, erythematous\nLarge effusion with positive ballottement\nExtremely tender to palpation\nRange of motion severely limited by pain (20° flexion max)\nUnable to bear weight\nNo cellulitis tracking proximally',a:true}
}},

{id:14,cat:'Medicine',spec:'MSK / Rheumatology',pres:'Joint Pain',focus:'Crystal arthropathy',set:'ED',
 nm:'Giovanni Moretti',age:58,sx:'M',eth:'Italian-Canadian',
 ap:'Overweight man with right foot elevated, toe wrapped, in obvious pain',
 dx:'Acute gout (podagra)',
 hr:84,sbp:142,dbp:88,rr:16,tmp:37.4,o2:98,
 op:"My big toe is— I swear to god, doc, even the bedsheet touching it makes me want to scream. It happened overnight, I went to bed fine and woke up at 3am and it was— *exhales* ...I couldn't even walk to the bathroom. It's happened before but never this bad.",
 dm:['Gout: monosodium urate crystals — negatively birefringent under polarized light','Don\'t check uric acid during acute flare (may be falsely normal)','NSAIDs or colchicine for acute flare, NOT allopurinol (can worsen acute attack)'],
 rs:{
  joint:{n:'Synovial Fluid Analysis (1st MTP)',r:'Appearance: Cloudy, yellow\nWBC: 22,000/µL ↑↑\nNeutrophils: 80%\nCrystals: Needle-shaped, negatively birefringent (monosodium urate)\nGram stain: No organisms\nCulture: No growth',a:true},
  uric:{n:'Uric Acid',r:'Uric acid: 520 µmol/L (200-430) ↑\n(Note: may be normal during acute flare)',a:true},
  crp:{n:'CRP',r:'CRP: 45 mg/L (<10) ↑↑',a:true},
  bmp:{n:'BMP',r:'Na: 141 mmol/L (136-145)\nK: 4.2 mmol/L (3.5-5.0)\nCr: 128 µmol/L (60-110) ↑\neGFR: 52 mL/min ↓',a:true},
  xray_foot:{n:'X-ray Right Foot',r:'Soft tissue swelling around 1st MTP joint\nPunched-out erosion with overhanging edge at 1st MTP\nNo fracture\nMild degenerative changes',a:true},
  pe_msk:{n:'MSK Exam (Right Foot)',r:'1st MTP joint erythematous, hot, exquisitely tender\nSevere pain with passive ROM\nUnable to dorsiflex great toe\nNo ulceration or skin breakdown\nTophus noted on left ear helix',a:true}
}},

{id:15,cat:'Medicine',spec:'Nephrology / Urology',pres:'Hematuria',focus:'Renal calculi',set:'ED',
 nm:'Tariq Hassan',age:35,sx:'M',eth:'Lebanese-Canadian',
 ap:'Young man pacing and writhing, cannot sit still, holding left flank',
 dx:'Left ureteral calculus (renal colic)',
 hr:98,sbp:148,dbp:86,rr:20,tmp:37.0,o2:99,
 op:"The pain is— *groans* —it comes in waves, right here in my side, goes down to my— uhm, my groin. I can't find a position that helps. And I peed blood this morning. My dad had kidney stones so maybe that's... ugh, another wave.",
 dm:['Renal colic: CT KUB without contrast is gold standard','Stones <5mm usually pass spontaneously','Hydration + NSAIDs (ketorolac) first-line for pain','Urology consult for stones >10mm, obstruction, or infection'],
 rs:{
  ua:{n:'Urinalysis',r:'Color: Dark amber\nBlood: 3+ ↑↑\nRBC: >100/HPF ↑↑↑\nWBC: 2/HPF\nNitrites: Negative\npH: 5.5\nNo casts',a:true},
  bmp:{n:'BMP',r:'Na: 140 mmol/L (136-145)\nK: 4.0 mmol/L (3.5-5.0)\nCr: 95 µmol/L (60-110)\nCa: 2.45 mmol/L (2.15-2.55)',a:false},
  cbc:{n:'CBC',r:'WBC: 9.8 ×10⁹/L (4.5-11.0)\nHgb: 152 g/L (130-170)\nPlt: 234 ×10⁹/L (150-400)',a:false},
  ct_abd:{n:'CT KUB (Non-contrast)',r:'7mm obstructing calculus at left ureterovesical junction\nModerate left hydronephrosis and hydroureter\nPerinephric fat stranding on left\nRight kidney normal, no stones\nNo other abnormality',a:true},
  pe_abd:{n:'Abdominal/Flank Exam',r:'Left CVA tenderness on percussion\nAbdomen soft, non-tender, non-distended\nNo peritoneal signs\nBowel sounds present\nTesticular exam normal bilaterally',a:true}
}},

{id:16,cat:'Medicine',spec:'Infectious Disease',pres:'Fever',focus:'Sepsis workup',set:'ED',
 nm:'Agnes Beaumont',age:82,sx:'F',eth:'French-Canadian',
 ap:'Elderly woman, confused, flushed, tachypneic, urine bag on stretcher is cloudy',
 dx:'Urosepsis (E. coli bacteremia from UTI)',
 hr:118,sbp:86,dbp:52,rr:24,tmp:39.4,o2:92,
 op:"*Mom says:* She's been confused since yesterday, not herself at all. She was fine on Monday. Keeps saying weird things. *to patient:* Mom, talk to the doctor. *Patient mumbles:* ...where am I? Is it Tuesday? I need to feed the cat...",
 dm:['Sepsis: qSOFA ≥2 (altered mentation + SBP ≤100 + RR ≥22)','Blood cultures BEFORE antibiotics but do NOT delay ABx','Hour-1 bundle: cultures, lactate, broad-spectrum ABx, 30mL/kg crystalloid','UTI is most common source of sepsis in elderly women'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 22.4 ×10⁹/L (4.5-11.0) ↑↑↑\nHgb: 108 g/L (120-160) ↓\nPlt: 98 ×10⁹/L (150-400) ↓↓\nBands: 18% ↑↑ (left shift)',a:true},
  bmp:{n:'BMP',r:'Na: 148 mmol/L (136-145) ↑\nK: 5.2 mmol/L (3.5-5.0) ↑\nCr: 198 µmol/L (50-100) ↑↑↑ (baseline 85)\nBUN/Urea: 18.5 mmol/L (2.5-8.0) ↑↑\nGlucose: 9.8 mmol/L\nLactate: 4.8 mmol/L (0.5-2.0) ↑↑↑',a:true},
  ua:{n:'Urinalysis',r:'Appearance: Cloudy\nWBC: >100/HPF ↑↑↑\nNitrites: Positive ↑\nLeukocyte esterase: 3+ ↑↑\nBacteria: Many\nRBC: 5-10/HPF',a:true},
  blood_cx:{n:'Blood Cultures',r:'(Pending)\nPreliminary 8h: 2/2 bottles growing gram-negative rods',a:true},
  cxr:{n:'Chest X-ray',r:'No consolidation\nNo pleural effusion\nHeart size normal\nDegenerative spine changes',a:false},
  pe_general:{n:'General Exam',r:'Confused (GCS 13: E3V4M6), not oriented to time/place\nFlushed, diaphoretic\nDry mucous membranes, poor skin turgor\nSuprapubic tenderness on palpation\nNo meningeal signs\nNo skin rash',a:true}
}},

{id:17,cat:'Medicine',spec:'Cardiology',pres:'Peripheral Edema',focus:'CHF assessment',set:'Clinic',
 nm:'Harold Fung',age:68,sx:'M',eth:'Chinese-Canadian',
 ap:'Overweight man, mildly short of breath at rest, bilateral leg swelling visible',
 dx:'New diagnosis of congestive heart failure (HFrEF)',
 hr:88,sbp:152,dbp:92,rr:20,tmp:36.9,o2:94,
 op:"My legs, doc— they've been swelling up for... maybe a month now? My shoes don't fit anymore. And I get winded going up stairs, which is new. I've been sleeping with two pillows because— well, I can't breathe flat anymore.",
 dm:['CHF: orthopnea + PND + peripheral edema — get BNP + echo','New CHF: investigate etiology (ischemic, valvular, HTN, alcohol)','ACEi/ARB + beta-blocker + diuretic — cornerstone of HFrEF therapy'],
 rs:{
  bnp:{n:'BNP',r:'NT-proBNP: 4,200 pg/mL (<300) ↑↑↑',a:true},
  cxr:{n:'Chest X-ray',r:'Cardiomegaly\nUpper lobe pulmonary venous congestion\nSmall bilateral pleural effusions\nNo consolidation',a:true},
  ecg:{n:'12-Lead ECG',r:'Rate 88, normal sinus rhythm\nLVH by voltage criteria\nNon-specific ST-T changes\nQ waves in III, aVF (old inferior MI?)',a:true},
  echo:{n:'Echocardiogram',r:'LV severely dilated\nEjection fraction: 25% (normal >55%) ↓↓↓\nGlobal hypokinesis\nInferior wall akinesis\nMild mitral regurgitation\nEstimated PASP: 45 mmHg ↑',a:true},
  bmp:{n:'BMP',r:'Na: 134 mmol/L (136-145) ↓\nK: 4.8 mmol/L (3.5-5.0)\nCr: 125 µmol/L (60-110) ↑\neGFR: 48 mL/min ↓\nGlucose: 6.5 mmol/L',a:true},
  pe_cardiac:{n:'Cardiac Exam',r:'Displaced PMI (6th intercostal space, anterior axillary line)\nS3 gallop present\nGrade II/VI holosystolic murmur at apex\nJVP elevated 8cm above sternal angle\n2+ pitting edema bilateral lower extremities to mid-shin',a:true}
}},

{id:18,cat:'Medicine',spec:'GI / Hepatology',pres:'Jaundice',focus:'Obstructive vs hepatic',set:'ED',
 nm:'Sonia Mikhailova',age:55,sx:'F',eth:'Russian-Canadian',
 ap:'Jaundiced woman with scleral icterus, scratching her arms, appears uncomfortable',
 dx:'Choledocholithiasis with cholangitis (Charcot triad)',
 hr:104,sbp:132,dbp:74,rr:18,tmp:39.2,o2:97,
 op:"I turned yellow— my daughter noticed it first. My eyes, my skin... everything. And I've been itching like crazy all over. The pain in my stomach comes and goes, uhm, up here on the right side. And I've had fevers for two days.",
 dm:['Charcot triad: fever + jaundice + RUQ pain = ascending cholangitis','Reynolds pentad: add AMS + hypotension = severe cholangitis','ERCP urgently for cholangitis, not just surgery','Broad-spectrum antibiotics covering gram-negatives and anaerobes'],
 rs:{
  lfts:{n:'LFTs',r:'ALT: 245 U/L (7-56) ↑↑↑\nAST: 198 U/L (10-40) ↑↑↑\nALP: 520 U/L (44-147) ↑↑↑↑\nGGT: 380 U/L (0-45) ↑↑↑↑\nTotal Bili: 125 µmol/L (3.4-20.5) ↑↑↑↑\nDirect Bili: 98 µmol/L (0-5.1) ↑↑↑↑',a:true},
  cbc:{n:'CBC',r:'WBC: 19.8 ×10⁹/L (4.5-11.0) ↑↑\nHgb: 122 g/L (120-160)\nPlt: 178 ×10⁹/L (150-400)',a:true},
  inr:{n:'Coagulation',r:'INR: 1.4 (0.9-1.1) ↑\nPTT: 38 sec (25-35) ↑',a:true},
  lipase:{n:'Lipase',r:'Lipase: 85 U/L (0-160)\n(Normal — not pancreatitis)',a:false},
  us_abd:{n:'RUQ Ultrasound',r:'CBD dilated at 12mm (normal <6mm) ↑↑\nShadowing stone in distal CBD\nIntrahepatic duct dilation\nGallbladder contains multiple stones\nGallbladder wall not thickened',a:true},
  blood_cx:{n:'Blood Cultures',r:'(Pending)\nPreliminary 6h: 2/2 bottles gram-negative rods',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Scleral icterus, jaundiced skin\nRUQ tenderness with mild guarding\nNo peritoneal signs\nBowel sounds present\nLiver edge palpable 2cm below costal margin\nExcoriations on arms and trunk from scratching',a:true}
}},

// ======================== SURGERY (12) ========================
{id:19,cat:'Surgery',spec:'Surgery',pres:'Abdominal Pain',focus:'Surgical abdomen',set:'ED',
 nm:'Tyler Jenkins',age:24,sx:'M',eth:'Anglo-Canadian',
 ap:'Young man lying rigid on stretcher, knees drawn up, refusing to move',
 dx:'Acute appendicitis',
 hr:96,sbp:128,dbp:78,rr:18,tmp:38.3,o2:99,
 op:"It started around my belly button yesterday? Like a dull ache. But now it's— *winces* —moved down here to the right side and it's way worse. Walking makes it awful. I puked twice this morning.",
 dm:['Appendicitis: migration of pain from periumbilical to RLQ is classic','McBurney point tenderness, Rovsing sign, psoas sign','CT abdomen if diagnosis unclear; surgery if clinical picture is clear'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 14.6 ×10⁹/L (4.5-11.0) ↑\nNeutrophils: 86% ↑\nHgb: 148 g/L (130-170)\nPlt: 267 ×10⁹/L (150-400)',a:true},
  crp:{n:'CRP',r:'CRP: 65 mg/L (<10) ↑↑',a:true},
  ct_abd:{n:'CT Abdomen/Pelvis with Contrast',r:'Dilated appendix 12mm (normal <6mm)\nAppendicular wall enhancement\nPeriappendiceal fat stranding\nSmall amount free fluid in pelvis\nNo perforation, no abscess',a:true},
  ua:{n:'Urinalysis',r:'Clear, yellow\nWBC: 2/HPF\nRBC: 1/HPF\nNitrites: Negative',a:false},
  pe_abd:{n:'Abdominal Exam',r:'RLQ tenderness maximal at McBurney point\nVoluntary guarding in RLQ\nPositive Rovsing sign\nPositive psoas sign on right\nHypoactive bowel sounds',a:true}
}},

{id:20,cat:'Surgery',spec:'Surgery',pres:'Abdominal Pain',focus:'Bowel obstruction',set:'ED',
 nm:'Dorothy Whitfield',age:74,sx:'F',eth:'Anglo-Canadian',
 ap:'Elderly woman, distended abdomen, vomiting into basin',
 dx:'Small bowel obstruction (adhesive)',
 hr:102,sbp:118,dbp:68,rr:20,tmp:37.2,o2:96,
 op:"I haven't had a bowel movement in three days and I keep throwing up this awful green stuff. My belly keeps getting bigger. I had my gallbladder out twenty years ago— could that be related?",
 dm:['SBO: adhesions #1 cause — ask about prior surgery','NGT decompression + NPO + IV fluids','Strangulation: constant pain, fever, tachycardia → urgent surgery'],
 rs:{
  xray_abd:{n:'Abdominal X-ray',r:'Multiple dilated loops of small bowel (>3cm)\nAir-fluid levels on upright\nPaucity of colonic gas\nNo free air under diaphragm',a:true},
  cbc:{n:'CBC',r:'WBC: 11.2 ×10⁹/L (4.5-11.0) ↑\nHgb: 142 g/L (120-160)\nPlt: 312 ×10⁹/L (150-400)',a:true},
  bmp:{n:'BMP',r:'Na: 132 mmol/L (136-145) ↓\nK: 3.2 mmol/L (3.5-5.0) ↓\nCl: 88 mmol/L (98-106) ↓\nCr: 142 µmol/L (50-100) ↑',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Distended, tympanic to percussion\nDiffuse mild tenderness, no peritoneal signs\nHigh-pitched tinkling bowel sounds\nWell-healed midline scar\nNo hernias',a:true}
}},

{id:21,cat:'Surgery',spec:'Surgery',pres:'GI Bleeding',focus:'Upper GI bleed',set:'ED',
 nm:'Patrick O\'Brien',age:56,sx:'M',eth:'Irish-Canadian',
 ap:'Pale man, emesis basin with coffee-ground vomitus',
 dx:'Upper GI bleed — peptic ulcer disease',
 hr:112,sbp:94,dbp:58,rr:22,tmp:36.6,o2:96,
 op:"I've been throwing up— it looks like coffee grounds? And my stool was black this morning. I feel really dizzy standing up. I take ibuprofen every day for my back.",
 dm:['GI bleed: 2 large-bore IVs, type & cross, resuscitate','PPI IV bolus + drip','Urgent endoscopy within 24h'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 8.4 ×10⁹/L\nHgb: 72 g/L (130-170) ↓↓↓\nPlt: 198 ×10⁹/L',a:true},
  bmp:{n:'BMP',r:'Cr: 118 µmol/L (60-110) ↑\nBUN: 16.8 mmol/L (2.5-8.0) ↑↑',a:true},
  lactate:{n:'Lactate',r:'Lactate: 3.2 mmol/L (0.5-2.0) ↑↑',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Epigastric tenderness, no guarding\nDRE: melena on glove',a:true}
}},

{id:22,cat:'Surgery',spec:'Surgery',pres:'GI Bleeding',focus:'Lower GI bleed',set:'ED',
 nm:'Colleen MacNeil',age:68,sx:'F',eth:'Scottish-Canadian',
 ap:'Pale elderly woman, blood-stained gown',
 dx:'Diverticular hemorrhage',
 hr:98,sbp:108,dbp:64,rr:18,tmp:36.8,o2:97,
 op:"I went to the bathroom and there was so much blood. Bright red. No pain though, which is what's scary. Happened three times now.",
 dm:['Painless BRBPR = diverticular bleed until proven otherwise','Resuscitate, type & screen, transfuse if Hgb <70','CTA if active bleed; colonoscopy when stable'],
 rs:{
  cbc:{n:'CBC',r:'Hgb: 82 g/L (120-160) ↓↓',a:true},
  ct_abd:{n:'CTA Abdomen',r:'Active contrast extravasation in sigmoid colon\nMultiple diverticula in descending/sigmoid',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Soft, non-tender\nDRE: bright red blood, no mass',a:true}
}},

{id:23,cat:'Surgery',spec:'Surgery',pres:'Palpable Mass',focus:'Breast mass',set:'Clinic',
 nm:'Linda Park',age:52,sx:'F',eth:'Korean-Canadian',
 ap:'Well-appearing woman, slightly anxious',
 dx:'Invasive ductal carcinoma',
 hr:76,sbp:124,dbp:78,rr:14,tmp:36.7,o2:99,
 op:"I found a lump in my left breast three weeks ago. It doesn't hurt but it's hard. My mother had breast cancer at 50 so I'm— *voice breaks* ...really scared.",
 dm:['Triple assessment: clinical + imaging + tissue','Hard, fixed, irregular = concerning','Mammogram + US → core biopsy if suspicious'],
 rs:{
  mammo:{n:'Mammogram',r:'Left: 2.3cm irregular spiculated mass, BIRADS 5\nMicrocalcifications present',a:true},
  us_breast:{n:'Breast US',r:'2.1×1.8cm solid hypoechoic mass, irregular margins\nSuspicious left axillary node',a:true},
  pe_breast:{n:'Breast Exam',r:'2cm firm, irregular mass at 10 o\'clock left breast\nPartially fixed\nLeft axillary lymphadenopathy\nRight breast normal',a:true}
}},

{id:24,cat:'Surgery',spec:'Surgery',pres:'Palpable Mass',focus:'Thyroid nodule',set:'Clinic',
 nm:'Jasmine Lafleur',age:38,sx:'F',eth:'French-Canadian',
 ap:'Healthy woman with visible anterior neck swelling',
 dx:'Papillary thyroid carcinoma',
 hr:74,sbp:118,dbp:72,rr:14,tmp:36.8,o2:99,
 op:"My friend noticed my neck looks bigger on this side. It doesn't hurt. Should I be worried?",
 dm:['Thyroid nodule >1cm needs FNA','TSH first — if low, thyroid scan before FNA','Concerning: hard, fixed, rapid growth, lymphadenopathy'],
 rs:{
  tsh:{n:'TSH',r:'TSH: 2.4 mIU/L (0.4-4.0) — Normal',a:false},
  us_thyroid:{n:'Thyroid US',r:'Right: 2.5cm solid hypoechoic nodule, irregular margins, microcalcifications\nTI-RADS 5\nSuspicious right level III node',a:true},
  fna:{n:'FNA',r:'Bethesda VI: Malignant — Papillary thyroid carcinoma',a:true},
  pe_neck:{n:'Neck Exam',r:'2.5cm firm nodule right thyroid, moves with swallowing\nSmall firm right cervical node\nTrachea midline',a:true}
}},

{id:25,cat:'Surgery',spec:'Emergency Medicine',pres:'Trauma/Injury',focus:'ATLS primary survey',set:'ED',
 nm:'Brandon Wells',age:22,sx:'M',eth:'Anglo-Canadian',
 ap:'Young man on backboard, C-collar, left chest bruising, tachypneic',
 dx:'Left tension pneumothorax',
 hr:128,sbp:82,dbp:50,rr:34,tmp:36.5,o2:82,
 op:"*gasping* Got hit by a car... can't breathe... my chest— something's wrong— *gasping* ...help me please—",
 dm:['Tension pneumo: clinical diagnosis — needle decompress IMMEDIATELY','Absent breath sounds + tracheal deviation + hypotension','2nd ICS midclavicular needle then chest tube'],
 rs:{
  cxr:{n:'Chest X-ray',r:'Complete left pneumothorax, mediastinal shift to right\n(Should NOT delay needle decompression)',a:true},
  pe_resp:{n:'Respiratory Exam',r:'Absent breath sounds LEFT\nHyperresonant LEFT\nTrachea deviated RIGHT\nDistended neck veins\nSubcutaneous emphysema',a:true}
}},

{id:26,cat:'Surgery',spec:'Surgery',pres:'Trauma/Injury',focus:'Blunt abdominal',set:'ED',
 nm:'Amira Diallo',age:28,sx:'F',eth:'Senegalese-Canadian',
 ap:'Young woman, LUQ pain, seat belt sign across abdomen',
 dx:'Splenic laceration (Grade III)',
 hr:114,sbp:96,dbp:58,rr:22,tmp:36.9,o2:97,
 op:"Car accident— someone ran a red light. It hurts really bad on my left side under my ribs. I feel dizzy and nauseated.",
 dm:['Blunt abdominal trauma + unstable → FAST scan STAT','Positive FAST + unstable = OR','Kehr sign = diaphragmatic irritation from splenic blood'],
 rs:{
  fast:{n:'FAST US',r:'Positive: Free fluid in LUQ and pelvis\nNegative: RUQ and pericardium',a:true},
  cbc:{n:'CBC',r:'Hgb: 88 g/L (120-160) ↓↓',a:true},
  lactate:{n:'Lactate',r:'Lactate: 4.2 mmol/L (0.5-2.0) ↑↑',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Seat belt sign\nLUQ tenderness with guarding\nLeft shoulder pain (Kehr sign)\nDistended abdomen',a:true}
}},

{id:27,cat:'Surgery',spec:'Surgery',pres:'Fracture/Trauma',focus:'Distal radius',set:'ED',
 nm:'Svetlana Kozlov',age:72,sx:'F',eth:'Russian-Canadian',
 ap:'Elderly woman cradling left wrist, obvious deformity',
 dx:'Colles fracture (distal radius)',
 hr:88,sbp:158,dbp:88,rr:16,tmp:36.8,o2:98,
 op:"I slipped on ice and landed on my hand. Heard a crack. Can't move my wrist. It looks bent the wrong way, doesn't it?",
 dm:['Colles: dorsal angulation, FOOSH in elderly','Check NV status distally','Consider osteoporosis workup in postmenopausal fragility fracture'],
 rs:{
  xray:{n:'X-ray Left Wrist',r:'Distal radius fracture, dorsal angulation (Colles)\nDorsal tilt 25° (normal 11° volar)\nNo ulnar styloid fracture',a:true},
  pe_msk:{n:'Wrist Exam',r:'Dorsal "dinner fork" deformity\nRadial pulse palpable\nSensation intact all distributions\nFinger motion intact but painful',a:true}
}},

{id:28,cat:'Surgery',spec:'Surgery',pres:'Fracture/Trauma',focus:'Hip fracture',set:'ED',
 nm:'Arthur MacDonald',age:84,sx:'M',eth:'Scottish-Canadian',
 ap:'Elderly man, left leg shortened and externally rotated',
 dx:'Left femoral neck fracture',
 hr:92,sbp:142,dbp:78,rr:16,tmp:36.7,o2:95,
 op:"Fell in the bathroom last night. Lay on the floor for maybe eight hours until my neighbor heard me. My hip is— *winces* —really bad.",
 dm:['Hip fracture in elderly: surgical fixation within 48h','Assess for delirium, volume depletion, pressure injuries','DVT prophylaxis'],
 rs:{
  xray:{n:'X-ray Left Hip',r:'Displaced intracapsular femoral neck fracture (Garden IV)\nSevere osteoporosis',a:true},
  cbc:{n:'CBC',r:'Hgb: 102 g/L (130-170) ↓↓',a:true},
  bmp:{n:'BMP',r:'Na: 146 ↑, Cr: 168 µmol/L ↑↑ (dehydrated from 8h on floor)',a:true},
  pe_msk:{n:'Hip/Leg Exam',r:'Left leg shortened ~3cm, externally rotated\nGroin tenderness\nUnable to straight leg raise\nLog-roll positive\nSkin intact, no pressure injury',a:true}
}},

{id:29,cat:'Surgery',spec:'Surgery',pres:'Wound/Ulcer',focus:'Abscess I&D',set:'ED',
 nm:'Ryan Makuch',age:34,sx:'M',eth:'Ukrainian-Canadian',
 ap:'Man sitting uncomfortably on one buttock, embarrassed',
 dx:'Perianal abscess',
 hr:88,sbp:126,dbp:76,rr:16,tmp:38.0,o2:99,
 op:"Uhm... this is embarrassing. I've got a lump near my— backside. Getting bigger and more painful. Can barely sit down. Almost didn't come in but my wife made me.",
 dm:['Perianal abscess: I&D is definitive — antibiotics alone insufficient','Do NOT needle aspirate — needs surgical incision','Assess for fistula, IBD'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 13.4 ×10⁹/L ↑',a:true},
  pe_rectal:{n:'Perianal Exam',r:'4cm fluctuant, erythematous, tender mass at 7 o\'clock\nSkin thinning, appears ready to drain\nNo fistula tract visible',a:true}
}},

{id:30,cat:'Surgery',spec:'Surgery',pres:'Wound/Ulcer',focus:'Diabetic foot',set:'Clinic',
 nm:'George Baptiste',age:62,sx:'M',eth:'Haitian-Canadian',
 ap:'Overweight man, bandaged right foot, worried',
 dx:'Diabetic foot ulcer with cellulitis (Wagner 2)',
 hr:82,sbp:148,dbp:92,rr:16,tmp:37.6,o2:97,
 op:"My foot— I have diabetes. Didn't even feel the cut because my feet are numb. Now it's all red and swollen with some pus. Smells too. Cream isn't helping.",
 dm:['Assess perfusion (pulses, ABI), neuropathy (monofilament), depth','Broad-spectrum ABx: gram+, gram-, anaerobes','Offload, wound care, vascular surgery if ischemic'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 15.2 ×10⁹/L ↑',a:true},
  hba1c:{n:'HbA1c',r:'HbA1c: 10.2% ↑↑↑ (poorly controlled)',a:true},
  xray:{n:'X-ray Right Foot',r:'Soft tissue swelling, no gas, no osteomyelitis (may be early)\nCharcot changes at midfoot',a:true},
  pe_foot:{n:'Foot Exam',r:'2.5cm plantar ulcer, depth to subcutaneous\nErythema extending 4cm\nPurulent, malodorous discharge\nDecreased monofilament sensation bilaterally\nDP pulse faintly palpable, PT absent right\nCapillary refill 4 seconds',a:true}
}}

];
