// app/(tabs)/categorias.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUsers, createUser, updateUsers } from "../../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [SaveUser, setSaveUser] = useState(false);
  const [UserUpdate, setUserUpdate] = useState(null);

  const [form, setForm] = useState({
    idCard: "",
    name: "",
    lastName: "",
    email: "",
  });
  useEffect(() => {
    LoadingUsers();
  }, []);

  const LoadingUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudieron cargar los usuarios: " + error.message,
      );
    } finally {
      setLoading(false);
    }
  };
  //actualiza formulario
  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const cerrarModal = () => {
    setModal(false);
    setUserUpdate(null); // ← limpia el producto en edición
    setForm({ idCard: "", name: "",lastName: "",email: "" });
  };
  const openEdit = (user) => {
    // Precarga el formulario con los datos del producto seleccionado
    setForm({
      idCard: String(user.idCard),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    });
    setUserUpdate(user); // guarda el producto que se está editando
    setModal(true);
  };
  const Save = async () => {
    if (
      !form.idCard.trim() ||
      !form.name.trim() ||
      !form.lastName.trim() ||
      !form.email.trim()
    ) {
      Alert.alert("Campos requeridos", "son obligatorios");
      return;
    }

    setSaveUser(true);
    try {
      if (UserUpdate) {
        await updateUsers({
          idCard: form.idCard,
          name: form.name,
          lastName: form.lastName,
          email: form.email,
        });
      } else {
        await createUser({
          idCard: form.idCard,
          name: form.name,
          lastName: form.lastName,
          email: form.email,
        });
      }

      cerrarModal();
      await LoadingUsers();
    } catch (error) {
      Alert.alert("Error al guardar", error.message);
    } finally {
      setSaveUser(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Cargando Usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {users.map((u, index) => (
          <View key={u.idCard} style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.icon}>
                <Ionicons name="person" size={18} color="#A78BFA" />
              </View>

              <View style={{ flex: 1 }}>
                 <Text style={styles.catNombre}>{u.idCard}</Text>
                  <Text style={styles.catNombre}>{u.name}</Text>
                  <Text style={styles.catNombre}>{u.lastName}</Text>
                   <Text style={styles.catNombre}>{u.email}</Text>
              </View>
              
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => openEdit(u)}
            >
              <Ionicons name="pencil" size={15} color="#A78BFA" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
        <Ionicons name="add" size={28} color="#0A0A0F" />
      </TouchableOpacity>

      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>
              {UserUpdate ? "Editar usuario" : "Nuevo usuario"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nº De Identificación"
              placeholderTextColor="#444460"
              value={form.idCard}
              onChangeText={(v) => updateForm("idCard", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#444460"
              value={form.name}
              onChangeText={(v) => updateForm("name", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#444460"
              value={form.lastName}
              onChangeText={(v) => updateForm("lastName", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#444460"
              value={form.email}
              onChangeText={(v) => updateForm("email", v)}
            />
            <TouchableOpacity
              style={[styles.btn, SaveUser && { opacity: 0.6 }]}
              onPress={Save}
              disabled={SaveUser}
            >
              {SaveUser ? (
                <ActivityIndicator color="#0A0A0F" />
              ) : (
                <Text style={styles.btnGuardarText}>
                  {UserUpdate ? "Actualizar Usuario" : "Guardar Usuario"}
                </Text>
              )}
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
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    borderLeftWidth: 4,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
    cardLeft:                 { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  catNombre: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
  catCount: { color: "#555570", fontSize: 13, marginTop: 3 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontWeight: "bold", fontSize: 14 },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F59E0B",
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
    marginBottom: 20,
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
  btn: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  btnText: { color: "#0A0A0F", fontWeight: "bold", fontSize: 16 },
  btnC: { padding: 14, alignItems: "center" },
  btnCText: { color: "#555570", fontSize: 15 },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#A78BFA18",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#A78BFA33",
  },
});
