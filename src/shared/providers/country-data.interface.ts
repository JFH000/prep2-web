export interface CountryData {
  alpha3Code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
}

export interface ICountryDataProvider {
  getCountryByAlpha3Code(alpha3Code: string): Promise<CountryData | null>;
}
