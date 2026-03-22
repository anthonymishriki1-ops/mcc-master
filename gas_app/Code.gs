// =============================================
// MCC MASTER - Google Apps Script Backend
// =============================================

// --- Configuration ---
function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    SHEET_ID: props.getProperty('SHEET_ID') || '',
    DRIVE_FOLDER_ID: props.getProperty('DRIVE_FOLDER_ID') || '',
    API_KEY: props.getProperty('ANTHROPIC_API_KEY') || '',
    ALLOWED_EMAILS: (props.getProperty('ALLOWED_EMAILS') || '')
      .toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
  };
}

// --- Web App Entry ---
function doGet(e) {
  // Debug: list sheets
  if (e && e.parameter && e.parameter.action === 'debugSheets') {
    var config = getConfig_();
    var ss = SpreadsheetApp.openById(config.SHEET_ID);
    var sheets = ss.getSheets();
    var lines = [];
    sheets.forEach(function(s) { lines.push(s.getName() + ': ' + s.getLastRow() + ' rows'); });
    return ContentService.createTextOutput(lines.join('\n'));
  }

  // Admin trigger: ?action=shareImages to make diagram folder public
  if (e && e.parameter && e.parameter.action === 'shareImages') {
    try {
      var config = getConfig_();
      var folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return ContentService.createTextOutput('Folder shared! Images should now load.');
    } catch(err) {
      return ContentService.createTextOutput('Error: ' + err.message);
    }
  }

  // Admin trigger: ?action=buildGlossary
  if (e && e.parameter && e.parameter.action === 'buildGlossary') {
    var triggers = ScriptApp.getProjectTriggers();
    for (var t = 0; t < triggers.length; t++) {
      if (triggers[t].getHandlerFunction() === 'buildGlossary') ScriptApp.deleteTrigger(triggers[t]);
    }
    ScriptApp.newTrigger('buildGlossary').timeBased().after(10 * 1000).create();
    return ContentService.createTextOutput('Glossary build trigger installed. Check execution logs for progress. Run this URL multiple times until all terms are processed.');
  }

  // Admin trigger: ?action=setupCondense to install a time trigger for condensing
  if (e && e.parameter && e.parameter.action === 'setupCondense') {
    // Delete existing condense triggers
    var triggers = ScriptApp.getProjectTriggers();
    for (var t = 0; t < triggers.length; t++) {
      if (triggers[t].getHandlerFunction() === 'condenseDontMiss') {
        ScriptApp.deleteTrigger(triggers[t]);
      }
    }
    // Create a one-time trigger that runs in 10 seconds
    ScriptApp.newTrigger('condenseDontMiss').timeBased().after(10 * 1000).create();
    return ContentService.createTextOutput('Condense trigger installed. It will run in ~10 seconds with a 6-minute limit. Check execution logs for progress.');
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('MCC Master')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Admin email for dev mode
var ADMIN_EMAIL = 'anthony.mishriki1@gmail.com';

// --- Current User ---
function getCurrentUser() {
  var email = Session.getActiveUser().getEmail() || '';
  var isGuest = !email;
  var isDev = email.toLowerCase() === ADMIN_EMAIL;
  return { email: email, name: isGuest ? '' : email.split('@')[0], isGuest: isGuest, isDev: isDev };
}

// --- Get user identifier (email or guest ID passed from client) ---
function getUserId_(guestId) {
  var email = Session.getActiveUser().getEmail() || '';
  if (email) return email.toLowerCase();
  // For anonymous users, use the guestId passed from client-side localStorage
  return guestId ? ('guest_' + guestId) : 'guest_anonymous';
}

// --- Dev Panel: get all user activity ---
function getDevStats() {
  var email = Session.getActiveUser().getEmail() || '';
  if (email.toLowerCase() !== ADMIN_EMAIL) return { error: 'Not authorized' };

  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();

  var users = {};
  var totalRows = data.length - 1;
  var activityByDay = {};

  for (var i = 1; i < data.length; i++) {
    var userId = (data[i][0] || '').toString();
    var type = data[i][1];
    var ts = data[i][3];

    if (!users[userId]) users[userId] = { quizzes: 0, pb: 0, daily: 0, cards: 0, lastActive: '', isGuest: userId.indexOf('guest_') === 0 };
    if (type === 'quiz_result') users[userId].quizzes++;
    if (type === 'pb_result') users[userId].pb++;
    if (type === 'daily_result') users[userId].daily++;
    if (type === 'card_rating') users[userId].cards++;
    if (ts) users[userId].lastActive = ts;

    // Activity by day
    var day = ts ? ts.toString().slice(0, 10) : 'unknown';
    activityByDay[day] = (activityByDay[day] || 0) + 1;
  }

  return {
    totalUsers: Object.keys(users).length,
    totalRows: totalRows,
    users: users,
    activityByDay: activityByDay
  };
}

// --- Sheet Helpers ---
function getSheetData_(sheetName) {
  // Try cache first (5-min TTL, chunked for large datasets)
  var cache = CacheService.getScriptCache();
  var metaKey = 'sheet_' + sheetName + '_meta';
  var meta = cache.get(metaKey);

  if (meta) {
    try {
      meta = JSON.parse(meta);
      var chunks = [];
      var allFound = true;
      for (var c = 0; c < meta.chunks; c++) {
        var chunk = cache.get('sheet_' + sheetName + '_' + c);
        if (!chunk) { allFound = false; break; }
        chunks.push(chunk);
      }
      if (allFound) return JSON.parse(chunks.join(''));
    } catch(e) { /* cache miss, fall through */ }
  }

  // Read from sheet
  const ss = SpreadsheetApp.openById(getConfig_().SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  var result = data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });

  // Cache the result (chunk at 90KB to stay under 100KB limit)
  try {
    var json = JSON.stringify(result);
    var CHUNK_SIZE = 90000;
    var numChunks = Math.ceil(json.length / CHUNK_SIZE);
    var cacheObj = {};
    for (var c = 0; c < numChunks; c++) {
      cacheObj['sheet_' + sheetName + '_' + c] = json.substring(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE);
    }
    cacheObj[metaKey] = JSON.stringify({ chunks: numChunks, cached: new Date().toISOString() });
    cache.putAll(cacheObj, 300); // 5-min TTL
  } catch(e) { /* caching failed, that's ok */ }

  return result;
}

function ensureUserDataSheet_() {
  const ss = SpreadsheetApp.openById(getConfig_().SHEET_ID);
  var sheet = ss.getSheetByName('UserData');
  if (!sheet) {
    sheet = ss.insertSheet('UserData');
    sheet.appendRow(['Email', 'Type', 'Data', 'Timestamp']);
  }
  return sheet;
}

function getRandomPatientName_() {
  var names = [
    // South Asian
    'Aarav','Ananya','Rohan','Meera','Vikram','Sunita','Arjun','Kavya','Nikhil','Pooja','Ravi','Lakshmi','Sanjay','Deepa','Harsh','Nisha',
    // East Asian
    'Wei','Mei Lin','Jun','Yuki','Hiro','Sakura','Min-jun','Ji-yeon','Tao','Xiao','Kenji','Aiko','Soo-jin','Bao','Linh','Thanh',
    // Middle Eastern / Persian
    'Yasmin','Farhad','Nasreen','Omid','Leila','Dariush','Shirin','Reza','Parisa','Kamran','Soraya','Bahram','Nazanin','Saeed','Maryam','Hassan',
    // Arabic
    'Omar','Fatima','Khalid','Noor','Tariq','Amira','Youssef','Hana','Ibrahim','Layla','Mustafa','Zahra','Samir','Dina','Bassam','Rania',
    // African
    'Kwame','Ama','Kofi','Adwoa','Chidi','Ngozi','Tendai','Aisha','Emeka','Folake','Jabari','Zuri','Sekou','Amara','Olu','Chiamaka',
    // Latin American
    'Santiago','Valentina','Mateo','Camila','Diego','Isabella','Alejandro','Lucia','Carlos','Gabriela','Fernando','Sofia','Ricardo','Daniela','Miguel','Elena',
    // European
    'Liam','Emma','Noah','Olivia','Ethan','Ava','Lucas','Mia','Oliver','Charlotte','James','Amelia','Benjamin','Harper','Jack','Ella',
    // Eastern European
    'Dmitri','Natasha','Andrei','Katya','Pavel','Irina','Sergei','Olga','Viktor','Tatiana','Nikolai','Anya','Bogdan','Mila','Aleksei','Daria',
    // Indigenous
    'Koda','Winona','Takoda','Aiyana','Chayton','Nizhoni','Ahanu','Aponi','Istas','Kaya','Mika','Nuna','Sequoia','Tallulah','Wren','Dakota',
    // Caribbean
    'Marlon','Keisha','Dwayne','Shanice','Leroy','Tamika','Winston','Sade','Errol','Nadine','Delroy','Patrice','Byron','Shelly','Neville','Claudette',
    // French Canadian
    'Jean-Luc','Genevieve','Mathieu','Elodie','Francois','Amelie','Sebastien','Celeste','Antoine','Juliette','Maxime','Margaux','Olivier','Colette','Tristan','Simone',
    // Turkish / Central Asian
    'Emre','Elif','Berk','Defne','Kerem','Zeynep','Cem','Ece','Murat','Aylin','Burak','Selin','Deniz','Pelin','Kaan','Naz'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function shuffleArray_(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = a[i]; a[i] = a[j]; a[j] = temp;
  }
  return a;
}

// =============================================
// DATA SERVICE
// =============================================

function getSpecialties() {
  var flashcards = getSheetData_('Flashcards');
  var notes = getSheetData_('Bullet_Notes');
  var mcq = getSheetData_('MCQ');
  var dontmiss = getSheetData_('Dont_Miss');

  function unique(arr, key) {
    var seen = {};
    return arr.reduce(function(acc, item) {
      var val = item[key];
      if (val && !seen[val]) { seen[val] = true; acc.push(val); }
      return acc;
    }, []).sort();
  }

  var fSpecs = unique(flashcards, 'Specialty');
  var nSpecs = unique(notes, 'Specialty');
  var mSpecs = unique(mcq, 'Specialty');
  var dSpecs = unique(dontmiss, 'Specialty');

  var allSet = {};
  [fSpecs, nSpecs, mSpecs, dSpecs].forEach(function(list) {
    list.forEach(function(s) { allSet[s] = true; });
  });
  var all = Object.keys(allSet).sort();

  return {
    flashcards: fSpecs,
    bullet_notes: nSpecs,
    mcq: mSpecs,
    dont_miss: dSpecs,
    all: all
  };
}

function getTopicsForSpecialty(specialty) {
  var data = getSheetData_('Flashcards');
  if (specialty && specialty !== 'All') {
    data = data.filter(function(r) { return r.Specialty === specialty; });
  }
  var topicMap = {};
  data.forEach(function(r) {
    var t = r.Topic || 'General';
    if (!topicMap[t]) topicMap[t] = 0;
    topicMap[t]++;
  });
  var topics = Object.keys(topicMap).sort().map(function(t) {
    return { topic: t, count: topicMap[t] };
  });
  return topics;
}

function getFlashcards(specialty, mode) {
  var data = getSheetData_('Flashcards');
  if (specialty && specialty !== 'All') {
    data = data.filter(function(r) { return r.Specialty === specialty; });
  }
  var cards = data.map(function(r, i) {
    return {
      id: i,
      specialty: r.Specialty || '',
      topic: r.Topic || '',
      front: r.Front || '',
      back: r.Back || '',
      hyFlag: (r.HY_Flag || '').toString().toLowerCase() === 'yes'
    };
  });

  // Seeded shuffle so card order is consistent across users/reloads
  // Seed based on specialty so each filter has its own stable order
  var seedStr = 'mcc_fc_' + (specialty || 'All');
  var seed = 0;
  for (var i = 0; i < seedStr.length; i++) seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
  seed = Math.abs(seed);

  // Fisher-Yates with seed
  function seededRand(s) { s = (s * 9301 + 49297) % 233280; return s / 233280; }
  var s = seed;
  for (var j = cards.length - 1; j > 0; j--) {
    s = (s * 9301 + 49297) % 233280;
    var k = Math.floor((s / 233280) * (j + 1));
    var tmp = cards[j]; cards[j] = cards[k]; cards[k] = tmp;
  }

  return cards;
}

function getBulletNotes(specialty) {
  var data = getSheetData_('Bullet_Notes');
  if (specialty && specialty !== 'All') {
    data = data.filter(function(r) { return r.Specialty === specialty; });
  }
  return data.map(function(r, i) {
    return {
      id: i,
      specialty: r.Specialty || '',
      topic: r.Topic || '',
      note: r.Note || ''
    };
  });
}

function getMCQQuiz(specialty, version, count) {
  var data = getSheetData_('MCQ');

  if (specialty && specialty !== 'All') {
    data = data.filter(function(r) { return r.Specialty === specialty; });
  }
  if (version && version !== 'Random') {
    data = data.filter(function(r) { return r.Version === version; });
  }

  data = shuffleArray_(data);

  if (count && count < data.length) {
    data = data.slice(0, count);
  }

  return data.map(function(r, i) {
    return {
      id: i,
      specialty: r.Specialty || '',
      version: r.Version || '',
      question: r.Question || '',
      options: {
        A: r.Option_A || '',
        B: r.Option_B || '',
        C: r.Option_C || '',
        D: r.Option_D || '',
        E: r.Option_E || ''
      },
      correct: r.Correct_Answer || '',
      rationale: r.Rationale || ''
    };
  });
}

function getGlossary() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('glossary');
  if (cached) return JSON.parse(cached);

  try {
    var data = getSheetData_('Medical_Glossary');
    if (data && data.length > 0) {
      var result = data.map(function(r) {
        return {
          term: r.Term || '',
          definition: r.Definition || '',
          fa: r.Persian || '',
          ar: r.Arabic || '',
          category: r.Category || ''
        };
      });
      // Cache for 6 hours
      try { cache.put('glossary', JSON.stringify(result), 21600); } catch(e) {}
      return result;
    }
  } catch(e) {}
  return [];
}

// Build glossary using Claude API — run from GAS editor, call multiple times if it times out
function buildGlossary() {
  var ss = SpreadsheetApp.openById(getConfig_().SHEET_ID);

  // Ensure Medical_Glossary sheet exists
  var glossSheet = ss.getSheetByName('Medical_Glossary');
  if (!glossSheet) {
    glossSheet = ss.insertSheet('Medical_Glossary');
    glossSheet.appendRow(['Term', 'Definition', 'Persian', 'Arabic', 'Category']);
  }

  // Get existing terms to skip
  var existing = {};
  var existingData = glossSheet.getDataRange().getValues();
  for (var i = 1; i < existingData.length; i++) {
    if (existingData[i][0]) existing[existingData[i][0].toString().toLowerCase()] = true;
  }
  Logger.log('Existing glossary entries: ' + (existingData.length - 1));

  // Extract medical terms from all content
  var allText = '';
  var sheets = ['Flashcards', 'Bullet_Notes', 'MCQ'];
  for (var s = 0; s < sheets.length; s++) {
    try {
      var data = getSheetData_(sheets[s]);
      for (var j = 0; j < data.length; j++) {
        var row = data[j];
        for (var key in row) { allText += ' ' + (row[key] || ''); }
      }
    } catch(e) {}
  }

  // Extract terms using patterns
  var termSet = {};
  var patterns = [
    /\b[A-Za-z]+(?:emia|itis|osis|ectomy|otomy|ostomy|scopy|plasty|pathy|oma|uria|pnea|phagia|algia|megaly|penia|plasia|paresis|plegia)\b/gi,
    /\b[A-Za-z]+(?:olol|pril|sartan|statin|prazole|mycin|cillin|floxacin|azole|profen|dipine|formin|mab|nib|zepam|barbital)\b/gi,
    /\b(?:aorta|ventricle|atrium|duodenum|jejunum|ileum|cecum|esophagus|pharynx|larynx|trachea|bronchus|pleura|pericardium|peritoneum|meninges|cerebellum|hippocampus|hypothalamus|medulla|cortex|spleen|thymus|thyroid|pancreas|diaphragm|sternum|femur|tibia|fibula|pelvis|glomerulus|nephron|ureter|urethra|prostate|epididymis|endometrium|cervix|ovary|retina|cornea|cochlea|pituitary)\b/gi,
    /\b(?:pneumonia|meningitis|hepatitis|pancreatitis|appendicitis|endocarditis|myocarditis|sepsis|anemia|leukemia|lymphoma|carcinoma|melanoma|thrombosis|embolism|aneurysm|stenosis|fibrillation|tachycardia|bradycardia|arrhythmia|hypertension|diabetes|cirrhosis|fibrosis|infarction|ischemia|hemorrhage|edema|pneumothorax|hernia|ketoacidosis|eclampsia|preeclampsia|emphysema|asthma|lupus|psoriasis|anaphylaxis|glaucoma|cataract|neuropathy|dementia|delirium|psychosis|schizophrenia|epilepsy|migraine|syncope|dysphagia|dyspnea|cyanosis|jaundice|osteoporosis|gout|scoliosis)\b/gi,
    /\b(?:intubation|tracheostomy|thoracentesis|paracentesis|lumbar puncture|biopsy|endoscopy|colonoscopy|bronchoscopy|laparoscopy|angiography|echocardiography|catheterization|angioplasty|dialysis|defibrillation|cardioversion|craniotomy|cholecystectomy|appendectomy|hysterectomy|mastectomy|cesarean|amniocentesis)\b/gi,
    /\b(?:troponin|creatinine|bilirubin|lipase|amylase|hemoglobin|hematocrit|platelet|leukocyte|erythrocyte|albumin|fibrinogen|procalcitonin|lactate|ferritin|cortisol|prolactin|insulin|glucose)\b/gi
  ];

  var commonWords = { the:1,and:1,for:1,are:1,but:1,not:1,you:1,all:1,can:1,has:1,was:1,one:1,our:1,out:1,use:1,with:1,this:1,that:1,from:1,they:1,have:1,some:1,them:1,than:1,each:1,make:1,like:1,long:1,look:1,most:1,only:1,over:1,such:1,take:1,will:1,what:1,which:1,their:1,about:1,after:1,patient:1,treatment:1,disease:1,common:1,symptoms:1,include:1,cause:1,causes:1,condition:1,often:1,risk:1,type:1,also:1,case:1,pain:1,test:1,used:1,drug:1,left:1,right:1,high:1,low:1,normal:1,level:1,blood:1,body:1,cell:1,system:1,time:1,acute:1,chronic:1,severe:1,mild:1 };

  for (var p = 0; p < patterns.length; p++) {
    var match;
    while ((match = patterns[p].exec(allText)) !== null) {
      var term = match[0].toLowerCase();
      if (term.length >= 4 && !commonWords[term] && !existing[term]) {
        termSet[term.charAt(0).toUpperCase() + term.slice(1)] = true;
      }
    }
  }

  var terms = Object.keys(termSet).sort();
  Logger.log('New terms to process: ' + terms.length);
  if (terms.length === 0) { Logger.log('All terms already in glossary!'); return; }

  // Process in batches of 50 (to stay within 6 min limit)
  var config = getConfig_();
  var BATCH = 50;
  var maxBatches = 5; // ~250 terms per run
  var processed = 0;

  for (var b = 0; b < Math.min(Math.ceil(terms.length / BATCH), maxBatches); b++) {
    var batch = terms.slice(b * BATCH, (b + 1) * BATCH);
    Logger.log('Batch ' + (b + 1) + ': processing ' + batch.length + ' terms...');

    var prompt = 'Define these medical terms. For each return a JSON object with: term, definition (1 sentence), persian (Farsi translation), arabic (Arabic translation), category (anatomy/pathology/pharmacology/procedure/diagnosis/lab/physiology).\n\nReturn ONLY a JSON array:\n\n' + batch.join('\n');

    var payload = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': config.API_KEY, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    try {
      var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
      var json = JSON.parse(response.getContentText());
      if (json.error) { Logger.log('API error: ' + json.error.message); continue; }

      var text = json.content[0].text;
      var entries;
      try { entries = JSON.parse(text); } catch(e) {
        var m = text.match(/\[[\s\S]*\]/);
        if (m) entries = JSON.parse(m[0]);
        else { Logger.log('Parse failed for batch ' + (b+1)); continue; }
      }

      var rows = [];
      for (var ei = 0; ei < entries.length; ei++) {
        var en = entries[ei];
        rows.push([en.term || '', en.definition || '', en.persian || '', en.arabic || '', en.category || '']);
      }

      if (rows.length > 0) {
        glossSheet.getRange(glossSheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
        processed += rows.length;
        Logger.log('  -> ' + rows.length + ' entries added');
      }

      Utilities.sleep(1500);
    } catch(e) {
      Logger.log('Error: ' + e.message);
    }
  }

  // Clear cache so next getGlossary() picks up new data
  CacheService.getScriptCache().remove('glossary');
  Logger.log('Done! Added ' + processed + ' entries. Run again if more terms remain.');
}

// Condense 7K Dont_Miss items into concept cards — run from GAS editor, multiple times until done
function condenseDontMiss() {
  var config = getConfig_();
  var ss = SpreadsheetApp.openById(config.SHEET_ID);
  var srcSheet = ss.getSheetByName('Dont_Miss');
  if (!srcSheet) { Logger.log('No Dont_Miss sheet!'); return; }
  var srcData = srcSheet.getDataRange().getValues();
  if (srcData.length < 2) { Logger.log('Dont_Miss is empty!'); return; }

  var headers = srcData[0];
  var specIdx = -1, itemIdx = -1;
  for (var h = 0; h < headers.length; h++) {
    var hdr = (headers[h] || '').toString().toLowerCase().trim();
    if (hdr === 'specialty' || hdr === 'speciality') specIdx = h;
    if (hdr === 'item' || hdr === 'content' || hdr === 'note') itemIdx = h;
  }
  if (specIdx === -1) { specIdx = 0; Logger.log('Using column 0 as specialty'); }
  if (itemIdx === -1) { itemIdx = 1; Logger.log('Using column 1 as item'); }

  var specGroups = {};
  for (var i = 1; i < srcData.length; i++) {
    var spec = (srcData[i][specIdx] || '').toString().trim();
    var item = (srcData[i][itemIdx] || '').toString().trim();
    if (!spec || !item) continue;
    if (!specGroups[spec]) specGroups[spec] = [];
    specGroups[spec].push(item);
  }
  var specialties = Object.keys(specGroups).sort();
  Logger.log('Total: ' + srcData.length + ' rows, ' + specialties.length + ' specialties');

  var outSheet = ss.getSheetByName('Key_Topics_Condensed');
  if (!outSheet) {
    outSheet = ss.insertSheet('Key_Topics_Condensed');
    outSheet.appendRow(['Specialty', 'Title', 'Points', 'Priority']);
  }
  var existingData = outSheet.getDataRange().getValues();
  var doneSpecs = {};
  for (var e = 1; e < existingData.length; e++) {
    doneSpecs[(existingData[e][0] || '').toString()] = true;
  }

  var remaining = specialties.filter(function(s) { return !doneSpecs[s]; });
  Logger.log('Already done: ' + Object.keys(doneSpecs).length + ', remaining: ' + remaining.length);
  if (remaining.length === 0) { Logger.log('All specialties condensed!'); return; }

  var processed = 0;
  for (var si = 0; si < remaining.length && processed < 3; si++) {
    var spec = remaining[si];
    var items = specGroups[spec];
    Logger.log('[' + (si+1) + '] ' + spec + ': ' + items.length + ' items');

    var allCards = [];
    for (var bi = 0; bi < items.length; bi += 200) {
      var batch = items.slice(bi, bi + 200);
      var prompt = 'Specialty: ' + spec + '\nCondense these ' + batch.length + ' items into concept cards.\n' +
        'Rules: Group related items. Each card: title, points (use | separators), priority (Must Know/Should Know/Good to Know). Keep ALL facts.\n' +
        'Return ONLY JSON array: [{"title":"...","points":"...","priority":"Must Know"}]\n\n' +
        batch.map(function(item, idx) { return (idx+1) + '. ' + item; }).join('\n');

      try {
        var resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
          method: 'post', contentType: 'application/json',
          headers: { 'x-api-key': config.API_KEY, 'anthropic-version': '2023-06-01' },
          payload: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, messages: [{ role: 'user', content: prompt }] }),
          muteHttpExceptions: true
        });
        var json = JSON.parse(resp.getContentText());
        if (json.error) { Logger.log('  API error: ' + json.error.message); continue; }
        var text = json.content[0].text;
        var cards;
        try { cards = JSON.parse(text); } catch(e) {
          var m = text.match(/\[[\s\S]*\]/);
          if (m) cards = JSON.parse(m[0]); else { Logger.log('  Parse fail'); continue; }
        }
        allCards = allCards.concat(cards);
        Logger.log('  -> ' + cards.length + ' cards');
        if (bi + 200 < items.length) Utilities.sleep(1500);
      } catch(e) { Logger.log('  Error: ' + e.message); }
    }

    if (allCards.length > 0) {
      var rows = allCards.map(function(c) { return [spec, c.title || '', c.points || '', c.priority || 'Should Know']; });
      outSheet.getRange(outSheet.getLastRow() + 1, 1, rows.length, 4).setValues(rows);
      Logger.log('  Wrote ' + rows.length + ' cards');
    }
    processed++;
  }
  Logger.log('Done this run. ' + (remaining.length - processed) + ' specialties left. Run again!');
}

