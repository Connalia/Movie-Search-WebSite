$(document).ready(function(){
	
	var titleInput = document.getElementById("search_input");

	var timeout = null;
	
	//when the key is released=apeleu8ero8ei(stamatiso na grafo)
	$("input").keyup (function (e) {
	
		//clear the timeout if it has already been set.
		clearTimeout(timeout);
		
		
			//var title2='dance';
			//var title2=document.getElementById("search_input").value;
		timeout = setTimeout(function () {
			console.log('Input Value:', titleInput.value);
			
			var url='http://www.omdbapi.com/?apikey=6682a98c&s="'+titleInput.value+'"';
			$.getJSON(url,function(data){
			
				console.log(data);
			
				//try find records from API
				if(data.Response=="False"){
					$("#moreSameMovies").remove(); 
					$("#backSameMovies").remove();
					$("#backSearch").remove();
					$("#totalResults").remove();
					
					
					$("#list").html("<p id='errorFind'>I can't find movie with this title</p>");
					
				}else{
					
					var pageTotalResults=printTotalResult(data.totalResults);
					
					printArrayListMovie(data,pageTotalResults,titleInput.value);
					
				}
			
			
			});
			
		}, 1000);//=milliseconds
	
	});
	
	
	
});

//closure
var statePage=(function(){
	var counter = 1;
	return function (bool) {
		if(bool=="next"){
			counter += 1;
		}else if(bool=="back"){
			counter -= 1;
		}else if(bool=="find"){
			return counter;
		}
		
		return counter;
	}
})();

function backPage(searchTitle){
	var page=statePage("back");
	var url='http://www.omdbapi.com/?apikey=6682a98c&s="'+searchTitle+'"&page='+page+'';
	$.getJSON(url,function(data){
		/*diairoume me to 10,gt to API mas epistrefei dafault tis protes 10 apo to totalResults*/
		var pageTotalResults=(data.totalResults/10);
		
		/*briskoume poses selides prepei na epistrepsoume gia na broume oles tis tainies me to skygkekrimeno title*/
		/*stoggilopoihsi pros ta pano*/
		if(pageTotalResults%1>0){
			pageTotalResults=pageTotalResults-(pageTotalResults%1);//gia na fugei to dekadikos meros
			pageTotalResults++;
		}
		
		printArrayListMovie(data,pageTotalResults,searchTitle);
		
		/*exei ftasei stin proti selida me arxika apotelesmata*/
		/*opote bgazoume to koumpi me id="backSameMovies"*/
		if(page==1){
			$("#backSameMovies").remove();
		}
	});
}

function nextPage(searchTitle){
	var page=statePage("next");
	var url='http://www.omdbapi.com/?apikey=6682a98c&s="'+searchTitle+'"&page='+page+'';
	$.getJSON(url,function(data){
		/*diairoume me to 10,gt to API mas epistrefei dafault tis protes 10 apo to totalResults*/
		var pageTotalResults=(data.totalResults/10);
		
		/*briskoume poses selides prepei na epistrepsoume gia na broume oles tis tainies me to skygkekrimeno title*/
		/*stoggilopoihsi pros ta pano*/
		if(pageTotalResults%1>0){
			pageTotalResults=pageTotalResults-(pageTotalResults%1);//gia na fugei to dekadikos meros
			pageTotalResults++;
		}
		
		printArrayListMovie(data,pageTotalResults,searchTitle);
		
		/*exei ftasei stin teleutaia se lida me ta teleutaia apotelesmata*/
		/*opote bgazoume to koumpi me id="moreSameMovies"*/
		if(pageTotalResults==page){
			$("#moreSameMovies").remove();
		}
	});
}

