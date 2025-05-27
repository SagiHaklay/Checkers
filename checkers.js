const board = document.getElementById("board");
let isBlackTurn = false;

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
            //console.log(`div.row${row + 1}.col${col - 1}`);
            // const downLeft = document.querySelector(`.row${row + 1}.col${col - 1}`);
            // if (downLeft.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push({row: row + 1, col: col - 1});
        }
        if (col < 7) {
            // const downRight = document.querySelector(`.row${row + 1}.col${col + 1}`);
            // if (downRight.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push({row: row + 1, col: col + 1});
        }
    }
    if (row >= 1 && (!isBlack || isKing)) {
        if (col >= 1) {
            // const upLeft = document.querySelector(`.row${row - 1}.col${col - 1}`);
            // if (upLeft.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push({row: row - 1, col: col - 1});
        }
        if (col < 7) {
            // const upRight = document.querySelector(`.row${row - 1}.col${col + 1}`);
            // if (upRight.children.length === 0) {
            //     result.push(downLeft);
            // }
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
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const tile = document.createElement("div");
        tile.classList.add('tile');
        tile.classList.add('row' + i);
        tile.classList.add('col' + j);
        if (i % 2 !== j % 2) {
            // is black
            tile.classList.add('black-tile');
            //tile.id = `tile${i}${j}`;
            if (i < 3 || i > 4) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                if (i < 3) {
                    piece.classList.add('black-piece');
                } else {
                    piece.classList.add('white-piece');

                }
                
                tile.appendChild(piece);
            }
            tile.addEventListener('click', () => {
                if (tile.children.length > 0) {
                    const piece = tile.firstElementChild;
                    if (isPieceBlack(piece) !== isBlackTurn) return;
                    const prevTargets = document.querySelectorAll('.target-tile');
                    for (let target of prevTargets) {
                        target.classList.remove('target-tile');
                    }
                    if (tile.classList.contains('source-tile')) {
                        tile.classList.remove('source-tile');
                        
                    } else {
                        const prevSource = document.querySelector('.source-tile');
                        if (prevSource)
                            prevSource.classList.remove('source-tile');
                        tile.classList.add('source-tile');
                        
                        //const isPieceBlack = piece.classList.contains('black-piece');
                        const targets = getPossibleTargets(i, j, piece);
                        for (let target of targets) {
                            const targetTile = document.querySelector(`.row${target.row}.col${target.col}`);
                            if (targetTile.children.length === 0) {
                                targetTile.classList.add('target-tile');
                            } else {
                                //const isTargetPieceBlack = targetTile.firstElementChild.classList.contains('black-piece');
                                if (isPieceBlack(piece) !== isPieceBlack(targetTile.firstElementChild)) {
                                    const captureRow = target.row + (target.row - i);
                                    const captureCol = target.col + (target.col - j);
                                    if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8) {
                                        const captureTile = document.querySelector(`.row${captureRow}.col${captureCol}`);
                                        if (captureTile.children.length == 0) {
                                            captureTile.classList.add('target-tile');
                                            //targetTile.classList.add('captured');
                                            captureTile.classList.add('capture-tile');
                                        }
                                    }
                                    
                                }
                            }
                                
                        }
                    }
                    
                    
                } else {
                    if (tile.classList.contains('target-tile')) {
                        const sourceTile = document.querySelector('.source-tile');
                        const piece = sourceTile.firstElementChild;
                        sourceTile.removeChild(piece);
                        tile.appendChild(piece);
                        sourceTile.classList.remove('source-tile');
                        if (tile.classList.contains('capture-tile')) {
                            const srcPos = getPosition(sourceTile)
                            const capturedRow = i - (i - srcPos.row)/2;
                            const capturedCol = j - (j - srcPos.col)/2;
                            const captured = document.querySelector(`.row${capturedRow}.col${capturedCol}`);
                            captured.removeChild(captured.firstElementChild);
                        }
                        const prevTargets = document.querySelectorAll('.target-tile');
                        for (let target of prevTargets) {
                            target.classList.remove('target-tile');
                            if (target.classList.contains('capture-tile'))
                                target.classList.remove('capture-tile');
                        }
                        // const captured = document.querySelector('.captured');
                        // if (captured) {
                        //     captured.removeChild(captured.firstElementChild);
                        //     captured.classList.remove('captured');
                        // }
                        
                        if (!isPieceKing(piece)) {
                            if (isPieceBlack(piece)) {
                                if (i === 7) {
                                    makeKing(piece);
                                }
                            } else {
                                if (i === 0) {
                                    makeKing(piece);
                                }
                            }
                        }
                        // end turn
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
            });
        } else {
            // is white
            tile.classList.add('white-tile');
        }
        board.appendChild(tile);
    }
}
function playerHasPieces() {
    const playerPieces = document.querySelectorAll(isBlackTurn? '.black-piece' : '.white-piece');
    return playerPieces.length > 0;
}
function legalMoveExists() {
    const playerPieces = document.querySelectorAll(isBlackTurn? '.black-piece' : '.white-piece');
    //console.log(document.querySelector(`.row${1+1}.col${2-1}`).children);
    for (let playerPiece of playerPieces) {
        //const playerTile = playerPiece.parentElement;
        const pos = getPosition(playerPiece.parentElement);
        //console.log(playerPiece.parentElement);
        const possibleTargets = getPossibleTargets(pos.row, pos.col, playerPiece);
        for (let target of possibleTargets) {
            //console.log(target);
            const targetTile = document.querySelector(`.row${target.row}.col${target.col}`);
            if (targetTile.children.length === 0) {
                return true;
            } else {
                if (isPieceBlack(playerPiece) !== isPieceBlack(targetTile.firstElementChild)) {
                    const captureRow = target.row + (target.row - pos.row);
                    const captureCol = target.col + (target.col - pos.col);
                    if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8) {
                        const captureTile = document.querySelector(`.row${captureRow}.col${captureCol}`);
                        if (captureTile.children.length === 0) {
                            return true;
                        }
                    }
                }
            }
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

initModal('resignModal');
initModal('drawModal');
initModal('resultModal');
document.getElementById('resignButton').addEventListener('click', () => openModal('resignModal'));
document.getElementById('drawButton').addEventListener('click', () => openModal('drawModal'));
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