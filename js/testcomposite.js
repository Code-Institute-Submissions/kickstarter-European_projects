queue()
    .defer(d3.json, "ks-projects-Europe_final.csv")
    .await(makeGraphs);

function makeGraphs(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let parseDate = d3.time.format("%m/%d/%Y").parse;
    transactionsData.forEach(function(d) {
        d.deadline = parseDate(d.deadline);
    });

    let dateDim = ndx.dimension(function(d) {
        return d.deadline;
    });
    let minDate = dateDim.bottom(1)[0].deadline;
    let maxDate = dateDim.top(1)[0].deadline;

    let italyPledgebyMonth = dateDim.group().reduceSum(function(d) {
        if (d.country === "Italy") {
            return +d.usd_pledged;
        }
        else {
            return 0;
        }
    });

    let spainPledgeByMonth = dateDim.group().reduceSum(function(d) {
        if (d.country === "Spain") {
            return +d.usd_pledged;
        }
        else {
            return 0;
        }
    });

    let germanyPledgeByMonth = dateDim.group().reduceSum(function(d) {
        if (d.country === "Germany") {
            return +d.usd_pledged;
        }
        else {
            return 0;
        }
    });
    let compositeChart = dc.compositeChart('#composite-chart');
    compositeChart
        .width(990)
        .height(200)
        .dimension(dateDim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("The Y Axis")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.barChart(compositeChart)
            .colors('green')
            .group(italyPledgebyMonth, 'Italy'),
            dc.lineChart(compositeChart)
            .renderArea(true)
            .colors('red')
            .group(spainPledgeByMonth, 'Spain'),
            dc.lineChart(compositeChart)
            .colors('blue')
            .group(germanyPledgeByMonth, 'Germany')
        ])
        .brushOn(false)
        .render();
    dc.renderAll();
}