function getDontMiss(specialty) {
  // Try condensed version first
  var condensed = getSheetData_('Key_Topics_Condensed');
  if (condensed && condensed.length > 0) {
    if (specialty && specialty !== 'All') {
      condensed = condensed.filter(function(r) { return r.Specialty === specialty; });
    }
    return condensed.map(function(r, i) {
      return {
        id: i,
        specialty: r.Specialty || '',
        title: r.Title || '',
        points: r.Points || '',
        priority: r.Priority || 'Should Know',
        item: r.Title + ': ' + r.Points, // backward compat for quiz mode
        condensed: true
      };
    });
  }

  // Fallback to raw Dont_Miss
  var data = getSheetData_('Dont_Miss');
  if (specialty && specialty !== 'All') {
    data = data.filter(function(r) { return r.Specialty === specialty; });
  }
  return data.map(function(r, i) {
    return {
      id: i,
      specialty: r.Specialty || '',
      item: r.Item || '',
      condensed: false
    };
  });
}

function searchAll(query) {
  if (!query || query.length < 2) {
    return { flashcards: [], notes: [], mcq: [], dontmiss: [] };
  }

  var q = query.toLowerCase();
  var limit = 20;

  var flashcards = getSheetData_('Flashcards')
    .filter(function(r) {
      return ((r.Front || '') + ' ' + (r.Back || '')).toLowerCase().indexOf(q) !== -1;
    })
    .slice(0, limit)
    .map(function(r) {
      return { specialty: r.Specialty, topic: r.Topic, front: r.Front, back: r.Back };
    });

  var notes = getSheetData_('Bullet_Notes')
    .filter(function(r) {
      return (r.Note || '').toLowerCase().indexOf(q) !== -1;
    })
    .slice(0, limit)
    .map(function(r) {
      return { specialty: r.Specialty, topic: r.Topic, note: r.Note };
    });

  var mcq = getSheetData_('MCQ')
    .filter(function(r) {
      return (r.Question || '').toLowerCase().indexOf(q) !== -1;
    })
    .slice(0, limit)
    .map(function(r) {
      return { specialty: r.Specialty, question: r.Question };
    });

  var dontmiss = getSheetData_('Dont_Miss')
    .filter(function(r) {
      return (r.Item || '').toLowerCase().indexOf(q) !== -1;
    })
    .slice(0, limit)
    .map(function(r) {
      return { specialty: r.Specialty, item: r.Item };
    });

  return { flashcards: flashcards, notes: notes, mcq: mcq, dontmiss: dontmiss };
}

