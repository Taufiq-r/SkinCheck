const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

// List of class names
const classNames = [
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

async function predictClassification(model, image) {
    try {
        // Decoding and resizing image to match the model input
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224]) // Ensure the image size is 224x224
            .expandDims()
            .toFloat();
        
        // Make the prediction
        const prediction = model.predict(tensor);
        
        // Get the probabilities of all classes
        const scores = await prediction.data();
        
        // Find the maximum probability and corresponding class index
        const maxProb = Math.max(...scores);
        const predictedClassIndex = scores.indexOf(maxProb);
        const predictedClassName = classNames[predictedClassIndex];
        
        // Determine the result based on the probability threshold
        const result = maxProb < 0.5 ? 'Tidak Berpenyakit' : 'Berpenyakit';
        
        // Provide a suggestion based on the result
        let suggestion = '';
        if (result === 'Berpenyakit') {
            suggestion = `Diagnosis: ${predictedClassName}. Segera periksa ke dokter!`;
        } else {
            suggestion = "Penyakit tidak terdeteksi.";
        }
        
        // Return the prediction and suggestion
        return { 
            result, 
            predictedClassName, 
            maxProb: maxProb.toFixed(2), // Show probability rounded to 2 decimal places
            suggestion 
        };

    } catch (error) {
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

module.exports = predictClassification;
