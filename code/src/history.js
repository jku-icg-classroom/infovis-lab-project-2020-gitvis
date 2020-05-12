var cy;


function updateHistoryVis(new_data) {

    //debugger
    new_data.forEach(function (e, k) {
        cy.add({
            group: 'nodes',
            data: {
                id: e.node_id,
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
}

function createHistoryVis(visElement){
    //-------------------------------------------------------------------------------
    https://codepen.io/eustatos/pen/ZmQOqB

    visElement.append("div").attr("id","cy").attr("position","relative");

    //debugger
    cy = (window.cy = cytoscape({
        container: document.getElementById("cy"),

        layout: {
            name: "dagre"
        },
        style: [
            {
                selector: "node",
                style: {
                    content: "data(label)",
                    "text-valign": "bottom",
                    "background-color": "#11479e",
                    'text-wrap': 'wrap',
                    shape: 'rectangle',
                    width: '40',
                    height: '20',
                    'font-size': '0.5em',
                    'background-fill': 'linear-gradient',
                    'background-gradient-direction': 'to-right',
                    'background-gradient-stop-colors': 'white white orange orange',
                    // 'background-gradient-stop-positions': (ele) => {
                    //     console.log(ele.data().size);
                    //     const rnd_width = 100-ele.data().size;
                    //     return '0% '+rnd_width+'% '+rnd_width+'% 100%'
                    // }
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
                    'border-color': '#FFF',
                    'border-width': '4px'
                }
            }
        ],
    }));
    cy
        .elements()
        .layout({
            name: "dagre",
            fit: false,
            ready: () => {
                cy.zoom(1);
                // cy.center(cy.);
                cy.center();
                cy.resize();
                cy.fit();
            }
        })
        .run();
    cy.on("tap", "node", function tapNode(e) {
        cy.nodes().forEach(function (e, k) {
            e.removeClass('highlight');
        });
        debugger
        const node = e.target;
        state.selectedCommit = node.data().commitdata;
        console.log(node);
        console.log(state.selectedCommit);
        node.addClass('highlight');
        // node
        //     .connectedEdges()
        //     .targets()
        //     .style("visibility", "hidden");
    });
    cy.on("zoom", e => {
        console.log(cy.zoom());
    });
    cy.fit();






    //------

//     // Create a new directed graph
//     var g = new dagre.graphlib.Graph();
//
// // Set an object for the graph label
//     g.setGraph({});
//
// // Default to assigning a new object as a label for each new edge.
//     g.setDefaultEdgeLabel(function() { return {}; });
//
// // Add nodes to the graph. The first argument is the node id. The second is
// // metadata about the node. In this case we're going to add labels to each of
// // our nodes.
//     g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
//     g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100 });
//     g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100 });
//     g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100 });
//     g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100 });
//     g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100 });
//
// // Add edges to the graph.
//     g.setEdge("kspacey",   "swilliams");
//     g.setEdge("swilliams", "kbacon");
//     g.setEdge("bpitt",     "kbacon");
//     g.setEdge("hford",     "lwilson");
//     g.setEdge("lwilson",   "kbacon");
//
//     dagre.layout(g);
//
//     g.nodes().forEach(function(v) {
//         console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
//     });
//     g.edges().forEach(function(e) {
//         console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
//     });
//
//
//     // Cytoscape:
//     visElement.append("div").attr("id","cy");
//
//     // cytoscape.use( cytoscape-dagre );
//
//
//     // https://blog.js.cytoscape.org/2016/05/24/getting-started/ tutorial
//     var cy = cytoscape({
//
//         container: document.getElementById('cy'), // container to render in
//
//         elements: [ // list of graph elements to start with
//             { // node a
//                 data: { id: 'a' }
//             },
//             { // node b
//                 data: { id: 'b' }
//             },
//             { // edge ab
//                 data: { id: 'ab', source: 'a', target: 'b' }
//             },
//             { // node c
//                 data: { id: 'c' }
//             },
//         ],
//
//         style: [ // the stylesheet for the graph
//             {
//                 selector: 'node',
//                 style: {
//                     'background-color': '#666',
//                     'label': 'data(id)'
//                 }
//             },
//
//             {
//                 selector: 'edge',
//                 style: {
//                     'width': 3,
//                     'line-color': '#ccc',
//                     'target-arrow-color': '#ccc',
//                     'target-arrow-shape': 'triangle',
//                     'curve-style': 'bezier'
//                 }
//             }
//         ],
//
//         layout: {
//             name: 'grid',
//             rows: 1
//         }
//
//     });
//
//
//
//     // g.nodes().forEach(function(v) {
//     //     console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
//     //     cy.add({
//     //             data: { id: v}
//     //         }
//     //     );
//     //     // cy.add(v);
//     // });
//     cy.addAll(g);
//
//     // g.edges().forEach(function(e) {
//     //     console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
//     //     cy.add(e);
//     // });
//
//
//
//     // for (var i = 0; i < 10; i++) {
//     //     cy.add({
//     //             data: { id: 'node' + i }
//     //         }
//     //     );
//     //     var source = 'node' + i;
//     //     cy.add({
//     //         data: {
//     //             id: 'edge' + i,
//     //             source: source,
//     //             target: (i % 2 == 0 ? 'a' : 'b')
//     //         }
//     //     });
//     // }

}
