import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from joblib import dump
import numpy as np
import os

# --- 1. Load Data (Simulating Network Features) ---
# Replace this with loading a real network dataset (e.g., KDD Cup '99)
iris = load_iris()
X = iris.data
y = iris.target

# Create a simple Decision Tree Classifier
model = DecisionTreeClassifier(random_state=42)

# --- 2. Train the Model ---
model.fit(X, y)

# --- 3. Save the Trained Model ---
model_filename = 'ids_classifier_model.joblib'
dump(model, model_filename)

print(f"Model trained and saved as {model_filename} in the server directory.")
print(f"Features used for training: {iris.feature_names}")

# This is a critical step: Determine the structure of features the model expects.
# The Iris dataset has 4 features. Your network dataset might have 41.
# This array length must match the length of the 'features' array sent from React.
expected_features_count = X.shape[1]
print(f"Expected number of features for prediction: {expected_features_count}")