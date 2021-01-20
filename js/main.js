'use strict'

var gBoard = buildBoard(12, 30)

var gLevel = {
    SIZE: 4,
    MINES: 2
}

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
                isMarked: true
            }
        }
    }
    for (var i = 0; i < mineCount; i++) {
        board[getRandomInt(0, count)][getRandomInt(0, count)].isMine = true
    }
    return board
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var shown = (cell.isShown) ? 'class = shown' : null
            // var mine = (cell.isMine) ? 'class = "mine"' : null
            var mineX = (cell.isMine) ? 'X' : ''
            strHtml += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(this)" ${shown}></td>`
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}


function initGame() {
    renderBoard(gBoard)
}

function setMinesNegsCount(board, position) {
    var neighbors = []
    var mineNeighbors = []
    var count = 0
    var currCell = board[position.i][position.j]
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

            if (board[newPos.i][newPos.j].isMine) {
                count++
                mineNeighbors.push(board[newPos.i][newPos.j])
            }
        }
    }
    currCell.minesAroundCount = count
    return neighbors
}

function easy(){
    gBoard = buildBoard(4, 2)
    renderBoard(gBoard)
}

function medium(){
    gBoard = buildBoard(8, 12)
    renderBoard(gBoard)
}

function hard(){
    gBoard = buildBoard(12, 30)
    renderBoard(gBoard)
}


function cellClicked(elCell) {
    var posI = elCell.dataset.i
    var posJ = elCell.dataset.j

    var pos = {
        i: +posI,
        j: +posJ
    }
    if (elCell.isMine) checkGameOver(elCell)

    setMinesNegsCount(gBoard, pos)
    expandShown(elCell, pos, gBoard)
}

function expandShown(elCell, position, board) {
    var currcell = board[position.i][position.j]
    var neighbors = setMinesNegsCount(board, position)
    currcell.isShown = true
    elCell.classList.add('shown')

    if (currcell.isMine) {
        checkGameOver(elCell)

    } else if (!currcell.minesAroundCount) {
        currcell.isShown = true
        for (var i = 0; i < neighbors.length; i++) {
            neighbors[i].isShown = true
            renderBoard(gBoard)
        }
    } else {
        //update model
        currcell.isShown = true

        //update DOM

        //change nmbers color
        if (currcell.minesAroundCount === 1) elCell.style.color = 'blue'
        else if (currcell.minesAroundCount === 2) elCell.style.color = 'rgb(41, 160, 4)'
        else if (currcell.minesAroundCount === 3) elCell.style.color = 'red'
        else if (currcell.minesAroundCount === 4) elCell.style.color = 'purple'
        else if (currcell.minesAroundCount === 5) elCell.style.color = 'hotpink'
        else if (currcell.minesAroundCount === 6) elCell.style.color = 'hotpink'
        elCell.innerText = currcell.minesAroundCount
    }
}

function checkGameOver(elCell) {
    console.log('elCell:', elCell)
    elCell.classList.add('mine')
    elCell.classList.remove('shown')

    // for (var i = 0; i < gBoard.length; i++) {
    //     for (var j = 0; j < gBoard[i].length; j++) {
    //         var currCell = gBoard[i][j]

    // console.log('currCell:', currCell)
    // if (currCell.isMine) currCell.classList.add('mine')
    // console.log(gBoard[i][j])
    // }
    // }
    // renderBoard(gBoard)
    // elMines = document.querySelectorAll(.)
    // console.log(true)
    gGame.isOn = false
    // elCell.classList.add('mine')
    elCell.innerText = 'X'


    // if (cellClicked(elCell))
    //     console.log('cellClicked(elCell):', cellClicked(elCell))
}

function cellMarked(elCell) {


}