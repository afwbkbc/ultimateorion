// for recursive elements like {} () []

class Recursive extends require( './_Handler' ) {

	OnProcess( context ) {
		
		let source = context.Source.substring( 1, context.Source.length - 1 ); // strip brackets
		
		// parse scope contents recursively, then attach to context
		let parser = context.Parser.SpawnChild( context );
		context.Data = parser.Process( source );
		
		// update linenum / linepos from child
		context.Parser.LineNum = parser.LineNum;
		context.Parser.LinePos = parser.LinePos; // + 1 to include length of closing bracket
	}
	
}

module.exports = Recursive;
