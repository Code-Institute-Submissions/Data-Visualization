queue()

    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(erros, Whiskey_data) {
    let ndx = crossfilter(Whiskey_data);

    Whiskey_data.forEach(function(d) {
        console.log(d['Meta Critic']);
        d.Rating = parseFloat(d['Meta Critic']);
        d.Cost = d.Cost.length;
    })

    whiskey_count_by_cost_chart(ndx);
    whiskey_count_by_class_chart(ndx);
    whiskey_count_by_type_chart(ndx);
    show_producing_country_pie(ndx);
    // cost_rating_correlation(ndx);
    box_plot_cost_rating_corelation(ndx);

    dc.renderAll();
}


function whiskey_count_by_cost_chart(ndx) {
    let cost_dim = ndx.dimension(dc.pluck('Cost'));
    let count_by_cost = cost_dim.group().reduceCount();

    dc.barChart("#whiskey_count_by_cost_chart")
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(cost_dim)
        .group(count_by_cost)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Cost Band")
        .yAxisLabel("Count")
        .yAxis().ticks(6);
}


function whiskey_count_by_class_chart(ndx) {
    let class_dim = ndx.dimension(dc.pluck('Class'));
    let count_by_class = class_dim.group().reduceCount();

    dc.barChart("#whiskey_count_by_class_chart")
        .width(900)
        .height(240)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(class_dim)
        .group(count_by_class)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Name")
        .yAxisLabel("Count")
        .yAxis().ticks(6);
}


function whiskey_count_by_type_chart(ndx) {
    let type_dim = ndx.dimension(dc.pluck('Type'));
    let count_by_type = type_dim.group().reduceCount();

    dc.rowChart('#whiskey_count_by_type_chart')
        .width(900)
        .height(240)
        .dimension(type_dim)
        .group(count_by_type)
        .cap(4)
        .xAxis().ticks(4);


}


function show_producing_country_pie(ndx) {
    let country_dim = ndx.dimension(dc.pluck('Country'));
    let count_by_country = country_dim.group().reduceCount();

    dc.pieChart("#count_by_country_pie_chart")
        // .height(100)
        // .radius(50)
        .dimension(country_dim)
        .group(count_by_country)
        .transitionDuration(500)
        .cap(4);
}




function box_plot_cost_rating_corelation(ndx) {
    var cost_dim = ndx.dimension(dc.pluck('Cost'));
    var rating_by_cost_group = cost_dim.group().reduce(
        function(p, v) {
            p.push(v.Rating);
            return p;
        },
        function(p, v) {
            p.splice(p.indexOf(v.Rating), 1);
            return p;
        },
        function() {
            return [];
        }
    );

    dc.boxPlot("#box_plot_cost_rating_corelation")
        .height(230)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(cost_dim)
        .group(rating_by_cost_group)
        .y(d3.scale.linear().domain([6, 10]))
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);
}