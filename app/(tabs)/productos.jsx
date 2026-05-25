// app/(tabs)/productos.jsx
//useState → guarda datos (estado)
//useEffect → ejecuta algo cuando carga la pantalla
import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//Funciones que llaman tu API (.NET)
import { getProducts, createProduct,updateProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';

export default function Productos() {
  //useState guarda toda la información
  const [productos, setProductos]       = useState([]); //Lista de productos
  const [categorias, setCategorias]     = useState([]);
  const [productoEditar, setProductoEditar] = useState(null); // Si tiene valor = esta editando, si es null = modo crear
  const [loading, setLoading]           = useState(true); //Para mostrar "cargando..."
  const [modalVisible, setModalVisible] = useState(false); //Controla si el modal está abierto
  const [guardando, setGuardando]       = useState(false); //Cuando se está guardando
  const [dropdownOpen, setDropdownOpen] = useState(false); // Abre/cierra el selector de categorías
  //Aquí se guardan los datos del formulario
  const [form, setForm] = useState({
    name:          '',
    price:          '',
    stock:           '',
    category_id:     null,
    categoriaNombre: '',
  });
  //cuando carga la pantalla,Se ejecuta UNA vez al iniciar
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    setLoading(true); // muestra que esta cargando
    try {
      //Llama a la API:
      const data = await getProducts();
      setProductos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      //Llama a la API:
      const data = await getCategories();
      setCategorias(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías: ' + error.message);
    }
  };

  const seleccionarCategoria = (cat) => {
    setForm((prev) => ({
      ...prev,
      //Guarda en el formulario:
      category_id:     cat.id,
      categoriaNombre: cat.name,
    }));
    setDropdownOpen(false); // cierra el dropdown al seleccionar
  };
  //actualiza formulario
  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const cerrarModal = () => {
    setModalVisible(false);
    setDropdownOpen(false);
    setProductoEditar(null); // ← limpia el producto en edición
    setForm({ name: '', price: '', stock: '', category_id: null, categoriaNombre: '' });
  };

  const abrirEditar = (producto) => {
    // Precarga el formulario con los datos del producto seleccionado
    setForm({
      name:            producto.name,
      price:           String(producto.price), // TextInput necesita string
      stock:           String(producto.stock),
      category_id:     producto.category_id ??  null,
      categoriaNombre: producto.category ?? '',
    });
    setProductoEditar(producto); // guarda el producto que se está editando
    setModalVisible(true);
  };

  const guardar = async () => {
    // Validaciones
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y precio son obligatorios');
      return;
    }
    if (!form.category_id) {
      Alert.alert('Campos requeridos', 'Selecciona una categoría');
      return;
    }

    const precioNumero = parseFloat((form.price || '').replace(',', '.'));
    if (isNaN(precioNumero)) {
      Alert.alert('Error', 'El precio no es válido');
      return;
    }

    setGuardando(true);
    try {
      if (productoEditar) {
        // ── Modo editar ──
        await updateProduct({
          id:          productoEditar.id,
          name:        form.name,
          price:       precioNumero,
          stock:       parseInt(form.stock) || 0,
          category_id: form.category_id,
        });
      } else {
        // ── Modo crear ──
        await createProduct({
          name:        form.name,
          price:       precioNumero,
          stock:       parseInt(form.stock) || 0,
          category_id: form.category_id,
        });
      }

      cerrarModal();
      await cargarProductos(); // ← recarga siempre, trae los ids correctos ✅

    } catch (error) {
      Alert.alert('Error al guardar', error.message);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.total}>{productos.length} productos en inventario</Text>
      {/* Recorre todos los productos*/}
      {productos.map((p) => (
        <View key={p.id} style={styles.card}>
          <View style={styles.cardLeft}>
            <View style={styles.icon}>
              <Ionicons name="cube" size={18} color="#A78BFA" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{p.name}</Text>
              <Text style={styles.cat}>{p.category}</Text>
            </View>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.precio}>
              ${Number(p.price).toLocaleString('es-CO')}
            </Text>
            <Text style={styles.stock}>Stock: {p.stock}</Text>
          </View>

         {/* ← Botón lápiz */}
         {/* abrirEditar(p)Le mandas p a la función, p es cada producto de la lista*/}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => abrirEditar(p)}> 
            <Ionicons name="pencil" size={15} color="#A78BFA" />
          </TouchableOpacity>

        </View>
      ))}
      </ScrollView>
                                            {/*Abre modal para CREAR */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#0A0A0F" />
      </TouchableOpacity>

      {/* ─── Modal crear producto ─── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            {/* Cambia el título según si es crear o editar */}
            <Text style={styles.sheetTitle}>
              {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>

            {/* ScrollView interno para que el dropdown no quede cortado */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Campo nombre */}
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del producto"
                placeholderTextColor="#444460"
                value={form.name}
                onChangeText={(v) => updateForm('name', v)}
              />

              {/* Campo precio */}
              <Text style={styles.fieldLabel}>Precio</Text>
              <TextInput
                style={styles.input}
                placeholder="price"
                placeholderTextColor="#444460"
                value={form.price}
                onChangeText={(v) => updateForm('price', v)}
                keyboardType="numeric"
              />

              {/* Campo stock */}
              <Text style={styles.fieldLabel}>Stock</Text>
              <TextInput
                style={styles.input}
                placeholder="Stock disponible"
                placeholderTextColor="#444460"
                value={form.stock}
                onChangeText={(v) => updateForm('stock', v)}
                keyboardType="numeric"
              />

              {/* ─── Dropdown de categorías ─── */}
              <Text style={styles.fieldLabel}>Categoría</Text>

              {/* Botón que abre/cierra el dropdown */}
              <TouchableOpacity
                style={[styles.dropdownBtn, dropdownOpen && styles.dropdownBtnOpen]}
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={16}
                  color={form.category_id ? '#A78BFA' : '#444460'}
                />
                <Text style={[ 
                  styles.dropdownBtnText,
                  form.category_id && styles.dropdownBtnTextSelected
                ]}>
                  {form.categoriaNombre || 'Seleccionar categoría'}
                </Text>
                {/* Flecha que rota según si está abierto */}
                <Ionicons
                  name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#444460"
                />
              </TouchableOpacity>

              {/* Lista de opciones — solo se muestra si dropdownOpen es true */}
              {dropdownOpen && ( 
                <View style={styles.dropdownList}> 
                  {categorias.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <Text style={styles.emptyText}>No hay categorías disponibles</Text>
                    </View>
                  ) : (
                    categorias.map((cat, index) => {
                      const isSelected = form.category_id === cat.id;
                      const isLast     = index === categorias.length - 1;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.dropdownItem,
                            isSelected && styles.dropdownItemSelected,
                            isLast     && styles.dropdownItemLast,
                          ]}
                          onPress={() => seleccionarCategoria(cat)} 
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextSelected,
                          ]}>
                            {cat.name} 
                          </Text>
                          {/* Checkmark si está seleccionada */}
                          {isSelected && (
                            <Ionicons name="checkmark" size={16} color="#A78BFA" /> 
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              )}

              {/* Espacio extra para que el botón no quede debajo del dropdown */}
              <View style={{ height: 16 }} />

              <TouchableOpacity
                style={[styles.btnGuardar, guardando && { opacity: 0.6 }]}
                onPress={guardar}
                disabled={guardando}
              >
                {guardando
                  ? <ActivityIndicator color="#0A0A0F" />
                  : <Text style={styles.btnGuardarText}>
                      {productoEditar ? 'Actualizar Producto' : 'Guardar Producto'}
                    </Text>
                }
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnCancelar} onPress={cerrarModal}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container:                { flex: 1, backgroundColor: '#0A0A0F' },
  center:                   { flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', alignItems: 'center' },
  loadingText:              { color: '#8888AA', marginTop: 12, fontSize: 14 },
  content:                  { padding: 16, paddingBottom: 100 },
  total:                    { color: '#444460', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 },
  card:                     { backgroundColor: '#0D0D17', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#1E1E2E' },
  cardLeft:                 { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  icon:                     { width: 38, height: 38, backgroundColor: '#A78BFA18', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  nombre:                   { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  cat:                      { color: '#555570', fontSize: 12, marginTop: 2 },
  cardRight:                { alignItems: 'flex-end' },
  precio:                   { color: '#A78BFA', fontWeight: 'bold', fontSize: 15 },
  stock:                    { color: '#555570', fontSize: 12, marginTop: 2 },
  fab:                      { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#A78BFA', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  overlay:                  { flex: 1, backgroundColor: '#00000099', justifyContent: 'flex-end' },
  sheet:                    { backgroundColor: '#0D0D17', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '90%' },
  handle:                   { width: 40, height: 4, backgroundColor: '#1E1E2E', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle:               { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  fieldLabel:               { color: '#8888AA', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, marginTop: 8 },
  input:                    { backgroundColor: '#12121F', borderWidth: 1, borderColor: '#1E1E2E', borderRadius: 12, padding: 14, color: '#FFFFFF', fontSize: 15, marginBottom: 4 },

  // Dropdown
  dropdownBtn:              { backgroundColor: '#12121F', borderWidth: 1, borderColor: '#1E1E2E', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropdownBtnOpen:          { borderColor: '#A78BFA55', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dropdownBtnText:          { flex: 1, color: '#444460', fontSize: 15 },
  dropdownBtnTextSelected:  { color: '#FFFFFF' },
  dropdownList:             { backgroundColor: '#12121F', borderWidth: 1, borderColor: '#A78BFA55', borderTopWidth: 0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden', marginBottom: 4 },
  dropdownItem:             { padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E1E2E' },
  dropdownItemSelected:     { backgroundColor: '#A78BFA15' },
  dropdownItemLast:         { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  dropdownItemText:         { color: '#AAAACC', fontSize: 15 },
  dropdownItemTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  emptyBox:                 { padding: 20, alignItems: 'center' },
  emptyText:                { color: '#444460', fontSize: 14 },

  btnGuardar:               { backgroundColor: '#A78BFA', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  btnGuardarText:           { color: '#0A0A0F', fontWeight: 'bold', fontSize: 16 },
  btnCancelar:              { padding: 14, alignItems: 'center' },
  btnCancelarText:          { color: '#555570', fontSize: 15 },

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