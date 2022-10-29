// two buttons 
const startButton : HTMLElement = document.getElementById("start") as HTMLElement;
const stopButton: HTMLElement = document.getElementById("stop")as HTMLElement;

const audio : HTMLAudioElement = document.getElementById("audio") as HTMLAudioElement;
const audioWin: HTMLAudioElement = document.getElementById("audio-win") as HTMLAudioElement;
const audioLoose : HTMLAudioElement = document.getElementById("audio-loose") as HTMLAudioElement;
const audioCorrect : HTMLAudioElement = document.getElementById("audio-correct") as HTMLAudioElement;
const audioWrong : HTMLAudioElement = document.getElementById("audio-wrong") as HTMLAudioElement;
const result: HTMLElement = document.getElementById("result") as HTMLElement;

// status values
const moves: HTMLElement = document.getElementById("moves") as HTMLElement;
const time : HTMLElement = document.getElementById("time") as HTMLElement;

// Audio Button
const play: HTMLElement = document.querySelector(".audio-play") as HTMLElement;
const pause: HTMLElement = document.querySelector(".audio-pause") as HTMLElement;

// container 
const controls: HTMLElement = document.querySelector(".controls-container")as HTMLElement;
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
let interval: string | number | NodeJS.Timer | undefined;
let firstCard  : any = false;
let secondCard : any = false;
let winCount: number   = 0;
let firstCardValue: string | null;


audio.volume = 0.4;
play.addEventListener("click",  ()=>{
    pause.style.display = "block";
    play.style.display = "none";
    audio.play();
    
})

pause.addEventListener("click",  ()=>{
    play.style.display = "block";
    pause.style.display = "none";
    audio.pause();
})


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
    if (minutes > 2){
        stopGame()
        result.innerHTML = `<h4>Time Limit exceed</h4>`
        audioLoose.play();
        audio.pause();
    }
    
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds; // 1-9 => 01 otherwise 11
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes; 
    time.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
     
};


// auto move generator 
let movesCount: number = 0;
const movesCounter = () =>{
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
    if (movesCount > 10){
        stopGame()
        result.innerHTML = `<h4>Exceed 10 moves</h4>`
        audioLoose.play();
        audio.pause();
    }
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
    // audio generate 
    

    // duplicate elements 
    resultArray = [...resultArray, ...resultArray];
    resultArray.sort(() => Math.random() - 0.5);
    gameContainer.innerHTML = "";
    for (let i = 0; i < size * size; i++){
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${resultArray[i].name}" ondblclick="playGame()">
                    <div class="card-container__before">
                        <img src="./assets/luffy-face.png" class="image" alt="images">
                    </div>
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
                        audioCorrect.play()

                        firstCard = false;
                        winCount+=1;
                        // when user win the game 
                        if(winCount == Math.floor(resultArray.length / 2)){
                            audioWin.play();
                            audio.pause();
                            result.innerHTML = `<h2>Player won</h2>
                            <h4>Total Moves: ${movesCount}</h4>`;
                            stopGame();
                            
                        }

                    }else{
                        let [tempFirstCard, tempSecondCard] = [firstCard, secondCard]
                        firstCard = false;
                        secondCard = false;
                        audioWrong.play();
                        setTimeout(() => {
                            tempFirstCard.classList.remove("flipped");
                            tempSecondCard.classList.remove("flipped");
                        }, 500);
                        
                        
                        
                    }
                }
            }       
        })
    })
}

startButton.addEventListener("click", ()=>{
    movesCount = 0;
    seconds = 0;
    minutes = 0;

    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");

    // timer 
    interval = setInterval(timeGenerator, 1000)
    moves.innerHTML = `<span>Moves: </span>${movesCount}`
    audioLoose.pause();
    audioWin.pause();
    audio.play()
    playGame();

})
const stopGame= () => { 
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval)
}

stopButton.addEventListener("click", stopGame)

const playGame = () =>{
    result.innerHTML = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues)
    matrixGenerator(cardValues);
    console.log(seconds)
    
}








