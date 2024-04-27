//App.js

import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	Image,
	TouchableOpacity,
} from "react-native";
//import CameraComponent from "./CameraPicker";
import { Camera } from "expo-camera";
import { ImagePicker, Permissions, MediaLibrary } from 'expo';

const CameraComponent = () => {
  const [photo, setPhoto] = useState(null);

  const takePicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      // Handle the error.
      return;
    }

    const photo = await ImagePicker.launchCameraAsync();
	if (!photo.cancelled) {
		setPhoto(photo);
	  }
  };

  const saveImage = async () => {
	if (!photo) {
		return;
	  }
	  try {
		const asset = await MediaLibrary.createAssetAsync(photo.uri);
		console.log("Image saved to gallery:", asset);
	  } catch (error) {
		console.error("Error saving image to gallery:", error);
	  }
    // Do something with the asset, such as displaying it or uploading it to a server.
  };

  return (
    <View>
      <Button title="Take Picture" onPress={takePicture} />
      {photo && <Image source={{ uri: photo.uri }} />}
      {photo && <Button title="Save Image" onPress={saveImage} />}
    </View>
  );
};

export default function App() {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);

	const [showNewScreen, setShowNewScreen] = useState(false);

	useEffect(() => {
		(async () => {
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === "granted");
		})();
	}, []);

	const takePicture = async () => {
		if (camera) {
			const data = await camera.takePictureAsync(null);
			setImage(data.uri);
			try {
				const asset = await MediaLibrary.createAssetAsync(data.uri);
				console.log("Image saved to gallery:", asset);
			  } catch (error) {
				console.error("Error saving image to gallery:", error);
			  }
		}
	};

	const retakePicture = () => {
		setImage(null);
	};

	const savePicture = () => {
		setShowNewScreen(true);
	  };

	if (hasCameraPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.Heading}>Camera App</Text>
			<Text style={styles.SubHeading}>By Prit</Text>
			<View style={styles.box}>
				{!image ? (
					<View style={styles.cameraContainer}>
						<Camera
							ref={(ref) => setCamera(ref)}
							style={styles.fixedRatio}
							type={Camera.Constants.Type.back}
							ratio={"1:1"}
						/>
					</View>
				) : (
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: image }}
							style={styles.previewImage}
						/>
						<TouchableOpacity
							style={styles.retakeButton}
							onPress={retakePicture}
						>
							<Text style={styles.retakeButtonText}>Retake</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
			{!image && (
				<TouchableOpacity
					style={styles.takePictureButton}
					onPress={takePicture}
				>
					<Text style={styles.takePictureButtonText}>
						Take Picture
					</Text>
				</TouchableOpacity>
			)}
			<Button title="Save Picture" onPress={savePicture} />
			{showNewScreen && <CameraComponent />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	Heading: {
		fontSize: 40,
		fontWeight: "bold",
		padding: 20,
		color: "black",
	},
	SubHeading: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 20,
		marginTop: -20,
	},
	box: {
		flex: 0.7,
		borderWidth: 2,
		borderColor: "black",
		margin: 10,
		overflow: "hidden",
		borderRadius: 10,
	},
	cameraContainer: {
		flex: 1,
		aspectRatio: 1,
	},
	fixedRatio: {
		flex: 1,
		aspectRatio: 1,
	},
	takePictureButton: {
		backgroundColor: "blue",
		padding: 20,
		borderRadius: 10,
		alignSelf: "center",
		position: "absolute",
		bottom: 30,
	},
	takePictureButtonText: {
		color: "white",
		fontSize: 18,
	},
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	previewImage: {
		flex: 1,
		width: "100%",
		resizeMode: "cover",
	},
	retakeButton: {
		position: "absolute",
		bottom: 30,
		backgroundColor: "red",
		padding: 20,
		borderRadius: 10,
	},
	retakeButtonText: {
		color: "white",
		fontSize: 18,
	},
});
