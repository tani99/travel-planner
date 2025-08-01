import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Button } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import AuthScreen from './AuthScreen';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {user.email}</Text>
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
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  platform: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
});
