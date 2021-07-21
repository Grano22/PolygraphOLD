//// Canvas Renderer - Polygraph Engine ///
/////// Author : Grano22 /////////////////
/////// Version : 0.11 //////////////////

//Renderers
//import {} from '';
export class CanvasRenderer extends Renderer {
    constructor(name, cwidth=300, cheight=300, options=null) {
        super(name, cwidth, cheight, options);
        this.container = document.createElement("div");
        this.container.id = "canvasContainer"+this.id;
        this.container.classList.add("polygraphRendererContainer");
        this.container.classList.add("canvasRendererContainer");

        this.generateCode = ``;
    }

    addLayer(layerType="shader") {
        let layer = null;
        if(layerType=="shader") layer = new CanvasShader(); else if(layerType=="GUI") layer = new CanvasGUI(); else return false;
        this.layers.push(layer);
        return true;
    }

    removeLayer(layerParamValue, layerParamType="name") {
        for(let layerEntry in this.layers) {
            if(this.layers[layerEntry][layerParamType]==layerParamValue) { this.layers = this.layers.slice(layerEntry, 1); return true; }
        }
        return false;
    }

    addTo(element) {
        if(element instanceof HTMLElement) element.appendChild(this.container);
        this.remove = ()=>{

        }
        this.addTo = undefined;
        return this;
    }
}

export class CanvasShader extends Shader {
    constructor(swidth=300, sheight=300) {
        this.shader = document.createElement("canvas");
        this.currentContext = this.container.getContext("2d") || null;
        this.shader.width = this.width;
		this.shader.height = this.height;
		
		//Animation
		this.currentAnimationRequest = null;

		this.generatedCode = ``;
	}
	
	addObject(type, data={}) {
		switch(type) {
			case "rect":
			data = Object.assign({x:0, y:0, width: 50, height:50, layer:0, options:{}}, data);
			return new CanvasRect(this, data.x, data.y, data.width, data.height, data.layer, data.options).add();
			break;
			case "circle":
			data = Object.assign({x:0, y:0, r:50, layer:0}, data);
			return new CanvasCircle(this, data.x, data.y, data.r, data.layer).add();
			break;
			case "line":
			data = Object.assign({x:0, y:0, r:50, layer:0}, data);
			return new CanvasLine(this, data.x, data.y, data.r, data.layer).add();
			break;
			case "triangle":
			data = Object.assign({x:0, y:0, width:50, height:50, layer:0}, data).add();
			break;
		}
	}
	
	store(context="current") {
		context = (context=="current") ? this.currentContext : contexts.get(this).renderers[context];
		context.save();
	}
	
	clear(context="current") {
		context = (context=="current") ? this.currentContext : contexts.get(this).renderers[context];
		context.clearRect(0, 0, this.container.width, this.container.height);
		this.container.width = 0;
		this.container.width = this.containerWidth;
	}

    refresh(context="current") {
		context = (context=="current") ? this.currentContext : contexts.get(this).renderers[context];
		context.save();
		/*context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, this.container.width, this.container.height);*/
		this.clear();
		context.restore();
	}
	
	destroy() {
		renderers.get(PolyGraph.Engine).all.slice(this.id, 1);
		renderers.get(PolyGraph.Engine).canvas.slice(this.id, 1);
		this.container.remove();
		PolyGraph.Engine.consoleLog("CanvasContextRenderer ID["+this.id+"] NAME["+this.name+"] was destroyed");
	}
}

export class CanvasGUI extends GUI {
    constructor() {
		super();
    }
}

export function inheritCanvasFigure(canvasFigure, renderer, layer=0) {
	this.layer = layer;	
	//Inheritance and relations between objects
	/*let allObjs = objects.get(renderer)["all"];
	canvasFigure.nextSibiling = null;
	canvasFigure.previousSibiling = allObjs.length<=0 ? null : allObjs[allObjs.length - 1];
	if(allObjs.length>0 && allObjs[allObjs.length - 1].nextSibling==null) allObjs[allObjs.length - 1].nextSibling = this;
	objects.get(renderer)["all"].push(canvasFigure);
	canvasFigure.add = ()=>{
		if(typeof layer!="undefined") layersr.get(renderer)["list"][layer].objects.push(canvasFigure);
		if(typeof canvasFigure.generateCode=="function") { let genCode = canvasFigure.generateCode({name:"this.currentContext"});
			generatedCode.get(renderer).current += genCode; 
			generatedCode.get(renderer).list.push(genCode);  //Assoc List
			generatedCode.get(renderer).last = genCode;
			generatedCode.get(renderer).previous.push(genCode);
			console.log(generatedCode.get(renderer));
		}
		return canvasFigure;
	}
	canvasFigure.remove = ()=>{
		
    }*/
    
}

