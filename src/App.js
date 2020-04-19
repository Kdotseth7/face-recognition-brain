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
            route: 'signin'
        }
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models
            .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input
            )
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.error(err));
    };

    calculateFaceLocation = (data) => {
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

    displayFaceBox = (box) => {
        this.setState({box: box});
    };

    onRouteChange = () => {

    };

    render() {
    return (
        <div className="App">
            <Particles
                className='particles'
                params={particleOptions}
            />
            <Navigation/>
            {
                this.state.route === 'signin'
                    ?<Signin onRouteChange={this.onRouteChange}/>
                    :<div>
                        <Logo/>
                        <Rank/>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            imageUrl={this.state.imageUrl}
                            box={this.state.box}
                        />
                    </div>
            }
        </div>
    );
  }
}

export default App;
