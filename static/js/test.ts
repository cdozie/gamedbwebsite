//const { default: axios } = require("axios");
import axios from 'axios'

const api_key = "bbd0f6e116b145bd81a72ee35824f71f"
const gamesearch ="persona 4"



var url2 = `https://api.rawg.io/api/games?key=${api_key}&page_size=10&search=${gamesearch}`
var names = [];
var slugs = [];

axios.get(url2)
    .then(response => {
        const gameresponse = response.data;
        //console.log (gameresponse.results.length)
        for(let i =0; i < gameresponse.results.length; i++) {
            names.push(gameresponse.results[i].name)
            slugs.push(gameresponse.results[i].slug)
        
            
        
    }
    var searchqueries={
        names:names,
        queries: slugs
    }
    
    console.log (searchqueries);
    })
    .catch(error => console.error(error));



    /*const switcher = document.querySelector('.btn'); 


//const theme = 'Light-Theme'
//localStorage.setItem('theme', 'Main-Theme')
$(function() {
    loadTheme();
    buttonWords();
});
function loadTheme(){
  document.body.className = localStorage.getItem('theme')
}

function buttonWords () {
    if (document.body.className == 'Light-Theme') {
        switcher.textContent = "DT"
    }
    else {
        switcher.textContent = "LT"
    }
}

if (switcher){
    switcher.addEventListener('click', function() {
        if (document.body.classList.contains ('Main-Theme')) {
            document.body.classList.remove('Main-Theme')
            document.body.classList.add('Light-Theme')
            localStorage.removeItem('theme')
            localStorage.setItem('theme', 'Light-Theme')
        }
        else if (document.body.classList.contains ('Light-Theme')) {
            document.body.classList.remove('Light-Theme')
            document.body.classList.add('Main-Theme')
            localStorage.removeItem('theme')
            localStorage.setItem('theme', 'Main-Theme')
        }
        else {
            document.body.classList.add('Main-Theme')
        }
            
        var className = document.body.className;
         Changing text of button based on the current class being displayed 
        if(className == "Light-Theme") {
            this.textContent = "DT";
        }
        else {
            this.textContent = "LT";
        }
        console.log('current class name: ' + className);
    });
    
}*/


/*
$(function(){
    const api_key = "bbd0f6e116b145bd81a72ee35824f71f"
    var gamesearch2 = ""
    var pagenumber = Math.ceil( Math.random() * 100 )
    console.log(pagenumber)
    var url3 = `https://api.rawg.io/api/games?key=${api_key}&page=${pagenumber}&page_size=40&search=${gamesearch2}`
    globalThis.backgroundimagelist = []
    axios.get(url3)
    .then(response2 => {
        const gameresponse = response2.data;
        //console.log (gameresponse.results.length)
        for(let i =0; i < gameresponse.results.length; i++) {
            backgroundimagelist.push(gameresponse.results[i].background_image);
        
        
        
    }
    var randnumb = Math.ceil( Math.random() * backgroundimagelist.length )
    console.log(backgroundimagelist[randnumb])
    $('html').css({'background': `url(${backgroundimagelist[randnumb]})`});



    //console.log (searchqueries);
    })
    .catch(error => console.error(error))});*/


    
        
        /*var validValues = names;
        $("#gameSearch").on("input click mouseover keydown mouseout keypress", function() {
            globalThis.validValueSelected = validValues.some(x => x == $('#gameSearch').val());
        });
        gamedropdown.onclick= function() {
            globalThis.validValueSelected = validValues.some(x => x == $('#gameSearch').val());
        };*/