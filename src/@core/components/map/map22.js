import React, { Component, useContext } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  OverlayView,
} from "@react-google-maps/api";
import CustomPolygon from "./map.polygon";
import "@src/assets/scss/_map.scss";
import userLocationIcon from "@src/assets/images/user-location-2.svg";
import getCenterCoordinate from "@src/utils/getCenterCoordinate";
import { SETTING_STATUS } from "@configs/setting_status.enum";
import theme from "@configs/theme";

const LATITUDE = 41.0042;
const LONGITUDE = 28.9789;
const DEFAULT_ZOOM = 8;

class MapComponent extends Component {
  static defaultProps = {
    polygons: [],
    openCategoriesPanel: () => {},
    showEditControls: false,
    updateShowEditControls: () => {},
    newPolygonData: null,
    updateNewPolygonData: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      position: null,
      hoveredPolygonUid: null,
      editingPolygon: null,
      centerCoordinate: null,
    };
    this.mapRef = null;
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          this.setState({
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {},
        { enableHighAccuracy: true }
      );
    }
  }

  componentDidUpdate() {
    console.log(`You clicked ${this.state.centerCoordinate} times`);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.show !== prevState.show) {
      console.log("Do something");
    }
  }

  handleCenterChanged = () => {
    if (this.mapRef) {
      const newCenter = this.mapRef.current.getCenter();
      console.log("*556**", this.centerCoordinate);
    }
  };

  locationComponent = () => {
    return this.state.position !== null ? (
      <Marker
        position={this.state.position}
        title="Buradasınız"
        icon={userLocationIcon}
      />
    ) : null;
  };

  getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  onEditingPaths = (polygon, newPaths) => {
    const editingPolygon = {
      ...polygon,
      coordinates: newPaths.map((p) => ({ latitude: p.lat, longitude: p.lng })),
    };

    this.setState({ editingPolygon });
    this.props.saveEditedPolygon(editingPolygon);
  };

  onPolygonSelect = (polygon) => {
    if (this.props.showEditControls !== SETTING_STATUS.POLYGON_SELECTING)
      return;

    this.props.saveEditedPolygon(polygon);
    this.setState(
      {
        editingPolygon: polygon,
      },
      () => this.props.updateShowEditControls(SETTING_STATUS.POLYGON_EDIT)
    );
  };

  onMapClick = ({ latLng }) => {
    if (
      this.props.showEditControls !== SETTING_STATUS.POLYGON_CREATE ||
      this.props.newPolygonData === null
    )
      return;

    const lat = latLng.lat(),
      lng = latLng.lng();

    this.props.updateNewPolygonData({
      ...this.props.newPolygonData,
      coordinates: this.props.newPolygonData.coordinates.concat({
        latitude: lat,
        longitude: lng,
      }),
    });
  };

  onEditingNewPolygonPaths = (newPaths) => {
    this.props.updateNewPolygonData({
      ...this.props.newPolygonData,
      coordinates: newPaths.map((p) => ({ latitude: p.lat, longitude: p.lng })),
    });
  };

  renderNewPolygonComponent = () => {
    const newPolygonData = this.props.newPolygonData;

    if (typeof newPolygonData?.coordinates === "undefined") return null;

    if (newPolygonData.coordinates.length >= 3) {
      return (
        <CustomPolygon
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
          onEditingPaths={(newPaths) => this.onEditingNewPolygonPaths(newPaths)}
        />
      );
    }

    return this.props.newPolygonData.coordinates.map((c, i) => (
      <Marker
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

  render() {
    const showEditControls =
      this.props.showEditControls === SETTING_STATUS.POLYGON_CREATE ||
      this.props.showEditControls === SETTING_STATUS.POLYGON_EDIT;

    const isCreatingNewPolygon =
      this.props.showEditControls === SETTING_STATUS.POLYGON_CREATE &&
      this.props.newPolygonData !== null;

    return (
      <LoadScript
        googleMapsApiKey="AIzaSyBu_Y1VK-OeSnX78wo2guQ9TPG96HyrC1c"
        language="tr"
      >
        <GoogleMap
          ref={(ref) => (this.mapRef = ref)}
          zoom={DEFAULT_ZOOM}
          center={{
            lat: this.state.centerCoordinate?.lat || Number(LATITUDE),
            lng: this.state.centerCoordinate?.lng || Number(LONGITUDE),
          }}
          mapContainerStyle={{
            width: "100%",
            height: "75vh",
            marginTop: 0,
            borderRadius: "5px",
          }}
          options={{
            streetViewControl: false,
            clickableIcons: false,
          }}
          onClick={this.onMapClick}
        >
          {this.props.polygons.map((p) => {
            const isEditing =
              showEditControls && this.state.editingPolygon?.uid === p.uid;

            const coordinates = (
              isEditing ? this.state.editingPolygon : p
            ).coordinates.map((c) => ({
              lat: c.latitude,
              lng: c.longitude,
            }));
            const centerCoordinates = getCenterCoordinate(coordinates);
            console.log("center coordinates: " + centerCoordinates.lat);
            console.log("center coordinates: " + centerCoordinates.lng);

            return (
              <React.Fragment key={`polygon-${p.uid}`}>
                <CustomPolygon
                  title={p.name}
                  options={{
                    fillColor: theme.palette.secondary.main,
                    fillOpacity: 0.4,
                    stokeColor: theme.palette.secondary.dark,
                    strokeOpacity: 0.1,
                    stokeWeight: 1,
                    geodesic: false,
                    zIndex: 10,
                  }}
                  paths={
                    isEditing
                      ? this.state.editingPolygon.coordinates
                      : coordinates
                  }
                  editable={isEditing}
                  draggable={isEditing}
                  onEditingPaths={(newPaths) =>
                    this.onEditingPaths(p, newPaths)
                  }
                  onClick={() => this.onPolygonSelect(p)}
                />
                <OverlayView
                  position={{
                    lat: centerCoordinates.lat,
                    lng: centerCoordinates.lng,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={this.getPixelPositionOffset}
                >
                  <h4>{p.name}</h4>
                </OverlayView>
              </React.Fragment>
            );
          })}
          {isCreatingNewPolygon === true
            ? this.renderNewPolygonComponent()
            : null}
          {this.locationComponent()}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default MapComponent;
