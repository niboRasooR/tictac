const EMPTY = "[_]";
const p1 = "[X]";
const p2 = "[O]";
var readlineSync = require('readline-sync');

class Player {
    constructor(number, iscpu, tic) {
        this.number = number;
        this.isCpu = iscpu;
        this.tic = tic;
    }

    getIsCpu() {
        return this.isCpu;
    }
    stroke(coord) {
        console.log(" Add " + this.tic);
        gameManager.getBoard()[coord.x][coord.y] = this.tic;
    }

    getNumber() {
        return this.number;
    }
}

var coordinates = { x: 0, y: 0 };

class GameManager {
    constructor(board, player1, player2) {
        this.gameBoard = board;
        this.turns = 0;
        this.time = 0;
        this.win = 3;
        this.over = false;
        this.player1Turn = true;
        this.player1 = player1;
        this.player2 = player2;

    }


    gameOver() {
        return this.over;
    }

    turn(player) {
        this.turns++;
        if (!(player instanceof Player)) {
            console.log("  turn method accepts Player as parameter");
        }

        if (player.getIsCpu() == false) {
            //ask
            let empty = false;
            while (!empty) {
                console.log("PLAYER " + player.getNumber() + "!!! Give coordinates for your move!");
                let letterArr = ["a", "b", "c", "d", "e", "f", "g"];
                let letterAr2 = new Array();

                for (let i = 0; i < this.gameBoard.length; i++) {
                    letterAr2.push(letterArr[i]);
                }
                let ans = false;
                let col;
                while (ans == false) {
                    let str = readlineSync.question("Row  (A,B...)");
                    for (let i = 0; i < letterAr2.length; i++) {
                        console.log(" letter is " + letterAr2[i]);
                        if (str.toLowerCase() == letterAr2[i]) {
                            ans = true;
                            col = i;
                            break;
                        } else {
                            console.log("Please give your answer as a single alphabet (e.g. A,B or C)");
                        }
                    }
                }
                let row = "";
                while (!Number.isInteger(row)) {
                    row = readlineSync.question("Please type the number of desired column (1,2...)");
                    row = parseInt(row);
                    if (!Number.isInteger(row)) {
                        console.log("Please give your column answer as an integer (e.g. 1, 2 or 3) ");
                    }

                }

                if (this.gameBoard[col][row - 1] == EMPTY) {
                    coordinates.x = col;
                    coordinates.y = row - 1;
                    player.stroke(coordinates);
                    empty = true;
                }
            }

        } else {
            //computer's move
            player.stroke(player.calcMove());

        }

        this.checkWin(player);
    }
    setWin(num) {
        if (num > this.gameBoard.length) {
            num = this.gameBoard.length;
        }
        if (num < 3) {
            num = 3;
        }
        this.win = num;
    }
    getBoard() {
        return this.gameBoard;
    }

    setBoard(size) {
        if (!Number.isInteger(size)) {
            throw new TypeError("  BOARD SIZE MUST BE A NUMBER");
        } else {
            if (this.gameBoard == undefined) {
                this.gameBoard = createBoard(size);
            } else {
                console.log(" board has been already created");
            }
        }
    }
    writeToBoard(coord, tic) {
        this.gameBoard[coord.x][coord.y] = tic;
    }

    checkWin(player) {
        let start = { x: 0, y: 0 };

        start.x = this.gameBoard.length - 1;
        start.y = this.gameBoard.length - 1;


        this.checkHorWin(0, this.gameBoard, player);
        this.checkVerWin(0, this.gameBoard, player);

        for (start.y = 0; start.y < this.gameBoard.length; start.y++) {
            while (start.x >= 0) {
                // console.log("checking REVERSED started at " + start.x + " " + start.y);
                this.checkDiagRev(start, this.gameBoard, player);
                start.x--;
            }
            start.x = 0;


        }
        start.x = 0;
        start.y = 0;

        for (start.y = 0; start.y < this.gameBoard.length; start.y++) {
            while (start.x < this.gameBoard.length) {
                //  console.log("checking NORMAL started at " + start.x + " " + start.y);
                this.checkDiag(start, this.gameBoard, player);

                start.x++;
            }
            start.x = 0;


        }

        printBoard();

    }

