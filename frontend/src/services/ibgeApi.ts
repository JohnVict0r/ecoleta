/** @file ibge.ts */
import axios, { AxiosResponse } from 'axios';
const api = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/',
});

export interface IBGEUFResponse {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGEUFCityResponse {
  nome: string;
}

const ibge = () => {
  function indexUF(
    callback: (response: AxiosResponse<IBGEUFResponse[]>) => void
  ) {
    api
      .get<IBGEUFResponse[]>('localidades/estados?orderBy=nome')
      .then((response) => callback(response));
  }

  function indexUFCities(
    UF: string,
    callback: (response: AxiosResponse<IBGEUFCityResponse[]>) => void
  ) {
    api
      .get<IBGEUFCityResponse[]>(`/localidades/estados/${UF}/municipios`)
      .then((response) => callback(response));
  }

  return {
    indexUF,
    indexUFCities,
  };
};

export default ibge();
