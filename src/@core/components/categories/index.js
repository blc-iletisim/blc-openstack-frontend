import React, { useState, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Row,
  Button,
  Col,
} from "reactstrap";
import {
  GoogleMap,
  Marker,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
const CategoryModal = ({ isEdit, category, showModal }) => {
  const [categoryName, setCategoryName] = useState(category.name || "");
  const [latitude, setLatitude] = useState(category.latitude || "");
  const [longitude, setLongitude] = useState(category.longitude || "");

  const mapRef = useRef();

  function handleLoad(map) {
    mapRef.current = map;
  }

  return (
    <Modal
      isOpen={showModal}
      toggle={() => setShowAddCategoryModal(!showAddCategoryModal)}
      className="modal-dialog-centered"
    >
      <ModalHeader
        toggle={() => setShowAddCategoryModal(!showAddCategoryModal)}
      >
        {!isEdit ? "Yeni Semt Ekle" : category.name}
      </ModalHeader>
      <ModalBody>
        <div className="mb-2">
          <Label className="form-label" for="category-name">
            Semt İsmi:
          </Label>
          <Input
            type="text"
            id="category-name"
            placeholder="Semt İsmi"
            value={isEdit ? category.name : ""}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Label className="pt-1">
            {editingCategoryData === null
              ? "Yeni oluşturulacak poligona eşsiz bir isim veriniz."
              : "Güncellenecek semtin ismi eşsiz olmalıdır."}
          </Label>
        </div>
        <Row>
          <Col>
            <Label className="form-label" for="category-name">
              Enlem:
            </Label>
            <Input
              type="number"
              placeholder="Enlem"
              defaultValue={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Col>
          <Col>
            <Label className="form-label" for="category-name">
              Boylam:
            </Label>
            <Input
              type="number"
              placeholder="Boylam"
              defaultValue={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Col>
        </Row>
        <Row style={{ marginLeft: "1%" }}>
          <LoadScript
            googleMapsApiKey="AIzaSyDTT8sVSWIiAu-yTlm5pohoDQivu1n9Ggg"
            language="tr"
          >
            <GoogleMap
              id="map"
              onLoad={handleLoad}
              center={{
                lat: latitude || Number(LATITUDE),
                lng: longitude || Number(LONGITUDE),
              }}
              mapContainerStyle={{
                width: "98%",
                height: "25vh",
                marginTop: 10,
                //borderRadius: "5px",
              }}
              options={{
                streetViewControl: false,
                clickableIcons: false,
              }}
              zoom={10}
              onClick={(ev) => {
                setLatitude(ev.latLng.lat() || Number(LATITUDE));
                setLongitude(ev.latLng.lng() || Number(LONGITUDE));
              }}
              onBoundsChanged={(e) => console.log("eee")}
            >
              <Marker
                position={{ lng: longitude, lat: latitude }}
                //onDragEnd={handleMarkerDragEnd}
              />
            </GoogleMap>
          </LoadScript>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onAddCategoryModalButtonPressed}>
          {isEdit ? "Güncelle" : "Oluştur"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CategoryModal;
