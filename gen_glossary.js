const https = require('https');
const fs = require('fs');

const API_KEY = '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';

function claude(system, user) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 8192,
      system: system,
      messages: [{ role: 'user', content: user }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: { 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    }, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => {
        if (res.statusCode === 200) resolve(JSON.parse(b).content[0].text);
        else if (res.statusCode === 429) { console.log('Rate limited, waiting 20s...'); setTimeout(() => claude(system, user).then(resolve).catch(reject), 20000); }
        else reject(new Error(res.statusCode + ': ' + b.slice(0, 300)));
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const SYS = 'You are a medical reference generator for MCCQE Part I exam prep. Return ONLY a raw JSON array — NO markdown, NO code fences, NO explanation. Just the array starting with [ and ending with ]. Each entry: {"term":"...","definition":"...","category":"...","persian":"..."}. Categories: abbreviation, eponym, sign, scale, anatomy, drug, procedure, pathology, physiology, lab, imaging, micro. Include Persian/Farsi translation. Keep definitions to 1 sentence.';

const batches = [
  'Generate 50 MCCQE-essential ABBREVIATIONS (part 1). Include: CBC, BMP, CMP, LFTs, ABG, VBG, INR, PTT, PT, ESR, CRP, BNP, TSH, HbA1c, GFR, BUN, ANA, ANCA, RF, ACE, ACTH, FSH, LH, AFP, CEA, PSA, CA-125, UA, CSF, EKG/ECG, CXR, CT, MRI, US, PET, ERCP, MRCP, EEG, EMG, NCS, PFT, ABX, NSAID, PPI, SSRI, TCA, MAOI, ACEi, ARB, CCB, BB, DMARD, TNF, DVT, PE, MI, CVA, TIA, ACS, CHF, COPD, DKA, DIC, TTP, HUS, ITP, SLE, RA, OA, IBD, IBS, GERD, PID, STI, UTI, AKI, CKD, ESRD, RTA, SIADH, DI, MEN, APS, GBS, MS, ALS, PD, HD, CF, PKD, NF, VHL, FAP, HNPCC, BRCA, HLA, MHC, Ig',

  'Generate 80 MCCQE-essential EPONYMS AND CLINICAL SIGNS. Include: McBurney point, Murphy sign, Rovsing sign, Psoas sign, Obturator sign, Kernig sign, Brudzinski sign, Babinski sign, Romberg test, Rinne test, Weber test, Chvostek sign, Trousseau sign, Kussmaul breathing, Cheyne-Stokes, Cullen sign, Grey Turner sign, Battle sign, Raccoon eyes, Virchow node, Sister Mary Joseph nodule, Courvoisier sign, Lhermitte sign, Phalen test, Tinel sign, Finkelstein test, McMurray test, Lachman test, anterior drawer, posterior drawer, Thompson test, Allen test, Ortolani test, Barlow test, Trendelenburg sign, Nikolsky sign, Auspitz sign, Koebner phenomenon, Darier sign, Janeway lesions, Osler nodes, Roth spots, Splinter hemorrhages, Kehr sign, Chandelier sign, Chadwick sign, Hegar sign, Apley test, Spurling test, Lasegue sign, Patrick test, Hawkins test, Neer test, Drop arm test, Speed test, Empty can test, Apprehension test, and 20 more relevant ones',

  'Generate 60 MCCQE-essential CLINICAL SCALES AND SCORES. Include: Glasgow Coma Scale, APGAR, Wells DVT, Wells PE, Geneva score, CURB-65, CHADS2-VASc, HAS-BLED, MELD, Child-Pugh, Ranson criteria, APACHE II, SOFA, qSOFA, Bishop score, Mallampati, ASA classification, TNM staging, Ann Arbor staging, Breslow depth, Clark level, NYHA, CCS angina, Killip, TIMI, HEART score, Ottawa ankle rules, Ottawa knee rules, Canadian C-spine rules, Nexus criteria, PECARN, NIH Stroke Scale, Hunt and Hess, Fisher grade, Modified Rankin, PHQ-9, GAD-7, CAGE, AUDIT-C, Edinburgh Postnatal Depression Scale, MMSE, MoCA, Braden scale, Visual Analog Scale, Wong-Baker faces, FLACC scale, Centor criteria, SNOT-22, IPSS, Clark criteria, and 10 more',

  'Generate 80 MCCQE-essential ANATOMY TERMS and DRUG CLASSES. Anatomy: Circle of Willis, cauda equina, brachial plexus, celiac trunk, portal triad, Calot triangle, inguinal canal, femoral triangle, carpal tunnel, cubital fossa, popliteal fossa, anatomical snuffbox, dermatomes, myotomes, foramen magnum/ovale, triangle of Petit. Drug classes with 1-2 example drugs each: statins, fibrates, ACEi, ARBs, thiazides, loop diuretics, K-sparing diuretics, beta-blockers, CCBs, nitrates, antiplatelets, anticoagulants, thrombolytics, PPIs, H2 blockers, SSRIs, SNRIs, TCAs, MAOIs, benzodiazepines, typical antipsychotics, atypical antipsychotics, mood stabilizers, opioids, NSAIDs, DMARDs, biologics, insulin types, sulfonylureas, metformin, GLP-1 agonists, SGLT2 inhibitors, levothyroxine, steroids, bronchodilators, inhaled corticosteroids, aminoglycosides, fluoroquinolones, cephalosporins, penicillins, macrolides, tetracyclines, carbapenems, vancomycin',

  'Generate 80 MCCQE-essential PROCEDURES, PATHOLOGY, PHYSIOLOGY, LAB VALUES, and MICROBIOLOGY terms. Procedures: intubation, central line, arterial line, chest tube, thoracentesis, paracentesis, lumbar puncture, arthrocentesis, cardioversion, defibrillation, pericardiocentesis, cricothyrotomy, Foley catheter, NG tube, colonoscopy, EGD, bronchoscopy, ERCP, amniocentesis. Pathology: granuloma, abscess, necrosis types (coagulative/liquefactive/caseous/fat/fibrinoid), apoptosis, metaplasia, dysplasia, hyperplasia, infarction, thrombosis, embolism, aneurysm, dissection, amyloidosis, sarcoidosis. Physiology: Frank-Starling law, Fick principle, Henderson-Hasselbalch, Starling forces, RAAS, V/Q ratio, oxygen dissociation curve, Bohr/Haldane effect, cardiac output, ejection fraction, compliance, dead space. Lab normals: Na (135-145), K (3.5-5.0), Cr, BUN, glucose, Ca, Mg, WBC, Hgb, platelets, MCV, ferritin, TSH, troponin, D-dimer, lactate. Micro: gram stain basics, MRSA, VRE, ESBL, C. diff, TB, HIV, hepatitis panel'
];

async function main() {
  console.log('=== Building Medical Glossary ===\n');
  const allEntries = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`[${i+1}/${batches.length}] Generating batch...`);
    try {
      const resp = await claude(SYS, batches[i]);
      let entries;
      // Strip markdown code fences if present
      let cleaned = resp.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      try { entries = JSON.parse(cleaned); } catch {
        // Try to find JSON array
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) {
          let jsonStr = match[0];
          // Fix truncated JSON — find last complete object and close the array
          try { entries = JSON.parse(jsonStr); } catch {
            const lastBrace = jsonStr.lastIndexOf('}');
            if (lastBrace > 0) {
              jsonStr = jsonStr.substring(0, lastBrace + 1) + ']';
              try { entries = JSON.parse(jsonStr); } catch(e3) {
                console.log('  Parse failed after truncation fix:', e3.message.slice(0, 100));
                continue;
              }
            } else {
              console.log('  Parse failed, no valid JSON found');
              continue;
            }
          }
        } else { console.log('  Parse failed, no array found'); continue; }
      }
      allEntries.push(...entries);
      console.log(`  -> ${entries.length} entries`);
      if (i < batches.length - 1) await new Promise(r => setTimeout(r, 2000));
    } catch(e) { console.error('  ERROR:', e.message); }
  }

  console.log(`\nTotal: ${allEntries.length} glossary entries`);

  // Deduplicate
  const seen = new Set();
  const unique = allEntries.filter(e => {
    const k = (e.term || '').toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  console.log(`After dedup: ${unique.length}`);

  fs.writeFileSync('C:/Users/antho/Desktop/MCC/medical_glossary.json', JSON.stringify(unique, null, 2));
  console.log('Saved to medical_glossary.json');

  const cats = {};
  unique.forEach(e => { cats[e.category] = (cats[e.category] || 0) + 1; });
  console.log('\nBy category:');
  Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
}

main().catch(e => { console.error(e); process.exit(1); });
