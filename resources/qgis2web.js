var map = new ol.Map({
    target: 'map',
    renderer: 'canvas',
    layers: layersList,
    view: new ol.View({
         maxZoom: 28, minZoom: 1
    })
});

//initial view - epsg:3857 coordinates if not "Match project CRS"
map.getView().fit([-967935.474152, 7339868.164565, -55701.887195, 8000719.267161], map.getSize());

////small screen definition
    var hasTouchScreen = map.getViewport().classList.contains('ol-touch');
    var isSmallScreen = window.innerWidth < 650;

////controls container

    //top left container
    var topLeftContainer = new ol.control.Control({
        element: (() => {
            var topLeftContainer = document.createElement('div');
            topLeftContainer.id = 'top-left-container';
            return topLeftContainer;
        })(),
    });
    map.addControl(topLeftContainer)

    //bottom left container
    var bottomLeftContainer = new ol.control.Control({
        element: (() => {
            var bottomLeftContainer = document.createElement('div');
            bottomLeftContainer.id = 'bottom-left-container';
            return bottomLeftContainer;
        })(),
    });
    map.addControl(bottomLeftContainer)
  
    //top right container
    var topRightContainer = new ol.control.Control({
        element: (() => {
            var topRightContainer = document.createElement('div');
            topRightContainer.id = 'top-right-container';
            return topRightContainer;
        })(),
    });
    map.addControl(topRightContainer)

    //bottom right container
    var bottomRightContainer = new ol.control.Control({
        element: (() => {
            var bottomRightContainer = document.createElement('div');
            bottomRightContainer.id = 'bottom-right-container';
            return bottomRightContainer;
        })(),
    });
    map.addControl(bottomRightContainer)

function showPopupsForVisibleFeatures() {
    var extent = map.getView().calculateExtent(map.getSize());

    // Get all layers
    var layers = map.getLayers().getArray();

    // Find the vector layer
    var vectorLayer = layers.find(layer => 
        layer instanceof ol.layer.Vector
    );

    if (!vectorLayer) {
        console.error("Vector layer not found!");
        return;
    }

    var source = vectorLayer.getSource();
    var features = source.getFeatures();

    console.log("Total features in layer:", features.length);

    var featuresToShow = features.filter(feature => {
        var intersects = feature.getGeometry().intersectsExtent(extent);
        console.log("Feature ID:", feature.getId(), "Intersects:", intersects);
        return intersects;
    });

    console.log("Features to show popups for:", featuresToShow.length);

    if (featuresToShow.length > 0) {
        featuresToShow.forEach(function (feature) {
            var geometry = feature.getGeometry();
            var coordinates;

            if (geometry.getType() === 'Point') {
                coordinates = geometry.getCoordinates();
            } else {
                coordinates = geometry.getClosestPoint(map.getView().getCenter());
            }

            console.log("Displaying popup at:", coordinates);

            var fakeEvent = {
                coordinate: coordinates,
                originalEvent: { preventDefault: function () {} }
            };

            onSingleClickFeatures(fakeEvent);
        });
    } else {
        console.log("No features found within the visible extent.");
    }
}
    
//popup
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var sketch;

closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};
var overlayPopup = new ol.Overlay({
    element: container
});
map.addOverlay(overlayPopup)
    
    
var NO_POPUP = 0
var ALL_FIELDS = 1

/**
 * Returns either NO_POPUP, ALL_FIELDS or the name of a single field to use for
 * a given layer
 * @param layerList {Array} List of ol.Layer instances
 * @param layer {ol.Layer} Layer to find field info about
 */
function getPopupFields(layerList, layer) {
    // Determine the index that the layer will have in the popupLayers Array,
    // if the layersList contains more items than popupLayers then we need to
    // adjust the index to take into account the base maps group
    var idx = layersList.indexOf(layer) - (layersList.length - popupLayers.length);
    return popupLayers[idx];
}

//highligth collection
var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: collection,
        useSpatialIndex: false // optional, might improve performance
    }),
    style: [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.1)'
        }),
    })],
    updateWhileAnimating: true, // optional, for instant visual feedback
    updateWhileInteracting: true // optional, for instant visual feedback
});

var doHighlight = true; // highlights feature when hovering over it
var doHover = false; // shows a popup when hovering over a feature

function createPopupField(currentFeature, currentFeatureKeys, layer) {
    var popupText = '';
    for (var i = 0; i < currentFeatureKeys.length; i++) {
        if (currentFeatureKeys[i] != 'geometry') {
            var popupField = '';
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "hidden field") {
                continue;
            } else if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data") {
                if (currentFeature.get(currentFeatureKeys[i]) == null) {
                    continue;
                }
            }
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - always visible" ||
                layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data") {
                popupField += '<th>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</th><td>';
            } else {
                popupField += '<td colspan="2">';
            }
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
                if (currentFeature.get(currentFeatureKeys[i]) == null) {
                    continue;
                }
            }
            if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - always visible" ||
                layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
                popupField += '<strong>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</strong><br />';
            }
            if (layer.get('fieldImages')[currentFeatureKeys[i]] != "ExternalResource") {
				popupField += (currentFeature.get(currentFeatureKeys[i]) != null ? autolinker.link(currentFeature.get(currentFeatureKeys[i]).toLocaleString()) + '</td>' : '');
			} else {
				var fieldValue = currentFeature.get(currentFeatureKeys[i]);
				if (/\.(gif|jpg|jpeg|tif|tiff|png|avif|webp|svg)$/i.test(fieldValue)) {
					popupField += (fieldValue != null ? '<img src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" /></td>' : '');
				} else if (/\.(mp4|webm|ogg|avi|mov|flv)$/i.test(fieldValue)) {
					popupField += (fieldValue != null ? '<video controls><source src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + '" type="video/mp4">Il tuo browser non supporta il tag video.</video></td>' : '');
				} else {
					popupField += (fieldValue != null ? autolinker.link(fieldValue.toLocaleString()) + '</td>' : '');
				}
			}
            popupText += '<tr>' + popupField + '</tr>';
        }
    }
    return popupText;
}


