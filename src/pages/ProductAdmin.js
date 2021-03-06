import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import ShowMoreText from "react-show-more-text";
import rupiahFormat from "rupiah-format";

import NavbarAdmin from "../components/NavbarAdmin";
import DeleteData from "../components/modal/DeleteData";

import imgEmpty from "../assets/empty.svg";

import dataProduct from "../fakeData/product";

// Import useQuery and useMutation
import { useQuery, useMutation } from "react-query";

// API config
import { API } from "../config/api";

export default function ProductAdmin() {
  let history = useHistory();
  let api = API();

  const [datas, setDatas] = useState([]);

  // Variabel for delete product data
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Modal Confirm delete data
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetching product data from database
  let { data: products, refetch } = useQuery("productsCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/products", config);
    let fetchfilter = response.data;
    return setDatas(fetchfilter);
    // return response.data;
  });

  //search fitur
  const [search, setSearch] = useState("");
  let filterProduct = datas.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const addProduct = () => {
    history.push("/add-product");
  };

  const handleEdit = (id) => {
    history.push("/edit-product/" + id);
  };

  // For get id product & show modal confirm delete data
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      await api.delete(`/product/${id}`, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <NavbarAdmin />

      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="text-header-category mb-4">List Product</div>
          </Col>

          <div className="text-start ">
            <Button
              onClick={addProduct}
              className="btn-light text-secondary"
              style={{ width: "100px" }}
            >
              Add
            </Button>
          </div>
          <div className="container mb-2">
            <input
              className="fs-5 p-2 text-dark fw-bold rounded w-25 text-center "
              type="text"
              placeholder="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Col xs="12">
            {products?.length != 0 ? (
              <Table
                striped
                hover
                size="lg"
                variant="dark"
                className="w-100 justify-content-center"
              >
                <thead>
                  <tr>
                    <th width="1%" className="text-center">
                      No
                    </th>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Product Desc</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterProduct?.map((item, index) => (
                    <tr>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle">
                        <img
                          src={item.image}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td className="align-middle">{item.name}</td>
                      <td className="align-middle">
                        <ShowMoreText
                          /* Default options */
                          lines={1}
                          more="show"
                          less="hide"
                          className="content-css"
                          anchorClass="my-anchor-css-class"
                          expanded={false}
                          width={280}
                        >
                          {item.desc}
                        </ShowMoreText>
                      </td>
                      <td className="align-middle">
                        {rupiahFormat.convert(item.price)}
                      </td>
                      <td className="align-middle">{item.qty}</td>
                      <td className="align-middle">
                        <Button
                          onClick={() => {
                            handleEdit(item.id);
                          }}
                          className="btn-sm btn-success me-2"
                          style={{ width: "135px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                          className="btn-sm btn-danger"
                          style={{ width: "135px" }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                />
                <div className="mt-3">No data product</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}