// =============================================
// USER SERVICE - Progress, Points, Achievements
// =============================================

function saveQuizResult(result, guestId) {
  var sheet = ensureUserDataSheet_();
  var userId = getUserId_(guestId);
  sheet.appendRow([userId, 'quiz_result', JSON.stringify(result), new Date().toISOString()]);
  return { success: true };
}

function saveProgress(type, data, guestId) {
  var sheet = ensureUserDataSheet_();
  var userId = getUserId_(guestId);
  sheet.appendRow([userId, type, JSON.stringify(data), new Date().toISOString()]);
  return { success: true };
}

/**
 * Analyze quiz results and return AI-powered study recommendations.
 * Also saves weak specialty data for adaptive daily challenges.
 */
function analyzeQuizResults(quizDetails, guestId) {
  var config = getConfig_();
  var email = getUserId_(guestId);

  // Build specialty breakdown
  var specScores = {};
  var wrongTopics = [];
  for (var i = 0; i < quizDetails.length; i++) {
    var d = quizDetails[i];
    var spec = d.specialty || 'General';
    if (!specScores[spec]) specScores[spec] = { correct: 0, total: 0 };
    specScores[spec].total++;
    if (d.isCorrect) {
      specScores[spec].correct++;
    } else {
      wrongTopics.push(spec + ': ' + (d.question || '').substring(0, 100));
    }
  }

  // Save weak specialties for adaptive daily
  var weakSpecs = [];
  for (var spec in specScores) {
    var s = specScores[spec];
    var pct = Math.round((s.correct / s.total) * 100);
    if (pct < 70) weakSpecs.push({ specialty: spec, percentage: pct, correct: s.correct, total: s.total });
  }
  if (weakSpecs.length > 0) {
    var sheet = ensureUserDataSheet_();
    sheet.appendRow([email, 'weak_areas', JSON.stringify({ specialties: weakSpecs, date: new Date().toISOString() }), new Date().toISOString()]);
  }

  // Build prompt for Claude
  var totalCorrect = quizDetails.filter(function(d) { return d.isCorrect; }).length;
  var totalQ = quizDetails.length;
  var pct = Math.round((totalCorrect / totalQ) * 100);

  var prompt = 'A medical student just completed a practice quiz for MCCQE Part I.\n\n' +
    'Score: ' + totalCorrect + '/' + totalQ + ' (' + pct + '%)\n\n' +
    'Specialty breakdown:\n';
  for (var spec in specScores) {
    var s = specScores[spec];
    prompt += '- ' + spec + ': ' + s.correct + '/' + s.total + ' (' + Math.round((s.correct / s.total) * 100) + '%)\n';
  }

  if (wrongTopics.length > 0) {
    prompt += '\nQuestions they got wrong:\n';
    for (var i = 0; i < Math.min(wrongTopics.length, 10); i++) {
      prompt += '- ' + wrongTopics[i] + '\n';
    }
  }

  prompt += '\nGive a brief, encouraging 3-4 sentence study recommendation. Be specific about which topics to review. ' +
    'Do NOT use bullet points. Do NOT list every specialty. Focus on the 1-2 weakest areas and give a concrete study tip. ' +
    'Keep it under 80 words. Be direct and supportive, like a helpful upperclassman.';

  try {
    var payload = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': config.API_KEY,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
    var json = JSON.parse(response.getContentText());

    if (json.error) return { recommendation: null };

    return { recommendation: json.content[0].text, weakAreas: weakSpecs };
  } catch (e) {
    return { recommendation: null };
  }
}

function saveCardRating(cardFront, rating, source, guestId) {
  var sheet = ensureUserDataSheet_();
  var userId = getUserId_(guestId);
  sheet.appendRow([userId, 'card_rating', JSON.stringify({ front: cardFront, rating: rating, source: source || 'daily' }), new Date().toISOString()]);
  return { success: true };
}

function getWeakCards_(guestId) {
  var email = getUserId_(guestId);
  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();
  var ratings = {}; // front -> { missed: N, shaky: N, knew: N, last: timestamp }

  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() !== email) continue;
    if (data[i][1] !== 'card_rating') continue;
    try {
      var d = JSON.parse(data[i][2]);
      if (!d.front) continue;
      if (!ratings[d.front]) ratings[d.front] = { missed: 0, shaky: 0, knew: 0, last: '' };
      ratings[d.front][d.rating] = (ratings[d.front][d.rating] || 0) + 1;
      ratings[d.front].last = data[i][3];
    } catch(e) {}
  }

  // Score: higher = weaker. missed=3pts, shaky=1pt, knew=-2pts
  var scored = [];
  for (var front in ratings) {
    var r = ratings[front];
    var score = r.missed * 3 + r.shaky * 1 - r.knew * 2;
    if (score > 0) scored.push({ front: front, score: score });
  }
  scored.sort(function(a, b) { return b.score - a.score; });
  return scored; // returns array of { front, score }
}

function getUserStats(guestId) {
  var email = getUserId_(guestId);
  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();

  var quizResults = [];
  var pbResults = [];
  var focusResults = [];
  var dailyResults = [];
  var totalPoints = 0;
  var lastActive = null;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() !== email) continue;
    var type = data[i][1];
    var ts = data[i][3];
    try {
      var parsed = JSON.parse(data[i][2]);
      if (type === 'quiz_result') {
        quizResults.push(parsed);
        totalPoints += (parsed.points || 0);
      } else if (type === 'pb_result') {
        pbResults.push(parsed);
        totalPoints += (parsed.points || 0);
      } else if (type === 'focus_result') {
        focusResults.push(parsed);
        totalPoints += (parsed.points || 0);
      } else if (type === 'daily_result') {
        dailyResults.push(parsed);
        totalPoints += (parsed.points || 0);
      } else if (type === 'flashcard_result') {
        totalPoints += (parsed.points || 0);
      }
      if (!lastActive || ts > lastActive) lastActive = ts;
    } catch(e) {}
  }

  // Quiz stats
  var totalQuizzes = quizResults.length;
  var avgScore = 0;
  if (totalQuizzes > 0) {
    var sum = 0;
    quizResults.forEach(function(r) { sum += (r.score / r.total) * 100; });
    avgScore = Math.round(sum / totalQuizzes);
  }

  var specScores = {};
  quizResults.forEach(function(r) {
    if (!specScores[r.specialty]) specScores[r.specialty] = [];
    specScores[r.specialty].push((r.score / r.total) * 100);
  });

  var weakAreas = Object.keys(specScores).map(function(spec) {
    var scores = specScores[spec];
    var avg = Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length);
    return { specialty: spec, avgScore: avg, attempts: scores.length };
  }).sort(function(a, b) { return a.avgScore - b.avgScore; }).slice(0, 5);

  var recentQuizzes = quizResults.slice(-5).reverse().map(function(r) {
    return {
      specialty: r.specialty,
      version: r.version,
      score: r.score,
      total: r.total,
      percentage: Math.round((r.score / r.total) * 100)
    };
  });

  // Streak calc
  var activeDates = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === email) {
      var d = new Date(data[i][3]);
      if (!isNaN(d)) activeDates[d.toISOString().slice(0, 10)] = true;
    }
  }
  var streak = 0;
  var today = new Date();
  var checkDate = new Date(today);
  while (true) {
    var key = checkDate.toISOString().slice(0, 10);
    if (activeDates[key]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else break;
  }

  // XP Level
  var level = getLevel_(totalPoints);

  // Achievements
  var achievements = computeAchievements_(quizResults, pbResults, focusResults, dailyResults, streak);

  // PatientBot stats
  var pbCorrect = pbResults.filter(function(r) { return r.correct; }).length;
  var pbTotal = pbResults.length;

  // Focus stats
  var totalCardsReviewed = 0;
  focusResults.forEach(function(r) { totalCardsReviewed += (r.total || 0); });

  return {
    totalQuizzes: totalQuizzes,
    avgScore: avgScore,
    weakAreas: weakAreas,
    recentQuizzes: recentQuizzes,
    totalPoints: totalPoints,
    level: level,
    streak: streak,
    achievements: achievements,
    pbCorrect: pbCorrect,
    pbTotal: pbTotal,
    totalCardsReviewed: totalCardsReviewed,
    dailyChallengesCompleted: dailyResults.length
  };
}

function getLevel_(points) {
  var levels = [
    { name: 'Medical Student', min: 0, icon: '🎓' },
    { name: 'Intern', min: 500, icon: '🩺' },
    { name: 'Resident', min: 2000, icon: '💉' },
    { name: 'Fellow', min: 5000, icon: '🔬' },
    { name: 'Attending', min: 10000, icon: '⭐' },
    { name: 'Chief', min: 25000, icon: '👑' }
  ];
  var current = levels[0];
  var next = levels[1];
  var currentIndex = 0;
  for (var i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      current = levels[i];
      currentIndex = i;
      next = levels[i + 1] || null;
      break;
    }
  }
  return {
    name: current.name,
    icon: current.icon,
    number: currentIndex + 1,
    maxLevel: levels.length,
    points: points,
    nextLevel: next ? next.name : null,
    nextMin: next ? next.min : null,
    progress: next ? Math.round(((points - current.min) / (next.min - current.min)) * 100) : 100
  };
}

function computeAchievements_(quizResults, pbResults, focusResults, dailyResults, streak) {
  var achieved = [];

  // Flashcard milestones
  var totalCards = 0;
  var maxSession = 0;
  var hadPerfectSession = false;
  focusResults.forEach(function(r) {
    totalCards += (r.total || 0);
    if ((r.total || 0) > maxSession) maxSession = r.total;
    if (r.got === r.total && (r.total || 0) >= 20) hadPerfectSession = true;
  });
  if (totalCards >= 100) achieved.push({ id: 'cards_100', name: 'Card Shark', desc: 'Review 100 flashcards', icon: '🃏' });
  if (totalCards >= 500) achieved.push({ id: 'cards_500', name: 'Card Master', desc: 'Review 500 flashcards', icon: '🎴' });
  if (totalCards >= 1000) achieved.push({ id: 'cards_1k', name: 'Flash Legend', desc: 'Review 1,000 flashcards', icon: '⚡' });
  if (totalCards >= 5000) achieved.push({ id: 'cards_5k', name: 'Card God', desc: 'Review 5,000 flashcards', icon: '👑' });
  if (maxSession >= 100) achieved.push({ id: 'fc_session_100', name: 'Centurion', desc: 'Finish a 100+ card session', icon: '🛡' });
  if (hadPerfectSession) achieved.push({ id: 'fc_perfect', name: 'Flawless', desc: 'Got It on every card in a session (20+)', icon: '✨' });

  // Quiz milestones
  if (quizResults.length >= 5) achieved.push({ id: 'quiz_5', name: 'Quiz Rookie', desc: 'Complete 5 quizzes', icon: '📝' });
  if (quizResults.length >= 25) achieved.push({ id: 'quiz_25', name: 'Quiz Pro', desc: 'Complete 25 quizzes', icon: '🏆' });
  var perfect = quizResults.filter(function(r) { return r.score === r.total; });
  if (perfect.length > 0) achieved.push({ id: 'perfect', name: 'Perfect Score', desc: 'Score 100% on a quiz', icon: '💯' });

  // PatientBot milestones
  var pbCorrect = pbResults.filter(function(r) { return r.correct; }).length;
  if (pbCorrect >= 5) achieved.push({ id: 'pb_5', name: 'Junior Doc', desc: 'Correctly diagnose 5 cases', icon: '🩻' });
  if (pbCorrect >= 25) achieved.push({ id: 'pb_25', name: 'Diagnostician', desc: 'Correctly diagnose 25 cases', icon: '🔍' });
  if (pbCorrect >= 50) achieved.push({ id: 'pb_50', name: 'House MD', desc: 'Correctly diagnose 50 cases', icon: '🏥' });

  // First try diagnoses
  var firstTry = pbResults.filter(function(r) { return r.correct && r.attempts === 1; }).length;
  if (firstTry >= 10) achieved.push({ id: 'first_try_10', name: 'Sharp Eye', desc: '10 first-try diagnoses', icon: '🎯' });

  // Streak milestones
  if (streak >= 3) achieved.push({ id: 'streak_3', name: 'On a Roll', desc: '3-day study streak', icon: '🔥' });
  if (streak >= 7) achieved.push({ id: 'streak_7', name: 'Week Warrior', desc: '7-day study streak', icon: '💪' });
  if (streak >= 30) achieved.push({ id: 'streak_30', name: 'Iron Will', desc: '30-day study streak', icon: '🏅' });

  // Daily challenge milestones
  if (dailyResults.length >= 1) achieved.push({ id: 'daily_1', name: 'Daily Grinder', desc: 'Complete 1 daily challenge', icon: '📅' });
  if (dailyResults.length >= 7) achieved.push({ id: 'daily_7', name: 'Consistent', desc: 'Complete 7 daily challenges', icon: '📆' });
  if (dailyResults.length >= 30) achieved.push({ id: 'daily_30', name: 'Unstoppable', desc: 'Complete 30 daily challenges', icon: '🗓' });

  return achieved;
}

function getUserQuizHistory(guestId) {
  var email = getUserId_(guestId);
  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();
  var results = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === email && data[i][1] === 'quiz_result') {
      try {
        var r = JSON.parse(data[i][2]);
        results.push({
          date: data[i][3],
          specialty: r.specialty,
          version: r.version,
          score: r.score,
          total: r.total,
          percentage: Math.round((r.score / r.total) * 100)
        });
      } catch(e) {}
    }
  }

  return results.reverse();
}

function getPBCaseLibrary(guestId) {
  var email = getUserId_(guestId);
  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();
  var cases = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === email && data[i][1] === 'pb_result') {
      try {
        var r = JSON.parse(data[i][2]);
        if (r.transcript && r.transcript.length > 0) {
          cases.push({
            date: data[i][3],
            specialty: r.specialty || 'Unknown',
            diagnosis: r.diagnosis || '',
            correct: !!r.correct,
            attempts: r.attempts || 0,
            feedback: r.feedback || '',
            transcript: r.transcript
          });
        }
      } catch(e) {}
    }
  }

  return cases.reverse().slice(0, 50); // most recent 50
}

