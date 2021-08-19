export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getItem = key => {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error(err);
    throw new Error('Get Item from localstorage ' + key + ' Unsuccessful');
  }
};

export const removeItem = key => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const clear = () => {
  localStorage.clear();
};
