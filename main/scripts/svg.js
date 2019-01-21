var Colour = require('./colour');

/**
 * An Abstract prototype for SVG shapes
 * @param {Number} x
 * @param {Number} y
 */
var svgShape = function(x, y) {
    //Make it so that the svgShape class is abstract
    if (new.target === svgShape) {
        throw new TypeError("Cannot construct Abstract instance of svgShape directly");
    }

    //Ensure that all subclasses implement the generateSVGString method
    if (this.generateSVGString === undefined) {
        throw new TypeError("Must override generateSVGString method of the abstract class svgShape");
    }

    /**Ensure that all subclasses implement the getCordinatesOfBottomRight method
     * Used in working out weather to exand the size of the svgShape.
     */
    if (this.getCordinatesOfBottomRight === undefined) {
        throw new TypeError("Must override getCordinatesOfBottomRight method of the abstract class svgShape");
    }

    this.xPos = x;
    this.yPos = y;
    this.nameOf = "svgShape";
}

//Sub-class svgShape
class Rectangle extends svgShape {
    constructor (xPos = 0, yPos = 0, xLen = 10, yLen = 10) {
        super(xPos, yPos);
        this.xLen = xLen;
        this.yLen = yLen;
        this.fillColour = new Colour.colour(255,0,0);
        this.borderColour = new Colour.colour(255,255,255);
        this.borderWidth = 5;    
    }
}
//svgRectangle inherits from svgShape

Rectangle.prototype.generateSVGString = function() {
    return '<rect x=' + this.xPos + ' y=' + this.yPos + ' width=' + this.xLen + ' height=' + this.yLen
    + ' style="fill:' + this.fillColour.toHexString() + ' ;, stroke:' + this.borderColour.toHexString()
    + ';, stroke-width: ' + this.borderWidth + '"></rect>';
}

Rectangle.prototype.getCordinatesOfBottomRight = function() {
    return {
        xCord: this.xPos + this.xLen,
        yCord: this.yPos + this.yLen 
    }
}

/**
 * A Class used to store an array of SVG entities and generate them into valid DOM
 * @param {Number} _width 
 * @param {Number} _height 
 * @param {Boolean} overflows Controlls weather the SVG resizes to make sure that none of its elements overflow.
 */
var Maker = function(_width=500, _height=500, overflows=true) {
        this.footer = "</svg>"

        /**
         * @type {svgShape}
         */
        this.entities = [];

        this.width = _width;
        this.height = _height;

        this.overflows = overflows;

    }

Maker.prototype.generateHeader = function () {
    return "<svg version='1.1'"
                   + "baseProfile='full'"
                   + "width='" + this.width.toString() + "' height='" + this.height.toString() + "'"
                   + "xmlns=http://www.w3.org/2000/svg>";
}

Maker.prototype.addElement = function (element) {
        this.entities.push(element)
}

Maker.prototype.getImage = function() {
    let DOM = ''
    let MaxX = this.width
    let MaxY = this.height

    for (let i = 0; i < this.entities.length; i++) {
        if (typeof this.entities[i] == "string") {
            DOM += this.entities[i]
        } else if (this.entities[i].nameOf == "svgShape") {
            DOM += this.entities[i].generateSVGString();
        } else {
            throw new TypeError("Unknown object passed to Maker");       
        }
        
        if (this.overflows) {
            if (MaxX < this.entities[i].getCordinatesOfBottomRight().xCord) {
                MaxX = this.entities[i].getCordinatesOfBottomRight().xCord;
            }
            
            if (MaxY < this.entities[i].getCordinatesOfBottomRight().yCord) {
                MaxY = this.entities[i].getCordinatesOfBottomRight().yCord;
            }
        }
        this.width = MaxX;
        this.height = MaxY;
    };
    return (this.generateHeader() + DOM + this.footer);
}


module.exports = {Maker, Rectangle}