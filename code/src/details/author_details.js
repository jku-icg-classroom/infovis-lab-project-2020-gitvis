const pieChartSize = 120;
const pieChartMargin = 10;
const pieChartRadius = pieChartSize / 2 - pieChartMargin;

const pieChartSizeSmall = 80;
const pieChartMarginSmall = 5;
const pieChartRadiusSmall = pieChartSizeSmall / 2 - pieChartMarginSmall;

const kCellSize = 15;
const kCellSizeWithPadding = 17;

function createAuthorDetailsVis(parentDiv) {
    const root = parentDiv.append("div").attr("id", "ad_root");

    // basic profile informations about the author 
    const profileDiv = root.append('div')
        .attr('id', 'ad_profile_row');
    profileDiv.append('div').attr('id', 'ad_avatar');
    const profileDivNames = profileDiv.append('div')
        .attr('id', 'ad_profile_row_names');
    profileDivNames.append('span').attr('id', 'ad_name');
    profileDivNames.append('a').attr('id', 'ad_github');

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

    // on what days did the author commit and how much
    const commitHistoryDiv = root.append('div')
        .attr('id', 'ad_commit_history_row');
    commitHistoryDiv.append('span')
        .attr('class', 'ad_row_title')
        .text('Commit History');
    _createCommitHistoryChart(commitHistoryDiv);
}

function updateAuthorDetailsVis(authors, author, data) {
    if (author === null) {
        _hideAuthorDetailsVis();
        return;
    }

    // basic profile informations about the author 
    d3.select('#ad_avatar').style('background-image', 'url(' + author.avatar_url + ')');
    d3.select('#ad_name').text(author.login);
    d3.select('#ad_github')
        .attr('href', author.html_url)
        .text(author.html_url);

    _updateCommitsChart(authors, author, data);
    _updateChangesChart(authors, author, data);
    _updateAddVsDelChart(author, data);
    _updateFileTypesChart(author, data);
    _updateCommitHistoryChart(author, data);

    _showAuthorDetailsVis();
}

function _updateCommitsChart(authors, author, data) {
    const colorScale = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#64ACFF', '#D7DFDF']);

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
        pieChartRadiusSmall,
        false,
        'commits'
    );
}

function _updateChangesChart(authors, author, data) {
    const colorScale = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#64ACFF', '#D7DFDF']);

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
        pieChartRadiusSmall,
        false,
        'lines changed'
    );
}

function _updateAddVsDelChart(author, data) {
    const colorScale = d3.scaleOrdinal()
        .domain(['additions', 'deletions'])
        .range([COLOR_ADDS, COLOR_DELS]);

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
        pieChartRadius,
        true
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

    // create color scale based on data
    const colorScale = d3.scaleOrdinal()
        .domain(d3.entries(visData).map(e => e.key))
        .range(d3.schemeCategory10);

    _updatePieChart(
        '#ad_file_types_chart',
        visData,
        colorScale,
        pieChartRadius,
        true,
        'lines changed'
    );
}

function _createCommitHistoryChart(parentElem) {
    const svg = parentElem.append("svg")
        .attr("id", "ad_commit_history_chart");

    // the grid with days as rows and weeks as columns
    svg.append("g").attr("class", "cell-group")
        .attr("transform", "translate(" + (kCellSizeWithPadding + 3) + ", 15)");

    // the two y-axis labels (Mo and Fr) 
    svg.append("text")
        .attr("x", 10)
        .attr("y", 15 + kCellSizeWithPadding + 10)
        .attr("text-anchor", "middle")
        .style("fill", "#000000")
        .text("Mo");
    svg.append("text")
        .attr("x", 10)
        .attr("y", 15 + 5 * kCellSizeWithPadding + 10)
        .attr("text-anchor", "middle")
        .style("fill", "#000000")
        .text("Fr");
}

