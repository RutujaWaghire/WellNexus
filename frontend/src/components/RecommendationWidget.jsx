import React, { useState } from 'react';
import { api } from '../services/api';

const RecommendationWidget = ({ userId }) => {
  const [symptom, setSymptom] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!symptom) return;
    
    setLoading(true);
    try {
      const response = await api.get('/ai/recommendations', {
        params: { userId, symptom }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
      
      <input
        type="text"
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        placeholder="Enter symptom (e.g., stress, back pain)"
        className="w-full px-4 py-2 border rounded-lg mb-3"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>

      {result && (
        <div className="mt-4 space-y-3">
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-semibold">Symptom: {result.symptom}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="font-semibold mb-2">Suggested Therapies:</p>
            <ul className="list-disc list-inside">
              {result.recommendedTherapies?.map((therapy, i) => (
                <li key={i}>{therapy}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationWidget;
