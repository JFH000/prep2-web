export interface RestCountriesResponse {
  name?: {
    common?: string;
    official?: string;
  };
  cca3?: string;
  region?: string;
  subregion?: string;
  capital?: string[] | string;
  population?: number;
  flags?: {
    png?: string;
    svg?: string;
  };
}
