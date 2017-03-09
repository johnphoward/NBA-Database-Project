import axios from 'axios';

/*
 * Simple class for making requests and caching the resulting data to skip later requests
 */


class DataFetcher {
  constructor() {
    this.cached_requests = {};
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(endpointString, callback) {
    if (endpointString in this.cached_requests) {
        var data = this.cached_requests[endpointString];
        callback(data);
    } else {
        const url_base = 'http://localhost:5000/';
        var url = url_base + endpointString;

        axios.get(url)
         .then(function (response) {
            var data = response['data'];
            this.cached_requests[endpointString] = data;
            callback(data);
         }.bind(this));
    }
  }

}
export default DataFetcher;