import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import * as firebase from "firebase";

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
