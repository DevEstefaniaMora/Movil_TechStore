// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Configuración de cada tab: nombre, ícono, color de acento
const TABS = [
  { name: 'dashboard', title: 'Inicio',      icon: 'grid',      color: '#00D4FF' },
  { name: 'productos', title: 'Productos',   icon: 'cube',      color: '#A78BFA' },
  { name: 'categorias',title: 'Categorías',  icon: 'pricetag',  color: '#F59E0B' },
  { name: 'pedidos',   title: 'Pedidos',     icon: 'receipt',   color: '#34D399' },
  { name: 'usuarios',  title: 'usuarios',    icon: 'people',    color: '#e2198e' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0D0D17',
          borderTopColor: '#1E1E2E',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarInactiveTintColor: '#444460',
        headerStyle: { backgroundColor: '#0A0A0F' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarActiveTintColor: tab.color,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}