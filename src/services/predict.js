  const tf = require('@tensorflow/tfjs-node');
  const sharp = require('sharp');


  const class_names = [
    'eczema',
    'melanoma',
    'atopic dermatitis',
    'basal cell carcinoma',
    'melanocytic nevi',
    'benign keratosis',
    'psoriasis',
    'seaborrheic keratoses',
    'tinea ringworm',
    'wats molluscum',
    'tidak berpenyakit'
  ];


  async function preprocessImage(imageBuffer) {
    const resizedImage = await sharp(imageBuffer)
        .resize({ width: 224, height: 224 })
        .toFormat('png')
        .toBuffer();

    const tensor = tf.node.decodeImage(resizedImage, 3)
        .expandDims()
        .toFloat()
        .div(tf.scalar(255));

    return tensor;
 }

  async function predictImage(imageBuffer) {
    try {
      // Load the model
      const model = await tf.loadGraphModel(process.env.MODEL_URL);

      const imgTensor = await preprocessImage(imageBuffer);

      const predictions = await model.predict(imgTensor).data();
      const predictedClassIndex = predictions.indexOf(Math.max(...predictions));
      const predictedClassName = class_names[predictedClassIndex];
      const probability = predictions[predictedClassIndex];
      

      // Return the result
      return {
        predictedClassName,
        probability:  (probability * 100).toFixed(2),
      };
    } catch (error) {
      console.error('Error during prediction:', error);
      throw new Error('Prediction failed');
    }
  }

  module.exports = { predictImage };
