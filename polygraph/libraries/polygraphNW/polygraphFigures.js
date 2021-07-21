//Figures
export class Figure extends EngineObject {
    constructor() {
        this.type = "figure";
    }
}

export class Rect extends Figure {
	constructor(posx, posy, width, height) {
		super();
		this.x = posx;
		this.y = posy;
		this.width = width;
		this.height = height;
	}

	calcArea() {
		return this.width*this.height;
    }
    
    calcCircuit() {
        return 2 * this.width + 2 * this.height;
    }

	calcDiagonal() {
		return Math.sqrt(Math.pow(this.width) + Math.pow(this.height));
	}
}

export class Squere extends Rect {
	constructor(posx, posy, width) {
        super();
        this.x = posx;
        this.y = posy;
        this.width = width;
    }
    
    calcArea() {
        return Math.pow(this.width, 2);
    }

    calcCircuit() {
        return 4 * this.width;
    }

	calcDiagonal() {
		return Math.sqrt(2) * this.width;
	}
}

export class Circle extends Figure {
	constructor(radius, angle=360) {
        super();
        this.radius = radius;
        this.angle = angle;
    }
    
    calcArea() {
        return Math.PI * Math.pow(this.radius, 2);
    }

    calcCircuit() {
        return 2 * Math.PI * this.radius;
    }
}

export class Ellipse extends Figure {
    constructor() {
        super();
    }
}

export class Line {
	constructor(posx, posy, from, to) {
		this.x = posx;
		this.y = posy;
		this.from = from;
		this.to = to;
	}

	calcLinearFn() {
		return this.from * this.x + this.to; //y=ax+b 
	}
}

export class Parallelogram extends Figure {
    constructor(posx, posy, width, height) {

    }

    calcArea() {

    }

    calcCircuit() {

    }

    calcDiagonal() {

    }
}

export class Deltoid extends Figure {
    constructor() {

    }
}

export class Rhombus extends Figure {
    constructor() {
        
    }
}

export class Polygon extends Figure {
    constructor(anglecount, radius) {

    }
}

//Text
export class TextDecor {

}

export class Drawable {

}

//Sprites
export class Sprite2D {
    
}