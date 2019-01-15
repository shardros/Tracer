var http = require('http');
var fs = require('fs');

Colour = class {
    constructor (red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    toHexString() {
        /** Add the colour values up in decimal, shifting the bits for each colour value to the left then adding them together 
         *  The hex value is then converted to a string and the leading value is lost as it was just put there to absorb overflows
         */   
        return '#' + (0x10000 * this.red + 0x100 * this.green + this.blue + 0x1000000).toString(16).substr(1);
    }
}

svgShape = class {
    constructor(xPos, yPos) {
        //Make it so that the svgShape class is abstract
        if (new.target === svgShape) {
            throw new TypeError("Cannot construct Abstract instance of svgShape directly");
        }

        //Ensure that all subclasses implement the generateSVGString method
        if (this.generateSVGString === undefined) {
            throw new TypeError("Must override generateSVGString method of the abstract class svgShape");
        }

        this.xPos = xPos;
        this.yPos = yPos;

        this.nameOf = "svgShape";
    }
}

class svgRectange extends svgShape {
    constructor (xPos = 0, yPos = 0, xLen = 10, yLen = 10) {
        super(xPos,yPos);
        this.xLen = xLen;
        this.yLen = yLen;
        this.fillColour = new Colour(255,0,0);
        this.borderColour = new Colour(255,255,255);
        this.borderWidth = 5;

    }

    generateSVGString() {
        return '<rect x=' + this.xPos + ' y=' + this.yPos + ' width=' + this.xLen + ' height=' + this.yLen
        + ' style="fill:' + this.fillColour.toHexString() + ' ;, stroke:' + this.borderColour.toHexString()
        + ';, stroke-width: ' + this.borderWidth + '" />';
    }
}

svgMaker = class {
    /**
     * A Class used to store an array of SVG entities and generate them into valid DOM
     * @param {Number} _width 
     * @param {Number} _height 
     */
    constructor (_width="300", _height="200") {
        this.header = "<svg version='1.1'"
                   + "baseProfile='full'"
                   + "width='400' height='500'"
                   + "xmlns=http://www.w3.org/2000/svg>"
        this.footer = "</svg>"
        this.entities = [];
    }

    addElement(element) {
        this.entities.push(element)
    }

    getImage() {
        let DOM = ''
        for (let i = 0; i < this.entities.length; i++) {
            if (typeof this.entities[i] == "string") {
                DOM += this.entities[i]
            } else if (this.entities[i].nameOf == "svgShape") {
                DOM += this.entities[i].generateSVGString();
            } else {
                throw new TypeError("Unknown object passed to svgMaker");       
            }
        };
        return (this.header + DOM + this.footer);
    }
}


let mode = "http"

if (mode == "http") {
    http.createServer(function (req, res) {

        mySvgMaker = new svgMaker;
        res.write('<html><body>');
        myRect = new svgRectange(10,10,100,100);
        mySvgMaker.addElement(myRect);
        res.write(mySvgMaker.getImage());
        res.write('</body></html>');
        res.end();
        console.log('page loaded')
        
    }).listen(8080);
} else if (mode == "fs") {
    myRect = new svgRectange(10,10,100,100);
    mySvgMaker.addElement(myRect);

    fs.writeFile('route.svg', mySvgMaker.getImage(), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}


console.log('server listening on port 8080')

module.exports = {svgMaker}