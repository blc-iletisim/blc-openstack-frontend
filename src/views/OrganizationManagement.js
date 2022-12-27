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
import moment from "moment";
import { Edit, HowToReg } from "@mui/icons-material";
import { getOrganisations } from "@src/redux/actions/organisations";
import { useSnackbar } from "notistack";
import { default as SweetAlert } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import InputPasswordToggle from "@components/input-password-toggle";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  addOrganization,
  updateOrganization,
  deleteOrganization,
} from "@src/redux/actions/organisations";
const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();

const OrganizationManagement = () => {
  const serverSideColumns = [
    {
      name: "Organization",
      selector: "name",
      sortable: true,
      minWidth: "350px",
    },
    {
      name: "Created Date Time",
      selector: "createdDateTime",
      sortable: false,
      minWidth: "350px",
      cell: (row) => (
        <span>
          {row.createdDateTime
            ? moment(row.createdDateTime).format("DD.MM.YYYY HH:mm:ss")
            : "-"
          

            //row.createdDateTime
            //moment(row.createdDateTime).format("DD.MM.YYYY HH:mm:ss")
            //row.users.name?.toUpperCase() || "Yok"
          }
        </span>
      ),
    },
    {
      name: "Updated Date Time",
      selector: "updatedDateTime",
      sortable: false,
      minWidth: "350px",
      cell: (row) => (
        <span>
          {row.createdDateTime
            ? moment(row.createdDateTime).format("DD.MM.YYYY HH:mm:ss")
            : "-"
          
         
           // row.updatedDateTime
            //row.users.name?.toUpperCase() || "Yok"
          }
        </span>
      ),
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
                  onClick={() => handleEditOrganization(row)}
                >
                  <Edit size={15} />
                  <span className="align-middle ml-50">Update</span>
                </DropdownItem>
                {row.deleted === true ? (
                  <DropdownItem
                    tag="a"
                    className="w-100"
                    onClick={() => console.log(row)}
                  >
                    <HowToReg size={15} />
                    <span className="align-middle ml-50">Aktif Et</span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag="a"
                    className="w-100"
                    onClick={() => handleDeleteOrganization(row)}
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
  const history = useHistory();
  const authStore = useSelector((state) => state.auth);
  const usersStore = useSelector((state) => state.users);
  const { enqueueSnackbar } = useSnackbar();
  const OrganisationsStore = useSelector((state) => state.organisationReducer);
  console.log("OrganisationsStore",OrganisationsStore);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [organisationName, setOrganisationName] = useState();
  const [personel, setPersonel] = useState({});
  const [email, setEmail] = useState();
  const [showAddOrganisationModal, setShowAddOrganisationModal] =
    useState(false);
  const [editingOrganisationData, setEditingOrganisationData] = useState(null);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    dispatch(getOrganisations());
  }, []);

  const getUserOptions = () => {
    usersStore.data?.forEach((user) =>
      setUserOptions((userOptions) => [
        ...userOptions,
        {
          value: user.id,
          label: user.name,
          color: "#00B8D9",
          isFixed: true,
          email: user.email,
        },
      ])
    );
  };

  useEffect(() => {
    getUserOptions();
  }, [usersStore]);

  useEffect(() => {
    if (OrganisationsStore.dataOrganization) {
      if (OrganisationsStore.length <= currentPage * rowsPerPage) {
        setCurrentPage(1);
        setOrganisations(
          OrganisationsStore.dataOrganization.slice(0, rowsPerPage)
        );
      } else {
        setOrganisations(
          OrganisationsStore.dataOrganization.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    }
  }, [OrganisationsStore.total, OrganisationsStore]);

  const handleFilter = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value !== "") {
      setOrganisations(
        OrganisationsStore.dataOrganization
          .filter((organisation) =>
            organisation.name
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          )
          .slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
      );
    } else {
      setOrganisations(
        OrganisationsStore.dataOrganization.slice(
          currentPage * rowsPerPage - rowsPerPage,
          currentPage * rowsPerPage
        )
      );
    }
  };
  const ExpandableTable = ({ data }) => {
/*     const createdByUser = usersStore?.data?.find(
      (user) => user?.id === data?.createdBy
    );
    const lastUpdatedByUser = usersStore?.data.find(
      (user) => user?.id === data?.lastUpdatedBy
    );
 */
    return (
      <div className="expandable-content p-2">
        <p>
          <h4 className="font-weight-bold">{data?.title}</h4>
        </p>
        <p>
          <span>{data?.content}</span>
        </p>
        <p className="font-small-3 mt-2">
          <span className="font-weight-bold">Organization id:</span>{" "}
          
          {data.id} .
        </p>
        {/* <p className="font-small-3">
          <span className="font-weight-bold">Personel Listesi:</span>{" "}
        
          {users.name?.map(
           ({ id, name,email,  workerNumber }) => `Personel: ${name} Email: ${email} .`
          )} 
        </p> */}
      </div>
    );
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    setOrganisations(
      OrganisationsStore.dataOrganization.slice(
        (page.selected + 1) * rowsPerPage - rowsPerPage,
        (page.selected + 1) * rowsPerPage
      )
    );
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setOrganisations(
      OrganisationsStore.dataOrganization.slice(
        currentPage * parseInt(e.target.value) - parseInt(e.target.value),
        currentPage * parseInt(e.target.value)
      )
    );
  };

  const onSort = (column, direction) => {
    setOrganisations(
      OrganisationsStore.dataOrganization
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
    const count = Number((usersStore.data.length / rowsPerPage).toFixed(1));

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

  const onAddOrganisationButtonPressed = () => {
    setEditingOrganisationData({ id: null });
    //setOrganisationName("");
    //setPersonel("");
    //setEmail("");
    setShowAddOrganisationModal(true);
  };

  const onAddOrganisationModalButtonPressed = () => {
    console.log("editing org data", editingOrganisationData);

    const newOrganisationData = {
      id: editingOrganisationData?.id || null,
      name: editingOrganisationData.name,
      createdTime: new Date().getTime(),
      email: personel.email,
      responsibleUser: personel.id,
   
      //responsibleUserName: personel.name
    };
console.log("newOrganisationData", newOrganisationData)
    dispatch(
      newOrganisationData.id
        ? updateOrganization(newOrganisationData)
        : addOrganization(newOrganisationData)
    )
      .then(() => {
        enqueueSnackbar(
          `${newOrganisationData.name} Successful.`,
          {
            variant: "success",
          }
        );
        setEditingOrganisationData(null);
        setShowAddOrganisationModal(false);
      })
      .catch((e) => {
        enqueueSnackbar(
          `${newOrganisationData.name}  ${
            !newOrganisationData.id
              ? "organizasyonu oluşturulurken"
              : "güncellenirken"
          } bir sunucu bağlantı hatası meydana geldi, lütfen tekrar deneyiniz.`,
          {
            variant: "error",
          }
        );
      });
  };

  const renderOrganisationModal = () => {
    return (
      <Modal
        isOpen={showAddOrganisationModal}
        toggle={() => setShowAddOrganisationModal(!showAddOrganisationModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader
          toggle={() => setShowAddOrganisationModal(!showAddOrganisationModal)}
        >
          {editingOrganisationData?.id
            ? editingOrganisationData?.name
            : "Add New Organization"}
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="organisation-name">
              Organization Name:
            </Label>
            <Input
              type="text"
              id="organisation-name"
              placeholder="Organization Name"
              value={editingOrganisationData?.name}
              onChange={(e) =>
                setEditingOrganisationData((data) => ({
                  ...data,
                  name: e.target.value,
              
                  
                }))
              }
            />
          </div>
         
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onAddOrganisationModalButtonPressed}>
            {!editingOrganisationData?.id ? "Create" : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
/*
 <div className="mb-2">
            <Label className="form-label" for="user-name">
              Sorumlu Personel:
            </Label>

            <Select
              id="personel-select"
              theme={selectThemeColors}
              closeMenuOnSelect={false}
              components={animatedComponents}
              className="react-select"
              classNamePrefix="Seç"
              options={userOptions}
              defaultInputValue={editingOrganisationData?.responsibleUserName}
              onChange={(value) => {
                {
                  console.log("value: ",value);
                  console.log("id: ",value.value);
                  console.log("user", editingOrganisationData.email);
                }
                setPersonel({ id: value.value, email: value.email });
              }}
            />
          </div>

          <div className="mb-2">
            <Label className="form-label" for="personel-email">
              E-mail
            </Label>
            <Input
              type="text"
              id="personel-email"
              placeholder={personel?.email || "Email"}
              value={personel?.email}
            />
          </div>
*/
  const handleDeleteOrganization = (selectedOrganisation) => {
    return Swal.fire({
      title: ` Are you sure you want to delete the ${selectedOrganisation.name} organization?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ml-1",
      },
      buttonsStyling: false,
    }).then(function () {
      dispatch(deleteOrganization(selectedOrganisation.id.trim()))
        .then(() => {
          enqueueSnackbar(
            `${selectedOrganisation.name} deleted.`,
            {
              variant: "success",
            }
          );
        })
        .catch((e) => {
          enqueueSnackbar(
            `Error.`,
            {
              variant: "error",
            }
          );
        });
    });
  };

  const handleEditOrganization = (selectedOrganisation) => {
    //console.log("selected",selectedOrganisation)
    setShowAddOrganisationModal(true);

    setEditingOrganisationData({
      ...selectedOrganisation,
    });
  };

  return (
    <div style={{ marginTop: "2%" }}>
      {" "}
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Organizations</CardTitle>
          <Button
            className="ml-2"
            color="primary"
            onClick={onAddOrganisationButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Add</span>
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
              Filter
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
        </Row>
        
        <DataTable
          noHeader
          pagination
          paginationServer
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={<ExpandableTable />}
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          onSort={onSort}
          paginationComponent={CustomPagination}
          data={organisations}
          noDataComponent={<p className="p-2">Organizasyon Bulunamadı.</p>}
        />
      </Card>
      {renderOrganisationModal()}
    </div>
  );
};

export default memo(OrganizationManagement);
