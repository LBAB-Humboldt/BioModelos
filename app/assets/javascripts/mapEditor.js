var _mapVisorModule = function() {

	var map, drawnItems, layerControl, modelOverlay, currentLayer, drawControl, reviewLayer, csvLayer,
		isEditOn = false,
		commentForm = '<div class="commentForm"><form id="inputform" enctype="multipart/form-data" class="well">' +
        '<label><strong>Observación:</strong></label><br />' +
        '<textarea rows="4" cols="30" placeholder="Required" id="comment"></textarea>' +
        '<div class="row-fluid clearfix">' +
        '<label class="labelcom clearfix"><strong>Acción:</strong></label><input type="radio" name="EditType" value="Add" class="radiogaga">Agregar</input><input type="radio" name="EditType" value="Cut" class="radiogaga">Remover</input><input type="radio" name="EditType" value="Other" class="radiogaga" checked>Otra</input>'+
        '<button id="popUpCancelBtn" type="button" class="btn2">Cancelar</button>' +
        '<button id="popUpSubmitBtn" type="button" class="btn2">Enviar</button>' +
        '</div>' +
        '</form></div>';

	var init = function() {

		var latlng = new L.LatLng(4, -72),
        	zoom = 6,
        	mZoom = 2,
        	mxZoom = 9;

        	/* Base Layers */
        	var googleTerrain = new L.Google('TERRAIN', {minZoom:mZoom, maxZoom: mxZoom}),
				googleSatellite = new L.Google('SATELLITE', {minZoom:mZoom, maxZoom: mxZoom}),
	    		osmBase = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	            {
	                minZoom: mZoom,
	                maxZoom: mxZoom,
	                attribution: 'Map data © OpenStreetMap contributors'
	            }),
	    		thunderForestLand= new L.TileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',{
	    			minZoom: mZoom,
	                maxZoom: mxZoom,
					attribution: 'Map data ' + L.TileLayer.OSM_ATTR + ', Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />'
		
	    		});


	    var	baseLayers = {
	    		"Google Terrain": googleTerrain,
	    		"Google Satellite": googleSatellite,
	        	"OpenStreetMap": osmBase,
	        	"Thunderforest Landscape": thunderForestLand
	    	},

	    	overlays = {};

    	
    	map = L.map('map').setView(latlng, zoom);
   
	    map.addLayer(googleTerrain);

	    /* autoZIndex controls the layer order */
	    layerControl = L.control.layers(baseLayers, overlays, {autoZIndex: true});
	    layerControl.addTo(map);
	    
	    //loadModel();
	};

	var loadModel = function (modelUrl) {

		var imageUrl = modelUrl,
        	//imageBounds = [[12.675003791, -60.4833271], [-13.841664259, -82.949994938]];
        	imageBounds = [[12.675, -60.48333], [-13.84166, -82.94999]];

       /* Dispose older model if it exists */
       if(map.hasLayer(modelOverlay)) {
       		map.removeLayer(modelOverlay);
       		layerControl.removeLayer(modelOverlay);
       }
       	
	    modelOverlay = new L.ImageOverlay(imageUrl, imageBounds, {opacity: 0.6});
	    map.addLayer(modelOverlay, true);
	    layerControl.addOverlay(modelOverlay, "Modelo");
	    
	    
	    map.on('overlayadd', function(e) {
	        if(e.layer === modelOverlay)
	            modelOverlay.bringToBack();
	    });
	};

	var loadAllModels = function (modelsUrls) {
		var modelOver1 = null, modelOver2 = null, modelOver3 = null, modelOver4 = null;

		if(map.hasLayer(modelOver1)){
			map.removeLayer(modelOver1);
			layerControl.removeLayer(modelOver1);
		}
		if(map.hasLayer(modelOver2)){
			map.removeLayer(modelOver1);
			layerControl.removeLayer(modelOver1);
		}
		if(map.hasLayer(modelOver3)){
			map.removeLayer(modelOver1);
			layerControl.removeLayer(modelOver1);
		}
		if(map.hasLayer(modelOver4)){
			map.removeLayer(modelOver1);
			layerControl.removeLayer(modelOver1);
		}

		modelOver1 = new L.ImageOverlay(modelsUrls[1], imageBounds, {opacity: 0.6});
		modelOver2 = new L.ImageOverlay(modelsUrls[2], imageBounds, {opacity: 0.6});
		modelOver3 = new L.ImageOverlay(modelsUrls[3], imageBounds, {opacity: 0.6});
		modelOver4 = new L.ImageOverlay(modelsUrls[4], imageBounds, {opacity: 0.6});
		map.addLayer(modelOver1);
		map.addLayer(modelOver2);
		map.addLayer(modelOver3);
		map.addLayer(modelOver4);
		layerControl.addOverlay({"Modelo 1": modelOver1, "Modelo 2": modelOver2, "Modelo 3": modelOver3, "Modelo 4": modelOver4});

	};

	var unloadReview = function (){
		if(map.hasLayer(reviewLayer)) {
       		map.removeLayer(reviewLayer);
       		layerControl.removeLayer(reviewLayer);
       }
	};

	var loadReview = function (reviewGeoJSON) {

		/* Dispose older review if it exists */
       unloadReview();

       /* Deactivate edition if it is active */
       if (isEditOn) 
       	deactivateEdition();

		reviewLayer = new L.GeoJSON(JSON.parse(reviewGeoJSON), {
        	onEachFeature: function (feature, layer) {
            	if (feature.properties.popupContent) {
                	var popupString = '<div class="popup">'+feature.properties.popupContent+'</div>';
                	layer.bindPopup(popupString, { maxHeight: 200 });
            	}
    		}
    	});

    	map.addLayer(reviewLayer);
    	layerControl.addOverlay(reviewLayer,"Anotación");

	};

	var loadPoints = function (csvUrl) {

		var csvTitles = ["Localidad","Municipio","Departamento","Altitud","Fecha","Institucion","Colector"];

		csvLayer = L.geoCsv(null, {		
										onEachFeature: function (feature, layer) {
												var popup = '';
												popup += '<b>'+ feature.geometry.coordinates[0]+', '+ feature.geometry.coordinates[1] + '</b><br /><br />';
												for (var i=0; i < csvTitles.length; i++) {
													popup += '<b>'+csvTitles[i]+'</b><br />'+ feature.properties[csvLayer.getPropertyName(csvTitles[i])]+'<br /><br />';
												}
												layer.bindPopup(popup);
										},
										firstLineTitles: true, 
										fieldSeparator: ','});


		$.ajax ({
			type:'GET',
			dataType:'text',
			url: csvUrl,
			async: false,
   			error: function() {
     			alert('No se pudieron cargar los datos');
   			},
			success: function(data) {
     			var cluster = new L.MarkerClusterGroup();
				csvLayer.addData(data);
				cluster.addLayer(csvLayer);
				map.addLayer(cluster);
				layerControl.addOverlay(cluster,"Registros");
				map.fitBounds(cluster.getBounds());

			},
   			complete: function() {
      			//$('#cargando').delay(500).fadeOut('slow');
   			}
		});
    };

	var activateEdition = function () {

		unloadReview();

    	if(!isEditOn) {

    		isEditOn = true;

    		drawnItems = new L.FeatureGroup(); //Capa editable
		    /* Control */
		    drawControl = new L.Control.Draw({
		        draw: {
		            position: 'topright',
		            circle: false,
		            rectangle: false
		        },
		        edit: {
		            featureGroup: drawnItems
		        }
		    });

		    map.addControl(drawControl);
		    layerControl.addOverlay(drawnItems, "Edición");
		    map.addLayer(drawnItems);

		    /* Draw Created Event Listener */
		    map.on('draw:created', function(e) {
		        var popup = new L.Popup({
		            closeButton: false,
		            closeOnClick: false
		        }).setContent(commentForm); 

		        var layer = e.layer;

		        layer.bindPopup(popup);

		        drawnItems.addLayer(layer);

		        layer.openPopup();
		    });
		    
		    /* Popup Open Event Listener*/
		    map.on('popupopen', function(e) {
		        currentPopupID = e.popup._leaflet_id;
		    });

		    map.on('draw:drawstart', function(e) {
		    	// alert("Hola");
		    	// console.log("Elegido");
		    });
		    
		}   

	};

	var deactivateEdition = function () {
		if(drawnItems != null && drawControl != null && layerControl != null){
			isEditOn = false;
			map.removeLayer(drawnItems);
		 	map.removeControl(drawControl);
		 	layerControl.removeLayer(drawnItems);
		}
	};

	var cancelLayer = function () {

		currentLayer = getCurrentLayer(currentPopupID);
		drawnItems.removeLayer(currentLayer);

	};

	var getCurrentLayer = function (popupID) {
	    var layerRet;
	    if (popupID !== undefined && popupID !== null) {
	        drawnItems.eachLayer(function(layer) {
	            if (layer._popup._leaflet_id === popupID) {
	                var count = 0;
	                //console.log(count++);
	                layerRet = layer;
	            }
	        });
	    }
	    return layerRet;
	};


	var submitComment = function () {
		var comment = $("#comment").val();
	    if (comment.length === 0) {
	        alert("¡Ingrese una observación!");
	        return false;
	    }

	    currentLayer = getCurrentLayer(currentPopupID);

	    if (currentLayer !== undefined && currentLayer !== null) {
	    	var editType = $('input[name="EditType"]:checked').val();
	        currentLayer.closePopup();
	        currentLayer.bindPopup( editType + ': ' + comment);
	        currentLayer.openPopup();
	    }
	    else {
	        alert("No se ha podido enviar el comentario");
	        return false;
	    }
	};

	var areEmptyComments = function () {
	    var isEmpty = false;
	    /* TODO: Try to break iteration once it found an empty popup */
	    drawnItems.eachLayer(function(layer) {
	        if (layer._popup._content === commentForm) {
	            isEmpty = true;
	        }
	    });
	    return isEmpty;
	};

	var toGeoJSON = function () {

	    var geoJSONLayer = '{"type": "FeatureCollection", "features":[',
	        layNum = drawnItems.getLayers().length,
	        count = 0;
	        
	    drawnItems.eachLayer(function(layer) {
	        ltG = layer.toGeoJSON();
	        geoJSONLayer += '{"type": "' + ltG.type + '", "geometry": {"type": "' + ltG.geometry.type + '", "coordinates": ';

	        var coords, isPoint = false, isPolygon = false;

	        /* Check if layer is Point, Polygon or LineString */
	        switch (ltG.geometry.coordinates.length)
	        {
	            case 1:
	                coords = ltG.geometry.coordinates[0];
	                isPolygon = true;
	                break;
	            case 2:
	                coords = ltG.geometry.coordinates;
	                isPoint = true;                                    
	                break;
	            default:
	                coords = ltG.geometry.coordinates;
	                break;
	        }

	        var len = coords.length;
	        if (!isPoint) {
	            if (len > 1 && !isPolygon)
	                geoJSONLayer += '[';
	            else if (len > 1)
	                geoJSONLayer += '[[';
	            for (var i = 0; i < len; i++)
	            {
	                geoJSONLayer += '[' + coords[i] + ']';
	                if (i < len - 1)
	                    geoJSONLayer += ',';
	            }
	            if (len > 1 && !isPolygon)
	                geoJSONLayer += ']';
	            else if (len > 1)
	                geoJSONLayer += ']]';
	        }
	        else
	            geoJSONLayer += '[' + coords + ']';

	        geoJSONLayer += '}, "properties": {"popupContent": "' + layer._popup._content + '"}}';
	        if (layNum > 1 && count < layNum - 1)
	            geoJSONLayer += ',';
	        count += 1;
	    });
	    geoJSONLayer += ']}';

	    //console.log(geoJSONLayer);
	    return geoJSONLayer;
	};

	var saveEdition = function () {
	    if (!areEmptyComments()){
	    	return toGeoJSON();
	    }  
	    else
	        alert("Hay observaciones sin completar");
    };

	return {

		init: init,
		loadModel: loadModel,
		activateEdition: activateEdition,
		deactivateEdition: deactivateEdition,
		cancelLayer: cancelLayer,
		saveEdition: saveEdition,
		submitComment: submitComment,
		loadReview: loadReview,
		unloadReview: unloadReview,
		loadPoints: loadPoints
	};
}();

$(document).ready(function() {

	/* Function Handlers */

	$("#editBtn").click(function() {
    	_mapVisorModule.activateEdition();
    });

	$("body").on("click", "#popUpSubmitBtn", function(){
		_mapVisorModule.submitComment();
	});

	$("body").on("click", "#popUpCancelBtn", function(){
		_mapVisorModule.cancelLayer();
	});

	_mapVisorModule.init();

});