var wms_layers = [];


        var lyr_OpenTopoMap_0 = new ol.layer.Tile({
            'title': 'OpenTopoMap',
            'type':'base',
            'opacity': 0.750000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png'
            })
        });

        var lyr_OpenStreetMap_1 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });



var format_Multidaychallenges_3 = new ol.format.GeoJSON();
var features_Multidaychallenges_3 = format_Multidaychallenges_3.readFeatures(json_Multidaychallenges_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Multidaychallenges_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Multidaychallenges_3.addFeatures(features_Multidaychallenges_3);
var lyr_Multidaychallenges_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Multidaychallenges_3, 
                style: style_Multidaychallenges_3,
                popuplayertitle: 'Multi-day challenges',
                interactive: true,
                title: '<img src="styles/legend/Multidaychallenges_3.png" /> Multi-day challenges'
            });

var format_24hchallenges_4 = new ol.format.GeoJSON();
var features_24hchallenges_4 = format_24hchallenges_4.readFeatures(json_24hchallenges_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_24hchallenges_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_24hchallenges_4.addFeatures(features_24hchallenges_4);
var lyr_24hchallenges_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_24hchallenges_4, 
                style: style_24hchallenges_4,
                popuplayertitle: '24h challenges',
                interactive: true,
                title: '<img src="styles/legend/24hchallenges_4.png" /> 24h challenges'
            });
            
var format_Other_5 = new ol.format.GeoJSON();
var features_Other_5 = format_Other_5.readFeatures(json_Other_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Other_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Other_5.addFeatures(features_Other_5);
var lyr_Other_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Other_5, 
                style: style_Other_5,
                popuplayertitle: 'Other',
                interactive: true,
                title: '<img src="styles/legend/Other_5.png" /> Other'
            });

