from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
import logging
from sklearn.utils import shuffle

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load datasets
try:
    df = pd.read_csv("Training.csv")
    tr = pd.read_csv("Testing.csv")
    logger.info("Datasets loaded successfully.")
    logger.info(f"Training data sample:\n{df.head()}")
    logger.info(f"Testing data sample:\n{tr.head()}")
except Exception as e:
    logger.error(f"Error loading datasets: {e}")
    raise

# Prepare data
l1 = [
    'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
    'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
    'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
    'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
    'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
    'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
    'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
    'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
    'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
    'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
    'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine',
    'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
    'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
    'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria',
    'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances',
    'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding',
    'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum',
    'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads',
    'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails',
    'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
]

# Disease list
disease = [
    'Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction',
    'Peptic ulcer disease', 'AIDS', 'Diabetes', 'Gastroenteritis', 'Bronchial Asthma', 'Hypertension',
    'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)', 'Jaundice', 'Malaria', 'Chicken pox',
    'Dengue', 'Typhoid', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E',
    'Alcoholic hepatitis', 'Tuberculosis', 'Common Cold', 'Pneumonia', 'Dimorphic hemorrhoids (piles)',
    'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism', 'Hypoglycemia', 'Osteoarthritis',
    'Arthritis', '(Vertigo) Paroxysmal Positional Vertigo', 'Acne', 'Urinary tract infection', 'Psoriasis',
    'Impetigo'
]

