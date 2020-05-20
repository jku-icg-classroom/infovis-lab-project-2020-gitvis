const pieChartSize = 80;
const pieChartMargin = 5;
const pieChartRadius = pieChartSize / 2 - pieChartMargin;

const pieChartSizeSmall = 80;
const pieChartMarginSmall = 5;
const pieChartRadiusSmall = pieChartSizeSmall / 2 - pieChartMarginSmall;

function createAuthorDetailsVis(parentDiv) {
    const root = parentDiv.append("div").attr("id", "ad_root");

    // basic profile informations about the author 
    const profileDiv = root.append('div')
        .attr('id', 'ad_profile_row');
    profileDiv.append('div').attr('id', 'ad_avatar');
    const profileDivNames = profileDiv.append('div')
        .attr('id', 'ad_profile_row_names');
    profileDivNames.append('span').attr('id', 'ad_name');
    profileDivNames.append('span').attr('id', 'ad_github');

    // how many commits the author made compared to all other authors 
    const contributionsDiv = root.append('div')
        .attr('id', 'ad_contributions_row');
    const contributionsCommitsDiv = contributionsDiv.append('div')
        .attr('id', 'ad_contributions_commits');
    contributionsCommitsDiv.append('span')
        .attr('class', 'ad_row_title')
        .text('Contributions (#Commits)');
    const commitsChartDiv = contributionsCommitsDiv.append('div')
        .attr('id', 'ad_contributions_commits_chart_div');
    _createPieChart(commitsChartDiv, 'ad_contributions_commits_chart', pieChartSizeSmall);

    // how many lines the author changed compared to all other authors 
    const contributionsChangesDiv = contributionsDiv.append('div')
        .attr('id', 'ad_contributions_changes');
    contributionsChangesDiv.append('span')
        .attr('class', 'ad_row_title')
        .text('Contributions (#Changes)');
    const changesChartDiv = contributionsChangesDiv.append('div')
        .attr('id', 'ad_contributions_changes_chart_div');
    _createPieChart(changesChartDiv, 'ad_contributions_changes_chart', pieChartSizeSmall);
}

function updateAuthorDetailsVis(authors, author, data) {
    if (author === null) {
        _hideAuthorDetailsVis();
        return;
    }

    // basic profile informations about the author 
    d3.select('#ad_avatar').style('background-image', 'url(' + author.avatar_url + ')');
    d3.select('#ad_name').text(author.login);
    d3.select('#ad_github').text(author.html_url);

    const contributionsPiechartColorScale = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#64ACFF', '#F9F9F9']);

    // TODO: prepare data for visualization
    const authorCommitsInitial = authors.reduce((acc, cur) => {
        acc["" + cur.id] = 0;
        return acc;
    }, {});
    const commitsPerAuthor = data.reduce(
        (acc, cur) => {
            acc["" + cur.author.id]++;
            return acc;
        },
        authorCommitsInitial
    );

    let commitsPerAuthorAggregated = {
        others: 0
    };
    commitsPerAuthorAggregated = d3.entries(commitsPerAuthor)
        .reduce((acc, cur) => {
            if (cur.key === "" + author.id) {
                acc[cur.key] = cur.value;
            } else {
                acc["others"] += cur.value;
            }
            return acc;
        }, commitsPerAuthorAggregated);

    _updatePieChart(
        '#ad_contributions_commits_chart',
        commitsPerAuthorAggregated,
        contributionsPiechartColorScale,
        pieChartRadiusSmall
    );

    // TODO: prepare data for visualization
    const contributionsChangesData = { a: 5, b: 5 };
    _updatePieChart(
        '#ad_contributions_changes_chart',
        contributionsChangesData,
        contributionsPiechartColorScale,
        pieChartRadiusSmall
    );

    // TODO: ratio added-deleted

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

function _createPieChart(parentElem, id, size) {
    parentElem.append("svg")
        .attr("id", id)
        .append("g") // group to center chart
        .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");
}

function _updatePieChart(id, data, colorScale, radius) {
    // utility function to compute startAngle and endAngle for every data item 
    // will be passed to the arc shape generator
    const pie = d3.pie()
        .value(d => d.value);

    // d3.entries(...) maps the object to an array of key-value pairs
    const arcAngles = pie(d3.entries(data));

    // helps to build arc shapes
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // build the pie chart
    d3.select(id)
        .select('g')
        .selectAll('slices')
        .data(arcAngles)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', d => colorScale(d.data.key));

    // TODO: add annotation
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
}