/**
 * Main JavaScript functionality for Qusq Lite
 *
 * @package Qusq_Lite
 */

"use strict";
/*--------------------------------------------------------------
 TABLE OF CONTENTS:
 ----------------------------------------------------------------
 # Vars
 # Settings
 # Document Ready
 # Document Post Load

 # Functions
 ## Function Exists
 ## Touch Detection
 ## Enable Hovers
 ## Disable Hovers
 ## Sticky Header
 ## Prepare Navigation Active Item
 ## Show - Hide Navigation
 ## Click Navigation
 ## Prevent Navigation With Submenu
 ## Back To Top Button
 ## Decoration Height
 ## Portfolio
 ## Blog
 ## InfiniteScroll
 ## Content Parallax
 ## Content Images Shadows
 ## LightBox - Single WP Images
 ## LightBox - Activate
 ## Validate Form - Contact Form
 ## Gallery
 ## Trip Tooltip
 ## Arrange Widget Recent Projects
 --------------------------------------------------------------*/


/*--------------------------------------------------------------
 # Vars
 --------------------------------------------------------------*/
if ( ish == null || typeof(ish) !== "object" ) {
	var ish = {}
}

var ishStickyOn = false;
var ishAnimValue = 300;
var ishPageEffectAnimSpeed = 500; // Also change speed in _layout.scss.
var ishCurrentScreenTopPos = 0;
var ishMacy;
var ishMacyActive = [];
var ishPortfolioAnimation;
var ishBlogAnimation;
var ishPortfolioTimer;

var ishBlogAnimationData = {
	container_selector: '.ish-blog-masonry.ish-scroll-anim.ish-2col',
	items_selector: ' > .ish-item',
	minDuration: 0.4,
	maxDuration: 0.7,
	viewportFactor: 0,
	animate_odd_items: true,
	animate_even_items: false,
	animate_captions: false,
	even_items_animation_speed: 0.85,
	firstRun: true
};

var ishPortfolioAnimationData = {
	container_selector: '.ish-pflo-gal.ish-scroll-anim.ish-2col',
	items_selector: ' > .ish-item',
	minDuration: 0.4,
	maxDuration: 0.7,
	viewportFactor: 0,
	animate_odd_items: false,
	animate_even_items: true,
	animate_captions: true,
	even_items_animation_speed: 0.85,
	firstRun: true
};

var lightBoxArgs = {
	selector: 'a',
	speed: 250,
	download: false,
	thumbnail: false,
	autoplay: false,
	share: false,
	autoplayControls: false
};

var ishHasTouch = false;
var ishEnabledHoversArray = [];


/*--------------------------------------------------------------
 # Settings
 --------------------------------------------------------------*/
var ishStickySmart = true;


/*--------------------------------------------------------------
 # Document Ready
 --------------------------------------------------------------*/
jQuery( document ).ready( function( $ ) {

	ish.pageEffectOnLoad();
	ish.activateTouchDetection();
	ish.activatePortfolio();
	ish.activateBlog();
	ish.controlStickyHeader();
	ish.activateContentParallax();
	ish.activateContentImagesShadows();
	ish.prepareNavigationActiveItem();
	ish.showHideNavigation();
	ish.backToTopButton();
	ish.clickNavigation();
	ish.preventNavWithSubmenu();
	ish.prepareWpImagesBeforeLightBox();
	ish.activateLightBox();
	ish.validateForm();
	ish.decorationHeight();
	ish.arrangeWidgetRecentProjects();

	// Must Be Called as last.
	ish.pageEffectOnUnload();

} );


/*--------------------------------------------------------------
 # Document Post Load
 --------------------------------------------------------------*/
jQuery( document.body ).on( 'post-load', function () {
	ish.initInfiniteScroll();
});


/*--------------------------------------------------------------
 # Functions
 --------------------------------------------------------------*/

/*--------------------------------------------------------------
 ## Function Exists
 --------------------------------------------------------------*/
function functionExists( name ) {
	return( 'function' === eval( 'typeof ish.' + name ) );
}


