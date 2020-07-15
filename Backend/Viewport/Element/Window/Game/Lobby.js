class Lobby extends require( '../../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'game-lobby',
			Width: 1920,
			Height: 1080,
		});
		
		this.Players = {};
	}
	
	Prepare() {
		
		this.SetAttributes({
			Title: this.Attributes.Game.Name + ' (lobby)',
		});
		
		super.Prepare();
		
		this.Game = this.Attributes.Game;
		this.Player = this.Attributes.Player;
		
		this.Settings = this.Body.AddElement( 'Window/Game/Lobby/Settings', [ 'LT', 'LT' ], [ 20, 20 ], {
			Width: 500,
			Height: 600,
		});
		
		this.Players = this.Body.AddElement( 'Window/Game/Lobby/Players', [ 'LT', 'LT' ], [ 540, 20 ], {
			Width: 840,
			Height: 600,
		});

		this.Rules = this.Body.AddElement( 'Window/Game/Lobby/Rules', [ 'LT', 'LT' ], [ 1400, 20 ], {
			Width: 500,
			Height: 600,
		});
		
		this.Chat = this.Body.AddElement( 'Window/Game/Lobby/Chat', [ 'LT', 'LT' ], [ 20, 640 ], {
			Width: 1540,
			Height: 360,
		})
			.On( 'message', ( data ) => {
				this.Game.AddMessage( '<' + this.Player.User.Username + '> ' + data.Text );
			})
		;
		
		this.ActionBlock = this.Body.AddElement( 'Window/Game/Lobby/ActionBlock', [ 'LT', 'LT' ], [ 1580, 690 ], {
			Width: 320,
			Height: 360,
		})
			.On( 'ready', ( data ) => {
				this.Player.SetFlag( 'is_ready', data.State );
			})
			.On( 'leave', ( data ) => {
				this.Game.RemovePlayerForUser( this.Player.User );
			})
		;
		
		var messages = this.Game.GetMessages();
		for ( var k in messages )
			this.Chat.PushMessage( messages[ k ] );
		
		this.On( 'close', () => {
			this.Player.SetFlag( 'is_ready', false );
		});
		
		// listen to game events and update UI accordingly
		this.Listen( this.Attributes.Game )
			.On( 'player_add', ( data ) => {
				var player = data.Player;
				//console.log( 'player_join', player.Id );
				if ( !this.Players[ player.Id ] ) {
					this.Players[ player.Id ] = player;
					this.Players.AddPlayer( player );
				}
			})
			.On( 'player_leave', ( data ) => {
				var player = data.Player;
				//console.log( 'player_leave', player.Id );
				if ( this.Players[ player.Id ] ) {
					this.Players.RemovePlayer( player );
					delete this.Players[ player.Id ];
				}
			})
			.On( 'push_message', ( data ) => {
				this.Chat.PushMessage( data.Text );
			})
			.On( 'pop_message', () => {
				this.Chat.PopMessage();
			})
		;
		
		
	}
	
}

module.exports = Lobby;
