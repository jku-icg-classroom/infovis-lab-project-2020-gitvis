
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

let repo_ad_chart;
let repo_file_chart;
let repo_bonus_info;

function createRepoDetails(visElement) {
    const repoDetailsDiv = visElement.append('div').attr("id", "repo_details");

    //create the description part (top) of the commit details
    const headline = repoDetailsDiv.append('h1').attr("id", "repo_detail_headline").text('Repo Details');


    _repoCreateAddsDelsChart(repoDetailsDiv);


    //create the part for the filetypes-graph (bottom) of the commit details
    repoDetailsDiv.append("h3").text("File Types");
    const files = repoDetailsDiv.append("div").attr("id", "repo_files");
    _repoCreateFileTypeChart(files);

    repoDetailsDiv.append("span").attr("id", "repo_bonus_info").attr("class", "bonus-info");
    repo_bonus_info = $('#repo_bonus_info');
}
    
const repo_margin = { 
    top: 20,
    bottom: 10,
    left: 50,
    right: 20
};
function _repoCreateAddsDelsChart(div) {
    const svg = div.append("svg").attr("id", "repo_adds_dels_chart");
    repo_ad_chart = $('#repo_adds_dels_chart');    //get svg as jquery-object

    // Group used to enforce margin
    rd_g_ad = svg.append('g')
            .attr('transform', `translate(${repo_margin.left},${repo_margin.top})`);

    // Scales setup
    rd_xscale_ad = d3.scaleLinear();//.range([0, width]);
    rd_yscale_ad = d3.scaleBand();//.rangeRound([0, height]).paddingInner(0.1);

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
    repo_file_chart = $('#repo_file_chart');    //get svg as jquery-object
    
    // Group used to enforce repo_margin
    rd_g_files = svg.append('g')
            .attr('transform', `translate(${repo_margin.left},${repo_margin.top})`);

    // Scales setup
    rd_xscale_files = d3.scaleLinear();//.range([0, width]);
    rd_yscale_files = d3.scaleBand();//.rangeRound([0, height]).paddingInner(0.1);

    // Axis setup
    rd_xaxis_files = d3.axisTop().scale(rd_xscale_files);
    rd_g_xaxis_files = rd_g_files.append('g').attr('class','x axis');
    rd_yaxis_files = d3.axisLeft().scale(rd_yscale_files);
    rd_g_yaxis_files = rd_g_files.append('g').attr('class','y axis');
}

let repo_initial_update = true;
function updateRepoDetails(data) {
    _repoUpdateAddsDelsChart(data);
    _repoUpdateFileTypeChart(data);
    if(repo_initial_update) repo_initial_update = false;
}

function _repoUpdateAddsDelsChart(repo_data) {
    //the first call happens before the divs have the correct sizes, so we can't use them
    if(repo_initial_update) {
        const width = 380 - cmt_margin.left - cmt_margin.right;
        const height = 200 - cmt_margin.top - cmt_margin.bottom;
        rd_xscale_ad.range([0, width]);//.paddingInner(0.1);
        rd_yscale_ad.range([0, height]);

    } else {
        const width = repo_ad_chart.width() - cmt_margin.left - cmt_margin.right;
        const height = repo_ad_chart.height() - cmt_margin.top - cmt_margin.bottom;
        // Scales setup - paddingInner so the content doesn't overlap with the axis-lines
        rd_xscale_ad.range([0, width]);//.paddingInner(0.1);
        rd_yscale_ad.range([0, height]);
    }

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
    const maxXVal = d3.max(data, d => d.width);
    rd_xscale_ad.domain([0, maxXVal]);
    rd_yscale_ad.domain(data.map(d => d.title));

    //render the axis
    rd_xaxis_ad.tickValues(d3.range(0, maxXVal, getStepSize(maxXVal)));
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
    //the first call happens before the divs have the correct sizes, so we can't use them
    if(repo_initial_update) {
        const width = 380 - cmt_margin.left - cmt_margin.right;
        const height = 480 - cmt_margin.top - cmt_margin.bottom;
        // Scales setup - paddingInner so the content doesn't overlap with the axis-lines
        rd_xscale_files.range([0, width]);//.paddingInner(0.1);
        rd_yscale_files.range([0, height]);

    } else {
        const width = repo_file_chart.width() - cmt_margin.left - cmt_margin.right;
        const height = repo_file_chart.height() - cmt_margin.top - cmt_margin.bottom;
        // Scales setup - paddingInner so the content doesn't overlap with the axis-lines
        rd_xscale_files.range([0, width]);//.paddingInner(0.1);
        rd_yscale_files.range([0, height]);
    }

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
    const ret = preprocessFileTypeMap(map);
    map = ret.map;
    
    const parsed_data = [];
    for (const item of map.values()) {
        //parsed_data.push(item);
        parsed_data.push({ additions: true,     offset: 0,              width: item.additions, type: item.type });
        parsed_data.push({ additions: false,    offset: item.additions, width: item.deletions, type: item.type });
    }

    //create visualization
    //update the scales
    const maxXVal = d3.max(parsed_data, d => d.offset + d.width);
    rd_xscale_files.domain([0, maxXVal]);
    rd_yscale_files.domain(parsed_data.map(d => d.type));

    //render the axis
    rd_xaxis_files.tickValues(d3.range(0, maxXVal, getStepSize(maxXVal)));
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

    repo_bonus_info.text("");
    rd_g_yaxis_files.selectAll('text')
                    //.append('div').attr('class', 'tooltip')
                    //.append('span').attr('class', 'tooltiptext').text(d => map.get(d).additions)
    .on('mouseover', d => {
        const val = map.get(d);
        //show additional information about others as tooltip if possible
        if(d === "others" && ret.information) repo_bonus_info.prop("title", ret.information);
        else repo_bonus_info.prop("title", "");

        repo_bonus_info.text(val.type + ": +" + val.additions + " | -" + val.deletions);
        
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