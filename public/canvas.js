const canvas = document.querySelector('canvas');
canvas.width = 938;
canvas.height = window.innerHeight;
const c = canvas.getContext('2d');

if (window.innerWidth < 938) {
    alert("This game is not intended mobile gameplay.  Please try again using a desktop browser.")
} else {
    alert('Press the space bar to start, and use your mouse to control the paddle.')
}

localStorage.removeItem('alerted')

let generateColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let getDistance = (x1, y1, x2, y2) => {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

class Paddle {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    draw() {
        c.beginPath();
        c.fillStyle = '#3A78E7';
        c.fillRect(this.dx, this.dy, this.x, this.y);
    }
}

class Ball {
    constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
    }

    draw(startGame) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
        if (startGame) this.update();

    }

    update() {
        this.x += this.dx
        this.y += this.dy;

        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            this.dx *= -1.02;
        }
        if (((this.y + this.radius >= innerHeight - paddle.y) && this.x + this.radius >= paddle.dx && this.x - this.radius <= paddle.dx + paddle.x) || this.y - this.radius <= 0) {
            this.dy *= -1.02;

            if ((this.x <= paddle.dx + (paddle.x / 2)) && this.dx > 0) this.dx = -this.dx;
            if ((this.x >= paddle.dx + (paddle.x / 2)) && this.dx < 0) this.dx = -this.dx;

        }

        if (this.y - this.radius > innerHeight + paddle.y && !localStorage.getItem('alerted')) {
            localStorage.setItem('alerted', true);
            alert('Game Over.');
            location.reload();
        }

    }
}

class Brick {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.height = 30;
        this.width = 100;
    }

    draw(startGame) {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
        if (startGame) this.update();
    }

    update() {


        const topSideBall = ball.y - ball.radius;
        const rightSideBall = ball.x + ball.radius;
        const bottomSideBall = ball.y + ball.radius;
        const leftSideBall = ball.x - ball.radius;

        const brickTop = this.y;
        const brickRight = this.x + this.width;
        const brickBottom = this.y + this.height;
        const brickLeft = this.x;

        if (
            Math.abs(topSideBall - brickBottom) < 10
            &&
            (rightSideBall > brickLeft) && (leftSideBall < brickRight)) {
            //Hit was from below the brick
            bricks.splice(bricks.indexOf(this), 1);
            ball.dy = -ball.dy
        }

        if (
            Math.abs(bottomSideBall - brickTop) < 10
            &&
            (rightSideBall > brickLeft) && (leftSideBall < brickRight)
        ) {
            //Hit was from above the brick
            bricks.splice(bricks.indexOf(this), 1);
            ball.dy = -ball.dy
        }

        if (
            Math.abs(rightSideBall - brickLeft) < 10
            &&
            (topSideBall < brickBottom) && (bottomSideBall > brickTop)
        ) {
            //Hit was on left
            bricks.splice(bricks.indexOf(this), 1);
            ball.dx = -ball.dx;
            ball.dy = -ball.dy;
        }

        if (
            Math.abs(leftSideBall - brickRight) < 10
            &&
            (topSideBall < brickBottom) && (bottomSideBall > brickTop)
        ) {
            //Hit was on right
            bricks.splice(bricks.indexOf(this), 1);
            ball.dx = -ball.dx;
            ball.dy = -ball.dy;
        }



    }
}

let startGame = false;
let bricks = [];

const paddle = new Paddle(150, 15, (canvas.width / 2) - 100, innerHeight - 15);
const ball = new Ball(
    (canvas.width / 2),
    innerHeight - 25,
    Math.floor(Math.random() > 0.5 ? 4 : -4),
    5,
    10,
    'lightblue')

let x = 100;
let y = 65;

for (let i = 1; i < 64; i++) {
    if (i <= 7) {
        bricks.push(new Brick(x, y, generateColor()));
        x += 105;
    }
    else if (i > 7 && i <= 14) {
        y = 100;
        x -= 105;
        bricks.push(new Brick(x, y, generateColor()))
    }
    else if (i > 14 && i <= 21) {
        y = 135;
        bricks.push(new Brick(x, y, generateColor()))
        x += 105;
    }
    else if (i > 21 && i <= 28) {
        y = 170;
        x -= 105;
        bricks.push(new Brick(x, y, generateColor()))
    }
    else if (i > 28 && i <= 35) {
        y = 205;
        bricks.push(new Brick(x, y, generateColor()))
        x += 105;
    }
    else if (i > 35 && i <= 42) {
        y = 240;
        x -= 105;
        bricks.push(new Brick(x, y, generateColor()))
    }
    else if (i > 42 && i <= 49) {
        y = 275;
        bricks.push(new Brick(x, y, generateColor()))
        x += 105;
    }
    else if (i > 49 && i <= 56) {
        y = 310;
        x -= 105;
        bricks.push(new Brick(x, y, generateColor()))
    }
    else if (i > 56 && i <= 63) {
        y = 345;
        bricks.push(new Brick(x, y, generateColor()))
        x += 105;
    }
}


let mouse = {
    x: canvas.width / 2,
    y: canvas.width / 2
}

addEventListener("mousemove", event => {
    mouse.x = event.clientX * (canvas.width / window.innerWidth);

})

addEventListener("resize", () => {
    c.width = canvas.width;
    c.height = innerHeight;
})

document.onkeydown = (e) => e.keyCode == 32 ? startGame = true : null;

let animate = () => {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, innerHeight);

    bricks.map(brick => brick.draw(startGame));

    paddle.draw();
    ball.draw(startGame);
    paddle.dx = mouse.x - (paddle.x / 2);

    if (!startGame) {
        ball.x = mouse.x;
    }

}

animate();