const state = {
    data: [],
    // e.g. user selection
}

function filterData() {
    // filter the raw data according to user selection
}

function wrangleData(filtered) {
    // wrangles the given filtered data to the format required by the visualizations
}

function createVis(){
    // store main element for later
    debugger
    const visElement = d3.select('#vis');

    visElement.append('div').attr('id','head');
    visElement.append('div').attr('id','history');
    visElement.append('div').attr('id','details');


    // initialized for creating the visualizations, e.g. setup SVG, init scales, ...
    // createHeadVis();
    // createHistoryVis();
    // createDetailVis();

    function update(new_data) {
        // updates the specific visualization with the given data
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

d3.json().then((data) => {
    // load data, e.g. via d3.json and update app afterwards
    state.data = data;
    updateApp();
});
