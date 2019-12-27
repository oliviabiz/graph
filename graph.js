/**
 * Still have to fix event listeners grabbing span instead - FIXED
 * implement Edge class
 * Fix eulerian
 * Add properties...
 * Prevent collision
 * Resize when crowded
 */
const canvas = document.querySelector('#my-canvas'); //parent of nodes
const c = canvas.getContext("2d");
const fontFam = [
    "#A8F8FF",
    "#90E8D3",
    "#B5FFD6",
    "#99E8A4",
    "#BCFFA8",
    "#7ECCBA" 
];
const nodeColor = fontFam[1];
const nodeColorTemp = fontFam[0];
const nodeColorTarget = fontFam[4];
const edgeColor = fontFam[3];
const btn = document.querySelector("#add-node");
const radius = 30;

//document.querySelector('html').style.background = fontFam[2];
btn.style.background = fontFam[5];
document.querySelectorAll('li,.list-item:not(span)').forEach(b => 
    {
        b.addEventListener('mouseover',
        e => {
        //    e.currentTarget.style.fontWeight = "bold";
            e.currentTarget.style.background = fontFam[3];
            e.currentTarget.style.color = "white";
     
        });
        b.addEventListener('mouseout', 
        e => {
            e.currentTarget.style.fontWeight = "normal";
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "black";
            e.currentTarget.children[0].style.display = "none";
        });
        b.addEventListener('click', 
        e => {
           // e.currentTarget.style.fontWeight = "bold"
            computeProperty(e);
            e.currentTarget.children[0].style.display = "inline";
        });
        b.addEventListener('mouseup', 
        e=> {
            e.currentTarget.children[0].style.display = "none";
        });
    });

var nodes = [];
var edges = [];
var selected;

canvas.width = window.innerWidth*0.55; //canvas.parentElement.innerWidth;
canvas.height = window.innerHeight* 0.7; //canvas.parentElement.innerHeight;
// const realWidth = 500/770;
// const realHeight = 300/485;

btn.addEventListener('click', addNode);
canvas.addEventListener('click', nodeAdder);
canvas.addEventListener('dblclick', edgeRemover);

function addNode(){
    let x = (Math.random() * (canvas.width - 2*radius)) + radius;
    let y = (Math.random() * (canvas.height - 2*radius)) + radius;
    let n = new Node(x,y);
    nodes.push(n);
    n.draw();
}

function addEdge(n1,n2){
    let edge = new Edge(n1,n2);

    edge.draw();
    n1.draw();
    n2.draw();
    edges.push(edge);
}

class Node{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.neighbours = [];
        this.edges = []; //might not need
        this.color = nodeColor;
        this.id = nodes.length;
    }

    addNeighbour(n2){
        this.neighbours.push(n2);
        n2.neighbours.push(this);
        return;
    }

    isNeighbour(n2){
        if(this.neighbours.includes(n2)){
            return true;
        }
        else{
            return false;
        }
    }
    draw(){
        // c.fillStyle = this.color;
        c.strokeStyle = "black";
        c.beginPath();
        c.arc(this.x,this.y,radius,0,2*Math.PI, true);
        c.fill();
        c.stroke();
        //inner shading
        c.beginPath();
        c.strokeStyle = 'white';
        c.arc(this.x,this.y,radius-4,Math.PI/3,0, true);
        c.stroke();
    }
}

class Edge{
    constructor(n1,n2){
        const nodes = [n1,n2];
        this.myNodes = nodes;
        n1.addNeighbour(n2);

        n1.edges.push(this);
        n2.edges.push(this);
    }

    draw(){
        let p1 = this.myNodes[0];
        let p2 = this.myNodes[1];

        let x1 = p1.x;
        let y1 = p1.y;

        let x2 = p2.x;
        let y2 = p2.y;

        c.strokeStyle = edgeColor;
        c.beginPath();
        c.lineWidth = 5;
        c.moveTo(x1,y1);
        c.lineTo(x2,y2);
        c.stroke();
        c.lineWidth = 1;
    }
}

function drawSquare(){
    // c.beginPath();
    // c.moveTo(this.x-radius,this.y-radius);
    // c.lineTo(this.x+radius, this.y-radius);
    // c.lineTo(this.x+radius,this.y+radius);
    // c.lineTo(this.x-radius,this.y+radius);
    // c.lineTo(this.x-radius,this.y-radius);
    // c.stroke();
}

