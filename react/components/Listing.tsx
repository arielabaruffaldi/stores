/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useState } from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'addressList',
  'addressListItem',
  'addressListItem--selected',
  'addressListFirstItem',
  'addressListItem--dot',
  'addressStoreName',
  'addressStoreAddress',
  'addressStoreAddressGroupA',
  'addressStoreAddressNumber',
  'addressStoreAddressStreet',
  'addressListLink',
  'addressItem',
  'phone'
] as const

const Listing: FC<any> = ({ items, onChangeCenter }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [selected, setSelected] = useState(0)

  const handleChangeCenter = (item: any, zoom: number) => {
    const { latitude, longitude } = item.address.location
    location.hash = "#map";
    onChangeCenter([longitude, latitude], zoom)
    setSelected(item.id)
  }

  return (
    items.length && (
      <ul className={`list ph3 mt0 ${handles.addressList}`}>
        {items.map((item: any, i: number) => {
          let phoneData;
          try {
            phoneData = JSON.parse(item.instructions)
          }
          catch (e) {
            phoneData = ""
          }
          return (
            <li
              key={`key_${i}`}
              className={`pointer mb0 ph3 pv5 ${!i ? handles.addressListFirstItem : ''
                } ${handles.addressListItem} ${!i ? 'bt' : ''
                } bb bl br b--light-gray hover-bg-light-gray
                ${selected && selected === item.id ? handles['addressListItem--selected'] : ''}`}
              onClick={() => {
                handleChangeCenter(item, 12)
              }}
            >
              <span className={handles['addressListItem--dot']}></span>
              <div>
                <span className={`t-mini b ${handles.addressStoreName}`}>
                  {item.name}
                </span>
                <span className={`t-mini ${handles.addressStoreAddress}`}>
                  <span className={handles.addressItem}>
                    {item.address.street} {item.address.number ? ` ${item.address.number},` : ''}
                  </span>
                  <span className={handles.addressItem}>
                    {item.address.city ? `${item.address.city}.` : ''}
                  </span>
                  <span className={handles.addressItem}>
                    {item.address.state ? `${item.address.state}` : ''}
                  </span>
                  {phoneData.cel && <a className={handles.phone} href={`tel:${phoneData.cel}`}>Cel. {phoneData.cel} {phoneData.tel && '/ '}</a>}
                  {phoneData.tel && <a className={handles.phone} href={`tel:${phoneData.tel}`}>Tel. {phoneData.tel}</a>}
                </span>
              </div>
              <br />
            </li>
          )
        })}
      </ul>
    )
  )
}

Listing.propTypes = {
  items: PropTypes.array,
  onChangeCenter: PropTypes.func,
}

export default injectIntl(Listing)
