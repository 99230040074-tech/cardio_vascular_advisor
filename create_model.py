import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import pickle

# --- Step 1: Create synthetic dataset ---
# Features: age, sex, bp, cholesterol, glucose, bmi, smoker
np.random.seed(42)
num_samples = 1000

data = pd.DataFrame({
    'age': np.random.randint(20, 80, size=num_samples),
    'sex': np.random.randint(0, 2, size=num_samples),
    'bp': np.random.randint(90, 160, size=num_samples),
    'cholesterol': np.random.randint(150, 300, size=num_samples),
    'glucose': np.random.randint(70, 200, size=num_samples),
    'bmi': np.random.uniform(18, 35, size=num_samples),
    'smoker': np.random.randint(0, 2, size=num_samples),
})

# Target: 0 = low risk, 1 = high risk (synthetic)
data['target'] = ((data['bp'] > 130) | (data['cholesterol'] > 220) |
                  (data['glucose'] > 120) | (data['bmi'] > 28) | (data['smoker'] == 1)).astype(int)

# --- Step 2: Split dataset ---
X = data[['age', 'sex', 'bp', 'cholesterol', 'glucose', 'bmi', 'smoker']]
y = data['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- Step 3: Train model ---
model = XGBClassifier(eval_metric='logloss', random_state=42)
model.fit(X_train, y_train)

# Optional: evaluate
score = model.score(X_test, y_test)
print(f"Model Accuracy: {score*100:.2f}%")

# --- Step 4: Save model ---
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("model.pkl created successfully!")


#DATA
# | Name  | Age | Gender | Blood Pressure (BP) | Cholesterol | Glucose | BMI  | Smoker |
# | ----- | --- | ------ | ------------------- | ----------- | ------- | ---- | ------ |
# | Ankit | 45  | Male   | 135                 | 230         | 110     | 27.5 | Yes    |
# | Priya | 30  | Female | 120                 | 180         | 90      | 22.0 | No     |
# | Rohit | 55  | Male   | 150                 | 250         | 140     | 30.0 | Yes    |
# | Sneha | 28  | Female | 110                 | 170         | 85      | 21.0 | No     |
# | Karan | 60  | Male   | 145                 | 210         | 130     | 29.0 | No     |
# | Meera | 35  | Female | 125                 | 190         | 95      | 23.0 | Yes    |