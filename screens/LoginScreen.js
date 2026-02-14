import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#004D26', '#006633', '#002211']} style={styles.fullBg}>
        <View style={styles.goldGlow} />
        
        <View style={styles.topSection}>
          <Text style={styles.preTitle}>WELCOME TO</Text>
          <Text style={styles.logoText}>PATRIOT<Text style={styles.goldText}>GO</Text></Text>
          <View style={styles.accentLine} />
          <Text style={styles.tagline}>SUSTAINABLE. SOCIAL. SEAMLESS.</Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity activeOpacity={0.9} style={styles.loginBtn} onPress={handleLogin}>
            <LinearGradient colors={['#FFCC33', '#E6B82E']} style={styles.btnGradient}>
              <Text style={styles.loginText}>START COMMUTING</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#006633" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.footerNote}>Exclusive to George Mason Students</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullBg: { flex: 1, padding: 40, justifyContent: 'space-between', paddingVertical: 100 },
  goldGlow: { position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,204,51,0.1)' },
  topSection: { marginTop: 20 },
  preTitle: { color: '#FFCC33', fontSize: 14, fontWeight: '800', letterSpacing: 4 },
  logoText: { fontSize: 56, fontWeight: '900', color: '#FFF', letterSpacing: -3, fontStyle: 'italic', marginTop: 10 },
  goldText: { color: '#FFCC33' },
  accentLine: { width: 50, height: 6, backgroundColor: '#FFCC33', marginVertical: 20, borderRadius: 3 },
  tagline: { fontSize: 12, color: '#FFF', opacity: 0.7, letterSpacing: 2, fontWeight: '600' },
  bottomSection: { alignItems: 'center' },
  loginBtn: { width: '100%', height: 70, borderRadius: 22, overflow: 'hidden' },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  loginText: { color: '#006633', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  footerNote: { color: 'rgba(255,255,255,0.4)', marginTop: 20, fontSize: 12, fontWeight: '600' }
});
