const board = document.getElementById("board");
const message = document.getElementById("message");

let cells = [];
let gameActive = false;
let playerTurn = false;

const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function createBoard(){
    board.innerHTML = "";
    cells = [];
    gameActive = false;
    playerTurn = false;

    for(let i=0;i<9;i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", ()=> playerMove(i));
        board.appendChild(cell);
        cells.push(cell);
    }

    message.innerHTML = "Келісіп алайық егер мен жеңсем<br>ғашықтар күнін бірге өткіземіз 😉 сен жеңсең менсіз💔 ";

    // Компьютер бірінші жүрісін аз кешіктіріп жасаймыз
    setTimeout(() => {
        computerFirstMove();
    }, 4000);
}

function computerFirstMove(){
    // Орталық ұяшыққа нолик
    cells[4].appendChild(createCircle());
    gameActive = true;
    playerTurn = true;
    message.innerHTML = "Сенің кезегің ";
}

function playerMove(index){
    if(!gameActive || !playerTurn || cells[index].querySelector(".cross, .circle")) return;

    cells[index].appendChild(createCross());
    playerTurn = false;

    if(checkWinner("cross")) return;
    if(checkDraw()) return;

    setTimeout(computerMove, 500);
}

function computerMove(){
    let move = findBestMove();
    if(move !== -1){
        cells[move].appendChild(createCircle());
    }

    if(checkWinner("circle")) return;
    if(checkDraw()) return;

    playerTurn = true;
}

function createCross(){
    const cross = document.createElement("div");
    cross.classList.add("cross");
    return cross;
}

function createCircle(){
    const circle = document.createElement("div");
    circle.classList.add("circle");
    return circle;
}

function findBestMove(){
    for(let combo of winCombos){
        let count = combo.filter(i => cells[i].querySelector(".circle")).length;
        let empty = combo.find(i => !cells[i].querySelector(".circle") && !cells[i].querySelector(".cross"));
        if(count === 2 && empty !== undefined){
            return empty;
        }
    }
    return cells.findIndex(c => !c.querySelector(".cross") && !c.querySelector(".circle"));
}

function checkWinner(type){
    for(let combo of winCombos){
        if(combo.every(i => cells[i].querySelector(`.${type}`))){
            drawLine(combo);
            gameActive = false;

            if(type === "circle"){
                message.innerHTML = "Мен ұттым 🥳❤️ Сен жеңілдің 😉<br> Ғашықтар күнін бірге өткіземіз😍💖";
            } else {
                message.innerHTML = "Сен ұттың 😮 Бірақ бәрібір кездесеміз 😉💖";
            }
            return true;
        }
    }
    return false;
}

function checkDraw(){
    const isDraw = cells.every(c => c.querySelector(".cross, .circle"));
    if(isDraw){
        gameActive = false;
        message.innerHTML = "Оңай берілетін жан емес екенсіз 😏";
        return true;
    }
    return false;
}

function drawLine(combo){
    const first = cells[combo[0]].getBoundingClientRect();
    const last = cells[combo[2]].getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const x1 = first.left + first.width/2 - boardRect.left;
    const y1 = first.top + first.height/2 - boardRect.top;
    const x2 = last.left + last.width/2 - boardRect.left;
    const y2 = last.top + last.height/2 - boardRect.top;

    const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const angle = Math.atan2(y2-y1, x2-x1) * 180/Math.PI;

    const line = document.createElement("div");
    line.classList.add("line");
    line.style.width = length + "px";
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.transform = `rotate(${angle}deg)`;

    board.appendChild(line);
}

function resetGame(){
    createBoard();
}

// Бет жүктелгенде ойын басталады
window.addEventListener("load", createBoard);

