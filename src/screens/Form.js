import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import FormLogo from '../../assets/FormLogo';
import ArrowForm from '../../assets/ArrowForm';
import Explore from '../../assets/Explore';
import SelectDropdown from 'react-native-select-dropdown';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

function Form({ navigation }) {
  const [inputBank, setInputBank] = useState('');
  const [outputBank, setOutputBank] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({ RobotoMono_400Regular });
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const BANKS = [
    { label: 'Interbank', value: 'IBK' },
    { label: 'BCP', value: 'BCP' },
    { label: 'BBVA', value: 'BBV' },
    { label: 'Scotiabank', value: 'SCO' },
  ];

  const BANKS_NAMES = ['Interbank', 'BCP', 'BBVA', 'Scotiabank'];

  /**
   * Returns the first letter of a string.
   * https://stackoverflow.com/a/72672542/10576458
   */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  /**
   * Returns the string date from the current time.
   * This string will look different on iOS and Android.
   * https://stackoverflow.com/a/37271708/10576458
   * https://github.com/facebook/react-native/issues/28097#issuecomment-587967762
   * @returns {string} StringDate
   */
  const getCurrentStringDate = () => {
    let currentTime = new Date();
    const currentStringDate = capitalizeFirstLetter(
      currentTime.toLocaleDateString('es-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Lima',
      })
    );
    return currentStringDate;
  };
  const handleBankInput = (selectedBank) => {
    setInputBank(selectedBank.value);
  };
  const handleAmountInput = (value) => {
    setInputAmount(value);
  };
  const handleBankOutput = (selectedBank) => {
    setOutputBank(selectedBank.value);
  };

  const VALIDATE_INPUT_MESSAGES = {
    INPUT_BANK_EMPTY: {
      title: 'No has definido un banco de origen',
      description: 'Rellena el campo antes de continuar',
    },
    OUTPUT_BANK_EMPTY: {
      title: 'No has definido un banco de destino',
      description: 'Rellena el campo antes de continuar',
    },
    INPUT_AMOUNT_EMPTY: {
      title: 'No has definido el monto a transferir',
      description: 'Rellena el campo antes de continuar',
    },
    SAME_BANKS: {
      title:
        'Por ahora no puedes seleccionar el mismo banco de origen y destino',
      description:
        'Lo más probable es que se trate de una transferencia gratuita e inmediata',
    },
  };

  const handlePredict = (navigation) => {
    const predictionInputs = {
      inputBank,
      outputBank,
      inputAmount: Number(inputAmount),
    };

    if (inputBank === '') {
      Alert.alert(
        VALIDATE_INPUT_MESSAGES.INPUT_BANK_EMPTY.title,
        VALIDATE_INPUT_MESSAGES.INPUT_BANK_EMPTY.description
      );
    } else if (outputBank === '') {
      Alert.alert(
        VALIDATE_INPUT_MESSAGES.OUTPUT_BANK_EMPTY.title,
        VALIDATE_INPUT_MESSAGES.OUTPUT_BANK_EMPTY.description
      );
    } else if (inputAmount === '') {
      Alert.alert(
        VALIDATE_INPUT_MESSAGES.INPUT_AMOUNT_EMPTY.title,
        VALIDATE_INPUT_MESSAGES.INPUT_AMOUNT_EMPTY.description
      );
    } else if (inputBank === outputBank) {
      Alert.alert(
        VALIDATE_INPUT_MESSAGES.SAME_BANKS.title,
        VALIDATE_INPUT_MESSAGES.SAME_BANKS.description
      );
    } else {
      navigation.navigate('Prediction', predictionInputs);
    }
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#006C4B' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: '#006C4B' }]}
          onLayout={onLayoutRootView}
        >
          <FormLogo width={44} height={65.6} />
          <View style={styles.formContainer}>
            <Text style={styles.helloText}>¡Hola! Hoy es</Text>
            <View style={styles.currentDate}>
              <Text style={styles.currentDateText}>
                {getCurrentStringDate()}
              </Text>
            </View>
            {Platform.OS === 'ios' ? (
              <SelectDropdown
                data={BANKS_NAMES}
                onSelect={(selectedItem) => {
                  let selectedValue = BANKS.find(
                    (bank) => bank.label === selectedItem
                  );
                  handleBankInput(selectedValue);
                }}
                defaultButtonText="Banco de origen"
                buttonStyle={{
                  backgroundColor: '#ffffff',
                  width: '100%',
                  borderRadius: 13,
                }}
                buttonTextStyle={{
                  fontSize: 16,
                  fontFamily: 'RobotoMono_400Regular',
                  color: '#006C4B',
                }}
                dropdownStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 13,
                }}
                rowTextStyle={{
                  fontSize: 16,
                  fontFamily: 'RobotoMono_400Regular',
                }}
                selectedRowTextStyle={{
                  color: '#006C4B',
                }}
              />
            ) : (
              <View
                style={{
                  borderRadius: 13,
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  padding: 8,
                }}
              >
                <Picker
                  selectedValue={inputBank}
                  onValueChange={(itemValue) => {
                    handleBankInput({ value: itemValue });
                  }}
                  style={{
                    color: '#006C4B',
                    fontFamily: 'RobotoMono_400Regular',
                    textAlign: 'center',
                  }}
                >
                  <Picker.Item label="Banco de origen" value={''} />
                  {BANKS.map((bank, bankIndex) => (
                    <Picker.Item
                      key={bankIndex}
                      label={bank.label}
                      value={bank.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
            <TextInput
              value={inputAmount}
              onChangeText={handleAmountInput}
              style={styles.inputAmount}
              autoComplete="off"
              keyboardType="numeric"
              placeholder="S/ 000.00"
              textAlign={'right'}
              placeholderTextColor="#CFE8D9"
            />
            <View style={styles.formArrowContainer}>
              <ArrowForm width={103} />
            </View>

            {Platform.OS == 'ios' ? (
              <SelectDropdown
                data={BANKS_NAMES}
                onSelect={(selectedItem) => {
                  handleBankOutput(
                    BANKS.find((bank) => bank.label === selectedItem)
                  );
                }}
                defaultButtonText="Banco de destino"
                buttonStyle={{
                  backgroundColor: '#ffffff',
                  width: '100%',
                  borderRadius: 13,
                }}
                buttonTextStyle={{
                  fontSize: 16,
                  fontFamily: 'RobotoMono_400Regular',
                  color: '#006C4B',
                }}
                dropdownStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 13,
                }}
                rowTextStyle={{
                  fontSize: 16,
                  fontFamily: 'RobotoMono_400Regular',
                }}
                selectedRowTextStyle={{
                  color: '#006C4B',
                }}
              />
            ) : (
              <View
                style={{
                  borderRadius: 13,
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  padding: 8,
                }}
              >
                <Picker
                  selectedValue={outputBank}
                  onValueChange={(itemValue) => {
                    handleBankOutput({ value: itemValue });
                  }}
                  style={{
                    color: '#006C4B',
                    fontFamily: 'RobotoMono_400Regular',
                    textAlign: 'center',
                  }}
                >
                  <Picker.Item label="Banco de destino" value={''} />
                  {BANKS.map((bank, bankIndex) => (
                    <Picker.Item
                      key={bankIndex}
                      label={bank.label}
                      value={bank.value}
                    />
                  ))}
                </Picker>
              </View>
            )}

            <Pressable
              title="Predecir"
              onPress={() => handlePredict(navigation)}
              accesibilityLabel="Predecir"
              style={({ pressed }) => [
                styles.predictButton,
                { backgroundColor: pressed ? '#00442F' : '#006C4B' },
              ]}
            >
              <Text style={styles.predictButtonText}>Predecir</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              title="Acerca de Hackbank"
              accesibilityLabel="Acerca de Hackbank"
              onPress={() => {
                navigation.navigate('Acerca de');
              }}
            >
              <View style={styles.exploreButton}>
                <Explore width={68} height={68} />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

Form.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: '#006C4B',
  },
  helloText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#CFE8D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#CFE8D9',
    padding: 20,
    margin: 20,
    borderRadius: 25,
    width: '80%',
  },
  formLogo: {
    width: 44,
    height: 65.6,
  },
  formArrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  currentDate: {
    backgroundColor: '#4D6358',
    borderRadius: 19,
    paddingLeft: 39,
    paddingRight: 39,
    paddingTop: 9,
    paddingBottom: 9,
    marginBottom: 8,
  },
  currentDateText: {
    color: '#6AFCC3',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectorContainerIOS: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 13,
    alignText: 'center',
  },
  selectorContainerAndroid: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingLeft: 28,
    paddingRight: 28,
    borderRadius: 13,
    alignText: 'center',
  },
  selector: {
    color: '#000000',
    alignText: 'center',
  },
  selectorAndroid: {
    width: '100%',
  },
  inputAmount: {
    fontSize: 36,
    marginTop: 8,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    fontFamily: 'RobotoMono_400Regular',
  },
  predictButton: {
    marginTop: 8,
    color: '#FFFFFF',
    borderRadius: 22,
    paddingTop: 8,
    paddingBottom: 8,
  },
  predictButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'RobotoMono_400Regular',
  },
  exploreButton: {
    backgroundColor: '#6AFCC3',
    padding: 10,
    borderRadius: 100,
  },
});

export default Form;
