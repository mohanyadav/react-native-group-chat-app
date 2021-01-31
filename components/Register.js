import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Colors,
  FAB,
  Provider as PaperProvider,
  ActivityIndicator,
  Portal,
  Dialog,
} from "react-native-paper";

import * as firebase from "firebase";
import * as Device from "expo-device";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      loading: false,
    };
  }

  _saveDeviceModelToDB = (userID) => {
    const modelName = Device.modelName;

    // Save to database the Device modelName the user is using
    firebase
      .database()
      .ref("users/" + userID + "/device")
      .set({
        device_model_name: modelName,
      })
      .then(() => {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  register = () => {
    const { email, password } = this.state;
    this.setState({ loading: true });

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userID = user.user.uid;
        this._saveDeviceModelToDB(userID);
      })
      .catch((error) => {
        alert(error.message);
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <PaperProvider>
        <Portal>
          <Dialog visible={this.state.loading} dismissable={false}>
            <Dialog.Title>Signing you up...</Dialog.Title>
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

        <View style={styles.container}>
          <FAB
            style={styles.backBtn}
            icon="arrow-left"
            onPress={() => this.props.navigation.goBack()}
          ></FAB>

          <Text style={styles.title}> Register </Text>

          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={this.state.email}
            onChangeText={(email) => {
              this.setState({ email });
            }}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={this.state.password}
            onChangeText={(password) => {
              this.setState({ password });
            }}
          />

          <Button
            mode="contained"
            onPress={() => {
              this.register();
            }}
          >
            Register Now
          </Button>
        </View>
      </PaperProvider>
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
