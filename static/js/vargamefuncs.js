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

  export const fetchgeneral = (place,propChange) =>{
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
     propChange(() => gr);
    
    })
    .catch(error => console.log(error))   
}