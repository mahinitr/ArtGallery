ARTISTS_DIV_ID = "artistBox"
GENRE_BOX_ID = "genreBox"
ARTISTS_TABLE_ID = "artistsTable"
ARTISTS_TABLE_CAPTION = "Paintings"
ARTISTS_FILE_NAME = "artists.json"
IMG_DIR = "images/"
ARTISTS_JSON_URL = "https://api.myjson.com/bins/7kktz"
FILE = "file:///C:/Users/netskope/Downloads/Sourab_FIles/artists.json"

var artists = null;
var genres = new Array();
genres.push("Genre");
genres.push("Futurism");
var heading = new Array();
heading[0] = ""
heading[1] = "Image"
heading[2] = "Title"
heading[3] = "Artist"
heading[4] = "Year"
heading[5] = "Genre"

function removeTable(div_name){
    var myTableDiv = document.getElementById(div_name)
}

function addTable(div_name, caption_name, heading, data) {
    var myTableDiv = document.getElementById(div_name)
    var table = document.createElement('TABLE')
    table.setAttribute("id",ARTISTS_TABLE_ID)
    var tableBody = document.createElement('TBODY')
    table.createCaption().innerHTML = caption_name
    table.appendChild(tableBody);

    //TABLE COLUMNS
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (i = 0; i < heading.length; i++) {
        var th = document.createElement('TH')
        th.width = '100';
        th.appendChild(document.createTextNode(heading[i]));
        tr.appendChild(th);
    }

    //TABLE ROWS
    for (i = 0; i < data.length; i++) {
        var tr = document.createElement('TR');
        for (j = 0; j < data[i].length; j++) {
            var td = document.createElement('TD');
            if(j == 0){
                var checkbox = document.createElement('INPUT');
                checkbox.type = "checkbox";
                td.appendChild(checkbox);
            }
            else if(j == 1){
                var img  = document.createElement('IMG')
                img.src = data[i][j];
                td.appendChild(img);
            }else{
                td.appendChild(document.createTextNode(data[i][j]));
            }
            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }
    current_tables = myTableDiv.childNodes;
    if(current_tables.length > 0){
        myTableDiv.replaceChild(table, current_tables[0]);
    }else{
        myTableDiv.appendChild(table);
    }
}

function populateGerneBox(){
    var sel = document.getElementById(GENRE_BOX_ID);
    var fragment = document.createDocumentFragment();

    genres.forEach(function(genre, index) {
        var opt = document.createElement('option');
        opt.innerHTML = genre;
        opt.value = genre;
        fragment.appendChild(opt);
    });

    sel.appendChild(fragment);     
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', ARTISTS_JSON_URL, true);
    var myTableDiv = document.getElementById(ARTISTS_DIV_ID);
    myTableDiv.innerHTML = "<p><b>Loading.......</b></p>"
    xobj.onreadystatechange = function() {
        myTableDiv.innerHTML = ""
        if (xobj.readyState === 4 && ( xobj.status === 200 || xobj.status === 0 ) ) {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

function addArtistsTable(){
    loadJSON(function(response) {
        try{
            var json_data = JSON.parse(response);
        }catch(e){
            alert("Error: " + e);
        }
        artists = json_data["artists"];  
        
        var data = new Array()
        for(i=0; i < artists.length; i++){
            title = artists[i].Title;
            artist = artists[i].Artist;
            year = artists[i].Year;
            genre = artists[i].Genre;
            if(genres.indexOf(genre) == -1){
                genres.push(genre.trim());
            }
            image_name = IMG_DIR + title.split(" ").join("_") + ".jpg";
            data[i] = new Array("", image_name, title, artist, year, genre);
        }                        
        addTable(ARTISTS_DIV_ID, ARTISTS_TABLE_CAPTION, heading, data);
        populateGerneBox();
    });
}

function filterGenre(){
    var msgBox = document.getElementById("message");
    msgBox.innerHTML = "";
    var sel = document.getElementById(GENRE_BOX_ID);
    var selGenre= sel.options[sel.selectedIndex].text;    
    var data = new Array()
    for(i=0, j=0; i < artists.length; i++){
        title = artists[i].Title;
        artist = artists[i].Artist;
        year = artists[i].Year;
        genre = artists[i].Genre;
        image_name = IMG_DIR + title.split(" ").join("_") + ".jpg";
        if(selGenre == "Genre" || selGenre == genre){
            data[j] = new Array("", image_name, title, artist, year, genre);
            j++;
        }
    }
    if(data.length == 0){
        msgBox.innerHTML = "No records found for Genre '" + selGenre + "'";
    }
    addTable(ARTISTS_DIV_ID, ARTISTS_TABLE_CAPTION, heading, data);   
    //searchTitle();
}

function searchTitle(){
    var msgBox = document.getElementById("message");
    msgBox.innerHTML = "";
    var txtSearch = document.getElementById("txtSearch")
    var searchTitle = txtSearch.value;
    if(searchTitle === null || searchTitle.trim() === ""){        
        return;
    }
    searchTitle = searchTitle.toLowerCase().trim();
    var artistsTable = document.getElementById(ARTISTS_TABLE_ID);
    var i = 1;
    var found = 0;
    while(row = artistsTable.rows[i]){
        cell_data = row.cells[2].innerText.toLowerCase();
        if(cell_data === searchTitle){
            row.style.backgroundColor = "yellow";
            found++;
        }
        else{
            row.style.backgroundColor = "white";
        }
        i++;
    }
    if(found == 0){
        msgBox.innerHTML = "No records for Title '" + searchTitle + "'";
    }
}

