queue()
    .defer(d3.csv, "data/ks-projects-Europe_final.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    projectStatusPercentage(ndx, "successful", "#percentage-success");
    projectStatusPercentage(ndx, "failed", "#percentage-fail");
    projectStatusPercentage(ndx, "suspended", "#percentage-suspended");
    projectStatusPercentage(ndx, "live", "#percentage-live");

    projectCategory(ndx);
    country_selector(ndx);
    status_selector(ndx);
    status_balance(ndx);
    fundingTimeCorrelation(ndx);
    fund_country(ndx)


    dc.renderAll();

}

function status_selector(ndx) {
    let statusDim = ndx.dimension(dc.pluck("status"));
    let group = statusDim.group();

    dc.selectMenu("#status_filter")
        .dimension(statusDim)
        .group(group);

}

function country_selector(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let group = countryDim.group();

    dc.selectMenu("#country_filter")
        .dimension(countryDim)
        .group(group);
}

function projectStatusPercentage(ndx, state, element) {
    let percentageStatus = ndx.groupAll().reduce(
        function(p, v) {
            if (v.region === "Europe") {
                p.count++;
                if (v.status === state) {

                    p.projects++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.region === "Europe") {
                p.count--;
                if (v.status === state) {

                    p.projects--;
                }
            }
            return p;
        },
        function() {
            return { count: 0, projects: 0 };
        },
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.projects / d.count);
            }
        })
        .group(percentageStatus)
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

function projectCategory(ndx) {
    let categoryDim = ndx.dimension(dc.pluck("main_category"));
    let group = categoryDim.group();

    dc.pieChart("#project-category")
        .height(300)
        .radius(150)
        .innerRadius(35)
        .dimension(categoryDim)
        .group(group);
}

function fundingTimeCorrelation(ndx) {
    // var genderColors = d3.scale.ordinal()
    //     .domain(["Female", "Male"])
    //     .range(["pink", "blue"]);

    let timeSpanDim = ndx.dimension(dc.pluck("backers"));
    let placeDim = ndx.dimension(function(d) {
        return [d.backers, d.usd_pledged, ];
    });
    let fundTimeGroup = placeDim.group().reduceSum(dc.pluck("backers"));

    let minDays = timeSpanDim.bottom(1)[0].backers;
    let maxDays = timeSpanDim.top(1)[0].backers;

    dc.scatterPlot("#fundVTimeCorrel")
        .width(1000)
        .height(800)
        .x(d3.scale.linear().domain([minDays, maxDays]))
        .brushOn(false)
        .symbolSize(4)
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

function fund_country(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country_code"));
    let group = countryDim.group().reduceSum(dc.pluck("usd_pledged"));

    dc.barChart("#country-fund")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(countryDim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Status")
        .yAxis().ticks(5);
}