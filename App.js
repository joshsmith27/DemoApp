import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function App() {
	const [manager, setManager] = React.useState(null);
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

	return (
		<View style={styles.container}>
			<Text>Yep I'm A Test</Text>
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
