import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { Colors, FAB } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default class ChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: null,
    };
  }

  render() {
    const { groupName, createdAt } = this.props.route.params;
    const { userMessage } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          <View style={styles.topBarSection}>
            <Image
              source={require("../assets/team.png")}
              style={styles.groupImage}
            />
            <View>
              <Text style={styles.groupTitle}>{groupName}</Text>
              <Text style={styles.groupDate}>{createdAt}</Text>
            </View>
          </View>
        </View>
        <Text> ChatDetail </Text>
        <View style={styles.messageBox}>
          <TextInput
            style={styles.messageInput}
            keyboardType="default"
            placeholder="Type a message"
            value={this.state.userMessage}
            onChangeText={(userMessage) => this.setState({ userMessage })}
          />
          <FAB
            style={styles.fab}
            icon="send"
            onPress={() => {
              console.log(userMessage);
              this.setState({ userMessage: null });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  topBar: {
    height: 100,
    backgroundColor: Colors.deepPurple800,
    justifyContent: "center",
  },
  topBarSection: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
  },
  groupDate: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 2,
  },
  groupImage: {
    width: 50,
    height: 50,
    marginLeft: 20,
    borderRadius: 30,
    backgroundColor: Colors.deepPurple300,
  },
  messageBox: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.grey300,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageInput: {
    width: "80%",
    fontSize: 14,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    color: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: Colors.deepPurple300,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
