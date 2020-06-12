
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

let ad_chart;   //additions-deletions-chart div as jquery element
let file_chart; //filetype-chart div as jquery element
let cmt_bonus_info;

function createCommitDetailsVis(visElement) {
    const commitDetailsDiv = visElement.append("div").attr("id", "cmt_details");

    //create the description part (top) of the commit details
    const headDiv = commitDetailsDiv.append('div').attr('id', 'cmt_desc_head');
    headDiv.append('div').attr('id', 'cmt_avatar');  //for displaying avatar icon
    const desc = headDiv.append('div').attr('id', 'cmt_desc');
    desc.append('h1').attr('id', 'cmt_title');
    const authorDate = desc.append('div').attr('id', 'cmt_author_date');
    authorDate.append('span').attr('id', 'cmt_author');
    authorDate.append('span').attr('id', 'cmt_date');


    commitDetailsDiv.append("p").attr("id", "cmt_long_title");
    _createAddsDelsChart(commitDetailsDiv);


    //create the part for the filetypes-graph (bottom) of the commit details
    commitDetailsDiv.append("h3").text("File Types");
    const files = commitDetailsDiv.append("div").attr("id", "cmt_files");
    _createFileTypeChart(files);

    commitDetailsDiv.append("span").attr("id", "cmt_bonus_info").attr("class", "bonus-info");
    cmt_bonus_info = $('#cmt_bonus_info');
}

const cmt_margin = { 
    top: 20,
    bottom: 20,
    left: 50,
    right: 30
};
function _createAddsDelsChart(div) {
    const svg = div.append("svg").attr("id", "adds_dels_chart");
    ad_chart = $('#adds_dels_chart');    //get svg as jquery-object

    // Group used to enforce margin
    g_ad = svg.append('g')
            .attr('transform', `translate(${cmt_margin.left},${cmt_margin.top})`);

    // Scales setup
    xscale_ad = d3.scaleLinear();
    yscale_ad = d3.scaleBand();

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
    file_chart = $('#file_chart');    //get svg as jquery-object

    // Group used to enforce cmt_margin
    g_files = svg.append('g')
            .attr('transform', `translate(${cmt_margin.left},${cmt_margin.top})`);

    // Scales setup
    xscale_files = d3.scaleLinear();
    yscale_files = d3.scaleBand();

    // Axis setup
    xaxis_files = d3.axisTop().scale(xscale_files);
    g_xaxis_files = g_files.append('g').attr('class','x axis');
    yaxis_files = d3.axisLeft().scale(yscale_files);
    g_yaxis_files = g_files.append('g').attr('class','y axis');
}

function updateCommitDetails(new_commit) {
    //todo switch to repository-overview if new_commit is undefined
    if (new_commit === null) {
        // TODO hide vis ?  [comment from Elias]
        d3.select('#details')
            .select('#cmt_details')
            .style('display', 'none');

        return;// _updateRepoOverview();
    }

    // TODO show vis ? [comment from Elias]
    d3.select('#details')
    .select('#cmt_details')
    .style('display', 'block');


    
    d3.select('#cmt_avatar')
        .style('background-image', 'url(' + new_commit.author.avatar_url + ')');



    const msg = new_commit.commit.message;
    if (msg.length < 30) {
        d3.select("#cmt_title").text(msg);
        d3.select("#cmt_long_title").text("");
    } else {
        d3.select("#cmt_title").text("");
        d3.select("#cmt_long_title").text(msg);
    }
    d3.select("#cmt_author").text(new_commit.commit.author.name);

    const date_text = new_commit.commit.author.date.toDateString().substring(4);
    d3.select("#cmt_date").text(date_text);

    _updateAddsDelsChart(new_commit);
    _updateFileTypeChart(new_commit);
}

