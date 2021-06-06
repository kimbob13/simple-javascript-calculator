import { factorial, percent } from "./unaryOperation.js";

const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    piClicked: false,
    clearEntryClicked: false,
    operator: null,
};

function inputDigit(value) {
    const { displayValue, waitingForSecondOperand, piClicked } = calculator;
    let digit;

    if (Number.isInteger(parseFloat(value))) {
        digit = parseFloat(value);

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = (displayValue === '0' || piClicked === true) 
                                      ? digit : displayValue + String(digit);
        }

        if (piClicked === true) {
            calculator.piClicked = false;
        }
    } else if (value === 'pi') {
        if (waitingForSecondOperand === true) {
            calculator.waitingForSecondOperand = false;
        }

        calculator.displayValue = String(Math.PI);
        calculator.piClicked = true;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (calculator.piClicked === true) {
        calculator.displayValue = '0.';
        calculator.piClicked = false;
    }

    // If the `displayValue` property does not contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
        // Append the decimal point
        calculator.displayValue += dot;
    }
}

function getDisplayValue() {
    const { displayValue, piClicked } = calculator;
    let inputValue;

    // `parseFloat` converts the string contents of `displayValue`
    // to a floating-point number
    if (piClicked === true) {
        inputValue = Math.PI;
    } else {
        inputValue = parseFloat(displayValue);
    }

    return inputValue;
}

function handleOperator(nextOperator) {
    // Destructure the properties on the calculator object
    const { firstOperand, operator } = calculator;
    const inputValue = getDisplayValue();
    console.log('inputValue 1', inputValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    // verify that `firstOperand` is null and that the `inputValue`
    // is not a `NaN` value
    if (firstOperand === null && !isNaN(inputValue)) {
        // Update the firstOperand property
        calculator.firstOperand = inputValue;
    } else if (operator) {
        console.log('inputValue 2', inputValue);
        const result = calculate(firstOperand, inputValue, operator);
        console.log('result', result);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
        if (nextOperator == '=') {
            // In this case, we treat the CE button as clicked even if not explicitly
            calculator.clearEntryClicked = true;
        }
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function handleUnaryOperator(unaryOperator) {
    let inputValue = getDisplayValue();

    switch (unaryOperator) {
        case 'sin':
            inputValue = Math.sin(inputValue);
            break;
        case '%':
            inputValue = percent(inputValue);
            break;
        case "+/-":
            inputValue = -inputValue;
            break;
        case 'cos':
            inputValue = Math.cos(inputValue);
            break;
        case 'factorial':
            try {
                inputValue = factorial(inputValue);
            } catch (err) {
                calculator.displayValue = 'Error';
                return;
            }
            break;
        case 'square-root':
            inputValue = Math.sqrt(inputValue);
            break;
        case 'tan':
            inputValue = Math.tan(inputValue);
            break;
        case 'square':
            inputValue = Math.pow(inputValue, 2);
            break;
        case 'log':
            inputValue = Math.log(inputValue);
            break;
    }

    if (calculator.piClicked === true) {
        calculator.piClicked = false;
    }
    calculator.displayValue = String(inputValue);
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator(resetAll) {
    calculator.displayValue = '0';
    if (resetAll === true) {
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    console.log('calculator resetted:\n', calculator);
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');

    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    // Access the clicked element
    const { target } = event;
    const { value } = target;
    let doubleClearEntry = false;

    if (calculator.clearEntryClicked === true) {
        calculator.clearEntryClicked = false;
        if (value === 'clear-entry') {
            doubleClearEntry = true;
        }
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case 'sin':
        case '%':
        case '+/-':
        case 'cos':
        case 'factorial':
        case 'square-root':
        case 'tan':
        case 'square':
        case 'log':
            handleUnaryOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'clear-entry':
            if (doubleClearEntry === false) {
                calculator.clearEntryClicked = true;
            }
            resetCalculator(doubleClearEntry);
            break;
        case 'all-clear':
            resetCalculator(true);
            break;
        default:
            inputDigit(value);
    }

    updateDisplay();
});