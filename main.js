// Based on tutorial from vasturiano
// https://github.com/vasturiano/globe.gl/blob/master/example/moon-landing-sites/index.html

let data, scene, camera, renderer, myGlobe, controls;

let textureSource = './assets/venus-map.jpg'
let dataSource = './data/venus-data.csv'

Promise.all([
    d3.csv(dataSource, d3.autoType)
]).then(([venusData]) => {
    data = venusData;

    const elem = document.getElementById('globeViz');

    const venus = Globe()
        .globeImageUrl(textureSource)
        .pointsData(data)
        .pointAltitude(0)
        .pointColor(() => '#ffffff40')
        .pointRadius(0.5)
        .pointLabel(d => `
        <div class='tooltip'>
            <div><h2>${d.Clean_Feature_Name}</h2></div>
            <div><p style='color:orange;'>Lat / Long:&nbsp <b style='color:white;'>${d.lat}&#176; N, ${d.lng}&#176; E</b></p></div>
            <div><p style='color:orange;'>Feature:&nbsp <b style='color:white;'>${d.Feature_Type}, approved ${d.Approval_Date}</b></p></div>
            <div><p style='color:orange;'>Name Origin:&nbsp <b style='color:white;'>${d.Continent}</b></p></div>
            <div><p style='color:orange;'>Name Story:&nbsp <b style='color:white;'>${d.Origin}</b></p></div>
            </div>
        `)
        .onPointHover(label => {
            elem.style.cursor = label ? 'pointer' : null
        })

    (elem)
})