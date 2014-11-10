$(document).ready(function(){	
	
    var userSearchTerm = "",
        NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904",
        NYTtimesShown = 0,
        NYTresultsArray = [];

    function NYTresultsObject(url, headline, leadParagraph, index) {
        this.url = url;
        this.headline = headline;
        this.leadParagraph = leadParagraph;
        this.index = index;
    }

    var apiCallNYT = function(searchTerm, resultPageNumber, NYTapiKey){
        $.ajax({
            url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + searchTerm.replace(' ', '+') + "&page=" + resultPageNumber.toString() + "&api-key=" + NYTapiKey.toString(),  
            dataType: 'json',
            success: function(results){
                var resultsString = JSON.stringify(results),
                    resultsObject = results,
                    documentsArray = resultsObject['response']['docs'];
               
                documentsArray.forEach(function(element, index, array){
                    if (element['web_url'] == null || element['headline']['main'] == null || element['lead_paragraph'] == null) {
                    } else {
                    article = new NYTresultsObject(element['web_url'], element['headline']['main'], element['lead_paragraph'],  NYTresultsArray.length);
                    NYTresultsArray.push(article);
                    }
                });
                resultsPrintNYT(NYTresultsArray);
                NYTtimesShown++;
            }
        });
    };
    

    var resultsPrintNYT = function(resultsArray){
        for (var i = 0; i < resultsArray.length; i++){
            if (resultsArray[i] !== undefined) {
                $("<tr id='NYTresult"+resultsArray[i].index+"'><td class='text-left NYTresult'><a href='" + resultsArray[i].url + "'>" + resultsArray[i].headline +"</a><p>" + resultsArray[i].leadParagraph + "</p></td></tr>").insertBefore('#NYT-last-row');
            } 
        }
    };
    
    $('#search-bar').bind('keypress',function (event){
        if (event.keyCode === 13){
            event.preventDefault();
            NYTtimesShown = 0;
            NYTresultsArray = [];
            $('.NYTresult').remove();
            userSearchTerm = $('#user-search').val();
            apiCallNYT(userSearchTerm,NYTtimesShown,NYTapiKey);
        }
    });

    $('.results-table-scrolable-container').bind('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            apiCallNYT(userSearchTerm,NYTtimesShown,NYTapiKey);
        }
    });

});

