import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Modal, TextInput } from 'react-native';

export default function App() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState(Array(numPlayers).fill({ life: 40, name: '' }));
  const [initialLife, setInitialLife] = useState(40);
  const [tempLife, setTempLife] = useState('40');
  const [darkMode, setDarkMode] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateNumPlayers = (newNum) => {
    setNumPlayers(newNum);
    setPlayers(Array(newNum).fill({ life: initialLife, name: '' }));
  };

  const updateLife = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].life += delta;
    setPlayers(newPlayers);
  };

  const resetLife = () => {
    setPlayers(players.map(player => ({ ...player, life: initialLife })));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSaveSettings = () => {
    const parsedLife = parseInt(tempLife) || 40;
    setInitialLife(parsedLife);
    setPlayers(players.map(player => ({ ...player, life: parsedLife })));
    setIsModalVisible(false);
  };

  const updatePlayerName = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleLifeInputChange = (text) => {
    setTempLife(text);
  }

  // Dynamické styly pro rozložení a rotaci hráčů
  const getPlayerContainerStyle = (index) => {
    let rotation = '0deg'; 
    let containerStyle = styles.playerContainer;

    if (numPlayers === 2) {
      containerStyle = styles.halfHeight;
      rotation = index === 0 ? '180deg' : '0deg';
    } else if (numPlayers === 3) {
      if (index < 2) {
        rotation = index === 0 ? '90deg' : '270deg';
      } else {
        containerStyle = styles.centeredHalfHeight;
      }
    } else if (numPlayers === 4) {
      containerStyle = styles.quarterContainer;
      rotation = index % 2 === 0 ? '90deg' : '270deg';
    }

    return [containerStyle, { transform: [{ rotate: rotation }] }];
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.switchContainer}>
        <Text style={darkMode ? styles.darkText : styles.lightText}>Tmavý režim</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Nastavení</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Nastavení hry</Text>

          <Text style={styles.modalLabel}>Počáteční životy:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={tempLife}
            onChangeText={handleLifeInputChange}
          />

          <Text style={styles.modalLabel}>Počet hráčů:</Text>
          <View style={styles.playerSelection}>
            {[2, 3, 4].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.playerButton, numPlayers === num && styles.selectedButton]}
                onPress={() => updateNumPlayers(num)}
              >
                <Text style={styles.buttonText}>{num} hráči</Text>
              </TouchableOpacity>
            ))}
          </View>

          {players.map((player, index) => (
            <View key={index} style={styles.playerInputContainer}>
              <Text style={styles.modalLabel}>Jméno hráče {index + 1}:</Text>
              <TextInput
                style={styles.input}
                value={player.name}
                onChangeText={(name) => updatePlayerName(index, name)}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Text style={styles.buttonText}>Uložit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.playersContainer}>
        {players.map((player, index) => (
          <View key={index} style={[styles.playerContainer, getPlayerContainerStyle(index)]}>
            <Text style={darkMode ? styles.darkText : styles.lightText}>{player.name || `Hráč ${index + 1}`}</Text>
            <Text style={styles.lifeText}>{player.life}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => updateLife(index, 1)}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => updateLife(index, -1)}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetLife}>
        <Text style={styles.resetButtonText}>Resetovat životy</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stylování
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 20 },
  darkContainer: { backgroundColor: '#121212' },
  lightContainer: { backgroundColor: '#F5F5F5' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  settingsButton: { backgroundColor: '#1E90FF', padding: 10, borderRadius: 5 },
  playerSelection: { flexDirection: 'row', marginBottom: 20, justifyContent: 'center' },
  playerButton: { backgroundColor: '#1E90FF', paddingVertical: 8, paddingHorizontal: 20, margin: 5, borderRadius: 5 },
  selectedButton: { backgroundColor: '#FFD700' },
  playersContainer: { flex: 1, width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
  playerContainer: { width: '50%', height: '50%', justifyContent: 'center', alignItems: 'center', padding: 10 },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
  button: { backgroundColor: '#1E90FF', paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 5, borderRadius: 5 },
  buttonText: { fontSize: 24, color: '#FFF' },
  lifeText: { fontSize: 48, fontWeight: 'bold', color: '#FFD700' },
  resetButton: { backgroundColor: '#FF4500', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginTop: 20 },
  resetButtonText: { fontSize: 18, color: '#FFF' },
  darkText: { color: '#FFF' },
  lightText: { color: '#333' },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 18, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 8, borderRadius: 5, marginBottom: 15 },
  saveButton: { backgroundColor: '#1E90FF', padding: 10, borderRadius: 5, alignItems: 'center' },
  playerInputContainer: { marginBottom: 10 },
  centeredHalfHeight: { height: '50%', width: '100%', justifyContent: 'center', alignItems: 'center' },
  halfHeight: { height: '50%', width: '100%', justifyContent: 'center', alignItems: 'center' },
  quarterContainer: { height: '50%', width: '50%', justifyContent: 'center', alignItems: 'center' },
});
