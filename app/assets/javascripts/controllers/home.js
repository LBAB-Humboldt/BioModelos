jQuery(document).ready(function($) {
    $('#banner-slide').bjqs({
        'animtype'      : 'slide',
        'height' : 260,
        'width' : 380,
        'animduration' : 750, // length of transition
        'animspeed' : 5000,
        'showcontrols' : false,     // enable/disable next + previous UI elements
        'centercontrols' : false,
        'usecaptions'  : false,     // enable/disable captions using img title attribute
        'randomstart' : true   
    });

    $("#cc_licenses input:checkbox").on('click', function() {
        var $box = $(this);
        if ($box.is(":checked")) {
            $("#publication_cc_license").val($box.val());
        }
 
    });

});