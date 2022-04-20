 
export const fetchgeneral = (place,stateChange) =>{
    fetch(`http://127.0.0.1:5000/${place}`,{
        'methods':'GET',
        headers : {
          'Content-Type':'application/json'
        }
      })
    .then(response => (response.json()))
    .then(response => {
      var gr = response
      console.log(gr)
     stateChange(() => gr);
    
    })
    .catch(error => console.log(error))   
}

export const isNumbCheck  =(val) => {
    if (val == "" ||!(val)){
      return ""
    }
    else {
      var valnumb = parseInt(val)
      if (isNaN(valnumb)){
        return 0
      }
      else{
        return valnumb
      }
    }
    }

export var dropdownlist = ["Plan to Play", "Dropped", "Playing", "On Hold", "Completed", "Wishlist"]
export const limittyping = (e,bool, int) =>{ 
    if ((bool) 
    && e.key !=="Delete" // keycode for delete
    && e.key !== "Backspace" // keycode for backspace
    ) 
    {
      e.preventDefault();
      e.target.value = int
    }
  }

  export const isBetween =  (x, min, max) => {
    return x >= min && x<=max
  }
  export const classnames = (val) => {

    var mc = {
      '0-59'     : 'red',
      '60-79'    : 'orange',
      '80-99'   : 'green',
      '100-100'     : 'gold'
    }
    var theclass = ""
    $.each(mc,function (numbs,classname){

      var min = parseInt(numbs.split("-")[0],10);
      var max = parseInt(numbs.split("-")[1],10);
      // console.log(classname)
      // console.log(classname)
      var valint = parseInt(val)    
    if (isBetween(valint,min,max)){
      theclass = classname
    }
    }
    )
  return (theclass) 
  }

  export const formcentering = (ElementHeight) => {
    $(function(){
      // $(".form-container").each(function(){
        // var length = $(this).height();
        console.log($(window).height())
        $(".form-container").css('top', ($(window).height()+ $('#notloggedbar').height() - ElementHeight)/2)
      }) 
  }

export const loader = document.querySelector('.loader');

export const showLoader = () => loader.classList.remove('loader--hide');

export const hideLoader = () => loader.classList.add('loader--hide');