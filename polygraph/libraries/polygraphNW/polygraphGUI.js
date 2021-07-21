/// PolygraphGUI Module ///
///// Grano22 - Author ///

/*function renderGUIElement() {

}

function renderTextGUIElement(element, inputText) {
    try {
    if(typeof element!="object") throw new PolygraphGUIRenderParserException("Invaild type ginev in GUI element render parser given in argument 0, object required with instance of GUIElement");
    if(!(element instanceof GUIElement)) throw new PolygraphGUIRenderParserException("Cannot parse other instance than GUI Element");
    if(typeof inputText!="string") throw new PolygraphGUIRenderParserException("Cannot parse render view without text input in parser argument 1");
    let matchedChilds = result.match(/\@GUIChild.([0-9]*)/);
    } catch(PolygraphGUIRenderErrorHandler) {
        Polygraph.console.error(PolygraphGUIRenderErrorHandler.toConsoleString());
        return false;
    }
}*/

class GUIElement {
    constructor() {
        this.type = "unknown";
        this.childNodes = [];

        this.defaultRenderContext = document.createElement("gui-element");
    }
}

export class GUIButton extends GUIElement {
    constructor() {
        super();
        this.type = "button";
        //Events

    }

    addEventListener() {

    }

    remove() {

    }
}

export class GUIRange extends GUIElement {
    constructor() {
        super();
    }

    addEventListener() {

    }

    remove() {

    }
}

export class GUIInputField extends GUIElement {
    constructor() {
        super();
    }
}

export class GUICheckbox extends GUIElement {
    constructor() {
        super();
    }
}

export class GUIRadio extends GUIElement {
    constructor() {
        super();
    }
}

export class GUIForm extends GUIElement {
    constructor() {
        super();
    }
}