// This is a simplified mock of an AI diagnostic engine
// In a real application, this would be connected to a trained ML model

// Mock symptom database
const symptomDatabase = {
  fever: ['common_cold', 'flu', 'malaria', 'typhoid', 'covid19'],
  cough: ['common_cold', 'flu', 'tuberculosis', 'pneumonia', 'covid19'],
  headache: ['migraine', 'tension_headache', 'malaria', 'flu', 'dehydration'],
  rash: ['chickenpox', 'measles', 'allergic_reaction', 'eczema', 'scabies'],
  fatigue: ['anemia', 'depression', 'flu', 'diabetes', 'thyroid_disorder'],
  sore_throat: ['common_cold', 'flu', 'strep_throat', 'tonsillitis', 'laryngitis'],
  nausea: ['food_poisoning', 'migraine', 'pregnancy', 'motion_sickness', 'gastritis'],
  dizziness: ['low_blood_pressure', 'anemia', 'dehydration', 'inner_ear_infection', 'anxiety'],
  abdominal_pain: ['appendicitis', 'gastritis', 'food_poisoning', 'menstrual_cramps', 'kidney_stones'],
  diarrhea: ['food_poisoning', 'gastroenteritis', 'irritable_bowel_syndrome', 'parasitic_infection', 'celiac_disease']
}

// Mock disease database with descriptions and recommendations
const diseaseDatabase = {
  common_cold: {
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract that is usually harmless.',
    symptoms: ['fever', 'cough', 'sore_throat', 'runny_nose', 'congestion'],
    recommendations: [
      'Rest and stay hydrated',
      'Over-the-counter pain relievers like acetaminophen',
      'Saline nasal drops or sprays',
      'Warm liquids like tea with honey'
    ],
    urgency: 'low',
    contagious: true
  },
  flu: {
    name: 'Influenza (Flu)',
    description: 'A contagious respiratory illness caused by influenza viruses.',
    symptoms: ['fever', 'cough', 'sore_throat', 'body_aches', 'fatigue', 'headache'],
    recommendations: [
      'Rest and stay hydrated',
      'Antiviral medications if diagnosed early',
      'Over-the-counter pain relievers',
      'Avoid contact with others to prevent spread'
    ],
    urgency: 'medium',
    contagious: true
  },
  malaria: {
    name: 'Malaria',
    description: 'A serious disease caused by a parasite that is transmitted by mosquito bites.',
    symptoms: ['fever', 'chills', 'headache', 'fatigue', 'muscle_aches'],
    recommendations: [
      'Seek medical attention immediately',
      'Antimalarial medications',
      'Rest and stay hydrated',
      'Use mosquito nets and repellents to prevent future infections'
    ],
    urgency: 'high',
    contagious: false
  },
  // More diseases would be added in a real application
}

// Function to diagnose based on symptoms
export const diagnoseFromSymptoms = (symptoms) => {
  if (!symptoms || symptoms.length === 0) {
    return {
      success: false,
      message: 'No symptoms provided',
      possibleConditions: []
    }
  }

  // Count disease occurrences for each symptom
  const diseaseCounts = {}
  
  symptoms.forEach(symptom => {
    if (symptomDatabase[symptom]) {
      symptomDatabase[symptom].forEach(disease => {
        diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1
      })
    }
  })

  // Sort diseases by count (most likely first)
  const sortedDiseases = Object.keys(diseaseCounts).sort((a, b) => {
    return diseaseCounts[b] - diseaseCounts[a]
  })

  // Get top 3 possible conditions with details
  const possibleConditions = sortedDiseases.slice(0, 3).map(disease => {
    const details = diseaseDatabase[disease] || {
      name: disease,
      description: 'Information not available',
      recommendations: ['Consult a healthcare professional'],
      urgency: 'unknown'
    }
    
    return {
      ...details,
      matchScore: (diseaseCounts[disease] / symptoms.length) * 100
    }
  })

  return {
    success: true,
    message: 'Diagnosis completed',
    possibleConditions,
    disclaimer: 'This is an AI-assisted diagnosis and should not replace professional medical advice. Please consult a healthcare professional for confirmation.'
  }
}

// Mock function for image-based diagnosis
export const diagnoseFromImage = (imageData) => {
  // In a real app, this would send the image to an ML model
  // For this mock, we'll return random skin conditions
  
  const skinConditions = [
    {
      name: 'Eczema',
      description: 'A condition that makes your skin red and itchy',
      recommendations: ['Moisturize regularly', 'Avoid triggers', 'Topical corticosteroids'],
      urgency: 'medium'
    },
    {
      name: 'Psoriasis',
      description: 'A skin disease that causes red, itchy scaly patches',
      recommendations: ['Topical treatments', 'Light therapy', 'Oral medications'],
      urgency: 'medium'
    },
    {
      name: 'Acne',
      description: 'A skin condition that occurs when hair follicles plug with oil and dead skin cells',
      recommendations: ['Wash face twice daily', 'Use over-the-counter acne products', 'Avoid touching face'],
      urgency: 'low'
    }
  ]
  
  // Randomly select a condition
  const randomIndex = Math.floor(Math.random() * skinConditions.length)
  
  return {
    success: true,
    message: 'Image analysis completed',
    condition: skinConditions[randomIndex],
    confidence: Math.floor(Math.random() * 30) + 70, // Random confidence between 70-99%
    disclaimer: 'This is an AI-assisted diagnosis and should not replace professional medical advice. Please consult a healthcare professional for confirmation.'
  }
}

// Get all available symptoms for the UI
export const getAllSymptoms = () => {
  return Object.keys(symptomDatabase).map(symptom => ({
    id: symptom,
    name: symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))
}

// Get disease information
export const getDiseaseInfo = (diseaseId) => {
  return diseaseDatabase[diseaseId] || null
}