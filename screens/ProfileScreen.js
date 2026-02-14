import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* TOP NAV / BRANDING */}
        <View style={styles.nav}>
          <Text style={styles.urbanBrand}>PATRIOT<Text style={{color: '#FFCC33'}}>GO</Text></Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="cog-outline" size={24} color="#006633" />
          </TouchableOpacity>
        </View>

        {/* PROFILE HEADER - URBAN HERO STYLE */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
             {/* Using your provided profile intent */}
            <Image 
              source={{ uri: 'https://i.pravatar.cc/300?u=saumit' }} 
              style={styles.profileImage} 
            />
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={20} color="#FFCC33" />
            </View>
          </View>
          
          <Text style={styles.userName}>SAUMIT GUDUGUNTLA</Text>
          <Text style={styles.userTitle}>COMPUTER SCIENCE • GMU '28</Text>
        </View>

        {/* IMPACT BENTO GRID */}
        <View style={styles.bentoGrid}>
          <LinearGradient colors={['#006633', '#004D26']} style={styles.mainStatCard}>
            <Text style={styles.statNumber}>450</Text>
            <Text style={styles.statLabel}>TOTAL CREDITS</Text>
          </LinearGradient>
          
          <View style={styles.rightStats}>
            <View style={styles.smallStatCard}>
              <Text style={styles.smallStatNumber}>12.4</Text>
              <Text style={styles.smallStatLabel}>KG CO2 SAVED</Text>
            </View>
            <View style={styles.smallStatCard}>
              <Text style={styles.smallStatNumber}>24</Text>
              <Text style={styles.smallStatLabel}>RIDES SHARED</Text>
            </View>
          </View>
        </View>

        {/* ABOUT SECTION - THE "JIST" FROM YOUR DRAWING */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ABOUT</Text>
          <View style={styles.glassCard}>
            <Text style={styles.aboutText}>
              CS Student at George Mason. Founder of SparkSphere and co-developer of LockedIn. 
              Focused on sustainability and building tech that connects the Patriot community.
            </Text>
          </View>
        </View>

        {/* EXPERIENCE / DRIVER SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DRIVER SETTINGS</Text>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="car-electric" size={22} color="#006633" />
            <Text style={styles.settingText}>Tesla Model 3</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCC" style={{marginLeft: 'auto'}} />
          </View>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="seat-passenger" size={22} color="#006633" />
            <Text style={styles.settingText}>4 Seats Available</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCC" style={{marginLeft: 'auto'}} />
          </View>
        </View>

        <TouchableOpacity style={styles.dangerBtn}>
          <Text style={styles.dangerText}>LOGOUT SESSION</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20 },
  urbanBrand: { fontSize: 24, fontWeight: '900', letterSpacing: -1.5, color: '#006633', fontStyle: 'italic' },
  settingsBtn: { padding: 8, backgroundColor: '#F0F9F4', borderRadius: 12 },
  
  heroSection: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  imageContainer: { position: 'relative', marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 45, borderWidth: 4, borderColor: '#F0F0F0' },
  verifiedBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#006633', borderRadius: 12, padding: 4, borderWidth: 3, borderColor: '#FFF' },
  userName: { fontSize: 28, fontWeight: '900', letterSpacing: -1, color: '#1A1A1A' },
  userTitle: { fontSize: 11, fontWeight: '800', color: '#006633', letterSpacing: 2, marginTop: 5 },

  bentoGrid: { flexDirection: 'row', paddingHorizontal: 25, gap: 15, marginBottom: 35 },
  mainStatCard: { flex: 1.2, borderRadius: 30, padding: 25, justifyContent: 'center' },
  statNumber: { color: '#FFCC33', fontSize: 42, fontWeight: '900', letterSpacing: -2 },
  statLabel: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 5 },
  rightStats: { flex: 1, gap: 15 },
  smallStatCard: { flex: 1, backgroundColor: '#F8F8F8', borderRadius: 25, padding: 15, justifyContent: 'center' },
  smallStatNumber: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  smallStatLabel: { fontSize: 8, fontWeight: '800', color: '#AAA', letterSpacing: 1 },

  section: { paddingHorizontal: 25, marginBottom: 30 },
  sectionHeader: { fontSize: 12, fontWeight: '900', letterSpacing: 3, color: '#DDD', marginBottom: 15 },
  glassCard: { backgroundColor: '#F8F8F8', padding: 20, borderRadius: 25 },
  aboutText: { fontSize: 15, lineHeight: 22, color: '#444', fontWeight: '500' },
  
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 20, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  settingText: { marginLeft: 15, fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  
  dangerBtn: { marginTop: 10, marginHorizontal: 25, padding: 20, alignItems: 'center', borderRadius: 20, backgroundColor: '#FFF0F0' },
  dangerText: { color: '#FF4444', fontWeight: '900', letterSpacing: 2, fontSize: 11 }
});
