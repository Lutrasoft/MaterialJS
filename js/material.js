// http://callemall.github.io/material-ui/#/components/date-picker
var mo,
    Material = function ( ) {
    for( var k in this.module ) {
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
    if( !e.type.indexOf( "touch" ) ) this.touch = 1;
    return ( this.touch && !e.type.indexOf( "touch" ) ) || !this.touch;
};

$( function ( ) { 
    mo = new Material( ); 
} );

/*
    Input
*/
$.extend( Material.prototype.module, { 
    input : {
        binding : function ( ) {
            // Basic ripple, removed by Ripple plugin
            $( "body" ).on( "input focus",  ".m-input input", this.inputChange );
            $( "body" ).on( "blur",         ".m-input input", this.inputBlur );
        },
        inputChange : function ( ) {
            // In CSS we have a input[value] selector, this should be removed so we can redetect empty inputs
            // Note: If you have an empty value attribute, it will be shown as active
            //       for modern browsers we can think of input:not([value=""]) selector.
            
            // TODO: Bug when we have a pre filled value, it will be removed and empty.
            $( this )[this.value ? "addClass" : "removeClass"]( "m-active" ).val( this.value ).removeAttr( "value" );

            // Set Maxlength if available
            if( this.hasAttribute( "maxlength" ) ) {
                $( this ).closest( ".m-input" ).attr( {
                    "data-length" : this.value.length,
                    "data-maxlength" : this.maxLength
                } );
            }
        },
        inputBlur : function ( ) {
            if( this.maxLength ) {
                $( this ).closest( ".m-input" ).removeAttr( "data-length data-maxlength" );
            }
        }
    } 
} );

/*
    Radio
    Dependency: Ripple
*/
$.extend( Material.prototype.module, { 
    radioCheckbox : {
        binding : function ( ) {
            // Basic ripple, removed by Ripple plugin
            $( "body" ).on( "mousedown touchstart", ".m-radio, .m-checkbox", this.checkDown );
        },
        checkDown : function ( e ) {
            if( mo.validEvent( e ) && !$( this ).find( "input:disabled" ).length ) {
                var se          = mo.serializeEvent( e ),
                    el          = $( this ),
                    ripple      = $( "<div class='m-ripple-wave' />" ).appendTo( el ),
                    
                    x           = se.pageX - el.offset( ).left,
                    y           = se.pageY - el.offset( ).top;

                ripple.css( {
                    left        : x,
                    top	        : y
                } );
                
                setTimeout( function ( ) {
                    ripple.addClass( "animate" );
                }, 0 );
            }
        }
    } 
} );

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
} );

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
                var se          = mo.serializeEvent( e ),
                    el          = $( this ),
                    ripple      = $( "<div class='m-ripple-wave' />" ).appendTo( el ),
                    
                    w           = el.outerWidth( ),
                    h           = el.outerHeight( ),
                    x           = se.pageX - el.offset( ).left,
                    y           = se.pageY - el.offset( ).top,
                    
                    size        = Math.max( w, h ),
                    halfsize    = size / 2,
                    mid         = Math.abs( ( w > h ? x : y ) - halfsize );

                ripple.css( {
                    left        : x,
                    top	        : y,
                    transform   : "scale(" + size / ( (  1 - mid / halfsize + 1 ) * 8.5 ) + ")"
                } );
            }
        },
        rippleUp : function ( e ) {
            var ripple = $( ".m-ripple-wave" ).addClass( "fade" );
                
            setTimeout( function ( ) {
                ripple.remove( );
            }, 750 );
        }
    } 
} );

