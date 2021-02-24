import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer';
import { parseRequest } from './hex';
import { generateDataArray } from './cmd';
import { bleInit, monitor } from './BLE';
import { PermissionsAndroid } from 'react-native';
import * as WifiManager from 'react-native-wifi-reborn';
import * as Location from 'expo-location';

export default function App() {
	const [characteristics, setCharacteristics] = React.useState([]);
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

	React.useEffect(() => {
		bleInit(setCharacteristics);
	}, []);

	React.useEffect(() => {
		if (characteristics.length > 0) monitor(characteristics);
	}, [characteristics]);

	const [c] = characteristics.filter((c) => c.isWritableWithResponse);

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
			{c && (
				<>
					<TouchableOpacity
						style={styles.button}
						onPress={async () => {
							try {
								const [cmd] = generateDataArray('setNightLightStatus', true);
								console.log('BLE REQUEST', cmd, parseRequest(cmd));
								await c.writeWithResponse(Buffer.from(cmd, 'hex').toString('base64'));
							} catch (error) {
								console.log('WRITE ERROR', error);
							}
						}}
					>
						<Text style={styles.buttonText}>I am Groot</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						title={'Off'}
						onPress={async () => {
							try {
								const [cmd] = generateDataArray('setNightLightStatus', false);
								console.log('BLE REQUEST', cmd, parseRequest(cmd));
								await c.writeWithResponse(Buffer.from(cmd, 'hex').toString('base64'));
							} catch (error) {
								console.log('WRITE ERROR', error);
							}
						}}
					>
						<Text style={styles.buttonText}>Off</Text>
					</TouchableOpacity>
				</>
			)}
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
	button: {
		alignItems: 'center',
		margin: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: '#555',
		borderRadius: 6,
	},
	buttonText: {
		fontSize: 20,
		color: '#555',
	},
});
