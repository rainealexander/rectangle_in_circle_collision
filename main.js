const cHeight = 500;
const cWidth = 500;
const mainRad = 200;
const centerPoint = {
    x: cWidth / 2,
    y: cHeight / 2
};

let rooms = {};

let c = document.getElementById('disp');
let ctx = c.getContext('2d');

c.width = cWidth;
c.height = cHeight;

let init = function () {
    ctx.beginPath();
    ctx.arc(cWidth / 2, cHeight / 2, mainRad, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
};

let randomPointInCircle = function (centerX,centerY,radius) {
    let r = radius * Math.sqrt(Math.random());
    let theta = Math.random() * 2 * Math.PI;

    let x = Math.floor(centerX + r * Math.cos(theta));
    let y = Math.floor(centerY + r * Math.sin(theta));

    return { x: x, y: y };
};

let isPointInCircle = function (p, c, r) {
    let dx = p.x - c.x;
    let dy = p.y - c.y;
    //console.log(`dx: ${dx}, dy: ${dy}`);
    let distance = Math.sqrt(dx * dx + dy * dy);
    //console.log('distance: ', distance);
    //console.log(`point ${p.x},${p.y} in circle: ${distance < r}`);
    return distance < r;
};

let roomAtRandomPoint = function (width, height) {
    let oddW = width % 2;
    let oddH = height % 2;
    //TODO: decide 'center' for even rooms

    let inCircle = false;
    let collision = false;
    let point = {};

    let attempts = 0;
    do {
        //console.log('in do loop');
        point = randomPointInCircle(centerPoint.x, centerPoint.y, mainRad);
        collision = false;
        if ( !isObjectEmpty(rooms) ) {
            let pointKey = point.x + ',' + point.y;
            if ( rooms.hasOwnProperty(pointKey) ) {
                console.log('repeated room coordinate');
            }

            for ( const room in rooms ) {
                //console.log(`room check: ${room} ,rooms[room].x: ${rooms[room].x}, .w: ${rooms[room].w}`);
                collision = rectCollision( point.x, point.y, width, height, rooms[room].x, rooms[room].y, rooms[room].w, rooms[room].h);

                if (collision) break;
            }
        }

        if (collision) {
            attempts++;
            //console.log("room collision found");
            continue;
        }

        let testPoint;
        //nw
        if (point.x <= centerPoint.x && point.y <= centerPoint.y) {
            testPoint = {x: (point.x - Math.floor(width/2)), y: (point.y - Math.floor(height/2))};
            //console.log(testPoint);
            inCircle = isPointInCircle(testPoint, centerPoint, mainRad);
            //console.log('nw');
        }
        //ne
        else if (point.x >= centerPoint.x && point.y <= centerPoint.y) {
            testPoint = {x: (point.x + Math.floor(width/2)), y: (point.y - Math.floor(height/2))};
            //console.log(testPoint);
            inCircle = isPointInCircle(testPoint, centerPoint, mainRad);
            //console.log('ne');
        }
        //sw
        else if (point.x <= centerPoint.x && point.y >= centerPoint.y) {
            testPoint = {x: (point.x - Math.floor(width/2)), y: (point.y + Math.floor(height/2))};
            //console.log(testPoint);
            inCircle = isPointInCircle(testPoint, centerPoint, mainRad);
            //console.log('sw');
        }
        //se
        else if (point.x >= centerPoint.x && point.y >= centerPoint.y) {
            testPoint = {x: (point.x + Math.floor(width / 2)), y: (point.y + Math.floor(height / 2))};
            //console.log(testPoint);
            inCircle = isPointInCircle(testPoint, centerPoint, mainRad);
            //console.log('se');
        }
        attempts++;
        if(attempts >= 50) console.log('max attempts reached')
    } while (!inCircle && attempts < 50);

    let key = point.x + ',' + point.y;
    rooms[key] = {x: point.x, y: point.y, w: width, h: height};
    //console.log(`Good room: ${key} w: ${width} h: ${height}`);
    ctx.beginPath();
    ctx.rect(point.x - Math.floor(width/2), point.y - Math.floor(height/2), width, height);
    ctx.stroke();
};

init();

let roomsTest = function () {
    const widthRange = [4,44];
    const heightRange = [4,44];
    roomAtRandomPoint(randomValueInRange(...widthRange),randomValueInRange(...heightRange));
};

let randomValueInRange = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

let rectCollision = function ( r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    //convert midpoints to top left corner
    r1x -= Math.floor(r1w/2);
    r1y -= Math.floor(r1h/2);
    r2x -= Math.floor(r2w/2);
    r2y -= Math.floor(r2h/2);

    if (r1x + r1w >= r2x &&
        r1x <= r2x + r2w &&
        r1y + r1h >= r2y &&
        r1y <= r2y + r2h) {
        //collision detected
        return true;
    }
    //no collision
    return false;
};

let isObjectEmpty = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

for (let i = 0; i < 60; i++){ roomsTest(); }