var highlight;
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

function onPointerMove(evt) {
    if (!doHover && !doHighlight) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var currentFeature;
    var currentLayer;
    var currentFeatureKeys;
    var clusteredFeatures;
    var clusterLength;
    var popupText = '<ul>';

    var mapTarget = map.getTargetElement(); // Access the map container

    var isHoveringFeature = false; // Track if the cursor is over a feature

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") == undefined)) {
            isHoveringFeature = true; // Mark that the cursor is over a feature
            var doPopup = false;
            for (k in layer.get('fieldImages')) {
                if (layer.get('fieldImages')[k] != "Hidden") {
                    doPopup = true;
                }
            }
            currentFeature = feature;
            currentLayer = layer;
            clusteredFeatures = feature.get("features");
            if (clusteredFeatures) {
                clusterLength = clusteredFeatures.length;
            }
            if (typeof clusteredFeatures !== "undefined") {
                if (doPopup) {
                    for (var n = 0; n < clusteredFeatures.length; n++) {
                        currentFeature = clusteredFeatures[n];
                        currentFeatureKeys = currentFeature.getKeys();
                        popupText += '<li><table>';
                        popupText += '<a>' + '<b>' + layer.get('popuplayertitle') + '</b>' + '</a>';
                        popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                        popupText += '</table></li>';
                    }
                }
            } else {
                currentFeatureKeys = currentFeature.getKeys();
                if (doPopup) {
                    popupText += '<li><table>';
                    popupText += '<a>' + '<b>' + layer.get('popuplayertitle') + '</b>' + '</a>';
                    popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                    popupText += '</table></li>';
                }
            }
        }
    });

    // Change the cursor based on whether the user is hovering over a feature
    if (isHoveringFeature) {
        mapTarget.style.cursor = 'pointer'; // Change cursor to hand pointer
    } else {
        mapTarget.style.cursor = ''; // Reset to default cursor
    }

    if (popupText == '<ul>') {
        popupText = '';
    } else {
        popupText += '</ul>';
    }

    if (doHighlight) {
        if (currentFeature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (currentFeature) {
                var featureStyle;
                if (typeof clusteredFeatures == "undefined") {
                    var style = currentLayer.getStyle();
                    var styleFunction = typeof style === 'function' ? style : function() { return style; };
                    featureStyle = styleFunction(currentFeature)[0];
                } else {
                    featureStyle = currentLayer.getStyle().toString();
                }

                if (currentFeature.getGeometry().getType() == 'Point' || currentFeature.getGeometry().getType() == 'MultiPoint') {
                    var radius;
                    if (typeof clusteredFeatures == "undefined") {
                        radius = featureStyle.getImage().getRadius();
                    } else {
                        radius = parseFloat(featureStyle.split('radius')[1].split(' ')[1]) + clusterLength;
                    }

                    highlightStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: new ol.style.Fill({
                                color: "#00cee3"
                            }),
                            radius: radius
                        })
                    });
                } else if (currentFeature.getGeometry().getType() == 'LineString' || currentFeature.getGeometry().getType() == 'MultiLineString') {
                    var featureWidth = featureStyle.getStroke().getWidth();

                    highlightStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#00cee3',
                            lineDash: null,
                            width: featureWidth
                        })
                    });
                } else {
                    highlightStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: '#00cee3'
                        })
                    });
                }
                featureOverlay.getSource().addFeature(currentFeature);
                featureOverlay.setStyle(highlightStyle);
            }
            highlight = currentFeature;
        }
    }

    if (doHover) {
        if (popupText) {
            overlayPopup.setPosition(coord);
            content.innerHTML = popupText;
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
            closer.blur();
        }
    }
};

map.on('pointermove', onPointerMove);


var popupContent = '';
var popupCoord = null;
var featuresPopupActive = false;

function updatePopup() {
    if (popupContent) {
        overlayPopup.setPosition(popupCoord);
        content.innerHTML = popupContent;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        closer.blur();
    }
} 


