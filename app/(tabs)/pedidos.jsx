// app/(tabs)/pedidos.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getOrders, createOrder } from "../../services/orderService";
import { getProducts } from "../../services/productService";



const crearItemVacio = () => ({
  uid: Date.now() + Math.random(), // ← id único
  productoId: null,
  productoNombre: "",
  cantidad: "1",
  valorUnitario: "0",
});
export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [items, setItems] = useState([crearItemVacio()]);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [idCard, setIdCard] = useState("");
  const [pedidoEditar, setPedidoEditar] = useState(null);
  const [modalEditar, setModalEditar]   = useState(false);

  useEffect(() => {
    cargarPedidos();
    cargarProductos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      console.log("📦 Pedidos:", JSON.stringify(data));
      setPedidos(data);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudieron cargar los pedidos: " + error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await getProducts();
      setProductos(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
    }
  };

  const abrirSelector = (index) => {
    setItemIndex(index);
    setSelectorVisible(true);
  };

  const seleccionarProducto = (producto) => {
    const nuevosItems = [...items];
    nuevosItems[itemIndex] = {
      ...nuevosItems[itemIndex],
      productId: producto.id,
      productoNombre: producto.name,
      valorUnitario: String(producto.price),
    };
    setItems(nuevosItems);
    setSelectorVisible(false);
  };

  const updateItem = (index, key, value) => {
    const nuevosItems = [...items];
    nuevosItems[index] = { ...nuevosItems[index], [key]: value };

    // Validación de stock en tiempo real
    if (key === "cantidad") {
      const cantidadIngresada = parseInt(value) || 0;
      const productoReal = productos.find(
        (p) => p.id === nuevosItems[index].productId,
      );
      if (productoReal && cantidadIngresada > productoReal.stock) {
        nuevosItems[index].cantidad = String(productoReal.stock);
        Alert.alert(
          "Stock insuficiente ⚠️",
          `"${productoReal.name}" solo tiene ${productoReal.stock} unidades disponibles.`,
        );
      }
    }

    setItems(nuevosItems);
  };

  const agregarItem = () => {
    setItems([...items, crearItemVacio()]); // ← usa crearItemVacio()
  };

  const eliminarItem = (index) => {
    if (items.length === 1) {
      setItems([crearItemVacio()]); // ← usa crearItemVacio()
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      const cant = parseFloat(item.cantidad) || 0;
      const valor = parseFloat(item.valorUnitario) || 0;
      return total + cant * valor;
    }, 0);
  };

  const cerrarModal = () => {
    setModal(false);
    setItems([crearItemVacio()]); // ← usa crearItemVacio()
    setIdCard("");
  };

  const registrar = async () => {
    if (!idCard.trim()) {
      Alert.alert("Requerido", "Ingresa la cédula del cliente");
      return;
    }
    const itemsValidos = items.filter((i) => i.productId !== null);
    if (itemsValidos.length === 0) {
      Alert.alert("Requerido", "Agrega al menos un producto");
      return;
    }

    // Validación de stock al guardar
    for (const item of itemsValidos) {
      const cantidadPedida = parseInt(item.cantidad) || 0;
      const productoReal = productos.find((p) => p.id === item.productId);
      if (productoReal && cantidadPedida > productoReal.stock) {
        Alert.alert(
          "Stock insuficiente ⚠️",
          `"${item.productoNombre}" solo tiene ${productoReal.stock} unidades disponibles.`,
        );
        return;
      }
    }

    setGuardando(true);
    try {
      await createOrder({
        idCard,
        items: itemsValidos.map((i) => ({
          productId: i.productId,
          quantity: parseInt(i.cantidad) || 1,
        })),
      });
      cerrarModal();
      await cargarPedidos();
    } catch (error) {
      Alert.alert("Error al registrar", error.message);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34D399" />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
         {/* ─── Carga todos los pedidos ─── */}
        {pedidos.map((p) => {
          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardLeft}>
               <Text style={styles.pedidoId}>
                  PED-{String(p.id).padStart(3, "0")}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cliente}>{` ${p.name}`}</Text>
                <Text style={styles.cliente}>{`${p.idCard}`}</Text>
                </View>
              </View>
              <View style={styles.sep} />
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.total}>
                  ${Number(p.total ?? 0).toLocaleString("es-CO")}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      {/* ─── BOTON Modal ─── */}
      <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
        <Ionicons name="add" size={28} color="#0A0A0F" />
      </TouchableOpacity>

      {/* ─── Modal nuevo pedido ─── */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Nuevo Pedido</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.fieldLabel}>Cliente</Text>
              <TextInput
                style={styles.input}
                placeholder="Cédula del cliente"
                placeholderTextColor="#444460"
                value={idCard}
                onChangeText={setIdCard}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>Productos</Text>

              {/* Encabezado tabla */}
              <View style={styles.tableHeader}>
                <Text style={[styles.thText, { flex: 3 }]}>Producto</Text>
                <Text style={[styles.thText, { flex: 1, textAlign: "center" }]}>
                  Cant.
                </Text>
                <Text style={[styles.thText, { flex: 2, textAlign: "center" }]}>
                  V. Unit.
                </Text>
                <Text style={[styles.thText, { flex: 2, textAlign: "center" }]}>
                  Total
                </Text>
                <Text style={[styles.thText, { flex: 1 }]}> </Text>
              </View>

              {/* Filas tabla — subtotal y stock en el mismo map */}
              {items.map((item, index) => {
                const totalFila =
                  (parseFloat(item.cantidad) || 0) *
                  (parseFloat(item.valorUnitario) || 0);
                const productoReal = productos.find(
                  (p) => p.id === item.productId,
                );
                const stockExcedido = productoReal
                  ? (parseInt(item.cantidad) || 0) > productoReal.stock
                  : false;

                return (
                  <View key={item.uid}>
                    {/* Fila de la tabla */}
                    <View style={styles.tableRow}>
                      {/* Producto */}
                      <TouchableOpacity
                        style={[styles.tdProducto, { flex: 3 }]}
                        onPress={() => abrirSelector(index)}
                      >
                        <Text
                          style={
                            item.productId
                              ? styles.tdProductoText
                              : styles.tdProductoPlaceholder
                          }
                          numberOfLines={1}
                        >
                          {item.productoNombre || "Seleccionar"}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={12}
                          color="#444460"
                        />
                      </TouchableOpacity>

                      {/* Cantidad */}
                      <TextInput
                        style={[
                          styles.tdInput,
                          { flex: 1 },
                          stockExcedido && styles.tdInputError,
                        ]}
                        value={item.cantidad}
                        onChangeText={(v) => updateItem(index, "cantidad", v)}
                        keyboardType="numeric"
                        placeholder="1"
                        placeholderTextColor="#444460"
                      />

                      {/* Valor unitario */}
                      <TextInput
                        style={[styles.tdInput, { flex: 2 }]}
                        value={item.valorUnitario}
                        onChangeText={(v) =>
                          updateItem(index, "valorUnitario", v)
                        }
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#444460"
                      />

                      {/* Total fila */}
                      <View style={[styles.tdTotal, { flex: 2 }]}>
                        <Text style={styles.tdTotalText}>
                          {"$"}
                          {totalFila.toLocaleString("es-CO")}
                        </Text>
                      </View>

                      {/* Eliminar */}
                      <TouchableOpacity
                        style={[styles.tdDelete, { flex: 1 }]}
                        onPress={() => eliminarItem(index)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#F87171"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Indicador de stock — debajo de cada fila */}
                    {productoReal ? (
                      <View style={styles.stockIndicador}>
                        <Ionicons
                          name={
                            stockExcedido
                              ? "warning-outline"
                              : "checkmark-circle-outline"
                          }
                          size={12}
                          color={stockExcedido ? "#F87171" : "#34D399"}
                        />
                        <Text
                          style={[
                            styles.stockIndicadorText,
                            { color: stockExcedido ? "#F87171" : "#34D399" },
                          ]}
                        >
                          {stockExcedido
                            ? `Máximo disponible: ${productoReal.stock}`
                            : `Disponible: ${productoReal.stock} unidades`}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}

              {/* Agregar ítem */}
              <TouchableOpacity style={styles.btnAgregar} onPress={agregarItem}>
                <Ionicons name="add-circle-outline" size={16} color="#34D399" />
                <Text style={styles.btnAgregarText}>Agregar otro ítem</Text>
              </TouchableOpacity>

              {/* Total general */}
              <View style={styles.totalBox}>
                <Text style={styles.totalBoxLabel}>Total del pedido</Text>
                <Text style={styles.totalBoxValor}>
                  {"$"}
                  {calcularTotal().toLocaleString("es-CO")}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.btnGuardar, guardando && { opacity: 0.6 }]}
                onPress={registrar}
                disabled={guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="#0A0A0F" />
                ) : (
                  <Text style={styles.btnGuardarText}>Registrar Pedido</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={cerrarModal}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── Modal selector de producto ─── */}
      <Modal visible={selectorVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Seleccionar Producto</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {productos.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.productoOption,
                    p.stock === 0 && { opacity: 0.4 },
                  ]}
                  onPress={() => p.stock > 0 && seleccionarProducto(p)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productoOptionName}>{p.name}</Text>
                    <Text style={styles.productoOptionCat}>{p.category}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.productoOptionPrice}>
                      {"$"}
                      {Number(p.price).toLocaleString("es-CO")}
                    </Text>
                    <Text
                      style={[
                        styles.productoOptionStock,
                        p.stock === 0 && { color: "#F87171" },
                      ]}
                    >
                      {"Stock: "}
                      {p.stock}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setSelectorVisible(false)}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  center: {
    flex: 1,
    backgroundColor: "#0A0A0F",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#8888AA", marginTop: 12, fontSize: 14 },
  content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#0D0D17",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pedidoId: {
    color: "#444460",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeTxt: { fontSize: 12, fontWeight: "600" },
  cliente: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  sep: { height: 1, backgroundColor: "#1E1E2E", marginVertical: 14 },
  totalLabel: { color: "#555570", fontSize: 13 },
  total: { color: "#34D399", fontWeight: "bold", fontSize: 17 },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#34D399",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0D0D17",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "92%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#1E1E2E",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#8888AA",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#12121F",
    borderWidth: 1,
    borderColor: "#1E1E2E",
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E1E2E",
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  thText: { color: "#8888AA", fontSize: 11, fontWeight: "600" },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121F",
    borderRadius: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    overflow: "hidden",
  },
  tdProducto: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#1E1E2E",
  },
  tdProductoText: { color: "#FFFFFF", fontSize: 12, flex: 1 },
  tdProductoPlaceholder: { color: "#444460", fontSize: 12, flex: 1 },
  tdInput: {
    color: "#FFFFFF",
    fontSize: 13,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#1E1E2E",
    textAlign: "center",
  },
  tdInputError: { color: "#F87171" }, // ← rojo si excede stock
  tdTotal: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#1E1E2E",
  },
  tdTotalText: { color: "#34D399", fontSize: 12, fontWeight: "600" },
  tdDelete: { alignItems: "center", justifyContent: "center", padding: 10 },
  stockIndicador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingBottom: 6,
    paddingTop: 2,
  },
  stockIndicadorText: { fontSize: 11 },
  btnAgregar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#34D39933",
    borderStyle: "dashed",
    justifyContent: "center",
    marginTop: 8,
  },
  btnAgregarText: { color: "#34D399", fontSize: 14 },
  totalBox: {
    backgroundColor: "#34D39915",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#34D39933",
  },
  totalBoxLabel: { color: "#8888AA", fontSize: 14 },
  totalBoxValor: { color: "#34D399", fontWeight: "bold", fontSize: 20 },
  btnGuardar: {
    backgroundColor: "#34D399",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  btnGuardarText: { color: "#0A0A0F", fontWeight: "bold", fontSize: 16 },
  btnCancelar: { padding: 14, alignItems: "center" },
  btnCancelarText: { color: "#555570", fontSize: 15 },
  productoOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E2E",
  },
  productoOptionName: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  productoOptionCat: { color: "#8888AA", fontSize: 12, marginTop: 2 },
  productoOptionPrice: { color: "#34D399", fontWeight: "bold", fontSize: 15 },
  productoOptionStock: { color: "#34D399", fontSize: 11, marginTop: 2 },
});
