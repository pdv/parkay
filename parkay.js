'use strict'

let $ = (id) => document.getElementById(id)

const canvas = $('canvas')
const ctx = canvas.getContext('2d')
const cw = canvas.width
const ch = canvas.height

let wh;
let edges;
function setEdges() {
    wh = $('size').value
    edges = createEdges()
}
$('size').onchange = setEdges

let wiggler = 0

const edgeFns = {
    fourPointedStar: fourPointedStar,
    puzzlePiece: puzzlePiece,
    rounded: rounded
}


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


function draw() {
    wiggler++
    ctx.clearRect(0, 0, cw, ch)
    const edgeFn = edgeFns[$('algorithm').value]
    for (let s = 0; s < edges.length; s++) {
        for (let t = 0; t < edges[s].length; t++) {
            edges[s][t].map(([p1, p2]) => {
                const srate = s / $('xrate').value
                const trate = t / $('yrate').value
                const wigVal = (wiggler - srate - trate) / -$('rate').value
                const wigglerScalar = $('wiggler').checked ? Math.sin(wigVal) : 1
                const scale = wigglerScalar * $('slider').value
                edgeFn(p1, p2, s, t, scale)
            })
        }
    }
    window.requestAnimationFrame(draw)
}

setEdges()
draw()


// Edge drawing algorithms

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


function setColor(s, t, scale) {
    const scalar = 255 / (cw / wh)
    const green = Math.floor(scalar * s * Math.abs(scale))
    const blue = Math.floor(scalar * t * Math.abs(scale))
    ctx.strokeStyle = 'rgb(0,' + green + ',' + blue + ')'
}

function fourPointedStar(p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2)
    const isVertical = p1.x == p2.x

    setColor(s, t, scale)
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

function rounded(p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2)
    const isVertical = p1.x == p2.x

    setColor(s, t, scale)
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)

    if (!isVertical) {
        const dy = t % 2 ? s : -s
        const offsetMid = translate(mid, 0, dy * scale)
        ctx.quadraticCurveTo(offsetMid.x, offsetMid.y, p2.x, p2.y)
    } else {
        const dx = s % 2 ? t : -t
        const offsetMid = translate(mid, dx * scale, 0)
        ctx.quadraticCurveTo(offsetMid.x, offsetMid.y, p2.x, p2.y)
    }

    ctx.stroke()
}


function puzzlePiece(p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2)
    const q1 = midpoint(p1, mid)
    const q3 = midpoint(mid, p2)
    const isVertical = p1.x == p2.x

    setColor(s, t, scale)
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(q1.x, q1.y)

    if (isVertical) {
        const dx = s % 2 ? t : -t
        const offsetQ1 = translate(q1, dx * scale, 0)
        ctx.lineTo(offsetQ1.x, offsetQ1.y)
        const offsetQ3 = translate(q3, dx * scale, 0)
        ctx.lineTo(offsetQ3.x, offsetQ3.y)
    } else {
        const dy = t % 2 ? s : -s
        const offsetQ1 = translate(q1, 0, dy * scale)
        ctx.lineTo(offsetQ1.x, offsetQ1.y)
        const offsetQ3 = translate(q3, 0, dy * scale)
        ctx.lineTo(offsetQ3.x, offsetQ3.y)
    }

    ctx.lineTo(q3.x, q3.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

