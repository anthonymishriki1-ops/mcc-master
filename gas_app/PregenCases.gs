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
}},

// ======================== OB/GYN (12) ========================
{id:31,cat:'OB/GYN',spec:'OB/GYN',pres:'Vaginal Bleeding',focus:'Early pregnancy bleeding',set:'ED',
 nm:'Sarah Chen',age:28,sx:'F',eth:'Chinese-Canadian',
 ap:'Anxious young woman, clutching her abdomen, appears pale',
 dx:'Ectopic pregnancy',
 hr:108,sbp:102,dbp:64,rr:20,tmp:37.0,o2:99,
 op:"I'm— I'm bleeding. I'm like six weeks pregnant and it just started an hour ago. It's not heavy but I have this sharp pain on my right side that won't go away. I'm really scared.",
 dm:['Ruptured ectopic is a surgical emergency — hemodynamic instability = OR','Quantitative beta-hCG + transvaginal ultrasound','Rh status for all pregnancy bleeding'],
 rs:{
  bhcg:{n:'Beta-hCG',r:'Quantitative beta-hCG: 2,840 IU/L\n(Discriminatory zone: >1500 IU/L — should see IUP on TVUS)',a:true},
  cbc:{n:'CBC',r:'WBC: 10.2 ×10⁹/L (4.5-11.0)\nHgb: 98 g/L (120-160) ↓↓\nPlt: 212 ×10⁹/L (150-400)',a:true},
  tvus:{n:'Transvaginal Ultrasound',r:'Empty uterus, no intrauterine pregnancy\nRight adnexal mass 3.2cm with ring of fire sign\nSmall amount of free fluid in cul-de-sac\nLeft ovary normal',a:true},
  type_screen:{n:'Type and Screen',r:'Blood type: A positive\nAntibody screen: negative',a:false},
  pe_abd:{n:'Abdominal Exam',r:'Soft, mild RLQ tenderness\nNo rebound, no guarding\nNo peritoneal signs currently\nBowel sounds present',a:true},
  pe_pelvic:{n:'Pelvic Exam',r:'Scant dark blood in vault\nCervical os closed\nRight adnexal tenderness with fullness\nCervical motion tenderness present\nUterus slightly enlarged, non-tender',a:true}
}},

{id:32,cat:'OB/GYN',spec:'OB/GYN',pres:'Pelvic Pain',focus:'Ectopic vs PID vs torsion',set:'ED',
 nm:'Destiny Williams',age:22,sx:'F',eth:'Black-Canadian',
 ap:'Young woman doubled over on the stretcher, appears in significant pain',
 dx:'Ovarian torsion',
 hr:112,sbp:128,dbp:78,rr:22,tmp:37.2,o2:99,
 op:"Oh my God it hurts so bad! It came on like— all of a sudden? I was just at work and *winces* ...my left side, it's like stabbing. I threw up twice already.",
 dm:['Ovarian torsion: sudden onset, nausea/vomiting, tender adnexal mass','Doppler ultrasound — absent or decreased flow','Surgical emergency — detorsion within 6 hours to salvage ovary'],
 rs:{
  bhcg:{n:'Urine beta-hCG',r:'Negative',a:false},
  cbc:{n:'CBC',r:'WBC: 12.8 ×10⁹/L (4.5-11.0) ↑\nHgb: 134 g/L (120-160)\nPlt: 278 ×10⁹/L (150-400)',a:true},
  tvus:{n:'Pelvic Ultrasound with Doppler',r:'Left ovary enlarged 6.2 x 4.8cm\nAbsent arterial and venous flow on Doppler\nPeripheral follicles ("string of pearls")\nSmall amount of free fluid\nRight ovary normal',a:true},
  ua:{n:'Urinalysis',r:'Specific gravity: 1.020\npH: 6.0\nNo blood, no WBC, no nitrites\nNo bacteria',a:false},
  pe_abd:{n:'Abdominal Exam',r:'LLQ tenderness, guarding present\nNo rebound tenderness\nBowel sounds hypoactive\nNo costovertebral angle tenderness',a:true}
}},

{id:33,cat:'OB/GYN',spec:'OB/GYN',pres:'Amenorrhea',focus:'Primary vs secondary amenorrhea',set:'Clinic',
 nm:'Fatima Al-Rashidi',age:16,sx:'F',eth:'Iraqi-Canadian',
 ap:'Teenage girl with her mother, appears anxious and uncomfortable',
 dx:'Primary amenorrhea — Turner syndrome',
 hr:72,sbp:110,dbp:68,rr:14,tmp:36.8,o2:99,
 op:"Um... my mom brought me because I— I haven't gotten my period yet. All my friends got theirs like two years ago. I know it's weird. I'm also kind of short compared to everyone.",
 dm:['Primary amenorrhea: no menses by age 15 with secondary sex characteristics, or 13 without','Turner syndrome (45,X): short stature, web neck, shield chest, cardiac anomalies','Karyotype is diagnostic'],
 rs:{
  fsh_lh:{n:'FSH / LH',r:'FSH: 48 IU/L (follicular: 3-10) ↑↑↑\nLH: 32 IU/L (follicular: 2-15) ↑↑\n(Hypergonadotropic hypogonadism)',a:true},
  karyotype:{n:'Karyotype',r:'45,X\nConsistent with Turner syndrome',a:true},
  tsh:{n:'TSH',r:'TSH: 5.8 mIU/L (0.5-4.5) ↑\n(Hashimoto thyroiditis common in Turner)',a:true},
  echo:{n:'Echocardiogram',r:'Bicuspid aortic valve\nMild aortic root dilation (3.2cm)\nNormal LV function, EF 60%',a:true},
  pe_general:{n:'General Exam',r:'Height: 145cm (<3rd percentile)\nWeight: 42kg\nTanner stage I breasts, Tanner II pubic hair\nWebbed neck, low posterior hairline\nShield chest with widely spaced nipples\nCubitus valgus (increased carrying angle)\nNo goiter palpable',a:true}
}},

{id:34,cat:'OB/GYN',spec:'OB/GYN',pres:'Pregnancy Concern',focus:'Prenatal visit or complication',set:'Clinic',
 nm:'Jessica Moreau',age:32,sx:'F',eth:'French-Canadian',
 ap:'Visibly pregnant woman, appears slightly swollen in face and hands',
 dx:'Pre-eclampsia',
 hr:88,sbp:162,dbp:104,rr:18,tmp:36.9,o2:98,
 op:"I'm 34 weeks and... I've been getting these headaches that won't go away? And my hands are really puffy — my wedding ring doesn't fit anymore. I also see like, spots sometimes? Little flashing lights.",
 dm:['Pre-eclampsia: HTN + proteinuria after 20 weeks — can progress to eclampsia','Severe features: SBP≥160, headache, visual changes, epigastric pain, HELLP','MgSO4 for seizure prophylaxis, delivery if severe or ≥37 weeks'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 9.8 ×10⁹/L\nHgb: 108 g/L (pregnancy: 100-140) ↓\nPlt: 128 ×10⁹/L (150-400) ↓↓\nSmear: schistocytes seen',a:true},
  cr_uric:{n:'Renal Panel',r:'Cr: 92 µmol/L (45-80 in pregnancy) ↑\nUric acid: 420 µmol/L (<350) ↑\nAST: 89 U/L (<35) ↑↑\nALT: 102 U/L (<35) ↑↑\nLDH: 680 U/L (<250) ↑↑',a:true},
  upcr:{n:'Urine Protein:Creatinine Ratio',r:'UPCR: 68 mg/mmol (<30) ↑↑\n(Significant proteinuria)',a:true},
  pe_general:{n:'General Exam',r:'BP 162/104 (repeated)\nFacial and hand edema (2+)\nFundal height 33cm (appropriate for dates)\nFetal heart rate 145 bpm, reactive\nDTRs: 3+ bilateral with 2 beats clonus\nNo epigastric tenderness',a:true}
}},

{id:35,cat:'OB/GYN',spec:'OB/GYN',pres:'Vaginal Bleeding',focus:'Postmenopausal bleeding',set:'Clinic',
 nm:'Patricia Wong',age:61,sx:'F',eth:'Chinese-Canadian',
 ap:'Well-appearing elderly woman, appears worried but otherwise healthy',
 dx:'Endometrial carcinoma',
 hr:76,sbp:138,dbp:82,rr:14,tmp:36.8,o2:99,
 op:"I had some bleeding last week — I went through menopause eight years ago so I know that's not supposed to happen. It was just spotting but it scared me. Happened twice now.",
 dm:['Postmenopausal bleeding is endometrial cancer until proven otherwise','Endometrial biopsy or D&C for tissue diagnosis','Transvaginal ultrasound: endometrial thickness >4mm is abnormal'],
 rs:{
  tvus:{n:'Transvaginal Ultrasound',r:'Endometrial thickness: 12mm (>4mm is abnormal postmenopause) ↑\nHeterogeneous endometrium with increased vascularity\nNo adnexal masses\nSmall amount of fluid in endometrial cavity',a:true},
  cbc:{n:'CBC',r:'WBC: 6.8 ×10⁹/L\nHgb: 112 g/L (120-160) ↓\nPlt: 245 ×10⁹/L (150-400)',a:true},
  biopsy:{n:'Endometrial Biopsy',r:'Complex atypical hyperplasia with focal areas of\nwell-differentiated endometrioid adenocarcinoma\nGrade 1, no myometrial invasion on biopsy specimen',a:true},
  pe_pelvic:{n:'Pelvic Exam',r:'External genitalia: atrophic changes, normal\nSmall amount of old blood in vault\nCervix appears normal, no lesions\nUterus slightly bulky, non-tender, mobile\nAdnexa non-tender, no masses\nRectovaginal exam unremarkable',a:false}
}},

{id:36,cat:'OB/GYN',spec:'OB/GYN',pres:'Breast Lump',focus:'Triple assessment',set:'Clinic',
 nm:'Nadia Petrov',age:45,sx:'F',eth:'Ukrainian-Canadian',
 ap:'Woman appearing slightly anxious, otherwise well',
 dx:'Invasive ductal carcinoma of the breast',
 hr:78,sbp:124,dbp:76,rr:14,tmp:36.7,o2:99,
 op:"I found a lump in my right breast about three weeks ago in the shower. It's... it doesn't hurt, which is what worries me honestly. My aunt had breast cancer so I'm really nervous.",
 dm:['Triple assessment: clinical exam + imaging (mammogram ± US) + tissue sampling','Hard, irregular, fixed mass = high suspicion for malignancy','Assess axillary lymph nodes'],
 rs:{
  mammo:{n:'Bilateral Mammogram',r:'Right breast: 2.4cm irregular spiculated mass at 2 o\'clock\nBI-RADS 5 (highly suspicious for malignancy)\nNo microcalcifications\nLeft breast: normal, BI-RADS 1',a:true},
  us_breast:{n:'Breast Ultrasound',r:'Right breast 2 o\'clock: 2.3 x 1.8cm irregular hypoechoic mass\nTaller than wide, angular margins\nPosterior acoustic shadowing\nRight axilla: 1.4cm round lymph node with cortical thickening',a:true},
  biopsy:{n:'Core Needle Biopsy',r:'Invasive ductal carcinoma, grade 2\nER positive (90%), PR positive (60%)\nHER2 negative (IHC 1+)\nKi-67: 18%',a:true},
  pe_breast:{n:'Breast Exam',r:'Right breast: 2.5cm firm, irregular, non-tender mass at 2 o\'clock\nSlightly fixed to underlying tissue\nNo skin changes, no dimpling, no nipple retraction\nNo nipple discharge\nRight axillary lymph node palpable, 1.5cm, firm\nLeft breast and axilla: normal',a:true}
}},

