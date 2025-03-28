import React, { useState } from "react";
import styles from "./RegistrationStyles";
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaleIcon, FemaleIcon } from "./ReloadIcon";
import { Stack } from "expo-router";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import { LayoutAnimation, UIManager} from "react-native";
import { useRouter } from "expo-router";


export default function RegistrationScreen() {
  const router = useRouter();


  const genderOpacity = useRef(new Animated.Value(0)).current;


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [sex, setSex] = useState("other");
  const [preference, setPreference] = useState("all");

  const sendRegistration = async () => {
    try {
      const response = await fetch("http://172.20.10.8/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          nickname,
          sex,
          birthday: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
          password,
          gender: gender || "",
          preference,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
      } else {
        const text = await response.text();
        console.log("✅ Registered:", text);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  };

  
  const genderHeight = useRef(new Animated.Value(sex === "other" ? 70 : 0)).current;


  useEffect(() => {
    Animated.timing(genderHeight, {
      toValue: sex === "other" ? 70 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sex]);
  



  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Registration</Text>

          <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#ccc" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#ccc" style={styles.input} />

          <View style={[styles.row, styles.row_for_sex_and_date]}>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.toggle_male, sex === "male" && styles.selected_male]} onPress={() => setSex("male")}>
                <View style={{ alignItems: "center" }}>
                  <MaleIcon size={20} color="#000000" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggle_all, sex === "other" && styles.selected_all]} onPress={() => setSex("other")}>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.symbol}></Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggle_female, sex === "female" && styles.selected_female]} onPress={() => setSex("female")}>
                <View style={{ alignItems: "center" }}>
                  <FemaleIcon size={20} color="#000000" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TextInput value={day} onChangeText={setDay} placeholder="DD" placeholderTextColor="#ccc" style={[styles.dateInput, styles.input_dd]} />
              <TextInput value={month} onChangeText={setMonth} placeholder="MM" placeholderTextColor="#ccc" style={[styles.dateInput, styles.input_mm]} />
              <TextInput value={year} onChangeText={setYear} placeholder="YYYY" placeholderTextColor="#ccc" style={[styles.dateInput, styles.input_yy]} />
            </View>
          </View>

          <Animated.View
  pointerEvents={sex === "other" ? "auto" : "none"}
  style={{
    width: "85%",
    overflow: "hidden",
    height: genderHeight,
  }}
>
  {sex === "other" || (genderHeight as any)._value > 0 ? (
    <TextInput
      value={gender ?? ""}
      onChangeText={(text) => setGender(text === "" ? null : text)}
      placeholder="Gender"
      placeholderTextColor="#ccc"
      style={[styles.input, styles.input_gender]}
    />
  ) : null}
</Animated.View>

          <TextInput value={nickname} onChangeText={setNickname} placeholder="Nickname" placeholderTextColor="#ccc" style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#ccc" secureTextEntry style={styles.input} />
          


          <View style={styles.lineWithText}>
            <View style={styles.line} />
            <Text style={styles.subtitle}>My preferences</Text>
            <View style={styles.line} />
          </View>

          <View style={[styles.row, styles.row_for_pref]}>
            <TouchableOpacity style={[styles.prefButton, preference === "men" && styles.selected_male]} onPress={() => setPreference("men")}>
              <Text style={styles.prefText}>Men</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.prefButton, preference === "all" && styles.selected_all]} onPress={() => setPreference("all")}>
              <Text style={styles.prefText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.prefButton, preference === "women" && styles.selected_female]} onPress={() => setPreference("women")}>
              <Text style={styles.prefText}>Women</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={["#FF4081", "#F77F00"]} start={{ x: 1.2, y: 0.5 }} end={{ x: 0, y: 1 }} locations={[0.48, 0.84]} style={styles.gradient}>
            <TouchableOpacity style={styles.button} onPress={sendRegistration}>
              <Text style={styles.text}>Next</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.footer}>Already have account</Text>
          </TouchableOpacity>
          
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