function _updateAddsDelsChart(new_commit) {
    const width = ad_chart.width() - cmt_margin.left - cmt_margin.right;
    const height = ad_chart.height() - cmt_margin.top - cmt_margin.bottom;
    // Scales setup - paddingInner so the content doesn't overlap with the axis-lines
    xscale_ad.range([0, width]);//.paddingInner(0.1);
    yscale_ad.range([0, height]);


    let data = [  { title: "+", width: new_commit.stats.additions }, 
                    { title: "-", width: new_commit.stats.deletions } ];

    //check for special case "empty commit"
    if(new_commit.stats.additions === 0 && new_commit.stats.deletions === 0) {
        data = [];
        xscale_ad.domain([0, 0]);
        yscale_ad.domain(["+", "-"]);

        //update ticks
        xaxis_ad.tickValues([]);    //nothing to show

    } else {
        //update the scales
        const maxXVal = d3.max(data, d => d.width);
        xscale_ad.domain([0, maxXVal]);
        yscale_ad.domain(data.map(d => d.title));
        //update ticks
        xaxis_ad.tickValues(d3.range(0, maxXVal, getStepSize(maxXVal)));
    }

    //create visualization
    //render the axis
    g_xaxis_ad.transition().call(xaxis_ad);
    g_yaxis_ad.transition().call(yaxis_ad);

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = g_ad.selectAll('rect').data(data, d => d.title).join(
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
        .attr('height', yscale_ad.bandwidth())
        .attr('width', d => xscale_ad(d.width))
        .attr('y', d => yscale_ad(d.title))
        //.attr('x', (d, i) => i * 30)
        ;

    rect.select('title').text(d => d.width);
}

function _updateFileTypeChart(new_commit) {
    const width = file_chart.width() - cmt_margin.left - cmt_margin.right;
    const height = file_chart.height() - cmt_margin.top - cmt_margin.bottom;
    // Scales setup - paddingInner so the content doesn't overlap with the axis-lines
    xscale_files.range([0, width]);//.paddingInner(0.1);
    yscale_files.range([0, height]);

    let map = new Map();  // maps each file-type to its number of addtions and deletions

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

    const ret = preprocessFileTypeMap(map);
    map = ret.map;

    const parsed_data = [];
    for (const item of map.values()) {
        parsed_data.push({ offset: 0, additions: true, width: item.additions, type: item.type });
        parsed_data.push({ offset: item.additions, additions: false, width: item.deletions, type: item.type });
    }

    //create visualization
    //update the scales
    const maxXVal = d3.max(parsed_data, d => d.offset + d.width);
    xscale_files.domain([0, maxXVal]);
    yscale_files.domain(parsed_data.map(d => d.type));

    //render the axis
    xaxis_files.tickValues(d3.range(0, maxXVal, getStepSize(maxXVal)));
    g_xaxis_files.transition().call(xaxis_files);
    g_yaxis_files.transition().call(yaxis_files);

    const colorScale = d3.scaleOrdinal()
        .domain(d3.entries(map.values()).map(d => d.type))
        .range(d3.schemeCategory10);
    colorScale('php');  //don't ask me why, but if I delete this line, the coloring doesn't work anymore.............................

    // Render the chart with new data
    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = g_files.selectAll('rect').data(
        maxXVal === 0 ? [] : //nothing to show
        parsed_data, d => d.type + (d.additions ? '_a' : '_d')).join(
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
        .attr('height', yscale_files.bandwidth())
        .attr('width', d => xscale_files(d.width))
        .attr('y', d => yscale_files(d.type))
        .attr('x', d => xscale_files(d.offset));


    rect.select('title').text(d => {
        const text = d.width + (d.additions ? " Additions" : " Deletions");
        //if(text.length > maxCharacters) maxCharacters = text.length;
        return text;
    });


    let maxCharacters = 1;
    g_yaxis_files.selectAll('text').text(d => {
        if(d.length > maxCharacters) maxCharacters = d.length;
        return d;
    });
    const translateX = maxCharacters * 10 + 7 + 10;
    console.log(translateX);

    
    cmt_bonus_info.text("");
    g_yaxis_files.selectAll('text')
    .on('mouseover', d => {
        const val = map.get(d);
        //show additional information about others as tooltip if possible
        if(d === "others" && ret.information) cmt_bonus_info.prop("title", ret.information);
        else cmt_bonus_info.prop("title", "");

        cmt_bonus_info.text(val.type + ": +" + val.additions + " | -" + val.deletions);
        
        return d;
    });
    
}

function _updateRepoOverview() {

}

const shading = 10;
function _getAdditionsShade(color) {
    return _shadeColor(color, shading);
}

function _getDeletionsShade(color) {
    return _shadeColor(color, -shading);
}

function _shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    const RR = ((R.toString(16).length==1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length==1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length==1) ? "0" + B.toString(16) : B.toString(16));

    return "#"+RR+GG+BB;
}