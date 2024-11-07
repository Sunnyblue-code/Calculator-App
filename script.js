class Calculator {
  constructor() {
    this.displayValue = "0";
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
    this.operatorDisplay = ""; // Add this new property
    this.displayString = "0"; // Add this new property

    this.bindEvents();
  }

  bindEvents() {
    document
      .querySelector(".calculator-keys")
      .addEventListener("click", (e) => this.handleClick(e));
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  handleKeyboard(event) {
    const key = event.key;
    if (key.match(/[0-9]/)) {
      event.preventDefault();
      this.inputDigit(key);
    } else if (key === ".") {
      event.preventDefault();
      this.inputDecimal(key);
    } else if (key === "=" || key === "Enter") {
      event.preventDefault();
      this.handleOperator("=");
    } else if (key === "Backspace") {
      event.preventDefault();
      this.clearLastDigit();
    } else if (key === "Escape") {
      event.preventDefault();
      this.resetCalculator();
    } else if (["+", "-", "*", "/"].includes(key)) {
      event.preventDefault();
      this.handleOperator(key);
    }
    this.updateDisplay();
  }

  clearLastDigit() {
    this.displayValue = this.displayValue.slice(0, -1) || "0";
  }

  inputDigit(digit) {
    if (this.waitingForSecondOperand) {
      this.displayString = this.displayValue + this.operatorDisplay + digit;
      this.displayValue = digit;
      this.waitingForSecondOperand = false;
    } else {
      const newValue =
        this.displayValue === "0" ? digit : this.displayValue + digit;
      this.displayValue = newValue;
      this.displayString =
        this.firstOperand !== null
          ? this.firstOperand + this.operatorDisplay + newValue
          : newValue;
    }
  }

  inputDecimal(dot) {
    if (this.waitingForSecondOperand) return;

    if (!this.displayValue.includes(dot)) {
      this.displayValue += dot;
    }
  }

  handleClick(event) {
    if (!event.target.matches("button")) {
      return;
    }

    const { target } = event;
    const { value } = target;

    if (target.classList.contains("operator")) {
      this.handleOperator(value);
      this.updateDisplay();
      return;
    }

    if (target.classList.contains("decimal")) {
      this.inputDecimal(value);
      this.updateDisplay();
      return;
    }

    if (target.classList.contains("all-clear")) {
      this.resetCalculator();
      this.updateDisplay();
      return;
    }

    // must be a number
    this.inputDigit(value);
    this.updateDisplay();
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.displayValue);

    if (this.operator && this.waitingForSecondOperand) {
      this.operator = nextOperator;
      this.operatorDisplay = this.getOperatorSymbol(nextOperator);
      this.displayString = this.firstOperand + this.operatorDisplay;
      return;
    }

    if (this.firstOperand === null && !isNaN(inputValue)) {
      this.firstOperand = inputValue;
      // Add these lines to update display immediately when first operator is pressed
      this.displayString = inputValue + this.getOperatorSymbol(nextOperator);
      this.displayValue = String(inputValue);
    } else if (this.operator && !isNaN(inputValue)) {
      const result = performCalculation[this.operator](
        this.firstOperand,
        inputValue
      );

      if (nextOperator === "=") {
        this.displayString = String(result);
        this.displayValue = String(result);
        this.firstOperand = null;
        this.operatorDisplay = "";
      } else {
        this.displayString = result + this.getOperatorSymbol(nextOperator);
        this.displayValue = String(result);
        this.firstOperand = result;
      }
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
    if (nextOperator !== "=") {
      this.operatorDisplay = this.getOperatorSymbol(nextOperator);
    }
  }

  getOperatorSymbol(operator) {
    const symbols = {
      "+": " + ",
      "-": " − ",
      "*": " × ",
      "/": " ÷ ",
      "=": "",
    };
    return symbols[operator] || "";
  }

  resetCalculator() {
    this.displayValue = "0";
    this.displayString = "0";
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
    this.operatorDisplay = "";
  }

  updateDisplay() {
    const display = document.querySelector(".calculator-screen");
    display.value = this.displayString;
    display.style.transform = "scale(1.02)";
    setTimeout(() => (display.style.transform = "scale(1)"), 100);
  }
}

const performCalculation = {
  "/": (a, b) => (b === 0 ? "Error" : a / b),
  "*": (a, b) => a * b,
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "=": (_, b) => b,
};

// Initialize calculator
const calc = new Calculator();
