import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomTableWithPage = ({
  rows = [],
  columns = [],
  loading = false,
  error = null,
  children,
  filter,
  search,
  onRowClick,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [filter, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const searchColumns = columns.filter((item) => !item.disableSearch);

  const filteredRows = rows.filter((item) => {
    let found = false;
    for (let column of searchColumns) {
      if (
        (item[column.originalId || column.id] + "" || "")
          .toLowerCase()
          .includes((search || "").toLowerCase())
      ) {
        found = true;
        break;
      }
    }
    return found;
  });

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", border: "1px solid black" }}
    >
      {children}
      <TableContainer sx={{ maxHeight: "72vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    background: "#e3e3e3",
                    fontWeight: 600,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  style={{ textAlign: "center", color: "red" }}
                  colSpan={columns.length}
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  style={{ textAlign: "center", color: "red" }}
                  colSpan={columns.length}
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      style={{
                        cursor:
                          row.navigate || onRowClick ? "pointer" : "default",
                      }}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => {
                        if (row.navigate) {
                          navigate(row.navigate);
                        } else if (
                          onRowClick !== null &&
                          typeof onRowClick === "function"
                        ) {
                          onRowClick(row);
                        }
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                            }}
                            key={column.id}
                            align={column.align}
                          >
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
export default CustomTableWithPage;
