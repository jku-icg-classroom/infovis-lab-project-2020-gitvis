
function createHeaderVis(parentDiv) {
    let authorsDiv = parentDiv.append("div").attr("id", "authors");
    let authorsLabel = authorsDiv.append("h4").attr("id", "authors_label").text("Authors");
    let authorsRow = authorsDiv.append("div").attr("id", "authors_row");
}

function updateHeaderVis(data) {
    // TODO: make this nicer xD
    d3.select('#authors_row').selectAll("div")
        .data(state.authors)
        .style('background-image', author => 'url(' + author.avatar_url +')')
        .style('opacity', function (author) { 
            if(state.selectedAuthor && state.selectedAuthor.id === author.id) {
                return 1.0;
            }
            return 0.5;
         })
        .enter()
        .append("div")
        .attr('class', 'author_avatar')
        .style('background-image', author => 'url(' + author.avatar_url +')')
        .style('opacity', function (author) { 
            if(state.selectedAuthor && state.selectedAuthor.id === author.id) {
                return 1.0;
            }
            return 0.7;
         })
        .on("click", function (author) {
            // TODO: avoid updating whole vis 
            if(state.selectedAuthor && state.selectedAuthor.id === author.id) {
                updateState(function () {
                    state.selectedAuthor = null;
                });
            } else {
                updateState(function () {
                    state.selectedAuthor = author;
                });
            }            
        });
}