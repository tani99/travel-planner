import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function App() {
  const [trips, setTrips] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setLocation('');
    setDates('');
    setDescription('');
  };

  const addTrip = () => {
    if (!name || !location || !dates || !description) {
      alert('Please fill in all fields');
      return;
    }
    setTrips((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        location,
        dates,
        description,
      },
    ]);
    resetForm();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.tripItem}>
      <Text style={styles.tripName}>{item.name}</Text>
      <Text style={styles.tripDetail}>Location: {item.location}</Text>
      <Text style={styles.tripDetail}>Dates: {item.dates}</Text>
      <Text style={styles.tripDetail}>{item.description}</Text>
    </View>
  );

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
          <TextInput
            placeholder="Location"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            placeholder="Dates"
            style={styles.input}
            value={dates}
            onChangeText={setDates}
          />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
