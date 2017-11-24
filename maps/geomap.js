// ToDo: add legends to explain coloring of daata points

var c1 = ['#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081']
var c2 = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'];

// these palettes from from http://colorbrewer2.org/
// colors ranging from cool blue to hot red...
var c3 = ['#4575b4', '#91bfdb', '#e0f3f8', '#ffffbf', '#fee090', '#fc8d59', '#d73027'];

// colors ranging from icy blue to purple
var c4 = ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b'];

// ToDo: find better way to do this!!!!
function colors(n) {
    var colors = c1;
    return colors[n % colors.length];
}

var currentColoring = 0;
var currentZoom = 8; //8; //12;


const mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
const mbUrl = "https://api.mapbox.com/styles/v1/sonychan0807/cja9chgrg1e1z2ro2n7p1api4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic29ueWNoYW4wODA3IiwiYSI6ImNqNGk4ZGEwaDAyOGszM3F3Nzc1bWIxNjcifQ.hUbe7j_iHsjcEhPNLTvxDA";


const grayscale = L.tileLayer(mbUrl, {
        id: 'mapbox.light',
        attribution: mbAttr
    }),
    streets = L.tileLayer(mbUrl, {
        id: 'mapbox.streets',
        attribution: mbAttr
    });

const map = L.map('geomap', {
    layers: [grayscale],
    accessToken: 'pk.eyJ1Ijoic29ueWNoYW4wODA3IiwiYSI6ImNqNGk4ZGEwaDAyOGszM3F3Nzc1bWIxNjcifQ.hUbe7j_iHsjcEhPNLTvxDA'
}).setView([46.80111, 8.22667], currentZoom);


/* Initialize the SVG layer */
map._initPathRoot()



/* We simply pick up the SVG from the map object */
const svg = d3.select("#geomap").select("svg");
const g = svg.append("g");


const datafile = "city_geo.csv";

d3.csv(datafile, function (data) {
    console.log(data);
    data.forEach(function (d) {
        console.log(`${d.city} ${d.lat} ${d.lng}`);
        d.LatLng = new L.LatLng(parseFloat(d.lat), parseFloat(d.lng));
    });

    let feature = plotCircle(g,data);
    // create a d3.geoPath to convert GeoJSON to SVG
    let transform = d3.geoTransform({
        point: projectPoint
    });
    let path = d3.geoPath().projection(transform);

    map.on("viewreset", update);
    update(feature);
})

function plotCircle(g, data) {
     let feature =  g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .style("stroke", '#ccebc5')
        .style("opacity", 1)
        .style("fill", '#ccebc5')
        .attr("r", (d) => Math.log(d.counts+1) * 2);
    return feature
}

function update(feature) {
    currentZoom = map.getZoom();

    // reposotion dots
    feature.attr("transform",
        function (d) {
            return "translate(" +
                map.latLngToLayerPoint(d.LatLng).x + "," +
                map.latLngToLayerPoint(d.LatLng).y + ")";
        })

    // ToDo: show fewer dots when zoomed out
    // // update syle of dots, according to zoom level
    // if(currentZoom < 12){
    // 			feature.style('opacity', function(d){ if(d['CAP_COLOR'] > 5){return 1;}
    // 													else{ return .3}} )	
    // 			feature.attr('r', function(d){ if(d['CAP_COLOR'] > 5){return 2;}
    // 													else{ return 1}} )	
    // } else {
    // 	feature.style('opacity', .6);
    // }

}

// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
    let point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}



//---------------------------------
// for popup, when map is clicked
// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

map.on('click', onMapClick);
//---------------------------------
