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

// import {
//   useSort,
//   HeaderCellSort,
// } from "@table-library/react-table-library/sort"

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

  const addColumn = () => {
    if (columnName) {
      setColumns([
        ...columns,
        { id: Date.now(), name: columnName, type: columnType },
      ])
      setColumnName("") // Reset the input field
    }
  }

  const addRow = () => {
    const newRow: any = {}
    columns.forEach((column) => {
      newRow[column.name] = column.type === "string" ? "" : 0 // Default empty values
    })
    setRows([...rows, newRow])
  }

  const handleCellChange = (
    rowIndex: number,
    columnName: string,
    value: string | number
  ) => {
    const updatedRows = [...rows]
    updatedRows[rowIndex][columnName] = value
    setRows(updatedRows)
  }

  const theme = useTheme(getTheme())

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

      <Table key={columns.length} data={{ nodes: rows }} theme={theme}>
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
                          value={row[column.name]}
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
