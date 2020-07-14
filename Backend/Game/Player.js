class Player extends require( '../_Entity' ) {

	constructor() {
		super( module.filename );
		
		this.Flags = {
			is_host: false,
			is_ready: false,
		};
	}

	Pack() {
		return new Promise( ( next, fail ) => {
			
			var data = {
				UserId: this.User.ID,
				GameId: this.Game.Id,
				Flags: JSON.stringify( this.Flags ),
			}
			
			return next( data );
		});
	}
	
	Unpack( data, options ) {
		return new Promise( ( next, fail ) => {
			
			if ( !data.UserId || !data.GameId )
				return next( null ); // invalid player
			
			if ( data.Flags )
				this.Flags = JSON.parse( data.Flags );
			
			//console.log( 'UNPACK PLAYER', data, options );

			var p = {
				caller: this.Id,
				parameters: {
					Players: {
						[ this.Id ]: this,
					},
				},
				on_before_deadlock: ( obj ) => {
					//console.log( 'P BEFOREDEADLOCK', obj );
					//this.Game = new this.G.DeferredEntity( obj.EntityId );
				},
				on_after_deadlock: ( obj ) => {
					//console.log( 'P AFTERDEADLOCK', obj );
					this.Manager( 'Game' ).FindGame( obj.EntityId, p )
						.then( ( game ) => {
							this.Game = game;
							this.Save();
							this.Game.Trigger( 'player_add', {
								Player: this,
							});
							//console.log( 'THISGAMEID', this.Game.Id );
						})
						.catch( fail )
					;
				},
			};
			
			var promises = [];
			if ( !this.User )
				promises.push( this.Module( 'Auth' ).FindUser( data.UserId ) );
			if ( !this.Game )
				promises.push( this.Manager( 'Game' ).FindGame( data.GameId, p ));
			
			if ( !promises.length )
				return next( this ); // nothing to do
			
			Promise.all( promises )
				.then( ( results ) => {
					for ( var k in results ) {
						var obj = results[ k ];
						if ( !obj || obj instanceof this.G.DeferredEntity )
							continue; // will be set later
						if ( obj.Classname == 'Game' || obj.Classname == 'User' )
							this[ obj.Classname ] = obj;
						else {
							console.log( 'unexpected object "' + obj.Classname + '"' );
							return next( null );
						}
					}
					//console.log( 'RESULT1', this.Id, this.Game ? this.Game.Id : '???' );
					return next( this );
				})
				.catch( fail )
			;
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			return next();
		});
	}
	
	OnDestroy() {
		return new Promise( ( next, fail ) => {
			Promise.all([
				this.User.Session.RemoveFromGame( this.Game ),
				this.Game.RemovePlayerForUser( this.User ),
			])
				.then( next )
				.catch( fail )
			;
		});
	}
	
	SetFlag( key, value ) {
		if ( this.Flags[ key ] !== value ) {
			this.Flags[ key ] = value;
			this.Trigger( 'flag_change', {
				Key: key,
				Value: value,
			});
			this.Save();
		}
	}
	
	GetFlags() {
		return this.Flags;
	}
	
}

module.exports = Player;
