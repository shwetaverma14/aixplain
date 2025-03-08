import { useState } from 'react'
import { diagnoseFromSymptoms, getAllSymptoms } from '../utils/diagnosticEngine'
import OfflineIndicator from '../components/common/OfflineIndicator'
import LoadingSpinner from '../components/common/LoadingSpinner'

function SymptomChecker() {
  const [step, setStep] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    duration: '',
    severity: 'moderate'
  })
  const [diagnosisResult, setDiagnosisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const allSymptoms = getAllSymptoms()
  
  const filteredSymptoms = searchTerm 
    ? allSymptoms.filter(symptom => 
        symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allSymptoms

  const handleSymptomToggle = (symptomId) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId])
    }
  }

  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target
    setPatientInfo({
      ...patientInfo,
      [name]: value
    })
  }

  const handleDiagnose = () => {
    setIsLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      const result = diagnoseFromSymptoms(selectedSymptoms)
      setDiagnosisResult(result)
      setIsLoading(false)
      setStep(3)
    }, 1500)
  }

  const resetForm = () => {
    setSelectedSymptoms([])
    setPatientInfo({
      age: '',
      gender: '',
      duration: '',
      severity: 'moderate'
    })
    setDiagnosisResult(null)
    setStep(1)
    setSearchTerm('')
  }

  return (
    <div>
      <OfflineIndicator />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Symptom Checker</h1>
        <p className="text-gray-600">
          Input patient symptoms to get AI-assisted diagnosis and recommendations.
        </p>
      </div>
      
      {/* Progress steps */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
          <div className="mt-2">Select Symptoms</div>
        </div>
        <div className={`flex-1 text-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
          <div className="mt-2">Patient Details</div>
        </div>
        <div className={`flex-1 text-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
          <div className="mt-2">Results</div>
        </div>
      </div>
      
      {/* Step 1: Symptom Selection */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Select Symptoms</h2>
          
          <div className="mb-4">
            <label htmlFor="symptom-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Symptoms
            </label>
            <input
              type="text"
              id="symptom-search"
              className="input-field"
              placeholder="Type to search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Selected Symptoms: {selectedSymptoms.length}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSymptoms.map(symptomId => {
                const symptom = allSymptoms.find(s => s.id === symptomId)
                return (
                  <div 
                    key={symptomId} 
                    className="symptom-tag selected flex items-center"
                    onClick={() => handleSymptomToggle(symptomId)}
                  >
                    <span>{symptom?.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )
              })}
              {selectedSymptoms.length === 0 && (
                <div className="text-gray-500 text-sm italic">No symptoms selected</div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Common Symptoms
            </div>
            <div className="max-h-60 overflow-y-auto p-2 border rounded-md">
              <div className="flex flex-wrap gap-2">
                {filteredSymptoms.map(symptom => (
                  <div
                    key={symptom.id}
                    className={`symptom-tag cursor-pointer ${selectedSymptoms.includes(symptom.id) ? 'selected' : ''}`}
                    onClick={() => handleSymptomToggle(symptom.id)}
                  >
                    {symptom.name}
                  </div>
                ))}
                {filteredSymptoms.length === 0 && (
                  <div className="text-gray-500 text-sm italic p-2">No symptoms found matching your search</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Reset
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={selectedSymptoms.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Patient Information */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className="input-field"
                placeholder="Enter age"
                value={patientInfo.age}
                onChange={handlePatientInfoChange}
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="input-field"
                value={patientInfo.gender}
                onChange={handlePatientInfoChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Symptom Duration
              </label>
              <select
                id="duration"
                name="duration"
                className="input-field"
                value={patientInfo.duration}
                onChange={handlePatientInfoChange}
              >
                <option value="">Select duration</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Symptom Severity
              </label>
              <select
                id="severity"
                name="severity"
                className="input-field"
                value={patientInfo.severity}
                onChange={handlePatientInfoChange}
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              className="btn btn-secondary"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleDiagnose}
            >
              Get Diagnosis
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Results */}
      {step === 3 && (
        <div>
          {isLoading ? (
            <div className="card flex justify-center items-center py-12">
              <LoadingSpinner size="large" message="Analyzing symptoms and generating diagnosis..." />
            </div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Diagnosis Results</h2>
              
              {diagnosisResult?.possibleConditions?.length > 0 ? (
                <div>
                  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                    <p className="font-medium">Disclaimer:</p>
                    <p>{diagnosisResult.disclaimer}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Possible Conditions</h3>
                    {diagnosisResult.possibleConditions.map((condition, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-semibold">{condition.name}</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            condition.urgency === 'high' ? 'bg-red-100 text-red-800' :
                            condition.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {condition.urgency.charAt(0).toUpperCase() + condition.urgency.slice(1)} Urgency
                          </div>
                        </div>
                        <p className="text-gray-600 my-2">{condition.description}</p>
                        <div className="mt-2">
                          <h5 className="font-medium mb-1">Recommendations:</h5>
                          <ul className="list-disc list-inside text-sm">
                            {condition.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                        {condition.contagious && (
                          <div className="mt-2 text-sm text-red-600 font-medium">
                            Note: This condition may be contagious.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Next Steps</h3>
                    <ul className="list-disc list-inside">
                      <li>Review the possible conditions and their recommendations</li>
                      <li>Consider additional tests if available</li>
                      <li>Refer to a specialist if the condition is severe or uncertain</li>
                      <li>Follow up with the patient to monitor progress</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">No Diagnosis Available</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't determine a diagnosis based on the provided symptoms. 
                    Please try adding more symptoms or consult with a healthcare professional.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between">
                <button 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Start New Diagnosis
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  Print Results
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SymptomChecker