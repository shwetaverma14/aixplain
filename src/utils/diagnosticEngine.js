// Function to diagnose based on symptoms
export const diagnoseFromSymptoms = async (symptoms) => {
  try {
    if (!symptoms || symptoms.length === 0) {
      return {
        success: false,
        message: 'No symptoms provided',
        possibleConditions: [],
      };
    }

    const response = await fetch('https://aixplain-zmis.onrender.com/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Backend Response:", data);

    if (!data || !data.possibleConditions) {
      throw new Error('Invalid response from the AI model');
    }

    // Function to determine urgency level
    const determineUrgency = (conditionName) => {
      const highUrgencyDiseases = [
        "Heart attack", "Paralysis (brain hemorrhage)", "AIDS", "Hepatitis B", "Hepatitis C", 
        "Hepatitis D", "Hepatitis E", "Alcoholic hepatitis", "Tuberculosis", "Pneumonia"
      ];
      
      const mediumUrgencyDiseases = [
        "Diabetes", "Hypertension", "Migraine", "Cervical spondylosis", "Jaundice", "Malaria",
        "Dengue", "Typhoid", "Hepatitis A", "Bronchial Asthma", "GERD", "Gastroenteritis",
        "Urinary tract infection", "Psoriasis", "Peptic ulcer disease", "Arthritis", "Osteoarthritis"
      ];
      
      if (highUrgencyDiseases.includes(conditionName)) return "high";
      if (mediumUrgencyDiseases.includes(conditionName)) return "medium";
      return "low";
    };

    // Process the conditions from the backend
    const possibleConditions = data.possibleConditions.map(condition => ({
      name: condition.name,
      description: condition.description || "No description available",
      recommendations: condition.recommendations || [],
      tests: condition.tests || [],
      urgency: determineUrgency(condition.name),
    }));

    return {
      success: true,
      message: 'Diagnosis completed',
      possibleConditions,
      disclaimer: 'This is an AI-assisted diagnosis and should not replace professional medical advice. Please consult a healthcare professional for confirmation.',
    };
  } catch (error) {
    console.error('Error diagnosing symptoms:', error);
    return {
      success: false,
      message: 'An error occurred while diagnosing. Please try again.',
      possibleConditions: [],
    };
  }
};

// Get all available symptoms for the UI
export const getAllSymptoms = () => {
  return [
    { id: 'back_pain', name: 'Back Pain' },
    { id: 'constipation', name: 'Constipation' },
    { id: 'abdominal_pain', name: 'Abdominal Pain' },
    { id: 'diarrhoea', name: 'Diarrhoea' },
    { id: 'mild_fever', name: 'Mild Fever' },
    { id: 'yellow_urine', name: 'Yellow Urine' },
    { id: 'yellowing_of_eyes', name: 'Yellowing of Eyes' },
    { id: 'acute_liver_failure', name: 'Acute Liver Failure' },
    { id: 'fluid_overload', name: 'Fluid Overload' },
    { id: 'swelling_of_stomach', name: 'Swelling of Stomach' },
    { id: 'swelled_lymph_nodes', name: 'Swelled Lymph Nodes' },
    { id: 'malaise', name: 'Malaise' },
    { id: 'blurred_and_distorted_vision', name: 'Blurred and Distorted Vision' },
    { id: 'phlegm', name: 'Phlegm' },
    { id: 'throat_irritation', name: 'Throat Irritation' },
    { id: 'redness_of_eyes', name: 'Redness of Eyes' },
    { id: 'sinus_pressure', name: 'Sinus Pressure' },
    { id: 'runny_nose', name: 'Runny Nose' },
    { id: 'congestion', name: 'Congestion' },
    { id: 'chest_pain', name: 'Chest Pain' },
    { id: 'weakness_in_limbs', name: 'Weakness in Limbs' },
    { id: 'fast_heart_rate', name: 'Fast Heart Rate' },
    { id: 'pain_during_bowel_movements', name: 'Pain During Bowel Movements' },
    { id: 'pain_in_anal_region', name: 'Pain in Anal Region' },
    { id: 'bloody_stool', name: 'Bloody Stool' },
    { id: 'irritation_in_anus', name: 'Irritation in Anus' },
    { id: 'neck_pain', name: 'Neck Pain' },
    { id: 'dizziness', name: 'Dizziness' },
    { id: 'cramps', name: 'Cramps' },
    { id: 'bruising', name: 'Bruising' },
    { id: 'obesity', name: 'Obesity' },
    { id: 'swollen_legs', name: 'Swollen Legs' },
    { id: 'swollen_blood_vessels', name: 'Swollen Blood Vessels' },
    { id: 'puffy_face_and_eyes', name: 'Puffy Face and Eyes' },
    { id: 'enlarged_thyroid', name: 'Enlarged Thyroid' },
    { id: 'brittle_nails', name: 'Brittle Nails' },
    { id: 'swollen_extremeties', name: 'Swollen Extremities' },
    { id: 'excessive_hunger', name: 'Excessive Hunger' },
    { id: 'extra_marital_contacts', name: 'Extra Marital Contacts' },
    { id: 'drying_and_tingling_lips', name: 'Drying and Tingling Lips' },
    { id: 'slurred_speech', name: 'Slurred Speech' },
    { id: 'knee_pain', name: 'Knee Pain' },
    { id: 'hip_joint_pain', name: 'Hip Joint Pain' },
    { id: 'muscle_weakness', name: 'Muscle Weakness' },
    { id: 'stiff_neck', name: 'Stiff Neck' },
    { id: 'swelling_joints', name: 'Swelling Joints' },
    { id: 'movement_stiffness', name: 'Movement Stiffness' },
    { id: 'spinning_movements', name: 'Spinning Movements' },
    { id: 'loss_of_balance', name: 'Loss of Balance' },
    { id: 'unsteadiness', name: 'Unsteadiness' },
    { id: 'weakness_of_one_body_side', name: 'Weakness of One Body Side' },
    { id: 'loss_of_smell', name: 'Loss of Smell' },
    { id: 'bladder_discomfort', name: 'Bladder Discomfort' },
    { id: 'foul_smell_of_urine', name: 'Foul Smell of Urine' },
    { id: 'continuous_feel_of_urine', name: 'Continuous Feel of Urine' },
    { id: 'passage_of_gases', name: 'Passage of Gases' },
    { id: 'internal_itching', name: 'Internal Itching' },
    { id: 'toxic_look_(typhos)', name: 'Toxic Look (Typhos)' },
    { id: 'depression', name: 'Depression' },
    { id: 'irritability', name: 'Irritability' },
    { id: 'muscle_pain', name: 'Muscle Pain' },
    { id: 'altered_sensorium', name: 'Altered Sensorium' },
    { id: 'red_spots_over_body', name: 'Red Spots Over Body' },
    { id: 'belly_pain', name: 'Belly Pain' },
    { id: 'abnormal_menstruation', name: 'Abnormal Menstruation' },
    { id: 'dischromic_patches', name: 'Dischromic Patches' },
    { id: 'watering_from_eyes', name: 'Watering from Eyes' },
    { id: 'increased_appetite', name: 'Increased Appetite' },
    { id: 'polyuria', name: 'Polyuria' },
    { id: 'family_history', name: 'Family History' },
    { id: 'mucoid_sputum', name: 'Mucoid Sputum' },
    { id: 'rusty_sputum', name: 'Rusty Sputum' },
    { id: 'lack_of_concentration', name: 'Lack of Concentration' },
    { id: 'visual_disturbances', name: 'Visual Disturbances' },
    { id: 'receiving_blood_transfusion', name: 'Receiving Blood Transfusion' },
    { id: 'receiving_unsterile_injections', name: 'Receiving Unsterile Injections' },
    { id: 'coma', name: 'Coma' },
    { id: 'stomach_bleeding', name: 'Stomach Bleeding' },
    { id: 'distention_of_abdomen', name: 'Distention of Abdomen' },
    { id: 'history_of_alcohol_consumption', name: 'History of Alcohol Consumption' },
    { id: 'blood_in_sputum', name: 'Blood in Sputum' },
    { id: 'prominent_veins_on_calf', name: 'Prominent Veins on Calf' },
    { id: 'palpitations', name: 'Palpitations' },
    { id: 'painful_walking', name: 'Painful Walking' },
    { id: 'pus_filled_pimples', name: 'Pus Filled Pimples' },
    { id: 'blackheads', name: 'Blackheads' },
    { id: 'scurring', name: 'Scurring' },
    { id: 'skin_peeling', name: 'Skin Peeling' },
    { id: 'silver_like_dusting', name: 'Silver-like Dusting' },
    { id: 'small_dents_in_nails', name: 'Small Dents in Nails' },
    { id: 'inflammatory_nails', name: 'Inflammatory Nails' },
    { id: 'blister', name: 'Blister' },
    { id: 'red_sore_around_nose', name: 'Red Sore Around Nose' },
    { id: 'yellow_crust_ooze', name: 'Yellow Crust Ooze' }
  ];
};

// Image diagnosis function (if implemented in backend)
export const diagnoseFromImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch("https://aixplain-zmis.onrender.com/analyze-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, diagnosis: data.diagnosis };
    } else {
      return { success: false, error: data.error || "Failed to analyze image." };
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { success: false, error: "Server error. Try again later." };
  }
};