{id:37,cat:'OB/GYN',spec:'OB/GYN',pres:'Vaginal Bleeding',focus:'Placenta previa vs abruption',set:'ED',
 nm:'Amara Okafor',age:30,sx:'F',eth:'Nigerian-Canadian',
 ap:'Pregnant woman on stretcher, appears frightened, bloody sheets',
 dx:'Placental abruption',
 hr:118,sbp:96,dbp:58,rr:24,tmp:37.0,o2:97,
 op:"I'm 35 weeks— the bleeding just started, so much blood! And my belly is so hard and it HURTS. I haven't felt the baby move in a while. Please help my baby!",
 dm:['Abruption: painful bleeding, rigid uterus, fetal distress — do NOT do vaginal exam until previa ruled out','Large bore IV x2, fluid resuscitation, type & crossmatch','Emergent C-section if fetal distress or hemodynamic instability'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 14.2 ×10⁹/L ↑\nHgb: 82 g/L (pregnancy: 100-140) ↓↓↓\nPlt: 108 ×10⁹/L (150-400) ↓↓',a:true},
  coags:{n:'Coagulation',r:'INR: 1.4 (0.9-1.1) ↑\nPTT: 42s (25-35) ↑\nFibrinogen: 1.2 g/L (2.0-4.0 in pregnancy) ↓↓\n(Early DIC)',a:true},
  type_cross:{n:'Type and Crossmatch',r:'Blood type: O positive\nAntibody screen: negative\n4 units pRBC crossmatched',a:false},
  nst:{n:'Fetal Monitoring (NST)',r:'Baseline FHR: 170 bpm (tachycardic)\nMinimal variability\nLate decelerations with contractions\nCategory III tracing',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Uterus firm/rigid ("woody"), very tender\nFundal height 37cm (larger than dates — concealed hemorrhage)\nContractions palpable, tetanic\nNo vaginal exam performed (previa not yet ruled out)',a:true}
}},

{id:38,cat:'OB/GYN',spec:'OB/GYN',pres:'Pelvic Pain',focus:'Endometriosis workup',set:'Clinic',
 nm:'Claire Bouchard',age:29,sx:'F',eth:'French-Canadian',
 ap:'Young woman appearing uncomfortable, slightly hunched posture',
 dx:'Endometriosis (Stage III)',
 hr:74,sbp:118,dbp:72,rr:14,tmp:36.8,o2:99,
 op:"My periods are just... they're awful. Like I can't go to work for two days. The pain starts before my period and doesn't stop till it's done. Advil barely touches it. Oh and— um, it hurts during sex too. Deep inside.",
 dm:['Endometriosis: dysmenorrhea + dyspareunia + dyschezia is classic triad','Definitive diagnosis requires laparoscopy','Empiric hormonal treatment can be started without surgical diagnosis'],
 rs:{
  tvus:{n:'Transvaginal Ultrasound',r:'Left ovary: 4.2cm endometrioma ("chocolate cyst")\nHomogeneous ground-glass appearance\nRight ovary normal\nUterus normal, no adenomyosis\nNo free fluid',a:true},
  ca125:{n:'CA-125',r:'CA-125: 68 U/mL (<35) ↑\n(Non-specific, elevated in endometriosis)',a:true},
  pe_pelvic:{n:'Pelvic Exam',r:'Tender nodularity in posterior fornix\nUterosacral ligament tenderness bilaterally\nLeft adnexal fullness with tenderness\nFixed, retroverted uterus\nNo cervical lesions',a:true}
}},

{id:39,cat:'OB/GYN',spec:'OB/GYN',pres:'Pregnancy Concern',focus:'Gestational diabetes screening',set:'Clinic',
 nm:'Meena Patel',age:34,sx:'F',eth:'South Asian-Canadian',
 ap:'Visibly pregnant woman, appears well, slightly overweight',
 dx:'Gestational diabetes mellitus',
 hr:80,sbp:122,dbp:76,rr:14,tmp:36.9,o2:99,
 op:"I'm here for my 28-week checkup. Everything's been fine I think? I have been really thirsty lately though and peeing a lot. My doctor wanted me to do this sugar test.",
 dm:['Screen all pregnancies at 24-28 weeks (earlier if risk factors)','South Asian ethnicity = higher risk for GDM','50g GCT ≥11.1 = diagnostic; 7.8-11.0 = needs 75g OGTT'],
 rs:{
  ogtt:{n:'75g Oral Glucose Tolerance Test',r:'Fasting: 5.8 mmol/L (≤5.0) ↑\n1-hour: 11.4 mmol/L (≤10.0) ↑\n2-hour: 9.6 mmol/L (≤8.5) ↑\n(2/3 values abnormal = GDM diagnosed)',a:true},
  hba1c:{n:'HbA1c',r:'HbA1c: 6.1% (5.7-6.4 = prediabetes range)\n(Less reliable in pregnancy due to RBC turnover)',a:true},
  pe_obs:{n:'Obstetric Exam',r:'Fundal height: 30cm (slightly large for 28 weeks)\nFetal heart rate: 152 bpm, reassuring\nPresentation: cephalic\nNo edema\nBMI: 31.2 (pre-pregnancy 29.8)',a:true}
}},

{id:40,cat:'OB/GYN',spec:'OB/GYN',pres:'Amenorrhea',focus:'PCOS workup',set:'Clinic',
 nm:'Brianna Scott',age:24,sx:'F',eth:'Black-Canadian',
 ap:'Overweight young woman with visible acne along jawline',
 dx:'Polycystic ovary syndrome (PCOS)',
 hr:76,sbp:126,dbp:78,rr:14,tmp:36.8,o2:99,
 op:"My periods are all over the place — sometimes I skip two or three months. I've been gaining weight no matter what I do. And the acne — I thought I'd be done with that after high school, but it's getting worse.",
 dm:['Rotterdam criteria: 2 of 3 — oligo/anovulation, hyperandrogenism, polycystic ovaries','Screen for metabolic syndrome, insulin resistance, lipids','Rule out thyroid disease, CAH, Cushing, prolactinoma'],
 rs:{
  hormones:{n:'Hormone Panel',r:'Total testosterone: 3.2 nmol/L (<2.0) ↑\nFree testosterone: 42 pmol/L (<20) ↑↑\nDHEA-S: 8.4 µmol/L (1.6-8.9) (high normal)\nSHBG: 18 nmol/L (30-90) ↓↓\n17-OHP: 3.8 nmol/L (<6.0) (rules out CAH)',a:true},
  tsh:{n:'TSH / Prolactin',r:'TSH: 2.4 mIU/L (0.5-4.5)\nProlactin: 14 µg/L (<25)\n(Both normal — rules out thyroid and prolactinoma)',a:false},
  metabolic:{n:'Metabolic Screen',r:'Fasting glucose: 5.9 mmol/L (3.3-5.5) ↑\nFasting insulin: 128 pmol/L (<90) ↑↑\nHOMA-IR: 4.8 (>2.5 = insulin resistant) ↑\nTotal cholesterol: 5.4 mmol/L\nLDL: 3.6 mmol/L ↑, HDL: 0.9 mmol/L ↓, TG: 2.1 mmol/L ↑',a:true},
  tvus:{n:'Pelvic Ultrasound',r:'Both ovaries enlarged (right 12cc, left 14cc)\n≥12 follicles 2-9mm in each ovary (string of pearls)\nEndometrial thickness 6mm\nNo dominant follicle',a:true},
  pe_general:{n:'General Exam',r:'BMI: 33.4\nAcanthosis nigricans at neck and axillae\nHirsutism: Ferriman-Gallwey score 12 (chin, upper lip, chest)\nModerate acne along jawline\nNo virilization, normal clitoris\nNo thyromegaly, no striae',a:true}
}},

{id:41,cat:'OB/GYN',spec:'OB/GYN',pres:'Breast Lump',focus:'Fibroadenoma vs carcinoma',set:'Clinic',
 nm:'Aisha Mohammed',age:21,sx:'F',eth:'Somali-Canadian',
 ap:'Young woman, calm but worried, healthy-appearing',
 dx:'Fibroadenoma',
 hr:68,sbp:112,dbp:70,rr:14,tmp:36.7,o2:99,
 op:"I noticed a lump in my left breast maybe a month ago? It moves around when I touch it. It doesn't hurt. I googled it and now I'm freaking out.",
 dm:['Fibroadenoma: mobile, rubbery, well-circumscribed, painless — classic in young women','Under 30: ultrasound first (dense breasts make mammogram less useful)','Core biopsy if atypical features or >2cm'],
 rs:{
  us_breast:{n:'Breast Ultrasound',r:'Left breast 10 o\'clock: 1.8 x 1.2cm well-circumscribed\nOval, homogeneous, wider than tall\nSmooth margins, no posterior shadowing\nBI-RADS 3 (probably benign)\nNo axillary lymphadenopathy',a:false},
  pe_breast:{n:'Breast Exam',r:'Left breast: 2cm firm, smooth, rubbery, mobile mass at 10 o\'clock\nNon-tender, well-circumscribed\nMoves freely ("breast mouse")\nNo skin changes, no nipple discharge\nBilateral axillae: no lymphadenopathy\nRight breast: normal',a:false}
}},

{id:42,cat:'OB/GYN',spec:'OB/GYN',pres:'Vaginal Bleeding',focus:'Miscarriage management',set:'ED',
 nm:'Olivia Tremblay',age:31,sx:'F',eth:'French-Canadian',
 ap:'Tearful woman, partner at bedside holding her hand',
 dx:'Incomplete miscarriage',
 hr:94,sbp:112,dbp:68,rr:16,tmp:37.1,o2:99,
 op:"I'm— *crying* ...I'm ten weeks pregnant and I started cramping this morning, then the bleeding got heavier and heavier. I passed some... some tissue. Is my baby okay?",
 dm:['Classify: threatened, inevitable, incomplete, complete, missed','Incomplete: open cervix, retained products, ongoing bleeding','Options: expectant, medical (misoprostol), surgical (D&C) — patient choice'],
 rs:{
  bhcg:{n:'Beta-hCG',r:'Quantitative beta-hCG: 12,400 IU/L\n(Expected >50,000 at 10 weeks — low for dates)',a:true},
  cbc:{n:'CBC',r:'WBC: 9.4 ×10⁹/L\nHgb: 104 g/L (120-160) ↓↓\nPlt: 198 ×10⁹/L (150-400)',a:true},
  tvus:{n:'Transvaginal Ultrasound',r:'Heterogeneous material in endometrial cavity (retained products)\nNo fetal heartbeat\nEndometrial thickness irregular, 18mm\nCervical canal appears open\nNo adnexal masses',a:true},
  rh:{n:'Rh Status',r:'Blood type: A negative\nAnti-D prophylaxis (RhoGAM) indicated',a:true},
  pe_pelvic:{n:'Pelvic Exam',r:'Moderate bleeding, tissue at cervical os\nCervix open (admits fingertip)\nUterus slightly enlarged, tender\nNo adnexal tenderness\nTissue passed — sent to pathology',a:true}
}},

// ======================== PEDIATRICS (12) ========================
{id:43,cat:'Pediatrics',spec:'Pediatrics',pres:'Pediatric Fever',focus:'Febrile child workup',set:'ED',
 nm:'Liam (mother: Kate Morrison)',age:2,sx:'M',eth:'Caucasian-Canadian',
 ap:'Fussy toddler in mother\'s arms, flushed cheeks, intermittently crying',
 dx:'Acute otitis media',
 hr:142,sbp:90,dbp:55,rr:28,tmp:39.2,o2:99,
 op:"[Mother speaking] He's been pulling at his right ear all day and crying. His temperature was 39 at home. He barely slept last night and won't eat anything. He had a runny nose for a few days before this started.",
 dm:['AOM: bulging, erythematous TM with decreased mobility','Amoxicillin first-line in Canada; watchful waiting if >2yo with unilateral, non-severe','Assess hydration, rule out meningitis in febrile child'],
 rs:{
  pe_ears:{n:'Ear Exam (Otoscopy)',r:'Right TM: bulging, erythematous, opacified\nDecreased mobility on pneumatic otoscopy\nSmall amount of purulent fluid behind TM\nLeft TM: mildly injected, mobile, no bulging\nExternal canals clear bilaterally',a:true},
  pe_general:{n:'General Exam',r:'Alert, irritable but consolable by mother\nAnterior fontanelle flat, soft\nNo neck stiffness (Brudzinski/Kernig negative)\nMucous membranes moist\nPharynx mildly erythematous, no exudate\nNo cervical lymphadenopathy\nChest clear, no respiratory distress\nSkin: no rash, no petechiae\nCapillary refill <2 seconds',a:false}
}},

{id:44,cat:'Pediatrics',spec:'Pediatrics',pres:'Crying/Irritable Child',focus:'Infant assessment',set:'ED',
 nm:'Baby Emma (mother: Rachel Nguyen)',age:0.5,sx:'F',eth:'Vietnamese-Canadian',
 ap:'Inconsolable 6-month-old with intermittent high-pitched screaming episodes',
 dx:'Intussusception',
 hr:168,sbp:78,dbp:48,rr:36,tmp:37.4,o2:98,
 op:"[Mother speaking] She won't stop screaming! She was fine this morning, then she just started screaming and pulling her legs up. It comes and goes — she'll be quiet for a few minutes, then it starts again. She threw up twice and I think her poop looked like... jelly? Red jelly.",
 dm:['Intussusception: episodic colicky pain + currant jelly stool + sausage-shaped mass','Air enema is both diagnostic and therapeutic (90% success)','If peritonitis or perforation → surgical reduction'],
 rs:{
  xray_abd:{n:'Abdominal X-ray',r:'Paucity of bowel gas in right lower quadrant\nSoft tissue density in right upper quadrant\nNo free air, no obstruction pattern\n"Target sign" on lateral view',a:true},
  us_abd:{n:'Abdominal Ultrasound',r:'Target sign/doughnut sign in right upper quadrant\nApproximately 3cm diameter intussusceptum\nIleocolic intussusception\nSmall amount of trapped fluid\nNo free fluid, no perforation',a:true},
  pe_abd:{n:'Abdominal Exam',r:'Sausage-shaped mass palpable in right upper quadrant\nEmpty right lower quadrant (Dance sign)\nAbdomen soft between episodes\nBowel sounds hyperactive during episodes\nRectal exam: mucoid bloody (currant jelly) stool',a:true},
  pe_general:{n:'General Exam',r:'Intermittently inconsolable, draws up knees\nQuiet periods between episodes (pale, lethargic)\nAnterior fontanelle slightly sunken\nMucous membranes tacky\nSkin turgor mildly decreased\nNo rashes, no bruising',a:true}
}},

{id:45,cat:'Pediatrics',spec:'Pediatrics',pres:'Rash in a Child',focus:'Viral exanthem vs serious',set:'Clinic',
 nm:'Oliver Chen (mother: Lisa Chen)',age:4,sx:'M',eth:'Chinese-Canadian',
 ap:'Preschooler with widespread rash, appears mildly unwell but playful',
 dx:'Varicella (chickenpox)',
 hr:110,sbp:92,dbp:58,rr:22,tmp:38.4,o2:99,
 op:"[Mother speaking] This rash started on his trunk yesterday and now it's spreading everywhere. He's been itchy and miserable. Some of the spots look like blisters. He hasn't had the chickenpox vaccine — we only moved to Canada last year.",
 dm:['Varicella: lesions in different stages (macules, papules, vesicles, crusts)','Complications: secondary bacterial infection, pneumonia, encephalitis','Acyclovir for adolescents, adults, immunocompromised — not routine in healthy children'],
 rs:{
  pe_skin:{n:'Skin Exam',r:'Generalized rash in different stages simultaneously:\n- Macules, papules, vesicles ("dewdrop on rose petal"), and crusted lesions\nCentripetal distribution (trunk > extremities)\n200+ lesions estimated\nSome lesions on scalp and oral mucosa\nNo secondary infection, no cellulitis\nPruritic — scratch marks visible',a:true},
  pe_general:{n:'General Exam',r:'Alert, active, playful between scratching\nOral vesicles on palate (3-4 small ones)\nPharynx mildly erythematous\nCervical lymphadenopathy bilateral, small, mobile\nChest clear\nAbdomen soft, non-tender\nNo hepatosplenomegaly',a:false}
}},

{id:46,cat:'Pediatrics',spec:'Pediatrics',pres:'Developmental Delay',focus:'Milestone assessment',set:'Clinic',
 nm:'Noah Williams (mother: Shanice Williams)',age:3,sx:'M',eth:'Black-Canadian',
 ap:'Quiet toddler not making eye contact, lining up toy cars repetitively',
 dx:'Autism spectrum disorder (ASD)',
 hr:98,sbp:88,dbp:54,rr:20,tmp:36.8,o2:99,
 op:"[Mother speaking] His daycare teacher said he\'s not talking like the other kids. He has maybe... five words? He doesn\'t really point at things or play with other kids. He gets really upset if we change his routine. He was walking on time though.",
 dm:['ASD red flags: no babbling by 12mo, no pointing by 12mo, no words by 16mo, no 2-word phrases by 24mo','M-CHAT-R screening tool for 16-30 months','Early intervention (speech, OT, behavioral) improves outcomes'],
 rs:{
  pe_neuro:{n:'Developmental Assessment',r:'Gross motor: walks, runs, climbs stairs — age-appropriate\nFine motor: stacks 6 blocks, scribbles — age-appropriate\nLanguage: 5 single words, no 2-word combinations (expected 200+ words, sentences)\nSocial: minimal eye contact, no joint attention\nDoes not point to show or request\nRepetitive behaviors: lines up objects, hand flapping when excited\nDistressed by transitions, rigid routines\nNo response to name (hearing test normal)',a:true},
  hearing:{n:'Audiology',r:'Pure tone audiometry: normal hearing bilaterally\nTympanometry: Type A (normal) bilateral\nHearing is not contributing to speech delay',a:false},
  pe_general:{n:'General Exam',r:'Growth parameters: height 50th, weight 60th, head circumference 75th percentile\nNo dysmorphic features\nMuscle tone normal\nGait normal\nNo skin findings (no ash-leaf spots)\nCardiac exam normal\nAbdomen normal',a:false}
}},

{id:47,cat:'Pediatrics',spec:'Pediatrics',pres:'Pediatric Fever',focus:'Meningitis rule-out',set:'ED',
 nm:'Sophia Ali (father: Hassan Ali)',age:1,sx:'F',eth:'Lebanese-Canadian',
 ap:'Lethargic infant, not interacting, fontanelle appears full',
 dx:'Bacterial meningitis (Streptococcus pneumoniae)',
 hr:178,sbp:72,dbp:42,rr:42,tmp:39.8,o2:96,
 op:"[Father speaking] She's been sick since last night — fever won't come down even with Tylenol. She's barely waking up, won't eat. This morning she... she made this weird arching movement with her back. She's never been this sick.",
 dm:['Meningitis in infant: full fontanelle, lethargy, poor feeding, irritability','Blood cultures + LP BEFORE antibiotics unless unstable','Empiric: ceftriaxone + vancomycin (+ ampicillin if <3mo for Listeria)'],
 rs:{
  lp:{n:'Lumbar Puncture (CSF)',r:'Opening pressure: 32 cmH2O (normal <20) ↑\nAppearance: cloudy/turbid\nWBC: 2,400/mm³ (normal <5) ↑↑↑ — 95% neutrophils\nGlucose: 1.1 mmol/L (CSF:serum ratio 0.15) ↓↓↓\nProtein: 3.8 g/L (normal <0.45) ↑↑↑\nGram stain: gram-positive diplococci\nCulture: pending',a:true},
  cbc:{n:'CBC',r:'WBC: 24.8 ×10⁹/L ↑↑↑ — 88% neutrophils, 4% bands\nHgb: 102 g/L ↓\nPlt: 148 ×10⁹/L ↓',a:true},
  blood_cx:{n:'Blood Culture',r:'Blood cultures x2: drawn\nPreliminary (12h): gram-positive diplococci growing\nFinal: Streptococcus pneumoniae\nSensitivity: pending',a:true},
  crp:{n:'CRP / Procalcitonin',r:'CRP: 186 mg/L (<10) ↑↑↑\nProcalcitonin: 12.4 µg/L (<0.5) ↑↑↑\n(Very high — consistent with serious bacterial infection)',a:true},
  pe_general:{n:'General Exam',r:'Lethargic, minimally responsive to stimulation\nAnterior fontanelle: bulging, tense\nNeck stiffness present\nBrudzinski sign: equivocal (difficult in infant)\nPetechial rash on trunk (5-6 lesions)\nCapillary refill 4 seconds\nMottled extremities\nNo focal neurological deficits',a:true}
}},

{id:48,cat:'Pediatrics',spec:'Pediatrics',pres:'Rash in a Child',focus:'Kawasaki vs scarlet fever',set:'ED',
 nm:'Lucas Park (mother: Jiyeon Park)',age:4,sx:'M',eth:'Korean-Canadian',
 ap:'Irritable preschooler with red eyes, cracked lips, and widespread rash',
 dx:'Kawasaki disease',
 hr:138,sbp:88,dbp:56,rr:24,tmp:39.6,o2:99,
 op:"[Mother speaking] He's had a fever for five days now and we can't get it down. His eyes got all red, his lips are so dry and cracked, and now there's this rash on his body. His hands look swollen too. Our family doctor said to come straight to the ER.",
 dm:['Kawasaki: fever ≥5 days + 4 of 5 criteria (conjunctivitis, oral changes, rash, extremity changes, lymph node)','IVIG + high-dose ASA within 10 days to prevent coronary artery aneurysm','Echo at diagnosis, 2 weeks, 6-8 weeks'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 18.4 ×10⁹/L ↑↑ — neutrophil predominant\nHgb: 104 g/L ↓\nPlt: 548 ×10⁹/L ↑↑ (thrombocytosis — classic for week 2)',a:true},
  crp_esr:{n:'CRP / ESR',r:'CRP: 124 mg/L (<10) ↑↑↑\nESR: 72 mm/hr (0-20) ↑↑↑',a:true},
  echo:{n:'Echocardiogram',r:'Normal LV function\nLeft main coronary artery: 3.2mm (z-score +2.8) — dilated ↑\nRight coronary artery: 2.8mm (z-score +2.2) — dilated ↑\nNo aneurysm formation yet\nTrivial pericardial effusion',a:true},
  ua:{n:'Urinalysis',r:'WBC: 32/hpf (sterile pyuria) ↑\nNo bacteria on culture\n(Sterile pyuria is a supportive finding in Kawasaki)',a:true},
  pe_general:{n:'General Exam',r:'Bilateral bulbar conjunctival injection (non-exudative)\nLips: erythematous, dry, cracked, bleeding\nStrawberry tongue\nPolymorphous maculopapular rash on trunk\nEdema and erythema of hands and feet\nRight anterior cervical lymph node 2cm\nIrritable, inconsolable\nPerianal erythema and desquamation',a:true}
}},

{id:49,cat:'Pediatrics',spec:'Pediatrics',pres:'Failure to Thrive',focus:'Growth faltering workup',set:'Clinic',
 nm:'Ava Thompson (mother: Marie Thompson)',age:1,sx:'F',eth:'Caucasian-Canadian',
 ap:'Thin, small infant, wasted appearance, watchful eyes',
 dx:'Failure to thrive — non-organic (inadequate caloric intake)',
 hr:128,sbp:78,dbp:46,rr:28,tmp:36.6,o2:99,
 op:"[Mother speaking — appears exhausted, tearful] She's not gaining weight. The health nurse said she's fallen off her growth curve. I'm trying, I really am. I'm breastfeeding but I don't think I have enough milk. I've been... things have been hard. My partner left two months ago and I— I'm doing this alone.",
 dm:['FTT: weight <3rd percentile or crossing 2 major percentile lines','Non-organic (psychosocial) is most common — assess feeding, maternal mental health, resources','Organic causes: GERD, celiac, CF, metabolic — screen based on history'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 7.2 ×10⁹/L\nHgb: 98 g/L (110-140 for age) ↓\nMCV: 68 fL (70-86) ↓ (microcytic)\nPlt: 310 ×10⁹/L',a:true},
  iron:{n:'Iron Studies',r:'Ferritin: 8 µg/L (12-150) ↓\nSerum iron: 4 µmol/L (9-21) ↓↓\nTIBC: 78 µmol/L (45-72) ↑\n(Iron deficiency anemia)',a:true},
  pe_growth:{n:'Growth Assessment',r:'Weight: 6.8kg (<3rd percentile, was 25th at birth)\nLength: 72cm (15th percentile)\nHead circumference: 45cm (25th percentile)\nWeight-for-length: <3rd percentile\n\nAppearance: decreased subcutaneous fat\nMuscle wasting (buttocks, thighs)\nSkin: dry, no rashes or bruises\nAnterior fontanelle open, flat\nAbdomen: mildly protuberant, no organomegaly\nDevelopment: sitting, pulling to stand — age-appropriate',a:true}
}},

{id:50,cat:'Pediatrics',spec:'Pediatrics',pres:'Wheezing',focus:'Asthma vs bronchiolitis',set:'ED',
 nm:'James Wilson (father: David Wilson)',age:3,sx:'M',eth:'Caucasian-Canadian',
 ap:'Toddler with audible wheeze, using accessory muscles, appears anxious',
 dx:'Acute asthma exacerbation (moderate-severe)',
 hr:138,sbp:94,dbp:58,rr:36,tmp:37.2,o2:92,
 op:"[Father speaking] He's been coughing all night and now he's making that whistling sound when he breathes. He has asthma — uses the blue puffer sometimes. He had a cold a few days ago. His puffer isn't helping this time. My wife has asthma too.",
 dm:['Moderate-severe asthma: O2 <94%, accessory muscle use, unable to speak in full sentences','Salbutamol MDI q20min x3 + ipratropium + systemic corticosteroids','If not improving: IV MgSO4, continuous salbutamol, consider ICU'],
 rs:{
  cxr:{n:'Chest X-ray',r:'Bilateral hyperinflation\nFlattened diaphragms\nNo focal consolidation\nNo pneumothorax\nPeribronchial thickening',a:true},
  pe_resp:{n:'Respiratory Exam',r:'Tachypneic, RR 36\nSubcostal and intercostal retractions\nNasal flaring\nDiffuse bilateral expiratory wheezing\nProlonged expiratory phase\nDecreased air entry at bases\nUnable to speak in full sentences\nSitting tripod position',a:true},
  peak_flow:{n:'Peak Flow (attempted)',r:'Unable to perform reliably due to age and distress\nPre-bronchodilator SpO2: 92%\nPost-3 salbutamol treatments: SpO2 96%, wheeze improved',a:true}
}},

{id:51,cat:'Pediatrics',spec:'Pediatrics',pres:'Wheezing',focus:'Foreign body aspiration',set:'ED',
 nm:'Mia Dubois (mother: Isabelle Dubois)',age:2,sx:'F',eth:'French-Canadian',
 ap:'Toddler with persistent cough, intermittent stridor, mother frantic',
 dx:'Foreign body aspiration (right mainstem bronchus)',
 hr:132,sbp:88,dbp:52,rr:32,tmp:37.0,o2:94,
 op:"[Mother speaking] She was eating peanuts — I know, I know, she's too young — and she started choking and coughing. That was two hours ago. The coughing stopped for a while but now it's back and she's making this noise when she breathes.",
 dm:['Foreign body aspiration: sudden choking episode + persistent cough/wheeze/stridor','Right mainstem bronchus most common (straighter, wider)','Rigid bronchoscopy for removal — do NOT attempt blind finger sweep'],
 rs:{
  cxr:{n:'Chest X-ray (inspiratory and expiratory)',r:'Inspiratory: subtle right lung hyperinflation\nExpiratory: right lung fails to deflate (air trapping) — obstructive emphysema\nMediastinal shift to LEFT on expiration\nNo radiopaque foreign body visible\nNo pneumothorax',a:true},
  pe_resp:{n:'Respiratory Exam',r:'Intermittent cough with mild stridor\nAsymmetric breath sounds: decreased air entry RIGHT\nUnilateral wheeze on RIGHT\nNo crackles\nMild subcostal retractions\nNo cyanosis currently\nSpeaking/crying normally between coughing fits',a:true}
}},

{id:52,cat:'Pediatrics',spec:'Pediatrics',pres:'Pediatric Fever',focus:'UTI in a child',set:'Clinic',
 nm:'Zara Hassan (mother: Amina Hassan)',age:1,sx:'F',eth:'Somali-Canadian',
 ap:'Fussy infant, feels warm, pulling at diaper area',
 dx:'Urinary tract infection (E. coli pyelonephritis)',
 hr:152,sbp:82,dbp:48,rr:30,tmp:39.4,o2:99,
 op:"[Mother speaking] She's had this fever for two days. At first I thought it was teething but she's really not herself. She cries when I change her diaper. The pee smells bad. She's barely eating.",
 dm:['UTI in child <2yr: get catheterized urine (not bag specimen) for culture','Febrile UTI in child <2yr = assume pyelonephritis','Renal ultrasound for first febrile UTI; VCUG if abnormal US or recurrent'],
 rs:{
  ua:{n:'Urinalysis (catheterized)',r:'Appearance: cloudy\nLE: positive ↑\nNitrites: positive ↑\nWBC: >50/hpf ↑↑↑\nBacteria: many gram-negative rods\nRBC: 5-10/hpf',a:true},
  urine_cx:{n:'Urine Culture',r:'E. coli: >100,000 CFU/mL (single organism)\nSensitive to: cephalexin, TMP-SMX, gentamicin\nResistant to: ampicillin',a:true},
  cbc:{n:'CBC',r:'WBC: 19.2 ×10⁹/L ↑↑\nHgb: 108 g/L\nPlt: 382 ×10⁹/L ↑',a:true},
  renal_us:{n:'Renal Ultrasound',r:'Right kidney: 6.8cm, mild pelvic dilation (8mm)\nLeft kidney: 6.4cm, normal\nNo hydronephrosis\nBladder wall mildly thickened\nNo stones',a:true},
  pe_general:{n:'General Exam',r:'Fussy, consolable with effort\nAnterior fontanelle flat\nNo meningeal signs\nSuprapubic tenderness on palpation\nPerineum: mild erythema, no discharge\nNo costovertebral angle tenderness appreciable\nOtherwise unremarkable exam',a:true}
}},

{id:53,cat:'Pediatrics',spec:'Pediatrics',pres:'Crying/Irritable Child',focus:'Non-accidental injury screening',set:'ED',
 nm:'Ethan Brown (mother: Jennifer Brown)',age:1.5,sx:'M',eth:'Caucasian-Canadian',
 ap:'Quiet toddler with bruising on torso, avoids eye contact, mother appears anxious and evasive',
 dx:'Non-accidental injury (child physical abuse)',
 hr:118,sbp:86,dbp:52,rr:24,tmp:37.0,o2:99,
 op:"[Mother speaking — vague, inconsistent] He fell off the couch. He was climbing and just... fell. That was yesterday I think? Or the day before. He cries when I pick him up. The bruises — he bruises easily, he always has.",
 dm:['Bruising in non-mobile child is abuse until proven otherwise','Skeletal survey for all suspected NAI <2 years','Mandatory reporting — contact child protective services'],
 rs:{
  skeletal:{n:'Skeletal Survey',r:'Healing posterior rib fractures (right 6th, 7th, 8th) — estimated 2-3 weeks old\nAcute spiral fracture left tibia\nCorner fractures bilateral distal femurs (classic metaphyseal lesions)\nNo skull fractures',a:true},
  cbc:{n:'CBC / Coagulation',r:'WBC: 8.4 ×10⁹/L\nHgb: 108 g/L\nPlt: 298 ×10⁹/L\nINR: 1.0, PTT: 28s\n(Normal coagulation — bruising not explained by bleeding disorder)',a:false},
  ct_head:{n:'CT Head (non-contrast)',r:'No acute intracranial hemorrhage\nNo subdural hematoma\nNo cerebral edema\nNormal for age',a:false},
  pe_general:{n:'General Exam',r:'Multiple bruises in various stages of healing:\n- Purple/blue bruise 4cm on right flank\n- Yellowish bruise 3cm on left upper arm\n- Linear bruise on right buttock (patterned — belt mark?)\nFlinches with examination\nSwelling and tenderness left lower leg\nDecreased ROM left leg, guards\nDevelopmentally appropriate\nWell-nourished\nNo oral injuries',a:true}
}},

{id:54,cat:'Pediatrics',spec:'Pediatrics',pres:'Developmental Delay',focus:'Autism screening',set:'Clinic',
 nm:'Ryan Kim (father: Daniel Kim)',age:5,sx:'M',eth:'Korean-Canadian',
 ap:'Child spinning in circles, covering ears, not responding to name',
 dx:'Autism spectrum disorder — Level 2 (requiring substantial support)',
 hr:92,sbp:90,dbp:56,rr:18,tmp:36.8,o2:99,
 op:"[Father speaking] His kindergarten teacher is worried. He doesn't play with the other kids — he just lines up blocks or spins things. He speaks but it's... he repeats what you say instead of answering. He screams if the schedule changes. He's really smart with numbers though.",
 dm:['ASD Level 2: marked deficits in verbal/nonverbal communication, restricted interests','Echolalia (repeating speech) is common','Refer to developmental pediatrician, speech-language pathology, OT'],
 rs:{
  pe_neuro:{n:'Developmental Assessment',r:'Gross motor: age-appropriate\nFine motor: excellent with preferred activities (puzzles, blocks)\nLanguage: echolalia present, limited functional language\nUses ~50 words but mostly scripted/echolalic\nNo reciprocal conversation\nSocial: no joint attention, no pointing to share interest\nRepetitive behaviors: spinning objects, hand flapping, toe walking\nSensory: covers ears to loud sounds, avoids certain textures\nCognitive: knows alphabet, counts to 100, hyperlexic\nADL: not toilet trained, selective eating (5 foods)',a:true},
  hearing:{n:'Audiology',r:'Normal hearing bilaterally\nNo auditory processing concerns at peripheral level',a:false}
}},

// ======================== PSYCHIATRY (12) ========================
{id:55,cat:'Psychiatry',spec:'Psychiatry',pres:'Depressed Mood',focus:'MDD + safety assessment',set:'Clinic',
 nm:'David Chen',age:42,sx:'M',eth:'Chinese-Canadian',
 ap:'Disheveled man, poor eye contact, speaking slowly, flat affect',
 dx:'Major depressive disorder, severe, with suicidal ideation',
 hr:64,sbp:118,dbp:74,rr:14,tmp:36.7,o2:99,
 op:"I... I don't really know why I'm here. My wife made the appointment. I just... nothing matters anymore? I can't sleep, I can't eat. I lost my job two months ago and I just... *long pause* ...I've been thinking maybe everyone would be better off without me.",
 dm:['Screen for suicidal ideation: plan, means, intent, timeline','Safety assessment: firearms access, previous attempts, protective factors','Severe MDD with SI: consider hospitalization, start SSRI + safety plan'],
 rs:{
  phq9:{n:'PHQ-9 Score',r:'PHQ-9 Total: 24/27 (Severe depression)\nItem 9 (SI): scored 3 ("nearly every day")\nAll domains affected: anhedonia, sleep, appetite, energy, concentration, psychomotor, guilt, suicidality',a:true},
  tsh:{n:'TSH',r:'TSH: 3.2 mIU/L (0.5-4.5)\n(Normal — rules out hypothyroidism as contributor)',a:false},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: disheveled, unwashed hair, wrinkled clothes\nBehavior: psychomotor retardation, poor eye contact\nSpeech: low volume, slow rate, long latencies\nMood: "empty" / "what\'s the point"\nAffect: flat, restricted, congruent\nThought process: linear but impoverished\nThought content: passive SI ("maybe everyone\'s better off"), no active plan currently, no command AH\nPerceptions: no hallucinations\nCognition: intact but slow\nInsight: partial ("I know I\'m depressed but can\'t fix it")\nJudgment: impaired — stopped taking care of himself',a:true}
}},

{id:56,cat:'Psychiatry',spec:'Psychiatry',pres:'Anxiety',focus:'GAD vs panic vs medical cause',set:'Clinic',
 nm:'Samantha Miller',age:34,sx:'F',eth:'Caucasian-Canadian',
 ap:'Restless woman, fidgeting with her hands, appears tense',
 dx:'Panic disorder with agoraphobia',
 hr:92,sbp:132,dbp:84,rr:18,tmp:36.8,o2:99,
 op:"I keep having these... attacks? My heart starts pounding, I can't breathe, my hands go tingly, and I honestly think I'm dying every time. It happened at the grocery store twice so now I— I don't go there anymore. I've stopped going a lot of places actually.",
 dm:['Panic disorder: recurrent unexpected panic attacks + worry about future attacks + behavioral change','Rule out medical: thyroid, pheochromocytoma, cardiac arrhythmia, substance use','First-line: CBT + SSRI; short-term benzodiazepine for severe acute episodes'],
 rs:{
  tsh:{n:'TSH',r:'TSH: 2.1 mIU/L (0.5-4.5)\n(Normal)',a:false},
  ecg:{n:'ECG',r:'Normal sinus rhythm, rate 92\nNormal intervals (PR, QRS, QTc)\nNo ST changes\nNo arrhythmia',a:false},
  gad7:{n:'GAD-7 / Panic Screening',r:'GAD-7: 16/21 (Severe anxiety)\nPanic Disorder Severity Scale: 18/28 (Markedly severe)\nAgoraphobia screening: positive — avoids malls, grocery stores, driving on highways, crowds',a:true},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: well-groomed but tense\nBehavior: fidgeting, scanning room, seated near exit\nSpeech: rapid rate, normal volume\nMood: "scared all the time"\nAffect: anxious, labile, tearful at times\nThought process: logical, circumstantial at times\nThought content: catastrophic cognitions ("I\'m going to die"), no SI\nPerceptions: no hallucinations\nCognition: intact\nInsight: good ("I know it\'s probably not a heart attack but it feels like one")\nJudgment: avoidance behaviors impairing function',a:true}
}},

{id:57,cat:'Psychiatry',spec:'Psychiatry',pres:'Psychosis',focus:'First-episode psychosis',set:'ED',
 nm:'Jordan Taylor',age:20,sx:'M',eth:'Caucasian-Canadian',
 ap:'Young man pacing, muttering to himself, appears suspicious and guarded',
 dx:'Schizophrenia — first episode',
 hr:96,sbp:128,dbp:80,rr:16,tmp:37.0,o2:99,
 op:"They're— *looks around nervously* ...they're watching me. Through the cameras. I know you probably work for them too. The voices told me not to come here but my mom— she doesn't understand what's happening. I have to stay alert. They've been putting thoughts in my head.",
 dm:['First-episode psychosis: rule out substances, medical causes (delirium, infection, metabolic)','Start low-dose atypical antipsychotic','Duration >6 months with functional decline = schizophrenia'],
 rs:{
  utox:{n:'Urine Drug Screen',r:'THC: negative\nCocaine: negative\nAmphetamines: negative\nOpioids: negative\nBenzodiazepines: negative\nPCP: negative\n(No substance-induced psychosis)',a:false},
  cbc_bmp:{n:'CBC / BMP',r:'WBC: 7.8 ×10⁹/L\nHgb: 148 g/L\nNa: 140, K: 4.2, Cr: 82, Glucose: 5.4\n(All normal — no metabolic cause)',a:false},
  ct_head:{n:'CT Head',r:'No acute intracranial pathology\nNo mass, bleed, or hydrocephalus\nNormal for age',a:false},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: unkempt, wearing layers, hasn\'t showered\nBehavior: pacing, guarded, poor eye contact, responding to internal stimuli\nSpeech: pressured, tangential, neologisms ("the zypherians")\nMood: "I\'m fine it\'s everyone else"\nAffect: suspicious, paranoid, incongruent (laughs inappropriately)\nThought process: loose associations, tangential\nThought content: paranoid delusions (surveillance), thought insertion, ideas of reference\nPerceptions: auditory hallucinations (2 voices commenting on his actions)\nCognition: oriented x3 but distractible\nInsight: absent\nJudgment: impaired',a:true}
}},

