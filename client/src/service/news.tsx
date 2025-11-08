import axios, { type AxiosRequestConfig } from "axios";
import { mockContentResp } from "./mocks";

const ax_cfg: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE,
};

export const getPong = async () => {
  axios
    .get("/ping", ax_cfg)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error("can not connect to server", err);
    });
};

export interface result {
  id: string;
  sectionName: string;
  sectionId: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  fields: {
    standfirst: string;
    byline: string;
    wordcount: string;
  };
}

export interface articleResponse {
  status: string;
  results: result[];
  Region: string;
}

export const getArticles = async (
  setArticles: CallableFunction,
  setRegion: CallableFunction
) => {
  axios
    .get<articleResponse>("/content", ax_cfg)
    .then((res) => {
      if (res.data.status == "ok") {
        setArticles(res.data.results);
        if (res.data.Region != "") {
          setRegion(res.data.Region);
        }
      } else {
        throw new Error("Returned response is not ok");
      }
    })
    .catch((err) => {
      console.error("can not connect to server", err);
    });
};

export const MockgetArticles = async (
  setArticles: CallableFunction,
  setRegion: CallableFunction
) => {
  setArticles(mockContentResp.results);
};
