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
        this.initAudio();

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

        this.preUpdateState(deltaTime);
        this.sortEntities();
        this.updateEntities(deltaTime);
        this.renderEntities();
        this.postUpdateState(deltaTime);
        this.postUpdateInput();
    }

    switchState(nextState)
    {
        this.nextState = nextState;
    }

    preUpdateState(deltaTime)
    {
        if (this.nextState !== undefined)
        {
            this.callStateFunction("exit", deltaTime);

            this.state = this.nextState;
            this.nextState = undefined;

            this.callStateFunction("enter", deltaTime);
        }

        this.callStateFunction("preUpdate", deltaTime);
    }

    postUpdateState(deltaTime)
    {
        this.callStateFunction("postUpdate", deltaTime);
    }

    callStateFunction(funcName)
    {
        if (this.state !== undefined && this.state[funcName] !== undefined)
        {
            // Pass along agruments (minus the function name param)
            var stateArgs = Array.from(arguments);
            stateArgs.shift();
            this.state[funcName].apply(this.state, stateArgs);
        }
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

    initAudio()
    {
        this.soundOn = true;

        this.notes =
        {
            "c": 16.35, "c#": 17.32, "d": 18.35, "d#": 19.45, "e": 20.60, "f": 21.83,
            "f#": 23.12, "g": 24.50, "g#": 25.96, "a": 27.50, "a#": 29.14, "b": 30.87,
        }

        window.addEventListener('click', () =>
        {
            this.createAudioContext();
        });
    }

    createAudioContext()
    {
        if (!this.audioCtx)
        {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        else
        {
            this.audioCtx.resume();
        }
    }

    playAudio(name, loop)
    {
        if (!this.soundOn || !this.audioCtx)
        {
            return;
        }

        this.getAsset(name).loop = loop !== undefined ? loop : false;
        this.getAsset(name).play();
    }

    stopAudio(name)
    {
        this.getAsset(name).pause();
        this.getAsset(name).currentTime = 0;
    }

    playNote(note, octave, length, delay, type)
    {
        if (!this.soundOn || !this.audioCtx)
        {
            return;
        }

        let oscillator = this.audioCtx.createOscillator();
        let noteFrequency = this.notes[note.toLowerCase()];
        if (octave !== undefined)
        {
            noteFrequency *= Math.pow(2, octave);
        }

        oscillator.type = type !== undefined ? type : "sine";
        oscillator.frequency.setValueAtTime(noteFrequency, this.audioCtx.currentTime);
        
        oscillator.connect(this.audioCtx.destination);
        oscillator.start(this.audioCtx.currentTime + (delay !== undefined ? delay : 0));
        oscillator.stop(this.audioCtx.currentTime + (delay !== undefined ? delay : 0) + (length !== undefined ? length : 0.2));
    }

    ///////////////////////////
    //-------- INPUT --------//
    ///////////////////////////

    initInput()
    {
        this.mousePos = {x: 0, y: 0};
        this.mouseDelta = {x: 0, y: 0};
        this.mouseButtons = {};
        this.mouseButtonsJustPressed = {};
        this.keys = {};
        this.keysJustPressed = {};

        window.addEventListener("mousemove", e =>
        {
            this.mouseDelta.x += e.movementX;
            this.mouseDelta.y += e.movementY;

            var rect = this.canvas.getBoundingClientRect();
            this.mousePos = {x: e.clientX - rect.left, y: e.clientY - rect.top};
        });

        window.addEventListener("mousedown", e => this.setMouseButtonState(e, true));
        window.addEventListener("mouseup", e => this.setMouseButtonState(e, false));
        window.addEventListener("contextmenu", e => e.preventDefault());

        window.addEventListener("keydown", e => this.setKeyState(e, true));
        window.addEventListener("keyup", e => this.setKeyState(e, false));
    }

    setMouseButtonState(event, isOn)
    {
        this.mouseButtonsJustPressed[event.button] = isOn && (this.mouseButtons[event.button] === false || this.mouseButtons[event.button] === undefined);
        this.mouseButtons[event.button] = isOn;
    }

    setKeyState(event, isOn)
    {
        let keyName = event.key.toLowerCase();
        this.keysJustPressed[keyName] = isOn && (this.keys[keyName] === false || this.keys[keyName] === undefined);
        this.keys[keyName] = isOn;
        
        // Hack: prevent arrow keys from scrolling the page
        if (keyName === "arrowup" || keyName === "arrowdown" || keyName === "arrowleft" || keyName === "arrowright")
        {
            event.preventDefault();
        }
    }

    postUpdateInput()
    {
        this.mouseDelta.x = 0.0;
        this.mouseDelta.y = 0.0;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;

        Object.keys(this.mouseButtonsJustPressed).forEach(key =>
        {
            this.mouseButtonsJustPressed[key] = false;
        });

        Object.keys(this.keysJustPressed).forEach(key =>
        {
            this.keysJustPressed[key] = false;
        });
    }
}