lyr_OpenTopoMap_0.setVisible(false);lyr_OpenStreetMap_1.setVisible(true);;lyr_Multidaychallenges_3.setVisible(true);lyr_24hchallenges_4.setVisible(true);lyr_Other_5.setVisible(true);
var layersList = [lyr_OpenTopoMap_0,lyr_OpenStreetMap_1,lyr_Multidaychallenges_3,lyr_24hchallenges_4,lyr_Other_5];
lyr_Multidaychallenges_3.set('fieldAliases', {'name': 'name', 'link': 'link', 'start': 'start', 'start grid': 'start grid', 'start y': 'start y', 'start x': 'start x', 'dist_km': 'dist_km', 'climb_m': 'climb_m', 'dist_mi': 'dist_mi', 'climb_ft': 'climb_ft', 'circular': 'circular', 'point to p': 'point to p', 'area': 'area', '24h Challe': '24h Challe', 'finish': 'finish', 'finish gri': 'finish gri', 'finish x': 'finish x', 'finish y': 'finish y', 'on foot': 'on foot', 'type': 'type', 'on foot/bi': 'on foot/bi', 'on foot/_1': 'on foot/_1', 'rock climb': 'rock climb', 'OR': 'OR', 'OR d': 'OR d', 'OR h': 'OR h', 'OR m': 'OR m', 'OR s': 'OR s', 'OR holder': 'OR holder', 'OR date': 'OR date', 'first reco': 'first reco', 'first know': 'first know', 'first time': 'first time', 'multiday': 'multiday', 'FR': 'FR', 'FR d': 'FR d', 'FR h': 'FR h', 'FR m': 'FR m', 'FR s': 'FR s', 'FR holder': 'FR holder', 'FR date': 'FR date', 'WOR': 'WOR', 'WOR holder': 'WOR holder', 'WOR d': 'WOR d', 'WOR h': 'WOR h', 'WOR m': 'WOR m', 'WOR s': 'WOR s', 'WOR date': 'WOR date', 'notes': 'notes', 'xreal': 'xreal', 'yreal': 'yreal', 'OR_data': 'OR_data', 'FR_data': 'FR_data', 'OR Munros': 'OR Munros', 'FR Munros': 'FR Munros', 'WOR Munros': 'WOR Munros', 'WOR_data': 'WOR_data', 'WFR': 'WFR', 'WFR holder': 'WFR holder', 'WFR date': 'WFR date', 'WFR d': 'WFR d', 'WFR h': 'WFR h', 'WFR m': 'WFR m', 'WFR s': 'WFR s', 'WFR Munros': 'WFR Munros', 'WFR_data': 'WFR_data', 'descrip': 'descrip', 'dist_climb': 'dist_climb', 'p_OR': 'p_OR', 'p_FR': 'p_FR', 'p_WOR': 'p_WOR', 'p_WFR': 'p_WFR', });
lyr_24hchallenges_4.set('fieldAliases', {'name': 'name', 'link': 'link', 'start': 'start', 'start grid': 'start grid', 'start y': 'start y', 'start x': 'start x', 'dist_km': 'dist_km', 'climb_m': 'climb_m', 'dist_mi': 'dist_mi', 'climb_ft': 'climb_ft', 'circular': 'circular', 'point to p': 'point to p', 'area': 'area', '24h Challe': '24h Challe', 'finish': 'finish', 'finish gri': 'finish gri', 'finish x': 'finish x', 'finish y': 'finish y', 'on foot': 'on foot', 'type': 'type', 'on foot/bi': 'on foot/bi', 'on foot/_1': 'on foot/_1', 'rock climb': 'rock climb', 'OR': 'OR', 'OR d': 'OR d', 'OR h': 'OR h', 'OR m': 'OR m', 'OR s': 'OR s', 'OR holder': 'OR holder', 'OR date': 'OR date', 'first reco': 'first reco', 'first know': 'first know', 'first time': 'first time', 'multiday': 'multiday', 'FR': 'FR', 'FR d': 'FR d', 'FR h': 'FR h', 'FR m': 'FR m', 'FR s': 'FR s', 'FR holder': 'FR holder', 'FR date': 'FR date', 'WOR': 'WOR', 'WOR holder': 'WOR holder', 'WOR d': 'WOR d', 'WOR h': 'WOR h', 'WOR m': 'WOR m', 'WOR s': 'WOR s', 'WOR date': 'WOR date', 'notes': 'notes', 'xreal': 'xreal', 'yreal': 'yreal', 'OR_data': 'OR_data', 'FR_data': 'FR_data', 'OR Munros': 'OR Munros', 'FR Munros': 'FR Munros', 'WOR Munros': 'WOR Munros', 'WOR_data': 'WOR_data', 'WFR': 'WFR', 'WFR holder': 'WFR holder', 'WFR date': 'WFR date', 'WFR d': 'WFR d', 'WFR h': 'WFR h', 'WFR m': 'WFR m', 'WFR s': 'WFR s', 'WFR Munros': 'WFR Munros', 'WFR_data': 'WFR_data', 'descrip': 'descrip', 'dist_climb': 'dist_climb', 'p_OR': 'p_OR', 'p_FR': 'p_FR', 'p_WOR': 'p_WOR', 'p_WFR': 'p_WFR', });
lyr_Other_5.set('fieldAliases', {'name': 'name', 'link': 'link', 'start': 'start', 'start grid': 'start grid', 'start y': 'start y', 'start x': 'start x', 'dist_km': 'dist_km', 'climb_m': 'climb_m', 'dist_mi': 'dist_mi', 'climb_ft': 'climb_ft', 'circular': 'circular', 'point to p': 'point to p', 'area': 'area', '24h Challe': '24h Challe', 'finish': 'finish', 'finish gri': 'finish gri', 'finish x': 'finish x', 'finish y': 'finish y', 'on foot': 'on foot', 'type': 'type', 'on foot/bi': 'on foot/bi', 'on foot/_1': 'on foot/_1', 'rock climb': 'rock climb', 'OR': 'OR', 'OR d': 'OR d', 'OR h': 'OR h', 'OR m': 'OR m', 'OR s': 'OR s', 'OR holder': 'OR holder', 'OR date': 'OR date', 'first reco': 'first reco', 'first know': 'first know', 'first time': 'first time', 'multiday': 'multiday', 'FR': 'FR', 'FR d': 'FR d', 'FR h': 'FR h', 'FR m': 'FR m', 'FR s': 'FR s', 'FR holder': 'FR holder', 'FR date': 'FR date', 'WOR': 'WOR', 'WOR holder': 'WOR holder', 'WOR d': 'WOR d', 'WOR h': 'WOR h', 'WOR m': 'WOR m', 'WOR s': 'WOR s', 'WOR date': 'WOR date', 'notes': 'notes', 'xreal': 'xreal', 'yreal': 'yreal', 'OR_data': 'OR_data', 'FR_data': 'FR_data', 'OR Munros': 'OR Munros', 'FR Munros': 'FR Munros', 'WOR Munros': 'WOR Munros', 'WOR_data': 'WOR_data', 'WFR': 'WFR', 'WFR holder': 'WFR holder', 'WFR date': 'WFR date', 'WFR d': 'WFR d', 'WFR h': 'WFR h', 'WFR m': 'WFR m', 'WFR s': 'WFR s', 'WFR Munros': 'WFR Munros', 'WFR_data': 'WFR_data', 'descrip': 'descrip', 'dist_climb': 'dist_climb', 'p_OR': 'p_OR', 'p_FR': 'p_FR', 'p_WOR': 'p_WOR', 'p_WFR': 'p_WFR', });
lyr_Multidaychallenges_3.set('fieldImages', {'name': 'TextEdit', 'link': 'TextEdit', 'start': 'TextEdit', 'start grid': 'TextEdit', 'start y': 'TextEdit', 'start x': 'TextEdit', 'dist_km': 'Range', 'climb_m': 'Range', 'dist_mi': 'Range', 'climb_ft': 'Range', 'circular': 'TextEdit', 'point to p': 'TextEdit', 'area': 'TextEdit', '24h Challe': 'TextEdit', 'finish': 'TextEdit', 'finish gri': 'TextEdit', 'finish x': 'TextEdit', 'finish y': 'TextEdit', 'on foot': 'TextEdit', 'type': 'TextEdit', 'on foot/bi': 'TextEdit', 'on foot/_1': 'TextEdit', 'rock climb': 'TextEdit', 'OR': 'TextEdit', 'OR d': 'TextEdit', 'OR h': 'Range', 'OR m': 'Range', 'OR s': 'Range', 'OR holder': 'TextEdit', 'OR date': 'TextEdit', 'first reco': 'TextEdit', 'first know': 'TextEdit', 'first time': 'TextEdit', 'multiday': 'TextEdit', 'FR': 'TextEdit', 'FR d': 'TextEdit', 'FR h': 'Range', 'FR m': 'Range', 'FR s': 'Range', 'FR holder': 'TextEdit', 'FR date': 'TextEdit', 'WOR': 'TextEdit', 'WOR holder': 'TextEdit', 'WOR d': 'TextEdit', 'WOR h': 'Range', 'WOR m': 'Range', 'WOR s': 'Range', 'WOR date': 'TextEdit', 'notes': 'TextEdit', 'xreal': 'TextEdit', 'yreal': 'TextEdit', 'OR_data': 'TextEdit', 'FR_data': 'TextEdit', 'OR Munros': 'TextEdit', 'FR Munros': 'TextEdit', 'WOR Munros': 'TextEdit', 'WOR_data': 'TextEdit', 'WFR': 'TextEdit', 'WFR holder': 'TextEdit', 'WFR date': 'DateTime', 'WFR d': 'TextEdit', 'WFR h': 'TextEdit', 'WFR m': 'TextEdit', 'WFR s': 'TextEdit', 'WFR Munros': 'TextEdit', 'WFR_data': 'TextEdit', 'descrip': 'TextEdit', 'dist_climb': 'TextEdit', 'p_OR': 'TextEdit', 'p_FR': 'TextEdit', 'p_WOR': 'TextEdit', 'p_WFR': 'TextEdit', });
lyr_24hchallenges_4.set('fieldImages', {'name': 'TextEdit', 'link': 'TextEdit', 'start': 'TextEdit', 'start grid': 'TextEdit', 'start y': 'TextEdit', 'start x': 'TextEdit', 'dist_km': 'Range', 'climb_m': 'Range', 'dist_mi': 'Range', 'climb_ft': 'Range', 'circular': 'TextEdit', 'point to p': 'TextEdit', 'area': 'TextEdit', '24h Challe': 'TextEdit', 'finish': 'TextEdit', 'finish gri': 'TextEdit', 'finish x': 'TextEdit', 'finish y': 'TextEdit', 'on foot': 'TextEdit', 'type': 'TextEdit', 'on foot/bi': 'TextEdit', 'on foot/_1': 'TextEdit', 'rock climb': 'TextEdit', 'OR': 'TextEdit', 'OR d': 'TextEdit', 'OR h': 'Range', 'OR m': 'Range', 'OR s': 'Range', 'OR holder': 'TextEdit', 'OR date': 'TextEdit', 'first reco': 'TextEdit', 'first know': 'TextEdit', 'first time': 'TextEdit', 'multiday': 'TextEdit', 'FR': 'TextEdit', 'FR d': 'TextEdit', 'FR h': 'Range', 'FR m': 'Range', 'FR s': 'Range', 'FR holder': 'TextEdit', 'FR date': 'TextEdit', 'WOR': 'TextEdit', 'WOR holder': 'TextEdit', 'WOR d': 'TextEdit', 'WOR h': 'Range', 'WOR m': 'Range', 'WOR s': 'Range', 'WOR date': 'TextEdit', 'notes': 'TextEdit', 'xreal': 'TextEdit', 'yreal': 'TextEdit', 'OR_data': 'TextEdit', 'FR_data': 'TextEdit', 'OR Munros': 'TextEdit', 'FR Munros': 'TextEdit', 'WOR Munros': 'TextEdit', 'WOR_data': 'TextEdit', 'WFR': 'TextEdit', 'WFR holder': 'TextEdit', 'WFR date': 'DateTime', 'WFR d': 'TextEdit', 'WFR h': 'TextEdit', 'WFR m': 'TextEdit', 'WFR s': 'TextEdit', 'WFR Munros': 'TextEdit', 'WFR_data': 'TextEdit', 'descrip': 'TextEdit', 'dist_climb': 'TextEdit', 'p_OR': 'TextEdit', 'p_FR': 'TextEdit', 'p_WOR': 'TextEdit', 'p_WFR': 'TextEdit', });
lyr_Other_5.set('fieldImages', {'name': 'TextEdit', 'link': 'TextEdit', 'start': 'TextEdit', 'start grid': 'TextEdit', 'start y': 'TextEdit', 'start x': 'TextEdit', 'dist_km': 'Range', 'climb_m': 'Range', 'dist_mi': 'Range', 'climb_ft': 'Range', 'circular': 'TextEdit', 'point to p': 'TextEdit', 'area': 'TextEdit', '24h Challe': 'TextEdit', 'finish': 'TextEdit', 'finish gri': 'TextEdit', 'finish x': 'TextEdit', 'finish y': 'TextEdit', 'on foot': 'TextEdit', 'type': 'TextEdit', 'on foot/bi': 'TextEdit', 'on foot/_1': 'TextEdit', 'rock climb': 'TextEdit', 'OR': 'TextEdit', 'OR d': 'TextEdit', 'OR h': 'Range', 'OR m': 'Range', 'OR s': 'Range', 'OR holder': 'TextEdit', 'OR date': 'TextEdit', 'first reco': 'TextEdit', 'first know': 'TextEdit', 'first time': 'TextEdit', 'multiday': 'TextEdit', 'FR': 'TextEdit', 'FR d': 'TextEdit', 'FR h': 'Range', 'FR m': 'Range', 'FR s': 'Range', 'FR holder': 'TextEdit', 'FR date': 'TextEdit', 'WOR': 'TextEdit', 'WOR holder': 'TextEdit', 'WOR d': 'TextEdit', 'WOR h': 'Range', 'WOR m': 'Range', 'WOR s': 'Range', 'WOR date': 'TextEdit', 'notes': 'TextEdit', 'xreal': 'TextEdit', 'yreal': 'TextEdit', 'OR_data': 'TextEdit', 'FR_data': 'TextEdit', 'OR Munros': 'TextEdit', 'FR Munros': 'TextEdit', 'WOR Munros': 'TextEdit', 'WOR_data': 'TextEdit', 'WFR': 'TextEdit', 'WFR holder': 'TextEdit', 'WFR date': 'TextEdit', 'WFR d': 'TextEdit', 'WFR h': 'TextEdit', 'WFR m': 'TextEdit', 'WFR s': 'TextEdit', 'WFR Munros': 'TextEdit', 'WFR_data': 'TextEdit', 'descrip': 'TextEdit', 'dist_climb': 'TextEdit', 'p_OR': 'TextEdit', 'p_FR': 'TextEdit', 'p_WOR': 'TextEdit', 'p_WFR': 'TextEdit', });
lyr_Multidaychallenges_3.set('fieldLabels', {'name': 'no label', 'link': 'no label', 'start': 'no label', 'start grid': 'no label', 'start y': 'no label', 'start x': 'no label', 'dist_km': 'no label', 'climb_m': 'no label', 'dist_mi': 'no label', 'climb_ft': 'no label', 'circular': 'no label', 'point to p': 'no label', 'area': 'no label', '24h Challe': 'no label', 'finish': 'no label', 'finish gri': 'no label', 'finish x': 'no label', 'finish y': 'no label', 'on foot': 'no label', 'type': 'no label', 'on foot/bi': 'no label', 'on foot/_1': 'no label', 'rock climb': 'no label', 'OR': 'no label', 'OR d': 'no label', 'OR h': 'no label', 'OR m': 'no label', 'OR s': 'no label', 'OR holder': 'no label', 'OR date': 'no label', 'first reco': 'no label', 'first know': 'no label', 'first time': 'no label', 'multiday': 'no label', 'FR': 'no label', 'FR d': 'no label', 'FR h': 'no label', 'FR m': 'no label', 'FR s': 'no label', 'FR holder': 'no label', 'FR date': 'no label', 'WOR': 'no label', 'WOR holder': 'no label', 'WOR d': 'no label', 'WOR h': 'no label', 'WOR m': 'no label', 'WOR s': 'no label', 'WOR date': 'no label', 'notes': 'no label', 'xreal': 'no label', 'yreal': 'no label', 'OR_data': 'no label', 'FR_data': 'no label', 'OR Munros': 'no label', 'FR Munros': 'no label', 'WOR Munros': 'no label', 'WOR_data': 'no label', 'WFR': 'no label', 'WFR holder': 'no label', 'WFR date': 'no label', 'WFR d': 'no label', 'WFR h': 'no label', 'WFR m': 'no label', 'WFR s': 'no label', 'WFR Munros': 'no label', 'WFR_data': 'no label', 'descrip': 'no label', 'dist_climb': 'no label', 'p_OR': 'no label', 'p_FR': 'no label', 'p_WOR': 'no label', 'p_WFR': 'no label', });
lyr_24hchallenges_4.set('fieldLabels', {'name': 'no label', 'link': 'no label', 'start': 'no label', 'start grid': 'no label', 'start y': 'no label', 'start x': 'no label', 'dist_km': 'no label', 'climb_m': 'no label', 'dist_mi': 'no label', 'climb_ft': 'no label', 'circular': 'no label', 'point to p': 'no label', 'area': 'no label', '24h Challe': 'no label', 'finish': 'no label', 'finish gri': 'no label', 'finish x': 'no label', 'finish y': 'no label', 'on foot': 'no label', 'type': 'no label', 'on foot/bi': 'no label', 'on foot/_1': 'no label', 'rock climb': 'no label', 'OR': 'no label', 'OR d': 'no label', 'OR h': 'no label', 'OR m': 'no label', 'OR s': 'no label', 'OR holder': 'no label', 'OR date': 'no label', 'first reco': 'no label', 'first know': 'no label', 'first time': 'no label', 'multiday': 'no label', 'FR': 'no label', 'FR d': 'no label', 'FR h': 'no label', 'FR m': 'no label', 'FR s': 'no label', 'FR holder': 'no label', 'FR date': 'no label', 'WOR': 'no label', 'WOR holder': 'no label', 'WOR d': 'no label', 'WOR h': 'no label', 'WOR m': 'no label', 'WOR s': 'no label', 'WOR date': 'no label', 'notes': 'no label', 'xreal': 'no label', 'yreal': 'no label', 'OR_data': 'no label', 'FR_data': 'no label', 'OR Munros': 'no label', 'FR Munros': 'no label', 'WOR Munros': 'no label', 'WOR_data': 'no label', 'WFR': 'no label', 'WFR holder': 'no label', 'WFR date': 'no label', 'WFR d': 'no label', 'WFR h': 'no label', 'WFR m': 'no label', 'WFR s': 'no label', 'WFR Munros': 'no label', 'WFR_data': 'no label', 'descrip': 'no label', 'dist_climb': 'no label', 'p_OR': 'no label', 'p_FR': 'no label', 'p_WOR': 'no label', 'p_WFR': 'no label', });
lyr_Other_5.set('fieldLabels', {'name': 'no label', 'link': 'no label', 'start': 'no label', 'start grid': 'no label', 'start y': 'no label', 'start x': 'no label', 'dist_km': 'no label', 'climb_m': 'no label', 'dist_mi': 'no label', 'climb_ft': 'no label', 'circular': 'no label', 'point to p': 'no label', 'area': 'no label', '24h Challe': 'no label', 'finish': 'no label', 'finish gri': 'no label', 'finish x': 'no label', 'finish y': 'no label', 'on foot': 'no label', 'type': 'no label', 'on foot/bi': 'no label', 'on foot/_1': 'no label', 'rock climb': 'no label', 'OR': 'no label', 'OR d': 'no label', 'OR h': 'no label', 'OR m': 'no label', 'OR s': 'no label', 'OR holder': 'no label', 'OR date': 'no label', 'first reco': 'no label', 'first know': 'no label', 'first time': 'no label', 'multiday': 'no label', 'FR': 'no label', 'FR d': 'no label', 'FR h': 'no label', 'FR m': 'no label', 'FR s': 'no label', 'FR holder': 'no label', 'FR date': 'no label', 'WOR': 'no label', 'WOR holder': 'no label', 'WOR d': 'no label', 'WOR h': 'no label', 'WOR m': 'no label', 'WOR s': 'no label', 'WOR date': 'no label', 'notes': 'no label', 'xreal': 'no label', 'yreal': 'no label', 'OR_data': 'no label', 'FR_data': 'no label', 'OR Munros': 'no label', 'FR Munros': 'no label', 'WOR Munros': 'no label', 'WOR_data': 'no label', 'WFR': 'no label', 'WFR holder': 'no label', 'WFR date': 'no label', 'WFR d': 'no label', 'WFR h': 'no label', 'WFR m': 'no label', 'WFR s': 'no label', 'WFR Munros': 'no label', 'WFR_data': 'no label', 'descrip': 'no label', 'dist_climb': 'no label', 'p_OR': 'no label', 'p_FR': 'no label', 'p_WOR': 'no label', 'p_WFR': 'no label', });
lyr_Other_5.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});