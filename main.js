
let zoomfactor = 75
const zoomspeed = 0.01
const body = document.body
const pointoffset = 3
const campos = [0,0]
const camspeed = 15

class nation{
    constructor(id, name, states){
        this.id = id
        this.name = name
        this.states = states
        this.faction = null
        this.ideology = "None"
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
    }
}

let states = [
    new state(1, "TestState1", [[0.5, 1.4], [0.8, -0.7] ,[-1.0, -0.5], [-0.5, 0.5]], [2,4], []),
    new state(2, "TestState2", [[0.5, 1.2], [0.8, -0.7] ,[-0.2, -0.7], [-0.5, 1.4]], [3,4], []),
    new state(3, "TestState3", [[0.8, 1.3], [0.8, -0.7] ,[-0.8, -0.7], [-2.0, 1.5], [-0.2, 1.3]], [3,2], []),
    new state(4, "TestState4", [[0.3, 0.5], [0.5, -0.5] ,[-1.2, -1.7], [-1.5, 0.2]], [5,5], []),
    new state(4, "TestState4", [[0.5, 1.5], [-1.2, 0.3] ,[-1.2, -1.7]], [5,3], []),
]

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


window.onload = function()
{
    renderstates()
};

function renderstates(){
    body.innerHTML = ""
    for (let state of states) {
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
        
        polygon.style.fill = "whitesmoke"
        polygon.addEventListener("click", stateclicked)
        
        body.appendChild(statesvgtag)

    }
}

function stateclicked(){
    state = this
    console.log(state.style.fill)
    if(state.style.fill == "whitesmoke"){
        state.style.fill = "red"
    } else {
        state.style.fill = "whitesmoke"
    }
}