import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function ItemFormPage() {
    const [location, setLocation] = useState([]);
    const [itemData, setItemData] = useState({
        ItemId: '',
        ItemName: '',
        ItemDescription: '',
        ItemPriceINR: '',
        AvailableQuantity: '',
        Location: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.universal-tutorial.com/api/countries', {
                    headers: {
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ2aXNod2FzdWJyYW1hbmlhbS50bnh0QGdtYWlsLmNvbSIsImFwaV90b2tlbiI6IjJXX1hlejAycnhxZ1lzUEdOTUhraGlDVWFqMGFtUHhJTEo2RFJPalJTWU1PWGhlZmtYcHNuWThxVko0NkM0VndBSkUifSwiZXhwIjoxNzA3MjE0NDU0fQ.VTTHklFCmH5RKqgE0A4Wn5HLmKNhH566Mu56LCe-qO4",
                        "Accept": "application/json"
                    }
                });
                setLocation(response.data);
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        fetchData();

        if (id !== 'new') {
            fetchItemData(id);
        }
    }, [id]);

    const fetchItemData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3031/Inventories/${id}`);
            setItemData(response.data);
        } catch (error) {
            console.error('Error fetching item data:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to ${id === 'new' ? 'create a new item' : 'update item data'}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, continue',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                submitFormData();
            }
        });
    };

    const submitFormData = async () => {
        try {
            if (id === 'new') {
                await axios.post('http://localhost:3031/Inventories', itemData);
            } else {
                await axios.put(`http://localhost:3031/Inventories/${id}`, itemData);
            }
            console.log('Item data submitted successfully!');
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error submitting item data:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setItemData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <div className='container' style={{ minHeight: "600px" }}>
                <h1 className='text-center'>{id === 'new' ? 'Create New' : 'Edit'} Inventory Item</h1>

                <form onSubmit={handleSubmit}>
                    <div className='row d-flex gap-4'>
                        <div className='col-md-12'>
                            <label className='form-label'><b>Item Name</b></label>
                            <input type='text' name='ItemName' className='form-control' value={itemData.ItemName} onChange={handleChange} placeholder='Name of the Item' />
                        </div>
                        <div className='col-md-12'>
                            <label className='form-label'><b>Item Description</b></label>
                            <input type='text' name='ItemDescription' className='form-control' value={itemData.ItemDescription} onChange={handleChange} placeholder='Description of the Item' />
                        </div>
                        <div className='col-md-12'>
                            <label className='form-label'><b>Item Price</b></label>
                            <input type='number' name='ItemPriceINR' className='form-control' value={itemData.ItemPriceINR} onChange={handleChange} placeholder='Price of the Item' />
                        </div>
                        <div className='col-md-12'>
                            <label className='form-label'><b>Available Quantity of Item</b></label>
                            <input type='number' name='AvailableQuantity' className='form-control' value={itemData.AvailableQuantity} onChange={handleChange} placeholder='Available quantity of the Item' />
                        </div>
                        <div className='col-md-12'>
                            <label className='form-label'><b>Location</b></label>
                            <select name='Location' className='form-control' value={itemData.Location} onChange={handleChange}>
                                <option>Select Country</option>
                                {location.map((item) => (
                                    <option key={item.country_phone_code} value={item.country_name}>{item.country_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='d-flex justify-content-end gap-2 p-3'>
                            <input type='submit' className='btn btn-primary' value='Submit' />
                            <Link to='/'>
                                <button className='btn btn-danger'>Cancel</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ItemFormPage;
