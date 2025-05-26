const board = document.getElementById("board");
let isBlackTurn = false;

function getPossibleTargets(row, col, isBlack, isKing) {
    let result = [];
    if (row < 7 && (isBlack || isKing)) {
        if (col >= 1) {
            //console.log(`div.row${row + 1}.col${col - 1}`);
            // const downLeft = document.querySelector(`.row${row + 1}.col${col - 1}`);
            // if (downLeft.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push(`div.row${row + 1}.col${col - 1}`);
        }
        if (col < 7) {
            // const downRight = document.querySelector(`.row${row + 1}.col${col + 1}`);
            // if (downRight.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push(`.row${row + 1}.col${col + 1}`);
        }
    }
    if (row >= 1 && (!isBlack || isKing)) {
        if (col >= 1) {
            // const upLeft = document.querySelector(`.row${row - 1}.col${col - 1}`);
            // if (upLeft.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push(`.row${row - 1}.col${col - 1}`);
        }
        if (col < 7) {
            // const upRight = document.querySelector(`.row${row - 1}.col${col + 1}`);
            // if (upRight.children.length === 0) {
            //     result.push(downLeft);
            // }
            result.push(`.row${row - 1}.col${col + 1}`);
        }
    }
    return result;
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
                        const piece = tile.firstElementChild;
                        const targets = getPossibleTargets(i, j, 
                            piece.classList.contains('black-piece'), piece.children.length > 0);
                        for (let target of targets) {
                            const targetTile = document.querySelector(target);
                            if (targetTile.children.length === 0) {
                                targetTile.classList.add('target-tile');

                            }
                                
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