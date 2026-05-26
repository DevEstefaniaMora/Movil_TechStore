// app/Register.jsx
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { registerUser } from '../services/authService';

export default function Register() {
  const router = useRouter();

  const [guardando, setGuardando]       = useState(false);
  const [showPass, setShowPass]         = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);
  const [form, setForm] = useState({
    username:        '',
    password:    '',
    confirmPassword: '',
  });

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegistro = async () => {
    if (!form.username.trim()) {
      Alert.alert('Requerido', 'Ingresa un nombre de usuario');
      return;
    }
    if (!form.password.trim() || form.password.length < 6) {
      Alert.alert('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setGuardando(true);
    try {
      await registerUser({
        username:     form.username,
        password: form.password,
      });
      Alert.alert(
        '¡Cuenta creada! ✅',
        'Ya puedes iniciar sesión con tu usuario y contraseña',
        [{ text: 'Ir al login', onPress: () => router.replace('/') }]
      );
    } catch (error) {
      Alert.alert('Error al registrar', error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botón volver */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#8888AA" />
          <Text style={styles.backText}>Volver al login</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="person-add" size={32} color="#00D4FF" />
          </View>
          <Text style={styles.titulo}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Completa los campos para registrarte</Text>
        </View>

        {/* Usuario */}
        <Text style={styles.label}>Nombre de usuario</Text>
        <View style={styles.inputRow}>
          <Ionicons name="at-outline" size={18} color="#555570" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            placeholderTextColor="#444460"
            value={form.username}
            onChangeText={(v) => updateForm('username', v)}
            autoCapitalize="none"
          />
        </View>

        {/* Contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color="#555570" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#444460"
            value={form.password}
            onChangeText={(v) => updateForm('password', v)}
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

        {/* Confirmar contraseña */}
        <Text style={styles.label}>Confirmar contraseña</Text>
        <View style={[
          styles.inputRow,
          form.confirmPassword.length > 0 &&
          form.password !== form.confirmPassword &&
          styles.inputRowError
        ]}>
          <Ionicons name="lock-closed-outline" size={18} color="#555570" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            placeholderTextColor="#444460"
            value={form.confirmPassword}
            onChangeText={(v) => updateForm('confirmPassword', v)}
            secureTextEntry={!showPassConf}
          />
          <TouchableOpacity onPress={() => setShowPassConf(!showPassConf)}>
            <Ionicons
              name={showPassConf ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#555570"
            />
          </TouchableOpacity>
        </View>

        {/* Mensaje contraseñas no coinciden */}
        {form.confirmPassword.length > 0 &&
         form.password !== form.confirmPassword ? (
          <View style={styles.msgRow}>
            <Ionicons name="warning-outline" size={12} color="#F87171" />
            <Text style={styles.msgError}>Las contraseñas no coinciden</Text>
          </View>
        ) : null}

        {/* Mensaje contraseñas coinciden */}
        {form.confirmPassword.length > 0 &&
         form.password === form.confirmPassword ? (
          <View style={styles.msgRow}>
            <Ionicons name="checkmark-circle-outline" size={12} color="#34D399" />
            <Text style={styles.msgSuccess}>Las contraseñas coinciden</Text>
          </View>
        ) : null}

        <View style={{ height: 24 }} />

        {/* Botón crear cuenta */}
        <TouchableOpacity
          style={[styles.btn, guardando && styles.btnDisabled]}
          onPress={handleRegistro}
          disabled={guardando}
        >
          {guardando
            ? <ActivityIndicator color="#0A0A0F" />
            : <>
                <Ionicons name="person-add-outline" size={18} color="#0A0A0F" />
                <Text style={styles.btnText}>Crear cuenta</Text>
              </>
          }
        </TouchableOpacity>

        {/* Link volver */}
        <TouchableOpacity style={styles.linkLogin} onPress={() => router.replace('/')}>
          <Text style={styles.linkLoginText}>¿Ya tienes cuenta? </Text>
          <Text style={styles.linkLoginAccion}>Inicia sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0A0A0F' },
  content:        { padding: 28, paddingTop: 60, paddingBottom: 40 },

  // Volver
  backBtn:        { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 },
  backText:       { color: '#8888AA', fontSize: 14 },

  // Header
  header:         { alignItems: 'center', marginBottom: 36 },
  iconBox:        { width: 72, height: 72, borderRadius: 36, backgroundColor: '#00D4FF18', borderWidth: 1, borderColor: '#00D4FF44', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  titulo:         { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  subtitulo:      { color: '#555570', fontSize: 13, marginTop: 6, textAlign: 'center' },

  // Campos
  label:          { color: '#8888AA', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, marginTop: 16 },
  inputRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#12121F', borderWidth: 1, borderColor: '#1E1E2E', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4 },
  inputRowError:  { borderColor: '#F87171' },
  inputIcon:      { marginRight: 10 },
  input:          { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 12 },

  // Mensajes validación
  msgRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  msgError:       { color: '#F87171', fontSize: 12 },
  msgSuccess:     { color: '#34D399', fontSize: 12 },

  // Botón
  btn:            { backgroundColor: '#00D4FF', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnDisabled:    { opacity: 0.6 },
  btnText:        { color: '#0A0A0F', fontWeight: 'bold', fontSize: 16 },

  // Link login
  linkLogin:      { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkLoginText:  { color: '#555570', fontSize: 14 },
  linkLoginAccion:{ color: '#00D4FF', fontSize: 14, fontWeight: '600' },
});