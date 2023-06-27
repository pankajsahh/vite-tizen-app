import { updateDataInIndexedDB } from "./DB";
import xmlToJson from "./XmlToJSON";

export default async function FeatchNewResourceData(item: any) {
    console.log(item)
  var parser = new DOMParser();
  var myHeaders2 = new Headers();
  myHeaders2.append("Content-Type", "application/xml");
  var raw = `<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/"><v:Header /><v:Body><getFile id="o0" c:root="1"><serverKey i:type="d:string">5wm8pZ</serverKey><hardwareKey i:type="d:string">130b5ac3-b6fd-29fd-5f23-7f952f25e87z</hardwareKey><fileId i:type="d:string">${
    item["@attributes"].type === "resource"
      ? item["@attributes"].layoutid
      : item["@attributes"].id
  }</fileId><fileType i:type="d:string">${
    item["@attributes"].type === "resource"
      ? "layout"
      : item["@attributes"].type
  }</fileType><chunkOffset i:type="d:string">0</chunkOffset><chuckSize i:type="d:string">51200000</chuckSize></getFile></v:Body></v:Envelope>`;

  var requestOptions: any = {
    method: "POST",
    headers: myHeaders2,
    body: raw,
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://signage.signfeed.in/xmds.php?v=4&method=GetFile",
      requestOptions
    );
    const result_1 = await response.text();
    let newObject = {
      id: item["@attributes"].id,
      type:
        item["@attributes"].type === "media"
          ? /\.(mp4)$/i.test(item["@attributes"].path)
            ? "video"
            : "Image"
          : "layout",
      data: xmlToJson(parser.parseFromString(result_1, "text/xml"))[
        "SOAP-ENV:Envelope"
      ]["SOAP-ENV:Body"]["ns1:GetFileResponse"].file["#text"],
    };
    if (item["@attributes"].type === "layout" ||  item["@attributes"].type === "resource") {
      const decodedString = atob(newObject.data);
      let data_2 = parser.parseFromString(decodedString, "text/xml");
      updateDataInIndexedDB("Layout", xmlToJson(data_2)["layout"]);
      console.log(xmlToJson(data_2)["layout"],"this is layout data")
      return undefined;
    } else {
      return newObject;
    }
  } catch (error) {
    console.log("error", error);
    return undefined;
  }
}
