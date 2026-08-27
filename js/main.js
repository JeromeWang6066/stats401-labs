console.log("Hello STATS 401!");
let course = "STATS 401";
let students = [
    {name: "Alice", score: 85},
    {name: "Bob", score: 72},
    {name: "Carol", score: 91}
];
let data = [10, 20, 30, 40, 50];

d3.select("#message")
    .text("This text was changed using D3!");

d3.select("h1")
    .style("color", "steelblue")
    .style("font-size", "28px")
    .style("font-weight", "bold");


console.log(course);
console.log(students);       
console.log(students[0].name); 
console.log(students[0].score);
console.log(data);