disease_details = {
    "Fungal infection": {
        "description": "A fungal infection is caused by fungi that invade the skin, nails, or hair.",
        "recommendations": [
            "Use antifungal creams or ointments.",
            "Keep the affected area clean and dry.",
            "Consult a doctor if the infection persists."
        ],
        "tests": [
            "Skin scraping for microscopic examination.",
            "Fungal culture test."
        ]
    },
    "Allergy": {
        "description": "An allergy is an immune system response to a foreign substance that's not typically harmful to your body.",
        "recommendations": [
            "Avoid allergens that trigger your symptoms.",
            "Take antihistamines as prescribed.",
            "Consult an allergist for further testing."
        ],
        "tests": [
            "Skin prick test.",
            "Blood test (IgE levels)."
        ]
    },
    "GERD": {
        "description": "Gastroesophageal reflux disease (GERD) is a chronic condition where stomach acid flows back into the esophagus, causing irritation.",
        "recommendations": [
            "Avoid spicy, fatty, or acidic foods.",
            "Elevate the head of your bed while sleeping.",
            "Consult a gastroenterologist for further diagnosis."
        ],
        "tests": [
            "Endoscopy.",
            "Esophageal pH monitoring."
        ]
    },
    "Chronic cholestasis": {
        "description": "Chronic cholestasis is a condition where bile flow from the liver is reduced or blocked, leading to liver damage.",
        "recommendations": [
            "Consult a hepatologist (liver specialist) for further diagnosis.",
            "Avoid alcohol and fatty foods.",
            "Monitor liver function regularly."
        ],
        "tests": [
            "Liver function tests (LFTs).",
            "Abdominal ultrasound."
        ]
    },
    "Drug Reaction": {
        "description": "A drug reaction occurs when the body has an adverse response to a medication.",
        "recommendations": [
            "Stop taking the medication immediately.",
            "Consult a doctor for further diagnosis.",
            "Monitor for severe symptoms like difficulty breathing."
        ],
        "tests": [
            "Allergy testing.",
            "Blood tests to check for immune response."
        ]
    },
    "Peptic ulcer disease": {
        "description": "Peptic ulcer disease involves sores in the lining of the stomach or the upper part of the small intestine.",
        "recommendations": [
            "Avoid spicy foods and alcohol.",
            "Take prescribed medications like proton pump inhibitors.",
            "Consult a gastroenterologist for further diagnosis."
        ],
        "tests": [
            "Endoscopy.",
            "Helicobacter pylori (H. pylori) test."
        ]
    },
    "AIDS": {
        "description": "Acquired Immunodeficiency Syndrome (AIDS) is a chronic, potentially life-threatening condition caused by the human immunodeficiency virus (HIV).",
        "recommendations": [
            "Follow antiretroviral therapy (ART) as prescribed.",
            "Practice safe sex and avoid sharing needles.",
            "Consult an infectious disease specialist for further diagnosis."
        ],
        "tests": [
            "HIV antibody test.",
            "Viral load test."
        ]
    },
    "Diabetes": {
        "description": "Diabetes is a chronic condition that affects how your body processes blood sugar (glucose).",
        "recommendations": [
            "Monitor blood sugar levels regularly.",
            "Follow a healthy diet and exercise routine.",
            "Consult an endocrinologist for further diagnosis."
        ],
        "tests": [
            "Fasting blood sugar test.",
            "HbA1c test."
        ]
    },
    "Gastroenteritis": {
        "description": "Gastroenteritis is an inflammation of the stomach and intestines, typically due to infection.",
        "recommendations": [
            "Stay hydrated and drink plenty of fluids.",
            "Avoid solid foods until vomiting stops.",
            "Consult a doctor if symptoms persist."
        ],
        "tests": [
            "Stool test for pathogens.",
            "Blood tests to check for dehydration."
        ]
    },
    "Bronchial Asthma": {
        "description": "Bronchial asthma is a chronic inflammatory disease of the airways that causes wheezing, breathlessness, and coughing.",
        "recommendations": [
            "Use inhalers as prescribed.",
            "Avoid triggers like smoke, pollen, and dust.",
            "Consult a pulmonologist for further diagnosis."
        ],
        "tests": [
            "Spirometry.",
            "Peak flow test."
        ]
    },
    "Hypertension": {
        "description": "Hypertension (high blood pressure) is a condition where the force of blood against the artery walls is too high.",
        "recommendations": [
            "Follow a low-sodium diet and exercise regularly.",
            "Take prescribed blood pressure medications.",
            "Consult a cardiologist for further diagnosis."
        ],
        "tests": [
            "Blood pressure measurement.",
            "Blood tests to check for underlying conditions."
        ]
    },
    "Migraine": {
        "description": "A migraine is a severe headache often accompanied by nausea, vomiting, and sensitivity to light and sound.",
        "recommendations": [
            "Avoid triggers like stress, certain foods, and lack of sleep.",
            "Take prescribed migraine medications.",
            "Consult a neurologist for further diagnosis."
        ],
        "tests": [
            "Neurological examination.",
            "MRI or CT scan to rule out other conditions."
        ]
    },
    "Cervical spondylosis": {
        "description": "Cervical spondylosis is a degenerative condition affecting the neck vertebrae and discs.",
        "recommendations": [
            "Practice good posture and neck exercises.",
            "Use pain relievers as prescribed.",
            "Consult an orthopedic specialist for further diagnosis."
        ],
        "tests": [
            "X-ray of the cervical spine.",
            "MRI or CT scan."
        ]
    },
    "Paralysis (brain hemorrhage)": {
        "description": "Paralysis due to brain hemorrhage occurs when bleeding in the brain damages nerve cells, leading to loss of muscle function.",
        "recommendations": [
            "Seek immediate medical attention.",
            "Follow a rehabilitation program as prescribed.",
            "Consult a neurologist for further diagnosis."
        ],
        "tests": [
            "CT scan or MRI of the brain.",
            "Neurological examination."
        ]
    },
    "Jaundice": {
        "description": "Jaundice is a condition where the skin and eyes turn yellow due to high bilirubin levels in the blood.",
        "recommendations": [
            "Avoid alcohol and fatty foods.",
            "Stay hydrated and rest.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Liver function tests (LFTs).",
            "Bilirubin level test."
        ]
    },
    "Malaria": {
        "description": "Malaria is a mosquito-borne infectious disease that causes fever, chills, and flu-like symptoms.",
        "recommendations": [
            "Take antimalarial medications as prescribed.",
            "Use mosquito nets and repellents to prevent bites.",
            "Consult an infectious disease specialist for further diagnosis."
        ],
        "tests": [
            "Blood smear test.",
            "Rapid diagnostic test (RDT)."
        ]
    },
    "Chicken pox": {
        "description": "Chicken pox is a highly contagious viral infection characterized by an itchy rash and red spots or blisters.",
        "recommendations": [
            "Keep the skin clean and avoid scratching.",
            "Use calamine lotion to relieve itching.",
            "Consult a doctor for antiviral medication."
        ],
        "tests": [
            "Clinical examination of the rash.",
            "PCR test for varicella-zoster virus."
        ]
    },
    "Dengue": {
        "description": "Dengue is a mosquito-borne viral infection that causes high fever, severe headache, and joint pain.",
        "recommendations": [
            "Stay hydrated and rest.",
            "Avoid aspirin and use paracetamol for fever.",
            "Consult a doctor if symptoms worsen."
        ],
        "tests": [
            "NS1 antigen test.",
            "Dengue IgM and IgG antibody tests."
        ]
    },
    "Typhoid": {
        "description": "Typhoid is a bacterial infection caused by Salmonella typhi, leading to high fever, abdominal pain, and weakness.",
        "recommendations": [
            "Take antibiotics as prescribed.",
            "Maintain good hygiene and drink clean water.",
            "Consult a doctor for further diagnosis."
        ],
        "tests": [
            "Widal test.",
            "Blood culture test."
        ]
    },
    "Hepatitis A": {
        "description": "Hepatitis A is a viral infection that affects the liver and is spread through contaminated food or water.",
        "recommendations": [
            "Get vaccinated against Hepatitis A.",
            "Avoid alcohol and fatty foods.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Hepatitis A IgM antibody test.",
            "Liver function tests (LFTs)."
        ]
    },
    "Hepatitis B": {
        "description": "Hepatitis B is a viral infection that attacks the liver and can cause both acute and chronic disease.",
        "recommendations": [
            "Get vaccinated against Hepatitis B.",
            "Avoid alcohol and fatty foods.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Hepatitis B surface antigen (HBsAg) test.",
            "Liver function tests (LFTs)."
        ]
    },
    "Hepatitis C": {
        "description": "Hepatitis C is a viral infection that causes liver inflammation and can lead to serious liver damage.",
        "recommendations": [
            "Avoid sharing needles or personal items like razors.",
            "Take antiviral medications as prescribed.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Hepatitis C antibody test.",
            "HCV RNA test."
        ]
    },
    "Hepatitis D": {
        "description": "Hepatitis D is a viral infection that occurs only in people who are also infected with Hepatitis B.",
        "recommendations": [
            "Get vaccinated against Hepatitis B to prevent Hepatitis D.",
            "Avoid alcohol and fatty foods.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Hepatitis D antibody test.",
            "Liver function tests (LFTs)."
        ]
    },
    "Hepatitis E": {
        "description": "Hepatitis E is a viral infection that affects the liver and is spread through contaminated water.",
        "recommendations": [
            "Drink clean and safe water.",
            "Avoid alcohol and fatty foods.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Hepatitis E IgM antibody test.",
            "Liver function tests (LFTs)."
        ]
    },
    "Alcoholic hepatitis": {
        "description": "Alcoholic hepatitis is liver inflammation caused by excessive alcohol consumption.",
        "recommendations": [
            "Stop drinking alcohol immediately.",
            "Follow a healthy diet and lifestyle.",
            "Consult a hepatologist for further diagnosis."
        ],
        "tests": [
            "Liver function tests (LFTs).",
            "Abdominal ultrasound."
        ]
    },
    "Tuberculosis": {
        "description": "Tuberculosis (TB) is a bacterial infection that primarily affects the lungs but can spread to other organs.",
        "recommendations": [
            "Take prescribed antibiotics for the full course.",
            "Practice good hygiene and cover your mouth when coughing.",
            "Consult an infectious disease specialist for further diagnosis."
        ],
        "tests": [
            "Tuberculin skin test (TST).",
            "Sputum test for acid-fast bacilli (AFB)."
        ]
    },
    "Common Cold": {
        "description": "The common cold is a viral infection of the upper respiratory tract, causing symptoms like a runny nose and sore throat.",
        "recommendations": [
            "Stay hydrated and rest.",
            "Use over-the-counter cold medications.",
            "Consult a doctor if symptoms persist."
        ],
        "tests": [
            "Clinical examination.",
            "No specific test required."
        ]
    },
    "Pneumonia": {
        "description": "Pneumonia is an infection that inflames the air sacs in one or both lungs, causing cough, fever, and difficulty breathing.",
        "recommendations": [
            "Take prescribed antibiotics.",
            "Stay hydrated and rest.",
            "Consult a pulmonologist for further diagnosis."
        ],
        "tests": [
            "Chest X-ray.",
            "Sputum culture."
        ]
    },
    "Dimorphic hemorrhoids (piles)": {
        "description": "Hemorrhoids are swollen veins in the lower rectum and anus, causing discomfort and bleeding.",
        "recommendations": [
            "Eat a high-fiber diet and stay hydrated.",
            "Use over-the-counter creams or ointments.",
            "Consult a gastroenterologist for further diagnosis."
        ],
        "tests": [
            "Digital rectal examination.",
            "Anoscopy."
        ]
    },
    "Heart attack": {
        "description": "A heart attack occurs when blood flow to the heart is blocked, causing damage to the heart muscle.",
        "recommendations": [
            "Seek immediate medical attention.",
            "Follow a heart-healthy diet and lifestyle.",
            "Consult a cardiologist for further diagnosis."
        ],
        "tests": [
            "Electrocardiogram (ECG).",
            "Cardiac enzyme tests."
        ]
    },
    "Varicose veins": {
        "description": "Varicose veins are swollen, twisted veins that are visible just under the surface of the skin.",
        "recommendations": [
            "Wear compression stockings.",
            "Elevate your legs to reduce swelling.",
            "Consult a vascular specialist for further diagnosis."
        ],
        "tests": [
            "Doppler ultrasound.",
            "Venography."
        ]
    },
    "Hypothyroidism": {
        "description": "Hypothyroidism is a condition where the thyroid gland does not produce enough thyroid hormone.",
        "recommendations": [
            "Take prescribed thyroid hormone replacement therapy.",
            "Follow a healthy diet and exercise routine.",
            "Consult an endocrinologist for further diagnosis."
        ],
        "tests": [
            "Thyroid-stimulating hormone (TSH) test.",
            "Free T4 test."
        ]
    },
    "Hyperthyroidism": {
        "description": "Hyperthyroidism is a condition where the thyroid gland produces too much thyroid hormone.",
        "recommendations": [
            "Take prescribed antithyroid medications.",
            "Avoid iodine-rich foods.",
            "Consult an endocrinologist for further diagnosis."
        ],
        "tests": [
            "Thyroid-stimulating hormone (TSH) test.",
            "Free T4 and T3 tests."
        ]
    },
    "Hypoglycemia": {
        "description": "Hypoglycemia is a condition where blood sugar levels drop too low, causing symptoms like dizziness and confusion.",
        "recommendations": [
            "Eat small, frequent meals.",
            "Carry a source of fast-acting sugar (e.g., glucose tablets).",
            "Consult an endocrinologist for further diagnosis."
        ],
        "tests": [
            "Blood glucose test.",
            "Fasting blood sugar test."
        ]
    },
    "Osteoarthritis": {
        "description": "Osteoarthritis is a degenerative joint disease that causes pain, stiffness, and swelling in the joints.",
        "recommendations": [
            "Maintain a healthy weight to reduce joint stress.",
            "Use pain relievers and anti-inflammatory medications.",
            "Consult an orthopedic specialist for further diagnosis."
        ],
        "tests": [
            "X-ray of the affected joint.",
            "MRI or CT scan."
        ]
    },
    "Arthritis": {
        "description": "Arthritis is inflammation of the joints, causing pain and stiffness.",
        "recommendations": [
            "Exercise regularly to maintain joint flexibility.",
            "Use pain relievers and anti-inflammatory medications.",
            "Consult a rheumatologist for further diagnosis."
        ],
        "tests": [
            "Blood tests (e.g., rheumatoid factor, anti-CCP).",
            "X-ray or MRI of the affected joints."
        ]
    },
    "(Vertigo) Paroxysmal Positional Vertigo": {
        "description": "Vertigo is a sensation of spinning or dizziness, often caused by inner ear problems.",
        "recommendations": [
            "Perform vestibular rehabilitation exercises.",
            "Avoid sudden head movements.",
            "Consult an ENT specialist for further diagnosis."
        ],
        "tests": [
            "Dix-Hallpike maneuver.",
            "Videonystagmography (VNG)."
        ]
    },
    "Acne": {
        "description": "Acne is a skin condition that occurs when hair follicles become clogged with oil and dead skin cells.",
        "recommendations": [
            "Wash your face twice daily with a gentle cleanser.",
            "Use over-the-counter acne treatments.",
            "Consult a dermatologist for further diagnosis."
        ],
        "tests": [
            "Clinical examination.",
            "No specific test required."
        ]
    },
    "Urinary tract infection": {
        "description": "A urinary tract infection (UTI) is an infection in any part of the urinary system, including kidneys, bladder, or urethra.",
        "recommendations": [
            "Drink plenty of water to flush out bacteria.",
            "Take prescribed antibiotics.",
            "Consult a urologist for further diagnosis."
        ],
        "tests": [
            "Urinalysis.",
            "Urine culture."
        ]
    },
    "Psoriasis": {
        "description": "Psoriasis is a chronic skin condition that causes red, itchy, and scaly patches.",
        "recommendations": [
            "Use topical treatments like corticosteroids.",
            "Avoid triggers like stress and alcohol.",
            "Consult a dermatologist for further diagnosis."
        ],
        "tests": [
            "Clinical examination.",
            "Skin biopsy."
        ]
    },
    "Impetigo": {
        "description": "Impetigo is a highly contagious skin infection that causes red sores and blisters.",
        "recommendations": [
            "Keep the affected area clean and dry.",
            "Use prescribed antibiotic creams or ointments.",
            "Consult a dermatologist for further diagnosis."
        ],
        "tests": [
            "Clinical examination.",
            "Bacterial culture from the sores."
        ]
    }
}

