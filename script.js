// Global variables
var tid; // Timer identifier for point movement
var summaryTable = document.getElementById("summary"); // Summary table
var distancesTable = document.getElementById("distances"); // Distances table
var hideSafetyBtn = document.getElementById("hide-safety-btn"); // Button to hide safety distances
var hideDistanceBtn = document.getElementById("hide-distance-btn"); // Button to hide distances
var showOnlyUnsafeBtn = document.getElementById("show-only-safe-btn"); // Button to show only unsafe distances
var startBtn = document.getElementById("start-btn"); // Button to start point movement
var stopBtn = document.getElementById("stop-btn"); // Button to stop point movement

// Configuration variables
var hideDistances = false; // Flag to hide distances
var hideSafetyDistances = false; // Flag to hide safety distances
var showOnlyUnsafeDistances = false; // Flag to show only unsafe distances
var safetyDistance = 30; // Safety distance

var canvasWidth = 1024; // Width of the canvas
var canvasHeight = 768; // Height of the canvas
var pointsNumber = 10; // Number of points

// colors
const blue = '#3581D8'; // tufts blue
const red = '#D82E3F'; // rusty red
const yellow = '#FFCC00'; // lemon yellow
const green = '#28CC2D'; // lime green

// other styles
var font_style = "14px sans-serif";
var font_color = "white";
var canvas_background = "black";

// Initialize an array to store points
var points = [];

// Generate random points within the canvas boundaries
for (var i = 0; i < pointsNumber; i++) {
  var label = "p" + i.toString();

  var x = Math.floor(Math.random() * (canvasWidth / 2) + (canvasWidth / 4));
  var y = Math.floor(Math.random() * (canvasHeight / 2) + (canvasHeight / 4));

  points[i] = [x, y, label];
}

// Create a canvas element dynamically
var canvas = document.createElement("canvas");
canvas.setAttribute("width", canvasWidth.toString() + "px");
canvas.setAttribute("height", canvasHeight.toString() + "px");
canvas.style.backgroundColor = canvas_background;

// Append the canvas to the "map" element
document.getElementById("map").appendChild(canvas);

var ctx = canvas.getContext("2d");
ctx.fillStyle = font_color;

