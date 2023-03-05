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
  Platform,
} from 'react-native';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import PropTypes from 'prop-types';
import * as Linking from 'expo-linking';

import FormLogo from '../../assets/FormLogo';

import { color } from '../ui';

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
    if (Platform.OS === 'web') {
      if (type === 'email') {
        location.href = `mailto:${url}`;
      } else {
        window.open(url, '_blank');
      }
    } else {
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
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.dark }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: color.dark }]}
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
                { backgroundColor: pressed ? '#C7F1E4' : color.dark },
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
                { backgroundColor: pressed ? '#C7F1E4' : color.dark },
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
                { backgroundColor: pressed ? '#C7F1E4' : color.dark },
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
                { backgroundColor: pressed ? '#CFE8D9' : '#FFFFFF' },
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
    color: '#FFFFFF',
  },
  paragraphPage: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  scrollViewContainer: {
    backgroundColor: color.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#CFE8D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    backgroundColor: color.primary,
    padding: 20,
    margin: 20,
    borderRadius: 25,
    width: '80%',
    maxWidth: 460,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 22,
    paddingTop: 8,
    paddingBottom: 8,
  },
  secondaryButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'RobotoMono_400Regular',
  },
  predictButton: {
    marginTop: 8,
    borderRadius: 22,
    paddingTop: 8,
    paddingBottom: 8,
  },
  predictButtonText: {
    color: color.primary,
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
