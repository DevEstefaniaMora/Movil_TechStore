// app/_layout.jsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* headerShown: false → oculta la barra de título automática */}
      <Stack.Screen name="index" />        {/* Login */}
      <Stack.Screen name="(tabs)" />       {/* Pantallas con tabs */}
    </Stack>
  );
}