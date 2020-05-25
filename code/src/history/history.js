var gr;
var render = new dagreD3.render();
var nodewidth = 300;
var nodeheight = 80;
var dagresvg;
var dagresvggroup;
var zoom;


function updateHistoryVis(new_data) {
    updateChartScales(new_data);    //by Mike

    let width = d3.select('#dagresvg').style("width");
    let height = d3.select('#dagresvg').style("height");

    //how to append div to svg
    //https://stackoverflow.com/questions/11322711/append-div-to-node-in-svg-with-d3

    //clear of all nodes
    gr.nodes().forEach(function (v) {
      gr.removeNode(v);
    });

    new_data.forEach(function (e, k) {
        var html = "<div class='commitcontainer'><div class ='lineschanged'></div>";
        html += "<div class='textinfo'>";
        html += "<span class=message> \t&#8226; " + (e.commit.message.length > 18 ? e.commit.message.substr(0, 18) + '...' : e.commit.message) + "</span><br>";
        html += "<span class=author> \t&#8226; " + e.commit.author.name + "</span><br>";
        // html += "<span class=date>"+e.commit.author.date.getFullYear()+"-"+e.commit.author.date.getMonth()+"-"+e.commit.author.date.getDate()+"</span><br>";
        html += "<span class=date> \t&#8226; " + formatDate(e.commit.author.date) + "</span><br>";
        html += "</div></div>";

        //https://codepen.io/lechat/pen/RNrXxZ

        gr.setNode(k, {
            labelType: "html",
            label: html,
            width: nodewidth,
            height: nodeheight,
            commitdata: e
        });
    });


    gr.nodes().forEach(function (v) {
        var node = gr.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    });

    var nodes = gr.nodes();
    for (let i = 0; i < nodes.length - 1; i++) {
        gr.setEdge(nodes[i], nodes[i + 1]);
    }

    
    // get the scale of the graph in order to translate the inner html of the nodes correctly. Just some stringoperations
    let scale = 1;
    let zoomvalue = d3.select("#zoomgroup").attr("transform");
    if(zoomvalue){
        zoomvalue = zoomvalue.slice(zoomvalue.indexOf("scale")+6);
        scale = zoomvalue.slice(0,zoomvalue.length-1);
    }

    // The idea is:   Zoom back to normal, render with dagred3, fix the positions in renderAfterDagreRender, zoom to the previous zoom setting.
    // Seems a bit hacky, but I could not fix the core problem of having to reposition the HMTL inside the nodes so I had to fall back to this.
    zoom.scaleTo(dagresvg,1);
    render(d3.select("#dagresvg g"), gr);
    renderAfterDagreRender();
    zoom.scaleTo(dagresvg,scale);
}


//############################ Mike #############################################
function createLinesChangedChart() {

}

const xscale = d3.scaleLog().range([0, 117]);  //width of the svg
const yscale = d3.scaleLinear().range([0, 117]);
function updateChartScales(data) {
    let maxChanges = 0;  //we need to know the maximum amount of changes a commit of the repo had
    data.forEach(commit => {
        const changes = commit.stats.additions + commit.stats.deletions;
        if(changes > maxChanges) maxChanges = changes;
    });
    //xscale = d3.scaleLog().range([0, maxChanges]);
    xscale.domain([0, maxChanges]);
}

//const color_adds = "rgb(70, 200, 70)";
//const color_dels = "rgb(255, 25, 50)";
function renderLinesChanged(div, commit, id) {

    const svg = div.append("svg").attr("id", "change_chart_" + id)
                    .attr('height', 100)    
                    .attr('width', 100);    //it seems as if this sets the width to 100%, which is what we want
    const svg_jq = $('#change_chart_' + id);
    //svg_jq.css('width', '100%');
    console.log(svg_jq.width());

    const adds = commit.stats.additions;
    const dels = commit.stats.deletions;
    const changes =  adds + dels;
    const data = [  
        { title: "+", y: 0, height: commit.stats.additions, width: changes }, 
        { title: "-", y: adds, height: commit.stats.deletions, width: changes } 
    ];
    //create visualization
    //update the scales
    //xscale_ad.domain([0, d3.max(data, d => d.width)]);
    
    //const yscale = d3.scaleLinear().range([0, changes]);
    yscale.domain([0, changes]);
    //render the axis
    //g_xaxis_ad.transition().call(xaxis_ad);
    //g_yaxis_ad.transition().call(yaxis_ad);

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = svg.selectAll('rect').data(data, d => d.title).join(
        // ENTER
        // new elements
        (enter) => {
          const rect_enter = enter.append('rect')
                        .attr('fill', d => d.title === '+' ? COLOR_ADDS : COLOR_DELS)
                        .attr('class', 'node rect cmt_node_a');
          rect_enter.append('title').text(d => d.title);
          return rect_enter;
        },
        // UPDATE
        // update existing elements
        (update) => update,
        // EXIT
        // elements that aren't associated with data
        (exit) => exit.remove()
    );

    // ENTER + UPDATE
    // both old and new elements
    rect.transition()
        .attr('y', d => yscale(d.y))
        .attr('height', d => yscale(d.height))
        .attr('width', d => d.width)    //todo scale based on xscale
        //.attr('x', (d, i) => i * 30)
        ;

    /*
    rect.select('title').text(d => d.title);
    */
}
//###############################################################################

