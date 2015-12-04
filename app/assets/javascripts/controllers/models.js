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
    // $("div.slider").each(function(e) {
    //         $(this).slider("values", 0, 0);
    //         $(this).slider("values", 1, 0.5);
    //         $(this).slider("values", 2, 1);
    //  });
    $("#accordion .slider").each(function(e) {
            $(this).hide();
    });
    $("#accordion h6").each(function(e) {
            $(this).hide();
    });
    $("#accordion").accordion( "option", "active", false );
    $("#accordion input[type=checkbox]").each(function(e) {
            $(this).prop( "checked", false);
    });
  }

  $('.searchcateg,.showmodels,.editControls,#cancBtn,.cajabusqueda,.showmodels,.cajaediciones,.edicionbar,.botonmodelos,.cajaecolog,.ecologicas').hide();
  $(".findbar").addClass("w55");
  $("#anfsh").click(function(e){
    $('#cajasearch1').show('slow');
    $('#class_id').val(1);
    $('#cajasearch2,#cajasearch3,#cajasearch4,#cajasearch5,#cajasearch6,#cajasearch7').hide('slow');
    clearShowBox();
    ajaxGetSpecies(1);
    e.preventDefault();
  });
  $("#avessh").click(function(e){
    $('#cajasearch2').show('slow');
    //$('#class_id').val(2);
    $('#cajasearch1,#cajasearch3,#cajasearch4,#cajasearch5,#cajasearch6,#cajasearch7').hide('slow');
    clearShowBox();
    ajaxGetSpecies(2);
    e.preventDefault();
  });
  $("#invsh").click(function(e){
    $('#cajasearch3').show('slow');
    $('#class_id').val(3);
    $('#cajasearch2,#cajasearch1,#cajasearch4,#cajasearch5,#cajasearch6,#cajasearch7').hide('slow');
    clearShowBox();
    ajaxGetSpecies(3);
     e.preventDefault();
  });
  $("#mamsh").click(function(e){
    $('#cajasearch4').show('slow');
    $('#class_id').val(4);
    $('#cajasearch2,#cajasearch3,#cajasearch1,#cajasearch5,#cajasearch6,#cajasearch7').hide('slow');
    clearShowBox();
    ajaxGetSpecies(4);
     e.preventDefault(); 
  });
  $("#pecsh").click(function(e){
    $('#cajasearch5').show('slow');
    $('#class_id').val(5);
    $('#cajasearch2,#cajasearch3,#cajasearch4,#cajasearch1,#cajasearch6,#cajasearch7').hide('slow');
    clearShowBox();
    ajaxGetSpecies(5);
     e.preventDefault();
  });
  $("#repsh").click(function(e){
    $('#cajasearch6').show('slow');
    $('#class_id').val(6);
    $('#cajasearch2,#cajasearch3,#cajasearch4,#cajasearch5,#cajasearch1,#cajasearch7').hide('slow');
    clearShowBox();
    ajaxGetSpecies(6);
     e.preventDefault();
  });
  $("#plash").click(function(e){
    $('#cajasearch7').show('slow');
    $('#class_id').val(7);
    $('#cajasearch2,#cajasearch3,#cajasearch4,#cajasearch5,#cajasearch6,#cajasearch1').hide('slow');
    clearShowBox();
    ajaxGetSpecies(7);
     e.preventDefault();
  });
  $(".findbar").click(function(e){
          e.preventDefault();
          $('.showmodels, .cajabusqueda, .editControls, .edicionbar, .cajabusqueda, .botonmodelos, .cajaediciones, .cajaecolog, .ecologicas, .areaespecie').hide('slow');
          editButtonsOff();
          _mapVisorModule.deactivateEdition();
          _mapVisorModule.unloadModel();
          _mapVisorModule.unloadReview();
          _mapVisorModule.unloadPoints();
          $('#species_id').val('');
          ajaxGetSpecies("");
          $('.cajabusqueda').show('slow');
          //$('.selectores').show('slow');
          $(".botonmodelos").removeClass("w55");
          $(".ecologicas").removeClass("w55");
          $(".edicionbar").removeClass("w55");
          $(".findbar").addClass("w55");
          resetEcoVariables();
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

});




