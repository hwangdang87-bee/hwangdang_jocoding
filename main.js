
class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lotto-generator');

    const style = document.createElement('style');
    style.textContent = `
      .lotto-generator {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 25px;
        background: var(--card-bg, rgba(255, 255, 255, 0.1));
        border-radius: 15px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid var(--card-border, rgba(255, 255, 255, 0.18));
        transition: all 0.3s;
      }

      button {
        padding: 10px 20px;
        font-size: 1.2rem;
        border: none;
        border-radius: 8px;
        background-color: var(--btn-bg, #4a90e2);
        color: white;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        box-shadow: 0 4px 15px 0 var(--btn-shadow, rgba(74, 144, 226, 0.75));
      }

      button:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }

      .numbers {
        display: flex;
        gap: 10px;
      }

      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #f5a623;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    `;

    const button = document.createElement('button');
    button.textContent = 'Generate Numbers';

    const numbersContainer = document.createElement('div');
    numbersContainer.setAttribute('class', 'numbers');

    shadow.appendChild(style);
    wrapper.appendChild(button);
    wrapper.appendChild(numbersContainer);
    shadow.appendChild(wrapper);

    button.addEventListener('click', () => {
      const numbers = this.generateLottoNumbers();
      this.displayNumbers(numbers);
    });
  }

  generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  displayNumbers(numbers) {
    const numbersContainer = this.shadowRoot.querySelector('.numbers');
    numbersContainer.innerHTML = '';
    for (const number of numbers) {
      const numberElement = document.createElement('div');
      numberElement.setAttribute('class', 'number');
      numberElement.textContent = number;
      numbersContainer.appendChild(numberElement);
    }
  }
}

customElements.define('lotto-generator', LottoGenerator);

// Theme Toggle Logic
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Animal Face Test Logic
const URL = "https://teachablemachine.withgoogle.com/models/Ly07AVLo8/"; // User provided model
let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function predict() {
    const tempImage = document.getElementById("face-image");
    const prediction = await model.predict(tempImage, false);
    
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    
    let resultTitle, resultExplain;
    switch (prediction[0].className) {
        case "dog":
            resultTitle = "귀여운 강아지상";
            resultExplain = "당신은 밝고 사교적이며 충직한 성격을 가진 강아지상입니다!";
            break;
        case "cat":
            resultTitle = "도도한 고양이상";
            resultExplain = "당신은 차분하고 신비로우며 매력적인 고양이상입니다!";
            break;
        default:
            resultTitle = "알 수 없음";
            resultExplain = "";
    }
    
    const title = "<div class='" + prediction[0].className + "-animal-title'>" + resultTitle + "</div>";
    const explain = "<div class='animal-explain pt-2'>" + resultExplain + "</div>";
    document.getElementById("result-message").innerHTML = title + explain;

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(0) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
        labelContainer.childNodes[i].style.margin = "10px 0";
    }
}

// Image Upload Handling
const uploadBtn = document.getElementById('upload-btn');
const imageInput = document.getElementById('image-upload');
const faceImage = document.getElementById('face-image');
const previewContainer = document.getElementById('image-preview-container');
const loadingSpinner = document.getElementById('loading-spinner');

uploadBtn.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            faceImage.src = event.target.result;
            previewContainer.style.display = 'block';
            loadingSpinner.style.display = 'block';
            document.getElementById("result-message").innerHTML = "";
            document.getElementById("label-container").innerHTML = "";
            
            if (!model) await init();
            await predict();
            
            loadingSpinner.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});
