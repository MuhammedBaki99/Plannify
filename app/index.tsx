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
}: {
  todo: string | null;
  id: number;
  type: string;
  createdAt: Date;
  deleteTodo: (id: number) => void;
}) => (
  <View style={styles.todoItem}>
    <View style={styles.ItemBtnList}>
      <Pressable onPress={() => deleteTodo(id)}>
        <FontAwesome name="trash" size={20} color="white" />
      </Pressable>
      <Pressable>
        <FontAwesome name="pencil" size={20} color="white" />
      </Pressable>
      <Pressable>
        <FontAwesome name="check" size={20} color="white" />
      </Pressable>
    </View>
    {type === "text" ? (
      <Text style={styles.todoText}>{todo}</Text>
    ) : (
      <TextInput
        placeholder="Yapılacak..."
        style={styles.todoAddInput}
        value={todo ?? ""}
      />
    )}
  </View>
);
export default function App() {
  const idCounter = useRef(1);
  const [todoText, setTodoText] = useState<string | null>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    console.log(todoText);
  }, [todoText]);

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
      idCounter.current += 1; // ID’yi bir artır
    }
  };
  const deleteTodo = (id: number) => {
    setTodoList(todoList.filter((x) => x.id !== id));
  };

  const ChangeType = (id: number) => {
    
  }

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
  title: {
    fontSize: 20,
    color: "purple",
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
});
