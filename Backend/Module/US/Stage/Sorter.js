/*
 * transforms raw .us source into array of primitives ( scopes are recursive )
 */

class Parser extends require( './_Stage' ) {
	
	CreateError( message, pos_back_by ) {
		return new Error( ( this.Namespace ? ( this.Namespace + '.us' ) : '<core>' ) + ':' + this.LineNum + ':' + ( this.LinePos - ( pos_back_by ? pos_back_by : 0 ) ) + ' : ' + message );
	}
	
	Process( source, parent_context ) {
		
		this.InvisibleCharacters = '\r\n';
		
		this.Source = source;
		this.Namespace = this.USObject.Namespace;
		this.SourcePos = 0;
		this.LineNum = 1;
		this.LinePos = 1;
		this.IsInsideString = false;
		this.IsInsideSingleLineComment = false;
		this.MultilineCommentDepth = 0;
		this.Context = null;
		this.ParsedData = [];
		
		if ( parent_context ) {
			this.ParentContext = parent_context;
			this.LineNum = this.ParentContext.LineNum;
			this.LinePos = this.ParentContext.LinePos + 1; // + 1 to include length of opening bracket of parent scope
		}
		
		let finalize = () => {
			
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
			this.Context = null;
		}
		
		while ( this.SourcePos < this.Source.length ) {
			
			
			let character = this.Source[ this.SourcePos ];
			let is_visible_character = this.InvisibleCharacters.indexOf( character ) < 0;
			
			if ( !this.IsInsideString ) { // strings have priority over comments
			
				if ( this.IsInsideSingleLineComment ) {
					if ( character === '\n' ) { // comment end
						this.IsInsideSingleLineComment = false;
						this.LineNum++;
						this.LinePos = 0;
					}
					this.SourcePos++;
					this.LinePos++;
					continue;
				}
				
				if ( character === '/' && this.Source[ this.SourcePos + 1 ] === '/' ) { // comment start
					this.IsInsideSingleLineComment = true;
					this.SourcePos += 2;
					this.LinePos += 2;
					continue;
				}
				
				if ( character === '/' && this.Source[ this.SourcePos + 1 ] === '*' ) { // comment start
					this.MultilineCommentDepth++;
					this.SourcePos += 2;
					this.LinePos += 2;
					continue;
				}
				
				if ( this.MultilineCommentDepth > 0 ) { // inside /* ... */, can be multi-line
					if ( character === '\n' ) {
						this.LineNum++;
						this.LinePos = 0;
					}
					else if ( character === '*' && this.Source[ this.SourcePos + 1 ] === '/' ) { // comment end
						this.MultilineCommentDepth--;
						this.SourcePos++;
						this.LinePos++;
					}
					this.SourcePos++;
					if ( is_visible_character )
						this.LinePos++;
					continue;
				}
			}
			
			if ( !this.Context ) {
				let handler_to_use = null;
				for ( let handler_name in this.USObject.Compiler.Handlers.Parser ) {
					let handler = this.USObject.Compiler.Handlers.Parser[ handler_name ];
					if ( handler.TriggerOn.indexOf( character ) >= 0 ) {
						handler_to_use = handler;
						break;
					}
				}
				if ( !handler_to_use ) {
					throw this.CreateError( 'unexpected character "' + character + '", aborting' );
				}
				this.Context = {
					Parser : this,
					Handler : handler_to_use,
				};
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
				continue;
			}
			
			let consume_needed = false;
			if ( this.Context.Handler.Process( this.Context, character ) ) {
				consume_needed = true;
			} else {
				consume_needed = this.Context.ConsumeNeeded;
				finalize();
			}
			
			
			if ( consume_needed ) {
				// read next character
				this.SourcePos++;
				if ( is_visible_character )
					this.LinePos++;
			}
			
			
		}
		
		if ( this.Context ) {
			if ( this.Context.Handler.StopOn ) {
				throw this.CreateError( 'expected ' + this.Context.Handler.StopOn + ', got ' + ( this.ParentContext ? this.ParentContext.Handler.StopOn : 'end of file' ) );
			}
			else {
				finalize();
			}
		}
		if ( this.MultilineCommentDepth > 0 ) {
			throw this.CreateError( 'expected */, got end of file' );
		}
		
		return this.ParsedData;
	}
	
}

module.exports = Parser;
