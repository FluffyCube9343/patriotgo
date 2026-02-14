import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  StatusBar, TextInput, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';

export default function LoginScreen({ navigation }) {
  const [netID, setNetID] = useState('');

  const handleMicrosoftLogin = async () => {
    // Premium haptic feedback for Mason students
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const redirectUrl = WebBrowser.makeRedirectUri({ scheme: 'patriotgo' });
      
      // FIXED: Added client_id to satisfy the Microsoft request body requirements
      // Replace the zeros with your actual Azure Client ID once you have it

      const authUrl = `https://us-east-1ajdpaxco3.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=4qqigiekfgl525le0qmb3ub05h&redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net&identity_provider=Microsoft&scope=openid%20profile%20email`


      
      /*const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` + 
                      `client_id=00000000-0000-0000-0000-000000000000` + 
                      `&response_type=code` + 
                      `&redirect_uri=${encodeURIComponent(redirectUrl)}` + 
                      `&scope=openid%20profile%20email`;*/

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success') {
        navigation.navigate('SignUp');
      }
    } catch (error) {
      // DEVELOPMENT BYPASS: This lets you skip the broken portal during testing
      Alert.alert(
        "Auth Mode", 
        "Bypassing Microsoft Portal for testing. Redirecting to Profile Setup.",
        [{ text: "Continue", onPress: () => navigation.navigate('SignUp') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#006633', '#004D26', '#002211']} style={styles.fullBg}>
        
        <View style={styles.content}>
          {/* Brand Header */}
          <View style={styles.topSection}>
            <Text style={styles.preTitle}>SECURE ACCESS</Text>
            <View style={styles.logoRow}>
              <Text style={styles.logoText}>PATRIOT</Text>
              <Text style={[styles.logoText, styles.goldText]}>GO</Text>
            </View>
          </View>

          {/* Login Actions */}
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.microsoftBtn} onPress={handleMicrosoftLogin}>
              <View style={styles.msInner}>
                <MaterialCommunityIcons name="microsoft" size={20} color="#FFF" />
                <Text style={styles.microsoftText}>SIGN IN WITH MASON EMAIL</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR LOGIN WITH NETID</Text>
              <View style={styles.line} />
            </View>

            {/* Glassmorphism NetID Input */}
            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="account-outline" size={20} color="rgba(255,255,255,0.6)" />
              <TextInput 
                style={styles.input}
                placeholder="NetID"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={netID}
                onChangeText={setNetID}
                autoCapitalize="none"
              />
              <Text style={styles.emailSuffix}>@gmu.edu</Text>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={() => navigation.replace('Main')}
            >
              <LinearGradient 
                colors={['#FFCC33', '#EBB700']} 
                style={styles.btnGradient}
              >
                <Text style={styles.loginText}>CONTINUE</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#004D26" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullBg: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 35, justifyContent: 'center' },
  topSection: { marginBottom: 40 },
  preTitle: { color: '#FFCC33', fontSize: 10, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logoText: { fontSize: 42, fontWeight: '300', color: '#FFF', letterSpacing: -1 },
  goldText: { fontWeight: '800', color: '#FFCC33' },
  formContainer: { width: '100%' },
  microsoftBtn: { 
    height: 56, 
    borderRadius: 18, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center' 
  },
  msInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  microsoftText: { color: '#FFF', fontSize: 13, fontWeight: '600', letterSpacing: 1, marginLeft: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.3)', marginHorizontal: 15, fontSize: 9, fontWeight: '700' },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 16, 
    height: 56, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 
  },
  input: { flex: 1, color: '#FFF', fontSize: 15, marginLeft: 12 },
  emailSuffix: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },
  loginBtn: { marginTop: 25, height: 60, borderRadius: 18, overflow: 'hidden' },
  btnGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#004D26', fontSize: 15, fontWeight: '800', letterSpacing: 1, marginRight: 10 },
});
