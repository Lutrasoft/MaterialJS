// http://callemall.github.io/material-ui/#/components/date-picker

var Material = function ( ) {
	//this.binding( );
	for( var k in this.module ) {
		this.module[k].binding();
	}
}
Material.prototype.module = {};

$(function(){ new Material(); });

/*
	Radio
	Dependency: Ripple
*/
$.extend( Material.prototype.module, { 
	radioCheckbox : {
		binding : function ( ) {
			// Basic ripple, removed by Ripple plugin
			$( "body" ).on( "mousedown", ":radio:not(:disabled) + .m-radio, :checkbox:not(:disabled) + .m-checkbox", this.checkDown );
		},
		checkDown : function ( e ) {
			var el 			= $( this ),
				ripple 		= $( "<div class='m-ripple-wave' />" ).appendTo( el ),
				x 			= e.pageX - el.offset( ).left,
				y 			= e.pageY - el.offset( ).top;

			ripple.css( {
				left 		: x,
				top			: y
			} );
			
			setTimeout( function ( ) {
				ripple.addClass( "animate" );
			}, 0 );
		}
	} 
});
/*
	Button
*/
$.extend( Material.prototype.module, { 
	button : {
		binding : function ( ) {
			// Basic ripple
			$( "body" ).on( "mousedown", ".m-button", this.mousedown );
			$( "body" ).on( "mouseup", this.mouseup );
		},
		mousedown : function ( ) {
			$( this ).addClass("m-down");
		},
		mouseup : function ( ) {
			$( ".m-down" ).removeClass("m-down");
		}
	} 
});
/*
	Ripple
*/
$.extend( Material.prototype.module, { 
	ripple : {
		binding : function ( ) {
			// Basic ripple
			$( "body" ).on( "mousedown", ".m-ripple", this.rippleDown );
			$( "body" ).on( "mouseup", this.rippleUp );
		},
		rippleDown : function ( e ) {
			var el 			= $( this ),
				ripple 		= $( "<div class='m-ripple-wave' />" ).appendTo( el ),
				w			= el.outerWidth( ),
				h 			= el.outerHeight( ),
				size 		= Math.max(w, h),
				x 			= e.pageX - el.offset( ).left,
				y 			= e.pageY - el.offset( ).top,
				halfsize 	= size / 2,
				mid			= Math.abs( (w > h ? x : y) - halfsize);

		
			ripple.css( {
				left 		: x,
				top			: y,
				transform	: "scale(" + size / ( (  1 - mid / halfsize + 1 ) * 8.5 ) + ")"
			} );
		},
		rippleUp : function ( ) {
			var ripple = $( ".m-ripple-wave" ).addClass( "fade" );
				
			setTimeout( function ( ) {
				ripple.remove( );
			}, 750);
		}
	} 
});