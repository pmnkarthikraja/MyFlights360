import React, { useEffect, useState } from 'react';
import {
    FlatList, Keyboard,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
// import { getAirportSuggestions } from '../api/flightsApi';
import { getAirportSuggestionsMock as getAirportSuggestions } from '../api/flightsApi';

import { mockFlightResults } from '@/mock/mockFlightData';
import { AirportSuggestion } from '../types/flights';

export default function HomeScreen({ navigation }: any) {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const [fromSuggestions, setFromSuggestions] = useState<AirportSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<AirportSuggestion[]>([]);
  
  const [selectedFrom, setSelectedFrom] = useState<AirportSuggestion | null>(null);
  const [selectedTo, setSelectedTo] = useState<AirportSuggestion | null>(null);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (fromQuery.length > 1) fetchFromSuggestions();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fromQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (toQuery.length > 1) fetchToSuggestions();
    }, 300);
    return () => clearTimeout(timeout);
  }, [toQuery]);

  const fetchFromSuggestions = async () => {
    const data = await getAirportSuggestions(fromQuery);
    setFromSuggestions(data);
  };

  const fetchToSuggestions = async () => {
    const data = await getAirportSuggestions(toQuery);
    setToSuggestions(data);
  };

  const onSearch = () => {
    if (!selectedFrom || !selectedTo) return;
    console.log('From:', selectedFrom);
    console.log('To:', selectedTo);

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where are you flying?</Text>

      <Text style={styles.label}>From</Text>
      <TextInput
        style={styles.input}
        placeholder="Chennai"
        value={fromQuery}
        onChangeText={setFromQuery}
      />
      {fromSuggestions.length > 0 && (
        <FlatList
          data={fromSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                setSelectedFrom(item);
                setFromQuery(`${item.name} (${item.iata_code})`);
                setFromSuggestions([]);
                Keyboard.dismiss();
              }}>
              <Text>{item.name} ({item.iata_code}) - {item.city}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.label}>To</Text>
      <TextInput
        style={styles.input}
        placeholder="Delhi"
        value={toQuery}
        onChangeText={setToQuery}
      />
      {toSuggestions.length > 0 && (
        <FlatList
          data={toSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => {
                setSelectedTo(item);
                setToQuery(`${item.name} (${item.iata_code})`);
                setToSuggestions([]);
                Keyboard.dismiss();
              }}>
              <Text>{item.name} ({item.iata_code}) - {item.city}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>🔍 Search Flights</Text>
      </TouchableOpacity>

      {mockFlightResults.length > 0 && (
  <View style={{ marginTop: 30 }}>
    <Text style={styles.label}>Flight Results</Text>
    <FlatList
      data={mockFlightResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.airline}>{item.airline}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
          <Text>{item.departure_time} → {item.arrival_time} | {item.duration}</Text>
          <Text>Stops: {item.stops === 0 ? 'Non-stop' : `${item.stops} stop(s)`}</Text>
        </View>
      )}
    />
  </View>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 15, marginBottom: 5, fontWeight: '500' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12,
    borderRadius: 8, backgroundColor: '#f9f9f9'
  },
  suggestion: {
    padding: 10, backgroundColor: '#eee',
    borderBottomWidth: 1, borderColor: '#ddd'
  },
  button: {
    marginTop: 30, backgroundColor: '#007AFF',
    padding: 16, borderRadius: 8
  },
  buttonText: {
    color: '#fff', textAlign: 'center',
    fontWeight: 'bold', fontSize: 16
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  airline: { fontWeight: 'bold', fontSize: 16 },
  price: { fontWeight: 'bold', color: '#007AFF', fontSize: 16 },
  
});
