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
    // initialized for creating the visualizations, e.g. setup SVG, init scales, ...

    // store main element for later
    const visElement = d3.select('#vis');

    visElement.append('div').attr('id','head');
    var content = visElement.append('div').attr('id','content');
    var history = content.append('div').attr('id','history');
    content.append('div').attr('id','details');

    // createHeadVis();
    createHistoryVis(history);
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

d3.json("./data/commithistory.json").then((data) => {
    // load data, e.g. via d3.json and update app afterwards
    debugger
    console.log(data);

    state.data = data;
    updateApp();
});
