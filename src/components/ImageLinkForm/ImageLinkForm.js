import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = () => {
    return(
        <div>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Give it a try!'}
            </p>
            <div className='center'>
                <div className='form pa4 br3 shadow-5 center'>
                    <input className='f4 pa2 w-70 center' type='text' placeholder='Enter the URL for the Image ...'/>
                    <button className='w-30 f4 link grow ph3 pv2 dib white bg-light-purple'>Detect</button>
                </div>
            </div>
        </div>
    );
};

export default ImageLinkForm;