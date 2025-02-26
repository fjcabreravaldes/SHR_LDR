function hasClass(el, cls) {
  return el.className && new RegExp('(\\s|^)' +
    cls + '(\\s|$)').test(el.className);
}

function addClass(elem, className) {
  if (!hasClass(elem, className)) {
    elem.className += ' ' + className;
  }
}

function removeClass(elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
}

var SearchLayer = (function (Control) {
  function SearchLayer(optOptions) {
    var horseyComponent;
    var select;
    var options = optOptions || {};
    if (optOptions.layer) {
      options.layer = optOptions.layer;
    } else {
      throw new Error('error');
    }
    options.map = optOptions.map;

    var source;
    if (options.layer instanceof ol.layer.Image &&
      options.layer.getSource() instanceof ol.source.ImageVector) {
      source = options.layer.getSource().getSource();
    } else if (options.layer instanceof ol.layer.Vector) {
      source = options.layer.getSource();
    }
    options.colName = optOptions.colName;

    var button = document.createElement('button');
    var toogleHideShowInput = function() {
      var input = document.querySelector('form > .search-layer-input-search');
      if (hasClass(input, 'search-layer-collapsed')) {
          removeClass(input, 'search-layer-collapsed');
          input.focus(); // 🔹 Ensure it gains focus
      } else {
          input.value = '';
          addClass(input, 'search-layer-collapsed');
          select.getFeatures().clear();
      }
  };

    button.addEventListener('click', function(event) {
      event.preventDefault();  // Prevent unintended side effects
      toogleHideShowInput();
});

    button.addEventListener('touchend', function(event) {  
      event.preventDefault();  // Stops unwanted scrolling  
      toogleHideShowInput();  
});

    var form = document.createElement('form');
    form.setAttribute('id', 'random');
    form.onsubmit = undefined;

    var input = document.createElement('input');
    input.setAttribute('id', 'ol-search-input');
    var defaultInputClass = ['search-layer-input-search'];
    if (optOptions.collapsed) {
      defaultInputClass.push('search-layer-collapsed');
    }
    input.setAttribute('class', defaultInputClass.join(' '));
    input.setAttribute('placeholder', 'Search ...');
    input.setAttribute('type', 'text');

    form.appendChild(input);

    var element = document.createElement('div');
    element.className = 'search-layer ol-unselectable ol-control';

    element.appendChild(button);
    element.appendChild(form);

    ol.control.Control.call(this, {
      element: element,
      target: options.target
    });

    select = new ol.interaction.Select({
      id: options.selectId || 'defaultSearchLayer',
      layers: [options.layer],
      condition: ol.events.condition.never,
      style: function (feature) {
        return new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#ffffff',  // Set outline color to yellow (default is blue)
            width: 2          // Set outline width
          }),
          fill: new ol.style.Fill({
            color: '#00cee3'  // Set fill color
          }),
          image: new ol.style.Circle({
            radius: 11,  // Set point radius 
            fill: new ol.style.Fill({
              color: '#00cee3'  // Fill color for point features
            }),
            stroke: new ol.style.Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        });
      }
  
    });

    var map = options.map;

    map.addInteraction(select);

    var typesToZoomToExtent = [
      'MultiPoint',
      'LineString',
      'MultiLineString',
      'MultiPolygon',
      'Polygon'
    ];

    var typesToZoomToCenterAndZoom = [
      'Point'
    ];

    var returnHorsey = function(input, source, map, select, options) {
      var horseyComponent = horsey(input, {
        source: [{
          list: source.getFeatures().map(function(el, i) {
            if (el.getId() === undefined) {
              el.setId(i);
            }
            return {
              text: el.get(options.colName),
              value: el.getId() // If GeoJSON has an id
            };
          })
        }],
        getText: 'text',
        getValue: 'value',
        predictNextSearch: function(info) {
          var feat = source.getFeatureById(info.selection.value);
          var featType = feat.getGeometry().getType();
          if (typesToZoomToCenterAndZoom.indexOf(featType) !== -1) {
            var newCenter = ol.extent.getCenter(feat.getGeometry().getExtent());
            map.getView().setCenter(newCenter);
            map.getView().setZoom(options.zoom || 12);
          } else if (typesToZoomToExtent.indexOf(featType) !== -1) {
            map.getView().fit(feat.getGeometry().getExtent(), map.getSize());
          }

          select.getFeatures().clear();
          select.getFeatures().push(feat);
        }
      });

      // Ensure horseyComponent has a .hide() method or log it
      //if (horseyComponent && typeof horseyComponent.hide === 'function') {
        //console.log("horseyComponent initialized correctly.");
      //} else {
        //console.error("horseyComponent does not have a .hide() method.");
      //}

      return horseyComponent; // Make sure to return the component that has .hide()
    };

    if (source.getState() === 'ready') {
      horseyComponent = returnHorsey(input, source, map, select, options);
    }

    source.once('change', function(e) {
      if (source.getState() === 'ready') {
        horseyComponent = returnHorsey(input, source, map, select, options);
      }
    });

    // Remove highlight when clicking anywhere else or another feature
    map.on('click', function(event) {
      var clickedFeature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
        return feature;
      });

      if (clickedFeature) {
        // Clear previous selection before highlighting the new one
        select.getFeatures().clear();
        select.getFeatures().push(clickedFeature);
      } else {
        // Clicked outside a feature, remove highlight
        select.getFeatures().clear();
      }
    });


  }
  if (Control) SearchLayer.__proto__ = Control;
  SearchLayer.prototype = Object.create(Control && Control.prototype);
  SearchLayer.prototype.constructor = SearchLayer;
  return SearchLayer;
})(ol.control.Control);
