import { useState } from 'react'
import OfflineIndicator from '../components/common/OfflineIndicator'

function HealthEducation() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'common', name: 'Common Illnesses' },
    { id: 'chronic', name: 'Chronic Conditions' },
    { id: 'preventive', name: 'Preventive Care' },
    { id: 'maternal', name: 'Maternal Health' },
    { id: 'pediatric', name: 'Child Health' }
  ]
  
  const healthResources = [
    {
      id: 1,
      title: 'Understanding Malaria',
      category: 'common',
      description: 'Learn about malaria symptoms, prevention, and treatment options.',
      content: `
        <h3>What is Malaria?</h3>
        <p>Malaria is a life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes.</p>
        
        <h3>Symptoms</h3>
        <ul>
          <li>Fever and chills</li>
          <li>Headache</li>
          <li>Nausea and vomiting</li>
          <li>Muscle pain and fatigue</li>
        </ul>
        
        <h3>Prevention</h3>
        <ul>
          <li>Use insecticide-treated mosquito nets</li>
          <li>Apply insect repellent</li>
          <li>Wear long-sleeved clothing</li>
          <li>Take antimalarial medications if recommended</li>
        </ul>
        
        <h3>Treatment</h3>
        <p>Early diagnosis and treatment of malaria reduces disease and prevents deaths. It also helps reduce transmission. The best available treatment, particularly for P. falciparum malaria, is artemisinin-based combination therapy (ACT).</p>
      `
    },
    {
      id: 2,
      title: 'Diabetes Management',
      category: 'chronic',
      description: 'Essential information for managing diabetes in resource-limited settings.',
      content: `
        <h3>What is Diabetes?</h3>
        <p>Diabetes is a chronic disease that occurs when the pancreas does not produce enough insulin, or when the body cannot effectively use the insulin it produces.</p>
        
        <h3>Types of Diabetes</h3>
        <ul>
          <li><strong>Type 1 Diabetes:</strong> The body does not produce insulin</li>
          <li><strong>Type 2 Diabetes:</strong> The body does not use insulin properly</li>
          <li><strong>Gestational Diabetes:</strong> High blood sugar during pregnancy</li>
        </ul>
        
        <h3>Symptoms</h3>
        <ul>
          <li>Frequent urination</li>
          <li>Excessive thirst</li>
          <li>Unexplained weight loss</li>
          <li>Extreme hunger</li>
          <li>Blurred vision</li>
        </ul>
        
        <h3>Management</h3>
        <ul>
          <li>Regular blood sugar monitoring</li>
          <li>Healthy diet</li>
          <li>Regular physical activity</li>
          <li>Medication as prescribed</li>
          <li>Regular check-ups</li>
        </ul>
      `
    },
    {
      id: 3,
      title: 'Childhood Immunization Schedule',
      category: 'pediatric',
      description: 'Recommended vaccines for children from birth to 6 years.',
      content: `
        <h3>Importance of Immunization</h3>
        <p>Immunization is one of the most successful and cost-effective health interventions. It prevents illness, disability, and death from vaccine-preventable diseases.</p>
        
        <h3>Recommended Vaccines</h3>
        <ul>
          <li><strong>Birth:</strong> BCG, OPV0, Hep B</li>
          <li><strong>6 Weeks:</strong> DTP1, OPV1, Hep B, Hib, PCV, Rota</li>
          <li><strong>10 Weeks:</strong> DTP2, OPV2, Hib, PCV, Rota</li>
          <li><strong>14 Weeks:</strong> DTP3, OPV3, Hep B, Hib, PCV, Rota</li>
          <li><strong>9 Months:</strong> Measles, Yellow Fever</li>
          <li><strong>15-18 Months:</strong> DTP booster, OPV booster, Measles</li>
        </ul>
        
        <h3>Side Effects</h3>
        <p>Most vaccine reactions are minor and temporary, such as a sore arm or mild fever. Serious side effects are very rare.</p>
        
        
        <h3>Missed Vaccines</h3>
        <p>If a child misses a vaccine, they should get it as soon as possible. It is not necessary to restart the series.</p>
      `
    },
    {
      id: 4,
      title: 'Safe Pregnancy and Childbirth',
      category: 'maternal',
      description: 'Guidelines for ensuring a healthy pregnancy and safe delivery.',
      content: `
        <h3>Prenatal Care</h3>
        <p>Regular prenatal care is essential for a healthy pregnancy. It helps identify and manage potential problems early.</p>
        
        <h3>Recommended Checkups</h3>
        <ul>
          <li>First trimester: At least one visit</li>
          <li>Second trimester: At least one visit</li>
          <li>Third trimester: At least two visits</li>
        </ul>
        
        <h3>Warning Signs During Pregnancy</h3>
        <ul>
          <li>Vaginal bleeding</li>
          <li>Severe headache</li>
          <li>Vision problems</li>
          <li>Swelling in face or hands</li>
          <li>High fever</li>
          <li>Reduced fetal movement</li>
        </ul>
        
        <h3>Preparing for Childbirth</h3>
        <ul>
          <li>Create a birth plan</li>
          <li>Identify a skilled birth attendant</li>
          <li>Arrange transportation to a health facility</li>
          <li>Pack essential items</li>
        </ul>
        
        <h3>Postpartum Care</h3>
        <p>After childbirth, both mother and baby need careful monitoring. The first 48 hours are critical.</p>
      `
    },
    {
      id: 5,
      title: 'Preventing Diarrheal Diseases',
      category: 'preventive',
      description: 'Simple measures to prevent diarrheal diseases in communities.',
      content: `
        <h3>Understanding Diarrheal Diseases</h3>
        <p>Diarrheal diseases are a leading cause of childhood mortality in developing countries. Most cases can be prevented with simple measures.</p>
        
        <h3>Prevention Strategies</h3>
        <ul>
          <li><strong>Safe Water:</strong> Boil or treat drinking water</li>
          <li><strong>Handwashing:</strong> Wash hands with soap at critical times</li>
          <li><strong>Food Safety:</strong> Cook food thoroughly and keep it covered</li>
          <li><strong>Sanitation:</strong> Use latrines and dispose of waste properly</li>
          <li><strong>Breastfeeding:</strong> Exclusive breastfeeding for first 6 months</li>
        </ul>
        
        <h3>Oral Rehydration Solution (ORS)</h3>
        <p>ORS is a simple, inexpensive, and effective treatment for dehydration caused by diarrhea.</p>
        
        <h4>How to prepare ORS:</h4>
        <ol>
          <li>Wash hands with soap and water</li>
          <li>Measure 1 liter of clean water</li>
          <li>Add ORS packet contents and stir</li>
          <li>Give small sips frequently</li>
        </ol>
      `
    },
    {
      id: 6,
      title: 'Tuberculosis (TB) Facts',
      category: 'common',
      description: 'Essential information about TB prevention, diagnosis, and treatment.',
      content: `
        <h3>What is Tuberculosis?</h3>
        <p>Tuberculosis (TB) is a bacterial infection that primarily affects the lungs. It can spread to other parts of the body, such as the brain and spine.</p>
        
        <h3>How TB Spreads</h3>
        <p>TB is spread through the air when a person with TB of the lungs or throat coughs, sneezes, or talks.</p>
        
        <h3>Symptoms</h3>
        <ul>
          <li>Persistent cough (2+ weeks)</li>
          <li>Chest pain</li>
          <li>Coughing up blood</li>
          <li>Fatigue</li>
          <li>Weight loss</li>
          <li>Fever</li>
          <li>Night sweats</li>
        </ul>
      `
    }
  ]
}

export default HealthEducation
