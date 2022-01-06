export const reducedStores = (stores: any) => stores.reduce((accumulated, current) => {
    accumulated[current.address.state] = accumulated[current.address.state]
      ? [...accumulated[current.address.state], current]
      : [];
    return accumulated;
  }, {});