{id:58,cat:'Psychiatry',spec:'Psychiatry',pres:'Suicidal Ideation',focus:'Risk assessment + safety plan',set:'ED',
 nm:'Emily Watson',age:17,sx:'F',eth:'Caucasian-Canadian',
 ap:'Teenage girl with bandaged left forearm, tearful, brought in by parents',
 dx:'Non-suicidal self-injury with passive suicidal ideation — major depressive episode',
 hr:78,sbp:108,dbp:66,rr:14,tmp:36.8,o2:99,
 op:"*long silence, looking down* ...I don't want to talk about it. *pause* I cut myself, okay? It's not... I wasn't trying to die. It just... makes the other pain stop for a second. But yeah, sometimes I do think about... not being here anymore. Not like a plan or anything.",
 dm:['Assess: suicidal ideation vs self-harm (NSSI) — different risk profiles but can co-occur','NSSI: emotional regulation; SI: desire to end life — distinguish carefully','Adolescent SI: involve parents, remove means (medications, sharps), safety plan, follow-up within 48h'],
 rs:{
  pe_mse:{n:'Mental Status Exam',r:'Appearance: dark clothing, hood up, long sleeves, minimal makeup\nBehavior: avoidant, minimal eye contact, picking at bandage\nSpeech: low volume, monosyllabic initially, opens up gradually\nMood: "numb" / "I don\'t care"\nAffect: constricted, tearful intermittently\nThought process: linear, goal-directed\nThought content: passive SI ("sometimes I wish I wouldn\'t wake up"), no active plan, no intent\nNSSI: cutting forearms x6 months, escalating frequency\nPerceptions: no hallucinations\nCognition: intact\nInsight: partial ("I know cutting isn\'t healthy but...")\nJudgment: fair — came to ED with parents',a:true},
  wound:{n:'Wound Assessment',r:'Left forearm: 6 parallel superficial lacerations (2-4cm)\nSuperficial — no tendon, nerve, or vessel involvement\nVarious stages of healing (some fresh, some scarring)\nRight forearm: older healed scars (~15-20 lines)\nNo other injuries',a:true}
}},

