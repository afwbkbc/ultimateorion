class TestViewport extends require( '../Viewport' ) {
	
	constructor( session ) {
		super( module.filename, session );
		
		// [ anchors, offsets, width, height ]
		var test_data = [
			[ [ 'CC', 'CC' ], [ 0, 0 ], 100, 100, 'white' ], // square white in center
			[ [ 'CT', 'CT' ], [ 0, 10 ], 100, 300, 'blue' ], // vertical, 10px from top, at center
			[ [ 'CC', 'LC' ], [ 60, 0 ], 300, 100, 'green' ], // horizontal, 60px to the right from center
			[ [ 'CC', 'RC' ], [ -60, 0 ], 300, 100, 'rgba( 0, 100, 0, 0.5 )' ], // horizontal, 60px to the left from center
			[ [ 'RB', 'RB' ], [ 0, 0 ], 100, 100, 'red' ], // red square at bottom right corner
		];
		
		var elements = [];
		
		for ( var k in test_data ) {
			var t = test_data[ k ];
			elements.push( this.AddElement( 'Test/TestBlock', t[ 0 ], t[ 1 ], {
				Width: t[ 2 ],
				Height: t[ 3 ],
				Color: t[ 4 ],
			}) );
		}
		
		// add square inside white square
		var center_square_square = elements[ 0 ].AddElement( 'Test/TestBlock', [ 'CC', 'CC' ], [ 0, 0 ],  {
			Width: 50,
			Height: 50,
			Color: 'blue',
		});
		
		// add smaller square in top left corner of white square
		elements[ 0 ].AddElement( 'Test/TestBlock', [ 'LT', 'LT' ], [ 0, 0 ], {
			Width: 25,
			Height: 25,
			Color: 'yellow',
		});
		
		// add semi-transparent square with it's center at bottom right corner at first small center square
		var corner_square = center_square_square.AddElement( 'Test/TestBlock', [ 'RB', 'CC' ], [ 0, 0 ], {
			Width: 30,
			Height: 30,
			Color: 'rgba( 128, 128, 128, 0.5 )',
		});
		
		// slowly blink small center square ( with child square inside )
		this.Threads.Run( () => {
			if ( center_square_square.IsVisible )
				center_square_square.Hide();
			else
				center_square_square.Show();
		}, 1000 );
		
		// after a while hide corner square
		this.Threads.RunOnce( () => {
			corner_square.Hide();
		}, 10000 );

		var direction = -1;		
		// move red square left and right
		this.Threads.Run( () => {
			var el = elements[ 4 ];
			var offsets = el.GetOffsets();
			var left = offsets[ 0 ] + 10 * direction;
			if ( left <= -1820 )
				direction = 1;
			else if ( left >= 0 )
				direction = -1;
			el.SetOffsets( [ left, offsets[ 1 ] ] );
		}, 20 );
		
		// test some custom elements
		var window = this.AddElement( 'Layout/Window', [ 'LC', 'LC' ], [ 50, 0 ], {
			Title: 'Test Window',
			Width: 800,
			Height: 500,
		});
		
		// test button
		var test_button = window.Body.AddElement( 'UI/Button', [ 'CC', 'CC' ], [ 0, 0 ], {
			Label: 'Click me',
			Width: 400,
			Height: 100,
		});
	}
	
}

module.exports = TestViewport;
