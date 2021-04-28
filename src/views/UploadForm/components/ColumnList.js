import { Checkbox, Icon } from "@material-ui/core";
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";


function ColumnList(props) {
  const {index, columns, uploadFields, onChange} = props;

  const removeColFromSelected = (col) => {
    return uploadFields.filter(selectedCol => selectedCol != col)
  }

  const addColToSelected = (col) => {
    return [...uploadFields, col]
  }

  // console.log(columns, selectedCols);
  
  return (
    <ListGroup>
      {columns.map((colName, index) => (
        <ListGroup.Item key={index} className='d-flex justify-content-between align-items-center p-0 pl-4 pr-3'>
          <span>{colName}</span>
          {uploadFields && <Checkbox
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            checked={uploadFields.includes(colName)}
            onChange={() => {
              if (uploadFields.includes(colName)) {
                onChange(index, removeColFromSelected(colName))
              } else {
                onChange(index,addColToSelected(colName));
              }
            }}
          />}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default ColumnList;