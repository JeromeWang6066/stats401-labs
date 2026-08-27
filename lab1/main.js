const width = 900;
const height = 420;
const margin = { top: 20, right: 20, bottom: 70, left: 30 };
const barWidth = 70;
const gap = 24;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("../data/students.csv", d => ({
    name: d.name,
    score: +d.score
})).then(data => {
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => margin.left + i * (barWidth + gap))
        .attr("width", barWidth)
        .attr("height", d => d.score / 100 * innerHeight)
        .attr("y", d => height - margin.bottom - d.score / 100 * innerHeight)
        .attr("fill", "black");

    svg.selectAll(".label-name")
        .data(data)
        .join("text")
        .attr("class", "label-name")
        .attr("x", (d, i) => margin.left + i * (barWidth + gap) + barWidth / 2)
        .attr("y", height - margin.bottom + 20)
        .attr("text-anchor", "middle")
        .text(d => d.name);

    svg.selectAll(".label-score")
        .data(data)
        .join("text")
        .attr("class", "label-score")
        .attr("x", (d, i) => margin.left + i * (barWidth + gap) + barWidth / 2)
        .attr("y", height - margin.bottom + 38)
        .attr("text-anchor", "middle")
        .text(d => d.score);
});
