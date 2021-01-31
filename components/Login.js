import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  TextInput,
  Portal,
  Dialog,
  Provider as PaperProvider,
  Provider,
} from "react-native-paper";

import * as firebase from "firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      loading: false,
    };
  }

  login = () => {
    const { email, password } = this.state;

    this.setState({ loading: true });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user.user.uid);
      })
      .catch((error) => {
        alert(error.message);
        this.setState({ loading: false });
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
      <Provider>
        <Portal>
          <Dialog visible={this.state.loading} dismissable={false}>
            <Dialog.Title>Logging in...</Dialog.Title>
            <Dialog.Content>
              <ActivityIndicator
                size={60}
                animating={true}
                hidesWhenStopped={true}
                color="#6200EE"
              />
            </Dialog.Content>
          </Dialog>
        </Portal>

        <SafeAreaView style={styles.container}>
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

          {/* Forgot Password Button */}
          <Button
            mode="text"
            onPress={() => {
              this.props.navigation.push("ForgotPassword");
            }}
            color="#aaa"
          >
            Forgot Password
          </Button>

          <Button
            mode="text"
            onPress={() => {
              this.setState({ loading: true });
            }}
            color="#aaa"
          >
            Show Dialog
          </Button>
        </SafeAreaView>
      </Provider>
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
