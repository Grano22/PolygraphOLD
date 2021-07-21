/*// Polygraph Engine 0.11
// Grano22
// Native Version */
///Polyfills
function microtime(parseAsFloat) {
    var now, multiplier;
    if(typeof performance !== 'undefined' && performance.now) {
        now = (performance.now() + performance.timing.navigationStart) / 1000;
        multiplier = 1e6; // 1,000,000 for microseconds
    }
    else {
        now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
        multiplier = 1e3; // 1,000
    }
    if(parseAsFloat) return now;
    var s = now | 0;
    return (Math.round((now - s) * multiplier ) / multiplier ) + ' ' + s;
}
function HostGetAbsolutePath(configDefaultPath) {
    var fpath = location.pathname || "";
    if(location.protocol.toLowerCase().indexOf("file")!=1) { if(typeof config=="string") fpath = location.href.substring(0, fpath.lastIndexOf(configDefaultPath)+1); else fpath = location.href.replace("file:", "").replace(/(\/\/|\/\/\/)/g, "").substring(0, fpath.lastIndexOf("/")+1); } else if(location.protocol.toLocaleLowerCase()=="http" || location.protocol.toLowerCase()=="https") fpath = "/";
    return fpath;
}
function HostGetAbsoluteAdress() {
    var fhost = location.href || "";
    if(location.protocol.toLowerCase().indexOf("file")!=-1) fhost = location.href.substring(0, fhost.lastIndexOf("/")+1); else if(location.protocol.toLowerCase()=="http" || location.protocol.toLowerCase()=="https") fhost = location.protocol+"//"+location.hostname+"/";
    return fhost;
}
////////////////////////////////////////////////////////////////////////
function PolygraphLoadModule(path, onld=null, options={}, onerr=null) {
    var nscript = document.createElement("script"), completePath = Polygraph.memory['engineScriptLocation']+path; //Polygraph.memory['document_root']
    nscript.setAttribute("type", "text/javascript");
    nscript.setAttribute("src", completePath);
    if(nscript.attachEvent) {
        nscript.attachEvent('onreadystatechange',function(evt) {
            if(nscript.readyState == 'complete' || nscript.readyState == 'loaded') {
                if(Polygraph.config.debug) Polygraph.console.log("Script "+completePath+" loaded successfully!"); if(onld!=null) onld();
            }
        });
    } else if(nscript.addEventListener) {
        nscript.addEventListener('load', function(evt) {
            if(Polygraph.config.debug) Polygraph.console.log("Script "+completePath+" loaded successfully!"); if(onld!=null) onld();
        }, false);
    } else {
        nscript.onload = function(evt) {
            if(Polygraph.config.debug) Polygraph.console.log("Script "+completePath+" loaded successfully!"); if(onld!=null) onld();
        }
    }
    if(nscript.addEventListener) {
        nscript.addEventListener("error", function(evt) {
            if(Polygraph.config.debug) Polygraph.console.error("Script "+completePath+" cannot be loaded"); if(onerr!=null) onerr();
        }, false);
    } else {
        nscript.onerror = function(evt) {
            if(Polygraph.config.debug) Polygraph.console.error("Script "+completePath+" cannot be loaded"); if(onerr!=null) onerr();
        }
    }
    document.head.appendChild(nscript);
}
//Error Basic And Rportings
class PolygraphException {
    constructor(reason="", exceptionType="unkown") {
        this.type = exceptionType;
        var dateConf = new Date().toJSON();
		this.datetime = dateConf.substring(0, 10);
		this.dayOfWeek = dateConf.substring(10, 11);
		this.time = dateConf.substring(12, 19);
        this.date = dateConf.substring(0, 10);
        this.reason = reason;
    }
    toConsoleString(enableFormating=false) {
        if(enableFormating) return "%cPolygraph["+this.date+" "+this.time+"]> %c"+this.content; else return "Polygraph["+this.date+" "+this.time+"]> "+this.content;
    }
}
Polygraph = (function() {
    var polygraphInitStart = microtime(true), _selfGlobal = Object.create(Object.prototype, {
        version:{
            value: 0.11,
            writable: false,
            configurable: false
        }
    });
    //Config
    var config = _selfGlobal.config = {
        buildMode: true,
        debug: true,
        experimental: true,
        /*modules:["BasicRenderer"],
        mainPath:""*/
    }
    _selfGlobal.memory = Object.create(Object.prototype, {
        document_root:{
            value:HostGetAbsolutePath(config.document_root),
            writable: false,
            configurable: false
        },
        hostUrl:{
            value:HostGetAbsoluteAdress(),
            writable:false,
            configurable:false
        },
        engineScript:{
            value:document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1],
            writable:false,
            configurable: false
        },
        engineScriptLocation:{
            value:document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1].src.substring(0, document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1].src.lastIndexOf("/")+1),
            writable:false,
            configurable:false
        }
    });
    //Console Initialisation
    class polygraphLogEntry {
        constructor(logtype, content) {
            this.type = logtype;
            var dateConf = new Date().toJSON();
            this.datetime = dateConf.substring(0, 10);
            this.dayOfWeek = dateConf.substring(10, 11);
            this.time = dateConf.substring(12, 19);
            this.date = dateConf.substring(0, 10);
            this.content = content;
            this.toString = function(enableFormating=false) {
                if(enableFormating) return "%cPolygraph["+this.date+" "+this.time+"]> %c"+this.content; else return "Polygraph["+this.date+" "+this.time+"]> "+this.content;
            }
        }
    }
    _selfGlobal.console = Object.create(Object.prototype, {
        logs:{
            value:[],
            writable: true,
            configurable: false
        },
        warns:{
            value:[],
            writable: true,
            configurable: false
        },
        errors:{
            value:[],
            writable: true,
            configurable: false
        },
        log:{
            value:function(content) {
            var re = new polygraphLogEntry("log", content); _selfGlobal.console.logs.push(re); if(config.debug) console.log(re.toString()); return re;
            }
        },
        warn:{
            value:function() {
            var re = new polygraphLogEntry("warn", content); _selfGlobal.console.warns.push(re); if(config.debug) console.log(re.toString()); return re;
            }
        },
        error:{
            value:function() {
            var re = new polygraphLogEntry("error", content); _selfGlobal.console.errors.push(re); if(config.debug) console.log(re.toString()); return re;
            }
        },
        print:{
            value:function(type) {
                switch(type) {
                    case "log":
                        for(let consoleEntry of _selfGlobal.console.logs) { console.log(consoleEntry.toString()); }
                    break;
                    case "warn":
                        for(let consoleEntry of _selfGlobal.console.warns) { console.warn(consoleEntry.toString()); }
                    break;
                    case "error":
                        for(let consoleEntry of _selfGlobal.console.errors) { console.error(consoleEntry.toString()); }
                    break;
                    case "*":
                    default:
                        for(let consoleEntry of _selfGlobal.console.logs) { console.log(consoleEntry.toString()); }
                        for(let consoleEntry of _selfGlobal.console.warns) { console.warn(consoleEntry.toString()); }
                        for(let consoleEntry of _selfGlobal.console.errors) { console.error(consoleEntry.toString()); }
                }
            }
        }
    });
    
    if(config.buildMode) console.log("Welcome to Polygraph 0.11 Native! Graphic Engine loaded in "+parseFloat(microtime(true) - polygraphInitStart)+"ms");
    return _selfGlobal;
}());
//Global Objects
class EngineObject {
    constructor(name, description, options=null) {
        this.name = name.replace(/(\n|\s)/g, "_");
        this.description = description;
        this.creationDate = new Date();
        this.type = "unknown";
        if(options!=null && Object.keys(options).length>0) {
            let allowedOptions = ["group", "tags", "visible", "permeable"];
            for(let optionName in options) {
                if(allowedOptions.includes(optionName)) this[optionName] = options[optionName];
            }
        }
    }
}
class EngineGroup {
    constructor(objects=undefined) {
        this.objects = [];
        if(Array.isArray(objects)) this.objects = objects; else if(typeof objects=="object") this.objects.push(objects);
    }
}
//Error Reporting
export class PolygraphGUIRenderParserException extends PolygraphException {
    constructor() {

    }
}
class RendererLayer {
    constructor() {
        //this.type = ["static", "loader", "stats"].includes(type) ? type : "static"; //"shader", "gui", 
        this.type = "static";
        this.events = {update:[], load:[]};

        this.lastRendered = null;

        //Events
        this.onLoad = null;
        this.onUpdate = null;
    }
    
