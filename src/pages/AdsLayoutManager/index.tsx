import React from "react";
import LoginGif from "../../assets/signfeed_logo.gif";
import "./AdsLayoutManager.css";
import { useEffect, useState } from "react";
import {
  retrieveDataFromIndexedDB,
  updateDataInIndexedDB,
} from "../../components/utils/DB";
import FeatchNewResource from "../../components/utils/FeatchNewResource";
import FeatchNewResourceData from "../../components/utils/DownloadFile";
import RegionToMedia from "../../components/RegionToMedia";

export interface RequiredResType {
  "@attributes": Attributes;
}

export interface Attributes {
  type: string;
  id: string;
  size: string;
  md5: string;
  download: string;
  path: string;
}

export interface LayoutType {
  "@attributes": LayoutTypeAttributes;
  region: Region[] | Region;
  tags: Tags;
}

export interface LayoutTypeAttributes {
  width: string;
  height: string;
  bgcolor: string;
  schemaVersion: string;
}

export interface Region {
  "@attributes": RegionAttributes;
  options: Tags;
  media: Media[] | Media;
}

export interface RegionAttributes {
  id: string;
  width: string;
  height: string;
  top: string;
  left: string;
}

export interface Media {
  map(arg0: (item: any) => void): Iterable<unknown> | null | undefined;
  "@attributes": MediaAttributes;
  options: Options;
  raw: Tags;
}

export interface MediaAttributes {
  id: string;
  type: string;
  render: string;
  duration: string;
  useDuration: string;
  fileId?: string;
}

export interface Options {
  modeid?: Loop;
  transparency?: Loop;
  uri: Loop;
  xmds?: Loop;
  loop?: Loop;
  mute?: Loop;
  scaleType?: Loop;
}

export interface Loop {
  "#text": string;
}

export interface Tags {}

const AdsLayoutManager: React.FC = () => {
  const [loading, setloading] = useState(true);
  const [layoutData, setLayoutData] = useState<LayoutType>({
    "@attributes": {
      width: "0",
      height: "0",
      bgcolor: "#000",
      schemaVersion: "",
    },
    region: [],
    tags: "",
  });

  let layoutwidth = layoutData["@attributes"]?.width;
  let layoutheight = layoutData["@attributes"]?.height;

  async function UpdationFileController() {
    let existingData: any[] = await retrieveDataFromIndexedDB("newtvData");
    if (!existingData) setloading(true);
    try {
      let data: any = await FeatchNewResource();
      // ids need to featched
      let ids = new Set(data.map((item: any) => item["@attributes"].id));
      // now we need to filter out the  data we need to featch
      let updatedNewTvData = existingData
        ? existingData.filter((item: any) => {
            return ids.has(item.id);
          })
        : [];
      for (let i = 0; i < data.length; i++) {
        if (
          !updatedNewTvData.find((item) => {
            return item.id === data[i]["@attributes"].id;
          })
        ) {
          const Objectdata = await FeatchNewResourceData(data[i]);
          if (Objectdata !== undefined) {
            updatedNewTvData.push(Objectdata);
          }
        }
      }
      updateDataInIndexedDB("newtvData", updatedNewTvData);
      let updatedLayout = await retrieveDataFromIndexedDB("Layout");
      setLayoutData(updatedLayout);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    UpdationFileController();
    const interval = setInterval(() => {
      UpdationFileController();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!loading ? (
        <div
          style={{
            aspectRatio: `${layoutwidth}/${layoutheight}`,
            maxWidth: "100vw",
            height: "auto",
            position: "relative",
          }}
        >
          {Array.isArray(layoutData.region) ? (
            layoutData.region.map((item: Region) => {
              return (
                <div
                  style={{
                    // aspectRatio: ``,
                    width: `calc(100vw /${layoutwidth}  * ${item["@attributes"].width})`,
                    height: `calc(100vh /${layoutheight}  * ${item["@attributes"].height})`,
                    top: `calc(100vh / ${layoutheight}  * ${item["@attributes"].top})`,
                    left: `calc(100vw / ${layoutwidth}  * ${item["@attributes"].left})`,
                  }}
                  className="region"
                >
                  <RegionToMedia Region={item} />
                </div>
              );
            })
          ) : (
            <RegionToMedia Region={layoutData.region} />
          )}
        </div>
      ) : (
        <div className="LoadingScreen">
          <img src={LoginGif} alt="Logo" className="logo" />
        </div>
      )}
    </>
  );
};

export default AdsLayoutManager;
