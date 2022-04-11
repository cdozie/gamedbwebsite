import React, { useState, useLayoutEffect }  from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function FilterForm(props)  {
    
  const [invalidData, setinvalidData] = useState(true);

    const maxvalerr = "Minimum Values Cannot Be Greater Than Max Values"
    // const prmaxvalerr = "Personal Min Value Cannot Be Greater Than Max Value"

    // const errmsgbool = (metaminval && metamaxval) || (perminval && permaxval)
    
    const displayerror = (min, max, min2, max2, name, message) => {
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
    const[metaminval, setmetaminval] = useState(0);
    const[metamaxval, setmetamaxval] = useState(100);
    const[perminval, setperminval] = useState(0);
    const[permaxval, setpermaxval] = useState(100);


    // const[metavalid, setMetaValid] = useState(true);
    // const[pervalid, setPerValid] = useState(true);
    const[boolsubmit, setboolsubmit] = useState(1);



    const[errorMessages, seterrorMessages] = useState({})
   
    const rendererrormessages = (name) =>  name ===errorMessages.name && (
      <div className='filtererrors'>{errorMessages.message}</div>
    )

    const limittyping = (e,bool, int) =>{ 
     if ((bool) 
      && e.key !=="Delete" // keycode for delete
      && e.key !== "Backspace" // keycode for backspace
     ) 
     {
        e.preventDefault();
        e.target.value = int
      }
}


const limittypingmax =(e,bool,func) => {
  if ((bool)
  && e.key !=="Delete" // keycode for delete
  && e.key !== "Backspace" // keycode for backspace
 ){
  func(()=> isNumbCheck(e.target.value) )
 }
}

const isNumbCheck  =(val) => {
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

    useLayoutEffect(() => {
        setinvalidData(() => !(metaminval || metamaxval || perminval || permaxval));
        displayerror(metaminval,metamaxval, perminval, permaxval,"metanv", maxvalerr);
        console.log("form")
        // displayerror(perminval,permaxval,pervalid,"pranv", prmaxvalerr)
    }
  )


  const preventval = (e) => {
    limittyping(e, e.target.value>100, 100)
    limittyping(e, e.target.value <0, 0)
  }
;


  const updatemax = (e,val, func) => {
    limittypingmax(e,isNumbCheck(e.target.value) > val,func)
  }
  const updatemin = (e, val, func) => {
    limittypingmax(e,isNumbCheck(e.target.value) < val, func)
  }

    const onMetaMinChange = (event) => setmetaminval(() => isNumbCheck(event.target.value));
    const onMetaMaxChange = (event) => setmetamaxval(() => isNumbCheck(event.target.value));
    const onPerMinChange = (event) => setperminval(() => isNumbCheck(event.target.value));
    const onPerMaxChange = (event) => setpermaxval(() => isNumbCheck(event.target.value));


    const submithandling = (e) => {
      e.preventDefault()
      $.ajax({
        type:'POST',
        url:'/mylistfeeder',
        data:{
          fmetamin : metaminval,
          fmetamax: metamaxval,
          fpermin: perminval,
          fpermax: permaxval,
        },
        success:function()
        {
          
          setboolsubmit(()=>boolsubmit + 1)
          // console.log(boolsubmit)
        }
      })
    };
    

    const sendChange = () => {
      if (props.onChange) {
        props.onChange(true)
      }
    }
    return (

<Form action="/filterlist" method="post" onSubmit={submithandling} >
   
  <Form.Group className="" controlId="fminsmaxes">
    <Row>
      <Col>
        <Form.Label>Metacritic Min</Form.Label>
        <Form.Control type="number" min ="0" max = "100" value = {metaminval} placeholder="Metacritic Min:"  name = "fmetamin" className='w-auto mx-auto' 
        onChange={e => {preventval(e); updatemax(e,metamaxval,setmetamaxval);  ;onMetaMinChange(e)}  }/>
      </Col>
    
      <Col>
        <Form.Label>Metacritic Max</Form.Label>
        <Form.Control type="number" min = "0" max = "100" value = {metamaxval} placeholder="Metacritic Max" name = "fmetamax" className='w-auto mx-auto' 
        onChange={e => { preventval(e); updatemin(e,metaminval,setmetaminval);  onMetaMaxChange(e);} }/>
      </Col>
    <Col>
        <Form.Label>Personal Min</Form.Label>
        <Form.Control type="number" min = "0" max = "100" value = {perminval} placeholder="Personal Min" name = "fpermin" className='w-auto mx-auto' 
        onChange={e => {preventval(e);updatemax(e,permaxval,setpermaxval);  onPerMinChange(e);}}/>
      </Col>
      <Col>
        <Form.Label>Personal Max</Form.Label>
        <Form.Control type="number" min = "0" max = "100" value = {permaxval} placeholder="Personal Max" name = "fpermax" className='w-auto mx-auto' 
        onChange={e => {preventval(e); updatemin(e,perminval,setperminval);onPerMaxChange(e);}}/>
      </Col>
    </Row>
  </Form.Group>
  {rendererrormessages("metanv")}
  <Button variant="primary" type="submit" disabled={invalidData} onClick ={sendChange}>
    Filter
  </Button>
</Form> 

    );
    }

// export default FilterForm;

