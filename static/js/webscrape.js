'use strict'



import React from 'react';
import ReactDOM from 'react-dom';
import About from './aboutpage';
import LoginForm from './loginform';
import MyList from './mylist';
import Details from './accountdetails';
import Homepage from './homepage';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Switch } from "react-router-dom";
import GamePage from './varinlistgamepage';

import AccountGames from './accountmain';
import Layout from './layout';
import AccountLayout from './accountlayout';
import AccountWishlist from './accountwishlist';
import ChangePassForm from './changepassword';
import RegisterForm from './registerform';
import ForgotPassForm from './forgotpass';
import VerifyForm from './verifyemail';

const AccWishlist = React.lazy(() => import('./accountwishlist'))

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

// import 'bootstrap/dist/css/bootstrap.min.css';

//@ts-check


/*
const scroller = document.querySelector('.scroll-menu');


    

if (scroller) {

}*/

(function () {
    $('.registerinput, .email-verify-form').on('keyup click keydown',function() {
        var empty = false;
        $('.registerinput').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#submitbutton').attr('disabled', 'disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
        } else {
            $('#submitbutton').removeAttr('disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
        }
    });
})();



var root = document.documentElement;
const lists = document.querySelectorAll('.hs'); 

lists.forEach(el => {
  const listItems = el.querySelectorAll('li');
  const n = el.children.length;
  el.style.setProperty('--total', n);
});

var typingTimer;                //timer identifier
var doneTypingInterval = 0;  //time in ms, 5 seconds for example


var names = [];
var slugs = [];
var images = [];

function searchGame() {

    
        var gamesearch = $("#gameSearch, #gameSearch3").val()
        //console.log(gameSearch)
        const api_key = "bbd0f6e116b145bd81a72ee35824f71f"
        var url2 = `https://api.rawg.io/api/games?key=${api_key}&page_size=10&search=${gamesearch}`

        
        axios.get(url2)
            .then(response => {
                const gameresponse = response.data;
                // console.log (gameresponse.results)
                slugs = [] 
                names = []
                images = []
                for(let i =0; i < gameresponse.results.length; i++) {

                    names.push(gameresponse.results[i].name);
                    var gamename = gameresponse.results[i].name;
                    var nameindex = i+1
                    slugs.push(gameresponse.results[i].slug); 
                    images.push(gameresponse.results[i].background_image);
                    var bgimage = gameresponse.results[i].background_image;
                    //console.log(bgimage)
                    var dropdownopts= document.getElementById(`game${i+1}`);
                    var dropdownimages = document.getElementById(`game${i+1}images`)
                    dropdownopts.innerText= `${gamename}`;
                    dropdownimages.src = `${bgimage}`

                
            }

            //console.log (names)
            var searchqueries={
                names:names,
                queries: slugs
            }
            //console.log (searchqueries);
            })
            .catch(error => console.error(error));
    
;

};


$('#gameSearch, #gameSearch3').on('input',function(){
    clearTimeout(typingTimer);
    if ($('#gameSearch, #gameSearch3').val()) {
        typingTimer = setTimeout(searchGame, doneTypingInterval);
    }
});


