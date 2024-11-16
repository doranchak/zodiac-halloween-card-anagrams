const rectangles = [ // BY FIRE BY GUN BY KNIFE BY ROPE PARADICE SLVES
    [65,39,27,35], // B
    [93,41,32,44], // Y
    [62,102,37,44], // F
    [63,145,24,48], // I
    [62,194,31,37], // R
    [62,231,34,36], // E
    [283,13,32,43], // B
    [315,20,37,44], // Y
    [284,84,39,45], // G
    [289,146,30,30], // U
    [288,196,36,40], // N
    [68,376,36,48], // B
    [62,425,43,45], // Y
    [60,476,37,49], // K
    [64,525,34,39], // N
    [70,566,17,45], // I
    [66,611,33,38], // F
    [61,650,30,37], // E
    [283,379,35,41], // B
    [317,383,40,42], // Y
    [289,452,34,45], // R
    [293,503,27,29], // O
    [293,538,27,41], // P
    [289,590,29,34], // E
    [179,10,49,79], // P
    [167,98,49,74], // A
    [173,183,45,73], // R
    [171,280,46,74], // A
    [177,384,43,64], // D
    [188,451,15,67], // I
    [178,533,42,56], // C
    [175,600,52,60], // E
    [38,289,53,73], // S
    [111,291,47,68], // L
    [224,284,55,69], // V
    [288,285,45,67], // E
    [350,286,44,71] // S
];

const text = "BYFIREBYGUNBYKNIFEBYROPEPARADICESLVES";
var text_active = [];
for (var i=0; i<text.length; i++) text_active.push(0);
var used_cross = 0;

const MS = 250;
const MS2 = 500;

// Load the images
const image1 = new Image();
const image2 = new Image();
const image3 = new Image();
var ctx;

image1.src = 'img/card-back-height-700-fixed-bg.jpg';
image2.src = 'img/card-back-height-700-fixed.jpg';
image3.src = 'img/cross.png';

// Wait for images to load
image1.onload = () => {
    image2.onload = () => {
        image3.onload = () => {
            drawImages();
        };
    };
};

function imgFor(i) {
    i++;
    let img = "img/letters/text";
    if (i<10) img += "0";
    img += "" + i + ".png"
    return img;
}

function drawImages() {
    // Get canvas elements and their contexts
    const canvas1 = document.getElementById('canvas1');
    const canvas2 = document.getElementById('canvas2');
    const canvas3 = document.getElementById('canvas3');
    
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const ctx3 = canvas3.getContext('2d');
    ctx2.willReadFrequently = true;

    // Draw image1 on the bottom canvas (canvas1)
    ctx1.drawImage(image1, 0, 0, canvas1.width, canvas1.height);

    // Draw image2 on the top canvas (canvas2)
    ctx2.drawImage(image2, 0, 0, canvas2.width, canvas2.height);
    ctx = ctx2;

    ctx3.drawImage(image3, 0, 0, canvas3.width, canvas3.height);
    // performEffect(ctx2, 3, rectangles[24]);
}

// function effectAnimation(ctx) {
//     effectAnimationFrame1(ctx, rectangles[24]);
// }

// function effectAnimationFrame1(ctx, rectangle) {
//     performEffect(ctx, 0, rectangle);
//     setTimeout(() => effectAnimationFrame2(ctx, rectangle), MS);
// }

// function effectAnimationFrame2(ctx, rectangle) {
//     performEffect(ctx, 1, rectangle);
//     setTimeout(() => effectAnimationFrame3(ctx, rectangle), MS);
// }

// function effectAnimationFrame3(ctx, rectangle) {
//     performEffect(ctx, 2, rectangle);
// }

