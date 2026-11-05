
let zoomfactor = 40
const zoomspeed = 0.01
const body = document.body
const pointoffset = 3
const campos = [0,0]
const camspeed = 15
let currentnation = null
const infobar = document.getElementById("infobar")
let selectedstate = null

class nation{
    constructor(id, name, states, color){
        this.id = id
        this.name = name
        this.states = states
        this.color = color
        this.faction = null
        this.ideology = "None"
    }
    setstatesowner(){
        for(let stateid of this.states){
            console.log(getstatebyid(stateid))
            state = getstatebyid(stateid)
            state.owner = this
            state.setcolor(this.color)
        }
        renderstates()
    }
}




class state{
    constructor(id, name, points, position, neighbors){
        this.id = id
        this.name = name
        this.points = points
        this.position = position
        this.neighbors = neighbors
        this.htmltag = null
        this.owner = null
    }
    setcolor(color){
        if(this.htmltag != null){
            
            this.htmltag.style.fill = color
        }
    }
}

let states = [
    new state(1, "Paris", [[0.5, 1.4], [0.8, -0.7] ,[-1.0, -0.5], [-0.5, 0.5]], [2,4], []),
    new state(2, "TestState2", [[0.5, 1.2], [0.8, -0.7] ,[-0.2, -0.7], [-0.5, 1.4]], [3,4], []),
    new state(3, "TestState3", [[0.8, 1.3], [0.8, -0.7] ,[-0.8, -0.7], [-2.0, 1.5], [-0.2, 1.3]], [3,2], []),
    new state(4, "TestState4", [[0.3, 0.5], [0.5, -0.5] ,[-1.2, -1.7], [-1.5, 0.2]], [5,5], []),
    new state(5, "TestState5", [[0.5, 1.5], [-1.2, 0.3] ,[-1.2, -1.7]], [5,3], []),
    new state(6, "TestState6", [[0.5, 1.5], [-1.2, 0.3] ,[-1.2, -1.7], [0.3, -0.8], [0.9, 0.5]], [15,12], []),
    new state(7, "TestState7", [[1.5, 0.5], [-1.3, 0.7] ,[-0.2, -0.7]], [14,13], []),
    new state(8, "TestState8", [[1.5, -0.5], [-0.8, 1.4] ,[-1.3, -0.3]], [14,14], []),
    new state(9, "TestState9", [[-0.5, 0.4], [-1.2, 1.2] ,[-1.5, -0.5]], [3,5], []),
    new state(10, "TestState10", [[0.5, 1.5], [-1.2, 0.2] ,[-0.5, -0.6], [0.5, -0.8]], [3,6], []),
    new state(11, "TestState11", [[0.5, 0.5], [0.8, 2.2], [-0.9, -0.2] ,[0, -0.5]], [1,4], []),
    new state(12, "TestState12", [[0.5, -0.5], [-0.8, 0.7] ,[-1.2, -1.8]], [3,8], []),
]

function getstatebyid(id){
    for(let state of states){
        if(state.id == id){
            return state
        }
    }
    console.log("Found no state with id: " + String(id))
}

function zoom(event){
    console.log(event.deltaY)
    zoomfactor += event.deltaY * zoomspeed
    renderstates()
}

body.addEventListener("keydown", function (event) {
    console.log(event)
    if(event.key == "ArrowUp"){
        campos[1] -= camspeed
    } 
    else if(event.key == "ArrowDown"){
        campos[1] += camspeed
    } 
    else if(event.key == "ArrowRight"){
        campos[0] += camspeed
    } 
    else if(event.key == "ArrowLeft"){
        campos[0] -= camspeed
    }
    console.log(campos)
    renderstates()
})

body.onwheel = zoom

let nations = [
    new nation(1, "France", [1,2,3], "#3e2dd6"),
    new nation(2, "Germany", [4,5], "#8d7e7e"),
    new nation(3, "Rattania", [6,7,8], "#0e6d16"),
    new nation(4, "Dagestan", [9,10,11,12], "#323232"),
]

function getstatebypolygon(polygon){
    for(let state of states){
        if(state.htmltag == polygon){
            return state
        }
    }
    console.log("found no state with polygon " + polygon)
}


window.onload = function()
{   
    renderstates()
    for(let nationstate of nations){
        console.log("setting state owners")
        nationstate.setstatesowner()
    }
};


function renderstates(){
    for (let state of states) {
        if(state.htmltag != null){
            state.htmltag.remove()
            state.htmltag = null
        }
        var statesvgtag = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        //statesvgtag.style.width = 100 * zoomfactor + "px"
        //statesvgtag.style.height = 100 * zoomfactor + "px"

        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
        statesvgtag.appendChild(polygon)

        for(value of state.points){
            var point = statesvgtag.createSVGPoint()
            point.x = (value[0] + pointoffset * 1) * zoomfactor
            point.y = (value[1] + pointoffset * 1) * zoomfactor
            polygon.points.appendItem(point);
        }
        statesvgtag.style.left = (state.position[0] + pointoffset * 0) * zoomfactor + campos[0] + "px" 
        statesvgtag.style.top = (state.position[1] + pointoffset * 0) * zoomfactor + campos[1] + "px"
        
        state.htmltag = polygon
        if(state.owner != null){
            state.setcolor(state.owner.color)
        }
        polygon.addEventListener("click", stateclicked)
        
        body.appendChild(statesvgtag)
        

    }
}

function stateclicked(){

    state = getstatebypolygon(this)
    console.log(state)
    infobar.innerHTML = ""
    console.log(this)
    infobar.style.visibility = "visible"
    let statename = document.createElement("p")
    statename.innerHTML = state.name
    infobar.appendChild(statename)
}