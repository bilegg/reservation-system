import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { getUsers } from 'API';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';

const columns = [
    { field: 'username', headerName: 'Username', flex: 1, minWidth: 150 },
    { field: 'role', headerName: 'Role', flex: 1, minWidth: 150 },
];

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [isAddWindowOpen, setIsAddWindowOpen] = useState(false);
    const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState('');

    const handleAddWindow = () => {
        setIsAddWindowOpen(!isAddWindowOpen);
    };

    const handleDeletePrompt = () => {
        setIsDeletePromptOpen(!isDeletePromptOpen);
    };

    const refreshData = () => {
        getUsers().then((response) => {
            console.log(response);
            setUsers(response);
        });
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div id='user-page'>
            <Typography variant='h4' component='h1' sx={{ m: 6 }}>
                User management
            </Typography>
            <Button
                variant='contained'
                sx={{ ml: 6, mb: 6, fontSize: '1.3rem' }}
                onClick={handleAddWindow}
            >
                Add new user
            </Button>
            <div style={{ width: '60%' }}>
                <DataGrid
                    getRowId={(row) => row.user_id}
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    sx={{
                        fontSize: '1.5rem',
                        ml: 6,
                        width: '100%',
                        userSelect: 'none !important',
                    }}
                    autoHeight={true}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector
                    disableDensitySelector
                    onRowDoubleClick={(data) => {
                        setDeleteTarget(data.row.username);
                        handleDeletePrompt();
                    }}
                />
            </div>
            <AddUser
                open={isAddWindowOpen}
                handleClose={handleAddWindow}
                refreshData={refreshData}
            />
            <DeleteUser
                open={isDeletePromptOpen}
                handleClose={handleDeletePrompt}
                deleteTarget={deleteTarget}
                refreshData={refreshData}
            />
        </div>
    );
}
