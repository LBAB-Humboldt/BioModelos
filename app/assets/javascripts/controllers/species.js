$( document ).ready(function() {
	$("#search_field").typeahead({
       	name: 'Search',
    	remote: '/species/autocomplete?query=%QUERY',
    	minLength: 2
  	});

  	$("#search_field").on("typeahead:selected typeahead:autocompleted", function(e,datum) { 
		$("#species_id").val(datum.id);
	});
});