var nr = require('./netrouter');
var br = require('./boardRouter')
var b = require('./board');
var svg = require('./svg'); 
var http = require('http');

console.log('Initalizing router');

var trackWidth = 10;

board = new b.Board(100,100);

let start1 = new b.Cell(70,10);
let end1 = new b.Cell(20,50);

net1 = new b.Net(start1, end1);

let start2 = new b.Cell(20,10);
let end2 = new b.Cell(70,70);

net2 = new b.Net(start2, end2);

netList = [net1, net2]

BR = new br.BoardRouter(board, netList);

console.log('Routing')

let tracks = BR.route();

console.log('Routed');
console.log('Begining draw');

var SvgMaker = new svg.Maker; 

for (var x = 0; x < board.width; x++) {
    for (var y = 0; y < board.height; y++) {
        if (!board.grid[x][y].routeable) {
            let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
            Rect.fillColour = new svg.Colour(0,255,255);
            SvgMaker.addElement(Rect); 
        }
    }
}

console.log('Built non routeable sections');

//Note to future me work out why this needs to be implemented like this.
for (var track = 0; track < tracks.length; track++) {
    for (var cell = 0; cell < tracks[track].length; cell++) {
        let x = tracks[track][cell].x;
        let y = tracks[track][cell].y;

        let Rect = new svg.Rectangle(x*trackWidth,y*trackWidth,trackWidth,trackWidth);
        SvgMaker.addElement(Rect);
    }
}

console.log('Built routes');
console.log('Attempting to create a server');

http.createServer(function (req, res) {
    console.log('responding to a call');

    res.write('<html><body>');
    
    res.write('<h1>Edwins PCB Auto-router</h1>');

    let DOM = SvgMaker.getImage();
    res.write(DOM);
    
    res.write('</body></html>');
    
    res.end();
    console.log('page loaded')
    
}).listen(1337);

console.log('server listening on port 1337');