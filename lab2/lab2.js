const width = 800;
const height = 500;

const margin = {
    top: 40,
    right: 170,
    bottom: 70,
    left: 90
};

const tooltip = d3.select("#tooltip");

d3.csv(
    "../data/cities_multivariate.csv",
    d => ({
        city: d.city,
        population: +d.population,
        temp_c: +d.temp_c,
        development_level: d.development_level,
        region: d.region
    })
)
.then(data => {

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .nice()
        .range([
            margin.left,
            width - margin.right
        ]);

    const yScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.temp_c)])
        .range([
            height - margin.bottom,
            margin.top
        ]);

    const regions = ["North", "South", "East", "West"];

    const colorScale = d3.scaleOrdinal()
        .domain(regions)
        .range(d3.schemeTableau10);

    const sizeScale = d3.scaleOrdinal()
        .domain(["Low", "Medium", "High"])
        .range([6, 10, 16]);

    svg.append("g")
        .attr(
            "transform",
            `translate(0, ${height - margin.bottom})`
        )
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, 0)`
        )
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", (margin.left + width - margin.right) / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .text("Population (millions)");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .text("Temperature (°C)");

    const sizeOrder = { Low: 0, Medium: 1, High: 2 };

    const points = data
        .slice()
        .sort((a, b) => sizeOrder[b.development_level] - sizeOrder[a.development_level]);

    svg.selectAll(".city-point")
        .data(points)
        .join("circle")
        .attr("class", "city-point")
        .attr("cx", d => xScale(d.population))
        .attr("cy", d => yScale(d.temp_c))
        .attr("r", d => sizeScale(d.development_level))
        .attr("fill", d => colorScale(d.region))
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.city}</strong><br>
                    Population: ${d.population} million<br>
                    Temperature: ${d.temp_c}°C<br>
                    Development: ${d.development_level}<br>
                    Region: ${d.region}
                `);
        })
        .on("mousemove", function(event) {

            tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", function() {

            tooltip.style("opacity", 0);
        });

    const legend = svg.append("g")
        .attr(
            "transform",
            `translate(${width - margin.right + 25}, 60)`
        );

    legend.append("text")
        .attr("class", "legend-label")
        .attr("y", -18)
        .text("Region");

    const legendItems = legend
        .selectAll(".legend-item")
        .data(regions)
        .join("g")
        .attr("class", "legend-item")
        .attr(
            "transform",
            (d, i) => `translate(0, ${i * 28})`
        );

    legendItems.append("circle")
        .attr("r", 6)
        .attr("fill", d => colorScale(d));

    legendItems.append("text")
        .attr("class", "legend-label")
        .attr("x", 12)
        .attr("y", 4)
        .text(d => d);

    const sizeLegend = svg.append("g")
        .attr(
            "transform",
            `translate(${width - margin.right + 25}, 210)`
        );

    sizeLegend.append("text")
        .attr("class", "legend-label")
        .attr("y", -18)
        .text("Development");

    ["Low", "Medium", "High"].forEach((level, i) => {

        const y = i * 32 + 8;

        sizeLegend.append("circle")
            .attr("cy", y)
            .attr("r", sizeScale(level))
            .attr("fill", "#888")
            .attr("opacity", 0.8);

        sizeLegend.append("text")
            .attr("class", "legend-label")
            .attr("x", 28)
            .attr("y", y + 4)
            .text(level);
    });
});
