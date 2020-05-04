exports.diceCalc = function (s) {
	s = s.trim().replace(" ", "").toLowerCase().replace(/[^-d()\d/*+.]/g, '');
	s = diceDivide(s, 0);
	return s;
}

var diceDivide = function (s, bracketCount) {
	var indexOfOpen = s.indexOf("(");
	var indexOfClosed = s.indexOf(")");
	if (indexOfClosed == -1) {
		indexOfClosed = s.length;
	}

	if (indexOfOpen == -1 && indexOfClosed == s.length) {
		return calcDiceExpressions(s);
	}
	else if (indexOfOpen != -1 && indexOfOpen < indexOfClosed) {

		bracketCount++;
		console.warn(s + ": " + s.substring(0, indexOfOpen) + " | " + s.substring(indexOfOpen + 1));
		s = s.substring(0, indexOfOpen) + diceDivide(s.substring(indexOfOpen + 1), bracketCount);


	} else if (indexOfClosed < indexOfOpen || indexOfOpen == -1) {

		console.warn(s + ": " + s.substring(0, indexOfClosed) + " | " + s.substring(indexOfClosed + 1) + " lets check");
		bracketCount--;
		s = calcDiceExpressions(s.substring(0, indexOfClosed)) + s.substring(indexOfClosed + 1);

	}
	return diceDivide(s, bracketCount);
}

var calcDiceExpressions = function (s) {
	return eval(s.replace(/\d+d\d+/g, calcDiceExpression));
}

var calcDiceExpression = function (s) {
	var indexOf = s.indexOf("d");

	var diceThrows = {
		amountOfDice: Number(s.substring(0, indexOf)),
		diceSize: Number(s.substring(indexOf + 1)),
		lastResults: [],

		calcDice: function () {
			this.lastResults = [];
			for (var i = 0; i < this.amountOfDice; i++) {
				this.lastResults.push(RandomFromTo(0, this.diceSize));
			}
		},

		calcSum: function () {
			calcRes = 0;
			this.lastResults.forEach(result =>
				calcRes += result
			);
			return calcRes;
		}
	};

	diceThrows.calcDice();

	return diceThrows.calcSum();
}

var RandomFromTo = function (from, to) {
	return Number(Math.floor(Math.random() * (to + -from) + from + 1));
}

exports.RandomFromTo = function (from, to) {
	return Number(Math.floor(Math.random() * (to + -from) + from + 1));
}