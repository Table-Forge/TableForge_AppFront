import { useEffect, useState } from "react";

import * as Location from "expo-location";

export const useLocation = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<
    Location.LocationGeocodedAddress | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode.length > 0) {
        setLocation(geocode[0] || undefined);
      }
      setLoading(false);
    })();
  }, []);

  return { location, loading };
};
