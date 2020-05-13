var gr;
var render = new dagreD3.render();


function updateHistoryVis(new_data) {

    new_data.forEach(function (e, k) {
        debugger
        var html = "<div class='commitcontainer'>";
        html += "<span class=message>Title: "+(e.commit.message.length > 20 ? e.commit.message.substr(0,20)+'...' : e.commit.message)+"</span><br>";
        html += "<span class=author>Author: "+e.commit.author.name+"</span><br>";
        html += "<span class=date>Date: "+e.commit.author.date+"</span><br>";
        // html += "<span class=queue><span class=counter>"+worker.count+"</span></span>";
        html += "</div>";

        gr.setNode(k,{
            labelType: "html",
            label: html,
            rx: 5,
            ry: 5,
            width: 220,
            height: 100,
            commitdata: e});
    });

    gr.nodes().forEach(function(v) {
        var node = gr.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    });

    var nodes = gr.nodes();
    for(let i=0;i<nodes.length-1;i++){
        gr.setEdge(nodes[i],nodes[i+1]);
    }

    render(d3.select("#dagresvg g"),gr);

    d3.selectAll('g.node').on("click", function(n) {
        d3.selectAll('g.node').classed('selected',false);


        d3.select(this).classed("selected", true);

        debugger
        state.selectedCommit = gr.node(n).commitdata;
        console.log(state.selectedCommit);
    });


    //Append the visualizations of each commit
    d3.selectAll(".commitcontainer").append("span").text("asdf");


}

function createHistoryVis(visElement){
    //-------------------------------------------------------------------------------
    //https://stackoverflow.com/tags/dagre-d3/hot?filter=all

    var dagrediv = visElement.append("div").attr("id","dagrediv").attr("position","relative");
    dagrediv.append("svg").attr("id","dagresvg").attr("width","100%").attr("height","100%");
    

    gr = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function() { return {}; });

    
    var svg = d3.select("#dagresvg"),
        svgGroup = svg.append("g");
    render(d3.select("#dagresvg g"),gr);

    // Set up zoom support
    var svg = d3.select("svg"),
        inner = svg.select("g"),
        zoom = d3.zoom().on("zoom", function() {
            inner.attr("transform", d3.event.transform);
        });
    svg.call(zoom);



    // // Center the graph
    // var xCenterOffset = (svg.attr("width") - gr.graph().width) / 2;
    // svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    // svg.attr("height", gr.graph().height + 40);



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