/*--------------------------------------------------------------
 ## Add page effect on load page and on leave page
 --------------------------------------------------------------*/
if ( ! functionExists( 'pageEffectOnLoad' ) ) {
	ish.pageEffectOnLoad = function() {

		// Change to support Firefox & Safari back buttons - pageshow is fired even when page served from browser's cache.
		window.addEventListener( 'pageshow', function( event ) {
			setTimeout( function() {
				jQuery( 'body' ).addClass( 'ish-no-blur' );
				jQuery( '.ish-blurred-overlay' ).fadeOut( ishPageEffectAnimSpeed );
			}, 0);
		});
	}
}

if ( ! functionExists( 'pageEffectOnUnload' ) ) {
	ish.pageEffectOnUnload = function() {

		jQuery( '.ish-blurred a' ).click( function( event ) {

			if ( ! ( event.defaultPrevented || event.isDefaultPrevented() || event.ctrlKey || event.shiftKey || event.metaKey || event.which == 2 ) ) {

				// Run only if another action event has not prevented the link from running.
				var actTarget = event.currentTarget;
				var actTargetHref = actTarget.getAttribute( 'href' );
				var openNewWindow = ( '_blank' == actTarget.getAttribute( 'target' ) );

				if ( 0 > actTargetHref.indexOf( '#' ) && ! openNewWindow && false == jQuery( actTarget ).parent().hasClass( 'menu-item-has-children' ) ) {
					event.preventDefault();
					jQuery( 'body' ).removeClass( 'ish-no-blur' );
					jQuery( '.ish-blurred-overlay' ).fadeIn( ishPageEffectAnimSpeed );
					setTimeout( function() {
						window.location = actTargetHref;
					}, ishPageEffectAnimSpeed );
				}

			}

		});
	}
}


/*--------------------------------------------------------------
 ## Sticky Header
 --------------------------------------------------------------*/
if ( ! functionExists( 'controlStickyHeader' ) ) {
	ish.controlStickyHeader = function() {

		jQuery( document ).on( 'scroll', function() {

			var screenTop = jQuery( document ).scrollTop();
			var scrollStepValue = 50;

			if ( ( ( ishCurrentScreenTopPos - scrollStepValue ) > screenTop ) ||
				( ( ishCurrentScreenTopPos + scrollStepValue ) < screenTop ) ) {

				var siteHeader = jQuery( '.site-header' );
				var ishHeader = jQuery( '.ish-header' );
				var headerHeight = siteHeader.find( '.ish-header' ).outerHeight( true );
				var topValue = siteHeader.find( '.ish-container-fluid:first-child' ).outerHeight( true ) - 100;

				// switch classic header to sticky header.
				if ( ( topValue - 100 < screenTop ) && ( false === ishStickyOn ) ) {

					ishStickyOn = true;
					siteHeader.find( '.ish-header' ).css( 'display', 'block' );

					ishHeader.stop( true, true ).fadeOut( ishAnimValue, function () {
						ishHeader.before( '<div class="ish-replace-header" style="height: ' + headerHeight + 'px; width: 100%;"></div>' );
						siteHeader.addClass( 'ish-sticky-on' );

						if ( false === ishStickySmart ) {
							ishHeader.stop( true, true ).fadeIn( ishAnimValue );
						}

					});

					ishCurrentScreenTopPos = screenTop;

				} else if ( ( topValue < screenTop ) && ( true === ishStickyOn ) ) {

					if ( ishCurrentScreenTopPos >= screenTop ) {
						ishHeader.stop( true, true ).fadeIn( ishAnimValue );
					} else if ( ( ishCurrentScreenTopPos < screenTop ) && ( true === ishStickySmart ) ) {
						ishHeader.stop( true, true ).fadeOut( ishAnimValue );
					}

					ishCurrentScreenTopPos = screenTop;

				} else if ( ( topValue - 100 >= screenTop ) && ( true === ishStickyOn ) ) {

					ishStickyOn = false;
					ishHeader.stop( true, true ).fadeOut( ishAnimValue, function () {
						siteHeader.find( '.ish-replace-header' ).remove();
						siteHeader.removeClass( 'ish-sticky-on' );
						siteHeader.find( '.ish-header' ).css( 'display', 'table' );
						ishHeader.stop( true, true ).fadeIn( ishAnimValue );
					});

					ishCurrentScreenTopPos = screenTop;

				} else {
					ishCurrentScreenTopPos = screenTop;
				} // End if().
			} // End if().
		})
	}
} // End if().


