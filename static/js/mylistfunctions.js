export const listfetch = (setGameOptions,sortfunction = "None") => {
    var gamelistdict = []

    fetch('http://127.0.0.1:5000/mylistfeeder',{
      'methods':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
  .then(response => (response.json()))
  .then(response => {
    var gr = response
    console.log(gr);
    var vargamedict = {Names: gr.name, BGimgs: gr.backgroundimages, GHP: gr.hoursplayed, GOR: gr.onlinerating, GPR: gr.personalrating, GRD: gr.releasedate,GST: gr.status, GWB: gr.website}
    for(let i = 0; i< (gr.name).length; i++){
      gamelistdict.push({Number: [i],Name: gr.name[i], BGimg: gr.backgroundimages[i], GHP: gr.hoursplayed[i], GOR: gr.onlinerating[i], GPR: gr.personalrating[i], GRD: gr.releasedate[i],GST: gr.status[i], GWB: gr.website[i]})
    }

    if (sortfunction !== "None" ){
        gamelistdict.sort(sortfunction)
    } 
    // console.log(gamelistdict.map(x=> x))
  //  setGameDict(()=> vargamedict)
   setGameOptions(() => gamelistdict)
//    console.log(GameOptions);
   console.log("hello");
   console.log("rerendering");

  })
  .catch(error => console.log(error))
  }



  export const listfetchdictlist = (setGameOptions,sortfunction = "None") => {
    var gamelistdict = []

    fetch('http://127.0.0.1:5000/mylistfeeder',{
      'methods':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
  .then(response => (response.json()))
  .then(response => {
    var gr = response
    console.log(gr);
    // var vargamedict = {Names: gr.name, BGimgs: gr.backgroundimages, GHP: gr.hoursplayed, GOR: gr.onlinerating, GPR: gr.personalrating, GRD: gr.releasedate,GST: gr.status, GWB: gr.website}
    // for(let i = 0; i< (gr.name).length; i++){
    //   gamelistdict.push({Number: [i],Name: gr.name[i], BGimg: gr.backgroundimages[i], GHP: gr.hoursplayed[i], GOR: gr.onlinerating[i], GPR: gr.personalrating[i], GRD: gr.releasedate[i],GST: gr.status[i], GWB: gr.website[i]})
    // }

    // if (sortfunction !== "None" ){
    //     gamelistdict.sort(sortfunction)
    // } 
    // console.log(gamelistdict.map(x=> x))
  //  setGameDict(()=> vargamedict)
   setGameOptions(() => gr)
//    console.log(GameOptions);
   console.log("hello");
   console.log("rerendering");

  })
  .catch(error => console.log(error))
  }

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


export const limittypingmax =(e,bool,func) => {
if ((bool)
&& e.key !=="Delete" // keycode for delete
&& e.key !== "Backspace" // keycode for backspace
){
func(()=> isNumbCheck(e.target.value) )
}
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


export const isBetween =  (x, min, max) => {
    return x >= min && x<=max
  }


  export const displayerror = (min, max, min2, max2, name, message,seterrorMessages) => {
    var existencebool = (min && max) || (min2 && max2)
    var comparebool = (min > max) || (min2>max2)
    if (existencebool){
      if ((comparebool)   && errorMessages.message != message){
        seterrorMessages(() => ({name: name, message : message}))
      }  
      else if (!(comparebool) && errorMessages.message != ""){
        seterrorMessages(() => ({name: name, message : ""}))
    }}
    else if (!(existencebool) && errorMessages.message != ""){
      seterrorMessages(() => ({name: name, message : ""}))

    }
  }


  export const tableclassnames = (val) => {

    var mc = {
      '0-59'     : 'nobgred',
      '60-79'    : 'nobgorange',
      '80-99'   : 'nobggreen',
      '100-100'     : 'nobggold'
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