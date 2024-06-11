'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  Marker,
} from '@vis.gl/react-google-maps';

const INITIAL_CAMERA: MapCameraProps = {
  center: { lat: -17.797610035031738, lng: -63.52392568413111 },
  zoom: 3,
};

const MapCoworking = ({
  coworkings,
  cameraPropsNew,
  FilterMap,
}: {
  coworkings: any;
  cameraPropsNew: any;
  FilterMap: any;
}) => {
  const [markersCoworking, setMarkersCoworking] = useState<any>([]);
  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);

  useEffect(() => {
    setCameraProps((prevProps) => ({
      ...prevProps,
      ...cameraPropsNew,
    }));
  }, [cameraPropsNew]);

  const handleCameraChange = (ev: MapCameraChangedEvent) => {
    FilterMap(ev.detail.bounds);

    setCameraProps(ev.detail);
  };

  const responseMarker = async () => {
    if (coworkings) {
      const arrayMarkersCoworkings = coworkings.map(async (coworking: any) => {
        if (coworking.lat && coworking.long) {
          return { lat: Number(coworking.lat), lng: Number(coworking.long) };
        }
      });

      setMarkersCoworking(await Promise.all(arrayMarkersCoworkings));
    }
  };

  useEffect(() => {
    responseMarker();
  }, [coworkings]);

  return (
    <Map
      {...cameraProps}
      onCameraChanged={handleCameraChange}
      style={{ width: '100%', height: '500px', marginTop: '20px' }}
    >
      {markersCoworking &&
        markersCoworking.map((marker: any, index: any) => (
          <Marker key={index} position={marker}  />
        ))}
    </Map>
  );
};

export default MapCoworking;
