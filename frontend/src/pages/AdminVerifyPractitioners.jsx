import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { practitionerService } from '../services/api';

const AdminVerifyPractitioners = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedPractitioner, setExpandedPractitioner] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [formData, setFormData] = useState({
    specialization: '',
    rating: 4.5,
  });

  // Specialization options
  const specializations = [
    'Physiotherapy',
    'Acupuncture',
    'Ayurveda',
    'Chiropractic',
    'Massage Therapy',
    'Yoga Therapy',
    'Herbal Medicine',
    'Homeopathy',
    'Naturopathy',
    'Reiki',
  ];

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchUnverifiedPractitioners();
  }, [user, navigate]);

  const fetchUnverifiedPractitioners = async () => {
    try {
      setLoading(true);
      const response = await practitionerService.getUnverified();
      setPractitioners(response.data);
      
      // Fetch documents for each practitioner
      const docs = {};
      const token = localStorage.getItem('token');
      
      for (const practitioner of response.data) {
        try {
          const docsResponse = await fetch(`http://localhost:8080/api/documents/user/${practitioner.userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (docsResponse.ok) {
            docs[practitioner.userId] = await docsResponse.json();
          } else {
            console.warn(`Failed to fetch documents for user ${practitioner.userId}, status: ${docsResponse.status}`);
            docs[practitioner.userId] = [];
          }
        } catch (err) {
          console.error(`Error fetching documents for user ${practitioner.userId}:`, err);
          docs[practitioner.userId] = [];
        }
      }
      setSelectedDocuments(docs);
      setError('');
    } catch (err) {
      setError('Failed to fetch unverified practitioners');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId, documentName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/documents/download/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documentName);
        document.body.appendChild(link);
        link.click();
        link.parentElement.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to download document');
      }
    } catch (err) {
      setError('Error downloading document');
      console.error(err);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerify = async (practitionerId) => {
    try {
      if (!formData.specialization) {
        setError('Please select a specialization');
        return;
      }

      if (formData.rating < 0 || formData.rating > 5) {
        setError('Rating must be between 0 and 5');
        return;
      }

      await practitionerService.adminVerify({
        userId: practitionerId,
        specialization: formData.specialization,
        rating: parseFloat(formData.rating),
      });

      setSuccessMessage('Practitioner verified successfully!');
      setPractitioners(practitioners.filter(p => p.userId !== practitionerId));
      setExpandedPractitioner(null);
      setFormData({ specialization: '', rating: 4.5 });
      setError('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify practitioner');
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Verify Practitioners</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {practitioners.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          All practitioners have been verified! ✓
        </div>
      ) : (
        <div className="grid gap-6">
          <p className="text-gray-600 mb-4">
            {practitioners.length} unverified practitioner{practitioners.length !== 1 ? 's' : ''} pending verification
          </p>
          
          {practitioners.map((practitioner) => (
            <div key={practitioner.userId} className="bg-white rounded-lg shadow-md border-l-4 border-teal-600">
              {/* Header Section */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() =>
                  setExpandedPractitioner(
                    expandedPractitioner === practitioner.userId ? null : practitioner.userId
                  )
                }
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{practitioner.name}</h2>
                    <p className="text-gray-600 mt-1">Email: {practitioner.email}</p>
                    {practitioner.bio && (
                      <p className="text-gray-600 mt-2 italic">Bio: {practitioner.bio}</p>
                    )}
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
                    ⏳ Pending
                  </span>
                </div>
              </div>

              {/* Expanded Form Section */}
              {expandedPractitioner === practitioner.userId && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="space-y-6">
                    {/* Documents Section */}
                    {selectedDocuments[practitioner.userId] && selectedDocuments[practitioner.userId].length > 0 && (
                      <div className="bg-white border border-blue-300 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                          📄 Verification Documents
                        </h3>
                        <div className="space-y-3">
                          {selectedDocuments[practitioner.userId].map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{doc.documentName}</p>
                                <p className="text-sm text-gray-600">
                                  Type: {doc.documentType} | Size: {(doc.fileSize / 1024).toFixed(2)} KB | 
                                  <span className={`ml-2 font-semibold ${
                                    doc.status === 'PENDING' ? 'text-yellow-600' :
                                    doc.status === 'APPROVED' ? 'text-green-600' :
                                    'text-red-600'
                                  }`}>
                                    {doc.status}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(doc.id, doc.documentName)}
                                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm whitespace-nowrap"
                              >
                                ⬇️ Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!selectedDocuments[practitioner.userId] || selectedDocuments[practitioner.userId].length === 0 && (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                        <p className="text-yellow-800">⚠️ No verification documents uploaded</p>
                      </div>
                    )}

                    {/* Specialization Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Specialization *
                      </label>
                      <select
                        value={formData.specialization}
                        onChange={(e) => handleFormChange('specialization', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="">-- Choose Specialization --</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating (0-5) *
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={formData.rating}
                          onChange={(e) => handleFormChange('rating', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                          placeholder="Enter rating"
                        />
                        <span className="text-lg font-semibold text-teal-600">
                          {parseFloat(formData.rating).toFixed(1)}/5.0
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleVerify(practitioner.userId)}
                        className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        ✓ Verify Practitioner
                      </button>
                      <button
                        onClick={() => setExpandedPractitioner(null)}
                        className="flex-1 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerifyPractitioners;
