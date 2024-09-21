"use client"
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table"
import { useTheme } from "@table-library/react-table-library/theme"
import { getTheme } from "@table-library/react-table-library/baseline"
import { useState } from "react"
import { TableNode } from "@table-library/react-table-library/table"


interface columnInterface {
  id: number
  name: string
  type: string
}

const Home = () => {
  const [columns, setColumns] = useState<columnInterface[]>([])
  const [rows, setRows] = useState<TableNode[]>([])
  const [columnName, setColumnName] = useState("")
  const [columnType, setColumnType] = useState("string")
  const [search, setSearch] = useState("")
  const [searchingField, setSearchingField] = useState("")
  const [numberFilterType, setNumberFilterType] = useState("equals")

  const addColumn = () => {
    if (columnName) {
      setColumns([
        ...columns,
        { id: Date.now(), name: columnName, type: columnType },
      ])

      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          [columnName]: columnType === "string" ? [] : 0,
        }))
      )

      setColumnName("")
    }
  }

  const addRow = () => {
    const newRow: any = {}
    columns.forEach((column) => {
      newRow[column.name] = column.type === "string" ? [] : 0 // Default empty values
    })
    setRows([...rows, newRow])
  }

  const handleCellChange = (
    rowIndex: number,
    columnName: string,
    value: string | number
  ) => {
    const updatedRows = [...rows]
    const column = columns.find((column) => column.name === columnName)
    if (column?.type === "string") {
      updatedRows[rowIndex][columnName] = (value as string)
        .split(",")
        .map((item) => item.trim())
    } else {
      updatedRows[rowIndex][columnName] = value
    }
    setRows(updatedRows)
  }

  const theme = useTheme(getTheme())

  const filterData = (rows: TableNode[]) => {
    if (!searchingField || !search) return rows;

    return rows.filter((row) => {
      const value = row[searchingField];
      const column = columns.find(col => col.name === searchingField);

      if (column?.type === "string") {
        // For string columns (arrays)
        return Array.isArray(value) && value.some(item => 
          item.toLowerCase().includes(search.toLowerCase())
        );
      } else if (column?.type === "number") {
        // For number columns
        const numValue = parseFloat(value);
        const searchNum = parseFloat(search);
        
        if (isNaN(numValue) || isNaN(searchNum)) return false;

        switch (numberFilterType) {
          case "equals":
            return numValue === searchNum;
          case "greaterThan":
            return numValue > searchNum;
          case "lessThan":
            return numValue < searchNum;
          default:
            return false;
        }
      }
      return false;
    });
  };

  const data = {
    nodes: filterData(rows)
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
        />
        <select
          value={columnType}
          onChange={(e) => setColumnType(e.target.value)}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button onClick={addColumn}>Add Column</button>
      </div>

      <button onClick={addRow}>Add Row</button>

      <div className="search">
        <select
          value={searchingField}
          onChange={(e) => setSearchingField(e.target.value)}
        >
          <option value="">Select Field</option>
          {columns.map((column) => (
            <option key={column.id} value={column.name}>
              {column.name}
            </option>
          ))}
        </select>

        {searchingField &&
          columns.find((col) => col.name === searchingField)?.type ===
            "number" && (
            <select
              value={numberFilterType}
              onChange={(e) => setNumberFilterType(e.target.value)}
            >
              <option value="equals">=</option>
              <option value="greaterThan">&gt;</option>
              <option value="lessThan">&lt;</option>
            </select>
          )}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
      </div>

      <Table key={columns.length} data={data} theme={theme}>
        {(tableList: TableNode[]) => (
          <>
            <Header>
              <HeaderRow>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.name}</HeaderCell>
                ))}
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((row, rowIndex) => (
                <Row key={rowIndex} item={row}>
                  {columns.map((column) => (
                    <Cell key={column.id}>
                      {column.type === "string" ? (
                        <input
                          className="bg-gray-200"
                          type="text"
                          value={
                            Array.isArray(row[column.name])
                              ? row[column.name].join(", ")
                              : ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              column.name,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <input
                          className="bg-slate-200"
                          type="number"
                          step="any"
                          value={row[column.name]}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              column.name,
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      )}
                    </Cell>
                  ))}
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </>
  )
}

export default Home
