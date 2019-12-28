const canvas = document.querySelector('#my-canvas'); 
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
const radius = 30, yes = "✔", no = "✘";
const info = document.querySelector('#info');

btn.style.background = fontFam[5];
document.querySelectorAll('.list-item').forEach(b => 
    {
        addInfo(b);
        b.addEventListener('mouseover',
        e => {        
            e.currentTarget.style.background = fontFam[3];
            e.currentTarget.style.color = "white";
            computeProperty(e);
            e.currentTarget.children[0].style.display = "inline";   
        });
        b.addEventListener('mouseout', 
        e => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "black";
            info.style.height = "0vh";
            info.textContent = "";
        });
        b.addEventListener('click', 
        e => {
            info.textContent = e.currentTarget.children[1].innerText;
            info.style.height = (info.scrollHeight) + "px";
            info.style.background = fontFam[1];     
        });
    });

document.querySelector('#canvas-area').addEventListener('mouseout', e => {
    if(e.target === e.currentTarget){
        document.querySelectorAll('.list-item:not(span)').forEach(b => {
            b.children[0].style.display = "none";
        });
    }
});

var nodes = [];
var edges = [];
var selected;

canvas.width = window.innerWidth*0.55;
canvas.height = window.innerHeight* 0.7; 

btn.addEventListener('click', addNode);
canvas.addEventListener('click', edgeAdder);
//TODO: canvas.addEventListener('dblclick', edgeRemover);

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

function edgeAdder(e){ 
    n = getClicked(e);
    if(n===undefined){
        return;
    }
    if(selected===undefined){
        selected = n;
        c.fillStyle = nodeColorTarget;
        n.draw();
        setTimeout(function(){
            if(nodes.length<=1 || n.neighbours.length===nodes.length-1){
                alert('No available nodes.');
                colorClear();
                selected = undefined;
                return;
            }
            
            if(confirm("Would you like to add an edge to this node?")){
                alert('Select a neighbour');
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

//TODO
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
    var prop = e.currentTarget.innerHTML.split("<span")[0];
    var spanner = e.currentTarget.children[0];
    switch(prop){
        case "Completeness":
            spanner.innerHTML = ": " + ((isComplete())? yes:no);
            break;
        case "Nodes":
            spanner.innerHTML = ": " + nodes.length;
            break;
        case "Edges":
            spanner.innerHTML = ": " + edges.length;
            break;
        case "Eulerian Path":
        spanner.innerText = ": " + ((eulerian())? yes:no);
            break;
        /**case "Hamiltonian Path":
            hamiltonian();
            break; */
        case "Connected Components":
            spanner.innerText = ": " + connectedComponents();
            break;
        default:
            console.log('help! {' + prop + '}');
            break;
    }
}

function eulerian(){
    if(connectedComponents()!==1){
        return false;
    }
    let oddDegrees = nodes.filter(n => (n.neighbours.length%2)===1).length;
    if(oddDegrees === 2 || oddDegrees === 0){
        return true;
    }
    else{
        return false;
    }
}

/**TODO: traverse every node once */
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

function addInfo(property){
    let spanner = property.children[1];
    switch(property.innerText){
        case "Nodes":
            spanner.innerText = "Nodes, also referred to as vertices, are the main units in a graph.";
            break;
        case "Edges":
            spanner.innerText = "Edges connect two nodes in a graph. These can be ordered, such that the edge goes strictly from some node 1 to node 2, or unordered (like in this graph), where the order does not matter. Two nodes connected by an edge are said to be adjacent, or neighbours.";
            break;
        case "Completeness":
            spanner.innerText = "In a complete graph, every node is connected (shares an edge with) every other node in the graph. Fun fact: if a graph with N edges is complete, it will have N*(N-1)/2 edges!";
            break;
        case "Eulerian Path":
            spanner.innerText = "A Eulerian path in a graph is once that traverses every edge exactly once. You can think of this as whether or not it would be possible to draw the graph on paper without lifting your pencil.";
            break;
        case "Connected Components":
            spanner.innerText = "A connected component is a subgraph of a graph in which each node is \"reachable\". This means there is a path to each node within the subgraph. That being said, a single node with no adjacent nodes is a component itself.";
            break;
        default:
            console.log('Problem: ' + property.innerText);
    }
    spanner.style.display = "none";
}

c.fillStyle = nodeColor;