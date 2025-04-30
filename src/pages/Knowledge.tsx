import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Tag, 
  Clock, 
  ArrowRight, 
  ThumbsUp, 
  Bookmark, 
  Image, 
  FileText,
  Leaf,
  Star,
  Sprout
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

// Enhanced Article interface 
interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
  readTime: number;
  likes: number;
  date: string;
  author?: string;
  relatedArticles?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Update the cropArticles array with correct file extensions
const cropArticles: Article[] = [
  {
    id: '1',
    title: 'Maximizing Wheat Yields in Loamy Soil',
    summary: 'Learn the optimal techniques for growing wheat in loamy soils with proper nutrient management.',
    content: `
      <h2>Introduction to Wheat Cultivation</h2>
      <p>Wheat is one of the world's most important cereal crops, providing essential nutrients to billions of people. Growing wheat successfully requires understanding soil conditions, climate requirements, and proper cultivation techniques.</p>
      
      <h2>Soil Preparation</h2>
      <p>Loamy soil is ideal for wheat cultivation due to its balanced mixture of sand, silt, and clay. Before planting:</p>
      <ul>
        <li>Test soil pH (aim for 6.0-7.0)</li>
        <li>Incorporate organic matter to improve soil structure</li>
        <li>Ensure proper drainage</li>
      </ul>
      
      <h2>Nutrient Management</h2>
      <p>Wheat requires specific nutrients at different growth stages:</p>
      <ul>
        <li>Nitrogen: 120-150 kg/ha (split application)</li>
        <li>Phosphorus: 60-80 kg/ha (pre-planting)</li>
        <li>Potassium: 40-60 kg/ha (pre-planting)</li>
      </ul>
      
      <h2>Planting Techniques</h2>
      <p>Row spacing of 15-20 cm is optimal for wheat, with seeding depth of 3-5 cm. Seed rate of 100-120 kg/ha is recommended for irrigated conditions.</p>
      
      <h2>Water Management</h2>
      <p>Wheat typically requires 450-650 mm of water throughout its growing season. Critical irrigation periods include crown root initiation, tillering, flowering, and grain filling stages.</p>
    `,
    category: 'Crop Guides',
    tags: ['Wheat', 'Loamy Soil', 'Nutrient Management'],
    featured: true,
    image: '/images/wheat-field.jpeg',
    readTime: 8,
    likes: 245,
    date: '2024-03-15',
    author: 'Dr. Sarah Johnson',
    relatedArticles: ['4', '5'],
    difficulty: 'intermediate'
  },
  {
    id: '2',
    title: 'Rice Cultivation in High Moisture Conditions',
    summary: 'Expert guidance on rice farming techniques for regions with high rainfall or humidity.',
    content: `
      <h2>Rice Cultivation Fundamentals</h2>
      <p>Rice is a staple food for more than half the world's population. It thrives in warm, humid environments with abundant water.</p>
      
      <h2>Variety Selection</h2>
      <p>For high moisture conditions, consider these varieties:</p>
      <ul>
        <li>IR64: Good resistance to pests and diseases</li>
        <li>Swarna: High yield potential in wet conditions</li>
        <li>MTU1010: Short duration variety with good tolerance</li>
      </ul>
      
      <h2>Water Management</h2>
      <p>Proper water management is critical for rice production:</p>
      <ul>
        <li>Maintain 5-7 cm water depth during vegetative stage</li>
        <li>Practice alternate wetting and drying to reduce disease pressure</li>
        <li>Ensure proper drainage to prevent waterlogging</li>
      </ul>
      
      <h2>Disease Management</h2>
      <p>High moisture increases disease pressure. Regular monitoring for blast, sheath blight, and bacterial leaf blight is essential. Preventive fungicide applications may be necessary during critical growth stages.</p>
    `,
    category: 'Crop Guides',
    tags: ['Rice', 'Water Management', 'High Rainfall'],
    featured: false,
    image: '/images/rice-paddy.jpeg',
    readTime: 7,
    likes: 189,
    date: '2024-03-10',
    author: 'Prof. Michael Chen',
    relatedArticles: ['3', '5'],
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Organic Corn Production in Sandy Soil',
    summary: 'Sustainable approaches to growing corn organically in sandy soil conditions.',
    content: `
      <h2>Challenges of Sandy Soil</h2>
      <p>Sandy soils drain quickly and have lower nutrient retention capacity. Organic corn production in such conditions requires specialized approaches.</p>
      
      <h2>Soil Improvement Strategies</h2>
      <p>Improving sandy soil structure is critical:</p>
      <ul>
        <li>Incorporate compost at 20-30 tons/ha</li>
        <li>Use cover crops like hairy vetch or clover</li>
        <li>Apply organic mulch to improve water retention</li>
      </ul>
      
      <h2>Organic Fertilization</h2>
      <p>Nutrient management for organic corn:</p>
      <ul>
        <li>Pre-plant application of composted manure</li>
        <li>Side-dress with organic nitrogen sources at V6 stage</li>
        <li>Foliar applications of seaweed extract for micronutrients</li>
      </ul>
      
      <h2>Pest Management</h2>
      <p>Implement integrated pest management through crop rotation, beneficial insects, and approved organic pesticides when necessary.</p>
    `,
    category: 'Organic Farming',
    tags: ['Corn', 'Sandy Soil', 'Organic', 'Sustainable'],
    featured: false,
    image: '/images/corn-field.jpeg',
    readTime: 9,
    likes: 215,
    date: '2024-02-28',
    author: 'Emily Rodriguez, Organic Specialist',
    relatedArticles: ['4', '5'],
    difficulty: 'advanced'
  },
  {
    id: '4',
    title: 'Soybeans: Maximizing Yield in Clay Soil',
    summary: 'Advanced techniques for growing high-yielding soybean crops in heavy clay soils.',
    content: `
      <h2>Clay Soil Challenges</h2>
      <p>Clay soils present unique challenges for soybean production including poor drainage, slow warming, and compaction issues.</p>
      
      <h2>Soil Preparation</h2>
      <ul>
        <li>Deep tillage in fall to break compaction layers</li>
        <li>Addition of gypsum to improve soil structure</li>
        <li>Raised bed planting to improve drainage</li>
      </ul>
      
      <h2>Variety Selection</h2>
      <p>Choose varieties with:</p>
      <ul>
        <li>Strong emergence in cool, wet conditions</li>
        <li>Phytophthora root rot resistance</li>
        <li>Appropriate maturity group for your region</li>
      </ul>
      
      <h2>Planting Considerations</h2>
      <p>Wait until soil temperatures reach 12-13°C at 5 cm depth. Consider lower seeding rates (350,000-400,000 seeds/ha) to reduce disease pressure in heavy soils.</p>
    `,
    category: 'Crop Guides',
    tags: ['Soybeans', 'Clay Soil', 'Drainage'],
    featured: false,
    image: '/images/soybean-field.jpeg',
    readTime: 6,
    likes: 167,
    date: '2024-03-05',
    author: 'Dr. Robert Williams',
    relatedArticles: ['1', '3'],
    difficulty: 'intermediate'
  },
  {
    id: '5',
    title: 'Sustainable Farming Practices for Modern Agriculture',
    summary: 'Learn about the latest sustainable farming techniques and how they can benefit your crops and soil health for long-term productivity.',
    content: `
      <h2>What is Sustainable Farming?</h2>
      <p>Sustainable farming practices focus on meeting society's food and textile needs without compromising the ability of future generations to meet their needs.</p>
      
      <h2>Key Principles</h2>
      <ul>
        <li>Conservation tillage to minimize soil disturbance</li>
        <li>Crop rotation to break pest cycles and improve soil health</li>
        <li>Integrated pest management to reduce chemical inputs</li>
        <li>Water conservation through efficient irrigation</li>
        <li>Biodiversity promotion on and around the farm</li>
      </ul>
      
      <h2>Benefits of Sustainable Farming</h2>
      <p>Implementing sustainable practices can:</p>
      <ul>
        <li>Reduce production costs through lower input requirements</li>
        <li>Improve soil health and long-term productivity</li>
        <li>Increase resilience to climate variability</li>
        <li>Reduce environmental impact and greenhouse gas emissions</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Begin with soil testing and assessment of current practices. Implement changes gradually, monitoring results and adjusting as needed.</p>
    `,
    category: 'Sustainable Farming',
    tags: ['Sustainability', 'Conservation', 'Soil Health'],
    featured: true,
    image: '/images/sustainable-farm.jpeg',
    readTime: 10,
    likes: 320,
    date: '2024-03-01',
    author: 'Dr. James Taylor, Sustainable Agriculture Researcher',
    relatedArticles: ['1', '3'],
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'Beginner\'s Guide to Crop Selection Based on Soil Type',
    summary: 'Essential information for new farmers on matching crops to your specific soil conditions for optimal yields.',
    content: `
      <h2>Understanding Your Soil Type</h2>
      <p>The first step in successful farming is understanding your soil type. Different soils support different crops.</p>
      
      <h2>Major Soil Types and Suitable Crops</h2>
      <h3>Sandy Soil</h3>
      <p>Best crops: Carrots, radishes, potatoes, lettuce</p>
      <p>Advantages: Warms quickly in spring, good for early planting</p>
      <p>Challenges: Low water retention, requires frequent irrigation</p>
      
      <h3>Clay Soil</h3>
      <p>Best crops: Cabbage, broccoli, beans, peas</p>
      <p>Advantages: Excellent nutrient retention</p>
      <p>Challenges: Drainage issues, slow to warm in spring</p>
      
      <h3>Loamy Soil</h3>
      <p>Best crops: Most crops thrive, particularly wheat, corn, vegetables</p>
      <p>Advantages: Balanced drainage and water retention</p>
      <p>Challenges: Maintaining organic matter content</p>
      
      <h3>Silty Soil</h3>
      <p>Best crops: Fruit trees, shrubs, vegetables like leafy greens</p>
      <p>Advantages: Good water retention and fertility</p>
      <p>Challenges: Compaction risk when wet</p>
      
      <h2>Soil Testing</h2>
      <p>Always test your soil before making planting decisions. A comprehensive soil test will provide information on pH, nutrient levels, and organic matter content.</p>
    `,
    category: 'Getting Started',
    tags: ['Beginner', 'Soil Types', 'Crop Selection'],
    featured: false,
    image: '/images/soil-types.jpeg',
    readTime: 6,
    likes: 320,
    date: '2024-03-25',
    author: 'Maria Gonzalez, Extension Specialist',
    relatedArticles: ['1', '4'],
    difficulty: 'beginner'
  }
];

