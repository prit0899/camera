import React, { useState } from 'react';
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
    setPhoto(photo);
  };

  const saveImage = async () => {
    const asset = await MediaLibrary.createAssetAsync(photo.uri);
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

export default CameraComponent;