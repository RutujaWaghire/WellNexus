import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/api';

export default function RecommendationPage() {
  const { user } = useAuth();
  const [symptom, setSymptom] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch user's previous recommendations
  useEffect(() => {
    if (user?.id) {
      fetchUserRecommendations();
    }
  }, [user?.id]);

  const fetchUserRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await fetch(`/api/recommendations/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserRecommendations(data);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleGenerateRecommendation = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) {
      setError('Please enter a symptom');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          symptom: symptom
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendation');
      }

      const recommendation = await response.json();
      setRecommendations([recommendation]);
      setSymptom('');
      
      // Refresh user recommendations
      fetchUserRecommendations();
      
      // Log analytics
      try {
        await analyticsService.logAction(user.id, 'RECOMMENDATION_REQUESTED', 'Symptom: ' + symptom);
      } catch (err) {
        console.warn('Failed to log analytics:', err);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (level) => {
    switch(level?.toUpperCase()) {
      case 'HIGH': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const parseJSON = (jsonString) => {
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Health Recommendations</h1>
          <p className="text-gray-600">Get personalized wellness recommendations powered by FDA, WHO, and fitness APIs</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleGenerateRecommendation} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Symptom or Condition
              </label>
              <input
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g., back pain, stress, anxiety, headache..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {loading ? 'Generating Recommendation...' : 'Get Recommendation'}
            </button>
          </form>
        </div>

        {/* Current Recommendation */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Recommendation</h2>
            {recommendations.map((rec) => (
              <div key={rec.id} className="space-y-6">
                
                {/* Basic Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Symptom</p>
                      <p className="text-xl font-semibold text-gray-800">{rec.symptom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Suggested Therapy</p>
                      <p className="text-xl font-semibold text-blue-600">{rec.suggestedTherapy}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(rec.confidenceLevel)}`}>
                      Confidence: {rec.confidenceLevel || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                {/* FDA Drug Information */}
                {rec.fdaDrugInfo && !rec.fdaDrugInfo.includes('error') && (
                  <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
                    <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                      💊 FDA Drug Information
                    </h3>
                    <div className="text-gray-700 space-y-2">
                      {(() => {
                        const data = parseJSON(rec.fdaDrugInfo);
                        return (
                          <div>
                            {data.brandName && <p><strong>Brand Name:</strong> {data.brandName}</p>}
                            {data.indications && <p><strong>Indications:</strong> {data.indications}</p>}
                            {data.dosage && <p><strong>Dosage:</strong> {data.dosage}</p>}
                            {data.warnings && <p><strong>Warnings:</strong> {data.warnings}</p>}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* WHO Guidelines */}
                {rec.whoGuidelines && !rec.whoGuidelines.includes('error') && (
                  <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                      🏥 WHO Health Guidelines
                    </h3>
                    <div className="text-gray-700 space-y-2">
                      {(() => {
                        const data = parseJSON(rec.whoGuidelines);
                        return (
                          <div>
                            {data.condition && <p><strong>Condition:</strong> {data.condition}</p>}
                            {data.prevalence && <p><strong>Prevalence:</strong> {data.prevalence}</p>}
                            {data.preventiveMeasures && (
                              <div>
                                <strong>Preventive Measures:</strong>
                                <ul className="list-disc list-inside ml-2">
                                  {Array.isArray(data.preventiveMeasures) && data.preventiveMeasures.map((measure, idx) => (
                                    <li key={idx}>{measure}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Fitness Data */}
                {rec.fitnessData && !rec.fitnessData.includes('error') && (
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                    <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                      🏋️ Fitness & Wellness Recommendations
                    </h3>
                    <div className="text-gray-700 space-y-2">
                      {(() => {
                        const data = parseJSON(rec.fitnessData);
                        return (
                          <div>
                            {data.exerciseName && <p><strong>Exercise:</strong> {data.exerciseName}</p>}
                            {data.type && <p><strong>Type:</strong> {data.type}</p>}
                            {data.targetMuscle && <p><strong>Target Muscle:</strong> {data.targetMuscle}</p>}
                            {data.equipment && <p><strong>Equipment:</strong> {data.equipment}</p>}
                            {data.difficulty && <p><strong>Difficulty:</strong> {data.difficulty}</p>}
                            {data.instructions && <p><strong>Instructions:</strong> {data.instructions}</p>}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Disclaimer:</strong> This recommendation is AI-generated and for informational purposes only. 
                    Always consult with a qualified healthcare practitioner before making any health decisions.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Previous Recommendations */}
        {userRecommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Previous Recommendations</h2>
            <div className="space-y-4">
              {userRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{rec.symptom}</p>
                      <p className="text-sm text-gray-600">Suggested: {rec.suggestedTherapy}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(rec.confidenceLevel)}`}>
                      {rec.confidenceLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {loadingRecommendations && (
          <div className="text-center text-gray-600 py-8">
            <p className="animate-pulse">Loading recommendations...</p>
          </div>
        )}
      </div>
    </div>
  );
}
