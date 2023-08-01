import debug from 'debug';
import axios from 'axios';

const axiosInt = () =>
  axios.interceptors.request.use(
    (req) => {
      debug.log(`${req.method.toUpperCase()}: ${req.url}`);
      return req;
    },
    (error) => {
      if (axios.isAxiosError(error)) {
        debug.log(error.response?.data.errText, 'error');
      }
    },
  );

export default axiosInt;
