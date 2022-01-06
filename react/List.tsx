/* eslint-disable vtex/prefer-early-return */
/* eslint-disable padding-line-between-statements */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { graphql, useLazyQuery } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import ORDER_FORM from './queries/orderForm.gql'
import GET_STORES from './queries/getStores.gql'
import GOOGLE_KEYS from './queries/GetGoogleMapsKey.graphql'
import Listing from './components/Listing'
import Pinpoints from './components/Pinpoints'
import { reducedStores } from './utils/utils'
import StoreSelector from './components/StoreSelector'

const CSS_HANDLES = [
  'container',
  'storesListCol',
  'storesList',
  'storesMapCol',
  'noResults',
  'listingMapContainer',
  'loadAll',
] as const

const StoreList = ({
  orderForm: { called: ofCalled, loading: ofLoading, orderForm: ofData },
  googleMapsKeys,
  filterByTag,
  icon,
  iconWidth,
  iconHeight,
  zoom,
  lat,
  long,
}) => {
  const [selected, setSelected] = useState('')
  const [getStores, { data, loading, called, error }] = useLazyQuery(
    GET_STORES,
    {
      fetchPolicy: 'cache-first',
    }
  )

  const [state, setState] = useState({
    strikes: 0,
    allLoaded: false,
    center: null,
    zoom: zoom || 10,
  })

  const handles = useCssHandles(CSS_HANDLES)
  console.log("long-------", long)
  console.log("lat-------", lat)
  const loadAll = () => {
    setState({
      ...state,
      allLoaded: true,
    })
    getStores({
      variables: {
        latitude: lat,
        longitude: long,
        filterByTag: filterByTag,
      },
    })
  }

  useEffect(() => {
    state.strikes < 4 && loadAll()
  }, [state.strikes])

  useEffect(() => {
    if (
      ofData?.shippingData?.address?.postalCode &&
      ofData?.shippingData?.address?.postalCode?.indexOf('*') === -1
    ) {
      const [longitude, latitude] = ofData?.shippingData.address.geoCoordinates

      getStores({
        variables: {
          latitude,
          longitude,
          filterByTag,
        },
      })
    } else if (!loading && called && error && !state.allLoaded) {
      state.strikes < 4 &&
        setState((prev) => ({
          ...prev,
          strikes: ++prev.strikes,
        }))
    }
  }, [ofData, ofCalled, ofLoading])

  const handleCenter = (center: any) => {
    setState({
      ...state,
      center,
    })
  }

  if (called) {
    if (!loading && !!data && data.getStores.items.length === 0) {
      state.strikes < 4 &&
        setState((prev) => ({
          ...prev,
          strikes: ++prev.strikes,
        }))
    }

    if (!state.center && data?.getStores?.items.length) {
      const [firstResult] = data.getStores.items

      const { latitude, longitude } = firstResult.address.location

      const center = ofData?.shippingData?.address?.geoCoordinates ?? [
        longitude || long,
        latitude || lat,
      ]

      handleCenter(center)
    }

    console.log("data?.getStores---", data?.getStores)

    const stores =
      data?.getStores?.items.sort((a, b) => {
        if (a.distance < b.distance) {
          return -1
        }

        if (a.distance > b.distance) {
          return 1
        }

        return 0
      }) ?? []

    console.log("Stores---", stores)

    const filteredStores = reducedStores(stores)

    console.log("filteredStores", filteredStores)
    console.log("selected----", selected)
    console.log("filteredStores[selected]----", filteredStores[selected])

    console.log(" googleMapsKeys?.logistics?.googleMapsKey", googleMapsKeys?.logistics?.googleMapsKey)

    return (
      <div className={`flex flex-row ${handles.container}`}>
        <div className={`flex-col w-30 ${handles.storesListCol}`}>
          {loading && <Spinner />}
          {!loading && Object.keys(filteredStores).length > 0 && (
            <StoreSelector filteredStores={filteredStores} onClick={(item) => setSelected(item)} />
          )}
          {!loading && selected && filteredStores[selected] && (
            <div className={`overflow-auto h-100 ${handles.storesList}`}>
              <Listing items={filteredStores[selected]} onChangeCenter={handleCenter} />
            </div>
          )}

          {!loading && !!data && stores.length === 0 && (
            <div className={handles.noResults}>
              <h3>
                <FormattedMessage id="store/none-stores" />
              </h3>
            </div>
          )}
        </div>
        <div className={`flex-col w-70 ${handles.storesMapCol}`}>
          {!loading &&
            !!data &&
            stores.length > 0 &&
            googleMapsKeys?.logistics?.googleMapsKey && (
              <>
                {console.log("entro aca----")}
                <Pinpoints
                  apiKey={googleMapsKeys.logistics.googleMapsKey}
                  className={handles.listingMapContainer}
                  items={data.getStores.items}
                  zoom={state.zoom}
                  center={state.center}
                  icon={icon}
                  iconWidth={iconWidth}
                  iconHeight={iconHeight}
                />
              </>
            )}
        </div>
      </div>
    )
  }

  return null
}

export default injectIntl(
  compose(
    graphql(ORDER_FORM, {
      name: 'orderForm',
      options: {
        ssr: false,
      },
    }),
    graphql(GOOGLE_KEYS, {
      name: 'googleMapsKeys',
      options: {
        ssr: false,
      },
    })
  )(StoreList)
)
