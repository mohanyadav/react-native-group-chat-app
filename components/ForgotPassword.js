import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput, FAB, Colors } from "react-native-paper";

import * as firebase from "firebase";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
    };
  }

  sendResetLink = () => {
    const { email } = this.state;

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Please check your email for resetting the password");
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
        <FAB
          style={styles.backBtn}
          icon="arrow-left"
          onPress={() => this.props.navigation.goBack()}
        ></FAB>

        <Text style={styles.title}> Retrieve Password </Text>

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
    
        <Button
          mode="contained"
          onPress={() => {
            this.sendResetLink();
          }}
        >
          Send Reset Link
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
  backBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.indigo600,
    borderRadius: 30,
    position: "absolute",
    zIndex: 100,
    top: 30,
    left: 20,
  },
});
