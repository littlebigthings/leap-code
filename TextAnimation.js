let elementToMove = document.querySelector("[data-item='anim-wrapper']");
let elmToShiftHeight = document.querySelector(".anim-container");
let timer;
let timerTime = 3000;
let animateDuration = 0.3;
function makeClone() {
    if (elementToMove == undefined) return;
    let clonedElm = elementToMove.children[0];
    let elmToinsert = document.createElement("h2");
    elmToinsert.textContent = clonedElm.textContent;
    elmToinsert.classList.add("hero-title")
    elmToinsert.classList.add("auto-height");
    elementToMove.appendChild(elmToinsert);
    animateText();
    checkResize();
}

function animateText() {
    let height = 0;
    let heightToMove = 0;
    let textElementsLength = elementToMove.childElementCount;
    let initialelm = 0;
    elementToMove.children[initialelm].style.visibility = "visible";
    elementToMove.children[initialelm].nextElementSibling.style.visibility = "visible";
    if (textElementsLength <= 0) return;
    timer = setInterval(() => {
        if (initialelm < textElementsLength - 1) {
            initialelm++;
            height = parseFloat(window.getComputedStyle(elementToMove.children[initialelm]).getPropertyValue("height"));
            elementToMove.children[initialelm].previousElementSibling.style.visibility = "hidden";
            elementToMove.children[initialelm].nextElementSibling != null ? elementToMove.children[initialelm].nextElementSibling.style.visibility = "visible" : "";
            heightToMove = heightToMove + height;
            console.log(height, "height")
            console.log(initialelm, "initialElm")
            console.log(heightToMove, "heightToMove")
            doAnimation(elementToMove, heightToMove)
        } else {
            initialelm = 0;
            heightToMove = 0;
            elementToMove.children[initialelm].style.visibility = "visible";
            elementToMove.children[initialelm].nextElementSibling.style.visibility = "visible";
            doAnimation(elementToMove, 0)
        }
    }, timerTime)
}

function doAnimation(elementToMove, height) {
    let duration = animateDuration;
    let timeline = gsap.timeline();
    height == 0 ? duration = 0 : duration = animateDuration;
    timeline.to(elementToMove, {
        y: -height,
        duration: duration,
        ease: "Power1.easeInOut",
    })
    if (height == 0 && timer) {
        clearInterval(timer);
        animateText();
    }
}

function checkResize() {
    window.addEventListener("resize", () => {
        doAnimation(elementToMove, 0)
    })
}

makeClone();