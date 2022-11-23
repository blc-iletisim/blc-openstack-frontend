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
import { addUser, deleteUser, getPermissions } from "../redux/actions/users";
import useGetUsers from "../utility/hooks/useGetUsers";

const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();

const UserManagement = () => {
 // let arrPerm = [];
  let arrRole = [];
  let x = "";
  //
  const [userPermissionsArr, setUserPermissionsArr] = useState([]);
  const [userRolesArr, setRolesArr] = useState([]);
  const [hourText, setHourText] = useState();

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
      name: "İsim",
      selector: "name",
      sortable: true,
      minWidth: "350px",
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
      minWidth: "350px",
    },
    {
      name: "Şirket",
      selector: "company",
      sortable: true,
      minWidth: "350px",
    }, 
    {
      name: "Rol",
      selector: "role.name",
      sortable: true,
      minWidth: "350px",
      cell: (row) => <span>{row.role.name?.toUpperCase() || ""}</span>,
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

  const dispatch = useDispatch();
  const authStore = useSelector((state) => state.auth);
  const usersStore = useSelector((state) => state.users);
  console.log("usersStore: ",usersStore); 
  const rolesStore = useSelector((state) =>state.rolesReducer);
  console.log("rolesStore: ",rolesStore);
  const [rolesOptions, setRolesOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingProfileData, setEditingProfileData] = useState(null)
  console.log("editingProfileData set: ", editingProfileData)

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

  const onAddUserButtonPressed = () => {
    setEditingProfileData({
      name: "",
      password: "",
      email: "",
      company: "",
      role: "",
      id:"",
    });
    setShowAddUserModal(true);
  };
  //*****************************************************************************
  const onAddUserModalButtonPressed = () => {
    setLoading(true);
    if (
      usersStore.data?.some(
        (c) =>
          c.email === editingProfileData.email &&
          c.id !== editingProfileData.id
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

    if (editingProfileData.password && editingProfileData.password <= 6) {
      enqueueSnackbar("6 karakterden uzun bir şifre giriniz.", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return;
    }

    console.log("editingProfileData: ",editingProfileData);
    if (!editingProfileData.id) {
      console.log("editingProfileData: ",editingProfileData);
      const newUserData = {
        name: editingProfileData.name, 
        email: editingProfileData.email,
        password: editingProfileData?.password,
        company: editingProfileData.company, 
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        createdBy: editingProfileData?.createdBy || authStore.id,
        lastUpdatedTime: new Date().getTime(),
        lastUpdatedBy: authStore.id,
        id:editingProfileData.id,
        roles:editingProfileData?.role[0],
        //role:editingProfileData?.role?.map((rol) => rol.value),
        
        deleted: editingProfileData.deleted || null,
        deletedAt: editingProfileData.deletedAt || null,
        deletedBy: editingProfileData.deletedBy || null,
        
      };

      dispatch(addUser(newUserData.createdBy, newUserData))
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

      console.log("update else")

      const newUserData = {
        id: editingProfileData.id,
        name: editingProfileData.name,
        password: editingProfileData?.password,
        company: editingProfileData.company,
        email: editingProfileData.email,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        createdBy: editingProfileData?.createdBy || authStore.id,
        //lastUpdatedTime: new Date().getTime(),
        //lastUpdatedBy: authStore.id,
        roles:editingProfileData?.role[0]
      };
      console.log("NUD", newUserData);
      dispatch(updateUser(newUserData.createdBy, newUserData))
        .then(() => {
          enqueueSnackbar("Kullanıcı Güncellendi", {
            variant: "success",
          });
          setLoading(false);
          setEditingProfileData(null);
          setShowAddUserModal(false);
          if (!editingProfileData.id) setEditingProfileData(null);
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
          {editingProfileData?.id
            ? editingProfileData.name
            : "Yeni Kullanıcı Ekle"}
        </ModalHeader>
        <ModalBody>
        <div className="mb-2">
            <Label className="form-label" for="user-name">
              Şirket Adı:
            </Label>
            <Input
              type="text"
              id="company-name"
              placeholder="Şirket Adı"
              value={editingProfileData?.company || ""}
              onChange={(e) =>
                setEditingProfileData({ ...editingProfileData, company: e.target.value  })
                
              }
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="user-name">
              Kullanıcı İsmi:
            </Label>
            <Input
              type="text"
              id="user-name"
              placeholder="Kullanıcı İsmi"
              value={editingProfileData?.name || ""}
              onChange={(e) =>
                setEditingProfileData({
                  ...editingProfileData,
                  name: e.target.value,
                })
              }
            />
          </div>
          {(!editingProfileData?.id  ||editingProfileData?.id) && (
            <Fragment>
              <div className="mb-2">
                <Label className="form-label" for="email-address">
                  Email Adresi:
                </Label>
                <Input
                  type="text"
                  id="email-address"
                  placeholder="Kullanıcı Email Adresi"
                  value={editingProfileData?.email || ""}
                  onChange={(e) =>
                    setEditingProfileData({
                      ...editingProfileData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-2">
                <Label className="form-label" for="password">
                  Hesap Şifresi:
                </Label>
                <InputPasswordToggle
                  id="password"
                  className="input-group-merge mb-2"
                  htmlFor="password"
                  placeholder="Kullanıcı Hesap Şifresi"
                  defaultValue={editingProfileData?.password || ""}
                  onChange={(e) =>
                    setEditingProfileData({
                      
                      ...editingProfileData,
                      password: e.target.value,
                    })
                  }
                />
                <Label className="pt-1">
                  Şifre en az 6 karakter uzunluğunda güçlü olmalıdır.
                </Label>
              </div>
            </Fragment>
          )}
          <div className="mb-2">
            <Label className="form-label" for="permissions-select">
              Kullanıcı Rolü
            </Label>
            <Select
              id="permissions-select"
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={rolesOptions}
              className="react-select"
              classNamePrefix="Seç"
              defaultValue={editingProfileData?.role|| ['']}
              //defaultValue={editingProfileData?.roles || []}
              //defaultValue={editingProfileData?.role.label || []}
              onChange={(value) =>{{
                console.log("value:",value)
              }
                
                setEditingProfileData({
                  ...editingProfileData,
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
              : !editingProfileData?.id
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
        dispatch(deleteUser(selectedUser.id));
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
    setShowAddUserModal(true);
    const selectedUserRoles= (selectedUser.roles || [
    ]).map(
      (p) => {
       /*  const foundPermData = userRoles.find(
          (perm) => perm.value === p.authority
        );
        if (foundPermData) {
          return foundPermData;
        } */
      }
    );

 
    setEditingProfileData({
      
      ...selectedUser,
      role: selectedUserRoles,
      
    });
  };

  return (
    <div style={{ marginTop: "2%" }}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Kullanıcı Yönetimi</CardTitle>
          <Button
            className="ml-2"
            color="primary"
            onClick={onAddUserButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Kullanıcı Ekle</span>
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

        {/*   <Col
            className="d-flex align-items-center justify-content-end mt-sm-0 mt-1 ml-md-auto"
            sm="6"
            md="3"
          >
            <Label className="mr-1" for="search-input">
             Şirkete Göre Filtrele
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              //value={searchOrganizationsValue}
              //onChange={handleOrganizationFilter}
              placeholder="Organizasyona Göre"
            />
            
          </Col> */}

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
          data={[...users]}
          noDataComponent={<p className="p-2">Bulunamadı.</p>}
        />
      </Card>
      {renderUserModal()}
    </div>
  );
};

export default memo(UserManagement);