// Draw a point (x, y) with label
function drawPoint(p) {
  ctx.beginPath();
  ctx.arc(p[0], p[1], 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.font = font_style;
  ctx.fillText(p[2], p[0] - 10, p[1] + 12);
}

// Calculate the Euclidean distance between two points
function distance(p1, p2) {
  var cxSquare = Math.pow(Math.abs(p2[0] - p1[0]), 2);
  var cySquare = Math.pow(Math.abs(p2[1] - p1[1]), 2);
  var d = Math.sqrt(cxSquare + cySquare);
  return d.toFixed(2);
}

// Draw a line between two points (x1, y1) and (x2, y2) with a specified color
function drawLine(x1, y1, x2, y2, color = green) {
  ctx.beginPath();
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = color;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Draw a circle centered at point p with a specified color
function drawCircle(p, color = blue) {
  ctx.beginPath();
  ctx.arc(p[0], p[1], safetyDistance / 2, 0, 2 * Math.PI);
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = color;
  ctx.stroke();
}

// Draw all points on the canvas
function drawPoints() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.forEach(drawPoint);
}

// Draw safety distances for all points
function drawSafetyDistances() {
  points.forEach(function (p1) {
    var color = blue;

    points.forEach(function (p2) {
      if (p1 !== p2) {
        var d = distance(p1, p2);

        if (d < safetyDistance) {
          color = red;
        } else if (d < safetyDistance * 2 && color !== red) {
          color = yellow;
        }
      }
    });

    drawCircle(p1, color);
  });
}

// Draw all distances between points on the canvas
function drawDistances() {
  for (var i = 0; i < points.length; i++) {
    var x1 = points[i][0];
    var y1 = points[i][1];

    for (var j = i + 1; j < points.length; j++) {
      var x2 = points[j][0];
      var y2 = points[j][1];

      var d = distance(points[i], points[j]);

      var safe = true;
      var color = green;

      if (d < safetyDistance) {
        color = red;
        safe = false;
      } else if (d < safetyDistance * 2) {
        color = yellow;
        safe = false;
      }

      if (safe && showOnlyUnsafeDistances) {
        continue;
      }

      drawLine(x1, y1, x2, y2, color);
    }
  }
}

// Move a point randomly within the canvas boundaries
function movePoint(p) {
  var move = Math.floor(Math.random() * 3 - 1) * 5;
  p[0] += move;
  p[1] += move;
  return p;
}

// Move the points randomly within the canvas boundaries
function movePoints() {
  points.forEach(function (point) {
    movePoint(point);
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPoints();

  if (!hideSafetyDistances) {
    drawSafetyDistances();
  }

  if (!hideDistances) {
    drawDistances();
  }

  updateSummary();
  updateDistances();
}

// Create a table row with the specified cells
function createRow(cellsData) {
  var tr = document.createElement("tr");
  cellsData.forEach(function (data) {
    var td = document.createElement("td");

    if (data instanceof Element || data instanceof HTMLDocument) {
        td.appendChild(data);
    } else {
        td.appendChild(document.createTextNode(data));
    }
    tr.appendChild(td);
  });
  return tr;
}

// Create the table header with the specified headers
function createTableHeader(headers) {
  var tr = document.createElement("tr");
  tr.style.textAlign = "center";
  tr.style.fontWeight = "bold";
  headers.forEach(function (header) {
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(header));
    tr.appendChild(td);
  });
  return tr;
}

// Create a table cell with the specified text
function createTableCell(text) {
  var td = document.createElement("td");
  td.appendChild(document.createTextNode(text));
  return td;
}

// Initialize the table with cells containing the specified text
function initializeTable(tableElement, headers, initText) {
  var newThead = document.createElement("thead");
  var newTbody = document.createElement("tbody");

  // thead
  newThead.appendChild(createTableHeader(headers));

  // tbody
  for (var i = 0; i < points.length; i++) {
    var tr = document.createElement("tr");
    tr.style.textAlign = "center";

    for (var j = 0; j < headers.length; j++) {
      var text = initText;
      if (j === 0) {
        tr.style.fontWeight = "bold";
        text = "p" + i;
      }
      tr.appendChild(createTableCell(text));
    }

    newTbody.appendChild(tr);
  }

  var oldTbody = tableElement.tBodies[0];
  var oldThead = tableElement.tHead;
  tableElement.replaceChild(newThead, oldThead);
  tableElement.replaceChild(newTbody, oldTbody);
}

// Update the table with the specified data
function updateTable(tableElement, headers, rowsData) {
  var newThead = document.createElement("thead");
  var newTbody = document.createElement("tbody");

  // thead
  newThead.appendChild(createTableHeader(headers));

  // tbody
  rowsData.forEach(function (rowData) {
    newTbody.appendChild(createRow(rowData));
  });

  var oldTbody = tableElement.tBodies[0];
  var oldThead = tableElement.tHead;
  tableElement.replaceChild(newThead, oldThead);
  tableElement.replaceChild(newTbody, oldTbody);
}

// Update the summary table with the current points' positions
function updateSummary() {
  var headers = ["p", "x", "y"];
  var rowsData = points.map(function (p) {
    return [p[2], p[0], p[1]];
  });

  updateTable(summaryTable, headers, rowsData);
}

// Initialize the summary table with cells containing "-"
function initializeSummaryTable() {
  var headers = ["p", "x", "y"];
  var initText = "-";

  initializeTable(summaryTable, headers, initText);
}

// Initialize the distances table with cells containing "-"
function initializeDistancesTable() {
  var headers = ["-"].concat(points.map(function (p) {
    return p[2];
  }));
  var initText = "-";

  initializeTable(distancesTable, headers, initText);
}

// Update the distances table with the current distances between points
function updateDistances() {
  var headers = ["-"].concat(points.map(function (p) {
    return p[2];
  }));
  var rowsData = [];

  for (var i = 0; i < points.length; i++) {
    var rowData = [points[i][2]];

    for (var j = 0; j < points.length; j++) {
      if (i === j) {
        rowData.push("-");
      } else {
        var d = distance(points[i], points[j]);
        var color;

        if (d < safetyDistance) {
          color = red;
        } else if (d < safetyDistance * 2) {
          color = yellow;
        } else {
          color = green;
        }

        rowData.push(createColorText(d, color));
      }
    }

    rowsData.push(rowData);
  }

  updateTable(distancesTable, headers, rowsData);
}

// Create a colored text element with the specified color
function createColorText(text, color) {
  var span = document.createElement("span");
  span.style.color = color;
  span.appendChild(document.createTextNode(text));
  return span;
}

function toggleButton(button, param) {
  var color = (param) ? green : red;
  button.style.backgroundColor = color;
}

// Event listener for hiding safety distances
hideSafetyBtn.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hideSafetyDistances = !hideSafetyDistances;
  drawPoints();

  if (!hideSafetyDistances) {
    drawSafetyDistances();
  }

  if (!hideDistances) {
    drawDistances();
  }
  
  var param = !hideSafetyDistances;
  toggleButton(hideSafetyBtn, param);
});

// Event listener for hiding distances
hideDistanceBtn.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hideDistances = !hideDistances;
  drawPoints();

  if (!hideDistances) {
    drawDistances();
  }

  if (!hideSafetyDistances) {
    drawSafetyDistances();
  }
  
  var param = !hideDistances;
  toggleButton(hideDistanceBtn, param);
});

// Event listener for showing only unsafe distances
showOnlyUnsafeBtn.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showOnlyUnsafeDistances = !showOnlyUnsafeDistances;
  drawPoints();

  if (!hideDistances) {
    drawDistances();
  }

  if (!hideSafetyDistances) {
    drawSafetyDistances();
  }
  
  var param = showOnlyUnsafeDistances;
  toggleButton(showOnlyUnsafeBtn, param);
});

// Event listener for starting point movement
startBtn.addEventListener("click", function () {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  updateSummary();
  updateDistances();
  tid = setInterval(movePoints, 1000);
});

// Event listener for stopping point movement
stopBtn.addEventListener("click", function () {
  stopBtn.disabled = true;
  startBtn.disabled = false;
  if (tid) {
    clearInterval(tid);
    tid = null;
  }
});

// Initial drawing of points and distances
window.addEventListener("load", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPoints();
  drawSafetyDistances();
  drawDistances();
  initializeSummaryTable();
  initializeDistancesTable();
});
