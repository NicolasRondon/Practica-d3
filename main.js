const margin = {
    top : 40,
    bot : 40,
    left : 40,
    right : 40
}
const sizing = {
    width : 1200,
    height: 800
}
const diCaprioBirthYear = 1974
const age = function(year) { return year - diCaprioBirthYear}
const year = 2022
const ageToday = age(year)



const svg = d3.select("#chart").append("svg")
    .attr("id", "svg")
    .attr("width", sizing.width)
    .attr("height", sizing.height)

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "black");

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const elementsGroup = svg.append("g").attr("class", "elementsGroup")
    .attr("transform", `translate(${margin.left},${margin.top})`)

let y = d3.scaleLinear()
            .range(
                [sizing.height - margin.bot - margin.top, 0]
            )

let x = d3.scaleBand()
            .range(
                [0, sizing.width - margin.left - margin.right]
            ).padding(0.2)



const axisGroup = svg.append("g").attr("id", "axisGroup")
const xGroup = axisGroup.append("g").attr("id", "xGroup")
    .attr("transform", `translate(${margin.left},${sizing.height-margin.bot})`)
const yGroup = axisGroup.append("g").attr("id", "yGroup")
    .attr("transform", `translate(${margin.left},${margin.top})`)

const ejeX = d3.axisBottom().scale(x)
const ejeY = d3.axisLeft().scale(y)


let tooltip= d3.select("#chart")
    .append("div")
    .attr("id", "tooltip")
        .style("background-color", "black")
        .style("color", "white")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("border", "solid white")
        .style("border-radius", "0.8rem")
        .style("padding", "1rem")

let line = elementsGroup.append("g")
let circles = elementsGroup.append("g")




d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
        d.age = +d.age

    })
    x.domain(data.map(d=>d.year))
    y.domain([d3.min(data.map(d=>d.age-1)),ageToday])

    xGroup.call(ejeX)
    yGroup.call(ejeY)

    let elements = elementsGroup.selectAll("rect").data(data)

    let color = d3.scaleOrdinal()
        .domain(data)
        .range([
            "#D7C2E6",
            "#a5760c",
            "#71236a",
            "#2c66a7",
            "#FFA68A",
            "#96EFD2",
            "#E6F45D",
            "#E30E3A"
        ])

    elements.enter().append("rect")
        .attr("fill", d => color(d.name))
        .attr("class", d => d.name.replace(" ", "-"))
        .attr("width", x.bandwidth())
        .attr("height", d=> sizing.height-margin.top-margin.bot-y(d.age))
        .attr("y", d=>y(d.age))
        .attr("x", d => x(d.year))

    line.datum(data).append('path')
        .attr("d", d3.line()
            .x(d => x(d.year)+x.bandwidth()/2)
            .y(d =>y(age(d.year)))
        )
        .attr(
            "id", "lineAge"
        )

    circles.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.year)+x.bandwidth()/2)
        .attr("cy", d => y(age(d.year)))
        .attr("r", 10)
        .attr("fill", 'white')

        .on("mouseover", function() {
            d3.select(this)
                .attr("r", 5)
                .attr("fill-opacity", 1)
            return tooltip.style("visibility", "visible")
        })
        .on("mousemove", function(d){
            return tooltip
                .style("top", (d3.event.pageY+10)+"px")
                .style("left",(d3.event.pageX+10)+"px")
                .text(`The age difference between ${d.name} and Dicaprio is ${age(d.year)-d.age} years`)
        })

        .on("mouseout", function() {
            d3.select(this)
                .attr("r", 10)
            return tooltip.style("visibility", "hidden")
        })

    elementsGroup.append("text")
        .text('Line -> Age of Dicaprio')
        .attr("x",  margin.left)
        .attr("y", (margin.left + margin.right))
        .attr("fill", 'yellow')


    elementsGroup.append("text")
        .text('Bars -> Age of his girlfriendss')
        .attr("x", margin.left)
        .attr("y", (margin.left + margin.right) + 30)
        .attr("fill", 'orange')

})
