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
}