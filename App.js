import * as React from 'react';
import { StyleSheet, Text, View, Switch, Button, TextInput, KeyboardAvoidingView, ScrollView, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlueToothProvider, BluetoothContext } from './providers/bluetoothProvider';
import Amplify, { Auth } from 'aws-amplify';
import {
  Authenticator,
  Greetings,
  SignUp,
  SignIn,
  ConfirmSignUp,
  ConfirmSignIn,
  RequireNewPassword,
  VerifyContact,
  ForgotPassword,
  Loading,
  AmplifyTheme,
} from 'aws-amplify-react-native';
import awsConfig from './aws-exports';

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: '#111',
  },
  buttonDisabled: {
    ...AmplifyTheme.buttonDisabled,
    backgroundColor: '#666',
  },
  sectionFooterLink: {
    ...AmplifyTheme.sectionFooterLink,
    color: '#111',
  },
  sectionFooterLinkDisabled: {
    ...AmplifyTheme.sectionFooterLinkDisabled,
    color: '#666',
  },
};

Amplify.configure({
  ...awsConfig,
  Analytics: {
    disabled: true,
  },
});

const signOut = async () => {
  try {
    await Auth.signOut({ global: true });
  } catch (error) {
    console.log('error signing out: ', error);
  }
};

export default () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  const handleAuthStateChange = (nextAuthState, authData) => {
    console.log('----AUTH STATE CHANGE----');
    setAuthState(nextAuthState);
    setUser(authData);
  };

  user && console.log('AUTHENTICATED', user.username);
  console.log(authState);

  return (
    <Authenticator onStateChange={handleAuthStateChange} usernameAttributes="email" hideDefault={true} theme={theme}>
      <StatusBar barStyle="dark-content" />
      <SignIn />
      <SignUp />
      <ConfirmSignUp />
      <ConfirmSignIn />
      <RequireNewPassword />
      <VerifyContact />
      <ForgotPassword />
      <Loading />
      {authState === 'signedIn' && user ? (
        <BlueToothProvider>
          <App />
        </BlueToothProvider>
      ) : (
        <View />
      )}
    </Authenticator>
  );
};