    addEventListener(eventType, callback, async) { //load
        if(["update", "load"].includes(eventType)) {
            this.events[eventType].push({cb:callback,track:async});
        } else { Polygraph.console.error("Uknown event handler"); return false; }
    }
}
class Shader extends RendererLayer {
    constructor() {
        super("shader");
        this.type = "shader";

        //Configuration
        this.showFPS = true;
        this.showUsageCPU = false; //Only Beta
        this.showUsageGPU = false; //Only Beta
        this.showUsageRAM = false; //Only Beta
        //State
        this.timeStart = 0;
        this.paused = false;
        this.freezen = false;
        this.running = false;

    }

        start(callback=undefined, onloadcb=undefined) {
            if(!this.running) {
            var polygraphRequestAnimationFrame = function(cb, onerr) {
                //return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) { window.setInterval(cb, 1000/60); };
                let animReq = function(stmp) { let res = cb(stmp, stmt, polygraphRequestAnimationFrame); if(res && stmt==true) return res; else onerr(); };
                return window.requestAnimationFrame(animReq) || window.webkitRequestAnimationFrame(animReq) || window.mozRequestAnimationFrame(animReq) || window.oRequestAnimationFrame(animReq) || window.msRequestAnimationFrame(animReq) || window.setInterval(function() { let timestamp = Performance.now(); let res = cb(timestamp, stmt, polygraphRequestAnimationFrame); if(res && stmt==true) return res; else onerr(); }, 1000/60);
            }
            if(typeof callback=="undefined") { 
                return new Promise((resolve, reject)=>{
                    try {
                        /*this.currentAnimationRequest = polygraphRequestAnimationFrame(function() {
                            resolve();
                        });*/
                        this.currentAnimationRequest = polygraphRequestAnimationFrame(resolve, reject);
    
                    } catch(ShaderError) {
                        reject(ShaderError);
                    }
                });
            } else {
                try {
                if(typeof callback=="function") this.currentAnimationRequest = polygraphRequestAnimationFrame(callback); else return false;
                } catch(ShaderError) {
                    reject(ShaderError);
                }
            }
            }
            
        }
    
