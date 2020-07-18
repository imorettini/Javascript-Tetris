// lógica das peças
class Piece {
    x;
    y;
    color;
    shape;
    context;

    constructor(context) {
        this.context = context;
        this.spawn();
    }

    spawn() {
        this.color = 'blue';
        this.shape = [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
        ];

        //Posicionamento da peça no inicio
        this.x = 3;
        this.y = 0;

    }

    draw() {
        this.context.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.context.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });

    }
}