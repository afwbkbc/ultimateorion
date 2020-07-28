class Stage {
	
	constructor( stage_name, us_object, parent_context ) {
		this.StageName = stage_name;
		this.USObject = us_object;
		this.Handlers = this.USObject.Compiler.Handlers[ this.StageName ];
		this.ParentContext = parent_context ? parent_context : null;
	}
	
	SpawnChild( context ) {
		return new ( require( './' + this.StageName ) )( this.StageName, this.USObject, context );
	}
}

module.exports = Stage;
