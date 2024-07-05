import styles from './Calculator.module.css';
import { useState, useRef } from 'react';

const Calculator = () => {
    const [inputValue, setInputValue] = useState("");
    const [isShowResult, setIsShowResult] = useState(false);
    const [result, setResult] = useState('');

    const inputArray = useRef([]);

    const handleOnChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleButtonClick = (value) => {
        const operators = ['+', '-', '*', '/'];
        if(inputValue === ""  && operators.includes(value)) {
            console.log('Use operand first');
            return;
        }
        if(operators.includes(value) && operators.includes(inputValue[inputValue.length-1])) {
            console.log('cannot use operator');
            return;
        }
        
        if(!operators.includes(value)) {
            if(inputValue === "" || operators.includes(inputValue[inputValue.length-1])) {
                inputArray.current.push(value);
            } else {
                inputArray.current[inputArray.current.length-1] = 
                inputArray.current[inputArray.current.length-1].concat(value);
            }
        } else {
            inputArray.current.push(value);
        }
        
        setInputValue((prevValue) => prevValue.concat(value));
    };

    const handleClear = () => {
        setInputValue("");
        setIsShowResult(false);
        inputArray.current = [];
    };

    const calculateResult = () => {
        if(inputValue === "") {
            setResult('Error');
            setIsShowResult(true);
            return;
        }
        const operators = ['+', '-', '*', '/'];
        const resStack = [];

        const calculationArray = inputArray.current;
        // removes last ele if it is operator
        if(operators.includes(calculationArray[calculationArray.length-1])) {
            calculationArray.splice(calculationArray.length-1, 1);
        }

        calculationArray.forEach((ele, ind) => {
            if(ind === 0) {
                resStack.push(Number(ele));
            } else {
                const lastPushEle = resStack[resStack.length-1];
                if(lastPushEle === '*') {
                    resStack.pop();
                    const leftOperand = Number(resStack.pop());
                    resStack.push(leftOperand * Number(ele));
                } else if(lastPushEle === '/') {
                    resStack.pop();
                    const leftOperand = Number(resStack.pop());
                    if(Number(ele) === 0 && leftOperand === 0) {
                        setResult('NaN');
                        setIsShowResult(true);
                    }
                    if(Number(ele) === 0) {
                        setResult('Infinity');
                        setIsShowResult(true);
                    }
                    resStack.push(leftOperand / Number(ele));
                } else {
                    resStack.push(ele);
                }
            }    
        });

        let finalResultStack = [];
        resStack.forEach((ele, ind) => {
            if(ind === 0) {
                finalResultStack.push(Number(ele));
            } else {
                const prevStackEle = finalResultStack[finalResultStack.length-1];
                if(prevStackEle === '+') {
                    finalResultStack.pop();
                    const leftOperand = finalResultStack.pop();
                    finalResultStack.push(Number(leftOperand) + Number(ele));
                } else if(prevStackEle === '-') {
                    finalResultStack.pop();
                    const leftOperand = finalResultStack.pop();
                    finalResultStack.push(Number(leftOperand) - Number(ele));
                } else {
                    finalResultStack.push(ele);
                }
            }
        });
        
        setIsShowResult(true);
        setResult(finalResultStack[0]);
    };

    return (
        <div className={styles.calculator_wrapper}>
            <h1>React Calculator</h1>
            <input
                type='text'
                value={inputValue}
                name='input'
                onChange={handleOnChange}
            />
            {
                isShowResult && <div>{result}</div>
            }
            <div className={styles.button_grid}>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='7'>7</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='8'>8</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='9'>9</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='+'>+</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='4'>4</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='5'>5</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='6'>6</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='-'>-</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='1'>1</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='2'>2</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='3'>3</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='*'>*</button>
                <button onClick={handleClear}>C</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='0'>0</button>
                <button onClick={calculateResult}>=</button>
                <button onClick={(e) => handleButtonClick(e.target.value)} value='/'>/</button>
            </div>
        </div>
    );
};

export default Calculator;