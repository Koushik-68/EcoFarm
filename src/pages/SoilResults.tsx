import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const SoilResults: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    // Fetch results from localStorage when component mounts
    const results = localStorage.getItem('soilAnalysisResult');
    if (results) {
      setAnalysisResults(JSON.parse(results));
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {analysisResults && (
          <>
            {/* Display soil analysis results */}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SoilResults; 