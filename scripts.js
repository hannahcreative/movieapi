// this is a blank object
var movieApp = {};

// here's the API key
movieApp.api_key = "37e8c1f0ffe2f4c075c9ba59bd394898";

// we are putting everything on our object movie app...
movieApp.init = function() {
	movieApp.grabConfig();

	movieApp.getSessionId();

	//listen for a click on our star ratings 
	$('body').on('change', 'input[name*=rating]',function(){
		var rating = $(this).val();
		var movieId = $(this).attr('id').split('-')[0].replace('movies','');
		movieApp.ratingHandler(rating, movieId);
	}); 

	// listen for A USER to change their input
	$('input[name=genre]').on('change', function(){
		console.log("Changed!!");
		var genreId = $(this).attr('data-movieid');
		console.log(genreId);
		movieApp.grabGenre(genreId);
	});

};// end movieApp.init()

// this function will go to the movie db api and get all the config data that we require.  
// when it finishes it will put the data it gets onto movieaApp.config
movieApp.grabConfig = function(){
	var configURL = 'http://api.themoviedb.org/3/configuration';
	$.ajax(configURL,{
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key // we are giving them the key so it's in a new object
		},
		success : function(config) {
			movieApp.config = config;
		}
	}); // end config ajax, we don't need to config for every API, but this one needs it
};


 


movieApp.grabGenre = function(genreId){
	var genreURL = 'http://api.themoviedb.org/3/genre/'+genreId+'/movies'
	$.ajax(genreURL,{
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		},
		success : function(data){
			movieApp.displayMovies(data.results);
		}
	});
}; 






// movieApp.grabTopRated = function(){
// 	var topRatedURL = 'http://api.themoviedb.org/3/movie/top_rated';
// 	$.ajax(topRatedURL, {
// 		type : 'GET',
// 		dataType : 'jsonp',
// 		data : {
// 			api_key : movieApp.api_key
// 		},
// 		success : function(data){
// 			console.log(data);
// 			// run the displayMovies method to put them on the page
// 			movieApp.displayMovies(data.results);
// 		}
// 	}); // end top rated ajax
// };



// here's a cute new way of creating html elements by using JS
movieApp.displayMovies = function(movies){
	$('.resultsList').empty();
	for (var i = 0; i < movies.length; i++) {
		var title = $('<h2>').text(movies[i].title);
		var image = $('<img>').attr('src',movieApp.config.images.base_url + "w500" + movies[i].poster_path);
		//grab the one existing rating fieldset and get the HTML for it
		var rating = $('fieldset.rateMovie')[0].outerHTML;
		
		// two find and replace
		rating = rating.replace(/star/g,'movies'+movies[i].id+'-star');
		rating = rating.replace(/rating/g, 'rating-'+movies[i].id);

		var movieWrap = $('<div>').addClass('movie');
		movieWrap.append(title, image, rating);
		$('.resultsList').append(movieWrap);

	};

}

movieApp.ratingHandler = function(rating,movieId) {
	// we will now rate the movie
	$.ajax('http://api.themoviedb.org/3/movie/'+movieId+'/rating',{
		type : 'POST',
		data : {
			api_key : movieApp.api_key,
			guest_session_id : movieApp.session_Id,
			value : rating * 2
		},
		success : function(response) {
			if(response.status_code) {
				alert("thanks for the vote");
			}
			else {
				alert(response.status_message);
			}
		}
	});
};

movieApp.getSessionId = function() {
	$.ajax('http://api.themoviedb.org/3/authentication/guest_session/new', {
		data : {
			api_key : movieApp.api_key
		},
		type : 'GET', 
		dataType : 'jsonp',
		success : function(session){
			// store the session id for later use
			movieApp.session_Id = session.guest_session_id;
			console.log(session);
		}
	});
};

//document ready, which comes after the namespace, as the namespace is for defining things only

$(function() {
	movieApp.init();
}); // end doc ready 

// call back funtion is a function nested inside of another function


