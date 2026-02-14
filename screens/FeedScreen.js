import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { joinRide, listRides } from '../services/rideRepository';

export default function FeedScreen() {
  const navigation = useNavigation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(null);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listRides();
      setRides(data);
    } catch (err) {
      console.error('Failed to load rides', err);
      setError('Unable to load rides right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (ride) => {
    setJoining(ride.rideId);
    try {
      await joinRide(ride.rideId, 'student-demo');
      navigation.navigate('ChatList', {
        name: ride.driverName || 'Patriot Driver',
        roomId: `ride-${ride.rideId}`,
        userId: 'student-demo',
      });
    } catch (err) {
      console.error('Failed to join ride', err);
      setError('Could not join this ride. Try again.');
    } finally {
      setJoining(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Custom Logo Style */}
      <View style={styles.header}>
        <Text style={styles.logoText}>PATRIOT<Text style={styles.goldText}>GO</Text></Text>
        <View style={styles.walletBadge}>
          <Text style={styles.walletText}>🪙 450</Text>
        </View>
      </View>

      {/* Horizontal Bento Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {['Location', 'Gender', 'Major', 'Timing'].map((filter) => (
          <TouchableOpacity key={filter} style={styles.filterChip}>
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Driver List */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#006633" />
          <Text style={styles.loadingText}>Loading rides...</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={item => item.rideId}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.driverCard}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.driverId || item.rideId}` }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{item.driverName || 'Patriot Driver'}</Text>
                  <Text style={styles.majorText}>{item.originZone || 'Route'}</Text>
                  <Text style={styles.timeText}>
                    {new Date(item.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • {item.timeWindowMinutes || 20}m window
                  </Text>
                </View>
                <View style={styles.creditLabel}>
                  <Text style={styles.creditValue}>{item.seatsAvailable ?? item.seatsTotal ?? 0} SEATS</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <Text style={styles.infoText}>{item.origin} → {item.campusZone}</Text>
                <TouchableOpacity
                  disabled={joining === item.rideId || (item.seatsAvailable !== undefined && item.seatsAvailable < 1)}
                  style={[styles.goButton, (joining === item.rideId || (item.seatsAvailable !== undefined && item.seatsAvailable < 1)) && styles.goButtonDisabled]}
                  onPress={() => handleJoin(item)}
                >
                  <Text style={styles.goText}>{item.seatsAvailable !== undefined && item.seatsAvailable < 1 ? 'FULL' : joining === item.rideId ? 'JOINING...' : 'JOIN'}</Text>
                </TouchableOpacity>
              </View>

              {item.recurrence?.length ? (
                <View style={styles.recurRow}>
                  <Ionicons name="repeat" size={14} color="#006633" />
                  <Text style={styles.recurText}>Recurs: {item.recurrence.join(', ')}</Text>
                </View>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>No rides yet. Be the first to post.</Text>
            </View>
          }
        />
      )}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 25 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#006633', fontStyle: 'italic', letterSpacing: -1.5 },
  goldText: { color: '#FFCC33' },
  walletBadge: { backgroundColor: '#006633', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16 },
  walletText: { color: '#FFCC33', fontWeight: '900', fontSize: 16 },
  
  filterRow: { marginBottom: 30, maxHeight: 50 },
  filterChip: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  filterText: { color: '#666', fontWeight: '700', fontSize: 13 },

  driverCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 22, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 55, height: 55, borderRadius: 18, marginRight: 15 },
  driverName: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  majorText: { fontSize: 12, fontWeight: '800', color: '#006633', letterSpacing: 0.5 },
  timeText: { fontSize: 12, fontWeight: '700', color: '#777', marginTop: 2 },
  creditLabel: { backgroundColor: '#FFCC33', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  creditValue: { color: '#006633', fontWeight: '900', fontSize: 11 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  infoText: { color: '#999', fontSize: 13, fontWeight: '600' },
  goButton: { backgroundColor: '#006633', paddingHorizontal: 35, paddingVertical: 12, borderRadius: 15 },
  goButtonDisabled: { backgroundColor: '#A5D6A7' },
  goText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 },
  loadingBox: { backgroundColor: '#F0F2F5', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  loadingText: { fontWeight: '800', color: '#1A1A1A' },
  errorText: { color: '#C62828', fontWeight: '800', marginTop: 8 },
  recurRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  recurText: { color: '#006633', fontWeight: '800', fontSize: 12 },
});