/*--------------------------------------------------------------
 ## Touch Detection
 --------------------------------------------------------------*/
if ( ! functionExists( 'activateTouchDetection' ) ) {
	ish.activateTouchDetection = function() {
		window.addEventListener( 'touchstart', function ishSetHasTouch () {
			ishHasTouch = true;

			// Remove event listener once fired, otherwise it'll kill scrolling.
			// performance.
			window.removeEventListener( 'touchstart', ishSetHasTouch );

			// Disable hovers on problematic elements.
			ish.ishDisableHovers();
		}, false);

	}
}


/*--------------------------------------------------------------
 ## Enable Hovers
 --------------------------------------------------------------*/
if ( ! functionExists( 'ishEnableHovers' ) ) {
	ish.ishEnableHovers = function( object ) {
		object.hover( function () {
			jQuery( this ).toggleClass( 'ish-hover' );
		});

		ishEnabledHoversArray.push( object );
	}
}


/*--------------------------------------------------------------
 ## Disable Hovers
 --------------------------------------------------------------*/
if ( ! functionExists( 'ishDisableHovers' ) ) {
	ish.ishDisableHovers = function( element ) {

		if ( typeof( element ) === 'undefined' ) {
			// No parameter provided, so disable all hovers.
			ishEnabledHoversArray.forEach( function( el ) {
				el.unbind( 'mouseenter mouseleave' );
			});

			ishEnabledHoversArray = [];
		} else {
			// only disable the hover for the provided element.
			element.unbind( 'mouseenter mouseleave' );
		}
	}
}


/*--------------------------------------------------------------
 ## Prepare Navigation Active Item
 --------------------------------------------------------------*/
if ( ! functionExists( 'prepareNavigationActiveItem' ) ) {
	ish.prepareNavigationActiveItem = function() {
		var activeItem = jQuery( '.current-menu-item, .current_page_item' );
		activeItem.parents( 'li' ).find( 'ul' ).css( 'display', 'block' );
	}
}


/*--------------------------------------------------------------
 ## Show - Hide Navigation
 --------------------------------------------------------------*/
if ( ! functionExists( 'showHideNavigation' ) ) {
	ish.showHideNavigation = function() {

		var showHideDelay = 500;
		var ishNavigation = jQuery( '.ish-navigation' );
		var setOpacity = function( displayVal ){
			ishNavigation.css( 'opacity', displayVal );
		};

		jQuery( '.ish-menu-container a, .ish-nav-close' ).click( function( event ) {
			event.preventDefault();
			if ( ishNavigation.hasClass( 'ish-nav-on' ) ) {
				ishNavigation.removeClass( 'ish-nav-on' );
				setTimeout( function(){ setOpacity( '0' ) }, showHideDelay );
			} else {
				setTimeout( function(){ setOpacity( '1' ) }, 0 );
				ishNavigation.addClass( 'ish-nav-on' );
			}
		});

		jQuery( document ).keyup( function( e ) {
			if ( e.keyCode == 27 ) {
				ishNavigation.removeClass( 'ish-nav-on' );
				setTimeout( function() { setOpacity( '0' ) }, showHideDelay );
			}
		});
	}
}


/*--------------------------------------------------------------
 ## Click Navigation
 --------------------------------------------------------------*/
