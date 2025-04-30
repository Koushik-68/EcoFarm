import { SoilData, CropRecommendation } from '../types';

const cropDatabase = {
  acidic: {
    high_moisture: [
      { crop: 'Rice', fertilizer: 'NPK 14-14-14', description: 'Rice thrives in acidic, waterlogged conditions. Use balanced NPK fertilizer for optimal growth.' },
      { crop: 'Blueberries', fertilizer: 'Ammonium sulfate', description: 'Blueberries prefer acidic soil with pH 4.5-5.5. Ammonium sulfate helps maintain soil acidity.' }
    ],
    low_moisture: [
      { crop: 'Potato', fertilizer: 'DAP', description: 'Potatoes prefer slightly acidic soil. DAP provides necessary phosphorus for tuber development.' },
      { crop: 'Sweet Potato', fertilizer: 'NPK 5-10-10', description: 'Sweet potatoes grow well in acidic soil with good drainage. Low nitrogen prevents excessive vine growth.' }
    ]
  },
  neutral: {
    loamy: [
      { crop: 'Wheat', fertilizer: 'Urea', description: 'Wheat grows best in neutral, well-draining loamy soil. Urea provides essential nitrogen for grain development.' },
      { crop: 'Corn', fertilizer: 'NPK 10-20-20', description: 'Corn requires balanced nutrients with higher phosphorus and potassium for strong stalks and good yield.' }
    ],
    clay: [
      { crop: 'Cotton', fertilizer: 'Vermicompost', description: 'Cotton prefers neutral to alkaline soil. Organic fertilizer improves soil structure and water retention.' },
      { crop: 'Soybeans', fertilizer: 'Triple superphosphate', description: 'Soybeans fix nitrogen but need phosphorus. Clay soil provides good water retention.' }
    ]
  },
  alkaline: {
    sandy: [
      { crop: 'Sorghum', fertilizer: 'Organic Compost', description: 'Sorghum is tolerant to alkaline conditions. Organic matter helps balance pH and improve water retention.' },
      { crop: 'Barley', fertilizer: 'NPK 20-10-10', description: 'Barley tolerates alkaline soils well. Higher nitrogen promotes good tillering.' }
    ],
    any: [
      { crop: 'Alfalfa', fertilizer: 'Phosphate rock', description: 'Alfalfa grows well in alkaline soil and fixes nitrogen. Phosphate promotes root development.' },
      { crop: 'Sugar Beets', fertilizer: 'Potassium sulfate', description: 'Sugar beets tolerate alkaline conditions and need good potassium levels for sugar content.' }
    ]
  }
};

export const getCropRecommendation = (soilData: SoilData): CropRecommendation[] => {
  let recommendations: CropRecommendation[] = [];

  // Determine soil pH category
  let pHCategory = soilData.ph < 6.5 ? 'acidic' : 
                   soilData.ph > 7.5 ? 'alkaline' : 'neutral';

  // Get relevant recommendations based on pH and other factors
  if (pHCategory === 'acidic') {
    recommendations = soilData.moistureLevel === 'High' 
      ? cropDatabase.acidic.high_moisture
      : cropDatabase.acidic.low_moisture;
  } else if (pHCategory === 'neutral') {
    recommendations = soilData.soilType === 'Loamy'
      ? cropDatabase.neutral.loamy
      : cropDatabase.neutral.clay;
  } else {
    recommendations = soilData.soilType === 'Sandy'
      ? cropDatabase.alkaline.sandy
      : cropDatabase.alkaline.any;
  }

  // Add NPK recommendations based on soil levels
  recommendations = recommendations.map(rec => ({
    ...rec,
    description: rec.description + getNPKRecommendation(soilData)
  }));

  return recommendations;
};

const getNPKRecommendation = (soilData: SoilData): string => {
  let recommendations = [];

  if (soilData.nitrogen && soilData.nitrogen < 40) {
    recommendations.push('Consider adding nitrogen-rich fertilizers.');
  }
  if (soilData.phosphorus && soilData.phosphorus < 40) {
    recommendations.push('Phosphorus supplementation recommended.');
  }
  if (soilData.potassium && soilData.potassium < 40) {
    recommendations.push('Additional potassium may be beneficial.');
  }

  return recommendations.length > 0 
    ? ' Additional recommendations: ' + recommendations.join(' ')
    : '';
};

export const getFertilizerSchedule = (crop: string): string[] => {
  const schedules: Record<string, string[]> = {
    'Rice': [
      'Base application: Apply NPK before transplanting',
      'First top dressing: 25-30 days after transplanting',
      'Second top dressing: At panicle initiation stage'
    ],
    'Wheat': [
      'Starter fertilizer: At sowing time',
      'First split: 21-25 days after sowing',
      'Second split: At flowering stage'
    ],
    'Cotton': [
      'Basal dose: Before sowing',
      'First split: 30-35 days after sowing',
      'Second split: At flowering stage',
      'Third split: At boll formation'
    ]
  };

  return schedules[crop] || [
    'Base application: Before planting',
    'Follow-up: 30 days after planting',
    'Maintenance: As needed based on plant growth'
  ];
};