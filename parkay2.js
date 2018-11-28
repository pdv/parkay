'use strict';

const algorithms = {
    'four_pointed_star': fourPointedStar,
    'puzzle_piece': puzzlePiece,
    'rounded': rounded
};

const settings = {
    algorithm: 'four_pointed_star',
    scale: 0.1,
    tileSize: 20,
    wiggler: false,
    wigglerFreq: 0.01
};

function initializeControls() {
    const gui = new dat.GUI();
    gui.add(settings, 'algorithm', Object.keys(algorithms));
    gui.add(settings, 'scale', 0, 10);
    gui.add(settings, 'tileSize', 10, 100);
    gui.add(settings, 'wiggler');
    gui.add(settings, 'wigglerFreq', 0, 0.1);
}

function createEdges(ctx, tileSize) {
    let edges = [];
    const gw = ctx.canvas.width / tileSize;
    const gh = ctx.canvas.height / tileSize;
    for (let s = 0; s < gw; s++) {
        edges[s] = Array();
        for (let t = 0; t < gh; t++) {
            edges[s][t] = Array();
            const vertex = { x: s * tileSize, y: t * tileSize };
            if (s < gw - 1) {
                const right = { x: (s+1) * tileSize, y: t * tileSize };
                edges[s][t].push([vertex, right]);
            }
            if (t < gh - 1) {
                const below = { x: s * tileSize, y: (t+1) * tileSize };
                edges[s][t].push([vertex, below]);
            }
        }
    }
    return edges;
}

function draw(ctx, wiggler, edges) {
    const edgeFn = algorithms[settings.algorithm];
    for (let s = 0; s < edges.length; s++) {
        for (let t = 0; t < edges[s].length; t++) {
            edges[s][t].forEach(([p1, p2]) => {
                const wigVal = (wiggler - s - t) / settings.wigglerFreq;
                const wigglerScalar = settings.wiggler ? Math.sin(wigVal) : 1;
                const scale = wigglerScalar * settings.scale;
                edgeFn(ctx, p1, p2, s, t, scale);
            });
        }
    }
}


function parkay(canvas) {
    initializeControls();
    const ctx = canvas.getContext('2d');
    let wiggler = 0;

    const drawLoop = () => {
        wiggler++;
        const edges = createEdges(ctx, settings.tileSize);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        draw(ctx, wiggler, edges);
        window.requestAnimationFrame(drawLoop);
    };
    drawLoop();
}

// Edge drawing algorithms

function midpoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };
}

function translate(p, dx, dy) {
    return {
        x: p.x + dx,
        y: p.y + dy
    };
}

function setColor(ctx, s, t, scale) {
    const scalar = 255 / (ctx.canvas.width / settings.tileSize);
    const green = Math.floor(scalar * s * Math.abs(scale));
    const blue = Math.floor(scalar * t * Math.abs(scale));
    ctx.strokeStyle = 'rgb(255,' + (255 - green) + ',' + (255 - blue) + ')';
}

function fourPointedStar(ctx, p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2);
    const isVertical = p1.x == p2.x;

    setColor(ctx, s, t, scale);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    if (!isVertical) {
        const dy = t % 2 ? s : -s;
        const offsetMid = translate(mid, 0, dy * scale);
        ctx.lineTo(offsetMid.x, offsetMid.y);
    } else {
        const dx = s % 2 ? t : -t;
        const offsetMid = translate(mid, dx * scale, 0);
        ctx.lineTo(offsetMid.x, offsetMid.y);
    }

    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function rounded(ctx, p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2);
    const isVertical = p1.x == p2.x;

    setColor(ctx, s, t, scale);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    if (!isVertical) {
        const dy = t % 2 ? s : -s;
        const offsetMid = translate(mid, 0, dy * scale);
        ctx.quadraticCurveTo(offsetMid.x, offsetMid.y, p2.x, p2.y);
    } else {
        const dx = s % 2 ? t : -t;
        const offsetMid = translate(mid, dx * scale, 0);
        ctx.quadraticCurveTo(offsetMid.x, offsetMid.y, p2.x, p2.y);
    }

    ctx.stroke();
}


function puzzlePiece(ctx, p1, p2, s, t, scale) {
    const mid = midpoint(p1, p2);
    const q1 = midpoint(p1, mid);
    const q3 = midpoint(mid, p2);
    const isVertical = p1.x == p2.x;

    setColor(ctx, s, t, scale);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(q1.x, q1.y);

    if (isVertical) {
        const dx = s % 2 ? t : -t;
        const offsetQ1 = translate(q1, dx * scale, 0);
        ctx.lineTo(offsetQ1.x, offsetQ1.y);
        const offsetQ3 = translate(q3, dx * scale, 0);
        ctx.lineTo(offsetQ3.x, offsetQ3.y);
    } else {
        const dy = t % 2 ? s : -s;
        const offsetQ1 = translate(q1, 0, dy * scale);
        ctx.lineTo(offsetQ1.x, offsetQ1.y);
        const offsetQ3 = translate(q3, 0, dy * scale);
        ctx.lineTo(offsetQ3.x, offsetQ3.y);
    }

    ctx.lineTo(q3.x, q3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}
