queue()
    .defer(d3.json, "ks-projects-Europe_final.csv")
    .await(makeGraphs);

function makeGraphs(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

function fundingTimeCorrelation(ndx) {

    let backersDim = ndx.dimension(dc.pluck("backers"));
    let pledgedDim = ndx.dimension(function(d) {
        return [d.backers, d.usd_pledged, ];
    });
    let pledgedGroup = pledgedDim.group().reduceSum(dc.pluck("backers"));

    let minBack = backersDim.bottom(1)[0].backers;
    let maxBack = backersDim.top(1)[0].backers;

    dc.scatterPlot("#fundVTimeCorrel")
        .width(1000)
        .height(800)
        .x(d3.scale.linear().domain([minBack, maxBack]))
        .brushOn(false)
        .symbolSize(2)
        .clipPadding(5)
        .xAxisLabel("No. of Backers")
        .title(function(d) {
            return d.key[2] + " fund " + d.key[1];
        })
        
        .dimension(pledgedDim)
        .group(pledgedGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}}