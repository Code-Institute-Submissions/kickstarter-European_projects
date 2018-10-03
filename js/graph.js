let numberFormat = d3.format(".2f");

queue()
    .defer(d3.csv, "data/ks-projects-Europe_regional.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    projectStatusPercentage(ndx, "Successful", "#percentage-success");
    projectStatusPercentage(ndx, "Failed", "#percentage-fail");
    projectStatusPercentage(ndx, "Suspended", "#percentage-suspended");
    projectStatusPercentage(ndx, "Live", "#percentage-live");

    projectCategory(ndx);
    region_selector(ndx);
    country_selector(ndx);
    status_balance(ndx);
    goalfund_country(ndx);
    pledged_vs_goal_by_country(ndx);


    dc.renderAll();

    $(".se-pre-con").fadeOut("slow");
}

function country_selector(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let group = countryDim.group();

    dc.selectMenu("#country_selector")
        .dimension(countryDim)
        .group(group);
}

function region_selector(ndx) {
    let regionDim = ndx.dimension(dc.pluck("region"));
    let group = regionDim.group();

    dc.selectMenu("#region_selector")
        .dimension(regionDim)
        .group(group);
}

function projectStatusPercentage(ndx, state, element) {
    let percentageStatus = ndx.groupAll().reduce(
        function(p, v) {
            if ((v.region === "Western Europe") || (v.region === "Southern Europe") || (v.region ==="Northern Europe")) {
                p.count++;
                if (v.status === state) {

                    p.projects++;
                }
            }
            return p;
        },
        function(p, v) {
            if ((v.region === "Western Europe") || (v.region === "Southern Europe") || (v.region ==="Northern Europe")) {
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
        .width(550)
        .height(350)
        .margins({ top: 10, right: 50, bottom: 30, left: 75 })
        .dimension(statusDim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxis().ticks(5);
}

function projectCategory(ndx) {
    let categoryDim = ndx.dimension(dc.pluck("main_category"));
    let group = categoryDim.group();

    dc.pieChart("#project-category")
        .height(350)
        .radius(150)
        .width(550)
        .innerRadius(40)
        .dimension(categoryDim)
        .group(group)
        .legend(dc.legend().x(50).y(60).itemHeight(10).gap(5));
}

function goalfund_country(ndx) {
    let countryDim = ndx.dimension(dc.pluck('country_code'));
    let group = countryDim.group().reduceSum(dc.pluck('goal'));

    dc.rowChart("#country-goal")
        .width(500)
        .height(500)
        .dimension(countryDim)
        .group(group)
        .elasticX(true)
        .xAxis().ticks(4);
}

function pledged_vs_goal_by_country(ndx) {
    let countryDim = ndx.dimension(function(d){
        return d.country;
    });
    
    let statsByCountry = countryDim.group().reduce(
        function (p, v) {
            p.count += 1;
            p.usd_pledged += +v.usd_pledged;
            p.usd_goal += +v.usd_goal;
            p.days_elapsed += +v.days_elapsed;
            
            p.avg_usd_pledged = p.usd_pledged / p.count;
            p.avg_usd_goal = p.usd_goal / p.count;
            p.avg_days_elapsed = p.days_elapsed / p.count;
            
            return p;
        },
        function (p, v) {
            p.count -= 1;
            
            if (p.count == 0) {
                p.usd_pledged = 0;
                p.usd_usd_goal = 0;
                p.days_elapsed = 0;

                p.avg_usd_pledged = 0;
                p.avg_usd_goal = 0;
                p.avg_days_elapsed = 0;
            } else {
                p.usd_pledged -= +v.usd_pledged;
                p.usd_usd_goal -= +v.usd_goal;
                p.days_elapsed -= +v.days_elapsed;

                p.avg_usd_pledged = p.usd_pledged / p.count;
                p.avg_usd_goal = p.usd_goal / p.count;
                p.avg_days_elapsed = p.days_elapsed / p.count;
            }
            return p;
        },
        function () {
            return {count: 0, usd_pledged: 0, avg_usd_pledged: 0, usd_goal: 0, avg_usd_goal: 0, days_elapsed: 0, avg_days_elapsed: 0}
        }
    );
    
    let pledged_vs_goal_by_country = dc.bubbleChart("#pledged_vs_goal_by_country");
    pledged_vs_goal_by_country.width(990)
        .height(400)
        .margins({top: 10, right: 50, bottom: 30, left: 60})
        .dimension(countryDim)
        .group(statsByCountry)
        .colors(d3.scale.category20())
        .keyAccessor(function (p) {
            return p.value.avg_usd_pledged;
        })
        .valueAccessor(function (p) {
            return p.value.avg_usd_goal;
        })
        .radiusValueAccessor(function (p) {
            return p.value.avg_usd_pledged;
        })
        .x(d3.scale.linear().domain([0, 50000]))
        .r(d3.scale.linear().domain([0, 50000]))
        .minRadiusWithLabel(15)
        .elasticY(true)
        .yAxisPadding(50000)
        .elasticX(true)
        .xAxisPadding(2000)
        .maxBubbleRelativeSize(0.15)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .renderLabel(true)
        .renderTitle(true)
        .title(function (p) {
            return p.key
                + "\n"
                + "Pledged Amount : " + numberFormat(p.value.avg_usd_pledged) + "\n"
                + "Goal Amount: " + numberFormat(p.value.avg_usd_goal);
                + "Days Elapsed: " + numberFormat(p.value.avg_days_elapsed);
        });
    pledged_vs_goal_by_country.yAxis().tickFormat(function (s) {
        return s;
    });
    pledged_vs_goal_by_country.xAxis().tickFormat(function (s) {
        return s;
    });
}