const axios = require('axios');
var poped = false;

//global settings
let mouse = {
    x: null,
    y: null,
    isDown: false,
    isClicked: false
};


let fontWidth;
let font;
let fontColor;
let fontOutline;
var textBoxes = [];
$("document").ready(()=>{
    axios.get("/memes")
    .then((res)=>{renderMeme(res.data);});
    /*fetch("http://localhost:5000/memes")
        .then((res)=> {return res.json();})
        .then((res)=>{renderMeme(res);});*/

    $("body").on("click", removePopUp);
    
});

const root = document.getElementById("root");


function removePopUp(){
    if(!poped){
        return;
    }
    else{
        
        const pop = document.getElementsByClassName("pop")[0];
       
        pop.parentNode.removeChild(pop);
        poped = false;
        return;
    }
}
global.removePopUp = removePopUp;

global.handleClick = function(name, textInfo, img){
    
    if(poped){
        const pop = document.getElementsByClassName("pop")[0];
        pop.parentNode.removeChild(pop);
        poped = false;
        return;
    }
    event.stopPropagation();
    root.innerHTML += 

        `<div class="pop card" >
        
            <canvas  class="pop-meme" id="canvas"></canvas>
            

            <div class="pop-title ml-3">
                <div class="cardTitle">
                    <h3 class="float-left">${name}</h3>
                </div>
                
                <div class="x-btn">
                    <img src="https://img.icons8.com/metro/26/000000/x.png" height="16px" onclick="removePopUp();">
                </div>    
                
            </div>
            <div class="pop-edit mr-3 ml-3" ">
            
                
                <div id="textBoxContainer"></div>
                
            </div>



            <div class="settings input-grid mr-3 ml-3 mb-3">
                <div class="btn-group buttons">
                        
                    <a class="btn btn-primary" id="download">Download</a>
                    <a class="btn btn-danger" id="addTextBox">Add Text Box</a>
                </div>
                <div class = "input-group  font-size-input ">
                    <div class="title"><h5>Font size</h5></div>
                    <input type="text" class = "form-control" value="64"><div class="input-group-append  mr-3"><span class="input-group-text px-add">px</span></div>
                </div>


                <div class="input-group  font-input">
                    <div class="title"><h5>Font</h5></div>
                    <input type="text" class="form-control " value="Impact">
    	            <div class="drop">  
                        <button class="drop_btn btn btn-primary btn-append mr-3"><span>Fonts</span></button>
                        <div class="drop-content card">
                            
                            <a class="font-selector">Comic Sans</a>
                            <hr>
                            <a class="font-selector">Impact</a>
                            <hr>
                            <a class="font-selector">Arial</a>
                            <hr>
                            <a class="font-selector">Helvetica</a>
                            <hr>
                            <a class="font-selector">Times New Roman</a>
                            <hr>
                            <a class="font-selector">Trebuchet MS</a>
                        </div>
                    </span>
                </div></div>
                

                <div class = "input-group  font-color ">
                    <div class="title"><h5>Font Color</h5></div>
                    <input type="text" class = "form-control color-input" value="white"><div class="badge color-badge mr-3 set-badge">Color</div>
                </div>

                <div class = "input-group  font-outline ">
                    <div class="title"><h5>Font Outline</h5></div>
                    <input type="text" class = "form-control outline-input" value="black"><div class="badge outline-badge mr-3 set-badge">Outline</div>
                </div>
            </div>

        </div>`;
   
    fontWidth = $(".font-size-input input").val();
    font = $(".font-input input").val();
    fontOutline = $(".font-outline input").val();
    fontColor = $(".font-color input").val();
    renderSettings();
    $(".pop").fadeIn();
    $(".pop").css("display", "grid");
    
    
    //stop
    $('.pop').click(function(event){
        event.stopPropagation();
    });
    //declare pop
    poped = true;
    
    canvasFunc(img, textInfo);
}

function renderTextBox(textInfo){
    let out = "";
    let container = document.getElementById("textBoxContainer");
    
    for(let i = 0; i<textInfo.length; i++){
        //console.log(container.children[i]);
        out = out.concat(`
        <div class="input-group mb-3">
            <input class="form-control ml-1 mr-1" type="text" id="textBox${i}" placeholder="Text"/>
        </div>
           `);
       
       
    }
    
   
    container.innerHTML = out;
}

