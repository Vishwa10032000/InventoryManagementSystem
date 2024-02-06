import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
// import fs from 'fs';
import { Link } from 'react-router-dom';
import { CurrencyRupee, Delete, Edit, FmdGood, GridView, ProductionQuantityLimits, TableView } from '@mui/icons-material';

function HomePage() {
    const [inventory, setInventory] = useState([]);
    const [isGridView, setIsGridView] = useState(true); 


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:3031/Inventories')
            .then(res => setInventory(res.data))
            .catch(err => console.log(err));
    };

    // "api-token": "2W_Xez02rxqgYsPGNMHkhiCUaj0amPxILJ6DROjRSYMOXhefkXpsnY8qVJ46C4VwAJE"

    //auth-token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ2aXNod2FzdWJyYW1hbmlhbS50bnh0QGdtYWlsLmNvbSIsImFwaV90b2tlbiI6IjJXX1hlejAycnhxZ1lzUEdOTUhraGlDVWFqMGFtUHhJTEo2RFJPalJTWU1PWGhlZmtYcHNuWThxVko0NkM0VndBSkUifSwiZXhwIjoxNzA3MjE0NDU0fQ.VTTHklFCmH5RKqgE0A4Wn5HLmKNhH566Mu56LCe-qO4"

    // console.log(inventory);

    const handleToggleView = () => {
        setIsGridView(prevState => !prevState);
    };

    const handleEdit = (itemId) => {
        console.log('Editing item with ID:', itemId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this item!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3031/Inventories/${itemId}`)
                    .then(() => {
                        console.log('Deleted item with ID:', itemId);
                        fetchData();
                        Swal.fire(
                            'Deleted!',
                            'Your item has been deleted.',
                            'success'
                        );
                    })
                    .catch(error => console.error('Error deleting item:', error));
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your item is safe :)',
                    'error'
                );
            }
        });
    };

    return (
        <>
            <div className="container" style={{minHeight:"600px"}}>
            <div className='d-flex justify-content-end'>
                    <button className='btn border m-3' onClick={handleToggleView}>
                        {isGridView ? <TableView /> : <GridView/>}
                    </button>
                    <Link to='/ItemFormPage/new'>
                        <button className='btn btn-primary m-3'>
                            + Add Item
                        </button>
                    </Link>
                </div>
                <h1 className='text-center'>Inventory Item List</h1>
                
                {isGridView ? (
                    <div className='row'>
                        {inventory.map((item) => (
                            <div className='col-md-4 my-3' key={item.id}>
                                <div className='p-3 border rounded'>
                                    <h3>{item.ItemName}</h3>
                                    <h6>{item.ItemDescription}</h6>
                                    <h6><CurrencyRupee/> {item.ItemPriceINR} </h6>
                                    <h6><ProductionQuantityLimits/> {item.AvailableQuantity}</h6>
                                    <h6><FmdGood/> {item.Location}</h6>
                                    <div className='d-flex gap-3 justify-content-around'>
                                        <Link className='w-100 btn btn-primary' to={`/ItemFormPage/${item.id}`} onClick={() => handleEdit(item.id)}>
                                        <Edit/> Edit
                                        </Link>
                                        <button className='btn btn-danger w-100' onClick={() => handleDelete(item.id)}>
                                        <Delete/> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table className="table table-bordered table-striped">
    <thead className="thead-dark">
        <tr>
            <th>Item Name</th>
            <th>Item Description</th>
            <th>Item Price</th>
            <th>Available Quantity</th>
            <th>Location</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {inventory.map((item) => (
            <tr key={item.id}>
                <td>{item.ItemName}</td>
                <td>{item.ItemDescription}</td>
                <td>₹ {item.ItemPriceINR}</td>
                <td>{item.AvailableQuantity}</td>
                <td>{item.Location}</td>
                <td className='d-flex gap-2'>
                    <Link className='btn btn-primary btn-sm' to={`/ItemFormPage/${item.id}`} onClick={() => handleEdit(item.id)}>
                       <Edit/> Edit
                    </Link>
                    <button className='btn btn-danger btn-sm ml-2' onClick={() => handleDelete(item.id)}>
                       <Delete/> Delete
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

                )}
            </div>
        </>
    )
}

export default HomePage