    checkDiag(st, board, player) {
        // console.log(" check DIAG i " + st.x + " and y" + st.y);
        let i = st.x;

        let y = st.y;
        let got = 0;
        let b = new Array();
        copyBoard(board, b);
        let printable = b.slice();
        for (i; i < b.length; i++) {

            let stroke = b[i][y];
            if (stroke == EMPTY && got > 0) {
                // console.log("     LASKENTA NOLLAAN");
                got = 0;
            }
            if (stroke == player.tic || b[i][y] == "[#]" || b[i][y] == "[@]") {
                //  console.log("found tic at [" + i + "]-[" + y + "]");
                //  printable[i][y] = "[#]";
                //   print(printable);

                got++;

            } else {
                // printable[i][y] = "[€]";
                // print(printable);

            }

            if (got >= this.win) {
                //    console.log(" VOITIT, NO WOE VITTU!!!");
                this.printWin(player);
                this.over = true;
                break;
            }
            y++;
            if (y >= b.length - 1) {

                y = b.length - 1;
            }
        }
    }

    checkVerWin(start, board, player) {
        let i = start;
        let y = start.y;
        let b = new Array();
        copyBoard(board, b);
        let printable = new Array();
        copyBoard(b, printable);
        let got = 0;

        //go thru all cols
        for (i; i < b.length; i++) {
            got = 0;

            for (let y = 0; y < b.length; y++) {
                console.log(" checking at " + i + " - " + y);
                let stroke = b[i][y];
                if (stroke == EMPTY && got > 0) {
                    console.log("     LASKENTA NOLLAAN");
                    got = 0;
                }
                if (stroke == player.tic || b[i][y] == "[#]" || b[i][y] == "[@]") {

                    console.log("found tic at [" + i + "]-[" + y + "]");
                    printable[i][y] = "[#]";

                    got++;
                    if (got >= this.win) {
                        this.printWin(player);
                        this.over = true;
                    }

                } else {
                    printable[i][y] = "[*]";
                    print(printable);

                }

            }


        }

    }

    checkHorWin(start, board, player) {
        let i = start;
        let y = 0;
        let b = new Array();
        copyBoard(board, b);
        let printable = b.slice();
        let got = 0;

        while (y < b.length) {

            for (let i = 0; i < b.length; i++) {
                got = 0;
                if (b[i][y] == player.tic || b[i][y] == "[@]") {

                    got++;
                    if (got >= this.win) {
                        this.printWin(player);
                        this.over = true;
                    } else {
                        printable[i][y] = "[*]";
                        //   print(printable);

                    }
                }


            }
            y++;
        }


    }

    checkDiagRev(start, board, player) {
        console.log(" check diag rev");
        let i = start.x;
        let y = start.y;
        let b = new Array();
        copyBoard(board, b);
        let printable = new Array();
        copyBoard(b, printable);
        let got = 0;
        for (i; i >= 0; i--) {

            let stroke = b[i][y];
            if (stroke == EMPTY && got > 0) {
                //    console.log("     LASKENTA NOLLAAN");
                got = 0;
            }
            if (b[i][y] == player.tic || b[i][y] == "[@]") {
                console.log("found tic at [" + i + "]-[" + y + "]");
                printable[i][y] = "[@]";
                print(printable);
                got++;
                if (got >= this.win) {
                    this.printWin(player);
                    this.over = true;
                }
            } else {
                printable[i][y] = "[*]";
                console.log(" PRINT REV RESULT");
                print(printable);

            }

            y--;
            if (y < 0) {
                y = 0;
            }
        }
    }

    printWin(player) {
        if (player.isCpu) {
            console.log(" Computer WIns! Game over!");

        } else {
            console.log(" PLayer " + player.number + " wins!! ");
        }
        this.over = true;
    }
}
const gameManager = new GameManager(null, null, null);

function createBoard(size) {
    if (isNaN(size)) {
        throw new TypeError("size must be a number");
    } else {
        let b = [];
        while (b.length < size) {

            b.push([]);
        }
        for (let i = 0; i < b.length; i++) {
            while (b[i].length < size) {
                //  console.log(" add empty to column " + i);
                b[i].push(EMPTY);
            }
        }
        return b;
    }

}

function copyBoard(array, newarr) {

    for (element in array) {
        newarr.push(array[element].slice());
    }


}
class Cpu extends Player {
    constructor() {

        super(2, true, p2);

    }

