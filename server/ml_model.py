import sys
import json

# This function simulates a trained ML model
def predict_intrusion(features):
    # In a real project, you would load a model:
    # model = joblib.load('trained_ids_model.pkl')
    # prediction = model.predict([features]) 
    
    # Prototype logic based on a single dummy feature: 'duration' (seconds)
    # The 'duration' is the first value in the features list
    duration = features[0] 
    
    if duration > 1000:
        return {"status": "ALERT", "attack_type": "Long-Duration Scan", "confidence": 0.95}
    elif duration > 50:
        return {"status": "ALERT", "attack_type": "Port Probe", "confidence": 0.70}
    else:
        return {"status": "NORMAL", "attack_type": "None", "confidence": 0.99}

if __name__ == "__main__":
    # The Node.js API passes the feature data as a JSON string argument
    if len(sys.argv) > 1:
        # Load the feature list (e.g., [1.2, 80, 6, 1200])
        try:
            # sys.argv[1] contains the stringified feature array from Node.js
            input_data = json.loads(sys.argv[1])
            features = input_data['features']
            
            # Get the prediction
            result = predict_intrusion(features)
            
            # Output the result as JSON to stdout, which Node.js captures
            print(json.dumps(result))
            
        except json.JSONDecodeError:
            print(json.dumps({"status": "ERROR", "message": "Invalid JSON input."}))
        except Exception as e:
            print(json.dumps({"status": "ERROR", "message": str(e)}))