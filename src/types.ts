export interface User {
  name: string;
  email: string;
  password: string;
}

export interface SoilData {
  ph: number;
  soilType: string;
  soilColor: string;
  moistureLevel: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  location: string;
  fieldName: string;
  sampleDate: string;
}

export interface CropRecommendation {
  crop: string;
  fertilizer: string;
  description: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  subcategory?: string;
  images: string[];
  location: string;
  createdAt: Date;
  organic: boolean;
  certification?: string[];
  harvestDate?: Date;
  expiryDate?: Date;
  minimumOrder?: number;
  availableForBulk: boolean;
  bulkDiscount?: number;
  shippingOptions: ShippingOption[];
  paymentMethods: string[];
  status: 'available' | 'low-stock' | 'out-of-stock' | 'coming-soon';
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  shippingOption: ShippingOption;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string; // Can be productId or farmerId
  targetType: 'product' | 'farmer' | 'practice';
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  likes: number;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface FarmingPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  sustainability_score: number;
  verified: boolean;
  reviews: Review[];
  createdAt: Date;
}