/*
    List : Sortable
*/
$.extend( Material.prototype.module, { 
    listSort : {
        binding : function ( ) {
            // Basic ripple, removed by Ripple plugin
            $( "body" ).on( "mousedown mousemove mouseup touchstart touchmove touchend", ".m-sortable li", $.proxy( this.dragEvent, this ) );
        },
        dragEvent : function ( e ) {
            e.preventDefault();
            
            if( mo.validEvent( e ) ) {
                // Every 10ms is more then enough
                //if( this.lastCall && new Date() - this.lastCall < 10 ) return;
                
                var el  = this.el || $( e.currentTarget ),
                    se  = mo.serializeEvent( e ),
                    y   = se.pageY;

                switch( e.type ){
                    case "mousedown":
                    case "touchstart":

                        this.down       = true;
                        this.top        = y;
                        this.offsetY    = se.pageY - el.offset( ).top;
                        this.el         = $( e.currentTarget );

                        break;
                    case "mousemove":
                    case "touchmove":
                        if( this.down ) {
                            var offsetY = this.offsetY;
                            
                            el.css( {
                                transform   : "translateY(" + ( y - this.top ) + "px)"
                            } )
                            .addClass( "m-drag z-depth-1-half" ); 
                            
                            // Should this be so hard?
                            var switchWith = el.siblings( ).filter( function ( ) {
                                var height  = $( this ).height( ),
                                    top     = $( this ).data( "newTop" ) || $( this ).offset( ).top,
                                    pos     = Math.abs( y - offsetY - top );
                                return pos < height / 2 && pos < height;
                            } );
                            
                            if( switchWith.length ){
                                var oldOffsetTop    = el.offset( ).top,
                                    oldSwitchTop    = switchWith.offset( ).top;
                                
                                if( el.prev( ).is( switchWith ) ) {
                                    el.after( switchWith );
                                } else {
                                    el.before( switchWith );
                                }
                                
                                // Reset transform, define new top, and place on the old position
                                el.css( "transform", "none" );
                                this.top = el.offset( ).top + this.offsetY;
                                el.css( "transform", "translateY(" + ( oldOffsetTop - el.offset( ).top ) + "px)" );
                                 
                                // Move the switched element
                                switchWith.css( "transform", "translateY(0)" );
                                switchWith.data( "newTop", switchWith.offset( ).top ); // Save new position, so if we drag over it, we can directly start moving backwards
                                switchWith.css( "transform", "translateY(" + -( switchWith.offset( ).top - oldSwitchTop ) + "px)" );
                                setTimeout( function ( ) {
                                    switchWith  .addClass( "m-animate" )
                                                .css( "transform", "translateY(0)" );
                                }, 0 );
                                setTimeout( function ( ) {
                                    switchWith  .removeData( "newTop" )
                                                .removeClass( "m-animate" );
                                }, 280 );
                            }
                        }
                        break;
                    case "mouseup":
                    case "touchend":
                        // Move the dropped element
                        var el      = this.el.removeClass( "m-drag z-depth-1-half" );
                        el.addClass( "m-animate" ).css( "transform", "translateY(0)" );
                        setTimeout( function ( ) {
                            el.removeClass( "m-animate" );
                        }, 280 );
                        
                        this.down   = false;
                        this.el     = null;
                        break
                }
            }
        }
    } 
} );


/*
    Input : Datepicker
*/
$.extend( Material.prototype.module, { 
    datepicker : {
        binding : function ( ) {
            $( "body" ).on( "focus", ".m-datepicker", $.proxy( this.open, this ) );
        },
        open : function ( e ) {
            var el      = $( e.currentTarget );
            this.date    = this.parse( el.val( ) );

            // Create dialog
            if( !this.diag ) {
            }
            
            this.diag.origin = el;
            
            this.diag.show();
        },
        baseHTML : function ( ) {
            return '..Month..';
        },
        // Only supports dd-mm-YYYY and YYYY-mm-dd
        parse : function ( s ) {
            var p = s.split("-");
            if( p[0].length == 4 ) {
                return new Date( p[0], p[1] - 1, p[2] );
            } else {
                return new Date( p[2], p[1] - 1, p[0] );
            }
        }
    } 
} );

Date.prototype.daysInMonth = function(){
    return new Date( this.getFullYear( ), this.getMonth( ) + 1, 0 ).getDate( );
}

function MToast ( settings ) {
    this.text		= "";
    this.autoClose	= 3000;	// time in MS to auto close the dialog, after the dialog is completely visible
    
    $.extend( this, settings );
    
    this.element    = $( this.baseHTML( ) );
    $( "body" ).append( this.element ) ;
}

