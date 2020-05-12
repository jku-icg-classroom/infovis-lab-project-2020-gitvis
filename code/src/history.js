var cy;


function updateHistoryVis(new_data) {

    //debugger
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


