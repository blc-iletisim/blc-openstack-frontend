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

const UserModal = ({ showUserInfo, setShowUserInfo, user }) => {
  console.log("userrr", user);
  var date = new Date(user.time);

  return (
    <Modal
      isOpen={true}
      toggle={() => setShowUserInfo(false)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => setShowUserInfo(false)}>
        {user?.name}
      </ModalHeader>
      <ModalBody>
        <div className="mb-2">
          <Label className="form-label" for="organisation-name">
            Bölge Ismi : {" " + user?.categoryName}
          </Label>
        </div>
        <div className="mb-2">
          <Label className="form-label" for="organisation-name">
            Poligon Ismi : {" " + user?.polygonName}
          </Label>
        </div>
        <div className="mb-2">
          <Label className="form-label" for="organisation-name">
            Lattitude:{" " + user.lat}
          </Label>
        </div>
        <div className="mb-2">
          <Label className="form-label" for="organisation-name">
            Longitude:{" " + user.long}
          </Label>
        </div>
        <div className="mb-2">
          <Label className="form-label" for="organisation-name">
            Son Güncelleme Saati:
            {" " +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds()}
          </Label>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UserModal;
