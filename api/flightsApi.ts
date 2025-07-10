import { mockSuggestions } from '@/mock/mockFlightData';
import axios from 'axios';
import { AirportSuggestion } from '../types/flights';

const RAPID_API_KEY = 'YOUR_RAPID_API_KEY';
const BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights';

const headers = {
  'X-RapidAPI-Key': RAPID_API_KEY,
  'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
};


export const getAirportSuggestions = async (query: string): Promise<AirportSuggestion[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search-autosuggest`, {
      headers,
      params: { query },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching airport suggestions:', error);
    return [];
  }
};




export const getAirportSuggestionsMock = async (query: string): Promise<AirportSuggestion[]> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  const q = query.toLowerCase();
  return mockSuggestions.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.iata_code.toLowerCase().includes(q)
  );
};