let str;
function renderMeme(res){
    let refresh = ""
    let grid = document.getElementById("memeGrid");
    res.map(item => {
        str = "[";
        item.textInfo.map( element => {
            str += `{
            x: ${element.x},
            y: ${element.y},
            width: ${element.width},
            height: ${element.height}},`;
        });
    str = str.slice(0, str.length-1); 
    
    str+= "]";
        
        refresh += `<div class="containter-fluid card" onclick="handleClick('${item.name}' , ${str}, '${item.img}')" >
            <h3 class="card-title" >${item.name}</h3>
            <img src="./images/${item.img}" class= "card-img-bottom meme-img" >
        </div>`;
    });
    grid.innerHTML = refresh;
}

function canvasFunc(img, textInfo){
    
    var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
    let currentImage = new Image();
    currentImage.src = `/images/${img}`;
    let ratio = 1;
    if($(window).width() < 922){
        ratio = ($(window).width() - 70)/currentImage.width;
        
        currentImage.width *= ratio;
        currentImage.height *= ratio;
    }
    ctx.strokeStyle = fontOutline;
    function Square(x, y){
        this.x  = x;
        this.y = y;
        this.clicked = false;
        this.render = () => {
            
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(this.x, this.y, 20, 20);
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(this.x + 2.5, this.y + 2.5, 15, 15);
        };
    }
    
    function TextBox(x, y, width, height, input){
        this.x = x*ratio;
        this.y = y*ratio;
        this.height = height*ratio;
        this.width = width*ratio;
        this.style = "#000000";
        this.squares = [
            new Square(x, y),
            new Square(x, y + height),
            new Square(x + width, y + height),
            new Square(x + width, y)
        ];
        this.clicked = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.doRender = false;
        this.render = function(){
            if(!this.doRender){
                return;
            }

            
            
            this.squares.map((item) => item.render());

            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.beginPath();    
            ctx.moveTo(this.x + 10, this.y + 10);
            ctx.lineTo(this.x + 10, this.y + this.height + 10);
            ctx.lineTo(this.x + this.width + 10, this.y + this.height + 10);
            ctx.lineTo(this.x + this.width + 10, this.y + 10);
            ctx.lineTo(this.x + 10, this.y + 10);
            ctx.stroke();

            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.beginPath();
            
            let i = 0;
            ctx.moveTo(this.x + 10, this.y + 10);   
            while(i < this.height + 10){
                i += 10;
                ctx.lineTo(this.x + 10, this.y + i);
                i += 10;
                ctx.moveTo(this.x + 10, this.y + i);
            }
            ctx.moveTo(this.x + 10, this.y + this.height + 10);
            i = 0;
            while(i < this.width + 10){
                i += 10;
                ctx.lineTo(this.x + i, this.y + this.height + 10);
                i += 10;
                ctx.moveTo(this.x + i, this.y + this.height + 10);
            }
            ctx.moveTo(this.x + this.width +10, this.y + this.height + 10);
            i = 0;
            while(i < this.height - 10){
                i += 10;
                ctx.lineTo(this.x + this.width + 10, this.y + this.height - i + 10);
                i += 10;
                ctx.moveTo(this.x + this.width + 10, this.y + this.height - i + 10);
            }
            ctx.moveTo(this.x + this.width + 10, this.y + 10);
            i = 0;
            while(i < this.width - 10){
                i += 10;
                ctx.lineTo(this.x + this.width + 10 - i, this.y  + 10);
                i += 10;
                ctx.moveTo(this.x + this.width + 10 - i, this.y  + 10);
            }
            ctx.moveTo(this.x + 10, this.y + 10);
            
            ctx.stroke();
            
        };
        this.update = function(){
            
            
                
            if(!mouse.isDown){
                this.squares.map((item) => {
                    item.clicked = false;
                    
                });
                this.clicked = false;
            }
           
           
            if((mouse.x > this.x && mouse.x < this.x + 25) && (mouse.y > this.y && mouse.y < this.y + 25)){
                document.body.style.cursor = "nw-resize";
                if(mouse.isClicked){
                    this.squares[0].clicked = true;
                }

            }else if((mouse.x > this.x && mouse.x < this.x + 25) && (mouse.y > this.y+ this.height && mouse.y < this.y+ this.height + 25) ){
                document.body.style.cursor = "ne-resize";
                if(mouse.isClicked){
                    this.squares[1].clicked = true;
                }

            }else if((mouse.x > this.x + this.width && mouse.x < this.x + this.width + 25) && (mouse.y > this.y+ this.height && mouse.y < this.y+ this.height + 25)){
                document.body.style.cursor = "nw-resize";
                if(mouse.isClicked){
                    this.squares[2].clicked = true;
                }
                
            }else if((mouse.x > this.x + this.width && mouse.x < this.x + this.width + 25) && (mouse.y > this.y && mouse.y < this.y + 25) ){
                document.body.style.cursor = "ne-resize";
                if(mouse.isClicked){
                    this.squares[3].clicked = true;
                }
    
            }
            if((mouse.x > this.x + 7 && mouse.x < this.x + this.width + 7) && (mouse.y > this.y + 7 && mouse.y < this.y + this.height + 7) && !this.squares.some((item) => {return item.clicked;})){
                if(document.body.style.cursor == "default"){
                    document.body.style.cursor = "move";
                }
                if(mouse.isClicked){
                    this.clicked = true;
                    this.offsetX = mouse.x - this.x;
                    this.offsetY = mouse.y - this.y;
                }               
            }
            
            
            if(this.clicked){
                this.x = mouse.x - this.offsetX;
                this.y = mouse.y - this.offsetY;
            }
            if(this.squares[0].clicked){
              
                this.width -= mouse.x - this.x - 10;
                this.height -= mouse.y - this.y - 10;
                this.y = mouse.y - 10; 
                this.x = mouse.x - 10;
                
                
            }
            if(this.squares[1].clicked){
              
                this.width -= mouse.x - this.x - 10;
                this.x = mouse.x - 10;
                this.height = mouse.y - this.y - 10;
               
                
            }
            if(this.squares[2].clicked){
              
                this.width = mouse.x - this.x - 10;
                this.height = mouse.y - this.y - 10;
                
                
                
            }
            if(this.squares[3].clicked){
              
                this.width = mouse.x - this.x - 10;
                this.height -= mouse.y - this.y - 10;
                this.y = mouse.y - 10; 
               
                
            }
            this.squares[0].x = this.x;
            this.squares[0].y = this.y;
            this.squares[1].x = this.x;
            this.squares[1].y = this.y + this.height;
            this.squares[2].x = this.x + this.width;
            this.squares[2].y = this.y + this.height;
            this.squares[3].x = this.x + this.width;
            this.squares[3].y = this.y;
               
            
            ctx.font = `${fontWidth}px ${font}`;
            ctx.fillStyle = fontColor;
            ctx.strokeStyle = fontOutline;
            // ctx.strokeText(`${x} ${y}  ${width} ${height}`, x + width/2, y + height/2);
            
            let words = document.getElementById(input).value.split(" ");
            
            
            for(let j = 0; j < words.length; j++){
                if(words[j].length > parseInt(width/fontWidth)*2){
                    words.splice(j+1, 0, words[j].slice(parseInt(width/fontWidth)*2));
                    words[j] = words[j].slice(0, parseInt(width/fontWidth)*2);
                    
                }
                if(words[j + 1]){
                    if(words[j].length + words[j + 1].length < parseInt(width/fontWidth)*2){
                        words[j] = words[j] + " " +words[j + 1];
                        words.splice(j + 1, 1);
                        j--;
                    }
                }
            }
            
            
            
            for(let c = 0; c< words.length; c++){
                ctx.fillText(words[c]+ " ", this.x + this.width/2, this.y + (c+1)*fontWidth);
                ctx.strokeText(words[c] + " ",this.x + this.width/2, this.y + (c+1)*fontWidth);
                
            }
            
            
            
            this.render();
        };
    }
    
    
    canvas.width = currentImage.width;
    canvas.crossOrigin = "Anonymous";
    canvas.height = currentImage.height;
    
    ctx.textAlign = "center";

    mouseFunct();
   
    
    function loadAllTheBoxes(){
        
        let out = "";
        let container = document.getElementById("textBoxContainer");
        
        for(let i = 0; i<textInfo.length; i++){
            out = out.concat(`
            <div class="input-group mb-3">
                <input class="form-control ml-1 mr-1" type="text" id="textBox${i}" placeholder="Text" value="${
                    container.children[i].children[0].value
                }"/>
            </div>
            `);
        
        
        }
        textInfo.push({
            x: canvas.width/2 - 100,
            y: canvas.height/2 - 100,
            width: 100,
            height: 100
    
        });
        let lastIndex = textInfo.length - 1;
        out += `<div class="input-group mb-3">
                    <input class="form-control ml-1 mr-1" type="text" id="textBox${lastIndex}" placeholder="Text"/>
                </div>`;
        container.innerHTML = out;
        
        
        textBoxes.push(new TextBox(textInfo[lastIndex].x, textInfo[lastIndex].y, textInfo[lastIndex].width ,textInfo[lastIndex].height, `textBox${lastIndex}`));
        
        
        
        
        //renderTextBox(textInfo);
        
    }
    for(let i = 0; i < textInfo.length; i++){
                
        textBoxes.push(new TextBox(textInfo[i].x, textInfo[i].y, textInfo[i].width ,textInfo[i].height, `textBox${i}`));
    }
    renderTextBox(textInfo);
   
   document.getElementById("canvas").addEventListener("mouseover", function(){
        textBoxes.map((item) => {item.doRender = true;});
   });
   document.getElementById("canvas").addEventListener("mouseleave", function(){
    textBoxes.map((item) => {item.doRender = false;});
    });
    
    function animate(){
            
            document.body.style.cursor = "default";
            ctx.clearRect(0, 0, 300, 300);
            ctx.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height);
            textBoxes.map((item)=> item.update());
            if(!poped)return;
            requestAnimationFrame(animate);            
        
        }
    animate();
    document.getElementById("download").addEventListener("click", function(){
        
        
        downloadCanvas(this, "canvas", "meme.png");
    });


    function downloadCanvas(link, canvasId, filename) {
        
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    }
    document.getElementById("addTextBox").addEventListener("click", function(){

        
        loadAllTheBoxes();
    });
    
    
}