// =============================================
// LEADERBOARD
// =============================================

function getLeaderboard() {
  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();
  var users = {};

  for (var i = 1; i < data.length; i++) {
    var email = data[i][0].toString().toLowerCase();
    if (!users[email]) users[email] = { email: email, name: email.split('@')[0], points: 0, quizzes: 0, pbCorrect: 0, cards: 0 };
    try {
      var parsed = JSON.parse(data[i][2]);
      var pts = parsed.points || 0;
      users[email].points += pts;
      if (data[i][1] === 'quiz_result') users[email].quizzes++;
      if (data[i][1] === 'pb_result' && parsed.correct) users[email].pbCorrect++;
      if (data[i][1] === 'focus_result') users[email].cards += (parsed.total || 0);
    } catch(e) {}
  }

  var leaderboard = Object.keys(users).map(function(e) { return users[e]; });
  leaderboard.sort(function(a, b) { return b.points - a.points; });
  return leaderboard;
}

// =============================================
// DAILY CHALLENGE
// =============================================

function getDailyChallenge() {
  // Deterministic seed from today's date
  var today = new Date();
  var dateStr = today.toISOString().slice(0, 10);
  var seed = 0;
  for (var i = 0; i < dateStr.length; i++) seed = ((seed << 5) - seed + dateStr.charCodeAt(i)) | 0;
  seed = Math.abs(seed);

  // Get data
  var flashcards = getSheetData_('Flashcards');
  var mcq = getSheetData_('MCQ');
  var allSpecs = {};
  flashcards.forEach(function(r) { if (r.Specialty) allSpecs[r.Specialty] = true; });
  var specList = Object.keys(allSpecs);

  // Seeded shuffle
  function seededShuffle(arr, s) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 16807 + 0) % 2147483647;
      var j = s % (i + 1);
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // Get weak cards for spaced repetition (up to 5 weak cards replace random ones)
  var weakCardFronts = {};
  try {
    var weakList = getWeakCards_();
    for (var w = 0; w < Math.min(weakList.length, 5); w++) weakCardFronts[weakList[w].front] = true;
  } catch(e) {}

  var weakFlashcards = flashcards.filter(function(r) { return weakCardFronts[r.Front || '']; });
  var otherFlashcards = flashcards.filter(function(r) { return !weakCardFronts[r.Front || '']; });
  var randomCards = seededShuffle(otherFlashcards, seed).slice(0, 20 - weakFlashcards.length);
  var combinedCards = weakFlashcards.concat(randomCards);
  combinedCards = seededShuffle(combinedCards, seed + 99); // shuffle the mix

  var dailyCards = combinedCards.map(function(r, i) {
    return { id: i, specialty: r.Specialty || '', topic: r.Topic || '', front: r.Front || '', back: r.Back || '', hyFlag: (r.HY_Flag || '').toString().toLowerCase() === 'yes', isWeak: !!weakCardFronts[r.Front || ''] };
  });

  // Get weak specialties from quiz history for adaptive weighting
  var weakSpecList = [];
  try {
    var email2 = getUserId_(null);
    var udSheet = ensureUserDataSheet_();
    var udData = udSheet.getDataRange().getValues();
    for (var i = udData.length - 1; i >= 1; i--) {
      if (udData[i][0].toString().toLowerCase() === email2 && udData[i][1] === 'weak_areas') {
        try { weakSpecList = JSON.parse(udData[i][2]).specialties || []; } catch(e) {}
        break; // use most recent weak_areas entry
      }
    }
  } catch(e) {}

  // Build MCQ pool: 4 from weak specialties + 6 random (if weak data exists), else 10 random
  var weakSpecNames = weakSpecList.map(function(w) { return w.specialty; });
  var weakMCQ = [], otherMCQ = [];
  if (weakSpecNames.length > 0) {
    mcq.forEach(function(r) {
      if (weakSpecNames.indexOf(r.Specialty || '') !== -1) weakMCQ.push(r);
      else otherMCQ.push(r);
    });
    var weakPick = seededShuffle(weakMCQ, seed + 10).slice(0, 4);
    var otherPick = seededShuffle(otherMCQ, seed + 1).slice(0, 10 - weakPick.length);
    var mcqPool = seededShuffle(weakPick.concat(otherPick), seed + 11);
  } else {
    var mcqPool = seededShuffle(mcq, seed + 1).slice(0, 10);
  }

  var dailyMCQ = mcqPool.map(function(r, i) {
    return { id: i, specialty: r.Specialty || '', question: r.Question || '', options: { A: r.Option_A || '', B: r.Option_B || '', C: r.Option_C || '', D: r.Option_D || '', E: r.Option_E || '' }, correct: r.Correct_Answer || '', rationale: r.Rationale || '' };
  });

  // 2 PatientBot specialties (bias 1 toward weak area if exists)
  var dailyPBSpecs;
  if (weakSpecNames.length > 0) {
    var weakPBSpec = weakSpecNames[seed % weakSpecNames.length];
    var otherPBSpecs = specList.filter(function(s) { return s !== weakPBSpec; });
    var randomPBSpec = seededShuffle(otherPBSpecs, seed + 2)[0];
    dailyPBSpecs = [weakPBSpec, randomPBSpec];
  } else {
    dailyPBSpecs = seededShuffle(specList, seed + 2).slice(0, 2);
  }

  // Check if already completed today
  var email = getUserId_(null);
  var sheet = ensureUserDataSheet_();
  var rows = sheet.getDataRange().getValues();
  var completed = false;
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString().toLowerCase() === email && rows[i][1] === 'daily_result') {
      try {
        var d = JSON.parse(rows[i][2]);
        if (d.date === dateStr) { completed = true; break; }
      } catch(e) {}
    }
  }

  return {
    date: dateStr,
    flashcards: dailyCards,
    mcq: dailyMCQ,
    pbSpecialties: dailyPBSpecs,
    completed: completed
  };
}

// =============================================
// AI SERVICE - Dr. Data
// =============================================

function askDrData(message, history) {
  var email = Session.getActiveUser().getEmail() || 'guest';
  var stats = getUserStats();
  var searchResults = searchAll(message);

  var contextNotes = searchResults.flashcards.slice(0, 5).map(function(f) {
    return '- ' + f.front + ': ' + f.back;
  }).join('\n');

  var contextBullets = searchResults.notes.slice(0, 5).map(function(n) {
    return '- ' + n.note;
  }).join('\n');

  var contextDontMiss = searchResults.dontmiss.slice(0, 3).map(function(d) {
    return '- DONT MISS: ' + d.item;
  }).join('\n');

  var weakAreasText = stats.weakAreas.map(function(w) {
    return w.specialty + ' (' + w.avgScore + '%)';
  }).join(', ') || 'No data yet';

  var systemPrompt = 'You are Dr. Data, an AI medical tutor specialized in MCCQE Part I preparation.\n\n' +
    'EXAM KNOWLEDGE:\n' +
    '- MCCQE Part I: 230 MCQs in two sections of 115 items, up to 2h40m per section\n' +
    '- Scoring: 300-600 scale, pass score 439\n' +
    '- Based on MCC Objectives: Dimensions of Care + Physician Activities\n' +
    '- CDM component was REMOVED as of April 2025\n' +
    '- Key specialties by weight: Internal Medicine, Surgery, Pediatrics, Ob/Gyn, Psychiatry, Family Medicine\n\n' +
    'USER CONTEXT:\n' +
    '- Email: ' + email + '\n' +
    '- Quiz stats: ' + stats.totalQuizzes + ' quizzes completed, average ' + stats.avgScore + '%\n' +
    '- Weak areas: ' + weakAreasText + '\n\n' +
    'RELEVANT STUDY CONTENT:\n' +
    contextNotes + '\n' + contextBullets + '\n' + contextDontMiss + '\n\n' +
    'RULES:\n' +
    '1. Always tie answers back to how they would appear on the MCCQE exam\n' +
    '2. Be concise but thorough - use bullet points and headers\n' +
    '3. Use clinical reasoning frameworks\n' +
    '4. Keep responses focused and practical';

  var messages = [];
  if (history && history.length > 0) {
    history.forEach(function(h) {
      messages.push({ role: h.role, content: h.content });
    });
  }
  messages.push({ role: 'user', content: message });

  var response = callAnthropic_(systemPrompt, messages);
  return { response: response };
}

// =============================================
// AI SERVICE - PatientBot
// =============================================

