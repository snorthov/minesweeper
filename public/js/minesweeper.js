/*eslint-env browser:true, browser*/

/* Square States */
var SQUARE = "square";
var MINE = "square mine";
var EXPLOSION = "square explosion";
var FLAG = "square flag";
var QUESTION = "square question";
var WRONG = "square wrong";
var EMPTY = "square empty";
function EMPTY_N(i) {
	return i === 0 ? EMPTY : SQUARE + " mines" + i;
}

/* Button States */
var SMILE = "smile";
var SAD = "sad";
var SURPRISE = "surprise";
var HAPPY = "happy";

/* Board Variables */
var mineCount, rowCount, columnCount, timer;

function main() {
	mineCount = 0;
	rowCount = 8;
	columnCount = 8;
	resetBoard();
}

function setCounter(id, value) {
	var node = document.getElementById(id);
	if (node) {
		var children = node.getElementsByTagName("IMG");
		var count = children.length - 1;
		while (count >= 0) {
			var digit = value % 10;
			children[count].className = "counter" + digit;
			value = Math.floor(value/10);
			--count;
		}
	}
}

function getSquare(i, j) {
	return document.getElementById("square-" + i + "-" + j);
}

function getState(i, j) {
	var node = getSquare(i, j);
	return node ? node.className : "";
}

function setState(i, j, state) {
	var node = getSquare(i, j);
	if (node) node.className = state;
}

function setButtonState(state) {
	var image = document.getElementById("button-image");
	if (image) image.className = state;
}

function mouseDown(event, i, j) {
	event = event || window.event;
	switch (event.button) {
		case 0:
		case 1: {
			var node = getSquare(i, j);
			if (node && !node.selected) {
				var state = getState(i, j);
				if (state === SQUARE) {
					setButtonState(SURPRISE);
					setState(i, j, EMPTY);
					document.onmouseup = function(e) {
						if (!node.selected) {
							setButtonState(SMILE);
							setState(i, j, SQUARE);
						}
						document.onmouseup = null;
					};
				}
			}
			break;
		}
	}
}

function mouseUp(event, i, j) {
	event = event || window.event;
	switch (event.button) {
		case 0:
		case 1: select(i, j); break;
		case 2: flag(i, j); break;
	}
}

function select(i, j) {
	var node = getSquare(i, j);
	if (node && !node.selected) {
		var state = getState(i, j);
		if (state === FLAG) return;
		if (state === EMPTY) {
			if (node.mine) {
				explode(i, j);
			} else {
				reveal(i, j);
				checkWin();
			}
		}
	}
}

function explode(i, j) {
	var node = getSquare(i, j);
	if (node) {
		node.selected = true;
		setState(i, j, EXPLOSION);
		setButtonState(SAD);
		revealAll();
		clearInterval(timer);
	}
}

function flag(i, j) {
	var state = getState(i, j);
	switch (state) {
		case FLAG: setState(i, j, QUESTION); break;
		case QUESTION: setState(i, j, SQUARE); break; 
		case SQUARE: setState(i, j, FLAG); break;
	}
	updateMineCount();
}

function updateMineCount() {
	var flagCount = 0;
	for (var i=0; i<rowCount; i++) {
		for (var j=0; j<columnCount; j++) {
			var state = getState(i, j);
			if (state === FLAG) flagCount++;
		}
	}
	setCounter("counter1", mineCount - flagCount);
}

function checkWin() {
	var selectCount = 0;
	for (var i=0; i<rowCount; i++) {
		for (var j=0; j<columnCount; j++) {
			var node = getSquare(i, j);
			if (node && node.selected) selectCount++;
		}
	}
	if (rowCount * columnCount - selectCount === mineCount) {
		revealAll();
		setButtonState(HAPPY);
		clearInterval(timer);
	} else {
		setButtonState(SMILE);
	}
}

function reveal(i, j) {
	var node = getSquare(i, j);
	if (node && !node.selected && !node.mine) {
		node.selected = true;
		setState(i, j, EMPTY_N(node.away));
		if (node.away === 0) {
			reveal(i, j - 1);
			reveal(i, j + 1);
			reveal(i - 1, j);
			reveal(i + 1, j);
		}
	}
}

function revealAll() {
	for (var i=0; i<rowCount; i++) {
		for (var j=0; j<columnCount; j++) {
			var node = getSquare(i, j);
			if (node) {
				node.selected = true;
				if (node.mine) {
					setState(i, j, MINE);
				} else {
					var state = getState(i, j);
					if (state === FLAG || state === QUESTION) {
						setState(i, j, WRONG);
					} else {
						setState(i, j, EMPTY_N(node.away));
					}
				}
			}
		}
	}
}

function resetBoard() {
	var node = document.getElementById("board");
	var string = "<table>\n";
	for (var i=0; i<rowCount; i++) {
		var rowString = "<tr>";
		for (var j=0; j<columnCount; j++) {
			var id = "id='square-" + i + "-" + j +"'";
			var clazz = "class='" + SQUARE + "'";
			var down = "onmousedown='mouseDown(event," + i + "," + j + ");'";
			var up = "onmouseup='mouseUp(event," + i + "," + j + ");'";
			var context = "oncontextmenu='return false'";
			var dragstart = "ondragstart='return false'";
			var content = id + " " + down + " " + up + " " + context + " " + dragstart + " " + clazz;
			var square = "<div "+ content + ">" + " " + "</div>";
			rowString += "<td>" + square + "</td>";
		}
		string += rowString + "</tr>\n";
	}
	string += "</table>\n";
	node.innerHTML = string;
	while (mineCount < rowCount + columnCount) {
		var i = Math.floor(Math.random() * rowCount);
		var j = Math.floor(Math.random() * columnCount);
		var node = getSquare(i, j);
		if (node && !node.mine) {
			node.mine = true;
			mineCount++;
		}
	}
	var counter = 0;
	setCounter("counter1", mineCount);
	setButtonState(SMILE);
	setCounter("counter2", counter);
	if (timer) clearInterval(timer);
	timer = setInterval(function() {
		setCounter("counter2", counter++);
	}, 1000);
	for (var i=0; i<rowCount; i++) {
		for (var j=0; j<columnCount; j++) {
			var away = 0;
			var node = getSquare(i, j);
			if (node && !node.mine) {
				for (var k=-1; k<2; k++) {
					for (var l=-1; l<2; l++) {
						var n = getSquare(i + k, j + l);
						if (n && n.mine) away++;
					}
				}
				node.away = away;
			}
		}
	}
}