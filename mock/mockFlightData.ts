import { AirportSuggestion } from '../types/flights';

export const mockSuggestions: AirportSuggestion[] = [
  {
    id: 'airport:MAA',
    name: 'Chennai International Airport',
    city: 'Chennai',
    iata_code: 'MAA',
    country_name: 'India',
  },
  {
    id: 'airport:DEL',
    name: 'Indira Gandhi International Airport',
    city: 'Delhi',
    iata_code: 'DEL',
    country_name: 'India',
  },
  {
    id: 'airport:BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    iata_code: 'BOM',
    country_name: 'India',
  },
];


export interface FlightResult {
    id: string;
    airline: string;
    airline_logo: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    stops: number;
    price: string;
    from: string;
    to: string;
  }
  
  export const mockFlightResults: FlightResult[] = [
    {
      id: '1',
      airline: 'IndiGo',
      airline_logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/IndiGo_Logo.svg',
      departure_time: '08:00',
      arrival_time: '10:30',
      duration: '2h 30m',
      stops: 0,
      price: '₹4,500',
      from: 'MAA',
      to: 'DEL',
    },
    {
      id: '2',
      airline: 'Air India',
      airline_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Air_India_Logo.svg/512px-Air_India_Logo.svg.png',
      departure_time: '11:00',
      arrival_time: '13:45',
      duration: '2h 45m',
      stops: 0,
      price: '₹5,200',
      from: 'MAA',
      to: 'DEL',
    },
    {
      id: '3',
      airline: 'SpiceJet',
      airline_logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/SpiceJet_Logo.svg',
      departure_time: '14:15',
      arrival_time: '17:10',
      duration: '2h 55m',
      stops: 1,
      price: '₹4,900',
      from: 'MAA',
      to: 'DEL',
    },
  ];
  