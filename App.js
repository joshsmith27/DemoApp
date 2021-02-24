import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid } from 'react-native';
import * as WifiManager from 'react-native-wifi-reborn';
import * as Location from 'expo-location';

export default function App() {
	// console.log({ WifiManager });
	const [manager, setManager] = React.useState(null);
	const [granted, setGranted] = React.useState(true);
	const [location, setLocation] = React.useState(null);
	const [errorMsg, setErrorMsg] = React.useState(null);

	React.useEffect(() => {
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
			console.log(location);
		})();
	}, []);

	const scanAndConnect = async () => {
		manager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				console.log({ error, stuff: 'crap' });
				// Handle error (scanning will be stopped automatically)
				return;
			}

			// Check if it is a device you are looking for based on advertisement data
			// or other criteria.
			console.log({ device: device.name });
			if (device.name === 'C-by-GE-9B785A3D') {
				// Stop scanning as it's not necessary if you are scanning for one device.
				manager.stopDeviceScan();

				// Proceed with connection.
			}
		});
	};
	React.useEffect(() => {
		const response = new BleManager();
		setManager(response);
	}, []);

	React.useEffect(() => {
		if (manager) {
			const subscription = manager.onStateChange((state) => {
				console.log({ state });
				if (state === 'PoweredOn') {
					scanAndConnect();
					subscription.remove();
				}
			}, true);
		}
	}, [manager]);

	React.useEffect(() => {
		(async () => {
			if (Platform.OS === 'android') {
				const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
					title: 'Location permission is required for WiFi connections',
					message: 'This app needs location permission as this is required  ' + 'to scan for wifi networks.',
					buttonNegative: 'DENY',
					buttonPositive: 'ALLOW',
				});
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					setGranted(true);
					console.log(`you're in the band!`);
				} else {
					console.log(`we're going to go another direction`);
				}
			}
		})();
	}, []);

	React.useEffect(() => {
		if (granted || Platform.OS === 'ios') {
			WifiManager.default.getCurrentWifiSSID().then(
				(ssid) => {
					console.log('Your current connected wifi SSID is ' + ssid);
				},
				(error) => {
					console.log({ error });
				}
			);
		}
	}, [granted]);

	return (
		<View style={styles.container}>
			<Text>Yep I'm A Test Yelp</Text>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
