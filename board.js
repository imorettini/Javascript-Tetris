// lógica do board
class Board {
    grid;


    //Reseta o board quando inicia um novo jogo
    reset() {
        this.grid = this.getEmptyBoard();
    }

    //Preencher matriz com zeros
    getEmptyBoard() {
        return Array.from({ length: rows }, () => Array(columns).fill(0));
    }
}