$(document).ready(function(){	
	
    var userSearchTerm = "",
        
        NYTapiKey = "bdcebec4874a5076dbaaa7f2a5f0db3b:3:70140904",
        NYTtimesShown = 0,
        NYTresultsArray = [],
        
        guardianApiKey = "caxj4qkju6y44wsf93aqwkwc",
        guardianTimesShown = 1,
        guardianResultsArray = [],
        wikipediaResultsArray =[],

        wikipediaContinueString = "";




    function ResultsObject(url, headline, leadParagraph, index) {
        this.url = url;
        this.headline = headline;
        this.leadParagraph = leadParagraph;
        this.index = index;
    }

    var apiCallNYT = function(){
        $.ajax({
            url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + userSearchTerm.replace(' ', '+') + "&page=" + NYTtimesShown + "&api-key=" + NYTapiKey,  
            dataType: 'json',
            success: function(results){
                var resultsString = JSON.stringify(results),
                    resultsObject = results,
                    documentsArray = resultsObject['response']['docs'];
               
                documentsArray.forEach(function(element, index, array){
                    if (element['web_url'] == null || element['headline']['main'] == null || element['lead_paragraph'] == null) {
                    } else {
                    article = new ResultsObject(element['web_url'], element['headline']['main'], element['lead_paragraph'],  NYTresultsArray.length);
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

    var apiCallGaurdain = function() {        
        $.ajax({
            url: "http://content.guardianapis.com/search?api-key="+guardianApiKey+"&show-fields=all&page="+ guardianTimesShown + "&q="+userSearchTerm.replace(' ', '%'),
            dataType: 'jsonp',
            success: function( results ) {
            var results = results;
            //console.log(results);
            var documentsArray = results['response']['results'];
            //console.log(documentsArray);

            documentsArray.forEach(function(element, index, array){
                    if (element['webUrl'] == null || element['webTitle'] == null || element['fields']['standfirst'] == null) {
                    } else {
                    article = new ResultsObject(element['webUrl'], element['webTitle'], element['fields']['standfirst'],  guardianResultsArray.length);
                    guardianResultsArray.push(article);
                    }
                });
                resultsPrintGuardian(guardianResultsArray);
                guardianTimesShown++;
            }
        });
    };

    var resultsPrintGuardian = function(resultsArray){
        for (var i = 0; i < resultsArray.length; i++){
            if (resultsArray[i] !== undefined) {
                $("<tr id='guardianResult"+resultsArray[i].index+"'><td class='text-left guardianResult'><a href='" + resultsArray[i].url + "'>" + resultsArray[i].headline +"</a><p>" + resultsArray[i].leadParagraph + "</p></td></tr>").insertBefore('#guardian-last-row');
            } 
        }
    };


    var apiCallWikipedia = function(){
        $.ajax({
            //"http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch=" +searchTerm.replace(' ', '+') +"&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&continue=" + wikipediaContinueString
            url: "http://en.wikipedia.org/w/api.php?format=json&action=query&generator=allpages&gaplimit=10&gapfrom="+ userSearchTerm.replace(' ', '+')+"&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gapcontinue=" + wikipediaContinueString,
            dataType: 'jsonp',
            success: function(results) {
            var results = results;
            console.log(results);
            var documentsArray = results['query']['pages'];
            console.log(documentsArray);
            console.log(typeof documentsArray);
            wikipediaContinueString = results['query-continue']['allpages']['gapcontinue'];

            for (var prop in documentsArray) {
                if (documentsArray.hasOwnProperty(prop)){
                    article = new ResultsObject( "https://en.wikipedia.org/wiki/"+ encodeURI(documentsArray[prop]['title']), documentsArray[prop]['title'], documentsArray[prop]['extract'],  wikipediaResultsArray.length)
                    wikipediaResultsArray.push(article);
                }
            }
                 resultsPrintWikipedia(wikipediaResultsArray);
                 console.log(wikipediaResultsArray);
            }
        });
    }

    var resultsPrintWikipedia = function(resultsArray){
        for (var i = 0; i < resultsArray.length; i++){
            if (resultsArray[i] !== undefined) {

                $("<tr id='wikipeidaResult"+resultsArray[i].index+"'><td class='text-left wikipediaResult'><a href='" + resultsArray[i].url + "'>" + resultsArray[i].headline +"</a><p>" + resultsArray[i].leadParagraph + "</p></td></tr>").insertBefore('#wikipedia-last-row');
            } 
        }
    };
   
    $('#search-bar').bind('keypress',function (event){
        if (event.keyCode === 13){
            event.preventDefault();
            
            userSearchTerm = $('#user-search').val();
            
            NYTtimesShown = 0;
            NYTresultsArray = [];
            $('.NYTresult').remove();
            
            guardianTimesShown =1;
            guardianResultsArray = [];
            $('.guardianResult').remove();

            wikipediaContinueString = "";
            wikipediaResultsArray =[];
            $('.wikipediaResult').remove();


            apiCallWikipedia();
            apiCallNYT();
            apiCallGaurdain();
        }
    });

    $('#NYT-results-table-scrolable-container').bind('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            guardianResultsArray = [];
            apiCallNYT();
        }
    });

    $('#guardian-results-table-scrolable-container').bind('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            guardianResultsArray =[];
            apiCallGaurdain();
        }
    });

    $('#wikipedia-results-table-scrolable-container').bind('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            wikipediaResultsArray =[];
            apiCallWikipedia();
        }
    });

});

