import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import StudentHeader from '../components/StudentHeader';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
    type: 'text'
  },
  {
    field: 'link',
    headerName: 'Application Link',
    width: 400,
    type: 'link'
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    type: 'text'
  },
  {
    field: 'datecreated',
    headerName: 'Date Created',
    width: 140,
    type: 'text'
  },
  {
    field: 'dateapproved',
    headerName: 'Date Approved',
    width: 140,
    type: 'text'
  },
  {
    field: 'download',
    headerName: 'Download PDF',
    width: 150,
    renderCell: (params) => (
      <IconButton aria-label="download">
        <DownloadIcon sx={{color:"#001D3D"}} />
      </IconButton>
    )
  }
]

const rows = [
  {
    id: 1,
    link: "http://localhost:3000/view-submissions",
    status: "In progress",
    datecreated: "04-01-2023",
    dateapproved: "05-01-2023",
  }
]

export default function ViewSubmissions(props) {

    return (
      <div className="viewsub">
        {<StudentHeader onClick={props.onClick}/>}
        <h1 className="heading">View Clearance Applications</h1>
        <div className="table">
          <DataGrid
            className='data-table'
            sx={{
              fontFamily: 'Poppins',
              fontSize: '16px',
              color:"#001D3D;",
              '& .MuiToolbar-root *': {
                fontFamily: 'Poppins',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: "#001D3D",
                color: "white",
                fontWeight: "bold",
              },
              '& .MuiDataGrid-sortIcon': {
                color: "white",
              },
              '& .MuiDataGrid-menuIconButton': {
                color: "white",
              },
              '.MuiDataGrid-columnSeparator': {
                display: 'none',
              },
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              }
            }}
            pageSizeOptions={[5,10]}
          />
        </div>
      </div>
    )
  }