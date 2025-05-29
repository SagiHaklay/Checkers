let isBlackTurn = false;
let isMultiCapture = false;
let multiCapturePiece = null;
let isGameOver = false;

function isPieceBlack(piece) {
    return piece.classList.contains('black-piece');
}
function isPieceKing(piece) {
    return piece.children.length > 0;
}
function makeKing(piece) {
    const crown = document.createElement('img');
    crown.src = './crown.png';
    piece.appendChild(crown);
}
function getPossibleTargets(row, col, piece) {
    let result = [];
    const isBlack = isPieceBlack(piece);
    const isKing = isPieceKing(piece);
    if (row < 7 && (isBlack || isKing)) {
        if (col >= 1) {
            
            result.push({row: row + 1, col: col - 1});
        }
        if (col < 7) {
            
            result.push({row: row + 1, col: col + 1});
        }
    }
    if (row >= 1 && (!isBlack || isKing)) {
        if (col >= 1) {
            
            result.push({row: row - 1, col: col - 1});
        }
        if (col < 7) {
            
            result.push({row: row - 1, col: col + 1});
        }
    }
    return result;
}
function getPosition(tile) {
    return {
        row: parseInt(tile.classList[1].charAt(3)),
        col: parseInt(tile.classList[2].charAt(3))
    };
}
function initBoard() {
    const board = document.getElementById("board");
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const tile = document.createElement("div");
            tile.classList.add('tile');
            tile.classList.add('row' + row);
            tile.classList.add('col' + col);
            if (row % 2 !== col % 2) {
                // is black
                tile.classList.add('black-tile');
                if (row < 3 || row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece');
                    if (row < 3) {
                        piece.classList.add('black-piece');
                    } else {
                        piece.classList.add('white-piece');
                    }
                    tile.appendChild(piece);
                }
                tile.addEventListener('click', () => {
                    if (isGameOver) return;
                    if (tile.children.length > 0) {
                        selectPiece(tile, row, col);
                        
                    } else {
                        if (tile.classList.contains('target-tile'))
                            makeMove(tile, row, col);
                    }
                });
            } else {
                // is white
                tile.classList.add('white-tile');
            }
            board.appendChild(tile);
        }
    }
}
function selectPiece(tile, row, col) {
    const piece = tile.firstElementChild;
    if (isPieceBlack(piece) !== isBlackTurn) return;
    if (isMultiCapture && piece !== multiCapturePiece) return;
    const prevTargets = document.querySelectorAll('.target-tile');
    for (let target of prevTargets) {
        target.classList.remove('target-tile');
        if (target.classList.contains('capture-tile'))
            target.classList.remove('capture-tile');
    }
    if (tile.classList.contains('source-tile')) {
        tile.classList.remove('source-tile');               
    } else {
        const prevSource = document.querySelector('.source-tile');
        if (prevSource)
            prevSource.classList.remove('source-tile');
        tile.classList.add('source-tile');              
        const legalTargets = getLegalTargetsWithCaptures(row, col, piece);
        if (!isMultiCapture) {
            for (let targetTile of legalTargets.legalTargetTiles) {
                targetTile.classList.add('target-tile');
            }
        }             
        for (let captureTile of legalTargets.captureTiles) {
            captureTile.classList.add('target-tile');
            captureTile.classList.add('capture-tile');
        }
    }
}
function makeMove(targetTile, row, col) {
    const sourceTile = document.querySelector('.source-tile');
    const piece = sourceTile.firstElementChild;
    const possibleCapture = findPossibleCapture();
    sourceTile.removeChild(piece);
    targetTile.appendChild(piece);
    sourceTile.classList.remove('source-tile');
    if (targetTile.classList.contains('capture-tile')) {
        capturePiece(sourceTile, row, col, piece);
    } else {            
        if (possibleCapture) {
            const captureTile = possibleCapture.parentElement;
            captureTile.removeChild(possibleCapture);
        }              
    }
    const prevTargets = document.querySelectorAll('.target-tile');
    for (let target of prevTargets) {
        target.classList.remove('target-tile');
        if (target.classList.contains('capture-tile'))
            target.classList.remove('capture-tile');
    }
    checkForKing(piece, row);           
    endTurn();              
}
function capturePiece(sourceTile, targetRow, targetCol, capturingPiece) {
    const srcPos = getPosition(sourceTile)
    const capturedRow = targetRow - (targetRow - srcPos.row)/2;
    const capturedCol = targetCol - (targetCol - srcPos.col)/2;
    const captured = document.querySelector(`.row${capturedRow}.col${capturedCol}`);
    captured.removeChild(captured.firstElementChild);               
    isMultiCapture = canPieceCapture(targetRow, targetCol, capturingPiece);
    multiCapturePiece = capturingPiece;
}
function checkForKing(piece, row) {
    if (!isPieceKing(piece)) {
        if (isPieceBlack(piece)) {
            if (row === 7) {
                makeKing(piece);
            }
        } else {
            if (row === 0) {
                makeKing(piece);
            }
        }
    }
}
function endTurn() {
    if (!isMultiCapture) {
        isBlackTurn = !isBlackTurn;
        const turnElement = document.getElementById('turnSpan');
        turnElement.innerHTML = isBlackTurn? 'Black' : 'White';

        // check victory condition
        if (!legalMoveExists()) {
            const winner = isBlackTurn? 'White' : 'Black';
            let victoryMessage = winner + ' wins!';
            if (playerHasPieces()) {
                const loser = isBlackTurn? 'Black' : 'White';
                victoryMessage = loser + ' has no legal moves. ' + victoryMessage;
            }
            endGame(victoryMessage);
        }
    }
}
function getLegalTargetsWithCaptures(row, col, piece) {
    let legalTargetTiles = [];
    let captureTiles = [];
    const possibleTargets = getPossibleTargets(row, col, piece);
    for (let targetPos of possibleTargets) {
        const targetTile = document.querySelector(`.row${targetPos.row}.col${targetPos.col}`);
        if (targetTile.children.length === 0) {
            legalTargetTiles.push(targetTile);
        } else {
            if (isPieceBlack(piece) !== isPieceBlack(targetTile.firstElementChild)) {
                const captureRow = targetPos.row + (targetPos.row - row);
                const captureCol = targetPos.col + (targetPos.col - col);
                if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8) {
                    const captureTile = document.querySelector(`.row${captureRow}.col${captureCol}`);
                    if (captureTile.children.length === 0) {
                        captureTiles.push(captureTile);
                    }
                }
            }
        }
    }
    return {
        legalTargetTiles: legalTargetTiles,
        captureTiles: captureTiles
    };
}
function isCaptureAvailable() {
    const captureTile = document.querySelector('.capture-tile');
    return captureTile != null;
}
function canPieceCapture(row, col, piece) {
    const legalTargets = getLegalTargetsWithCaptures(row, col, piece);
    return legalTargets.captureTiles.length > 0;
}
function findPossibleCapture() {
    const playerPieces = document.querySelectorAll(isBlackTurn? '.black-piece' : '.white-piece');
    for (let piece of playerPieces) {
        const pos = getPosition(piece.parentElement);
        if (canPieceCapture(pos.row, pos.col, piece)) {
            return piece;
        }
    }
    return null;
}
function playerHasPieces() {
    const playerPieces = document.querySelectorAll(isBlackTurn? '.black-piece' : '.white-piece');
    return playerPieces.length > 0;
}
function legalMoveExists() {
    const playerPieces = document.querySelectorAll(isBlackTurn? '.black-piece' : '.white-piece');
    for (let playerPiece of playerPieces) {
        const pos = getPosition(playerPiece.parentElement);
        const legalTargets = getLegalTargetsWithCaptures(pos.row, pos.col, playerPiece);
        if (legalTargets.legalTargetTiles.length > 0 || legalTargets.captureTiles.length > 0) {
            return true;
        }
    }

    return false;
}
function openModal(modalId) {
    let modal = document.getElementById(modalId);
    modal.classList.remove('none');
}
function closeModal(modalId) {
    let modal = document.getElementById(modalId);
    modal.classList.add('none');
}
function initModal(modalId) {
    let modal = document.getElementById(modalId);
    let modalBox = document.querySelector(`#${modalId} .modal-box`);
    modal.addEventListener('click', () => {
        closeModal(modalId);
    });
    modalBox.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}
function endGame(resultsMessage) {
    const resultModalBox = document.querySelector('#resultModal .modal-box');
    resultModalBox.innerHTML = resultsMessage;
    openModal('resultModal');
}

function initButtons() {
    const resignButton = document.getElementById('resignButton');
    resignButton.addEventListener('click', () => openModal('resignModal'));
    const drawButton = document.getElementById('drawButton');
    drawButton.addEventListener('click', () => openModal('drawModal'));
    document.getElementById('noResignButton').addEventListener('click', () => closeModal('resignModal'));
    document.getElementById('noDrawButton').addEventListener('click', () => closeModal('drawModal'));
    document.getElementById('yesResignButton').addEventListener('click', () => {
        closeModal('resignModal');
        endGame(isBlackTurn? 'White wins!' : 'Black wins!');
    });
    document.getElementById('yesDrawButton').addEventListener('click', () => {
        closeModal('drawModal');
        endGame('Draw!');
    });
    document.getElementById('resultModal').addEventListener('click', () => {
        resignButton.disabled = true;
        drawButton.disabled = true;
        isGameOver = true;
    });
}
initBoard();
initModal('resignModal');
initModal('drawModal');
initModal('resultModal');
initButtons();