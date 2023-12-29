import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  author: { type: String, required: true },
  name: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  recipeImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: false },
  servings: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;