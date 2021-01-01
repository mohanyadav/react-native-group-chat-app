import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

import * as firebase from "firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
    };
  }

  login = () => {
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user.user.uid);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  render() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    });

    return (
      <View style={styles.container}>
        <Text style={styles.title}> Login </Text>

        <TextInput
          label="Email Address"
          mode="flat"
          placeholder="Email"
          value={this.state.email}
          onChangeText={(email) => {
            this.setState({ email });
          }}
          style={styles.textInput}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(password) => {
            this.setState({ password });
          }}
          secureTextEntry={true}
        />

        <Button
          mode="contained"
          onPress={() => {
            this.login();
          }}
        >
          Login Now
        </Button>

        <Button
          mode="text"
          onPress={() => {
            this.props.navigation.push("Register");
          }}
          color="#000"
        >
          Create an account
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
  },
  textInput: {
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },
});
