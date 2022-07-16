import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import FormLogo from '../../assets/FormLogo';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import PropTypes from 'prop-types';
import * as Linking from 'expo-linking';

function About({ navigation }) {
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

  if (!appIsReady) {
    return null;
  }

  const handleURL = async (url, type) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(
      type === 'email' ? `mailto:${url}` : url
    );

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(type === 'email' ? `mailto:${url}` : url);
    } else {
      Alert.alert(
        `El ${type === 'email' ? 'correo' : 'enlace'} es el siguiente: ${url}`
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#006C4B' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: '#006C4B' }]}
          onLayout={onLayoutRootView}
        >
          <FormLogo width={44} height={65.6} />
          <View style={styles.pageContainer}>
            <Text style={styles.titlePage}>¡Hola! Bienvenid@ a Hackbank.</Text>

            <Text style={styles.paragraphPage}>
              Hackbank (Versión Beta) es una app que te ayudará a predecir cómo
              se comportará una transacción entre dos bancos. Por ahora sólo
              está disponible en las cuentas básicas de los 4 bancos principales
              de Perú. Próximamente podrá soportar más cuentas y más bancos.
            </Text>

            <Text style={styles.paragraphPage}>
              Aquí algunos botones y enlaces que pueden ayudarte.
            </Text>

            <Pressable
              title="Tutorial de uso"
              onPress={() => {
                handleURL('https://hackbank.app/tutorial', 'link');
              }}
              accesibilityLabel="Tutorial de uso"
              style={({ pressed }) => [
                styles.secondaryButton,
                { backgroundColor: pressed ? '#C7F1E4' : '#FFFFFF' },
              ]}
            >
              <Text style={styles.secondaryButtonText}>Tutorial de uso</Text>
            </Pressable>

            <Pressable
              title="Reportar un problema"
              onPress={() => {
                handleURL('team@hackbank.app', 'email');
              }}
              accesibilityLabel="Reportar un problema"
              style={({ pressed }) => [
                styles.secondaryButton,
                { backgroundColor: pressed ? '#C7F1E4' : '#FFFFFF' },
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                Reportar un problema
              </Text>
            </Pressable>

            <Pressable
              title="Código fuente"
              onPress={() => {
                handleURL('https://github.com/360macky/hackbank', 'url');
              }}
              accesibilityLabel="Código fuente"
              style={({ pressed }) => [
                styles.secondaryButton,
                { backgroundColor: pressed ? '#C7F1E4' : '#FFFFFF' },
              ]}
            >
              <Text style={styles.secondaryButtonText}>Código fuente</Text>
            </Pressable>

            <Pressable
              title="Volver"
              onPress={() => navigation.goBack()}
              accesibilityLabel="Volver"
              style={({ pressed }) => [
                styles.predictButton,
                { backgroundColor: pressed ? '#00442F' : '#006C4B' },
              ]}
            >
              <Text style={styles.predictButtonText}>Volver</Text>
            </Pressable>
          </View>
          <Text style={styles.versionSignature}>Hackback Version Beta</Text>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

About.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  titlePage: {
    fontSize: 20,
    marginBottom: 10,
  },
  paragraphPage: {
    fontSize: 16,
    marginBottom: 8,
  },
  scrollViewContainer: {
    backgroundColor: '#006C4B',
  },
  container: {
    flex: 1,
    backgroundColor: '#CFE8D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    backgroundColor: '#CFE8D9',
    padding: 20,
    margin: 20,
    borderRadius: 25,
    width: '80%',
  },
  secondaryButton: {
    marginTop: 8,
    color: '#006C4B',
    borderRadius: 22,
    paddingTop: 8,
    paddingBottom: 8,
  },
  secondaryButtonText: {
    color: '#006C4B',
    textAlign: 'center',
    fontSize: 18,
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
  versionSignature: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default About;
