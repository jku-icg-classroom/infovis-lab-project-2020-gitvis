const COMMIT_DETAILS = 1;
const AUTHOR_DETAILS = 2;
const state = {
    data: [],
    details: COMMIT_DETAILS,
    selectedCommit: null,
    // e.g. user selection
}

function filterData() {
    // filter the raw data according to user selection
    return state.data;
}

function wrangleData(filtered) {
    // wrangles the given filtered data to the format required by the visualizations
    return filtered;
}

function createVis(){
    // initialized for creating the visualizations, e.g. setup SVG, init scales, ...

    // store main element for later
    const visElement = d3.select('#vis');

    visElement.append('div').attr('id','head');
    var content = visElement.append('div').attr('id','content');
    var history = content.append('div').attr('id','history');
    const details = content.append('div').attr('id','details');

    // createHeadVis();
    createHistoryVis(history);
    
    if(state.details === COMMIT_DETAILS) createCommitDetailsVis(details);
    //TODO else ELIAS

    function update(new_data) {
        // updates the specific visualization with the given data

        updateHistoryVis(new_data);
        updateCommitDetails(new_data[0]);    //must be a single commit
    }


    // return the update function to be called
    return update;
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

    console.log(data);

    state.data = data;
    updateApp();
});
