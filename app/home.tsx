import ProfileHeader from '@/components/ProfileHeader';
import { auth } from '@/config';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { getAirportSuggestions, searchFlights } from '../api/flightsApi';
import { AirportSuggestion, FlightResult } from '../types/flights';

import { LogBox } from 'react-native';

// Suppress all warnings (use cautiously)
LogBox.ignoreAllLogs();

export default function HomeScreen({ navigation }: any) {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<AirportSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<AirportSuggestion[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<AirportSuggestion | null>(null);
  const [selectedTo, setSelectedTo] = useState<AirportSuggestion | null>(null);
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState<'economy' | 'premium' | 'business' | 'first'>('economy');
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [flightResults, setFlightResults] = useState<FlightResult[] | null>(null);
  const [loading, setLoading] = useState(false);

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

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const onSearch = async () => {
    if (!selectedFrom || !selectedTo) {
      Alert.alert('Error', 'Please select origin and destination airports.');
      return;
    }
    setLoading(true);
    try {
      const results = await searchFlights(
        selectedFrom,
        selectedTo,
        formatDate(departureDate),
        formatDate(returnDate),
        passengers.adults,
        passengers.children,
        passengers.infants,
        travelClass
      );
      console.log("home results", results)
      setFlightResults(results.length>0?results:[]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message.includes('CAPTCHA')
          ? 'Flight search blocked by CAPTCHA. Please try again later or contact support.'
          : error.message || 'Failed to fetch flights. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // const testSearch = async () => {
  //   setSelectedFrom({
  //     id: '27544008',
  //     name: 'London',
  //     city: 'London',
  //     iata_code: 'LOND',
  //     country_name: 'United Kingdom',
  //     entityId: '27544008',
  //   });
  //   setSelectedTo({
  //     id: '27537542',
  //     name: 'New York',
  //     city: 'New York',
  //     iata_code: 'NYCA',
  //     country_name: 'United States',
  //     entityId: '27537542',
  //   });
  //   await onSearch();
  // };

  const updatePassengers = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setPassengers((prev) => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      if (type === 'adults' && newCount === 0) return prev;
      if (type === 'infants' && newCount > prev.adults) return prev;
      return { ...prev, [type]: newCount };
    });
  };


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUserEmail');
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ProfileHeader onLogout={handleLogout} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.header}>
          <Text style={styles.title}>My Flight 360</Text>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setTripType('oneway')}
              style={[styles.tab, tripType === 'oneway' && styles.tabSelected]}
            >
              <Text style={[styles.tabText, tripType === 'oneway' && styles.tabTextSelected]}>One-way</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTripType('roundtrip')}
              style={[styles.tab, tripType === 'roundtrip' && styles.tabSelected]}
            >
              <Text style={[styles.tabText, tripType === 'roundtrip' && styles.tabTextSelected]}>Round-trip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="airplane-takeoff" size={24} color="#5f6368" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Where from?"
              value={fromQuery}
              onChangeText={setFromQuery}
            />
          </View>
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
                  }}
                >
                  <Text style={styles.suggestionText}>
                    {item.name} ({item.iata_code}) - {item.city}, {item.country_name}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionList}
            />
          )}

          <View style={styles.inputContainer}>
            <Icon name="airplane-landing" size={24} color="#5f6368" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Where to?"
              value={toQuery}
              onChangeText={setToQuery}
            />
          </View>
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
                  }}
                >
                  <Text style={styles.suggestionText}>
                    {item.name} ({item.iata_code}) - {item.city}, {item.country_name}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionList}
            />
          )}

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.dateInput]}>
              <Icon name="calendar" size={24} color="#5f6368" style={styles.inputIcon} />
              <TouchableOpacity
                onPress={() => setShowDeparturePicker(true)}
                style={styles.dateTouchable}
              >
                <Text style={styles.dateText}>{departureDate.toDateString()}</Text>
              </TouchableOpacity>
              {showDeparturePicker && (
                <DateTimePicker
                  value={departureDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || departureDate;
                    setShowDeparturePicker(false);
                    setDepartureDate(currentDate);
                  }}
                />
              )}
            </View>
            {tripType === 'roundtrip' && (
              <View style={[styles.inputContainer, styles.dateInput]}>
                <Icon name="calendar" size={24} color="#5f6368" style={styles.inputIcon} />
                <TouchableOpacity
                  onPress={() => setShowReturnPicker(true)}
                  style={styles.dateTouchable}
                >
                  <Text style={styles.dateText}>{returnDate.toDateString()}</Text>
                </TouchableOpacity>
                {showReturnPicker && (
                  <DateTimePicker
                    value={returnDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || returnDate;
                      setShowReturnPicker(false);
                      setReturnDate(currentDate);
                    }}
                  />
                )}
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Icon name="account" size={24} color="#5f6368" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.dateTouchable}
                onPress={() => setShowPassengerModal(true)}
              >
                <Text style={styles.dateText}>
                  {passengers.adults} Adult{passengers.adults !== 1 ? 's' : ''}, {passengers.children} Child{passengers.children !== 1 ? 'ren' : ''}, {passengers.infants} Infant{passengers.infants !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Picker
                selectedValue={travelClass}
                onValueChange={(itemValue) => setTravelClass(itemValue)}
                style={styles.picker}
                dropdownIconColor="#5f6368"
              >
                <Picker.Item label="Economy" value="economy" />
                <Picker.Item label="Premium Economy" value="premium" />
                <Picker.Item label="Business" value="business" />
                <Picker.Item label="First" value="first" />
              </Picker>
            </View>
          </View>

          <Modal
            visible={showPassengerModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPassengerModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Passengers</Text>

                <View style={styles.passengerRow}>
                  <Text style={styles.passengerLabel}>Adults (12+ yrs)</Text>
                  <View style={styles.counter}>
                    <Pressable
                      onPress={() => updatePassengers('adults', false)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.counterValue}>{passengers.adults}</Text>
                    <Pressable
                      onPress={() => updatePassengers('adults', true)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.passengerRow}>
                  <Text style={styles.passengerLabel}>Children (2-11 yrs)</Text>
                  <View style={styles.counter}>
                    <Pressable
                      onPress={() => updatePassengers('children', false)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.counterValue}>{passengers.children}</Text>
                    <Pressable
                      onPress={() => updatePassengers('children', true)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.passengerRow}>
                  <Text style={styles.passengerLabel}>Infants (0-2 yrs)</Text>
                  <View style={styles.counter}>
                    <Pressable
                      onPress={() => updatePassengers('infants', false)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.counterValue}>{passengers.infants}</Text>
                    <Pressable
                      onPress={() => updatePassengers('infants', true)}
                      style={styles.counterButton}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowPassengerModal(false)}
                >
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={loading ? [styles.searchButton, {"backgroundColor":'gray'}] : styles.searchButton} onPress={onSearch}>
            <Text style={{...styles.searchButtonText}}>{!loading ?  "Search flights": "Please Wait..."}</Text>
          </TouchableOpacity>
        </View>

        {flightResults!=null && flightResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Flight Results</Text>
            <FlatList
              data={flightResults}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.flightCard} key={item.id}>
                  <View style={styles.flightRow}>
                    <Text style={styles.airline}>{item.airline}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                  </View>
                  <Text style={styles.flightDetails}>
                    {item.departure_time} → {item.arrival_time} | {item.duration}
                  </Text>
                  <Text style={styles.flightDetails}>
                    Stops: {item.stops === 0 ? 'Non-stop' : `${item.stops} stop(s)`}
                  </Text>
                </View>
              )}
            />
          </View>

        )}
        {flightResults!=null && flightResults.length==0 && <Text style={{textAlign:'center',fontWeight:'800'}}>Sorry, No flights found!</Text>}
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
    fontFamily: 'Roboto',
  },
  searchCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f1f3f4',
  },
  tabSelected: {
    backgroundColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    color: '#202124',
    fontFamily: 'Roboto',
  },
  tabTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto',
  },
  suggestionList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  suggestionText: {
    fontSize: 14,
    color: '#202124',
    fontFamily: 'Roboto',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  dateTouchable: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto',
  },
  picker: {
    flex: 1,
    color: '#202124',
    fontFamily: 'Roboto',
    height: 'auto',
    textOverflow: 'auto',
    width: '100%'
  },
  searchButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  resultsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 12,
    fontFamily: 'Roboto',
  },
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  airline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    fontFamily: 'Roboto',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a73e8',
    fontFamily: 'Roboto',
  },
  flightDetails: {
    fontSize: 14,
    color: '#5f6368',
    fontFamily: 'Roboto',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 16,
    fontFamily: 'Roboto',
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerLabel: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  counterButtonText: {
    fontSize: 20,
    color: '#202124',
    fontFamily: 'Roboto',
  },
  counterValue: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto',
    width: 40,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },



  safeArea: {
    flex: 1,
  },
});

