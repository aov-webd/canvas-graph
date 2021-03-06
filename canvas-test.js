const canvas = document.createElement('canvas')
document.querySelector('body').appendChild(canvas)
canvas.style.margin = 'auto'
document.addEventListener("click", onClick)

let canvasContext = canvas.getContext('2d')
let w = canvas.width = 800
let h = canvas.height = 400
let points = []
let properties = {
    bgColor: '#C4C4C4',
    pointStrokeStyle: '#000',
    pointFillStyle: '#fff',
    lineStrokeStyle: '#000',
    pointRadius: 6,
    actualPointsCount: 8,
    animationLength: 40
}
let animationID;
let animationCount = 0;

class Point {
    constructor({ x, y }) {
        this.xStep = 0
        this.yStep = 0
        this.yNew = 0
        this.xNew = 0
        this.y = y
        this.x = x
    }
    setNew({ x, y }) {
        this.yNew = y
        this.xNew = x
        this.xStep = (this.xNew - this.x) / properties.animationLength
        this.yStep = (this.yNew - this.y) / properties.animationLength
    }
    move() {
        this.y += this.yStep;
        this.x += this.xStep;
    }
    reDraw() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, properties.pointRadius, 0, Math.PI * 2)
        canvasContext.closePath();
        canvasContext.fillStyle = properties.pointFillStyle
        canvasContext.fill()
        canvasContext.stroke()
    }
}

function drawLines() {
    for (let i = 1; i < points.length; i++) {
        x1 = points[i - 1].x
        y1 = points[i - 1].y
        x2 = points[i].x
        y2 = points[i].y
        canvasContext.strokeStyle = properties.lineStrokeStyle
        canvasContext.beginPath();
        canvasContext.moveTo(x1, y1)
        canvasContext.lineTo(x2, y2)
        canvasContext.closePath()
        canvasContext.stroke()
    }
}

function reDrawBackground() {
    canvasContext.fillStyle = properties.bgColor;
    canvasContext.fillRect(0, 0, w, h)

    canvasContext.beginPath();
    canvasContext.moveTo(w / 40, h / 20)
    canvasContext.lineTo(w / 40, h * 19 / 20)
    canvasContext.closePath()
    canvasContext.stroke()

    canvasContext.beginPath();
    canvasContext.moveTo(w / 40, h * 19 / 20)
    canvasContext.lineTo(w * 39 / 40, h * 19 / 20)
    canvasContext.closePath()
    canvasContext.stroke()
}

function movePoints() {
    for (let i in points) {
        points[i].move()
    }
}

function reDrawPoints() {
    for (let i in points) {
        points[i].reDraw()
    }
}

function animate() {
    animationID = requestAnimationFrame(() => {
        if (animationCount == properties.animationLength) {
            animationCount = 0
            cancelAnimationFrame(animationID);
            return
        }
        reDrawBackground()
        movePoints()
        drawLines()
        reDrawPoints()
        animationCount++;
        animate()
    })
}

function generateNewPoints() {
    let pointsCount = Math.round(Math.random() * 6) + 2
    let newPoints = []
    for (let i = 0; i < pointsCount; i++) {
        newPoints.push({
            x: (i * w / (pointsCount - 1)) * 0.8 + 0.1 * w,
            y: h * 0.25 + Math.random() * h * 0.5
        })
    }
    console.log(newPoints)
    return newPoints
}

function getNewPointIndex(i, length) {
    return Math.floor((i) * length / properties.actualPointsCount)
}

function init() {
    let newPoints = generateNewPoints()
    for (var i = 0; i < properties.actualPointsCount; i++) {
        points.push(new Point(newPoints[getNewPointIndex(i, newPoints.length)]))
    }
    reDrawBackground()
    drawLines()
    reDrawPoints()
}

function onClick() {
    let newPoints = generateNewPoints()
    for (var i = 0; i < properties.actualPointsCount; i++) {
        points[i].setNew(newPoints[getNewPointIndex(i, newPoints.length)])
    }
    animate()
}

init()
