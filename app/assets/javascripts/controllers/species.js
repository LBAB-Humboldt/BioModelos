$( document ).ready(function() {

  var ajaxGetSpecies = function(class_id){
        $.ajax({
            type: "POST",
            url: "/species/species_by_class",
            data: { class_id: class_id}
        });
  }

  /* Model animation */
  $("body").on("mouseenter",".cajadatosm",function(e){
        $(this).animate({scrollTop:$(".cajadatosm").scrollTop() + $(this).find(".modeldata").position().top},600);
  });
  $("body").on("mouseleave",".cajadatosm",function(e){
        $(this).animate({scrollTop:$(".cajadatosm").position().top - '20'},600).finish();
  });

  /* 
    Species search form buttons logic
  */
  $("input:checkbox").on('click', function() {
    var $box = $(this),
        box_val = "";
    if ($box.is(":checked")) {
      // the name of the box is retrieved using the .attr() method
      // as it is assumed and expected to be immutable
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      // the checked state of the group/box on the other hand will change
      // and the current value is retrieved using .prop() method
      $(group).prop("checked", false);
      $box.prop("checked", true);
      box_val = $box.val();
      $("#class_checker label").addClass("nonchecked");
      $box.parent().removeClass("nonchecked");
    } else {
      $box.prop("checked", false);
      $("#class_checker label").removeClass("nonchecked");
    }
    $("#class_id").val(box_val);
    $('#search_field').val('');
    $('#search_field').typeahead('setQuery', '');
    ajaxGetSpecies($("#class_id").val());
  });


  /* Autocomplete */
	$("#search_field").typeahead({
       	name: 'Search',
    	//remote: '/species/autocomplete?query=%QUERY&class_id=%SPCLASS',
    	remote: {
    				url: '/species/autocomplete?query=%QUERY&classId=%SPCLASS',
    				replace:
    					function(url, query) {
      						var sp_classId = encodeURIComponent($('#class_id').val());
      						return url.replace('%QUERY', query).replace('%SPCLASS', sp_classId);
    					}
  				},
    	minLength: 2
  });

  $("#search_field").on("typeahead:selected typeahead:autocompleted", function(e,datum) { 
		$("#species_id").val(datum.id);
	});

  /* Model selection */
  $("body").on("click",".model_link",function (event) {
                _mapVisorModule.loadModel("/modelos/"+$(this).find('#imgsrc').val(), $('#species_id').val());
                $("#current_model").val($(this).find('#imgsrc').val().split(".")[0]);
                if($("#imgsrc2").length) {
                  _mapVisorModule.loadModel_n2("/modelos/"+$(this).find('#imgsrc2').val(), $('#species_id').val());
                }
                $("#review_model_id").val($(this).find('img').attr('id'));
                $('.editControls').show('slow');
                $('.showmodels, .cajabusqueda, .selectores').hide ('slow');
                $(".botonmodelos").removeClass("w55");
                event.preventDefault(); // Prevent link from following its href
  });

  $("body").on("click", ".xcierre2", function (e) {
        $(".showmodels").hide();
        $(".botonmodelos").removeClass("w55");
        e.preventDefault();
  });
  
});