function _updateCommitHistoryChart(author, data) {
    // map to every day the number of commits the author has made on that day
    const commitsPerDay = data.filter(d => d.author.id === author.id)
        .map(d => {
            const dateWithTime = new Date(d.commit.author.date);
            // remove time information from date
            const dateWithoutTime = dateWithTime.setHours(0, 0, 0, 0);
            return {
                date: dateWithoutTime,
                commitCount: 0
            };
        })
        .reduce((acc, cur) => {
            if (!acc[cur.date]) {
                acc[cur.date] = cur.commitCount;
            }
            // increase number of commits for that day
            acc[cur.date]++;
            return acc;
        }, {});

    // only show days within this interval
    let startDate = state.minDate;
    let endDate = state.maxDate;

    // compute number of days between this interval
    const kOneDayInMs = 1000 * 60 * 60 * 24;
    const intervalLengthInMs = endDate - startDate;
    let numDays = Math.round(intervalLengthInMs / kOneDayInMs);

    // show only a maximum of 20 weeks history (i.e. 140 days)
    if (numDays > 140) {
        // determine the new startDate for a 20 week history
        let newStartDate = new Date(endDate);
        newStartDate.setDate(endDate.getDate() - 140);
        startDate = newStartDate;
        numDays = 140;
    }

    if (numDays < 140) {
        // determine the new startDate for a 20 week history
        let newStartDate = new Date(endDate);
        newStartDate.setDate(endDate.getDate() - 140);
        startDate = newStartDate;
        numDays = 140;
    }

    // remove time information from these dates
    startDate = startDate.setHours(0, 0, 0, 0);
    endDate = endDate.setHours(0, 0, 0, 0);

    // sunday is 0th day of week
    const kSunday = 0;
    const kSaturday = 6;

    // contains an entry for every day the author has commited 
    const days = [];

    // contains the x-axis labels (i.e. the months)
    const xLabels = [];

    // the current date (or day) that is being processed
    let curDate = new Date(startDate);

    // the current column to which the current date should belong
    let curCol = 0;

    let prevMonth = -1;

    let maxNumCommits = 0;

    let first = true;

    for (let i = 0; i <= numDays; i++) {
        // current day of week (sunday, monday, tuesday, etc.)
        let dayOfWeek = curDate.getDay();

        if (dayOfWeek === kSunday && prevMonth != curDate.getMonth() && !first) {
            // it´s a sunday and a new month so remember to add a label
            let monthStr = '';
            switch (curDate.getMonth()) {
                case 0: monthStr = 'Jan'; break;
                case 1: monthStr = 'Feb'; break;
                case 2: monthStr = 'Mar'; break;
                case 3: monthStr = 'Apr'; break;
                case 4: monthStr = 'May'; break;
                case 5: monthStr = 'Jun'; break;
                case 6: monthStr = 'Jul'; break;
                case 7: monthStr = 'Aug'; break;
                case 8: monthStr = 'Sep'; break;
                case 9: monthStr = 'Oct'; break;
                case 10: monthStr = 'Nov'; break;
                case 11: monthStr = 'Dez'; break;
            }
            xLabels.push({
                text: monthStr,
                col: curCol
            });

            prevMonth = curDate.getMonth();
        }
        if (dayOfWeek === kSunday && prevMonth != curDate.getMonth()) {
            first = false;
        }

        let numCommitsForDay = commitsPerDay[curDate.setHours(0, 0, 0, 0)] || 0;
        if (numCommitsForDay > maxNumCommits) {
            maxNumCommits = numCommitsForDay;
        }
        days.push({
            day: curDate,
            numCommits: numCommitsForDay,
            row: dayOfWeek,
            col: curCol
        });

        if (dayOfWeek === kSaturday) {
            // start a new column for the next sunday
            curCol++;
        }

        // process the next day in the next iteration
        let nextDate = new Date(curDate);
        nextDate.setDate(curDate.getDate() + 1);
        curDate = nextDate;
    }

    const numCols = curCol;
    const width = Math.max(kCellSize, kCellSize + numCols * kCellSizeWithPadding) + 2 * kCellSizeWithPadding;
    const height = 25 + kCellSize + 6 * kCellSizeWithPadding;

    // update vis
    const svg = d3.select('#ad_commit_history_chart');
    svg.style('width', width).style('height', height);

    // update all single grid cells 
    const cellsColorScale = d3.scaleLinear()
        .domain([0, maxNumCommits])
        .range(['#DCEFFD', '#005CE6']);
    const cells = svg.select('.cell-group')
        .selectAll('.cell')
        .data(days)
        .attr('x', function (d, i) { return d.col * kCellSizeWithPadding; })
        .attr('y', function (d, i) { return d.row * kCellSizeWithPadding; })
        .style('width', kCellSize)
        .style('height', kCellSize)
        .style('fill', function (d, i) { return cellsColorScale(d.numCommits); });
    cells.select('title')
        .text((d, i) => d.numCommits + ' commits (' + d.day + ')');
    cells.enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', function (d, i) { return d.col * kCellSizeWithPadding; })
        .attr('y', function (d, i) { return d.row * kCellSizeWithPadding; })
        .style('width', kCellSize)
        .style('height', kCellSize)
        .style('fill', function (d, i) { return cellsColorScale(d.numCommits); })
        .append('title')
        .text((d, i) => d.numCommits + ' commits (' + d.day + ')');
    cells.exit().remove();

    // update x-axis labels
    let xAxisLabels = svg.selectAll('.x-label')
        .data(xLabels);
    xAxisLabels.enter()
        .append('text')
        .attr('class', 'x-label')
        .attr('x', function (d, i) { return (kCellSizeWithPadding + 3) + d.col * kCellSizeWithPadding; })
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .style("fill", "#000000")
        .text(function (d) { return d.text; });
    xAxisLabels.exit().remove();
}

