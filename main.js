
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