# Create disease to integer mapping
disease_to_int = {disease: i for i, disease in enumerate(disease)}

# Map prognosis to integers
try:
    df = pd.read_csv("Training.csv")
    tr = pd.read_csv("Testing.csv")
    logger.info("Datasets loaded successfully.")
except Exception as e:
    logger.error(f"Error loading datasets: {e}")
    raise

# Data cleaning pipeline
def clean_prognosis(dataframe):
    # Convert to string and clean
    df_clean = dataframe.copy()
    df_clean['prognosis'] = df_clean['prognosis'].astype(str).str.strip()
    df_clean['prognosis'] = df_clean['prognosis'].replace(['', 'nan'], np.nan)
    df_clean = df_clean.dropna(subset=['prognosis'])
    df_clean = df_clean[df_clean['prognosis'].isin(disease)]
    return df_clean

df = clean_prognosis(df)
tr = clean_prognosis(tr)

# Create mapping and convert to integers
disease_to_int = {d: i for i, d in enumerate(disease)}
df['prognosis'] = df['prognosis'].map(disease_to_int).astype(int)
tr['prognosis'] = tr['prognosis'].map(disease_to_int).astype(int)

# Verify no NaN values remain
assert df['prognosis'].isna().sum() == 0
assert tr['prognosis'].isna().sum() == 0

