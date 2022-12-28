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
import { Edit, HowToReg } from "@mui/icons-material";

import { useSnackbar } from "notistack";
import { default as SweetAlert } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import { useHistory } from "react-router-dom";

import {
  getRoles,
  deleteRoles,
  addRoles,
  updateRoles,
} from "../redux/actions/roles";
import { getPermissions } from "../redux/actions/permissions";

const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();

const RoleManagement = () => {
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
      name: "Role",
      selector: "name",
      sortable: true,
      maxWidth: "350px",
    },
    {
      name: "Permissions",
      selector: "permissions",
      sortable: true,
      minWidth: "350px",
      cell: (row) => (
        <span>{row.permissions?.map((perm) => perm?.name + "  │ ")}</span>
      ),
    },
    {
      name: "Actions",
      allowOverflow: false,
      maxWidth: "100px",
      cell: (row) => {
        return (
          <div className="d-flex">
            <UncontrolledDropdown>
              <DropdownToggle className="pl-1" tag="span">
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu left>
                <DropdownItem
                  tag="a"
                  className="w-100"
                  onClick={() => handleEditRole(row)}
                >
                  <Edit size={15} />
                  <span className="align-middle ml-50">Edit</span>
                </DropdownItem>
                {row.deleted === true ? (
                  <DropdownItem
                    tag="a"
                    className="w-100"
                    onClick={() => handleUnDeleteRole(row)}
                  >
                    <HowToReg size={15} />
                    <span className="align-middle ml-50">Active</span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag="a"
                    className="w-100"
                    onClick={() => handleDeleteRole(row)}
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

  const PermissionsStore = useSelector((state) => state.permissionsReducer);
  //console.log("permissionsStore: ", PermissionsStore);
  const rolesStore = useSelector((state) => state.rolesReducer);
  //console.log("rolesStore: ", rolesStore);
  const [rolesOptions, setRolesOptions] = useState([]);
  //console.log("rolesOptions: ", rolesOptions);
  const { enqueueSnackbar } = useSnackbar();
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  console.log("permissionsOptions: ", permissionsOptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingRoleData, setEditingRoleData] = useState(null);
  //const [per, setPer] = useState(null);
  console.log("editingRoleData set: ", editingRoleData);

  useEffect(() => {
    dispatch(getPermissions());
    dispatch(getRoles());
    console.log("rolesStore: ", rolesStore);
    if (rolesStore.length > 0) {
      setRolesOptions(rolesStore);
    }
  }, []);

  useEffect(() => {
    if (rolesStore.roles) {
      if (rolesStore.total <= currentPage * rowsPerPage) {
        setCurrentPage(1);
        setRoles(rolesStore.roles?.slice(0, rowsPerPage));
      } else {
        setRoles(
          rolesStore.roles?.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    }
  }, [rolesStore.total, rolesStore]);

  useEffect(() => {
    setPermissionsOptions(
      PermissionsStore?.permissions?.map((permission) => {
        return {
          value: permission?.id,
          label: permission?.name,
          color: "#00B8D9",
          isFixed: true,
        };
      })
    );
  }, [PermissionsStore]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    setRoles(
      rolesStore.roles.slice(
        (page.selected + 1) * rowsPerPage - rowsPerPage,
        (page.selected + 1) * rowsPerPage
      )
    );
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setRoles(
      rolesStore.roles.slice(
        currentPage * parseInt(e.target.value) - parseInt(e.target.value),
        currentPage * parseInt(e.target.value)
      )
    );
  };
  const CustomPagination = () => {
    const count = Number((rolesStore?.roles?.length / rowsPerPage).toFixed(1));

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

  const onAddRoleButtonPressed = () => {
    setEditingRoleData({ id: null });
    setShowAddRoleModal(true);
  };
  const onAddRoleModalButtonPressed = () => {
    const arr = [];
    const r = editingRoleData?.permissions.forEach((s) => {
      if (s?.value) {
        arr.push('"' + s?.value + '"');
      } else {
        arr.push('"' + s + '"');
      }
    });
    setLoading(true);
    if (
      rolesStore.roles?.some(
        (c) => c.name === editingRoleData.name && c.id != editingRoleData.id
      )
    ) {
      enqueueSnackbar("There is a role with this name.", {
        variant: "error",
        preventDuplicate: true,
      });
      setLoading(false);
      return;
    }

    //console.log("EDIT ", editingRoleData.permissions);
    if (!editingRoleData.id) {
      console.log("editingRoleData: ", editingRoleData);
      const newRoleData = {
        name: editingRoleData.name,
        permissions: arr,
        id: editingRoleData.id,
      };
      console.log("newRoleData: ", newRoleData);

      dispatch(addRoles(newRoleData))
        .then(() => {
          setLoading(false);
          setShowAddRoleModal(false);
          enqueueSnackbar("Role added successfully.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          setShowAddRoleModal(false);
          enqueueSnackbar("Role failed added.", {
            variant: "error",
            preventDuplicate: true,
          });
        });
    } else {
      const newRoleData = {
        id: editingRoleData.id,
        name: editingRoleData.name,
        permissions: arr,
        //perr: editingRoleData.role,
      };
      //console.log("NUD", newRoleData);
      console.log("update editingRoleData: ", editingRoleData);
      dispatch(updateRoles(newRoleData))
        .then(() => {
          enqueueSnackbar("Role updated", {
            variant: "success",
          });
          setLoading(false);
          setEditingRoleData(null);
          setShowAddRoleModal(false);
          if (!editingRoleData.value) setEditingRoleData(null);
        })
        .catch(() => {
          enqueueSnackbar(
            `${newRoleData.name} server connection error, please try again.`,
            {
              variant: "error",
            }
          );
          setLoading(false);
        });
    }
  };
  //*******************************************************
  const renderRoleModal = () => {
    return (
      <Modal
        isOpen={showAddRoleModal}
        toggle={() => setShowAddRoleModal(!showAddRoleModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setShowAddRoleModal(!showAddRoleModal)}>
          {editingRoleData?.id ? editingRoleData.name : "Add New Role"}
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="role-name">
              Role Name:
            </Label>
            <Input
              type="text"
              id="role-name"
              placeholder="Role Name"
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
              Permissions:
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
              classNamePrefix="Select"
              defaultValue={editingRoleData?.permissions}
              onChange={(value) => {
                setEditingRoleData({
                  ...editingRoleData,
                  permissions: value,
                });
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={!(editingRoleData?.permissions && editingRoleData?.name)}
            color="primary"
            onClick={onAddRoleModalButtonPressed}
          >
            {loading ? "Loading.." : !editingRoleData?.id ? "Create" : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleDeleteRole = (selectedRole) => {
    console.log("handleDeleteRole selectedRole: ", selectedRole);
    return Swal.fire({
      title: `Are you sure you want to delete the ${selectedRole.name} role?`,
      text: "",
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
        console.log("selectedRole: ", selectedRole);
        dispatch(deleteRoles(selectedRole.id));
      }
    });
  };

  const handleUnDeleteRole = (selectedRole) => {
    // return Swal.fire({
    //   title: `${selectedRole.name} Kullanıcısını Aktif Etmek İstediğinize Emin misiniz?`,
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

  const handleEditRole = (selectedRole) => {
    setShowAddRoleModal(true);
    const selectedRolePermissions = selectedRole.permissions?.map((x) => ({
      value: x.id,
      label: x.name,
    }));
    setEditingRoleData({
      ...selectedRole,
      permissions: selectedRolePermissions,
    });
  };

  return (
    <div style={{ marginTop: "2%" }}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Role Management</CardTitle>
          <Button
            className="ml-2"
            color="primary"
            onClick={onAddRoleButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Add New Role</span>
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
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          //onSort={onSort}
          paginationComponent={CustomPagination}
          data={[...roles]}
          noDataComponent={<p className="p-2">Can not be found.</p>}
        />
      </Card>
      {renderRoleModal()}
    </div>
  );
};

export default memo(RoleManagement);
