var nr = require('./netrouter');
var b = require('./board');

/**
 * The class for routing a whole board
 * @param {Array<Array<Board.Cell>>} board 
 * @param {Array<Board.Net>} netList 
 */
BoardRouter = function (board, netList) {
    this.board = board;
    this.netList = netList;
}

/**
 * Creates a non routeable box
 * @param {Cell} cell1 The cell which defines one coner 
 * @param {Cell} cell2 The cell which defines one coner
 * @param {Boolean} borderOnly Do we allow routing with in the area 
 */
BoardRouter.prototype.createKeepOut = function(cell1, cell2, borderOnly = true) {
    //find the smaller of the cords so that we can itterate using a for loop
    if (cell1.x > cell2.x) {
        var bigX = cell1.x;
        var smallX = cell2.x;
    } else {
        var bigX = cell2.x;
        var smallX = cell1.x;
    }
    
    if (cell1.y > cell2.y) {
        var bigY = cell1.y;
        var smallY = cell2.y;
    } else {
        var bigY = cell2.y;
        var smallY = cell1.y;
    }

    if (borderOnly) {
        //Mark the horizontal walls as unrouteable
        for (let x = smallX + 1; x < bigX; x++) {
            this.board.markCordsAsUnrouteable(x,smallY)
            this.board.markCordsAsUnrouteable(x,bigY)
        }
        //Mark the verticle walls as unrouteable
        for (let y = smallY; y < bigY + 1; y++) {
            this.board.markCordsAsUnrouteable(smallX,y)
            this.board.markCordsAsUnrouteable(bigX,y)
        }
    } else {
        //Mark the whole areas as unrouteable
        for (let x = smallX; x < bigX; x++) {
            for (let y = smallY; y < bigY; y++) {
                this.board.markCordsAsUnrouteable(x,y)    
            }
        }
    }
}

/**
 * A function decide which order the nets are to be routed in
 */
BoardRouter.prototype.route = function() {
    let tracks = new Array;

    for (var i = 0; i < this.netList.length; i++) {
        let myNetRouter = new NetRouter(this.board, this.netList[i], 2);
        tracks.push(myNetRouter.route());
    }

    return tracks;
}


module.exports = {BoardRouter};
