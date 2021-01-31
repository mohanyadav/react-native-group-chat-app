import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  FAB,
  Dialog,
  Portal,
  Provider as PaperProvider,
  TextInput,
  ActivityIndicator,
  Colors,
} from "react-native-paper";
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

import { convertEpochToDateMonthYear } from "../logic/helpers";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device_model_name: null,
      user_update: null,
      imageURI: null,
      showCreateGroupDialog: false,
      showCreateGroupDialogLoader: false,
      groupName: null,
      showLoader: false,
      groupData: null,
      loading: false,
      loading_dialog_text: "",
    };
  }

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;

    this._getDataFromDB(uid);
    this.getAllGroupData(uid);
  }

  _getDataFromDB = (uid) => {
    firebase
      .database()
      .ref("users/" + uid)
      .once("value")
      .then((data) => {
        const data1 = data.val();

        this.setState({
          device_model_name: data1.device.device_model_name,
          imageURI: data1.profile_url,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  _updateProfileURL = (downloadURL, uid) => {
    this.setState({ loading_dialog_text: "Updating database..." });
    firebase
      .database()
      .ref("users/" + uid)
      .update({
        profile_url: downloadURL,
      })
      .then(() => {
        this.setState({ loading: false });
        console.log("Finished updating database...");
      })
      .catch((error) => {
        alert(error.message);
        this.setState({ loading: false });
      });
  };

  uploadImageToDB = async (fileURI) => {
    this.setState({
      imageURI: fileURI,
    });

    // Pull UID of the current user
    const uid = firebase.auth().currentUser.uid;

    // Create Reference
    var storageRef = firebase.storage().ref();

    // Define path and image name
    var imageRef = storageRef.child("profiles/" + uid);

    // Fetch the image
    let response = await fetch(fileURI);
    let blob = await response.blob();

    this.setState({
      loading: true,
      loading_dialog_text: "Uploading Profile Picture...",
    });

    // Upload Image
    imageRef
      .put(blob)
      .then(() => {
        console.log("Uploaded...");
        imageRef.getDownloadURL().then((url) => {
          this._updateProfileURL(url, uid);
        });
      })
      .catch((error) => {
        alert(error.message);
        this.setState({ loading: false });
      });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      this.uploadImageToDB(result.uri);
    }
  };

  createGroup = (groupName, uid) => {
    // console.log(groupName);
    this.setState({
      showLoader: true,
    });

    const dateNow = Date.now();

    // Get a reference to the Group Unique ID
    let groupRef = firebase.database().ref("groups/").push();

    let groupKey = groupRef.key;
    // console.log(groupKey);

    let updateUserData = {};
    updateUserData["users/" + uid + "/groups/" + groupKey] = {
      group_id: groupKey,
      group_name: groupName,
      created_at: dateNow,
    };
    updateUserData["groups/" + groupKey] = {
      group_name: groupName,
      adminId: uid,
      created_at: dateNow,
      members: {
        [uid]: uid,
      },
    };

    // Save the data in firebase
    firebase
      .database()
      .ref()
      .update(updateUserData)
      .then(() => {
        this.getAllGroupData(uid);
        // Successfully executed
        // Hide the dialog box
        // Hide the show loader
        this.setState({
          groupName: null,
          showCreateGroupDialog: false,
          showLoader: false,
        });
      })
      .catch((error) => {
        alert(error.message);
      });

    // Get the group data
  };

  getAllGroupData = (uid) => {
    this.setState({
      loading: true,
      loading_dialog_text: "Getting group data...",
    });
    // Get all group data
    firebase
      .database()
      .ref("users/" + uid + "/groups/")
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        // console.log("================================");
        // console.log(data);

        let dataArray = new Array();
        for (const key in data) {
          dataArray.push(data[key]);
          // const element = object[key];
          // console.log(data[key]["group_name"]); // key["group_name"]
        }

        this.setState({
          groupData: dataArray,
          loading: false,
        });
      });
  };

  render() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user == null) {
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    const { email, uid } = firebase.auth().currentUser;
    const {
      showCreateGroupDialog,
      showLoader,
      groupName,
      groupData,
    } = this.state;

    return (
      <PaperProvider>
        <View style={styles.container}>
          <Portal>
            <Dialog
              dismissable={showLoader == true ? false : true}
              visible={showCreateGroupDialog}
              onDismiss={() => {
                this.setState({ showCreateGroupDialog: false });
              }}
            >
              <Dialog.Title>Create Group</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  disabled={showLoader}
                  mode="flat"
                  placeholder="Enter Group Name"
                  value={this.state.groupName}
                  onChangeText={(groupName) => {
                    this.setState({ groupName });
                  }}
                  style={styles.textInput}
                />
              </Dialog.Content>
              <Dialog.Actions>
                {showLoader == true ? (
                  <ActivityIndicator
                    size="large"
                    animating={true}
                    color={Colors.purple500}
                  />
                ) : (
                  <Button onPress={() => this.createGroup(groupName, uid)}>
                    Done
                  </Button>
                )}
              </Dialog.Actions>
            </Dialog>

            <Dialog visible={this.state.loading} dismissable={false}>
              <Dialog.Title>{this.state.loading_dialog_text}</Dialog.Title>
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

          <Image
            source={
              this.state.imageURI == null
                ? require("../assets/default_profile.png")
                : { uri: this.state.imageURI }
            }
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <Text style={styles.email}> {email} </Text>

          <View style={styles.buttonGroup}>
            <Button
              style={styles.uploadImageButton}
              mode="contained"
              onPress={() => {
                this.pickImage();
              }}
            >
              Upload Image
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                this.setState({
                  loading: true,
                  loading_dialog_text: "Logging out...",
                });
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              }}
            >
              Logout
            </Button>
          </View>

          {groupData == null || groupData == "" ? (
            <Text>You don't have any groups!</Text>
          ) : (
            <FlatList
              style={{ paddingTop: 10, paddingBottom: 10 }}
              data={groupData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ChatDetail", {
                      groupName: item.group_name,
                      createdAt: convertEpochToDateMonthYear(item.created_at),
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                    backgroundColor: Colors.white,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    width: 380,
                    borderWidth: 1,
                    borderColor: Colors.blueGrey500,
                    borderRadius: 14,
                  }}
                >
                  <Image
                    style={styles.groupImage}
                    source={
                      item.group_image == null
                        ? require("../assets/team.png")
                        : { uri: item.group_image }
                    }
                  />
                  <View>
                    <Text style={styles.groupTitle}>{item.group_name}</Text>
                    <Text style={styles.groupSubTitle}>
                      {convertEpochToDateMonthYear(item.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.group_id}
            />
          )}

          <FAB
            style={styles.fab}
            icon="plus"
            label="Create Group"
            onPress={() => this.setState({ showCreateGroupDialog: true })}
          />

          <FAB
            style={styles.fabLeft}
            icon="refresh"
            onPress={() => this.getAllGroupData(uid)}
          />
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  // loaderView: {
  //   height: "100%",
  //   width: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   position: "absolute",
  //   zIndex: 20,
  //   backgroundColor: "rgba(0, 0, 0, 0.4)",
  // },
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textInput: {
    width: 200,
    borderColor: "#000",
    borderWidth: 2,
    margin: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 20,
  },
  uploadImageButton: {
    marginRight: 12,
  },
  email: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 20,
    backgroundColor: "#ba0089",
  },
  fabLeft: {
    position: "absolute",
    left: 0,
    bottom: 0,
    margin: 20,
    backgroundColor: "#ba0089",
  },

  groupTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  groupSubTitle: {
    fontSize: 16,
    color: Colors.blueGrey600,
  },
  groupImage: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: Colors.grey50,
  },
});