function renderSettings(){
    $(".drop_btn").on("click", ()=>{

        if( $(".drop-content").css("display") == "block"){
            $(".drop-content").css("display", "none");
            return;
        }
        $(".drop-content").css("display", "block");
        $(".drop-content").on("click", "a", function(){
            $(".font-input input").val(this.innerHTML);
            font = $(".font-input input").val();
        });
        
        return;
    });


    $(".color-badge").css("background", $(".font-color input").val());
    $(".outline-badge").css("background", $(".font-outline input").val());
    $(document).on("input", ".color-input", ()=>{
        $(".color-badge").css("background", $(".font-color input").val());
    });
    $(document).on("input", ".outline-input", ()=>{
        $(".outline-badge").css("background", $(".font-outline input").val());
    });
    $(document).on("input", ".font-size-input input", ()=>{
        fontWidth = $(".font-size-input input").val();
    });
    $(document).on("input", ".font-input input", ()=>{
        font = $(".font-input input").val();
        
    });
    $(document).on("input", ".font-color input", ()=>{
        fontColor = $(".font-color input").val();
        
    }); 
    $(document).on("input", ".font-outline input", ()=>{
        fontOutline = $(".font-outline input").val();
        
    });
   
}

function searchFunc(){
    
    let searchBar = document.getElementById("searchBar");
    /*fetch(`http://localhost:5000/memes/${searchBar.value}`)
        .then((res)=> {return res.json();})
        .then((res)=>{renderMeme(res);});*/
    axios.get(`/memes/${searchBar.value}`)
        .then((res)=>{renderMeme(res.data);})
        
}
global.searchFunc = searchFunc;

function preventFunc(e){
    e.preventDefault();
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
        
        return false;
    }
    
};
global.preventFunc = preventFunc;
function mouseFunct(){
    
    window.addEventListener("mousemove", function(event){ 
        if(poped){          
            getCursorPosition(canvas, event);
            mouse.isClicked = false;
        }
    });
    window.addEventListener("mousedown", function(event){ 
        if(poped){
            getCursorPosition(canvas, event);
            mouse.isDown = true;  
            mouse.isClicked = true;
    }
    });
    
    window.addEventListener("mouseup", function(event){
        if(poped){
            mouse.isDown = false;
            mouse.isClicked = false;

        }
        
    });
}
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    
}

