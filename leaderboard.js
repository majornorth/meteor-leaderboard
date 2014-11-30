PlayersList = new Mongo.Collection('players');

console.log("Hello world");

if(Meteor.isClient){
	Template.leaderboard.helpers({
		'player': function(){
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
			PlayersList.update(selectedPlayer, {$inc: {score: 5}});
		},
		'click .decrement': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			PlayersList.update(selectedPlayer, {$inc: {score: -5}});
		},
		'click .remove': function(){
			var selectedPlayer = Session.get('selectedPlayer');
			var selectedPlayerName = PlayersList.findOne(selectedPlayer).name;
			if (confirm('Are you sure you want to remove ' + selectedPlayerName + ' from the leaderboard?')) {
				PlayersList.remove(selectedPlayer);
			};
		}
	});

	Template.addPlayerForm.events({
		'submit form': function(event){
			event.preventDefault();
			var playerNameVar = event.target.playerName.value;
			var playerScoreVar = event.target.playerScore.value;
			PlayersList.insert({
				name: playerNameVar,
				score: playerScoreVar
			});
			event.target.playerName.value = '';
			event.target.playerScore.value = '';
			event.target.playerName.blur();
			event.target.playerScore.blur();
		}
	});
}

if(Meteor.isServer){

}
