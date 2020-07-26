class Parser {
	
	constructor( compiler, parent_context ) {
		
		this.Compiler = compiler;
		this.ParentContext = parent_context ? parent_context : null;
		
		this.Source = null;
		this.SourcePos = 0;
		this.LineNum = this.ParentContext ? this.ParentContext.LineNum : 1;
		this.LinePos = this.ParentContext ? this.ParentContext.LinePos + 1 : 1; // + 1 to include length of opening bracket of parent scope
		
		this.InvisibleCharacters = '\r\n';
		
		this.IsInsideString = false;
		this.CommentDepth = 0;
		
		this.Context = null;
		this.ParsedData = [];
	}
	
	CreateError( message, pos_back_by ) {
		return new Error( ( this.Namespace ? ( this.Namespace + '.us' ) : '<core>' ) + ':' + this.LineNum + ':' + ( this.LinePos - ( pos_back_by ? pos_back_by : 0 ) ) + ' : ' + message );
	}
	
	Parse( namespace, source, callbacks ) {
		if ( this.Source )
			throw new Error( 'Parser already running.' );
		
		this.Source = source;
		this.Namespace = namespace;
		
		while ( !this.IsFinished() ) {
			this.GetNextCharacter();
		}
		if ( this.Context ) {
			if ( this.Context.Handler.StopOn ) {
				throw this.CreateError( 'expected ' + this.Context.Handler.StopOn + ', got ' + ( this.ParentContext ? this.ParentContext.Handler.StopOn : 'end of file' ) );
			}
			else {
				this.FinalizeContext();
			}
		}
		if ( this.CommentDepth > 0 ) {
			throw this.CreateError( 'expected */, got end of file' );
		}
		
		return this.ParsedData;
	}
	
	IsFinished() {
		if ( this.SourcePos == this.Source.length ) {
			this.Source = null;
			return true;
		}
		else
			return false;
	}
	
	CreateContext( parser, handler ) {
		return new ( require( './Context' ) )( parser, handler );
	}
	
	FinalizeContext() {
		
		// finalize, save result and get out
		this.Context.Handler.End( this.Context );
		if ( typeof( this.Context.Data ) !== 'undefined' ) {
			this.ParsedData.push({
				handler: this.Context.Handler.Name,
				source_pos_from: this.Context.SourcePos,
				source_pos_to: this.SourcePos,
				line_num_from: this.Context.LineNum,
				line_pos_from: this.Context.LinePos,
				line_num_to: this.LineNum,
				line_pos_to: this.LinePos - ( this.Context.ConsumeNeeded ? 0 : 1 ), // - 1 to make range non-inclusive
				//source : this.Context.Source ? this.Context.Source : null,
				data: this.Context.Data,
			});
		}
		else if ( [
			'Whitespace'
		].indexOf( this.Context.Handler.Name ) < 0 )
			console.log( 'no data from ' + this.Context.Handler.Name );
		this.Context = null;
		
	}
	
	GetNextCharacter() {
		let character = this.Source[ this.SourcePos ];
		let is_visible_character = this.InvisibleCharacters.indexOf( character ) < 0;
		
		if ( !this.IsInsideString ) { // strings have priority over comments
		
			if ( character === '/' && this.Source[ this.SourcePos + 1 ] === '*' ) { // comment start
				this.CommentDepth++;
				this.SourcePos += 2;
				this.LinePos += 2;
				return;
			}
			
			if ( this.CommentDepth > 0 ) { // inside /* ... */, can be multi-line
				if ( character === '\n' ) {
					this.LineNum++;
					this.LinePos = 0;
				}
				else if ( character === '*' && this.Source[ this.SourcePos + 1 ] === '/' ) { // comment end
					this.CommentDepth--;
					this.SourcePos++;
					this.LinePos++;
				}
				this.SourcePos++;
				if ( is_visible_character )
					this.LinePos++;
				return;
			}
		}
		
		if ( !this.Context ) {
			let handler_to_use = null;
			for ( let handler_name in this.Compiler.Handlers ) {
				let handler = this.Compiler.Handlers[ handler_name ];
				if ( handler.TriggerOn.indexOf( character ) >= 0 ) {
					handler_to_use = handler;
					break;
				}
			}
			if ( !handler_to_use ) {
				throw this.CreateError( 'unexpected character "' + character + '", aborting' );
			}
			this.Context = this.CreateContext( this, handler_to_use );
			this.Context.SourcePos = this.SourcePos;
			this.Context.LineNum = this.LineNum;
			this.Context.LinePos = this.LinePos;
			this.Context.Handler.Begin( this.Context );
		}
		
		if ( character === '\n' ) {
			this.LineNum++;
			this.LinePos = 1;
			this.Context.Source += character;
			this.SourcePos++;
			return;
		}
		
		let consume_needed = false;
		if ( this.Context.Handler.Process( this.Context, character ) ) {
			consume_needed = true;
		} else {
			consume_needed = this.Context.ConsumeNeeded;
			this.FinalizeContext();
		}
		
		
		if ( consume_needed ) {
			// read next character
			this.SourcePos++;
			if ( is_visible_character )
				this.LinePos++;
		}
	}
}

module.exports = Parser;
