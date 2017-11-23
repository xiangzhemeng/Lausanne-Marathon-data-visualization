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
    fullscreenControl: true,
    timeDimension: true,
    timeDimensionOptions: {
        timeInterval: "2002-01-01/2017-01-01",
        period: "P1Y",
        currentTime: Date.parse("2017-01-01T00:00:00Z")
    },
    timeDimensionControl: true,
    timeDimensionControlOptions: {
        autoPlay: true,
        loopButton: true,
        timeSteps: 1,
        playReverseButton: true,
        limitSliders: true,
        playerOptions: {
            buffer: 0,
            transitionTime: 1000,
            loop: true,
        }
    }
}).setView([46.80111, 8.22667], currentZoom);


var svgLayer = L.svg();
svgLayer.addTo(map);

const svg = d3.select("#geomap").select("svg");
const g = svg.append("g");
g.attr("class", "leaflet-zoom-hide");
const datafile = "city_geo.csv";

var feature;

d3.csv(datafile, (data) => {
    data.forEach(d => {
        d.LatLng = new L.LatLng(parseFloat(d.lat), parseFloat(d.lng));
    });

    feature = plotCircle(g, data);
    // create a d3.geoPath to convert GeoJSON to SVG
    let transform = d3.geoTransform({
        point: () => {
            let point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    });
    d3.geoPath().projection(transform);

    map.on("moveend", update)
    update();
});

function plotCircle(g, data) {
    let circles = g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .style("stroke", '#ccebc5')
        .style("opacity", 1)
        .style("fill", '#ccebc5')
        .attr("r", (d) => Math.log(d.counts + 1) * 2);
    return circles
}

function update() {
    currentZoom = map.getZoom();
    feature.attr("transform",
        (d) => {
            return "translate(" + map.latLngToLayerPoint(d.LatLng).x + "," +
                map.latLngToLayerPoint(d.LatLng).y + ")";
        });

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