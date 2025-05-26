let board = document.getElementById("board");
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const tile = document.createElement("div");
        tile.classList.add('tile');
        
        if (i % 2 !== j % 2) {
            // is black
            tile.classList.add('black-tile');
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