# Shuffle data to avoid order bias
df = shuffle(df, random_state=42)
tr = shuffle(tr, random_state=42)

# For memory optimization
df = df.sample(frac=0.7, random_state=42) if len(df) > 2000 else df
tr = tr.sample(frac=0.7, random_state=42) if len(tr) > 500 else tr

# Prepare features and target
X = df[l1]
y = df["prognosis"].values.ravel()

X_test = tr[l1]
y_test = tr["prognosis"].values.ravel()

# Train models
try:
    logger.info("Training models...")
    clf3 = DecisionTreeClassifier(max_depth=5, random_state=42)
    clf3.fit(X, y)
    
    clf4 = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    clf4.fit(X, y)
    
    gnb = GaussianNB()
    gnb.fit(X, y)
    logger.info("Models trained successfully")
except Exception as e:
    logger.error(f"Error training models: {e}")
    raise

# Flask routes
@app.route('/')
def home():
    return "Welcome to the Symptom Checker API! Use the /api/predict endpoint for diagnosis."

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        logger.info("Received request to /api/predict")
        data = request.json
        symptoms = data.get('symptoms', [])
        logger.info(f"Symptoms received: {symptoms}")

        if not symptoms:
            logger.warning("No symptoms provided in the input.")
            return jsonify({"error": "No symptoms provided"}), 400

        # Initialize the symptom vector
        l2 = [0] * len(l1)
        for symptom in symptoms:
            if symptom in l1:
                l2[l1.index(symptom)] = 1
                logger.info(f"Mapped symptom: {symptom} to index {l1.index(symptom)}")
            else:
                logger.warning(f"Symptom not found in list: {symptom}")

        # Convert input_test to a DataFrame with feature names
        input_test_df = pd.DataFrame([l2], columns=l1)
        logger.info(f"Input data for prediction: {input_test_df}")

        # Predict using all models
        dt_pred = int(clf3.predict(input_test_df)[0])
        rf_pred = int(clf4.predict(input_test_df)[0])
        nb_pred = int(gnb.predict(input_test_df)[0])
        logger.info(f"Predictions - Decision Tree: {dt_pred}, Random Forest: {rf_pred}, Naive Bayes: {nb_pred}")

        # Create a list of possible conditions
        possible_conditions = []
        for model_name, pred in [("Decision Tree", dt_pred), ("Random Forest", rf_pred), ("Naive Bayes", nb_pred)]:
            disease_name = disease[pred]
            details = disease_details.get(disease_name, {})
            logger.info(f"Disease details for {disease_name}: {details}")
            possible_conditions.append({
                "name": disease_name,
                "description": details.get("description", "No description available"),
                "recommendations": details.get("recommendations", []),
                "tests": details.get("tests", []),
                "urgency": "medium"  # Default urgency
            })

        # Return the response
        return jsonify({
            "success": True,
            "message": "Diagnosis completed",
            "possibleConditions": possible_conditions,
            "disclaimer": "This is an AI-assisted diagnosis and should not replace professional medical advice."
        })
    except Exception as e:
        logger.error(f"Error in /api/predict endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)