function performEffect(ctx, which, rectangle) {
    // Now, modify the transparency of a specific rectangular region on canvas2
    let idx = Math.floor(Math.random()*rectangles.length);
    let x = rectangle[0]; // x coordinate of the top-left corner of the transparent region
    let y = rectangle[1];  // y coordinate of the top-left corner of the transparent region
    let width = rectangle[2]; // width of the transparent region
    let height = rectangle[3]; // height of the transparent region

    // for invert, make it a 10% bigger
    if (which == 0) {
        let ratio = 0.3;
        let width_delta = Math.round(width * ratio);
        let height_delta = Math.round(height * ratio);
        x -= width_delta / 2;
        y -= height_delta / 2;
        width += width_delta;
        height += height_delta;
    }

    // Get image data of the top layer within the rectangle
    let imageData = ctx.getImageData(x, y, width, height);
    let data = imageData.data;
    if (which == 0) { // invert
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // Invert Red
            data[i + 1] = 255 - data[i + 1]; // Invert Green
            data[i + 2] = 255 - data[i + 2]; // Invert Blue            
            data[i + 3] = 255;
        }
    }
    else if (which == 1) { // un-invert, and fade out the letter
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // Invert Red
            data[i + 1] = 255 - data[i + 1]; // Invert Green
            data[i + 2] = 255 - data[i + 2]; // Invert Blue            
            data[i + 3] = 12;
        }
    }
    else if (which == 2) {// restore letter
        for (let i = 3; i < data.length; i += 4) {
            data[i] = 255;
        }
    }
    else if (which == 3) { // just fade out the letter
        for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 12;
        }
    }
    ctx.putImageData(imageData, x, y);
}

function updateChar(ch, last) {
    // const text = "BYFIREBYGUNBYKNIFEBYROPEPARADICESLVES";
    // var text_active = [];
    if (ch == ' ') {
        draw_space();
        return 1;
    }
    if (ch == '\n') {
        draw_return();
        return 1;
    }
    if (ch == 'T' && !used_cross) {
        cross_on();
        used_cross = 1;
        draw_letter('37', last)
        return 1;
    }
    for (var i=0; i<text.length; i++) {
        if (text[i] == ch && !text_active[i]) {
            performEffect(ctx, last ? 0 : 3, rectangles[i]);
            text_active[i] = 1;
            draw_letter(i, last);
            return 1;
        }
    }
}

function draw_space() {
    document.getElementById("output").innerHTML += "<span class=\"spacer\"></span>";
}
function draw_return() {
    document.getElementById("output").innerHTML += "<br/>";
}
function draw_letter(which, last) {
    let cl = "letter";
    if (last) cl += "-invert";
    document.getElementById("output").innerHTML += "<img class=\"" + cl + "\" src=\"" + imgFor(which) + "\">";
}
function cross_on() {
    document.getElementById("canvas3").style.opacity = "0.5";
}
function cross_off() {
    document.getElementById("canvas3").style.opacity = "0";
}

function update(value) {
    drawImages();
    document.getElementById("output").innerHTML = "";
    cross_off();
    used_cross = 0;
    for (var i=0; i<text.length; i++) text_active[i] = 0;
    value = value.toUpperCase();
    var newValue = "";
    for (var i=0; i<value.length; i++) {
        if (updateChar(value[i], i==value.length-1)) {
            newValue += value[i];
        }
    }
    var leftover = "";
    for (var i=0; i<text.length; i++) {
        if (!text_active[i]) leftover += text[i];
    }
    if (!used_cross) leftover += "T";
    leftover = leftover.split('').sort().join('');    
    if (leftover.length > 0) document.getElementById("leftover").innerHTML = "Letters remaining: " + leftover;
    else document.getElementById("leftover").innerHTML = "";
}

function startAnimate() {
    update("");
    let inputString = document.getElementById("text").value;
    setTimeout(() => animateFrame(inputString, 0), MS2);
}

// each frame displays the inputString from [0, index]
function animateFrame(inputString, index) {
    if (index == inputString.length) return;
    update(inputString.substring(0, index+1));
    setTimeout(() => animateFrame(inputString, index+1), MS);
}