import React from 'react';

const StoreSelector = ({ filteredStores, onClick }) => {
    return (
        <ul>
            {Object.keys(filteredStores).map((item: any, index: number) => <li key={index} onClick={() => onClick(item)}>{item}</li>)}
        </ul>
    );
}


export default StoreSelector;