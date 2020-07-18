// código para iniciar o game e ativar as regras
const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

// Calcular o tamanho da tela a partir de constantes
context.canvas.width = COLUMNS * BLOCK_SIZE;
context.canvas.height = ROWS * BLOCK_SIZE;

//Medir os blocos nos eixos X e Y
context.scale(BLOCK_SIZE, BLOCK_SIZE);
/* Ao usar a escala, sempre podemos 
fornecer o tamanho dos blocos como um(1), em vez 
de ter que calcular com BLOCK_SIZE em qualquer lugar, 
o que simplifica nosso código. */

let board = new Board();

function play() {
    board.getEmptyBoard();
    let piece = new Piece(context);
    piece.draw();

    board.piece = piece;
}