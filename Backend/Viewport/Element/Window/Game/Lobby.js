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
		});
		
		this.ActionBlock = this.Body.AddElement( 'Window/Game/Lobby/ActionBlock', [ 'LT', 'LT' ], [ 1580, 690 ], {
			Width: 320,
			Height: 360,
		});

		this.Listen( this.Attributes.Game )
			.On( 'player_join', ( data ) => {
				var player = data.Player;
				if ( !this.Players[ player.Id ] ) {
					this.Players[ player.Id ] = player;
					this.Players.AddPlayer( player );
				}
			})
			.On( 'player_leave', ( data ) => {
				var player = data.Player;
				if ( this.Players[ player.Id ] ) {
					this.Players.RemovePlayer( player );
					delete this.Players[ player.Id ];
				}
			})
		;
		
	}
	
}

module.exports = Lobby;
