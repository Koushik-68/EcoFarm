import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Plane as Plant, Calendar, Droplets, Sun } from 'lucide-react';

interface GrowingStage {
  name: string;
  duration: string;
  requirements: string;
  care: string;
}

interface CropGuide {
  id: string;
  name: string;
  description: string;
  stages: GrowingStage[];
  commonProblems: string[];
  harvestInfo: string;
}

const cropGuides: CropGuide[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    description: 'A staple cereal grain grown worldwide.',
    stages: [
      {
        name: 'Germination',
        duration: '7-10 days',
        requirements: 'Soil temperature 12-25°C, adequate moisture',
        care: 'Ensure consistent soil moisture'
      },
      {
        name: 'Tillering',
        duration: '20-30 days',
        requirements: 'Adequate nitrogen, good drainage',
        care: 'Monitor for pests and weeds'
      },
      {
        name: 'Stem Extension',
        duration: '30-40 days',
        requirements: 'Sufficient nutrients, water',
        care: 'Apply fertilizer if needed'
      },
      {
        name: 'Heading',
        duration: '15-20 days',
        requirements: 'Adequate sunlight, moderate water',
        care: 'Protect from extreme weather'
      }
    ],
    commonProblems: [
      'Fungal diseases in humid conditions',
      'Bird damage to developing heads',
      'Weed competition in early stages'
    ],
    harvestInfo: 'Harvest when grain is firm and golden colored'
  },
  {
    id: 'rice',
    name: 'Rice',
    description: 'A water-loving grain that thrives in flooded conditions.',
    stages: [
      {
        name: 'Seedling',
        duration: '10-15 days',
        requirements: 'Warm temperature, standing water',
        care: 'Maintain water level at 2-3 inches'
      },
      {
        name: 'Tillering',
        duration: '20-30 days',
        requirements: 'High nitrogen, consistent water level',
        care: 'Monitor for weeds and pests'
      },
      {
        name: 'Panicle Formation',
        duration: '30-40 days',
        requirements: 'Balanced nutrients, stable water level',
        care: 'Apply second fertilizer dose'
      }
    ],
    commonProblems: [
      'Rice Blast',
      'Stem Borers'
    ],
    harvestInfo: 'Rice is typically harvested in the late summer to early autumn.'
  },
  {
    id: 'corn',
    name: 'Corn',
    description: 'A versatile grain crop requiring warm conditions and good nutrition.',
    stages: [
      {
        name: 'Emergence',
        duration: '5-10 days',
        requirements: 'Warm soil, adequate moisture',
        care: 'Protect from birds and pests'
      },
      {
        name: 'Vegetative Growth',
        duration: '20-30 days',
        requirements: 'High nitrogen, regular watering',
        care: 'Control weeds, monitor for pests'
      },
      {
        name: 'Tasseling',
        duration: '15-20 days',
        requirements: 'Adequate water and nutrients',
        care: 'Avoid water stress'
      }
    ],
    commonProblems: [
      'Corn Earworm',
      'Stalk Rot'
    ],
    harvestInfo: 'Corn is typically harvested in the early to mid-summer.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    description: 'A fiber crop that thrives in warm climates with long growing seasons.',
    stages: [
      {
        name: 'Emergence',
        duration: '7-10 days',
        requirements: 'Warm soil, good drainage',
        care: 'Monitor soil moisture'
      },
      {
        name: 'Vegetative Growth',
        duration: '30-40 days',
        requirements: 'Regular irrigation, balanced nutrients',
        care: 'Scout for early-season pests'
      },
      {
        name: 'Flowering',
        duration: '20-25 days',
        requirements: 'Adequate moisture and nutrients',
        care: 'Monitor for boll weevils'
      }
    ],
    commonProblems: [
      'Boll Weevil',
      'Cotton Root Rot'
    ],
    harvestInfo: 'Cotton is typically harvested in the early to mid-summer.'
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    description: 'A versatile legume crop that fixes nitrogen in the soil.',
    stages: [
      {
        name: 'Germination',
        duration: '5-7 days',
        requirements: 'Soil temperature 18-30°C, good moisture',
        care: 'Ensure proper seed depth and soil contact'
      },
      {
        name: 'Vegetative Growth',
        duration: '25-35 days',
        requirements: 'Adequate phosphorus and potassium',
        care: 'Monitor for early-season pests'
      },
      {
        name: 'Flowering',
        duration: '15-25 days',
        requirements: 'Consistent moisture, good nutrient levels',
        care: 'Avoid water stress during pod formation'
      }
    ],
    commonProblems: [
      'Soybean rust',
      'Root rot in poorly drained soils',
      'Japanese beetles'
    ],
    harvestInfo: 'Harvest when pods are brown and seeds rattle inside'
  },
  {
    id: 'potato',
    name: 'Potato',
    description: 'A root vegetable that grows best in cool, well-drained soil.',
    stages: [
      {
        name: 'Sprouting',
        duration: '14-21 days',
        requirements: 'Soil temperature 7-13°C, moderate moisture',
        care: 'Plant seed potatoes in well-prepared soil'
      },
      {
        name: 'Vegetative Growth',
        duration: '30-40 days',
        requirements: 'Regular watering, nitrogen-rich soil',
        care: 'Hill soil around plants as they grow'
      },
      {
        name: 'Tuber Formation',
        duration: '40-50 days',
        requirements: 'Consistent moisture, good potassium levels',
        care: 'Maintain soil moisture, avoid over-watering'
      }
    ],
    commonProblems: [
      'Late blight',
      'Colorado potato beetle',
      'Scab in alkaline soils'
    ],
    harvestInfo: 'Harvest when plants yellow and die back, or when tubers reach desired size'
  },
  {
    id: 'sweet potato',
    name: 'Sweet Potato',
    description: 'A warm-season root crop that produces nutritious tubers.',
    stages: [
      {
        name: 'Slip Planting',
        duration: '7-14 days',
        requirements: 'Soil temperature above 18°C, good drainage',
        care: 'Plant slips deep enough to cover nodes'
      },
      {
        name: 'Vine Growth',
        duration: '30-45 days',
        requirements: 'Regular watering, warm temperatures',
        care: 'Keep area weed-free until vines cover ground'
      },
      {
        name: 'Root Development',
        duration: '50-60 days',
        requirements: 'Moderate moisture, no nitrogen excess',
        care: 'Avoid over-fertilizing with nitrogen'
      }
    ],
    commonProblems: [
      'Sweet potato weevil',
      'Root rot in wet conditions',
      'Scurf disease'
    ],
    harvestInfo: 'Harvest before soil temperatures drop below 10°C, typically after 90-120 days'
  },
  {
    id: 'alfalfa',
    name: 'Alfalfa',
    description: 'A perennial legume known for its high protein content and nitrogen-fixing abilities.',
    stages: [
      {
        name: 'Germination',
        duration: '7-10 days',
        requirements: 'Soil temperature 18-25°C, well-drained soil',
        care: 'Keep soil moist but not waterlogged'
      },
      {
        name: 'Seedling',
        duration: '30-40 days',
        requirements: 'Good sunlight, adequate moisture',
        care: 'Control weeds, protect from pests'
      },
      {
        name: 'Vegetative Growth',
        duration: '45-60 days',
        requirements: 'Regular irrigation, good drainage',
        care: 'Monitor for diseases and insects'
      },
      {
        name: 'Flowering',
        duration: '25-35 days',
        requirements: 'Adequate phosphorus and potassium',
        care: 'Prepare for harvest when 10% of plants are blooming'
      }
    ],
    commonProblems: [
      'Crown rot in wet conditions',
      'Alfalfa weevil damage',
      'Leaf spot diseases'
    ],
    harvestInfo: 'Harvest when plants are at 10% bloom stage for optimal nutrition and regrowth'
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    description: 'A drought-tolerant grain crop that thrives in warm climates.',
    stages: [
      {
        name: 'Germination',
        duration: '5-10 days',
        requirements: 'Soil temperature above 18°C, moderate moisture',
        care: 'Ensure good seed-to-soil contact'
      },
      {
        name: 'Vegetative Growth',
        duration: '20-30 days',
        requirements: 'Regular watering, nitrogen-rich soil',
        care: 'Control weeds in early stages'
      },
      {
        name: 'Boot Stage',
        duration: '30-40 days',
        requirements: 'Adequate moisture and nutrients',
        care: 'Monitor for pests and diseases'
      },
      {
        name: 'Flowering and Grain Fill',
        duration: '25-35 days',
        requirements: 'Good sunlight, moderate water',
        care: 'Protect from birds and weather extremes'
      }
    ],
    commonProblems: [
      'Bird damage to developing grain',
      'Sorghum midge',
      'Charcoal rot in drought conditions'
    ],
    harvestInfo: 'Harvest when seeds are hard and moisture content is below 14%'
  },
  {
    id: 'barley',
    name: 'Barley',
    description: 'A versatile grain crop known for its adaptability to various climates.',
    stages: [
      {
        name: 'Germination',
        duration: '7-10 days',
        requirements: 'Soil temperature 12-20°C, adequate moisture',
        care: 'Maintain consistent soil moisture'
      },
      {
        name: 'Tillering',
        duration: '15-25 days',
        requirements: 'Good nitrogen levels, well-drained soil',
        care: 'Monitor for early season weeds'
      },
      {
        name: 'Stem Extension',
        duration: '20-30 days',
        requirements: 'Balanced nutrients, moderate water',
        care: 'Apply fertilizer if needed'
      },
      {
        name: 'Heading and Grain Fill',
        duration: '30-40 days',
        requirements: 'Adequate sunlight and water',
        care: 'Protect from lodging and diseases'
      }
    ],
    commonProblems: [
      'Powdery mildew',
      'Net blotch disease',
      'Lodging in wet conditions'
    ],
    harvestInfo: 'Harvest when grain is hard and golden-colored, typically when moisture is 13-14%'
  }
];

