import React, { useEffect, useState, useLayoutEffect } from 'react';
import Table from'react-bootstrap/Table'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const DisplayDetails = (props) => {

    return(
        <Table bordered variant = "dark" hover>
            <thead>
                <tr>
                    <th scope = "col"><h2 className='gradient-color-blue-black'>#</h2></th>
                    <th scope = "col" ><h2 className="acct-dtl-name gradientcolorpinkwhite">Stat Name</h2></th>
                    <th scope = "col" ><h2 className = "gradientcolor">Stat Value</h2></th>
                </tr>

            </thead>
            <tbody>
            { props.details.map(
                (detail) =>
                <tr key ={`${detail.Name}`}>
                    <td><h6 className='gradient-color-blue-black'>{detail.Number}</h6></td>
                    <td><h6 className = "acct-dtl-name gradientcolorpinkwhite">{detail.Name}</h6></td> 
                    <td><h6 className = "acct-dtl-value gradientcolor">{detail.Value}</h6></td> 
                </tr>
              ) 
            }
            </tbody>
        </Table>
    )
}

const Details = () => {
    const [Detail_lst, setDetail_lst] = useState([])
    useEffect(() => {
        var md_dict_list = []
        fetch('http://127.0.0.1:5000/account/detailsfeeder',{
          'methods':'GET',
          headers : {
            'Content-Type':'application/json'
          }
        })
      .then(response => (response.json()))
      .then(response => {
        var gr = response
        console.log(gr)
       setDetail_lst(() => gr);
      
      })
      .catch(error => console.log(error))},[])
  
    return(
        <DisplayDetails details = {Detail_lst} />
    )
}

export default Details;