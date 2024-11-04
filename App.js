import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Modal } from 'react-native';

export default function App() {
  const initialLife = 40;
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState(Array(numPlayers).fill(initialLife));
  const [darkMode, setDarkMode] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Stavební proměnná pro modal

  const updateNumPlayers = (newNum) => {
    setNumPlayers(newNum);
    setPlayers(Array(newNum).fill(initialLife));
  };

  const updateLife = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index] += delta;
    setPlayers(newPlayers);
  };

  const resetLife = () => {
    setPlayers(Array(numPlayers).fill(initialLife));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Dynamické styly rozložení a rotace hráčů
  const getPlayerContainerStyle = (index) => {
    let rotation = '0deg'; // Výchozí rotace
    let containerStyle = styles.playerContainer; // Výchozí styl pro kontejner

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
      containerStyle = styles.quarterContainer; // Čtvrtina obrazovky pro každého hráče

      // Rotace pro 4 hráče
      switch (index) {
        case 0:
          rotation = '90deg'; // Hráč 1 otočený o 90°
          break;
        case 1:
          rotation = '270deg'; // Hráč 2 otočený o 270°
          break;
        case 2:
          rotation = '90deg'; // Hráč 3 otočený o 90°
          break;
        case 3:
          rotation = '270deg'; // Hráč 4 otočený o 270°
          break;
      }
    }

    return [containerStyle, { transform: [{ rotate: rotation }] }];
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.switchContainer}>
        <Text style={darkMode ? styles.darkText : styles.lightText}>Tmavý režim</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Tlačítko pro nastavení pod switch */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Nastavení</Text>
      </TouchableOpacity>

      {/* Modální okno pro nastavení */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Vyberte počet hráčů:</Text>
            {/* Přidání mezery mezi tlačítka */}
            {[2, 3, 4].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.playerButton, numPlayers === num && styles.selectedButton, styles.playerButtonMargin]}
                onPress={() => {
                  updateNumPlayers(num);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>{num} hráči</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.resetButton} onPress={() => { resetLife(); setModalVisible(false); }}>
              <Text style={styles.resetButtonText}>Resetovat životy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Zavřít</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dynamické rozložení hráčů */}
      <View style={styles.playersContainer}>
        {players.map((life, index) => (
          <View key={index} style={[styles.playerContainer, getPlayerContainerStyle(index)]}>
            <Text style={darkMode ? styles.darkText : styles.lightText}>Hráč {index + 1}</Text>
            <Text style={styles.lifeText}>{life}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={() => updateLife(index, 1)}>
                <Text style={styles.buttonText}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => updateLife(index, -1)}>
                <Text style={styles.buttonText}>-1</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20, // Přidání mezery pod switch
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Poloprůhledné pozadí
  },
  modalView: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
  },
  playerSelection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  playerButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#FFD700',
  },
  playerButtonMargin: {
    marginBottom: 10, // Přidání mezery mezi tlačítka
  },
  playersContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerContainer: {
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 24,
    color: '#FFF',
  },
  lifeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  resetButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
  darkText: {
    color: '#FFF',
  },
  lightText: {
    color: '#333',
  },
  centeredHalfHeight: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfHeight: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quarterContainer: {
    height: '50%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
