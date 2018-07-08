queue()
    .defer(d3.csv, "data/ks-projects-Europe_final.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    country_selector(ndx);
    fundingTimeCorrelation(ndx);
    goal_country(ndx)

    dc.renderAll();


}


function country_selector(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let group = countryDim.group();

    dc.selectMenu("#country_filter")
        .dimension(countryDim)
        .group(group);
}


function fundingTimeCorrelation(ndx) {
    // var genderColors = d3.scale.ordinal()
    //     .domain(["Female", "Male"])
    //     .range(["pink", "blue"]);

    let timeSpanDim = ndx.dimension(dc.pluck("days_elapsed"));
    let placeDim = ndx.dimension(function(d) {
        return [d.days_elapsed, d.usd_pledged, ];
    });
    let fundTimeGroup = placeDim.group().reduceSum(dc.pluck("usd_pledged"));

    let minDays = timeSpanDim.bottom(1)[0].days_elapsed;
    let maxDays = timeSpanDim.top(1)[0].days_elapsed;

    dc.scatterPlot("#fundVTimeCorrel")
        .width(1000)
        .height(800)
        .x(d3.scale.linear().domain([minDays, maxDays]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Funding Raised")
        .title(function(d) {
            return d.key[2] + " fund " + d.key[1];
        })
        // .colorAccessor(function(d) {
        //     return d.key[3];
        // })
        // .colors(genderColors)
        .dimension(placeDim)
        .group(fundTimeGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}


function goal_country(ndx) {
    let countryDim = ndx.dimension(dc.pluck('country_code'));
    let group = countryDim.group().reduceSum(dc.pluck('goal'));
    
    let chart = dc.rowChart("#country-fund");
    chart
        .width(900)
        .height(500)
        .dimension(countryDim)
        .group(group)
        .elasticX(true)
        .xAxis().ticks(4);
        
    // var chart = dc.rowChart("#limit-rows-chart-here");
    // chart
    //     .width(600)
    //     .height(330)
    //     .dimension(dim)
    //     .group(group)
    //     .cap(3)
    //     .othersGrouper(false)
    //     .xAxis().ticks(4);
}
