queue()
    .defer(d3.csv, "ks-projects-Europe_red.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let countryDim = ndx.dimension(dc.pluck("country_code"));

    let pledgeByCountry = countryDim.group().reduceSum(dc.pluck("pledged"));


    let pledgeCountryChart = dc.barChart("#pledgeCountryChart");

    let selectCountryDim = ndx.dimension(dc.pluck("country"));
    let selectCountryGroup = selectCountryDim.group();

    let selectCountry = dc.selectMenu("#select-country")

    selectCountry
        .dimension(selectCountryDim)
        .group(selectCountryGroup);


    pledgeCountryChart
        .width(600)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 50, left: 70 })
        .dimension(countryDim)
        .group(pledgeByCountry)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("countryDim");
    // .yAxis().ticks(5);


    dc.renderAll();

}
