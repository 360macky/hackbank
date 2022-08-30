import { Alert, Platform } from 'react-native';

const showAlert = Platform.OS === 'web' ? alert : Alert.alert;

export default showAlert;
