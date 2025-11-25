// src/auth/LocalAuth.tsx
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export const authenticate = async (): Promise<boolean> => {
    try {
        // 检查设备是否支持生物识别
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            Alert.alert('Unable to use biometrics', 'Please set up Face ID/fingerprint or password in system settings.');
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Verify identity to access the PO management system',
            fallbackLabel: 'Use Password',
            cancelLabel: 'Cancel',
            disableDeviceFallback: false,
        });

        if (result.success) {
            return true;
        } else {
            Alert.alert('Authentication failed', 'Please try again');
            return false;
        }
    } catch (error) {
        Alert.alert('Authentication error', 'Please try again later');
        return false;
    }
};