(function() {
    $('.game-form').on ('keyup click keydown', function() {

        var empty = false;
        $('.game-form').each(function() {
            if ($(this).val() == '' ) {
                empty = true;
            }
        });

        if (empty) {
            $('#game-submit-button').attr('disabled', 'disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
        } 
        //If the dropdown display is not being shown, meaning the user is not searching for a game
        else if ($("#gamedropdown").css('display') == 'none'){
            $('#game-submit-button').removeAttr('disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
        }
        else {
          $('#game-submit-button').attr('disabled', 'disabled')
        }}
    );
})();
var addsubmission
var submissionindex
var submissionslug
var gameid


$('.gamedboptions').on('click', function() {
  //using the game id to get the slug by finding the index of the game in the generated search list and extracting the slug as
  //the slug has the same index number
  gameid=$(this).attr('id') 
  var last = gameid.charAt(gameid.length-1)
  submissionindex = parseInt(last) -1 
  // addsubmission = $('#gameSearch').val()

  

  // localStorage.setItem("addsubmission", addsubmission);
  localStorage.setItem("submissionindex", submissionindex);
  submissionslug = slugs[submissionindex]
  // console.log(alert(slugs))
  localStorage.setItem("submissionslug", submissionslug);
  // console.log(alert(localStorage.getItem("submissionslug")))
  $('#realgameSearch, #realgameSearch3').val(localStorage.getItem("submissionslug"))

//Name
$('#gameSearch').on('input', function(){
  $('#realgameSearch').val($('#gameSearch').val())

})
$('#gameSearch3').on('input', function(){
  $('#realgameSearch3').val($('#gameSearch3').val())

})

})

// $(".rand-name-forms").on('click', function () {
//   //In the random list on the index, using the id of the games to determine what for (each element is a form)
//   //gets submitted to the backend
//   var randgameid = $(this).attr("id")
//   var last = randgameid.charAt(randgameid.length-1)
//   var randgameidnumb = parseInt(last) 
//   $(`#rand-game-list-form${randgameidnumb}`).trigger("submit")
// } )


function between(x, min, max) {
  return x >= min && x <= max;
}
$(function(){
  
    var mc = {
      '0-59'     : 'red',
      '60-79'    : 'orange',
      '80-99'   : 'green',
      '100-100'     : 'gold'
    };

    var dc;
    var first; 
    var second;
    var th;
    
    $('.account-mcr,.accountranks').each(function(index){
      
      th = $(this);
      
      dc = parseInt($(this).attr('data-color'),10);
      
      
        $.each(mc, function(name, value){
          
          //Getting The Range For The Certain Color To Add For A Rating
          first = parseInt(name.split('-')[0],10);
          second = parseInt(name.split('-')[1],10);
          
          // console.log(between(dc, first, second));
          
          //If in range of the numbers, adds that class to apply color to the padding around the ratings or the fonts of them.
          if( between(dc, first, second) ){
            th.addClass(value);
            // console.log(value)
            // $('.rating-border').css({'border-color': name})
          }
  
      
      
        });
      
    });

  });

$('img').map(function(){
    // console.log(this.src)
    $(this).attr('onerror',"this.onerror=null;this.src='https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';")
  
    if($(this).attr('src') == "None"){
        $(this).attr('src',"https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg")
    }
});

$(function(){
  $('a').each(function() {
    if ($(this).prop('href') == window.location.href) {
      $(this).addClass('current');
    }
  });
});


function isEmpty(str) {
    return !str.trim().length;
}
var classundefined = 1
// var firstclass
// var editbutton
// var editform




  //console.log($('.editgamelistoptions'))
  //Custom Search Bar With JavaScript to allow for customization that is not in datalist.
  $( "#add-form" ).on('submit', function() {
    var gamechoice = $("#gameSearch3" ).val();
    var gameindex = names.indexOf(gamechoice);
    
    $("#gameSearch3").html(`${slugs[gameindex]}`);
    console.log(slugs[gameindex]);
  
    return true;
  });
  

  var currentFocus = -1;
  $('#gameSearch3').on('keydown',function(e) {
    if(e.key === 'ArrowDown'){
      currentFocus++
     addActive($('.editgamelistoptions, .gamedboptions'));
    }
    else if(e.key === 'ArrowUp'){
      currentFocus--
     addActive($('.editgamelistoptions , .gamedboptions'));
    }
    else if(e.key === 'Enter'){
      e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (gamedropdown.options) gamedropdown.options[currentFocus].click();
          }
    }
  })
  
  function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
      }
    };

    
    var scrollcheck = 1
    $(window).on('scroll',function() {
     if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
         scrollcheck++
         $(`.tablesection${scrollcheck}`).css('display','inline');
         $(`.actualtablesection${scrollcheck}`).css('display','table-row-group');
         
     }})
    //  var listscrollcheck = 1
    //  $('.hs').on('scroll',function(){
    //    if ($(window).scrollLeft()*2+ $(window).width() > $(document).width()-100){
    //      listscrollcheck++
    //     $(`.listrowsection${listscrollcheck}`).css('display','flex');

    //    }
    //  })
    var presearch
    var redirectsubmissionslug
     $('.var-add-button').on('click', function(){
      presearch = String($('.var-add-button').attr('id'))
      redirectsubmissionslug = String ($('.var-slug-game').attr('id'))
      localStorage.setItem("presearchgame", presearch);
      localStorage.setItem("redirectsubmissionslug", redirectsubmissionslug);
      window.location.href='/addlist#varredirect';



    //  })
    });

