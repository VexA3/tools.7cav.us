var val = Math.floor(Math.random() * 12) + 1;

console.log('val = ' + val);

var main = $('body main');
var img = document.createElement('img');
var link1 = "./images/FeelsRainMan.gif";
var link2 = "./images/Jebaited.png";
var link3 = "./images/PepeHands.png";

window.onload = function() {

    switch(true) {
        case (val <= 3):
            img.src = link1;
            img.alt = "FeelsRainMan";
            main.append(img);
            break;
        case (val > 3 && val <= 9):
            img.src = link2;
            img.alt = "Jebaited";
            main.append(img);
            break;
        case (val > 9):
            img.src = link3;
            img.alt = "PepeHands";
            main.append(img);
            break;
    }
}