const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Xmw66C7IR/";
let model, labelContainer, maxPredictions;

document.getElementById('image-selector').addEventListener('change', handleImageUpload);
document.getElementById('predict-button').addEventListener('click', predict);

async function init() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Initialize label container
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; // Clear previous results
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const img = document.createElement('img');
        img.src = window.URL.createObjectURL(file);
        img.id = 'selected-image';
        img.onload = () => window.URL.revokeObjectURL(img.src);

        const imageContainer = document.getElementById('image-container');
        imageContainer.innerHTML = ''; // Clear previous images
        imageContainer.appendChild(img);

        document.getElementById('predict-button').disabled = false; // Enable predict button
        labelContainer.innerHTML = ""; // Clear previous results
    }
}

async function predict() {
    const imageElement = document.getElementById('selected-image');
    if (imageElement) {
        const prediction = await model.predict(imageElement);

        if (prediction.length > 0) {
            // Find the prediction with the highest probability
            let maxProbability = 0;
            let bestPrediction = null;
            for (let i = 0; i < prediction.length; i++) {
                if (prediction[i].probability > maxProbability) {
                    maxProbability = prediction[i].probability;
                    bestPrediction = prediction[i];
                }
            }

            // Display the result in a sentence
            if (bestPrediction && maxProbability > 0) {
                labelContainer.innerHTML = `The given image is most likely a ${bestPrediction.className} Rupee Note with a confidence of ${(maxProbability * 100).toFixed(2)}%.`;
            } else {
                labelContainer.innerHTML = "The model is confused and couldn't make a confident prediction.";
            }
        } else {
            labelContainer.innerHTML = "The model is confused and couldn't make a confident prediction.";
        }
    }
}

// Initialize the model when the page loads
init();
