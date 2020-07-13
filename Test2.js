import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Test2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text> This will be pushed only to Test Branch </Text>
      </View>
    );
  }
}
