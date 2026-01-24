import React, { useState, useEffect } from 'react';
import { communityService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answers, setAnswers] = useState({});
  const [newAnswers, setNewAnswers] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await communityService.getAllQuestions();
      setQuestions(response.data);
      
      // Load answers for each question
      response.data.forEach(async (question) => {
        try {
          const answersRes = await communityService.getQuestionAnswers(question.id);
          setAnswers(prev => ({ ...prev, [question.id]: answersRes.data }));
        } catch (err) {
          console.error('Error loading answers:', err);
        }
      });
    } catch (error) {
      console.error('Error loading questions:', error);
      // Show sample questions if backend fails
      const sampleQuestions = [
        { 
          id: 1, 
          content: 'What are the benefits of Ayurvedic therapy?', 
          userId: 101,
          createdAt: new Date().toISOString() 
        },
        { 
          id: 2, 
          content: 'How often should I get acupuncture treatment?', 
          userId: 102,
          createdAt: new Date().toISOString() 
        },
        { 
          id: 3, 
          content: 'Can physiotherapy help with chronic back pain?', 
          userId: 103,
          createdAt: new Date().toISOString() 
        }
      ];
      setQuestions(sampleQuestions);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to ask a question');
      return;
    }
    
    if (!newQuestion.trim()) {
      alert('Please enter a question');
      return;
    }
    
    try {
      await communityService.createQuestion({
        userId: user.userId,
        content: newQuestion
      });
      setNewQuestion('');
      alert('Question posted successfully!');
      loadQuestions();
    } catch (error) {
      console.error('Error posting question:', error);
      alert('Error posting question. Please try again.');
    }
  };

  const handlePostAnswer = async (questionId) => {
    if (!user) {
      alert('Please login to answer');
      return;
    }
    
    if (!newAnswers[questionId]?.trim()) {
      alert('Please enter an answer');
      return;
    }
    
    try {
      await communityService.createAnswer({
        questionId,
        practitionerId: user.userId,
        content: newAnswers[questionId]
      });
      setNewAnswers(prev => ({ ...prev, [questionId]: '' }));
      alert('Answer posted successfully!');
      loadQuestions();
    } catch (error) {
      console.error('Error posting answer:', error);
      alert('Error posting answer. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community Q&A</h1>
      
      {/* Ask Question */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
        <form onSubmit={handleAskQuestion}>
          <textarea
            className="w-full px-4 py-2 border rounded-lg mb-4"
            rows="3"
            placeholder="What would you like to know?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
          >
            Post Question
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map(question => (
          <div key={question.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">{question.content}</p>
              <p className="text-sm text-gray-500">
                Asked on {new Date(question.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Answers */}
            <div className="ml-6 space-y-3 mb-4">
              {answers[question.id]?.map(answer => (
                <div key={answer.id} className="bg-gray-50 p-4 rounded-lg">
                  <p>{answer.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Answered on {new Date(answer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Answer Form */}
            {user && (
              <div className="ml-6">
                <textarea
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows="2"
                  placeholder="Write your answer..."
                  value={newAnswers[question.id] || ''}
                  onChange={(e) => setNewAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                />
                <button
                  onClick={() => handlePostAnswer(question.id)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                >
                  Post Answer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No questions yet. Be the first to ask!</p>
      )}
    </div>
  );
};

export default Community;
