
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
        padding: 12px 24px;
        font-size: 1.2rem;
        border: none;
        border-radius: 8px;
        background-color: #4a90e2;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        box-shadow: 0 4px 15px 0 rgba(74, 144, 226, 0.4);
        font-weight: bold;
      }

      button:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }

      .numbers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        min-height: 60px;
      }

      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: #f5a623;
        color: white;
        font-size: 1.3rem;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;

    const button = document.createElement('button');
    button.textContent = '번호 생성하기';

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
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const numberElement = document.createElement('div');
            numberElement.setAttribute('class', 'number');
            
            // Color mapping like real lotto
            if (number <= 10) numberElement.style.backgroundColor = '#fbc400';
            else if (number <= 20) numberElement.style.backgroundColor = '#69c8f2';
            else if (number <= 30) numberElement.style.backgroundColor = '#ff7272';
            else if (number <= 40) numberElement.style.backgroundColor = '#aaaaaa';
            else numberElement.style.backgroundColor = '#b0d840';

            numberElement.textContent = number;
            numbersContainer.appendChild(numberElement);
        }, index * 100);
    });
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
    
    window.scrollTo(0, 0);

    // Update active state in nav
    const navButtons = document.querySelectorAll('.main-nav button');
    navButtons.forEach(btn => {
        if (btn.innerText.includes(getPageTitle(pageId))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Handle Disqus
    const toolPages = ['lotto', 'lunch', 'animal'];
    if (toolPages.includes(pageId)) {
        const disqusContainer = document.getElementById('disqus_thread');
        disqusContainer.style.display = 'block';
        const target = document.getElementById('disqus_' + pageId);
        if (target) {
            target.appendChild(disqusContainer);
        }
        
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

function getPageTitle(id) {
    switch(id) {
        case 'home': return '메인';
        case 'lotto': return '로또';
        case 'lunch': return '점심';
        case 'animal': return '동물상';
        case 'about': return '소개';
        default: return '';
    }
}

// Cookie Banner Logic
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookie-banner').style.display = 'none';
}

window.onload = () => {
    if (!localStorage.getItem('cookiesAccepted')) {
        document.getElementById('cookie-banner').style.display = 'block';
    }
};

// Theme Toggle Logic
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Load Theme Preference
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

// Lunch Menu Logic
const lunchMenus = ["김치찌개", "된장찌개", "돈까스", "제육볶음", "쌀국수", "초밥", "햄버거", "피자", "마라탕", "냉면", "비빔밥", "부대찌개", "파스타", "치킨", "삼겹살", "순대국", "육개장", "짜장면", "짬뽕", "샌드위치"];
document.getElementById('lunch-btn').addEventListener('click', () => {
    const resultElement = document.getElementById('lunch-result');
    resultElement.classList.add('rotating');
    
    let counter = 0;
    const interval = setInterval(() => {
        resultElement.textContent = lunchMenus[Math.floor(Math.random() * lunchMenus.length)];
        counter++;
        if (counter > 10) {
            clearInterval(interval);
            resultElement.classList.remove('rotating');
            resultElement.textContent = lunchMenus[Math.floor(Math.random() * lunchMenus.length)];
        }
    }, 50);
});

// AI Model Logic
const URL = "https://teachablemachine.withgoogle.com/models/Ly07AVLo8/"; 
let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

async function predict() {
    const tempImage = document.getElementById("face-image");
    const prediction = await model.predict(tempImage, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    
    let resultTitle, resultExplain;
    switch (prediction[0].className) {
        case "dog":
            resultTitle = "귀여운 강아지상";
            resultExplain = "당신은 밝고 사교적이며 충직한 성격을 가진 강아지상입니다! 주변 사람들에게 긍정적인 에너지를 주는 타입이네요.";
            break;
        case "cat":
            resultTitle = "도도한 고양이상";
            resultExplain = "당신은 차분하고 신비로우며 매력적인 고양이상입니다! 첫인상은 차가워 보일 수 있지만 알수록 깊은 매력이 있습니다.";
            break;
        default:
            resultTitle = "매력 넘치는 얼굴상";
            resultExplain = "당신만의 독특한 매력이 돋보이는 얼굴상입니다!";
    }
    
    const title = "<div class='" + prediction[0].className + "-animal-title'>" + resultTitle + "</div>";
    const explain = "<div class='animal-explain'>" + resultExplain + "</div>";
    document.getElementById("result-message").innerHTML = title + explain;

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const barWidth = (prediction[i].probability * 100).toFixed(0) + "%";
        const classDiv = document.createElement("div");
        classDiv.className = "prediction-bar-container";
        classDiv.innerHTML = `
            <div class="prediction-label">${prediction[i].className === 'dog' ? '강아지' : '고양이'}</div>
            <div class="prediction-bar-bg">
                <div class="prediction-bar-fill" style="width: ${barWidth}"></div>
            </div>
            <div class="prediction-percent">${barWidth}</div>
        `;
        labelContainer.appendChild(classDiv);
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
                
                try {
                    if (!model) await init();
                    await predict();
                } catch (err) {
                    console.error("AI 모델 로딩 실패", err);
                    document.getElementById("result-message").innerText = "모델 로딩 중 오류가 발생했습니다.";
                } finally {
                    loadingSpinner.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });
}
