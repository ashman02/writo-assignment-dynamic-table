# Dynamic Table Management

This project is a dynamic table management system built using modern web technologies. It allows users to add, update, filter, and sort data in a table format with flexible customization. 

## Features

- **Dynamic Table Creation**: 
  - Users can add columns and rows dynamically.
  - Columns can be of two types: `string` or `number`.
  - Cells in each column support arrays, allowing multiple entries per cell (e.g., ["Apple", "Orange"] for a "Fruits" column).
  
- **Update Cell Data**: 
  - Users can edit cell values, including modifying the array entries in `string` columns.
  - For `number` columns, users can directly input numeric values.

- **Filtering**: 
  - Filter rows based on specific column data. 
  - For `string` columns, users can filter rows based on partial or complete text matches.
  - For `number` columns, filters like "equals", "greater than", or "less than" are supported.


## Technologies Used

- **Next.js**: A powerful React framework for server-rendered applications.
- **TypeScript**: Ensuring type safety and enhanced development experience.
- **Tailwind CSS**: Utility-first CSS framework for fast and responsive UI development.
- **React Table Library**: A flexible and lightweight library for handling table operations, integrated for dynamic table features.
