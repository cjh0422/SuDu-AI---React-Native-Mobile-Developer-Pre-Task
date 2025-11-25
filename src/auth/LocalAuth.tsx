// src/auth/LocalAuth.tsx
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export const authenticate = async (): Promise<boolean> => {
    try {
        // 检查设备是否支持生物识别
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            Alert.alert('无法使用生物识别', '请在系统设置中设置面容ID/指纹或密码');
            return false;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: '验证身份以进入生产管理系统',
            fallbackLabel: '使用密码',
            cancelLabel: '取消',
            disableDeviceFallback: false,
        });

        if (result.success) {
            return true;
        } else {
            Alert.alert('认证失败', '请重试');
            return false;
        }
    } catch (error) {
        Alert.alert('认证错误', '请稍后重试');
        return false;
    }
};