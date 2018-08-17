queue()
    .defer(d3.csv, "data/ks-projects-Europe_final.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    

    country_selector(ndx);
    // fundingTimeCorrelation(ndx);
    goalfund_country(ndx);
    compositePledgedCountry(ndx);

    dc.renderAll();

}

function country_selector(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let group = countryDim.group();

    dc.selectMenu("#country_filter")
        .dimension(countryDim)
        .group(group);
}


function goalfund_country(ndx) {
    let countryDim = ndx.dimension(dc.pluck('country_code'));
    let group = countryDim.group().reduceSum(dc.pluck('goal'));

    let chart = dc.rowChart("#country-goal");
    chart
        .width(900)
        .height(500)
        .dimension(countryDim)
        .group(group)
        .elasticX(true)
        .xAxis().ticks(6);
}


function compositePledgedCountry(ndx) {

    let dateDim = ndx.dimension(function(d) {
        return d.deadline;
    });
    let minDate = dateDim.bottom(1)[0].deadline;
    let maxDate = dateDim.top(1)[0].deadline;

    let fundsUK = dateDim.group().reduceSum(function(d) {
        if (d.name === "United Kingdom") {
            return +d.usd_pledged;
        }
        else {
            return 0;
        }
    });

    // let bobSpendByMonth = dateDim.group().reduceSum(function(d) {
    //     if (d.name === "Bob") {
    //         return +d.spend;
    //     }
    //     else {
    //         return 0;
    //     }
    // });

    // let aliceSpendByMonth = dateDim.group().reduceSum(function(d) {
    //     if (d.name === "Alice") {
    //         return +d.spend;
    //     }
    //     else {
    //         return 0;
    //     }
    // });
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
            .group(fundsUK, 'Tom Smith'),
            // dc.lineChart(compositeChart)
            // .renderArea(true)
            // // .colors('red')
            // .group(bobSpendByMonth, 'Bob Sponge'),
            // dc.lineChart(compositeChart)
            // // .colors('blue')
            // .group(aliceSpendByMonth, 'Alice Wonderland')
        ])
        .brushOn(false)
        .render();

}
