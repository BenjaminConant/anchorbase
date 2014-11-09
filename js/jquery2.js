$(document).ready(function(){	
	var userSearchTerm = "";
    var NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904";
    var NYTtimesShown = 1;
    var NYTresultsArray = [];
    var NYTlastQueryResultsLengthArray = [];
    var NYTobjectDisplayFlag;
    var thingy = 0;

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
                    documentsArray = resultsObject['response']['docs'],
                    // firstLinkURL = resultsObject['response']['docs'][0]['web_url'],
                    // secondLinkURL = resultsObject['response']['docs'][1]['web_url'],
                    // thirdLinkURL = resultsObject['response']['docs'][2]['web_url'],
                    // firstArtLeadParagraph = resultsObject['response']['docs'][0]['lead_paragraph'],
                    // secondArtLeadParagraph = resultsObject['response']['docs'][1]['lead_paragraph'], 
                    // thirdArtLeadParagraph = resultsObject['response']['docs'][2]['lead_paragraph'],
                    // firstArtHeadline = resultsObject['response']['docs'][0]['headline']['main'],
                    // secondArtHeadline = resultsObject['response']['docs'][1]['headline']['main'],     
                    // thirdArtHeadline = resultsObject['response']['docs'][2]['headline']['main'],
                    numObjectsInArray = 0;

                documentsArray.forEach(function(element, index, array){
                    if (element['web_url'] == null || element['headline']['main'] == null || element['lead_paragraph'] == null) {

                    } else {
                    article = new NYTresultsObject(element['web_url'], element['headline']['main'], element['lead_paragraph'],  NYTresultsArray.length);
                    NYTresultsArray.push(article);
                    numObjectsInArray++;
                    }
                });
                NYTobjectDisplayFlag = NYTresultsArray.length -1; 
                resultsPrintNYT(NYTresultsArray);
                NYTlastQueryResultsLengthArray.push(numObjectsInArray);
                numObjectsInArray = 0;
            }
        });
    };

    var resultsPrintNYT = function(resultsArray, endIndex){
                if (typeof endIndex === 'undefined') {
                    endIndex = resultsArray.length;
                }
                var startIndex = $('#NYT-results-table tbody').children().length - 2;
                for (var i = startIndex; i < endIndex; i++){
                  if (resultsArray[i] !== undefined) {
                        $("<tr id='NYTresult"+resultsArray[i].index+"'><td class='text-left'><a href='" + resultsArray[i].url + "'>" + resultsArray[i].headline +"</a><p>" + resultsArray[i].leadParagraph + "</p></td></tr>").insertBefore('#NYT-last-row');
                    } 
                  }
    };
    
    var showMoreNYT = function(){
            apiCallNYT(userSearchTerm,NYTtimesShown,NYTapiKey);
            NYTtimesShown++;        
    };

	$('#search-bar').submit(function(e){
        NYTresultsArray = [];
        $('.NYTresult').remove();
        userSearchTerm = $('#user-search').val();
        e.preventDefault();
        //$('#user-search').val('');
        apiCallNYT(userSearchTerm,0,NYTapiKey);
        resultsPrintNYT(NYTresultsArray);
        $('.show-more-NYT').css("visibility","visible");
        $('.show-less-NYT').css("visibility","visible");
	});

    $('.show-more-NYT').click(function() {
        showMoreNYT();
    });

    $('.results-table-scrolable-container').bind('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            apiCallNYT(userSearchTerm,NYTtimesShown,NYTapiKey);
            NYTtimesShown++;

        }
    });
});

