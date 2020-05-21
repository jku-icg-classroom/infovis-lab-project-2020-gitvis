const REPO_DETAILS = 0;
const COMMIT_DETAILS = 1;
const AUTHOR_DETAILS = 2;
const state = {
    data: [],
    details: COMMIT_DETAILS,
    selectedCommit: null,
    selectedAuthor: null,
    authors: [],
    historyloaded: false,
    selectMinDate: new Date(),
    selectMaxDate: new Date()
}

function filterData() {
    // filter the raw data according to user selection
    return state.data;
}

function wrangleData(filtered) {
    // wrangles the given filtered data to the format required by the visualizations
    filtered.forEach((e, k) => {
        // let dateparsed = Date.parse(e.commit.author.date);
        filtered[k].commit.author.date = new Date(e.commit.author.date);
    });
    return filtered;
}

function createVis() {
    // initialized for creating the visualizations, e.g. setup SVG, init scales, ...
    const rootDiv = d3.select('#vis');
    let headerDiv = rootDiv.append('div').attr('id', 'header');
    let contentDiv = rootDiv.append('div').attr('id', 'content');
    let historyDiv = contentDiv.append('div').attr('id', 'history');
    const detailsDiv = contentDiv.append('div').attr('id', 'details');

    createHeaderVis(headerDiv);
    createHistoryVis(historyDiv);
    createCommitDetailsVis(detailsDiv);
    createAuthorDetailsVis(detailsDiv);

    // split the history and details divs 
    // history div has an initial width of 70%
    // details div has an initial width of 30%
    // split allows to resize both divs horizontally using the mouse 
    Split(['#history', '#details'], {
        sizes: [70, 30],
    });

    function update(new_data) {
        // updates the specific visualizations with the new data
        updateHeaderVis(new_data);
        if(!state.historyloaded){
            createDatePicker(new_data);
            updateHistoryVis(new_data);
            state.historyloaded = true;
        }
        updateCommitDetails(state.selectedCommit);    //must be a single commit
        updateAuthorDetailsVis(state.authors, state.selectedAuthor, state.data);
    }

    // return the update function to be called
    return update;
}

function selectCommit(commit) {
    state.selectedCommit = commit;
    state.selectedAuthor = null;
    state.details = COMMIT_DETAILS;

    // TODO: avoid updating whole vis?
    updateApp();
}

function selectAuthor(author) {
    state.selectedAuthor = author;
    state.selectedCommit = null;
    state.details = AUTHOR_DETAILS;

    // TODO: avoid updating whole vis?
    updateApp();
}

function deselectAuthor() {
    state.selectedAuthor = null;
    state.details = COMMIT_DETAILS;

    // TODO: avoid updating whole vis? 
    updateApp();
}

// create a specific instance
const vis = createVis();

function updateApp() {
    // updates the application
    const filtered = filterData();
    const new_data = wrangleData(filtered);

    // update visualization
    vis(new_data);
}

// init interaction, e.g. listen to click events
d3.select().on('click', () => {
    // update state
    updateApp();
})

d3.json("./data/commithistory.json").then((data) => {
    // load data, e.g. via d3.json and update app afterwards

    data.reverse();
    console.log(data);

    state.data = data;

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