{id:59,cat:'Psychiatry',spec:'Psychiatry',pres:'Substance Abuse',focus:'Alcohol use disorder',set:'Clinic',
 nm:'Robert MacDonald',age:48,sx:'M',eth:'Scottish-Canadian',
 ap:'Flushed face, slightly tremulous hands, smells of alcohol',
 dx:'Alcohol use disorder, severe — with early withdrawal',
 hr:104,sbp:148,dbp:92,rr:18,tmp:37.4,o2:98,
 op:"My wife gave me an ultimatum. Told me to get help or she's leaving and taking the kids. I mean, I drink, sure, but it's not— *hands shaking* ...okay maybe it's gotten out of hand. I've been having a couple of drinks in the morning just to stop my hands from shaking.",
 dm:['CAGE/AUDIT for screening; eye-opener = high risk for dependence/withdrawal','Alcohol withdrawal: tremor, anxiety, diaphoresis → seizures → DTs (48-72h)','CIWA protocol for withdrawal; thiamine BEFORE glucose; consider benzodiazepines'],
 rs:{
  audit:{n:'AUDIT Score',r:'AUDIT Total: 32/40 (≥20 = probable dependence)\nDaily drinking: 12-15 standard drinks/day\nMorning drinking to prevent withdrawal\nBlackouts: weekly\nInjury while drinking: yes (fall 2 months ago)',a:true},
  cbc:{n:'CBC',r:'WBC: 6.2 ×10⁹/L\nHgb: 128 g/L\nMCV: 104 fL (80-100) ↑ (macrocytic)\nPlt: 118 ×10⁹/L ↓',a:true},
  lft:{n:'Liver Panel',r:'AST: 128 U/L (<35) ↑↑↑\nALT: 68 U/L (<35) ↑↑\nAST:ALT ratio >2:1 (alcoholic pattern)\nGGT: 342 U/L (<50) ↑↑↑↑\nAlbumin: 32 g/L (35-50) ↓\nTotal bilirubin: 28 µmol/L (<21) ↑',a:true},
  pe_general:{n:'General Exam',r:'Tremor: fine bilateral hand tremor\nFlushed facies, spider angiomata on chest (3)\nPalmar erythema\nMild jaundice\nLiver: palpable 3cm below costal margin, firm, non-tender\nNo ascites, no shifting dullness\nNo asterixis\nCIWA score: 14 (moderate withdrawal)',a:true}
}},

