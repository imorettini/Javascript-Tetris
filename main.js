// código para iniciar o game e ativar as regras
const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

// Calcular o tamanho da tela a partir de constantes
context.canvas.width = COLUMNS * BLOCK_SIZE;
context.canvas.height = ROWS * BLOCK_SIZE;

//Medir os blocos nos eixos X e Y
context.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board();

moves = {


    [KEY.LEFT]: p => ({...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({...p, x: p.x + 1 }),
    [KEY.DOWN]: p => ({...p, y: p.y + 1 }),
    [KEY.SPACE]: p => ({...p, y: p.y + 1 })

};

function play() {
    addEventListener();
    board.getEmptyBoard();
    let piece = new Piece(context);
    animate();
    board.piece = piece;

}

function addEventListener() {
    document.addEventListener('keydown', event => {
        if (moves[event.keyCode]) {
            event.preventDefault();

            let p = moves[event.keyCode](board.piece);

            if (board.valid(p)) {
                board.piece.move(p);

                context.clearRect(0, 0, context.canvas.width, context.canvas.height);

                board.piece.draw();
            }

            if (event.KeyCode === KEY.SPACE) {
                while (board.valid(p)) {
                    board.piece.move(p);
                    p = moves[KEY.DOWN](board.piece);
                }
            }
        }
    });
}

function animate(now = 0) {
    time = { start: 0, elapsed: 0, level: 1000 };
    time.elapsed = now - time.start;

    if (time.elapsed > time.level) {
        time.start = now;

        this.drop();
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    board.draw();
    requestId = requestAnimationFrame(animate);
}