const CropManual: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropGuide | null>(null);
  const [recommendedCrops, setRecommendedCrops] = useState<CropGuide[]>([]);
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const soilAnalysis = localStorage.getItem('soilAnalysisResult');
      if (!soilAnalysis) {
        setError('Please complete a soil analysis to see crop recommendations.');
        setIsLoading(false);
        return;
      }

      const analysisData = JSON.parse(soilAnalysis);
      console.log('Full analysis data:', analysisData);

      // Get recommended crops from the recommendedCrops array
      const recommendedCropIds = analysisData.recommendedCrops || [];
      console.log('Recommended crop IDs:', recommendedCropIds);

      if (recommendedCropIds.length === 0) {
        setError('No crop recommendations found.');
        setIsLoading(false);
        return;
      }

      // Convert crop IDs to lowercase for comparison
      const lowerCaseRecommendedCrops = recommendedCropIds.map((crop: string) => crop.toLowerCase());
      console.log('Lowercase recommended crops:', lowerCaseRecommendedCrops);

      // Find matching crops from our guides
      const matchingCrops = cropGuides.filter(guide => 
        lowerCaseRecommendedCrops.includes(guide.id.toLowerCase())
      );
      console.log('Found matching crops:', matchingCrops);

      if (matchingCrops.length === 0) {
        setError('No matching crop guides found.');
        setIsLoading(false);
        return;
      }

      // Update state with found crops
      setRecommendedCrops(matchingCrops);
      setSelectedCrop(matchingCrops[0]);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing soil analysis:', err);
      setError('Error loading crop recommendations. Please try again.');
      setIsLoading(false);
    }
  }, []);

  const handleCropSelect = (cropId: string): void => {
    console.log('Selecting crop:', cropId);
    const matchingCrop = recommendedCrops.find(crop => crop.id.toLowerCase() === cropId.toLowerCase());
    console.log('Found crop:', matchingCrop);
    if (matchingCrop) {
      setSelectedCrop(matchingCrop);
      setActiveStage(0);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading crop recommendations...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <Plant className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Crop Growing Guide</h1>
              <p className="text-green-50">Detailed growing instructions for your recommended crops</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600">{error}</p>
          </div>
        ) : recommendedCrops.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-700">Please complete a soil analysis to see crop recommendations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Recommended Crops</h2>
                <div className="space-y-2">
                  {recommendedCrops.map(crop => (
                    <button
                      key={crop.id}
                      onClick={() => handleCropSelect(crop.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCrop?.id === crop.id
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {crop.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedCrop && (
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedCrop.name}</h2>
                  <p className="text-gray-600">{selectedCrop.description}</p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">Growing Requirements</h3>
                      <ul className="space-y-2">
                        {selectedCrop.stages[0] && (
                          <>
                            <li className="flex items-center">
                              <Sun className="h-5 w-5 text-green-600 mr-2" />
                              <span>{selectedCrop.stages[0].requirements}</span>
                            </li>
                            <li className="flex items-center">
                              <Droplets className="h-5 w-5 text-green-600 mr-2" />
                              <span>{selectedCrop.stages[0].care}</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Harvest Information</h3>
                      <p>{selectedCrop.harvestInfo}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Growing Stages</h3>
                  <div className="space-y-4">
                    {selectedCrop.stages.map((stage, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          activeStage === index
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-200'
                        }`}
                        onClick={() => setActiveStage(index)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                          <span className="text-sm text-gray-500">{stage.duration}</span>
                        </div>
                        <p className="text-gray-600">{stage.requirements}</p>
                        <p className="text-green-600 mt-2">{stage.care}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Common Problems</h3>
                  <div className="space-y-4">
                    {selectedCrop.commonProblems.map((problem, index) => (
                      <div key={index} className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">{problem}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CropManual; 