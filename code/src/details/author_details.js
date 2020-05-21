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

    // what´s the ratio of additions vs deletions for the author
    const additionsDeletionsDiv = root.append('div')
        .attr('id', 'ad_add_vs_del_row');
    additionsDeletionsDiv.append('span')
        .attr('class', 'ad_row_title')
        .text('Additions vs Deletions');
    _createPieChart(additionsDeletionsDiv, 'ad_add_vs_del_chart', pieChartSize);

    // which filetypes are frequently changed by the author
    const fileTypesDiv = root.append('div')
        .attr('id', 'ad_file_types_row');
    fileTypesDiv.append('span')
        .attr('class', 'ad_row_title')
        .text('Frequently Changed Filetypes');
    _createPieChart(fileTypesDiv, 'ad_file_types_chart', pieChartSize);
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
    _updateAddVsDelChart(author, data);
    _updateFileTypesChart(author, data);

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

function _updateAddVsDelChart(author, data) {
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

function _updateFileTypesChart(author, data) {
    // pre-process data
    let changesPerFileType = {};
    data.filter(d => d.author.id === author.id)
        .map(d => d.files)
        .forEach(filesArr => {
            filesArr.forEach(changedFile => {
                if (changedFile.changes) {
                    // extract file type from file ending 
                    const dotIndex = changedFile.filename.lastIndexOf(".");
                    const ending = changedFile.filename.substring(dotIndex + 1);

                    // increase changes for this file
                    if (!changesPerFileType[ending]) {
                        changesPerFileType[ending] = 0;
                    }
                    changesPerFileType[ending] += changedFile.changes;
                }
            });
        });

    // aggregate to max. 5 file types
    // only keep file types that are changed most frequently 
    // all other file types will be aggregated into 'others'
    let changesPerFileTypeArr = d3.entries(changesPerFileType);
    changesPerFileTypeArr.sort((e1, e2) => e2.value - e1.value);

    // prepate data for visualization
    let visData = {};
    if (changesPerFileTypeArr.length > 5) {
        // aggretate 
        let fourMostFreqChangedFilesArr = changesPerFileTypeArr.slice(0, 4);
        let othersAggregatedFilesArr = changesPerFileTypeArr.slice(4, changesPerFileTypeArr.length);
        const othersChangeCount = othersAggregatedFilesArr.reduce((acc, cur) => acc + cur.value, 0);

        fourMostFreqChangedFilesArr.forEach(e => {
            visData[e.key] = e.value;
        });
        visData["others"] = othersChangeCount;
    } else {
        changesPerFileTypeArr.forEach(e => {
            visData[e.key] = e.value;
        });
    }

    console.log(visData);

    // create color scale based on data
    const colorScale = d3.scaleOrdinal()
        .domain(d3.entries(visData).map(e => e.key))
        .range(d3.schemeSet3);

    _updatePieChart(
        '#ad_file_types_chart',
        visData,
        colorScale,
        pieChartRadius,
        true
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

function _updatePieChart(id, data, colorScale, radius, showLegend) {
    showLegend = showLegend || false;

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
    // TODO: pie charts somehow overdraw each other :O
    // when changing authors 
    const slices = d3.select(id)
        .select('g')
        .selectAll('.slice')
        .data(arcAngles)
        .attr('d', arcGenerator)
        .style('fill', d => colorScale(d.data.key));        
    slices
        .enter()
        .append('path')
        .attr('class', 'slice')
        .attr('d', arcGenerator)
        .style('fill', d => colorScale(d.data.key));
    slices.exit().remove();

    if (showLegend) {
        // TODO: still buggy 
        console.log(arcAngles);

        // again rebind for legend
        var legend = d3.select(id)
            .select(".legend")
            .data(arcAngles);

        legend.enter()
            .append("g")
            .attr("transform", function (d, i) {
                return "translate(" + (radius + 110) + "," + (i * 15 + 20) + ")";
            })
            .attr("class", "legend")
            .append("rect") // label color rects
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function (d, i) {
                return colorScale(d.data.key);
            });

        legend
            .append("text") // label text
            .text(function (d) {
                return d.data.key + "  (" + d.data.value + " changes)";
            })
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);

        legend.exit().remove();
    } else {
        d3.select(id)
            .selectAll(".legend")
            .remove();
    }

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
