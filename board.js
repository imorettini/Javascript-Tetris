// lógica do board
class Board {
    context;
    contextNext;
    grid;
    piece;
    next;
    requestId;
    time;

    constructor(context, contextNext) {
        this.context = context;
        this.contextNext = contextNext;
        this.init();
    }

    init() {
        // Calcula o tamanho do quadro das constantes
        this.context.canvas.width = COLUMNS * BLOCK_SIZE;
        this.context.canvas.height = ROWS * BLOCK_SIZE;

        this.context.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    //Reseta o board quando inicia um novo jogo
    reset() {
        this.grid = this.getEmptyBoard();
        this.piece = new Piece(this.context);
        this.piece.setStartingPosition();
        this.getNewPiece();
    }

    getNewPiece() {
        this.next = new Piece(this.contextNext);
        this.contextNext.clearRect(
            0,
            0,
            this.contextNext.canvas.width,
            this.contextNext.canvas.height
        );
        this.next.draw();
    }

    draw() {
        this.piece.draw();
        this.piece.drawBoard();
    }

    drop() {

    }

    clearLines() {

    }

    valid(p) {
        board[p.y + y][p.x + x] === 0;
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    value === 0 ||
                    (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
                );
            });
        });
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });

    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.context.fillStyle = COLORS[value];
                    this.context.fillRect(x, y, 1, 1);
                }
            });
        });
    }
    getEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
    }
    insideWalls(x) {
        return x >= 0 && x < COLUMNS;
    }

    aboveFloor(y) {
        return y <= ROWS;
    }

    notOccupied(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    rotate(p) {
        let clone = JSON.parse(JSON.stringify(p));

        for (let y = 0; y < p.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
            }
        }

        p.shape.forEach(row => row.reverse());

        return clone;
    }

    getLinesClearedPoints(lines, level) {

    }

}