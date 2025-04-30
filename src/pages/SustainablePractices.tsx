import { useState } from 'react';
import { FarmingPractice, Review } from '../types';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const mockPractices: FarmingPractice[] = [
  {
    id: '1',
    title: 'Companion Planting',
    description: 'Growing different plants together for optimal growth and pest control.',
    category: 'Crop Management',
    sustainability_score: 4.5,
    verified: true,
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Jane Doe',
        targetId: '1',
        targetType: 'practice',
        rating: 5,
        comment: 'This method has significantly reduced pest problems in my garden!',
        createdAt: new Date()
      }
    ],
    createdAt: new Date()
  }
];

export default function SustainablePractices() {
  const [practices, setPractices] = useState<FarmingPractice[]>(mockPractices);
  const [selectedPractice, setSelectedPractice] = useState<FarmingPractice | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleAddReview = (practiceId: string) => {
    const review: Review = {
      id: Date.now().toString(),
      userId: 'current-user', // Replace with actual user ID
      userName: 'Current User', // Replace with actual user name
      targetId: practiceId,
      targetType: 'practice',
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date()
    };

    setPractices(practices.map(practice => {
      if (practice.id === practiceId) {
        return {
          ...practice,
          reviews: [...practice.reviews, review],
          sustainability_score: (
            (practice.sustainability_score * practice.reviews.length + review.rating) /
            (practice.reviews.length + 1)
          )
        };
      }
      return practice;
    }));

    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sustainable Farming Practices</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practices.map(practice => (
          <div key={practice.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{practice.title}</h2>
                {practice.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Verified Practice
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-400" size={20} fill="currentColor" />
                <span className="font-semibold">
                  {practice.sustainability_score.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{practice.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {practice.reviews.length} reviews
              </span>
              <button
                onClick={() => {
                  setSelectedPractice(practice);
                  setShowReviewForm(true);
                }}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Add Review
              </button>
            </div>

            <div className="space-y-4">
              {practice.reviews.slice(0, 2).map(review => (
                <div key={review.id} className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.userName}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400" size={16} fill="currentColor" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <span className="text-gray-400 text-xs">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showReviewForm && selectedPractice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              Review: {selectedPractice.title}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className={`p-1 rounded-full focus:outline-none ${
                        rating <= newReview.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star size={24} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2 h-32"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this practice..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ rating: 5, comment: '' });
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddReview(selectedPractice.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  disabled={!newReview.comment}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 