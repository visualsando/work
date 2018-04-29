/**
 * SmoothScroll functionality
 *
 * @package Qusq_Lite
 */

jQuery( document ).ready( function( $ ) {

	ish.smoothScrollPage();

});


/*--------------------------------------------------------------
 ## SmoothScroll
 --------------------------------------------------------------*/
if ( ! functionExists( 'smoothScrollPage' ) ) {
	ish.smoothScrollPage = function() {

		SmoothScroll({
			// Scrolling Core
			animationTime    : 600, // [ms].
			stepSize         : 50 // [px].
		});

	}
}