if ( ! functionExists( 'clickNavigation' ) ) {
	ish.clickNavigation = function() {
		var ishNavItem = jQuery( '.ish-navigation li' );

		if ( ishNavItem.length > 0 ) {
			// Do not assign "hover" event on touch enabled devices so it does not prevent "click" from firing (mainly iOS)
			// The famous double tap issue on iPhones..
			// Modernizr.touch.
			if ( ! ishHasTouch ) {
				ish.ishEnableHovers( ishNavItem );
			}

			ishNavItem.find( 'a' ).on( 'click', function () {

				jQuery( this ).siblings( 'ul' ).slideToggle();

				// Trigger "hover" state styles only after the click event has been fired (workaround for iOS)
				// Modernizr.touch.
				if ( ishHasTouch ) {
					jQuery( this ).parent().toggleClass( 'ish-hover' );
				}
			});
		}

	}
}


/*--------------------------------------------------------------
 ## Prevent Navigation With Submenu
 --------------------------------------------------------------*/
if ( ! functionExists( 'preventNavWithSubmenu' ) ) {
	ish.preventNavWithSubmenu = function() {
		jQuery( '.menu-item-has-children > a, .page_item_has_children > a' ).click( function( event ) {
			event.preventDefault();
		})
	}
}

/*--------------------------------------------------------------
 ## Back To Top
 --------------------------------------------------------------*/
if ( ! functionExists( 'backToTopButton' ) ) {
	ish.backToTopButton = function() {
		var backToTopBtn = jQuery( '.ish-back-to-top > a' );

		if ( backToTopBtn.length > 0 ) {

			// Do not assign "hover" event on touch enabled devices so it does not prevent "click" from firing (mainly iOS)
			// The famous double tap issue on iPhones..
			// Modernizr.touch.
			if ( ! ishHasTouch ) {
				ish.ishEnableHovers( backToTopBtn );
			}

			backToTopBtn.click( function (event) {

				event.preventDefault();
				jQuery( 'html, body' ).animate( {scrollTop: 0}, 500 );

				// Trigger "hover" state styles only after the click event has been fired (workaround for iOS)
				// Modernizr.touch.
				if ( ishHasTouch ) {
					jQuery( this ).toggleClass( 'ish-hover' );
				}

			})
		}

	}
}


/*--------------------------------------------------------------
 ## Decoration height
 --------------------------------------------------------------*/
if ( ! functionExists( 'decorationHeight' ) ) {
	ish.decorationHeight = function() {

		applyDecorHeight();

		jQuery( window ).resize( function() {
			applyDecorHeight();
		});

		function applyDecorHeight() {
			var decorHeight = Math.round( 0.177 * jQuery( window ).width() ) + 10 ; // 0.177 = tan 10° // 10 = margin 10px.
			jQuery( '.ish-decor-container' ).css( 'height', decorHeight + 'px' );
			jQuery( '.ish-no-content header' ).css( 'margin-bottom', '-' + decorHeight + 'px' );
			jQuery( '#map' ).css( 'margin', '-' + decorHeight + 'px 0' );
		}
	}
}


/*--------------------------------------------------------------
 ## Portfolio
 --------------------------------------------------------------*/
if ( ! functionExists( 'activatePortfolio' ) ) {
	ish.activatePortfolio = function() {

		if ( typeof ishMacyActive['portfolio'] === "undefined" ) {
			ishMacyActive['portfolio'] = false;
		}

		var portfolio = jQuery( '.ish-pflo-gal.ish-2col' );
		if ( portfolio.length > 0 ) {

			var checkPortfolio = function() {

				var windowWidth = window.innerWidth || document.body.clientWidth; // Including scrollbar width.

				if ( 768 <= windowWidth ) {
					if ( ! ishMacyActive['portfolio'] ) {

						// Activate Masonry layout.
						Macy.init({
							container: '.ish-pflo-gal.ish-2col',
							columns: 2
						});

						ishMacyActive['portfolio'] = true;
						if ( portfolio.hasClass( 'ish-scroll-anim' ) ) {
							// Activate Scrolling Animation.
							ishPortfolioAnimation = new AnimOnScroll( ishPortfolioAnimationData );
						}
					}
				} else {
					if ( ishMacyActive['portfolio'] ) {
						Macy.remove();
						ishPortfolioAnimation._remove();
						ishMacyActive['portfolio'] = false;

						// Reposition captions.
						var ishPortfolio = jQuery( '.ish-pflo-gal.ish-scroll-anim.ish-2col' );
						if ( ishPortfolio.length ) {
							ishPortfolio.find( '.ish-caption' ).attr( 'style', '' );
						}

					}
				}

			};

			checkPortfolio();

			jQuery( window ).resize( function() {

				clearTimeout( ishPortfolioTimer );
				ishPortfolioTimer = setTimeout( checkPortfolio, 300 );

			});

		} // End if().
	}
} // End if().


