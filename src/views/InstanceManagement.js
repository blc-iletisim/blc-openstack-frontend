import React, { useState, useEffect, memo } from "react";
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
import { Edit, HowToReg } from "@mui/icons-material";
import moment from "moment";
import { useSnackbar } from "notistack";
import { default as SweetAlert } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";
import { getImages } from "../redux/actions/images";
import makeAnimated from "react-select/animated";
import { selectThemeColors } from "@utils";
import {
  getInstances,
  addInstances,
  deleteInstance,
  updateInstance,
} from "../redux/actions/instances";
import { getFlavors } from "../redux/actions/flavors";
import { getCategories } from "../redux/actions/categories";
import { createPem, uploadPem, getPem } from "../redux/actions/pem";
import { FileUploader } from "react-drag-drop-files";

const Swal = withReactContent(SweetAlert);
const animatedComponents = makeAnimated();
const fileTypes = ["PEM"];
const InstanceManagement = () => {
  const serverSideColumns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
      minWidth: "300px",
    },
    {
      name: "Image",
      selector: "image.name",
      sortable: true,
      minWidth: "300px",
    },
    {
      name: "Configuration",
      selector: "flavor.name",
      sortable: true,
      minWidth: "300px",
    },
    {
      name: "Created Data Time",
      selector: "createdDateTime",
      sortable: false,
      minWidth: "250px",
      cell: (row) => (
        <span>
          {row.createdDateTime
            ? moment(row.createdDateTime).format("DD.MM.YYYY HH:mm:ss")
            : "-"}
        </span>
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
                    onClick={() => handleDeleteInstance(row)}
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
  const categoriesStore = useSelector((state) => state.categoriesReducer);
  const instancesStore = useSelector((state) => state.instancesReducer);
  const flavorsStore = useSelector((state) => state.flavorsReducer);
  const pemsStore = useSelector((state) => state.pemReducer);
  const [pemsOptions, setPemsOptions] = useState([]);
  const imagesStore = useSelector((state) => state.imagesReducer);
  const [editingPemData, setEditingPemData] = useState(null);
  const [flavorsOptions, setFlavorsOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingProfileData, setEditingProfileData] = useState(null);
  const [instances, setInstances] = useState([]);
  console.log("instances: ", instances);
  const [showAddPemModal, setShowAddPemModal] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [imagesOptions, setImagesOptions] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const currentUserId = localStorage.getItem("currentUserId");
  let currentUserCompanyId = localStorage.getItem("currentUserCompanyId");
  const [insCompanyFilterStore, setInsCompanyFilterStore] = useState([]);
  const [insUserFilterStore, setInsUserFilterStore] = useState([]);

  useEffect(() => {
    setInsCompanyFilterStore(
      instancesStore?.instances?.filter((a) =>
        currentUserCompanyId.includes(a?.user?.company?.id)
      )
    );
  }, [instancesStore.total, instancesStore]);

  useEffect(() => {
    setInsUserFilterStore(
      instancesStore?.instances?.filter((a) =>
        currentUserId.includes(a?.user?.id)
      )
    );
  }, [instancesStore.total, instancesStore]);

  useEffect(() => {
    if (currentUserRole === "ADMIN") {
      dispatch(getInstances());
      if (instancesStore?.length > 0) {
        setInstances(instancesStore);
      }
    } else if (currentUserRole === "MODERATOR") {
      dispatch(getInstances());

      if (instancesStore?.length > 0) {
        console.log("mod if");
        setInstances(insCompanyFilterStore);
      }
    } else {
      dispatch(getInstances());
      if (instancesStore?.length > 0) {
        setInstances(insUserFilterStore);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(getImages());
    if (imagesStore.length > 0) {
      setImagesOptions(imagesStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getFlavors());
    if (flavorsStore.length > 0) {
      setFlavorsOptions(flavorsStore);
    }
  }, []);

  useEffect(() => {
    dispatch(getPem());
    if (pemsStore.length > 0 && pemsOptions.length === 0) {
      setPemsOptions(pemsStore);
    }
  }, []);
  useEffect(() => {
    dispatch(getCategories());

    if (categoriesStore.length > 0 && categoriesOptions.length === 0) {
      setCategoriesOptions(categoriesStore);
    }
  }, []);

  useEffect(() => {
    setPemsOptions(
      pemsStore.pems?.map((pem) => {
        return {
          value: pem?.id,
          label: pem?.name,
          color: "#00B8D9",
          isFixed: true,
        };
      })
    );
  }, [pemsStore.total, pemsStore]);

  useEffect(() => {
    getFlavorsOptions();
  }, [flavorsStore]);

  const getFlavorsOptions = () => {
    if (flavorsOptions.length === 0) {
      flavorsStore.flavors?.forEach((flavor) =>
        setFlavorsOptions((flavorsOptions) => [
          ...flavorsOptions,
          {
            value: flavor?.id,
            label:
              flavor?.name +
              ": cpu size: " +
              flavor?.cpu_size +
              ", ram size: " +
              flavor?.ram_size +
              ", root disk: " +
              flavor?.root_disk,
            color: "#00B8D9",
            isFixed: true,
          },
        ])
      );
    }
  };

  useEffect(() => {
    if (currentUserRole === "ADMIN") {
      if (instancesStore.instances) {
        if (instancesStore.total <= currentPage * rowsPerPage) {
          setCurrentPage(1);
          setInstances(instancesStore.instances?.slice(0, rowsPerPage));
        } else {
          setInstances(
            instancesStore.instances?.slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
          );
        }
      }
    }
  }, [instancesStore.total, instancesStore]);

  useEffect(() => {
    if (currentUserRole === "MODERATOR") {
      if (instancesStore.instances) {
        if (instancesStore.length <= currentPage * rowsPerPage) {
          setCurrentPage(1);
          setInstances(insCompanyFilterStore?.slice(0, rowsPerPage));
        } else {
          //HATA VERDİĞİ İÇİN KAPALI ÇÖZÜP AÇ!!
          setInstances(
            //buranın yorumunu aç sonra sayfa sayısı ile ilgili bir problem var onu çözüp
            insCompanyFilterStore?.slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
          );
        }
      }
    }
  }, [insCompanyFilterStore]);

  useEffect(() => {
    if (currentUserRole !== "MODERATOR" && currentUserRole !== "ADMIN") {
      if (insUserFilterStore) {
        if (insUserFilterStore.total <= currentPage * rowsPerPage) {
          setCurrentPage(1);
          setInstances(insUserFilterStore?.slice(0, rowsPerPage));
        } else {
          setInstances(
            insUserFilterStore?.slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
          );
        }
      }
    }
  }, [insUserFilterStore]);

  useEffect(() => {
    setCategoriesOptions(
      categoriesStore.categories?.map((category) => {
        return {
          value: category?.id,
          label: category?.name,
          color: "#00B8D9",
          isFixed: true,
        };
      })
    );
  }, [categoriesStore, categoriesStore.length]);

  let formData = new FormData();
  const handleChangePem = (e) => {
    console.log("e: ", e);
    console.log("handleChangePem file:", e?.target?.files[0]);

    if (e) {
      formData.append("file", e);
      setEditingPemData({
        ...editingPemData,
        file: formData,
      });
    }
  };

  /*  if(e.target&&e.target.files[0]){
      formData.append('file',e?.target?.files[0])
      setEditingPemData({ 
        ...editingPemData, 
        file: formData })
    }}; */

  const handleFilter = (e) => {
    setSearchValue(e.target.value);

    if (currentUserRole === "ADMIN") {
      if (e.target.value !== "") {
        setInstances(
          instancesStore.instances
            .filter((instance) =>
              instance.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            .slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
        );
      } else {
        setInstances(
          instancesStore.instances.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    } else if (currentUserRole === "MODERATOR") {
      if (e.target.value !== "") {
        setInstances(
          insCompanyFilterStore
            .filter((instance) =>
              instance.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            .slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
        );
      } else {
        setInstances(
          insCompanyFilterStore.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    } else {
      if (e.target.value !== "") {
        setInstances(
          insUserFilterStore
            .filter((instance) =>
              instance.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            .slice(
              currentPage * rowsPerPage - rowsPerPage,
              currentPage * rowsPerPage
            )
        );
      } else {
        setInstances(
          insUserFilterStore.slice(
            currentPage * rowsPerPage - rowsPerPage,
            currentPage * rowsPerPage
          )
        );
      }
    }
  };
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    if (currentUserRole === "ADMIN") {
      setInstances(
        instancesStore.instances.slice(
          (page.selected + 1) * rowsPerPage - rowsPerPage,
          (page.selected + 1) * rowsPerPage
        )
      );
    } else if (currentUserRole === "MODERATOR") {
      setInstances(
        insCompanyFilterStore.slice(
          (page.selected + 1) * rowsPerPage - rowsPerPage,
          (page.selected + 1) * rowsPerPage
        )
      );
    } else {
      setInstances(
        insUserFilterStore.slice(
          (page.selected + 1) * rowsPerPage - rowsPerPage,
          (page.selected + 1) * rowsPerPage
        )
      );
    }
  };

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    if (currentUserRole === "ADMIN") {
      setInstances(
        instancesStore.instances.slice(
          currentPage * parseInt(e.target.value) - parseInt(e.target.value),
          currentPage * parseInt(e.target.value)
        )
      );
    } else if (currentUserRole === "MODERATOR") {
      setInstances(
        insCompanyFilterStore.slice(
          currentPage * parseInt(e.target.value) - parseInt(e.target.value),
          currentPage * parseInt(e.target.value)
        )
      );
    } else {
      setInstances(
        insUserFilterStore.slice(
          currentPage * parseInt(e.target.value) - parseInt(e.target.value),
          currentPage * parseInt(e.target.value)
        )
      );
    }
  };

  const onSort = (column, direction) => {
    if (currentUserRole === "ADMIN") {
      setInstances(
        instancesStore.instances
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
    } else if (currentUserRole === "MODERATOR") {
      setInstances(
        insCompanyFilterStore
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
    } else {
      setInstances(
        insUserFilterStore
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
    // const count = Number((instancesStore?.instances?.length / rowsPerPage).toFixed(1));
    let count = 0;
    if (currentUserRole === "ADMIN") {
      count = Number(
        (instancesStore?.instances?.length / rowsPerPage).toFixed(1)
      );
    } else if (currentUserRole === "MODERATOR") {
      count = Number((insCompanyFilterStore?.length / rowsPerPage).toFixed(1));
    } else {
      count = Number((insUserFilterStore?.length / rowsPerPage).toFixed(1));
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

  const onAddPemButtonPressed = () => {
    setEditingPemData({
      name: "",
    });
    setShowAddPemModal(true);
  };

  const onAddUserButtonPressed = () => {
    setEditingProfileData({
      name: "",
      id: "",
      flavors: "",
      categories: "",
    });
    setShowAddUserModal(true);
  };
  //*****************************************************************************
  const PemSelections = () => (
    <div className="mb-2">
      <Label className="form-label" for="permissions-select">
        Choose Existing PEM:
      </Label>
      <Select
        id="permissions-select"
        isClearable={false}
        theme={selectThemeColors}
        closeMenuOnSelect={true}
        components={animatedComponents}
        //isMulti
        options={pemsOptions}
        className="react-select"
        classNamePrefix="Select"
        //defaultValue={editingProfileData?.roles || []}
        defaultValue={editingProfileData?.pem ? editingProfileData?.pem : ""}
        onChange={(value) => {
          setEditingProfileData({
            ...editingProfileData,
            pem: value,
          });
        }}
      />
      <div className="mb-2"> </div>
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
    </div>
  );
  const onAddUserModalButtonPressed = () => {
    console.log("editingProfileData: ", editingProfileData);

    console.log("editingProfileData: ", editingProfileData);
    if (!editingProfileData.id) {
      const newDatabaseData = {
        name: editingProfileData?.name,
        categories: editingProfileData?.categories.map(
          (number) => number.value
        ),
        flavors: editingProfileData?.flavors.value,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        lastUpdatedTime: new Date().getTime(),
        id: editingProfileData?.id,
        deletedAt: editingProfileData?.deletedAt || null,
        pem: editingProfileData?.pem?.value,
        images: imagesStore?.images[1]?.id,
      };
      console.log("newDatabaseData2:", newDatabaseData);
      dispatch(addInstances(newDatabaseData))
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
    } else {
      console.log("updateEdingProfileData: ", editingProfileData);

      console.log("update else");

      const newDatabaseData = {
        name: editingProfileData?.name,
        categories: editingProfileData?.categories.map(
          (number) => number.value
        ),
        flavors: editingProfileData?.flavors.value,
        createdTime: editingProfileData?.createdTime || new Date().getTime(),
        lastUpdatedTime: new Date().getTime(),
        id: editingProfileData?.id,
        deletedAt: editingProfileData?.deletedAt || null,
        pem: editingProfileData?.pem?.map((a) => a?.value),
        images: imagesStore?.images[1]?.id,
      };
      console.log("NUD", newDatabaseData);
      dispatch(updateInstance(newDatabaseData))
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
          enqueueSnackbar(`Error, please try again.`, {
            variant: "error",
          });
          setLoading(false);
        });
    }
  };

  const onAddPemModalButtonPressed = () => {
    const newPemData = {
      name: editingPemData?.name,
      file: editingPemData?.file,
    };
    console.log("newPemData: ", newPemData);

    //Name ve file girilip girilmemesine göre filtreleme yapıldı girilmemesi durumunda hata veriyor diğer kısımlara da ekle!!!!
    if (newPemData.name !== null && newPemData.file === undefined) {
      console.log("iff");
      dispatch(createPem(newPemData.name))
        .then(() => {
          setLoading(false);
          //setShowAddUserModal(false);
          setShowAddPemModal(false);
          enqueueSnackbar("Successfull.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          // setShowAddUserModal(false);
          setShowAddPemModal(false);
          enqueueSnackbar("Error.", {
            variant: "error",
            preventDuplicate: true,
          });
        });
    } else if (newPemData.file !== null && newPemData.name === "") {
      dispatch(uploadPem(newPemData.file))
        .then(() => {
          setLoading(false);
          // setShowAddUserModal(false);
          setShowAddPemModal(false);
          enqueueSnackbar("Created.", {
            variant: "success",
            preventDuplicate: true,
          });
        })
        .catch(() => {
          setLoading(false);
          //setShowAddUserModal(false);
          setShowAddPemModal(false);
          enqueueSnackbar("Error.", {
            variant: "error",
            preventDuplicate: true,
          });
        });
    } else {
      enqueueSnackbar(
        "ERROR...Upload an existing PEM file or create a new one with name.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }

    //pem için dispatch kısımı düzelt

    /*  const newPemData = {
        name: editingPemData?.name
      }
      dispatch(createPem(newPemData))
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
      }); */
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
            : "Add a New Instance"}
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Label className="form-label" for="user-name">
              Instance Name:
            </Label>
            <Input
              type="text"
              id="database-name"
              placeholder="Instance Name"
              value={editingProfileData?.name || ""}
              onChange={(e) =>
                setEditingProfileData({
                  ...editingProfileData,
                  name: e.target.value,
                })
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
            <Label className="form-label" for="permissions-select">
              Choose a Database:
            </Label>
            <Select
              id="permissions-select"
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={true}
              components={animatedComponents}
              isMulti
              options={categoriesOptions}
              className="react-select"
              classNamePrefix="Seç"
              defaultValue={editingProfileData?.categories}
              onChange={(value) => {
                {
                  console.log("value:", value);
                }

                setEditingProfileData({
                  ...editingProfileData,
                  // categories: value.map((category) => category.value),
                  categories: value,
                  //role: value.label,
                });
              }}
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
              //defaultValue={editingProfileData?.roles || []}
              //defaultValue={editingProfileData?.role.label || []}
              onChange={(value) => {
                {
                  console.log("value:", value);
                }

                setEditingProfileData({
                  ...editingProfileData,
                  flavors: value,
                  //role: value.label,
                });
              }}
            />
          </div>
          <div>{!editingProfileData?.id ? <PemSelections /> : null}</div>

          {/*  <Button color="info" onClick={console.log()}>
              {loading
                ? "Saving.."
                : !editingProfileData?.id
                ? "Click Here to Click Here to Create a PEM File"
                : "Update"}
            </Button> */}
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
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={
              !(editingProfileData?.name && editingProfileData?.flavors)
            }
            color="primary"
            onClick={onAddUserModalButtonPressed}
          >
            {loading
              ? "Saving.."
              : !editingProfileData?.id
              ? "Create"
              : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderPemModal = () => {
    return (
      <Modal
        isOpen={showAddPemModal}
        toggle={() => setShowAddPemModal(!showAddPemModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setShowAddPemModal(!showAddPemModal)}>
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
              //value={editingPemData?.name || ""}
              defaultValue={editingProfileData?.pemName || ""}
              onChange={
                (e) =>
                  //console.log("pem name: ",e)

                  // !!!!!her harf girişi için dispatch atmaması için doğrudan gönderme değeri alttaki gibi gönder düzeltip:
                  setEditingPemData({
                    ...editingPemData,
                    name: e.target.value,
                  })
                // handlePemName(e.target.value)
              }
            />
          </div>
          {/* Aşağıdaki kod pem upload için çalışıyor veritabanında kontrolüde gerçekleşti diğeri çalışmazsa bunu aktif et*/}
          {/*     <div className="App">
            <h6>To use an existing PEM file please choose to file: </h6>
            <form encType='multipart/form-data'>
              <input type="file" onChange={((e) =>handleChangePem(e))}      
              defaultValue=""
              />
              </form>
            
        {     <img src={file} /> }
  
        </div> */}
          <Label className="form-label" for="user-name">
            To Use an Existing PEM File:
          </Label>
          <FileUploader
            handleChange={handleChangePem}
            name="file"
            types={fileTypes}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            //onClick={onAddUserModalButtonPressed}
            onClick={onAddPemModalButtonPressed}
          >
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

  const ExpandableTable = ({ data }) => {
    if (currentUserRole === "ADMIN") {
      console.log("ExpandableTable data: ", data);
    } else {
      console.log("ExpandableTable data: ", data);
    }

    return (
      <div className="expandable-content p-2">
        <p>
          <h4 className="font-weight-bold">{data?.title}</h4>
        </p>
        <p>
          <span>{data?.content}</span>
        </p>
        <p className="font-small-3">
          <span className="font-weight-bold">Pem Name:</span> {data.pemName}{" "}
        </p>
        <p className="font-small-3">
          <span className="font-weight-bold">Services:</span>{" "}
          {data.categories[0]?.name}{" "}
        </p>
        <p className="font-small-3">
          <span className="font-weight-bold">Ram Size:</span>{" "}
          {data?.flavor.ram_size}
          {" GB "}
        </p>
        <p className="font-small-3">
          <span className="font-weight-bold">Root Disk:</span>{" "}
          {data.flavor.root_disk}{" "}
        </p>
        <p className="font-small-3 mt-2">
          <span className="font-weight-bold">Cpu Size:</span>{" "}
          {data?.flavor?.cpu_size}{" "}
        </p>
      </div>
    );
  };

  const handleDeleteInstance = (selectedInstance) => {
    console.log("delete");
    console.log("selectedInstance", selectedInstance);
    return Swal.fire({
      title: ` Are you sure you want to delete the ${selectedInstance.name} instance?`,
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
        console.log("selectedInstance: ", selectedInstance);
        dispatch(deleteInstance(selectedInstance.id));
      }
    });
  };

  const handleUnDeleteCategory = (selectedInstance) => {
    // return Swal.fire({
    //   title: `${selectedInstance.name} Kullanıcısını Aktif Etmek İstediğinize Emin misiniz?`,
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
    //     selectedInstance.permissions.forEach((p) => {
    //       permissions[p.value] = true;
    //     });
    //     set(ref(database, `users/${selectedInstance.uid}`), {
    //       ...selectedInstance,
    //       permissions,
    //       lastUpdatedTime: new Date().getTime(),
    //       lastUpdatedBy: authStore.uid,
    //       deleted: false,
    //       deletedAt: null,
    //       deletedBy: null,
    //     })
    //       .then(() => {
    //         enqueueSnackbar(
    //           `${selectedInstance.name} kullanıcısı başarıyla aktif edildi.`,
    //           {
    //             variant: "success",
    //           }
    //         );
    //       })
    //       .catch(() =>
    //         enqueueSnackbar(
    //           `${selectedInstance.name} Kullanıcısı aktif edilirken bir sunucu bağlantı hatası meydana geldi, lütfen tekrar deneyiniz.`,
    //           {
    //             variant: "error",
    //           }
    //         )
    //       );
    //   }
    // });
  };

  const handleEditCategory = (selectedInstance) => {
    console.log("selected instance: ", selectedInstance);
    setShowAddUserModal(true);
    const selectedCategories = selectedInstance.categories?.map((x) => ({
      value: x?.id,
      label: x?.name,
    }));
    setEditingProfileData({
      ...selectedInstance,
      categories: selectedCategories,
      flavors: {
        label:
          selectedInstance.flavor.name +
          ":" +
          " cpu size: " +
          selectedInstance.flavor.cpu_size +
          "," +
          " ram size: " +
          selectedInstance.flavor.ram_size +
          "," +
          " root disk: " +
          selectedInstance.flavor.root_disk,
        value: selectedInstance.flavor?.id,
      },
    });
  };

  return (
    <div style={{ marginTop: "2%" }}>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Instance Management</CardTitle>
          <Button
            className="ml-2"
            color="primary"
            onClick={onAddUserButtonPressed}
          >
            <Plus size={15} />
            <span className="align-middle ml-50">Add Instance</span>
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
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={<ExpandableTable />}
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          onSort={onSort}
          paginationComponent={CustomPagination}
          data={[...instances]}
          noDataComponent={<p className="p-2">Bulunamadı.</p>}
        />
      </Card>
      {renderUserModal()}
      {renderPemModal()}
    </div>
  );
};

export default memo(InstanceManagement);
