const canvas = document.getElementById("gui");
const menu = document.querySelector(".menu");
const main = document.querySelector(".main");
const slider = document.getElementById("slider");

var dragging = false;
var draggedElement;
var ctx;

var mit1 = null;
var mit2 = null;
var vc = null;
var sample = null;
var samplePath = null;
var CURRENT_SAMPLE = 'aluminium';

var canvasWidth = main.offsetWidth - 20;
var canvasHeight = main.offsetHeight - 20;

function init(machineName) {
  ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.lineWidth = 1.5;
  mit1 = new MIT(canvas, ctx);
  mit2 = new MIT2(canvas, ctx);

  sample = Sample(canvas, ctx);

  //Add event listeners
  window.addEventListener("resize", resize);

  canvas.addEventListener("mousedown", onMouseDownHandler);
  canvas.addEventListener("mousemove", onMouseMoveHandler);
  window.addEventListener("mouseup", onMouseUpHandler);
  canvas.addEventListener("mousewheel", onMouseWheelHandler);

  canvas.addEventListener("drop", onElementDrop);
  document.addEventListener("touchend", (e) => {
    onElementDrop(e.touches[0]);
  });

  canvas.addEventListener("contextmenu", onContextMenuHandler);

  canvas.addEventListener("click", onClickHandler);

  canvas.addEventListener("touchstart", (e) => onMouseDownHandler(e.touches[0]));
  canvas.addEventListener("touchmove", (e) => onMouseMoveHandler(e.touches[0]));
  window.addEventListener("touchend", (e) => onMouseUpHandler(e.touches[0]));
  canvas.addEventListener("mousewheel", onMouseWheelHandler);
  canvas.addEventListener("drop", onElementDrop);

  ctx.refresh = () => {
    canvas.width = canvasWidth * devicePixelRatio;
    canvas.height = canvasHeight * devicePixelRatio;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    // draw points
    ctx.fillStyle = "rgb(160,160,160)";
    for (i = 10; i < canvas.width; i += 50) {
      for (j = 10; j < canvas.height; j += 50) {
        ctx.fillRect(i, j, 3, 3);
      }
    }

    if (mit1) mit1.paint();
    if (mit2) mit2.paint();
    if (sample) sample.paint();

    // footer text
    ctx.font = "12px serif";
    ctx.fillText("Virtual Lab - IITK", canvas.width - 100, canvas.height - 10);
  };

  ctx.refresh();
  
  setInterval(() => {
    ctx.refresh();
  }, 800);
}

function resize() {
  if (window.innerWidth < 10 || window.innerHeight < 10) return;

  canvasWidth = main.offsetWidth - 20;
  canvasHeight = main.offsetHeight - 20;
  ctx.refresh();
}

function onMouseDownHandler(event) {
  if (mit1) mit1.onMouseDownHandler(event);
  if (mit2) mit2.onMouseDownHandler(event);
  if (sample) sample.onMouseDownHandler(event);
}

function onMouseMoveHandler(event) {
  if (mit1) mit1.onMouseMoveHandler(event);
  if (mit2) mit2.onMouseMoveHandler(event);
  if (sample) sample.onMouseMoveHandler(event);
}

function onMouseUpHandler(event) {
  if (mit1) mit1.onMouseUpHandler(event);
  if (mit2) mit2.onMouseUpHandler(event);
  if (sample) sample.onMouseUpHandler(event);
}

function onContextMenuHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (mit1) mit1.onContextMenuHandler(event);
  if (mit2) mit2.onContextMenuHandler(event);
  if (sample) sample.onContextMenuHandler(event);
}

function onClickHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (mit1) mit1.onClickHandler(event);
  if (mit2) mit2.onClickHandler(event);
  if (sample) sample.onClickHandler(event);
}

function onMouseWheelHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  if (mit1) mit1.onMouseWheelHandler(event);
  if (mit2) mit2.onMouseWheelHandler(event);
  if (sample) sample.onMouseWheelHandler(event);
}

function onElementDrop(event) {
  if (!draggedElement) return;
  switch (draggedElement.getAttribute("label")) {
    case "mitMachine":
      mit1.init();
      break;
    case "mit2Machine":
      mit2.init();
      break;
    case "sample":
      sample.init();
      break;
  }
}

window.onload = init;

/* Window Controls */

slider.addEventListener("mousedown", () => (dragging = true));
document.addEventListener("mousemove", slideWindow);
document.addEventListener("mouseup", () => (dragging = false));

slider.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();

  dragging = true;
});

document.addEventListener("touchstart", (e) => {
  if (draggedElement) {
    draggedElement.remove();
    draggedElement = null;
  }

  let tar = e.touches[0].target;
  if (tar.getAttribute("label") == "mitMachine" || tar.getAttribute("label") == "vernierCaliper") {
    img = document.createElement("img");
    img.src = tar.src;
    img.setAttribute("label", tar.getAttribute("label"));
    img.onload = () => {
      document.body.appendChild(img);
      draggedElement = img;
    };
  }
});

document.addEventListener("touchmove", (e) => {
  slideWindow(e.touches[0]);
  if (!draggedElement) return;

  draggedElement.style.position = "absolute";
  draggedElement.style.left = e.touches[0].clientX + "px";
  draggedElement.style.top = e.touches[0].clientY + "px";
});

document.addEventListener("touchend", (e) => {
  dragging = false;
  if (draggedElement) {
    draggedElement.style.display = "none";
  }
});

document.addEventListener("dragstart", (event) => {
  // store a ref. on the dragged elem
  draggedElement = event.target;
});

document.addEventListener("dragover", (event) => {
  // prevent default to allow drop
  event.preventDefault();
});

function slideWindow(e) {
  if (dragging) {
    menu.style.width = e.clientX + "px";
    main.style.width = window.innerWidth - e.clientX + "px";

    canvasWidth = main.offsetWidth - 25;
    canvasHeight = main.offsetHeight - 25;
    ctx.refresh();
  }
}

window.refresh = () => {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      item.classList.add("active");

      document
        .querySelectorAll(".nav-item")
        .forEach((item) => document.querySelector(item.getAttribute("data-target")).classList.remove("active"));
      document.querySelector(item.getAttribute("data-target")).classList.add("active");
    });
  });

  document.querySelectorAll(".box:not(.disabled)").forEach((e) => {
    e.addEventListener("click", () => {
      document.querySelectorAll(".box").forEach((e) => {
        e.classList.remove("active");
      });
      e.classList.toggle("active");
    });
  });
};

function loadSample(name) {

  if (name == "aluminium") {
    CURRENT_SAMPLE = "aluminium";
  }

  if (name == "brass") {
    CURRENT_SAMPLE = "brass";
  }

  if (name == "steel") {
    CURRENT_SAMPLE = "steel";
  }

  sample.init();
  if(mit1) mit1.unLoadSample();
  if(mit2) mit2.unLoadSample();
}

function loadMachine(name) {
  if (name == "mit1") {
    if (mit1) mit1.init();
    if(mit2) mit2.destroy();
  }

  if (name == "mit2") {
    if(mit1) mit1.destroy();
    if (mit2) mit2.init();
  }

  ctx.refresh();
}

window.refresh();
