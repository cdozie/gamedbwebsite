import react from "react";
import Zoom from 'react-reveal/Zoom';
class About extends React.Component {
    render(){
      return(
      <div className = "about-page">
        <h6 className = "about-title gradientcolor">About this Website:</h6>
        <hr className = "about-title-separator"></hr>
        <h4 className ="about-main gradientcolorpinkwhite">This site was created by Chidozie as a way to delve into Web Development and 
        learn more about JavaScript, CSS, HTML, and SQLite. It also acted as a gateway to get into ReactJS as well This page was made entirely with React
        to test it out. </h4>
        <img className = "about-rand-img"></img>
      </div>
      );
    }
  } 
  
  ReactDOM.render(
    <About />,
    document.getElementById('test-react-component')
  );