'use strict'

let $ = (id) => document.getElementById(id)

let canvas = $('canvas')
let wigglerElem = document.getElementById('wiggler')
let wigglerRate = document.getElementById('rate')

let ctx = canvas.getContext('2d')
const cw = canvas.width
const ch = canvas.height
const wh = 20
const edges = createEdges()


function createEdges() {
    let edges = []
    const gw = cw / wh
    const gh = ch / wh
    for (let s = 0; s < gw; s++) {
        edges[s] = Array()
        for (let t = 0; t < gh; t++) {
            edges[s][t] = Array()
            const vertex = { x: s * wh, y: t * wh }
            if (s < gw - 1) {
                const right = { x: (s+1) * wh, y: t * wh }
                edges[s][t].push([vertex, right])
            }
            if (t < gh - 1) {
                const below = { x: s * wh, y: (t+1) * wh }
                edges[s][t].push([vertex, below])
            }
        }
    }
    return edges
}


function midpoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

function translate(p, dx, dy) {
    return {
        x: p.x + dx,
        y: p.y + dy
    }
}


function drawEdge(p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2)
    const q1 = midpoint(p1, midpoint)
    const q3 = midpoint(midpoint, p2)
    const isVertical = p1.x == p2.x

    const green = Math.floor(5.1 * s * Math.abs(scale))
    const blue = Math.floor(5.1 * t * Math.abs(scale))
    ctx.strokeStyle = 'rgb(0,' + green + ',' + blue + ')'

    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)

    if (!isVertical) {
        const dy = t % 2 ? s : -s
        const offsetMid = translate(mid, 0, dy * scale)
        ctx.lineTo(offsetMid.x, offsetMid.y)
    } else {
        const dx = s % 2 ? t : -t
        const offsetMid = translate(mid, dx * scale, 0)
        ctx.lineTo(offsetMid.x, offsetMid.y)
    }

    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

let wiggler = 0

function draw() {
    wiggler++
    ctx.clearRect(0, 0, cw, ch)
    for (let s = 0; s < edges.length; s++) {
        for (let t = 0; t < edges[s].length; t++) {
            edges[s][t].map(([p1, p2]) => {
                const srate = s / $('xrate').value
                const trate = t / $('yrate').value
                const wigVal = (wiggler - srate - trate) / -$('rate').value
                const wigglerScalar = $('wiggler').checked ? Math.sin(wigVal) : 1
                const scale = wigglerScalar * $('slider').value
                drawEdge(p1, p2, s, t, scale)
            })
        }
    }
    window.requestAnimationFrame(draw)
}

draw()
