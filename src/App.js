import React, { Component } from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

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
            imageUrl: ''
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
                // URL
                this.state.input
            )
            .then(function(response) {
                console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
                },
                function(err) {
                console.error(err);
                }
                );
    };

    render() {
    return (
        <div className="App">
            <Particles
                className='particles'
                params={particleOptions}/>
            <Navigation/>
            <Logo/>
            <Rank/>
            <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl}/>
        </div>
    );
  }
}

export default App;
