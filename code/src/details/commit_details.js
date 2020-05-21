
const color_adds = "rgb(70, 200, 70)";
const color_dels = "rgb(255, 25, 50)";

const colors = d3.schemePaired;

let g_ad;
let xscale_ad;
let yscale_ad;
let xaxis_ad;
let g_xaxis_ad;
let yaxis_ad;
let g_yaxis_ad;

let g_files;
let xscale_files;
let yscale_files;
let xaxis_files;
let g_xaxis_files;
let yaxis_files;
let g_yaxis_files;
function createCommitDetailsVis(visElement) {
    const commitDetailsDiv = visElement.append("div").attr("id", "cmt_details");

    //create the description part (top) of the commit details
    const desc = commitDetailsDiv.append("div").attr("id", "cmt_desc");

    desc.append("h1").attr("id", "cmt_title");
    desc.append("p").attr("id", "cmt_long_title");
    desc.append("p").attr("id", "cmt_author");
    desc.append("p").attr("id", "cmt_date");
    _createAddsDelsChart(desc);


    //create the part for the filetypes-graph (bottom) of the commit details
    desc.append("h3").text("File Types");
    const files = visElement.append("div").attr("id", "cmt_files");
    _createFileTypeChart(files);
}

function _createAddsDelsChart(div) {
    const svg = div.append("svg").attr("id", "adds_dels_chart");
    const ad_chart = $('#adds_dels_chart');    //get svg as jquery-object
    const width = ad_chart.width();
    const height = ad_chart.height();
    const margin = { 
        top: parseFloat(ad_chart.css('margin-top')), 
        bottom: parseFloat(ad_chart.css('margin-bottom')), 
        left: parseFloat(ad_chart.css('margin-left')), 
        right: parseFloat(ad_chart.css('margin-right')) 
    };

    // Group used to enforce margin
    g_ad = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales setup
    xscale_ad = d3.scaleLinear().range([0, width]);
    yscale_ad = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

    // Axis setup
    xaxis_ad = d3.axisTop().scale(xscale_ad);
    g_xaxis_ad = g_ad.append('g').attr('class','x axis');
    yaxis_ad = d3.axisLeft().scale(yscale_ad);
    g_yaxis_ad = g_ad.append('g').attr('class','y axis');
}

function _createFileTypeChart(div) {
    const svg = div.append("svg")
                .attr("id", "file_chart");
                //.attr("width", width)
                //.attr("height", height);

    const file_chart = $('#file_chart');    //get svg as jquery-object
    const width = file_chart.width();
    const height = file_chart.height();
    const margin = { 
        top: parseFloat(file_chart.css('margin-top')), 
        bottom: parseFloat(file_chart.css('margin-bottom')), 
        left: parseFloat(file_chart.css('margin-left')), 
        right: parseFloat(file_chart.css('margin-right')) 
    };

    // Group used to enforce margin
    const fileTypeSpacing = 20;     //so the text of the fileTypes isn't cut off
    g_files = svg.append('g')
            .attr('transform', `translate(${margin.left + fileTypeSpacing},${margin.top})`);

    // Scales setup
    xscale_files = d3.scaleLinear().range([0, width]);
    yscale_files = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

    // Axis setup
    xaxis_files = d3.axisTop().scale(xscale_files);
    g_xaxis_files = g_files.append('g').attr('class','x axis');
    yaxis_files = d3.axisLeft().scale(yscale_files);
    g_yaxis_files = g_files.append('g').attr('class','y axis');
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

    _updateAddsDelsChart(new_commit);

    _updateFileTypeChart(new_commit);
}

function _updateAddsDelsChart(new_commit) {
    const data = [  { title: "+", width: new_commit.stats.additions }, 
                    { title: "-", width: new_commit.stats.deletions } ];

    //create visualization
    //update the scales
    xscale_ad.domain([0, d3.max(data, d => d.width)]);
    yscale_ad.domain(data.map(d => d.title));
    //render the axis
    g_xaxis_ad.transition().call(xaxis_ad);
    g_yaxis_ad.transition().call(yaxis_ad);

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = g_ad.selectAll('rect').data(data, d => d.title).join(
        // ENTER
        // new elements
        (enter) => {
          const rect_enter = enter.append('rect').attr('fill', (d, i) => i === 0 ? color_adds : color_dels);
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
        .attr('height', yscale_ad.bandwidth())
        .attr('width', d => xscale_ad(d.width))
        .attr('y', d => yscale_ad(d.title))
        //.attr('x', (d, i) => i * 30)
        ;

    rect.select('title').text(d => d.title);
}

function _updateFileTypeChart(new_commit) {
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
    xscale_files.domain([0, d3.max(parsed_data, (d) => d.offset + d.width)]);
    yscale_files.domain(parsed_data.map(d => d.type));
    //render the axis
    g_xaxis_files.transition().call(xaxis_files);
    g_yaxis_files.transition().call(yaxis_files);

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = g_files.selectAll('rect').data(parsed_data, d => d.type + (d.additions ? '_a' : '_d')).join(
        // ENTER
        // new elements
        (enter) => {
          const rect_enter = enter.append('rect').attr('fill', (d, i) => {
            let index = i;
            while(index > colors.length) index -= colors.length;  
            return colors[index];
          });
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
        .attr('height', yscale_files.bandwidth())
        .attr('width', d => xscale_files(d.width))
        .attr('y', d => yscale_files(d.type))
        .attr('x', d => xscale_files(d.offset));

    rect.select('title').text((d) => d.type);
}

function _updateRepoOverview() {

}