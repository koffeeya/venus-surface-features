let state = {
    data: [],
    filteredData: [],
    features: [],
    selectedFeature: "All",
    dataSource: './data/venus-data.csv',
    globeImage: './assets/venus-map.jpg',
    backgroundImage: './assets/galaxy-starfield.png',
}

// Load in the data
Promise.all([
    d3.csv(state.dataSource, d3.autoType)
]).then(([venusData]) => {
    state.data = venusData;
    buildDropdown(state, state.data)
    draw(state.data, '#ffffff00');
})

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

function filterData(state) {
    if (state.selectedFeature === "All") {
        draw(state.data, '#ffffff00');
    } else {
        state.filteredData = state.data.filter(d => d.Feature_Type === state.selectedFeature);
        draw(state.filteredData, '#ffffff30');
    }
}


function draw(data, pointColor) {

    const elem = document.getElementById('globeViz');

    Globe()
        .height(window.innerHeight * 0.75)
        .backgroundImageUrl(state.backgroundImage)
        .globeImageUrl(state.globeImage)
        .pointsData(data)
        .pointAltitude(0)
        .pointColor(() => pointColor) // 40 (25%), 80 (50%)
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

d3.select("#dropdown-feature")
    .on("change", function () {
        state.selectedFeature = this.value;
        filterData(state);
    });