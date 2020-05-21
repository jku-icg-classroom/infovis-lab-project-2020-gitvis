var gr;
var render = new dagreD3.render();
var nodewidth = 300;
var nodeheight = 100;


function updateHistoryVis(new_data) {

    let width = d3.select('#dagresvg').style("width");
    let height = d3.select('#dagresvg').style("height");

    //how to append div to svg
    //https://stackoverflow.com/questions/11322711/append-div-to-node-in-svg-with-d3

    //tried timeline
    // debugger
    // //get the date in order to create the timeline boundaries
    // //source of the basic idea: https://stackoverflow.com/questions/46052688/put-a-timeline-to-a-d3-js-tree-graph
    // let currdate;
    // let maxdate = d3.max(new_data, function (e) {
    //     currdate = e.commit.author.date.getFullYear() + '-' + e.commit.author.date.getMonth() + '-' + e.commit.author.date.getDate() + '-' + e.commit.author.date.getHours() + ':' + e.commit.author.date.getMinutes();
    //     return new Date(currdate);
    // });
    // let mindate = d3.min(new_data, function (e) {
    //     currdate = e.commit.author.date.getFullYear() + '-' + e.commit.author.date.getMonth() + '-' + e.commit.author.date.getDate() + '-' + e.commit.author.date.getHours() + ':' + e.commit.author.date.getMinutes();
    //     return new Date(currdate);
    // });
    //
    //
    // mindate.setDate(mindate.getDate() - 2);
    // maxdate.setDate(maxdate.getDate() + 2);
    //
    //
    //
    // var y = d3.scaleTime()
    //     .domain([mindate, maxdate])
    //     .range([0, width]);
    //
    //
    // var yAxis = d3.axisLeft(y).ticks(10);
    // // var xAxis = d3.svg.axis()
    // //     .orient("bottom")
    // //     .scale(x)
    // //     .ticks(10);
    //
    // g.append('g')
    //     .attr('transform', 'translate(0,' + height + ')') .attr("class", "axis")
    //     .call(customYAxis);
    // var linksg =    g.append("g");
    //
    // function customYAxis(g) {
    //     g.call(yAxis);
    //     //g.select('.domain').remove();
    // };



    //clear of all nodes
    gr.nodes().forEach(function (v) {
      gr.removeNode(v);
    });

    new_data.forEach(function (e, k) {
        var html = "<div class='commitcontainer'><div class='textinfo'>";
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
            // height: nodeheight,
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

    render(d3.select("#dagresvg g"), gr);

    // let transnodes = d3.selectAll('g.node');
    // transnodes.attr("class","node bingo");
    // transnodes.attr("transform","translate(180,99)");
    renderAfterDagreRender();



}

// I need this, since I have to change width, height and other attributes in the HTML inside the nodes after letting dagre-d3 do the graphrendering
function renderAfterDagreRender(){
    d3.selectAll('g.node').on("click", function (n) {
        d3.selectAll('g.node').classed('selected', false);
        d3.select(this).classed("selected", true);
        selectCommit(gr.node(n).commitdata);
    });


    //Append the visualizations of each commit

    d3.selectAll(".commitcontainer").attr("style", "min-width:" + nodewidth + "px");
    d3.selectAll(".commitcontainer").append("div").attr("class", "lineschanged");
    d3.selectAll(".lineschanged").append("span").text("asdf");

    // https://groups.google.com/forum/#!topic/d3-js/fMh1Sr7QFEA


    d3.selectAll("foreignObject").attr("width", nodewidth).attr("height", nodeheight);


    let transx = -(nodewidth) / 6 + 4;
    let transy = 0
    d3.selectAll(".node").selectAll(".label").attr("transform", "translate(" + transx + "," + transy + ")");


    //barchart for lines added:
    var svg = d3.selectAll(".lineschanged");
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


    let svg = d3.select("#dagresvg"),
        svgGroup = svg.append("g");
    render(d3.select("#dagresvg g"),gr);

    // Set up zoom support
     svg = d3.select("svg");
     let inner = svg.select("g"),
        zoom = d3.zoom().on("zoom", function() {
            inner.attr("transform", d3.event.transform);
        });
    svg.call(zoom);



    // // Center the graph
    // var xCenterOffset = (svg.attr("width") - gr.graph().width) / 2;
    // svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    // svg.attr("height", gr.graph().height + 40);



}

function formatDate(date){
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
}

function renderHistoryGraphFromTo() {
    state.selectMinDate = new Date(document.getElementById('fieldMin').value);
    state.selectMaxDate = new Date(document.getElementById('fieldMax').value);

    // d3.select("#dateLabel").text("Loaded commits from "+state.selectMinDate.getFullYear() + '-' + ('0' + (state.selectMinDate.getMonth() + 1)).slice(-2) + '-' + ('0' + state.selectMinDate.getDate()).slice(-2)
    //     +" to "+state.selectMaxDate.getFullYear() + '-' + ('0' + (state.selectMaxDate.getMonth() + 1)).slice(-2) + '-' + ('0' + state.selectMaxDate.getDate()).slice(-2));

    let filteredData = state.data.filter(function(d) {
        return (d.commit.author.date >= state.selectMinDate) && (d.commit.author.date <= state.selectMaxDate) ;
    });

    let svg = d3.select("svg"),
        inner = svg.select("g"),
        zoom = d3.zoom().on("zoom", function() {
            inner.attr("transform", d3.event.transform);
        });
    svg.call(zoom.transform, d3.zoomIdentity);

    updateHistoryVis(filteredData);
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



//A lot of this code/idea is from: http://jsfiddle.net/jxd5s01q/2/
function renderDatepicker(datepicker, mindate, maxdate){
//     datepicker.append("label").attr("id","dateLabel").text("Loaded commits from "+mindate.getFullYear() + '-' + ('0' + (mindate.getMonth() + 1)).slice(-2) + '-' + ('0' + mindate.getDate()).slice(-2)
//         +" to "+maxdate.getFullYear() + '-' + ('0' + (maxdate.getMonth() + 1)).slice(-2) + '-' + ('0' + maxdate.getDate()).slice(-2));




    // From : <input type="date" name="field1" id="field1" /> To : <input type="date" name="field2" id="field2" /><br /><br />
    //     <input type="button" onclick="render(true)" value="Submit" />
}



















/*
var cy;


function updateHistoryVis(new_data) {

    //
    new_data.forEach(function (e, k) {
        cy.add({
            group: 'nodes',
            data: {
                id: k,
                key: k,
                label: e.commit.message,
                commitdata: e
                // size: 10
            },
            position: { x: 80, y: k*60 }
        });
    })
    var nodes = cy.nodes();
    for(let i=1;i<nodes.length;i++){
        cy.add({
            group: 'edges',
            data: {
                source: nodes[i-1].id(),
                target: nodes[i].id()
            },
        });
    }
    cy.center(cy.getElementById(new_data.length-1));

    cy.layout({
        name: "dagre",
        spacingFactor: 1,
    }).run();

}

//Problem: Creating D3 svg and inserting this in Cytoscape is not going to work, or at least I don't know how.
//I don't get a useful DOM for D3 to maniuplate if I use Cytoscape
function createSvg(ele,width,height) {
    var svg_string = `<svg width = "${width}" height = "${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '   <rect x = "0" y = "0" width = "${width}" height = "${height}" stroke-width="4" stroke="#000" fill="#fff"></rect>\n' +
        '</svg>`

    var svg = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg_string);

    return { svg: svg, width: width, height: height };
}

function createHistoryVis(visElement){
    //-------------------------------------------------------------------------------
    // https://codepen.io/eustatos/pen/ZmQOqB
    //https://github.com/cytoscape/cytoscape.js/issues/1802
    //https://stackoverflow.com/questions/45658912/how-to-add-html-label-to-cytoscape-graph-node
    //https://stackoverflow.com/questions/29165150/cytoscapejs-embed-html-inside-node-body
    // ==> I can't mix HTML and canvas :/

    visElement.append("div").attr("id","cy").attr("position","relative");

    var width = 220;
    var height = 120;

    //
    cy = (window.cy = cytoscape({
        container: document.getElementById("cy"),

        layout: {
            name: "dagre"
        },
        style: [
            {
                selector: "node",
                style: {
                    content: (ele) => {
                        // console.log(ele.data().commitdata);
                        let data = ele.data().commitdata.commit;
                        let outputstring =
                            "Message: " + (data.message.length > 20 ? data.message.substr(0,20)+"..." : data.message) + "\n" +
                            "Author: " + data.author.name + "\n" +
                            "Date: " + data.author.date;
                        return outputstring;
                    },
                    'background-image': (ele) => {return createSvg(ele,width,height).svg;},
                    // 'background-image': (ele) => {return 'https://cdn.rawgit.com/mafar/svg-test/9d252c09/dropshadow.svg';},
                    "text-halign": "center",
                    "text-valign": "center",
                    "background-color": "#11479e",
                    'text-wrap': 'wrap',
                    shape: 'rectangle',
                    width: width,
                    height: height,
                    'font-size': '1em',

                }
            },
            {
                selector: "edge",
                style: {
                    width: 1,
                    "target-arrow-shape": "triangle",
                    "line-color": "#9dbaea",
                    "target-arrow-color": "#9dbaea",
                    "curve-style": "bezier"
                }
            },
            {
                selector: 'node.highlight',
                style: {
                    'border-color': '#FF0',
                    'border-width': '8px'
                }
            }
        ],
    }));

    cy.on("tap", "node", function tapNode(e) {
        cy.nodes().forEach(function (e, k) {
            e.removeClass('highlight');
        });

        const node = e.target;
        state.selectedCommit = node.data().commitdata;
        // console.log(node);
        // console.log(state.selectedCommit);
        node.addClass('highlight');
        // node
        //     .connectedEdges()
        //     .targets()
        //     .style("visibility", "hidden");
    });
    cy.on("zoom", e => {
        // console.log(cy.zoom());
    });
    cy.fit();

    var layout = cy.layout({
        name: "dagre",
        spacingFactor: 1,
    });
}

 */
