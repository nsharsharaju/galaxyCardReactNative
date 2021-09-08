import * as React from 'react';
import { StyleSheet , TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { Camera } from 'expo-camera';

import {
 Feather as Icon
} from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native';

import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'

const CameraCompenent = () => {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [type, setType] = React.useState(Camera.Constants.Type.back);

  const isFocused = useIsFocused();

  const cam = React.useRef().current

  const _takePicture = async () => {
    const options = {
      quality: 0.5,
      base64: true,
      skipProcessing: false
    }

    const picture = cam.takePictureAsync(options)
    console.log(picture)

    if(picture.source) {
      cam.current.resumePreview()
      handleSave(picture)
      console.log("picture source",picture)
    }
  }

  const handleSave = async(photo:string) => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if(status === 'granted'){
      const assert = await MediaLibrary.createAssetAsync(photo)
      MediaLibrary.createAlbumAsync('Tutorial', assert)
    } else {
      console.log("Oh, You Missed to give permissions")
    }
  }


  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles2.container}>
      { isFocused && <Camera ref = {cam} style={styles2.camera} type={type}>
        <View style={styles2.buttonContainer}>
          <TouchableOpacity
            style={styles2.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles2.text}> Flip </Text>
          </TouchableOpacity>
        </View>
        <View style={styles2.buttonContainer}>
          <TouchableOpacity
            style={styles2.button}
            onPress={() => _takePicture}>
            <Icon name="aperture" size={50} color="white"></Icon>
          </TouchableOpacity>
        </View>
      </Camera> }
    </View>
  );
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <CameraCompenent></CameraCompenent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
