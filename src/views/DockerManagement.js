import React, { Fragment, useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown, MoreVertical, Plus, Trash } from "react-feather";
import DataTable from "react-data-table-component";
import ApplicationService from "../services/ApplicationService";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupText,
  Form,
  FormGroup,
  Badge,
} from "reactstrap";
import {
  ConstructionOutlined,
  Edit,
  HowToReg,
  SatelliteAlt,
  SettingsEthernet,
} from "@mui/icons-material";
import { getUsersHttp } from "@src/redux/actions/users";
import moment from "moment";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useSnackbar } from "notistack";
import { default as SweetAlert } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import InputPasswordToggle from "@components/input-password-toggle";
import { useHistory } from "react-router-dom";
import { updateUser } from "../redux/actions/users";
import {getCategories} from "../redux/actions/categories";
import { getRoles } from "../redux/actions/roles";
import { getFlavors } from "../redux/actions/flavors";
import { getImages } from "../redux/actions/images";
import { getInstances,addInstances } from "../redux/actions/instances";
import { addUser, deleteUser, getPermissions } from "../redux/actions/users";
import useGetUsers from "../utility/hooks/useGetUsers";
import {
  createPem
} from "../redux/actions/pem";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PEM"];
const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();

const DockerManagement = () => {

  

  const dispatch = useDispatch();
  
  const usersStore = useSelector((state) => state.users);
  console.log("usersStore: ", usersStore);
  const flavorsStore = useSelector((state) => state.flavorsReducer);
  console.log("flavorsStore useSelector: ",flavorsStore)
  const categoriesStore = useSelector((state) => state.categoriesReducer);
  console.log("categoriesStore: ",categoriesStore);
  const rolesStore = useSelector((state) => state.rolesReducer);
  console.log("rolesStore: ", rolesStore);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [flavorsOptions, setFlavorsOptions] = useState([]);
  console.log("flavorsOptions: ",flavorsOptions)
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingProfileData, setEditingProfileData] = useState(null);
  console.log("editingProfileData set: ", editingProfileData);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [editingPemData,setEditingPemData] = useState(null);
  
  useEffect(() => {
    dispatch(getUsersHttp());
    if (usersStore.length > 0) {
      setUsers(usersStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getRoles());
    console.log("rolesStore: ", rolesStore);
    if (rolesStore.length > 0) {
      setRolesOptions(rolesStore);
    }
  }, []);

  
  useEffect(() => {
    dispatch(getFlavors());
    console.log("flavorsStore get: ",flavorsStore);
    if (flavorsStore.length > 0) {
      setFlavorsOptions(flavorsStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getCategories());
    console.log("categoriesStore get: ",categoriesStore);
    if (categoriesStore.length > 0) {
      setCategoriesOptions(categoriesStore);
    }
  }, []);

  // useEffect(() => {
  //   setUsers(usersStore);
  // }, [usersStore]);

  useEffect(() => {
    if (usersStore.data) {
      if (usersStore.total <= currentPage * rowsPerPage) {
        setCurrentPage(1);
        setUsers(usersStore.data?.slice(0, rowsPerPage));
      } else {
        setUsers(
          usersStore.data?.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    }
  }, [usersStore.total, usersStore]);

  useEffect(() => {
    getUserOptions();
  }, [usersStore]);

  const getUserOptions = () => {
    // usersStore.data.map(user =>
    usersStore.data.forEach((user) =>
      users.map((use) =>
        setUserOptions((userOptions) => [
          {
            value: use.id,
            label: use?.name,
            color: "#00B8D9",
            isFixed: true,
          },
        ])
      )
    );
  };

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
          label: flavor?.name+": cpu size: "+flavor?.cpu_size+", ram size: "+flavor?.ram_size+", root disk: "+flavor?.root_disk
          ,
          color: "#00B8D9",
          isFixed: true,
          
        },
      ])
    ) }
  };


  useEffect(() => {
    getRolesOptions();
  }, [rolesStore]);

  const getRolesOptions = () => {
    rolesStore.roles?.forEach((role) =>
      setRolesOptions((rolesOptions) => [
        ...rolesOptions,
        {
          value: role.id,
          label: role?.name,
          color: "#00B8D9",
          isFixed: true,
        },
      ])
    );
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



  const handleFilter = (e) => {
    setSearchValue(e.target.value);

    if (e.target.value !== "") {
      setUsers(
        usersStore.data
          .filter((user) =>
            user.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
          .slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
      );
    } else {
      setUsers(
        usersStore.data.slice(
          currentPage * rowsPerPage - rowsPerPage,
          currentPage * rowsPerPage
        )
      );
    }
  };

  // const handleOrganizationFilter = (e) => {
  //   setSearchOrganizationsValue(e.target.value);

  //   if (e.target.value !== "") {
  //     setUsers(
  //       usersStore?.data
  //         .filter((org) =>
  //           org.organization.name.toLowerCase().includes(e.target.value.toLowerCase())
  //         )
  //         .slice(
  //           currentPage * rowsPerPage - rowsPerPage,
  //           currentPage * rowsPerPage
  //         )
  //     );
  //   } else {
  //     setUsers(
  //       usersStore?.data.slice(
  //         currentPage * rowsPerPage - rowsPerPage,
  //         currentPage * rowsPerPage
  //       )
  //     );
  //   }
  // };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    setUsers(
      usersStore.data.slice(
        (page.selected + 1) * rowsPerPage - rowsPerPage,
        (page.selected + 1) * rowsPerPage
      )
    );
  };

  // const handlePagination2 = (page) => {
  //   setCurrentPage(page.selected + 1);
  //   setOrganizations(
  //     OrganisationsStore?.data?.slice(
  //       (page.selected + 1) * rowsPerPage - rowsPerPage,
  //       (page.selected + 1) * rowsPerPage
  //     )
  //   );
  // };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setUsers(
      usersStore.data.slice(
        currentPage * parseInt(e.target.value) - parseInt(e.target.value),
        currentPage * parseInt(e.target.value)
      )
    );
  };
  // const handlePerPage2 = (e) => {
  //   setRowsPerPage(parseInt(e.target.value));
  //   setOrganizations(
  //     OrganisationsStore?.data?.slice(
  //       currentPage * parseInt(e.target.value) - parseInt(e.target.value),
  //       currentPage * parseInt(e.target.value)
  //     )
  //   );
  // };

  const onSort = (column, direction) => {
    setUsers(
      usersStore.data
        .sort((a, b) => {
          if (a[column.selector] === b[column.selector]) return 0;
          if (direction === "asc") {
            return a[column.selector] > b[column.selector] ? 1 : -1;
          } else {
            return a[column.selector] < b[column.selector] ? 1 : -1;
          }
        })
        .slice(
          currentPage * rowsPerPage - rowsPerPage,
          currentPage * rowsPerPage
        )
    );
  };

  // const onSort2 = (column, direction) => {
  //   setOrganizations(
  //     OrganisationsStore?.data
  //       .sort((a, b) => {
  //         if (a[column.selector] === b[column.selector]) return 0;
  //         if (direction === "asc") {
  //           return a[column.selector] > b[column.selector] ? 1 : -1;
  //         } else {
  //           return a[column.selector] < b[column.selector] ? 1 : -1;
  //         }
  //       })
  //       .slice(
  //         currentPage * rowsPerPage - rowsPerPage,
  //         currentPage * rowsPerPage
  //       )
  //   );
  // };

  const CustomPagination = () => {
    const count = Number((usersStore?.data?.length / rowsPerPage).toFixed(1));

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    );
  };

  // const CustomPagination2 = () => {
  //   const count = Number((OrganisationsStore?.data?.length / rowsPerPage).toFixed(1));

  //   return (
  //     <ReactPaginate
  //       previousLabel={""}
  //       nextLabel={""}
  //       breakLabel="..."
  //       pageCount={count || 1}
  //       marginPagesDisplayed={2}
  //       pageRangeDisplayed={2}
  //       activeClassName="active"
  //       forcePage={currentPage !== 0 ? currentPage - 1 : 0}
  //       onPageChange={(page) => handlePagination2(page)}
  //       pageClassName={"page-item"}
  //       nextLinkClassName={"page-link"}
  //       nextClassName={"page-item next"}
  //       previousClassName={"page-item prev"}
  //       previousLinkClassName={"page-link"}
  //       pageLinkClassName={"page-link"}
  //       breakClassName="page-item"
  //       breakLinkClassName="page-link"
  //       containerClassName={
  //         "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
  //       }
  //     />
  //   );
  // };
  const onAddPemButtonPressed = () =>{
    setEditingPemData({
      name: "",
    });
    setShowAddUserModal(true);
  }
  const onAddUserButtonPressed = () => {
    setEditingProfileData({
      name: "",
      categories:"",
      flavors:"", 
      pem:"",
      password: "",
      email: "",
      company: "",
      role: "",
      id: "",
    });
    setShowAddUserModal(true);
  };
  //*****************************************************************************
  const onAddUserModalButtonPressed = () => {
  

    console.log("editingProfileData: ", editingProfileData);
    
      console.log("editingProfileData: ", editingProfileData);
      const newUserData = {
        name: editingProfileData.name,
        email: editingProfileData.email,
        categories:editingProfileData?.categories.split(','),
        flavors: editingProfileData?.flavors,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        lastUpdatedTime: new Date().getTime(),    
        id: editingProfileData.id,
        deletedAt: editingProfileData.deletedAt || null,
        
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
    const newPemData = {
      name: editingPemData?.name,
      
    };
    console.log("newPemData: ",newPemData)

    dispatch(createPem(newPemData.name))
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
  //*******************************************************
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
              //value={editingProfileData?.company || ""}
              onChange={(e) =>
                //console.log("pem name: ",e)
                setEditingPemData({ 
                  ...editingPemData, 
                  name: e.target.value  })
              // handlePemName(e.target.value)
              }
            />
          </div>
          <Label className="form-label" for="user-name">
          To Use an Existing PEM File:
            </Label>
          <FileUploader handleChange={console.log()} name="file" types={fileTypes} />
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
 /*  const hanglePemName = (pemName) =>{
    dispatch(createPem(pemName))
  } */

 /*  const handleDeleteUser = (selectedUser) => {
    return Swal.fire({
      title: `${selectedUser.name} Kullanıcısını Silmek İstediğinize Emin misiniz?`,
      text: "Silinen hesaplar tekrar aktif edilebilir, ancak aynı email adresi ile tekrar hesap oluşturulamaz. Tüm yetkileri kaldırılacaktır!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sil",
      cancelButtonText: "İptal",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ml-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value !== null && result.value === true) {
        console.log("selectedUser: ", selectedUser);
        dispatch(deleteUser(selectedUser.id));
      }
    });
  }; */

 


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
              //value={editingProfileData?.company || ""}
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
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={flavorsOptions}
              className="react-select"
              classNamePrefix="Seç"
              defaultValue={editingProfileData?.role || [""]}
              //defaultValue={editingProfileData?.roles || []}
              //defaultValue={editingProfileData?.role.label || []}
              onChange={(value) => {
                {
                  console.log("value:", value);
                }

                setEditingProfileData({
                  ...editingProfileData,
                  categories:"49a72176-7304-4f10-8cfb-82892be117b4",
                  flavors: value.map((flavor) => flavor.value),
                  //role: value.label,
                });
              }}
            />
          </div>
          <Button
          size="sm"
            className="ml-2"
            //color="primary"
            color="info"
            onClick={onAddPemButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Create a PEM File</span>
          </Button>
         {/*  <Card
            tag="a"
            border="secondary"
            color="primary"
            outline
            style={{
              width: "16rem",
              cursor: "pointer",
            }}
            onClick={console.log()}
          >
            Click Here to Create a PEM File
          </Card> */}

          {/* <FormGroup check>
            <Input
              type="checkbox"
              onChange={(e) => {
                setEditingProfileData({
                  ...editingProfileData,
                  workingHours: {
                    ...editingProfileData.workingHours,
                  },
                });
                console.log(editingProfileData.workingHours);
              }}
            />{" "}
            <Label check>Create a PAM File</Label>
          </FormGroup>
 */}
          <ModalFooter>
            <Button color="primary" onClick={onAddUserModalButtonPressed}>
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