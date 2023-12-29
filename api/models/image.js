import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  filename: { type: String, required: true }
});

const Image = mongoose.model('Image', imageSchema);
export default Image;