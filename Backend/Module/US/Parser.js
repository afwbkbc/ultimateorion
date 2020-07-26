class Parser {
	
	constructor( compiler, parent_context ) {
		
		this.Compiler = compiler;
		this.ParentContext = parent_context ? parent_context : null;
		
		this.Source = null;
		this.SourcePos = 0;
		this.LineNum = this.ParentContext ? this.ParentContext.LineNum : 1;
		this.LinePos = this.ParentContext ? this.ParentContext.LinePos : 1;
		
		this.InvisibleCharacters = '\r\n';
		
		this.IsInComment = false;
		
		this.Context = null;
		this.ParsedData = [];
	}
	
	Parse( namespace, source, callbacks ) {
		if ( this.Source )
			throw new Error( 'Parser already running.' );
		
		this.Source = source;
		this.Namespace = namespace;
		
		while ( !this.IsFinished() ) {
			this.GetNextCharacter();
		}
		try {
		if ( this.Context ) {
			if ( this.Context.Handler.StopOn ) {
				throw new Error( this.Namespace + '.us:' + this.LineNum + ':' + this.LinePos + ' : expected ' + this.Context.Handler.StopOn + ', got end of file', this.Context );
			}
		}
		} catch ( e ) {
			console.log( 'ERROR', e );
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
	
	GetNextCharacter() {
		let character = this.Source[ this.SourcePos ];
		let is_visible_character = this.InvisibleCharacters.indexOf( character ) < 0;
		
		if ( this.IsInComment ) { // inside /* ... */, can be multi-line
			if ( character === '\n') {
				this.LineNum++;
				this.LinePos = 0;
			}
			else if ( character === '*' && this.Source[ this.SourcePos + 1 ] === '/' ) { // comment end
				this.IsInComment = false;
				this.SourcePos++;
				if ( is_visible_character )
					this.LinePos++;
			}
			this.SourcePos++;
			this.LinePos++;
			return;
		}
		
		if ( character === '/' && this.Source[ this.SourcePos + 1 ] === '*' ) { // comment start
			this.IsInComment = true;
			this.SourcePos += 2;
			return;
		}
		
		let context = null;
		let handler_to_use = null;
		
		if ( !this.Context ) {
			for ( let handler_name in this.Compiler.Handlers ) {
				let handler = this.Compiler.Handlers[ handler_name ];
				if ( handler.TriggerOn.indexOf( character ) >= 0 ) {
					handler_to_use = handler;
					break;
				}
			}
			if ( !handler_to_use ) {
				throw new Error( 'unexpected character "' + character + '", aborting' );
			}
			context = this.CreateContext( this, handler_to_use );
			context.SourcePos = this.SourcePos;
			context.LineNum = this.LineNum;
			context.LinePos = this.LinePos;
			
			this.Context = context;
			handler_to_use.Begin( context );
		}
		else {
			context = this.Context;
			handler_to_use = context.Handler;
		}
		
		let consume_needed = false;
		if ( handler_to_use.Process( context, character ) ) {
			consume_needed = true;
		} else {
			// finalize, save result and get out
			handler_to_use.End( context );
			consume_needed = context.ConsumeNeeded;
			if ( true || context.Data ) {
				this.ParsedData.push({
					handler: handler_to_use.Name,
					source_pos_from: context.SourcePos,
					source_pos_to: this.SourcePos,
					line_num_from: context.LineNum,
					line_pos_from: context.LinePos,
					line_num_to: this.LineNum,
					line_pos_to: this.LinePos - ( consume_needed ? 0 : 1 ),
					source : context.Source ? context.Source : null,
					//data: context.Data ? context.Data : null,
					data: context.Data,
				});
			}
			this.Context = null;
		}
		
		if ( consume_needed ) {
			// read next character
			this.SourcePos++;
			if ( is_visible_character ) {
				this.LinePos++;
			}
		}
	}
}

module.exports = Parser;
