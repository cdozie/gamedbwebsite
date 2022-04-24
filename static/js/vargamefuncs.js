export const isBetween =  (x, min, max) => {
    return x >= min && x<=max
  }

export const colorclassnames = (val) => {

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