function _createPieChart(parentElem, id, size) {
    const svg = parentElem.append("svg")
        .attr("id", id);
    svg.append("g") // group to center chart
        .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");
    svg.append("g")
        .attr('class', 'legend');
}

function _updatePieChart(id, data, colorScale, radius, showLegend, tooltip) {
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
    const svg = d3.select(id);
    const slices = svg
        .select('g')
        .selectAll('.slice')
        .data(arcAngles)
        .attr('d', arcGenerator)
        .style('fill', d => colorScale(d.data.key));
    slices.select('title')
        .text((d, i) => d.value + ' ' + (tooltip || ''));
    slices
        .enter()
        .append('path')
        .attr('class', 'slice')
        .attr('d', arcGenerator)
        .style('fill', d => colorScale(d.data.key))
        .append('title')
        .text((d, i) => d.value + ' ' + (tooltip || ''))
        .each(d => { this._current = d; });
    slices.transition()
        .duration(500)
        .attrTween('d', function (d) {
            let interpolateFn = d3.interpolate(this._current, d);
            let _this = this;
            return function (t) {
                _this._current = interpolateFn(t);
                return arcGenerator(this._current);
            }
        });
    slices.exit().remove();

    if (showLegend) {
        const legend = svg.select('.legend')
            .attr("transform", "translate(" + radius * 2 * 1.5 + "," + 14 + ")");

        // add a dot for each data item
        const dots = legend.selectAll(".dot")
            .data(arcAngles)
            .style("fill", function (d) { return colorScale(d.data.key) });
        dots.enter()
            .append("circle")
            .attr('class', 'dot')
            .attr("cx", 0)
            .attr("cy", function (d, i) { return 0 + i * 20 })
            .attr("r", 5)
            .style("fill", function (d) { return colorScale(d.data.key) })
        dots.exit().remove();

        // add a label for each data item
        const labels = legend.selectAll("text")
            .data(arcAngles)
            .attr("y", function (d, i) { return i * 20 })
            .style("fill", function (d) { return colorScale(d.data.key) })
            .text(function (d) { return d.data.key });
        labels.enter()
            .append("text")
            .attr("x", 14)
            .attr("y", function (d, i) { return i * 20 })
            .style("fill", function (d) { return colorScale(d.data.key) })
            .text(function (d) { return d.data.key })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
        labels.exit().remove();
    }
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
