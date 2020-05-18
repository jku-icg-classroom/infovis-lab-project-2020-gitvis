const COMMIT_DETAILS = 1;
const AUTHOR_DETAILS = 2;
const state = {
    data: [],
    details: COMMIT_DETAILS,
    selectedCommit: null,
    selectedAuthor: null,
}

function filterData() {
    // filter the raw data according to user selection
    return state.data;
}

function wrangleData(filtered) {
    // wrangles the given filtered data to the format required by the visualizations

    filtered.forEach( (e,k) => {
       // let dateparsed = Date.parse(e.commit.author.date);
        filtered[k].commit.author.date = new Date(e.commit.author.date);
    });
    return filtered;
}

function createVis(){
    // initialized for creating the visualizations, e.g. setup SVG, init scales, ...
    // store main element for later
    const visElement = d3.select('#vis');
    visElement.append('div').attr('id','head');
    var content = visElement.append('div').attr('id','content');
    var history = content.append('div').attr('id','history');
    const detailsDiv = content.append('div').attr('id','details');

    // createHeadVis();
    createHistoryVis(history);

    if(state.details === COMMIT_DETAILS) {
        createCommitDetailsVis(detailsDiv);
    } else if(state.details === AUTHOR_DETAILS) {
        createAuthorDetailsVis(detailsDiv);
    }

    // split the history and details divs 
    // history div has an initial width of 70%
    // details div has an initial width of 30%
    // split allows to resize both divs horizontally using the mouse 
    Split(['#history', '#details'], {
        sizes: [70, 30],
    });
    
    function update(new_data) {
        // updates the specific visualization with the given data
        updateHistoryVis(new_data);
        updateCommitDetails(state.selectedCommit);    //must be a single commit
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

    data.reverse();
    console.log(data);

    state.data = data;
    updateApp();
});