{id:60,cat:'Psychiatry',spec:'Psychiatry',pres:'Insomnia',focus:'Sleep hygiene + DDx',set:'Clinic',
 nm:'Michelle Leblanc',age:38,sx:'F',eth:'French-Canadian',
 ap:'Well-dressed woman with dark circles under eyes, yawning frequently',
 dx:'Chronic insomnia disorder with comorbid generalized anxiety',
 hr:72,sbp:116,dbp:72,rr:14,tmp:36.8,o2:99,
 op:"I haven't slept properly in months. I lie there for hours, my mind racing about work, the kids, everything. I finally fall asleep at like 2 AM and then my alarm goes off at 6. I started taking Benadryl every night but it's not working anymore. I'm exhausted and I can't function.",
 dm:['CBT-I is first-line for chronic insomnia (not medications)','Assess for comorbid mood/anxiety disorder, sleep apnea, substance use','Avoid long-term benzodiazepines/Z-drugs; diphenhydramine not recommended for insomnia'],
 rs:{
  sleep_diary:{n:'Sleep Diary (2-week)',r:'Average sleep onset latency: 90 minutes\nAverage total sleep time: 4.5 hours\nSleep efficiency: 50% (time asleep/time in bed)\nFrequent middle-of-night awakenings\nNapping: 30-60min daily at lunch\nCaffeine: 4 coffees/day, last at 3 PM\nScreen time in bed: 1-2 hours\nAlcohol: 1-2 glasses wine 3-4 nights/week "to relax"',a:true},
  gad7:{n:'GAD-7',r:'GAD-7 Total: 14/21 (Moderate anxiety)\nPHQ-9 Total: 8/27 (Mild depression — likely secondary to sleep deprivation)',a:true},
  tsh:{n:'TSH',r:'TSH: 2.8 mIU/L (0.5-4.5)\n(Normal)',a:false},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: well-groomed, fatigued\nBehavior: cooperative, yawning\nSpeech: normal\nMood: "exhausted and frustrated"\nAffect: mildly anxious, appropriate\nThought content: ruminative worry about performance, family, health\nNo SI, no psychosis\nCognition: intact but reports difficulty concentrating\nInsight: good\nJudgment: good — seeking help appropriately',a:false}
}},

{id:61,cat:'Psychiatry',spec:'Psychiatry',pres:'Depressed Mood',focus:'Postpartum depression',set:'Clinic',
 nm:'Lisa Fernandez',age:28,sx:'F',eth:'Filipino-Canadian',
 ap:'Tearful woman holding 8-week-old infant, appears overwhelmed',
 dx:'Postpartum depression, moderate',
 hr:76,sbp:112,dbp:70,rr:14,tmp:36.8,o2:99,
 op:"I should be happy, right? I have a healthy baby. But I just... I feel nothing. Or I cry for no reason. I can't bond with her — what kind of mother am I? I'm so scared I'm going to hurt her. Not on purpose! I just... what if I drop her? These horrible thoughts won't stop.",
 dm:['Edinburgh Postnatal Depression Scale (EPDS) ≥13 = probable PPD','Distinguish from baby blues (resolves by 2 weeks) and postpartum psychosis (emergency)','SSRIs safe in breastfeeding (sertraline preferred); urgent if infanticidal/suicidal ideation'],
 rs:{
  epds:{n:'Edinburgh Postnatal Depression Scale',r:'EPDS Total: 18/30 (≥13 = probable PPD)\nItem 10 (self-harm): scored 1 ("hardly ever")\nAnhedonia: marked\nAnxiety: prominent, especially re: infant safety\nGuilt: pervasive\nSleep: insomnia even when baby sleeps',a:true},
  tsh:{n:'TSH',r:'TSH: 4.8 mIU/L (0.5-4.5) borderline ↑\n(Postpartum thyroiditis can mimic PPD — repeat in 4-6 weeks)',a:true},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: unkempt, stained clothing, infant well-cared-for\nBehavior: tearful, holds infant at distance, then clutches close\nSpeech: soft, breaks in voice\nMood: "I\'m failing at this"\nAffect: labile, tearful, anxious\nThought content: intrusive ego-dystonic thoughts of harming baby (unwanted, distressing)\nNO intent or plan to harm — these are obsessional, not psychotic\nNo command hallucinations\nNo SI currently\nInsight: good — recognizes thoughts are wrong and wants help\nJudgment: fair — baby is fed, clean, gaining weight',a:true}
}},

{id:62,cat:'Psychiatry',spec:'Psychiatry',pres:'Anxiety',focus:'PTSD assessment',set:'Clinic',
 nm:'Sergeant James Cooper',age:35,sx:'M',eth:'Caucasian-Canadian',
 ap:'Muscular man sitting rigidly, scanning the room, hypervigilant',
 dx:'Post-traumatic stress disorder (PTSD)',
 hr:88,sbp:138,dbp:86,rr:16,tmp:37.0,o2:99,
 op:"My wife made me come. I've been... since my last tour in Afghanistan. The nightmares, they— every night. I hear a loud noise and I'm back there. I can't go to Canada Day anymore because the fireworks... *jaw clenches* I started drinking to sleep. I don't feel anything anymore.",
 dm:['PTSD: re-experiencing + avoidance + negative cognitions + hyperarousal >1 month after trauma','Screen for comorbid substance use, depression, TBI','First-line: trauma-focused CBT or CPT; SSRI (sertraline/paroxetine) for medication'],
 rs:{
  pcl5:{n:'PCL-5 (PTSD Checklist)',r:'PCL-5 Total: 62/80 (≥33 = probable PTSD)\nCluster B (re-experiencing): 18/20 — nightmares, flashbacks, physiological reactivity\nCluster C (avoidance): 8/8 — avoids reminders, crowds, loud noises\nCluster D (negative cognitions): 18/24 — emotional numbing, detachment, guilt\nCluster E (arousal): 18/20 — hypervigilance, startle, insomnia, irritability',a:true},
  audit:{n:'AUDIT',r:'AUDIT Total: 18/40 (hazardous drinking)\n6-8 drinks nightly "to fall asleep"\nTolerance has increased over past year',a:true},
  phq9:{n:'PHQ-9',r:'PHQ-9: 16/27 (Moderately severe depression)\nComorbid MDD common with PTSD\nItem 9 (SI): scored 1 ("several days")',a:true},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: clean, military bearing, rigid posture\nBehavior: hypervigilant, scans room, seated with back to wall\nSpeech: clipped, controlled, reluctant\nMood: "fine" (minimizing)\nAffect: restricted, constricted, tense\nThought content: guilt ("I should have saved them"), hypervigilance, no active SI\nPerceptions: flashbacks (visual, auditory), nightmares, no hallucinations outside flashback context\nCognition: intact but distractible\nInsight: partial — acknowledges problem but "soldiers don\'t need therapy"\nJudgment: impaired by avoidance and alcohol use',a:true}
}},

{id:63,cat:'Psychiatry',spec:'Psychiatry',pres:'Psychosis',focus:'Substance-induced psychosis',set:'ED',
 nm:'Tyler Jackson',age:25,sx:'M',eth:'Caucasian-Canadian',
 ap:'Agitated young man, dilated pupils, sweating, brought in by police',
 dx:'Methamphetamine-induced psychotic disorder',
 hr:128,sbp:168,dbp:102,rr:22,tmp:38.2,o2:98,
 op:"GET AWAY FROM ME! They're under my skin — the bugs! *scratching arms vigorously* I can feel them crawling! I haven't slept in four days. You can't keep me here, I know my rights! *looks at wall* Did you see that? The shadow moved!",
 dm:['Sympathomimetic toxidrome: tachycardia, HTN, hyperthermia, agitation, mydriasis','Methamphetamine psychosis: paranoia, tactile hallucinations (formication), visual hallucinations','Benzodiazepines first-line for agitation; avoid haloperidol alone (lowers seizure threshold, worsens hyperthermia)'],
 rs:{
  utox:{n:'Urine Drug Screen',r:'Amphetamines/Methamphetamine: POSITIVE ↑\nTHC: positive\nCocaine: negative\nOpioids: negative\nBenzodiazepines: negative',a:true},
  cbc_bmp:{n:'CBC / BMP',r:'WBC: 14.2 ×10⁹/L ↑\nHgb: 158 g/L\nNa: 136 mmol/L\nK: 3.4 mmol/L ↓\nCr: 142 µmol/L ↑ (dehydration/rhabdomyolysis)\nGlucose: 8.2 mmol/L ↑\nCK: 4,200 U/L (<200) ↑↑↑ (rhabdomyolysis)',a:true},
  pe_general:{n:'General Exam',r:'Agitated, diaphoretic, restless\nPupils: 7mm bilateral, reactive\nMucous membranes dry\nSkin: multiple excoriations on arms and face (self-inflicted from scratching)\nTachycardic, regular\nChest clear\nAbdomen soft\nTremor, brisk reflexes\nNo clonus',a:true},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: thin, disheveled, excoriated skin\nBehavior: agitated, pacing, picking at skin, combative\nSpeech: rapid, pressured, loud\nMood: "they\'re trying to kill me"\nAffect: paranoid, hostile, labile\nThought content: paranoid delusions, formication\nPerceptions: tactile hallucinations (bugs), visual hallucinations (shadows)\nCognition: disoriented to time\nInsight: absent\nJudgment: severely impaired',a:true}
}},

{id:64,cat:'Psychiatry',spec:'Psychiatry',pres:'Suicidal Ideation',focus:'Adolescent self-harm',set:'ED',
 nm:'Chloe Martin',age:15,sx:'F',eth:'Caucasian-Canadian',
 ap:'Teenage girl, quiet, withdrawn, accompanied by school counselor',
 dx:'Adjustment disorder with depressed mood and suicidal ideation — bullying',
 hr:72,sbp:106,dbp:64,rr:14,tmp:36.8,o2:99,
 op:"*barely audible* ...the girls at school posted my picture online and said... things. Everyone saw it. I can't go back there. I took some of my mom's pills this morning — just a few. I don't want to die, I just want it to stop.",
 dm:['Ingestion assessment: what pills, how many, when — Tylenol levels at 4h post-ingestion','Adolescent SI: cyberbullying is major risk factor — remove online access temporarily','Involve parents/guardians, school, safety plan, outpatient follow-up within 48h'],
 rs:{
  tylenol:{n:'Acetaminophen Level (4h)',r:'Acetaminophen: 420 µmol/L at 4h post-ingestion\nPlot on Rumack-Matthew nomogram: BELOW treatment line\nNo NAC required\nAST/ALT: normal',a:false},
  asa_level:{n:'Salicylate Level',r:'Salicylate: undetectable\n(Ruled out co-ingestion)',a:false},
  ecg:{n:'ECG',r:'Normal sinus rhythm, rate 72\nQTc: 410ms (normal)\nNo conduction abnormalities',a:false},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: disheveled, tear-streaked, oversized hoodie\nBehavior: withdrawn, guarded initially, then opens up\nSpeech: whispered, slowed\nMood: "humiliated" / "I want to disappear"\nAffect: depressed, ashamed, tearful\nThought content: SI triggered by bullying, impulsive ingestion (not planned)\nRegrets taking pills, does not want to die\nPerceptions: no hallucinations\nCognition: intact\nInsight: good — "it was stupid, I just didn\'t know what else to do"\nJudgment: impaired impulsively but improving',a:true}
}},

{id:65,cat:'Psychiatry',spec:'Psychiatry',pres:'Substance Abuse',focus:'Opioid use disorder + harm reduction',set:'Clinic',
 nm:'Kevin O\'Brien',age:31,sx:'M',eth:'Irish-Canadian',
 ap:'Thin man, track marks on arms, slightly drowsy, appears nervous',
 dx:'Opioid use disorder, severe',
 hr:68,sbp:108,dbp:66,rr:12,tmp:36.6,o2:97,
 op:"I want help. I can't do this anymore. Started with Percocets after my back surgery three years ago. Then it was fentanyl. I've been using IV for a year. I've OD'd twice — Narcan saved me both times. I have a kid now and I... I want to be there for him.",
 dm:['Opioid agonist therapy (OAT): buprenorphine/naloxone or methadone — first-line','Harm reduction: naloxone kit, safe injection supplies, fentanyl test strips','Screen for: HCV, HIV, endocarditis, skin/soft tissue infections'],
 rs:{
  utox:{n:'Urine Drug Screen',r:'Opioids (fentanyl): POSITIVE\nBenzodiazepines: negative\nCocaine: negative\nAmphetamines: negative\nTHC: positive',a:true},
  hcv:{n:'Hepatitis / HIV Screen',r:'HCV antibody: POSITIVE ↑\nHCV viral load: 2.4 × 10⁶ IU/mL (active infection)\nHIV: negative\nHBsAg: negative\nHBsAb: positive (immune from vaccination)',a:true},
  cbc_lft:{n:'CBC / Liver Panel',r:'WBC: 5.8 ×10⁹/L\nHgb: 124 g/L ↓\nPlt: 142 ×10⁹/L ↓\nAST: 78 U/L ↑↑\nALT: 92 U/L ↑↑\nAlbumin: 34 g/L ↓',a:true},
  pe_general:{n:'General Exam',r:'Thin, BMI 19.2\nTrack marks bilateral antecubital fossae\nSkin: no abscesses currently\nOral: poor dentition\nCardiac: no murmurs (rules out endocarditis clinically)\nAbdomen: no hepatomegaly\nPupils: 3mm bilateral (slightly constricted)\nNo withdrawal signs currently',a:true}
}},

