let artistList = document.getElementById('artist-list');
let artistForm = document.getElementById("new_artist_form");
let myStorage = window.localStorage;


document.addEventListener('readystatechange', async()=>{
	var response = await fillPage();
	console.log(response);
});

async function fillPage(){
	var artists = await fetch("https://artist-lab.herokuapp.com/artists/all");
	artists = await artists.json();
	console.log(artists);
	artistList.innerHTML = "";
	artists.forEach(function(a) { addArtistToHTML(a.name, a.desc, a.url); });
	let buttons = document.getElementsByClassName("deleteBtn");
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', deleteArtist);
	}
}


let addButton = document.getElementById('submit');
addButton.addEventListener("click", addArtist);

let searchButton = document.getElementById('search');
searchButton.addEventListener('click', search);

function showArtistForm(){

	document.getElementById("addArtistPhoto").value = '';
	document.getElementById('addArtistDesc').value = '';
	document.getElementById('addArtistName').value = '';

	artistList.style.display = "none";
	artistForm.style.display = "block";
}

function addArtist(){
	let addArtistPhoto = document.getElementById("addArtistPhoto").value;
	let addArtistDesc = document.getElementById('addArtistDesc').value;
	let addArtistName = document.getElementById('addArtistName').value;
	addArtistToHTML(addArtistName, addArtistDesc, addArtistPhoto);
	addArtistToDB(addArtistName, addArtistPhoto, addArtistDesc);
}

function addArtistToHTML(addArtistName, addArtistDesc, addArtistPhoto) {

	let artist = document.createElement('div');
	artist.setAttribute('class', 'artist');
	
	let artistImg = document.createElement('div');
	artistImg.setAttribute('class','artist-img');
	let imgLink = document.createElement('img');
	imgLink.setAttribute('src', addArtistPhoto);
	artistImg.appendChild(imgLink);
	artist.appendChild(artistImg);

	let artistDesc = document.createElement("div");
	artistDesc.setAttribute('class', 'desc');
	let name = document.createElement('h5');
	name.innerText = addArtistName;
	let desc = document.createElement('p');
	desc.innerText = addArtistDesc;
	artistDesc.appendChild(name);
	artistDesc.appendChild(desc);
	artist.appendChild(artistDesc);

	let deleteBtn = document.createElement('button');
	deleteBtn.addEventListener("click", deleteArtist);
	deleteBtn.innerText = "Delete";
	deleteBtn.setAttribute('class', 'deleteBtn');
	artistDesc.appendChild(deleteBtn);
	
	artistList.appendChild(artist);
	artistList.style.display = "grid";
	artistForm.style.display = "none";
	
}

async function addArtistToDB(name, url, desc){
	console.log("adding");
	var artists = await fetch("https://artist-lab.herokuapp.com/artists/add", {
		method:"POST",
		headers:{
			"Content-Type":"application/json"
		},
		body: JSON.stringify({name:name,desc:desc,url:url})
	});
}

async function deleteArtist() {
	var deleteObj = this.parentElement.parentElement;
	console.log(deleteObj);

	artistList.removeChild(deleteObj);
	var names = deleteObj.getElementsByTagName("h5")[0].innerText;
	console.log(names);
	var artists = await fetch("artists/delete", {
		method : "POST",
		headers:{
			"Content-Type":"application/json"
		},
		body: JSON.stringify({name:names})
	});
}

async function search(){
	await fillPage();
	searchBar = document.getElementById("searchText").value;
	var artistSearch = document.getElementsByClassName("artist");
	var h5 = [];
	for (var i = 0; i < artistSearch.length; i++) {
		h5 = artistSearch[i].getElementsByTagName('h5');
		for (var j = 0; j < h5.length; j++) {
			if(!h5[j].innerText.includes(searchBar)){
				artistList.removeChild(h5[j].parentElement.parentElement);
			}
		}
	}
}

