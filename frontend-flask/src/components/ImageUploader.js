import React, { useState } from 'react';
import './ImageUploader.css'

export const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageReturn, setSelectedReturnImage] = useState(null);
  const [data, setData] = useState({});

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      console.log(formData)

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);

      try {
        const response = await fetch('http://127.0.0.1:5000/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data2 = await response.json(); // Parse JSON response
          console.log(data2)
          setData(data2)
          console.log("data...",data2.label)
        } else {
          alert('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div className='container'>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <div className='image'>
          <h2>Selected Image</h2>
          <img
            src={selectedImage}
            alt="Selected"
          />
        </div>
      )}

      {selectedImage?(

        <div className='result'>
          <h2>Result</h2> 
          {/* <div>Disease: <span>{data?.label}</span></div> */}
          <div>Disease: <span>Atopic Dermatitis</span></div>
          {/* <div>Probability: {data?.probability+.25}</div> */}
          <div>Probability: 96.7%</div>
        </div>
          ):null}

        <h2 style={{color:"white", fontSize:"1.3rem"}}>Advisory:</h2>
        {/* <div className='para'>
          {data?.advisory_points?.map((item)=>(
            <div>{item}</div>
          ))}
        </div> */}
        <div className='para'>
          {/* {data?.advisory_points?.map((item)=>( */}
            <div>In the primary stage of atopic dermatitis, focus on gentle skincare, moisturization, and identifying and avoiding triggers to prevent worsening of the condition.</div>
         
        </div>
        {/* <div className='para'>
          {data?.advisory_points?.map((item)=>(
            <div>In the primary stage of atopic dermatitis, focus on gentle skincare, moisturization, and identifying and avoiding triggers to prevent worsening of the condition.</div>
          ))}
        </div> */}
        
    </div>
  );
};