{id:66,cat:'Psychiatry',spec:'Psychiatry',pres:'Depressed Mood',focus:'Bipolar vs unipolar depression',set:'Clinic',
 nm:'Alexandra Volkov',age:26,sx:'F',eth:'Russian-Canadian',
 ap:'Brightly dressed woman, energetic despite complaining of depression, rapid speech',
 dx:'Bipolar II disorder — current depressive episode (history of hypomania)',
 hr:82,sbp:118,dbp:72,rr:15,tmp:36.8,o2:99,
 op:"I'm SO depressed right now, I can barely get out of bed. But like, a month ago? I was amazing. I wrote half a novel in a week, barely needed sleep, went on a shopping spree — okay that wasn't great, I maxed out two credit cards. But I felt incredible. Now I'm crashed. My last doctor put me on Zoloft and I went completely manic.",
 dm:['Screen for mania/hypomania in ALL depression presentations — SSRI monotherapy can trigger mania','Bipolar II: hypomanic episodes (no psychosis, no hospitalization) + major depressive episodes','Mood stabilizers (lithium, valproate) or atypical antipsychotics — NOT SSRI monotherapy'],
 rs:{
  mdq:{n:'Mood Disorder Questionnaire',r:'MDQ: 11/13 positive items (≥7 = screen positive for bipolar)\nHypomanic episodes: decreased sleep need, grandiosity, increased goal-directed activity, spending sprees\nEpisodes last 4-7 days\nNo psychotic features, no hospitalization for mania\nFunctional impairment: moderate (financial, occupational)',a:true},
  phq9:{n:'PHQ-9',r:'PHQ-9: 19/27 (Moderately severe depression)\nCurrently in depressive phase\nAnhedonia: marked\nItem 9 (SI): 0 (no SI currently)',a:true},
  tsh:{n:'TSH',r:'TSH: 1.8 mIU/L (0.5-4.5) — normal',a:false},
  pe_mse:{n:'Mental Status Exam',r:'Appearance: colorful clothing, multiple accessories, well-groomed\nBehavior: slightly restless, gesturing broadly\nSpeech: rapid rate but interruptible, slightly pressured\nMood: "depressed... but also kind of wired?"\nAffect: labile — shifts from tearful to animated within minutes\nThought process: flight of ideas at times, mostly linear\nThought content: hopelessness about current state, no SI\nGrandiosity when discussing hypomanic period ("I was brilliant")\nPerceptions: no hallucinations\nInsight: partial — recognizes the "highs" may be abnormal\nJudgment: impaired during episodes (spending, impulsivity)',a:true}
}},

// ======================== EMERGENCY MEDICINE (6) ========================
{id:67,cat:'Emergency',spec:'Emergency Medicine',pres:'Trauma/Injury',focus:'ATLS primary survey',set:'ED',
 nm:'Michael Rossi',age:34,sx:'M',eth:'Italian-Canadian',
 ap:'Motorcycle helmet beside stretcher, road rash, C-collar in place, grimacing',
 dx:'Hemopneumothorax (left) with rib fractures, grade II splenic laceration',
 hr:124,sbp:92,dbp:58,rr:28,tmp:36.4,o2:90,
 op:"*groaning* I hit a car... came off the bike... my left side... can't breathe...",
 dm:['ATLS: ABCDE — tension pneumothorax kills fast, decompress before X-ray if unstable','Left-sided trauma: think spleen; right-sided: think liver','Massive transfusion protocol if hemodynamically unstable after 2L crystalloid'],
 rs:{
  cxr:{n:'Portable Chest X-ray',r:'Left-sided opacification (hemothorax)\nLeft pneumothorax\nFractures left ribs 5-8\nMediastinum midline (not tension)\nRight lung clear\nChest tube indicated',a:true},
  fast:{n:'FAST Ultrasound',r:'Positive free fluid in left upper quadrant (splenorenal recess)\nPositive left hemithorax\nNegative right upper quadrant\nNegative pelvis\nNo pericardial effusion',a:true},
  cbc:{n:'CBC',r:'WBC: 16.8 ×10⁹/L ↑↑\nHgb: 88 g/L ↓↓↓ (acute blood loss)\nPlt: 198 ×10⁹/L\nLactate: 4.8 mmol/L (<2.0) ↑↑↑',a:true},
  ct_abd:{n:'CT Abdomen/Pelvis (with contrast)',r:'Grade II splenic laceration, 2cm subcapsular hematoma\nSmall volume hemoperitoneum\nNo active extravasation\nNo liver, renal, or bowel injury\nNo pelvic fracture',a:true},
  pe_primary:{n:'Primary Survey',r:'A: patent, talking\nB: decreased breath sounds LEFT, trachea midline, RR 28\nC: tachycardic 124, hypotensive 92/58, left chest/abdominal tenderness\nD: GCS 15 (E4V5M6), pupils equal and reactive\nE: road rash left arm/flank, splinting left chest\nSecondary: left chest wall crepitus (rib fractures), tender LUQ',a:true}
}},

{id:68,cat:'Emergency',spec:'Emergency Medicine',pres:'Poisoning/Overdose',focus:'Toxidrome recognition',set:'ED',
 nm:'Amanda Foster',age:22,sx:'F',eth:'Caucasian-Canadian',
 ap:'Drowsy young woman, pinpoint pupils, slow breathing, brought by roommate',
 dx:'Opioid overdose (fentanyl)',
 hr:56,sbp:94,dbp:56,rr:6,tmp:36.2,o2:84,
 op:"*barely responsive, mumbling* ...mmmm... leave me alone... *nods off*\n[Roommate: She was at a party. I found her on the bathroom floor not really breathing. I think someone gave her something.]",
 dm:['Opioid toxidrome: miosis, respiratory depression, CNS depression — naloxone 0.4mg IV, may need repeat dosing','Fentanyl: may need higher/repeated naloxone doses','Observe ≥4h after last naloxone (fentanyl can outlast naloxone)'],
 rs:{
  utox:{n:'Urine Drug Screen',r:'Opioids: POSITIVE (fentanyl immunoassay positive)\nBenzodiazepines: negative\nEthanol: 12 mmol/L (mildly intoxicated)\nCocaine: negative\nTHC: negative',a:true},
  abg:{n:'Arterial Blood Gas',r:'pH: 7.24 (7.35-7.45) ↓↓ (respiratory acidosis)\npCO2: 68 mmHg (35-45) ↑↑↑\npO2: 52 mmHg (80-100) ↓↓↓\nHCO3: 26 mmol/L\nLactate: 3.2 mmol/L ↑',a:true},
  pe_general:{n:'General Exam',r:'GCS: 9 (E2V3M4)\nPupils: 1mm bilateral (pinpoint), sluggishly reactive\nRR: 6, shallow\nOxygen saturation: 84% on room air\nHeart: bradycardic, regular\nSkin: cool, pale, cyanotic lips\nTrack marks: none visible\nNasal mucosa: irritated (snorting)\nResponse to sternal rub: grimace, withdraws',a:true}
}},

{id:69,cat:'Emergency',spec:'Emergency Medicine',pres:'Allergic Reaction',focus:'Anaphylaxis management',set:'ED',
 nm:'David Kowalski',age:40,sx:'M',eth:'Polish-Canadian',
 ap:'Swollen face, urticarial rash, audible wheeze, appears panicked',
 dx:'Anaphylaxis (peanut allergy)',
 hr:132,sbp:82,dbp:48,rr:30,tmp:37.0,o2:89,
 op:"*wheezing, speaking in short phrases* ...ate something... peanuts... *grabbing throat* ...I can't... breathe... epipen... didn't have it...",
 dm:['Anaphylaxis: IM epinephrine 0.3-0.5mg (1:1000) anterolateral thigh — FIRST, before anything else','Biphasic reaction can occur 4-12h later — observe minimum 6h','Prescribe EpiPen and allergist referral on discharge'],
 rs:{
  pe_general:{n:'General Exam',r:'Acute distress, sitting upright\nFacial angioedema: lips, periorbital, tongue mildly swollen\nOropharynx: uvular edema, no complete obstruction\nVoice: hoarse, slightly muffled\nSkin: diffuse urticaria (confluent wheals trunk, extremities)\nResp: bilateral wheeze, decreased air entry, accessory muscle use\nCardiac: tachycardic, regular, no murmurs\nAbdomen: mild cramping, hyperactive bowel sounds\nBP: 82/48 (hypotensive)',a:true}
}},

{id:70,cat:'Emergency',spec:'Emergency Medicine',pres:'Burns',focus:'Burn assessment + fluid resuscitation',set:'ED',
 nm:'Carlos Rivera',age:29,sx:'M',eth:'Mexican-Canadian',
 ap:'Construction worker, partial burns on arms and chest, pain evident, soot on face',
 dx:'Partial-thickness (second-degree) burns — 18% TBSA with inhalation injury',
 hr:118,sbp:106,dbp:68,rr:24,tmp:37.2,o2:93,
 op:"*in pain* The propane tank— it just exploded. My arms, my chest... *coughing* I was right next to it. I breathed in the smoke. Please, it hurts so much.",
 dm:['Rule of Nines: estimate TBSA — each arm 9%, anterior trunk 18%','Parkland formula: 4mL × kg × %TBSA, half in first 8h from BURN TIME','Singed nasal hairs, soot, hoarse voice = inhalation injury — intubate early before edema'],
 rs:{
  cxr:{n:'Chest X-ray',r:'Lungs clear currently\nNo pneumothorax\nCarbon deposits in airways possible\n(Early CXR can be normal with inhalation injury)',a:false},
  abg:{n:'Arterial Blood Gas',r:'pH: 7.34 ↓\npCO2: 42 mmHg\npO2: 68 mmHg ↓↓\nCO-Hgb: 12% (<3%) ↑↑↑ (carbon monoxide exposure)\nLactate: 3.1 mmol/L ↑',a:true},
  cbc:{n:'CBC / BMP',r:'WBC: 18.4 ×10⁹/L ↑↑\nHgb: 162 g/L (hemoconcentration)\nNa: 144 mmol/L\nK: 5.2 mmol/L ↑\nCr: 98 µmol/L\nGlucose: 11.2 mmol/L ↑ (stress response)',a:true},
  pe_burn:{n:'Burn Assessment',r:'Distribution: bilateral upper extremities (anterior), anterior chest\nDepth: mixed partial thickness (superficial and deep)\n- Blistering, erythema, moist, very painful to touch\n- Some areas waxy white (deep partial approaching full thickness)\nTBSA estimate: 18% (arms 9% each anterior = ~9%, chest 9%)\nFace: soot around nose and mouth, singed nasal hairs\nVoice: becoming hoarse\nStridor: mild inspiratory stridor developing\nWeight: 80kg → Parkland: 4 × 80 × 18 = 5,760mL in 24h',a:true}
}},

{id:71,cat:'Emergency',spec:'Emergency Medicine',pres:'Poisoning/Overdose',focus:'Acetaminophen overdose',set:'ED',
 nm:'Rebecca Simard',age:19,sx:'F',eth:'French-Canadian',
 ap:'Tearful young woman, brought by boyfriend, appears alert but distressed',
 dx:'Acute acetaminophen overdose — toxic level requiring NAC',
 hr:88,sbp:118,dbp:72,rr:16,tmp:36.8,o2:99,
 op:"*crying* I took all the Tylenol in the bottle. I don't know, maybe 20 pills? That was about 4 hours ago. I had a fight with my boyfriend and I just... I wasn't thinking. My stomach hurts now and I feel nauseous. I'm scared, I don't actually want to die.",
 dm:['Acetaminophen: 4-hour level + plot on Rumack-Matthew nomogram','NAC (N-acetylcysteine) if level above treatment line — most effective within 8h','Liver panel, INR, creatinine at baseline; repeat at 24h; can be asymptomatic initially'],
 rs:{
  apap:{n:'Acetaminophen Level (4h)',r:'Acetaminophen: 1,200 µmol/L at 4h post-ingestion\nRumack-Matthew nomogram: ABOVE treatment line ↑↑↑\nNAC protocol indicated',a:true},
  lft:{n:'Liver Panel',r:'AST: 28 U/L (<35) — normal at 4h\nALT: 32 U/L (<35) — normal at 4h\nINR: 1.0 — normal\nTotal bilirubin: 12 µmol/L — normal\n(Liver injury typically appears 24-72h post-ingestion)',a:false},
  bmp:{n:'BMP',r:'Na: 139 mmol/L\nK: 3.8 mmol/L\nCr: 62 µmol/L\nGlucose: 5.2 mmol/L\n(Normal baseline)',a:false},
  asa:{n:'Salicylate / Co-ingestants',r:'Salicylate: undetectable\nEthanol: undetectable\n(No co-ingestion identified)',a:false},
  pe_general:{n:'General Exam',r:'Alert, tearful, cooperative\nAbdomen: mild RUQ tenderness (early)\nNo jaundice\nVitals stable\nGCS 15\nPupils normal\nNo other injuries',a:false}
}},

