import React from 'react';
import './FaceRecognition.css';
 

const FaceRecognition = ({imageUrl, box})=> {
	return (
     <div className = ' center' >
      <div className = 'relative mt2' >
	     <img id='inputImage' src = {imageUrl} alt = '' width = '700px' height = 'auto'/>  
	     <div className = 'bounding-box' style={{top:box.topRow,right: box.rightCol,bottom: box.bottomRow,left: box.leftCol}} ></div>
	  </div>
	
	 </div>


	);
}

export default FaceRecognition;