function startPatientBotCase(specialty, cheatMode, difficulty, customOpts) {
  customOpts = customOpts || {};

  // MCC Clinical Presentations — the 80 most tested on MCCQE Part I
  var mccPresentations = [
    // General
    'Fever', 'Fatigue', 'Weight Loss', 'Weight Gain', 'Failure to Thrive', 'Dizziness/Vertigo', 'Syncope', 'Generalized Weakness',
    // Cardio
    'Chest Pain', 'Palpitations', 'Dyspnea', 'Peripheral Edema', 'Hypertension', 'Heart Murmur',
    // Resp
    'Cough', 'Hemoptysis', 'Wheezing', 'Pleural Effusion',
    // GI
    'Abdominal Pain', 'Nausea and Vomiting', 'Diarrhea', 'Constipation', 'GI Bleeding', 'Dysphagia', 'Jaundice', 'Abdominal Distension',
    // Neuro
    'Headache', 'Seizures', 'Altered Mental Status', 'Focal Neurological Deficit', 'Tremor', 'Memory Loss', 'Numbness/Tingling',
    // Psych
    'Depressed Mood', 'Anxiety', 'Psychosis', 'Suicidal Ideation', 'Substance Abuse', 'Insomnia',
    // MSK
    'Joint Pain', 'Back Pain', 'Neck Pain', 'Fracture/Trauma', 'Muscle Weakness', 'Swollen Joint',
    // Renal/Uro
    'Hematuria', 'Dysuria', 'Urinary Incontinence', 'Flank Pain', 'Oliguria/Anuria', 'Scrotal Pain',
    // Endo
    'Polyuria/Polydipsia', 'Thyroid Enlargement', 'Heat/Cold Intolerance', 'Hyperglycemia',
    // Heme/Onc
    'Lymphadenopathy', 'Bruising/Bleeding', 'Anemia', 'Palpable Mass',
    // Derm
    'Skin Rash', 'Skin Lesion', 'Pruritus', 'Wound/Ulcer',
    // OB/GYN
    'Vaginal Bleeding', 'Pelvic Pain', 'Amenorrhea', 'Pregnancy Concern', 'Breast Lump',
    // Peds
    'Crying/Irritable Child', 'Pediatric Fever', 'Developmental Delay', 'Rash in a Child',
    // ENT/Ophtho
    'Sore Throat', 'Ear Pain', 'Hearing Loss', 'Visual Disturbance', 'Red Eye',
    // Emerg
    'Trauma/Injury', 'Poisoning/Overdose', 'Burns', 'Allergic Reaction', 'Cardiac Arrest'
  ];

  // Grouped specialties for expanded mode
  var groupedSpecs = {
    'Cardiology': ['Chest Pain', 'Palpitations', 'Dyspnea', 'Peripheral Edema', 'Hypertension', 'Heart Murmur', 'Syncope'],
    'Respirology': ['Cough', 'Hemoptysis', 'Wheezing', 'Dyspnea', 'Pleural Effusion'],
    'GI / Hepatology': ['Abdominal Pain', 'Nausea and Vomiting', 'Diarrhea', 'Constipation', 'GI Bleeding', 'Dysphagia', 'Jaundice'],
    'Neurology': ['Headache', 'Seizures', 'Altered Mental Status', 'Focal Neurological Deficit', 'Tremor', 'Memory Loss', 'Dizziness/Vertigo'],
    'Psychiatry': ['Depressed Mood', 'Anxiety', 'Psychosis', 'Suicidal Ideation', 'Substance Abuse', 'Insomnia'],
    'MSK / Rheumatology': ['Joint Pain', 'Back Pain', 'Muscle Weakness', 'Swollen Joint', 'Fracture/Trauma'],
    'Nephrology / Urology': ['Hematuria', 'Dysuria', 'Flank Pain', 'Oliguria/Anuria', 'Scrotal Pain', 'Urinary Incontinence'],
    'Endocrinology': ['Polyuria/Polydipsia', 'Thyroid Enlargement', 'Heat/Cold Intolerance', 'Hyperglycemia', 'Weight Gain', 'Weight Loss'],
    'Hematology / Oncology': ['Lymphadenopathy', 'Bruising/Bleeding', 'Anemia', 'Palpable Mass', 'Fatigue'],
    'Dermatology': ['Skin Rash', 'Skin Lesion', 'Pruritus', 'Wound/Ulcer'],
    'OB/GYN': ['Vaginal Bleeding', 'Pelvic Pain', 'Amenorrhea', 'Pregnancy Concern', 'Breast Lump'],
    'Pediatrics': ['Crying/Irritable Child', 'Pediatric Fever', 'Developmental Delay', 'Rash in a Child', 'Failure to Thrive'],
    'Emergency Medicine': ['Trauma/Injury', 'Poisoning/Overdose', 'Burns', 'Allergic Reaction', 'Cardiac Arrest'],
    'Infectious Disease': ['Fever', 'Skin Rash', 'Cough', 'Diarrhea', 'Sore Throat'],
    'Surgery': ['Abdominal Pain', 'Palpable Mass', 'GI Bleeding', 'Fracture/Trauma', 'Wound/Ulcer'],
    'Ophthalmology / ENT': ['Sore Throat', 'Ear Pain', 'Hearing Loss', 'Visual Disturbance', 'Red Eye'],
    'Family Medicine': ['Fatigue', 'Weight Loss', 'Insomnia', 'Back Pain', 'Skin Rash', 'Hypertension', 'Anxiety']
  };

  // Determine the clinical presentation
  var presentation = '';
  var specLabel = specialty || 'Random';

  if (!specialty || specialty === 'Random') {
    // Default MCCQE mode: pick a random clinical presentation
    presentation = mccPresentations[Math.floor(Math.random() * mccPresentations.length)];
    specLabel = presentation;
  } else if (groupedSpecs[specialty]) {
    // Grouped specialty mode: pick a presentation from that group
    var groupPres = groupedSpecs[specialty];
    presentation = groupPres[Math.floor(Math.random() * groupPres.length)];
    specLabel = specialty;
  } else {
    // Legacy expanded mode: use raw specialty from flashcard data
    presentation = '';
    specLabel = specialty;
  }

  // Pull study material (use grouped specialty or raw)
  var flashcards = getSheetData_('Flashcards');
  var notes = getSheetData_('Bullet_Notes');
  var dontmiss = getSheetData_('Dont_Miss');

  if (groupedSpecs[specialty]) {
    // Filter by any sub-specialty that contains our grouped name
    var groupKey = specialty.split(' / ')[0].split('/')[0].trim().toLowerCase();
    flashcards = flashcards.filter(function(r) { return (r.Specialty || '').toLowerCase().indexOf(groupKey) !== -1; });
    notes = notes.filter(function(r) { return (r.Specialty || '').toLowerCase().indexOf(groupKey) !== -1; });
    dontmiss = dontmiss.filter(function(r) { return (r.Specialty || '').toLowerCase().indexOf(groupKey) !== -1; });
  } else if (specialty && specialty !== 'Random') {
    flashcards = flashcards.filter(function(r) { return r.Specialty === specialty; });
    notes = notes.filter(function(r) { return r.Specialty === specialty; });
    dontmiss = dontmiss.filter(function(r) { return r.Specialty === specialty; });
  } else {
    // Random mode — shuffle all
    flashcards = shuffleArray_(flashcards).slice(0, 30);
    notes = shuffleArray_(notes).slice(0, 20);
    dontmiss = shuffleArray_(dontmiss).slice(0, 10);
  }

  var sampleNotes = shuffleArray_(notes).slice(0, 20).map(function(n) { return n.Note; }).join('\n');
  var sampleDontMiss = shuffleArray_(dontmiss).slice(0, 10).map(function(d) { return d.Item; }).join('\n');

  // Random speech style
  var speechStyles = [
    'SPEECH STYLE: This patient is chill and easygoing. They describe things casually. "Yeah it\'s been bugging me for a bit, not gonna lie."',
    'SPEECH STYLE: This patient is anxious and rambling. They jump between topics, add irrelevant details. "Oh and also my cat has been sick too, I dunno if that matters..."',
    'SPEECH STYLE: This patient is stoic and gives minimal answers. Getting details is like pulling teeth. "Yep." "Nah." "Hurts." "Dunno."',
    'SPEECH STYLE: This patient is elderly and somewhat confused. They mix up timelines, forget medication names ("the little white pill"), and sometimes answer a different question than what was asked.',
    'SPEECH STYLE: This patient is a worried parent bringing their child. They are emotional, interrupt, and sometimes exaggerate symptoms out of fear.',
    'SPEECH STYLE: This patient minimizes everything. "It\'s probably nothing." They downplay symptoms and resist the idea that anything could be serious.',
    'SPEECH STYLE: This patient is a healthcare worker who uses some medical terminology but sometimes gets it wrong or self-diagnoses incorrectly.',
    'SPEECH STYLE: This patient speaks English as a second language. They sometimes use wrong words, describe symptoms differently than expected, and may say "how you say..." occasionally.',
    'SPEECH STYLE: This patient is intoxicated (alcohol). Slurred descriptions, vague timelines, may be uncooperative, repeats themselves. "I already told ya doc..."'
  ];

  // Random aggression/demeanor modifier (30% chance of hostile patient)
  var demeanors = [
    '', // normal — no modifier
    '', // normal
    '', // normal
    '', // normal
    '', // normal
    '', // normal
    '', // normal
    'DEMEANOR: This patient is HOSTILE and RUDE. They swear casually ("this f***ing pain won\'t stop"), snap at the doctor ("are you even listening?"), question their competence ("you look like you just graduated"), and are generally unpleasant. They still answer medical questions but with attitude. Use mild profanity naturally.',
    'DEMEANOR: This patient is AGGRESSIVE and CONFRONTATIONAL. They are loud, demanding, and use profanity freely. "I\'ve been waiting for THREE HOURS, what the hell is wrong with this place?" They challenge everything, threaten to leave, and may refuse certain exams. The student must de-escalate while still getting a history.',
    'DEMEANOR: This patient is COMBATIVE and VERBALLY ABUSIVE. They insult the doctor, refuse to cooperate initially, use strong language, and are suspicious of everything. "Don\'t touch me! Who the hell are you? Get me a REAL doctor." They may have a reason (pain, fear, past trauma) but the student must earn their trust.'
  ];
  var chosenDemeanor = demeanors[Math.floor(Math.random() * demeanors.length)];
  var chosenStyle = speechStyles[Math.floor(Math.random() * speechStyles.length)];

  // Apply custom overrides
  if (customOpts.coop === 'cooperative') chosenDemeanor = '';
  else if (customOpts.coop === 'reluctant') chosenDemeanor = 'DEMEANOR: This patient is RELUCTANT and GUARDED. They give short answers, seem uncomfortable, and don\'t volunteer information. They may be hiding something or just don\'t trust doctors. The student must build rapport.';
  else if (customOpts.coop === 'hostile') chosenDemeanor = demeanors[7] || 'DEMEANOR: This patient is HOSTILE and RUDE.';

  if (customOpts.aggression === 'none') { if (chosenDemeanor.indexOf('HOSTILE') !== -1 || chosenDemeanor.indexOf('AGGRESSIVE') !== -1 || chosenDemeanor.indexOf('COMBATIVE') !== -1) chosenDemeanor = ''; }
  else if (customOpts.aggression === 'mild') chosenDemeanor = 'DEMEANOR: This patient is mildly irritable. They sigh, roll their eyes, and make snide comments but generally cooperate. "Are we almost done here?"';
  else if (customOpts.aggression === 'aggressive') chosenDemeanor = demeanors[8] || 'DEMEANOR: This patient is AGGRESSIVE and CONFRONTATIONAL.';

  if (customOpts.historian === 'good') chosenStyle = 'SPEECH STYLE: This patient is a good historian. They give clear, organized answers with relevant details and accurate timelines.';
  else if (customOpts.historian === 'poor') chosenStyle = 'SPEECH STYLE: This patient is a POOR historian. They can\'t remember when symptoms started, mix up medications, give contradictory answers, and struggle to describe what they feel. "I dunno... it just... hurts? Or maybe it\'s more like pressure? I can\'t really explain it."';
  else if (customOpts.historian === 'vague') chosenStyle = 'SPEECH STYLE: This patient is VAGUE. They give non-specific answers, use phrases like "I don\'t know, it\'s just not right" and "something feels off." Getting a clear history requires very specific, directed questions.';

  // Demographics randomizer — gives the AI a specific patient background to roleplay
  var demographics = [
    'PATIENT BACKGROUND: Young adult (18-25), university student, lives in a dorm, eats poorly, stays up late, socially active.',
    'PATIENT BACKGROUND: Middle-aged (40-55), office worker, sedentary lifestyle, mild overweight, stressed about work deadlines.',
    'PATIENT BACKGROUND: Elderly (70-85), retired, lives alone, multiple medications, hard of hearing, worried about being a burden.',
    'PATIENT BACKGROUND: Pregnant woman (25-35), second trimester, first pregnancy, very anxious about the baby.',
    'PATIENT BACKGROUND: Construction worker (30-45), physically active, smokes, drinks on weekends, tough guy attitude.',
    'PATIENT BACKGROUND: New immigrant (any age), limited English, brought a family member to translate, unfamiliar with Canadian healthcare system.',
    'PATIENT BACKGROUND: Indigenous patient (any age), lives on reserve, limited access to primary care, may have distrust of healthcare system due to historical trauma.',
    'PATIENT BACKGROUND: Teenager (13-17), brought by a parent. The parent answers most questions. The teen is reluctant to talk, especially about sensitive topics.',
    'PATIENT BACKGROUND: Single mother (25-40), works two jobs, can\'t afford to miss work, wants a quick fix. Has young kids waiting at home.',
    'PATIENT BACKGROUND: Professional athlete (20-35), very in tune with their body, anxious about anything affecting performance.',
    'PATIENT BACKGROUND: Homeless person (any age), comes to ER frequently, may have substance use history, vague about living situation.',
    'PATIENT BACKGROUND: South Asian elderly (65+), vegetarian, takes Ayurvedic supplements, family-oriented, son or daughter brought them in.',
    'PATIENT BACKGROUND: Chinese-Canadian (any age), may reference traditional Chinese medicine, acupuncture, herbal remedies they\'ve tried.',
    'PATIENT BACKGROUND: Caribbean-Canadian (any age), warm personality, may use cultural expressions, works in healthcare or service industry.',
    'PATIENT BACKGROUND: Rural farmer (50-70), drives 2 hours to get to the hospital, practical and no-nonsense, delayed coming in.',
    'PATIENT BACKGROUND: Child (2-10), parent is the historian. The child is crying/scared/hiding behind parent. Focus on parent interaction.',
    'PATIENT BACKGROUND: LGBTQ+ patient (any age), may or may not disclose orientation depending on comfort level with the doctor.',
    'PATIENT BACKGROUND: Military veteran (30-60), stoic, may have PTSD, reluctant to discuss mental health, "it\'s just physical, doc."',
    'PATIENT BACKGROUND: Healthcare worker (nurse/paramedic/PSW), knows medical terminology, may self-diagnose incorrectly, embarrassed about being a patient.'
  ];
  var chosenDemo = demographics[Math.floor(Math.random() * demographics.length)];

  // Apply sex/age custom overrides
  var customSexStr = '';
  if (customOpts.sex === 'male') customSexStr = '\nIMPORTANT: The patient MUST be MALE (cis male). Choose a male name and use he/him pronouns.';
  else if (customOpts.sex === 'female') customSexStr = '\nIMPORTANT: The patient MUST be FEMALE (cis female). Choose a female name and use she/her pronouns.';
  else if (customOpts.sex === 'nonbinary') customSexStr = '\nIMPORTANT: The patient is NON-BINARY. They use they/them pronouns. If asked about sex, they may clarify their assigned sex at birth for medical relevance but identify as non-binary. The student should use correct pronouns — if they misgender the patient, the patient should gently correct them. Name should be gender-neutral.';
  else if (customOpts.sex === 'trans_m') customSexStr = '\nIMPORTANT: The patient is a TRANSGENDER MAN (assigned female at birth, identifies as male). Uses he/him pronouns. May or may not be on testosterone. Has relevant anatomy (uterus, ovaries) that could be medically significant depending on the case. If asked about sex, he may say "I\'m trans" or mention his assigned sex if medically relevant. The student should use correct pronouns and be respectful.';
  else if (customOpts.sex === 'trans_f') customSexStr = '\nIMPORTANT: The patient is a TRANSGENDER WOMAN (assigned male at birth, identifies as female). Uses she/her pronouns. May or may not be on HRT (estrogen). Has relevant anatomy (prostate) that could be medically significant. If asked about sex, she may say "I\'m trans" or mention her assigned sex if medically relevant. The student should use correct pronouns and be respectful.';

  var customAgeStr = '';
  if (customOpts.age === 'child') customAgeStr = '\nIMPORTANT: The patient MUST be a CHILD (2-12 years old). A parent brings them in and is the primary historian.';
  else if (customOpts.age === 'young') customAgeStr = '\nIMPORTANT: The patient MUST be a YOUNG ADULT (18-30 years old).';
  else if (customOpts.age === 'middle') customAgeStr = '\nIMPORTANT: The patient MUST be MIDDLE-AGED (30-60 years old).';
  else if (customOpts.age === 'elderly') customAgeStr = '\nIMPORTANT: The patient MUST be ELDERLY (60+ years old).';
  else if (customOpts.age === 'pediatric') customAgeStr = '\nIMPORTANT: The patient MUST be a PEDIATRIC patient (newborn to 17). A parent is present and may be the primary historian.';

  chosenDemo += customSexStr + customAgeStr;

  // Difficulty modifier
  var difficultyPrompt = '';
  if (difficulty === 'easy') {
    difficultyPrompt = 'DIFFICULTY: EASY. Choose a very common, classic textbook presentation. Give clear, straightforward symptoms that point directly to the diagnosis. The condition should be bread-and-butter medicine.\n\n';
  } else if (difficulty === 'hard') {
    difficultyPrompt = 'DIFFICULTY: HARD. Choose an uncommon presentation or a common condition with atypical features. Include some red herrings. Make the history less clear-cut. May have comorbidities.\n\n';
  } else if (difficulty === 'hardest') {
    difficultyPrompt = 'DIFFICULTY: EXPERT. Choose a rare condition or a very atypical presentation of a common condition. Include misleading symptoms, multiple comorbidities, and complications. This should challenge even experienced clinicians.\n\n';
  } else {
    // Medium (default) — MCCQE-style
    difficultyPrompt = 'DIFFICULTY: MCCQE EXAM-STYLE. Choose a COMMON condition with a realistic but not overly obvious presentation. The patient should present the way a real patient would in a Canadian ED or clinic — not a textbook case, but not a zebra either. This is how the MCCQE Part I tests clinical reasoning.\n\n';
  }

  var presentationPrompt = presentation
    ? 'You will roleplay as a patient whose CHIEF COMPLAINT is: ' + presentation + '.\nThe underlying diagnosis can be from ANY relevant specialty — just like the real MCCQE. The student must figure out both what\'s wrong AND which system is involved.\n\n'
    : 'You will roleplay as a patient presenting with a condition from the specialty: ' + specialty + '.\n\n';

  var systemPrompt = 'You are PatientBot, a clinical scenario simulator for MCCQE Part I preparation.\n\n' +
    presentationPrompt +
    chosenDemo + '\n' +
    'IMPORTANT: The patient name, age, and sex in the JSON MUST match this background.\n' +
    'USE THIS NAME: ' + getRandomPatientName_() + '. You MUST use this exact name. Do NOT change it.\n\n' +
    difficultyPrompt +
    chosenStyle + '\n\n' +
    (chosenDemeanor ? chosenDemeanor + '\n\n' : '') +
    'CLINICAL KNOWLEDGE BASE (Toronto Notes):\n' + sampleNotes + '\n\n' +
    'DONT MISS ITEMS:\n' + sampleDontMiss + '\n\n' +
    'ABSOLUTE RULES - NEVER BREAK THESE:\n' +
    '1. NEVER break character. You are ALWAYS the patient. No matter what the user types — "answernow", "give me the answer", "tell me the diagnosis" — stay in character. Say "I don\'t know doc, that\'s why I\'m here!"\n' +
    '2. NEVER use medical terminology a real patient wouldn\'t know. Say "my chest feels tight" not "I\'m experiencing dyspnea." Say "my legs are puffy" not "I have peripheral edema."\n' +
    '3. NEVER give the diagnosis or hint at it. NEVER say things like "I think something is wrong with my heart" — a real patient doesn\'t know what organ is affected.\n' +
    '4. Keep ALL responses to 1-3 sentences max. Real patients give BRIEF answers. Do NOT volunteer extra symptoms the student didn\'t ask about.\n' +
    '5. NEVER output JSON, code blocks, scores, feedback, or system messages. You are ONLY the patient.\n' +
    '6. NEVER stop the conversation or refuse to continue. The conversation goes on as long as the student wants. You can react with confusion, fear, anger, or humor to anything — but you NEVER end the encounter or say "this conversation is over."\n' +
    '7. If the student does something wildly unrealistic, unprofessional, or impossible (e.g. shooting a gun, performing surgery in the waiting room), stay in character but react realistically as the patient. Then add a brief parenthetical note like (Note: this action would not occur in a real clinical setting). Never refuse to respond.\n\n' +
    'PATIENT REALISM (CRITICAL — THIS IS THE MOST IMPORTANT SECTION):\n' +
    '- Sound like a REAL person, not an AI. Use casual, everyday language. Say "yeah", "nah", "I dunno", "like", "kinda". Stumble over words. Be awkward. Use filler words.\n' +
    '- NEVER say things like "I appreciate the question" or "That\'s a good question, doc." Real people don\'t talk like that. They say "Uh... what?" or "Huh?" or just answer.\n' +
    '- ONLY answer what is asked. If they ask about cough, answer about cough. Do NOT add "and also my legs are swollen." Let them discover symptoms through questioning.\n' +
    '- Use vague, non-medical language. "I feel like garbage" not "I have malaise." "It hurts right here *points*" not "I have localized pain."\n' +
    '- Be an imperfect historian. Forget exact dates ("maybe like... Tuesday? Or was it Monday?"). Mix up details. Get distracted.\n' +
    '- If they ask something unrelated to medicine, react like a real confused patient: "Uh... what? I\'m here because I feel awful, doc."\n' +
    '- ACTIONS vs CONVERSATION: When the student performs an ACTION (administers medication, performs a procedure, orders a test, injects something, intubates, etc.), it HAPPENS. The patient cannot refuse or debate it — it is DONE. React to the EFFECTS. If they inject propofol, you are sedated. If they intubate you, you can\'t talk. If they give epinephrine, your heart races. Actions are not suggestions.\n' +
    '- If the student uses asterisks (*examines*) or action words (administer, inject, give, perform, insert, order, start), treat it as a completed action and react to the physical effects.\n' +
    '- Respond realistically to exam maneuvers (*palpates abdomen* -> "OW! Yeah that\'s tender right there, geez.")\n' +
    '- If asked about labs/imaging, give results as a brief list\n' +
    '- NEVER list multiple symptoms unprompted. Make the student WORK for the history.\n' +
    '- NEVER sound polite or formal. Sound like a normal person who is sick and a bit stressed.\n' +
    '- STOP ANSWERING QUESTIONS WITH QUESTIONS. This is CRITICAL. When the doctor asks you something, ANSWER IT DIRECTLY. Do NOT constantly say "why do you ask?", "is that important?", "should I be worried?", "what does that mean?" after every answer. Real patients just answer. Maybe 1 in 10 responses can include a question back, but MOST of the time just give a straight answer. Bad example: "Yeah I have a headache... why, is that bad?" Good example: "Yeah I\'ve had a headache for about two days now." JUST ANSWER.\n' +
    '- Vary your response style. Some answers should be one word ("Nah." "Yeah." "Maybe."). Some should be a sentence. Some can be two sentences. Do NOT make every response the same length or structure.\n\n' +
    (cheatMode ?
      'CHEAT MODE ACTIVE: The diagnosis is shown to the student in the app UI (NOT in the chat). Do NOT mention the diagnosis in your messages. Do NOT add any cheat mode text to your responses. Just be the patient normally.\n' +
      'If the student gets the diagnosis WRONG in cheat mode, respond with a funny/sarcastic remark about how they literally had the answer on screen. Be creative and funny, different each time. Stay in character otherwise. Do NOT give extra chances.\n\n'
      : '') +
    'FIRST MESSAGE FORMAT (mandatory):\n' +
    'Your very first message MUST start with a JSON block on its own line, then the patient presentation:\n' +
    '```patient\n' +
    '{"name":"<first name>","age":<number>,"sex":"<M/F>","hr":<number>,"bp":"<sys/dia>","rr":<number>,"temp":<number>,"spo2":<number>,"diagnosis":"<the correct diagnosis>"}\n' +
    '```\n' +
    'CRITICAL CONSISTENCY RULES:\n' +
    '1. The diagnosis in the JSON MUST match the clinical scenario you present. Every detail you give (symptoms, history, medications, timeline) must be consistent with that exact diagnosis. If the diagnosis is "opioid overdose" then the patient took opioids, not acetaminophen. If it\'s "appendicitis" then the pain is in the right lower quadrant, not the chest. NEVER contradict the diagnosis you wrote in the JSON.\n' +
    '2. YOU ARE the patient whose name, age, and sex are in the JSON. If your JSON says name:"Amir" age:14 sex:"M", then YOU are Amir, a 14-year-old boy. NEVER claim to be someone else. NEVER invent other characters. If the doctor asks "what\'s your name?" you say YOUR name from the JSON. If they call you a wrong name, correct them with YOUR real name. Your identity is LOCKED to the JSON.\n' +
    '3. If a parent/guardian brought you in (because you are a child), the PARENT is not the patient — YOU are. The parent can speak, but you are always Amir (or whatever name you chose). Never confuse yourself with the parent.\n\n' +
    'Then on the next line, begin the patient encounter in character with ONLY the chief complaint.\n' +
    'The chief complaint should be ONE main symptom in 1-2 short sentences. Example: "Hey doc, I\'ve been feeling really crummy this past week. Just can\'t shake this fever."\n' +
    'Do NOT mention more than one symptom in the opening. Let the student ask follow-up questions to discover the rest.\n' +
    'The JSON block will be hidden from the student and used by the app for scoring.\n' +
    'NEVER include JSON or code blocks in any subsequent message.\n\n' +
    'Begin now.';

  var caseId = Utilities.getUuid();

  // Store case context server-side
  CacheService.getUserCache().put('pb_' + caseId, JSON.stringify({
    systemPrompt: systemPrompt,
    specialty: specialty,
    cheatMode: cheatMode || false
  }), 7200);

  var messages = [{ role: 'user', content: 'Start the case.' }];
  var response = callAnthropic_(systemPrompt, messages);

  // Extract patient info JSON and strip from displayed message
  var patientInfo = null;
  var jsonMatch = response.match(/`{1,3}\s*patient\s*\n?([\s\S]*?)\n?\s*`{1,3}/i) ||
                  response.match(/(\{\s*"name"\s*:[\s\S]*?"diagnosis"\s*:[^}]*\})/);
  if (jsonMatch) {
    try {
      patientInfo = JSON.parse(jsonMatch[1].trim());
    } catch(e) {
      try { patientInfo = JSON.parse(jsonMatch[0].trim()); } catch(e2) {}
    }
    // Strip JSON and cheat mode text from response
    response = response.replace(/`{1,3}\s*patient\s*\n?[\s\S]*?\n?\s*`{1,3}\s*/gi, '');
    response = response.replace(/\{\s*"name"\s*:[\s\S]*?"diagnosis"\s*:[^}]*\}\s*/g, '');
    response = response.replace(/\[CHEAT MODE[^\]]*\]\s*/gi, '');
    response = response.trim();
  }

  // Store diagnosis + initial vitals in cache for scoring and consequence engine
  if (patientInfo && patientInfo.diagnosis) {
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify({
      systemPrompt: systemPrompt,
      specialty: specialty,
      diagnosis: patientInfo.diagnosis,
      cheatMode: cheatMode || false,
      vitals: {
        hr: patientInfo.hr || 80,
        bp: patientInfo.bp || '120/80',
        rr: patientInfo.rr || 16,
        temp: patientInfo.temp || 37.0,
        spo2: patientInfo.spo2 || 98
      }
    }), 7200);
  }

  return {
    caseId: caseId,
    specialty: specLabel,
    presentation: presentation || '',
    initialMessage: response,
    patientInfo: patientInfo
  };
}

