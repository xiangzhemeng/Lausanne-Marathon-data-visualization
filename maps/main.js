const width = 1100;
const height = 700;

// D3 Projection
const projection = d3.geoNaturalEarth1()
	.rotate([0, 0])
	.center([8.3, 46.8])
	.scale(16000)
	.translate([width / 2, height / 2])
	.precision(.1);

// path generator to convert JSON to SVG paths
const path = d3.geoPath()
	.projection(projection);

//colormap for population density
const color = d3.scaleLog()
	.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
	.interpolate(d3.interpolateHcl);

const svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

const div = d3.select("body")
	.append("div")
	.style("opacity", 0);

d3.csv("cantons-population.csv", function(data) {
	d3.json("ch-cantons.json", function(json) {

		const cantons = topojson.feature(json, json.objects.cantons);
		// Loop through each canton data value in the .csv file
		for (let i = 0; i < data.length; i++) {

			// Canton name
			let dataCantonCode = data[i].code;

			// Canton density
			let dataCantonDensity = data[i].density;

			// Find the corresponding canton inside the JSON
			for (let j = 0; j < cantons.features.length; j++) {
				let jsonCantonCode = cantons.features[j].id;

				if (dataCantonCode === jsonCantonCode) {
					// Copy the canton density into the JSON
					cantons.features[j].properties.density = dataCantonDensity;
					break;
				}
			}
		}

		// define domain for the colormap
		var densities = data.map((d) => d.density).sort((a, b) => a - b);
		color.domain([d3.quantile(densities, .01), d3.quantile(densities, .99)]);

		//color the map according to the density of each canton
		svg.selectAll("path")
			.data(cantons.features)
			.enter()
			.append("path")
			.attr("class", "canton")
			.attr("d", path)
			.style("fill", (d) => {
					const density = d.properties.density;
					return color(density);
					});

		//Map cantons and their names
		svg.append("path")
			.datum(topojson.mesh(json, json.objects.cantons, (a, b) => a !== b))
			.attr("class", "canton-boundary")
			.attr("d", path);

		svg.selectAll("text")
			.data(cantons.features)
			.enter().append("text")
			.attr("transform", (d) => "translate(" + path.centroid(d) + ")")
			.attr("dy", ".35em")
			.text((d) => d.properties.name);

		// Map instagram posts
		d3.csv("locations.csv", function(data) {
			svg.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", (d) => projection([d.lon, d.lat])[0])
				.attr("cy", (d) => projection([d.lon, d.lat])[1])
				.attr("r", 5)
				.style("fill", "#FF0000")
				.style("opacity", 0.05)
		});
	});
});