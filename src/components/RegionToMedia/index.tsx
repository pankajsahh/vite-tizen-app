import { useState, useEffect } from "react";
import { Region } from "../../pages/AdsLayoutManager";
import { retrieveDataFromIndexedDB } from "../utils/DB";
import AdsPlayer from "../AdsPlayer";
export interface MediaDatatype {
  id: string;
  type: string;
  data: string;
}
export interface AdsPlayerType {
  Region: Region;
}

function RegionToMedia({ Region }: AdsPlayerType) {
  const [MediaData, setmediaData] = useState<MediaDatatype[]>([]);
  async function FindMediaDataForRegin(region: Region) {
    const setOfIdsOfMedia = new Set<string>();
    let getCurrentMediadata = await retrieveDataFromIndexedDB("newtvData");
    if (region && region.media) {
      if (Array.isArray(region.media)) {
        region.media.forEach((media) => {
          if (media["@attributes"]?.type === "webpage") {
            getCurrentMediadata.push({
              id: "212",
              type: "webpage",
              data: media.options.uri,
            });
          }

          if (media["@attributes"]?.fileId)
            setOfIdsOfMedia.add(media["@attributes"]?.fileId);
        });
      } else if (typeof region.media === "object") {
        if (region.media["@attributes"]?.type === "webpage") {
          getCurrentMediadata.push({
            id: "212",
            type: "webpage",
            data: region.media.options.uri,
          });
        }

        if (region.media["@attributes"]?.fileId)
          setOfIdsOfMedia.add(region.media["@attributes"]?.fileId);
      }
    }

    console.log(
      setOfIdsOfMedia,
      getCurrentMediadata.filter((item: MediaDatatype) => {
        return setOfIdsOfMedia.has(item.id);
      }),
      getCurrentMediadata,
      "filterd data to be displayed region ye h"
    );

    setmediaData(
      getCurrentMediadata.filter((item: MediaDatatype) => {
        return setOfIdsOfMedia.has(item.id);
      })
    );
  }

  useEffect(() => {
    FindMediaDataForRegin(Region);
  }, [Region.media]);

  return <AdsPlayer MediaData={MediaData} />;
}

export default RegionToMedia;
