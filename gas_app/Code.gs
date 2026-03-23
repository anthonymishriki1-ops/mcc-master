// =============================================
// MCC MASTER - Google Apps Script Backend
// =============================================

// --- Embedded Glossary Data ---
var GLOSSARY_EMBEDDED_ = [{"term":"CBC","definition":"Complete blood count measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets.","category":"abbreviation","persian":"شمارش کامل خون"},{"term":"BMP","definition":"Basic metabolic panel measures electrolytes, glucose, BUN, and creatinine.","category":"abbreviation","persian":"پانل متابولیک پایه"},{"term":"CMP","definition":"Comprehensive metabolic panel includes BMP plus liver function tests and protein levels.","category":"abbreviation","persian":"پانل متابولیک جامع"},{"term":"LFTs","definition":"Liver function tests measure enzymes and proteins to assess liver health.","category":"abbreviation","persian":"آزمایش‌های عملکرد کبد"},{"term":"ABG","definition":"Arterial blood gas measures pH, oxygen, and carbon dioxide levels in arterial blood.","category":"abbreviation","persian":"گاز خون شریانی"},{"term":"VBG","definition":"Venous blood gas measures pH and CO2 levels in venous blood.","category":"abbreviation","persian":"گاز خون وریدی"},{"term":"INR","definition":"International normalized ratio standardizes prothrombin time measurements for anticoagulation monitoring.","category":"abbreviation","persian":"نسبت بین‌المللی نرمال شده"},{"term":"PTT","definition":"Partial thromboplastin time measures intrinsic coagulation pathway function.","category":"abbreviation","persian":"زمان ترومبوپلاستین جزئی"},{"term":"PT","definition":"Prothrombin time measures extrinsic coagulation pathway function.","category":"abbreviation","persian":"زمان پروترومبین"},{"term":"ESR","definition":"Erythrocyte sedimentation rate measures inflammation by how fast red blood cells settle.","category":"abbreviation","persian":"سرعت ترسیب گلبول قرمز"},{"term":"CRP","definition":"C-reactive protein is an acute phase reactant that indicates inflammation.","category":"abbreviation","persian":"پروتئین واکنشی سی"},{"term":"BNP","definition":"B-type natriuretic peptide is elevated in heart failure and cardiac stress.","category":"abbreviation","persian":"پپتید ناتریورتیک نوع بی"},{"term":"TSH","definition":"Thyroid stimulating hormone regulates thyroid function and is used to screen thyroid disorders.","category":"abbreviation","persian":"هورمون محرک تیروئید"},{"term":"HbA1c","definition":"Hemoglobin A1c reflects average blood glucose levels over 2-3 months.","category":"abbreviation","persian":"هموگلوبین گلیکوزیله"},{"term":"GFR","definition":"Glomerular filtration rate measures kidney function and filtration capacity.","category":"abbreviation","persian":"نرخ فیلتراسیون گلومرولی"},{"term":"BUN","definition":"Blood urea nitrogen measures kidney function and protein metabolism.","category":"abbreviation","persian":"نیتروژن اوره خون"},{"term":"ANA","definition":"Antinuclear antibodies are autoantibodies that target cell nuclei in autoimmune diseases.","category":"abbreviation","persian":"آنتی‌بادی‌های ضد هسته‌ای"},{"term":"ANCA","definition":"Anti-neutrophil cytoplasmic antibodies are associated with vasculitis syndromes.","category":"abbreviation","persian":"آنتی‌بادی‌های ضد سیتوپلاسم نوتروفیل"},{"term":"RF","definition":"Rheumatoid factor is an autoantibody found in rheumatoid arthritis and other conditions.","category":"abbreviation","persian":"فاکتور روماتوئید"},{"term":"ACE","definition":"Angiotensin converting enzyme level is elevated in sarcoidosis and other granulomatous diseases.","category":"abbreviation","persian":"آنزیم تبدیل کننده آنژیوتانسین"},{"term":"ACTH","definition":"Adrenocorticotropic hormone stimulates cortisol production from the adrenal glands.","category":"abbreviation","persian":"هورمون آدرنوکورتیکوتروپیک"},{"term":"FSH","definition":"Follicle stimulating hormone regulates reproductive function and gamete production.","category":"abbreviation","persian":"هورمون محرک فولیکول"},{"term":"LH","definition":"Luteinizing hormone triggers ovulation and testosterone production.","category":"abbreviation","persian":"هورمون لوتئینی زا"},{"term":"AFP","definition":"Alpha-fetoprotein is a tumor marker for hepatocellular carcinoma and testicular cancer.","category":"abbreviation","persian":"آلفا فتوپروتئین"},{"term":"CEA","definition":"Carcinoembryonic antigen is a tumor marker for colorectal and other cancers.","category":"abbreviation","persian":"آنتی‌ژن کارسینوامبریونیک"},{"term":"PSA","definition":"Prostate specific antigen screens for prostate cancer and monitors treatment response.","category":"abbreviation","persian":"آنتی‌ژن اختصاصی پروستات"},{"term":"CA-125","definition":"Cancer antigen 125 is a tumor marker primarily for ovarian cancer.","category":"abbreviation","persian":"آنتی‌ژن سرطانی ۱۲۵"},{"term":"UA","definition":"Urinalysis examines urine for cells, proteins, glucose, and other substances.","category":"abbreviation","persian":"آنالیز ادرار"},{"term":"CSF","definition":"Cerebrospinal fluid analysis helps diagnose central nervous system infections and diseases.","category":"abbreviation","persian":"مایع مغزی نخاعی"},{"term":"EKG","definition":"Electrocardiogram records electrical activity of the heart to detect arrhythmias and ischemia.","category":"abbreviation","persian":"الکتروکاردیوگرام"},{"term":"CXR","definition":"Chest X-ray visualizes lungs, heart, and chest structures for diagnostic purposes.","category":"abbreviation","persian":"رادیوگرافی قفسه سینه"},{"term":"CT","definition":"Computed tomography uses X-rays to create detailed cross-sectional images.","category":"abbreviation","persian":"توموگرافی کامپیوتری"},{"term":"MRI","definition":"Magnetic resonance imaging uses magnetic fields to create detailed soft tissue images.","category":"abbreviation","persian":"تصویربرداری رزونانس مغناطیسی"},{"term":"US","definition":"Ultrasound uses sound waves to visualize internal structures in real-time.","category":"abbreviation","persian":"سونوگرافی"},{"term":"PET","definition":"Positron emission tomography detects metabolic activity using radioactive tracers.","category":"abbreviation","persian":"توموگرافی انتشار پوزیترون"},{"term":"ERCP","definition":"Endoscopic retrograde cholangiopancreatography visualizes bile and pancreatic ducts.","category":"abbreviation","persian":"کولانژیوپانکراتوگرافی برگشتی آندوسکوپیک"},{"term":"MRCP","definition":"Magnetic resonance cholangiopancreatography non-invasively images bile and pancreatic ducts.","category":"abbreviation","persian":"کولانژیوپانکراتوگرافی رزونانس مغناطیسی"},{"term":"EEG","definition":"Electroencephalogram records brain electrical activity to detect seizures and brain disorders.","category":"abbreviation","persian":"الکتروانسفالوگرام"},{"term":"EMG","definition":"Electromyography measures muscle electrical activity to diagnose neuromuscular disorders.","category":"abbreviation","persian":"الکترومیوگرافی"},{"term":"NCS","definition":"Nerve conduction studies measure nerve signal transmission speed and strength.","category":"abbreviation","persian":"مطالعات هدایت عصبی"},{"term":"PFT","definition":"Pulmonary function tests measure lung capacity and airflow to assess respiratory function.","category":"abbreviation","persian":"آزمایش‌های عملکرد ریوی"},{"term":"ABX","definition":"Antibiotics are medications that kill or inhibit bacterial growth.","category":"abbreviation","persian":"آنتی‌بیوتیک"},{"term":"NSAID","definition":"Non-steroidal anti-inflammatory drugs reduce inflammation, pain, and fever.","category":"abbreviation","persian":"داروهای ضدالتهاب غیراستروئیدی"},{"term":"PPI","definition":"Proton pump inhibitors reduce gastric acid production for ulcer and GERD treatment.","category":"abbreviation","persian":"مهارکننده‌های پمپ پروتون"},{"term":"SSRI","definition":"Selective serotonin reuptake inhibitors are antidepressants that increase serotonin levels.","category":"abbreviation","persian":"مهارکننده���های انتخابی بازجذب سروتونین"},{"term":"TCA","definition":"Tricyclic antidepressants block neurotransmitter reuptake for depression and pain treatment.","category":"abbreviation","persian":"آنتی‌دپرسان‌های سه‌حلقه‌ای"},{"term":"MAOI","definition":"Monoamine oxidase inhibitors prevent neurotransmitter breakdown to treat depression.","category":"abbreviation","persian":"مهارکننده‌های مونوآمین اکسیداز"},{"term":"ACEi","definition":"Angiotensin converting enzyme inhibitors lower blood pressure and protect the heart.","category":"abbreviation","persian":"مهارکننده‌های آنزیم تبدیل کننده آنژیوتانسین"},{"term":"ARB","definition":"Angiotensin receptor blockers lower blood pressure by blocking angiotensin II receptors.","category":"abbreviation","persian":"مسدودکننده‌های گیرنده آنژیوتانسین"},{"term":"CCB","definition":"Calcium channel blockers reduce blood pressure by blocking calcium entry into cells.","category":"abbreviation","persian":"مسدودکننده‌های کانال کلسیم"},{"term":"BB","definition":"Beta blockers reduce heart rate and blood pressure by blocking beta-adrenergic receptors.","category":"abbreviation","persian":"بتابلوکرها"},{"term":"McBurney point","definition":"Point of maximal tenderness in acute appendicitis, located one-third the distance from the anterior superior iliac spine to the umbilicus.","category":"eponym","persian":"نقطه مک برنی"},{"term":"Murphy sign","definition":"Inspiratory arrest during deep palpation of the right upper quadrant due to gallbladder inflammation.","category":"sign","persian":"علامت مورفی"},{"term":"Rovsing sign","definition":"Right lower quadrant pain elicited by palpation of the left lower quadrant in acute appendicitis.","category":"sign","persian":"علامت راوسینگ"},{"term":"Psoas sign","definition":"Right lower quadrant pain elicited by extension of the right hip, suggesting appendicitis with psoas muscle irritation.","category":"sign","persian":"علامت پسواس"},{"term":"Obturator sign","definition":"Right lower quadrant pain elicited by internal rotation of the flexed right hip, indicating appendicitis with obturator muscle irritation.","category":"sign","persian":"علامت ابتوراتور"},{"term":"Kernig sign","definition":"Inability to fully extend the knee when the hip is flexed at 90 degrees, indicating meningeal irritation.","category":"sign","persian":"علامت کرنیگ"},{"term":"Brudzinski sign","definition":"Involuntary flexion of the hips and knees when the neck is flexed, indicating meningeal irritation.","category":"sign","persian":"علامت برودزینسکی"},{"term":"Babinski sign","definition":"Dorsiflexion of the great toe with fanning of other toes when the plantar surface is stroked, indicating upper motor neuron lesion.","category":"sign","persian":"علامت بابینسکی"},{"term":"Romberg test","definition":"Test for proprioceptive dysfunction where patient stands with feet together and eyes closed, positive if increased swaying occurs.","category":"eponym","persian":"تست رومبرگ"},{"term":"Rinne test","definition":"Hearing test comparing air conduction to bone conduction using a tuning fork placed on the mastoid process then near the ear.","category":"eponym","persian":"تست رینه"},{"term":"Weber test","definition":"Hearing test using a tuning fork placed on the center of the forehead to detect unilateral hearing loss.","category":"eponym","persian":"تست وبر"},{"term":"Chvostek sign","definition":"Facial muscle contraction when the facial nerve is tapped over the parotid gland, indicating hypocalcemia.","category":"sign","persian":"علامت خووستک"},{"term":"Trousseau sign","definition":"Carpopedal spasm induced by inflating a blood pressure cuff above systolic pressure for 3 minutes, indicating hypocalcemia.","category":"sign","persian":"علامت تروسو"},{"term":"Kussmaul breathing","definition":"Deep, labored breathing pattern characterized by deep sighing respirations, typically seen in diabetic ketoacidosis.","category":"eponym","persian":"تنفس کوسمال"},{"term":"Cheyne-Stokes","definition":"Abnormal breathing pattern with periods of crescendo-decrescendo breathing alternating with apnea, often seen in heart failure or brain injury.","category":"eponym","persian":"چین-استوکس"},{"term":"Cullen sign","definition":"Bluish discoloration around the umbilicus indicating retroperitoneal hemorrhage, often seen in acute pancreatitis.","category":"sign","persian":"علامت کولن"},{"term":"Grey Turner sign","definition":"Bluish-gray discoloration of the flanks indicating retroperitoneal hemorrhage, often seen in acute pancreatitis.","category":"sign","persian":"علامت گری ترنر"},{"term":"Battle sign","definition":"Ecchymosis behind the ear over the mastoid process, indicating basilar skull fracture.","category":"sign","persian":"علامت بتل"},{"term":"Raccoon eyes","definition":"Bilateral periorbital ecchymosis without direct trauma to the eyes, indicating basilar skull fracture.","category":"sign","persian":"چشمان راکون"},{"term":"Virchow node","definition":"Enlarged left supraclavicular lymph node, often indicating gastric or other abdominal malignancy.","category":"eponym","persian":"غده ویرخو"},{"term":"Sister Mary Joseph nodule","definition":"Metastatic umbilical nodule indicating intra-abdominal malignancy, particularly gastric adenocarcinoma.","category":"eponym","persian":"ندول خواهر مری جوزف"},{"term":"Courvoisier sign","definition":"Painless enlargement of the gallbladder in the presence of jaundice, suggesting malignant biliary obstruction.","category":"sign","persian":"علامت کورویزیه"},{"term":"Lhermitte sign","definition":"Electric shock-like sensation radiating down the spine when the neck is flexed, indicating cervical spinal cord pathology.","category":"sign","persian":"علامت لرمیت"},{"term":"Phalen test","definition":"Wrist flexion test where symptoms of carpal tunnel syndrome are reproduced by holding wrists in flexion for 60 seconds.","category":"eponym","persian":"تست فالن"},{"term":"Tinel sign","definition":"Tingling sensation in the distribution of the median nerve when the wrist is percussed over the carpal tunnel.","category":"sign","persian":"علامت تینل"},{"term":"Finkelstein test","definition":"Test for de Quervain tenosynovitis performed by grasping the thumb and deviating the wrist toward the ulna.","category":"eponym","persian":"تست فینکلشتاین"},{"term":"McMurray test","definition":"Test for meniscal tears performed by rotating the tibia while flexing and extending the knee.","category":"eponym","persian":"تست مک موری"},{"term":"Lachman test","definition":"Test for anterior cruciate ligament integrity performed by pulling the tibia forward while the knee is flexed at 30 degrees.","category":"eponym","persian":"تست لاخمان"},{"term":"Anterior drawer","definition":"Test for anterior cruciate ligament rupture performed by pulling the tibia forward while the knee is flexed at 90 degrees.","category":"eponym","persian":"کشوی قدامی"},{"term":"Posterior drawer","definition":"Test for posterior cruciate ligament rupture performed by pushing the tibia backward while the knee is flexed at 90 degrees.","category":"eponym","persian":"کشوی خلفی"},{"term":"Thompson test","definition":"Test for Achilles tendon rupture performed by squeezing the calf muscle and observing for plantar flexion of the foot.","category":"eponym","persian":"تست تامپسون"},{"term":"Allen test","definition":"Test for radial and ulnar artery patency performed by compressing both arteries and releasing one to assess collateral circulation.","category":"eponym","persian":"تست آلن"},{"term":"Ortolani test","definition":"Test for developmental dysplasia of the hip in infants performed by reducing a dislocated hip with abduction and anterior pressure.","category":"eponym","persian":"تست ارتولانی"},{"term":"Barlow test","definition":"Test for developmental dysplasia of the hip in infants performed by attempting to dislocate the hip with adduction and posterior pressure.","category":"eponym","persian":"تست بارلو"},{"term":"Trendelenburg sign","definition":"Hip drop on the contralateral side when standing on one leg, indicating weakness of the hip abductor muscles.","category":"sign","persian":"علامت ترندلنبورگ"},{"term":"Nikolsky sign","definition":"Separation of the epidermis with gentle lateral pressure, indicating intraepidermal blistering disorders like pemphigus.","category":"sign","persian":"علامت نیکولسکی"},{"term":"Auspitz sign","definition":"Pinpoint bleeding when psoriatic scales are removed, characteristic of psoriasis.","category":"sign","persian":"علامت آؤسپیتز"},{"term":"Koebner phenomenon","definition":"Appearance of skin lesions at sites of trauma in patients with certain dermatologic conditions like psoriasis.","category":"eponym","persian":"پدیده کوبنر"},{"term":"Darier sign","definition":"Urtication and erythema when a mastocytoma or urticaria pigmentosa lesion is rubbed, indicating mast cell degranulation.","category":"sign","persian":"علامت داریه"},{"term":"Janeway lesions","definition":"Non-tender erythematous macules on the palms and soles, pathognomonic for infective endocarditis.","category":"eponym","persian":"ضایعات جین وی"},{"term":"Osler nodes","definition":"Tender subcutaneous nodules on the fingers and toes, associated with infective endocarditis.","category":"eponym","persian":"ندولهای اسلر"},{"term":"Roth spots","definition":"Retinal hemorrhages with white or pale centers, classically associated with infective endocarditis but seen in other conditions.","category":"eponym","persian":"لکه های رات"},{"term":"Splinter hemorrhages","definition":"Longitudinal red-brown streaks under the fingernails, associated with infective endocarditis and other systemic conditions.","category":"sign","persian":"خونریزی های اسپلینتر"},{"term":"Kehr sign","definition":"Left shoulder pain caused by diaphragmatic irritation from splenic rupture or other intraperitoneal bleeding.","category":"sign","persian":"علامت کهر"},{"term":"Chandelier sign","definition":"Severe pelvic pain elicited during bimanual examination causing the patient to jump, suggesting pelvic inflammatory disease.","category":"sign","persian":"علامت لوستر"},{"term":"Chadwick sign","definition":"Bluish discoloration of the cervix and vaginal mucosa due to venous congestion, an early sign of pregnancy.","category":"sign","persian":"علامت چدویک"},{"term":"Hegar sign","definition":"Softening of the lower uterine segment palpable on bimanual examination, an early sign of pregnancy.","category":"sign","persian":"علامت هگار"},{"term":"Apley test","definition":"Test for meniscal tears performed by applying compression and rotation to the knee while the patient is prone.","category":"eponym","persian":"تست اپلی"},{"term":"Spurling test","definition":"Test for cervical radiculopathy performed by extending and laterally flexing the neck while applying axial compression.","category":"eponym","persian":"تست اسپورلینگ"},{"term":"Lasegue sign","definition":"Reproduction of sciatica pain when the straight leg is raised, indicating nerve root irritation or disc herniation.","category":"sign","persian":"علامت لاسگ"},{"term":"Patrick test","definition":"Test for hip pathology performed by placing the ankle on the opposite knee and applying downward pressure to the flexed knee.","category":"eponym","persian":"تست پاتریک"},{"term":"Hawkins test","definition":"Test for shoulder impingement performed by flexing the arm to 90 degrees and internally rotating the shoulder.","category":"eponym","persian":"تست هاوکینز"},{"term":"Neer test","definition":"Test for shoulder impingement performed by forcibly elevating the arm in the scapular plane while stabilizing the scapula.","category":"eponym","persian":"تست نیر"},{"term":"Drop arm test","definition":"Test for rotator cuff tear where the patient cannot slowly lower the arm from full abduction to the side.","category":"eponym","persian":"تست افتادن بازو"},{"term":"Speed test","definition":"Test for bicipital tendonitis performed by having the patient flex the shoulder against resistance with the elbow extended.","category":"eponym","persian":"تست سرعت"},{"term":"Empty can test","definition":"Test for supraspinatus tendon integrity performed by abducting the arms to 90 degrees in the scapular plane with thumbs down.","category":"eponym","persian":"تست قوطی خالی"},{"term":"Apprehension test","definition":"Test for shoulder instability where anterior pressure on the posterior humeral head while the arm is abducted and externally rotated causes apprehension.","category":"eponym","persian":"تست هراس"},{"term":"Hoffmann sign","definition":"Reflex flexion of the thumb and index finger when the distal phalanx of the middle finger is flicked, indicating upper motor neuron lesion.","category":"sign","persian":"علامت هافمن"},{"term":"Clonus","definition":"Rhythmic muscular contractions induced by sudden passive stretching of a muscle, indicating upper motor neuron lesion.","category":"sign","persian":"کلونوس"},{"term":"Argyll Robertson pupil","definition":"Pupils that accommodate but do not react to light, classically associated with neurosyphilis.","category":"eponym","persian":"مردمک آرگیل رابرتسون"},{"term":"Marcus Gunn pupil","definition":"Relative afferent pupillary defect where the pupil dilates when light is swung from the normal to the affected eye.","category":"eponym","persian":"مردمک مارکوس گان"},{"term":"Horner syndrome","definition":"Constellation of ptosis, miosis, and anhidrosis due to sympathetic nerve pathway interruption.","category":"eponym","persian":"سندرم هورنر"},{"term":"Bell palsy","definition":"Acute unilateral facial nerve paralysis of unknown etiology causing facial drooping and inability to close the eye.","category":"eponym","persian":"فلج بل"},{"term":"Hutchinson sign","definition":"Vesicular rash on the tip of the nose indicating nasociliary nerve involvement in herpes zoster ophthalmicus.","category":"sign","persian":"علامت هاچینسون"},{"term":"Prehn sign","definition":"Relief of testicular pain with elevation of the testicle, suggesting epididymitis rather than testicular torsion.","category":"sign","persian":"علامت پرن"},{"term":"Cremasteric reflex","definition":"Elevation of the testicle when the inner thigh is stroked, often absent in testicular torsion.","category":"sign","persian":"رفلکس کرماستریک"},{"term":"Romaña sign","definition":"Unilateral painless eyelid swelling that may be the first sign of acute Chagas disease.","category":"sign","persian":"علامت رومانا"},{"term":"Koplik spots","definition":"Small white spots with bluish-white centers on the buccal mucosa, pathognomonic for measles.","category":"eponym","persian":"لکه های کوپلیک"},{"term":"Kayser-Fleischer rings","definition":"Golden-brown rings in Descemet membrane of the cornea, pathognomonic for Wilson disease.","category":"eponym","persian":"حلقه های کایزر-فلایشر"},{"term":"Xanthelasma","definition":"Yellowish cholesterol deposits in the eyelids, often associated with hypercholesterolemia.","category":"sign","persian":"زانتلاسما"},{"term":"Arcus senilis","definition":"Grayish-white arc or ring around the corneal limbus, associated with aging or hypercholesterolemia in younger patients.","category":"sign","persian":"قوس پیری"},{"term":"Café-au-lait spots","definition":"Light brown macules that may indicate neurofibromatosis when six or more are present measuring >5mm in children.","category":"sign","persian":"لکه های کافه او له"},{"term":"Ash leaf spots","definition":"Hypopigmented macules that are pathognomonic for tuberous sclerosis complex.","category":"sign","persian":"لکه های برگ توس"},{"term":"Shagreen patch","definition":"Thickened, leathery, skin-colored patch on the back, pathognomonic for tuberous sclerosis complex.","category":"sign","persian":"پچ شاگرین"},{"term":"Gottron papules","definition":"Erythematous papules over the metacarpophalangeal and interphalangeal joints, pathognomonic for dermatomyositis.","category":"eponym","persian":"پاپولهای گاترون"},{"term":"Heliotrope rash","definition":"Purplish erythematous rash around the eyes, characteristic of dermatomyositis.","category":"sign","persian":"راش هلیوتروپ"},{"term":"Shawl sign","definition":"Erythematous rash over the shoulders and upper back, characteristic of dermatomyositis.","category":"sign","persian":"علامت شال"},{"term":"Gottron sign","definition":"Erythematous scaling patches over bony prominences, characteristic of dermatomyositis.","category":"sign","persian":"علامت گاترون"},{"term":"V-sign","definition":"Erythematous rash in a V-shape over the anterior neck and chest, characteristic of dermatomyositis.","category":"sign","persian":"علامت V"},{"term":"Mechanic's hands","definition":"Hyperkeratotic, fissured skin on the hands resembling a mechanic's hands, seen in dermatomyositis and antisynthetase syndrome.","category":"sign","persian":"دستهای مکانیک"},{"term":"Raynaud phenomenon","definition":"Episodic vasospasm of fingers and toes causing color changes (white, blue, red) in response to cold or stress.","category":"eponym","persian":"پدیده رینود"},{"term":"Malar rash","definition":"Fixed erythematous rash over the malar eminences and nasal bridge, characteristic of systemic lupus erythematosus.","category":"sign","persian":"راش مالار"},{"term":"Discoid rash","definition":"Erythematous raised patches with adherent keratotic scaling and follicular plugging, seen in lupus.","category":"sign","persian":"راش دیسکوئید"},{"term":"Livedo reticularis","definition":"Mottled, net-like pattern of the skin due to vascular pathology, associated with antiphospholipid syndrome and other conditions.","category":"sign","persian":"لیودو رتیکولاریس"},{"term":"Peau d'orange","definition":"Skin texture resembling an orange peel due to lymphatic obstruction, classically seen in inflammatory breast cancer.","category":"sign","persian":"پوست پرتقال"},{"term":"Glasgow Coma Scale","definition":"A 15-point scale assessing eye opening (4), verbal response (5), and motor response (6) to evaluate level of consciousness in neurological patients.","category":"scale","persian":"مقیاس کومای گلاسکو"},{"term":"APGAR Score","definition":"A 10-point scale evaluating newborn condition at 1 and 5 minutes after birth, assessing appearance, pulse, grimace, activity, and respiratory effort.","category":"scale","persian":"امتیاز آپگار"},{"term":"Wells DVT Score","definition":"A clinical prediction rule for deep vein thrombosis probability using clinical features, with scores ≥2 indicating high probability.","category":"scale","persian":"امتیاز ولز برای ترomboembolisme وریدی عمقی"},{"term":"Wells PE Score","definition":"A clinical prediction rule for pulmonary embolism probability incorporating clinical signs, symptoms, and risk factors.","category":"scale","persian":"امتیاز ولز برای آمبولی ریوی"},{"term":"Geneva Score","definition":"A clinical prediction rule for pulmonary embolism that uses clinical variables and arterial blood gas analysis to assess PE probability.","category":"scale","persian":"امتیاز ژنو"},{"term":"CURB-65","definition":"A severity score for community-acquired pneumonia using confusion, urea >7mmol/L, respiratory rate ≥30, blood pressure <90/60, age ≥65.","category":"scale","persian":"کورب-۶۵"},{"term":"CHADS2-VASc","definition":"A stroke risk stratification tool for atrial fibrillation patients incorporating congestive heart failure, hypertension, age, diabetes, stroke, vascular disease, and sex.","category":"scale","persian":"چدز۲-واسک"},{"term":"HAS-BLED","definition":"A bleeding risk assessment tool for anticoagulated patients considering hypertension, abnormal renal/liver function, stroke, bleeding, labile INR, elderly, drugs/alcohol.","category":"scale","persian":"هاز-بلد"},{"term":"MELD Score","definition":"A scoring system for liver disease severity using bilirubin, creatinine, and INR to prioritize liver transplant candidates.","category":"scale","persian":"امتیاز ملد"},{"term":"Child-Pugh Score","definition":"A classification system for liver cirrhosis severity using albumin, bilirubin, PT/INR, ascites, and encephalopathy (Classes A, B, C).","category":"scale","persian":"امتیاز چایلد-پیو"},{"term":"Ranson Criteria","definition":"A prognostic scoring system for acute pancreatitis using 11 clinical and laboratory parameters within first 48 hours.","category":"scale","persian":"معیارهای رانسون"},{"term":"APACHE II","definition":"A severity classification system using 12 physiological variables, age, and chronic health status to predict ICU mortality risk.","category":"scale","persian":"آپاچی دو"},{"term":"SOFA Score","definition":"Sequential Organ Failure Assessment score evaluating dysfunction of respiratory, coagulation, liver, cardiovascular, central nervous system, and renal systems.","category":"scale","persian":"امتیاز سوفا"},{"term":"qSOFA","definition":"Quick SOFA score using altered mental status, systolic BP ≤100mmHg, and respiratory rate ≥22 to identify sepsis risk.","category":"scale","persian":"کیو-سوفا"},{"term":"Bishop Score","definition":"A scoring system to assess cervical readiness for labor induction using dilation, effacement, station, consistency, and position.","category":"scale","persian":"امتیاز بیشاپ"},{"term":"Mallampati Classification","definition":"A 4-class system assessing airway difficulty by visualizing pharyngeal structures with mouth wide open and tongue protruded.","category":"scale","persian":"طبقه‌بندی مالامپاتی"},{"term":"ASA Physical Status Classification","definition":"A 6-category system (I-VI) assessing perioperative risk based on patient's physical condition and systemic disease severity.","category":"scale","persian":"طبقه‌بندی وضعیت فیزیکی ASA"},{"term":"TNM Staging","definition":"A cancer staging system describing tumor size (T), lymph node involvement (N), and distant metastasis (M) status.","category":"scale","persian":"مرحله‌بندی TNM"},{"term":"Ann Arbor Staging","definition":"A 4-stage system for Hodgkin and non-Hodgkin lymphomas based on number and location of involved lymph node regions.","category":"scale","persian":"مرحله‌بندی آن آربر"},{"term":"Breslow Depth","definition":"A measurement in millimeters of melanoma thickness from granular layer to deepest tumor invasion point, used for prognosis.","category":"scale","persian":"عمق برزلو"},{"term":"Clark Level","definition":"A 5-level histologic classification of melanoma invasion depth through skin layers (epidermis through subcutaneous fat).","category":"scale","persian":"سطح کلارک"},{"term":"NYHA Classification","definition":"A 4-class functional classification of heart failure symptoms based on physical activity limitations and symptom severity.","category":"scale","persian":"طبقه‌بندی NYHA"},{"term":"CCS Angina Classification","definition":"Canadian Cardiovascular Society 4-class system grading angina severity based on physical activity limitation and symptom triggers.","category":"scale","persian":"طبقه‌بندی آنژین CCS"},{"term":"Killip Classification","definition":"A 4-class system assessing heart failure severity and prognosis following acute myocardial infarction based on clinical findings.","category":"scale","persian":"طبقه‌بندی کیلیپ"},{"term":"TIMI Risk Score","definition":"Thrombolysis in Myocardial Infarction risk stratification tool for acute coronary syndrome patients using clinical and laboratory variables.","category":"scale","persian":"امتیاز خطر TIMI"},{"term":"HEART Score","definition":"A 5-component scoring system (History, ECG, Age, Risk factors, Troponin) for chest pain risk stratification in emergency departments.","category":"scale","persian":"امتیاز هارت"},{"term":"Ottawa Ankle Rules","definition":"Clinical decision rules using specific examination findings to determine need for ankle and foot radiographs following trauma.","category":"scale","persian":"قوانین مچ پای اتاوا"},{"term":"Ottawa Knee Rules","definition":"Clinical decision rules using age >55, isolated patella tenderness, fibular head tenderness, or inability to flex 90° to guide knee X-rays.","category":"scale","persian":"قوانین زانوی اتاوا"},{"term":"Canadian C-Spine Rules","definition":"Clinical criteria using high-risk factors, low-risk factors, and neck rotation ability to determine need for cervical spine imaging.","category":"scale","persian":"قوانین ستون فقرات گردنی کانادا"},{"term":"NEXUS Criteria","definition":"Five clinical criteria (midline tenderness, altered mental status, intoxication, neurologic deficit, distracting injury) for C-spine clearance.","category":"scale","persian":"معیارهای نکسوس"},{"term":"PECARN Rules","definition":"Pediatric Emergency Care Applied Research Network rules for determining head CT necessity in children with head trauma.","category":"scale","persian":"قوانین پکارن"},{"term":"NIH Stroke Scale","definition":"A 15-item assessment tool quantifying stroke severity by evaluating neurological function including consciousness, vision, motor, and language.","category":"scale","persian":"مقیاس سکته مغزی NIH"},{"term":"Hunt and Hess Scale","definition":"A 5-grade classification system for subarachnoid hemorrhage severity based on clinical condition and neurological status.","category":"scale","persian":"مقیاس هانت و هس"},{"term":"Fisher Grade","definition":"A 4-grade CT-based classification system for subarachnoid hemorrhage describing blood distribution pattern and vasospasm risk.","category":"scale","persian":"درجه فیشر"},{"term":"Modified Rankin Scale","definition":"A 7-point disability scale measuring degree of independence in daily activities following stroke (0=no symptoms, 6=death).","category":"scale","persian":"مقیاس رانکین اصلاح شده"},{"term":"PHQ-9","definition":"Patient Health Questionnaire-9 is a 9-question screening tool for depression severity using DSM-IV criteria over past 2 weeks.","category":"scale","persian":"پرسشنامه سلامت بیمار-۹"},{"term":"GAD-7","definition":"Generalized Anxiety Disorder-7 is a 7-question screening tool measuring anxiety symptom severity over the past 2 weeks.","category":"scale","persian":"اختلال اضطراب عمومی-۷"},{"term":"CAGE Questionnaire","definition":"A 4-question screening tool for alcohol problems using Cut down, Annoyed, Guilty, Eye-opener questions.","category":"scale","persian":"پرسشنامه کیج"},{"term":"AUDIT-C","definition":"Alcohol Use Disorders Identification Test-Consumption is a 3-question screening tool for harmful alcohol use patterns.","category":"scale","persian":"تست شناسایی اختلالات مصرف الکل-مصرف"},{"term":"Edinburgh Postnatal Depression Scale","definition":"A 10-item self-assessment questionnaire screening for postnatal depression in mothers during the first year after childbirth.","category":"scale","persian":"مقیاس افسردگی پس از زایمان ادینبورگ"},{"term":"MMSE","definition":"Mini-Mental State Examination is a 30-point questionnaire screening for cognitive impairment and dementia severity.","category":"scale","persian":"آزمون کوتاه وضعیت ذهنی"},{"term":"MoCA","definition":"Montreal Cognitive Assessment is a 30-point screening tool for mild cognitive impairment covering multiple cognitive domains.","category":"scale","persian":"ارزیابی شناختی مونترال"},{"term":"Braden Scale","definition":"A 6-subscale assessment tool predicting pressure ulcer risk by evaluating sensory perception, moisture, activity, mobility, nutrition, and friction.","category":"scale","persian":"مقیاس بریدن"},{"term":"Visual Analog Scale","definition":"A 10cm horizontal line with anchors at each end allowing patients to mark pain intensity from no pain to worst pain.","category":"scale","persian":"مقیاس آنالوگ بصری"},{"term":"Wong-Baker FACES Scale","definition":"A pictorial pain assessment scale using 6 facial expressions ranging from smiling (no pain) to crying (worst pain).","category":"scale","persian":"مقیاس چهره‌های وونگ-بیکر"},{"term":"FLACC Scale","definition":"Face, Legs, Activity, Cry, Consolability scale for assessing pain in children unable to self-report, scoring 0-10.","category":"scale","persian":"مقیاس فلک"},{"term":"Centor Criteria","definition":"A 4-point clinical prediction rule for streptococcal pharyngitis using fever, tonsillar exudates, tender lymph nodes, and absence of cough.","category":"scale","persian":"معیارهای سنتور"},{"term":"SNOT-22","definition":"Sino-Nasal Outcome Test-22 is a quality of life questionnaire measuring symptom severity in chronic rhinosinusitis patients.","category":"scale","persian":"تست نتایج سینو-ناسال-۲۲"},{"term":"IPSS","definition":"International Prostate Symptom Score assesses lower urinary tract symptoms severity using 7 questions about urination difficulties.","category":"scale","persian":"امتیاز بین‌المللی علائم پروستات"},{"term":"Clark Criteria","definition":"Clinical and histologic criteria for diagnosing atypical moles (dysplastic nevi) as melanoma precursors using specific morphologic features.","category":"scale","persian":"معیارهای کلارک"},{"term":"Richmond Agitation-Sedation Scale","definition":"RASS is a 10-point scale ranging from +4 (combative) to -5 (unarousable) assessing sedation and agitation levels in ICU patients.","category":"scale","persian":"مقیاس تهییج-آرام‌بخشی ریچموند"},{"term":"Confusion Assessment Method","definition":"CAM is a diagnostic algorithm for delirium using acute onset, inattention, disorganized thinking, and altered consciousness criteria.","category":"scale","persian":"روش ارزیابی سردرگمی"},{"term":"Rockall Score","definition":"A risk stratification tool for upper GI bleeding using age, comorbidities, clinical findings, and endoscopic features to predict mortality.","category":"scale","persian":"امتیاز راکال"},{"term":"Glasgow-Blatchford Score","definition":"A pre-endoscopy risk assessment tool for upper GI bleeding using clinical and laboratory parameters to predict intervention need.","category":"scale","persian":"امتیاز گلاسکو-بلچفورد"},{"term":"STOP-BANG Questionnaire","definition":"An 8-item screening tool for obstructive sleep apnea using Snoring, Tiredness, Observed apnea, Pressure, BMI, Age, Neck, Gender.","category":"scale","persian":"پرسشنامه استاپ-بنگ"},{"term":"Epworth Sleepiness Scale","definition":"An 8-question self-administered questionnaire measuring daytime sleepiness by rating likelihood of dozing in various situations.","category":"scale","persian":"مقیاس خواب‌آلودگی اپورث"},{"term":"Berlin Questionnaire","definition":"A screening tool for sleep apnea risk using 3 categories: snoring behavior, daytime sleepiness, and obesity/hypertension history.","category":"scale","persian":"پرسشنامه برلین"},{"term":"Alvarado Score","definition":"A 10-point clinical scoring system for acute appendicitis diagnosis using symptoms, signs, and laboratory findings.","category":"scale","persian":"امتیاز آلوارادو"},{"term":"PERC Rule","definition":"Pulmonary Embolism Rule-out Criteria using 8 clinical variables to identify low-risk patients who don't need D-dimer testing.","category":"scale","persian":"قانون رد آمبولی ریوی"},{"term":"PESI Score","definition":"Pulmonary Embolism Severity Index stratifies PE patients into risk classes using clinical parameters to guide treatment decisions.","category":"scale","persian":"شاخص شدت آمبولی ریوی"},{"term":"GRACE Score","definition":"Global Registry of Acute Coronary Events score predicting in-hospital and 6-month mortality risk in ACS patients.","category":"scale","persian":"امتیاز گریس"},{"term":"CRUSADE Score","definition":"A bleeding risk assessment tool for non-ST elevation ACS patients receiving antithrombotic therapy using 8 clinical variables.","category":"scale","persian":"امتیاز کروسید"},{"term":"ABCD2 Score","definition":"A stroke risk stratification tool for TIA patients using Age, Blood pressure, Clinical features, Duration, and Diabetes.","category":"scale","persian":"امتیاز ABCD2"},{"term":"CHA2DS2-VASc","definition":"An updated stroke risk assessment tool for atrial fibrillation adding vascular disease and expanding age/sex criteria from CHADS2.","category":"scale","persian":"چا۲دز۲-واسک"},{"term":"HASBLED Score","definition":"A bleeding risk calculator for anticoagulated patients with atrial fibrillation using hypertension, abnormal function, stroke, bleeding, labile INRs, elderly, drugs.","category":"scale","persian":"امتیاز هازبلد"},{"term":"Circle of Willis","definition":"Arterial circle at the base of the brain formed by anterior and posterior cerebral arteries and communicating arteries, providing collateral circulation.","category":"anatomy","persian":"دایره ویلیس"},{"term":"Cauda equina","definition":"Bundle of spinal nerve roots extending below the L1-L2 vertebral level, resembling a horse's tail.","category":"anatomy","persian":"دم اسبی"},{"term":"Brachial plexus","definition":"Network of nerve roots from C5-T1 that innervates the upper extremity, forming lateral, posterior, and medial cords.","category":"anatomy","persian":"شبکه عصبی بازویی"},{"term":"Celiac trunk","definition":"First major branch of the abdominal aorta that supplies the foregut structures including stomach, liver, and spleen.","category":"anatomy","persian":"تنه سلیاک"},{"term":"Portal triad","definition":"Hepatic artery, portal vein, and bile duct found within the hepatoduodenal ligament at each corner of liver lobules.","category":"anatomy","persian":"سه‌گانه پورتال"},{"term":"Calot triangle","definition":"Anatomical triangle bounded by the liver edge, cystic artery, and common hepatic duct, important landmark in cholecystectomy.","category":"anatomy","persian":"مثلث کالوت"},{"term":"Inguinal canal","definition":"Oblique passage through the anterior abdominal wall that transmits the spermatic cord in males and round ligament in females.","category":"anatomy","persian":"کانال اینگوینال"},{"term":"Femoral triangle","definition":"Triangular space in the upper thigh bounded by the inguinal ligament, sartorius, and adductor longus muscles.","category":"anatomy","persian":"مثلث رانی"},{"term":"Carpal tunnel","definition":"Narrow passageway on the palmar side of the wrist bounded by carpal bones and flexor retinaculum, containing median nerve and flexor tendons.","category":"anatomy","persian":"تونل کارپال"},{"term":"Cubital fossa","definition":"Triangular depression on the anterior aspect of the elbow containing the brachial artery, median nerve, and biceps tendon.","category":"anatomy","persian":"حفره کوبیتال"},{"term":"Popliteal fossa","definition":"Diamond-shaped space behind the knee containing popliteal vessels, tibial and common fibular nerves.","category":"anatomy","persian":"حفره پاپلیتئال"},{"term":"Anatomical snuffbox","definition":"Triangular depression on the lateral wrist bounded by extensor pollicis brevis, extensor pollicis longus, and abductor pollicis longus tendons.","category":"anatomy","persian":"قوطی انفیه آناتومیک"},{"term":"Dermatomes","definition":"Areas of skin innervated by sensory nerve fibers from a single spinal nerve root.","category":"anatomy","persian":"درماتوم‌ها"},{"term":"Myotomes","definition":"Groups of muscles innervated by motor nerve fibers from a single spinal nerve root.","category":"anatomy","persian":"میوتوم‌ها"},{"term":"Foramen magnum","definition":"Large oval opening at the base of the occipital bone through which the medulla oblongata connects to the spinal cord.","category":"anatomy","persian":"سوراخ بزرگ"},{"term":"Foramen ovale","definition":"Opening in the sphenoid bone that transmits the mandibular division of the trigeminal nerve.","category":"anatomy","persian":"سوراخ بیضی"},{"term":"Triangle of Petit","definition":"Inferior lumbar triangle bounded by the iliac crest, external oblique, and latissimus dorsi muscles, a potential site for hernia.","category":"anatomy","persian":"مثلث پتی"},{"term":"Statins","definition":"HMG-CoA reductase inhibitors that lower cholesterol synthesis, including atorvastatin and simvastatin.","category":"drug","persian":"استاتین‌ها"},{"term":"Fibrates","definition":"PPAR-alpha agonists that lower triglycerides and raise HDL, including gemfibrozil and fenofibrate.","category":"drug","persian":"فیبرات‌ها"},{"term":"ACE inhibitors","definition":"Angiotensin-converting enzyme inhibitors that block conversion of angiotensin I to II, including lisinopril and enalapril.","category":"drug","persian":"مهارکننده‌های آنزیم تبدیل کننده آنژیوتانسین"},{"term":"ARBs","definition":"Angiotensin receptor blockers that antagonize angiotensin II at AT1 receptors, including losartan and valsartan.","category":"drug","persian":"مسدودکننده‌های گیرنده آنژیوتانسین"},{"term":"Thiazide diuretics","definition":"Diuretics that inhibit sodium-chloride co-transporter in distal convoluted tubule, including hydrochlorothiazide and chlorthalidone.","category":"drug","persian":"ادرارآورهای تیازیدی"},{"term":"Loop diuretics","definition":"Diuretics that inhibit Na-K-2Cl co-transporter in ascending limb of loop of Henle, including furosemide and bumetanide.","category":"drug","persian":"ادرارآورهای حلقوی"},{"term":"Potassium-sparing diuretics","definition":"Diuretics that block sodium channels or mineralocorticoid receptors in collecting duct, including spironolactone and amiloride.","category":"drug","persian":"ادرارآورهای حافظ پتاسیم"},{"term":"Beta-blockers","definition":"Beta-adrenergic receptor antagonists that reduce heart rate and blood pressure, including metoprolol and propranolol.","category":"drug","persian":"مسدودکننده‌های بتا"},{"term":"Calcium channel blockers","definition":"Medications that block L-type calcium channels in cardiac and smooth muscle, including amlodipine and verapamil.","category":"drug","persian":"مسدودکننده‌های کانال کلسیم"},{"term":"Nitrates","definition":"Vasodilators that release nitric oxide and reduce preload, including nitroglycerin and isosorbide mononitrate.","category":"drug","persian":"نیترات‌ها"},{"term":"Antiplatelets","definition":"Medications that inhibit platelet aggregation, including aspirin and clopidogrel.","category":"drug","persian":"ضد پلاکتی‌ها"},{"term":"Anticoagulants","definition":"Medications that prevent blood clot formation by inhibiting coagulation cascade, including warfarin and heparin.","category":"drug","persian":"ضد انعقادی‌ها"},{"term":"Thrombolytics","definition":"Medications that dissolve existing blood clots by activating plasmin, including alteplase and streptokinase.","category":"drug","persian":"ترومبولیتیک‌ها"},{"term":"Proton pump inhibitors","definition":"Medications that irreversibly block H+/K+-ATPase in parietal cells, including omeprazole and pantoprazole.","category":"drug","persian":"مهارکننده‌های پمپ پروتون"},{"term":"H2 receptor blockers","definition":"Medications that competitively block histamine H2 receptors in parietal cells, including ranitidine and famotidine.","category":"drug","persian":"مسدودکننده‌های گیرنده H2"},{"term":"SSRIs","definition":"Selective serotonin reuptake inhibitors that increase synaptic serotonin, including fluoxetine and sertraline.","category":"drug","persian":"مهارکننده‌های انتخابی بازجذب سروتونین"},{"term":"SNRIs","definition":"Serotonin-norepinephrine reuptake inhibitors that block reuptake of both neurotransmitters, including venlafaxine and duloxetine.","category":"drug","persian":"مهارکننده‌های بازجذب سروتونین-نورپی‌نفرین"},{"term":"Tricyclic antidepressants","definition":"Antidepressants that block reuptake of serotonin and norepinephrine with anticholinergic effects, including amitriptyline and nortriptyline.","category":"drug","persian":"ضد افسردگی‌های سه حلقه‌ای"},{"term":"MAO inhibitors","definition":"Monoamine oxidase inhibitors that prevent breakdown of serotonin, norepinephrine, and dopamine, including phenelzine and tranylcypromine.","category":"drug","persian":"مهارکننده‌های مونوآمین اکسیداز"},{"term":"Benzodiazepines","definition":"GABA-A receptor agonists with anxiolytic and sedative effects, including lorazepam and diazepam.","category":"drug","persian":"بنزودیازپین‌ها"},{"term":"Typical antipsychotics","definition":"First-generation antipsychotics that primarily block dopamine D2 receptors, including haloperidol and chlorpromazine.","category":"drug","persian":"آنتی‌سایکوتیک‌های معمولی"},{"term":"Atypical antipsychotics","definition":"Second-generation antipsychotics that block dopamine and serotonin receptors with fewer extrapyramidal effects, including risperidone and olanzapine.","category":"drug","persian":"آنتی‌سایکوتیک‌های غیرمعمول"},{"term":"Mood stabilizers","definition":"Medications used to treat bipolar disorder and stabilize mood swings, including lithium and valproate.","category":"drug","persian":"تثبیت‌کننده‌های خلق"},{"term":"Opioids","definition":"Medications that bind to opioid receptors for analgesia and euphoria, including morphine and fentanyl.","category":"drug","persian":"مواد افیونی"},{"term":"NSAIDs","definition":"Non-steroidal anti-inflammatory drugs that inhibit cyclooxygenase enzymes, including ibuprofen and naproxen.","category":"drug","persian":"داروهای ضد التهاب غیراستروئیدی"},{"term":"DMARDs","definition":"Disease-modifying antirheumatic drugs that slow joint damage progression, including methotrexate and sulfasalazine.","category":"drug","persian":"داروهای ضد روماتیسم تغییردهنده سیر بیماری"},{"term":"Biologics","definition":"Targeted immunotherapy agents that block specific inflammatory pathways, including adalimumab and etanercept.","category":"drug","persian":"بیولوژیک‌ها"},{"term":"Rapid-acting insulin","definition":"Fast-onset insulin analogs with peak action in 1-3 hours, including insulin lispro and aspart.","category":"drug","persian":"انسولین سریع‌الاثر"},{"term":"Long-acting insulin","definition":"Extended-duration insulin with minimal peak providing basal coverage, including insulin glargine and detemir.","category":"drug","persian":"انسولین طولانی‌الاثر"},{"term":"Sulfonylureas","definition":"Antidiabetic agents that stimulate insulin release by closing ATP-sensitive potassium channels, including glyburide and glipizide.","category":"drug","persian":"سولفونیل‌اوره‌ها"},{"term":"Metformin","definition":"Biguanide antidiabetic medication that decreases hepatic glucose production and improves insulin sensitivity.","category":"drug","persian":"متفورمین"},{"term":"GLP-1 receptor agonists","definition":"Incretin mimetics that enhance glucose-dependent insulin secretion and slow gastric emptying, including exenatide and liraglutide.","category":"drug","persian":"آگونیست‌های گیرنده GLP-1"},{"term":"SGLT2 inhibitors","definition":"Antidiabetic agents that block glucose reabsorption in proximal renal tubules, including empagliflozin and canagliflozin.","category":"drug","persian":"مهارکننده‌های SGLT2"},{"term":"Levothyroxine","definition":"Synthetic thyroid hormone replacement therapy identical to endogenous T4 used for hypothyroidism.","category":"drug","persian":"لووتیروکسین"},{"term":"Corticosteroids","definition":"Anti-inflammatory hormones that suppress immune response and inflammation, including prednisone and hydrocortisone.","category":"drug","persian":"کورتیکواستروئیدها"},{"term":"Beta-2 agonists","definition":"Bronchodilators that stimulate beta-2 adrenergic receptors causing smooth muscle relaxation, including albuterol and formoterol.","category":"drug","persian":"آگونیست‌های بتا-2"},{"term":"Inhaled corticosteroids","definition":"Anti-inflammatory medications delivered directly to airways for asthma control, including fluticasone and budesonide.","category":"drug","persian":"کورتیکواستروئیدهای استنشاقی"},{"term":"Aminoglycosides","definition":"Bactericidal antibiotics that inhibit protein synthesis by binding 30S ribosomal subunit, including gentamicin and amikacin.","category":"drug","persian":"آمینوگلیکوزیدها"},{"term":"Fluoroquinolones","definition":"Broad-spectrum antibiotics that inhibit DNA gyrase and topoisomerase IV, including ciprofloxacin and levofloxacin.","category":"drug","persian":"فلوروکینولون‌ها"},{"term":"Cephalosporins","definition":"Beta-lactam antibiotics classified by generations with broad-spectrum activity, including cephalexin and ceftriaxone.","category":"drug","persian":"سفالوسپورین‌ها"},{"term":"Penicillins","definition":"Beta-lactam antibiotics that inhibit cell wall synthesis by binding penicillin-binding proteins, including amoxicillin and penicillin G.","category":"drug","persian":"پنی‌سیلین‌ها"},{"term":"Macrolides","definition":"Protein synthesis inhibitors that bind 50S ribosomal subunit, including azithromycin and clarithromycin.","category":"drug","persian":"ماکرولیدها"},{"term":"Tetracyclines","definition":"Bacteriostatic antibiotics that inhibit protein synthesis at 30S ribosomal subunit, including doxycycline and minocycline.","category":"drug","persian":"تتراسایکلین‌ها"},{"term":"Carbapenems","definition":"Broad-spectrum beta-lactam antibiotics resistant to most beta-lactamases, including meropenem and imipenem.","category":"drug","persian":"کاربا پنم‌ها"},{"term":"Vancomycin","definition":"Glycopeptide antibiotic that inhibits cell wall synthesis by binding D-alanine-D-alanine peptide precursors.","category":"drug","persian":"وانکومایسین"},{"term":"Frontal lobe","definition":"Anterior portion of cerebrum responsible for executive function, motor control, and personality.","category":"anatomy","persian":"لوب پیشانی"},{"term":"Parietal lobe","definition":"Superior posterior cerebral lobe responsible for sensory integration and spatial processing.","category":"anatomy","persian":"لوب آهیانه‌ای"},{"term":"Temporal lobe","definition":"Lateral cerebral lobe containing auditory cortex, hippocampus, and language areas.","category":"anatomy","persian":"لوب گیجگاهی"},{"term":"Occipital lobe","definition":"Posterior cerebral lobe primarily responsible for visual processing and interpretation.","category":"anatomy","persian":"لوب پس سری"},{"term":"Cerebellum","definition":"Posterior brain structure responsible for balance, coordination, and motor learning.","category":"anatomy","persian":"مخچه"},{"term":"Brainstem","definition":"Central brain structure containing midbrain, pons, and medulla oblongata controlling vital functions.","category":"anatomy","persian":"ساقه مغز"},{"term":"Spinal cord","definition":"Central nervous system structure extending from medulla to L1-L2 vertebrae transmitting neural signals.","category":"anatomy","persian":"نخاع"},{"term":"Ventricles","definition":"Fluid-filled cavities within the brain containing cerebrospinal fluid produced by choroid plexus.","category":"anatomy","persian":"بطن‌ها"},{"term":"Meninges","definition":"Three protective membrane layers (dura, arachnoid, pia) surrounding the brain and spinal cord.","category":"anatomy","persian":"پرده‌های مغزی"},{"term":"Cranial nerves","definition":"Twelve pairs of nerves arising directly from the brain controlling sensory and motor functions of head and neck.","category":"anatomy","persian":"اعصاب جمجمه‌ای"},{"term":"Sympathetic nervous system","definition":"Division of autonomic nervous system that prepares body for fight-or-flight responses via thoracolumbar outflow.","category":"anatomy","persian":"سیستم عصبی سمپاتیک"},{"term":"Parasympathetic nervous system","definition":"Division of autonomic nervous system promoting rest-and-digest responses via craniosacral outflow.","category":"anatomy","persian":"سیستم عصبی پاراسمپاتیک"},{"term":"Aortic arch","definition":"Curved portion of aorta giving rise to brachiocephalic trunk, left common carotid, and left subclavian arteries.","category":"anatomy","persian":"قوس آئورت"},{"term":"Superior vena cava","definition":"Large vein returning deoxygenated blood from upper body to right atrium.","category":"anatomy","persian":"ورید اجوف فوقانی"},{"term":"Inferior vena cava","definition":"Large vein returning deoxygenated blood from lower body to right atrium.","category":"anatomy","persian":"ورید اجوف تحتانی"},{"term":"Portal circulation","definition":"Venous system where blood passes through two capillary beds, including hepatic and hypophyseal portal systems.","category":"anatomy","persian":"گردش پورتال"},{"term":"Coronary arteries","definition":"First branches of ascending aorta that supply oxygenated blood to myocardium via right and left systems.","category":"anatomy","persian":"شریان‌های کرونر"},{"term":"Pulmonary circulation","definition":"Circulatory pathway carrying deoxygenated blood from right ventricle to lungs and oxygenated blood back to left atrium.","category":"anatomy","persian":"گردش ریوی"},{"term":"Lymphatic system","definition":"Network of vessels and organs that transport lymph and immune cells throughout the body.","category":"anatomy","persian":"سیستم لنفاوی"},{"term":"Spleen","definition":"Lymphoid organ in left upper quadrant that filters blood and stores platelets and red blood cells.","category":"anatomy","persian":"طحال"},{"term":"Thymus","definition":"Primary lymphoid organ in anterior mediastinum where T-cell maturation occurs.","category":"anatomy","persian":"تیموس"},{"term":"Bone marrow","definition":"Soft tissue within bones responsible for hematopoiesis and immune cell production.","category":"anatomy","persian":"مغز استخوان"},{"term":"Nephron","definition":"Functional unit of kidney consisting of glomerulus, tubules, and collecting duct for filtration and reabsorption.","category":"anatomy","persian":"نفرون"},{"term":"Glomerulus","definition":"Cluster of capillaries in Bowman's capsule where initial blood filtration occurs in the kidney.","category":"anatomy","persian":"کلومرول"},{"term":"Loop of Henle","definition":"U-shaped portion of nephron tubule responsible for concentrating urine through countercurrent mechanism.","category":"anatomy","persian":"حلقه هنله"},{"term":"Collecting duct","definition":"Final portion of nephron where fine-tuning of electrolyte balance and water reabsorption occurs.","category":"anatomy","persian":"مجرای جمع‌کننده"},{"term":"Adrenal glands","definition":"Paired endocrine glands above kidneys consisting of cortex (steroid production) and medulla (catecholamine production).","category":"anatomy","persian":"غدد فوق کلیوی"},{"term":"Pancreatic islets","definition":"Clusters of endocrine cells within pancreas producing insulin, glucagon, and other hormones.","category":"anatomy","persian":"جزایر پانکراس"},{"term":"Thyroid gland","definition":"Butterfly-shaped endocrine gland in neck producing thyroid hormones and calcitonin.","category":"anatomy","persian":"غده تیروئید"},{"term":"Parathyroid glands","definition":"Four small endocrine glands posterior to thyroid producing parathyroid hormone for calcium regulation.","category":"anatomy","persian":"غدد پاراتیروئید"},{"term":"Pituitary gland","definition":"Master endocrine gland in sella turcica consisting of anterior adenohypophysis and posterior neurohypophysis.","category":"anatomy","persian":"غده هیپوفیز"},{"term":"endotracheal intubation","definition":"Insertion of a tube through the mouth or nose into the trachea to secure the airway and enable mechanical ventilation.","category":"procedure","persian":"لوله گذاری داخل نای"},{"term":"central venous line","definition":"Insertion of a catheter into a large central vein for medication administration, fluid resuscitation, or hemodynamic monitoring.","category":"procedure","persian":"کاتتر ورید مرکزی"},{"term":"arterial line","definition":"Catheter placed in an artery for continuous blood pressure monitoring and frequent blood gas sampling.","category":"procedure","persian":"کاتتر شریانی"},{"term":"chest tube","definition":"Tube inserted into the pleural space to drain air, blood, or fluid from around the lungs.","category":"procedure","persian":"لوله سینه"},{"term":"thoracentesis","definition":"Needle aspiration of fluid from the pleural space for diagnostic or therapeutic purposes.","category":"procedure","persian":"سوراخ کردن قفسه سینه"},{"term":"paracentesis","definition":"Needle aspiration of fluid from the peritoneal cavity for diagnosis or treatment of ascites.","category":"procedure","persian":"سوراخ کردن شکم"},{"term":"lumbar puncture","definition":"Insertion of a needle into the subarachnoid space to obtain cerebrospinal fluid or measure pressure.","category":"procedure","persian":"سوراخ کردن کمر"},{"term":"arthrocentesis","definition":"Needle aspiration of synovial fluid from a joint space for diagnostic analysis.","category":"procedure","persian":"سوراخ کردن مفصل"},{"term":"cardioversion","definition":"Synchronized electrical shock delivered to restore normal heart rhythm in patients with arrhythmias.","category":"procedure","persian":"تبدیل ضربان قلب"},{"term":"defibrillation","definition":"Unsynchronized electrical shock delivered to terminate ventricular fibrillation or pulseless ventricular tachycardia.","category":"procedure","persian":"شوک قلبی"},{"term":"pericardiocentesis","definition":"Needle aspiration of fluid from the pericardial space to relieve cardiac tamponade.","category":"procedure","persian":"سوراخ کردن پریکارد"},{"term":"cricothyrotomy","definition":"Emergency surgical airway created through the cricothyroid membrane when intubation fails.","category":"procedure","persian":"کریکوتیروتومی"},{"term":"Foley catheter","definition":"Indwelling urinary catheter with an inflatable balloon to secure placement in the bladder.","category":"procedure","persian":"کاتتر فولی"},{"term":"nasogastric tube","definition":"Flexible tube inserted through the nose into the stomach for decompression or feeding.","category":"procedure","persian":"لوله معده از بینی"},{"term":"colonoscopy","definition":"Endoscopic examination of the entire colon using a flexible scope inserted through the rectum.","category":"procedure","persian":"کولونوسکوپی"},{"term":"esophagogastroduodenoscopy","definition":"Endoscopic examination of the upper gastrointestinal tract including esophagus, stomach, and duodenum.","category":"procedure","persian":"اندوسکوپی فوقانی"},{"term":"bronchoscopy","definition":"Endoscopic examination of the airways using a flexible or rigid scope inserted through the mouth or nose.","category":"procedure","persian":"برونکوسکوپی"},{"term":"amniocentesis","definition":"Sampling of amniotic fluid during pregnancy for genetic testing or fetal lung maturity assessment.","category":"procedure","persian":"آمنیوسنتز"},{"term":"granuloma","definition":"Organized collection of epithelioid cells, often with giant cells, formed in response to chronic inflammation.","category":"pathology","persian":"گرانولوما"},{"term":"abscess","definition":"Localized collection of pus within tissues formed by bacterial infection and neutrophilic inflammation.","category":"pathology","persian":"آبسه"},{"term":"coagulative necrosis","definition":"Cell death characterized by preservation of tissue architecture due to protein denaturation exceeding enzyme activity.","category":"pathology","persian":"نکروز انعقادی"},{"term":"liquefactive necrosis","definition":"Cell death resulting in liquid debris due to enzymatic digestion, commonly seen in brain infarcts.","category":"pathology","persian":"نکروز مایع شدن"},{"term":"caseous necrosis","definition":"Cell death with cheese-like appearance typically associated with tuberculosis and fungal infections.","category":"pathology","persian":"نکروز پنیری"},{"term":"fat necrosis","definition":"Cell death of adipose tissue often due to trauma or pancreatitis, appearing as chalky white deposits.","category":"pathology","persian":"نکروز چربی"},{"term":"fibrinoid necrosis","definition":"Cell death with deposition of fibrin-like material, seen in malignant hypertension and autoimmune conditions.","category":"pathology","persian":"نکروز فیبرینوئید"},{"term":"apoptosis","definition":"Programmed cell death characterized by cell shrinkage, chromatin condensation, and formation of apoptotic bodies.","category":"pathology","persian":"آپوپتوز"},{"term":"metaplasia","definition":"Reversible replacement of one differentiated cell type with another, often in response to chronic irritation.","category":"pathology","persian":"متاپلازی"},{"term":"dysplasia","definition":"Abnormal cellular development with loss of uniformity and orientation, potentially precancerous.","category":"pathology","persian":"دیسپلازی"},{"term":"hyperplasia","definition":"Increase in cell number leading to organ enlargement while maintaining normal cellular architecture.","category":"pathology","persian":"هیپرپلازی"},{"term":"infarction","definition":"Tissue necrosis due to inadequate blood supply, typically caused by arterial occlusion.","category":"pathology","persian":"انفارکتوس"},{"term":"thrombosis","definition":"Formation of a blood clot within a blood vessel during lifetime.","category":"pathology","persian":"ترومبوز"},{"term":"embolism","definition":"Obstruction of blood vessels by detached thrombus, air, fat, or other material traveling in circulation.","category":"pathology","persian":"آمبولی"},{"term":"aneurysm","definition":"Abnormal localized dilation of an artery due to weakening of the vessel wall.","category":"pathology","persian":"آنوریسم"},{"term":"dissection","definition":"Separation of arterial wall layers due to blood entering between them, creating a false lumen.","category":"pathology","persian":"جدایی دیواره شریان"},{"term":"amyloidosis","definition":"Deposition of misfolded protein fibrils in tissues leading to organ dysfunction.","category":"pathology","persian":"آمیلوئیدوز"},{"term":"sarcoidosis","definition":"Multisystem granulomatous disease of unknown etiology commonly affecting lungs and lymph nodes.","category":"pathology","persian":"سارکوئیدوز"},{"term":"Frank-Starling law","definition":"The stroke volume of the heart increases in response to increased venous return and preload.","category":"physiology","persian":"قانون فرانک استارلینگ"},{"term":"Fick principle","definition":"Cardiac output equals oxygen consumption divided by the arteriovenous oxygen difference.","category":"physiology","persian":"اصل فیک"},{"term":"Henderson-Hasselbalch equation","definition":"pH equals pKa plus log of base concentration divided by acid concentration.","category":"physiology","persian":"معادله هندرسون هاسلبالخ"},{"term":"Starling forces","definition":"Hydrostatic and oncotic pressures that determine fluid movement across capillary membranes.","category":"physiology","persian":"نیروهای استارلینگ"},{"term":"renin-angiotensin-aldosterone system","definition":"Hormonal system regulating blood pressure and fluid balance through vasoconstriction and sodium retention.","category":"physiology","persian":"سیستم رنین آنژیوتانسین آلدوسترون"},{"term":"ventilation-perfusion ratio","definition":"Relationship between alveolar ventilation and pulmonary blood flow affecting gas exchange efficiency.","category":"physiology","persian":"نسبت تهویه تروی"},{"term":"oxygen dissociation curve","definition":"S-shaped curve showing relationship between oxygen partial pressure and hemoglobin saturation.","category":"physiology","persian":"منحنی اتصال اکسیژن"},{"term":"Bohr effect","definition":"Decrease in hemoglobin oxygen affinity with decreasing pH, facilitating oxygen release in tissues.","category":"physiology","persian":"اثر بور"},{"term":"Haldane effect","definition":"Deoxygenated hemoglobin has increased affinity for carbon dioxide compared to oxygenated hemoglobin.","category":"physiology","persian":"اثر هالدن"},{"term":"cardiac output","definition":"Volume of blood pumped by the heart per minute, calculated as stroke volume times heart rate.","category":"physiology","persian":"برون ده قلبی"},{"term":"ejection fraction","definition":"Percentage of blood pumped out of the ventricle with each heartbeat, normally 55-70%.","category":"physiology","persian":"کسر جهشی"},{"term":"pulmonary compliance","definition":"Measure of lung distensibility, defined as change in volume per unit change in pressure.","category":"physiology","persian":"انطباق ریوی"},{"term":"dead space","definition":"Portion of tidal volume that does not participate in gas exchange, including anatomic and physiologic components.","category":"physiology","persian":"فضای مرده"},{"term":"serum sodium","definition":"Normal range 135-145 mEq/L, primary extracellular cation regulating fluid balance.","category":"lab","persian":"سدیم سرم"},{"term":"serum potassium","definition":"Normal range 3.5-5.0 mEq/L, primary intracellular cation essential for cardiac and muscle function.","category":"lab","persian":"پتاسیم سرم"},{"term":"serum creatinine","definition":"Normal range 0.6-1.2 mg/dL, waste product filtered by kidneys used to assess renal function.","category":"lab","persian":"کراتینین سرم"},{"term":"blood urea nitrogen","definition":"Normal range 7-20 mg/dL, waste product reflecting kidney function and protein metabolism.","category":"lab","persian":"نیتروژن اوره خون"},{"term":"serum glucose","definition":"Normal fasting range 70-100 mg/dL, primary energy substrate regulated by insulin and glucagon.","category":"lab","persian":"گلوکز سرم"},{"term":"serum calcium","definition":"Normal range 8.5-10.5 mg/dL, essential for bone health, muscle contraction, and nerve function.","category":"lab","persian":"کلسیم سرم"},{"term":"serum magnesium","definition":"Normal range 1.8-2.4 mg/dL, cofactor for many enzymes and important for cardiac function.","category":"lab","persian":"منیزیم سرم"},{"term":"white blood cell count","definition":"Normal range 4,000-11,000 cells/μL, measures immune system cells fighting infection.","category":"lab","persian":"شمارش گلبول سفید"},{"term":"hemoglobin","definition":"Normal range 12-16 g/dL (women), 14-18 g/dL (men), oxygen-carrying protein in red blood cells.","category":"lab","persian":"هموگلوبین"},{"term":"platelet count","definition":"Normal range 150,000-450,000/μL, blood cells essential for hemostasis and clot formation.","category":"lab","persian":"شمارش پلاکت"},{"term":"mean corpuscular volume","definition":"Normal range 80-100 fL, average volume of red blood cells used to classify anemia.","category":"lab","persian":"حجم متوسط گلبول"},{"term":"serum ferritin","definition":"Normal range 15-150 ng/mL (women), 15-200 ng/mL (men), reflects total body iron stores.","category":"lab","persian":"فریتین سرم"},{"term":"thyroid stimulating hormone","definition":"Normal range 0.4-4.0 mIU/L, pituitary hormone regulating thyroid function.","category":"lab","persian":"هورمون محرک تیروئید"},{"term":"troponin","definition":"Normal <0.04 ng/mL, cardiac-specific protein elevated in myocardial injury.","category":"lab","persian":"تروپونین"},{"term":"D-dimer","definition":"Normal <500 ng/mL, fibrin degradation product elevated in thrombotic conditions.","category":"lab","persian":"دی دایمر"},{"term":"serum lactate","definition":"Normal range 0.5-2.2 mmol/L, marker of tissue hypoxia and anaerobic metabolism.","category":"lab","persian":"لاکتات سرم"},{"term":"Gram stain","definition":"Primary bacterial staining method differentiating gram-positive (purple) from gram-negative (pink) bacteria.","category":"micro","persian":"رنگ آمیزی گرم"},{"term":"MRSA","definition":"Methicillin-resistant Staphylococcus aureus, gram-positive bacteria resistant to beta-lactam antibiotics.","category":"micro","persian":"استاف مقاوم به متی سیلین"},{"term":"VRE","definition":"Vancomycin-resistant Enterococcus, gram-positive bacteria resistant to vancomycin requiring alternative antibiotics.","category":"micro","persian":"انتروکوک مقاوم به ونکومایسین"},{"term":"ESBL","definition":"Extended-spectrum beta-lactamase producing bacteria resistant to most beta-lactam antibiotics except carbapenems.","category":"micro","persian":"بتالاکتاماز وسیع الطیف"},{"term":"Clostridium difficile","definition":"Gram-positive anaerobic bacteria causing antibiotic-associated colitis and pseudomembranous colitis.","category":"micro","persian":"کلستریدیوم دیفیسیل"},{"term":"Mycobacterium tuberculosis","definition":"Acid-fast bacteria causing tuberculosis, requiring prolonged multi-drug treatment.","category":"micro","persian":"مایکوباکتریوم توبرکولوزیس"},{"term":"HIV","definition":"Human immunodeficiency virus, RNA retrovirus causing acquired immunodeficiency syndrome.","category":"micro","persian":"ویروس نقص ایمنی انسان"},{"term":"hepatitis B surface antigen","definition":"Viral protein indicating active hepatitis B infection, first serologic marker to appear.","category":"micro","persian":"آنتی ژن سطحی هپاتیت ب"},{"term":"hepatitis C antibody","definition":"Serum antibodies indicating past or present hepatitis C infection, requiring PCR confirmation for active disease.","category":"micro","persian":"آنتی بادی هپاتیت ث"},{"term":"blood culture","definition":"Laboratory test growing bacteria from blood samples to identify causative organisms in bacteremia.","category":"micro","persian":"کشت خون"},{"term":"urine culture","definition":"Laboratory test identifying bacteria and determining antibiotic sensitivity in urinary tract infections.","category":"micro","persian":"کشت ادرار"},{"term":"cerebrospinal fluid analysis","definition":"Laboratory examination of CSF including cell count, protein, glucose, and culture for meningitis diagnosis.","category":"lab","persian":"آنالیز مایع نخاعی"},{"term":"arterial blood gas","definition":"Laboratory test measuring blood pH, carbon dioxide, oxygen, and bicarbonate levels.","category":"lab","persian":"گاز خون شریانی"},{"term":"procalcitonin","definition":"Biomarker elevated in bacterial infections, normal <0.25 ng/mL, useful for antibiotic stewardship.","category":"lab","persian":"پروکلسی تونین"}];

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
  // API call via GET (used by GitHub Pages frontend to avoid CORS/redirect issues with POST)
  if (e && e.parameter && e.parameter.apiCall) {
    try {
      var payload = JSON.parse(e.parameter.apiCall);
      var fn = payload.fn;
      var args = payload.args || [];
      var profile = payload.profile || '';
      // Functions that accept guestId as their last parameter
      var needsGuestId = ['saveQuizResult','saveProgress','analyzeQuizResults','saveCardRating','getUserStats','getUserQuizHistory','getLeaderboard','getDailyChallenge','getWeakCards_','getPBCaseLibrary'];
      if (profile && needsGuestId.indexOf(fn) !== -1) {
        args.push(profile);
      }
      var allowed = {
        'getCurrentUser': getCurrentUser,
        'getSpecialties': getSpecialties,
        'getFlashcards': getFlashcards,
        'getBulletNotes': getBulletNotes,
        'getMCQQuiz': getMCQQuiz,
        'getTopicsForSpecialty': getTopicsForSpecialty,
        'getDontMiss': getDontMiss,
        'getGlossary': getGlossary,
        'getImageChapters': getImageChapters,
        'getChapterImages': getChapterImages,
        'askDrData': askDrData,
        'startPatientBotCase': startPatientBotCase,
        'sendPatientBotMessage': sendPatientBotMessage,
        'submitDiagnosis': submitDiagnosis,
        'debriefPatientBot': debriefPatientBot,
        'saveQuizResult': saveQuizResult,
        'saveProgress': saveProgress,
        'analyzeQuizResults': analyzeQuizResults,
        'saveCardRating': saveCardRating,
        'getUserStats': getUserStats,
        'getUserQuizHistory': getUserQuizHistory,
        'getLeaderboard': getLeaderboard,
        'getDailyChallenge': getDailyChallenge,
        'getGlossaryStatus': getGlossaryStatus,
        'getDevStats': getDevStats
      };
      if (!allowed[fn]) {
        return ContentService.createTextOutput(JSON.stringify({ error: 'Function not allowed: ' + fn }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var result = allowed[fn].apply(null, args);
      return ContentService.createTextOutput(JSON.stringify({ result: result }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

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

// Dev secret for Netlify proxy auth (set as Script Property 'DEV_SECRET')
var DEV_SECRET = PropertiesService.getScriptProperties().getProperty('DEV_SECRET') || '';

// --- REST API for external frontends (GitHub Pages) ---
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var fn = payload.fn;
    var args = payload.args || [];
    var devSecret = payload.devSecret || '';

    // Whitelist of callable functions
    var allowed = {
      'getCurrentUser': getCurrentUser,
      'getSpecialties': getSpecialties,
      'getFlashcards': getFlashcards,
      'getBulletNotes': getBulletNotes,
      'getMCQQuiz': getMCQQuiz,
      'getTopicsForSpecialty': getTopicsForSpecialty,
      'getDontMiss': getDontMiss,
      'getGlossary': getGlossary,
      'getImageChapters': getImageChapters,
      'getChapterImages': getChapterImages,
      'askDrData': askDrData,
      'startPatientBotCase': startPatientBotCase,
      'sendPatientBotMessage': sendPatientBotMessage,
      'submitDiagnosis': submitDiagnosis,
      'debriefPatientBot': debriefPatientBot,
      'saveQuizResult': saveQuizResult,
      'saveProgress': saveProgress,
      'analyzeQuizResults': analyzeQuizResults,
      'saveCardRating': saveCardRating,
      'getUserStats': getUserStats,
      'getUserQuizHistory': getUserQuizHistory,
      'getLeaderboard': getLeaderboard,
      'getDailyChallenge': getDailyChallenge,
      'getGlossaryStatus': getGlossaryStatus,
      'getDevStats': getDevStats
    };

    if (!allowed[fn]) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Function not allowed: ' + fn }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Pass devSecret as first arg for getDevStats when called via proxy
    if (fn === 'getDevStats' && devSecret) {
      args = [devSecret];
    }

    var result = allowed[fn].apply(null, args);
    return ContentService.createTextOutput(JSON.stringify({ result: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message || String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
function getDevStats(devSecretArg) {
  var email = Session.getActiveUser().getEmail() || '';
  var hasDevSecret = DEV_SECRET && devSecretArg && devSecretArg === DEV_SECRET;
  if (email.toLowerCase() !== ADMIN_EMAIL && !hasDevSecret) return { error: 'Not authorized' };

  var sheet = ensureUserDataSheet_();
  var data = sheet.getDataRange().getValues();

  var users = {};
  var totalRows = data.length - 1;
  var activityByDay = {};

  for (var i = 1; i < data.length; i++) {
    var userId = (data[i][0] || '').toString();
    var type = data[i][1];
    var ts = data[i][3];

    if (!users[userId]) users[userId] = { quizzes: 0, pb: 0, daily: 0, cards: 0, lastActive: '', isGuest: userId.indexOf('guest_') === 0, recentActivity: [] };
    if (type === 'quiz_result') users[userId].quizzes++;
    if (type === 'pb_result') users[userId].pb++;
    if (type === 'daily_result') users[userId].daily++;
    if (type === 'card_rating') users[userId].cards++;
    if (ts) users[userId].lastActive = ts;

    // Store recent activity (last 20 non-card events per user)
    if (type !== 'card_rating' && users[userId].recentActivity.length < 20) {
      var detail = data[i][2]; // data column
      var summary = '';
      try { var parsed = typeof detail === 'string' ? JSON.parse(detail) : detail; summary = parsed; } catch(ex) { summary = detail; }
      users[userId].recentActivity.push({ type: type, data: summary, time: ts ? ts.toString() : '' });
    }

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

// Name bank organized by ethnicity AND gender for proper correlation
var PATIENT_NAMES_ = {
  'South Asian':     { M: ['Aarav','Rohan','Vikram','Arjun','Nikhil','Ravi','Sanjay','Harsh','Aditya','Pranav'], F: ['Ananya','Meera','Sunita','Kavya','Pooja','Lakshmi','Deepa','Nisha','Priya','Anika'], N: ['Kiran','Preet','Jaya','Samar','Noor'] },
  'East Asian':      { M: ['Wei','Jun','Hiro','Min-jun','Tao','Kenji','Bao','Takeshi','Hyun','Akira'], F: ['Mei Lin','Yuki','Sakura','Ji-yeon','Xiao','Aiko','Soo-jin','Linh','Hana','Minji'], N: ['Thanh','Ren','Sora','Kai','Yue'] },
  'Middle Eastern':  { M: ['Farhad','Omid','Dariush','Reza','Kamran','Bahram','Saeed','Hassan','Amir','Navid'], F: ['Yasmin','Nasreen','Leila','Shirin','Parisa','Soraya','Nazanin','Maryam','Golnaz','Setareh'], N: ['Dara','Shayan','Kian'] },
  'Arabic':          { M: ['Omar','Khalid','Tariq','Youssef','Ibrahim','Mustafa','Samir','Bassam','Ahmed','Jamal'], F: ['Fatima','Noor','Amira','Hana','Layla','Zahra','Dina','Rania','Salma','Lina'], N: ['Nour','Salam'] },
  'Black/African':   { M: ['Kwame','Kofi','Chidi','Emeka','Jabari','Sekou','Olu','Tendai','Dayo','Amadi'], F: ['Ama','Adwoa','Ngozi','Aisha','Folake','Zuri','Amara','Chiamaka','Nneka','Adaeze'], N: ['Akili','Imani'] },
  'Latin American':  { M: ['Santiago','Mateo','Diego','Alejandro','Carlos','Fernando','Ricardo','Miguel','Luis','Andres'], F: ['Valentina','Camila','Isabella','Lucia','Gabriela','Sofia','Daniela','Elena','Mariana','Paula'], N: ['Angel','Cruz','Guadalupe'] },
  'White/European':  { M: ['Liam','Noah','Ethan','Lucas','Oliver','James','Benjamin','Jack','Ryan','Connor'], F: ['Emma','Olivia','Ava','Mia','Charlotte','Amelia','Harper','Ella','Grace','Chloe'], N: ['Alex','Jordan','Taylor','Riley'] },
  'Eastern European':{ M: ['Dmitri','Andrei','Pavel','Sergei','Viktor','Nikolai','Bogdan','Aleksei','Oleg','Ivan'], F: ['Natasha','Katya','Irina','Olga','Tatiana','Anya','Mila','Daria','Svetlana','Yulia'], N: ['Sasha','Zhenya'] },
  'Indigenous':      { M: ['Koda','Takoda','Chayton','Ahanu','Mika','Dakota','River','Hunter','Chase','Jesse'], F: ['Winona','Aiyana','Nizhoni','Aponi','Kaya','Nuna','Tallulah','Sequoia','Wren','Sage'], N: ['Dakota','River','Sky','Sage'] },
  'Caribbean':       { M: ['Marlon','Dwayne','Leroy','Winston','Errol','Delroy','Byron','Neville','Andre','Desmond'], F: ['Keisha','Shanice','Tamika','Sade','Nadine','Patrice','Shelly','Claudette','Monique','Simone'], N: ['Courtney','Kelly'] },
  'French Canadian': { M: ['Jean-Luc','Mathieu','Francois','Sebastien','Antoine','Maxime','Olivier','Tristan','Gabriel','Philippe'], F: ['Genevieve','Elodie','Amelie','Celeste','Juliette','Margaux','Colette','Simone','Camille','Isabelle'], N: ['Dominique','Claude','Camille'] },
  'Turkish':         { M: ['Emre','Berk','Kerem','Cem','Murat','Burak','Kaan','Yusuf','Baris','Alp'], F: ['Elif','Defne','Zeynep','Ece','Aylin','Selin','Pelin','Naz','Ceren','Ebru'], N: ['Deniz','Evren'] }
};

function getRandomPatientName_(sexOverride) {
  // Pick a random ethnicity
  var ethnicities = Object.keys(PATIENT_NAMES_);
  var ethnicity = ethnicities[Math.floor(Math.random() * ethnicities.length)];

  // Determine gender bucket
  var genderKey = 'M';
  if (sexOverride === 'female' || sexOverride === 'trans_f') genderKey = 'F';
  else if (sexOverride === 'male' || sexOverride === 'trans_m') genderKey = 'M';
  else if (sexOverride === 'nonbinary') genderKey = 'N';
  else genderKey = Math.random() < 0.5 ? 'M' : 'F'; // random

  var nameList = PATIENT_NAMES_[ethnicity][genderKey] || PATIENT_NAMES_[ethnicity]['M'];
  var name = nameList[Math.floor(Math.random() * nameList.length)];

  return { name: name, ethnicity: ethnicity, gender: genderKey };
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
    var back = r.Back || '';
    // Content fix: Nasal midline dermoid cyst — choristoma, not hamartoma
    if (back.indexOf('hamartoma') !== -1 && (r.Front || '').toLowerCase().indexOf('dermoid') !== -1) {
      back = back.replace(/hamartoma/gi, 'choristoma');
    }
    return {
      id: i,
      specialty: r.Specialty || '',
      topic: r.Topic || '',
      front: r.Front || '',
      back: back,
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

  // Filter out incomplete questions (missing stem, missing options, N/A placeholders)
  data = data.filter(function(r) {
    var q = (r.Question || '').trim();
    if (!q || q.length < 10) return false; // No question stem or too short

    // Reject stub questions where vignette was dropped during generation.
    // Valid MCCQE-style questions have a clinical vignette (age, presentation) + stem.
    // Stubs like "Which one of the following is the best next step?" are ≤100 chars
    // with no patient scenario — these are hard failures, not valid questions.
    if (q.length < 150) return false;
    // Must contain a patient reference (age, gender, or clinical term)
    var hasPatient = /\d{1,3}[- ]year|patient|woman|man|girl|boy|infant|child|presents|complains/i.test(q);
    if (!hasPatient) return false;

    var optA = (r.Option_A || '').trim();
    var optB = (r.Option_B || '').trim();
    if (!optA || !optB) return false; // Need at least 2 real options
    var correct = (r.Correct_Answer || '').trim();
    if (!correct) return false; // No correct answer set
    // Check that correct answer option actually has content
    var correctOpt = r['Option_' + correct] || '';
    if (!correctOpt.trim() || correctOpt.trim().toLowerCase() === 'n/a') return false;
    return true;
  });

  data = shuffleArray_(data);

  if (count && count < data.length) {
    data = data.slice(0, count);
  }

  return data.map(function(r, i) {
    var opts = { A: r.Option_A || '', B: r.Option_B || '', C: r.Option_C || '', D: r.Option_D || '', E: r.Option_E || '' };
    var specialty = r.Specialty || '';
    var question = r.Question || '';
    var correct = r.Correct_Answer || '';
    var rationale = r.Rationale || '';

    // --- CONTENT PATCHES ---

    // Fix Q3: CKD/naproxen pain question — relabel to Nephrology, fix answer
    if (question.toLowerCase().indexOf('naproxen') !== -1 && question.toLowerCase().indexOf('ckd') !== -1) {
      specialty = 'Nephrology';
      // Fix: acetaminophen first, not opioids (Canadian pain guidelines, WHO ladder)
      Object.keys(opts).forEach(function(k) {
        if (opts[k].toLowerCase().indexOf('acetaminophen') !== -1 && opts[k].toLowerCase().indexOf('opioid') !== -1) {
          opts[k] = 'Discontinue naproxen and initiate a low-dose opioid with acetaminophen';
        }
      });
      // Ensure correct answer is acetaminophen-only
      var hasAcetOnly = false;
      Object.keys(opts).forEach(function(k) {
        if (opts[k].toLowerCase().indexOf('acetaminophen') !== -1 && opts[k].toLowerCase().indexOf('opioid') === -1 && opts[k].toLowerCase().indexOf('naproxen') === -1) {
          hasAcetOnly = true;
        }
      });
      if (!hasAcetOnly) {
        // Add correct answer if missing, use first empty slot or replace E
        var slot = !opts.E || !opts.E.trim() ? 'E' : !opts.D || !opts.D.trim() ? 'D' : 'E';
        opts[slot] = 'Discontinue naproxen and initiate regular acetaminophen';
        correct = slot;
      } else {
        Object.keys(opts).forEach(function(k) {
          if (opts[k].toLowerCase().indexOf('acetaminophen') !== -1 && opts[k].toLowerCase().indexOf('opioid') === -1 && opts[k].toLowerCase().indexOf('naproxen') === -1) {
            correct = k;
          }
        });
      }
      rationale = 'In CKD, NSAIDs (including naproxen) are contraindicated due to nephrotoxicity and GI bleeding risk. Per Canadian pain guidelines and the WHO analgesic ladder, the first step is to optimize non-opioid analgesia — regular acetaminophen (up to 3g/day in CKD). Opioids should only be considered if non-opioid measures fail, and with caution in renal impairment due to active metabolite accumulation (especially morphine). Topical agents (capsaicin, lidocaine patches) are reasonable adjuncts before escalating to opioids.';
    }

    // Fix Q6: erythroplakia — convert recall to clinical reasoning
    if (question.toLowerCase().indexOf('erythroplakia') !== -1 && question.toLowerCase().indexOf('percentage') !== -1) {
      question = 'A 62-year-old man presents with a persistent, painless red patch on the floor of his mouth that has been present for 3 months. He has a 40-pack-year smoking history and drinks alcohol daily. On examination, there is a 2 cm velvety, erythematous lesion. Biopsy shows severe dysplasia with focal carcinoma in situ. What is the most appropriate next step in management?';
      opts = {
        A: 'Observation with repeat biopsy in 6 months',
        B: 'Wide surgical excision with clear margins',
        C: 'Topical antifungal therapy',
        D: 'Laser ablation of the lesion',
        E: 'Referral for radiation therapy'
      };
      correct = 'B';
      rationale = 'Erythroplakia (red mucosal patches) carries a high malignant potential — 14–50% of lesions harbour carcinoma in situ or invasive carcinoma at the time of biopsy, far exceeding the risk of leukoplakia. With biopsy-confirmed severe dysplasia/CIS, wide surgical excision with clear margins is the standard of care. Observation risks progression to invasive SCC. Laser ablation may be considered for superficial lesions but does not provide margins for histopathological assessment. Smoking cessation and close follow-up are essential adjuncts.';
    }

    // Fix: ensure all questions have 5 options (add plausible 5th if missing)
    if (!opts.E || !opts.E.trim() || opts.E.trim().toLowerCase() === 'n/a') {
      // Only add if we have A-D
      if (opts.A && opts.B && opts.C && opts.D) {
        // Generic plausible 5th option based on specialty
        if (question.toLowerCase().indexOf('investigation') !== -1 || question.toLowerCase().indexOf('diagnos') !== -1) {
          opts.E = 'Serum alpha-fetoprotein level';
        } else if (question.toLowerCase().indexOf('management') !== -1 || question.toLowerCase().indexOf('treatment') !== -1) {
          opts.E = 'Watchful waiting with reassessment in 3 months';
        } else {
          opts.E = 'None of the above';
        }
      }
    }

    // Remove truly empty/N/A options
    Object.keys(opts).forEach(function(k) { if (!opts[k] || !opts[k].trim() || opts[k].trim().toLowerCase() === 'n/a') delete opts[k]; });

    return {
      id: i,
      specialty: specialty,
      version: r.Version || '',
      question: question,
      options: opts,
      correct: correct,
      rationale: rationale
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

  // Fallback: check PropertiesService for embedded glossary
  try {
    var props = PropertiesService.getScriptProperties();
    var embedded = props.getProperty('GLOSSARY_DATA');
    if (embedded) {
      var result = JSON.parse(embedded);
      try { cache.put('glossary', embedded, 21600); } catch(e2) {}
      return result;
    }
  } catch(e) {}

  // Hardcoded fallback glossary
  return getHardcodedGlossary_();
}

function getHardcodedGlossary_() {
  return GLOSSARY_EMBEDDED_;
}



// Import glossary JSON data (call from client: serverCall('importGlossary', jsonArray))
function importGlossary(glossaryArray) {
  if (!glossaryArray || !Array.isArray(glossaryArray)) return { error: 'Invalid data' };
  var json = JSON.stringify(glossaryArray);
  if (json.length > 500000) return { error: 'Data too large: ' + json.length + ' bytes' };
  PropertiesService.getScriptProperties().setProperty('GLOSSARY_DATA', json);
  CacheService.getScriptCache().remove('glossary');
  return { success: true, count: glossaryArray.length };
}

// Check if glossary is loaded
function getGlossaryStatus() {
  var props = PropertiesService.getScriptProperties();
  var data = props.getProperty('GLOSSARY_DATA');
  if (data) {
    try { return { loaded: true, count: JSON.parse(data).length }; } catch(e) {}
  }
  return { loaded: false, count: 0 };
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
          percentage: Math.round((r.score / r.total) * 100),
          wrongAnswers: r.wrongAnswers || []
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

  // ============================
  // PATIENT IDENTITY GENERATION (name + sex + ethnicity + age — all correlated, locked before AI sees it)
  // ============================

  // Generate correlated name/ethnicity/gender
  var patientIdentity = getRandomPatientName_(customOpts.sex || null);
  var patientName = patientIdentity.name;
  var patientEthnicity = patientIdentity.ethnicity;
  var patientGenderKey = patientIdentity.gender; // M, F, or N

  // Build the sex/gender enforcement string
  var sexJsonVal = patientGenderKey === 'N' ? 'NB' : patientGenderKey;
  var customSexStr = '';
  var pronounStr = '';
  if (customOpts.sex === 'male' || (!customOpts.sex && patientGenderKey === 'M')) {
    customSexStr = 'LOCKED SEX: MALE (cis male). Use he/him pronouns. The JSON sex field MUST be "M".';
    pronounStr = 'he/him';
    sexJsonVal = 'M';
  } else if (customOpts.sex === 'female' || (!customOpts.sex && patientGenderKey === 'F')) {
    customSexStr = 'LOCKED SEX: FEMALE (cis female). Use she/her pronouns. The JSON sex field MUST be "F".';
    pronounStr = 'she/her';
    sexJsonVal = 'F';
  } else if (customOpts.sex === 'nonbinary') {
    customSexStr = 'LOCKED SEX: NON-BINARY. Use they/them pronouns. Set sex to "NB" in the JSON. You MUST also set assigned_sex to "M" or "F" (pick one) for clinical relevance (e.g. prostate if AMAB, uterus/ovaries if AFAB). If asked about sex, they say "I\'m non-binary — I was assigned [male/female] at birth if that matters medically." If the student misgenders them, gently correct.';
    pronounStr = 'they/them';
    sexJsonVal = 'NB';
  } else if (customOpts.sex === 'trans_m') {
    customSexStr = 'LOCKED SEX: TRANSGENDER MAN (assigned female at birth, identifies as male). Use he/him pronouns. JSON sex MUST be "M", assigned_sex MUST be "F". Has relevant anatomy (uterus, ovaries). May or may not be on testosterone. If asked about sex, he may say "I\'m trans" or mention assigned sex if medically relevant.';
    pronounStr = 'he/him';
    sexJsonVal = 'M';
  } else if (customOpts.sex === 'trans_f') {
    customSexStr = 'LOCKED SEX: TRANSGENDER WOMAN (assigned male at birth, identifies as female). Use she/her pronouns. JSON sex MUST be "F", assigned_sex MUST be "M". Has relevant anatomy (prostate). May or may not be on HRT. If asked about sex, she may say "I\'m trans" or mention assigned sex if medically relevant.';
    pronounStr = 'she/her';
    sexJsonVal = 'F';
  }

  // Build the age enforcement string
  var customAgeStr = '';
  if (customOpts.age === 'child') customAgeStr = 'LOCKED AGE: CHILD (2-12 years old). A parent brings them in and is the primary historian. The JSON age MUST be between 2 and 12.';
  else if (customOpts.age === 'young') customAgeStr = 'LOCKED AGE: YOUNG ADULT (18-30 years old). The JSON age MUST be between 18 and 30.';
  else if (customOpts.age === 'middle') customAgeStr = 'LOCKED AGE: MIDDLE-AGED (30-60 years old). The JSON age MUST be between 30 and 60.';
  else if (customOpts.age === 'elderly') customAgeStr = 'LOCKED AGE: ELDERLY (60+ years old). The JSON age MUST be 60 or above.';
  else if (customOpts.age === 'pediatric') customAgeStr = 'LOCKED AGE: PEDIATRIC (newborn to 17). A parent is present and may be the primary historian. The JSON age MUST be 0-17.';

  // Filter demographics by gender — no "pregnant woman" for male patients, etc.
  var genderFilteredDemos = demographics.filter(function(d) {
    if (patientGenderKey === 'M') return d.indexOf('Pregnant woman') === -1 && d.indexOf('Single mother') === -1;
    if (patientGenderKey === 'F') return d.indexOf('tough guy') === -1;
    return true;
  });
  if (genderFilteredDemos.length > 0) chosenDemo = genderFilteredDemos[Math.floor(Math.random() * genderFilteredDemos.length)];

  // Build the locked identity block — this is NON-NEGOTIABLE for the AI
  var identityBlock = '\n\n========== LOCKED PATIENT IDENTITY (DO NOT CHANGE ANY OF THESE) ==========\n' +
    'LOCKED NAME: ' + patientName + '. The JSON "name" field MUST be exactly "' + patientName + '". Do NOT pick a different name.\n' +
    'LOCKED ETHNICITY: ' + patientEthnicity + '. The JSON "ethnicity" field MUST be exactly "' + patientEthnicity + '". Do NOT change the ethnicity.\n' +
    customSexStr + '\n' +
    (customAgeStr ? customAgeStr + '\n' : '') +
    'These fields are PRE-DETERMINED by the system. You have ZERO creative liberty over name, sex, or ethnicity. They are already set. Your job is to create the clinical scenario, vitals, diagnosis, and appearance — nothing else about the patient\'s identity.\n' +
    '==========================================================================\n';

  chosenDemo += identityBlock;

  // Appearance prompt — ethnicity is already locked, just need the doorway assessment
  var appearancePrompt = '\nPATIENT APPEARANCE (DOORWAY ASSESSMENT):\n' +
    'Generate a brief "general appearance" — what the doctor sees the moment they walk in.\n' +
    'Include this in the JSON as "appearance" (1 brief sentence, e.g. "Pale, diaphoretic male clutching his chest", "Well-appearing child sitting on mother\'s lap", "Thin elderly woman in mild respiratory distress", "Agitated young man pacing the room").\n' +
    'The ethnicity (' + patientEthnicity + ') SHOULD influence disease choice when epidemiologically relevant (e.g. sickle cell in Black patients, Tay-Sachs in Ashkenazi Jewish, Behçet\'s in Middle Eastern, Kawasaki in East Asian children) — but do NOT force rare ethnicity-linked diagnoses every time. Most cases should still be common conditions.\n' +
    'The appearance MUST be consistent with the diagnosis and severity. A patient with a PE should NOT look "well-appearing." A patient with a minor laceration should NOT look "in extremis."\n';

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
    appearancePrompt + '\n' +
    'The patient identity (name, sex, ethnicity) is ALREADY LOCKED above. Do NOT override it.\n\n' +
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
    '{"name":"' + patientName + '","age":<number>,"sex":"' + sexJsonVal + '","assigned_sex":"<M/F>","ethnicity":"' + patientEthnicity + '","appearance":"<1 sentence doorway assessment>","hr":<number>,"bp":"<sys/dia>","rr":<number>,"temp":<number>,"spo2":<number>,"diagnosis":"<the correct diagnosis>"}\n' +
    '```\n' +
    'MANDATORY JSON FIELDS — THESE ARE PRE-FILLED AND MUST NOT BE CHANGED:\n' +
    '- "name" MUST be exactly "' + patientName + '" — do NOT substitute, shorten, or modify this name\n' +
    '- "sex" MUST be exactly "' + sexJsonVal + '"\n' +
    '- "ethnicity" MUST be exactly "' + patientEthnicity + '"\n' +
    '- "assigned_sex" should match sex for cis patients, or be set to birth sex for trans/NB patients\n' +
    'YOU FILL IN: age (must match any age constraint above), appearance, vitals (hr/bp/rr/temp/spo2), and diagnosis.\n\n' +
    'CRITICAL CONSISTENCY RULES:\n' +
    '1. The diagnosis in the JSON MUST match the clinical scenario you present. Every detail you give (symptoms, history, medications, timeline) must be consistent with that exact diagnosis. If the diagnosis is "opioid overdose" then the patient took opioids, not acetaminophen. If it\'s "appendicitis" then the pain is in the right lower quadrant, not the chest. NEVER contradict the diagnosis you wrote in the JSON.\n' +
    '2. YOU ARE ' + patientName + '. Your name, sex, and ethnicity are LOCKED. If the doctor asks your name, you say "' + patientName + '." If they call you a wrong name, correct them. NEVER claim to be someone else. NEVER invent other characters.\n' +
    '3. If a parent/guardian brought you in (because you are a child), the PARENT is not the patient — YOU are. The parent can speak, but you are always ' + patientName + '. Never confuse yourself with the parent.\n' +
    '4. Your sex/gender is LOCKED. Do NOT switch pronouns, do NOT change your sex mid-conversation. ' + (pronounStr ? 'Use ' + pronounStr + ' pronouns consistently.' : '') + '\n\n' +
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
    '- Accept partial answers that capture the core diagnosis (e.g. "depression" for "MDD with SI secondary to hypothyroidism" gets partial).\n' +
    '- Score 80-100 if essentially correct (synonyms, abbreviations, close enough).\n' +
    '- Score 40-79 if partially correct (right system/organ, related condition, identified part of the answer).\n' +
    '- Score 0-39 if wrong (different system, unrelated, nonsensical).\n\n' +
    'IMPORTANT: Your feedback should NOT reveal what the correct diagnosis is. Do NOT tell them what they missed.\n' +
    '- If correct: congratulate them.\n' +
    '- If partial: say "You\'re on the right track but your answer is incomplete." Do NOT specify what is missing.\n' +
    '- If wrong: say "That\'s not the diagnosis for this presentation."\n\n' +
    'Respond with ONLY a JSON object:\n' +
    '{"score": <0-100>, "correct": true/false, "feedback": "<brief feedback WITHOUT revealing the answer>"' +
    (isCheatMode ? ', "cheatFeedback": "<if wrong, be funny/sarcastic about them having the answer on screen>"' : '') + '}';

  var messages = [{ role: 'user', content: checkPrompt }];
  var response = callAnthropic_('You are a medical exam grading assistant. Respond only with valid JSON.', messages);

  try {
    var jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      var result = JSON.parse(jsonMatch[0]);
      var score = result.score || 0;
      var isCorrect = score >= 80 || result.correct === true;
      return {
        correct: isCorrect,
        score: score,
        feedback: result.feedback + (result.cheatFeedback && !isCorrect ? ' ' + result.cheatFeedback : ''),
        cheatMode: isCheatMode
      };
    }
  } catch (e) {}

  // Fallback: simple string matching (do NOT reveal the diagnosis)
  var norm = function(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); };
  var isCorrect = norm(correctDiagnosis).indexOf(norm(userDiagnosis)) !== -1 ||
                  norm(userDiagnosis).indexOf(norm(correctDiagnosis)) !== -1;
  var fb = isCorrect ? 'Correct!' : 'That\'s not the diagnosis for this presentation.';
  if (!isCorrect && isCheatMode) fb += ' The answer was literally on your screen!';
  return { correct: isCorrect, partial: false, score: isCorrect ? 100 : 0, feedback: fb, cheatMode: isCheatMode };
}

function sendPatientBotMessage(caseId, message, history) {
  var caseJson = CacheService.getUserCache().get('pb_' + caseId);
  if (!caseJson) {
    return { response: 'Case expired. Please start a new case.', expired: true };
  }

  var caseData = JSON.parse(caseJson);

  // ========== CLINICAL PREREQ TRACKING ==========
  // Track what access/equipment the student has established
  if (!caseData.access) caseData.access = {};
  var msgLower = message.toLowerCase();

  // Detect IV access establishment
  if (/start.*(iv|intravenous|peripheral|line)|insert.*(iv|line|cannula)|peripheral iv|iv access|ultrasound.guided iv/i.test(message)) {
    caseData.access.iv = true;
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
  }
  if (/insert.*(central|subclavian|ij|femoral|triple.lumen)|central line|central venous/i.test(message)) {
    caseData.access.centralLine = true;
    caseData.access.iv = true; // central line = IV access
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
  }
  if (/insert.*io|intraosseous/i.test(message)) {
    caseData.access.io = true;
    caseData.access.iv = true; // IO = can push IV meds
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
  }
  if (/intubat|rapid sequence|rsi|insert.*ett/i.test(message)) {
    caseData.access.intubated = true;
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
  }
  if (/foley|urinary catheter/i.test(message)) {
    caseData.access.foley = true;
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
  }
  if (/cardiac monitor|telemetry|attach monitor|put on monitor/i.test(message)) {
    caseData.access.monitor = true;
    CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);
  }

  // Check for IV prereq violations — IV/IO meds without IV access
  var isIVMed = /\biv\b|iv push|iv bolus|iv drip|iv infusion|iv over|intravenous/i.test(message) && !/(start|insert|place|establish|get|put in|set up).*(iv|line|access)/i.test(message);
  if (isIVMed && !caseData.access.iv) {
    return {
      response: '',
      consequence: 'No IV access established. You need to start an IV, central line, or IO before administering IV medications.',
      severity: 'prereq',
      blocked: true,
      vitals: caseData.vitals || null
    };
  }

  // Check for drip without IV
  var isDrip = /drip|infusion|infuse|hang |run .*bag/i.test(message) && !/(start|insert|place|establish).*(iv|line)/i.test(message);
  if (isDrip && !caseData.access.iv) {
    return {
      response: '',
      consequence: 'No IV access established. Start an IV line before hanging drips or infusions.',
      severity: 'prereq',
      blocked: true,
      vitals: caseData.vitals || null
    };
  }

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
  var severity = null;
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
        'FATAL guidelines:\n' +
        '- Fatal for: guaranteed-death actions (headshot, lethal injection, massive exsanguination), AND iatrogenic drug kills (e.g. massive potassium IV push causing cardiac arrest, succinylcholine without ventilation causing asphyxiation, massive insulin without glucose correction causing fatal hypoglycemia, rapid undiluted potassium bolus, 10x dose errors on critical drugs like epinephrine/insulin/opioids).\n' +
        '- "dangerous" (not fatal) for: wrong drug at normal doses, contraindicated meds (e.g. beta-blocker in asthma), moderate dose errors, non-vital gunshots.\n' +
        '- "caution" for: suboptimal choices, minor dose issues, slightly wrong drug class.\n' +
        '- Fear/panic alone cannot kill. The patient must have a physiological mechanism of death.\n' +
        '- If vitals would realistically reach zero (HR 0, SpO2 0) from the action, mark it fatal.\n\n' +
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
        severity = parsed.severity || null;
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

        // Update cached vitals — allow coding (HR/RR/SpO2 can reach 0 for dangerous/fatal actions)
        if (vitalChanges && currentVitals.hr !== undefined) {
          currentVitals.hr = Math.max(0, Math.min(220, (currentVitals.hr || 80) + (vitalChanges.hr || 0)));
          currentVitals.spo2 = Math.max(0, Math.min(100, (currentVitals.spo2 || 98) + (vitalChanges.spo2 || 0)));
          currentVitals.rr = Math.max(0, Math.min(50, (currentVitals.rr || 16) + (vitalChanges.rr || 0)));
          caseData.vitals = currentVitals;
          CacheService.getUserCache().put('pb_' + caseId, JSON.stringify(caseData), 7200);

          // Auto-fatal if vitals crash to incompatible-with-life
          if (currentVitals.hr === 0 || currentVitals.spo2 === 0) {
            return {
              response: '',
              consequence: parsed.consequence || 'Patient has coded.',
              fatal: true,
              causeOfDeath: parsed.causeOfDeath || 'Cardiopulmonary arrest secondary to iatrogenic cause.',
              vitals: { hr: 0, bp: '0/0', rr: 0, temp: currentVitals.temp, spo2: 0 }
            };
          }
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

  // Inject context for patient to react to — but ONLY emotional/physical reactions
  var userMsg = message;
  var systemNote = '';
  if (consequence) {
    systemNote += '\n\n[HIDDEN CONTEXT for patient roleplay only — DO NOT narrate clinical findings, lab values, or interpret results. You are the PATIENT, not the doctor. React ONLY with physical sensations and emotions.';
    systemNote += '\nWhat happened: ' + consequence;
    systemNote += '\nReact naturally — pain, relief, confusion, fear. NEVER say medical terms, NEVER interpret your own test results, NEVER say things like "so that means..." or "looks like a cholestatic picture". You do not understand medicine.]';
  }
  if (testResults) {
    systemNote += '\n[HIDDEN: A test was just performed. The results are shown separately to the student in a card. DO NOT mention the results. You can react to the experience of the test (e.g., "that was cold", "ow that hurt") but NEVER state values, findings, or interpretations.]';
  }
  if (systemNote) userMsg += systemNote;
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
    severity: severity,
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

  var caseJson = CacheService.getUserCache().get('pb_' + caseId);
  var diagnosis = 'unknown';
  if (caseJson) {
    try { diagnosis = JSON.parse(caseJson).diagnosis || 'unknown'; } catch(e) {}
  }

  var prompt = 'You are an MCCQE Part I examiner scoring a clinical encounter using the REAL Canadian medical licensing exam rubric.\n\n' +
    'CORRECT DIAGNOSIS: ' + diagnosis + '\n\n' +
    'Score each domain on a scale of 0-10 using these MCCQE-aligned criteria:\n\n' +
    '1. DATA ACQUISITION (History): Did the student gather essential info?\n' +
    '   - HPI (onset, location, duration, character, severity, aggravating/alleviating, associated symptoms)\n' +
    '   - PMH, medications, allergies\n' +
    '   - Social history (smoking, alcohol, drugs, occupation, sexual health where relevant)\n' +
    '   - Family history\n' +
    '   - Review of systems (targeted to presentation)\n' +
    '   Score 8-10 if thorough, 5-7 if adequate, 0-4 if incomplete\n\n' +
    '2. DATA ACQUISITION (Physical Exam): Did they perform relevant examinations?\n' +
    '   - Focused exam appropriate to the presentation\n' +
    '   - Vital signs checked\n' +
    '   - Key maneuvers for the condition\n\n' +
    '3. PROBLEM SOLVING (Investigations): Did they order the right tests?\n' +
    '   - Appropriate labs, imaging, bedside tests\n' +
    '   - Prioritized correctly (e.g., ECG before CT in chest pain)\n' +
    '   - Didn\'t order unnecessary/harmful tests\n\n' +
    '4. PROBLEM SOLVING (Diagnosis): How close was their clinical reasoning?\n' +
    '   - Correct diagnosis = 10, close = 6-8, wrong system = 0-4\n' +
    '   - Did they consider relevant differentials?\n\n' +
    '5. MANAGEMENT: Did they treat/refer/disposition appropriately?\n' +
    '   - Appropriate initial treatment\n' +
    '   - Correct disposition (admit/discharge/refer)\n' +
    '   - Prescriptions reasonable\n' +
    '   - Follow-up arranged\n' +
    '   Note: Many students skip management entirely — if they never prescribed, referred, or disposed, score LOW.\n\n' +
    '6. COMMUNICATION & PROFESSIONALISM:\n' +
    '   - Introduced themselves, used patient name\n' +
    '   - Empathetic and professional tone\n' +
    '   - Explained findings/plan to patient\n' +
    '   - Did NOT yell, swear at patient, or act unprofessionally\n' +
    '   - Obtained consent before procedures\n\n' +
    '7. PATIENT SAFETY:\n' +
    '   - Addressed red flags (SI, chest pain, airway)\n' +
    '   - Didn\'t harm the patient with wrong meds/procedures\n' +
    '   - ABC approach if emergency\n\n' +
    'TRANSCRIPT:\n' + transcript + '\n\n' +
    'Be HARSH but fair — this is a licensing exam, not participation marks. Real students regularly score 4-6 per domain.\n\n' +
    'GRADE BOUNDARIES (you MUST follow these based on the average of all 7 domain scores):\n' +
    '- A: average 8.0-10.0 (Outstanding — thorough in every domain)\n' +
    '- B: average 6.5-7.9 (Good — solid performance with minor gaps)\n' +
    '- C: average 5.0-6.4 (Adequate — passes but significant areas to improve)\n' +
    '- D: average 3.5-4.9 (Below expectations — would likely fail the OSCE station)\n' +
    '- F: average 0-3.4 (Fail — critical deficiencies, patient safety concerns)\n\n' +
    'Return ONLY JSON:\n' +
    '{"scores": {"history": N, "exam": N, "investigations": N, "diagnosis": N, "management": N, "communication": N, "safety": N}, ' +
    '"overall": N, "grade": "A/B/C/D/F", ' +
    '"strengths": ["specific things from transcript they did well"], ' +
    '"improvements": ["specific things they should have done differently — reference the transcript"], ' +
    '"missed": ["key actions/questions they should have taken for this specific case"], ' +
    '"examTip": "<one practical MCCQE exam tip relevant to this presentation>"}';

  try {
    var response = callAnthropicModel_('claude-sonnet-4-20250514', prompt, [{ role: 'user', content: 'Score this encounter.' }]);
    var jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      var result = JSON.parse(jsonMatch[0]);
      // Enforce grade from actual scores to prevent AI inconsistency
      if (result.scores) {
        var s = result.scores;
        var avg = ((s.history || 0) + (s.exam || 0) + (s.investigations || 0) + (s.diagnosis || 0) + (s.management || 0) + (s.communication || 0) + (s.safety || 0)) / 7;
        result.overall = Math.round(avg * 10) / 10;
        if (avg >= 8.0) result.grade = 'A';
        else if (avg >= 6.5) result.grade = 'B';
        else if (avg >= 5.0) result.grade = 'C';
        else if (avg >= 3.5) result.grade = 'D';
        else result.grade = 'F';
      }
      return result;
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
