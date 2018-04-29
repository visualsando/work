/**
 * AnimOnScroll.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 *
 * @package Qusq_Lite
 */

;( function( window ) {

	'use strict';

	var docElem = window.document.documentElement;

	function getViewportH() {
		var client = docElem['clientHeight'],
			inner = window['innerHeight'];

		if ( client < inner ) {
			return inner;
		} else {
			return client;
		}
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	// http://stackoverflow.com/a/5598797/989439.
	function getOffset( el ) {
		var offsetTop = 0, offsetLeft = 0;

		var doContinue = true;

		while ( doContinue ) {
			if ( ! isNaN( el.offsetTop ) ) {
				offsetTop += el.offsetTop;
			}
			if ( ! isNaN( el.offsetLeft ) ) {
				offsetLeft += el.offsetLeft;
			}

			doContinue = ( el = el.offsetParent );
		}

		return {
			top : offsetTop,
			left : offsetLeft
		}
	}

	function inViewport( el, h ) {
		var elH = el.offsetHeight,
			scrolled = scrollY(),
			viewed = scrolled + getViewportH(),
			elTop = getOffset( el ).top,
			elBottom = elTop + elH,
			// if 0, the element is considered in the viewport as soon as it enters.
			// if 1, the element is considered in the viewport only when it's fully inside.
			// value in percentage (1 >= h >= 0).
			h = h || 0;

		return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
	}

	function extend( a, b ) {
		for ( var key in b ) {
			if ( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function AnimOnScroll( options ) {
		this.options = extend( this.defaults, options );
		this.el = jQuery( this.options.container_selector )[0];
		this._init();
	}

	AnimOnScroll.prototype = {
		defaults : {
			container_selector : '',
			items_selector : ' > li',
			animate_odd_items : false,
			animate_even_items : true,
			animate_captions : true,
			even_items_animation_speed: 0.85,
			// Minimum and a maximum duration of the animation (random value is chosen).
			minDuration : 0,
			maxDuration : 0,
			// The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation.
			// if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport.
			// If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it).
			viewportFactor : 0,
			firstRun: true
		},
		_init : function() {

			this.items = Array.prototype.slice.call( document.querySelectorAll( this.options.container_selector + ' ' + this.options.items_selector ) );
			this.itemsCount = this.items.length;
			this.itemsRenderedCount = 0;
			this.didScroll = false;

			var self = this;

			imagesLoaded( this.el, function() {

				if ( Modernizr.cssanimations ) {
					if ( self.options.firstRun ) {
						// the items already shown...
						self.items.forEach(function (el, i) {
							if ( inViewport( el ) ) {
								self._checkTotalRendered();
								jQuery( el ).addClass( 'shown' );
							}
						});
					}

					// animate on scroll the items inside the viewport.
					self._onScrollFnHandler = function(){
						self._onScrollFn();
					};

					self._resizeHandlerHandler = function(){
						self._resizeHandler();
					};
					window.addEventListener( 'scroll', self._onScrollFnHandler, false );
					window.addEventListener( 'resize', self._resizeHandlerHandler, false );

					self._onScrollFn();
				}

			});
		},
		_onScrollFn : function() {
			var self = this;
			if ( ! this.didScroll ) {
				this.didScroll = true;
				setTimeout( function() { self._scrollPage(); }, 60 );

				this.items.forEach( function( el, i ) {

					var me = jQuery( el );
					var oddEvenItemAnimate = function( oddEvenValue ) {
						var scrolled = jQuery( window ).scrollTop();
						if ( ( oddEvenValue !== i % 2 ) && me.attr( 'data-initial-top' ) ) {
							me.css( 'margin-top', parseInt( me.attr( 'data-initial-top' ) - scrolled + ( scrolled * self.options.even_items_animation_speed ) ) + 'px' );
						} else {
							me.attr( 'data-initial-top', ( jQuery.isNumeric( parseInt( me.css( 'margin-top' ), 10 ) ) ) ? parseInt( me.css( 'margin-top' ), 10 ) : 0 );

							if (oddEvenValue !== i % 2) {
								me.css( 'margin-top', parseInt( me.attr( 'data-initial-top' ) - scrolled + ( scrolled * self.options.even_items_animation_speed ) ) + 'px' );
							}

						}
					}

					// Animate every first item or every second item.
					if ( self.options.animate_odd_items ) {
						oddEvenItemAnimate( 1 );
					} else if ( self.options.animate_even_items ) {
						oddEvenItemAnimate( 0 );
					}

					// Animate Captions.
					if ( self.options.animate_captions ) {

						var me = jQuery( el );
						var vh = getViewportH();
						var viewport_bottom = scrollY() + getViewportH();
						var viewport_top = scrollY();
						var me_top = me.offset().top + parseFloat( me.css( 'padding-top' ) );
						var me_bottom = me_top + me.height();

						// In viewport.
						if ( me_top < viewport_bottom && me_bottom > viewport_top ) {

							var cc = me.find( '.ish-caption-container' );
							var c_top = ( ( me_top - scrollY() ) % vh );
							var c_height = cc.height();
							var c_inner_height = cc.find( '.ish-caption' ).width();
							var minus_part = Math.min( c_inner_height , c_height - c_inner_height );

							var visible_perc = ( ( c_height - minus_part + vh ) - ( ( me_bottom - viewport_bottom ) - minus_part + vh ) ) / ( c_height - minus_part + vh );

							if ( visible_perc <= 0 ) {
								visible_perc = 0;
							} else if ( visible_perc > 1 ) {
								visible_perc = 1;
							}

							var new_pos = Math.round( ( visible_perc * ( c_height - c_inner_height ) ) );

							cc.find( '.ish-caption' ).css( 'bottom', new_pos );
						}
					}

				});

			} // End if().
		},
		_scrollPage : function() {
			var self = this;
			this.items.forEach( function( el, i ) {
				var me = jQuery( el );
				if ( ! me.hasClass( 'shown' ) && ! me.hasClass( 'animate' ) && inViewport( el, self.options.viewportFactor ) ) {
					setTimeout( function() {
						var perspY = scrollY() + getViewportH() / 2;
						self.el.style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
						self.el.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
						self.el.style.perspectiveOrigin = '50% ' + perspY + 'px';

						self._checkTotalRendered();

						if ( self.options.minDuration && self.options.maxDuration ) {
							var randDuration = ( Math.random() * ( self.options.maxDuration - self.options.minDuration ) + self.options.minDuration ) + 's';
							el.style.WebkitAnimationDuration = randDuration;
							el.style.MozAnimationDuration = randDuration;
							el.style.animationDuration = randDuration;
						}

						me.addClass( 'animate' );
					}, 25 );
				}

			});
			this.didScroll = false;
		},
		_resizeHandler : function() {
			var self = this;
			function delayed() {
				self._scrollPage();
				self.resizeTimeout = null;
			}
			if ( this.resizeTimeout ) {
				clearTimeout( this.resizeTimeout );
			}
			this.resizeTimeout = setTimeout( delayed, 1000 );
		},
		_checkTotalRendered : function() {
			++this.itemsRenderedCount;
			if ( this.itemsRenderedCount === this.itemsCount ) {
				window.removeEventListener( 'scroll', this._onScrollFn );
			}
		},
		_remove : function(){
			window.removeEventListener( 'scroll', this._onScrollFnHandler );
			window.removeEventListener( 'resize', this._resizeHandlerHandler );

			if ( this.resizeTimeout ) {
				clearTimeout( this.resizeTimeout );
			}

			jQuery( this.options.container_selector + ' ' + this.options.items_selector ).removeAttr( 'style' );
		}
	};

	// add to global namespace.
	window.AnimOnScroll = AnimOnScroll;

} )( window );