function submitDiagnosis(caseId, userDiagnosis, correctDiagnosis, history) {
  var caseJson = CacheService.getUserCache().get('pb_' + caseId);
  if (!caseJson) {
    return { expired: true };
  }

  var caseData = JSON.parse(caseJson);
  var isCheatMode = caseData.cheatMode || false;

  var checkPrompt = 'You are a medical exam grader. The student submitted a diagnosis for a clinical case.\n\n' +
    'Correct diagnosis: ' + correctDiagnosis + '\n' +
    'Student answer: ' + userDiagnosis + '\n' +
    (isCheatMode ? 'NOTE: The student is in CHEAT MODE (the answer was shown to them).\n' : '') +
    '\nEvaluate how close the student\'s answer is to the correct diagnosis. Consider:\n' +
    '- Accept reasonable variations, abbreviations, and synonyms (e.g., "MI" = "myocardial infarction", "heart attack" = "acute MI").\n' +
    '- Give partial credit if they identified the right organ system or a closely related condition.\n' +
    '- Score 80-100 if essentially correct (synonyms, abbreviations, minor wording differences).\n' +
    '- Score 40-79 if partially correct (right system/organ but wrong specific diagnosis, or a closely related differential).\n' +
    '- Score 0-39 if wrong (different system, unrelated condition, or nonsensical answer).\n\n' +
    'Respond with ONLY a JSON object:\n' +
    '{"score": <0-100>, "correct": true/false, "close": true/false, "feedback": "<1-2 sentence explanation. If close (40-79), explain what they got right and what they missed, e.g. You identified the cardiac system but the specific diagnosis is X not Y.>' +
    (isCheatMode ? ' If wrong and score<40, be funny/sarcastic about them having the answer on screen.' : '') + '"}';

  var messages = [{ role: 'user', content: checkPrompt }];
  var response = callAnthropic_('You are a medical exam grading assistant. Respond only with valid JSON.', messages);

  try {
    var jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      var result = JSON.parse(jsonMatch[0]);
      var score = result.score || 0;
      var isCorrect = score >= 80 || result.correct === true;
      var isPartial = !isCorrect && score >= 40 && result.close !== false;
      return {
        correct: isCorrect,
        partial: isPartial,
        score: score,
        feedback: result.feedback,
        cheatMode: isCheatMode
      };
    }
  } catch (e) {}

  // Fallback: simple string matching
  var norm = function(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); };
  var isCorrect = norm(correctDiagnosis).indexOf(norm(userDiagnosis)) !== -1 ||
                  norm(userDiagnosis).indexOf(norm(correctDiagnosis)) !== -1;
  var fb = isCorrect ? 'Correct!' : 'The correct diagnosis was ' + correctDiagnosis + '.';
  if (!isCorrect && isCheatMode) fb += ' The answer was literally on your screen!';
  return { correct: isCorrect, partial: false, score: isCorrect ? 100 : 0, feedback: fb, cheatMode: isCheatMode };
}

