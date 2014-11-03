function Game() {
	this.randomNumber = Math.floor((Math.random()*100)+1);
	this.numberOfGuessess = 10;
	this.guessArray = [];
	this.coldHotArray = [];
	this.hint = function(){
		$('#output').text(this.randomNumber);
	}
	this.playAgain = function(){
		location.reload(true);
	}

	this.submitGuess = function(){
		var userGuessString = $("#user-guess").val();
		
		if (isNaN(userGuessString)) {
			$('#output').text("Please enter a whole number between 1-100!");
		} else if (userGuessString.indexOf('.') > -1) {
			$('#output').text("Please enter a whole  number between 1-100!");
		} else if (parseInt(userGuessString) > 100 || parseInt(userGuessString) < 1) {
			$('#output').text("make sure your number is between 1-100!");
		} else {
			this.numberOfGuessess -= 1;
			var userGuess = parseInt($("#user-guess").val());
			if (userGuess === this.randomNumber) {
				$('#output').text("");
				$('#guess-left').text("Yay! you win!");	
				$('#guess-left').css("font-size", "200px");
			} else if (this.numberOfGuessess === 0) {
				$('#output').text("");
				$('#guess-left').text("Sorry, you lose!");
				$('#guess-left').css("font-size", "200px");
			} else if (this.guessArray.indexOf(userGuess) != -1) {
				$('#output').text("You have already guessed " + userGuessString +" try a diffrent number!" )
			} else {
				var guessHelperString = "";
				$('#guessess-left').text(this.numberOfGuessess);
				
				this.guessArray.push(userGuess);
				if (this.guessArray.length === 1 ) {
					this.coldHotArray.push(userGuess);
				} else if (Math.abs(this.coldHotArray[this.coldHotArray.length -1] - this.randomNumber) >= Math.abs(userGuess - this.randomNumber)) {
					this.coldHotArray.push(userGuess);
				} else {
					this.coldHotArray.unshift(userGuess)
				}
				



				if ( Math.abs(userGuess - this.randomNumber) > 30) {
					guessHelperString += "You are cold";
				} else {
					guessHelperString += "You are hot";
				}

				if (this.guessArray.length > 1 && (Math.abs(this.guessArray[this.guessArray.length - 2] - this.randomNumber)) > (Math.abs(userGuess - this.randomNumber))) {
					guessHelperString += " and getting hotter";
				} else if (this.guessArray.length > 1) {
					guessHelperString += " and getting colder";
				}

				if (userGuess < this.randomNumber) {
					guessHelperString += ", guess higher!";
				} else {
					guessHelperString += ", guess lower!";
				}
				$('#user-guess').val('');
				$('#output').text(guessHelperString);
				$('#guess-list-span').text(this.coldHotArray.toString());
			}
		}
	}
}


// print answer to the screen
$(document).ready(function(){	
	Game = new Game();
	
	$('#submit-guess').click(function(){
		Game.submitGuess();
	});

	
	$('#guess-form').submit(function(e){
		Game.submitGuess();
		e.preventDefault();
	})


	$('#play-again').click(function(){
		Game.playAgain();
	});

	$('#hint').click(function(){
		Game.hint();
	});




	
});



