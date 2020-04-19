import React from "react";

const FaceRecognition = ({ imageUrl }) => {
    return(
        <div className='center ma'>
            <img className='absolute mt2' src={imageUrl} alt='image' width='500px' height='auto'/>
        </div>
    );
};

export default FaceRecognition;
