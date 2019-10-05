let poped = false;

//global settings

let fontWidth;
let font;
let fontColor;
let fontOutline;
$("document").ready(()=>{
    fetch("http://localhost:5000/memes")
        .then((res)=> {return res.json();})
        .then((res)=>{renderMeme(res);});

    $("body").on("click", ()=>{
        if(!poped){
            return;
        }
        else{
            
            const pop = document.getElementsByClassName("pop")[0];
           
            pop.parentNode.removeChild(pop);
            poped = false;
            return;
        }
    });
    
});

const root = document.getElementById("root");
const grid = document.getElementById("memeGrid");



function handleClick(name, textInfo, img){
    
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
            


            <div class="pop-edit mr-3 ml-3" ">
            
                <div class="cardTitle"><h3 class="float-left">${name}</h3></div>
                <div>${renderTextBox(textInfo)}</div>
                <div class="btn-group">
                    <button class="btn btn-primary reset btn-warning">Reset</button>
                    <button class="btn btn-primary enter">Enter</button>
                    <a class="btn btn-danger" id="download">Download</a>
                </div>
            </div>



            <div class="settings input-grid mr-3 ml-3 mb-3">
                
                <div class = "input-group  font-size-input ">
                    <div class="title"><h5>Font size</h5></div>
                    <input type="text" class = "form-control" value="64"><div class="input-group-append  mr-3"><span class="input-group-text px-add">pt</span></div>
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
    document.getElementById("download").addEventListener("click", function(){
        downloadCanvas(this, "canvas", "meme.png");
    });
    
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
    for(let i = 0; i<textInfo.length; i++){
        out = out.concat(`<div class="mb-3 textBoxGrid">
        <div class="input-group mb-3">
            <input class="form-control" type="text" id="textBox${i}" placeholder="Text"/>
        </div>
            <div class="coords">
                <div class="input-group">
                    <div class="inout-group-prepend">
                        <span class="input-group-text">x</span>
                    </div>
                    <input class="form-control" type="text" id="x${i}" value="${textInfo[i].x}"/>
                </div>
                <div class="input-group">
                    <div class="inout-group-prepend">
                        <span class="input-group-text">y</span>
                    </div>
                    <input class="form-control" type="text" id="y${i}" value="${textInfo[i].y}"/>
                </div>
                <div class="input-group">
                    <div class="inout-group-prepend">
                        <span class="input-group-text">width</span>
                    </div>
                    <input class="form-control" type="text" id="line${i}" value="${textInfo[i].lineWidth}"/>
                </div>
            </div>
        </div>`);
       
       
    }
    console.log(textInfo);
   
    return out;
}

let str;
function renderMeme(res){
    
    res.map(item => {
        str = "[";
        item.textInfo.map( element => {
            str += `{
            x: ${element.x},
            y: ${element.y},
            lineWidth: ${element.lineWidth}},`;
        });
    str = str.slice(0, str.length-1); 
    
    str+= "]";
    
        grid.innerHTML += `<div class="containter-fluid card" onclick="handleClick('${item.name}' , ${str}, '${item.img}')" >
            <h3 class="card-title" >${item.name}</h3>
            <img src="./images/${item.img}" class= "card-img-bottom meme-img" id="${item.name}">
        </div>`;
    });

}

function canvasFunc(img, textInfo){
    var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
    let currentImage = new Image();
    currentImage.src = `/images/${img}`;
    $(".reset").on("click", ()=>{
        ctx.drawImage(currentImage, 0, 0);
    });

    canvas.width = currentImage.width;
    canvas.crossOrigin = "Anonymous";
    canvas.height = currentImage.height;
    ctx.drawImage(currentImage, 0, 0);
    ctx.textAlign = "center";
    let text;
    
    for(let i =0; i< textInfo.length; i++){
        
        $("#textBox"+i).on('keypress', function(e){
            if(e.which != 13)return;
            ctx.font = `${fontWidth}pt ${font}`;
            ctx.fillStyle = fontColor;
            ctx.strokeStyle = fontOutline;
            
            text = [$(this).val()];
            while(text[text.length - 1].length > parseInt($(`#line${i}`).val()/fontWidth)){
                var exess = text[text.length - 1].slice(parseInt($(`#line${i}`).val()/fontWidth));
                text[text.length - 1] = text[text.length - 1].slice(0, parseInt($(`#line${i}`).val()/fontWidth));
                text.push(exess);
            }
            
            //refill text
            
            for(let c = 0; c< text.length; c++){
                ctx.fillText(text[c],parseInt( $(`#x${i}`).val()), parseInt($(`#y${i}`).val()) + c*fontWidth);
                ctx.strokeText(text[c],parseInt( $(`#x${i}`).val()), parseInt($(`#y${i}`).val()) + c*fontWidth);
                ctx.fill();
                ctx.stroke();
            }
        });}

    
    $(".enter").on("click", function(){
       
        ctx.font = `${fontWidth}pt ${font}`;
        ctx.fillStyle = fontColor;
        ctx.strokeStyle = fontOutline;
        //redraw image
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        //ctx.drawImage(currentImage , 0, 0, 290, 230);
        //break text
        for(let i=0; i< textInfo.length; i++){
           
            text =[ $(`#textBox${i}`).val()];
        
            while(text[text.length - 1].length > parseInt($(`#line${i}`).val()/fontWidth)){
                var exess = text[text.length - 1].slice(parseInt($(`#line${i}`).val()/fontWidth));
                text[text.length - 1] = text[text.length - 1].slice(0, parseInt($(`#line${i}`).val()/fontWidth));
                text.push(exess);
            }
            for(let c = 0; c< text.length; c++){
                console.log($(`#y${i}`).val());
                ctx.fillText(text[c], parseInt($(`#x${i}`).val()), parseInt($(`#y${i}`).val()) + c*fontWidth);
                ctx.strokeText(text[c], parseInt($(`#x${i}`).val()), parseInt($(`#y${i}`).val()) + c*fontWidth);
                ctx.fill();
                ctx.stroke();}
        }
        
        
        
       
       
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

function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
