import React from 'react';
import { useCssHandles } from 'vtex.css-handles'
// import { EXPERIMENTAL_Select as Select } from 'vtex.styleguide'
import Select from 'react-select';
import './styles.global.css'

const CSS_HANDLES = [
    'storeSelector--container',
    'storeSelector--select',
]


const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'transparent' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.color
                    : isFocused
                        ? '#A3FFCE'
                        : undefined,
            color: isDisabled
                ? 'gray'
                : isSelected
                    ? undefined
                    : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : '#A3FFCE'
                    : undefined,
            },
        };
    },
};

const StoreSelector = ({ filteredStores, onChange }) => {
    const handles = useCssHandles(CSS_HANDLES)
    const options = Object.keys(filteredStores).reduce((accumulated: any, current: any) => {
        return [
            ...accumulated,
            (accumulated = {
                value: current,
                label: current,
            }),
        ];
    }, []);

    return (
        <div className={`${handles['storeSelector--container']}`}>
            <Select
                className={handles['storeSelector--select']}
                classNamePrefix="select"
                placeholder="Elegí tu ubicación"
                name="color"
                options={options}
                styles={colourStyles}
                onChange={values => {
                    onChange(values.value)
                    console.log("values---", values.value)
                }}
            />
        </div>

    );
}

export default StoreSelector;