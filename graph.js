queue()
    .defer(d3.csv, "ks-projects-Europe_red.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    projectsByCountry(ndx);
    country_selector(ndx)
    status_selector(ndx);
    status_balance(ndx);


    dc.renderAll();

}

function projectsByCountry(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country_code"));
    let group = countryDim.group();

    dc.pieChart("#projects-country")
        .height(300)
        .radius(100)
        .innerRadius(15)
        .dimension(countryDim)
        .group(group);
}

function country_selector(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let group = countryDim.group();
    
    dc.selectMenu("#country_filter")
        .dimension(countryDim)
        .group(group);
}

function status_selector(ndx) {
    let statusDim = ndx.dimension(dc.pluck("status"));
    let group = statusDim.group();

    dc.selectMenu("#status_filter")
        .dimension(statusDim)
        .group(group);

}

function status_balance(ndx) {
    let statusDim = ndx.dimension(dc.pluck("status"));
    let group = statusDim.group();

    dc.barChart("#status-balance")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(statusDim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Status")
        .yAxis().ticks(5);
}