function getClicked(e){
    // let x = realWidth*e.offsetX;
    // let y= realWidth*e.offsetY;
    let x = e.offsetX;
    let y= e.offsetY;

    for(let i=0; i<nodes.length; i++) {
        let n = nodes[i];
        let d = distance(n.x,n.y,x,y)
        if(d <= radius){
            return n;
        }
    }
    return undefined;
}

function nodeAdder(e){ 
    n = getClicked(e);
    if(n===undefined){
        return;
    }
    if(selected===undefined){
        console.log('clicked a node');
        selected = n;
        c.fillStyle = nodeColorTarget;
        n.draw();
        setTimeout(function(){
            if(nodes.length<=1 || n.neighbours.length===nodes.length-1){
                alert('Not enough available nodes.');
                colorClear();
                selected = undefined;
                return;
            }
            
            if(confirm("would you like to draw an edge?")){
                alert('select a neighbour');
                nodes.filter(node => (n!==node) && (!n.neighbours.includes(node))).forEach(node => {
                    c.fillStyle = nodeColorTemp;
                    node.draw();
                });
            }
            
            else{
                selected = undefined;
                colorClear();
            }
            return;
        }, 250);
    }
    else{
        colorClear();
        if(selected.neighbours.includes(n)){
            alert('already neighbours!');
            return;
        }
        addEdge(selected,n);
        selected = undefined;
        return;
    }
}

function distance(x1,y1,x2,y2){
    let xdist = x1-x2;
    let ydist = y1-y2;
    return Math.sqrt(Math.pow(xdist,2) + Math.pow(ydist,2));
}

function colorClear(){
    c.fillStyle = nodeColor;
    nodes.forEach((node) => {
        node.draw();
    });
}

function edgeRemover(e){
    n = getClicked(e);
    if(n===undefined){
        return;
    }
    console.log('we would like to remove edges');
}   

function isComplete(){
    for(let i=0; i<nodes.length; i++){
        for(let j=i+1; j<nodes.length; j++){
            if(!nodes[i].isNeighbour(nodes[j])){
                return false;
            }
        }
    }
    return true;
}

function computeProperty(e){
    var prop = e.currentTarget.innerText;
    var spanner = e.currentTarget.children[0];
    //console.log("prop: " + prop + " span: " + spanner.innerText);
    switch(prop){
        case "Completeness":
            spanner.innerHTML = ": " + ((isComplete())? "YES":"NO");
            break;
        case "Nodes":
            spanner.innerHTML = ": " + nodes.length;
            break;
        case "Edges":
            spanner.innerHTML = ": " + edges.length;
            break;
        case "Eulerian Path":
            spanner.innerText = ": " + ((eulerian())? "YES":"NO");
            break;
        case "Hamiltonian Cycle":
            hamiltonian();
            break;
        case "Connected Components":
            spanner.innerText = ": " + connectedComponents();
            break;
        default:
            console.log('help! {' + prop + '}');
            break;
    }
    // console.log(spanner);
}

//TODO: fix this
/**traverse every edge strictly once, can revisit nodes */
function eulerian(){
    nodes.forEach(n => {
        console.log(n.edges.length);
    });

    let oddDegrees = nodes.filter(n => (n.edges.length%2)==1).length;
    if(oddDegrees == 2 || oddDegrees == 0){
        return true;
    }
    else{
        return false;
    }
}

/**traverse every node once */
function hamiltonian(){
    console.log('hamiltonian');
    return false;
}


let visited = [];
function connectedComponents(){
//for all nodes univiisted, call dfs on it
    for(let i=0; i<nodes.length; i++){
        visited[i] = false;
    }
    let cc = 0;
    for(let i=0; i<nodes.length; i++){
        if(visited[i]===false){
            dfs(nodes[i], i);
            cc+=1;
        }
    }
    return cc;
}

function dfs(vertex, index){
    visited[index] = true;
    for(let i=0; i<vertex.neighbours.length; i++){
        let element = vertex.neighbours[i].id;
        if(visited[element]===false){
            dfs(nodes[element], element);
        }
    }
}

c.fillStyle = nodeColor;