
const MAX_FILETYPES_PER_CHART = 10;

function preprocessFileTypeMap(map) {
    let sorted_map = new Map([...map.entries()].sort((a, b) => {
        const changesA = a[1].additions + a[1].deletions;
        const changesB = b[1].additions + b[1].deletions;
        return changesB - changesA;  
    }));

    if(sorted_map.size > MAX_FILETYPES_PER_CHART) {
        sorted_map = aggregateFileTypeMap(sorted_map);
    }

    return sorted_map;
}

function aggregateFileTypeMap(map) {
    const iterator = map.values();
    map = new Map();
    const others = { 
        "type": "others", 
        "additions": 0, 
        "deletions": 0 
    };

    //add the more important fileTypes normally
    for(let i = 0; i < MAX_FILETYPES_PER_CHART-1; i++) {
        const val = iterator.next().value;
        map.set(val.type, val);
    }

    //aggregate the less important fileTypes
    let item = iterator.next();
    while(!item.done) {
        const val = item.value;
        others.additions += val.additions;
        others.deletions += val.deletions;

        item = iterator.next();
    }
    map.set("others", others);

    return map;
}