'use strict'

let canvas = document.getElementById('canvas')
let slider = document.getElementById('slider')
let ctx = canvas.getContext('2d')
const cw = canvas.width
const ch = canvas.height
const wh = 20
const edges = createEdges()

/**
 * Returns a list of the edges in each generation
 */
function createEdges() {
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


function offsetMidpoint(p1, p2, offset) {
    let isVertical = p1.x == p2.x
    return {
        x: (p1.x + p2.x) / 2 + (isVertical * offset),
        y: (p1.y + p2.y) / 2 + (!isVertical * offset)
    }
}


function drawEdge(p1, p2, t) {
    const mid = offsetMidpoint(p1, p2, 0)
    const cp1 = offsetMidpoint(p1, mid, t * slider.value)
    const cp2 = offsetMidpoint(mid, p2, -1 * t * slider.value)
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(cp1.x, cp1.y)
    ctx.lineTo(cp2.x, cp2.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}


function draw() {
    ctx.clearRect(0, 0, cw, ch)
    for (let t = 0; t < edges.length; t++) {
        edges[t].map(([p1, p2]) => drawEdge(p1, p2, t))
    }
    window.requestAnimationFrame(draw)
}

draw()
