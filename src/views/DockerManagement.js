import React, { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import {Plus } from "react-feather";
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useSnackbar } from "notistack";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import {getCategories} from "../redux/actions/categories";
import { getFlavors } from "../redux/actions/flavors";
import { getImages } from "../redux/actions/images";
import { addInstances } from "../redux/actions/instances";
import {
  createPem,uploadPem,getPem
} from "../redux/actions/pem";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PEM"];
const animatedComponents = makeAnimated();

const DockerManagement = () => {
  const dispatch = useDispatch();
  const flavorsStore = useSelector((state) => state.flavorsReducer);
  const categoriesStore = useSelector((state) => state.categoriesReducer);
  const pemsStore = useSelector((state) => state.pemReducer);
  const imagesStore = useSelector((state) => state.imagesReducer);
  const [flavorsOptions, setFlavorsOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingProfileData, setEditingProfileData] = useState(null);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [editingPemData,setEditingPemData] = useState(null);
  const [imagesOptions, setImagesOptions] = useState([]);
  const [pemsOptions, setPemsOptions] = useState([]);
  const [pemName, setPemName] = useState();
  
  useEffect(() => {
    dispatch(getPem());
    if (pemsStore.length > 0) {
      setPemsOptions(pemsStore);
    }
  }, []);
  
  useEffect(() => {
    dispatch(getFlavors());
    if (flavorsStore.length > 0) {
      setFlavorsOptions(flavorsStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getImages());
    if (imagesStore.length > 0) {
      setImagesOptions(imagesStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getCategories());
    if (categoriesStore.length > 0) {
      setCategoriesOptions(categoriesStore);
    }
  }, []);

  useEffect(() => {
    setPemsOptions(
      pemsStore.pems?.map((pem)=>{
        return {
          value:pem?.id,
          label:pem?.name,
          color: "#00B8D9",
          isFixed: true,
        }
      })
    )
  }, [pemsStore.total, pemsStore]);

  useEffect(() => {
    getFlavorsOptions();
   }, [flavorsStore]);

   const getFlavorsOptions = () => {
    if ( flavorsOptions.length === 0 ) {
    flavorsStore.flavors?.forEach((flavor) =>
      setFlavorsOptions((flavorsOptions) => [
        ...flavorsOptions,
        {
          value: flavor.id,
          label: flavor?.name+": cpu size: "+flavor?.cpu_size+", ram size: "+flavor?.ram_size+", root disk: "+flavor?.root_disk,
          color: "#00B8D9",
          isFixed: true,
        },
      ])
    ) }
  };

  useEffect(() => {
    getCategoriesOptions();
   }, [categoriesStore]);

   const getCategoriesOptions = () => {
    categoriesStore?.categories?.forEach((category) =>
      setCategoriesOptions((categoriesOptions) => [
        ...categoriesOptions,
        {
          value: category.id,
          label: category?.name,
          color: "#00B8D9",
          isFixed: true,
        },
      ])
    ); 
  };

  let formData = new FormData();
  const handleChangePem = (e) => {
    
    if(e){
      formData.append('file',e)
      setEditingPemData({ 
        ...editingPemData, 
        file: formData })
    }};

  const onAddPemButtonPressed = () =>{
    setEditingPemData({
      name: "",
      file:"",
    });
    setShowAddUserModal(true);
  }
  //*****************************************************************************
  const onAddUserModalButtonPressed = () => {
      const newUserData = {
        name: editingProfileData.name,
        email: editingProfileData.email,
        categories:editingProfileData?.categories.split(','),
        flavors: editingProfileData?.flavors,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        lastUpdatedTime: new Date().getTime(),    
        id: editingProfileData.id,
        deletedAt: editingProfileData.deletedAt || null,
        pem:editingProfileData?.pem[0].value,
        images:imagesStore.images[1].id,
        
      };

      dispatch(addInstances( newUserData))
        .then(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("Successfull.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("Error.", {
            variant: "error",
            preventDuplicate: true,
          });
        });
  };

  const onAddPemModalButtonPressed = () => {   
    if (
      pemsStore.pems?.some(
        (c) =>
         ( c?.name === editingPemData?.name+".pem" )
      )
    ) {
      enqueueSnackbar("There is already a pem file with this name!", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return;
    } 
    const newPemData = {
      name: editingPemData?.name,
      file:editingPemData?.file,
      
    };
      if(newPemData.name!==null &&newPemData.file==="" ){
        dispatch(createPem(newPemData.name))
        .then(() => {
          setLoading(false);
          setPemName(newPemData.name + ".pem")
          setShowAddUserModal(false);
          enqueueSnackbar("Successfull.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("Error.", {
            variant: "error",
            preventDuplicate: true,
          });
        });}
            else if(newPemData.file!==null&&newPemData.name==="")
            {dispatch(uploadPem(newPemData.file))
              .then(() => {
                setLoading(false);
                setShowAddUserModal(false);
                enqueueSnackbar("Successfull.", {
                  variant: "success",
                  preventDuplicate: true,
                });
              })
              .catch(() => {
                setLoading(false);
                setShowAddUserModal(false);
                enqueueSnackbar("Error.", {
                  variant: "error",
                  preventDuplicate: true,
                });
              });}
              else{
                enqueueSnackbar("ERROR...Upload an existing PEM file or create a new one with name.", {
                  variant: "error",
                  preventDuplicate: true,
                });
              }
};
  //*******************************************************
  useEffect(() => {
    Pem();
    setEditingProfileData({
      ...editingProfileData,
      pem: pemsOptions?.filter(a=>pemName?.includes(a?.label)),
      
    }); 
   }, [pemsOptions]);
   
  const Pem = () => {
    return (
      <div className="mb-2">
      <Label className="form-label" for="permissions-select">
        Choose Existing PEM:
      </Label>
      <Select
        id="permissions-select"
        isClearable={false}
        theme={selectThemeColors}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={pemsOptions}
        className="react-select"
        classNamePrefix="Seç"
        defaultValue={ pemName!=undefined ? pemsOptions.filter(a=>pemName.includes(a?.label)):""}
        onChange={(value) => {
          setPemName(value[value.length-1]?.label)
          setEditingProfileData({
            ...editingProfileData,
            pem: value,
          }); 
        }}
      />
    </div>
    )
  }
  const renderUserModal = () => {
    return (
      <Modal
        isOpen={showAddUserModal}
        toggle={() => setShowAddUserModal(!showAddUserModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setShowAddUserModal(!showAddUserModal)}>
          {editingProfileData?.id
            ? editingProfileData.name
            : "Create a PEM File"}
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="user-name">
              Name:
            </Label>
            <Input
              type="text"
              id="pem-name"
              placeholder="PEM Name"
              onChange={(e) =>
                setEditingPemData({ 
                  ...editingPemData, 
                  name: e.target.value  })
              }
            />
          </div>
          <Label className="form-label" for="user-name">
          To Use an Existing PEM File:
            </Label>
            <FileUploader handleChange={handleChangePem} name="file" types={fileTypes} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onAddPemModalButtonPressed}>
            {loading
              ? "Creating.."
              : !editingProfileData?.id
              ? "Create"
              : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div style={{ marginTop: "2%" }}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">DOCKER Management</CardTitle>
        </CardHeader>
        <ModalBody>
        <div className="mb-2">
            <Label className="form-label" for="user-name">
            Instance Name:
            </Label>
            <Input
              type="text"
              id="database-name"
              placeholder="Instance Name"
              onChange={(e) =>
                setEditingProfileData({ ...editingProfileData, name: e.target.value  })
              }
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="user-name">
              UBUNTU Version:
            </Label>
            <Input
              type="text"
              id="database-name"
              placeholder="Ubuntu Name"
              value={"UBUNTU 20.04"}
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="user-name">
              Instance Name:
            </Label>
            <Input
              type="text"
              id="database-name"
              placeholder="Instance Name"
              value={"DOCKER"}      
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="permissions-select">
              Choose Database Configuration:
            </Label>
            <Select
             id="permissions-select"
             isClearable={false}
             theme={selectThemeColors}
             closeMenuOnSelect={true}
             components={animatedComponents}
             className="react-select"
             classNamePrefix="Select"
             options={flavorsOptions}
             defaultValue={editingProfileData?.flavors || [""]}
              onChange={(value) => {
                setEditingProfileData({
                  ...editingProfileData,
                  categories:categoriesStore.categories[2].id,
                  flavors: value.value,
                });
              }}
            />
          </div>
          <Pem/>
          <Button
          size="sm"
            className="ml-2"
            color="info"
            onClick={onAddPemButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Create a PEM File</span>
          </Button>
          <ModalFooter>
            <Button 
            disabled={pemName != undefined ?
              !(editingProfileData?.flavors&&editingProfileData?.categories&&editingProfileData?.name) :
              !(editingProfileData?.pem&&editingProfileData?.flavors&&editingProfileData?.categories&&editingProfileData?.name)}
             color="primary" onClick={onAddUserModalButtonPressed}>
              {loading
                ? "Saving.."
                : !editingProfileData?.id
                ? "Create"
                : "Güncelle"}
            </Button>
          </ModalFooter>
        </ModalBody>
      </Card>
      {renderUserModal()}
    </div>
  );
};

export default memo(DockerManagement);