//Figures
import { Rect, Squere, Ellipse } from 'polygraphFigures.js';

export class CanvasRect extends Rect {
	constructor(renderer,posx,posy,width,height,layer=0,options={}) {
		super(posx, posy, width, height);
		inheritCanvasFigure(this, renderer, layer);
		console.log(width, height, options.style);
		objects.get(renderer)["rect"].push(this);
		
		if(typeof options.style!=undefined) {
			for(let styleDef in options.style) {
				switch(styleDef) {
					case "background":
					case "lineColor":
					case "lineWidth":
					this[styleDef] = options.style[styleDef];
					break;
					default:
				}
			}
		}

		console.log(this);
		
		//if(typeof options.lineWidth!=undefined) this.lineWidth = options.lineWidth;
		
		
	}
	
	generateCode(renderer) {

		let cdt = `//@canvas-object-rect
		${renderer.name}.beginPath();`;
		if(typeof this.lineWidth!="undefined") cdt += `${renderer.name}.lineWidth = "${this.lineWidth}";`;
		if(typeof this.lineColor!="undefined") cdt += `${renderer.name}.strokeStyle = "${this.lineColor}";`; 
		if(typeof this.background!="undefined") { cdt += `${renderer.name}.fillStyle = "${this.background}";`; cdt += `${renderer.name}.fillRect(${this.x}, ${this.y}, ${this.width}, ${this.height});`; }
		cdt += `${renderer.name}.rect(${this.x}, ${this.y}, ${this.width}, ${this.height});
		${renderer.name}.stroke();
		//@canvas-end-object-rect`;
		return cdt;
	}
	
	
}

export class CanvasSquere extends Squere {
	constructor(posx, posy, size) {
		super(posx, posy, size);
		inheritCanvasFigure(this, renderer, layer);
		objects.get(renderer)["squere"].push(this)
	}

	generateCode(renderer) {
		let cdt = `//@canvas-object-rect
		${renderer.name}.beginPath();`;
		if(typeof this.lineWidth!="undefined") cdt += `${renderer.name}.lineWidth = "${this.lineWidth}";`;
		if(typeof this.lineColor!="undefined") cdt += `${renderer.name}.strokeStyle = "${this.lineColor}";`; 
		if(typeof this.background!="undefined") { cdt += `${renderer.name}.fillStyle = "${this.background}";`; cdt += `${renderer.name}.fillRect(${this.x}, ${this.y}, ${this.width}, ${this.height});`; }
		cdt += `${renderer.name}.rect(${this.x}, ${this.y}, ${this.width}, ${this.height});
		${renderer.name}.stroke();
		//@canvas-end-object-rect`;
		return cdt;
	}
}

export class CanvasCircle extends Circle {
	constructor(renderer, posx, posy, radius, layer=0) {
		super(posx, posy, radius);
		inheritCanvasFigure(this, renderer, layer);
		objects.get(renderer)["circle"].push(this);
	}
	
	generateCode() {
		let cdt = `//@canvas-object-circle
		${renderer.name}.beginPath();`;
		if(typeof this.lineWidth!="undefined") cdt += `${renderer.name}.lineWidth = "${this.lineWidth}";`;
		if(typeof this.lineColor!="undefined") cdt += `${renderer.name}.strokeStyle = "${this.lineColor}";`; 
		if(typeof this.background!="undefined") { cdt += `${renderer.name}.fillStyle = "${this.background}";`; cdt += `${renderer.name}.fillRect(${this.x}, ${this.y}, ${this.width}, ${this.height});`; }
		cdt += `${renderer.name}.arc(${this.x}, ${this.y}, ${this.radius}, Math.PI*2);
		${renderer.name}.stroke();
		//@canvas-end-object-circle
		`;
		return cdt;
	}
	
	calcArea() {
		return Math.PI * Math.pow(this.radius, 2);
	}
	
	exportSVG() {
		
	}
}

export class CanvasLine extends Line {
	constructor(renderer, posx, posy, from, to, layer=0) {
		super(posx, posy, from, to);
		inheritCanvasFigure(this, renderer, layer);
		objects.get(renderer)["line"].push(this);

	}
	
	generateCode() {
		return `
		//@canvas-object-line
		${renderer.name}.beginPath();
		${renderer.name}.moveTo(${this.x}, ${this.y});
		${renderer.name}.lineTo(${this.from}, ${this.to});
		${rebderer.name}.stroke();
		//@end-canvas-object-line
		`;
	}
}

export class CanvasEllispe extends Ellipse {
	constructor() {
		
	}
}