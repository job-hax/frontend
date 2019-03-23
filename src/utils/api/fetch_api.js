export function fetchApi(url, config) {
  return new Promise(resolve => {
    fetch(url, config)
      .then(response => {
        if (response.ok) {
          response.json()
            .then(json => resolve({ok: true, json}));
        } else {
          response.json()
            .then(json => resolve({ok: false, json}));
        }
      })
      .catch(error => resolve({ok: false, error}));
  });
}

export function postData(url = ``, config, data = {}) {
  return new Promise(resolve => {
    fetch(url, {
      ...config
      ,body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => resolve({ ok: true, json }));
        } else {
          response.json().then(json => resolve({ ok: false, json }));
        }
      })
      .catch(error => {
        console.log({ ok: false, error });
      });
  });
}