function sendPatientBotMessage(caseId, message, history) {
  var caseJson = CacheService.getUserCache().get('pb_' + caseId);
  if (!caseJson) {
    return { response: 'Case expired. Please start a new case.', expired: true };
  }

  var caseData = JSON.parse(caseJson);

  // Detect if message contains a clinical action or test order
  // --- ACTIONS: procedures, treatments, interventions ---
  var actionKeywords = [
    // Medications & treatments
    'administer', 'prescribe', 'give ', 'inject', 'infuse', 'bolus', 'push ', 'titrate',
    'start iv', 'start an iv', 'start line', 'start drip', 'hang ', 'run ', 'dose ',
    'mg', 'cc', 'ml', 'mcg', 'units', 'meq',
    // Airway & breathing
    'intubat', 'extubat', 'bag.mask', 'ventilat', 'cpap', 'bipap', 'high.flow', 'nasal cannula',
    'oxygen', 'suction', 'trach', 'cricothyr', 'laryngoscop',
    // Procedures
    'insert', 'place ', 'remove ', 'pull ', 'chest tube', 'thoracostomy', 'thoracent',
    'paracentesis', 'central line', 'art line', 'arterial line', 'foley', 'catheter',
    'ng tube', 'nasogastric', 'splint', 'cast ', 'suture', 'staple', 'irrigat', 'debride',
    'incision', 'drainage', 'i&d', 'reduce ', 'relocat', 'decompress', 'needle ',
    // Positioning
    'trendelenburg', 'reverse trendelenburg', 'left lateral', 'recovery position',
    'elevate ', 'position ', 'prone', 'supine', 'sit up', 'lay flat', 'head of bed',
    // Monitoring
    'attach monitor', 'put on monitor', 'hook up', 'connect ', 'pulse ox', 'telemetry',
    'cardiac monitor', 'bp cuff', 'continuous',
    // Resuscitation
    'cpr', 'chest compress', 'defibrillat', 'cardiover', 'shock ', 'aed', 'code blue',
    'epinephrine', 'epi pen', 'atropine', 'amiodarone', 'vasopressin',
    // Other interventions
    'transfus', 'blood products', 'packed red', 'prbc', 'ffp', 'platelets',
    'restraint', 'sedat', 'paralyt', 'rapid sequence', 'rsi',
    'gastric lavage', 'activated charcoal', 'narcan', 'naloxone', 'flumazenil',
    'tourniquet', 'pressure ', 'bandage', 'dress wound',
    // Management & disposition
    'discharge', 'prescribe', 'rx', 'refer', 'referral', 'admit', 'admission',
    'counsel', 'explain', 'educate', 'safety plan', 'follow up', 'book appointment',
    // Asterisk actions
    '^\\\*'
  ];
  var isAction = new RegExp(actionKeywords.join('|'), 'i').test(message);

  // Questions are NOT actions — if it ends with ? or starts with common question words, skip engine
  var isQuestion = /\?\s*$/.test(message.trim()) || /^(what|when|where|who|why|how|do you|does|did|have you|are you|is |can you|tell me|any |describe)/i.test(message.trim());
  if (isQuestion && !message.match(/^\*/)) { isAction = false; }

  // --- TESTS: labs, imaging, diagnostics ---
  var testKeywords = [
    // Imaging
    'x.?ray', 'xray', 'radiograph', 'ct ', 'ct scan', 'cat scan', 'mri', 'ultrasound', 'sono',
    'doppler', 'angiogra', 'fluoroscop', 'pet scan', 'nuclear', 'bone scan', 'dexa',
    'mammogra', 'chest x', 'cxr', 'kub', 'abdomen.*film',
    // Cardiac
    'ekg', 'ecg', 'electrocardiog', 'echo', 'echocardiog', 'stress test', 'holter',
    'cardiac cath', 'angioplast', 'coronary',
    // Lab panels
    'blood ?work', 'blood ?test', 'draw blood', 'labs', 'panel',
    'cbc', 'complete blood', 'bmp', 'cmp', 'lft', 'liver function', 'renal function',
    'coag', 'inr', 'ptt', 'pt ', 'fibrinogen',
    // Specific labs
    'troponin', 'bnp', 'nt.pro', 'd.?dimer', 'lactate', 'procalcitonin',
    'crp', 'esr', 'sed rate', 'ferritin', 'iron studies',
    'tsh', 'thyroid', 't3', 't4', 'cortisol', 'acth',
    'hba1c', 'a1c', 'glucose', 'blood sugar', 'insulin',
    'lipase', 'amylase', 'bilirubin', 'albumin', 'protein',
    'creatinine', 'bun', 'gfr', 'electrolyte', 'sodium', 'potassium', 'calcium', 'magnesium', 'phosph',
    'hemoglobin', 'hematocrit', 'wbc', 'white blood', 'platelet',
    // Urine & body fluids
    'urinalysis', 'ua ', 'urine', 'urine culture', 'microscop',
    'csf', 'spinal fluid', 'lumbar puncture', 'lp ',
    'joint aspirat', 'arthrocentesis', 'synovial',
    'pleural fluid', 'peritoneal',
    // Microbiology
    'culture', 'blood culture', 'gram stain', 'sensitivity', 'susceptib',
    'rapid strep', 'rapid flu', 'rapid covid', 'pcr', 'antigen',
    'acid.fast', 'afb', 'fungal',
    // Pathology
    'biopsy', 'histolog', 'cytolog', 'pap smear', 'fna',
    // Scopes
    'scope', 'oscopy', 'endoscop', 'colonoscop', 'bronchoscop', 'cystoscop', 'laryngoscop',
    'sigmoidoscop', 'egd', 'upper gi',
    // Blood gas
    'blood gas', 'abg', 'vbg', 'arterial gas',
    // Other diagnostics
    'pulmonary function', 'pft', 'spirometry', 'peak flow',
    'eeg', 'electroencephalog', 'emg', 'nerve conduction',
    'skin test', 'patch test', 'allergy test', 'scratch test',
    'pregnancy test', 'hcg', 'beta hcg',
    'toxicology', 'tox screen', 'drug screen', 'alcohol level', 'bac',
    'type and screen', 'type and cross', 'crossmatch',
    'genetic', 'karyotype', 'fish',
    // Order patterns
    'send for', 'order .*(test|scan|image)', 'run .*(test|panel|labs)', 'check .*level',
    'measure ', 'test for', 'screen for',
    // Physical exam maneuvers (these should return findings, not just "exam performed")
    'otoscope', 'ophthalmoscope', 'fundoscop', 'palpat', 'auscult', 'percuss',
    'inspect', 'check vitals', 'check pupils', 'check reflexes', 'cranial nerve',
    'mental status', 'rectal exam', 'digital rectal', 'pelvic exam', 'vaginal exam',
    'speculum', 'range of motion', 'rom ', 'straight leg', 'romberg',
    'kernig', 'brudzinski', 'murphy', 'mcburney', 'psoas sign', 'obturator sign',
    'babinski', 'clonus', 'deep tendon', 'sensation', 'pinprick', 'light touch',
    'finger.to.nose', 'heel.to.shin', 'tandem gait', 'gait assessment',
    'heart sounds', 'lung sounds', 'bowel sounds', 'breath sounds',
    'lymph node', 'thyroid exam', 'breast exam', 'testicular exam',
    'neurological exam', 'neuro exam', 'skin exam', 'dermatolog',
    'eye exam', 'ear exam', 'nose exam', 'throat exam', 'oral exam',
    'abdominal exam', 'chest exam', 'cardiovascular exam', 'musculoskeletal',
    '\\*.*exam', '\\*.*palpat', '\\*.*auscult', '\\*.*inspect', '\\*.*check',
    '\\*.*takes', '\\*.*look', '\\*.*listen', '\\*.*feel', '\\*.*observe', '\\*.*assess',
    '\\*.*otoscope', '\\*.*ophthalm', '\\*.*percuss', '\\*.*reflex',
    'takes? temp', 'takes? bp', 'takes? blood pressure', 'takes? pulse', 'takes? vitals',
    'check temp', 'check heart', 'check lung', 'check breath', 'check eye', 'check ear',
    'look at', 'look in', 'listen to', 'feel for', 'press on'
  ];
  var isTest = new RegExp(testKeywords.join('|'), 'i').test(message);

  // --- CALL 1: Clinical Engine (evaluate action consequences OR return test results) ---
  var consequence = null;
  var vitalChanges = null;
  var testResults = null;
  if (isAction || isTest) {
    var currentVitals = caseData.vitals || {};
    var enginePrompt = 'You are a clinical simulator engine for a medical training app.\n\n' +
      'Patient diagnosis: ' + (caseData.diagnosis || 'unknown') + '\n' +
      'Current vitals: HR=' + (currentVitals.hr || '?') + ' BP=' + (currentVitals.bp || '?') + ' RR=' + (currentVitals.rr || '?') +
      ' Temp=' + (currentVitals.temp || '?') + ' SpO2=' + (currentVitals.spo2 || '?') + '\n' +
      'Student action: ' + message + '\n\n';

    if (isTest) {
      // Pure test order — return realistic results
      enginePrompt += 'The student performed a diagnostic test, physical exam maneuver, or ordered labs/imaging. Generate REALISTIC findings consistent with the diagnosis.\n' +
        'For PHYSICAL EXAMS: describe exactly what the doctor sees, feels, or hears. E.g. otoscope → "Right TM bulging, erythematous, purulent fluid visible behind membrane. Left TM normal, pearly grey, light reflex present." Palpate abdomen → "Soft, tender in RLQ with guarding. No rebound. Normoactive bowel sounds."\n' +
        'For LABS: give specific numbers with reference ranges.\n' +
        'For IMAGING: describe findings like a radiology report.\n' +
        'CRITICAL: Report findings ONLY as raw clinical data. No interpretation, no diagnosis names, no clinical significance commentary. Just what you see/measure. The student interprets it.\n\n' +
        'Respond with ONLY a JSON object:\n' +
        '{"testName": "<name of test>", "results": "<raw clinical data only, use line breaks with \\n>", "abnormal": true/false, "clinicalSignificance": ""}';
    } else {
      // Treatment/procedure action — DO NOT reveal diagnosis in consequence
      enginePrompt += 'Evaluate this action. Describe ONLY the direct physical effect of the action on the body.\n' +
        'GOOD examples: "Standard assessment procedure performed", "Medication administered, monitoring for effect", "Vital signs being monitored"\n' +
        'BAD examples (NEVER DO THIS): "Helps determine opioid effect", "Guides naloxone dosing", "Appropriate for endocarditis"\n' +
        'The consequence must NEVER hint at, reference, or name any diagnosis, drug class relevance, or clinical reasoning. Just describe what physically happens.\n\n' +
        'FATAL guidelines: ONLY fatal for guaranteed-death actions (headshot, lethal injection, massive exsanguination). Wrong meds = "caution" or "dangerous", not fatal. Non-vital gunshots = dangerous but survivable. Fear alone cannot kill.\n\n' +
        'Respond with ONLY a JSON object:\n' +
        '{"appropriate": true/false, "consequence": "<1 sentence clinical consequence WITHOUT naming the diagnosis>", ' +
        '"vitalChanges": {"hr": <delta>, "bp_sys": <delta>, "rr": <delta>, "spo2": <delta>}, ' +
        '"severity": "safe|caution|dangerous|fatal", ' +
        '"fatal": true/false, "causeOfDeath": "<if fatal, brief explanation of why the patient died>"}';
    }

    try {
      var engineResponse = callAnthropicModel_('claude-haiku-4-5-20251001', enginePrompt, [{ role: 'user', content: 'Evaluate this action.' }]);
      var engineJson = engineResponse.match(/\{[\s\S]*\}/);
      if (engineJson) {
        var parsed = JSON.parse(engineJson[0]);

        // Test results
        if (parsed.testName) {
          testResults = {
            testName: parsed.testName,
            results: parsed.results,
            abnormal: parsed.abnormal,
            significance: parsed.clinicalSignificance
          };
        }

        consequence = parsed.consequence;
        vitalChanges = parsed.vitalChanges;

        // Check if action was fatal
        if (parsed.fatal) {
          return {
            response: '',
            consequence: parsed.consequence,
            fatal: true,
            causeOfDeath: parsed.causeOfDeath || parsed.consequence,
            vitals: { hr: 0, bp: '0/0', rr: 0, temp: currentVitals.temp, spo2: 0 }
          };
        }

        // Update cached vitals
        if (vitalChanges && currentVitals.hr) {
          currentVitals.hr = Math.max(30, Math.min(200, (currentVitals.hr || 80) + (vitalChanges.hr || 0)));
          currentVitals.spo2 = Math.max(50, Math.min(100, (currentVitals.spo2 || 98) + (vitalChanges.spo2 || 0)));
          currentVitals.rr = Math.max(4, Math.min(50, (currentVitals.rr || 16) + (vitalChanges.rr || 0)));
          caseData.vitals = currentVitals;
          CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
        }
      }
    } catch(e) {
      // Silently continue without consequence if engine fails
    }
  }

  // --- CALL 2: Patient Response (role-play with consequence context) ---
  var messages = [];
  if (history && history.length > 0) {
    history.forEach(function(h) {
      // API only accepts user/assistant — skip everything else
      if (h.role !== 'user' && h.role !== 'assistant') return;
      messages.push({ role: h.role, content: typeof h.content === 'string' ? h.content : JSON.stringify(h.content) });
    });
  }

  // Inject consequence context for the patient to react to
  var userMsg = message;
  if (consequence) {
    userMsg += '\n\n[SYSTEM NOTE - hidden from student: Clinical consequence of this action: ' + consequence + '. React to this realistically as the patient. Stay in character.]';
  }
  messages.push({ role: 'user', content: userMsg });

  var response = callAnthropic_(caseData.systemPrompt, messages);

  // Strip any accidental JSON from follow-up messages
  response = response.replace(/`{1,3}\s*patient\s*\n?[\s\S]*?\n?\s*`{1,3}\s*/gi, '');
  response = response.replace(/\{\s*"name"\s*:[\s\S]*?"diagnosis"\s*:[^}]*\}\s*/g, '');
  // Strip system note leaks
  response = response.replace(/\[SYSTEM NOTE[\s\S]*?\]/gi, '');

  return {
    response: response.trim(),
    consequence: consequence,
    testResults: testResults,
    vitals: caseData.vitals || null
  };
}

// =============================================
// PATIENTBOT DEBRIEF (answernow)
// =============================================

