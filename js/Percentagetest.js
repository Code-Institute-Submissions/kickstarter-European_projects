queue()
    .defer(d3.csv, "ks-projects-Europe_final.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    projectStatus(ndx, "successful", "#percentage-success");
    projectStatus(ndx, "failed", "#percentage-fail");
    projectStatus(ndx, "suspended", "#percentage-suspended");
    projectStatus(ndx, "live", "#percentage-live");
    



    dc.renderAll();

}

function projectStatus(ndx, state, element) {
    var percentageStatus = ndx.groupAll().reduce(
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
                return ( d.projects / d.count);
            }
        })
        .group(percentageStatus)
}
