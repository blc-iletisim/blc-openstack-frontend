import React, { useState, useEffect } from "react";
import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import { useSelector } from "react-redux";
/* <div className="mb-2">
          <Label className="form-label" for="personel-email">
            Personel:
          </Label>
          <Input
            type="text"
            id="personel-email"
            placeholder={"Cihaza atanacak personel"}
            value={isEdit ? deviceDescription : device?.description}
            onChange={(e) => setDeviceUsers(e.target.value)}
          />
        </div> */
const DeviceModal = ({
  isEdit,
  showModal,
  device,
  setShowModal,
  onButtonPressed,
}) => {
  const usersStore = useSelector((state) => state.users);
  console.log("DeviceModal ",DeviceModal)
  console.log("device:  ",device)
  const [userOptions, setUserOptions] = useState([]);
  const [macAddress, setMacAddress] = useState(isEdit ? device?.macAddress : "");
  const [deviceName, setDeviceName] = useState(isEdit ? device?.name : "");
  const [deviceType, setDeviceType] = useState(isEdit ? device?.model : "");
  const [deviceStatus, setDeviceStatus] = useState(
    isEdit ? device?.status : ""
  );
  const [deviceUser, setDeviceUser] = useState(isEdit ? device?.user : "");
  const [deviceId, setDeviceId] = useState(isEdit ? device?.macAddress : "");
  const [deviceDescription, setDeviceUsers] = useState(
    isEdit ? device.description : ""
  );
  const [personel, setPersonel] = useState(isEdit ? device.personel : "");
  //console.log("deviceeee", device);
  const deviceData = {
    name: deviceName,
    model: deviceType,
    status: deviceStatus,
    user: deviceUser,
    description: deviceDescription,
    personel: personel,
    id: device?.id,
    macAddress: macAddress,
  };
  useEffect(() => {
    getUserOptions();
  }, [usersStore]);

  const getUserOptions = () => {
    usersStore.data?.forEach((user) =>
      setUserOptions((userOptions) => [
        ...userOptions,
        {
          value: user.id,
          label: user?.name,
          color: "#00B8D9",
          isFixed: true,
          email: user?.email,
        },
      ])
    );
  };

  const deviceOptions = [
    {
      value: "1",
      label: "Tablet",
    },
    {
      value: "2",
      label: "Laptop",
    },
    {
      value: "3",
      label: "Desktop",
    },
    {
      value: "4",
      label: "Cep Telefonu",
    },
  ];

  return (
    <Modal
      isOpen={showModal}
      toggle={() => setShowModal(!showModal)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => setShowModal(!showModal)}>
        {isEdit ? device?.name : "Yeni Cihaz Ekle"}
      </ModalHeader>
      <ModalBody>
        <div className="mb-2">
          <Label className="form-label" for="device-name">
            Cihaz İsmi:
          </Label>
          <Input
            type="text"
            placeholder="Cihaz  İsmi"
            value={isEdit ? deviceName : device?.name}
            onChange={(e) => setDeviceName(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <Label className="form-label" for="user-name">
            Mac Address:
          </Label>
          <Input
            type="text"
            placeholder="Cihaz MacAdresi"
            value={isEdit ? macAddress : device?.macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <Label className="form-label" for="user-name">
            Cihaz Türü:
          </Label>

          <Select
            id="personel-select"
            closeMenuOnSelect={false}
            className="react-select"
            classNamePrefix="Seç"
            defaultValue={{
              label: isEdit ? device?.deviceType : "",
              value: device?.model,
            }}
            options={deviceOptions}
            onChange={(value) => setDeviceType(value.label)}
          />
        </div>

       

        <div className="mb-2">
          <Label className="form-label" for="user-name">
            Kullanıcı:
          </Label>

          <Select
            id="personel-select"
            closeMenuOnSelect={false}
            className="react-select"
            classNamePrefix="Seç"
            defaultValue={{
              label: isEdit ? device?.user?.name : "",
              value: 0,
            }}
            options={userOptions}
            onChange={(value) =>
              setDeviceUser({ id: value.value, name: value.label  })
              
            }
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onButtonPressed(deviceData)} color="primary">
          {isEdit ? "Güncelle" : "Ekle"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeviceModal;
