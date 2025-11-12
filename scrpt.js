document.getElementById('health-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous name error message (if any)
    const nameField = document.getElementById('name');
    const existingError = document.querySelector('#name-error');
    if (existingError) existingError.remove();

    // Validate name field (letters and spaces only)
    const nameValue = nameField.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(nameValue)) {
        // Create inline error message
        const errorMsg = document.createElement('small');
        errorMsg.id = 'name-error';
        errorMsg.style.color = 'red';
        errorMsg.style.display = 'block';
        errorMsg.style.marginTop = '5px';
        errorMsg.textContent = 'Please enter a valid name (letters and spaces only).';

        // Insert error message right below the name input
        nameField.insertAdjacentElement('afterend', errorMsg);
        nameField.focus();
        return;
    }

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;

    // Collect form data
    const formData = {
        name: nameValue,
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();

        // Update results
        document.getElementById('result-name').textContent = result.name;
        document.getElementById('risk-percentage').textContent = `${result.risk_percentage}%`;
        document.getElementById('risk-level').textContent = result.risk_level;
        document.getElementById('risk-description').textContent =
            `Based on the information provided, you have a ${result.risk_level.toLowerCase()} risk of cardiovascular conditions.`;
        document.getElementById('advice-text').textContent = result.advice;

        // Risk level colors
        const riskLevelElement = document.getElementById('risk-level');
        riskLevelElement.className = 'risk-level';
        if (result.risk_level.includes('Low')) riskLevelElement.classList.add('low-risk');
        else if (result.risk_level.includes('Moderate')) riskLevelElement.classList.add('medium-risk');
        else riskLevelElement.classList.add('high-risk');

        // Suggestions
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
        if (result.suggestions?.length > 0) {
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

        // Show result
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your request. Please make sure the Flask server is running on http://localhost:5000');
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;
    }
});
