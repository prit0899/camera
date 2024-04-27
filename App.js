//App.js

import React, { useState, useEffect,PermissionsAndroid  } from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	Image,
	TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { MediaLibrary } from 'expo';

export default function App() {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);


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
		const granted = await PermissionsAndroid.request(
		  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
		  console.log('You can use the camera');

		  try {
			const asset = await MediaLibrary.createAssetAsync(data.uri);
			console.log("Image saved to gallery:", asset);
		  } catch (error) {
			console.error("Error saving image to gallery:", error);
		  }

		} else {
		  console.log('Camera permission denied');
		}
	  } catch (err) {
		console.warn(err);
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
