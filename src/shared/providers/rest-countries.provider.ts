import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { CountryData, ICountryDataProvider } from './country-data.interface';
import { RestCountriesResponse } from './rest-countries-response.interface';

@Injectable()
export class RestCountriesProvider implements ICountryDataProvider {
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  async getCountryByAlpha3Code(
    alpha3Code: string,
  ): Promise<CountryData | null> {
    try {
      const response = await this.httpClient.get<RestCountriesResponse>(
        `/alpha/${alpha3Code}?fields=name,cca3,region,subregion,capital,population,flags`,
      );

      const data = response.data;

      if (!data || !data.cca3) {
        return null;
      }

      return {
        alpha3Code: data.cca3,
        name: data.name?.common || '',
        region: data.region || '',
        subregion: data.subregion || '',
        capital: Array.isArray(data.capital)
          ? data.capital[0]
          : typeof data.capital === 'string'
            ? data.capital
            : '',
        population: data.population || 0,
        flagUrl: data.flags?.png || data.flags?.svg || '',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
