

const vc = 100;
const size = 3;
const d = 2;
var board = BoardInit(size);;//ban co	
function BoardInit(l) {
    var b = [];
    for (let i = 0; i < l; i++) {
        b.push([]);
        for (let j = 0; j < l; j++) {
            b[i][j] = 0;
        }
    }
    return b;
}
//dem so duong co the thang cua player
function NumPathsWin(player) {
    var s, i, j;
    s = 0;
    //dem so hang co the thang
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++)
            if (board[i][j] == 3 - player) break;
        if (j == size) s++;
    }
    //dem so cot co the thang
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++)
            if (board[i][j] == 3 - player) break;
        if (i == size) s++;
    }
    //duong cheo chinh co the thang
    for (i = 0; i < size; i++)
        if (board[i][i] == 3 - player) break;
    if (i == size) s++;
    //duong cheo phu co the thang
    for (i = 0; i < size; i++)
        if (board[i][size - 1 - i] == 3 - player) break;
    if (i == size) s++;
    return s;
}
function h() {
    return NumPathsWin(1) - NumPathsWin(2);
}

function Win(player) {
    var i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++)
            if (board[i][j] != player) break;
        if (j == size) return 1;
    }
    for (j = 0; j < size; j++) {
        for (i = 0; i < size; i++)
            if (board[i][j] != player) break;
        if (i == size) return 1;
    }
    for (i = 0; i < size; i++)
        if (board[i][i] != player) break;
    if (i == size) return 1;
    for (i = 0; i < size; i++)
        if (board[i][size - 1 - i] != player) break;
    if (i == size) return 1;
    return 0;
}
function MaxValue(depth, alpha, beta) {
    if (Win(1)) return vc;
    if (Win(2)) return -vc;
    if (depth <= 0) return h();
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] == 0) {
                board[i][j] = 1;
                var val = MinValue(depth - 1, alpha, beta);
                board[i][j] = 0;
                if (val > alpha) alpha = val;
                if (alpha >= beta) return alpha;
            }
        }
    }
    return alpha;
}
function MinValue(depth, alpha, beta) {
    if (Win(1)) return vc;
    if (Win(2)) return -vc;
    if (depth <= 0) return h();
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] == 0) {
                board[i][j] = 2;
                var val = MaxValue(depth - 1, alpha, beta);
                board[i][j] = 0;
                if (val < beta) beta = val;
                if (alpha >= beta) return beta;
            }
        }
    }
    return beta;
}
function AlphaBeta(player, depth) {
    var val;
    var x, y;
    var alpha = -vc, beta = vc;
    if (player == 1) {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] == 0) {
                    board[i][j] = 1;
                    val = MinValue(depth, alpha, beta);
                    board[i][j] = 0;
                    if (val > alpha || (val == alpha) && (x === undefined && y === undefined)) { alpha = val; x = i; y = j; }
                }
            }
        }
    } else {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j] == 0) {
                    board[i][j] = 2;
                    val = MaxValue(depth, alpha, beta);
                    board[i][j] = 0;
                    if (val < beta || (val == alpha) && (x === undefined && y === undefined)) { beta = val; x = i; y = j; }
                }
            }
        }
    }
    // if (x===undefined && y===undefined) { x = i; y = j; }
    board[x][y] = player;
    document.getElementById(x + '-' + y).innerHTML = 'X';
}

function IsFullBoard() {
    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++)
            if (board[i][j] == 0) return 0;
    return 1;
}
function DrawBoard() {
    var container = document.getElementById('container');
    container.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            var d = document.createElement('div');
            var t = document.createTextNode('\n');
            d.appendChild(t);
            d.onclick = function () { PlayerClick(this, i, j); };
            d.id = i + '-' + j;
            container.appendChild(d);
        }
    }
}
DrawBoard();
var stop = 0;
function PlayerClick(event, x, y) {
    if (stop == 1 || board[x][y] != 0) return;

    event.innerHTML = 'O';
    board[x][y] = 2;

    if (Win(2)) { doMessageBox('player win'); stop = 1; return; }
    if (IsFullBoard() == 1) { doMessageBox('hoa`'); stop = 1; return; }
    AlphaBeta(1, d);
    if (Win(1)) { doMessageBox('bot win!'); stop = 1; return; }
    if (IsFullBoard() == 1) { doMessageBox('hoa`'); stop = 1; return; }

}
function Start() {
    board = BoardInit(size);
    stop = 0;
    DrawBoard();
    if (document.querySelector('input[name=first]:checked').value == 'b')
        AlphaBeta(1, d);
}
