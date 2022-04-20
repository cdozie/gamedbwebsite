import React, { useEffect, useState, useLayoutEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler';
import { Link } from 'react-router-dom';
const SearchBar = () => {
    const[searchResults, setsearchResults] = useState([])

    const[SearchBarVal, setSearchBarVal] = useState([])
    const [showSearchList, setshowSearchList] = useState(false)

    const onSearchBarChange = (e) => {
        setSearchBarVal(() => e.target.value);

    
    }
    const searchData = (e) => {
        const api_key = "bbd0f6e116b145bd81a72ee35824f71f"
        var url2 = `https://api.rawg.io/api/games?key=${api_key}&page_size=10&search=${e.target.value}`
        axios.get(url2)
        .then(response =>{
            const gr = response.data;
            console.log(gr.results.length)
            setsearchResults(() => gr.results)
        })  
        .catch(error => console.error(error)); 
        console.log(searchResults)
        console.log(searchResults.length)
        setshowSearchList(() => true);
        // if (searchResults.length != 0){
        //     searchResults.forEach((element) =>{
        //         $.ajax({
        //             type:'POST',
        //             url:'/search',
        //             data:{
        //                 searchslug : element.slug
        //             },
        //           })   
        //     }) 
        // }

    }
    const optionClickHandler = (e) =>{
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/search',
            data:{
                searchslug : e.target.getAttribute('slug')
            },
            success:function()
            {
            window.location.href = `/game/${e.target.getAttribute('slug')}` }
          })
        };

    useEffect(()=>{
        console.log(searchResults)
        // if (searchResults.length != 0){
        //     searchResults.forEach((element) =>{
        //         $.ajax({
        //             type:'POST',
        //             url:'/search',
        //             data:{
        //                 searchslug : element.slug
        //             },
        //           })   
        //     })

                
            
        //     }
    },[searchResults])
    return(
    <div className = "main-search-bar">
    <OutsideClickHandler onOutsideClick={() => {setshowSearchList(() => false)}}>
    {/* <Form action="/search" method="post"> */}
    <Form.Control className = 'mx-auto w-75' type = "text" placeholder = "Search Game:" value ={SearchBarVal}
    onChange={e => {onSearchBarChange(e); searchData(e)}}/>
    { (showSearchList) &&
    (<datalist id= "gamedropdown" style = {{width: "75%"}}>
    <div className = "fullsearchresults">
    {
    searchResults.map((result) => 
        <div className = "search-result-block" key = {`${result.slug}`} >
            <img className = "gameoptionimages" id= {`${result.background_image}`} src ={`${result.background_image}`}></img>
            {/* <button className = "searchbar-buttons"><option  onClick = {optionClickHandler} className = "item-text gamedboptions" slug = {`${result.slug}`} id ={`${result.name}`}> {`${result.name}`}</option></button> */}
        {/* <div><Link to = {`/game/${result.slug}`}> <option   className = "item-text gamedboptions" slug = {`${result.slug}`} id ={`${result.name}`}> {`${result.name}`}</option></Link></div> */}
        <div> <option  onClick = {optionClickHandler} className = "item-text gamedboptions" slug = {`${result.slug}`} id ={`${result.name}`}> {`${result.name}`}</option></div>

        </div>
    )
    }
    </div>
    </datalist>)
    }
    </OutsideClickHandler>
    </div>
    
    )
}

export default SearchBar;
