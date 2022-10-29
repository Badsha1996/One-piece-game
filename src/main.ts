// two buttons 
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const audio : HTMLAudioElement = document.getElementById("audio") as HTMLAudioElement;
const result: HTMLElement = document.getElementById("result") as HTMLElement;

// status values
const moves: HTMLElement = document.getElementById("moves") as HTMLElement;
const time : HTMLElement = document.getElementById("time") as HTMLElement;

// container 
const controls = document.querySelector(".controls-container");
const gameContainer :  HTMLElement = document.querySelector(".main-container__game") as HTMLElement;

// Image Array for the game 
const items = [
    { name: "brook", image: "../assets/brook.png" },
    { name: "chibi-sanji", image: "../assets/chibi-sanji.png" },
    { name: "chibi-usopp", image: "../assets/chibi-usopp.png" },
    { name: "chibi-zoro", image: "../assets/chibi-zoro.png" },
    { name: "chopper", image: "../assets/chopper.png" },
    { name: "gear4", image: "../assets/gear4.png" },
    { name: "kid-luffy", image: "../assets/kid-luffy.png" },
    { name: "luffy", image: "../assets/luffy.png" },
    { name: "robin", image: "../assets/robin.png" },
    { name: "sanji", image: "../assets/sanji.png" },
    { name: "usopp", image: "../assets/usopp.png" },
    { name: "zoro", image: "../assets/zoro.png" },
];

// total card
let cards;
let interval;
let firstCard  : any = false;
let secondCard : any = false;
let winCount: number   = 0;

// audio music playing 
const playMusic = () =>{
    audio.play();
    audio.load();
} 


// auto time generator 
// 01:29:34  => 01:30:00
let seconds: number = 0;
let minutes:number = 0;

const timeGenerator = () =>{
    seconds += 1;
    if(seconds >=60){
        minutes += 1;
        seconds = 0;
    };
    
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds; // 1-9 => 01 otherwise 11
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes; 
    time.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
     
};


// auto move generator 
let movesCount: number = 0;
const movesCounter = () =>{
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const generateRandom = (size : number = 4) =>{
    // temporary array with all values
    let tempArray = [...items];
    // original size 
    size = (size * size) / 2;
    // result 
    let resultArray = [];
    //Random selection 
    for(let i=0; i<size; i++){
        const randomIndex = Math.floor(Math.random() * tempArray.length ); 
        resultArray.push(tempArray[randomIndex])
        // bug => avoid duplicate element multiple time 
        tempArray.splice(randomIndex, 1);
    }
    return resultArray;
}

const matrixGenerator = (resultArray : {name: string, image: string}[], size:number = 4) =>{
    // duplicate elements 
    resultArray = [...resultArray, ...resultArray];
    resultArray.sort(() => Math.random() - 0.5);
    gameContainer.innerHTML = "";
    for (let i = 0; i < size * size; i++){
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${resultArray[i].name}">
                    <div class="card-container__before">X</div>
                    <div class="card-container__after">
                        <img src="${resultArray[i].image}"class="image" alt="images">
                    </div>
         </div>
        `;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`

    // clicking on the cards 
    cards  = document.querySelectorAll(".card-container") 
    cards.forEach((card)=>{
        card.addEventListener("click", ()=>{
            // check if the card is already flipped
            if(!card.classList.contains("matched")){
                // flipped the card
                card.classList.add("flipped");
                var firstCardValue;
                if(!firstCard){
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                }else{
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if(firstCardValue == secondCardValue){
                        // both card matched then set matched class in them
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");

                        firstCard = false;
                        winCount+=1;
                        // when user win the game 
                        if(winCount == Math.floor(resultArray.length / 2)){
                            result.innerHTML = `<h2>Player won</h2>
                            <h4>Total Moves: ${movesCount}</h4>`;
                            // stopGame();
                            
                        }

                    }else{
                        firstCard = false;
                        secondCard = false;
                        let [tempFirstCard, tempSecondCard] = [firstCard, secondCard]
                        let delay = setTimeout(() => {
                            tempFirstCard.classList.remove("flipped");
                            tempSecondCard.classList.remove("flipped");
                        }, 1000);
                    }
                }
            }       
        })
    })
}












