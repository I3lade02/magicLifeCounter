import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Modal, TextInput } from 'react-native';

export default function App() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState(Array(numPlayers).fill({ life: 40, poison: 0, name: '' }));
  const [initialLife, setInitialLife] = useState(40);
  const [tempLife, setTempLife] = useState('40');
  const [darkMode, setDarkMode] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [poisonModalVisible, setPoisonModalVisible] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);

  const updateNumPlayers = (newNum) => {
    setNumPlayers(newNum);
    setPlayers(Array(newNum).fill({ life: initialLife, poison: 0, name: '' }));
  };

  const updateLife = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].life += delta;
    setPlayers(newPlayers);
  };

  const updatePoison = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].poison += delta;
    setPlayers(newPlayers);
  };

  const resetLife = () => {
    setPlayers(players.map(player => ({ ...player, life: initialLife, poison: 0 })));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSaveSettings = () => {
    const parsedLife = parseInt(tempLife) || 40;
    setInitialLife(parsedLife);
    setPlayers(players.map(player => ({ ...player, life: parsedLife, poison: 0 })));
    setIsModalVisible(false);
  };

  const updatePlayerName = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleLifeInputChange = (text) => {
    setTempLife(text);
  };

  const openPoisonModal = (index) => {
    setCurrentPlayerIndex(index);
    setPoisonModalVisible(true);
  };

  const handlePoisonChange = (delta) => {
    if (currentPlayerIndex !== null) {
      updatePoison(currentPlayerIndex, delta);
    }
    setPoisonModalVisible(false);
  };

  const getPlayerRotation = (index) => {
    if (numPlayers === 2) {
      return index === 0 ? '180deg' : '0deg';
    }
    if (numPlayers === 3) {
      return index === 0 ? '90deg' : index === 1 ? '-90deg' : '0deg';
    }
    if (numPlayers === 4) {
      return index % 2 === 0 ? '90deg' : '-90deg';
    }
    return '0deg';
  };

  const getPlayerPosition = (index) => {
    if (numPlayers === 2) {
      return index === 0 ? styles.topHalf : styles.bottomHalf;
    }
    if (numPlayers === 3) {
      return index === 0 ? styles.topLeftQuarter
           : index === 1 ? styles.topRightQuarter
           : styles.bottomCenterHalf;
    }
    if (numPlayers === 4) {
      return index === 0 ? styles.topLeftQuarter
           : index === 1 ? styles.topRightQuarter
           : index === 2 ? styles.bottomLeftQuarter
           : styles.bottomRightQuarter;
    }
    return styles.centerPosition; // Výchozí pozice, pokud by bylo nastaveno něco jiného než 2-4 hráči
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
            <Text style={styles.saveButtonText}>Uložit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.playersContainer}>
            {players.map((player, index) => (
              <View
                key={index}
                style={[
                  styles.playerContainer,
                  { transform: [{ rotate: getPlayerRotation(index) }] },
                  getPlayerPosition(index)  // Apply position styles
                ]}
              >
                <Text style={darkMode ? styles.darkText : styles.lightText}>
                  {player.name || `Player ${index + 1}`}
                </Text>
                <Text style={styles.lifeText}>Life: {player.life}</Text>
                <Text style={styles.poisonText}>Poison: {player.poison}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => updateLife(index, 1)}>
                  <Text style={styles.buttonText}>+ Život</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => updateLife(index, -1)}>
                  <Text style={styles.buttonText}>- Život</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.poisonButton} onPress={() => openPoisonModal(index)}>
                  <Text style={styles.poisonButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetLife}>
        <Text style={styles.resetButtonText}>Resetovat životy a jed</Text>
      </TouchableOpacity>

      <Modal visible={poisonModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Upravit Jed pro {players[currentPlayerIndex]?.name || `Hráče ${currentPlayerIndex + 1}`}</Text>
          <View style={styles.poisonChangeContainer}>
            <TouchableOpacity onPress={() => handlePoisonChange(1)} style={styles.poisonChangeButton}>
              <Text style={styles.poisonChangeText}>Přidat Jed</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePoisonChange(-1)} style={styles.poisonChangeButton}>
              <Text style={styles.poisonChangeText}>Odebrat Jed</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setPoisonModalVisible(false)}>
            <Text style={styles.closeModalText}>Zavřít</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// Stylování
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 20 },
  darkContainer: { backgroundColor: '#333' },
  lightContainer: { backgroundColor: '#fff' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  darkText: { color: '#fff' },
  lightText: { color: '#000' },
  settingsButton: { padding: 10, backgroundColor: '#007BFF', borderRadius: 5, marginBottom: 20 },
  buttonText: { color: '#fff' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 24, marginBottom: 20 },
  modalLabel: { fontSize: 16, marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  playerSelection: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  playerButton: { padding: 10, borderWidth: 1, borderColor: '#007BFF', borderRadius: 5 },
  selectedButton: { backgroundColor: '#007BFF' },
  playerInputContainer: { marginBottom: 10 },
  saveButton: { padding: 10, backgroundColor: '#28A745', borderRadius: 5, marginTop: 20 },
  saveButtonText: { color: '#fff' },
  playersContainer: { flex: 1, width: '100%', alignItems: 'center' },
  playerContainer: { width: '40%', padding: 20, backgroundColor: '#f7f7f7', borderRadius: 10, marginVertical: 10, alignItems: 'center' },
  lifeText: { fontSize: 18 },
  poisonText: { fontSize: 18 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { flex: 1, padding: 10, backgroundColor: '#007BFF', borderRadius: 5, marginHorizontal: 5 },
  poisonButton: { padding: 10, backgroundColor: '#6C757D', borderRadius: 5 },
  poisonButtonText: { color: '#fff' },
  resetButton: { padding: 15, backgroundColor: '#FFC107', borderRadius: 5, marginVertical: 20 },
  resetButtonText: { color: '#fff' },
  poisonChangeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  poisonChangeButton: { padding: 10, backgroundColor: '#17A2B8', borderRadius: 5, marginHorizontal: 10 },
  poisonChangeText: { color: '#fff' },
  closeModalButton: { padding: 10, backgroundColor: '#DC3545', borderRadius: 5, marginTop: 20 },
  closeModalText: { color: '#fff' },
  topHalf: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '90%' },
  bottomHalf: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '90%' },
  topLeftQuarter: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '50%', position: 'absolute', top: 0, left: 0 },
  topRightQuarter: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '50%', position: 'absolute', top: 0, right: 0 },
  bottomCenterHalf: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', position: 'absolute', bottom: 70, width: '90%'},
  bottomLeftQuarter: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '50%', position: 'absolute', bottom: 0, left: 0 },
  bottomRightQuarter: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '50%', position: 'absolute', bottom: 0, right: 0 },
  centerPosition: { alignSelf: 'center' }, // Výchozí pozice
});
