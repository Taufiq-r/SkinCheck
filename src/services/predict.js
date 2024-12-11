  const tf = require('@tensorflow/tfjs-node');
  const fs = require('fs');


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

  async function predictImage(imageBuffer) {
    try {
      // Load the model
      const model = await tf.loadLayersModel('file://./model/model.json');

      // Convert the buffer image to a tensor
      const image = await loadImageFromBuffer(imageBuffer);
      const imgTensor = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().div(tf.scalar(255)).expandDims(0);

      // Make predictions
      const predictions = await model.predict(imgTensor).data();

      // Get the predicted class
      const predictedClass = predictions.indexOf(Math.max(...predictions));
      const predictedClassName = class_names[predictedClass];
      const probability = predictions[predictedClass];

      // Return the result
      return {
        predictedClassName: predictedClassName,
        probability: probability.toFixed(2)
      };
    } catch (error) {
      console.error('Error during prediction:', error);
      throw new Error('Prediction failed');
    }
  }

  // Helper function to load an image from a buffer
  function loadImageFromBuffer(buffer) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = buffer;
    });
  }

  module.exports = { predictImage };
