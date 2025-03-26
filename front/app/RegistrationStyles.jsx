import { setParams } from "expo-router/build/global-state/routing";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    color: "white",
    fontWeight: "medium",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    width: "85%",
    fontSize: 24,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  row_for_sex_and_date: {
    width: "85%",
    justifyContent: "space-between",
  },
  toggle_male: {
    backgroundColor: "#333",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 10,
    width: 45,
  },
  toggle_all: {
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "black",
  },
  toggle_female: {
    textAlign: "center",
    backgroundColor: "#333",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
    width: 45,
  },
  selected_male: {
    backgroundColor: "#00C5F1",
  },
  selected_all: {
    backgroundColor: "#63C7B2",
  },
  selected_female: {
    backgroundColor: "#FF4081",
  },
  symbol: {
    color: "white",
    fontSize: 18,
  },
  dateInput: {
    backgroundColor: "#333",
    color: "white",
    width: 40,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    textAlign: "center",
  },
  input_dd: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
  },
  input_mm: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "black",
  },
  input_yy: {
    width: 60,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
  },
  lineWithText: {
    flexDirection: "row",
    width: "85%",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#555",
    marginHorizontal: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 24,
  },
  row_for_pref: {
    width: "70%",
    justifyContent: "space-between",
  },
  prefButton: {
    width: 80,
    height: 60,
    backgroundColor: "#333",
    borderRadius: 15,
  },
  prefText: {
    fontSize: 16,
    lineHeight: 60,
    textAlign: "center",
    alignItems: "center",
    color: "white",
  },
  gradient: {
    marginTop: 10,
    borderRadius: 12,
  },
  button: {
    width: 130,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    lineHeight: 60,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    fontSize: 20,
    color: "#586994",
  },
});

export default styles;
