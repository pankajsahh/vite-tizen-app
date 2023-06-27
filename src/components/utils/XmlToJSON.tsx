export default function xmlToJson(xml:any) {
    var obj:any = {};
  
    if (xml.nodeType === 1) {
      // Element node
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var i = 0; i < xml.attributes.length; i++) {
          var attribute = xml.attributes[i];
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      // Text node
      obj = xml.nodeValue;
    }
  
    if (xml.hasChildNodes()) {
      for (var j = 0; j < xml.childNodes.length; j++) {
        var child = xml.childNodes[j];
        var nodeName = child.nodeName;
  
        if (typeof obj[nodeName] === "undefined") {
          obj[nodeName] = xmlToJson(child);
        } else {
          if (typeof obj[nodeName].push === "undefined") {
            var oldObj = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(oldObj);
          }
          obj[nodeName].push(xmlToJson(child));
        }
      }
    }
  
    return obj;
  }