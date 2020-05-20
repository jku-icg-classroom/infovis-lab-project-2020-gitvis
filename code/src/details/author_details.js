const pieChartSize = 120;
const pieChartMargin = 10;
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

    const additionsDeletionsDiv = root.append('div')
        .attr('id', 'ad_add_vs_del_row');
    additionsDeletionsDiv.append('span')
        .attr('class', 'ad_row_title')
        .text('Additions vs Deletions');
    _createPieChart(additionsDeletionsDiv, 'ad_add_vs_del_chart', pieChartSize);
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

    _updateCommitsChart(authors, author, data);
    _updateChangesChart(authors, author, data);
    _updateAddVsDelChart(authors, author, data);

    _showAuthorDetailsVis();
}

function _updateCommitsChart(authors, author, data) {
    const colorScale = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#64ACFF', '#F9F9F9']);

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
        colorScale,
        pieChartRadiusSmall
    );
}

function _updateChangesChart(authors, author, data) {
    const colorScale = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#64ACFF', '#F9F9F9']);

    const authorChangesInitial = authors.reduce((acc, cur) => {
        acc["" + cur.id] = 0;
        return acc;
    }, {});
    const changesPerAuthor = data.reduce(
        (acc, cur) => {
            acc["" + cur.author.id] += cur.stats.total;
            return acc;
        },
        authorChangesInitial
    );
    let changesPerAuthorAggregated = {
        others: 0
    };
    changesPerAuthorAggregated = d3.entries(changesPerAuthor)
        .reduce((acc, cur) => {
            if (cur.key === "" + author.id) {
                acc[cur.key] = cur.value;
            } else {
                acc["others"] += cur.value;
            }
            return acc;
        }, changesPerAuthorAggregated);
    _updatePieChart(
        '#ad_contributions_changes_chart',
        changesPerAuthorAggregated,
        colorScale,
        pieChartRadiusSmall
    );
}

function _updateAddVsDelChart(authors, author, data) {
    const colorScale = d3.scaleOrdinal()
        .domain(['additions', 'deletions'])
        .range(['#23FFA0', '#FF648E']);

    let visData = {
        additions: 0,
        deletions: 0
    };
    visData = data.filter(d => d.author.id === author.id)
        .reduce((acc, cur) => {
            acc.additions += cur.stats.additions;
            acc.deletions += cur.stats.deletions;
            return acc;
        }, visData);

    _updatePieChart(
        '#ad_add_vs_del_chart',
        visData,
        colorScale,
        pieChartRadius
    );
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
        .value(d => d.value)
        .sort(null); // makes slices go clockwise

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

    // TODO: animate pie chart on changes
    /*d3.select(id)
    .selectAll('slices')
    .selectAll('path')
    .transition()
    .duration(500)
    .attrTween("d", function (d) {
        var interpolate = d3.interpolate(0, d);
        var _this = this;
        return function (t) {
            _this._current = interpolate(t);
            return arcGenerator(_this._current);
        };
    });*/

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