/*--------------------------------------------------------------
 ## Blog
 --------------------------------------------------------------*/
if ( ! functionExists( 'activateBlog' ) ) {
	ish.activateBlog = function() {

		if ( typeof ishMacyActive['blog'] === "undefined" ) {
			ishMacyActive['blog'] = false;
		}

		var blog = jQuery( '.ish-blog-masonry.ish-2col' );
		if ( blog.length > 0 ) {

			var checkBlog = function() {

				var windowWidth = window.innerWidth || document.body.clientWidth; // Including scrollbar width.

				if ( 768 <= windowWidth ) {
					if ( ! ishMacyActive['blog'] ) {

						// Activate Masonry layout.
						Macy.init({
							container: '.ish-blog-masonry.ish-2col',
							columns: 2
						});

						ishMacyActive['blog'] = true;
						if ( blog.hasClass( 'ish-scroll-anim' ) ) {
							// Activate Scrolling Animation.
							ishBlogAnimation = new AnimOnScroll( ishBlogAnimationData );
						}
					}
				} else {
					if ( ishMacyActive['blog'] ) {
						Macy.remove();
						ishBlogAnimation._remove();
						ishMacyActive['blog'] = false;
					}
				}

			};

			checkBlog();

			jQuery( window ).resize( function() {
				checkBlog();
			});

		} // End if().
	}
} // End if().

/*--------------------------------------------------------------
 ## Infinite Scroll
 --------------------------------------------------------------*/
if ( ! functionExists( 'initInfiniteScroll' ) ) {
	ish.initInfiniteScroll = function () {

		var blog = jQuery( '.ish-blog-masonry.ish-2col' );
		var portfolio = jQuery( '.ish-pflo-gal.ish-2col' );
		var windowWidth = window.innerWidth || document.body.clientWidth; // Including scrollbar width.

		var macyRecalculate = function( callback ) {
			if ( 0 < jQuery( '.infinite-loader' ).length ) {

				// Removing old preloader elements.
				jQuery( '.infinite-loader' ).remove();

				// Set delay before recalculating posts.
				setTimeout( function () {
					Macy.recalculate();

					callback();
				}, 100);

			}
		};

		if ( blog.length > 0 ) {

			if ( 768 <= windowWidth ) {

				macyRecalculate( function callback() {
					if ( blog.hasClass( 'ish-scroll-anim' ) ) {

						// Activate Scrolling Animation.
						var data = ishBlogAnimationData;
						data.firstRun = false;

						ishBlogAnimation = new AnimOnScroll( data );
					}
				} );
			}

		} else if ( portfolio.length > 0 ) {

			if ( 768 <= windowWidth ) {

				macyRecalculate( function callback() {
					if ( portfolio.hasClass( 'ish-scroll-anim' ) ) {

						// Activate Scrolling Animation.
						var data = ishPortfolioAnimationData;
						data.firstRun = false;

						ishPortfolioAnimation = new AnimOnScroll( data );
					}
				} );

			} else {
				// Removing old preloader elements.
				jQuery( '.infinite-loader' ).remove();
			}

		} // End if().
	}
} // End if().


/*--------------------------------------------------------------
 ## Content Parallax
 --------------------------------------------------------------*/
