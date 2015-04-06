// http://callemall.github.io/material-ui/#/components/date-picker

var mo,
    Material = function ( ) {
    for( var k in this.module ) {
        this.module[k]._this = this;
        this.module[k].binding();
    }
}
Material.prototype.module = {};

Material.prototype.serializeEvent = function ( e ) {
    var t = e.originalEvent.touches;
    return t && t[0] ? t[0] : e;
};
Material.prototype.validEvent = function ( e ) {
    // Disable non-touch events, if we have touch, otherwise touchstart + mousedown will both be triggered
    if( e.type.indexOf("touch") == 0 ) this.touch = true;
    return ( this.touch && e.type.indexOf("touch") == 0 ) || !this.touch;
};

$(function(){ 
    mo = new Material(); 
});

/*
    Radio
    Dependency: Ripple
*/
$.extend( Material.prototype.module, { 
    radioCheckbox : {
        binding : function ( ) {
            // Basic ripple, removed by Ripple plugin
            $( "body" ).on( "mousedown touchstart", ":radio:not(:disabled) + .m-radio, :checkbox:not(:disabled) + .m-checkbox", this.checkDown );
        },
        checkDown : function ( e ) {
            if( mo.validEvent( e ) ) {
                var se			= mo.serializeEvent( e ),
                    el 			= $( this ),
                    ripple 		= $( "<div class='m-ripple-wave' />" ).appendTo( el ),
                    x 			= se.pageX - el.offset( ).left,
                    y 			= se.pageY - el.offset( ).top;

                ripple.css( {
                    left 		: x,
                    top			: y
                } );
                
                setTimeout( function ( ) {
                    ripple.addClass( "animate" );
                }, 0 );
            }
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
            $( "body" ).on( "mousedown touchstart", ".m-button", this.mousedown );
            $( "body" ).on( "mouseup touchend", this.mouseup );
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
            $( "body" ).on( "mousedown touchstart", ".m-ripple", this.rippleDown );
            $( "body" ).on( "mouseup touchend", this.rippleUp );
        },
        rippleDown : function ( e ) {
            if( mo.validEvent( e ) ) {
                var se			= mo.serializeEvent( e ),
                    el 			= $( this ),
                    ripple 		= $( "<div class='m-ripple-wave' />" ).appendTo( el ),
                    w			= el.outerWidth( ),
                    h 			= el.outerHeight( ),
                    size 		= Math.max(w, h),
                    x 			= se.pageX - el.offset( ).left,
                    y 			= se.pageY - el.offset( ).top,
                    halfsize 	= size / 2,
                    mid			= Math.abs( (w > h ? x : y) - halfsize);

                ripple.css( {
                    left 		: x,
                    top			: y,
                    transform	: "scale(" + size / ( (  1 - mid / halfsize + 1 ) * 8.5 ) + ")"
                } );
            }
        },
        rippleUp : function ( e ) {
            if( mo.validEvent( e ) ) {
                var ripple = $( ".m-ripple-wave" ).addClass( "fade" );
                    
                setTimeout( function ( ) {
                    ripple.remove( );
                }, 750);
            }
        }
    } 
});