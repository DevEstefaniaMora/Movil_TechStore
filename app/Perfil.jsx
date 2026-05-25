// app/Perfil.jsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUsername, setToken, setUsername } from '../services/api';

export default function Perfil() {
  const router   = useRouter();
  const username = getUsername();

  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            // Limpia el token y username
            setToken('');
            setUsername('');
            // Navega al login
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Botón volver */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#8888AA" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      {/* Avatar grande */}
      <View style={styles.avatarArea}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>
            {username ? username.charAt(0).toUpperCase() : 'A'}
          </Text>
        </View>
        <Text style={styles.username}>{username || 'Administrador'}</Text>
        <View style={styles.rolBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#00D4FF" />
          <Text style={styles.rolText}>Administrador</Text>
        </View>
      </View>

      {/* Tarjeta de info */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="person-outline" size={18} color="#00D4FF" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Usuario</Text>
            <Text style={styles.infoValue}>{username || 'Administrador'}</Text>
          </View>
        </View>

        <View style={styles.separador} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="shield-outline" size={18} color="#A78BFA" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>Administrador</Text>
          </View>
        </View>
      </View>

      {/* Botón cerrar sesión */}
      <TouchableOpacity style={styles.btnCerrar} onPress={cerrarSesion}>
        <Ionicons name="log-out-outline" size={20} color="#F87171" />
        <Text style={styles.btnCerrarText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Versión de la app */}
      <Text style={styles.version}>TechStore v1.0.0</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0A0A0F', padding: 24, paddingTop: 60 },

  // Volver
  backBtn:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 40 },
  backText:      { color: '#8888AA', fontSize: 14 },

  // Avatar
  avatarArea:    { alignItems: 'center', marginBottom: 32 },
  avatarCircle:  { width: 90, height: 90, borderRadius: 45, backgroundColor: '#00D4FF20', borderWidth: 2, borderColor: '#00D4FF44', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  avatarLetter:  { color: '#00D4FF', fontSize: 36, fontWeight: 'bold' },
  username:      { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  rolBadge:      { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#00D4FF15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8, borderWidth: 1, borderColor: '#00D4FF30' },
  rolText:       { color: '#00D4FF', fontSize: 12, fontWeight: '600' },

  // Tarjeta info
  card:          { backgroundColor: '#0D0D17', borderRadius: 16, padding: 4, borderWidth: 1, borderColor: '#1E1E2E', marginBottom: 24 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  infoIcon:      { width: 38, height: 38, borderRadius: 10, backgroundColor: '#12121F', justifyContent: 'center', alignItems: 'center' },
  infoLabel:     { color: '#555570', fontSize: 12 },
  infoValue:     { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginTop: 2 },
  separador:     { height: 1, backgroundColor: '#1E1E2E', marginHorizontal: 16 },

  // Cerrar sesión
  btnCerrar:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#F8717133', backgroundColor: '#F8717110' },
  btnCerrarText: { color: '#F87171', fontWeight: '600', fontSize: 16 },

  // Versión
  version:       { color: '#333350', fontSize: 12, textAlign: 'center', marginTop: 32 },
});