$(function () {
  if (window.location.hash) {
    presearch = localStorage.getItem("presearchgame");
    // console.log(alert(presearch))
    // console.log(presearch)
  $('#gameSearch').val(presearch)
  
  $('#realgameSearch').val(localStorage.getItem("redirectsubmissionslug"))

}
})

// $("#add-form").on("submit", function() {
//   // localStorage.clear()
// });




const aboutreact = document.getElementById('test-react-component');
if (aboutreact){
  ReactDOM.render(<About />, aboutreact)
};


const rloginform = document.getElementById('react-login-form');
if (rloginform){
  ReactDOM.render(
    <LoginForm />,
    rloginform
  )
};

// const mylistid = document.getElementById('list-page');
// if (mylistid){
//   ReactDOM.render(
//     <MyList />,
//     mylistid
//   )
// }

// const acctdetails  = document.getElementById('react-account-details');
// if (acctdetails){
//   ReactDOM.render(
//     <Details />,
//     acctdetails
//   )
// }


// const homebartrue = document.getElementById('home-bar-true');
// if (homebartrue){
//   ReactDOM.render(
//     <LinkBar loggedin  = {true}/>,
//     homebartrue
// )
// }
// const homebarfalse = document.getElementById('home-bar-false');
// if (homebarfalse){
//   ReactDOM.render(
//     <LinkBar loggedin  = {false}/>,
//     homebarfalse
//     )

// }

// const searchbarid = document.getElementById('search-bar');
// if (searchbarid){
//   ReactDOM.render(
//     <SearchBar />,
//     searchbarid
// )
// }
// const accountid = document.getElementById('account-main-react')
// if (accountid){
//   ReactDOM.render(
//     <AccountGames />,
//     accountid
// )
// }
debugger;
const rootElement = document.getElementById("react-hmpg");

if (rootElement){
ReactDOM.render(
  <BrowserRouter>
  {/* <Header />  */}
    <Routes>


      <Route path="/" element={<Layout child = {<Homepage />} Logged = {true} />} />
      <Route path="game/:game" element={<Layout child = {<GamePage />} Logged = {true}/>} />
      <Route path ="aboutsite" element = {<Layout child = {<About />} Logged = {true}/>} />
      <Route path = "mylist" element = {<Layout child = {<MyList />} Logged = {true}/>} /> 
      
      <Route path ="account" element ={<AccountLayout child = {<AccountGames />}/>}/>
      <Route path = "account/wishlist" element ={<AccountLayout child = {<AccountWishlist />} />}/>
      <Route path = "account/changepassword" element ={<AccountLayout child = {<ChangePassForm />} />}/>
      <Route path = "account/details" element ={<AccountLayout child = {<Details />} />}/>
      {/* <Route path = "account/wishlist" element = {() => <AccountLayout child = {<AccWishlist />} />} /> */}

    </Routes>
  </BrowserRouter>,

  rootElement
)
};

const loginElement = document.getElementById("login-pg")
if (loginElement){
  ReactDOM.render(
  <Layout child = {<LoginForm />} Logged = {false} />
 ,loginElement

  )
}
const registerElement = document.getElementById("register-form")

if (registerElement){
  ReactDOM.render(
  <Layout child = {<RegisterForm />} Logged = {false} />
 ,registerElement

  )
}
const verifyElement = document.getElementById("verify-form")
if (verifyElement){
  ReactDOM.render(
  <Layout child = {<VerifyForm/>} Logged = {false} />
 ,verifyElement

  )
}
const forgotpassElement = document.getElementById("forgot-pass-form")
if (forgotpassElement){
  ReactDOM.render(
  <Layout child = {<ForgotPassForm/>} Logged = {false} />
 ,forgotpassElement

  )
}

$(function(){
  $(".form-container").each(function(){
    var length = $(this).height();
    $(this).css('top', ($(window).height() - length)/2)
  })
}

)
