import mongoose from 'mongoose';
import Ailment from  "../models/ailment.model.js"
import slugify from "../utils/slugify.js";
const ailments = [
    { name: 'Acid Reflux', description: 'Burning sensation in the chest due to stomach acid.' },
    { name: 'Diarrhea', description: 'Frequent, loose, or watery bowel movements.' },
    { name: 'Irritable Bowel Syndrome', description: 'Chronic digestive disorder with abdominal pain.' },
    { name: 'Bloating', description: 'Feeling of fullness or swelling in the abdomen.' },
    { name: 'Ulcers', description: 'Sores in the stomach or intestinal lining.' },
    { name: 'Crohn\'s Disease', description: 'Chronic inflammatory bowel disease.' },
    { name: 'Colitis', description: 'Inflammation of the colon.' },
    { name: 'Gas', description: 'Excessive air in the digestive tract.' },
    { name: 'Asthma', description: 'Chronic respiratory condition with airway narrowing.' },
    { name: 'Common Cold', description: 'Viral infection causing nasal congestion and cough.' },
    { name: 'Cough', description: 'Persistent reflex to clear the airways.' },
    { name: 'Sinusitis', description: 'Inflammation of the sinuses.' },
    { name: 'Allergic Rhinitis', description: 'Nasal allergies triggered by allergens.' },
    { name: 'Wheezing', description: 'High-pitched sound during breathing.' },
    { name: 'Shortness of Breath', description: 'Difficulty breathing or feeling breathless.' },
    { name: 'Flu', description: 'Viral infection with fever and body aches.' },
    { name: 'Acne', description: 'Skin condition with pimples and clogged pores.' },
    { name: 'Rosacea', description: 'Chronic skin condition causing facial redness.' },
    { name: 'Dry Skin', description: 'Rough, flaky, or itchy skin.' },
    { name: 'Oily Skin', description: 'Excess sebum production on the skin.' },
    { name: 'Wrinkles', description: 'Lines or creases on the skin due to aging.' },
    { name: 'Sunburn', description: 'Red, painful skin from UV exposure.' },
    { name: 'Skin Allergies', description: 'Skin reactions to allergens.' },
    { name: 'Fungal Infections', description: 'Skin infections caused by fungi.' },
    { name: 'High Cholesterol', description: 'Elevated lipid levels in the blood.' },
    { name: 'Poor Circulation', description: 'Reduced blood flow to body parts.' },
    { name: 'Varicose Veins', description: 'Swollen, twisted veins under the skin.' },
    { name: 'Palpitations', description: 'Irregular or rapid heartbeats.' },
    { name: 'Menstrual Cramps', description: 'Pain during menstruation.' },
    { name: 'PMS', description: 'Symptoms before menstruation like mood swings.' },
    { name: 'Menopause Symptoms', description: 'Symptoms like hot flashes during menopause.' },
    { name: 'Irregular Periods', description: 'Abnormal menstrual cycle timing.' },
    { name: 'PCOS', description: 'Hormonal disorder causing ovarian cysts.' },
    { name: 'Vaginal Dryness', description: 'Lack of moisture in the vaginal area.' },
    { name: 'Yeast Infections', description: 'Fungal infection in the vaginal area.' },
    { name: 'Urinary Tract Infections', description: 'Infection in the urinary system.' },
    { name: 'Hormonal Imbalance', description: 'Disruption in hormone levels.' },
    { name: 'Low Testosterone', description: 'Reduced testosterone levels in men.' },
    { name: 'Prostate Health', description: 'Issues related to prostate function.' },
    { name: 'Hair Loss (Male)', description: 'Male pattern baldness or hair thinning.' },
    { name: 'Low Libido', description: 'Reduced sexual desire.' },
    { name: 'Premature Ejaculation', description: 'Early ejaculation during sexual activity.' },
    { name: 'Muscle Weakness', description: 'Reduced muscle strength.' },
    { name: 'Fatigue (Men)', description: 'Persistent tiredness in men.' },
    { name: 'Frequent Colds', description: 'Recurring viral infections.' },
    { name: 'Chronic Fatigue', description: 'Long-term, severe tiredness.' },
    { name: 'Low Immunity', description: 'Weakened immune system.' },
    { name: 'Allergies', description: 'Hypersensitivity to substances.' },
    { name: 'Cold Sores', description: 'Viral sores around the mouth.' },
    { name: 'Fever', description: 'Elevated body temperature.' },
    { name: 'Post-Viral Fatigue', description: 'Fatigue following a viral infection.' },
    { name: 'Immune Support', description: 'Boosting immune system function.' },
    { name: 'Back Pain', description: 'Pain in the lower or upper back.' },
    { name: 'Joint Pain', description: 'Pain in the joints.' },
    { name: 'Muscle Soreness', description: 'Muscle pain after activity.' },
    { name: 'Tendonitis', description: 'Inflammation of a tendon.' },
    { name: 'Neck Pain', description: 'Pain or stiffness in the neck.' },
    { name: 'Fibromyalgia', description: 'Chronic pain and fatigue disorder.' },
    { name: 'Cramps', description: 'Sudden muscle contractions.' },
    { name: 'Sciatica', description: 'Pain along the sciatic nerve.' },
    { name: 'Insomnia', description: 'Difficulty falling or staying asleep.' },
    { name: 'Sleep Apnea', description: 'Breathing interruptions during sleep.' },
    { name: 'Daytime Fatigue', description: 'Tiredness during the day.' },
    { name: 'Low Energy', description: 'Lack of physical or mental energy.' },
    { name: 'Restless Legs', description: 'Uncontrollable urge to move legs.' },
    { name: 'Night Sweats', description: 'Excessive sweating during sleep.' },
    { name: 'Jet Lag', description: 'Disrupted sleep from time zone changes.' },
    { name: 'Oversleeping', description: 'Sleeping longer than needed.' },
    { name: 'Grogginess', description: 'Feeling sluggish after waking.' },
    { name: 'Poor Sleep Quality', description: 'Non-restorative sleep.' },
    { name: 'Hair Loss', description: 'General hair thinning or loss.' },
    { name: 'Dandruff', description: 'Flaky scalp condition.' },
    { name: 'Dry Scalp', description: 'Itchy, dry scalp.' },
    { name: 'Oily Scalp', description: 'Excess oil on the scalp.' },
    { name: 'Itchy Scalp', description: 'Persistent scalp itching.' },
    { name: 'Thinning Hair', description: 'Gradual hair volume reduction.' },
    { name: 'Brittle Hair', description: 'Dry, easily breakable hair.' },
    { name: 'Premature Graying', description: 'Early onset of gray hair.' },
    { name: 'Alopecia', description: 'Patchy or complete hair loss.' },
    { name: 'Pollen Allergy', description: 'Allergic reaction to pollen.' },
    { name: 'Food Sensitivity', description: 'Adverse reaction to certain foods.' },
    { name: 'Pet Allergy', description: 'Allergic reaction to pet dander.' },
    { name: 'Mold Allergy', description: 'Allergic reaction to mold spores.' },
    { name: 'Dust Allergy', description: 'Allergic reaction to dust mites.' },
    { name: 'Lactose Intolerance', description: 'Inability to digest lactose.' },
    { name: 'Gluten Sensitivity', description: 'Adverse reaction to gluten.' },
    { name: 'Seasonal Allergies', description: 'Allergies triggered by seasons.' },
    { name: 'Chemical Sensitivities', description: 'Reactions to chemical substances.' },
    { name: 'UTI', description: 'Infection in the urinary tract.' },
    { name: 'Kidney Stones', description: 'Hard deposits in the kidneys.' },
    { name: 'Frequent Urination', description: 'Need to urinate often.' },
    { name: 'Bladder Infections', description: 'Infections in the bladder.' },
    { name: 'Incontinence', description: 'Loss of bladder control.' },
    { name: 'Painful Urination', description: 'Discomfort during urination.' },
    { name: 'Nocturia', description: 'Frequent urination at night.' },
    { name: 'Urinary Retention', description: 'Inability to fully empty the bladder.' },
    { name: 'Protein in Urine', description: 'Excess protein in the urine.' },
    { name: 'Adrenal Fatigue', description: 'Fatigue from adrenal dysfunction.' },
    { name: 'Hormonal Acne', description: 'Acne caused by hormonal changes.' },
    { name: 'Blood Sugar Imbalance', description: 'Irregular blood glucose levels.' },
    { name: 'Cortisol Imbalance', description: 'Disrupted cortisol levels.' },
    { name: 'Estrogen Dominance', description: 'Excess estrogen relative to other hormones.' },
    { name: 'Testosterone Imbalance', description: 'Irregular testosterone levels.' },
    { name: 'Toothache', description: 'Pain in or around a tooth.' },
    { name: 'Gum Disease', description: 'Infection or inflammation of the gums.' },
    { name: 'Bad Breath', description: 'Persistent unpleasant mouth odor.' },
    { name: 'Cavities', description: 'Tooth decay causing holes in teeth.' },
    { name: 'Tooth Sensitivity', description: 'Discomfort from hot, cold, or sweet foods.' },
    { name: 'Mouth Ulcers', description: 'Painful sores in the mouth.' },
    { name: 'Dry Mouth', description: 'Lack of saliva production.' },
    { name: 'Bleeding Gums', description: 'Gums that bleed during brushing.' },
    { name: 'Receding Gums', description: 'Gums pulling away from teeth.' },
    { name: 'Plaque Buildup', description: 'Sticky film on teeth causing decay.' },
    { name: 'Liver Support', description: 'Enhancing liver function.' },
    { name: 'Fatty Liver', description: 'Excess fat in the liver.' },
    { name: 'Bile Flow Issues', description: 'Problems with bile production or flow.' },
    { name: 'Liver Inflammation', description: 'Inflammation of the liver tissue.' },
    { name: 'Gallstones', description: 'Hardened deposits in the gallbladder.' },
    { name: 'Jaundice', description: 'Yellowing of skin due to liver issues.' },
    { name: 'Dry Eyes', description: 'Lack of moisture in the eyes.' },
    { name: 'Eye Strain', description: 'Discomfort from prolonged eye use.' },
    { name: 'Night Blindness', description: 'Difficulty seeing in low light.' },
    { name: 'Red Eyes', description: 'Bloodshot or irritated eyes.' },
    { name: 'Watery Eyes', description: 'Excessive tear production.' },
    { name: 'Twitching Eyelid', description: 'Involuntary eyelid spasms.' },
    { name: 'Floaters', description: 'Spots or threads in vision.' },
    { name: 'Ear Infections', description: 'Infections in the ear canal or middle ear.' },
    { name: 'Tinnitus', description: 'Ringing or buzzing in the ears.' },
    { name: 'Sore Throat', description: 'Pain or irritation in the throat.' },
    { name: 'Post-Nasal Drip', description: 'Mucus dripping down the throat.' },
    { name: 'Hoarseness', description: 'Rough or strained voice.' },
    { name: 'Tonsillitis', description: 'Inflammation of the tonsils.' },
    { name: 'Snoring', description: 'Noisy breathing during sleep.' },
    { name: 'Dry Throat', description: 'Lack of moisture in the throat.' },
    { name: 'Loss of Smell', description: 'Reduced or absent sense of smell.' },
    { name: 'Migraines', description: 'Severe headaches with sensory symptoms.' },
    { name: 'Headaches', description: 'Pain in the head region.' },
    { name: 'Tremors', description: 'Involuntary shaking or trembling.' },
    { name: 'Vertigo', description: 'Sensation of spinning or dizziness.' },
    { name: 'Memory Loss', description: 'Difficulty recalling information.' },
    { name: 'Concentration Issues', description: 'Trouble focusing or staying attentive.' },
    { name: 'Weight Loss', description: 'Efforts to reduce body weight.' },
    { name: 'Immune Boost', description: 'Enhancing immune system function.' },
    { name: 'Anti-Aging', description: 'Efforts to reduce aging effects.' },
    { name: 'Hydration', description: 'Maintaining proper body fluid levels.' },
    { name: 'Nutrient Deficiency', description: 'Lack of essential vitamins or minerals.' },
    { name: 'Metabolism Boost', description: 'Increasing metabolic rate.' },
    { name: 'Chronic Inflammation', description: 'Persistent body inflammation.' },
    { name: 'Stress Relief', description: 'Reducing mental or physical stress.' },
    { name: 'Longevity', description: 'Promoting a longer, healthier life.' }
];

async function seedAilments() {
  try {
    await mongoose.connect('mongodb://localhost:27017/remedy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
     

    const existingAilments = await Ailment.find({}, 'name slug').lean();
    const existingNames = new Set(existingAilments.map(a => a.name));
    const existingSlugs = new Set(existingAilments.map(a => a.slug));

    const ailmentsToInsert = [];

    for (const ailment of ailments) {
      const name = ailment.name.trim();
      const slug = slugify(name, { lower: true, strict: true });

      if (existingNames.has(name) || existingSlugs.has(slug)) {
        console.log(`⏭️ Skipping duplicate: ${name}`);
        continue;
      }

      ailmentsToInsert.push({ ...ailment, slug });
      existingNames.add(name);
      existingSlugs.add(slug);
    }

    if (ailmentsToInsert.length > 0) {
      await Ailment.insertMany(ailmentsToInsert);
      console.log(`✅ ${ailmentsToInsert.length} new ailments seeded successfully!`);
    } else {
      console.log('⚠️ No new ailments to seed; all already exist.');
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding ailments:', err);
    process.exit(1);
  }
}

seedAilments();