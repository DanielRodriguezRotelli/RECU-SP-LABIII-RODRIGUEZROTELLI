

const URL = "http://localhost:3000/monstruos";
const $loader = document.getElementById("spinner");

$loader.classList.add("oculto");



export const getMonstruos = () => {
  return new Promise((resolve, reject) => {
    $loader.classList.remove("oculto");
    fetch(URL)
      .then((res) => {
        if (res.ok) {
          resolve(res.json()); 
        } else {
          reject(res); 
        }
      })
      .catch((err) => {
        reject(new Error(`Error: ${err.status} - ${err.statusText}`));
      })
      .finally(() => {
        $loader.classList.add("oculto");
      });
  });
};




export const createMonstruo = (data) => {
  return new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  $loader.classList.remove("oculto");
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
      }
      $loader.classList.add("oculto");
    }
  });
  xhr.open("POST", URL);
  xhr.setRequestHeader("Content-Type", "application/json;chartset=utf-8");
  xhr.send(JSON.stringify(data));
});
}




export const deleteMonstruo = (id) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    $loader.classList.remove("oculto");
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
        }
        $loader.classList.add("oculto");
      }
    });

    xhr.open("DELETE", URL + "/" + id);
    xhr.send();
  });
};


export const updateMonstruo = async (id, monstruo) => {
    $loader.classList.remove("ocultar");
    try {
        let res = await fetch(URL + "/" + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(monstruo)
        });
        if (!res.ok) throw Error(`Error: ${res.status}. ${res.statusText}`);
        const data = await res.json();
        $loader.classList.add("ocultar");
        return data;
    } catch (err) {
        alert(err.message);
    }
 }