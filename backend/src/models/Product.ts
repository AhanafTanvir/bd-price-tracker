import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  keyword?: string;
  category?: string;
  store: string;
  price: number;
  rating: number;
  imageUrl: string;
  productUrl: string;
  inStock: boolean;
  updatedAt: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  keyword: { type: String, index: true },
  category: { type: String, index: true },
  store: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  rating: { type: Number, default: 4.7 },
  imageUrl: { type: String },
  productUrl: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  updatedAt: { type: String }
}, { strict: false });

export default mongoose.model<IProduct>('Product', ProductSchema, 'products');
