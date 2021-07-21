Polygraph.GUI = (function() {
    let _self = Object.create({});
    _self.elements = []; //Instanceof PolygraphGUIElementsRegistry
    Object.defineProperty(_self, "memory", { //Instanceof PolygraphGUIMemoryRegistry
        value:[]
    });

    return _self;
}());

class PolygraphGUIElement {
    constructor(name=undefined) {
        this.id = Polygraph.GUI.elements.length;
        this.name = typeof name!="undefined" ? name : "polygraphGUIElement"+this.id;
        Polygraph.GUI.elements.push(this);
    }

    remove() {
        let _self = this;
        Polygraph.GUI.elements.forEach((val, ind)=>{
            if(val==_self) Polygraph.GUI.elements.slice(ind, 1);
        });
    }

    store() {

    }

    show() {

    }

    hide() {

    }
}

const DefaultStyleObjectsTreeMenu = `#polygraohObjectTree {
    display: inline-block;
    background-color: #888;
    color: #333;

    position: fixed;
    left: 0; top:0;
    height: 100%;
}
#polygraphObjectTree.dark {
    background-color: #222;
    color: #888;

}
#polygraohObjectTree #header {
    width: 100%;
    background: #777;
    
}
#polygraohObjectTree #header h1 {
    font-weight: bolder;
    font-size: 28px;
    color: #444;
}
#polygraphObjectTree ul#objects {
    padding: 0;
    margin: 0;

}
#polygraphObjectTree ul#objects li { 
    padding: 20px;
}
#polygraphObjectTree ul#objects li:before, #polygraphObjectTree ul#objects li::before  { 
    font-family: "Font-awesome 5 Free";
}`;

class ObjectsTreeMenu extends PolygraphGUIElement {
    constructor(styles) {
        super();
        //Build a render of ObjectTreeMenu
        //Standard Stylesheet
        let standardStyle = document.createElement("style");
        standardStyle.type = "text/css";
        standardStyle.textContent = DefaultStyleObjectsTreeMenu;
        let el = document.createElement("div"), elHeader = document.createElement("div") ,inspector = document.createElement("ul");
        el.appendChild(standardStyle);
        el.id = "polygraphObjectTree";
        inspector.id = "objects";
        el.appendChild(inspector);
        elHeader.id = "polygraphObjectTreeHeader";
        
        this.element = el; 
        this.objects = [];
        
    }

    addItem(objectType, objectInstance) {
        if(objectType instanceof PolygraphGUIElement) {
            
        } else { console.error("TypeError, unknown type of Polygraph GUI Element"); }
    }

    removeItem(objectId) {

    }

    inspect() {

    }
}

class ObjectsTreeMenuElement {
    constructor(TreeMenuContainer) {
        if(TreeMenuContainer instanceof ObjectsTreeMenu) {
            this.treeList = TreeMenuContainer;
            this.objects.push(this);
        }
    }


}

class RendererTreeMenuElement extends ObjectsTreeMenuElement {
    constructor(renderer) {
        this.type = "renderer";
        
    }
}

class FigureTreeMenuElement extends ObjectsTreeMenuElement {
    constructor() {
        this.type = "figure";


    }


}