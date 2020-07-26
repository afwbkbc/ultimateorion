// for recursive elements like {} () []

class Recursive extends require( './_Handler' ) {

	OnProcess( context ) {
		
		let source = context.Source.substring( 1, context.Source.length - 1 ); // strip brackets
		
		//console.log( 'SUBSCOPE', "|" + source + "|" );
		
		// parse scope contents recursively
		let parser = new ( require( '../Parser' ) )( context.Parser.Compiler, context );
		context.Data = parser.Parse( context.Parser.Namespace, source );
		
		// update linenum / linepos
		context.Parser.LineNum = parser.LineNum;
		context.Parser.LinePos = parser.LinePos; // + 1 to include length of closing bracket
	}
	
}

module.exports = Recursive;
