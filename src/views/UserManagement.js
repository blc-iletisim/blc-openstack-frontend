import React, { Fragment, useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { ChevronDown, MoreVertical, Plus, Trash } from "react-feather";
import DataTable from "react-data-table-component";
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
} from "reactstrap";
import {
  Edit,
  HowToReg,
  } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { default as SweetAlert } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import InputPasswordToggle from "@components/input-password-toggle";
import { updateUser } from "../redux/actions/users";
import { getOrganisations } from "@src/redux/actions/organisations";
import { getRoles } from "../redux/actions/roles";
import { addUser, deleteUser, getUsersHttp } from "../redux/actions/users";

const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();

const UserManagement = () => {
 
  const serverSideColumns = [
    {
      name: "Name",
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
      name: "Company",
      selector: "company.name",
      sortable: true,
      minWidth: "350px",
    },
    {
      name: "Role",
      selector: "role.name",
      sortable: true,
      minWidth: "350px",
      cell: (row) => <span>{row.role.name?.toUpperCase() || ""}</span>,
    },
    {
      name: "Actions",
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
                  <span className="align-middle ml-50">Update</span>
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
                    <span className="align-middle ml-50">Delete</span>
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
  const rolesStore = useSelector((state) => state.rolesReducer);
  const organizationStore = useSelector((state) => state.organisationReducer);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [organizationsOptions, setOrganizationsOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingProfileData, setEditingProfileData] = useState(null);
  const currentUserRole= localStorage.getItem('currentUserRole');
  let currentUserCompanyId = localStorage.getItem('currentUserCompanyId');
  const[ userCompanyFilterStore,setUserCompanyFilterStore]=useState([]);

  useEffect(()=>{
    setUserCompanyFilterStore ( usersStore?.data?.filter(a=>currentUserCompanyId.includes(a?.company?.id) && (a?.role?.name)!="ADMIN"))
  },[usersStore.total,usersStore]);

  useEffect(() => {
    if(currentUserRole==="ADMIN"){
    dispatch(getUsersHttp());
    if (usersStore.length > 0) {
      setUsers(usersStore);
    }
  }
  else{
    dispatch(getUsersHttp());
    if (usersStore.length > 0) {
      setUsers(userCompanyFilterStore);
    }
  }
  }, []);

  useEffect(() => {
    dispatch(getOrganisations());
    if (organizationStore.length > 0) {
      setOrganizationsOptions(organizationStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getRoles());
    if (rolesStore.length > 0 && rolesOptions.length === 0 ) {
      setRolesOptions(rolesStore);
    }
  }, []);

  useEffect(() => {
    if(currentUserRole==="ADMIN"){
      if (usersStore.data) {
        if (usersStore.total <= currentPage * rowsPerPage) {
          setCurrentPage(1);
          setUsers(usersStore?.data?.slice(0, rowsPerPage));
        } else {
          setUsers(
            usersStore?.data?.slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
          );
        }
      }
    }

  }, [usersStore.total, usersStore]);

  useEffect(() => {
    if (userCompanyFilterStore) {
      if (userCompanyFilterStore.length <= currentPage * rowsPerPage) {
        setCurrentPage(1);
        setUsers(userCompanyFilterStore?.slice(0, rowsPerPage));
      } else {
        setUsers(
          userCompanyFilterStore?.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    }
  }, [ userCompanyFilterStore]);

  useEffect(() => {
    if(currentUserRole==="ADMIN"){
      setRolesOptions(
        rolesStore.roles.map((role)=>{
          return{
            value: role.id,
            label: role?.name,
            color: "#00B8D9",
            isFixed: true,
          }
        })
      )
    } else {
      let roleFilter = rolesStore.roles.filter(a=>a.name != "ADMIN")
      setRolesOptions(
        roleFilter.map((role)=>{
          return{
            value: role.id,
            label: role?.name,
            color: "#00B8D9",
            isFixed: true,
          }
        })
      )
    }
  }, [rolesStore]);

  useEffect(() => {
    if(currentUserRole==="ADMIN"){
      setOrganizationsOptions(
        organizationStore.dataOrganization?.map((data)=>{
          return{
            value: data?.id,
            label: data?.name,
            color: "#00B8D9",
            isFixed: true,
          }
        }))
    } else {
      let organizationFilter = organizationStore.dataOrganization.filter(a=>currentUserCompanyId.includes(a?.id))
      setOrganizationsOptions(
        organizationFilter.map((data)=>{
          return{
            value: data?.id,
            label: data?.name,
            color: "#00B8D9",
            isFixed: true,
          }
        }))
    }
  }, [organizationStore]);

  const handleFilter = (e) => {
    setSearchValue(e.target.value);
    if(currentUserRole==="ADMIN"){
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
   }else {
    if (e.target.value !== "") {
      setUsers(
        userCompanyFilterStore
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
        userCompanyFilterStore.slice(
          currentPage * rowsPerPage - rowsPerPage,
          currentPage * rowsPerPage
        )
      );
    }
   }
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    if(currentUserRole==="ADMIN"){
      setUsers(
        usersStore.data.slice(
          (page.selected + 1) * rowsPerPage - rowsPerPage,
          (page.selected + 1) * rowsPerPage
        )
      );
    }
    else{
      setUsers(
        userCompanyFilterStore?.slice(
          (page.selected + 1) * rowsPerPage - rowsPerPage,
          (page.selected + 1) * rowsPerPage
        )
      );
    }
    
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    if(currentUserRole==="ADMIN"){
      setUsers(
        usersStore.data.slice(
          currentPage * parseInt(e.target.value) - parseInt(e.target.value),
          currentPage * parseInt(e.target.value)
        )
      );
    }
    else{
      setUsers(
        userCompanyFilterStore.slice(
          currentPage * parseInt(e.target.value) - parseInt(e.target.value),
          currentPage * parseInt(e.target.value)
        )
      );
    }
    
  };

  const onSort = (column, direction) => {
    if(currentUserRole==="ADMIN"){
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
    }
    else{
      setUsers(
        userCompanyFilterStore
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
    }
  };

  const CustomPagination = () => {
    let count=0;
    if(currentUserRole==="ADMIN"){
       count = Number((usersStore?.data?.length / rowsPerPage).toFixed(1));
    }
    else{
       count = Number((userCompanyFilterStore?.length / rowsPerPage).toFixed(1));
    }
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

  const onAddUserButtonPressed = () => {
    setEditingProfileData({
      name: "",
      password: "",
      email: "",
      company: "",
      roles: "",
      id: "",
    });
    setShowAddUserModal(true);
  };
  //*****************************************************************************
  const onAddUserModalButtonPressed = () => {
    setLoading(true);
    if (
      usersStore.data?.some(
        (c) =>
          c.email === editingProfileData.email && c.id !== editingProfileData.id
      )
    ) {
      enqueueSnackbar(
        "There is a user with this email.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
      setLoading(false);
      return;
    }

    if (editingProfileData.password && editingProfileData.password <= 6) {
      enqueueSnackbar("Enter a password longer than 6 characters.", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return;
    }
    if (!editingProfileData.id) {
      const newUserData = {
        name: editingProfileData.name,
        email: editingProfileData.email,
        password: editingProfileData?.password,
        company: currentUserRole==="ADMIN" ? editingProfileData?.company : currentUserCompanyId,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        createdBy: editingProfileData?.createdBy || authStore.id,
        lastUpdatedTime: new Date().getTime(),
        lastUpdatedBy: authStore.id,
        id: editingProfileData.id,
        roles: editingProfileData?.roles,
        deleted: editingProfileData.deleted || null,
        deletedAt: editingProfileData.deletedAt || null,
        deletedBy: editingProfileData.deletedBy || null,
      };
      dispatch(addUser(newUserData.createdBy, newUserData))
        .then(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("User added successfully.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          setShowAddUserModal(false);
          enqueueSnackbar("An error occurred while adding the user.", {
            variant: "error",
            preventDuplicate: true,
          });
        });
    } else {

      const newUserData = {
        id: editingProfileData.id,
        name: editingProfileData.name,
        password: editingProfileData?.password,
        company: editingProfileData.company?.value || editingProfileData.company,
        email: editingProfileData.email,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        createdBy: editingProfileData?.createdBy || authStore.id,
        roles: editingProfileData?.roles?.value || editingProfileData?.roles

      };
      dispatch(updateUser(newUserData.createdBy, newUserData))
        .then(() => {
          enqueueSnackbar("User Updated", {
            variant: "success",
          });
          setLoading(false);
          setEditingProfileData(null);
          setShowAddUserModal(false);
          if (!editingProfileData.id) setEditingProfileData(null);
        })
        .catch(() => {
          enqueueSnackbar(
            `A server connection error occurred while updating the ${newUserData.name} user, please try again.`,
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
            : "Add New User"}
        </ModalHeader>
        <ModalBody>
        <div className="mb-2">
            <Label className="form-label" for="permissions-select">
            Company Name: 
            </Label>
            <Select
              id="permissions-select"
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={organizationsOptions}
              className="react-select"
              classNamePrefix="Select"
              defaultValue={currentUserRole==="ADMIN" ? editingProfileData?.company : organizationsOptions} 
              onChange={(value) => {
                setEditingProfileData({
                  ...editingProfileData,
                  company: value.value,
                });
              }}
            />
          </div>
          <div className="mb-2">
            <Label className="form-label" for="user-name">
              User Name:
            </Label>
            <Input
              type="text"
              id="user-name"
              placeholder="User Name"
              value={editingProfileData?.name || ""}
              onChange={(e) =>
                setEditingProfileData({
                  ...editingProfileData,
                  name: e.target.value,
                })
              }
            />
          </div>
          {(!editingProfileData?.id || editingProfileData?.id) && (
            <Fragment>
              <div className="mb-2">
                <Label className="form-label" for="email-address">
                  Email:
                </Label>
                <Input
                  type="text"
                  id="email-address"
                  placeholder="Email"
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
                  Password:
                </Label>
                <InputPasswordToggle
                  id="password"
                  className="input-group-merge mb-2"
                  htmlFor="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setEditingProfileData({
                      ...editingProfileData,
                      password: e.target.value,
                    })
                  }
                />
                <Label className="pt-1">
                   Password must be more than 6 characters.
                </Label>
              </div>
            </Fragment>
          )}
          <div className="mb-2">
            <Label className="form-label" for="permissions-select">
              User Role: 
            </Label>
            <Select
              id="permissions-select"
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={rolesOptions}
              className="react-select"
              classNamePrefix="Select"
              defaultValue={editingProfileData?.roles
              } 
              onChange={(value) => {
                setEditingProfileData({
                  ...editingProfileData,
                  roles: value.value,
                });
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
          disabled={currentUserRole==="ADMIN" ?
            !(editingProfileData?.roles&&editingProfileData?.password&&editingProfileData?.email&&editingProfileData?.name&&editingProfileData?.company)
            :
            !(editingProfileData?.roles&&editingProfileData?.password&&editingProfileData?.email&&editingProfileData?.name)}
          color="primary" onClick={onAddUserModalButtonPressed}>
            {loading
              ? "Loading.."
              : !editingProfileData?.id
              ? "Create"
              : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleDeleteUser = (selectedUser) => {
    return Swal.fire({
      title: `Are you sure you want to delete the ${selectedUser.name} user?`,
      text: "Deleted users can be reactivated. But all permissions will be removed!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
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
    const selectedUserRoles = selectedUser.role
    const selectedUserCompany = selectedUser.company
   
    setEditingProfileData({
      ...selectedUser,
      roles: {
        label:selectedUserRoles.name,
        value:selectedUserRoles.id
      },
      company: {
        label:selectedUserCompany.name,
        value:selectedUserCompany.id
      },
    });
  };

  return (
    <div style={{ marginTop: "2%" }}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">User Management</CardTitle>
          <Button
            className="ml-2"
            color="primary"
            onClick={onAddUserButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Add User</span>
          </Button>
        </CardHeader>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6" md="2">
            <div className="d-flex align-items-center">
              <Label for="sort-select">Show</Label>
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
              Filter by Name
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
              placeholder="Filter"
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
