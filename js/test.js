let numberFormat = d3.format(".2f");

queue()
    .defer(d3.csv, "data/ks-projects-Europe_regional.csv")
    .await(makeGraphs);
    
function makeGraphs(error, transactionsJson) {
    let ndx = crossfilter(transactionsJson);
    
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
                p.usd_goal -= +v.usd_goal;
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
    
    let pledged_over_time_country_chart = dc.bubbleChart("#pledged_over_time_country_chart");
    pledged_over_time_country_chart.width(990)
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
        .maxBubbleRelativeSize(0.07)
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
    pledged_over_time_country_chart.yAxis().tickFormat(function (s) {
        return s;
    });
    pledged_over_time_country_chart.xAxis().tickFormat(function (s) {
        return s;
    });
    dc.renderAll();
};