{id:72,cat:'Emergency',spec:'Emergency Medicine',pres:'Syncope',focus:'Cardiac vs vasovagal vs neuro',set:'ED',
 nm:'Harold Mitchell',age:72,sx:'M',eth:'Caucasian-Canadian',
 ap:'Elderly man on stretcher, laceration on forehead from fall, alert now',
 dx:'Complete heart block (third-degree AV block) with syncope',
 hr:38,sbp:98,dbp:54,rr:16,tmp:36.7,o2:95,
 op:"I was walking to the kitchen and the next thing I know I'm on the floor. Hit my head on the counter. My wife heard the crash. I didn't feel dizzy before — just boom, lights out. This has happened once before about a week ago but I came to right away.",
 dm:['Syncope in elderly: cardiac until proven otherwise — ECG immediately','Bradycardia + syncope: think high-grade AV block, sick sinus','Complete heart block: temporary pacing → permanent pacemaker'],
 rs:{
  ecg:{n:'12-Lead ECG',r:'Ventricular rate: 38 bpm\nAtrial rate: 82 bpm\nComplete AV dissociation (P waves march through QRS)\nThird-degree (complete) heart block\nWide QRS escape rhythm (0.14s)\nNo ST changes',a:true},
  cbc_bmp:{n:'CBC / BMP / Troponin',r:'WBC: 7.4 ×10⁹/L\nHgb: 132 g/L\nTroponin I: 18 ng/L (<14) borderline ↑\nNa: 138 mmol/L\nK: 4.6 mmol/L\nCr: 112 µmol/L ↑\nGlucose: 6.8 mmol/L',a:true},
  ct_head:{n:'CT Head',r:'Small right frontal scalp hematoma (from fall)\nNo intracranial hemorrhage\nNo skull fracture\nAge-appropriate cerebral atrophy\nNo acute findings',a:false},
  pe_general:{n:'General Exam',r:'Alert, oriented x3\n2cm forehead laceration (needs sutures)\nHR 38, regular, slow\nBP 98/54 (postural drop: sitting 98/54 → standing 76/44)\nJVP: cannon A waves visible\nHeart: slow, regular, variable S1 intensity\nChest clear\nNo pedal edema\nNeuro: no focal deficits',a:true}
}},

// ======================== FAMILY MEDICINE (6) ========================
{id:73,cat:'Family Medicine',spec:'Family Medicine',pres:'Hypertension',focus:'New HTN workup + counseling',set:'Clinic',
 nm:'Raj Gundappa',age:52,sx:'M',eth:'South Asian-Canadian',
 ap:'Overweight man, appears well, surprised by blood pressure reading',
 dx:'Essential (primary) hypertension, stage 2',
 hr:78,sbp:164,dbp:98,rr:14,tmp:36.8,o2:99,
 op:"High blood pressure? But I feel fine! My wife's been on me about my diet and I know I've put on some weight but... I eat normal food. Well, maybe a lot of salt. My father had a heart attack at 58 — is that related?",
 dm:['Hypertension Canada: confirm with ABPM or home BP before labeling if office-only','Assess target organ damage: fundoscopy, urine ACR, ECG, creatinine','South Asian + HTN + family hx MI = high cardiovascular risk — may need earlier pharmacotherapy'],
 rs:{
  bmp:{n:'BMP',r:'Na: 141 mmol/L\nK: 4.2 mmol/L\nCr: 98 µmol/L (60-110)\nGlucose (fasting): 6.4 mmol/L (5.6-6.9 = prediabetes) ↑\neGFR: 74 mL/min (mildly reduced)',a:true},
  lipids:{n:'Lipid Panel',r:'Total cholesterol: 6.4 mmol/L ↑\nLDL: 4.2 mmol/L ↑↑\nHDL: 0.9 mmol/L ↓↓\nTriglycerides: 2.8 mmol/L ↑\nFramingham Risk Score: 18% (high)',a:true},
  hba1c:{n:'HbA1c',r:'HbA1c: 6.2% (5.7-6.4 = prediabetes) ↑',a:true},
  urine_acr:{n:'Urine ACR',r:'Albumin:creatinine ratio: 4.2 mg/mmol (<2.0) ↑↑\n(Microalbuminuria — early target organ damage)',a:true},
  ecg:{n:'ECG',r:'Normal sinus rhythm, rate 78\nLeft ventricular hypertrophy by voltage criteria\n(Sokolow-Lyon: S-V1 + R-V5 = 42mm, >35mm = LVH)',a:true},
  pe_general:{n:'General Exam',r:'BMI: 31.4\nWaist circumference: 108cm (>102 = central obesity)\nBP: 164/98 (repeated: 158/96)\nFundoscopy: AV nicking, copper wiring (Grade II retinopathy)\nCardiac: S4 gallop, no murmurs\nPeripheral pulses: intact\nNo edema',a:true}
}},

{id:74,cat:'Family Medicine',spec:'Family Medicine',pres:'Back Pain',focus:'Red flags + conservative management',set:'Clinic',
 nm:'Catherine Lefebvre',age:45,sx:'F',eth:'French-Canadian',
 ap:'Woman walking stiffly, hand on lower back, slightly limping',
 dx:'Acute mechanical low back pain (lumbar strain)',
 hr:76,sbp:122,dbp:76,rr:14,tmp:36.8,o2:99,
 op:"I was lifting boxes at work yesterday and felt something pop in my lower back. Now I can barely move. The pain goes across my lower back — not down my legs though. I just need it fixed, I can't miss work.",
 dm:['Red flags: saddle anesthesia, urinary retention, progressive neuro deficit, fever, weight loss, cancer hx','No red flags = no imaging needed in first 6 weeks','NSAIDs + stay active + physiotherapy — bed rest is harmful'],
 rs:{
  pe_msk:{n:'MSK / Neuro Exam',r:'Gait: antalgic, slow but able to walk\nLumbar spine: paravertebral muscle spasm bilateral L4-S1\nFlexion limited to 40° by pain\nExtension limited to 10°\nStraight leg raise: negative bilaterally\nFemoral nerve stretch: negative\nStrength: 5/5 all myotomes (L2-S1)\nSensation: intact\nReflexes: 2+ knees, 2+ ankles, symmetric\nRectal tone: not indicated (no red flags)\nNo midline tenderness\nSI joints: non-tender',a:false}
}},

{id:75,cat:'Family Medicine',spec:'Family Medicine',pres:'Skin Rash',focus:'Dermatology DDx',set:'Clinic',
 nm:'Thomas Wright',age:35,sx:'M',eth:'Caucasian-Canadian',
 ap:'Man rolling up sleeve to show forearm rash, appears worried',
 dx:'Psoriasis vulgaris (plaque psoriasis)',
 hr:72,sbp:120,dbp:76,rr:14,tmp:36.8,o2:99,
 op:"This rash started on my elbows a few months ago and now it's spreading to my knees and scalp. It's thick and flaky and itchy. My dad had something similar. I tried moisturizer but it doesn't help.",
 dm:['Psoriasis: well-demarcated, salmon-pink plaques with silvery scale — Auspitz sign','Check nails (pitting, onycholysis) and joints (psoriatic arthritis in 30%)','Topical corticosteroids + vitamin D analogues first-line; phototherapy or systemic for extensive'],
 rs:{
  pe_skin:{n:'Skin Exam',r:'Well-demarcated erythematous plaques with thick silvery-white scale:\n- Bilateral elbows: 4-5cm plaques\n- Bilateral knees: 3-4cm plaques\n- Scalp: diffuse scaling at hairline extending onto forehead\n- Gluteal cleft: inverse psoriasis (erythema without scale)\nAuspitz sign: positive (pinpoint bleeding with scale removal)\nKoebner phenomenon: linear plaque at old scratch mark\nNails: pitting (8-10 pits on each thumbnail), mild onycholysis right index\nJoints: no active synovitis, no dactylitis\nBSA involvement: approximately 8%',a:true}
}},

{id:76,cat:'Family Medicine',spec:'Family Medicine',pres:'Fatigue',focus:'Broad DDx + screening',set:'Clinic',
 nm:'Maria Santos',age:38,sx:'F',eth:'Portuguese-Canadian',
 ap:'Woman appearing tired, pale, bags under eyes, speaking slowly',
 dx:'Hypothyroidism (Hashimoto thyroiditis)',
 hr:58,sbp:108,dbp:68,rr:12,tmp:36.2,o2:99,
 op:"I'm just so tired. All the time. I sleep nine hours and still wake up exhausted. I've gained weight even though I'm not eating more. My hair is falling out and I'm freezing when everyone else is fine. My periods have been heavier too.",
 dm:['Hypothyroid: fatigue + weight gain + cold intolerance + menorrhagia + constipation + dry skin','TSH is the screening test; if elevated, check free T4','Levothyroxine replacement; recheck TSH in 6-8 weeks'],
 rs:{
  tsh:{n:'TSH / Free T4',r:'TSH: 34.2 mIU/L (0.5-4.5) ↑↑↑↑\nFree T4: 6.2 pmol/L (12-22) ↓↓↓\nFree T3: 2.1 pmol/L (3.1-6.8) ↓↓\n(Primary hypothyroidism)',a:true},
  tpo:{n:'Anti-TPO Antibodies',r:'Anti-TPO: 892 IU/mL (<35) ↑↑↑\n(Confirms Hashimoto thyroiditis)',a:true},
  cbc:{n:'CBC',r:'WBC: 5.4 ×10⁹/L\nHgb: 108 g/L ↓\nMCV: 92 fL (normocytic)\nPlt: 198 ×10⁹/L',a:true},
  lipids:{n:'Lipid Panel',r:'Total cholesterol: 7.2 mmol/L ↑↑\nLDL: 4.8 mmol/L ↑↑\n(Hyperlipidemia secondary to hypothyroidism)',a:true},
  pe_general:{n:'General Exam',r:'Bradycardic (HR 58)\nSkin: dry, cool, doughy\nHair: diffuse thinning, coarse\nFace: periorbital puffiness, mild non-pitting edema\nThyroid: diffuse, firm, non-tender goiter\nReflexes: delayed relaxation phase ("hung-up" reflexes)\nWeight: gained 8kg in 6 months\nNo carpal tunnel signs',a:true}
}},

{id:77,cat:'Family Medicine',spec:'Family Medicine',pres:'Weight Loss',focus:'Unintentional weight loss',set:'Clinic',
 nm:'George Campbell',age:68,sx:'M',eth:'Scottish-Canadian',
 ap:'Thin elderly man, clothes hanging loose, slightly cachectic',
 dx:'Lung adenocarcinoma (non-small cell lung cancer)',
 hr:82,sbp:136,dbp:78,rr:18,tmp:37.0,o2:94,
 op:"My pants don't fit anymore and I haven't been trying to lose weight. Maybe 15 pounds in two months? I'm not that hungry. I've had this cough that won't go away — it's been months. I smoked for 35 years but quit 10 years ago. And yesterday I coughed up some blood.",
 dm:['Unintentional weight loss >5% in 6 months: screen for malignancy, especially with smoking history','Hemoptysis + weight loss + chronic cough in ex-smoker = lung cancer until proven otherwise','CT chest → tissue biopsy → staging'],
 rs:{
  cxr:{n:'Chest X-ray',r:'3.5cm right upper lobe mass\nRight hilar lymphadenopathy\nNo pleural effusion\nNo bony destruction visible',a:true},
  ct_chest:{n:'CT Chest (with contrast)',r:'4.2 x 3.8cm spiculated mass in right upper lobe\nRight hilar and mediastinal lymphadenopathy (largest 2.4cm)\nNo chest wall invasion\nSmall right pleural effusion\nNo liver metastases on upper cuts\nRight adrenal nodule 1.8cm (indeterminate)',a:true},
  cbc:{n:'CBC / Metabolic',r:'WBC: 8.4 ×10⁹/L\nHgb: 112 g/L ↓\nAlbumin: 28 g/L ↓↓\nCalcium (corrected): 2.82 mmol/L (2.10-2.55) ↑↑\n(Hypercalcemia of malignancy)',a:true},
  pe_resp:{n:'Respiratory Exam',r:'Decreased air entry right upper zone\nDull to percussion right upper zone\nNo wheezing\nDigital clubbing present\nRight supraclavicular lymph node palpable (1.5cm, hard, fixed)\nCachexia: temporal wasting, prominent clavicles\nWeight: 62kg (usual 72kg)',a:true}
}},

{id:78,cat:'Family Medicine',spec:'Family Medicine',pres:'Cough',focus:'Chronic cough workup',set:'Clinic',
 nm:'Sandra Kim',age:42,sx:'F',eth:'Korean-Canadian',
 ap:'Woman clearing her throat frequently, otherwise well-appearing',
 dx:'Gastroesophageal reflux disease (GERD) causing chronic cough',
 hr:72,sbp:118,dbp:74,rr:14,tmp:36.8,o2:99,
 op:"This cough has been going on for three months. It's dry, worse at night and after eating. No cold, no fever. I don't smoke. I've tried cough syrup, honey, everything. It's keeping me up at night. Oh, and I do get heartburn sometimes but I didn't think that was related.",
 dm:['Chronic cough top 3: upper airway cough syndrome (UACS/postnasal drip), asthma, GERD','GERD cough: worse postprandially and supine, may have no classic reflux symptoms','Trial of PPI x8 weeks is diagnostic and therapeutic'],
 rs:{
  cxr:{n:'Chest X-ray',r:'Normal heart size\nClear lungs bilaterally\nNo masses, infiltrates, or effusions\nNormal mediastinum',a:false},
  spirometry:{n:'Spirometry',r:'FEV1: 3.2L (98% predicted)\nFVC: 3.8L (100% predicted)\nFEV1/FVC: 0.84 (normal)\nNo bronchodilator response\n(Rules out asthma/COPD)',a:false},
  pe_general:{n:'General Exam',r:'Pharynx: cobblestoning (mild — postnasal drip component)\nLarynx: not visualized (ENT referral if PPI fails)\nChest: clear, no wheezes\nCardiac: normal\nAbdomen: mild epigastric tenderness\nNo lymphadenopathy\nBMI: 27 (mild overweight — contributes to reflux)',a:false}
}},

