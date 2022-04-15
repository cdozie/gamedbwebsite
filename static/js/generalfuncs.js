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