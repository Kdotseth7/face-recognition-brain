import React, { Component } from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

const app = new Clarifai.App({
    apiKey: 'e45850afd0024de38188f2a2b7c8e36f'
});

const particleOptions = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 300
            }
        }
    }
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined: ''
            }
        }
    }

    loadUser = userData => {
        this.setState({
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                entries: userData.entries,
                joined: userData.joined
            }})
    };

    onInputChange = event => {
        this.setState({input: event.target.value});
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models
            .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input
            )
            .then(response => {
                if (response) {
                    fetch("http://localhost:3000/image", {
                        method: "put",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, {entries: count}))
                        })
                }
                this.displayFaceBox(this.calculateFaceLocation(response));
            })
            .catch(err => console.error(err));
    };

    calculateFaceLocation = data => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    };

    displayFaceBox = box => {
        this.setState({box: box});
    };

    onRouteChange = route => {
        if (route === 'signout') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route})
    };

    render() {
    const { isSignedIn, imageUrl, box, route, user } = this.state;
    return (
        <div className="App">
            <Particles
                className='particles'
                params={particleOptions}
            />
            <Navigation isSignedIn={isSignedIn}
                        onRouteChange={this.onRouteChange}/>
            {
                route === 'home'
                    ?<div>
                        <Logo/>
                        <Rank
                            name={user.name}
                            entries={user.entries} />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            imageUrl={imageUrl}
                            box={box}
                        />
                     </div>
                    :(
                        route === 'signin'
                            ?<Signin
                                onRouteChange={this.onRouteChange}
                                loadUser={this.loadUser}
                            />
                            :<Register
                                onRouteChange={this.onRouteChange}
                                loadUser={this.loadUser}
                            />
                            )
            }
        </div>
    );
  }
}

export default App;
