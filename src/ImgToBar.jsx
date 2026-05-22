import React, { useState, useRef, useEffect } from 'react'
import Tesseract from 'tesseract.js';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './ImgToBar.css'
import imageCompression from 'browser-image-compression';
import JsBarcode from 'jsbarcode';

export const ImgToBar = () => {
    const [imgSrc, setImgSrc] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [codes, setCodes] = useState([]);
    const imgRef = useRef(null);
    const [cropButtonDisabled, setCropButtonDisabled] = useState(true);
    const [crop, setCrop] = useState();
    const [isCropping, setIsCropping] = useState(false);
    const isImageMode = !!imgSrc;

    const handleOcr = async (event) => {
        
        const result = await Tesseract.recognize(
        imgSrc, "eng"
        );
        const output = ((result.data.text).match(/\d{4,}/g)) || [];
        setCodes(output);
    }

    function handleTextExtraction(){
        const date = new Date();
        const banned = [String(date.getFullYear()), String(date.getFullYear() - 1)]
        const output = ((textInput).match(/\d{4,}/g)).filter(code => !banned.includes(code)) || [];
        setCodes(output);
    }
    
    function handleImage (event){
        const file = event.target.files[0];
        setImgSrc(URL.createObjectURL(file));
        setCropButtonDisabled(false);
        setCrop({unit: "%",
        x: 10,
        y: 10,
        width: 50,
        height: 50})
        setIsCropping(true);
    }

    

    function handleCrop() {
        if (!crop || !imgRef.current) return;

        const image = imgRef.current;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const croppedImageUrl = canvas.toDataURL("image/png");

        setImgSrc(croppedImageUrl);
        setIsCropping(false);
        setCropButtonDisabled(true);
    }

    function handleText(e) {
        setTextInput(e.target.value);
    }

    const handleExtract = () => {
        if (isImageMode) handleOcr();
        else handleTextExtraction();
    };
    
    function Barcode({ value }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
        JsBarcode(ref.current, value, {
            format: "CODE128",
            width: 2,
            height: 80,
            displayValue: true,
        });
        }
    }, [value]);

    return <svg ref={ref} />;
    }

    
    return (
        <div className='page'>
            <div className='container'>
            <h1>Barcode Generator</h1>
            <p>Either enter an image or paste text to generate barcodes.</p>
            <input type='file' onChange={handleImage}/>
            
            <textarea type='text' onChange={handleText} placeholder='Paste text here.'></textarea>
            <div className='buttons'>
                <button onClick={handleCrop} disabled={cropButtonDisabled}>Crop image</button>
                <button onClick={handleExtract}>Extract barcode numbers</button>
            </div>
            
            <div className='image-preview'>
                {!!imgSrc && isCropping && (
                <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                    <img ref={imgRef} src={imgSrc} />
                </ReactCrop>
                )}
            </div>
            
            <ul className='barcodes'>
                {codes.map((code, index) => <li key={index}>
                    <Barcode value={code}/>
                </li>)}
            </ul>
        </div>
        </div>
        
        
    )
}
export default ImgToBar