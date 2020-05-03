// store main element for later
const visElement = d3.select('#vis');

/**
 * Load sample data and update a table
 */
d3.csv('data/sample.csv')
    .then((data) => { // wait until loading has finished, then ...
        const table = createTable(data.columns);
        updateTableRows(table, data);
    })
    .catch((error) => {
        console.error('Error loading the data', error);
    });

/**
 * Create a table with the given columns as table header
 * @param {string[]} columns Array with the column names
 */
function createTable(columns) {
    const table = visElement.append('table');
    table.html(`<thead></thead><tbody></tbody>`);

    const tableHead = table.select('thead').append('tr');

    // add a table head cell for each item in the column array
    const th = tableHead.selectAll('th').data(columns);
    const thEnter = th.enter().append('th');
    th.merge(thEnter).text((d) => d); // use the string as text
    th.exit().remove();

    ;
    var requestFile = function () {
        getRepoJSON
            .then(function (fulfilled) {
                // yay, you got a file

                console.log(fulfilled);
                // output: { filename: 'data.txt', content: 'Hello World' }
            })
            .catch(function (error) {
                // oops, file didn't load
                console.log(error.message);
                // output: 'something bad happened'
            });
    };

    requestFile();

    return table;
}

/**
 * Add new table rows for the given data
 * @param {d3.select} table D3 selection of the table element
 * @param {array} data Loaded data as array
 */
function updateTableRows(table, data) {
    // add a table row for each item in the dataset
    const tr = table.select('tbody').selectAll('tr').data(data, (d) => d.fruit); // use the property `fruit` as unique key
    const trEnter = tr.enter().append('tr');
    const trMerge = tr.merge(trEnter);
    tr.exit().remove();

    // add a table cell for each property (i.e., column) in an item
    const td = trMerge // use trMerge to update cells
        .selectAll('td')
        .data((d) => Object.values(d)); // `Object.values(d)` returns all property values of `d` as array
    const tdEnter = td.enter().append('td');
    td.merge(tdEnter).text((d) => d);
    td.exit().remove();
}
