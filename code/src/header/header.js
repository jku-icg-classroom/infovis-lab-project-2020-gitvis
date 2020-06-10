function createHeaderVis(parentDiv) {
    parentDiv.append("img")
        .attr("src", "img/logo.png")
        .attr("height", 100)
        .attr("width", "auto");

    let datasetsDropdown = parentDiv.append("select")
        .attr("id", "datasets")
        .attr("onchange","changeDataset()");
    datasetsDropdown.append("option")
        .attr("value", "./data/commits_gitvis_20200603.json")
        .text("GitVis");
    datasetsDropdown.append("option")
        .attr("value", "./data/commits_exacomp_20200528.json")
        .text("Exacomp");
    datasetsDropdown.append("option")
        .attr("value", "./data/commits_openlierox_20200609.json")
        .text("OpenLieroX");

    let authorsDiv = parentDiv.append("div").attr("id", "authors");
    authorsDiv.append("h4").attr("id", "authors_label").text("Authors");
    authorsDiv.append("div").attr("id", "authors_row");
}

function changeDataset(){
    state.data = [];
    state.filteredData = null;
    state.details = COMMIT_DETAILS;
    state.selectedCommit = null;
    state.selectedAuthor = null;
    state.authors = [];
    state.historyloaded = false;
    state.minDate = new Date(2020, 3, 24);
    state.maxDate = new Date(2020, 4, 15);
    state.selectMinDate = new Date();
    state.selectMaxDate = new Date();

    let selected = document.getElementById("datasets").value;

    d3.json(selected).then((data) => {
        // load data, e.g. via d3.json and update app afterwards

        data.reverse();
        console.log(data);

        state.data = data;
        debugger

        const authors = data.map(e => e.author);
        const distinctAuthors = Array.from(new Set(authors.map(a => a.id)))
            .map(id => {
                return {
                    ...authors.find(a => a.id === id)
                }
            });
        state.authors = distinctAuthors;

        updateApp();
    });
}

function updateHeaderVis(data) {
    // TODO: make this nicer xD
    let avatars = d3.select('#authors_row').selectAll(".author_avatar").data(state.authors);
    avatars
        .style('background-image', author => 'url(' + author.avatar_url + ')')
        .style('opacity', function (author) {
            if (state.selectedAuthor && state.selectedAuthor.id === author.id) {
                return 1.0;
            }
            return 0.5;
        });
    avatars
        .enter()
        .append("div")
        .attr('class', 'author_avatar')
        .style('background-image', author => 'url(' + author.avatar_url + ')')
        .style('opacity', function (author) {
            if (state.selectedAuthor && state.selectedAuthor.id === author.id) {
                return 1.0;
            }
            return 0.7;
        })
        .on("click", function (author) {
            if (state.selectedAuthor && state.selectedAuthor.id === author.id) {
                deselectAuthor();
            } else {
                selectAuthor(author);
            }
        });
    avatars
        .exit()
        .remove();
}
