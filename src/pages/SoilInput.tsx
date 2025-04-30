import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Plane as Plant, Info, RefreshCw, Save, Download } from 'lucide-react';
import { getCropRecommendation, getFertilizerSchedule } from '../utils/recommendations';
import axios from 'axios';

interface SoilData {
  fieldName: string;
  location: string;
  sampleDate: string;
  ph: number;
  soilType: string;
  soilColor: string;
  moistureLevel: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface Recommendation {
  crop: string;
  fertilizer: string;
  description: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface AIRecommendation {
  crop: string;
  fertilizer: string;
  description: string;
  schedule: string[];
}

interface AIResponse {
  recommendations: AIRecommendation[];
}

const GEMINI_API_KEY = "AIzaSyA5x67hvFwa6sTfTVttBjsw739mZDGWli4";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Helper functions
const getPhColor = (ph: number): string => {
  if (ph < 6.0) return 'text-red-500';
  if (ph > 7.5) return 'text-purple-500';
  return 'text-green-500';
};

const getNutrientStatus = (value: number): { color: string; status: string } => {
  if (value < 30) return { color: 'text-red-500', status: 'Low' };
  if (value > 70) return { color: 'text-green-500', status: 'High' };
  return { color: 'text-yellow-500', status: 'Medium' };
};

const cleanAIResponse = (response: string): string => {
  // Remove markdown code blocks if present
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  return cleaned;
};

const generateAIPrompt = (data: SoilData) => {
  return `As an agricultural expert, analyze the following soil properties and provide detailed recommendations for 3 suitable crop options. Include fertilizer recommendations and best practices for each crop.

Soil Properties:
- pH Level: ${data.ph}
- Soil Type: ${data.soilType}
- Soil Color: ${data.soilColor}
- Moisture Level: ${data.moistureLevel}
- Nitrogen Content: ${data.nitrogen}%
- Phosphorus Content: ${data.phosphorus}%
- Potassium Content: ${data.potassium}%

Provide your response in this exact JSON structure without any markdown formatting:
{
  "recommendations": [
    {
      "crop": "Crop Name",
      "fertilizer": "Fertilizer Recommendation",
      "description": "Detailed growing instructions and best practices",
      "schedule": ["Week 1: Step 1", "Week 2: Step 2"]
    }
  ]
}`;
};

const SoilInput: React.FC = () => {
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState<SoilData>({
    fieldName: '',
    location: '',
    sampleDate: '',
    ph: 7,
    soilType: 'Clay',
    soilColor: 'Brown',
    moistureLevel: 'Medium',
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [fertilizerSchedule, setFertilizerSchedule] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiError(null);

    try {
      const response = await axios.post<GeminiResponse>(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: generateAIPrompt(soilData) }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Clean and parse the AI response
      const cleanedResponse = cleanAIResponse(aiResponse);
      console.log('Cleaned AI Response:', cleanedResponse); // For debugging
      
      try {
        const parsedResponse = JSON.parse(cleanedResponse) as AIResponse;
        const aiRecommendations = parsedResponse.recommendations.map((rec: AIRecommendation) => ({
          crop: rec.crop,
          fertilizer: rec.fertilizer,
          description: rec.description
        }));

        setRecommendations(aiRecommendations);
        
        if (aiRecommendations.length > 0) {
          setSelectedCrop(aiRecommendations[0].crop);
          setFertilizerSchedule(parsedResponse.recommendations[0].schedule || []);
          
          const recommendationData = {
            recommendedCrops: aiRecommendations.map(rec => rec.crop.toLowerCase()),
            analysisDate: new Date().toISOString(),
            soilProperties: soilData,
            recommendations: aiRecommendations
          };
          
          localStorage.setItem('soilAnalysisResult', JSON.stringify(recommendationData));
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Raw AI Response:', aiResponse);
        throw new Error('Failed to parse AI recommendations');
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setAiError('Failed to get AI recommendations. Please try again.');
      // Fallback to basic recommendations if AI fails
      const results = getCropRecommendation(soilData);
      setRecommendations(results);
      if (results.length > 0) {
        setSelectedCrop(results[0].crop);
        setFertilizerSchedule(getFertilizerSchedule(results[0].crop));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = () => {
    const analyses = JSON.parse(localStorage.getItem('soilAnalyses') || '[]');
    const newAnalysis = { ...soilData, timestamp: new Date().toISOString() };
    localStorage.setItem('soilAnalyses', JSON.stringify([...analyses, newAnalysis]));
  };

  const exportToCSV = () => {
    const headers = Object.keys(soilData).join(',');
    const values = Object.values(soilData).join(',');
    const csv = `${headers}\n${values}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soil-analysis-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Plant className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Smart Soil Analysis</h1>
                <p className="text-green-50">AI-powered insights and crop recommendations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTips(!showTips)}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition"
              >
                <Info className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {aiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-700">{aiError}</p>
          </div>
        )}

        {showTips && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Tips for Accurate Soil Analysis</h3>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>• Take samples from multiple locations in your field</li>
              <li>• Ensure soil is dry when collecting samples</li>
              <li>• Clean your testing equipment before use</li>
              <li>• Consider seasonal variations in soil conditions</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Field Name</label>
                    <input
                      type="text"
                      value={soilData.fieldName}
                      onChange={(e) => setSoilData({ ...soilData, fieldName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="e.g. North Field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={soilData.location}
                      onChange={(e) => setSoilData({ ...soilData, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="GPS or Description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sample Date</label>
                    <input
                      type="date"
                      value={soilData.sampleDate}
                      onChange={(e) => setSoilData({ ...soilData, sampleDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil pH</label>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.1"
                    value={soilData.ph}
                    onChange={(e) => setSoilData({ ...soilData, ph: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center mt-1">{soilData.ph}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                  <select
                    value={soilData.soilType}
                    onChange={(e) => setSoilData({ ...soilData, soilType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option>Clay</option>
                    <option>Sandy</option>
                    <option>Loamy</option>
                    <option>Silt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil Color</label>
                  <select
                    value={soilData.soilColor}
                    onChange={(e) => setSoilData({ ...soilData, soilColor: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option>Black</option>
                    <option>Brown</option>
                    <option>Red</option>
                    <option>Gray</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Moisture Level</label>
                  <select
                    value={soilData.moistureLevel}
                    onChange={(e) => setSoilData({ ...soilData, moistureLevel: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">NPK Levels</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">Nitrogen</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={soilData.nitrogen}
                        onChange={(e) =>
                          setSoilData({ ...soilData, nitrogen: parseInt(e.target.value) })
                        }
                        className="w-full"
                      />
                      <div className="text-center">{soilData.nitrogen}%</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Phosphorus</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={soilData.phosphorus}
                        onChange={(e) =>
                          setSoilData({ ...soilData, phosphorus: parseInt(e.target.value) })
                        }
                        className="w-full"
                      />
                      <div className="text-center">{soilData.phosphorus}%</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Potassium</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={soilData.potassium}
                        onChange={(e) =>
                          setSoilData({ ...soilData, potassium: parseInt(e.target.value) })
                        }
                        className="w-full"
                      />
                      <div className="text-center">{soilData.potassium}%</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {loading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      'Get Recommendations'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={saveAnalysis}
                    className="flex items-center justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 hover:bg-green-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={exportToCSV}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Real-time Analysis</h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">pH Level</span>
                  <span className={`font-semibold ${getPhColor(soilData.ph)}`}>
                    {soilData.ph}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(soilData.ph / 14) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
                  const value = soilData[nutrient as keyof SoilData] as number;
                  const { color, status } = getNutrientStatus(value);
                  return (
                    <div key={nutrient} className="flex items-center justify-between">
                      <span className="capitalize text-sm text-gray-600">{nutrient}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${color}`}>{status}</span>
                        <span className="font-semibold">{value}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCrop === rec.crop
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedCrop(rec.crop)}
                >
                  <h3 className="text-lg font-medium text-gray-900">Option {index + 1}: {rec.crop}</h3>
                  <p className="text-green-600 font-semibold mt-2">{rec.fertilizer}</p>
                  <p className="text-gray-600 mt-2">{rec.description}</p>
                </div>
              ))}
            </div>

            {selectedCrop && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Fertilizer Application Schedule for {selectedCrop}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {fertilizerSchedule.map((step, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => navigate('/crop-manual')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  View Growing Guide
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SoilInput;