function printTotalResult(totalResult,plusReturn){
	var result="";
	
	/*diairoume me to 10,gt to API mas epistrefei dafault tis protes 10 apo to totalResults*/
	var pageTotalResults=(totalResult/10);
	
	/*briskoume poses selides prepei na epistrepsoume gia na broume oles tis tainies me to skygkekrimeno title*/
	/*stoggilopoihsi pros ta pano*/
	if(pageTotalResults%1>0){
		pageTotalResults=pageTotalResults-(pageTotalResults%1);//gia na fugei to dekadikos meros
		pageTotalResults++;
	}
	
	result+='<p id="totalResults">Total Results: '+totalResult+'</p>';
	
	//result+='<p>page:'+pageTotalResults+'(8a prepei na sbistei meta)</p>';
	
	$("#resultTotal").html(result);
	
	
	return pageTotalResults;
	
	
}
//το s επιστρεφει array από ταινίες(to array exei mege8os 10,gia ena page)
function printArrayListMovie(data,pageTotalResults,searchTitle){
	topHtml();

	var printDiv="";
	for(i=0 ; i<data.Search.length ;i++){
		printDiv+='<div id="movieItem'+i+'" class="listSearch"></div>';
	}
	$("#list").html(printDiv);


	for(i=0 ; i<data.Search.length ;i++){
		var printMovie="";
		
		printMovie+='<div class="imagePrint">'; 
		printMovie+='<img src="'+data.Search[i].Poster+'" onerror="imageError(this)" alt="poster" class="imageList" id="imgL">';
		printMovie+='</div>';
		
		printMovie+='<div class="allInfo">'; 
		
		printMovie+='<a href="#" onclick="movieInfoID(\'' + data.Search[i].imdbID + '\')">'+data.Search[i].Title+"</a>";
		printMovie+='<p class="minDetails"><span id="minYear">('+data.Search[i].Year+') ('+data.Search[i].Type+')</span> <br> <br>(imdbID: '+data.Search[i].imdbID+')</p>';
		
		printMovie+='<p id="Plot'+data.Search[i].imdbID+'"></p>';
		
		printMovie+='<button class="moreInfoMovie" onclick="movieInfoID(\'' + data.Search[i].imdbID + '\')">More info</button><br>';
		
		printMovie+='</div>';
		
		$("#movieItem"+i+"").html(printMovie);
		
		var url='http://www.omdbapi.com/?apikey=6682a98c&i='+data.Search[i].imdbID+'';
		$.getJSON(url,function(data){
			console.log(data);
			var printPlot="";
			printPlot+='<p class="minPlot">'+data.Plot+'</p>';
			console.log("#Plot"+i+"");
			$("#Plot"+data.imdbID+"").html(printPlot);
		});

	}
	

	var printButn="";
	/*an uparxoun kai alles selides(dhladi apotelesmata perissotera apo 10)*/
	if(pageTotalResults>1){
		
		if(statePage("find")!=1){
			printButn+='<button id="backSameMovies" onclick="backPage(\'' +searchTitle + '\')" ></button>';
		}
		printButn+='<button id="moreSameMovies" onclick="nextPage(\'' + searchTitle + '\')"></button>';
		
	}
	$("#buttonNextback").html(printButn);//to ektuponei sto html
}

function imageError(source){
        source.src = "imgError3.jpeg";
        source.onerror = ""; 
        return true; 
}

function returnFullPlot(titleFull){
	var urlFull='http://www.omdbapi.com/?apikey=6682a98c&i='+titleFull+'&plot=full';
	$.getJSON(urlFull,function(data){
		console.log(data);
			
		//try find records from API
		if(data.Response=="True"){
			$("#list").html('<p>Full Plot:'+data.Plot+'</p>');
		}
	});		
}

function backToSearch(searchTitle){
	var page=statePage("find");
	var searchTitle = document.getElementById("search_input").value;
	var url='http://www.omdbapi.com/?apikey=6682a98c&s="'+searchTitle+'"&page='+page+'';
	$.getJSON(url,function(data){
		
		var pageTotalResults=printTotalResult(data.totalResults);
		
		printArrayListMovie(data,pageTotalResults,searchTitle);
		
		/*exei ftasei stin proti selida me arxika apotelesmata*/
		/*opote bgazoume to koumpi me id="backSameMovies"*/
		if(page==1){
			$("#backSameMovies").remove();
		}
	});
}

