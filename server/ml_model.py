import sys
import json
from joblib import load
import numpy as np

# Load the trained model only once when the script starts
try:
    # Use the filename created in the training script
    MODEL_PATH = 'ids_classifier_model.joblib'
    ID_MODEL = load(MODEL_PATH)
except FileNotFoundError:
    print(json.dumps({"status": "ERROR", "message": f"ML model file not found at {MODEL_PATH}"}))
    sys.exit(1)
except Exception as e:
    print(json.dumps({"status": "ERROR", "message": f"Error loading model: {e}"}))
    sys.exit(1)


# Mapping model output (integers 0, 1, 2) to descriptive results
# This mapping must align with your dataset labels (e.g., 0=Normal, 1=Probe, 2=DoS)
PREDICTION_MAP = {
    0: {"status": "NORMAL", "attack_type": "None", "confidence": 0.99},
    1: {"status": "ALERT", "attack_type": "Port Probe", "confidence": 0.90},
    2: {"status": "ALERT", "attack_type": "DDoS Attack", "confidence": 0.85},
}


def predict_intrusion(features):
    # Convert feature list to a NumPy array in the shape the model expects
    features_array = np.array(features).reshape(1, -1)
    
    # Get the prediction (an integer: 0, 1, or 2 for Iris)
    prediction_id = ID_MODEL.predict(features_array)[0]
    
    # Return the mapped result
    return PREDICTION_MAP.get(prediction_id, {"status": "UNKNOWN", "attack_type": "Unclassified", "confidence": 0.50})


if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            features = input_data['features']
            
            # Prediction logic is now run through the loaded scikit-learn model
            result = predict_intrusion(features)
            
            print(json.dumps(result))
            
        except json.JSONDecodeError:
            print(json.dumps({"status": "ERROR", "message": "Invalid JSON input."}))
        except Exception as e:
            # Catch errors like incorrect number of features
            print(json.dumps({"status": "ERROR", "message": f"Prediction failed: {e}"}))