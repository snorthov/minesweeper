// JavaScript source code

/*eslint-env browser */
//alert(12);

function fred() {
    main();
    setCounter();
    return SMILE;
}

function Object1() {
	this.ttt = function () {
		return alert (12);
	} 
}

function Object2() {
	this.ttt = function () {
		return alert (13);
	}
}

function ww() {
	var z = new Object1();
	z.ttt();
	var z2 = new Object2();
	z2.ttt();
}
ww();

function ww2(z) {
	z.ttt();
}