function App() {
  const { loading, device, message, send } = React.useContext(BluetoothContext);

  const [batteryRemaining, setBatteryRemaining] = React.useState(false);
  const [batteryChargingStatus, setBatterChargingStatus] = React.useState(false);
  const [wifiStatus, setWifiStatus] = React.useState();
  const [SSID, setSSID] = React.useState();

  const [firmwareVersion, setFirmWareVersion] = React.useState(false);
  const [hardwareVersion, setHardwareVersion] = React.useState(false);
  const [deviceSerialNumber, setDeviceSerialNumber] = React.useState(false);

  const [homeId, setHomeID] = React.useState(false);
  const [emailId, setEmailID] = React.useState(false);

  const [nightLight, setNightLight] = React.useState(false);
  const [panicBuzzer, setPanicBuzzer] = React.useState(false);
  const [alarmLight, setAlarmLight] = React.useState(false);
  const [FMState, setFMState] = React.useState(false);
  const [radioVolume, setRadioVolume] = React.useState(false);
  const [radioPresets, setRadioPresets] = React.useState(false);
  const [wifiSignalStrength, setWifiSignalStrength] = React.useState(false);

  const [value, setValue] = React.useState('Gatsby-2.4G');
  const [password, setPassword] = React.useState('grandcanoe7401');
  const [email, setEmail] = React.useState('jmyrick@bgzbrands.com');

  React.useEffect(() => {
    if (!loading) {
      [
        // 'getBatteryRemaining',
        // 'getBatterChargingStatus',
        'getRouterSSID',
        'getWifiSignalStrength',
        // 'getWifiStatus',
        // 'getFirmWareVersion',
        // 'getDeviceSerialNumber',
        // 'getHardwareVersion',
        // 'getHomeID',
        // 'getEmailID',
        // 'getFMStatus',
        // 'getAlarmLightStatus',
        // 'getRadioVolume',
        // 'getPresetFrequencies',
      ].forEach(send);
      // setInterval(() => {
      //   ['getWifiSignalStrength', 'getRouterSSID'].forEach(send);
      // }, 5000);
    }
  }, [loading]);

  React.useEffect(() => {
    if (!message) return;
    if (message.operation === null) return;
    console.log('[MESSAGE]', message.operation, message.data);
    if (message.operation === 'getFirmWareVersion') setFirmWareVersion(message.data);
    if (message.operation === 'getHardwareVersion') setHardwareVersion(message.data);
    if (message.operation === 'getDeviceSerialNumber') setDeviceSerialNumber(message.data);
    if (message.operation === 'getBatteryRemaining') setBatteryRemaining(message.data);
    if (message.operation === 'getBatterChargingStatus') setBatterChargingStatus(message.data);
    if (message.operation === 'getHomeID') setHomeID(message.data);
    if (message.operation === 'getEmailID') setEmailID(message.data);
    if (message.operation === 'getFMStatus') setFMState(!!message.data);
    if (message.operation === 'getAlarmLightStatus') setPanicBuzzer(!!message.data);
    if (message.operation === 'getRadioVolume') setRadioVolume(message.data);
    if (message.operation === 'getWifiStatus') setWifiStatus(message.data);
    if (message.operation === 'getWifiSignalStrength') setWifiSignalStrength(message.data);
    if (message.operation === 'getPresetFrequencies') setRadioPresets(message.data);
    if (message.operation === 'getRouterSSID') setSSID(message.data);
  }, [message]);

  const toggleNightLight = async () => {
    await send('setNightLight', !nightLight);
    setNightLight(!nightLight);
  };

  const togglePanicBuzzer = async () => {
    await send('setPanicBuzzer', !panicBuzzer);
    setPanicBuzzer(!panicBuzzer);
  };

  const toggleAlarmLight = async () => {
    await send('setAlarmLight', !alarmLight);
    setAlarmLight(!alarmLight);
  };

  const toggleRadio = async () => {
    await send('setFMState', !FMState);
    setFMState(!FMState);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled={true}>
      {/* <View style={{ height: 60, backgroundColor: '#3299CC' }} /> */}
      <ScrollView style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <Text>
            <Ionicons name="bluetooth" size={24} color="#3B5998" /> {device.name}
          </Text>

          {batteryRemaining && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={`battery-${batteryChargingStatus ? 'charging' : 'full'}-sharp`}
                size={24}
                color="#58BA1A"
                style={{ marginRight: 5 }}
              />
              <Text>{batteryRemaining}%</Text>
            </View>
          )}
          {typeof wifiSignalStrength !== 'undefined' && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name={`wifi${wifiSignalStrength ? '' : '-off'}`} size={18} color="black" style={{ marginRight: 5 }} />
                <Text>{SSID}</Text>
              </View>
              {/* <Text>Signal Strength: {wifiSignalStrength}</Text> */}
            </>
          )}
        </View>

        {!!deviceSerialNumber && <Text>Device: {deviceSerialNumber}</Text>}
        {!!firmwareVersion && <Text>Firmware: {firmwareVersion}</Text>}
        {!!hardwareVersion && <Text>Hardware: {hardwareVersion}</Text>}
        {!!homeId && <Text>homeId: {homeId}</Text>}
        {!!emailId && <Text>Email: {emailId}</Text>}
        {!!radioVolume && <Text>radioVolume: {radioVolume}</Text>}
        {!!radioPresets && <Text>radioPresets: {radioPresets}</Text>}

        {!loading && (
          <>
            <View style={styles.row}>
              <Text style={styles.buttonText}>Night Light</Text>
              <Switch style={styles.switch} onValueChange={toggleNightLight} value={nightLight} />
            </View>
            <View style={styles.row}>
              <Text style={styles.buttonText}>Panic Buzzer</Text>
              <Switch style={styles.switch} onValueChange={togglePanicBuzzer} value={panicBuzzer} />
            </View>
            <View style={styles.row}>
              <Text style={styles.buttonText}>Alarm Light</Text>
              <Switch style={styles.switch} onValueChange={toggleAlarmLight} value={alarmLight} />
            </View>
            <View style={styles.row}>
              <Text style={styles.buttonText}>FM Radio</Text>
              <Switch style={styles.switch} onValueChange={toggleRadio} value={FMState} />
            </View>
            <View style={styles.row}>
              <TextInput
                style={{ height: 40, width: 200, borderColor: '#888', borderWidth: 1, borderRadius: 3 }}
                onChangeText={(text) => setValue(text)}
                value={value}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={{ height: 40, width: 200, borderColor: '#888', borderWidth: 1, borderRadius: 3 }}
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
            </View>
            <View style={styles.row}>
              <Button
                onPress={async () => {
                  await send('setSSID', value);
                  await send('getRouterSSID');
                  await send('setPassword', password);
                  await send('getWifiSignalStrength');
                }}
                title="CONNECT TO WIFI"
              />
            </View>
            <View style={styles.row}>
              <Button onPress={signOut} title="Sign Out" />
            </View>
            {/* <View style={styles.row}>
              <TextInput
                style={{ height: 40, width: 200, borderColor: '#888', borderWidth: 1, borderRadius: 3 }}
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
              <Button
                onPress={async () => {
                  await send('setEmailID', email);
                  await send('getEmailID');
                }}
                title="SET EMAIL"
              />
            </View>
            <View style={styles.row}>
              <Button
                onPress={async () => {
                  await send('resetDevice');
                }}
                title="RESET DEVICE"
              />
            </View> */}
          </>
        )}
        {/* <StatusBar style="auto" /> */}
        <View style={{ height: 800 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 50,
  },
  button: {
    width: 80,
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    color: '#555',
    width: 120,
  },
  switch: {
    marginLeft: 20,
  },
  row: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 },
});
