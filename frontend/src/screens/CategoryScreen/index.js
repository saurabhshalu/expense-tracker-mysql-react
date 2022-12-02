import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTableWithPage from "../../components/CustomTableWithPage/CustomTableWithPage";
import { Button, Card, IconButton, TextField } from "@mui/material";
import useProtect from "../../hooks/useProtect";
import { getAuth } from "firebase/auth";
const columns = [
  { id: "name", label: "Category Name" },
  { id: "action", label: "Action" },
];
const CategoryScreen = () => {
  useProtect();

  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/category`,
        {
          headers: {
            authorization: `Bearer ${auth?.currentUser?.accessToken}`,
            uid: auth?.currentUser?.uid,
          },
        }
      );
      if (data.success) {
        setCategoryList(
          data.data.map((i) => ({
            id: i.name,
            name: i.name,
            action: (
              <IconButton
                onClick={() => {
                  deleteCategory(i.name);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
          }))
        );
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const deleteCategory = async (name) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/category/${name}`,
        {
          headers: {
            authorization: `Bearer ${auth?.currentUser?.accessToken}`,
            uid: auth?.currentUser?.uid,
          },
        }
      );
      toast.success("Deleted successfully");
      getData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to delete"
      );
    }
  };

  const addCategory = async () => {
    setLoadingAdd(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/category`,
        {
          name: category,
        },
        {
          headers: {
            authorization: `Bearer ${auth?.currentUser?.accessToken}`,
            uid: auth?.currentUser?.uid,
          },
        }
      );
      toast.success("Added successfully");
      setCategory("");
      getData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to Add"
      );
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 20,
        }}
      >
        <TextField
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          label="Category"
          placeholder="Enter new category name"
        />
        <Button
          onClick={addCategory}
          disabled={loadingAdd}
          size="small"
          variant="contained"
        >
          Add
        </Button>
      </Card>
      <CustomTableWithPage
        columns={columns}
        rows={categoryList}
        loading={loading}
      />
    </>
  );
};

export default CategoryScreen;
