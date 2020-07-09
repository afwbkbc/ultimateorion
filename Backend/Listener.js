class Listener extends require( './_EventAwareBase' ) {

	constructor( repository ) {
		super( module.filename );
		
		this.Repository = repository;
		this.IsAttached = false;
	}
	
	Attach() {
		if ( !this.IsAttached ) {
			this.IsAttached = true;
			this.Repository.AttachListener( this );
		}
		return this;
	}
	
	Detach() {
		if ( this.IsAttached ) {
			this.IsAttached = false;
			this.Repository.DetachListener( this );
		}
		return this;
	}
	
}

module.exports = Listener;
