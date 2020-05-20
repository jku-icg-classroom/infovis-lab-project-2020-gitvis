
let g;
let xscale;
let yscale;
let xaxis;
let g_xaxis;
let yaxis;
let g_yaxis;
function createCommitDetailsVis(visElement) {
    const commitDetailsDiv = visElement.append("div").attr("id", "cmt_details");

    //create the description part (top) of the commit details
    const desc = commitDetailsDiv.append("div").attr("id", "cmt_desc");

    desc.append("h1").attr("id", "cmt_title");
    desc.append("p").attr("id", "cmt_long_title");
    desc.append("p").attr("id", "cmt_author");
    desc.append("p").attr("id", "cmt_date");
    desc.append("p").attr("id", "cmt_additions");
    desc.append("p").attr("id", "cmt_deletions");

    //create the part for the filetypes-graph (bottom) of the commit details
    const files = commitDetailsDiv.append("div").attr("id", "cmt_files");

    const svg = files.append("svg")
        .attr("id", "file_chart");
    //.attr("width", width)
    //.attr("height", height);

    const file_chart = $('#file_chart');
    const width = file_chart.width();
    const height = file_chart.height();
    const margin = {
        top: parseFloat(file_chart.css('margin-top')),
        bottom: parseFloat(file_chart.css('margin-top')),
        left: parseFloat(file_chart.css('margin-top')),
        right: parseFloat(file_chart.css('margin-top'))
    };

    // Group used to enforce margin
    g = svg.append('g')
        .attr('transform', `translate(${margin.left + 10},${margin.top})`);

    // Scales setup
    xscale = d3.scaleLinear().range([0, width]);
    yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

    // Axis setup
    xaxis = d3.axisTop().scale(xscale);
    g_xaxis = g.append('g').attr('class', 'x axis');
    yaxis = d3.axisLeft().scale(yscale);
    g_yaxis = g.append('g').attr('class', 'y axis');


}

function updateCommitDetails(new_commit) {
    //todo switch to repository-overview if new_commit is undefined
    if (new_commit === null) {
        // TODO hide vis ?
        d3.select('#details')
            .select('#cmt_details')
            .style('display', 'none');

        return _updateRepoOverview();
    }

    // TODO show vis ?
    d3.select('#details')
    .select('#cmt_details')
    .style('display', 'block');

    const msg = new_commit.commit.message;
    if (msg.length < 30) {
        d3.select("#cmt_title").text(msg);
        d3.select("#cmt_long_title").text("");
    } else {
        d3.select("#cmt_title").text("");
        d3.select("#cmt_long_title").text(msg);
    }
    d3.select("#cmt_author").text(new_commit.commit.author.name);
    d3.select("#cmt_date").text(new_commit.commit.author.date);
    d3.select("#cmt_additions").text("Additions: " + new_commit.stats.additions);
    d3.select("#cmt_deletions").text("Deletions: " + new_commit.stats.deletions);


    const map = new Map();  // maps each file-type to its number of addtions and deletions

    //debugger
    //prepare data for visualizing
    new_commit.files.forEach((f) => {
        const dotIndex = f.filename.lastIndexOf(".");
        const ending = f.filename.substring(dotIndex + 1); //+1 because we don't need the .

        const old = map.get(ending);
        if (old) {   //update the existing entry
            old.additions += f.additions;
            old.deletions += f.deletions;
        } else {    //add a new entry for this filetype
            const entry = {
                "type": ending,
                "additions": f.additions,
                "deletions": f.deletions
            };
            map.set(ending, entry);
        }
    });

    const parsed_data = [];
    for (const item of map.values()) {
        //parsed_data.push(item);
        parsed_data.push({ offset: 0, additions: true, width: item.additions, type: item.type });
        parsed_data.push({ offset: item.additions, additions: false, width: item.deletions, type: item.type });
        //const type = item.type;
        //const additions = item.additions;
        //const deletions = item.deletions;
        //console.log(type + ": +" + additions + ", -" + deletions);
    }
    //console.log(parsed_data);

    //create visualization
    //update the scales
    xscale.domain([0, d3.max(parsed_data, (d) => d.offset + d.width)]);
    yscale.domain(parsed_data.map((d) => d.type));
    //render the axis
    g_xaxis.transition().call(xaxis);
    g_yaxis.transition().call(yaxis);

    // Render the chart with new data

    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = g.selectAll('rect').data(parsed_data, d => d.type + (d.additions ? '_a' : '_d')).join(
        // ENTER
        // new elements
        (enter) => {
            const rect_enter = enter.append('rect').attr('x', 0).attr('fill', d => d.additions ? 'green' : 'red');
            rect_enter.append('title');
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
        .attr('height', yscale.bandwidth())
        .attr('width', (d) => xscale(d.width))
        .attr('y', (d) => yscale(d.type))
        .attr('x', d => xscale(d.offset));

    rect.select('title').text((d) => d.type);
}

function _updateRepoOverview() {

}