// Update the handleImageError function to help debug
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  console.error(`Failed to load image: ${e.currentTarget.src}`);
  e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23557A55'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='32' fill='white' text-anchor='middle' dy='.3em'%3EImage Not Found%3C/text%3E%3C/svg%3E`;
  e.currentTarget.onerror = null;
};

// 1. Add pagination instead of loading all articles at once
interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

const Knowledge: React.FC = () => {
  // 1. Memoize the articles array to prevent unnecessary re-renders
  const [articles, setArticles] = useState<Article[]>(useMemo(() => cropArticles, []));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isReading, setIsReading] = useState<Article | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [imageLoadFailed, setImageLoadFailed] = useState<Record<string, boolean>>({});
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showTable, setShowTable] = useState<boolean>(false);
  
  // Add pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 6,
    total: cropArticles.length
  });

  // Add loading state with other state declarations
  const [isLoading, setIsLoading] = useState(false);

  // 2. Optimize image loading with lazy loading
  const renderImage = (src: string, alt: string, className: string) => {
    if (imageLoadFailed[src]) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
          <Image className="h-12 w-12 text-gray-400" />
        </div>
      );
    }
    
    return (
      <img 
        src={src} 
        alt={alt} 
        className={className}
        loading="lazy" // Add lazy loading
        decoding="async" // Add async decoding
        onError={(e) => {
          handleImageError(e);
          setImageLoadFailed(prev => ({ ...prev, [src]: true }));
        }}
      />
    );
  };

  // 2. Memoize filtered articles to prevent unnecessary recalculations
  const filteredArticles = useMemo(() => {
    if (!searchTerm && selectedCategory === 'All' && difficultyFilter === 'all') {
      return articles;
    }
    
    return articles.filter(article => {
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesDifficulty = difficultyFilter === 'all' || article.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [articles, searchTerm, selectedCategory, difficultyFilter]);

  // 3. Optimize the renderArticleGrid function
  const renderArticleGrid = useCallback(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const visibleArticles = filteredArticles.slice(startIndex, endIndex);

  return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onSave={handleSaveArticle}
              onRead={setIsReading}
              isSaved={savedArticles.includes(article.id)}
              renderImage={renderImage}
            />
          ))}
        </div>

        {filteredArticles.length > endIndex && (
          <button 
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            className="w-full text-center text-green-600 hover:text-green-700 font-medium py-4"
          >
            Load More Articles
          </button>
        )}
      </>
    );
  }, [filteredArticles, pagination, savedArticles]);

  // 4. Create a separate ArticleCard component to reduce re-renders
  const ArticleCard: React.FC<{
    article: Article;
    onSave: (id: string) => void;
    onRead: (article: Article) => void;
    isSaved: boolean;
    renderImage: (src: string, alt: string, className: string) => JSX.Element;
  }> = memo(({ article, onSave, onRead, isSaved, renderImage }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg">
      <div className="h-40 overflow-hidden">
        {renderImage(
          article.image,
          article.title,
          "w-full h-full object-cover transition hover:scale-105"
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{article.category}</span>
            </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{article.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{article.readTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onSave(article.id)}
              className={`p-1.5 rounded-full ${
                isSaved 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onRead(article)}
              className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Read
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  // 5. Optimize useEffect for filtering
  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      setArticles(cropArticles);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, difficultyFilter]);

  // 6. Memoize handlers
  const handleSaveArticle = useCallback((articleId: string) => {
    setSavedArticles(prev => {
      const newSavedArticles = prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId];
      localStorage.setItem('savedArticles', JSON.stringify(newSavedArticles));
      return newSavedArticles;
    });
  }, []);

  // Table of soil types and crops
  const soilTable = {
    headers: ['Soil Type', 'Best Crops', 'pH Range', 'Special Considerations'],
    rows: [
      ['Sandy', 'Carrots, Potatoes, Radishes', '5.5-7.0', 'Requires frequent irrigation and fertilization'],
      ['Clay', 'Cabbage, Broccoli, Beans', '6.0-7.5', 'Needs good drainage, slow to warm up'],
      ['Loamy', 'Most crops, especially wheat, corn', '6.0-7.0', 'Balanced properties, most versatile'],
      ['Silty', 'Fruit trees, leafy greens', '6.0-7.0', 'Retains moisture, avoid compaction'],
      ['Peaty', 'Legumes, root vegetables', '5.0-6.0', 'High organic content, may need lime'],
      ['Chalky', 'Spinach, beets, sweet corn', '7.0-8.0', 'High pH, may need iron supplements']
    ]
  };

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(cropArticles.map(a => a.category)))],
    []
  );

  const allTags = useMemo(() => 
    Array.from(new Set(cropArticles.flatMap(a => a.tags))),
    []
  );

  return (
    <ErrorBoundary>
      <Layout>
        <div className="container mx-auto px-4 py-8 print:py-2 print:px-0">
          {!isReading ? (
            <>
              {/* Enhanced Header with search */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 mb-8 text-white print:hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">Farming Knowledge Base</h1>
                  </div>
                  <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 text-white placeholder-white/70 border border-white/20"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                  </div>
          </div>

                {/* Advanced Filters */}
                <div className="mt-6 flex flex-col md:flex-row gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Filter className="h-4 w-4 mr-1" />
                    <span className="text-sm opacity-80 mr-2">Categories:</span>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                          px-3 py-1.5 text-sm rounded-full transition
                          ${selectedCategory === category 
                            ? 'bg-white text-green-600' 
                            : 'bg-white/10 hover:bg-white/20'}
                        `}
                      >
                        {category}
            </button>
                    ))}
          </div>

                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm opacity-80 mr-2">Difficulty:</span>
                    <select 
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quicklinks for common farming questions */}
              <div className="bg-green-50 rounded-xl p-4 mb-8 border border-green-100 print:hidden">
                <h2 className="text-lg font-semibold text-green-800 mb-3">Quick Answers to Common Questions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="text-left p-3 bg-white rounded-lg border border-green-100 text-green-700 hover:bg-green-100 transition flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Which crops work best with my soil type?</span>
                  </button>
                  <button 
                    onClick={() => setSearchTerm('nutrient management')}
                    className="text-left p-3 bg-white rounded-lg border border-green-100 text-green-700 hover:bg-green-100 transition flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>How to manage nutrients effectively?</span>
                  </button>
                  <button 
                    onClick={() => setSearchTerm('sustainable')}
                    className="text-left p-3 bg-white rounded-lg border border-green-100 text-green-700 hover:bg-green-100 transition flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Sustainable farming practices</span>
            </button>
          </div>
        </div>

              {/* Table of Soil Types (toggled) */}
              {showTable && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Soil Types and Recommended Crops</h2>
                    <button 
                      onClick={() => setShowTable(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {soilTable.headers.map((header, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {soilTable.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Results counter and saved articles */}
              <div className="mb-6 flex justify-between items-center print:hidden">
                <p className="text-gray-600">
                  Showing {articles.length} {articles.length === 1 ? 'article' : 'articles'}
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  {difficultyFilter !== 'all' && ` with ${difficultyFilter} difficulty`}
                </p>
                {savedArticles.length > 0 && (
                  <button 
                    onClick={() => setArticles(cropArticles.filter(a => savedArticles.includes(a.id)))}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  >
                    <Bookmark className="h-4 w-4" />
                    View {savedArticles.length} saved articles
                  </button>
                )}
              </div>

              {/* Featured Articles */}
              {!searchTerm && selectedCategory === 'All' && difficultyFilter === 'all' && (
                <div className="mb-8 print:hidden">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Featured Articles
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {articles.filter(a => a.featured).map(article => (
                      <div 
                        key={article.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg border border-gray-100"
                      >
                        <div className="h-48 overflow-hidden">
                          {renderImage(
                            article.image, 
                            article.title, 
                            "w-full h-full object-cover transition hover:scale-105"
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Featured</span>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{article.category}</span>
                            {article.difficulty && (
                              <span className={`text-xs font-medium px-2.5 py-0.5 rounded
                                ${article.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' : 
                                  article.difficulty === 'intermediate' ? 'bg-purple-100 text-purple-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {article.difficulty.charAt(0).toUpperCase() + article.difficulty.slice(1)}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 mb-4">{article.summary}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{article.readTime} min read</span>
                              {article.author && (
                                <span className="ml-3 italic">By {article.author.split(',')[0]}</span>
                              )}
                            </div>
                            <button 
                              onClick={() => setIsReading(article)}
                              className="flex items-center text-green-600 hover:text-green-700 font-medium"
                            >
                              Read more <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add this button near the top of your content */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                <Link 
                  to="/crop-manual" 
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Sprout className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Crop Growing Guides</h3>
                      <p className="text-sm text-green-600">Detailed manuals for planting, maintaining, and harvesting crops</p>
                    </div>
                  </div>
                  <span className="text-green-600">→</span>
                </Link>
              </div>

              {/* Replace the article grid section with loading state */}
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* Main article grid */}
                  {renderArticleGrid()}

                  {/* No results */}
                  {articles.length === 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                      <p className="text-lg text-gray-600 mb-4">No articles found matching your search.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                        }}
                        className="text-green-600 font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Popular Topics */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold">Popular Topics</h2>
                </div>
          <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Render reading view with optimization
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
              <button 
                onClick={() => setIsReading(null)}
                className="flex items-center text-green-600 mb-6 hover:text-green-700"
              >
                ← Back to all articles
              </button>
              
              <div className="max-w-3xl mx-auto">
                {renderImage(
                  isReading.image, 
                  isReading.title, 
                  "w-full h-64 object-cover rounded-xl mb-6"
                )}
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-1 rounded">{isReading.category}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{isReading.readTime} min read</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{isReading.likes}</span>
                  </div>
                  <button 
                    onClick={() => handleSaveArticle(isReading.id)}
                    className={`flex items-center gap-1 text-sm ${
                      savedArticles.includes(isReading.id) 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" />
                    {savedArticles.includes(isReading.id) ? 'Saved' : 'Save'}
                  </button>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{isReading.title}</h1>
                <p className="text-gray-700 text-lg mb-6">{isReading.summary}</p>
                
                <div 
                  className="prose prose-green max-w-none"
                  dangerouslySetInnerHTML={{ __html: isReading.content }}
                />
                
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-gray-700 font-medium">Related topics:</span>
                    {isReading.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
            </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsReading(null)}
                    className="text-green-600 font-medium"
                  >
                    ← Back to Knowledge Base
                  </button>
          </div>
        </div>
            </div>
          )}
      </div>
    </Layout>
    </ErrorBoundary>
  );
};

export default memo(Knowledge);