if ( ! functionExists( 'activateContentParallax' ) ) {
	ish.activateContentParallax = function() {
		var parallaxSection = jQuery( '.ish-content-parallax' );

		if ( parallaxSection.length ) {
			var parallaxSpeed = jQuery.isNumeric( parallaxSection.attr( 'data-parallax-speed' ) ) ?
				parallaxSection.attr( 'data-parallax-speed' ) : 0.7;

			var positionContentParallax = function() {
				var scrolled = jQuery( window ).scrollTop();

				if ( parallaxSection.attr( 'data-initial-top' ) ) {
					parallaxSection.css( 'margin-top', parallaxSection.attr( 'data-initial-top' ) - scrolled + ( scrolled * parallaxSpeed ) + 'px' );
				} else {
					parallaxSection.attr( 'data-initial-top', ( jQuery.isNumeric( parseInt( parallaxSection.css( 'margin-top' ), 10 ) ) ) ? parseInt( parallaxSection.css( 'margin-top' ), 10 ) : 0 );
					parallaxSection.css( 'margin-top', parallaxSection.attr( 'data-initial-top' ) - scrolled + ( scrolled * parallaxSpeed ) + 'px' );
				}

			};

			var callPositionContentParallax = function() {

				var windowWidth = window.innerWidth || document.body.clientWidth; // Including scrollbar width.

				if ( 768 <= windowWidth ) {
					positionContentParallax();
				}
			};

			callPositionContentParallax();

			jQuery( document ).scroll( function() {
				callPositionContentParallax();
			});

			jQuery( window ).resize(function() {
				var scrolled = jQuery( window ).scrollTop();

				parallaxSection.css( 'margin-top', '' );
				parallaxSection.attr( 'data-initial-top', '' );
				callPositionContentParallax();

			});

		} // End if().

	}
} // End if().


/*--------------------------------------------------------------
 ## Content Images Shadows
 --------------------------------------------------------------*/
if ( ! functionExists( 'activateContentImagesShadows' ) ) {
	ish.activateContentImagesShadows = function() {

		// Add shadows to regular WordPress images - to disable it, manually add ".ish-no-shadow" and ".ish-no-scale" classes.
		var thumbnails = jQuery( ".ish-main-content a:has(img[class*='wp-image-'])" );
		var alignlefts = jQuery( ".ish-main-content a:has(img[class*='wp-image-']):has(img[class*='alignleft'])" );
		var alignrighs = jQuery( ".ish-main-content a:has(img[class*='wp-image-']):has(img[class*='alignright'])" );
		var aligncenters = jQuery( ".ish-main-content a:has(img[class*='wp-image-']):has(img[class*='aligncenter'])" );

		// Add shadows.
		var shadows = thumbnails.not( ".ish-no-shadow, .ish-no-shadow-scale" );
		if ( shadows.length > 0 ) {
			shadows.addClass( 'ish-img-shadow' );
		}

		// Add scale.
		var scales = thumbnails.not( ".ish-no-scale, .ish-no-shadow-scale" );
		if ( scales.length > 0 ) {
			scales.addClass( 'ish-img-scale' );
		}

		// Add aligns.
		if ( alignlefts.length > 0 ) {
			alignlefts.addClass( 'ish-img-align-left' );
		}
		if ( alignrighs.length > 0 ) {
			alignrighs.addClass( 'ish-img-align-right' );
		}
		if ( aligncenters.length > 0 ) {
			aligncenters.addClass( 'ish-img-align-center' );
		}

		// Add shadows to regular WordPress images - without any link.
		var thumbnails = jQuery( ".ish-main-content" ).find( "p > img[class*='wp-image-'], .wp-caption > img[class*='wp-image-']" ).not( ".ish-no-shadow, .ish-img-shadow" );
		if ( thumbnails.length > 0 ) {
			thumbnails.addClass( 'ish-img-shadow' );
		}

	}
} // End if().


/*--------------------------------------------------------------
 ## LightBox - Single WP Images
 --------------------------------------------------------------*/
