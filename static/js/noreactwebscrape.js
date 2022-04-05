'use strict'

//@ts-check

function myFunc(vars) {
    return vars
}
/*
const scroller = document.querySelector('.scroll-menu');


    

if (scroller) {

}*/

(function () {
    $('.registerinput, .login-form, .email-verify-form').on('keyup click keydown',function() {

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

globalThis.names = [];
globalThis.slugs = [];
globalThis.images = [];


function searchGame() {
    
        var gamesearch = $("#gameSearch, #gameSearch3").val()
        //console.log(gameSearch)
        const api_key = "bbd0f6e116b145bd81a72ee35824f71f"
        var url2 = `https://api.rawg.io/api/games?key=${api_key}&page_size=10&search=${gamesearch}`

        
        axios.get(url2)
            .then(response => {
                const gameresponse = response.data;
                //console.log (gameresponse.results.length)
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
        } else {
          if  ($("#gamedropdown").css('display') == 'none'){
            $('#game-submit-button').removeAttr('disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
        }
        else {
          $('#game-submit-button').attr('disabled', 'disabled')
        }}
    });
})();
var addsubmission
var submissionindex
var submissionslug
var gameid


$('.gamedboptions').on('click', function() {
  gameid=$(this).attr('id') //using the game id to get the slug by finding the index of the game and extracting the slug
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

$('#gameSearch').on('input', function(){
  $('#realgameSearch').val($('#gameSearch').val())

})
$('#gameSearch3').on('input', function(){
  $('#realgameSearch3').val($('#gameSearch3').val())

})

  // // addsubmission = localStorage.getItem("addsubmission")
  // if (names.includes(addsubmission)){
  //   // submissionindex = slugs.indexOf(addsubmission)
  //   submissionslug = slugs[submissionindex]
  //   localStorage.setItem("submissionslug", submissionslug);
  //   // console.log(alert(localStorage.getItem("submissionslug")))
  //   $('gameSearch').val(localStorage.getItem("submissionslug"))

  // }
})

$(".rand-name-forms").on('click', function () {
  var randgameid = $(this).attr("id")
  var last = randgameid.charAt(randgameid.length-1)
  var randgameidnumb = parseInt(last) 

  $(`#rand-game-list-form${randgameidnumb}`).trigger("submit")
} )
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
    
    $('.rankings,.rankings2,.account-mcr,.tablerating,.accountranks, .vargamerankings, .varpersonalrankings').each(function(index){
      
      th = $(this);
      
      dc = parseInt($(this).attr('data-color'),10);
      
      
        $.each(mc, function(name, value){
          
          
          first = parseInt(name.split('-')[0],10);
          second = parseInt(name.split('-')[1],10);
          
          // console.log(between(dc, first, second));
          
          if( between(dc, first, second) ){
            th.addClass(value);
            // console.log(value)
            // $('.rating-border').css({'border-color': name})
          }
  
      
      
        });
      
    });

  });

$(function() {


  var mc = {
    '0-59'     : 'Poor',
    '60-79'    : 'Decent',
    '80-89'   : 'Amazing',
    '90-99'   : 'Universally Acclaimed',
    '100-100'     : 'Perfection'
  };
  var cmc = {
    '0-59'     : 'red',
    '60-79'    : 'orange',
    '80-99'   : 'green',
    '100-100'     : 'gold'
  };

  var description = $('.onlinerankdescription')
  var classcolors = ["red","orange", "green"]
  var dattr = parseInt(description.attr('data-color'),10)

  $.each(mc, function(name, descriptext){
          
          
    var first = parseInt(name.split('-')[0],10);
    var second = parseInt(name.split('-')[1],10);
    
    // console.log(between(dc, first, second));
    
    if( between(dattr, first, second) ){
      description.text(descriptext)

      // console.log(value)
      // $('.rating-border').css({'border-color': name})
    }
    // else{
    //   description.text("Not Reviewed")
    // }

  })
  $.each(cmc, function (name, color){
    var first = parseInt(name.split('-')[0],10);
    var second = parseInt(name.split('-')[1],10);

    if ( between(dattr, first, second) ){
      
      description.addClass(color)
  }
})
})
$('img').map(function(){
    // console.log(this.src)
    $(this).attr('onerror',"this.onerror=null;this.src='https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';")
  
    if($(this).attr('src') == "None"){
        $(this).attr('src',"https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg")
    }
});


function isEmpty(str) {
    return !str.trim().length;
}
var classundefined = 1
// var firstclass
// var editbutton
// var editform
$(function () {
  if ($(".var-page-container").attr('id') == "yes") {
  $('.var-personal-rating-data, .var-status-data, .var-hours-played-data').on('click', function(){
    var th = $(this)
    var formerdata = $(this).text()
    var modiefiedlements = $('.modifying')
    var gradientclass = "gradientcolorpinkwhite"
    globalThis.firstclass = th.attr('class').split(' ')[0]
    console.log(firstclass)
    globalThis.editbutton = $(".var-edit-button")
    globalThis.editform = $('#var-edit-form')
    
    $(".var-edit-button").css("display","block")
    if(modiefiedlements.length == 0 && firstclass == "var-personal-rating-data"){
      th.html('<input type = "number" class = "mx-auto w-auto change" id=  "var-personal-rating-change"  name = "rating"  min = "0" max = "100">')
      th.removeClass("varpersonalrankings")
      th.addClass('modifying')
      $('.modifying > #var-personal-rating-change').val(formerdata)
      globalThis.varclass = th.attr ('class')
    }
    else if (modiefiedlements.length == 0 && firstclass == "var-status-data"){
      th.html('<select name="status" id = "var-edit-status" autocomplete="off"  class = "form-select form-control mx-auto w-100 game-form game-highlight "  placeholder = "Choose Status:" required> ' + 
      '<option disable selected value>Choose Status:</option>'
      +'<option>Plan to Play</option>'
      +'<option>Dropped</option>'
      +'<option>Playing</option>'
      +'<option>On Hold</option>'
      +'<option>Completed</option>'
      + '<option>Wishlist</option>'
  +'</select>')
  // Removing Classes With Background Overlays For Colors
  th.removeClass(gradientclass)

  th.addClass('modifying')
  $('.modifying > #var-edit-status').val(formerdata)

  globalThis.varclass = th.attr ('class')
  } 
  else if (modiefiedlements.length == 0 && firstclass == "var-hours-played-data"){
    th.html('<input type = "number" class = "mx-auto w-100" name = "hoursplayed" id = "var-edit-hours-played" " min="0">')
    th.removeClass(gradientclass)

    th.addClass('modifying')
    $('.modifying> #var-edit-hours-played').val(formerdata)

    globalThis.varclass = th.attr ('class')
  }
   
  })
  $(".var-edit-button").on("click", function() {
    if (firstclass = "var-personal-rating-data"){
      let input = $('.modifying').val()

      if (input==="" || !isNaN(input)){
        $('#var-edit-form').trigger("submit")
        $(".modifying").html("_")
        $(".modifying").removeClass("modifying")

      }
      else {
        $(".modifying").html("_")
        $(".modifying").removeClass("modifying")
      }
    }
    else {
      $('#var-edit-form').trigger("submit")
      $(".modifying").html("_")
      $(".modifying").removeClass("modifying")

    }
  })

  }
})
$(function(){
//  $('.personalratingchange').on('click',function(){
//     $(this).trigger('focus')
//  })
$('.table-personal-rating, .table-hours-played, .table-status').on('click', function(){
     var formerrating = $(this).text()
    var modifyingelements = document.getElementsByClassName('modifying')
    classundefined = 0
    console.log($(this).attr('class'))
     if(modifyingelements.length == 0 && $(this).attr('class') =="table-personal-rating"){
        $(this).html('<input type = "number" class = "mx-auto w-auto blah " id=  "personalratingchange"  name = "rating"  min = "0" max = "100">')
        $(this).addClass('modifying')
        globalThis.classname = $(this).attr('class')
        
        $('.modifying > #personalratingchange').val(formerrating)
         globalThis.editgamename = ($(this).closest( "tr" ).find('.editgamenames').text())
         console.log(editgamename)
     }

     if(modifyingelements.length == 0 && $(this).attr('class') =="table-status"){
        $(this).html('<select name="status" id = "edit-select-status" autocomplete="off"  class = "form-select form-control mx-auto w-100 game-form game-highlight "  placeholder = "Choose Status:" required> ' + 
        '<option disable selected value>Choose Status:</option>'
        +'<option>Plan to Play</option>'
        +'<option>Dropped</option>'
        +'<option>Playing</option>'
        +'<option>On Hold</option>'
        +'<option>Completed</option>'
        + '<option>Wishlist</option>'
    +'</select>')
        $(this).addClass('modifying')
        globalThis.classname = $(this).attr('class')
        //var conceptName = $('#aioConceptName').find(":selected").text();
        $('.modifying > #edit-select-status').val(formerrating)
         globalThis.editgamename = ($(this).closest( "tr" ).find('.editgamenames').text())
         console.log(editgamename)
     }

     if(modifyingelements.length == 0 && $(this).attr('class') =="table-hours-played"){
        $(this).html('<input type = "number" class = "form-control mx-auto w-100 game-highlight" name = "hoursplayed" id = "hoursplayed" " min="0">')
        $(this).addClass('modifying')
        globalThis.classname = $(this).attr('class')
        $('.modifying > #hoursplayed').val(formerrating)
         globalThis.editgamename = ($(this).closest( "tr" ).find('.editgamenames').text())
         console.log(editgamename)
     }
     
     
     //$('.table-personal-rating').off("click")
     //$(this).val(formerrating);
     const ratingchange = $(this).val()
     console.log(ratingchange)
    })
$(document).on ('dblclick', function(e){

    // var container = $(".modifying>");
    // if (!$(e.target).closest(container).length) {
        if (classundefined == 1) {
            e.stopPropagation();
        
    }
    if (classundefined == 0){// if (classname) { }
    if (classname == "table-personal-rating modifying"){

    //$("#url-displayname").html($(this).val())
     $('#personalratingchange').trigger('blur');
     var personalratingchange = $('#personalratingchange').val()
     $('.game-name-submit').val(editgamename)

            var inputranking = $('.modifying > #personalratingchange').val()
            if (inputranking==="") {
                $("#edit-form").trigger('submit')
                $(".modifying").html("_")
                $('.game-name-submit').val(editgamename)
                
            }
            else if (!isNaN(inputranking)){

                
                $("#edit-form").trigger('submit')
                $(".modifying").html(inputranking)
                $('.game-name-submit').val(editgamename)
                
            }
            
            else{
                
                $(".modifying").html("_")
            }
            //$("#edit-form").trigger('submit')
            $('.table-personal-rating').removeClass("modifying")

        }
        if (classname == "table-hours-played modifying"){

            $('.game-name-submit').val(editgamename)

                   var inputplayed = $('.modifying > #hoursplayed').val()
                   if (inputplayed==="") {
                       $("#edit-form").trigger('submit')
                       $(".modifying").html("_")
                       $('.game-name-submit').val(editgamename)
                       
                   }
                   else if (!isNaN(inputplayed)){
       
                       
                       $("#edit-form").trigger('submit')
                       $(".modifying").html(inputplayed)
                       $('.game-name-submit').val(editgamename)
                       
                   }
                   
                   else{
                       
                       $(".modifying").html("_")
                   }
                   //$("#edit-form").trigger('submit')
                   $('.table-hours-played').removeClass("modifying")
        }
        if (classname == "table-status modifying"){

            $('.game-name-submit').val(editgamename)

                   var inputstatus = $('.modifying > #edit-select-status').find(":selected").text();
                   if (inputstatus==="") {
                       $(".modifying").html("_")
                       $('.game-name-submit').val(editgamename)
                       
                   }
                   else if (isNaN(inputstatus)){
       
                       
                       $("#edit-form").trigger('submit')
                       $(".modifying").html(inputstatus)
                       $('.game-name-submit').val(editgamename)
                       
                   }
                   
                   else{
                       
                       $(".modifying").html("_")
                   }
                   //$("#edit-form").trigger('submit')
                   $('.table-hours-played').removeClass("modifying")
        }
    }
        // }
       // })
    // })

})


});

// let db = new sqlite3.Database('C:/sqlite/gamestorage.db')
// db.run(`UPDATE gamestorage SET personalrating = ? where id = ? AND game = ?`,$(this).text()

  //console.log($('.editgamelistoptions'))
  $( "#add-form" ).on('submit', function() {
    var gamechoice = $("#gameSearch2, #gameSearch , #gameSearch3" ).val();
    var gameindex = names.indexOf(gamechoice);
    
    $("#gameSearch2, #gameSearch, #gameSearch3").html(`${slugs[gameindex]}`);
    console.log(slugs[gameindex]);
  
    return true;
  });
  
  $('#gameSearch2, #gameSearch, #gameSearch3').on('keypress',function () {
    $("#gamedropdown").css("display","block");
    $("#gameSearch2, #gameSearch, #gameSearch3").css("borderRadius","5px 5px 0 0");  
  });
  $('.editgamelistoptions, .gamedboptions').each(function(){
    $(this).on('click',function () {
      $('#gameSearch2 , #gameSearch, #gameSearch3').val($(this).val());
      $('#headingsearch').trigger("submit");
      $("#gamedropdown").css("display",'none');
      $("#gameSearch2, #gameSearch, #gameSearch3").css("borderRadius","5px");  
    }
)});

  $('#gameSearch2, #gameSearch, #gameSearch3').on('input',function() {
    currentFocus = -1;
    var text = $(this).val().toUpperCase()
    console.log(text);
    $('.editgamelistoptions').each(function(){
      
      if($(this).text().toUpperCase().indexOf(text) > -1){
        $(this).css('display', 'block');
    }else{
      $(this).css('display', 'none');
      }
    });
    $('.gamedboptions').each(function(){
           
      if($(this).text().toUpperCase().indexOf(text) > -3){
        $(this).css('display', 'block');
    }else{
      $(this).css('display', 'none');
      }
    });
  })
  var currentFocus = -1;
  $('#gameSearch2, #gameSearch, #gameSearch3').on('keydown',function(e) {
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

$("#add-form").on("submit", function() {
  // localStorage.clear()
});

