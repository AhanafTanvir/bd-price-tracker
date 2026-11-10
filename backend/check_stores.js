const mongoose = require('mongoose');
async function run() {
  await mongoose.connect('mongodb://localhost:27017/price_aggregator');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const stores = await Product.aggregate([
    { $group: { _id: '$store', count: { $sum: 1 } } }
  ]);
  console.log('Stores in DB:', stores);

  const sampleRyans = await Product.find({ store: { $regex: 'Ryans', $options: 'i' } }).limit(3).lean();
  console.log('Sample Ryans:', sampleRyans);

  const samplePCB = await Product.find({ store: { $regex: 'PCB', $options: 'i' } }).limit(3).lean();
  console.log('Sample PCB Store:', samplePCB);

  process.exit(0);
}
run();
