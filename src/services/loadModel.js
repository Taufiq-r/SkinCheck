const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        console.log(`Loading model from: ${process.env.MODEL_URL}`);
        
        // Memuat model dengan format Layers
        const model = await tf.loadLayersModel(process.env.MODEL_URL);
        
        // Menampilkan ringkasan model
        console.log('Model Summary:');
        model.summary();

        return model;
    } catch (error) {
        console.error('Error loading model:', error.message);
        console.error('Stack trace:', error.stack);
        throw new Error('Failed to load model. Ensure the model URL and files are correct.');
    }
}

module.exports = loadModel;