if ( ! functionExists( 'prepareWpImagesBeforeLightBox' ) ) {
	ish.prepareWpImagesBeforeLightBox = function() {

		// Content images - group them all together.
		var thumbnails = jQuery( ".ish-main-content a:has(img[class*='wp-image-'])" ).not( ".ish-no-lightbox, .ish-lightbox-single" ).filter( function() { return /\.(jpe?g|png|gif|bmp)$/i.test( jQuery( this ).attr( 'href' ) ) } );
		if ( thumbnails.length > 0 ) {
			thumbnails.addClass( 'ish-lightbox' );
		}
		// Sidebar images - keep them separated.
		var thumbnails = jQuery( ".widget a:has(img)" ).not( ".ish-no-lightbox, .ish-lightbox" ).filter( function() { return /\.(jpe?g|png|gif|bmp)$/i.test( jQuery( this ).attr( 'href' ) ) } );
		if ( thumbnails.length > 0 ) {
			thumbnails.addClass( 'ish-lightbox-single' );
		}

	}
}


/*--------------------------------------------------------------
 ## LightBox - Activate
 --------------------------------------------------------------*/
if ( ! functionExists( 'activateLightBox' ) ) {
	ish.activateLightBox = function() {

		// Copy arguments and create a new object, "var options = lightBoxArgs;" only references the existing.
		var options = jQuery.extend( {}, lightBoxArgs );

		// Activate grouped galleries.
		options.selector = '.ish-lightbox, .ish-sc-gallery a';
		jQuery( 'body' ).lightGallery( options );

		// Activate single images.
		options.selector = 'this';
		jQuery( '.ish-lightbox-single' ).lightGallery( options );

	}
}


/*--------------------------------------------------------------
 ## Validate Form - Contact Form
 --------------------------------------------------------------*/
