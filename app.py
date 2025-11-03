from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

# Load the pre-trained model
model = pickle.load(open('model.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    name = data.get('name', 'User')

    features = np.array([[
        float(data['age']),
        float(data['sex']),
        float(data['bp']),
        float(data['cholesterol']),
        float(data['glucose']),
        float(data['bmi']),
        float(data['smoker'])
    ]])

    risk = model.predict_proba(features)[0][1]
    risk_percentage = round(risk*100, 2)

    # Determine risk level and advice
    if risk < 0.3:
        risk_level = "Low risk🟢"
        advice = "Your risk is low. Maintain a healthy lifestyle with balanced diet and regular exercise."
    elif risk < 0.6:
        risk_level = "Moderate risk🟡"
        advice = "Your risk is moderate. Consider regular checkups and improve diet, exercise, and reduce stress."
    else:
        risk_level = "High risk🔴"
        advice = "Your risk is high! Please consult a doctor. Focus on diet, exercise, and avoid smoking or alcohol."

    # Detailed suggestions based on inputs
    suggestions = []
    if float(data['bp']) > 120:
        suggestions.append("Your blood pressure is higher than normal. Monitor regularly.")
    if float(data['cholesterol']) > 200:
        suggestions.append("High cholesterol. Consider reducing fatty foods and eating more fiber.")
    if float(data['glucose']) > 100:
        suggestions.append("High blood sugar. Monitor diet and consult your doctor if necessary.")
    if float(data['bmi']) > 25:
        suggestions.append("BMI is above healthy range. Consider weight management and exercise.")
    if int(data['smoker']) == 1:
        suggestions.append("Smoking increases risk. Try to quit for better heart health.")

    return jsonify({
        'name': name,
        'risk_percentage': risk_percentage,
        'risk_level': risk_level,
        'advice': advice,
        'suggestions': suggestions
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'CardioHealth API is running'})

if __name__ == '__main__':
    app.run(debug=True)