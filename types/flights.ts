export interface AirportSuggestion {
    id: string;            // usually something like "airport:MAA"
    name: string;          //"Chennai International Airport"
    city: string;          // "Chennai"
    iata_code: string;     // "MAA"
    country_name: string;  //"India"
    entityId: string
  }
  

  export interface FlightResult {
  id: string;
  airline: string;
  price: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
}



export interface FlightResponse {
  status: boolean;
  timestamp: number;
  sessionId: string;
  data: FlightData;
}

interface FlightData {
  context: Context;
  itineraries: Itinerary[];
  messages: any[];
  filterStats: FilterStats;
}

interface Context {
  status: string;
  totalResults: number;
}

export interface Itinerary {
  id: string;
  price: Price;
  legs: Leg[];
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: FarePolicy;
  eco?: Eco;
  tags: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
}

interface Price {
  raw: number;
  formatted: string;
}

export interface Leg {
  id: string;
  origin: Place;
  destination: Place;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string;
  arrival: string;
  timeDeltaInDays: number;
  carriers: Carriers;
  segments: Segment[];
}

interface Place {
  id: string;
  name: string;
  displayCode: string;
  city: string;
  isHighlighted: boolean;
}

interface Carriers {
  marketing: Carrier[];
  operationType: string;
}

interface Carrier {
  id: number;
  logoUrl: string;
  name: string;
  alternateId?: string;
  allianceId?: number;
}

interface Segment {
  id: string;
  origin: DetailedPlace;
  destination: DetailedPlace;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
}

interface DetailedPlace {
  flightPlaceId: string;
  displayCode: string;
  parent: ParentPlace;
  name: string;
  type: string;
}

interface ParentPlace {
  flightPlaceId: string;
  displayCode: string;
  name: string;
  type: string;
}

interface FarePolicy {
  isChangeAllowed: boolean;
  isPartiallyChangeable: boolean;
  isCancellationAllowed: boolean;
  isPartiallyRefundable: boolean;
}

interface Eco {
  ecoContenderDelta: number;
}

interface FilterStats {
  duration: Duration;
  airports: City[];
  carriers: Carrier[];
  stopPrices: StopPrices;
}

interface Duration {
  min: number;
  max: number;
}

interface City {
  city: string;
  airports: Airport[];
}

interface Airport {
  id: string;
  name: string;
}

interface StopPrices {
  direct: StopPrice;
  one: StopPrice;
  twoOrMore: StopPrice;
}

interface StopPrice {
  isPresent: boolean;
  formattedPrice?: string;
}