        stop() {
            var polygraphRquestCancelAnimationFrame = function(animationReqId) {
                return window.cancelAnimationFrame(animationReqId) || window.mozCancelAnimationFrame(animationReqId) || window.clearInterval(animationReqId);
            }
            return new Promise((resolve, reject)=>{
                if(this.running) {
                    polygraphRquestCancelAnimationFrame(this.currentAnimationRequest);
                    this.currentAnimationRequest = null;
    
                }
            });
        }


        addTo(RendererObject) {
            if(RendererObject instanceof Renderer) RendererObject.layers.push(this); else Polygraph.console.error("Cannot add Shader to non-renderer object");
            return this;
        }
    
	
}
class GUI extends RendererLayer {
    constructor(role) {
        super("GUI");
        this.type = "GUI";
        this.role = ["stats", "menu", "preview", "static"].includes(role) ? role : "static";

    }

    render(cb) {
        try {
        //Return Object or HTML string
        let result = cb() || {}, parsedResult = result;
        if(typeof result=="object") {

        } else if(typeof result=="string") {
            let matchedChilds = result.match(/\{\{([A-z]*)\}\}/).filter(v=>v!="");
            matchedChilds.forEach((val, ind)=>{
                let potind = val.replace(/(\{|\})/g, "");
                if(potind in this) parsedResult.replace(val, this[potind]);
                //matchedReplacement[ind] = this[val];
            });
            //parsedResult = result.
            //let matchedChilds = result.match(/\@GUIChild.([0-9]*)/);
                
            //Widzę to tak, ktoś jak chce niech idzie za mnie a jak nie to wysyłam jej że dla mnie matma ważniejsza 
        } else throw new PolygraphGUIRenderParserException("Cannot parse render view without text input in parser argument 1");
        this.lastRendered = parsedResult;
        return parsedResult;
        } catch(PolygraphGUIRenderErrorHandler) {
            Polygraph.console.error(PolygraphGUIRenderErrorHandler.toConsoleString());
            return '<span class="error">Cannot render content due error, look for details in console</span>';
        }
    }
}
class View extends RendererLayer {
    constructor() {

    }
}
class ObjectLayer {
    constructor(name, id=undefined, type="normal") {
        this.name = name;
        this.id = id;
        this.type = ["normal", "background", "buildin"].includes(type) ? type : "normal";
        this.objects = [];

    }

