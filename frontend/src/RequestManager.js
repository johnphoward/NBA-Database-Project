import axios from 'axios';

/*
 * Simple class for making requests and caching the resulting data to skip later requests
 */

class RequestManager {
  constructor() {
    this.cached_requests = {};
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(endpointString, callback, use_cache=true) {
    if (endpointString in this.cached_requests && use_cache) {
        let data = this.cached_requests[endpointString];
        callback(data);
    } else {
        const url_base = 'http://localhost:5000/';
        let url = url_base + endpointString;

        axios.get(url)
         .then(function (response) {
            let data = response['data'];
            this.cached_requests[endpointString] = data;
            callback(data);
         }.bind(this));
    }
  }

  postData(endpointString, data, callback=null, error_callback=null) {
    const url_base = 'http://localhost:5000/';
    let url = url_base + endpointString;
    axios.post(url, data).then(function (response) {
        if (callback !== null) {
            callback(response);
        }
    }).catch(function (error) {
        if (error_callback !== null) {
            error_callback(error);
        }
      }
    );
  };

  deleteItem(endpointString, callback=null) {
    const url_base = 'http://localhost:5000/';
    let url = url_base + endpointString;

    axios.delete(url).then(function (response) {
        if (callback !== null) {
            callback(response);
        }
    });
  }

}
export default RequestManager;