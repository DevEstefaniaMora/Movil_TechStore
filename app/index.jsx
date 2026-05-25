// app/index.jsx
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator, Modal, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { login, registerUser } from '../services/authService';
export default function Login() {
  // ── Estados del Login ──
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const router = useRouter();

  // ── Login ──
  const handleLogin = async () => {
    if ( !username.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa tu usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Error al ingresar', error.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Logo ── */}
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Ionicons name="flash" size={36} color="#00D4FF" />
        </View>
        <Text style={styles.logoText}>TechStore</Text>
        <Text style={styles.logoSub}>Sistema de gestión de inventario</Text>
      </View>

      {/* ── Formulario login ── */}
      <View style={styles.form}>
   
        <Text style={styles.label}>Nombre de usuario</Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={18} color="#555570" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#555570"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color="#555570" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#555570"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#555570"
            />
          </TouchableOpacity>
        </View>

        {/* Botón ingresar */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0A0A0F" />
            : <>
                <Text style={styles.btnText}>Ingresar</Text>
                <Ionicons name="arrow-forward" size={18} color="#0A0A0F" />
              </>
          }
        </TouchableOpacity>

        {/* Separador */}
        <View style={styles.separador}>
          <View style={styles.separadorLinea} />
          <Text style={styles.separadorTexto}>¿No tienes cuenta?</Text>
          <View style={styles.separadorLinea} />
        </View>

        {/* Botón registrarse */}
        <TouchableOpacity
          style={styles.btnRegistro}
          onPress={() => router.push('/Register')}
        >
          <Ionicons name="person-add-outline" size={18} color="#00D4FF" />
          <Text style={styles.btnRegistroText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>


    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', padding: 28 },
  logoArea:         { alignItems: 'center', marginBottom: 48 },
  logoCircle:       { width: 72, height: 72, borderRadius: 36, backgroundColor: '#00D4FF18', borderWidth: 1, borderColor: '#00D4FF44', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText:         { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  logoSub:          { color: '#555570', fontSize: 13, marginTop: 6 },
  form:             { gap: 8 },
  label:            { color: '#8888AA', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, marginTop: 8 },
  inputRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#12121F', borderWidth: 1, borderColor: '#1E1E2E', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4 },
  inputRowError:    { borderColor: '#F87171' },
  inputIcon:        { marginRight: 10 },
  input:            { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 12 },
  btn:              { backgroundColor: '#00D4FF', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  btnDisabled:      { opacity: 0.6 },
  btnText:          { color: '#0A0A0F', fontWeight: 'bold', fontSize: 16 },

  // Separador
  separador:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 8 },
  separadorLinea:   { flex: 1, height: 1, backgroundColor: '#1E1E2E' },
  separadorTexto:   { color: '#444460', fontSize: 12 },

  // Botón registro
  btnRegistro:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#00D4FF33', backgroundColor: '#00D4FF0A' },
  btnRegistroText:  { color: '#00D4FF', fontWeight: '600', fontSize: 15 },

  // Modal
  overlay:          { flex: 1, backgroundColor: '#00000099', justifyContent: 'flex-end' },
  sheet:            { backgroundColor: '#0D0D17', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '90%' },
  handle:           { width: 40, height: 4, backgroundColor: '#1E1E2E', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader:      { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  sheetIconBox:     { width: 48, height: 48, borderRadius: 14, backgroundColor: '#00D4FF18', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00D4FF33' },
  sheetTitle:       { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  sheetSub:         { color: '#555570', fontSize: 13, marginTop: 2 },
  fieldLabel:       { color: '#8888AA', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, marginTop: 12 },

  // Mensajes validación
  errorRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  errorText:        { color: '#F87171', fontSize: 12 },
  successRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  successText:      { color: '#34D399', fontSize: 12 },

  // Cancelar
  btnCancelar:      { padding: 14, alignItems: 'center' },
  btnCancelarText:  { color: '#555570', fontSize: 15 },
});