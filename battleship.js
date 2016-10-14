//визуальная часть
var view = {
	displayMessage: function (msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class","hit");
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	},
};
//модель
var model = {
	boardSize:7,//размер поля
	numShips:3,//кол-во кораблей в игре
	shipsSunk:0,//кол-во потопленых кораблей
	shipLength:3,//длинна корабля
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// проверка на повтоное попадание по координатам
			if (ship.hits[index] === "hit") {
				view.displayMessage("Вы уже стреляли по этим координатам!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Попадание! Красава!");

				if (this.isSunk(ship)) {
					view.displayMessage("Молодееец! Ты потопил мой корабль");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Промах!");
		return false;
},
//если потопил
	isSunk: function(ship){
		for(i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] != 'hit') {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function () {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision (locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},
	generateShip: function () {
		var direction = Math.floor(Math.random()*2);
		var row, col;
		if(direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		}else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if(direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function (locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for(var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >=0) {
					return true
				}
			}
		}
		return false;
	}
};
//проверка на правильность ввода данных пользователем
function parseGuess (guess) {
	var alphabet = ["a","b","c","d","e","f","g"];
	if(guess===null||guess.length!=2) {
		alert("Пожалуйста, введите в поле букву и число");
	}else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if(isNaN(row)||isNaN(column)) {
			alert("Ой! Вне игрового поля");
		}else if (row<0|| row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Ой! Вне игрового поля");
		}else {
			return row + column;
		}
	}
};
//контроллер
var controller = {
	guesses: 0,
	processGuess: function (guess) {
		var location = parseGuess(guess);
		if(location) {
			this.guesses++;
			var hit = model.fire(location);
			if(hit && model.shipSunk === model.numShips) {
				view.displayMessage ("Ты потопил все мои корабли с " + this.guesses + "выстрелов");
			}
		}
	}
};
//связываем обработчик событий с кнопкой fire

function handleFireButton () {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess (guess);
	guessInput.value = "";
};
window.onload = init;
function init () {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	model.generateShipLocations();
};



