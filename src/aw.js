class Aw
{
    //////////////////////////
    //-------- CORE --------//
    //////////////////////////

    constructor(width, height, scale, assetList)
    {
        this.initDisplay(width, height, scale);
        this.initEntities();
        this.initInput();

        this.loadAssets(assetList);

        this.gameLoop(performance.now());
    }

    initDisplay(width, height, scale)
    {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.canvas.style.width = `${width * scale}px`;
        this.canvas.style.height = `${height * scale}px`;
        this.canvas.style.backgroundColor = "black";
        this.canvas.style["image-rendering"] = "pixelated";
        document.getElementById("game").appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    loadAssets(assetList)
    {
        this.assets = {};

        assetList.forEach(assetName =>
        {
            this.assets[assetName] = {};
            this.assets[assetName].loaded = false;

            if (assetName.endsWith(".png") || assetName.endsWith(".jpg"))
            {
                this.assets[assetName].data = new Image();
                this.assets[assetName].data.onload = () => this.assets[assetName].loaded = true;
                this.assets[assetName].data.src = assetName;
            }
            else if (assetName.endsWith(".wav") || assetName.endsWith(".mp3"))
            {
                this.assets[assetName].data = new Audio();
                //this.assets[assetName].data.addEventListener("load", () => this.assets[assetName].loaded = true, true);
                this.assets[assetName].data.src = assetName;
                this.assets[assetName].data.load();
                this.assets[assetName].loaded = true;
            }
            else
            {
                console.assert(false, `Unable to load ${assetName} - unknown type`);
            }
        });
    }

    isLoading()
    {
        return Object.keys(this.assets).length > 0 && Object.values(this.assets).every(asset => asset.loaded) == false;
    }

    getAsset(assetName)
    {
        console.assert(this.assets[assetName] !== undefined, `No asset loaded named '${assetName}'`);
        return this.assets[assetName].data;
    }

    gameLoop(curTime)
    {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        
        if (this.isLoading()) { return; }

        let deltaTime = Math.min((curTime - (this.lastTime || curTime)) / 1000.0, 0.2);  // Cap to 200ms (5fps)
        this.lastTime = curTime;

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.state !== undefined)
        {
            this.state(deltaTime);
        }

        this.sortEntities();
        this.updateEntities(deltaTime);
        this.renderEntities();

        this.postUpdateInput();
    }

    //////////////////////////
    //------ ENTITIES ------//
    //////////////////////////

    initEntities()
    {
        this.entities = [];
        this.entitiesNeedSorting = false;
        this.entitiesNeedRemoval = false;
    }

    addEntity(entity)
    {
        Object.defineProperty(entity, "z",
        {
            set: (value) =>
            {
                entity._z = value;
                this.entitiesNeedSorting = true;
            },
            get: () => { return entity._z; }
        });
        entity._z = this.entities.length > 0 ? this.entities[this.entities.length - 1].z + 1 : 0;

        this.entities.push(entity);
    }

    removeEntity(entity)
    {
        entity._remove = true;
        this.entitiesNeedRemoval = true;
    }

    updateEntities(deltaTime)
    {
        this.entities.forEach(entity =>
        {
            if (entity.update !== undefined) { entity.update(deltaTime); }
        });

        if (this.entitiesNeedRemoval)
        {
            this.entities = this.entities.filter(entity => entity._remove !== true);
            this.entitiesNeedRemoval = false;
        }
    }

    renderEntities()
    {
        this.entities.forEach(entity =>
        {
            if (entity.render !== undefined) { entity.render(); }
        });
    }

    sortEntities()
    {
        if (this.entitiesNeedSorting)
        {
            // Higher values update/render later than lower values
            this.entities.sort((entity1, entity2) => entity1.z - entity2.z);
            this.entitiesNeedSorting = false;
        }
    }

    clearAllEntities()
    {
        this.entities = [];
    }

    //////////////////////////
    //----- RENDERING ------//
    //////////////////////////

    drawSprite(params)
    {
        // Assumes name, x, and y are defined in params
        let image = this.getAsset(params.name);
        let angle = params.angle !== undefined ? params.angle : 0;
        let width = params.xScale !== undefined ? image.width * params.xScale : image.width;
        let height = params.yScale !== undefined ? image.height * params.yScale : image.height;

        this.ctx.save();
        this.ctx.translate(params.x, params.y);
        this.ctx.rotate(angle * Math.PI/180);
        this.ctx.drawImage(image, -width * 0.5, -height * 0.5, width, height);
        this.ctx.restore();
    }

    drawText(params)
    {
        // Assumes text, x, and y are defined in params
        let angle = params.angle !== undefined ? params.angle * Math.PI/180 : 0;
        let fontName = params.fontName !== undefined ? params.fontName : "Arial";
        let fontSize = params.fontSize !== undefined ? params.fontSize : 12;
        let fontStyle = params.fontStyle !== undefined ? params.fontStyle : "";
        let fillStyle = params.color !== undefined ? params.color : "#FFF";
        let textAlign = params.textAlign !== undefined ? params.textAlign.toLowerCase() : "left";
        let textBaseline = params.textBaseline !== undefined ? params.textBaseline.toLowerCase() : "bottom";

        this.ctx.save();
        this.ctx.translate(params.x, params.y);
        this.ctx.rotate(angle);
        this.ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(params.text, 0, 0);
        this.ctx.restore();
    }

    ///////////////////////////
    //-------- AUDIO --------//
    ///////////////////////////

    playAudio(name, loop)
    {
        this.getAsset(name).loop = loop !== undefined ? loop : false;
        this.getAsset(name).play();
    }

    stopAudio(name)
    {
        this.getAsset(name).pause();
        this.getAsset(name).currentTime = 0;
    }

    ///////////////////////////
    //-------- INPUT --------//
    ///////////////////////////

    initInput()
    {
        this.mousePos = {x: 0, y: 0};
        this.mouseDelta = {x: 0, y: 0};
        this.mouseLeftButton = false;
        this.mouseRightButton = false;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;

        window.addEventListener("mousemove", e =>
        {
            this.mouseDelta.x += e.movementX;
            this.mouseDelta.y += e.movementY;
            this.mousePos = {x: e.clientX, y: e.clientY};
        });

        window.addEventListener("mousedown", e =>
        {
            if (e.button === 0) { this.mouseLeftButton = true; this.mouseLeftButtonJustPressed = true; }
            else if (e.button === 2) { this.mouseRightButton = true; this.mouseRightButtonJustPressed = true; }
        });

        window.addEventListener("mouseup", e =>
        {
            if (e.button === 0) { this.mouseLeftButton = false; }
            else if (e.button === 2) { this.mouseRightButton = false; }
        });

        this.keyToName =
        {
            "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f", "g": "g", "h": "h", "i": "i",
            "j": "j", "k": "k", "l": "l", "m": "m", "n": "n", "o": "o", "p": "p", "q": "q", "r": "r",
            "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x", "y": "y", "z": "z",
            "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
            "arrowup": "up", "arrowdown": "down", "arrowleft": "left", "arrowright": "right", " ": "space", "escape": "escape",
            "control": "ctrl", "shift": "shift", "alt": "alt", "tab": "tab", "enter": "enter", "backspace": "backspace"
        };

        this.keys = {};
        this.keysJustPressed = {};
        Object.keys(this.keyToName).forEach(key => this.keys[key] = false);

        window.addEventListener("keydown", e =>
        {
            this.setKeyState(e, true);
        });

        window.addEventListener("keyup", e =>
        {
            this.setKeyState(e, false);
        });
    }

    setKeyState(event, isOn)
    {
        let keyCode = event.key.toLowerCase();
        if (this.keyToName[keyCode] !== undefined)
        {
            let keyName = this.keyToName[keyCode];
            this.keysJustPressed[keyName] = this.keys[keyName] === false || this.keys[keyName] === undefined;
            this.keys[keyName] = isOn;
            
            // Hack: prevent arrow keys from scrolling the page
            if (keyName === "up" || keyName === "down" || keyName === "left" || keyName === "right")
            {
                event.preventDefault();
            }
        }
    }

    postUpdateInput()
    {
        this.mouseDelta.x = 0.0;
        this.mouseDelta.y = 0.0;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;

        Object.keys(this.keysJustPressed).forEach(key =>
        {
            this.keysJustPressed[key] = false;
        });
    }
}