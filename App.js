import React, { useEffect, useState }, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform, Button,
  FlatList,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import AuthScreen from './AuthScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  if (!user) {
    return <AuthScreen />;
  }

  const [trips, setTrips] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  const resetForm = () => {
    setName('');
    setLocation('');
    setStartDate(null);
    setEndDate(null);
    setDescription('');
  };

  const formatDate = (date) =>
    date ? date.toLocaleDateString() : '';

  const addTrip = () => {
    if (!name || !location || !startDate || !endDate || !description) {
      alert('Please fill in all fields');
      return;
    }
    setTrips((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        location,
        startDate,
        endDate,
        description,
      },
    ]);
    resetForm();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => setSelectedTrip(item)}
    >
      <Text style={styles.tripName}>{item.name}</Text>
      <Text style={styles.tripDetail}>Location: {item.location}</Text>
      <Text style={styles.tripDetail}>
        Dates: {formatDate(item.startDate)} - {formatDate(item.endDate)}
      </Text>
    </TouchableOpacity>
  );

  if (selectedTrip) {
    return (
      <View style={styles.container}>
        <Text style={styles.tripName}>{selectedTrip.name}</Text>
        <Text style={styles.tripDetail}>Location: {selectedTrip.location}</Text>
        <Text style={styles.tripDetail}>
          Dates: {formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}
        </Text>
        <Text style={styles.tripDetail}>{selectedTrip.description}</Text>
        <Button title="Back" onPress={() => setSelectedTrip(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Travel Planner! 🎉</Text>

      {trips.length === 0 ? (
        <Text style={styles.noTrips}>No trips planned yet.</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Trip</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>New Trip</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <GooglePlacesAutocomplete
            placeholder="Search location"
            onPress={(data) => setLocation(data.description)}
            query={{ key: 'YOUR_GOOGLE_API_KEY', language: 'en' }}
            styles={{ textInput: styles.input }}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowStartPicker(true)}
          >
            <Text>{startDate ? formatDate(startDate) : 'From Date'}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowEndPicker(true)}
          >
            <Text>{endDate ? formatDate(endDate) : 'To Date'}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}
          <TextInput
            placeholder="Description"
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            />
            <Button title="Add" onPress={addTrip} />
          </View>
        </ScrollView>
      </Modal>

      <Text style={styles.platform}>Running on: {Platform.OS}</Text>
      <Button title="Sign Out" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  platform: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  list: {
    width: '100%',
  },
  tripItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripDetail: {
    fontSize: 14,
    marginTop: 4,
  },
  noTrips: {
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    backgroundColor: '#1e90ff',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
});
