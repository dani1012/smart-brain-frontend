import React from 'react';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import Particles from 'react-particles-js';


const particlesOptions ={
     particles: {
        number: { 
              value: 50, 
              density: { 
                enable: true, 
                value_area: 800
            }
        }
    }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user : {
    id : '',
    name :  '',
    email : '',
    entries : 0,
    joined : ''
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state = initialState;
  }
  
  loadUser = (data)=>{
     this.setState({
      user:{
        id : data.id,
        name :  data.name,
        email : data.email,
        entries : data.entries,
        joined : data.joined
      }
     })

  }
  

  calculateFaceLocation = (response) => {
      const clarifaiFace = response.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      //console.log(width,height,clarifaiFace);
      return {
        topRow: clarifaiFace.top_row * height, 
        leftCol: clarifaiFace.left_col * width,
        bottomRow: height - (clarifaiFace.bottom_row * height),
        rightCol: width - (clarifaiFace.right_col * width)
        }


  }

  displayFaceBox = (data) =>{
       //console.log(data);
       this.setState({box: data})

  }
  onInputChange = (event)=> {
    this.setState({input : event.target.value}); //update input
  }


  onButtonSubmit = (input) =>{
    this.setState({imageUrl : this.state.input});                  //update imageUrl from input
    fetch ('https://serene-yellowstone-37518.herokuapp.com/imageurl', {                     //post input to server
      method : 'post',
      headers: {'Content-Type': 'application/json'},
      body : JSON.stringify({
        input : this.state.input
      })
    })
      .then(response => response.json())
      .then(response=>{
        if(response) {
          fetch ('https://serene-yellowstone-37518.herokuapp.com/image', {                     //post user id  to server
            method : 'put',
            headers: {'Content-Type': 'application/json'},
            body : JSON.stringify({
            id: this.state.user.id
       })
    })        
      .then(response=>response.json())
      .then(count =>{    
         this.setState({
           user: { 
            ...this.state.user,
            entries: count         
          } 
         })      
         // this.setState(Object.assign(this.state.user,{entries: count})) 
      })
      .catch(console.log)

    }
      this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err=>console.log(err)); 
  }



  onRouteChange = (route)=> {
       if(route === 'signout') {
        this.setState(initialState)
       } else if (route === 'home') {
        this.setState({isSignedIn: true})
       }
       this.setState({route: route});
   }
 


	render () {
  return (
    <div className="App">
       <Particles className ="particles"
          params={particlesOptions}
       />     
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      <Logo/>
      {this.state.route === 'home'
      ?(<div>
          <Rank
              name={this.state.user.name}                       //loadUser function update the state after signin
              entries = {this.state.user.entries}/>
          <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box = {this.state.box} 
                          imageUrl={this.state.imageUrl}/> 
        </div>)
      : (this.state.route === 'signin'
        ?<SignIn 
                loadUser = {this.loadUser}
                onRouteChange={this.onRouteChange}/>
        : (this.state.route === 'signout')
           ?<SignIn 
                loadUser = {this.loadUser}
                onRouteChange={this.onRouteChange}/>
           :<Register 
                loadUser = {this.loadUser}
                onRouteChange={this.onRouteChange}/>
        )
      } 
    </div>
   );
  } 
}

export default App;
