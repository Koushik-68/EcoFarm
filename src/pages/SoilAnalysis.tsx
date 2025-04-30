import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Layout from '../components/Layout';
import { Beaker, Sprout, Info, RefreshCw, Save, Download } from 'lucide-react';

interface SoilProperties {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  texture: string;
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

const cleanAIResponse = (response: string): string => {
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  cleaned = cleaned.trim();
  return cleaned;
};

const generateAIPrompt = (data: SoilProperties) => {
  return `As an agricultural expert, analyze the following soil properties and provide detailed recommendations for 3 suitable crop options. Include fertilizer recommendations and best practices for each crop.

Soil Properties:
- pH Level: ${data.pH}
- Nitrogen Content: ${data.nitrogen}%
- Phosphorus Content: ${data.phosphorus}%
- Potassium Content: ${data.potassium}%
- Organic Matter: ${data.organicMatter}%
- Moisture Content: ${data.moisture}%
- Soil Texture: ${data.texture}

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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function SoilAnalysis() {
  const navigate = useNavigate();
  const [soilProperties, setSoilProperties] = useState<SoilProperties>({
    pH: 7,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    organicMatter: 0,
    moisture: 0,
    texture: 'loamy'
  });

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [showTips, setShowTips] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: number | string) => {
    setSoilProperties(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<GeminiResponse>(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: generateAIPrompt(soilProperties) }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      const cleanedResponse = cleanAIResponse(aiResponse);
      const parsedResponse = JSON.parse(cleanedResponse) as AIResponse;
      setRecommendations(parsedResponse.recommendations);
      
      if (parsedResponse.recommendations.length > 0) {
        setSelectedCrop(parsedResponse.recommendations[0].crop);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(34, 197, 94); // green-600
      doc.text('Soil Analysis Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // gray-500
      doc.text(`Generated on: ${formatDate(new Date())}`, pageWidth / 2, 30, { align: 'center' });
      
      // Add soil properties section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Soil Properties', 20, 45);
      
      doc.setFontSize(12);
      doc.text(`pH Level: ${soilProperties.pH}`, 20, 55);
      doc.text(`Nitrogen: ${soilProperties.nitrogen}%`, 20, 65);
      doc.text(`Phosphorus: ${soilProperties.phosphorus}%`, 20, 75);
      doc.text(`Potassium: ${soilProperties.potassium}%`, 20, 85);
      doc.text(`Organic Matter: ${soilProperties.organicMatter}%`, 20, 95);
      doc.text(`Moisture Content: ${soilProperties.moisture}%`, 20, 105);
      doc.text(`Soil Texture: ${soilProperties.texture}`, 20, 115);
      
      // Add recommendations section
      if (recommendations.length > 0) {
        doc.setFontSize(16);
        doc.text('Crop Recommendations', 20, 135);
        
        let yPos = 145;
        recommendations.forEach((rec, index) => {
          // Add new page if content exceeds page height
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(14);
          doc.setTextColor(34, 197, 94);
          doc.text(`${index + 1}. ${rec.crop}`, 20, yPos);
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          // Split long text into multiple lines
          const splitFertilizer = doc.splitTextToSize(`Fertilizer: ${rec.fertilizer}`, pageWidth - 40);
          const splitDescription = doc.splitTextToSize(`Growing Guide: ${rec.description}`, pageWidth - 40);
          
          yPos += 10;
          doc.text(splitFertilizer, 20, yPos);
          yPos += splitFertilizer.length * 7;
          doc.text(splitDescription, 20, yPos);
          yPos += splitDescription.length * 7;
          
          // Add schedule
          doc.text('Schedule:', 20, yPos);
          yPos += 7;
          rec.schedule.forEach(step => {
            const splitStep = doc.splitTextToSize(`• ${step}`, pageWidth - 40);
            doc.text(splitStep, 20, yPos);
            yPos += splitStep.length * 7;
          });
          
          yPos += 10;
        });
      }
      
      // Save the PDF
      doc.save(`soil-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Show success message
      alert('Soil analysis report has been saved as PDF!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Beaker className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Smart Soil Analysis</h1>
                <p className="text-green-50">AI-powered soil analysis and crop recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setShowTips(!showTips)}
              className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition"
            >
              <Info className="h-6 w-6" />
            </button>
          </div>
        </div>

        {showTips && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">Tips for Accurate Results</h3>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>• pH values between 6.0-7.5 are generally ideal for most crops</li>
              <li>• Take multiple soil samples from different parts of your field</li>
              <li>• Consider seasonal variations in soil moisture</li>
              <li>• Regular soil testing helps track changes over time</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Soil Properties</h2>
              
              {/* pH Slider with Visual Indicator */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700">
                  pH Level
                  <span className={`ml-2 ${getPhColor(soilProperties.pH)}`}>
                    ({soilProperties.pH})
                  </span>
                </label>
                <div className="mt-2">
                  <div className="relative">
                    <div className="h-2 bg-gradient-to-r from-red-500 via-green-500 to-purple-500 rounded-full">
                      <input
                        type="range"
                        min="0"
                        max="14"
                        step="0.1"
                        value={soilProperties.pH}
                        onChange={(e) => handleInputChange('pH', parseFloat(e.target.value))}
                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Acidic (0)</span>
                      <span>Neutral (7)</span>
                      <span>Alkaline (14)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NPK Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => (
                  <div key={nutrient}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {nutrient} (%)
                    </label>
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={soilProperties[nutrient as keyof SoilProperties]}
                        onChange={(e) => handleInputChange(nutrient, parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center mt-1">
                        <span className={getNutrientStatus(soilProperties[nutrient as keyof SoilProperties] as number).color}>
                          {soilProperties[nutrient as keyof SoilProperties]}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Other Properties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Organic Matter (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soilProperties.organicMatter}
                    onChange={(e) => handleInputChange('organicMatter', parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-center mt-1">{soilProperties.organicMatter}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Moisture Content (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soilProperties.moisture}
                    onChange={(e) => handleInputChange('moisture', parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-center mt-1">{soilProperties.moisture}%</div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Soil Texture
                  </label>
                  <select
                    value={soilProperties.texture}
                    onChange={(e) => handleInputChange('texture', e.target.value)}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="sandy">Sandy</option>
                    <option value="loamy">Loamy</option>
                    <option value="clay">Clay</option>
                    <option value="silt">Silty</option>
                    <option value="peaty">Peaty</option>
                    <option value="chalky">Chalky</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={getRecommendations}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Analyzing...
                    </span>
                  ) : (
                    'Get Recommendations'
                  )}
                </button>
                <button
                  onClick={saveAnalysis}
                  disabled={recommendations.length === 0}
                  className="flex items-center justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 hover:bg-green-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-4 space-y-6">
              {/* Real-time Analysis Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Real-time Analysis</h2>
                
                <div className="space-y-4">
                  {/* pH Status */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">pH Level</span>
                      <span className={`font-semibold ${getPhColor(soilProperties.pH)}`}>
                        {soilProperties.pH}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-green-500 to-purple-500"
                        style={{ width: `${(soilProperties.pH / 14) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* NPK Status */}
                  {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
                    const value = soilProperties[nutrient as keyof SoilProperties] as number;
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

              {/* Recommendations */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {recommendations.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Recommended Crops</h2>
                  <div className="space-y-4">
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
                        <div className="flex items-center gap-2 mb-2">
                          <Sprout className={`h-5 w-5 ${
                            selectedCrop === rec.crop ? 'text-green-600' : 'text-gray-400'
                          }`} />
                          <h3 className="font-medium text-gray-900">{rec.crop}</h3>
                        </div>
                        
                        {selectedCrop === rec.crop && (
                          <div className="mt-3 space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Fertilizer</h4>
                              <p className="text-sm text-gray-600">{rec.fertilizer}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Growing Guide</h4>
                              <p className="text-sm text-gray-600">{rec.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Schedule</h4>
                              <ul className="mt-2 space-y-2">
                                {rec.schedule.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start space-x-2">
                                    <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SoilAnalysis; 