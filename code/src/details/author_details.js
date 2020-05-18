function createAuthorDetailsVis(parentDiv) {
    //create the description part (top) of the commit details
    const desc = visElement.append("div").attr("id", "cmt_desc");

    desc.append("h1").attr("id", "cmt_title");
    desc.append("p").attr("id", "cmt_long_title");
    desc.append("p").attr("id", "cmt_author");
    desc.append("p").attr("id", "cmt_date");
    desc.append("p").attr("id", "cmt_additions");
    desc.append("p").attr("id", "cmt_deletions");

    //create the part for the filetypes-graph (bottom) of the commit details
    const files = visElement.append("div").attr("id", "cmt_files"); 

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
    g_xaxis = g.append('g').attr('class','x axis');
    yaxis = d3.axisLeft().scale(yscale);
    g_yaxis = g.append('g').attr('class','y axis');
}