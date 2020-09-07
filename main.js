// Hold state variables
let state = {
    data: [],
    filteredData: [],
    features: [],
    selectedFeature: "All",
    dataSource: './data/venus-data.csv',
    globeImage: './assets/venus-map.jpg',
    backgroundImage: './assets/galaxy-starfield.png',
}

// Load in the data, build the dropdown, and call draw
// The dots are at 0% opacity by default
Promise.all([
    d3.csv(state.dataSource, d3.autoType)
]).then(([venusData]) => {
    state.data = venusData;
    buildDropdown(state, state.data)
    draw(state.data, '#ffffff00');
})

// Get a unique list of surface features from the data, add in
// an "All" option, and then append those options to the dropdown menu
function buildDropdown(state, data) {
    state.features = Array.from(new Set(data.map(x => x["Feature_Type"])))
    state.features.unshift("All")
    d3.select("#dropdown-feature")
        .selectAll("option")
        .data(state.features)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d)
}

// Add an event listener to the dropdown menu: when the selected feature
// changes, update the state value and filter the data
d3.select("#dropdown-feature")
    .on("change", function () {
        state.selectedFeature = this.value;
        filterData(state);
    });

// Filter the original dataset for the selected feature and redraw the globe
// Change the color of the dots so that they are at 30% opacity
function filterData(state) {
    if (state.selectedFeature === "All") {
        draw(state.data, '#ffffff00');
    } else {
        state.filteredData = state.data.filter(d => d.Feature_Type === state.selectedFeature);
        draw(state.filteredData, '#ffffff30');
    }
}

// Draws the globe at the div with the ID of 'globeViz'
// Adds a label to each point, and changes the cursor to a pointer on hover
function draw(data, pointColor) {

    const elem = document.getElementById('globeViz');

    Globe()
        .height(window.innerHeight * 0.75)
        .backgroundImageUrl(state.backgroundImage)
        .globeImageUrl(state.globeImage)
        .pointsData(data)
        .pointAltitude(0)
        .pointColor(() => pointColor)
        .pointRadius(2.5)
        .pointLabel(d => `
        <div class='tooltip'>
            <div><h2>${d.Clean_Feature_Name}</h2></div>
            <div><p style='color:orange;'>${d.Origin} (${d.Continent})</p></div>
            <br>
            <div><p style='color:orange;'>Feature Type:&nbsp <b style='color:white;'>${d.Singular}</b></p></div>
            <div><p style='color:orange;'>Approved:&nbsp <b style='color:white;'>${d.Approval_Date}</b></p></div>
            <div><p style='color:orange;'>Lat / Long:&nbsp <b style='color:white;'>${d.lat}&#176; N, ${d.lng}&#176; E</b></p></div>
            <br>
            <div><p style='color:orange; font-size: 12px;'>${d.Article} <b style='color:white;'>${d.Singular}</b> is ${d.Description}. On Venus, ${d.Plural} are named after ${d.Venus}.</p></div>
            </div>
        </div>
            
        `)
        .onPointHover(label => {
            elem.style.cursor = label ? 'pointer' : null;
        })

    (elem)
}