    addObjects(entries) {
        if(Array.isArray(entries)) {
            for(let oind in entries) {
                if(entries[oind] instanceof EngineObject) {
                    this.objects.push(entries[oind]);
                } else Polygraph.console.error(oind+" element of array must be and EngineObject");
            }
        } else if(entries instanceof EngineObject) {
            this.objects.push(entries);
        } else { Polygraph.console.error("Only EngineObject can be added to ObjectLayer"); return false; }
    }

    removeObjects(entires, entryType="id") {
        if(Array.isArray(entires)) {
            for(let oind in entries) {
                if(entries[oind] instanceof EngineObject) {
                    let specifer = null;
                    if(entryType!="id") {
                        for(let enob in this.objects) {
                            if(entryType in this.objects[enob] && this.objects[enob][entryType]==entries) specifer = enob; 
                        }
                    } else specifer = entries[oind];
                    this.objects.slice(specifer, 1);
                } else Polygraph.console.error(oind+" element of array must be and EngineObject");
            }
        } else if(entries instanceof EngineObject) {
            let specifer = null;
                if(entryType!="id") {
                    for(let enob in this.objects) {
                        if(entryType in this.objects[enob] && this.objects[enob][entryType]==entries) specifer = enob; 
                    }
                } else specifer = entries[oind];
            this.objects.slice(entires, 1);
        } else { Polygraph.console.error("Only EngineObject can be added to ObjectLayer"); return false; }
    }

    addToRenderer(renderer, index="last") {
        if(renderer instanceof EngineRenderer) {

        } else Polygraph.console.error("Given Renderer is not a type of EngineRenderer");
        return this;
    }

    remove() {

    }
}
class Renderer {
    constructor(name, cwidth=300, cheight=300, options=null) { //backgroundColor="black"
        this.layers = []; 
        this.width = cwidth;
        this.height = cheight;
        this.name = name;
        //if(typeof id!="undefined") this.id = id;
        this.id = document.getElementsByClassName("polygraphRendererContainer").length-1;
        if(typeof options=="object" && options!=null) {
            if(typeof options.style!="undefined") {
                let styleOptions = Object.assign({background:"", }, options.style);
            }
        }


    }

    setScreenSize(param="normal", restore=false) {
		if(restore) this.store();
		if(param!="fullscreen" && document.fullscreenElement) document.exitFullscreen();
		switch(param) {
			case "fullscreen":
				if(!document.fullscreenElement) {
					if(this.container.requestFullscreen) {
						this.container.requestFullscreen();
						/* .catch(err => {
							alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
						}); */
					} else if (this.container.msRequestFullscreen) {
						this.container.msRequestFullscreen();
					  } else if (this.container.mozRequestFullScreen) {
						this.container.mozRequestFullScreen();
					} else if (this.container.webkitRequestFullScreen) {
						this.container.webkitRequestFullScreen();
					}
				}
			break;
			case "filled":
				//if(this.container.hasAttribute("width")) this.container.removeAttribute("width");
				//if(this.container.hasAttribute("height")) this.container.removeAttribute("height");
				/*this.container.style.width = "100%";
				this.container.style.height = "100vh";*/
				this.container.style.position = "fixed";
				this.container.style.top = "0px";
				this.container.style.left = "0px";
				this.container.width = window.innerWidth;
				this.container.height = window.innerHeight;
			break;
			case "custom":
				this.container.width = arguments[2];
				this.container.height = arguments[3];
			break;
			case "nostyle":
				if(this.container.hasAttribute("style")) this.container.removeAttribute("style");
			break;
			case "normal":
			default:
				if(this.container.hasAttribute("style")) this.container.removeAttribute("style");
				this.container.width = this.containerWidth;
				this.container.height = this.containerHeight;
		}
		if(restore) this.currentContext.restore();
	}

    addLayers() {

    }

    removeLayers() {

    }
}
if(typeof Polygraph.config.modules!="undefined" && Polygraph.config.modules.length>0) {
    for(let pos of Polygraph.config.modules) {
        //var scr = document.createElement("script"); scr.type="text/javascript"; scr.src = (location.protocol.indexOf("file")!=-1 ? "" : location.protocol+"//"+location.hostname+"/")+"libraries/polygraphNative/polygraph"+pos+".js"; document.head.appendChild(scr);
        PolygraphLoadModule("polygraph"+pos+".js");
    }
}
