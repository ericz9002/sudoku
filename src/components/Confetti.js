import React from 'react'
import {useEffect, useState} from 'react'
import Confetti from 'react-confetti'

export default ()=>{
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  useEffect(()=>{
    const observer = new ResizeObserver((entries)=>{
      for(let entry of entries){
        const { scrollWidth: width, scrollHeight: height } = document.body;
        setPageWidth(width);
        setPageHeight(height);
      }
    });
    observer.observe(document.body);
    return ()=>{
      observer.disconnect();
    }
  },[]);

  const [recycle, setRecycle] = useState(true);
  useEffect(()=>{
    if(recycle === true){
      setTimeout(()=>{
        setRecycle(false);
      },5000);
    }
  },[recycle]);
  return (
    <Confetti className = "confetti"
      width={pageWidth}
      height={pageHeight}
      tweenDuration={1}
      recycle={recycle}
    />
  )
}