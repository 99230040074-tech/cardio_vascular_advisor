document.getElementById('health-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        bp: document.getElementById('bp').value,
        cholesterol: document.getElementById('cholesterol').value,
        glucose: document.getElementById('glucose').value,
        bmi: document.getElementById('bmi').value,
        smoker: document.getElementById('smoker').value
    };
    
    try {
        // Send data to Flask backend
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        
        // Update the result display
        document.getElementById('result-name').textContent = result.name;
        document.getElementById('risk-percentage').textContent = `${result.risk_percentage}%`;
        document.getElementById('risk-level').textContent = result.risk_level;
        document.getElementById('risk-description').textContent = `Based on the information provided, you have a ${result.risk_level.toLowerCase()} of cardiovascular conditions.`;
        document.getElementById('advice-text').textContent = result.advice;
        
        // Update risk level styling
        const riskLevelElement = document.getElementById('risk-level');
        riskLevelElement.className = 'risk-level ';
        if (result.risk_level.includes('Low')) {
            riskLevelElement.classList.add('low-risk');
        } else if (result.risk_level.includes('Moderate')) {
            riskLevelElement.classList.add('medium-risk');
        } else {
            riskLevelElement.classList.add('high-risk');
        }
        
        // Update suggestions
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
        if (result.suggestions && result.suggestions.length > 0) {
            result.suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No specific recommendations based on your inputs.";
            suggestionsList.appendChild(li);
        }
        
        // Show the result
        document.getElementById('result').style.display = 'block';
        
        // Scroll to result
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your request. Please make sure the Flask server is running on http://localhost:5000');
    } finally {
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;
    }
});

// Add some sample data for testing
function fillSampleData() {
    document.getElementById('name').value = 'John Doe';
    document.getElementById('age').value = '45';
    document.getElementById('sex').value = '1';
    document.getElementById('bp').value = '135';
    document.getElementById('cholesterol').value = '230';
    document.getElementById('glucose').value = '110';
    document.getElementById('bmi').value = '27.5';
    document.getElementById('smoker').value = '1';
}

// Uncomment the line below to enable sample data filling for testing
// fillSampleData();