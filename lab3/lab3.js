const columns = ["title", "price", "rating", "availability", "page"];

d3.csv("../data/lab3_data.csv", d => ({
    title: d.title,
    price: +d.price,
    rating: +d.rating,
    availability: d.availability,
    page: +d.page
}))
.then(data => {
    const table = d3.select("#data-table");
    let sortColumn = null;
    let ascending = true;

    const header = table.select("thead").append("tr");

    const cells = header.selectAll("th")
        .data(columns)
        .join("th");

    cells.append("span")
        .attr("class", "col-name")
        .text(d => d);

    const arrows = cells.append("span")
        .attr("class", "sort-arrows");

    arrows.append("span")
        .attr("class", "up")
        .text("▲");

    arrows.append("span")
        .attr("class", "down")
        .text("▼");

    cells.on("click", function (event, column) {
        if (sortColumn === column) {
            ascending = !ascending;
        } else {
            sortColumn = column;
            ascending = true;
        }

        data.sort((a, b) =>
            ascending
                ? d3.ascending(a[column], b[column])
                : d3.descending(a[column], b[column])
        );

        updateArrows();
        updateRows();
    });

    function updateArrows() {
        cells.each(function (column) {
            const th = d3.select(this);
            th.select(".up").classed("active", column === sortColumn && ascending);
            th.select(".down").classed("active", column === sortColumn && !ascending);
        });
    }

    function cellText(column, value) {
        if (column === "price") {
            return "£" + value.toFixed(2);
        }
        return value;
    }

    function updateRows() {
        const rows = table.select("tbody")
            .selectAll("tr")
            .data(data)
            .join("tr");

        rows.selectAll("td")
            .data(row => columns.map(column => cellText(column, row[column])))
            .join("td")
            .text(d => d);
    }

    updateRows();
});
