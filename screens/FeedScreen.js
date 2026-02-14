import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DRIVERS = [
  { id: '1', name: 'SAUMIT G.', major: 'CS MAJOR', credits: '40', car: 'Tesla', dist: '3.2 mi away' },
  { id: '2', name: 'ALEX R.', major: 'BIO MAJOR', credits: '25', car: 'Civic', dist: '1.8 mi away' },
];

export default function FeedScreen() {
  const navigation = useNavigation();

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
      <FlatList
        data={DRIVERS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.driverCard}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{item.name}</Text>
                <Text style={styles.majorText}>{item.major}</Text>
              </View>
              <View style={styles.creditLabel}>
                <Text style={styles.creditValue}>{item.credits} CREDITS</Text>
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <Text style={styles.infoText}>{item.dist} • {item.car}</Text>
              <TouchableOpacity
                style={styles.goButton}
                onPress={() =>
                  navigation.navigate('ChatList', {
                    name: item.name,
                    roomId: `room-${item.id}`,
                    userId: 'student-demo',
                  })
                }
              >
                <Text style={styles.goText}>GO</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  creditLabel: { backgroundColor: '#FFCC33', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  creditValue: { color: '#006633', fontWeight: '900', fontSize: 11 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  infoText: { color: '#999', fontSize: 13, fontWeight: '600' },
  goButton: { backgroundColor: '#006633', paddingHorizontal: 35, paddingVertical: 12, borderRadius: 15 },
  goText: { color: '#FFF', fontWeight: '900', letterSpacing: 1 }
});
