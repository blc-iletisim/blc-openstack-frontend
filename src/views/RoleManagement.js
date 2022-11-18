import React, { Fragment, useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown, MoreVertical, Plus, Trash } from "react-feather";
import DataTable from "react-data-table-component";
import ApplicationService from "../services/ApplicationService";
import {
  Card,
  CardHeader,
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
  Badge,
} from "reactstrap";
import { ConstructionOutlined, Edit, HowToReg, SatelliteAlt, SettingsEthernet } from "@mui/icons-material";
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

import {
  getRoles,
  
} from "../redux/actions/roles";
import { addRoles,} from "../redux/actions/roles";
import{getPermissions} from "../redux/actions/permissions"
import useGetUsers from "../utility/hooks/useGetUsers";

const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();

const UserManagement = () => {
 // let arrPerm = [];
  let arrRole = [];
  let x = "";
  //const [userPermissionsArr, setUserPermissionsArr] = useState([]);
  const [userRolesArr, setRolesArr] = useState([]);
  const [hourText, setHourText] = useState();
  useEffect(() => {
    ApplicationService.http()
      .post("/graphql", {
       query:`
       {
         permissions {
           id
           tag
           roles {
             id
             name
             deletedDateTime
           }
           deletedDateTime
         }
       }
       
       
       `,
      })
      .then((response) => {
        console.log("DATA:", response);
       /* 
        arrPerm = response.data.data;
        arrPerm = arrPerm.map((p) => ({
          authority: p.permissions,
          name: p.permissions.name,
          tag: p.permissions.tag,
          id: p.permissions.id, */
        arrRole = response.data.data;
        arrRole = arrRole.map((p) => ({
          id: p.id,
          name: p.permissions.name,
        
          //id: p.permissions.id,
        }));
        //setUserPermissionsArr(arrPerm);
        setRolesArr(arrRole);
        console.log(userRolesArr);
      })
      .catch((error) => {
        console.log("error -- responsee", error);
      });
  }, []);
  const serverSideColumns = [
    /* {
      name: "Aktiflik",
      selector: "deleted",
      sortable: true,
      width: "100px",
      cell: (row) => {
        return (
          <Badge
            color={row.deleted === true ? "danger" : "success"}
            variant="dot"
            className="text-center align-self-center"
          >
            {row.deleted === true ? "Pasif" : "Aktif"}
          </Badge>
        );
      },
    }, */
    {
      name: "Rol",
      selector: "label",
      sortable: true,
      minWidth: "350px",
    },
    {
        name: "İzinler",
        selector: "permissions",
        sortable: true,
        minWidth: "350px",
        cell: (row) => <span>{row.permissions?.map((perm) => perm.name+"  , ") }</span>,
      },
    

    
    {
      name: "Aksiyonlar",
      allowOverflow: false,
      maxWidth: "150px",
      cell: (row) => {
        return (
          <div className="d-flex">
            <UncontrolledDropdown>
              <DropdownToggle className="pl-1" tag="span">
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  tag="a"
                  className="w-100"
                  onClick={() => handleEditCategory(row)}
                >
                  <Edit size={15} />
                  <span className="align-middle ml-50">Düzenle</span>
                </DropdownItem>
                {row.deleted === true ? (
                  <DropdownItem
                    tag="a"
                    className="w-100"
                    onClick={() => handleUnDeleteCategory(row)}
                  >
                    <HowToReg size={15} />
                    <span className="align-middle ml-50">Aktif Et</span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag="a"
                    className="w-100"
                    onClick={() => handleDeleteUser(row)}
                  >
                    <Trash size={15} />
                    <span className="align-middle ml-50">Sil</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        );
      },
    },
  ];

  const [permissions, setPermissions] = useState([]);

  //console.log("User Perm", userPermissions)
  //console.log("OG arr", arrPerm)
  /* const userPermissions = [
    {
      value: userPermissionsArr[0]?.tag,
      label: "API Yetkilendirmesi (Önerilen)",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[0]?.id,
    },
    {
      value: userPermissionsArr[1]?.tag,
      label: "Web Panel Giriş İzni",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[1]?.id,
    },
    {
      value: userPermissionsArr[2]?.tag,
      label: "Uygulama Kategori Oluşturma",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[2]?.id,
    },
    {
      value: userPermissionsArr[3]?.tag,
      label: "Uygulama Kategori Düzenleme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[3]?.id,
    },
    {
      value: userPermissionsArr[4]?.tag,
      label: "Uygulama Kategori Görüntüleme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[4]?.id,
    },
    {
      value: userPermissionsArr[5]?.tag,
      label: "Uygulama Kategori Silme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[5]?.id,
    },
    {
      value: userPermissionsArr[6]?.tag,
      label: "Uygulama Poligon Oluşturma",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[6]?.id,
    },
    {
      value: userPermissionsArr[7]?.tag,
      label: "Uygulama Poligon Düzenleme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[7]?.id,
    },
    {
      value: userPermissionsArr[8]?.tag,
      label: "Uygulama Poligon Görüntüleme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[8]?.id,
    },
    {
      value: userPermissionsArr[9]?.tag,
      label: "Uygulama Poligon Silme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[9]?.id,
    },
    {
      value: userPermissionsArr[10]?.tag,
      label: "Panel Kullanıcı Oluşturma",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[10]?.id,
    },
    {
      value: userPermissionsArr[11]?.tag,
      label: "Panel Kullanıcı Düzenleme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[11]?.id,
    },
    {
      value: userPermissionsArr[12]?.tag,
      label: "Panel Kullanıcı Görüntüleme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[12]?.id,
    },
    {
      value: userPermissionsArr[13]?.tag,
      label: "Panel Kullanıcı Silme",
      color: "#00B8D9",
      isFixed: true,
      id: userPermissionsArr[13]?.id,
    },
  ]; */

 /*  const userRoles = [
    {
      value: userRolesArr[0]?.name,
      label: "ROLE_ADMIN (Önerilen)",
      color: "#00B8D9",
      isFixed: true,
      id: userRolesArr[0]?.id,
    },
    {
      value: userRolesArr[1]?.name,
      label: "ROLE_USER",
      color: "#00B8D9",
      isFixed: true,
      id: userRolesArr[1]?.id,
    },
    {
      value: userRolesArr[2]?.name,
      label: "ROLE_INSPECTOR",
      color: "#00B8D9",
      isFixed: true,
      id: userRolesArr[2]?.id,
    },
    {
      value: userRolesArr[3]?.name,
      label: "ROLE_RESPONSIBLE_PERSONEL",
      color: "#00B8D9",
      isFixed: true,
      id: userRolesArr[3]?.id,
    },
    
  ]; */


  const days = {
    Monday: "Pazartesi",
    Tuesday: "Salı",
    Wednesday: "Çarşamba",
    Thursday: "Perşembe",
    Friday: "Cuma",
    Saturday: "Cumartesi",
    Sunday: "Pazar",
  };

  const dispatch = useDispatch();
  const history = useHistory();
  
 
  const a = useSelector((state) => state.users);
  
  const authStore = useSelector((state) => state.auth);
  const OrganisationsStore = useSelector((state) => state.organizations);
  const PermissionsStore = useSelector((state) => state.permissionsReducer);
  console.log("permissionsStore: ",PermissionsStore)
  const usersStore = useSelector((state) => state.users);
 console.log("usersStore: ",usersStore); 
  const rolesStore = useSelector((state) =>state.rolesReducer);
  console.log("rolesStore: ",rolesStore);
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [rolesOptions, setRolesOptions] = useState([]);
  console.log("rolesOptions: ",rolesOptions)
  const { enqueueSnackbar } = useSnackbar();
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  console.log("permissionsOptions: ",permissionsOptions)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [searchOrganizationsValue, setSearchOrganizationsValue] = useState("");
  const [users, setUsers] = useState([]);
  const [userOrganizaton, setUserOrganizaton] = useState( "");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [organOptions, setOrganOptions] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingRoleData, setEditingRoleData] = useState(null)
  console.log("editingRoleData set: ", editingRoleData)
/* console.log("usersStore: ",usersStore)
console.log("authStore",authStore)
console.log("OrganisationsStore: ",OrganisationsStore)
 */

  useEffect(() => {
    dispatch(getUsersHttp());
    if (usersStore.length > 0) {
      setUsers(usersStore);
    }
  }, []);

  
  
  useEffect(() => {
    dispatch(getRoles());
    console.log("rolesStore: ",rolesStore);
    if (rolesStore.length > 0) {
      setRolesOptions(rolesStore);
    }
  }, []);
  
  useEffect(() => {
    dispatch(getPermissions());
    console.log("permissionsStore: ",PermissionsStore);
    if (PermissionsStore.length > 0) {
      setPermissionsOptions(PermissionsStore);
    }
  }, []);
  
/*   useEffect(() => {
    dispatch(getUsersHttp());
    if (organizationStore?.length > 0) {
      //lenght boş geliyor bak buna
      setOrganizations(organizationStore);
    }
    let usAr = []
  }, []);
   */
  

  useEffect(() => {
    setUsers(usersStore);
  }, [usersStore]);

  useEffect(() => {
    setOrganizations(OrganisationsStore);
  }, [OrganisationsStore]);
  
 
  useEffect(() => {
    if (OrganisationsStore?.data) {
      if (OrganisationsStore.total <= currentPage * rowsPerPage) {
        setCurrentPage(1);
        setOrganizations(OrganisationsStore?.data.slice(0, rowsPerPage));
      } else {
        setOrganizations(
          OrganisationsStore?.data.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    }
  }, [OrganisationsStore?.total, OrganisationsStore]);


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
    users.map(use =>
      setUserOptions((userOptions) => [
     
        {
          value: use.id,
          label: use?.name,
          color: "#00B8D9",
          isFixed: true,
          
        },
      ])
      
    )
    
    
    )
    
  };

  useEffect(() => {
    getOrganizationOptions();
   }, [OrganisationsStore]);

   const getOrganizationOptions = () => {
    OrganisationsStore?.dataOrganization?.forEach((organisation) =>
      setOrganizationOptions((organizationOptions) => [
        ...organizationOptions,
        {
          value: organisation.id,
          label: organisation?.name,
          color: "#00B8D9",
          isFixed: true,
          
        },
      ])
    ); 
  };
  useEffect(() => {
    getPermissionsOptions();
   }, [PermissionsStore]);

   const getPermissionsOptions = () => {
    PermissionsStore.permissions
?.forEach((permission) =>
      setPermissionsOptions((permissionsOptions) => [
        ...permissionsOptions,
        {
          value: permission.id,
          label: permission?.name,
          color: "#00B8D9",
          isFixed: true,
          
        },
      ])
    ); 
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
          permissions:role.permissions,
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

  const handleOrganizationFilter = (e) => {
    setSearchOrganizationsValue(e.target.value);

    if (e.target.value !== "") {
      setUsers(
        usersStore?.data
          .filter((org) =>
            org.organization.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
          .slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
      );
    } else {
      setUsers(
        usersStore?.data.slice(
          currentPage * rowsPerPage - rowsPerPage,
          currentPage * rowsPerPage
        )
      );
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    setUsers(
      usersStore.data.slice(
        (page.selected + 1) * rowsPerPage - rowsPerPage,
        (page.selected + 1) * rowsPerPage
      )
    );
  };

  const handlePagination2 = (page) => {
    setCurrentPage(page.selected + 1);
    setOrganizations(
      OrganisationsStore?.data?.slice(
        (page.selected + 1) * rowsPerPage - rowsPerPage,
        (page.selected + 1) * rowsPerPage
      )
    );
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setUsers(
      usersStore.data.slice(
        currentPage * parseInt(e.target.value) - parseInt(e.target.value),
        currentPage * parseInt(e.target.value)
      )
    );
  };
  const handlePerPage2 = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setOrganizations(
      OrganisationsStore?.data?.slice(
        currentPage * parseInt(e.target.value) - parseInt(e.target.value),
        currentPage * parseInt(e.target.value)
      )
    );
  };

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

  const onSort2 = (column, direction) => {
    setOrganizations(
      OrganisationsStore?.data
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

  const CustomPagination2 = () => {
    const count = Number((OrganisationsStore?.data?.length / rowsPerPage).toFixed(1));

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
        onPageChange={(page) => handlePagination2(page)}
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

  const onAddUserButtonPressed = () => {
    setEditingRoleData({
      name: "",
      password: "",
      email: "",
      organization: [],
      id:"",
      //organization: [OrganisationsStore[0]],
      //permissions: [userRoles[0]],
      //workingHours: {},
    });
    setShowAddUserModal(true);
  };
  //*****************************************************************************
  const onAddUserModalButtonPressed = () => {
    setLoading(true);
    if (
      usersStore.data?.some(
        (c) =>
          c.email === editingRoleData.email &&
          c.id !== editingRoleData.id
      )
    ) {
      enqueueSnackbar(
        "Bu email adresi başka bir hesap ile ilişkilendirilmiştir.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
      setLoading(false);
      return;
    }

    if (editingRoleData.password && editingRoleData.password <= 6) {
      enqueueSnackbar("6 karakterden uzun bir şifre giriniz.", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return;
    }

    console.log("EDIT ", editingRoleData.permissions);

    /*editingRoleData.permissions.forEach((p) => {
      setPermissions((perm) => [...perm, p]);
    });*/

    //console.log("PERM ",permissions)

    //let workingHours = {};
   /*  Object.entries(editingRoleData.workingHours || {}).forEach(
      ([key, value]) => {
        if (typeof value === "string") {
          workingHours[key] = value?.split(",") || [];
        } else {
          workingHours[key] = value;
        }
      }
    ); */
    console.log("editingRoleData: ",editingRoleData);
    if (!editingRoleData.id) {
      console.log("editingRoleData: ",editingRoleData);
      const newUserData = {
        name: editingRoleData.name, 
        email: editingRoleData.email,
        password: editingRoleData?.password,
        createdTime: editingRoleData?.createdTime || new Date().getTime(),
        createdBy: editingRoleData?.createdBy || authStore.id,
        lastUpdatedTime: new Date().getTime(),
        lastUpdatedBy: authStore.id,
        permissions: editingRoleData?.permissions,
        id:editingRoleData.id,
        organization:editingRoleData.organization,
        roles:editingRoleData?.role,
        role:editingRoleData?.role?.map((rol) => rol.value),
        /* role: editingRoleData.permissions?.find(
          (p) => p.value === "web-auth-login"
        )
          ? "admin"
          : "user", */
        //workingHours: editingRoleData?.workingHours,
        deleted: editingRoleData.deleted || null,
        deletedAt: editingRoleData.deletedAt || null,
        deletedBy: editingRoleData.deletedBy || null,
        
      };
      console.log("newUserData: ",newUserData)

      dispatch(addRoles( newUserData))
        .then(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("Kullanıcı başarıyla eklendi.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("Kullanıcı eklenirken bir hata oluştu.", {
            variant: "error",
            preventDuplicate: true,
          });
        });
    } else {

      //BU KISIMA UPDATE EDERKEN GİRMİYOR PROBLEM BURADAN KAYNAKLANIYOR İD Yİ GÖNDERMİYOR OLABİLİR
      console.log("update else")
      //console.log("ELSE", editingRoleData?.workingHours);
      let obj = {};
      /* Object.entries(editingRoleData?.workingHours).forEach(
        ([key, value]) => {
          if (!isNaN(key)) {
            let str = value.startTime.split(":");
            let str2 = value.finishTime.split(":");
            let str3 = str[1] + ":" + str[2] + "-" + str2[1] + ":" + str2[2];
            let keyDay = value.day.toString();
            let pair = { [keyDay]: str3 };
            obj = { ...obj, ...pair };
          } else {
            let pair = { [key]: value };
            obj = { ...obj, ...pair };
          }
        }
      ); */
      //editingRoleData.workingHours = obj;
      //console.log("ELSE SECOND", editingRoleData?.workingHours);
      const newUserData = {
        id: editingRoleData.id,
        name: editingRoleData.name,
        password: editingRoleData?.password,
        email: editingRoleData.email,
        createdTime: editingRoleData?.createdTime || new Date().getTime(),
        createdBy: editingRoleData?.createdBy || authStore.id,
        lastUpdatedTime: new Date().getTime(),
        lastUpdatedBy: authStore.id,
        permissions: editingRoleData?.permissions,
        roles:editingRoleData?.role?.value
        //workingHours: editingRoleData?.workingHours,
      };
      console.log("NUD", newUserData);
      dispatch(updateUser(newUserData.createdBy, newUserData))
        .then(() => {
          enqueueSnackbar("Kullanıcı Güncellendi", {
            variant: "success",
          });
          setLoading(false);
          setEditingRoleData(null);
          setShowAddUserModal(false);
          if (!editingRoleData.id) setEditingRoleData(null);
        })
        .catch(() => {
          enqueueSnackbar(
            `${newUserData.name} kullanıcısı güncellenirken bir sunucu bağlantı hatası meydana geldi, lütfen tekrar deneyiniz.`,
            {
              variant: "error",
            }
          );
          setLoading(false);
        });
    }
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
          {editingRoleData?.id
            ? editingRoleData.name
            : "Yeni Rol Ekle"}
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="role-name">
              Rol İsmi:
            </Label>
            <Input
              type="text"
              id="role-name"
              placeholder="Rol İsmi"
              value={editingRoleData?.name || ""}
              onChange={(e) =>
                setEditingRoleData({
                  ...editingRoleData,
                  name: e.target.value,
                })
              }
            />
          </div>
          
          <div className="mb-2">
            <Label className="form-label" for="permissions-select">
              Rol Yetkileri
            </Label>
            <Select
              id="permissions-select"
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={permissionsOptions}
              className="react-select"
              classNamePrefix="Seç"
              //defaultValue={editingRoleData?.role || []}
              //defaultValue={editingRoleData?.roles || []}
              //defaultValue={editingRoleData?.role.label || []}
              onChange={(value) =>{{
                console.log("value:",value)
              }
                
                setEditingRoleData({
                  ...editingRoleData,
                  role: value.map((rol) => rol.value),
                  //role: value.label,
                })
              }}
            />
          </div>
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onAddUserModalButtonPressed}>
            {loading
              ? "Kaydediliyor.."
              : !editingRoleData?.id
              ? "Oluştur"
              : "Güncelle"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleDeleteUser = (selectedUser) => {
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
        console.log("selectedUser: ",selectedUser);
        //dispatch(deleteUser(selectedUser.id));
      }
    });
  };

  const handleUnDeleteCategory = (selectedUser) => {
    // return Swal.fire({
    //   title: `${selectedUser.name} Kullanıcısını Aktif Etmek İstediğinize Emin misiniz?`,
    //   text: "",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Aktif Et",
    //   cancelButtonText: "İptal",
    //   customClass: {
    //     confirmButton: "btn btn-primary",
    //     cancelButton: "btn btn-danger ml-1",
    //   },
    //   buttonsStyling: false,
    // }).then(function (result) {
    //   if (result.value) {
    //     let permissions = {};
    //     selectedUser.permissions.forEach((p) => {
    //       permissions[p.value] = true;
    //     });
    //     set(ref(database, `users/${selectedUser.uid}`), {
    //       ...selectedUser,
    //       permissions,
    //       lastUpdatedTime: new Date().getTime(),
    //       lastUpdatedBy: authStore.uid,
    //       deleted: false,
    //       deletedAt: null,
    //       deletedBy: null,
    //     })
    //       .then(() => {
    //         enqueueSnackbar(
    //           `${selectedUser.name} kullanıcısı başarıyla aktif edildi.`,
    //           {
    //             variant: "success",
    //           }
    //         );
    //       })
    //       .catch(() =>
    //         enqueueSnackbar(
    //           `${selectedUser.name} Kullanıcısı aktif edilirken bir sunucu bağlantı hatası meydana geldi, lütfen tekrar deneyiniz.`,
    //           {
    //             variant: "error",
    //           }
    //         )
    //       );
    //   }
    // });
  };

  const handleEditCategory = (selectedUser) => {
    console.log("users store selected user: ", selectedUser);
    //console.log(editingRoleData?.workingHours);
    setShowAddUserModal(true);
    const selectedUserPermissions = (selectedUser.permissions || []).map(
      (p) => {
       /*  const foundPermData = userRoles.find(
          (perm) => perm.value === p.authority
        );
        if (foundPermData) {
          return foundPermData;
        } */
      }
    );

    let obj = {};
    /* Object.entries(selectedUser?.workingHours).forEach(([key, value]) => {
      if (!isNaN(key)) {
        let str = value.startTime.split(":");
        let str2 = value.finishTime.split(":");
        let str3 = str[1] + ":" + str[2] + "-" + str2[1] + ":" + str2[2];
        let keyDay = value.day.toString();
        let pair = { [keyDay]: str3 };
        obj = { ...obj, ...pair };
      } else {
        let pair = { [key]: value };
        obj = { ...obj, ...pair };
      }
    }); */
    //selectedUser.workingHours = obj;
    setEditingRoleData({
      
      ...selectedUser,
      permissions: selectedUserPermissions,
      //workingHours: obj,
      
    });
  };

  return (
    <div style={{ marginTop: "2%" }}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Rol Yönetimi</CardTitle>
          <Button
            className="ml-2"
            color="primary"
            onClick={onAddUserButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Rol Ekle</span>
          </Button>
        </CardHeader>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6" md="2">
            <div className="d-flex align-items-center">
              <Label for="sort-select">Göster</Label>
              <Input
                className="ml-1 dataTable-select"
                type="select"
                id="sort-select"
                value={rowsPerPage}
                onChange={(e) => handlePerPage(e)}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
            </div>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-end mt-sm-0 mt-1 ml-md-auto"
            sm="6"
            md="3"
          >
            <Label className="mr-1" for="search-input">
            İsime Göre Filtrele
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
              placeholder="İsme Göre"
            />
            
          </Col>
          
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          onSort={onSort}
          paginationComponent={CustomPagination}
          data={[...rolesOptions]}
          noDataComponent={<p className="p-2">Bulunamadı.</p>}
        />
      </Card>
      {renderUserModal()}
    </div>
  );
};

export default memo(UserManagement);
