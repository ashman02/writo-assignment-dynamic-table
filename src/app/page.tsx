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
    if(!columns.length) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      updatedRows[rowIndex][columnName].push(value)
    } else {
      updatedRows[rowIndex][columnName] = value
    }
    setRows(updatedRows)
  }

  const handleItemEdit = (
    rowIndex: number,
    columnName: string,
    itemIndex: number,
    newValue: string
  ) => {
    const updatedRows = [...rows]
    const items = [...updatedRows[rowIndex][columnName]]
    items[itemIndex] = newValue.trim()
    updatedRows[rowIndex][columnName] = items.filter((item) => item !== "")
    setRows(updatedRows)
  }

  const theme = useTheme(getTheme())

  const filterData = (rows: TableNode[]) => {
    if (!searchingField || !search) return rows

    return rows.filter((row) => {
      const value = row[searchingField]
      const column = columns.find((col) => col.name === searchingField)

      if (column?.type === "string") {
        return (
          Array.isArray(value) &&
          value.some((item) =>
            item.toLowerCase().includes(search.toLowerCase())
          )
        )
      } else if (column?.type === "number") {
        const numValue = parseFloat(value)
        const searchNum = parseFloat(search)

        if (isNaN(numValue) || isNaN(searchNum)) return false

        switch (numberFilterType) {
          case "equals":
            return numValue === searchNum
          case "greaterThan":
            return numValue > searchNum
          case "lessThan":
            return numValue < searchNum
          default:
            return false
        }
      }
      return false
    })
  }

  const data = {
    nodes: filterData(rows),
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex space-x-4">
            <input
              type="text"
              placeholder="Column Name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="bg-gray-800 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={columnType}
              onChange={(e) => setColumnType(e.target.value)}
              className="bg-gray-800 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
            </select>
            <button
              onClick={addColumn}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Add Column
            </button>
          </div>

          <button
            onClick={addRow}
            className="mb-8 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 disabled:opacity-50"
            disabled={!columns.length}
          >
            Add Row
          </button>

          <div className="mb-8 flex space-x-4">
            <select
              value={searchingField}
              onChange={(e) => setSearchingField(e.target.value)}
              className="bg-gray-800 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="bg-gray-800 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-gray-800 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <Table key={columns.length} data={data} theme={theme}>
              {(tableList: TableNode[]) => (
                <>
                  <Header>
                    <HeaderRow className="bg-gray-700 text-gray-200">
                      {columns.map((column) => (
                        <HeaderCell key={column.id} className="px-6 py-3">
                          {column.name}
                        </HeaderCell>
                      ))}
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((row, rowIndex) => (
                      <Row
                        key={rowIndex}
                        item={row}
                        className="border-b border-gray-700"
                      >
                        {columns.map((column) => (
                          <Cell key={column.id} className="px-6 py-4">
                            {column.type === "string" ? (
                              <div className="space-y-2">
                                {Array.isArray(row[column.name])
                                  ? row[column.name].map(
                                      (item: string, itemIndex: number) => (
                                        <div
                                          key={itemIndex}
                                          className="flex space-x-2"
                                        >
                                          <input
                                            type="text"
                                            value={item}
                                            onChange={(e) =>
                                              handleItemEdit(
                                                rowIndex,
                                                column.name,
                                                itemIndex,
                                                e.target.value
                                              )
                                            }
                                            className=" text-black px-3 py-1 rounded-md focus:outline-black flex-grow"
                                          />
                                        </div>
                                      )
                                    )
                                  : null}
                                <input
                                  type="text"
                                  placeholder="Press enter to add new item"
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      e.currentTarget.value.trim() !== ""
                                    ) {
                                      handleCellChange(
                                        rowIndex,
                                        column.name,
                                        e.currentTarget.value
                                      )
                                      e.currentTarget.value = ""
                                    }
                                  }}
                                  className="text-black px-3 py-1 rounded-md focus:outline-black w-full"
                                />
                              </div>
                            ) : (
                              <input
                                type="number"
                                step="any"
                                placeholder="Please enter value"
                                value={
                                  row[column.name] !== null
                                    ? row[column.name]
                                    : ""
                                }
                                onChange={(e) =>
                                  handleCellChange(
                                    rowIndex,
                                    column.name,
                                    e.target.value
                                  )
                                }
                                className="text-black px-3 py-1 rounded-md focus:outline-black flex-grow"
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
