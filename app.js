/*
Query string has FOUR parameters
Search by: title & year
defaults:
type=movie
tomatoes=true

http://www.omdbapi.com/?t=Nightmare+on+Elm&type=movie&y=&tomatoes=true

JSON object
Title
Year
Actors
tomatoMeter (0%-100%)
*/

var favMovies = new Firebase('https://moviefire-96959.firebaseio.com');

function saveToList(event) {
	if (event.which == 13 || event.keyCode == 13) {
		var movieName = document.getElementById("movieName").value.trim();
		if (movieName.length > 0) {
			saveToFB(movieName);
		}
		document.getElementById("movieName").value = '';
		return false;
	}
}

function saveToFB(movieName) {
	// this will save data to Firebase
	favMovies.push({
		name: movieName
	});
}

function refreshUI(list) {
	var lis = '';
	for (var i = 0; i < list.length; i++) {
		lis += `<li data-key="${list[i].key}">${list[i].name} [${genLinks(list[i].key, list[i].name)}]</li>`;
	}
	document.getElementById("favMovies").innerHTML = lis;
}

function genLinks(key, mvName) {
	var links = "";
	links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')">Edit</a> | ';
	links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')">Delete</a>';
	return links;
}

function edit(key, mvName) {
	var movieName = prompt("Update the movie name", mvName);
	if (movieName && movieName.length > 0) {
		var updateMovieRef = buildEndPoint(key);
		updateMovieRef.update({
			name: movieName
		});
	}
}

function del(key, mvName) {
    var response = confirm("Are certain about removing \"" + mvName + "\" from the list?");
    if (response == true) {
        // build the FB endpoint to the item in movies collection
        var deleteMovieRef = buildEndPoint(key);
        deleteMovieRef.remove();
    }
}
 
function buildEndPoint (key) {
	return new Firebase('https://moviefire-96959.firebaseio.com/' + key);
}

favMovies.on("value", function(snapshot) {
	var data = snapshot.val();
	var list = [];
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			name = data[key].name ? data[key].name : "";
			if (name.trim().length > 0) {
				list.push({
					name: name,
					key: key
				})
			}
		}
	}
	refreshUI(list);
});