function debriefPatientBot(caseId, history) {
  var caseJson = CacheService.getUserCache().get('pb_' + caseId);
  if (!caseJson) return { diagnosis: '?', score: 0, feedback: 'Case expired.' };

  var caseData = JSON.parse(caseJson);
  var diagnosis = caseData.diagnosis || 'Unknown';

  // Build transcript
  var transcript = '';
  if (history && history.length > 0) {
    for (var i = 0; i < history.length; i++) {
      var h = history[i];
      if (h.role === 'user') transcript += 'STUDENT: ' + h.content + '\n';
      else if (h.role === 'assistant') transcript += 'PATIENT: ' + h.content + '\n';
      else if (h.role === 'system') transcript += '[CONSEQUENCE: ' + h.content + ']\n';
      else if (h.role === 'results') transcript += '[TEST RESULTS: ' + JSON.stringify(h.content) + ']\n';
    }
  }

  var prompt = 'You are a clinical teaching debrief assistant. A medical student just finished (or gave up on) a simulated patient encounter.\n\n' +
    'CORRECT DIAGNOSIS: ' + diagnosis + '\n\n' +
    'TRANSCRIPT:\n' + transcript + '\n\n' +
    'Provide a debrief. Respond with ONLY a JSON object:\n' +
    '{\n' +
    '  "diagnosis": "' + diagnosis + '",\n' +
    '  "score": <1-10 based on their clinical approach>,\n' +
    '  "feedback": "<2-4 sentences: what they did well, what they missed, what they should have asked/ordered. Be specific and educational. Reference actual things from the transcript.>",\n' +
    '  "callouts": "<call out anything funny, unprofessional, unrealistic, or dangerous they did. Be witty but educational. If they were professional, say so. Examples: \'Asking about Nicholas Cage mid-consultation is... creative. Maybe save that for the break room.\' or \'Yelling at the patient is a great way to get written up.\' or \'You tried to give propofol without monitoring - that is a lawsuit waiting to happen.\' If nothing notable, leave empty string.>"\n' +
    '}';

  try {
    var response = callAnthropicModel_('claude-haiku-4-5-20251001', prompt, [{ role: 'user', content: 'Generate the debrief.' }]);
    var jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch(e) {}

  return { diagnosis: diagnosis, score: 0, feedback: 'Could not generate debrief.', callouts: '' };
}

// =============================================
// OSCE SCORECARD DEBRIEF
// =============================================

function generateCaseDebrief(caseId, history) {
  // Build transcript from history
  var transcript = '';
  if (history && history.length > 0) {
    for (var i = 0; i < history.length; i++) {
      var h = history[i];
      if (h.role === 'user') transcript += 'STUDENT: ' + h.content + '\n';
      else if (h.role === 'assistant') transcript += 'PATIENT: ' + h.content + '\n';
      else if (h.role === 'system') transcript += '[CONSEQUENCE: ' + h.content + ']\n';
      else if (h.role === 'results') transcript += '[TEST RESULTS: ' + JSON.stringify(h.content) + ']\n';
    }
  }

  var prompt = 'You are an OSCE examiner scoring a medical student\'s clinical encounter. Review the transcript and score these categories 0-10:\n' +
    '1. History Taking (asked about HPI, PMH, medications, allergies, social hx, family hx, review of systems)\n' +
    '2. Physical Exam (performed relevant examinations)\n' +
    '3. Investigations (ordered appropriate tests/labs/imaging)\n' +
    '4. Diagnosis (accuracy of clinical reasoning)\n' +
    '5. Management (appropriate treatment, prescriptions, referrals, disposition)\n' +
    '6. Communication (professional, empathetic, used patient name, explained things clearly)\n' +
    '7. Patient Safety (didn\'t harm patient, addressed red flags like suicidal ideation)\n\n' +
    'TRANSCRIPT:\n' + transcript + '\n\n' +
    'Return ONLY JSON:\n' +
    '{"scores": {"history": N, "exam": N, "investigations": N, "diagnosis": N, "management": N, "communication": N, "safety": N}, ' +
    '"overall": N, "grade": "A/B/C/D/F", "strengths": ["..."], "improvements": ["..."], "missed": ["key things student should have done"]}';

  try {
    var response = callAnthropicModel_('claude-sonnet-4-20250514', prompt, [{ role: 'user', content: 'Score this encounter.' }]);
    var jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch(e) {}

  return { scores: { history: 0, exam: 0, investigations: 0, diagnosis: 0, management: 0, communication: 0, safety: 0 }, overall: 0, grade: 'F', strengths: [], improvements: ['Could not generate scorecard.'], missed: [] };
}

// =============================================
// ANTHROPIC API
// =============================================

function callAnthropicModel_(model, systemPrompt, messages) {
  return callAnthropic_(systemPrompt, messages, model);
}

function callAnthropic_(systemPrompt, messages, model) {
  var config = getConfig_();

  var payload = {
    model: model || 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': config.API_KEY,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
    var json = JSON.parse(response.getContentText());

    if (json.error) {
      return 'API Error: ' + json.error.message;
    }

    return json.content[0].text;
  } catch (e) {
    return 'Connection error: ' + e.message;
  }
}

// =============================================
// IMAGE SERVICE
// =============================================

function getImageChapters() {
  var config = getConfig_();
  if (!config.DRIVE_FOLDER_ID) return [];

  try {
    var folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    var files = folder.getFiles();
    var chapters = {};

    while (files.hasNext()) {
      var file = files.next();
      var name = file.getName();
      var match = name.match(/^(.+?)_p(\d+)_img/);
      if (match) {
        var slug = match[1];
        var readable = slug.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        if (!chapters[slug]) chapters[slug] = { slug: slug, name: readable, count: 0 };
        chapters[slug].count++;
      }
    }

    return Object.keys(chapters).sort().map(function(k) { return chapters[k]; });
  } catch (e) {
    Logger.log('getImageChapters error: ' + e.message);
    return [];
  }
}

function getChapterImages(chapterSlug, page, pageSize) {
  var config = getConfig_();
  if (!config.DRIVE_FOLDER_ID) return { images: [], total: 0 };

  page = page || 1;
  pageSize = pageSize || 20;

  try {
    var folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    var files = folder.getFiles();
    var all = [];

    while (files.hasNext()) {
      var file = files.next();
      var name = file.getName();
      if (name.indexOf(chapterSlug + '_p') === 0) {
        var pageMatch = name.match(/_p(\d+)_/);
        all.push({
          id: file.getId(),
          name: name,
          pageNum: pageMatch ? parseInt(pageMatch[1]) : 0,
          url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w800'
        });
      }
    }

    all.sort(function(a, b) { return a.pageNum - b.pageNum; });
    var start = (page - 1) * pageSize;
    var slice = all.slice(start, start + pageSize);

    return { images: slice, total: all.length, page: page, pageSize: pageSize };
  } catch (e) {
    Logger.log('getChapterImages error: ' + e.message);
    return { images: [], total: 0 };
  }
}

function getImageUrl(pageNum, chapterSlug) {
  var config = getConfig_();
  if (!config.DRIVE_FOLDER_ID) return null;

  try {
    var folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    var paddedNum = ('0000' + pageNum).slice(-4);
    var fileName = chapterSlug + '_p' + paddedNum + '_img01.png';
    var files = folder.getFilesByName(fileName);

    if (files.hasNext()) {
      var file = files.next();
      return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w800';
    }
  } catch (e) {
    Logger.log('Image error: ' + e.message);
  }

  return null;
}

// =============================================
// LIBRARY (ebook viewer)
// =============================================

function getLibraryBook(bookKey) {
  // Search Drive for the book PDF
  var searchTerms = {
    'toronto-notes': 'Toronto Notes',
    'dsm5': 'DSM-5',
    'grays': 'Gray\'s Anatomy'
  };
  var searchTerm = searchTerms[bookKey] || bookKey;

  try {
    var files = DriveApp.searchFiles('title contains "' + searchTerm + '" and mimeType = "application/pdf"');
    if (files.hasNext()) {
      var file = files.next();
      // Ensure it's shared (anyone with link can view)
      try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch(e) {}
      return {
        id: file.getId(),
        title: file.getName(),
        size: file.getSize(),
        url: file.getUrl()
      };
    }
  } catch(e) {
    Logger.log('getLibraryBook error: ' + e.message);
  }
  return null;
}

// =============================================
// KEY TOPICS CONDENSING - Run via GAS editor
// =============================================

/**
 * Condense Dont_Miss sheet into Key_Topics_Condensed using Claude Sonnet.
 * Run this from the GAS editor (Run > condenseDontMiss).
 * It processes all specialties in batches. If it times out at 6min,
 * just run it again — it picks up where it left off.
 */
function condenseDontMiss() {
  var config = getConfig_();
  var ss = SpreadsheetApp.openById(config.SHEET_ID);

  // Read all Dont_Miss data
  var srcSheet = ss.getSheetByName('Dont_Miss');
  if (!srcSheet) { Logger.log('No Dont_Miss sheet found'); return; }
  var data = srcSheet.getDataRange().getValues();
  var headers = data[0];
  var specIdx = headers.indexOf('Specialty');
  var itemIdx = headers.indexOf('Item');
  if (specIdx === -1 || itemIdx === -1) { Logger.log('Missing Specialty/Item columns'); return; }

  // Group by specialty
  var groups = {};
  for (var i = 1; i < data.length; i++) {
    var spec = (data[i][specIdx] || '').toString().trim();
    var item = (data[i][itemIdx] || '').toString().trim();
    if (!spec || !item) continue;
    if (!groups[spec]) groups[spec] = [];
    groups[spec].push(item);
  }

  var specialties = Object.keys(groups).sort();
  Logger.log('Found ' + specialties.length + ' specialties, ' + (data.length - 1) + ' total items');

  // Get or create output sheet
  var outSheet = ss.getSheetByName('Key_Topics_Condensed');
  if (!outSheet) {
    outSheet = ss.insertSheet('Key_Topics_Condensed');
    outSheet.appendRow(['Specialty', 'Title', 'Points', 'Priority']);
  }

  // Check which specialties are already done
  var existingData = outSheet.getDataRange().getValues();
  var doneSpecs = {};
  for (var i = 1; i < existingData.length; i++) {
    doneSpecs[existingData[i][0]] = true;
  }

  var SYSTEM_PROMPT = 'You are a medical education expert condensing study material for the MCCQE Part I exam.\n\n' +
    'Your task: Take a list of individual "don\'t miss" bullet points for a medical specialty and intelligently condense them into organized CONCEPT CARDS.\n\n' +
    'Rules:\n' +
    '1. Group related items into concept cards (e.g., all hyponatremia bullets become one "Hyponatremia" card)\n' +
    '2. Each card should have:\n' +
    '   - A clear TITLE (the concept name)\n' +
    '   - KEY POINTS organized logically (causes | diagnosis | treatment, or similar structure)\n' +
    '   - A PRIORITY tag: "Must Know" (high-frequency exam topics), "Should Know" (common), or "Good to Know" (rare/edge cases)\n' +
    '3. Preserve ALL important medical facts — don\'t remove content, just organize it\n' +
    '4. Use concise medical language, no fluff\n' +
    '5. Aim for roughly 5-15 concept cards per batch of items\n' +
    '6. Use pipe (|) to separate sub-sections within key points\n\n' +
    'Output format — return ONLY a JSON array, no markdown:\n' +
    '[{"title": "Concept Name", "points": "Causes: X, Y, Z | Diagnosis: test1, test2 | Treatment: drug1, drug2", "priority": "Must Know"}]';

  var processed = 0;
  var startTime = new Date().getTime();

  for (var s = 0; s < specialties.length; s++) {
    var spec = specialties[s];
    if (doneSpecs[spec]) {
      Logger.log('Skipping ' + spec + ' (already done)');
      continue;
    }

    // Check time — stop at 5 minutes to avoid timeout
    if (new Date().getTime() - startTime > 300000) {
      Logger.log('Time limit approaching — stopping. Run again to continue.');
      break;
    }

    var items = groups[spec];
    Logger.log('[' + (s + 1) + '/' + specialties.length + '] Processing ' + spec + ' (' + items.length + ' items)...');

    // Batch large specialties (200 items max per API call)
    var allCards = [];
    for (var b = 0; b < items.length; b += 200) {
      var batch = items.slice(b, b + 200);
      var userMsg = 'Specialty: ' + spec + '\n\nCondense these ' + batch.length + ' items into organized concept cards:\n\n' +
        batch.map(function(item, i) { return (i + 1) + '. ' + item; }).join('\n');

      try {
        var payload = {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMsg }]
        };

        var options = {
          method: 'post',
          contentType: 'application/json',
          headers: {
            'x-api-key': config.API_KEY,
            'anthropic-version': '2023-06-01'
          },
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        };

        var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
        var json = JSON.parse(response.getContentText());

        if (json.error) {
          Logger.log('API error for ' + spec + ': ' + json.error.message);
          if (json.error.type === 'rate_limit_error') {
            Utilities.sleep(15000);
            b -= 200; // retry this batch
          }
          continue;
        }

        var text = json.content[0].text;
        var cards;
        try {
          cards = JSON.parse(text);
        } catch (e) {
          var match = text.match(/\[[\s\S]*\]/);
          if (match) cards = JSON.parse(match[0]);
          else { Logger.log('Parse error for ' + spec); continue; }
        }

        for (var c = 0; c < cards.length; c++) {
          allCards.push([spec, cards[c].title, cards[c].points, cards[c].priority || 'Should Know']);
        }

        Logger.log('  -> ' + cards.length + ' concept cards from batch');
        Utilities.sleep(1000); // rate limit buffer
      } catch (e) {
        Logger.log('Error for ' + spec + ': ' + e.message);
      }
    }

    // Write to sheet
    if (allCards.length > 0) {
      outSheet.getRange(outSheet.getLastRow() + 1, 1, allCards.length, 4).setValues(allCards);
      processed++;
      Logger.log('  Wrote ' + allCards.length + ' cards for ' + spec);
    }
  }

  Logger.log('Done! Processed ' + processed + ' specialties this run. Total rows: ' + (outSheet.getLastRow() - 1));
}

// =============================================
// SETUP HELPER - Run once manually
// =============================================

function setupProperties() {
  PropertiesService.getScriptProperties().setProperties({
    'SHEET_ID': '1dqlfIfqzRA4pgLa1NocrlT2iyiJuQBN9Tauy1xLVsvo',
    'DRIVE_FOLDER_ID': '1l96pRrZhTWc8duzvxCyHptkDXBEM7a73',
    'ANTHROPIC_API_KEY': 'PASTE_YOUR_NEW_KEY_HERE',
    'ALLOWED_EMAILS': ''
  });
  Logger.log('Properties set! Now update ANTHROPIC_API_KEY with your real key.');
}

// Debug: list all sheet tabs and row counts (run from GAS editor)
function debugListSheets() {
  var config = getConfig_();
  var ss = SpreadsheetApp.openById(config.SHEET_ID);
  var sheets = ss.getSheets();
  var result = [];
  sheets.forEach(function(s) {
    var name = s.getName();
    var rows = s.getLastRow();
    result.push(name + ': ' + rows + ' rows');
    Logger.log(name + ': ' + rows + ' rows');
  });
  return result;
}