// ======================== OTHER SPECIALTIES (6) ========================
{id:79,cat:'Medicine',spec:'Hematology / Oncology',pres:'Anemia',focus:'Iron deficiency vs chronic disease',set:'Clinic',
 nm:'Priya Sharma',age:32,sx:'F',eth:'South Asian-Canadian',
 ap:'Pale woman, appears fatigued, slight tachycardia',
 dx:'Iron deficiency anemia (menorrhagia)',
 hr:96,sbp:108,dbp:66,rr:16,tmp:36.8,o2:98,
 op:"I've been really tired for months. Dizzy when I stand up. My periods have been very heavy — like soaking through pads. I'm vegetarian and my mom said I look pale. I tried iron pills but they make my stomach hurt.",
 dm:['Iron deficiency: microcytic anemia + low ferritin + high TIBC','In premenopausal women: menorrhagia is #1 cause — assess with pictorial blood loss chart','Treat cause + oral iron (with vitamin C, empty stomach) or IV iron if intolerant/severe'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 6.2 ×10⁹/L\nHgb: 78 g/L (120-160) ↓↓↓↓\nMCV: 68 fL (80-100) ↓↓ (microcytic)\nMCH: 24 pg (27-32) ↓\nRDW: 18.4% (<14.5) ↑↑ (anisocytosis)\nPlt: 412 ×10⁹/L ↑ (reactive thrombocytosis)\nReticulocyte count: 1.8%',a:true},
  iron:{n:'Iron Studies',r:'Ferritin: 4 µg/L (12-150) ↓↓↓ (depleted stores)\nSerum iron: 3 µmol/L (9-21) ↓↓↓\nTIBC: 82 µmol/L (45-72) ↑↑\nTransferrin saturation: 4% (20-50) ↓↓↓',a:true},
  pe_general:{n:'General Exam',r:'Pallor: conjunctival, palmar creases, nail beds\nKoilonychia (spoon nails) bilateral\nAngular cheilitis\nGlossal atrophy (smooth tongue)\nTachycardic, flow murmur (II/VI systolic, apex)\nNo hepatosplenomegaly\nNo lymphadenopathy',a:true}
}},

{id:80,cat:'Medicine',spec:'Hematology / Oncology',pres:'Lymphadenopathy',focus:'Lymphoma vs reactive',set:'Clinic',
 nm:'Andrew Patterson',age:24,sx:'M',eth:'Caucasian-Canadian',
 ap:'Young man with visible neck mass, appears otherwise healthy',
 dx:'Hodgkin lymphoma (nodular sclerosis subtype)',
 hr:74,sbp:122,dbp:76,rr:14,tmp:37.0,o2:99,
 op:"I noticed this lump on my neck about six weeks ago. It doesn't hurt. I've been having night sweats — drenching, like I have to change my sheets. And I've lost maybe 10 pounds without trying. I also get itchy after hot showers which is weird.",
 dm:['B symptoms: fever, night sweats, >10% weight loss — suggest lymphoma over reactive','Excisional biopsy preferred over FNA for lymphoma diagnosis (architecture needed)','Hodgkin: bimodal (20s and 60s), painless lymphadenopathy, Reed-Sternberg cells'],
 rs:{
  cbc:{n:'CBC',r:'WBC: 11.2 ×10⁹/L ↑\nHgb: 128 g/L\nPlt: 342 ×10⁹/L ↑\nDifferential: eosinophilia 8% ↑\nESR: 48 mm/hr ↑↑',a:true},
  ldh:{n:'LDH / Chemistry',r:'LDH: 342 U/L (<250) ↑↑\nAlbumin: 32 g/L ↓\nAlkaline phosphatase: normal\nCreatinine: normal',a:true},
  ct_nck:{n:'CT Neck/Chest/Abdomen/Pelvis',r:'Multiple enlarged lymph nodes right cervical chain (largest 3.4cm)\nBilateral mediastinal lymphadenopathy (bulky — 8cm conglomerate)\nNo axillary or inguinal lymphadenopathy\nSpleen normal\nNo liver lesions',a:true},
  biopsy:{n:'Excisional Node Biopsy',r:'Hodgkin lymphoma, nodular sclerosis subtype\nReed-Sternberg cells present\nCD30+, CD15+, PAX5 weak+\nStage IIB (cervical + mediastinal with B symptoms)',a:true},
  pe_general:{n:'General Exam',r:'Right anterior cervical lymph node: 3.5cm, rubbery, non-tender, mobile\nLeft cervical: 1.5cm node, same character\nNo axillary or inguinal lymphadenopathy\nNo hepatosplenomegaly\nSkin: excoriations from pruritus\nNo rash\nChest: clear',a:true}
}},

{id:81,cat:'Emergency',spec:'Emergency Medicine',pres:'Altered Mental Status',focus:'AMS workup',set:'ED',
 nm:'Dorothy Chen',age:78,sx:'F',eth:'Chinese-Canadian',
 ap:'Elderly woman, confused, pulling at IV, intermittently agitated',
 dx:'Delirium secondary to urinary tract infection (urosepsis)',
 hr:108,sbp:96,dbp:54,rr:22,tmp:38.8,o2:94,
 op:"*confused, disoriented* Where am I? I want to go home! *to nurse* You\'re not my daughter... *agitated* ...stop touching me!\n[Son: She was fine yesterday. This morning she didn\'t know who I was. She\'s been falling and not eating.]",
 dm:['Delirium: acute, fluctuating, inattention — use CAM criteria','Common causes in elderly: infection (UTI/pneumonia), medications, metabolic, constipation, pain','Treat the CAUSE, not the agitation — avoid restraints and antipsychotics if possible'],
 rs:{
  ua:{n:'Urinalysis',r:'Appearance: cloudy, foul-smelling\nLE: 3+ positive ↑↑↑\nNitrites: positive ↑\nWBC: >100/hpf ↑↑↑\nBacteria: many gram-negative rods\nRBC: 10-20/hpf',a:true},
  cbc:{n:'CBC',r:'WBC: 18.4 ×10⁹/L ↑↑↑ — left shift (12% bands)\nHgb: 108 g/L ↓\nPlt: 128 ×10⁹/L ↓',a:true},
  bmp:{n:'BMP',r:'Na: 148 mmol/L ↑ (dehydration)\nK: 3.4 mmol/L ↓\nCr: 142 µmol/L ↑↑ (baseline 88)\nGlucose: 8.2 mmol/L ↑\nLactate: 4.2 mmol/L ↑↑↑ (sepsis)',a:true},
  blood_cx:{n:'Blood Culture',r:'Blood cultures x2: drawn\nPreliminary (18h): gram-negative rods growing\nFinal: E. coli\nSensitive to ceftriaxone, TMP-SMX, ciprofloxacin',a:true},
  pe_general:{n:'General Exam',r:'CAM positive: acute onset, fluctuating, inattentive, disorganized thinking\nGCS: 13 (E3V4M6)\nMucous membranes dry\nSuprapubic tenderness\nCostovertebral angle tenderness right\nNo meningeal signs\nNo focal neurological deficits\nSkin: no pressure injuries\nTachycardic, hypotensive',a:true}
}},

{id:82,cat:'Emergency',spec:'Emergency Medicine',pres:'Cardiac Arrest',focus:'ACLS algorithm',set:'ED',
 nm:'Frank Morrison',age:62,sx:'M',eth:'Caucasian-Canadian',
 ap:'Unresponsive man on stretcher, CPR in progress by EMS, monitor shows VFib',
 dx:'Cardiac arrest — ventricular fibrillation (STEMI)',
 hr:0,sbp:0,dbp:0,rr:0,tmp:36.0,o2:0,
 op:"[EMS handover] 62-year-old male, witnessed arrest at home. Wife started CPR within 2 minutes. We arrived at 8 minutes. Found in VFib. Shocked x2 en route, brief ROSC then re-arrested. Total downtime: 14 minutes. No ROSC currently.",
 dm:['VFib/pVT: DEFIBRILLATE immediately, then CPR 2 min, then rhythm check','Epinephrine 1mg IV q3-5min; Amiodarone 300mg after 3rd shock, then 150mg','H\'s and T\'s: Hypovolemia, Hypoxia, Hydrogen ion, Hypo/hyperK, Hypothermia, Tension pneumo, Tamponade, Toxins, Thrombosis (coronary/pulmonary)'],
 rs:{
  ecg:{n:'Cardiac Monitor',r:'Initial: coarse ventricular fibrillation\nPost-ROSC: sinus tachycardia 110\nST elevation leads II, III, aVF, V5-V6 (acute inferior-lateral STEMI)\n12-lead confirms STEMI — cath lab activation',a:true},
  abg:{n:'ABG (post-ROSC)',r:'pH: 7.18 ↓↓↓ (severe acidosis)\npCO2: 32 mmHg ↓ (compensatory)\npO2: 188 mmHg (on 100% O2)\nHCO3: 12 mmol/L ↓↓↓ (metabolic acidosis)\nLactate: 12.4 mmol/L ↑↑↑↑',a:true},
  troponin:{n:'Troponin',r:'hs-TnI: 4,200 ng/L (<14) ↑↑↑↑\n(Massive troponin rise — acute MI)',a:true},
  pe_primary:{n:'Resuscitation Assessment',r:'Airway: intubated, ETT confirmed 22cm at teeth\nBreathing: bilateral breath sounds, ETCO2 38mmHg (good CPR)\nCirculation: CPR ongoing, femoral pulse with compressions\nDisability: GCS 3T (intubated, no response)\nExposure: no obvious trauma\nROSC achieved after 4th shock + amiodarone\nPost-ROSC: BP 88/52 on norepinephrine, HR 110 sinus tach',a:true}
}},

{id:83,cat:'Medicine',spec:'Neurology',pres:'Seizures',focus:'New-onset seizure workup',set:'ED',
 nm:'Jennifer Huang',age:30,sx:'F',eth:'Chinese-Canadian',
 ap:'Postictal woman, drowsy, tongue laceration, urinary incontinence',
 dx:'New-onset generalized tonic-clonic seizure — likely epilepsy (idiopathic)',
 hr:102,sbp:142,dbp:88,rr:18,tmp:37.2,o2:96,
 op:"*drowsy, confused* ...what happened? Where am I? *pause* ...my tongue hurts. My whole body is sore.\n[Partner: She was sitting on the couch and she just went stiff and started shaking. It lasted about 2 minutes. She bit her tongue and wet herself. She was out of it after for like 20 minutes.]",
 dm:['First seizure: rule out provoking cause (metabolic, toxic, structural, infection) before labeling epilepsy','CT head acutely; MRI brain + EEG as outpatient','Driving restriction after seizure — varies by province (typically 3-12 months seizure-free)'],
 rs:{
  ct_head:{n:'CT Head (non-contrast)',r:'No acute intracranial pathology\nNo hemorrhage, mass, or midline shift\nNo hydrocephalus\nNormal grey-white differentiation',a:false},
  cbc_bmp:{n:'CBC / BMP',r:'WBC: 12.4 ×10⁹/L ↑ (postictal leukocytosis)\nHgb: 138 g/L\nNa: 140 mmol/L\nK: 3.8 mmol/L\nCa (corrected): 2.34 mmol/L\nGlucose: 7.8 mmol/L ↑ (postictal)\nMg: 0.82 mmol/L',a:false},
  prolactin:{n:'Prolactin',r:'Prolactin (within 30 min of event): 58 µg/L (<25) ↑↑\n(Elevated post-GTC — helps distinguish from pseudoseizure)',a:true},
  pe_general:{n:'General Exam',r:'Postictal: drowsy, oriented to person only\nTongue: lateral tongue laceration (left side, 1cm)\nUrinary incontinence occurred\nBilateral shoulder tenderness (no dislocation on X-ray)\nNo meningeal signs\nNo focal neurological deficits\nFundoscopy: no papilledema\nGradually clearing over 30 minutes',a:true}
}},

{id:84,cat:'Medicine',spec:'Endocrinology',pres:'Thyroid Enlargement',focus:'Thyroid nodule workup',set:'Clinic',
 nm:'Margaret O\'Sullivan',age:55,sx:'F',eth:'Irish-Canadian',
 ap:'Woman with visible neck swelling, appears otherwise well',
 dx:'Papillary thyroid carcinoma',
 hr:76,sbp:128,dbp:78,rr:14,tmp:36.8,o2:99,
 op:"I noticed this lump in my neck about two months ago. My daughter pointed it out actually — said my neck looked swollen on one side. It doesn't hurt. I feel fine otherwise. But my mother had thyroid problems and I'm worried.",
 dm:['Thyroid nodule >1cm with suspicious US features → FNA biopsy','Suspicious features: solid, hypoechoic, irregular margins, taller-than-wide, microcalcifications','TSH first — if low, do thyroid scan (hot nodule = usually benign)'],
 rs:{
  tsh:{n:'TSH / Free T4',r:'TSH: 2.4 mIU/L (0.5-4.5) — normal (euthyroid)\nFree T4: 16 pmol/L (12-22) — normal',a:false},
  us_thyroid:{n:'Thyroid Ultrasound',r:'Right lobe: 2.8 x 2.2 x 1.8cm solid hypoechoic nodule\nIrregular margins, taller than wide\nMicrocalcifications present\nIntranodular vascularity\nACR TI-RADS 5 (highly suspicious)\nRight level VI lymph node: 1.2cm, rounded, loss of fatty hilum\nLeft lobe: normal, no nodules',a:true},
  fna:{n:'FNA Biopsy (Bethesda)',r:'Bethesda VI: Malignant\nPapillary thyroid carcinoma\nPsammoma bodies present\nOrphan Annie nuclei\nBRAF V600E mutation: positive',a:true},
  pe_neck:{n:'Neck Exam',r:'Right thyroid lobe: firm, non-tender, 3cm nodule\nMoves with swallowing\nNot fixed to overlying skin or deep structures\nRight level VI lymph node palpable (1cm, firm)\nLeft lobe: normal\nNo stridor, no hoarseness\nVocal cord mobility: normal (assessed by history — no voice change)',a:true}
}}

];
