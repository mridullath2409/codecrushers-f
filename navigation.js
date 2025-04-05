// Sample data for demonstration
const sampleDirections = [
    "Head south on Main St toward 1st Ave",
    "Turn right onto 1st Ave",
    "Continue onto Broadway",
    "Turn left onto Park Rd",
    "Turn right onto Market St",
    "Your destination will be on the left"
  ];
  
  // DOM Elements
  const fromInput = document.getElementById('from-location');
  const toInput = document.getElementById('to-location');
  const getDirectionsBtn = document.getElementById('get-directions');
  const directionsSteps = document.getElementById('directions-steps');
  const languageSelect = document.getElementById('language-select');
  
  // Function to generate directions
  function generateDirections() {
    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    
    if (!from || !to) {
      alert('Please enter both starting location and destination');
      return;
    }
    
    // Clear previous directions
    directionsSteps.innerHTML = '';
    
    // Show loading state
    directionsSteps.innerHTML = '<p class="empty-state">Loading directions...</p>';
    
    // Simulate API call with timeout
    setTimeout(() => {
      displayDirections(sampleDirections);
      initMap();
    }, 1500);
  }
  
  // Function to display directions
  function displayDirections(steps) {
    // Clear previous content
    directionsSteps.innerHTML = '';
    
    if (steps.length === 0) {
      directionsSteps.innerHTML = '<p class="empty-state">No directions found</p>';
      return;
    }
    
    // Add each direction step
    steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'direction-step';
      
      const stepNumber = document.createElement('div');
      stepNumber.className = 'step-number';
      stepNumber.textContent = index + 1;
      
      const stepInstruction = document.createElement('div');
      stepInstruction.className = 'step-instruction';
      stepInstruction.textContent = step;
      
      stepElement.appendChild(stepNumber);
      stepElement.appendChild(stepInstruction);
      directionsSteps.appendChild(stepElement);
    });
    
    // Add "arrived" message as the final step
    const finalStep = document.createElement('div');
    finalStep.className = 'direction-step';
    finalStep.style.background = '#e6f7e6';
    
    const finalStepNumber = document.createElement('div');
    finalStepNumber.className = 'step-number';
    finalStepNumber.style.background = '#b8e6b8';
    finalStepNumber.style.color = '#1e7e1e';
    finalStepNumber.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>';
    
    const finalStepInstruction = document.createElement('div');
    finalStepInstruction.className = 'step-instruction';
    finalStepInstruction.textContent = 'You have arrived at your destination';
    
    finalStep.appendChild(finalStepNumber);
    finalStep.appendChild(finalStepInstruction);
    directionsSteps.appendChild(finalStep);
  }
  
  // Function to initialize map (placeholder)
  function initMap() {
    const mapBox = document.getElementById('map');
    
    // In a real implementation, you would initialize a map service here
    // For this example, we'll just show a placeholder
    mapBox.style.backgroundImage = 'url("/api/placeholder/600/400")';
    mapBox.style.backgroundSize = 'cover';
    mapBox.style.backgroundPosition = 'center';
    
    // Remove the "after" content
    mapBox.style.position = 'relative';
    const style = document.createElement('style');
    style.textContent = '#map::after { content: none !important; }';
    document.head.appendChild(style);
  }
  
  // Function to translate directions (placeholder)
  function translateDirections() {
    const language = languageSelect.value;
    const steps = directionsSteps.querySelectorAll('.step-instruction');
    
    // This would normally call a translation API
    // For demo purposes, we'll just add a language indicator
    if (steps.length > 0 && steps[0].textContent !== 'Loading directions...' && steps[0].textContent !== 'Enter your locations to get directions' && steps[0].textContent !== 'No directions found') {
      
      // Show translation loading
      directionsSteps.innerHTML = '<p class="empty-state">Translating directions...</p>';
      
      // Simulate API delay
      setTimeout(() => {
        displayDirections(sampleDirections.map(step => {
          // In a real app, this would be actual translation
          // Here we just append the language code to simulate translation
          if (language === 'en') {
            return step;
          } else {
            return `[${language.toUpperCase()}] ${step}`;

          }
        }));
      }, 1000);
    }
  }
  
  // Event listeners
  getDirectionsBtn.addEventListener('click', generateDirections);
  
  languageSelect.addEventListener('change', translateDirections);
  
  // Auto-complete suggestions (placeholder)
  function setupAutoComplete(input) {
    input.addEventListener('input', function() {
      // In a real implementation, this would call a places API
      if (this.value.length > 2) {
        const suggestions = [
          this.value + " Street",
          this.value + " Avenue",
          this.value + " Road",
          this.value + " Plaza"
        ];
        
        // Show suggestions (not implemented in this demo)
        console.log("Suggestions for", this.value, ":", suggestions);
      }
    });
  }
  
  // Setup auto-complete for both inputs
  setupAutoComplete(fromInput);
  setupAutoComplete(toInput);
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for pre-filled locations
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    const toParam = urlParams.get('to');
    
    if (fromParam) fromInput.value = fromParam;
    if (toParam) toInput.value = toParam;
    
    // Generate directions automatically if both params are present
    if (fromParam && toParam) {
      generateDirections();
    }
  });