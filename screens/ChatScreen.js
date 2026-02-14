import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { listMessages, pingDynamo, sendMessage } from '../services/chatRepository';
import { chatTableName, dynamoEndpoint, dynamoRegion, isDynamoEnabled } from '../services/dynamoClient';

export default function ChatScreen({ route, navigation }) {
  const { name, roomId = 'demo-room', userId = 'me' } = route.params || { name: 'Patriot Driver' };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dynamoStatus, setDynamoStatus] = useState(isDynamoEnabled ? 'checking' : 'disabled');
  const scrollRef = useRef(null);

  const FALLBACK_MESSAGES = [
    {
      id: 'fallback-1',
      roomId,
      sender: 'driver',
      body: "Yo! I'm parked near the Rappahannock deck entrance. Look for the silver Tesla.",
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 'fallback-2',
      roomId,
      sender: userId,
      body: 'Got it, crossing the street now! See ya in a sec.',
      createdAt: '2024-01-01T10:01:00Z',
    },
  ];

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (isDynamoEnabled) {
        setDynamoStatus('checking');
        try {
          await pingDynamo(roomId);
          if (!cancelled) setDynamoStatus('ok');
        } catch (err) {
          if (!cancelled) {
            console.error('Dynamo health check failed', err);
            setDynamoStatus('error');
            setError('Dynamo unavailable. Showing demo messages.');
          }
        }
      }

      await loadMessages(cancelled);
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  // Lightweight polling to keep the chat feeling real-time during the hackathon.
  useEffect(() => {
    if (!isDynamoEnabled) return undefined;

    const intervalId = setInterval(() => {
      loadMessages();
    }, 2500);

    return () => clearInterval(intervalId);
  }, [roomId, isDynamoEnabled]);

  const loadMessages = async (cancelled = false) => {
    setLoading(true);
    setError('');
    try {
      const data = await listMessages(roomId);
      if (!cancelled) setMessages(data);
      requestAnimationFrame(scrollToBottom);
    } catch (err) {
      console.error('Failed to load messages', err);
      setError('Unable to load chat right now.');
      if (!cancelled) setMessages(FALLBACK_MESSAGES);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const optimistic = {
      id: `temp-${Date.now()}`,
      roomId,
      sender: userId,
      body: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    requestAnimationFrame(scrollToBottom);

    try {
      const saved = await sendMessage(roomId, userId, text);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimistic.id ? saved : msg)),
      );
      requestAnimationFrame(scrollToBottom);
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages((prev) => prev.filter((msg) => msg.id !== optimistic.id));
      setError('Message not sent. Check connection and try again.');
    }
  };

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

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={scrollToBottom}
        keyboardShouldPersistTaps="handled"
      >
        {/* The Whiteboard Feature: Map appears when clicked GO */}
        <View style={styles.mapFrame}>
          <View style={styles.mapOverlay}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color="#FFCC33" />
            <Text style={styles.mapTitle}>LIVE TRACKING ENABLED</Text>
          </View>
          <Text style={styles.mapSubtitle}>Driver is 2 mins away from North Sector</Text>
        </View>

        {isDynamoEnabled ? (
          dynamoStatus === 'checking' ? (
            <View style={styles.statusBannerInfo}>
              <Ionicons name="sync" size={18} color="#0D47A1" />
              <Text style={styles.statusTextInfo}>Checking DynamoDB connectivity...</Text>
            </View>
          ) : dynamoStatus === 'error' ? (
            <View style={styles.statusBannerError}>
              <Ionicons name="alert-circle-outline" size={18} color="#C62828" />
              <Text style={styles.statusTextError}>Dynamo unreachable - showing demo messages.</Text>
            </View>
          ) : (
            <View style={styles.statusBannerSuccess}>
              <Ionicons name="cloud-done-outline" size={18} color="#1B5E20" />
              <Text style={styles.statusTextSuccess}>
                DynamoDB active ({chatTableName}) • {dynamoEndpoint ? 'local endpoint' : dynamoRegion}
              </Text>
            </View>
          )
        ) : (
          <View style={styles.statusBanner}>
            <Ionicons name="cloud-offline-outline" size={18} color="#C62828" />
            <Text style={styles.statusText}>DynamoDB disabled - using demo messages only.</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color="#006633" />
            <Text style={styles.loadingText}>Loading chat...</Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender === userId;
            return (
              <View key={msg.id} style={isMine ? styles.msgSent : styles.msgReceived}>
                <Text style={isMine ? styles.msgTextSent : styles.msgText}>{msg.body}</Text>
                <Text style={isMine ? styles.metaTextSent : styles.metaText}>
                  {msg.sender === 'me' ? 'You' : msg.sender} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera" size={24} color="#FFF" />
        </TouchableOpacity>
        <TextInput
          placeholder="Message..."
          style={styles.textInput}
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={handleSend}>
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
  metaText: { marginTop: 6, fontSize: 11, fontWeight: '700', color: '#7A7A7A', opacity: 0.8 },
  metaTextSent: { marginTop: 6, fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.85)' },
  loadingState: { backgroundColor: '#F0F2F5', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingText: { color: '#1A1A1A', fontWeight: '700' },
  errorText: { color: '#C62828', fontWeight: '800', marginTop: 8 },
  statusBanner: { backgroundColor: '#FFF3E0', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#FFE0B2' },
  statusText: { color: '#BF360C', fontWeight: '800', fontSize: 13 },
  statusBannerInfo: { backgroundColor: '#E3F2FD', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#BBDEFB' },
  statusTextInfo: { color: '#0D47A1', fontWeight: '800', fontSize: 13 },
  statusBannerError: { backgroundColor: '#FFEBEE', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#FFCDD2' },
  statusTextError: { color: '#B71C1C', fontWeight: '800', fontSize: 13 },
  statusBannerSuccess: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#C8E6C9' },
  statusTextSuccess: { color: '#1B5E20', fontWeight: '800', fontSize: 13 },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10, gap: 15 },
  cameraBtn: { backgroundColor: '#006633', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#F0F2F5', height: 45, borderRadius: 22, paddingHorizontal: 20, fontSize: 15, fontWeight: '500' },
  sendLink: { color: '#006633', fontWeight: '800', fontSize: 15 }
});
