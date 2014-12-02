PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
	Meteor.subscribe('thePlayers');

	Template.leaderboard.helpers({
		'player': function(){
			var currentUserId = Meteor.userId();
			return PlayersList.find({}, {sort: {score: -1}, name: 1 })
		},
		'selectedClass': function(){
			var playerId = this._id;
			var selectedPlayer = Session.get('selectedPlayer');
			if(playerId == selectedPlayer){
				return "selected"
			}
		},
		'showSelectedPlayer': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			return PlayersList.findOne(selectedPlayer)
		}
	});

	Template.leaderboard.events({
		'click .player': function(){
			var playerId = this._id;
			Session.set('selectedPlayer', playerId);
		},
		'click .increment': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call('modifyPlayerScore', selectedPlayer, 5);
		},
		'click .decrement': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			Meteor.call('modifyPlayerScore', selectedPlayer, -5);
		},
		'click .remove': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			var selectedPlayerName = PlayersList.findOne(selectedPlayer).name;
			if (confirm('Are you sure you want to remove ' + selectedPlayerName + ' from the leaderboard?')) {
				Meteor.call('removePlayerData', selectedPlayer);
			};
		}
	});

	Template.addPlayerForm.events({
		'submit form': function(event){
			event.preventDefault();
			var playerNameVar = event.target.playerName.value;
			var playerScoreVar = event.target.playerScore.value;
			console.log(!isNaN(playerScoreVar));
			if (!isNaN(playerScoreVar)) {
				alert('Please enter a score for your player');
			} else {
				Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);
				event.target.playerName.value = '';
				event.target.playerScore.value = '';
				event.target.playerName.blur();
				event.target.playerScore.blur();
			}

		}
	});
}

if(Meteor.isServer){
	Meteor.publish('thePlayers', function(){
		var currentUserId = this.userId;
		return PlayersList.find({createdBy: currentUserId})
	});

	Meteor.methods({
		'insertPlayerData': function(playerNameVar, playerScoreVar){
			var currentUserId = Meteor.userId();
			var playerScoreVar = parseInt(playerScoreVar);
			PlayersList.insert({
				name: playerNameVar,
				score: playerScoreVar,
				createdBy: currentUserId
			});
		},
		'removePlayerData': function(selectedPlayer){
			PlayersList.remove(selectedPlayer);
		},
		'modifyPlayerScore': function(selectedPlayer, scoreValue){
			PlayersList.update(selectedPlayer, {$inc: {score: scoreValue} });
		}
		// 'modifyPlayerScore': function(selectedPlayer, scoreValue){
		// 	PlayersList.update(selectedPlayer, {
		// 		$inc: {score: scoreValue}
		// 	});
		// }
	});
}
