import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Todo = {
  id: number;
  todo: string | null;
  type: string;
  createdAt: Date;
};

const Item = ({
  todo,
  type,
  id,
  createdAt,
  deleteTodo,
  changeType,
  ChangeTodo,
  updateTodoText,
}: {
  todo: string | null;
  id: number;
  type: string;
  createdAt: Date;
  deleteTodo: (id: number) => void;
  changeType: (id: number) => void;
  ChangeTodo: (id: number) => void;
  updateTodoText: (id: number, text: string) => void;
}) => (
  <View style={styles.todoItem}>
    <View style={styles.ItemBtnList}>
      <Pressable
        onPress={() => deleteTodo(id)}
        style={{ opacity: type === "text" ? 1 : 0.5 }}
      >
        <FontAwesome name="trash" size={20} color="white" />
      </Pressable>

      {type === "text" ? (
        <Pressable onPress={() => changeType(id)}>
          <FontAwesome name="pencil" size={20} color="white" />
        </Pressable>
      ) : (
        <Pressable onPress={() => ChangeTodo(id)}>
          <FontAwesome name="check" size={20} color="white" />
        </Pressable>
      )}

      <Pressable
        disabled={type !== "text"}
        style={{ opacity: type === "text" ? 1 : 0.5 }}
        onPress={() => console.log("tıklandı")}
      >
        <FontAwesome name="check" size={20} color="white" />
      </Pressable>
    </View>

    {type === "text" ? (
      <Text style={styles.todoText}>{todo}</Text>
    ) : (
      <TextInput
        placeholder="Yapılacak..."
        defaultValue={todo ?? ""}
        onChangeText={(text: string) => updateTodoText(id, text)}
        multiline
        numberOfLines={3}
        style={styles.todoTextarea}
      />
    )}

    <Text style={styles.todoDate}>
      {new Date(createdAt).toLocaleDateString()}
    </Text>
  </View>
);

export default function App() {
  const idCounter = useRef(1);
  const [todoText, setTodoText] = useState<string | null>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const saveTodoList = async (list: Todo[]) => {
    try {
      const jsonValue = JSON.stringify(list);
      await AsyncStorage.setItem("@todo_list", jsonValue);
    } catch (e) {
      console.error("Veri kaydedilirken hata:", e);
    }
  };

  const loadTodoList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@todo_list");
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        const todos = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
        setTodoList(todos);

        if (todos.length > 0) {
          idCounter.current = Math.max(...todos.map((t: Todo) => t.id)) + 1;
        }
      }
    } catch (e) {
      console.error("Veri yüklenirken hata:", e);
    }
  };

  useEffect(() => {
    loadTodoList();
  }, []);

  useEffect(() => {
    saveTodoList(todoList);
  }, [todoList]);

  const AddTodo = (): void => {
    if (todoText && todoText.trim()) {
      const newTodo: Todo = {
        id: idCounter.current,
        todo: todoText,
        type: "text",
        createdAt: new Date(),
      };

      setTodoList((prev) => [...prev, newTodo]);
      setTodoText(null);
      idCounter.current += 1;
    }
  };

  const deleteTodo = (id: number) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const ChangeType = (id: number) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, type: todo.type === "text" ? "input" : "text" }
          : todo
      )
    );
  };

  const ChangeTodo = (id: number) => {
    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, type: "text" } : todo))
    );
  };

  const updateTodoText = (id: number, text: string) => {
    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, todo: text } : todo))
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/plannify.png")}
        style={styles.logo}
      />
      <View style={styles.todoAdd}>
        <TextInput
          placeholder="Yapılacak..."
          style={styles.todoAddInput}
          value={todoText ?? ""}
          onChangeText={(text: string) => setTodoText(text)}
        />

        <Pressable style={styles.todoAddBtn} onPress={AddTodo}>
          <FontAwesome name="plus" size={24} color="white" />
        </Pressable>
      </View>

      <FlatList
        data={todoList}
        renderItem={({ item }) => (
          <Item
            todo={item.todo}
            id={item.id}
            createdAt={item.createdAt}
            deleteTodo={deleteTodo}
            type={item.type}
            changeType={ChangeType}
            ChangeTodo={ChangeTodo}
            updateTodoText={updateTodoText}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.todoListShow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: "70%",
    objectFit: "contain",
  },
  todoAdd: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoAddInput: {
    width: "85%",
    height: 40,
    borderWidth: 2,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: "#8B1C2B",
    textAlign: "center",
    color: "#8B1C2B",
  },
  todoAddBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
    height: 40,
    backgroundColor: "#8B1C2B",
    borderWidth: 1,
    borderColor: "#8B1C2B",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  todoListShow: {
    width: "90%",
    margin: 10,
  },
  todoItem: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    margin: 10,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#8B1C2B",
    overflow: "hidden",
  },
  todoText: {
    padding: 8,
  },
  ItemBtnList: {
    backgroundColor: "#8B1C2B",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    padding: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  todoDate: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#8B1C2B",
    color: "white",
    padding: 4,
    borderTopLeftRadius: 8,
  },
  todoTextarea: {
    flex: 1,
    padding: 8,
    textAlignVertical: "top", // Android'de üstten başlasın
  },
});
