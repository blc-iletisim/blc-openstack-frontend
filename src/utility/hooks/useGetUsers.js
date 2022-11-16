import { useDispatch } from "react-redux";
import React from "react";
import { getUsersHttp } from "../../redux/actions/users";

function useGetUsers()
{
    const dispatch = useDispatch()
    React.useEffect(() => {
    console.log("get userss");
    dispatch(getUsersHttp());
    }, []);
}

export default useGetUsers;

    