function onSingleClickFeatures(evt) {
    if (doHover || sketch) {
        return;
    }
    if (!featuresPopupActive) {
        featuresPopupActive = true;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var currentFeature;
    var clusteredFeatures;
    var popupText = '<ul>';
    var featureIndex = 0; // To create unique IDs for each feature's tabs

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") === undefined)) {
            var doPopup = false;
            for (var k in layer.get('fieldImages')) {
                if (layer.get('fieldImages')[k] !== "Hidden") {
                    doPopup = true;
                }
            }
            currentFeature = feature;
            clusteredFeatures = feature.get("features");
            // Debuging expressions spot
            if (typeof clusteredFeatures !== "undefined") {
                if (doPopup) {
                    for (var n = 0; n < clusteredFeatures.length; n++) {
                        currentFeature = clusteredFeatures[n];
                        var uniqueId = `feature-${featureIndex}-${n}`; // Unique ID for each feature's tabs
                        popupText += '<li>';
                        popupText += '<a><b>' + currentFeature.get('name') + '</b></a>'; // Show field 'name' as title in the popup
                        
                        popupText += '<c><b>' + currentFeature.get('dist_km') +'<c style="font-size: 13px;"> km &nbsp;</c>' +
                                                currentFeature.get('climb_m') +'<c style="font-size: 13px;"> m &nbsp;/ &nbsp;</c>' +
                                                currentFeature.get('dist_mi') +'<c style="font-size: 13px;"> mi &nbsp;</c>' +
                                                currentFeature.get('climb_ft') +'<c style="font-size: 13px;"> ft</c>' + '</b></c>';

                        popupText += '<e>' + currentFeature.get('descrip') + '</e>'; 

                        // Add two tabs with unique IDs
                        popupText += `
                        <div class="tabs">
                            <button class="tab-button active" onclick="showTabContent('${uniqueId}-tab1', '${uniqueId}')">current records</button>
                            <button class="tab-button" onclick="showTabContent('${uniqueId}-tab2', '${uniqueId}')">previous records</button>
                        </div>
                        <div class="tab-content" id="${uniqueId}-tab1" style="display:block;">
                            <table>
                                <tr>
                                    <td class="col1">${currentFeature.get('OR Munros') ? 'OR: ' + currentFeature.get('OR Munros') : 'OR:'}</td>
                                    <td class="col2">${currentFeature.get('OR d') ? currentFeature.get('OR d') + 'd' : ''}</td>
                                    <td class="col3">${currentFeature.get('OR h') ? currentFeature.get('OR h') + 'h' : ''}</td>
                                    <td class="col4">${currentFeature.get('OR m') ? currentFeature.get('OR m') + 'm' : ''}</td>
                                    <td class="col5">${currentFeature.get('OR s') ? currentFeature.get('OR s') + 's' : ''}</td>
                                    <td class="col6">${currentFeature.get('OR holder') ? currentFeature.get('OR holder') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                    <td class="col7">${currentFeature.get('OR date') ||  ''}</td>
                                </tr>
                                <tr>
                                    <td class="col1">${currentFeature.get('FR Munros') ? 'FR: ' + currentFeature.get('FR Munros') : 'FR:'}</td>
                                    <td class="col2">${currentFeature.get('FR d') ? currentFeature.get('FR d') + 'd' : ''}</td>
                                    <td class="col3">${currentFeature.get('FR h') ? currentFeature.get('FR h') + 'h' : ''}</td>
                                    <td class="col4">${currentFeature.get('FR m') ? currentFeature.get('FR m') + 'm' : ''}</td>
                                    <td class="col5">${currentFeature.get('FR s') ? currentFeature.get('FR s') + 's' : ''}</td>
                                    <td class="col6">${currentFeature.get('FR holder') ? currentFeature.get('FR holder') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                    <td class="col7">${currentFeature.get('FR date') ||  ''}</td>
                                </tr>
                                <tr>
                                    <td class="col1">${currentFeature.get('WOR Munros') ? 'WOR: ' + currentFeature.get('WOR Munros') : 'WOR:'}</td>
                                    <td class="col2">${currentFeature.get('WOR d') ? currentFeature.get('WOR d') + 'd' : ''}</td>
                                    <td class="col3">${currentFeature.get('WOR h') ? currentFeature.get('WOR h') + 'h' : ''}</td>
                                    <td class="col4">${currentFeature.get('WOR m') ? currentFeature.get('WOR m') + 'm' : ''}</td>
                                    <td class="col5">${currentFeature.get('WOR s') ? currentFeature.get('WOR s') + 's' : ''}</td>
                                    <td class="col6">${currentFeature.get('WOR holder') ? currentFeature.get('WOR holder') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                    <td class="col7">${currentFeature.get('WOR date') ||  ''}</td>
                                </tr>
                                <tr>
                                    <td class="col1">${currentFeature.get('WFR Munros') ? 'WFR: ' + currentFeature.get('WFR Munros') : 'WFR:'}</td>
                                    <td class="col2">${currentFeature.get('WFR d') ? currentFeature.get('WFR d') + 'd' : ''}</td>
                                    <td class="col3">${currentFeature.get('WFR h') ? currentFeature.get('WFR h') + 'h' : ''}</td>
                                    <td class="col4">${currentFeature.get('WFR m') ? currentFeature.get('WFR m') + 'm' : ''}</td>
                                    <td class="col5">${currentFeature.get('WFR s') ? currentFeature.get('WFR s') + 's' : ''}</td>
                                    <td class="col6">${currentFeature.get('WFR holder') ? currentFeature.get('WFR holder') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                    <td class="col7">${currentFeature.get('WFR date') ||  ''}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="tab-content" id="${uniqueId}-tab2" style="display:none;">
                        <table>
                            <tr>
                                <td class="tab2-titles">Open Records</td>
                            </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_OR') ? currentFeature.get('p_OR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                            <tr>
                                <td class="tab2-titles">Female Records</td>
                            </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_FR') ? currentFeature.get('p_FR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                            <tr>
                                <td class="tab2-titles">Winter Open Records</td>
                                </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_WOR') ? currentFeature.get('p_WOR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                            <tr>
                                <td class="tab2-titles">Winter Female Records</td>
                                </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_WFR') ? currentFeature.get('p_WFR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                        </table>
                    </div>
                    `;

                        // Retrieve the link attribute and add a button after the table
                        var link = currentFeature.get('link');
                        if (link) {
                            popupText += `<button class="popup-button" onclick="handlePopupButtonClick('${link}')">more info ${n + 1}</button>`;
                        }
                    }
                }   
            } else {
                var uniqueId = `feature-${featureIndex}`;
                if (doPopup) {
                    popupText += '<li>';
                    popupText += '<a><b>' + currentFeature.get('name') + '</b></a>'; // Show field 'name' as title in the popup
                    
                    popupText += '<c><b>' + currentFeature.get('dist_km') +'<c style="font-size: 13px;"> km &nbsp;</c>' +
                                            currentFeature.get('climb_m') +'<c style="font-size: 13px;"> m &nbsp;/ &nbsp;</c>' +
                                            currentFeature.get('dist_mi') +'<c style="font-size: 13px;"> mi &nbsp;</c>' +
                                            currentFeature.get('climb_ft') +'<c style="font-size: 13px;"> ft</c>' + '</b></c>';

                    popupText += '<e>' + currentFeature.get('descrip') + '</e>'; 
                    
                    // Add two tabs with unique IDs
                    popupText += `
                    <div class="tabs">
                        <button class="tab-button active" onclick="showTabContent('${uniqueId}-tab1', '${uniqueId}')">current records</button>
                        <button class="tab-button" onclick="showTabContent('${uniqueId}-tab2', '${uniqueId}')">previous records</button>
                    </div>
                    <div class="tab-content" id="${uniqueId}-tab1" style="display:block;">
                        <table>
                            <tr>
                                <td class="col1">${currentFeature.get('OR Munros') ? 'OR: ' + currentFeature.get('OR Munros') : 'OR:'}</td>
                                <td class="col2">${currentFeature.get('OR d') ? currentFeature.get('OR d') + 'd' : ''}</td>
                                <td class="col3">${currentFeature.get('OR h') ? currentFeature.get('OR h') + 'h' : ''}</td>
                                <td class="col4">${currentFeature.get('OR m') ? currentFeature.get('OR m') + 'm' : ''}</td>
                                <td class="col5">${currentFeature.get('OR s') ? currentFeature.get('OR s') + 's' : ''}</td>
                                <td class="col6">${currentFeature.get('OR holder') ? currentFeature.get('OR holder') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                <td class="col7">${currentFeature.get('OR date') ||  ''}</td>
                            </tr>
                            <tr>
                                <td class="col1">${currentFeature.get('FR Munros') ? 'FR: ' + currentFeature.get('FR Munros') : 'FR:'}</td>
                                <td class="col2">${currentFeature.get('FR d') ? currentFeature.get('FR d') + 'd' : ''}</td>
                                <td class="col3">${currentFeature.get('FR h') ? currentFeature.get('FR h') + 'h' : ''}</td>
                                <td class="col4">${currentFeature.get('FR m') ? currentFeature.get('FR m') + 'm' : ''}</td>
                                <td class="col5">${currentFeature.get('FR s') ? currentFeature.get('FR s') + 's' : ''}</td>
                                <td class="col6">${currentFeature.get('FR holder') ? currentFeature.get('FR holder') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                <td class="col7">${currentFeature.get('FR date') ||  ''}</td>
                            </tr>
                            <tr>
                                <td class="col1">${currentFeature.get('WOR Munros') ? 'WOR: ' + currentFeature.get('WOR Munros') : 'WOR:'}</td>
                                <td class="col2">${currentFeature.get('WOR d') ? currentFeature.get('WOR d') + 'd' : ''}</td>
                                <td class="col3">${currentFeature.get('WOR h') ? currentFeature.get('WOR h') + 'h' : ''}</td>
                                <td class="col4">${currentFeature.get('WOR m') ? currentFeature.get('WOR m') + 'm' : ''}</td>
                                <td class="col5">${currentFeature.get('WOR s') ? currentFeature.get('WOR s') + 's' : ''}</td>
                                <td class="col6">${currentFeature.get('WOR holder') ? currentFeature.get('WOR holder') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                <td class="col7">${currentFeature.get('WOR date') ||  ''}</td>
                            </tr>
                            <tr>
                                <td class="col1">${currentFeature.get('WFR Munros') ? 'WFR: ' + currentFeature.get('WFR Munros') : 'WFR:'}</td>
                                <td class="col2">${currentFeature.get('WFR d') ? currentFeature.get('WFR d') + 'd' : ''}</td>
                                <td class="col3">${currentFeature.get('WFR h') ? currentFeature.get('WFR h') + 'h' : ''}</td>
                                <td class="col4">${currentFeature.get('WFR m') ? currentFeature.get('WFR m') + 'm' : ''}</td>
                                <td class="col5">${currentFeature.get('WFR s') ? currentFeature.get('WFR s') + 's' : ''}</td>
                                <td class="col6">${currentFeature.get('WFR holder') ? currentFeature.get('WFR holder') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                <td class="col7">${currentFeature.get('WFR date') ||  ''}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="tab-content" id="${uniqueId}-tab2" style="display:none;">
                        <table>
                            <tr>
                                <td class="tab2-titles">Open Records</td>
                            </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_OR') ? currentFeature.get('p_OR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                            <tr>
                                <td class="tab2-titles">Female Records</td>
                            </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_FR') ? currentFeature.get('p_FR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                            <tr>
                                <td class="tab2-titles">Winter Open Records</td>
                                </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_WOR') ? currentFeature.get('p_WOR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                            <tr>
                                <td class="tab2-titles">Winter Female Records</td>
                                </tr>
                            <tr>
                                <td class="col-tab2">${currentFeature.get('p_WFR') ? currentFeature.get('p_WFR').replace(/,\s*/g, '<br>') : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                            </tr>
                        </table>
                    </div>
                    `;

                    // Retrieve the link attribute and add a button after the table
                    var link = currentFeature.get('link');
                    if (link) {
                        popupText += `<button class="popup-button" onclick="handlePopupButtonClick('${link}')">more info</button>`;
                    }
                }
            }
            featureIndex++; // Increment feature index to ensure unique IDs
        }
    });

    if (popupText === '<ul>') {
        popupText = '';
    } else {
        popupText += '</ul>';
    }

    // Smoothly center the map on the clicked feature (no zoom change)
    if (currentFeature) {
        var geometry = currentFeature.getGeometry();
        var center = geometry.getCoordinates();

        // Use the animate method to smoothly pan the map to the feature's coordinates
        map.getView().animate({
            center: center,       // The target center to animate to
            duration: 1000,       // The duration of the animation in milliseconds (1 second)
            easing: ol.easing.easeInOut, // Easing function for smoothness
        });
    }

    // Update popup content
    popupContent = popupText;
    popupCoord = coord;
    updatePopup();
}

