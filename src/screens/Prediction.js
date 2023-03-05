import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import PredictionLogo from '../../assets/FormLogo';
import LinePrediction from '../../assets/LinePrediction';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  RobotoMono_400Regular,
  RobotoMono_700Bold,
} from '@expo-google-fonts/roboto-mono';

import checkTimeRange from '../utils/checkTimeRange';
import getCurrencyFormatted from '../utils/getCurrencyFormatted';
import getFormattedNumber from '../utils/getFormattedNumber';
import isTodayABusinessDay from '../utils/isTodayABusinessDay';
import TRCData from '../data/trc.json';

import { color } from '../ui';

function Prediction({ route, navigation }) {
  const [predictionList, setPredictionList] = useState([]);
  const [inputBankName, setInputBankName] = useState('');
  const [inputBankAccountType, setInputBankAccountType] = useState('');
  const [outputBankAccountType, setOutputBankAccountType] = useState('');
  const [outputBankName, setOutputBankName] = useState('');
  const [inputBankQuantity, setInputBankQuantity] = useState('');
  const [outputBankQuantity, setOutputBankQuantity] = useState('');
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while loading fonts.
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({ RobotoMono_400Regular, RobotoMono_700Bold });
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

  /**
   * Returns the current hour in 24-hours format like 13:00.
   * @returns {string} Current hour
   */
  const getCurrentHour = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString('es-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Returns a prediction or list of predictions based on the current date.
   * @param {object} restrictDate
   * @param {object} businessDateInteraction
   * @returns {any}
   */
  const getTimePrediction = (restrictDate, businessDateInteraction) => {
    let currentHour = getCurrentHour();

    let businessDateDescription = '';
    if (businessDateInteraction.isBusinessRestrictionEnabled) {
      if (businessDateInteraction.isTodayABusinessDay) {
        businessDateDescription = ' (de Lunes a Viernes)';
      }
    }

    // Check if currentHour is in between the start/end hours.
    for (let i = 0; i < restrictDate.hours.length; i++) {
      if (
        checkTimeRange(
          restrictDate.hours[i].start,
          restrictDate.hours[i].end,
          currentHour
        )
      ) {
        let descriptionRestriction;
        switch (restrictDate.hours[i].type) {
          case 'deferred_cut':
            descriptionRestriction = `El servicio puede estar interrumpido${businessDateDescription} desde las ${restrictDate.hours[i].start} hasta las ${restrictDate.hours[i].end}.`;
            break;
          default:
            break;
        }
        let currentPrediction = {
          description: descriptionRestriction,
          quantity: `${restrictDate.hours[i].start} - ${restrictDate.hours[i].end}`,
        };
        return currentPrediction;
      }
    }
  };

  /**
   * Hook that generates the prediction list from the TRC data.
   */
  const generatePredictionList = useCallback(() => {
    let inputBank = route.params.inputBank;
    let outputBank = route.params.outputBank;
    let inputAmount = route.params.inputAmount;
    let outputAmount = inputAmount;
    let trcMatch = TRCData.find(
      (trcRow) =>
        trcRow.inputBank === inputBank && trcRow.outputBank === outputBank
    );
    setInputBankName(trcMatch.inputBankName);
    setOutputBankName(trcMatch.outputBankName);
    setInputBankAccountType(trcMatch.inputBankAccountType);
    setOutputBankAccountType(trcMatch.outputBankAccountType);
    setInputBankQuantity(getFormattedNumber(inputAmount));

    // Check amount
    let restrictAmounts = trcMatch.restrictAmounts;
    // TODO: Here's an idea, should I apply Array.prototype.filter instead?
    // TODO: Move "maximum" and similar strings to an external file (as CONSTs).
    let localPredictionList = [];
    restrictAmounts.map((restriction) => {
      if (inputAmount >= restriction.amount) {
        if (restriction.type === 'maximum') {
          let currentPrediction = {
            description: `Máximo monto excedido en S/${restriction.amount}`,
            quantity: `${getCurrencyFormatted(restriction.currency)}${
              restriction.amount
            }`,
          };
          localPredictionList.push(currentPrediction);
        }
        if (restriction.type === 'commission') {
          if (inputAmount > restriction.amount) {
            let currentPrediction = {
              description: restriction.description,
              quantity: `${getCurrencyFormatted(restriction.currency)}${
                restriction.commission
              }`,
            };
            localPredictionList.push(currentPrediction);
            outputAmount = outputAmount - restriction.commission;
          }
        }
      }
    });

    // Check date
    let restrictDate = trcMatch.restrictDate;
    if (restrictDate) {
      let businessDateInteraction = {
        isBusinessRestrictionEnabled: restrictDate.days === 'BUSINESS',
      };
      if (businessDateInteraction.isBusinessRestrictionEnabled) {
        businessDateInteraction.isTodayABusinessDay = isTodayABusinessDay();
      }

      const datePrediction = getTimePrediction(
        restrictDate,
        businessDateInteraction
      );
      if (datePrediction) {
        localPredictionList.push(datePrediction);
      }
    }

    setPredictionList([...predictionList, ...localPredictionList]);
    setOutputBankQuantity(getFormattedNumber(outputAmount));
  }, []);

  useEffect(() => {
    generatePredictionList();
  }, [generatePredictionList]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.dark }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: color.dark }]}
          onLayout={onLayoutRootView}
        >
          <PredictionLogo width={44} height={65.6} />
          <View style={styles.formContainer}>
            <Text style={styles.predictionText}>Resultado</Text>
            <View style={styles.inputResultContainer}>
              <View style={styles.inputResultBankName}>
                <Text style={styles.inputResultBankNameText}>
                  {inputBankName}
                </Text>
              </View>
              <View style={styles.inputResultAccountType}>
                <Text style={styles.inputResultAccountTypeText}>
                  {inputBankAccountType}
                </Text>
              </View>
              <View style={styles.inputResultAmount}>
                <Text style={styles.inputResultAmountText}>
                  {inputBankQuantity}
                </Text>
              </View>
            </View>
            {/* List of restrictions calculated based on TRC */}
            <View style={styles.arrowContentContainer}>
              {predictionList.map((prediction, index) => (
                <View key={index}>
                  <View style={styles.restrictionContainer}>
                    <View style={styles.restrictionDescriptionContainer}>
                      <Text style={styles.restrictionDescription}>
                        {prediction.description}
                      </Text>
                    </View>
                    <View style={styles.restrictionInfoContainer}>
                      <Text style={styles.restrictionInfo}>
                        {prediction.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.linePredictionContainer}>
              <LinePrediction height={42} />
            </View>
            {/* Second output with result */}
            <View style={styles.outputResultContainer}>
              <View style={styles.inputResultBankName}>
                <Text style={styles.inputResultBankNameText}>
                  {outputBankName}
                </Text>
              </View>
              <View style={styles.inputResultAccountType}>
                <Text style={styles.inputResultAccountTypeText}>
                  {outputBankAccountType}
                </Text>
              </View>
              <View style={styles.inputResultAmount}>
                <Text style={styles.inputResultAmountText}>
                  {outputBankQuantity}
                </Text>
              </View>
            </View>
            {predictionList.length === 0 && (
              <View style={{ padding: 12, fontSize: 16 }}>
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#FFFFFF' }}>
                  ¡Genial! No encontramos restricciones, límites o comisiones
                  para una transferencia al enviar {inputBankQuantity} de{' '}
                  {inputBankName} a {outputBankName}.
                </Text>
              </View>
            )}
            <Pressable
              title="Editar"
              onPress={() => {
                navigation.goBack();
              }}
              accesibilityLabel="Editar"
              style={({ pressed }) => [
                styles.returnButton,
                { backgroundColor: pressed ? '#00442F' : '#006C4B' },
              ]}
            >
              <Text style={styles.returnButtonText}>Editar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

Prediction.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  predictionText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 20,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#019468',
    alignItems: 'center',
    paddingTop: 40,
  },
  formContainer: {
    backgroundColor: '#019468',
    padding: 20,
    margin: 20,
    borderRadius: 25,
    width: '80%',
    maxWidth: 460,
  },
  inputResultContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderRadius: 14,
  },
  outputResultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  inputResultBankName: {
    backgroundColor: '#4D6358',
    borderTopStartRadius: 14,
    borderTopEndRadius: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
  inputResultBankNameText: {
    color: '#6AFCC3',
    textAlign: 'center',
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 16,
  },
  inputResultAccountType: {
    backgroundColor: '#C1E8FB',
    paddingTop: 3,
    paddingBottom: 3,
  },
  inputResultAccountTypeText: {
    color: '#006C4B',
    textAlign: 'center',
    fontFamily: 'RobotoMono_400Regular',
  },
  inputResultAmount: {},
  inputResultAmountText: {
    color: '#006C4B',
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'RobotoMono_400Regular',
  },
  arrowContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  restrictionDescriptionContainer: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  restrictionInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },
  restrictionInfo: {
    textAlign: 'center',
    color: '#3E6374',
    fontFamily: 'RobotoMono_700Bold',
    fontSize: 22,
    alignItems: 'center',
  },
  restrictionDescription: {
    textAlign: 'center',
  },
  returnButton: {
    marginTop: 8,
    color: '#FFFFFF',
    borderRadius: 22,
    paddingTop: 6,
    paddingBottom: 6,
  },
  returnButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'RobotoMono_400Regular',
  },
  restrictionContainer: {
    flexDirection: 'column-reverse',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 16,
  },
  linePredictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default Prediction;
