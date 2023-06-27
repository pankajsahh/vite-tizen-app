import { RequiredResType } from "../../pages/AdsLayoutManager";
import xmlToJson from "./XmlToJSON";

export default function FeatchNewResource() {
  return new Promise((resolve, reject) => {
    var parser = new DOMParser();
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/xml");
    var raw =
      '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/"><v:Header /><v:Body><RequiredFiles id="o0" c:root="1"><serverKey i:type="d:string">5wm8pZ</serverKey><hardwareKey i:type="d:string">130b5ac3-b6fd-29fd-5f23-7f952f25e87z</hardwareKey></RequiredFiles></v:Body></v:Envelope>\n';

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://signage.signfeed.in/xmds.php?v=4&method=RequiredFiles",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        var codeValue: any = parser.parseFromString(
          String(
            parser
              .parseFromString(String(result), "text/xml")
              .querySelector("RequiredFilesXml")?.textContent
          ),
          "text/xml"
        );

        const data = xmlToJson(codeValue);
        if(data.files.file.find((item:any)=>item["@attributes"].type === "resource")){
          resolve(
            data.files.file.filter(function (item: RequiredResType) {
              return (
                /\.(mp4|jpg|jpeg|png|gif)$/i.test(item["@attributes"].path) ||
                item["@attributes"].type === "resource"
              );
            })
          )
        }else{
          resolve(
            data.files.file.filter(function (item: RequiredResType) {
              return (
                /\.(mp4|jpg|jpeg|png|gif)$/i.test(item["@attributes"].path) ||
                item["@attributes"].type === "layout"
              );
            })
          );
        }
      })
      .catch((error) => reject(error));
  });
}
