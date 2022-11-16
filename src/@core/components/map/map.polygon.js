import React, { useState, useRef, useCallback, useEffect } from "react";
import { Polygon } from "@react-google-maps/api";

function CustomPolygon({
  paths,
  editable,
  draggable,
  onEditingPaths,
  ...props
}) {
  const [path, setPath] = useState(paths);

  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  useEffect(() => {
    if (
      paths.some(
        (p, i) => path?.[i]?.lat === p.lat && path?.[i]?.lng === p.lng
      ) ||
      paths.length !== path.length
    ) {
      setPath(paths);
    }
  }, [paths.length]);

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
      onEditingPaths(nextPath);
    }
  }, [setPath]);

  const onLoad = useCallback(
    (polygon) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonRef.current = null;
  }, []);

  return (
    <Polygon
      editable={editable}
      path={path}
      onLoad={onLoad}
      onUnmount={onUnmount}
      {...props}
    />
  );
}

export default CustomPolygon;
