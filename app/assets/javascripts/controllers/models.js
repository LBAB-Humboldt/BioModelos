$( document ).ready(function() {

  var clearShowBox = function() {
    $('#search_field').val('');
    $('#search_field').typeahead('setQuery', '');
    $('.cajabusqueda').show('slow');
  }

  var editButtonsOff = function(){
    $("#editBtn").show();
    $("#cancBtn").hide();
  }

  var ajaxGetSpecies = function(class_id){
        $.ajax({
            type: "POST",
            url: "/species/species_by_class",
            data: { class_id: class_id}
        });
  }

  var resetEcoVariables = function(){
    $("#accordion h6").each(function(e) {
            $(this).hide();
    });
    $("#accordion").accordion( "option", "active", false );
    $("#accordion input[type=checkbox]").each(function(e) {
            $(this).prop( "checked", false);
    });
  }

  $('.searchcateg,.showmodels,.editControls,#cancBtn,.cajabusqueda,.showmodels,.cajaediciones,.edicionbar,.botonmodelos,.cajaecolog,.ecologicas').hide();
  $('.cajabusqueda').show('slow');
  ajaxGetSpecies("");
  $(".findbar").addClass("w55");
  $(".findbar").click(function(e){
          e.preventDefault();
          if($(".cajabusqueda").is(':visible')){
            $(".cajabusqueda").hide('slow');
            $(".findbar").removeClass("w55");
          }
          else{
            $('.cajabusqueda').show('slow');
            $('.showmodels, .editControls, .edicionbar, .botonmodelos, .cajaediciones, .cajaecolog, .ecologicas, .areaespecie').hide('slow');
            ajaxGetSpecies("");
            editButtonsOff();
            _mapVisorModule.deactivateEdition();
            _mapVisorModule.unloadModel();
            _mapVisorModule.unloadModel_n2();
            _mapVisorModule.unloadReview();
            _mapVisorModule.unloadPoints();
            $('#species_id').val('');
            $(".botonmodelos").removeClass("w55");
            $(".ecologicas").removeClass("w55");
            $(".edicionbar").removeClass("w55");
            $(".findbar").addClass("w55");
            resetEcoVariables();
          }
  });
  $(".edicionbar").click(function(e){
      if($(".cajaediciones").is(":visible")){
        $(".cajaediciones").hide();
        $(".edicionbar").removeClass("w55");
      }
      else{
        $('.cajaecolog, .cajabusqueda, .showmodels').hide('slow');
        $(".cajaediciones").show();
        $(".botonmodelos").removeClass("w55");
        $(".ecologicas").removeClass("w55");
        $(".edicionbar").addClass("w55");
      }     
      e.preventDefault();
  });
  $("#editBtn").click(function(e){
          $("#editBtn").hide();
          $("#cancBtn").show();
          e.preventDefault();
  });
  $("#cancBtn").click(function(e){
    e.preventDefault();
    _mapVisorModule.cancelEdition();
    editButtonsOff();
  });

  $(".botonmodelos").click(function(e){
      if($(".showmodels").is(":visible")){
        $(".showmodels").hide();
        $(".botonmodelos").removeClass("w55");
      }
      else{
        $('.cajaecolog, .cajabusqueda, .cajaediciones').hide('slow');
        $(".ecologicas").removeClass("w55");
        $(".edicionbar").removeClass("w55");
        $(".showmodels").show();
        $(".botonmodelos").addClass("w55");
      }
      e.preventDefault();
  });

  $(".ecologicas").click(function(e){
        if($(".cajaecolog").is(":visible")){
          $(".cajaecolog").hide();
          $(".ecologicas").removeClass("w55");
        }
        else{
          $('.showmodels, .cajabusqueda, .cajaediciones').hide('slow');
          $(".cajaecolog").show();
          $(".botonmodelos").removeClass("w55");
          $(".edicionbar").removeClass("w55");
          $(".ecologicas").addClass("w55");
      }
      e.preventDefault();
  });

  $(".xcierre").click(function(e){
     $(".cajaecolog").hide();
     $(".ecologicas").removeClass("w55");
     e.preventDefault();
  });
  
  $('.searchcateg').click(function(e){
    $('.cajabusqueda').show('slow');
    $('.resultados').html("");
    e.preventDefault();
  });

  //*****************//
  // REVIEWS BOX     //
  //*****************//

  $(".edicionbar").click(function(e) {

    var sid = $('#species_id').val();

    $.ajax({
        'type': "POST",
        'global': false,
        url: "/reviews/reviews_by_species",
        data: {id: sid},
        error: function( jqXHR, textStatus ) {
            isError = true;
            alert( "Ha ocurrido un error: " + textStatus );
        }
    });

    e.preventDefault();
  });

  //********************************//
  // ECOLOGICAL VARIABLES FUNCTIONS //
  //********************************//

  var ecoVars;

  //Get the variable from the array
  function getEcoVariable(key){
    for (var i in ecoVars) {
      if(ecoVars[i].eco_id == key)
        return ecoVars[i];
    }
  }
  //Set the accordion function
  $( "#accordion" ).accordion({ heightStyle: "content", collapsible: true });

  //Plus button function of showing and hiding the checkboxes.
  $('.subcbtn').click(function() {
    $(this).parent('div').parent('div').find('div.subcecos').toggle('slow', function() {
    });
  });

  //Actions when the ecological variables button is pushed
  $(".ecologicas").click(function(e) {
    console.log("CLICK");
    var alt_range = "";

    //Check if the eco variables box is visible
    console.log($(".cajaecolog").is(":visible"));
    if($(".cajaecolog").is(":visible")){
      console.log("CLICK 2");
      var sid = $('#species_id').val();

      //Get previously saved ecological variables
      $.ajax({
          'async': false,
          'type': "GET",
          'global': false,
          'dataType': 'json',
          url: "/species/eco_variables_search",
          data: {species_id: sid},
          'success': function (data) {
              ecoVars = data;
          },
          error: function( jqXHR, textStatus ) {
              isError = true;
              alert( "Ha ocurrido un error: " + textStatus );
          }
      });

      // Get previously saved altitude range
      $.ajax({
          'async': false,
          'type': "POST",
          'global': false,
          'dataType': 'json',
          url: "/species/get_altitude_range",
          data: {sid: sid},
          'success': function (data) {
              alt_range = data;
          },
          error: function( jqXHR, textStatus ) {
              isError = true;
              alert( "Ha ocurrido un error: " + textStatus );
          }
      });

      //Put the saved values in the altitude boxes
      if(alt_range != null){
        $("#ralt_min").val(alt_range.alt_min);
        $("#ralt_max").val(alt_range.alt_max);
      }
      else{
        $("#ralt_min").val("");
        $("#ralt_max").val("");
      }  

      //Initialize checkboxes with previous value
      $('input[type=checkbox]').each(function(e){
        var $this = $(this),
            ecoVar,
            box_val = 0.0;

        ecoVar = getEcoVariable($(this).attr('name'));

        if (ecoVar != undefined)
            box_val = ecoVar.certainty;

        if (box_val == 1.0)
            $this.prop("checked", true);
      });
    }
  });

  /* 
    Saves or updates the altitude range 
  */
  $(".ecobtn").click(function(e) {
    var sp_id = $('#species_id').val(),
        isError = false,
        re = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/,
        ralt_str_min = $("#ralt_min").val(),
        ralt_str_max = $("#ralt_max").val();

    if (re.test(ralt_str_min) && re.test(ralt_str_max)){
      if(parseInt(ralt_str_min) < parseInt(ralt_str_max)){
        $.ajax({
          type: "POST",
          url: "/species/add_altitude_range",
          data: { sid: sp_id, alt_min: ralt_str_min, alt_max: ralt_str_max},
          error: function( jqXHR, textStatus ) {
            isError = true;
            alert( "Ha ocurrido un error: " + textStatus );
          } 
        });
      }
      else{
        alert("El valor mínimo debe ser menor que el valor máximo.");
        isError = true;
      }
    }
    else{
       alert("Ingrese valores de Rango Altitudinal válidos.");
       isError = true;
    }

  if(!isError)
    alert("El rango altitudinal ha sido guardado con éxito.")

  });

  /* 
    Saves or updates the ecological variable
  */
  $("#accordion input[type=checkbox]").change(function () {
    var sp_id = $('#species_id').val(),
        box_id = $(this).attr('name'),
        eco_var_val = 0.0;

      if ($(this).prop("checked"))
        eco_var_val = 1.0;

      $.ajax({
          type: "POST",
          url: "/species/add_ecological_variable",
          data: { species_id: sp_id, eco_variable_id: box_id, certainty: eco_var_val },
          error: function( jqXHR, textStatus ) {
            isError = true;
            alert( "Ha ocurrido un error: " + textStatus );
          }
      });
  });
});




