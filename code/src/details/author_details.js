const pieChartSize = 80;
const pieChartMargin = 5;
const pieChartRadius = pieChartSize / 2 - pieChartMargin;

function createAuthorDetailsVis(parentDiv) {
    const root = parentDiv.append("div").attr("id", "ad_root");

    const profileDiv = root.append('div').attr('id', 'ad_profile_row');
    profileDiv.append('div').attr('id', 'ad_avatar');
    const profileDivNames = profileDiv.append('div').attr('id', 'ad_profile_row_names');
    profileDivNames.append('span').attr('id', 'ad_name');
    profileDivNames.append('span').attr('id', 'ad_github');

    const contributionsDiv = root.append('div').attr('id', 'ad_contributions_row');
    const contributionsCommitsDiv = contributionsDiv.append('div').attr('id', 'ad_contributions_commits');
    contributionsCommitsDiv.append('span').attr('class', 'ad_row_title').text('Contributions (#Commits)');
    contributionsCommitsDiv.append('div')
        .attr('id', 'ad_contributions_commits_chart_div')
        .append("svg")
        .attr("id", "ad_contributions_commits_chart")
        .append("g") // group to enforce margins
        .attr("transform", "translate(" + pieChartSize / 2 + "," + pieChartSize / 2 + ")");

    const contributionsChangesDiv = contributionsDiv.append('div').attr('id', 'ad_contributions_changes');
    contributionsChangesDiv.append('span').attr('class', 'ad_row_title').text('Contributions (#Changes)');
    contributionsChangesDiv.append('div').attr('id', 'ad_contributions_changes_chart_div');
}

function updateAuthorDetailsVis(author) {
    if (author === null) {
        _hideAuthorDetailsVis();
        return;
    }

    d3.select('#ad_avatar').style('background-image', 'url(' + author.avatar_url + ')');
    d3.select('#ad_name').text(author.login);
    d3.select('#ad_github').text(author.html_url);

    const contributionsColor = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#64ACFF', '#F9F9F9']);

    // TODO: prepare data for visualization
    const contributionsCommitsData = { a: 10, b: 57 };

    // utility to compute startAngle and endAngle for every data item 
    // will be passed to the arc shape generator
    const pie = d3.pie()
        .value(d => d.value);

    // d3.entries(...) maps the object to an array of key-value pairs
    const commitsPieChartAngles = pie(d3.entries(contributionsCommitsData));

    // helps to build arc shapes
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(pieChartRadius);

    // build the pie chart
    d3.select('#ad_contributions_commits_chart')
        .select('g')
        .selectAll('slices')
        .data(commitsPieChartAngles)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', d => contributionsColor(d.data.key));

    // add annotation
    /*d3.select('#ad_contributions_commits_chart')
        .selectAll('slices')
        .data(contributionsCommitsData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', d => contributionsColor(d.data.key))
        .attr('stroke', 'black')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);*/

    _showAuthorDetailsVis();
}

function _showAuthorDetailsVis() {
    d3.select('#details')
        .select('#ad_root')
        .style('display', 'block');
}

function _hideAuthorDetailsVis() {
    d3.select('#details')
        .select('#ad_root')
        .style('display', 'none');
}