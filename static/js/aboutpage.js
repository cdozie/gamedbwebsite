import React from 'react';
import Zoom from 'react-reveal/Zoom';


class About extends React.Component {


    render(){
      return(
        
      <div className = "about-page">
        <h1 className = "about-title gradientcolor">About this Website:</h1>
        <hr></hr>

        <Zoom left>
        <h4 className ="about-text gradientcolorpinkwhite">This site was created by Chidozie as a way to delve into Web Development and 
        learn more about JavaScript, CSS, HTML, and SQLite. It also acted as a gateway to get into ReactJS as well. This specifc page was made entirely with React
        as a start to learning how it works. </h4>
        </Zoom>
        <Zoom right>
        <img className = "about-rand-imgs" src ="https://image.api.playstation.com/vulcan/img/cfn/11307vTh2FlNzDQ7NPVKnp-85IJu_DABPWLpREGkkeV3G7xorbickiZATslw2cJ-hLce3Cz-I8an6O_XDWt1nwWyqO09C2K1.png"></img>
        </Zoom>
        <hr></hr>
        <Zoom bottom>
        <h4 className ="about-text gradientcolorpinkwhite">This website was my first foray into Web Development and I hope to learn more.
        Especially about React because it is very powerful for creating dynamic UI and this page of the website is my first experience with it</h4>
        </Zoom>
        <Zoom bottom>
        <img className = "about-rand-imgs" src = "https://image.api.playstation.com/vulcan/ap/rnd/202009/1813/baR055LeT8domuby7dkqYWeB.png"></img>
        </Zoom>
        <hr></hr>
        <Zoom bottom>
        <h4 className ="about-text gradientcolorpinkwhite">Thank You for taking the time to explore this website and seeing the work put in.
        Your time is appreciated deeply and we hope you enjoy your time on the site and if you are not a gamer, I hope this gets you GAMING.</h4>
        </Zoom>
        <Zoom bottom>
        <img className = "about-rand-imgs" src = "https://image.api.playstation.com/vulcan/img/rnd/202107/3019/AuNhbP3p92BQpYpJB9QjDRsU.png"></img>
        </Zoom>

      </div>
      );
    }
  } 

  export default About;
