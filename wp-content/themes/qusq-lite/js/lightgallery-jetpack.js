/**
 * LightGallery for Jetpack
 *
 * @package Qusq_Lite
 */

"use strict";
/*--------------------------------------------------------------
 TABLE OF CONTENTS:
 ----------------------------------------------------------------
 # Document Ready
 # Functions
 ## LightBox - LightBox for Jetpack gallery
 --------------------------------------------------------------*/

/*--------------------------------------------------------------
 # Document Ready
 --------------------------------------------------------------*/
jQuery( document ).ready( function($) {
	ish.activateLightBoxForJetpack();
} );

/*--------------------------------------------------------------
 # Functions
 --------------------------------------------------------------*/

/*--------------------------------------------------------------
 ## LightBox - LightBox for Jetpack gallery
 --------------------------------------------------------------*/
if ( ! functionExists( 'activateLightBoxForJetpack' ) ) {
	ish.activateLightBoxForJetpack = function() {

		// Copy arguments and create a new object, "var options = lightBoxArgs;" only references the existing.
		var options = jQuery.extend( {}, lightBoxArgs );

		// Disable jetpack carousel for each gallery in sidebar.
		jQuery( '.ish-sidebar .carousel .tiled-gallery' ).each( function() {

			// Disable JetPack carousel.
			jQuery( this ).attr( 'data-carousel-extra', '' );

			// Replace link with original url of image.
			jQuery( this ).find( 'a' ).each( function() {
				var sidebarImageOrigFile = jQuery( this ).find( 'img' ).attr( 'data-orig-file' );
				jQuery( this ).attr( 'href', sidebarImageOrigFile );
			} );

		} );

		// Init LightGallery for required elements.
		jQuery( '.single-attachment .ish-main-content .attachment, .ish-main-content .gallery-target-file, .ish-main-content .tiled-gallery-file, .ish-sidebar .carousel .tiled-gallery' ).each( function() {
			jQuery( this ).find( 'a' ).off( 'click' );
			jQuery( this ).lightGallery( options );
		});

	}
}
