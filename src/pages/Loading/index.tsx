import React, { useEffect } from 'react';
import LoadingVideo from "../../assets/loginloading.mp4";

type VideoPlayerProps = {
  setUserValid: (startVideoEnded: boolean) => void;
};

const LoadingPage: React.FC<VideoPlayerProps> = ({  setUserValid }) => {


useEffect(()=>{
  const parser = new DOMParser();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/xml');
    const raw =
      '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/"><v:Header /><v:Body><RegisterDisplay id="o0" c:root="1"><serverKey i:type="d:string">5wm8pZ</serverKey><hardwareKey i:type="d:string">130b5ac3-b6fd-29fd-5f23-7f952f25e87d</hardwareKey><displayName>Xiaomi-Mi 4i</displayName><clientType>1</clientType><clientVersion>1.8</clientVersion><clientCode>1</clientCode><operatingSystem>Android</operatingSystem><macAddress>14:F6:5A:61:DF:41</macAddress><tokenid>AZQSAPA91bH2pRxkluh7su06PltBmJEm1q5-7HRDbrh2r3XggeQWVjxEfqKiwIJXFLGcH7m-cIbIKQ5QjHeDyMrXtLLb1L8RfQTbcUk1Wjju-GssaI6JHvSN_2D1NAxk79</tokenid></RegisterDisplay></v:Body></v:Envelope>';
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    fetch('http://3.110.230.85/xmds.php?v=4&method=RegisterDisplay', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const codeValue = parser
          .parseFromString(parser.parseFromString(result, 'text/xml').querySelector('ActivationMessage')?.textContent ?? '', 'text/xml')
          .querySelector('display')
          ?.getAttribute('code');

        console.log(codeValue);

        if (codeValue === 'READY') {
          setUserValid(true);
        }
      })
      .catch((error) => console.log('error', error));
},[])


  return (
    <div>
     <video autoPlay loop muted>
        <source src={LoadingVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default LoadingPage;