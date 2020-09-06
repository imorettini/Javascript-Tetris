const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const contextNext = canvasNext.getContext('2d');

let accountValues = {
    score: 0,
    level: 0,
    lines: 0
};

function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

let requestId = null;
let time = null;

moves = {
    [KEY.LEFT]: (p) => ({...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => ({...p, x: p.x + 1 }),
    [KEY.DOWN]: (p) => ({...p, y: p.y + 1 }),
    [KEY.SPACE]: (p) => ({...p, y: p.y + 1 }),
    [KEY.UP]: (p) => board.rotate(p, ROTATION.RIGHT),
    [KEY.Q]: (p) => board.rotate(p, ROTATION.LEFT)
};

let board = new Board(context, contextNext);

initNext();

function initNext() {
    // Calculate size of canvas from constants.
    contextNext.canvas.width = 4 * BLOCK_SIZE;
    contextNext.canvas.height = 4 * BLOCK_SIZE;
    contextNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    if (event.keyCode === KEY.P) {
        pause();
    }
    if (event.keyCode === KEY.ESC) {
        gameOver();
    } else if (moves[event.keyCode]) {
        event.preventDefault();
        // Get new state
        let p = moves[event.keyCode](board.piece);
        if (event.keyCode === KEY.SPACE) {
            // Hard drop
            while (board.valid(p)) {
                account.score += POINTS.HARD_DROP;
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
            board.piece.hardDrop();
        } else if (board.valid(p)) {
            board.piece.move(p);
            if (event.keyCode === KEY.DOWN) {
                account.score += POINTS.SOFT_DROP;
            }
        }
    }
}

function resetGame() {
    account.score = 0;
    account.lines = 0;
    account.level = 0;
    board.reset();
    time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
}

function play() {
    addEventListener();
    resetGame();

    // If we have an old game running then cancel it
    if (requestId) {
        cancelAnimationFrame(requestId);
    }

    animate();
}

function animate(now = 0) {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }

    // Clear board before drawing new state.
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    board.draw();
    requestId = requestAnimationFrame(animate);
}

function gameOver() {
    cancelAnimationFrame(requestId);
    context.fillStyle = 'black';
    context.fillRect(1, 3, 8, 1.2);
    context.font = '1px Arial';
    context.fillStyle = 'red';
    context.fillText('GAME OVER', 1.8, 4);
}

function pause() {
    if (!requestId) {
        animate();
        return;
    }

    cancelAnimationFrame(requestId);
    requestId = null;

    context.fillStyle = 'black';
    context.fillRect(1, 3, 8, 1.2);
    context.font = '1px Arial';
    context.fillStyle = 'yellow';
    context.fillText('PAUSED', 3, 4);
}