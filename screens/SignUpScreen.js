import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({ major: '', gradYear: '', carModel: '' });

  const handleFinish = async () => {
    if (!formData.major || !formData.gradYear) {
      Alert.alert("Required", "Please provide your Major and Grad Year.");
      return;
    }

    try {
      // This saves the data to the table you just created in Step 2
      const { error } = await supabase.from('profiles').insert([{
        major: formData.major,
        grad_year: formData.gradYear,
        car_model: formData.carModel
      }]);
      
      if (error) throw error;
      navigation.replace('Main');
    } catch (error) {
      Alert.alert("Database Error", "Check your Anon Key in lib/supabase.js!");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <LinearGradient colors={['#006633', '#004D26', '#002211']} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>PATRIOT <Text style={{color: '#FFCC33'}}>PROFILE</Text></Text>
          <View style={styles.inputWrapper}><Text style={styles.label}>MAJOR</Text><TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" onChangeText={(v)=>setFormData({...formData, major: v})}/></View>
          <View style={styles.inputWrapper}><Text style={styles.label}>GRAD YEAR</Text><TextInput style={styles.input} keyboardType="numeric" placeholderTextColor="rgba(255,255,255,0.3)" onChangeText={(v)=>setFormData({...formData, gradYear: v})}/></View>
          <View style={styles.inputWrapper}><Text style={styles.label}>CAR MODEL</Text><TextInput style={styles.input} placeholderTextColor="rgba(255,255,255,0.3)" onChangeText={(v)=>setFormData({...formData, carModel: v})}/></View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleFinish}>
             <LinearGradient colors={['#FFCC33', '#EBB700']} style={styles.btnGradient}>
               <Text style={styles.btnText}>ENTER PATRIOTGO</Text>
             </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 30, paddingVertical: 100 },
  title: { fontSize: 36, fontWeight: '300', color: '#FFF', marginBottom: 40 },
  inputWrapper: { marginBottom: 25 },
  label: { color: '#FFCC33', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, height: 54, paddingHorizontal: 16, color: '#FFF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  submitBtn: { height: 60, borderRadius: 18, overflow: 'hidden', marginTop: 20 },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#004D26', fontSize: 15, fontWeight: '800' }
});
