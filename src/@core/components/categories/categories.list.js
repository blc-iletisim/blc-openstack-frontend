import { Fragment, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, CardText } from "reactstrap";
import AppCollapse from "@components/app-collapse";
import { SETTING_STATUS } from "@configs/setting_status.enum";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setActiveCategoryUID as setStateActiveCategoryUID } from "@src/redux/actions/categories";
import { QRCodeSVG } from "qrcode.react";

const CategoriesDataTableServerSide = ({
  activeCategoryUID,
  showEditControls,
  updateShowEditControls,
  editedPolygonData,
  saveEditedPolygon,
  onAddPolygonButtonPressed,
  newPolygonData,
  setNewPolygonData,
  addPolygon,
  handleRemovePolygon,
  editPolygon,
  setActiveCategoryUID,
  ...props
}) => {
  console.log("editedPolygonData: ",editedPolygonData)
  const categories = useSelector((state) => state.categories);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const changeActiveCategoryUID = useCallback((categoryUID) => {
    dispatch(setStateActiveCategoryUID(categoryUID));
    setActiveCategoryUID(categoryUID);
  }, []);

  {
    console.log("editedPolygonData:", editedPolygonData);
   
  }

  const data = categories.data.map((category) => {
    return {
      id: category.uid,
      title: category.name,
      content:
        activeCategoryUID === category.uid ? (
          <CardText className="row flex-column justify-content-center mx-1">
            {showEditControls !== SETTING_STATUS.POLYGON_EDIT ? (
              <Button
                color="secondary"
                size="sm"
                onClick={() => {
                  updateShowEditControls(
                    showEditControls === SETTING_STATUS.NONE
                      ? SETTING_STATUS.POLYGON_SELECTING
                      : SETTING_STATUS.NONE
                  );
                  setNewPolygonData(null);
                }}
                style={{ marginBottom: 5 }}
              >
                {showEditControls === SETTING_STATUS.NONE
                  ? "Düzenleme Modu"
                  : "Düzenleme Modunu Kapat"}
              </Button>
            ) : null}
            {showEditControls === SETTING_STATUS.POLYGON_EDIT ? (
              <Fragment>
                <Button
                  color="success"
                  size="sm"
                  onClick={() => editPolygon(editedPolygonData)}
                  style={{ marginBottom: 5 }}
                >
                  Personel Atama/Düzenleme
                </Button>
                <Button
                  color="info"
                  size="sm"
                  onClick={() => addPolygon(editedPolygonData)}
                  style={{ marginBottom: 5 }}
                >
                  {editedPolygonData.name} Kaydet
                </Button>
                <Button color="danger" size="sm" onClick={handleRemovePolygon}>
                  {editedPolygonData.name} Sil
                </Button>
                {editedPolygonData.uid && (
                  <div
                    style={{
                      marginTop: "4%",
                      marginLeft: "10%",
                    }}
                  >
                    <QRCodeSVG
                      value={
                        editedPolygonData.uid + ";" + editedPolygonData.name
                      }
                      style={{
                        marginTop: "2%",
                        marginLeft: "25%",
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  </div>
                )}
              </Fragment>
            ) : showEditControls === SETTING_STATUS.POLYGON_SELECTING ? (
              <Fragment>
                <Button
                  color="primary"
                  size="sm"
                  onClick={onAddPolygonButtonPressed}
                  style={{ marginBottom: 5 }}
                >
                  Poligon Ekle
                </Button>
                <p className="font-small-2 text-center pb-0 mb-0 mt-1">
                  Düzenleme yapmak için harita üzerinden bir poligon seçiniz.
                </p>
              </Fragment>
            ) : showEditControls === SETTING_STATUS.POLYGON_CREATE &&
              newPolygonData !== null ? (
              <>
                <Fragment>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => addPolygon()}
                    style={{ marginBottom: 5 }}
                  >
                    {newPolygonData.name} KAYDET
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={handleRemovePolygon}
                  >
                    {newPolygonData.name} Sil
                  </Button>
                  <p className="font-small-2 text-center pb-0 mb-0 mt-1">
                    {newPolygonData.coordinates.length < 3
                      ? "Yeni poligonunuzu eklemek için harita üzerinden en az 3 nokta işaretleyiniz."
                      : ""}
                  </p>
                </Fragment>
              </>
            ) : null}
          </CardText>
        ) : null,
    };
  });

  return (
    <Fragment>
      <AppCollapse
        data={data}
        accordion
        active={categories.activeCategoryUID}
        onClick={(i) => {
          console.log("onclick");
          if (showEditControls === SETTING_STATUS.NONE) {
            changeActiveCategoryUID(data[i].id);
          } else {
            enqueueSnackbar("Düzenleme modundayken semt değiştiremezsiniz.", {
              variant: "warning",
            });
          }
        }}
      />
    </Fragment>
  );
};

export default CategoriesDataTableServerSide;