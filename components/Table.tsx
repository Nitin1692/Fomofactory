"use client"; // Add this directive at the top

import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

// Define action types for the reducer
const FETCH_MOVIES = "FETCH_MOVIES";
const TOGGLE_MODAL = "TOGGLE_MODAL";
const SET_STOCK = "SET_STOCK";
const SET_SELECTED_MOVIE = "SET_SELECTED_MOVIE"; // New action type

const initialState = {
    movies: [],
    modalOpen: false,
    newStock: { symbol: "", price: 0 },
    selectedMovie: null, // New state to hold selected movie object
};

// Reducer function to manage state updates
function reducer(state: any, action: any) {
    switch (action.type) {
        case FETCH_MOVIES:
            return { ...state, movies: action.payload };
        case TOGGLE_MODAL:
            return { ...state, modalOpen: !state.modalOpen };
        case SET_STOCK:
            return { ...state, newStock: { ...state.newStock, [action.field]: action.value } };
        case SET_SELECTED_MOVIE: // New case to set selected movie
            return { ...state, selectedMovie: action.payload };
        default:
            return state;
    }
}

const Table: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchData = async () => {
        try {
            await axios.get('http://localhost:3000/api/mongo');
            const response = await axios.get('http://localhost:3000/api/product');
            if (typeof window !== 'undefined') {
                localStorage.setItem('movies', JSON.stringify(response.data.movie));
            }
            dispatch({ type: FETCH_MOVIES, payload: response.data.movie });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: SET_STOCK, field: name, value });
    };

    const handleOpenModal = (movie: any) => {
        dispatch({ type: SET_SELECTED_MOVIE, payload: movie });
        dispatch({ type: TOGGLE_MODAL });
    };
    console.log(state.selectedMovie);

    const handleSubmit = async () => {
        const { _id } = state.selectedMovie;
        const { symbol } = state.newStock;
        try {
            const response = await axios.post('http://localhost:3000/api/add', { _id, symbol });
            console.log('API Response:', response.data);
            // Optionally handle success message or other UI updates
        } catch (error) {
            console.error('Error calling API:', error);
            // Optionally handle error message or other UI updates
        }
        dispatch({ type: TOGGLE_MODAL });
        await fetchData(); // Fetch data and store in local storage after API call
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 border border-gray-200 text-gray-800">
                        <th className="px-4 py-2">Symbol</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Timestamp</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {state.movies.map((movie: any) => (
                        <tr key={movie._id} className="border border-gray-200">
                            <td className="px-4 py-2">{movie.symbol}</td>
                            <td className="px-4 py-2">{movie.price}</td>
                            <td className="px-4 py-2">{movie.timestamp.$timestamp}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleOpenModal(movie)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Change Stock
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {state.modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Change Stock</h2>
                        <input
                            type="text"
                            name="symbol"
                            value={state.newStock.symbol}
                            onChange={handleInputChange}
                            placeholder="Symbol"
                            className="mb-4 p-2 border border-gray-300 rounded w-full bg-gray-800 text-white"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => dispatch({ type: TOGGLE_MODAL })}
                                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
