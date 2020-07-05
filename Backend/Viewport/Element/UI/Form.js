class Form extends require( '../Layout/Panel' ) {
	
	constructor( filename ) {
		super( filename ? filename : module.filename );
		
		this.Fields = {};
		this.CurrentTopOffset = 0;
		
		this.SetCoreClass( module.filename );
		
		this.SetAttributes({
			FieldHeight: 130,
			FieldMargin: 10,
			FieldPadding: 10,
			InputHeight: 64,
			InputIndent: 80,
		});
		
		this.On( 'submit', ( data ) => {
			data.fields = {};
			for ( var k in this.Fields ) {
				var f = this.Fields[ k ];
					data.fields[ k ] = f.Input.Attributes.Value;
			}
		});
	}

	FocusField( name ) {
		var f = this.Fields[ name ];
		if ( f )
			f.Input.Focus();
	}
	
	AddInput( name, label, attributes ) {
		var f = {
			Panel: this.AddElement( 'Layout/Panel', [ 'CT', 'CT' ], [ 0, this.Attributes.FieldMargin + this.CurrentTopOffset ], {
				Width: this.Attributes.Width - this.Attributes.FieldMargin * 2,
				Height: this.Attributes.FieldHeight,
			})
		};
		f.Label = f.Panel.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ this.Attributes.FieldPadding, this.Attributes.FieldPadding ], {
			Text: label + ':',
		});
		f.Input = f.Panel.AddElement( 'UI/Input', [ 'RB', 'RB' ], [ -this.Attributes.FieldPadding, -this.Attributes.FieldPadding ], Object.assign( attributes ? attributes : {}, {
			Name: name,
			Width: this.Attributes.Width - this.Attributes.FieldMargin * 2 - this.Attributes.FieldPadding * 2 - this.Attributes.InputIndent,
			Height: this.Attributes.InputHeight,
			MaxLength: 21,
		}));
		
		if ( !this.CurrentTopOffset ) // first input
			f.Input.Focus();
			
		this.Fields[ name ] = f;
		this.CurrentTopOffset += this.Attributes.FieldHeight + this.Attributes.FieldMargin;
	}
	
	AddSubmit( label, attributes ) {
		this.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, this.Attributes.FieldMargin * 2 + this.CurrentTopOffset ], Object.assign( attributes ? attributes : {}, {
			Type: 'submit',
			DefaultButton: true,
			Label: label,
			Width: this.Attributes.Width - this.Attributes.FieldMargin * 2 - this.Attributes.FieldPadding * 2,
			Height: this.Attributes.InputHeight,
		}));
		
		this.CurrentTopOffset += this.Attributes.FieldHeight + this.Attributes.FieldMargin * 2;
	}
	
	ShowErrors( errors ) {
		for ( var k in errors ) {
			this.Viewport.ShowWindow( 'Window/Error', {
				ErrorText: errors[ k ],
			})
				.On( 'close', () => {
					this.FocusField( k );
				})
			;
			break;
		}
	}
	
}

module.exports = Form;