// Button click handler function
function handlePopupButtonClick(link) {
    if (link) {
        window.open(link, '_blank'); // Open the link in a new tab
    } else {
        alert('No link available.');
    }
}

// Function for tab switching
function showTabContent(tabId, groupId) {
    // Hide all tab content within the same group
    var groupTabs = document.querySelectorAll(`[id^="${groupId}-"]`);
    groupTabs.forEach(tab => tab.style.display = 'none');

    // Show the selected tab content
    var selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Remove the active class from all buttons in the same group
    var tabButtons = document.querySelectorAll(`.tab-button`);
    tabButtons.forEach(button => {
        if (button.onclick.toString().includes(groupId)) {
            button.classList.remove('active');
        }
    });

    // Add the active class to the clicked button
    var activeButton = document.querySelector(`[onclick="showTabContent('${tabId}', '${groupId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}



function onSingleClickWMS(evt) {
    if (doHover || sketch) {
        return;
    }
	if (!featuresPopupActive) {
		popupContent = '';
	}
    var coord = evt.coordinate;
    var viewProjection = map.getView().getProjection();
    var viewResolution = map.getView().getResolution();

    for (var i = 0; i < wms_layers.length; i++) {
        if (wms_layers[i][1] && wms_layers[i][0].getVisible()) {
            var url = wms_layers[i][0].getSource().getFeatureInfoUrl(
                evt.coordinate, viewResolution, viewProjection, {
                    'INFO_FORMAT': 'text/html',
                });
            if (url) {				
                const wmsTitle = wms_layers[i][0].get('popuplayertitle');					
                var ldsRoller = '<div id="lds-roller"><img class="lds-roller-img" style="height: 25px; width: 25px;"></img></div>';
				
                popupCoord = coord;
				popupContent += ldsRoller;
                updatePopup();

                var timeoutPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('Timeout exceeded'));
                    }, 5000); // (5 second)
                });

                Promise.race([
                    fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url)),
                    timeoutPromise
                ])
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                })
                .then((html) => {
                    if (html.indexOf('<table') !== -1) {
                        popupContent += '<a><b>' + wmsTitle + '</b></a>';
                        popupContent += html + '<p></p>';
                        updatePopup();
                    }
                })
                // .catch((error) => {
				// })
                .finally(() => {
                    setTimeout(() => {
                        var loaderIcon = document.querySelector('#lds-roller');
						loaderIcon.remove();
                    }, 500); // (0.5 second)	
                });
            }
        }
    }
}

map.on('singleclick', onSingleClickFeatures);
map.on('singleclick', onSingleClickWMS);

//get container
var topLeftContainerDiv = document.getElementById('top-left-container')
var bottomLeftContainerDiv = document.getElementById('bottom-left-container')
var bottomRightContainerDiv = document.getElementById('bottom-right-container')

//title

var Title = new ol.control.Control({
    element: (() => {
        var titleElement = document.createElement('div');
        titleElement.className = 'top-right-title ol-control';

        // Use a div instead of a link and add an event listener for click
        titleElement.innerHTML = `
            <div class="project-title-link" style="cursor: pointer;">
                <h2><i class="fa fa-home"></i></h2>
            </div>
        `;

        // Add the click event listener
        titleElement.addEventListener('click', () => {
            // Close the popup if it's open
            container.style.display = 'none'; // Assuming 'container' is the popup container

            // Re-center the map to the initial coordinates
            map.getView().fit([-967935.474152, 7339868.164565, -55701.887195, 8000719.267161], {
                size: map.getSize(),
                duration: 1000 // Smooth animation duration in milliseconds
            });
        });

        return titleElement;
    })(),
    target: 'top-right-container'
});
map.addControl(Title);

    
//abstract


//geolocate



//measurement


//geocoder


//layer search starts here

// Define the combined layer source
var jsonSource_CombinedRoutes = new ol.source.Vector({
    attributions: ' ',
});

// Function to update the combined layer dynamically
function updateCombinedRoutes() {
    var features_Multidaychallenges = jsonSource_Multidaychallenges_3 ? jsonSource_Multidaychallenges_3.getFeatures() : [];
    var features_24hchallenges = jsonSource_24hchallenges_4 ? jsonSource_24hchallenges_4.getFeatures() : [];
    var features_Other = jsonSource_Other_5 ? jsonSource_Other_5.getFeatures() : [];

    jsonSource_CombinedRoutes.clear(); // Clear existing features
    jsonSource_CombinedRoutes.addFeatures(features_Multidaychallenges);
    jsonSource_CombinedRoutes.addFeatures(features_24hchallenges);
    jsonSource_CombinedRoutes.addFeatures(features_Other);
}

// Create the combined layer
var lyr_CombinedRoutes = new ol.layer.Vector({
    declutter: false,
    source: jsonSource_CombinedRoutes, 
    style: style_CombinedRoutes,  // COmbinedRoutes style
    popuplayertitle: 'Combined Long Distance Routes',
    interactive: true,
    visible: false  // Set the layer to be invisible
});

// Load initial features (if they already exist)
updateCombinedRoutes();

// Attach event listeners to update the combined layer when other sources change
if (jsonSource_Multidaychallenges_3) {
    jsonSource_Multidaychallenges_3.on('change', updateCombinedRoutes);
}
if (jsonSource_24hchallenges_4) {
    jsonSource_24hchallenges_4.on('change', updateCombinedRoutes);
}
if (jsonSource_Other_5) {
    jsonSource_Other_5.on('change', updateCombinedRoutes);
}

// Search functionality for the combined layer
var searchLayer = new SearchLayer({
    layer: lyr_CombinedRoutes,
    colName: 'name',
    zoom: 17,
    collapsed: true,
    map: map
});
map.addControl(searchLayer);
document.getElementsByClassName('search-layer')[0].getElementsByTagName('button')[0].className += ' fa fa-binoculars';
document.getElementsByClassName('search-layer-input-search')[0].placeholder = 'Search route ...';

// Add the combined layer to the map
map.addLayer(lyr_CombinedRoutes);


//scalebar


//layerswitcher

var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: "Layers",
    target: 'top-right-container'
});
map.addControl(layerSwitcher);
    


//attribution
var bottomAttribution = new ol.control.Attribution({
  collapsible: false,
  collapsed: false,
  className: 'bottom-attribution'
});
map.addControl(bottomAttribution);

var attributionList = document.createElement('li');
attributionList.innerHTML = `
	<a href="mailto:fjcabreravaldes@gmail.com" target="_blank">fjcabreravaldes@gmail.com</a> &middot;
	<a href="https://github.com/qgis2web/qgis2web" target="_blank">qgis2web</a> &middot;
    <a href="https://openlayers.org/" target="_blank">OpenLayers</a> &middot;
	<a href="https://qgis.org/" target="_blank">QGIS</a>	
`;
bottomAttribution.element.appendChild(attributionList);


// Disable "popup on hover" or "highlight on hover" if ol-control mouseover
var preDoHover = doHover;
var preDoHighlight = doHighlight;
var isPopupAllActive = false;
document.addEventListener('DOMContentLoaded', function() {
	if (doHover || doHighlight) {
		var controlElements = document.getElementsByClassName('ol-control');
		for (var i = 0; i < controlElements.length; i++) {
			controlElements[i].addEventListener('mouseover', function() { 
				doHover = false;
				doHighlight = false;
			});
			controlElements[i].addEventListener('mouseout', function() {
				doHover = preDoHover;
				if (isPopupAllActive) { return }
				doHighlight = preDoHighlight;
			});
		}
	}
});


//move controls inside containers, in order
    //zoom
    var zoomControl = document.getElementsByClassName('ol-zoom')[0];
    if (zoomControl) {
        topLeftContainerDiv.appendChild(zoomControl);
    }
    //geolocate
    var geolocateControl = document.getElementsByClassName('geolocate')[0];
    if (geolocateControl) {
        topLeftContainerDiv.appendChild(geolocateControl);
    }
    //measure
    var measureControl = document.getElementsByClassName('measure-control')[0];
    if (measureControl) {
        topLeftContainerDiv.appendChild(measureControl);
    }
    //geocoder
    var geocoderControl = document.getElementsByClassName('ol-geocoder')[0];
    if (geocoderControl) {
        topLeftContainerDiv.appendChild(geocoderControl);
    }
    //search layer
    var searchLayerControl = document.getElementsByClassName('search-layer')[0];
    if (searchLayerControl) {
        topLeftContainerDiv.appendChild(searchLayerControl);
    }
    //scale line
    var scaleLineControl = document.getElementsByClassName('ol-scale-line')[0];
    if (scaleLineControl) {
        scaleLineControl.className += ' ol-control';
        bottomLeftContainerDiv.appendChild(scaleLineControl);
    }
    //attribution
    var attributionControl = document.getElementsByClassName('bottom-attribution')[0];
    if (attributionControl) {
        bottomRightContainerDiv.appendChild(attributionControl);
    }

    //create list from fields and controls to sort them
    function populatePageList(geoJsonDataArray) {
        const pageList = document.getElementById('page_list');
        const mapSection = document.getElementById('map'); // Get the map section
    
        if (pageList && mapSection) {
            // Create a container for the table
            const container = document.createElement('div');
    
            // Create a table element
            const table = document.createElement('table');
            table.classList.add('styled-table');
    
            // Define the fields to be displayed
            const fields = ['name', 'dist_km', 'dist_mi', 'climb_m', 'climb_ft', 'OR holder', 'FR holder', 'WOR holder', 'WFR holder', 'area', 'type'];	
    
            // Create the table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const columns = [
                'Name',
                'Distance <br>(km)',
                '<br>(mi)',
                'Climb <br>(m)',
                '<br>(ft)',
                'Open Record <br>(OR)',
                'Female Record <br>(FR)',
                'Winter O Record <br>(WOR)',
                'Winter F Record <br>(WFR)',
                'Area',
                'Type',
            ];
    
            // Store sorting order per column
            const sortDirections = {};
    
            columns.forEach((col, index) => {
                const th = document.createElement('th');
                th.innerHTML = `${col} <i class="fa fa-sort"></i>`; // FontAwesome icon for sorting
                th.style.cursor = 'pointer';
    
                // Click event to sort column
                th.addEventListener('click', () => {
                    sortTableByColumn(index);
                });
    
                headerRow.appendChild(th);
            });
    
            thead.appendChild(headerRow);
            table.appendChild(thead);
    
            // Create the table body
            const tbody = document.createElement('tbody');
    
            // Function to populate the table body with data
function populateTableBody(data) {
    tbody.innerHTML = ''; // Clear any existing rows

    data.forEach((feature, featureIndex) => {
        const row = document.createElement('tr');

        fields.forEach(field => {
            const cell = document.createElement('td');

            // If the field is "name", apply special styling
            if (field === 'name') {
                cell.textContent = feature.properties[field] || '';
                cell.classList.add('name-column-style'); // Add a custom class for styling
            }
        
            // Handle the 'OR holder' dynamically
            if (field === 'OR holder') {
                let content = '';
        
                if (feature.properties['OR Munros']) {
                    content += `<span class="record-section"><strong></strong> ${feature.properties['OR Munros']}<br></span>`;
                }
                if (feature.properties['OR d'] || feature.properties['OR h'] || feature.properties['OR m'] || feature.properties['OR s']) {
                    content += `<span class="record-section"><strong></strong> 
                        ${feature.properties['OR d'] ? feature.properties['OR d'] + 'd ' : ''} 
                        ${feature.properties['OR h'] ? feature.properties['OR h'] + 'h ' : ''} 
                        ${feature.properties['OR m'] ? feature.properties['OR m'] + 'm ' : ''} 
                        ${feature.properties['OR s'] ? feature.properties['OR s'] + 's ' : ''} 
                        <br></span>`;
                }
        
                if (feature.properties['OR holder']) {
                    let holder = feature.properties['OR holder'];
        
                    if (holder.includes('and')) {
                        holder = holder.replace(/and/g, 'and<br>'); // Adds <br> after every "and"
                    }
                    content += `<span class="record-section holder-style">${holder}</span>`;
                } else {
                    content += `<span class="record-section noholder-style">N/A</span>`;
                }
        
                if (feature.properties['OR date']) {
                    content += `<strong></strong> ${feature.properties['OR date']}<br>`;
                }
        
                cell.innerHTML = content || ''; // Suppress empty cell if all values are missing
            }
        
            // Handle the 'FR holder' dynamically
            else if (field === 'FR holder') {
                let content = '';
        
                if (feature.properties['FR Munros']) {
                    content += `<span class="record-section"><strong></strong> ${feature.properties['FR Munros']}<br></span>`;
                }
                if (feature.properties['FR d'] || feature.properties['FR h'] || feature.properties['FR m'] || feature.properties['FR s']) {
                    content += `<span class="record-section"><strong></strong> 
                        ${feature.properties['FR d'] ? feature.properties['FR d'] + 'd ' : ''} 
                        ${feature.properties['FR h'] ? feature.properties['FR h'] + 'h ' : ''} 
                        ${feature.properties['FR m'] ? feature.properties['FR m'] + 'm ' : ''} 
                        ${feature.properties['FR s'] ? feature.properties['FR s'] + 's ' : ''} 
                        <br></span>`;
                }
        
                if (feature.properties['FR holder']) {
                    let holder = feature.properties['FR holder'];
        
                    if (holder.includes('and')) {
                        holder = holder.replace(/and/g, 'and<br>'); // Adds <br> after every "and"
                    }
                    content += `<span class="record-section holder-style">${holder}</span>`;
                } else {
                    content += `<span class="record-section noholder-style">N/A</span>`;
                }
        
                if (feature.properties['FR date']) {
                    content += `<strong></strong> ${feature.properties['FR date']}<br>`;
                }
        
                cell.innerHTML = content || ''; // Suppress empty cell if all values are missing
            }
        
            // Handle the 'WOR holder' dynamically
            else if (field === 'WOR holder') {
                let content = '';
        
                if (feature.properties['WOR Munros']) {
                    content += `<span class="record-section"><strong></strong> ${feature.properties['WOR Munros']}<br></span>`;
                }
                if (feature.properties['WOR d'] || feature.properties['WOR h'] || feature.properties['WOR m'] || feature.properties['WOR s']) {
                    content += `<span class="record-section"><strong></strong> 
                        ${feature.properties['WOR d'] ? feature.properties['WOR d'] + 'd ' : ''} 
                        ${feature.properties['WOR h'] ? feature.properties['WOR h'] + 'h ' : ''} 
                        ${feature.properties['WOR m'] ? feature.properties['WOR m'] + 'm ' : ''} 
                        ${feature.properties['WOR s'] ? feature.properties['WOR s'] + 's ' : ''} 
                        <br></span>`;
                }
        
                if (feature.properties['WOR holder']) {
                    let holder = feature.properties['WOR holder'];
        
                    if (holder.includes('and')) {
                        holder = holder.replace(/and/g, 'and<br>'); // Adds <br> after every "and"
                    }
                    content += `<span class="record-section holder-style">${holder}</span>`;
                } else {
                    content += `<span class="record-section noholder-style">N/A</span>`;
                }
        
                if (feature.properties['WOR date']) {
                    content += `<strong></strong> ${feature.properties['WOR date']}<br>`;
                }
        
                cell.innerHTML = content || ''; // Suppress empty cell if all values are missing
            }
        
            // Handle the 'WFR holder' dynamically
            else if (field === 'WFR holder') {
                let content = '';
        
                if (feature.properties['WFR Munros']) {
                    content += `<span class="record-section"><strong></strong> ${feature.properties['WFR Munros']}<br></span>`;
                }
                if (feature.properties['WFR d'] || feature.properties['WFR h'] || feature.properties['WFR m'] || feature.properties['WFR s']) {
                    content += `<span class="record-section"><strong></strong> 
                        ${feature.properties['WFR d'] ? feature.properties['WFR d'] + 'd ' : ''} 
                        ${feature.properties['WFR h'] ? feature.properties['WFR h'] + 'h ' : ''} 
                        ${feature.properties['WFR m'] ? feature.properties['WFR m'] + 'm ' : ''} 
                        ${feature.properties['WFR s'] ? feature.properties['WFR s'] + 's ' : ''} 
                        <br></span>`;
                }
        
                if (feature.properties['WFR holder']) {
                    let holder = feature.properties['WFR holder'];
        
                    if (holder.includes('and')) {
                        holder = holder.replace(/and/g, 'and<br>'); // Adds <br> after every "and"
                    }
                    content += `<span class="record-section holder-style">${holder}</span>`;
                } else {
                    content += `<span class="record-section noholder-style">N/A</span>`;
                }
        
                if (feature.properties['WFR date']) {
                    content += `<strong></strong> ${feature.properties['WFR date']}<br>`;
                }
        
                cell.innerHTML = content || ''; // Suppress empty cell if all values are missing
            }
        
            // For other fields, just use text content
            else {
                cell.textContent = feature.properties[field] || '';
            }
        
            row.appendChild(cell);
        });
    
                    // Add a click event to each row
                    row.addEventListener('click', function() {
                        // Show the map and hide the page list
                        mapSection.style.display = 'block';
                        pageList.style.display = 'none';
    
                        // Extract the coordinates from the feature geometry
                        const coordinates = feature.geometry.coordinates;
                        if (coordinates) {
                            // Center the OpenLayers map on the feature coordinates
                            const lonLat = ol.proj.fromLonLat([coordinates[0], coordinates[1]]); // Assuming GeoJSON (longitude, latitude)
    
                            map.getView().setCenter(lonLat); // Set map center
                            map.getView().setZoom(17.5);
    
                            // Open the existing popup overlay
                            var uniqueId = `feature-${featureIndex}`;
                            var popupText = `
                                <ul class="popup-list">
                                    <li>
                                        <a><b>${feature.properties.name}</b></a>
                                        <c><b>${feature.properties.dist_km}<c style="font-size: 13px;"> km &nbsp;</c>
                                        ${feature.properties.climb_m}<c style="font-size: 13px;"> m &nbsp;/ &nbsp;</c>
                                        ${feature.properties.dist_mi}<c style="font-size: 13px;"> mi &nbsp;</c>
                                        ${feature.properties.climb_ft}<c style="font-size: 13px;"> ft</c></b></c>
                                        <e>${feature.properties.descrip}</e>
                                        <div class="tabs">
                                            <button class="tab-button active" onclick="showTabContent('${uniqueId}-tab1', '${uniqueId}')">current records</button>
                                            <button class="tab-button" onclick="showTabContent('${uniqueId}-tab2', '${uniqueId}')">previous records</button>
                                        </div>
                                        <div class="tab-content" id="${uniqueId}-tab1" style="display:block;">
                                            <table>
                                                <tr>
                                                    <td class="col1">${feature.properties['OR Munros'] ? 'OR: ' + feature.properties['OR Munros'] : 'OR:'}</td>
                                                    <td class="col2">${feature.properties['OR d'] ? feature.properties['OR d'] + 'd' : ''}</td>
                                                    <td class="col3">${feature.properties['OR h'] ? feature.properties['OR h'] + 'h' : ''}</td>
                                                    <td class="col4">${feature.properties['OR m'] ? feature.properties['OR m'] + 'm' : ''}</td>
                                                    <td class="col5">${feature.properties['OR s'] ? feature.properties['OR s'] + 's' : ''}</td>
                                                    <td class="col6">${feature.properties['OR holder'] ? feature.properties['OR holder'] : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                                    <td class="col7">${feature.properties['OR date'] || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td class="col1">${feature.properties['FR Munros'] ? 'FR: ' + feature.properties['FR Munros'] : 'FR:'}</td>
                                                    <td class="col2">${feature.properties['FR d'] ? feature.properties['FR d'] + 'd' : ''}</td>
                                                    <td class="col3">${feature.properties['FR h'] ? feature.properties['FR h'] + 'h' : ''}</td>
                                                    <td class="col4">${feature.properties['FR m'] ? feature.properties['FR m'] + 'm' : ''}</td>
                                                    <td class="col5">${feature.properties['FR s'] ? feature.properties['FR s'] + 's' : ''}</td>
                                                    <td class="col6">${feature.properties['FR holder'] ? feature.properties['FR holder'] : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                                    <td class="col7">${feature.properties['FR date'] || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td class="col1">${feature.properties['WOR Munros'] ? 'WOR: ' + feature.properties['WOR Munros'] : 'WOR:'}</td>
                                                    <td class="col2">${feature.properties['WOR d'] ? feature.properties['WOR d'] + 'd' : ''}</td>
                                                    <td class="col3">${feature.properties['WOR h'] ? feature.properties['WOR h'] + 'h' : ''}</td>
                                                    <td class="col4">${feature.properties['WOR m'] ? feature.properties['WOR m'] + 'm' : ''}</td>
                                                    <td class="col5">${feature.properties['WOR s'] ? feature.properties['WOR s'] + 's' : ''}</td>
                                                    <td class="col6">${feature.properties['WOR holder'] ? feature.properties['WOR holder'] : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                                    <td class="col7">${feature.properties['WOR date'] || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td class="col1">${feature.properties['WFR Munros'] ? 'WFR: ' + feature.properties['WFR Munros'] : 'WFR:'}</td>
                                                    <td class="col2">${feature.properties['WFR d'] ? feature.properties['WFR d'] + 'd' : ''}</td>
                                                    <td class="col3">${feature.properties['WFR h'] ? feature.properties['WFR h'] + 'h' : ''}</td>
                                                    <td class="col4">${feature.properties['WFR m'] ? feature.properties['WFR m'] + 'm' : ''}</td>
                                                    <td class="col5">${feature.properties['WFR s'] ? feature.properties['WFR s'] + 's' : ''}</td>
                                                    <td class="col6">${feature.properties['WFR holder'] ? feature.properties['WFR holder'] : '<span class="pop-up-noholder-style">N/A</span>'}</td>
                                                    <td class="col7">${feature.properties['WFR date'] || ''}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="tab-content" id="${uniqueId}-tab2" style="display:none;">
                                            <table>
                                                <tr>
                                                    <td class="tab2-titles">Open Records</td>
                                                </tr>
                                                <tr>
                                                    <td class="col-tab2">${feature.properties['p_OR'] ? feature.properties['p_OR'].replace(/,\s*/g, '<br>') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                                </tr>
                                                <tr>
                                                    <td class="tab2-titles">Female Records</td>
                                                </tr>
                                                <tr>
                                                    <td class="col-tab2">${feature.properties['p_FR'] ? feature.properties['p_FR'].replace(/,\s*/g, '<br>') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                                </tr>
                                                <tr>
                                                    <td class="tab2-titles">Winter Open Records</td>
                                                </tr>
                                                <tr>
                                                    <td class="col-tab2">${feature.properties['p_WOR'] ? feature.properties['p_WOR'].replace(/,\s*/g, '<br>') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                                </tr>
                                                <tr>
                                                    <td class="tab2-titles">Winter Female Records</td>
                                                </tr>
                                                <tr>
                                                    <td class="col-tab2">${feature.properties['p_WFR'] ? feature.properties['p_WFR'].replace(/,\s*/g, '<br>') : '<span style="color: #b4b4b4; font-weight: normal;">N/A</span>'}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </li>
                                </ul>
                            `;

                            // Retrieve the link attribute and add a button after the table
                            var link = feature.properties.link;
                            if (link) {
                                popupText += `<button class="popup-button" onclick="handlePopupButtonClick('${link}')">more info</button>`;
                            }
    
                            // Update popup content
                            popupContent = popupText;
                            popupCoord = lonLat;
                            updatePopup();
                        }
                    });
    
                    tbody.appendChild(row);
                });
            }
    
            // Combine features from all GeoJSON data objects
            const allFeatures = [];
            geoJsonDataArray.forEach(geoJsonData => {
                if (geoJsonData && geoJsonData.features) {
                    geoJsonData.features.forEach(feature => {
                        allFeatures.push(feature);
                    });
                }
            });
    
            // Initially populate the table
            populateTableBody(allFeatures);
    
            // Append the table to the container
            table.appendChild(tbody);
            container.appendChild(table);
    
            // Clear any existing content in pageList and append the new container
            pageList.innerHTML = ''; // Clear page list before appending new content
            pageList.appendChild(container);
    
            // Function to sort the table by column
            function sortTableByColumn(index) {
                // Toggle sorting order (ascending <-> descending)
                sortDirections[index] = !sortDirections[index]; // Toggle state
    
                const sortedData = [...allFeatures].sort((a, b) => {
                    const aValue = a.properties[fields[index]] || '';
                    const bValue = b.properties[fields[index]] || '';
    
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return sortDirections[index] ? aValue - bValue : bValue - aValue;
                    }
    
                    return sortDirections[index] ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                });
    
                // Re-populate the table body with sorted data
                populateTableBody(sortedData);
            }
        } else {
            console.error('page_list or map element is not defined.');
        }
    }
    
