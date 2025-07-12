import { mockFlightResults, mockSuggestions } from '@/mock/mockFlightData';
import axios from 'axios';
import { AirportSuggestion, FlightResponse, FlightResult, Itinerary, Leg } from '../types/flights';

const BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api/v1/flights';

const headers = {
  'X-RapidAPI-Key': process.env.RAPID_API_KEY,
  'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
};

const USE_MOCK = false;

//local map for comparing iata code for testing purpose
const CITY_TO_AIRPORT_MAP: { [key: string]: string[] } = {
  LOND: ['LHR', 'LGW'],
  NYCA: ['JFK', 'EWR'],
};


export const getAirportSuggestions = async (query: string): Promise<AirportSuggestion[]> => {
  try {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 300));
      const q = query.toLowerCase();
      return mockSuggestions.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.iata_code.toLowerCase().includes(q)
      );
    }
    await new Promise((res) => setTimeout(res, 1000));
    const response = await axios.get(`${BASE_URL}/searchAirport`, {
      headers,
      params: {
        query,
        locale: 'en-US',
      },
    });

    const suggestions = response.data?.data || [];
    const mappedSuggestions = suggestions
      .filter((item: any) => item.navigation.entityType === 'AIRPORT' || item.navigation.entityType === 'CITY')
      .map((item: any) => ({
        id: item.navigation.entityId,
        name: item.presentation.title,
        city: item.navigation.relevantHotelParams.localizedName,
        iata_code: item.navigation.relevantFlightParams.skyId,
        country_name: item.presentation.subtitle,
        entityId: item.navigation.entityId,
      }));

    return mappedSuggestions;
  } catch (error) {
    console.error('Error fetching airport suggestions:', error);
    return [];
  }
};

// export const getAirportSuggestionsMock = async (query: string): Promise<AirportSuggestion[]> => {

// };

export const searchFlights = async (
  selectedFrom: AirportSuggestion,
  selectedTo: AirportSuggestion,
  departureDate: string,
  returnDate: string | null,
  adults: number,
  children: number,
  infants: number,
  travelClass: 'economy' | 'premium' | 'business' | 'first'
): Promise<FlightResult[]> => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 2000));
    return mockFlightResults.filter((itinerary) => {
      const routeMatch = itinerary.airline.match(/(\w{3})-(\w{3})$/);
      if (!routeMatch) return false;
      const [_, origin, destination] = routeMatch;

      const fromAirports = CITY_TO_AIRPORT_MAP[selectedFrom.iata_code] || [selectedFrom.iata_code];
      const toAirports = CITY_TO_AIRPORT_MAP[selectedTo.iata_code] || [selectedTo.iata_code];

      const routeMatches = fromAirports.includes(origin) && toAirports.includes(destination);
      const dateMatches = itinerary.departure_time.startsWith(departureDate);

      return routeMatches && dateMatches;
    });
  }

  try {
    await new Promise((res) => setTimeout(res, 2000)); // Increased delay for CAPTCHA avoidance

    const params: any = {
      originSkyId: selectedFrom.iata_code,
      destinationSkyId: selectedTo.iata_code,
      originEntityId: selectedFrom.entityId,
      destinationEntityId: selectedTo.entityId,
      date: departureDate,
      adults: adults || 1,
      children: children || 0,
      infants: infants || 0,
      cabinClass: travelClass || 'economy',
      sortBy: 'best',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US',
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    console.log('searchFlights params:', JSON.stringify(params, null, 2));

    const response = await axios.get<FlightResponse>(`${BASE_URL}/searchFlights`, {
      headers: {
        ...headers,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.skyscanner.com/',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      params,
    });


    if (response.data.data.context.status === 'failure' || response.data.data.itineraries.length === 0) {
      throw new Error('No flights found for the selected parameters. Try different dates or airports.');
    }

    const itineraries = response.data.data.itineraries || [];
    console.log('flight itineraries', JSON.stringify(itineraries, null, 2));

    return itineraries.map((itinerary: Itinerary) => {
      const totalDuration = itinerary.legs.reduce((sum: number, leg: Leg) => sum + leg.durationInMinutes, 0);
      const totalStops = itinerary.legs.reduce((sum: number, leg: Leg) => sum + leg.stopCount, 0);
      const firstLeg = itinerary.legs[0];
      const lastLeg = itinerary.legs[itinerary.legs.length - 1];

      return {
        id: itinerary.id,
        airline: firstLeg.carriers.marketing[0]?.name || 'Unknown Airline',
        price: itinerary.price.formatted || 'N/A',
        departure_time: firstLeg.departure || 'N/A',
        arrival_time: lastLeg.arrival || 'N/A',
        duration: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
        stops: totalStops,
      };
    });
  } catch (error: any) {
    console.error('Error fetching flight results:', error);
    throw new Error(error.message || 'Failed to fetch flights. Please try again.');
  }
};