function movieInfoID(nameID) {
		topHtml();
	
		//var t= $(nameTitle).text();//pernei to text pou uparxei sto this p.x movieInfoID(this)
		//$("#list").html(t);//to ektuponei sto html
		
		$("#totalResults").remove();
		$("#moreSameMovies").remove(); 
		$("#backSameMovies").remove();
		
		var printButn="";
		printButn+='<button id="backSearch" onclick="backToSearch()" class="back">Back to List</button>';
		$("#buttonNextback").html(printButn);//to ektuponei sto html
		
		var url='http://www.omdbapi.com/?apikey=6682a98c&i='+nameID+'&plot=full';
		$.getJSON(url,function(data){
			result="";
			$.each(data, function(key, val){
				if(key=="Poster"){
					result+='<img src="'+val+'" onerror="imageError(this)" alt="'+key+'" id="imageMovie">';
				}else if(key==="Ratings"){
					result+='<div id="thirdDiv"><p class="Info"><span class="titleKeyInfo">' + key + ':</span><br>';
					for(i=0 ; i<val.length ;i++){
						result+='<span class="categoryRating : ">' + val[i].Source+ '</span>';
						result+='<span class="ratingStar">: ' + val[i].Value+ '</span></p>';
					}
					
				}else if(key==="imdbRating"){
					result+='<div class="stars">';
					result+= '<p class="Info" id="ratingStar">';result+='<span class="titleKeyInfo">' + key + ": </span>" + '<span id="'+key+'" class="titleValInfo" >' + val+ "</span></p>";
					
					
					/*start calculate stars*/
					var star=0;
					console.log(val%1);
					if(val%1<=0.5 && val%1>=0.25){/*stogilopoiisi sto 0,5*/
						star=val-(val%1);//gia na fugei to dekadikos meros
						star=star+0.5;
						
					}else if(val%1>0.5){/*strogilopoiisi pros ta pano*/
						star=val-(val%1);//gia na fugei to dekadikos meros
						star++;
						
					}else{/*strogilopoiisi pros ta kato*/
						star=val-(val%1);//gia na fugei to dekadikos meros
					}
					console.log(star);
					for(k=0;k<10;k++){
						if(star>0.5){
							result+='<span class="star on"></span>';
							star=star-1;
						}else if(star==0.5){/*epeidi afairo ka8e asteri poy bazo,an einai misi,8a exei mini sto telos na pros8eso to 0,5*/
							result+='<span class="star half"></span>';
							star=star-0.5;
						}else{/*an exoun afaire8ei ola ta star,sumainei oti ta alla den einai fotina*/
							result+='<span class="star"></span>';
						}
						
					}
					/*end calculate stars*/
					result+='</div>';
					
				}else if(key=="Response"){
					result+='';
				}else if(key=="Website"){
					if(val=="N/A"){/*na min to ftia3ei os link*/
						result+= '<p class="Info"><span class="titleKeyInfo">' + key + ": </span>" + '<span id="'+key+'" class="titleValInfo" >' + val+ "</span></p> </div>";
					}else{
						result+='<p class="Info"><span class="titleKeyInfo">' + key + ": </span>" + '<a id="'+key+'" class="titleValInfo" href="'+val+'">' + val+ "</a></p> </div>";
					}
				}else{
					/*xreaizonati gia na omadopoih8oun ta data se div*/
					if(key=="Title"){
						result+= '<div id="firstDiv"> <p class="Info"><span class="titleKeyInfo">' + key + ": </span>" + '<span id="'+key+'" class="titleValInfo" >' + val+ "</span></p>";
					}else if(key=="Director" || key=="Awards"){
						result+= '<p class="Info"><span class="titleKeyInfo">' + key + ": </span>" + '<span id="'+key+'" class="titleValInfo" >' + val+ "</span></p> </div>";
					}else if(key=="Writer"){
						result+= '<div id="secondDiv"> <p class="Info"><span class="titleKeyInfo">' + key + ": </span>" + '<span id="'+key+'" class="titleValInfo" >' + val+ "</span></p>";
					}else{
						result+= '<p class="Info"><span class="titleKeyInfo">' + key + ": </span>" + '<span id="'+key+'" class="titleValInfo" >' + val+ "</span></p>";
					}
				}
			});
			console.log(data);
			
			$("#list").html(result);
			
			
		});
			
}


/*https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_scroll_to_top*/
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		document.getElementById("topBtn").style.display = "block";
	} else {
		document.getElementById("topBtn").style.display = "none";
	}
}
// When the user clicks on the button, scroll to the top of the document
function topHtml(){
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}


/*https://memorynotfound.com/detect-enter-keypress-javascript-jquery/*/
// handle enter plain javascript
function handleEnter(event){
    if (event.keyCode == '13') {//13="Enter"
	event.preventDefault();
	
	if(notAlertAgain(find)==true){
		/*confirm einai paromoio me alert*/
		var r =confirm('You do not need press enter,it is auto search!\n Do you want print this message again,when press enter???');
		
		if (r == true) {
			txt = "You pressed OK!";
		} else {
			notAlertAgain("no");
		}
	}
	
    }
}
//closure
var notAlertAgain=(function(){
	var alertMs = true;
	return function (bool) {
		if(bool=="no"){
			alertMs = false;
		}
		if(bool=="find"){
			return alertMs;
		}
		return alertMs;
	}
})();










/*link must will be use
javascript load css:
https://www.geeksforgeeks.org/how-to-load-css-files-using-javascript/
http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
*/




/*link which help me
https://schier.co/blog/2014/12/08/wait-for-user-to-stop-typing-using-javascript.html

https://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up

https://www.w3schools.com/jquery/jquery_dom_add.asp

https://codepen.io/brianhaferkamp/pen/KopOwz/
*/




