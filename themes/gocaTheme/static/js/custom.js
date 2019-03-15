var lunrIndex,
    $results,
    pagesIndex;

// Initialize lunrjs using our generated index file
function initLunr() {
    // First retrieve the index file
    $.getJSON(baseurl+"index.json")
        .done(function(index) {
            pagesIndex = index;

            // Set up lunrjs by declaring the fields we use
            // Also provide their boost level for the ranking
            lunrIndex = lunr(function() {
                this.field("content", {
                    boost: 15
                });
                this.field("title", {
                    boost: 10
                });
                this.field("tags", {
                    boost: 5
                });

                // ref is the result item identifier (I chose the page URL)
                this.ref("uri");

                pagesIndex.forEach(function(doc) {
                    this.add(doc)
                  }, this)
            });
            
            // Feed lunr with each file and let lunr actually index them
            // pagesIndex.forEach(function(page) {
            //     lunrIndex.add(page);
            // });
            
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.error("Error getting Hugo index flie:", err);
        });
}

// Nothing crazy here, just hook up a listener on the input field
function initUI() {
    $results = $("#search-results");
    $("#search-input").keyup(function() {
        $results.empty();

        // Only trigger a search when 2 chars. at least have been provided
        var query = $(this).val();
        if (query.length < 2) {
            return;
        }

        var results = search(query);
        renderResults(results);
    });
}

function search(query) {
    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result: 
    //  {ref: "/section/page1", score: 0.2725657778206127}
    // Our result:
    //  {title:"Page1", href:"/section/page1", ...}
    return lunrIndex.search(query).map(function(result) {
            return pagesIndex.filter(function(page) {
                return page.uri === result.ref;
            })[0];
        });
}

function renderResults(results) {
    if (!results.length) {
        return;
    }

    var res_list = $("<div>", {class: "autocomplete-suggestions"});
    // Only show the ten first results
    results.slice(0, 10).forEach(function(result) {
        res_list.append(buildResult(result));
    });

    $results.append(res_list);
    res_list.css({display: "block"});
}

function buildResult(result) {
    var res = $("<div/>", {class:"autocomplete-suggestion"}),
        t = $("<b/>"),
        c = $("<div/>", {class:"context"});

    res.attr("data-url", result.uri);
    t.text(result.title);
    c.text(result.content);
    res.append(t);
    res.append(c);
    res.click(function(event){
        event.preventDefault();
        event.stopPropagation();
        window.location.assign($(this).attr("data-url"));
    });

    return res
}

$(document).ready(function() {
    hljs.initHighlightingOnLoad();
    initLunr();
    initUI();
});
