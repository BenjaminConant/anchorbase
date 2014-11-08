$(document).ready(function(){	
	var userSearchTerm = "";
    var NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904";
    var NYTtimesShown = 1;
    var NYTresultsArray = [];
    function NYTresultsObject(url, headline, leadParagraph) {
        this.url = url;
        this.headline = headline;
        this.leadParagraph = leadParagraph;
    }


    var apiCallNYT = function(searchTerm, resultPageNumber, NYTapiKey){
        $.ajax({
            url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + searchTerm.replace(' ', '+') + "&page=" + resultPageNumber.toString() + "&api-key=" + NYTapiKey.toString(), 
            dataType: 'json',
            success: function(results){
                var resultsString = JSON.stringify(results),
                    resultsObject = results,
                    documentsArray = resultsObject['response']['docs'],
                    firstLinkURL = resultsObject['response']['docs'][0]['web_url'],
                    secondLinkURL = resultsObject['response']['docs'][1]['web_url'],
                    thirdLinkURL = resultsObject['response']['docs'][2]['web_url'],
                    firstArtLeadParagraph = resultsObject['response']['docs'][0]['lead_paragraph'],
                    secondArtLeadParagraph = resultsObject['response']['docs'][1]['lead_paragraph'], 
                    thirdArtLeadParagraph = resultsObject['response']['docs'][2]['lead_paragraph'],
                    firstArtHeadline = resultsObject['response']['docs'][0]['headline']['main'],
                    secondArtHeadline = resultsObject['response']['docs'][1]['headline']['main'],     
                    thirdArtHeadline = resultsObject['response']['docs'][2]['headline']['main'];
                
                documentsArray.forEach(function(element, index, array){
                    if (element['web_url'] == null || element['headline']['main'] == null || element['lead_paragraph'] == null) {

                    } else {
                    article = new NYTresultsObject(element['web_url'], element['headline']['main'], element['lead_paragraph']);
                    NYTresultsArray.push(article);
                    }
                }); 
                
                resultsPrintNYT(NYTresultsArray);
                NYTresultsArray = [];
            }
        });
    };

    var resultsPrintNYT = function(resultsArray){
           









            NYTresultsArray.forEach(function(element, index, array){
                $("<tr class='NYTresult'><td class='text-left'><a href='" + element.url + "'>" + element.headline +"</a><p>" + element.leadParagraph + "</p></td></tr>").insertBefore('#NYT-last-row');
            });
    };
    
    var showMoreNYT = function(){
        if (NYTtimesShown === 1) {
            $('.show-less-NYT').css("visibility","visible");
        }
        apiCallNYT(userSearchTerm,NYTtimesShown,NYTapiKey);
        NYTtimesShown++;
    };

    var showLessNYT = function (){

    }

	$('#search-bar').submit(function(e){
        NYTresultsArray = [];
        $('.NYTresult').remove();
        userSearchTerm = $('#user-search').val();
        e.preventDefault();
        $('#user-search').val('');
        apiCallNYT(userSearchTerm,0,NYTapiKey);
        resultsPrintNYT(NYTresultsArray);
        
        $('.show-more-NYT').css("visibility","visible");
	});

    $('.show-more-NYT').click(function() {
        showMoreNYT();
    });
});