if ( ! functionExists( 'validateForm' ) ) {
	ish.validateForm = function() {

		// Adding stars and attribute "required" for required inputs.
		jQuery( 'form .required' ).each( function() {
			var phValue = jQuery( this ).attr( 'placeholder' );
			jQuery( this ).attr( 'placeholder', phValue + ' *' );
			jQuery( this ).attr( 'required', 'required' );
		});

		// Validate form.
		jQuery( 'form input[type="text"].required' ).on( 'input', function() {
			verifyText( jQuery( this ) );
		});

		jQuery( 'form input[type="email"]' ).on( 'input', function() {
			verifyEmail( jQuery( this ) );
		});

		jQuery( 'form input[type="url"]' ).on( 'input', function() {
			verifyUrl( jQuery( this ) );
		});

		jQuery( 'form textarea.required' ).keyup( function() {
			verifyMessage( jQuery( this ) );
		});

		// Verify form on submit.
		jQuery( 'form input[type="submit"], form button[type="submit"]' ).click( function( e ) {
			var thisForm = jQuery( this ).closest( 'form' );

			thisForm.find( 'input.required, textarea.required' ).each( function() {
				var thisEl = jQuery( this );
				switch ( thisEl.attr( 'type' ) ) {
					case 'text':
						verifyText( thisEl );
						break;
					case 'email':
						verifyEmail( thisEl );
						break;
					case 'url':
						verifyUrl( thisEl );
						break;
					default:
						verifyText( thisEl );
				}
			});

			if ( 0 == thisForm.find( '.invalid' ).length ) {

				thisForm.submit( function( event ) {

					if ( 'ish-contact-form' == thisForm.attr( 'id' ) ) {
						var url = "ajax.php";

						jQuery.ajax({
							type: "POST",
							url: url,
							data: thisForm.serialize(), // serializes the form's elements.
							success: function( data ) {
								var obj = jQuery.parseJSON( data );

								if ( 'success' == obj.message ) {
									alert( "Email has been sent." );
									location.reload();
								} else if ( 'error' == obj.message ) {
									alert( "ERROR! Something went wrong." );
								} else {
									location.reload();
								}

							},
							error: function () {
								alert( "ERROR! Something went wrong." );
							}
						});

						return false;
					}
				});

			} else {
				return false;
			} // End if().
		});

		// Name can't be blank.
		function verifyText( thisEl ) {
			var isName = thisEl.val();
			if ( isName ) {
				thisEl.removeClass( "invalid" ).addClass( "valid" );
				thisEl.parent().removeClass( "required-error" );
			} else {
				thisEl.removeClass( "valid" ).addClass( "invalid" );
				thisEl.parent().addClass( "required-error" );
			}
		}

		// Email must be an email.
		function verifyEmail( thisEl ) {
			var regExp = new RegExp( "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" );
			var isEmail = regExp.test( thisEl.val() );
			if ( isEmail ) {
				thisEl.removeClass( "invalid" ).addClass( "valid" );
				thisEl.parent().removeClass( "required-error" );
			} else if ( ! thisEl.hasClass( 'required' ) && "" == thisEl.val() ) {
				thisEl.removeClass( "invalid" ).addClass( "valid" );
				thisEl.parent().removeClass( "required-error" );
			} else {
				thisEl.removeClass( "valid" ).addClass( "invalid" );
				thisEl.parent().addClass( "required-error" );
			}
		}

		// Website must be a website.
		function verifyUrl( thisEl ) {
			if ( 'www.' == thisEl.val().substring( 0, 4 ) ) {
				thisEl.val( 'http://www.' + thisEl.val().substring( 4 ) );
			}
			var regExp = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
			var isUrl = regExp.test( thisEl.val() );
			if ( isUrl ) {
				thisEl.removeClass( "invalid" ).addClass( "valid" );
				thisEl.parent().removeClass( "required-error" );
			} else if ( ! thisEl.hasClass( 'required' ) && "" == thisEl.val() ) {
				thisEl.removeClass( "invalid" ).addClass( "valid" );
				thisEl.parent().removeClass( "required-error" );
			} else {
				thisEl.removeClass( "valid" ).addClass( "invalid" );
				thisEl.parent().addClass( "required-error" );
			}
		}

		// Message can't be blank.
		function verifyMessage( thisEl ) {
			var message = thisEl.val();
			if ( message ) {
				thisEl.removeClass( "invalid" ).addClass( "valid" );
				thisEl.parent().removeClass( "required-error" );
			} else {
				thisEl.removeClass( "valid" ).addClass( "invalid" );
				thisEl.parent().addClass( "required-error" );
			}
		}

	}
} // End if().


/*--------------------------------------------------------------
 ## Arrange Widget Recent Projects
 --------------------------------------------------------------*/
if ( ! functionExists( 'arrangeWidgetRecentProjects' ) ) {
	ish.arrangeWidgetRecentProjects = function() {

		jQuery( window ).load( function() {
			setImageTiles();
		});

		jQuery( window ).resize( function() {
			setImageTiles();
		});

		function setImageTiles() {
			var widgetRecentProjectLi = jQuery( '.ish-widget-recent-projects li' );
			var tileWidth = Math.floor( jQuery( '.ish-sidebar' ).width() / 3 );

			widgetRecentProjectLi.each( function () {
				var thisEl = jQuery( this );
				var thisElImage = thisEl.find( 'img' );
				var imageMargin = 0;

				thisEl.css( 'height', tileWidth + 'px' );
				thisElImage.removeClass( 'landscape' ).removeClass( 'portrait' );

				if ( thisElImage.width() > thisElImage.height() ) {
					imageMargin = -1 * Math.floor( ( thisElImage.width() / thisElImage.height() - 1 ) * 100 / 2 );
					thisElImage.addClass( 'landscape' );
					thisElImage.css( 'margin-left', imageMargin + '%' );
				} else {
					imageMargin = -1 * Math.floor( ( thisElImage.height() / thisElImage.width() - 1 ) * 100 / 2 );
					thisElImage.addClass( 'portrait' );
					thisElImage.css( 'margin-top', imageMargin + '%' );
				}
			});
		}

	}
} // End if().
