class TestViewport extends require( '../Viewport' ) {
	
	constructor( session ) {
		super( module.filename, session );
		
		// [ anchors, offsets, width, height ]
		var test_data = [
			[ [ 'CC', 'CC' ], [ 0, 0 ], 100, 100, 'white' ], // square white in center
			[ [ 'TC', 'TC' ], [ 10, 0 ], 100, 300, 'blue' ], // vertical, 10px from top, at center
			[ [ 'CC', 'CL' ], [ 0, 60 ], 300, 100, 'green' ], // horizontal, 60px to the right from center
			[ [ 'CC', 'CR' ], [ 0, -60 ], 300, 100, 'green' ], // horizontal, 60px to the left from center
			[ [ 'BR', 'BR' ], [ 0, 0 ], 100, 100, 'red' ], // red square at bottom right corner
		];
		
		for ( var k in test_data ) {
			var t = test_data[ k ];
			this.AddElement( 'Test/TestBlock', t[ 0 ], t[ 1 ], {
				Width: t[ 2 ],
				Height: t[ 3 ],
				Color: t[ 4 ],
			});
		}
		
	}
	
}

module.exports = TestViewport;