    calcMove() {
        let coordinates = { "x": 0, "y": 0 };
        let board = gameManager.getBoard();
        //Simple move. just random
        //go through board and see which ones are empty
        let empties = [];
        var column;
        for (let x = 0; x < board.length; x++) {
            column = board[x];
            console.log("col " + x + ":" + column[x]);
            for (let y = 0; y < column.length; y++) {
                if (y == undefined || y == " ") {
                    empties.push({ "x": x, "y": y });
                }
            }
        }
        let cell = undefined;
        let x;
        let y;
        while (cell != EMPTY) {
            //random col
            x = Math.floor(Math.random() * (board.length));
            //console.log(" get column " + x);
            let column = board[x];
            //find empty row
            y = Math.floor(Math.random() * (column.length));
            //console.log("x : " + x + " y: " + y);
            // console.log("value: " + board[x][y]);
            cell = board[x][y];
        }
        coordinates.x = x;
        coordinates.y = y;
        console.log(" Computer made a move : ");
        return coordinates;
    }

}

//for debugging  
function print(board) {

    let b = board;
    let num = 1;
    let nums = "   ";
    while ((num - 1) < b.length) {
        nums += " " + num + " ";
        num++;
    }
    console.log(nums);

    let abc = ["A", "B", "C", "D", "E", "F", "G"];
    for (let column = 0; column < b.length; column++) {
        let str = abc[column] + "  ";
        let c = b[column];
        for (let row = 0; row < c.length; row++) {
            str += c[row];
        }
        //    console.log(str);
    }
}

function printBoard() {
    let b = gameManager.getBoard();
    let num = 1;
    let nums = "   ";
    while ((num - 1) < b.length) {
        nums += " " + num + " ";
        num++;
    }
    console.log(nums);

    let abc = ["A", "B", "C", "D", "E", "F", "G"];
    for (let column = 0; column < b.length; column++) {
        let str = abc[column] + "  ";
        let c = b[column];
        for (let row = 0; row < c.length; row++) {
            str += c[row];
        }
        console.log(str);
    }
}


function main() {
    let score = "blaa";
    let width = null;


    while (!Number.isInteger(width)) {

        width = readlineSync.question("How many squares wide do you want the game board to be? (integer)");
        width = Number.parseInt(width);
        if (!Number.isInteger(width)) {
            console.log("Only integer accepted! Type once more, please!");
        }
    }


    if (width < 3) {
        width = 3;
    } else if (width > 5) {
        width = 5;
    } else {}

    gameManager.setBoard(width);

    while (!Number.isInteger(score)) {
        score = readlineSync.question("What's the number of pieces in a row to win?");
        score = Number.parseInt(score);
        if (!Number.isInteger(score)) {
            console.log("Only integer accepted! Type once more, please!");
        }
    }
    if (score > width) {
        score = width;
    }
    if (score < 3) {
        score = 3;
    }
    //number of players

    let num = "";
    while (!Number.isInteger(num)) {
        num = readlineSync.question("How many players (1 or 2)?");
        num = Number.parseInt(num);
        if (!Number.isInteger(num)) {
            console.log("Only integer accepted! Type once more, please!");
        }
    }

    let player1 = new Player(1, false, p1);
    let player2;

    if (num > 1) {
        console.log(" Umm that's 2 players then");
        num = 2;
        player2 = new Player(2, false, p2);
    } else {
        console.log(" One player against computer! Fine!");
        num = 1;

        player2 = new Cpu();
    }

    gameManager.setWin(score);

    console.log(" BOARD IS length " + gameManager.getBoard().length);

    let cpu = new Cpu();
    printBoard();
    while (!gameManager.gameOver()) {
        gameManager.turn(player1);
        printBoard();
        gameManager.turn(player2);
        printBoard();
    }
    /* gameManager.turn(player1);
     printBoard();
     gameManager.turn(player1);
     printBoard();
     gameManager.turn(player1);
     printBoard();
     gameManager.turn(player1);
     printBoard();
     gameManager.turn(player1);

     if (player2.getIsCpu()) {
         player2.stroke(player2.calcMove());
     }

     printBoard();
     gameManager.checkWin(player1);*/
}
main();