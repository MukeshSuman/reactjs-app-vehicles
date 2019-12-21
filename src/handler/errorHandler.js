import { toast } from "react-toastify";

const errorHandler = (error) => {

    let message = "error"

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const response = error.response;

        message = response.data.message || 'unhandle error';
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message = "Network Error"
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        message = error.message;
        console.log('Error', error.message);
      }

      console.log(error.config);

    toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
      });

      return message;

}
export default errorHandler