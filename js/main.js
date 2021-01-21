'use strict'

var gBoard

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

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
            strHtml += `<td data-i="${i}" data-j="${j}" 
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
    gBoard = buildBoard(4, 2)
    renderBoard(gBoard)
    gGame.isOn = true
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
    gBoard = buildBoard(4, 2)
    renderBoard(gBoard)
}

function medium() {
    gBoard = buildBoard(8, 12)
    renderBoard(gBoard)
}

function hard() {
    gBoard = buildBoard(12, 30)
    renderBoard(gBoard)
}

function cellClicked(elCell, ev) {
    if (!gGame.isOn) return

    var posI = elCell.dataset.i
    var posJ = elCell.dataset.j

    var pos = {
        i: +posI,
        j: +posJ
    }
    var currCell = gBoard[pos.i][pos.j]

    if (currCell.isShown) return
    currCell.isShown = true

    if (currCell.isMine) {
        checkGameOver(elCell, pos)
        return
    }

    if (currCell.minesAroundCount === 0) {
        expandShown(pos, gBoard)
    
    } else {
        printNumNegs(gBoard, pos, elCell)
    }

    if (ev.shiftKey) cellMarked(elCell, pos)
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
}

function checkGameOver() {
    var elMines = document.querySelectorAll('.mineDefault')
    var elH1 = document.querySelector('.title')
    var elRestart = document.querySelector('.restart')

    for (var i = 0; i < elMines.length; i++) {

        elMines[i].classList.add('mine')
        elMines[i].classList.remove('shown')
        elMines[i].innerText = 'X'
    }
    gGame.isOn = false
    elH1.innerText = 'Game Over'
    elRestart.style.display = 'block'
}

function cellMarked(elCell, pos) {
    elCell.innerText = ''
    elCell.classList.toggle('marked')
    elCell.classList.remove('mine')
    gBoard[pos.i][pos.j].isMarked = true
}

function restart() {
    var elH1 = document.querySelector('.title')
    var elRestart = document.querySelector('.restart')
    initGame()
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].isShown = false
        }
    }
    elH1.innerText = 'Mine Sweeper'
    elRestart.style.display = 'none'
}

function printNumNegs(board, position, elCell) {
    var currcell = board[position.i][position.j]

    if (currcell.minesAroundCount === 0) elCell.style.color = 'transparent'
    else if (currcell.minesAroundCount === 1) elCell.style.color = 'blue'
    else if (currcell.minesAroundCount === 2) elCell.style.color = 'rgb(41, 160, 4)'
    else if (currcell.minesAroundCount === 3) elCell.style.color = 'red'
    else if (currcell.minesAroundCount === 4) elCell.style.color = 'purple'
    else if (currcell.minesAroundCount === 5) elCell.style.color = 'hotpink'
    else if (currcell.minesAroundCount === 6) elCell.style.color = 'orange'
    elCell.innerText = currcell.minesAroundCount
}