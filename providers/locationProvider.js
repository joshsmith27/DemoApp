import React from 'react';
import * as Location from 'expo-location';

export const LocationContext = React.createContext({});

export const LocationProvider = (props) => {
  const [location, setLocation] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState();

  React.useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('locationProvider.js', 'useEffect', error);
        setErrorMsg(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return <LocationContext.Provider value={{ location, loading, errorMsg }}>{props.children}</LocationContext.Provider>;
};
