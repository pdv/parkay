'use strict'

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
const cw = canvas.width
const ch = canvas.height
const wh = 20


/**
 * Returns a list of the edges in each generation
 */
function createGrid() {
    let edges = []
    const gw = cw / wh
    const gh = ch / wh

    for (let i = 0; i < gw; i++) {
        edges[i] = Array()
        for (let j = 0; j < gh; j++) {
            const vertex = { x: i * wh, y: j * wh }
            if (i < gw - 1) {
                const right = { x: (i+1) * wh, y: j * wh }
                edges[i].push([vertex, right])
            }
            if (j < gh - 1) {
                const below = { x: i * wh, y: (j+1) * wh }
                edges[i].push([vertex, below])
            }
        }
    }

    return edges
}

function drawGrid(edges) {
    for (let i = 0; i < edges.length; i++) {
        for (let j = 0; j < edges[i].length; j++) {
            let [p1, p2] = edges[i][j]
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
        }
    }
}

drawGrid(createGrid())
