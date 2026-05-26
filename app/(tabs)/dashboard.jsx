// app/(tabs)/dashboard.jsx
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUsername } from '../../services/api';
// Datos de las tarjetas de estadísticas
const STATS = [
  { label: 'Productos',   value: '5', icon: 'cube',       color: '#A78BFA', route: '/productos'  },
  { label: 'Categorías',  value: '3',   icon: 'pricetag',   color: '#F59E0B', route: '/categorias' },
  { label: 'Pedidos',     value: '5',  icon: 'receipt',    color: '#34D399', route: '/pedidos'    },
  { label: 'Usuarios',    value: '2',  icon: 'people',     color: '#00D4FF', route: '/usuarios'  },
];

export default function Dashboard() {
  const router = useRouter();
  const username = getUsername(); // ← obtiene el username guardado

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Encabezado con saludo */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido de vuelta 👋</Text>
          <Text style={styles.name}>Administrador</Text>
        </View>
        {/* ← Avatar clickeable que navega al perfil */}
       <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push('../Perfil')}
        >
          <Text style={styles.avatarLetter}>
            {username ? username.charAt(0).toUpperCase() : 'A'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Banner de estado */}
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="trending-up" size={24} color="#00D4FF" />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.bannerTitle}>Sistema operando con normalidad</Text>
        </View>
      </View>

      {/* Grid de estadísticas */}
      <Text style={styles.sectionLabel}>RESUMEN GENERAL</Text>
      <View style={styles.grid}>
        {STATS.map((s) => (
          <TouchableOpacity
            key={s.label}
            style={[styles.card, { borderColor: s.color + '30' }]}
            onPress={() => router.push(s.route)}
            // activeOpacity → qué tan transparente se vuelve al tocar (0=transparente, 1=sin efecto)
            activeOpacity={0.75}
          >
            <View style={[styles.cardIcon, { backgroundColor: s.color + '20' }]}>
              <Ionicons name={s.icon} size={22} color={s.color} />
            </View>
            <Text style={[styles.cardValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.cardLabel}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Accesos rápidos */}
      <Text style={styles.sectionLabel}>ACCIONES RÁPIDAS</Text>
      {[
        { label: 'Registrar nuevo pedido', icon: 'add-circle', color: '#34D399', route: '/pedidos' },
        { label: 'Agregar producto',       icon: 'cube',       color: '#A78BFA', route: '/productos' },
      ].map((a) => (
        <TouchableOpacity
          key={a.label}
          style={styles.action}
          onPress={() => router.push(a.route)}
        >
          <Ionicons name={a.icon} size={20} color={a.color} />
          <Text style={styles.actionText}>{a.label}</Text>
          <Ionicons name="chevron-forward" size={16} color="#444460" />
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0A0A0F' },
  content:      { padding: 20, paddingBottom: 40 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:     { color: '#555570', fontSize: 13 },
  name:         { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 2 },
  avatar:       { width: 46, height: 46, borderRadius: 23, backgroundColor: '#00D4FF20', borderWidth: 1, borderColor: '#00D4FF40', justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { color: '#00D4FF', fontSize: 20, fontWeight: 'bold' },
  banner:       { backgroundColor: '#0D0D17', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1E1E2E', marginBottom: 28 },
  bannerIcon:   { width: 44, height: 44, borderRadius: 12, backgroundColor: '#00D4FF15', justifyContent: 'center', alignItems: 'center' },
  bannerTitle:  { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  bannerSub:    { color: '#555570', fontSize: 12, marginTop: 3 },
  sectionLabel: { color: '#444460', fontSize: 11, letterSpacing: 1.5, marginBottom: 12, marginTop: 4 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  card:         { width: '47%', backgroundColor: '#0D0D17', borderRadius: 16, padding: 18, borderWidth: 1 },
  cardIcon:     { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  cardValue:    { fontSize: 28, fontWeight: 'bold' },
  cardLabel:    { color: '#555570', fontSize: 13, marginTop: 4 },
  action:       { backgroundColor: '#0D0D17', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1E1E2E' },
  actionText:   { flex: 1, color: '#CCCCDD', fontSize: 14, fontWeight: '500' },
});