$.extend( MToast.prototype, {
    show : function ( ) {
        setTimeout( $.proxy( function ( ) {
            this.element.addClass( "m-show" );

            if( this.autoClose ) {
                setTimeout( $.proxy( function ( ) {
                    this.hide( );
                }, this ), this.autoClose + 500 ); /* 500 = Animation time */
            }
        }, this ), 0 );
    },
    hide : function ( ) {
        this.element.removeClass( "m-show" );
    },
    destroy : function ( ) {
        this.element.remove( );

        for( var k in this ) {
            this[k] = null;   
        }
    },
    baseHTML : function ( ) {
        return "<div class='m-toast z-depth-3'>" + this.text + "</div>";
    }
} );
/*
    Default:
        No origin = Center of screen
*/
function MDialog ( settings ) {
    this.origin     = null;
    this.title		= null;
    this.html		= null;
    this.buttons	= null;	// [ { text : "", cb : null, close : false } ]
    this.autoClose	= null;	// time in MS to auto close the dialog, after the dialog is completely visible
    
    $.extend(this, settings);
    
    this.element    = $( this.baseHTML( ) );
    $( "body" ).append( this.element ) ;
    
    this.binding( );
}
$.extend( MDialog.prototype, {
    binding : function ( ) {
        var me = this;
        
        // Bind button clicks
        this.element.find( ".m-dialog-button" ).on( "click", function ( ) {
            var index = $( this ).index( ".m-dialog-button" ),
                b = me.buttons[index];

            if( b.cb ) {
                b.cb( this );   
            }
            
            if( b.close ) {
                me.hide( );
            }
        } );  
    },
    show : function ( ) {

        if( this.origin ) {
            var offset = this.origin.offset( );
            this.element.css({
                left		: offset.left + this.origin.width( ) / 2,
                top			: offset.top + this.origin.height( ) / 2,
                transform	: "translate(-50%,-50%) scale(0.0001)",
                display		: "block"
            });
        } else {
            this.element.css({
                left		: "50%",
                top			: $( "body" ).scrollTop( ) + $( window ).height( ) / 2,
                transform	: "translate(-50%,-50%) scale(0.0001)",
                display		: "block" 
            });
        }

        setTimeout( $.proxy( function( ){
            this.element.css( {
                transform: "translate(-50%,-50%) scale(1)",
                left: "50%",
                top: $( "body" ).scrollTop( ) + $( window ).height( ) / 2
            } );
        }, this ), 0 );

        if( !$( ".m-overlay" ).length ) {
            $( "body" ).append( "<div class='m-overlay'></div>" );
        }
        setTimeout( function ( ) {
            $( ".m-overlay" ).addClass( "m-show" );
        }, 0 );

        if( this.autoClose ) {
            setTimeout( $.proxy( function ( ) {
                this.hide( );
            }, this ), this.autoClose + 500 ); /* 500 = Animation time */
        }
    },
    hide : function ( ) {
        if( this.origin ) {
            var offset = this.origin.offset();
            this.element.css( {
                left		: offset.left + this.origin.width( ) / 2,
                top			: offset.top + this.origin.height( ) / 2,
                transform	: "translate(-50%,-50%) scale(0.0001)"
            } );
        } else {
            this.element.css( {
                left		: $( window ).width( ) / 2,
                top			: $( window ).height( ) / 2,
                transform	: "translate(-50%,-50%) scale(0.0001)"
            } );
        }
        
        setTimeout( $.proxy( function( ){
            this.element.css( {
                display : "none"
            } );
        }, this ), 500 );
        
        $( ".m-overlay" ).removeClass( "m-show" );
        
    },
    destroy : function ( ) {
        this.element.remove( );
        
        for( var k in this ) {
            this[k] = null;   
        }
    },
    baseHTML : function ( ) {
        return "<div class='m-dialog z-depth-3'>" +
            "<div class='m-dialog-head'>" + ( this.title ? "<div class='m-dialog-title'>" + this.title + "</div>" : "") + "</div>" +
            "<div class='m-dialog-body'>" + this.html + "</div>"+
            "<div class='m-dialog-footer'>" + this.buttonsHTML( ) + "</div>" +
            "</div>";
    },
    buttonsHTML : function ( ) {
        var html = "", i, b;
        if( this.buttons ) {
            for( i=0;i<this.buttons.length;i++){
                b = this.buttons[i];
                html += "<div class='m-dialog-button m-ripple'>" + b.text + "</div>";
            }
        }
        return html;
    }
} );