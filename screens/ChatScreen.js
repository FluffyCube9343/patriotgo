import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChatScreen({ route, navigation }) {
  const { name } = route.params || { name: "Patriot Driver" };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#006633" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name.toUpperCase()}</Text>
          <View style={styles.onlineDot} />
        </View>
        <TouchableOpacity><Ionicons name="information-circle-outline" size={26} color="#006633" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* The Whiteboard Feature: Map appears when clicked GO */}
        <View style={styles.mapFrame}>
          <View style={styles.mapOverlay}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color="#FFCC33" />
            <Text style={styles.mapTitle}>LIVE TRACKING ENABLED</Text>
          </View>
          <Text style={styles.mapSubtitle}>Driver is 2 mins away from North Sector</Text>
        </View>

        <View style={styles.msgReceived}>
          <Text style={styles.msgText}>Yo! I'm parked near the Rappahannock deck entrance. Look for the silver Tesla.</Text>
        </View>

        <View style={styles.msgSent}>
          <Text style={styles.msgTextSent}>Got it, crossing the street now! See ya in a sec.</Text>
        </View>
      </ScrollView>

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera" size={24} color="#FFF" />
        </TouchableOpacity>
        <TextInput placeholder="Message..." style={styles.textInput} placeholderTextColor="#999" />
        <TouchableOpacity>
          <Text style={styles.sendLink}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerName: { fontSize: 14, fontWeight: '900', letterSpacing: 1, color: '#1A1A1A' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  scrollContent: { padding: 20 },
  mapFrame: { backgroundColor: '#006633', borderRadius: 24, padding: 20, marginBottom: 30, shadowColor: '#006633', shadowOpacity: 0.3, shadowRadius: 15 },
  mapOverlay: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  mapTitle: { color: '#FFCC33', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  mapSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  msgReceived: { backgroundColor: '#F0F2F5', alignSelf: 'flex-start', padding: 15, borderRadius: 22, borderBottomLeftRadius: 4, maxWidth: '80%', marginBottom: 15 },
  msgSent: { backgroundColor: '#006633', alignSelf: 'flex-end', padding: 15, borderRadius: 22, borderBottomRightRadius: 4, maxWidth: '80%', marginBottom: 15 },
  msgText: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', lineHeight: 20 },
  msgTextSent: { fontSize: 15, fontWeight: '500', color: '#FFF', lineHeight: 20 },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10, gap: 15 },
  cameraBtn: { backgroundColor: '#006633', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#F0F2F5', height: 45, borderRadius: 22, paddingHorizontal: 20, fontSize: 15, fontWeight: '500' },
  sendLink: { color: '#006633', fontWeight: '800', fontSize: 15 }
});
