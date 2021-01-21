'use strict'

const FLAG = '🚩'
const BOMB = '💣'
var gBoard

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    gStartTime: 0,
    gInterval: 0
}

var gLevel = {
    SIZE: 8,
    MINES: 12
};

function buildBoard(count, mineCount) {
    var board = []
    for (var i = 0; i < count; i++) {
        board.push([]);
        for (var j = 0; j < count; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    for (var i = 0; i < mineCount; i++) {
        board[getRandomInt(0, count)][getRandomInt(0, count)].isMine = true
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++)
            board[i][j].minesAroundCount = setMinesNegsCount(board, {
                i: i,
                j: j
            })
    }
    return board
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var mineDefault = (cell.isMine) ? 'class = "mineDefault"' : ''
            // var shown = (cell.isShown) ? `class = "shown"` : ''
            strHtml += `<td oncontextmenu="cellMarked(this)" data-i="${i}" data-j="${j}" 
            onclick="cellClicked(this,event)" ${mineDefault} class = "default cell${i}-${j}"></td>`
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function initGame() {
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES)
    renderBoard(gBoard)
    gGame.isOn = true
    gGame.gStartTime = 0

}

function setMinesNegsCount(board, position) {
    var count = 0
    for (var i = position.i - 1; i <= position.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = position.j - 1; j <= position.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === position.i && j === position.j) continue;

            var newPos = {
                i: i,
                j: j
            }
            if (board[newPos.i][newPos.j].isMine) {
                count++
            }
        }
    }
    return count
}

function findNegs(board, position) {
    var neighbors = []
    for (var i = position.i - 1; i <= position.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = position.j - 1; j <= position.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === position.i && j === position.j) continue;

            var newPos = {
                i: i,
                j: j
            }
            neighbors.push(board[newPos.i][newPos.j])
        }
    }
    return neighbors
}

function easy() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    initGame()
}

function medium() {
    gLevel.SIZE = 8
    gLevel.MINES = 12
    initGame()
}

function hard() {
    gLevel.SIZE = 12
    gLevel.MINES = 30
    initGame()
}

function cellClicked(elCell) {

    if (gGame.gInterval === 0) {

        gGame.gStartTime = Date.now()
        gGame.gInterval = setInterval(timer, 100);
    }

    if (!gGame.isOn) return

    var posI = elCell.dataset.i
    var posJ = elCell.dataset.j

    var pos = {
        i: +posI,
        j: +posJ
    }

    var currCell = gBoard[pos.i][pos.j]

    elCell.classList.add('shown')

    if (currCell.isShown) return
    currCell.isShown = true

    if (currCell.isMine) {
        if (currCell.isMarked) return
        checkGameOver(elCell, pos)
        return
    }

    if (currCell.minesAroundCount === 0) {
        expandShown(pos, gBoard)

    } else {
        printNumNegs(gBoard, pos, elCell)
    }

}

function expandShown(position, board) {
    for (var i = position.i - 1; i <= position.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = position.j - 1; j <= position.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;

            var newPos = {
                i: i,
                j: j
            }

            var elCell = document.querySelector(`.cell${newPos.i}-${newPos.j}`);

            board[i][j].isShown = true
            printNumNegs(board, newPos, elCell)
        }
    }
    if (elCell.minesAroundCount === 0) expandShown(position, board)
}

function checkGameOver() {
    clearInterval(gGame.gInterval)
    var elMines = document.querySelectorAll('.mineDefault')
    var elH1 = document.querySelector('.title')
    var elRestart = document.querySelector('.restart')

    for (var i = 0; i < elMines.length; i++) {

        elMines[i].classList.add('mine')
        elMines[i].classList.remove('shown')
        elMines[i].innerText = BOMB
    }
    gGame.isOn = false
    elH1.innerText = 'Game Over'
    elRestart.style.display = 'block'
}

function cellMarked(elCell) {
    if (gGame.gInterval === 0) {

        gGame.gStartTime = Date.now()
        gGame.gInterval = setInterval(timer, 100);
    }
    elCell.classList.toggle('marked')
    if (elCell.innerHTML === FLAG)
        elCell.innerHTML = ''
    else  elCell.innerHTML = FLAG
    gGame.markedCount++
    if (gGame.markedCount === gLevel.MINES) {
        win()
    }

}

function restart() {
    var elH1 = document.querySelector('.title')
    var elRestart = document.querySelector('.restart')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].isShown = false
        }
    }
    elH1.innerText = 'Mine Sweeper'
    elRestart.style.display = 'none'
    initGame()
}

function printNumNegs(board, position, elCell) {
    var currcell = board[position.i][position.j]
    elCell.classList.add('shown')


    if (currcell.minesAroundCount === 0) elCell.style.color = 'transparent'
    else if (currcell.minesAroundCount === 1) elCell.style.color = 'blue'
    else if (currcell.minesAroundCount === 2) elCell.style.color = 'rgb(41, 160, 4)'
    else if (currcell.minesAroundCount === 3) elCell.style.color = 'red'
    else if (currcell.minesAroundCount === 4) elCell.style.color = 'purple'
    else if (currcell.minesAroundCount === 5) elCell.style.color = 'hotpink'
    else if (currcell.minesAroundCount === 6) elCell.style.color = 'orange'
    elCell.innerText = currcell.minesAroundCount
}

function timer() {
    var elTimer = document.querySelector('.timer')

    elTimer.innerText = parseInt((Date.now() - (gGame.gStartTime)) / 100) / 10
}

function win() {
    var elH1 = document.querySelector('.title')
    var elRestart = document.querySelector('.restart')
    elH1.innerText = 'You Win'
    elRestart.style.display = 'block'
    clearInterval (gGame.gInterval)
    gGame.isOn = false
}