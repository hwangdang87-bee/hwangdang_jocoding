
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

// Navigation Logic
function showPage(pageId) {
    const pages = ['home', 'lotto', 'lunch', 'animal', 'about', 'privacy', 'terms'];
    pages.forEach(id => {
        const page = document.getElementById(id + '-page');
        if (page) {
            page.style.display = (id === pageId) ? 'block' : 'none';
        }
    });
    
    // Scroll to top when page changes
    window.scrollTo(0, 0);

    // Move Disqus thread to the active sub-page (only for tool pages)
    const toolPages = ['lotto', 'lunch', 'animal'];
    if (toolPages.includes(pageId)) {
        const disqusContainer = document.getElementById('disqus_thread');
        disqusContainer.style.display = 'block';
        const target = document.getElementById('disqus_' + pageId);
        if (target) {
            target.appendChild(disqusContainer);
        }
        
        // Reset Disqus for the new page identifier
        if (typeof DISQUS !== 'undefined') {
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = pageId;
                    this.page.url = window.location.href.split('#')[0] + '#' + pageId;
                }
            });
        }
    } else {
        document.getElementById('disqus_thread').style.display = 'none';
    }
}

// Initial Disqus Load
var disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = 'home';
};

(function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://hwangdang-world.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();

// Theme Toggle Logic
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Lunch Menu Recommendation
const lunchMenus = ["김치찌개", "된장찌개", "돈까스", "제육볶음", "쌀국수", "초밥", "햄버거", "피자", "마라탕", "냉면", "비빔밥", "부대찌개", "파스타", "치킨", "삼겹살"];
document.getElementById('lunch-btn').addEventListener('click', () => {
    const resultElement = document.getElementById('lunch-result');
    resultElement.classList.add('rotating');
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * lunchMenus.length);
        resultElement.textContent = lunchMenus[randomIndex];
        resultElement.classList.remove('rotating');
    }, 500);
});

// Animal Face Test Logic
const URL = "https://teachablemachine.withgoogle.com/models/Ly07AVLo8/"; 
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
    }
}

// Image Upload Handling
const uploadBtn = document.getElementById('upload-btn');
const imageInput = document.getElementById('image-upload');
const faceImage = document.getElementById('face-image');
const previewContainer = document.getElementById('image-preview-container');
const loadingSpinner = document.getElementById('loading-spinner');

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => imageInput.click());
}

if (imageInput) {
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
}
