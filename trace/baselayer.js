/* 
*    Return common layers used in different examples
*/
function getCommonBaseLayers(map){
    
    let mUrl = "https://api.mapbox.com/styles/v1/sonychan0807/cjaclg94x4f3z2rsemlyvyifx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic29ueWNoYW4wODA3IiwiYSI6ImNqNGk4ZGEwaDAyOGszM3F3Nzc1bWIxNjcifQ.hUbe7j_iHsjcEhPNLTvxDA";
    var osmLayer = L.tileLayer(mUrl, {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var bathymetryLayer = L.tileLayer.wms("http://ows.emodnet-bathymetry.eu/wms", {
        layers: 'emodnet:mean_atlas_land',
        format: 'image/png',
        transparent: true,
        attribution: "EMODnet Bathymetry",
        opacity: 0.8
    });
    var coastlinesLayer = L.tileLayer.wms("http://ows.emodnet-bathymetry.eu/wms", {
        layers: 'coastlines',
        format: 'image/png',
        transparent: true,
        attribution: "EMODnet Bathymetry",
        opacity: 0.8
    });
    var bathymetryGroupLayer = L.layerGroup([bathymetryLayer, coastlinesLayer]);    
    bathymetryGroupLayer.addTo(map);
    return {
        "EMODnet Bathymetry": bathymetryGroupLayer,
        "OSM": osmLayer
    };
}