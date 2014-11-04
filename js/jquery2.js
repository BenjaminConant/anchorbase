$(document).ready(function(){	
	
	
	$('#submit-guess').click(function(){
		
	});

	
	$('#search-bar').submit(function(e){
		var newYorkTimesAPIStarter = "http://api.nytimes.com/svc/search/v2/articlesearch.json?";
		var userSearchTerm = $('#user-search').val();
		var q = 'fq=' + userSearchTerm;
		var apiKey = 'api-key=bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904';
		var url = newYorkTimesAPIStarter + q + apiKey;
		$('#cnn').text(userSearchTerm);
		e.preventDefault();
		$('#user-search').val('');
		$.ajax({
    		url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + userSearchTerm + "&facet_field=day_of_week&begin_date=18510918&end_date=20141103&api-key=bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904",
    		dataType: 'json',
    		success: function(results){
        	var resultsString = JSON.stringify(results);
        	var resultsObject = results;
        	var firstLinkURL = JSON.stringify(resultsObject['response']['docs'][0]['web_url']);
        	var secondLinkURL = JSON.stringify(resultsObject['response']['docs'][1]['web_url']);
        	var thirdLinkURL = JSON.stringify(resultsObject['response']['docs'][2]['web_url']);
        	var firstArtLeadParagraph = JSON.stringify(resultsObject['response']['docs'][0]['lead_paragraph']);
        	var secondArtLeadParagraph = JSON.stringify(resultsObject['response']['docs'][1]['lead_paragraph']); 
        	var thirdArtLeadParagraph = JSON.stringify(resultsObject['response']['docs'][2]['lead_paragraph']);        
        //	$('#test-output').text(resultsString);
    		$('#NYT1').attr("href", firstLinkURL);
    		$('#NYT2').attr("href", secondLinkURL);
    		$('#NYT3').attr("href", thirdLinkURL);
    		$('#NYT1').text(firstArtLeadParagraph);
    		$('#NYT2').text(secondArtLeadParagraph);
    		$('#NYT3').text(thirdArtLeadParagraph);
    		}
    		

		});


	});

	//http://api.nytimes.com/svc/search/v2/articlesearch.response-format?[q=search term&fq=filter-field:(filter-term)&additional-params=values]&api-key=####






	$('#play-again').click(function(){
		
	});

	$('#hint').click(function(){
		
	});




	
});