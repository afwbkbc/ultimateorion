class MainMenu extends require( '../Viewport' ) {
	
	constructor( filename, session ) {
		super( filename, session );

		this.Logo = this.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ 400, 50 ],  {
			Style: 'main-menu-logo',
			Text: 'UltimateOrion',
		});
		this.Version = this.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ 570, 85 ], {
			Style: 'main-menu-version',
			Text: 'v.0.0.1',
		});

		/* needed?
		this.AddMainMenuLinks = () => {
			
			this.MainMenu.Append( 'UI/Button', {
				Label: 'Quit',
			})
				.On( 'click', ( data, event ) => {
					
					var done = () => {
						event.connection.Send( 'client_quit' );
					};
					
					if ( event.connection.UserToken )
						this.E.M.Auth.RemoveUserToken( event.connection.UserToken, event.connection.RemoteAddress )
							.then( done )
							.catch( ( e ) => {
								throw e;
							})
						;
					else
						done();
				});
			;
			
		}*/
	}
	
}

module.exports = MainMenu;
