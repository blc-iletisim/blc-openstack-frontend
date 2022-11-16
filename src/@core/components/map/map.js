import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  GoogleMap,
  Polygon,
  withScriptjs,
  withGoogleMap,
  useJsApiLoader,
} from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import compose from "recompose/compose";
import withProps from "recompose/withProps";
import "@src/assets/scss/_map.scss";
import userLocationIcon from "@src/assets/images/user-location-2.svg";
import getCenterCoordinate from "@src/utils/getCenterCoordinate";
import { SETTING_STATUS } from "@configs/setting_status.enum";
import theme from "@configs/theme";

let LATITUDE = 41.0042;
let LONGITUDE = 28.9789;
const DEFAULT_ZOOM = 8;

const MapComponent = (props) => {
  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] = useState(LONGITUDE);
  const [position, setPosition] = useState({
    lat: latitude, 
    lng: longitude
  });
  const [userLocationLatitude, setUserLocationLatitude] = useState(null);
  const [userLocationLongitude, setUserLocationLongitude] = useState(null);
  const [hoveredPolygonUid, setHoveredPolygonUid] = useState(null);
  const [editingPolygon, setEditingPolygon] = useState(null);
  const mapRef = useRef();
  const [zoom, setZoom] = useState(10);
  //console.log("AAAAAA", props.polygons);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocationLatitude(position.coords.latitude);
          setUserLocationLongitude(position.coords.longitude);
        },
        (error) => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {}, [longitude, latitude, editingPolygon]);
  const panTo = useCallback(() => {
    console.log("panning to", latitude, longitude);
    mapRef.current.panTo({ lat: latitude, lng: longitude });
  }, []);

  return compose(
    withProps(() => ({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDTT8sVSWIiAu-yTlm5pohoDQivu1n9Ggg&v=3.exp&libraries=drawing,places",
      loadingElement: <div style={{ height: "600px" }} />,
      containerElement: <div style={{ height: "600px", width: "100%" }} />,
      mapElement: <div style={{ height: "600px", width: "100%" }} />,
    })),
    withScriptjs,
    withGoogleMap
  )(() => {
    const locationComponent = () => {
      return userLocationLatitude !== null && userLocationLongitude !== null ? (
        <MarkerWithLabel
          position={{
            lat: userLocationLatitude,
            lng: userLocationLongitude,
          }}
          title="Buradasınız"
          icon={userLocationIcon}
        />
      ) : null;
    };

    const getPixelPositionOffset = (width, height) => ({
      x: -(width / 2),
      y: -(height / 2),
    });

    const onEditingPaths = (polygon, newPaths) => {
      const editingPolygon = {
        ...polygon,
        coordinates: newPaths.map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
        })),
      };

      setEditingPolygon(editingPolygon);
      props.saveEditedPolygon(editingPolygon);
    };

    const onPolygonSelect = (polygon) => {
      console.log("onPolygonSelect", polygon);
      if (props.showEditControls !== SETTING_STATUS.POLYGON_SELECTING) return;

      props.saveEditedPolygon(polygon);
      setEditingPolygon(polygon);
      props.updateShowEditControls(SETTING_STATUS.POLYGON_EDIT);
    };

    let clickArr = [];
    const onMapClick = ({ latLng },zoom) => {
      if (
        typeof props?.handleLocation !== "undefined" &&
        props?.handleLocation(latLng.lat(), latLng.lng())
      ) {
        setLatitude(latLng.lat());
        setLongitude(latLng.lng());
        setPosition({lat:latLng.lat(),lng:latLng.lng()})
        console.log(position)
      }
      if (
        props.showEditControls !== SETTING_STATUS.POLYGON_CREATE ||
        props.newPolygonData === null
      )
        return;
      console.log("CLICK ARR", clickArr);
      console.log("PROP", props.newPolygonData?.coordinates);

      if (
        clickArr.length < 2 &&
        props.newPolygonData?.coordinates?.length === 0
      ) {
        clickArr.push({
          latitude: latLng.lat(),
          longitude: latLng.lng(),
        });
        console.log(clickArr);
      } else if (clickArr.length === 2) {
        setLatitude(latLng.lat());
        setLongitude(latLng.lng());
        setPosition({lat:latLng.lat(),lng:latLng.lng()})
        console.log(position)
        clickArr.push({
          latitude: latLng.lat(),
          longitude: latLng.lng(),
          
        });
        
        props.updateNewPolygonData({
          ...props.newPolygonData,
          coordinates: props.newPolygonData?.coordinates?.concat(clickArr),
        });
        clickArr = [];
        setZoom(zoom);
      } else {
        
        props.updateNewPolygonData({
          ...props.newPolygonData,
          coordinates: props.newPolygonData?.coordinates?.concat({
            latitude: latLng.lat(),
            longitude: latLng.lng(),
          }),
        });
        setLatitude(latLng.lat());
        setLongitude(latLng.lng());
        setPosition({lat:latLng.lat(),lng:latLng.lng()})
        console.log("sssssssssssssssssssssss  "+position)
        setZoom(zoom);
      }

      
    };

    const onEditingNewPolygonPaths = (newPaths) => {
      console.log("new paths", newPaths);
      props.updateNewPolygonData({
        ...props.newPolygonData,
        coordinates: newPaths.map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
        })),
      });
    };

    const renderNewPolygonComponent = () => {
      const newPolygonData = props.newPolygonData;

      if (typeof newPolygonData?.coordinates === "undefined") return null;
      if (newPolygonData.coordinates.length < 3) return null;
      if (newPolygonData.coordinates.length >= 3) {
        return (
          <Polygon
            title={newPolygonData.name}
            options={{
              fillColor: theme.palette.secondary.main,
              fillOpacity: 0.4,
              stokeColor: theme.palette.secondary.dark,
              strokeOpacity: 0.1,
              stokeWeight: 1,
              geodesic: false,
              zIndex: 10,
            }}
            paths={newPolygonData.coordinates.map((c) => ({
              lat: c.latitude,
              lng: c.longitude,
            }))}
            
            editable
            draggable
            onEditingPaths={(newPaths) => onEditingNewPolygonPaths(newPaths)}
          />
        );
      }

      return props.newPolygonData.coordinates.map((c, i) => (
        <MarkerWithLabel
          key={`new-polygon-marker-${i}`}
          position={{ lat: c.latitude, lng: c.longitude }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#ffffff",
            fillOpacity: 0.6,
            scale: 5,
            strokeColor: "#000000",
            strokeOpacity: 0.5,
            strokeWeight: 2,
          }}
        />
      ));
    };

    const showEditControls =
      props.showEditControls === SETTING_STATUS.POLYGON_CREATE ||
      props.showEditControls === SETTING_STATUS.POLYGON_EDIT;

    const isCreatingNewPolygon =
      props.showEditControls === SETTING_STATUS.POLYGON_CREATE &&
      props.newPolygonData !== null;
    return (
      <>
        <GoogleMap
          ref={mapRef}
          onZoomChanged={(zoomlevel) => {
            //console.log(mapRef?.current?.getZoom())
            //setZoom(mapRef?.current?.getZoom())
          }}
          zoom={zoom}
          defaultCenter={position}
          mapContainerStyle={{
            width: "100%",
            height: "75vh",
            marginTop: 0,
            borderRadius: "5px",
          }}
          options={{
            streetViewControl: false,
            clickableIcons: false,
            fullscreenControl: false
          }}
          onClick={(e) => {
            onMapClick(e,mapRef?.current?.getZoom())}}
        >
          {props.polygons?.map((p) => {
            // const isEditing = showEditControls && editingPolygon?.uid === p;

            const coordinates = p?.coordinates?.map((c) => ({
              lat: c?.latitude,
              lng: c?.longitude,
            }));
            
            // const centerCoordinates = getCenterCoordinate(coordinates);

            return (
              <React.Fragment key={`polygon-${p?.uid}`}>
                <Polygon
                  title={p?.name}
                  options={{
                    fillColor: theme.palette.secondary.main,
                    fillOpacity: 0.4,
                    stokeColor: theme.palette.secondary.dark,
                    strokeOpacity: 0.1,
                    stokeWeight: 1,
                    geodesic: false,
                    zIndex: 10,
                  }}
                  
                  paths={coordinates}
                  onEditingPaths={(newPaths) => onEditingPaths(p, newPaths)}
                  onClick={() => onPolygonSelect(p)}
                />
                {/*<OverlayView
                position={{
                  lat: centerCoordinates.lat,
                  lng: centerCoordinates.lng,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={getPixelPositionOffset}
              >
                <h4>{p.name}</h4>
              </OverlayView>*/}
              </React.Fragment>
            );
          })}
          {isCreatingNewPolygon === true ? renderNewPolygonComponent() : null}
        </GoogleMap>
      </>
    );
  })();
};

export default MapComponent;
