function createAuthorDetailsVis(parentDiv) {
    const authorDetailsDiv = parentDiv.append("div").attr("id", "author_details");

    authorDetailsDiv.append("h1").text("Author Details");
}

function updateAuthorDetailsVis(authorDetails) {
    console.log('update author details vis');
    
    if (authorDetails === null) {
        // TODO hide vis ?
        d3.select('#details')
            .select('#author_details')
            .style('display', 'none');
        return;
    }

    // TODO show vis ?
    d3.select('#details')
    .select('#author_details')
    .style('display', 'block');
}