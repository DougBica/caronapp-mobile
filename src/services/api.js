import axios from 'axios';

const api = {
  apiUserModule: axios.create({
     baseURL:'http://192.168.0.104:8080',
  }),
  apiCaronapp: axios.create({
    baseURL:'http://192.168.0.104:8090/',
  })
};

export default api;
