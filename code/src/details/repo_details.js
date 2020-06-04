
let rd_g_ad;
let rd_xscale_ad;
let rd_yscale_ad;
let rd_xaxis_ad;
let rd_g_xaxis_ad;
let rd_yaxis_ad;
let rd_g_yaxis_ad;

let rd_g_files;
let rd_xscale_files;
let rd_yscale_files;
let rd_xaxis_files;
let rd_g_xaxis_files;
let rd_yaxis_files;
let rd_g_yaxis_files;


function createRepoDetails(visElement) {
    const repoDetailsDiv = visElement.append("div").attr("id", "repo_details");

    //create the description part (top) of the commit details
    const headline = repoDetailsDiv.append('h1').attr("id", "repo_detail_headline").text('Repo Details');


    _repoCreateAddsDelsChart(repoDetailsDiv);


    //create the part for the filetypes-graph (bottom) of the commit details
    repoDetailsDiv.append("h3").text("File Types");
    const files = repoDetailsDiv.append("div").attr("id", "repo_files");
    _repoCreateFileTypeChart(files);
}
const repo_margin = { 
    top: 20,
    bottom: 0,
    left: 40,
    right: 0
};
function _repoCreateAddsDelsChart(div) {
    const svg = div.append("svg").attr("id", "repo_adds_dels_chart");
    // Group used to enforce margin
    rd_g_ad = svg.append('g')
            .attr('transform', `translate(${repo_margin.left},${repo_margin.top})`);

    const ad_chart = $('#repo_adds_dels_chart');    //get svg as jquery-object
    const width = ad_chart.width() - repo_margin.left - repo_margin.right;
    const height = ad_chart.height() - repo_margin.top - repo_margin.bottom;

    // Scales setup
    rd_xscale_ad = d3.scaleLinear().range([0, width]);
    rd_yscale_ad = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

    // Axis setup
    rd_xaxis_ad = d3.axisTop().scale(rd_xscale_ad);
    rd_g_xaxis_ad = rd_g_ad.append('g').attr('class','x axis');
    rd_yaxis_ad = d3.axisLeft().scale(rd_yscale_ad);
    rd_g_yaxis_ad = rd_g_ad.append('g').attr('class','y axis');
}

function _repoCreateFileTypeChart(div) {
    const svg = div.append("svg")
                .attr("id", "repo_file_chart");
                //.attr("width", width)
                //.attr("height", height);

    // Group used to enforce repo_margin
    const fileTypeSpacing = 20;     //so the text of the fileTypes isn't cut off
    rd_g_files = svg.append('g')
            .attr('transform', `translate(${repo_margin.left + fileTypeSpacing},${repo_margin.top})`);

    const file_chart = $('#repo_file_chart');    //get svg as jquery-object
    const width = file_chart.width() - repo_margin.left - repo_margin.right - fileTypeSpacing;
    const height = file_chart.height() - repo_margin.top - repo_margin.bottom;
    // Scales setup
    rd_xscale_files = d3.scaleLinear().range([0, width]);
    rd_yscale_files = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1);

    // Axis setup
    rd_xaxis_files = d3.axisTop().scale(rd_xscale_files);
    rd_g_xaxis_files = rd_g_files.append('g').attr('class','x axis');
    rd_yaxis_files = d3.axisLeft().scale(rd_yscale_files);
    rd_g_yaxis_files = rd_g_files.append('g').attr('class','y axis');
}

function updateRepoDetails(data) {
    _repoUpdateAddsDelsChart(data);
    _repoUpdateFileTypeChart(data);
}

function _repoUpdateAddsDelsChart(repo_data) {
    let adds = 0;
    let dels = 0;
    repo_data.forEach(commit => {
        adds += commit.stats.additions;
        dels += commit.stats.deletions;
    });

    const data = [  { title: "+", width: adds }, 
                    { title: "-", width: dels } ];

    //create visualization
    //update the scales
    rd_xscale_ad.domain([0, d3.max(data, d => d.width)]);
    rd_yscale_ad.domain(data.map(d => d.title));
    //render the axis
    rd_g_xaxis_ad.transition().call(rd_xaxis_ad);
    rd_g_yaxis_ad.transition().call(rd_yaxis_ad);

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = rd_g_ad.selectAll('rect').data(data, d => d.title).join(
        // ENTER
        // new elements
        (enter) => {
          const rect_enter = enter.append('rect').attr('fill', (d, i) => i === 0 ? COLOR_ADDS : COLOR_DELS);
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
        .attr('height', rd_yscale_ad.bandwidth())
        .attr('width', d => rd_xscale_ad(d.width))
        .attr('y', d => rd_yscale_ad(d.title))
        ;

    rect.select('title').text(d => d.width);
}

function _repoUpdateFileTypeChart(repo_data) {
    let map = new Map();  // maps each file-type to its number of addtions and deletions

    //prepare data for visualizing
    repo_data.forEach(commit => {
        commit.files.forEach(f => {
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
    });

    //sort by descending changes
    map = preprocessFileTypeMap(map);
    
    const parsed_data = [];
    for (const item of map.values()) {
        //parsed_data.push(item);
        parsed_data.push({ offset: 0, additions: true, width: item.additions, type: item.type });
        parsed_data.push({ offset: item.additions, additions: false, width: item.deletions, type: item.type });
    }

    //create visualization
    //update the scales
    rd_xscale_files.domain([0, d3.max(parsed_data, (d) => d.offset + d.width)]);
    rd_yscale_files.domain(parsed_data.map(d => d.type));
    //render the axis
    rd_g_xaxis_files.transition().call(rd_xaxis_files);
    rd_g_yaxis_files.transition().call(rd_yaxis_files);

    const colorScale = d3.scaleOrdinal()
        .domain(d3.entries(map.values()).map(d => d.type))
        .range(d3.schemeCategory10);
    //colorScale('php');  //don't ask me why, but if I delete this line, the coloring doesn't work anymore.............................

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = rd_g_files.selectAll('rect').data(parsed_data, d => d.type + (d.additions ? '_a' : '_d')).join(
        // ENTER
        // new elements
        (enter) => {
          const rect_enter = enter.append('rect').attr('fill', d => {
                const c = colorScale(d.type);
                const color = d.additions ? 
                            _getAdditionsShade(c) :
                            _getDeletionsShade(c);
                return color;
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
        .attr('height', rd_yscale_files.bandwidth())
        .attr('width', d => rd_xscale_files(d.width))
        .attr('y', d => rd_yscale_files(d.type))
        .attr('x', d => rd_xscale_files(d.offset))
        ;

    rect.select('title').text(d => d.width + (d.additions ? " Additions" : " Deletions"));

    //let maxWidth = 0;
    //rd_g_files.selectAll('rect').select('title').text(d => {
    //    console.log(d);
    //    return " hahaha "; 
    //});
    //console.log(maxWidth);
    //rd_g_files.attr('transform', `translate(${repo_margin.left + fileTypeSpacing},${repo_margin.top})`);

    rd_g_yaxis_files.selectAll('text')
                    //.append('div').attr('class', 'tooltip')
                    //.append('span').attr('class', 'tooltiptext').text(d => map.get(d).additions)
    .on('mouseover', d => {
        console.log(map.get(d));
        return d;
    });
    //rd_g_yaxis_files.select('text').select('title').
}

/**
 * 
 * @param {*} flag whether we show or hide the repo details
 */
function showRepoDetails(flag) {
    d3.select('#details').select('#repo_details').style('display', 
        (flag ? 'block' : 'none')
    );
}