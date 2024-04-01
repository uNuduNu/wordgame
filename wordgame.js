
async function getWord(){
    isLoading = true;
    gameResult.innerText = "Loading...";
    const promise = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const processedResponse = await promise.json();

    guessword = processedResponse.word.toUpperCase();
    origGuessword = guessword;
    console.log(guessword);

    isLoading = false;
    gameResult.innerText = "";
}

async function checkWord(){
    isLoading = true;
    gameResult.innerText = "Checking...";

    const result = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word: currentGuess })
    });
    const { validWord } = await result.json();

    gameResult.innerText = "";
    isLoading = false;

    return validWord;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

let isFinished = false;
let isLoading = false;
let currentWord = 0;
let guessword = "";
let currentGuess = "";
const letters = document.querySelectorAll(".letter");
const gameResult = document.querySelector(".result");

async function testAnswer(){
    const isValid = await checkWord();

    console.log(isValid);

    if (!isValid) {
        gameResult.innerText = "Not valid";
        return;
    }

    let closeLetters = guessword;
    
    for (let i = 0; i < currentGuess.length; i++){
        if (currentGuess[i] === guessword[i]){
            letters[currentWord * 5 + i].classList.add("correct");
            const remIndex = closeLetters.indexOf(currentGuess[i]);
            closeLetters = closeLetters.substring(0, remIndex) + closeLetters.substring(remIndex + 1, closeLetters.length);
            console.log(closeLetters);
        }
    }
    for (let i = 0; i < currentGuess.length; i++){
        if (currentGuess[i] !== guessword[i]){
            if (closeLetters.includes(currentGuess[i])){
                letters[currentWord * 5 + i].classList.add("close");
                console.log(closeLetters);
                const remIndex = closeLetters.indexOf(currentGuess[i]);
                closeLetters = closeLetters.substring(0, remIndex) + closeLetters.substring(remIndex + 1, closeLetters.length);
                console.log(closeLetters);
            }
            else{
                letters[currentWord * 5 + i].classList.add("wrong");
            }
        }
    }

    // word guessed?
    if (guessword === currentGuess) {
        gameResult.innerText = "Great success!"
        gameResult.classList.add("correct");
        isFinished = true;

        return;
    }

    currentWord++;
    currentGuess = "";

    if (currentWord > 5)
    {
        isFinished = true;

        gameResult.innerText = "Out of guesses, correct word was: " + guessword;
        gameResult.classList.add("wrong");
    }
}

function init(){
    guessword = "";

    document.addEventListener("keydown", function(event){
        if ( isFinished || isLoading) {
            return;
        }

        if (event.key === "Enter"){
            testAnswer();
        }
        else if (event.key === "Backspace" ) {
            letters[currentWord * 5 + currentGuess.length-1].innerText = "";
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        }
        else if (isLetter(event.key)){
            let guessedLetter = event.key.toUpperCase();
            if (currentGuess.length < 5){
                currentGuess += guessedLetter;
            }
            else 
            {
                currentGuess = currentGuess.substring(0, currentGuess.length - 1);
                currentGuess += guessedLetter;
            }

            letters[currentWord * 5 + currentGuess.length-1].innerText = guessedLetter;
        }
    });

    getWord();
}

init();