// I need this, since I have to change width, height and other attributes in the HTML inside the nodes after letting dagre-d3 do the graphrendering
function renderAfterDagreRender(){
    d3.selectAll('g.node').on("click", function (n) {
        if(d3.select(this).classed('selected')){
            d3.selectAll('g.node').classed('selected', false);
            selectCommit(null);
        }else{
            d3.selectAll('g.node').classed('selected', false);
            d3.select(this).classed("selected", true);
            selectCommit(gr.node(n).commitdata);
        }
    });


    d3.selectAll(".commitcontainer").attr("style", "min-width:" + nodewidth + "px");

    //Append the visualizations of each commit
    // d3.selectAll(".lineschanged").append("span").text("asdf");
    let nodes = d3.selectAll('.lineschanged');
    nodes.each(function (e, k) {
        renderLinesChanged(d3.select(this),gr.node(k).commitdata, k);  //I only need the commitdata #Mike
    });



    // https://groups.google.com/forum/#!topic/d3-js/fMh1Sr7QFEA


    d3.selectAll("foreignObject").attr("width", nodewidth).attr("height", nodeheight);


    // let transx = -(nodewidth) / 6 + 4;
    // let transy = 8
    // d3.selectAll(".node").selectAll(".label").attr("transform", "translate(" + transx + "," + transy + ")");


    let transx = (-(nodewidth) / 6 + 4);
    let transy = 8;
    d3.selectAll(".node").selectAll("foreignObject").attr("transform", "translate(" + transx + "," + transy + ")");
}

function createHistoryVis(visElement){
    //-------------------------------------------------------------------------------
    //https://stackoverflow.com/tags/dagre-d3/hot?filter=all

    var dagrediv = visElement.append("div").attr("id","dagrediv").attr("position","relative");
    dagrediv.append("div").attr("id","datepicker");
    dagrediv.append("svg").attr("id","dagresvg").attr("width","100%").attr("height","100%");

    gr = new dagreD3.graphlib.Graph()
        .setGraph({
            nodesep: 70,
            ranksep: 100,
            marginx: 20,
            marginy: 20
        })
        .setDefaultEdgeLabel(function() { return {}; });


    dagresvg = d3.select("#dagresvg");
    dagresvggroup = dagresvg.append("g").attr("id","zoomgroup");
    render(d3.select("#dagresvg g"),gr);


    // Set up zoom support
    let inner = dagresvg.select("g");
    zoom = d3.zoom().on("zoom", function() {
       inner.attr("transform", d3.event.transform);
    });
    dagresvg.call(zoom);




    // // Center the graph
    // var xCenterOffset = (svg.attr("width") - gr.graph().width) / 2;
    // dagresvggroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    // dagresvg.attr("height", gr.graph().height + 40);



}

function formatDate(date){
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
}

function renderHistoryGraphFromTo() {
    state.selectMinDate = new Date(document.getElementById('fieldMin').value);
    state.selectMaxDate = new Date(document.getElementById('fieldMax').value);

    state.filteredData = state.data.filter(function(d) {
        return (d.commit.author.date >= state.selectMinDate) && (d.commit.author.date <= state.selectMaxDate) ;
    });


    updateHistoryVis(state.filteredData);
}

function createDatePicker(new_data){
    let maxdate = d3.max(new_data, function (e) {
        return e.commit.author.date;
    });
    let mindate = d3.min(new_data, function (e) {
        return e.commit.author.date;
    });

    let datepicker = d3.select("#datepicker");
    datepicker.append("br");
    datepicker.append("label").text("From: ");
    datepicker.append("input").attr("type","date").attr("id","fieldMin").attr("value",formatDate(mindate));
    datepicker.append("label").text(" To: ");
    datepicker.append("input").attr("type","date").attr("id","fieldMax").attr("value",formatDate(maxdate));
    datepicker.append("label").text(" ");
    datepicker.append("input").attr("type","button").attr("onclick","renderHistoryGraphFromTo()").attr("value","Submit");
}
