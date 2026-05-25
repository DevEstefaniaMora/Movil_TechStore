// app/(tabs)/categorias.jsx
import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategories, createCategory, updateCategory } from '../../services/categoryService';

const COLORS = ['#00D4FF', '#A78BFA', '#34D399', '#F59E0B', '#F87171', '#60A5FA'];
const ICONS  = ['phone-portrait-outline','laptop-outline','headset-outline','tablet-portrait-outline','tv-outline','camera-outline'];

export default function Categorias() {
  const [categorias, setCategorias]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [CategoriaEditar, setEditar] = useState(null);

  const [form, setForm] = useState({
    name:   '',
    description:  ''
  });
  useEffect(() => { cargarCategorias(); }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategorias(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  //actualiza formulario
  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

   const cerrarModal = () => {
    setModal(false);
    setEditar(null); // ← limpia el producto en edición
    setForm({ name: '', description: '' });
  };
   const abrirEditar = (categoria) => {
    // Precarga el formulario con los datos del producto seleccionado
    setForm({
      name:            categoria.name,
      description:     categoria.description // TextInput necesita string
    });
    setEditar(categoria); // guarda el producto que se está editando
    setModal(true);
  };
  const guardar = async () => {
    if (!form.name.trim() || !form.description.trim()) {
    Alert.alert('Campos requeridos', 'Nombre y descripcion son obligatorios');
    return;
    }
   
    setGuardando(true);
    try {
      if (CategoriaEditar) {

        await updateCategory({
          id:          CategoriaEditar.id,
          name:        form.name,
          description:  form.description
        });
      }
      else{
        await createCategory({ 
          name:        form.name,
          description:  form.description 
        });
      }

      cerrarModal();
      await cargarCategorias();
    } catch (error) {
      Alert.alert('Error al guardar', error.message);
    } finally {
      setGuardando(false);
    }
  };

 

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {categorias.map((c, index) => {
          const ci    = index % COLORS.length;
          const color = COLORS[ci];
          const icon  = ICONS[ci];
          return (
            <View key={c.id} style={[styles.card, { borderLeftColor: color }]}>
              <View style={[styles.icon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={22} color={color} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.catNombre}>{c.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => abrirEditar(c)}> 
                <Ionicons name="pencil" size={15} color="#A78BFA" />
              </TouchableOpacity>
             
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
        <Ionicons name="add" size={28} color="#0A0A0F" />
      </TouchableOpacity>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
          <Text style={styles.sheetTitle}>
                       {CategoriaEditar ? 'Editar Categoria' : 'Nueva Categoria'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#444460"
              value={form.name}
              onChangeText={(v) => updateForm('name', v)}
            />
             <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#444460"
              value={form.description}
               onChangeText={(v) => updateForm('description', v)}
            />
            <TouchableOpacity
              style={[styles.btn, guardando && { opacity: 0.6 }]}
              onPress={guardar}
              disabled={guardando}
            >
            {guardando
                ? <ActivityIndicator color="#0A0A0F" />
                : <Text style={styles.btnGuardarText}>
                    {CategoriaEditar ? 'Actualizar Categoria' : 'Guardar Categoria'}
                  </Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnC} onPress={cerrarModal}>
              <Text style={styles.btnCText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0A0A0F' },
  center:     { flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' },
  loadingText:{ color: '#8888AA', marginTop: 12, fontSize: 14 },
  content:    { padding: 16, paddingBottom: 100 },
  card:       { backgroundColor: '#0D0D17', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#1E1E2E', borderLeftWidth: 4 },
  icon:       { width: 46, height: 46, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  catNombre:  { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  catCount:   { color: '#555570', fontSize: 13, marginTop: 3 },
  badge:      { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText:  { fontWeight: 'bold', fontSize: 14 },
  fab:        { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#F59E0B', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  overlay:    { flex: 1, backgroundColor: '#00000099', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: '#0D0D17', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  handle:     { width: 40, height: 4, backgroundColor: '#1E1E2E', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input:      { backgroundColor: '#12121F', borderWidth: 1, borderColor: '#1E1E2E', borderRadius: 12, padding: 14, color: '#FFFFFF', fontSize: 15, marginBottom: 12 },
  btn:        { backgroundColor: '#F59E0B', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText:    { color: '#0A0A0F', fontWeight: 'bold', fontSize: 16 },
  btnC:       { padding: 14, alignItems: 'center' },
  btnCText:   { color: '#555570', fontSize: 15 },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#A78BFA18',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#A78BFA33',
  },
});