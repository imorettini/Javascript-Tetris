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

        this.context.canvas.width = COLUMNS * BLOCK_SIZE;
        this.context.canvas.height = ROWS * BLOCK_SIZE;
        this.context.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    reset() {
        this.grid = this.getEmptyGrid();
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
        this.drawBoard();
    }

    drop() {
        let p = moves[KEY.DOWN](this.piece);
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) {
                // Game over
                return false;
            }
            this.piece = this.next;
            this.piece.context = this.context;
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
        return true;
    }

    clearLines() {
        let lines = 0;

        this.grid.forEach((row, y) => {


            if (row.every(value => value > 0)) {
                lines++;
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLUMNS).fill(0));
            }
        });

        if (lines > 0) {
            account.score += this.getLinesClearedPoints(lines);
            account.lines += lines;
            if (account.lines >= LINES_PER_LEVEL) {
                account.level++;
                account.lines -= LINES_PER_LEVEL;
                time.level = LEVEL[account.level];
            }
        }
    }

    valid(p) {
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

    rotate(piece, direction) {
        let p = JSON.parse(JSON.stringify(piece));
        if (!piece.hardDropped) {
            for (let y = 0; y < p.shape.length; ++y) {
                for (let x = 0; x < y; ++x) {
                    [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
                }
            }
            if (direction === ROTATION.RIGHT) {
                p.shape.forEach(row => row.reverse());
            } else if (direction === ROTATION.LEFT) {
                p.shape.reverse();
            }
        }

        return p;
    }

    getLinesClearedPoints(lines, level) {
        const lineClearPoints =
            lines === 1 ?
            POINTS.SINGLE :
            lines === 2 ?
            POINTS.DOUBLE :
            lines === 3 ?
            POINTS.TRIPLE :
            lines === 4 ?
            POINTS.TETRIS :
            0;

        return (account.level + 1) * lineClearPoints;
    }
}