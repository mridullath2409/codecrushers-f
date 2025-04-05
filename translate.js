 document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const languageButtons = document.querySelectorAll('.language-btn');
    const inputTextArea = document.querySelector('.input-section textarea');
    const outputTextArea = document.querySelector('.output-section textarea');
    const copyButton = document.querySelector('.output-actions button:first-child');
    const speakButton = document.querySelector('.output-actions button:last-child');
    const uploadButton = document.querySelector('.input-actions button:nth-child(2)');
    
    // Set up language selection
    let selectedLanguage = 'Hindi'; // Default language
    
    languageButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        languageButtons.forEach(btn => btn.classList.remove('active-language'));
        
        // Add active class to clicked button
        this.classList.add('active-language');
        
        // Get selected language
        const langText = this.textContent.split('\n')[1] || this.textContent;
        selectedLanguage = langText.trim();
        
        // Translate text if input exists
        if (inputTextArea.value.trim() !== '') {
          translateText();
        }
      });
    });
    
    // Simple translation function (placeholder for actual API integration)
    function translateText() {
      // In a real implementation, you would call a translation API here
      // For demonstration, we'll use a simple placeholder
     
      const inputText = inputTextArea.value;
      run(tesseracttext.py);
      // Simulate API call delay
      outputTextArea.value = "Translating...";
      
      setTimeout(() => {
        // Simple demo translations based on selected language
        if (selectedLanguage === 'Hindi') {
          // For demo: Just append "[Translated to Hindi]" to show functionality
          outputTextArea.value = inputText + " [Translated to Hindi]";
        } else if (selectedLanguage === 'Telugu') {
          outputTextArea.value = inputText + " [Translated to Telugu]";
        } else if (selectedLanguage === 'Marathi') {
          outputTextArea.value = inputText + " [Translated to Marathi]";
        } else {
          outputTextArea.value = inputText + " [Translated to " + selectedLanguage + "]";
        }
      }, 500);
    }
    
    // Event listener for input changes
    inputTextArea.addEventListener('input', debounce(function() {
      if (inputTextArea.value.trim() !== '') {
        translateText();
      } else {
        outputTextArea.value = '';
      }
    }, 500));
    
    // Copy translated text
    copyButton.addEventListener('click', function() {
      if (outputTextArea.value.trim() === '') return;
      
      outputTextArea.select();
      document.execCommand('copy');
      
      // Show copied feedback
      const originalText = this.innerHTML;
      this.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24" width="24" height="24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
      
      setTimeout(() => {
        this.innerHTML = originalText;
      }, 2000);
    });
    
    // Text-to-speech functionality
    speakButton.addEventListener('click', function() {
      const textToSpeak = outputTextArea.value;
      if (textToSpeak.trim() === '') return;
      
      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = textToSpeak;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        
        // Set language based on selected language
        if (selectedLanguage === 'Hindi') {
          speech.lang = 'hi-IN';
        } else if (selectedLanguage === 'Telugu') {
          speech.lang = 'te-IN';
        } else if (selectedLanguage === 'Marathi') {
          speech.lang = 'mr-IN';
        } else {
          speech.lang = 'en-US'; // Default to English
        }
        
        window.speechSynthesis.speak(speech);
      }
    });
    
    // Camera functionality
    window.openCamera = function() {
      // Create camera container if it doesn't exist
      let cameraContainer = document.getElementById('camera-container');
      
      if (!cameraContainer) {
        cameraContainer = document.createElement('div');
        cameraContainer.id = 'camera-container';
        cameraContainer.className = 'camera-modal';
        cameraContainer.innerHTML = `
          <div class="camera-content">
            <div class="camera-header">
              <h3>Camera Access</h3>
              <button id="close-camera">&times;</button>
            </div>
            <video id="camera-preview" autoplay></video>
            <div class="camera-controls">
              <button id="capture-photo" class="btn btn-primary">Capture</button>
            </div>
            <canvas id="photo-canvas" style="display:none;"></canvas>
          </div>
        `;
        document.body.appendChild(cameraContainer);
        
        // Add event listeners for camera controls
        document.getElementById('close-camera').addEventListener('click', () => {
          stopCamera();
          cameraContainer.style.display = 'none';
        });
        
        document.getElementById('capture-photo').addEventListener('click', capturePhoto);
      }
      
      // Display camera modal
      cameraContainer.style.display = 'flex';
      
      // Start camera
      startCamera();
    };
    
    // Start camera stream
    function startCamera() {
      const video = document.getElementById('camera-preview');
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function(stream) {
            video.srcObject = stream;
          })
          .catch(function(error) {
            console.error("Camera error: ", error);
            alert("Could not access camera. Please check permissions.");
          });
      } else {
        alert("Sorry, your browser does not support camera access.");
      }
    }
    
    // Stop camera stream
    function stopCamera() {
      const video = document.getElementById('camera-preview');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
    }
    
    // Capture photo from camera
    function capturePhoto() {
      const video = document.getElementById('camera-preview');
      const canvas = document.getElementById('photo-canvas');
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data from canvas
      const imageData = canvas.toDataURL('image/png');
      
      // Here, you would typically send this image to an OCR service
      // and then to a translation service
      // For demonstration, we'll just close the camera and display a message
      
      stopCamera();
      document.getElementById('camera-container').style.display = 'none';
      
      // Show message in input area
      inputTextArea.value = "Image captured! In a production app, OCR would extract text from your image.";
      translateText();
    }
    
    // File upload functionality
    uploadButton.addEventListener('click', function() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function() {
          // In a real app, you would send this image to an OCR service
          // For demo purposes, we'll just show a message
          inputTextArea.value = `Image "${file.name}" uploaded! In a production app, OCR would extract text from your image.`;

          translateText();
        };
        reader.readAsDataURL(file);
      });
      
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    });
    
    // Utility function for debouncing
    function debounce(func, wait) {
      let timeout;
      return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    }
    
    // Add CSS for camera modal
    addCameraStyles();
    function addCameraStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .camera-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }
        
        .camera-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          overflow: hidden;
        }
        
        .camera-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #4a6bdf;
          color: white;
        }
        
        .camera-header h3 {
          margin: 0;
        }
        
        #close-camera {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        #camera-preview {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .camera-controls {
          padding: 1rem;
          display: flex;
          justify-content: center;
        }
        
        .active-language {
          background-color: #4a6bdf;
          color: white;
        }
      `;
      document.head.appendChild(style);
    }
  });
